# GitHub Docs Parser - Part 19

                findTransactionRequired(swapResult.transactions, {
                    from: ammPool.address,
                    to: vaultB.vault.address,
                    op: AmmPool.opcodes.PayoutFromPool,
                    exitCode: 0,
                }),
            )
            if (payoutTx.body === undefined) {
                throw new Error("Payout transaction body is undefined")
            }
            const parsedPayoutTx = loadPayoutFromPool(payoutTx.body.asSlice())
            expect(parsedPayoutTx.receiver).toEqualAddress(vaultA.treasury.walletOwner.address)
            expect(parsedPayoutTx.amount).toEqual(exactAmountOut)
            expect(parsedPayoutTx.otherVault).toEqualAddress(vaultA.vault.address)
            expect(parsedPayoutTx.payloadToForward).toEqualCell(payloadOnSuccess)
        })

        test("Too big amountOut should revert", async () => {
            const blockchain = await Blockchain.create()

            const {ammPool, vaultA, vaultB, initWithLiquidity, swap} =
                await createJettonAmmPool(blockchain)

            const amountA = 1n
            const amountB = 2n

            const depositor = vaultA.treasury.walletOwner

            const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

            const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
            // check that liquidity deposit was successful
            expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

            const builder = new TupleBuilder()
            builder.writeAddress(vaultB.vault.address)
            //builder.writeNumber(randomInt(2, 3));
            builder.writeNumber(2)
            const provider = blockchain.provider(ammPool.address)
            // IDK, how to catch the error in a better way
            // Sandbox just doesn't provide an interface for it
            try {
                await provider.get("neededInToGetX", builder.build())
            } catch (e) {
                if (!(e instanceof GetMethodError)) {
                    throw e
                }
                expect(e.exitCode).toEqual(
                    AmmPool.errors["Pool: Desired amount out is greater than pool reserves"],
                )
            }

            const tooMuchAmountOut = BigInt(randomInt(2, 4))
            const payloadOnFailure = beginCell().storeStringTail("Failure payload").endCell()
            const payloadOnSuccess = beginCell().storeStringTail("Success payload").endCell()

            const swapOutReceiver = randomAddress()

            const moreThanEnoughAmountIn = toNano(1)
            const swapResult = await swap(
                moreThanEnoughAmountIn,
                "vaultA",
                tooMuchAmountOut,
                0n,
                true,
                swapOutReceiver,
                payloadOnSuccess,
                payloadOnFailure,
            )
            expect(swapResult.transactions).toHaveTransaction({
                to: ammPool.address,
                from: vaultA.vault.address,
                exitCode: AmmPool.errors["Pool: Desired amount out is greater than pool reserves"],
            })
            const refundTx = flattenTransaction(
                findTransactionRequired(swapResult.transactions, {
                    from: ammPool.address,
                    to: vaultA.vault.address,
                    op: AmmPool.opcodes.PayoutFromPool,
                    exitCode: 0,
                }),
            )
            if (refundTx.body === undefined) {
                throw new Error("Refund transaction body is undefined")
            }
            const parsedRefundTx = loadPayoutFromPool(refundTx.body.asSlice())
            expect(parsedRefundTx.receiver).toEqualAddress(vaultA.treasury.walletOwner.address)
            expect(parsedRefundTx.amount).toEqual(moreThanEnoughAmountIn)
            expect(parsedRefundTx.otherVault).toEqualAddress(vaultB.vault.address)
            expect(parsedRefundTx.payloadToForward).toEqualCell(payloadOnFailure)
        })
    })
})



================================================
FILE: sources/tests/cross-pool-swaps.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/cross-pool-swaps.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Blockchain} from "@ton/sandbox"
import {
    Create,
    createAmmPool,
    createJettonAmmPool,
    createJettonVault,
    createTonVault,
    JettonTreasury,
    TonTreasury,
    VaultInterface,
} from "../utils/environment"

import {beginCell, toNano} from "@ton/core"
import {AmmPool, loadPayoutFromPool} from "../output/DEX_AmmPool"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {findTransactionRequired, flattenTransaction, randomAddress} from "@ton/test-utils"

describe("Cross-pool Swaps", () => {
    const createVaults = <A, B, C>(
        first: Create<VaultInterface<A>>,
        second: Create<VaultInterface<B>>,
        third: Create<VaultInterface<C>>,
    ) => {
        return async (blockchain: Blockchain) => {
            const firstPoolVaultA = await first(blockchain)
            const firstPoolVaultB = await second(blockchain)
            const secondPoolVaultA = firstPoolVaultB
            const secondPoolVaultB = await third(blockchain)
            return {
                firstPoolVaultA,
                firstPoolVaultB,
                secondPoolVaultA,
                secondPoolVaultB,
            }
        }
    }

    const createPoolCombinations: {
        name: string
        createVaults: (blockchain: Blockchain) => Promise<{
            firstPoolVaultA: VaultInterface<unknown>
            firstPoolVaultB: VaultInterface<unknown>
            secondPoolVaultA: VaultInterface<unknown>
            secondPoolVaultB: VaultInterface<unknown>
        }>
    }[] = [
        {
            name: "Jetton->Jetton->Jetton",
            createVaults: createVaults(createJettonVault, createJettonVault, createJettonVault),
        },
        {
            name: "TON->Jetton->Jetton",
            createVaults: createVaults(createTonVault, createJettonVault, createJettonVault),
        },
        {
            name: "TON->Jetton->TON",
            createVaults: createVaults(createTonVault, createJettonVault, createTonVault),
        },
    ]

    test.each(createPoolCombinations)("should perform $name swap", async ({name, createVaults}) => {
        const blockchain = await Blockchain.create()

        const {firstPoolVaultA, firstPoolVaultB, secondPoolVaultA, secondPoolVaultB} =
            await createVaults(blockchain)

        const {
            ammPool: firstAmmPool,
            swap,
            initWithLiquidity: initWithLiquidityFirst,
        } = await createAmmPool(firstPoolVaultA, firstPoolVaultB, blockchain)

        const {ammPool: secondAmmPool, initWithLiquidity: initWithLiquiditySecond} =
            await createAmmPool(secondPoolVaultA, secondPoolVaultB, blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n
        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        // TODO: This is a temporary workaround to get treasury, we must find a better way to get it
        // https://github.com/tact-lang/dex/issues/42
        const castToJettonVault = firstPoolVaultA.treasury as unknown as JettonTreasury
        let depositor
        if (typeof castToJettonVault.walletOwner !== "undefined") {
            depositor = castToJettonVault.walletOwner
        } else {
            depositor = firstPoolVaultA.treasury as unknown as TonTreasury
        }

        const firstLP = await initWithLiquidityFirst(depositor, amountA, amountB)
        expect(await firstLP.depositorLpWallet.getJettonBalance()).toBeGreaterThan(0)

        // Multiply by 2 only to get different values for the second pool
        const secondLP = await initWithLiquiditySecond(depositor, amountA * 2n, amountB * 2n)
        expect(await secondLP.depositorLpWallet.getJettonBalance()).toBeGreaterThan(0)

        const amountToSwap = toNano(0.1)
        const expectedOutFirst = await firstAmmPool.getExpectedOut(
            firstPoolVaultA.vault.address,
            amountToSwap,
        )
        const expectedOutSecond = await secondAmmPool.getExpectedOut(
            firstPoolVaultB.vault.address,
            expectedOutFirst,
        )
        const nextSwapStep = {
            $$type: "SwapStep",
            pool: secondAmmPool.address,
            minAmountOut: expectedOutSecond,
            nextStep: null,
        } as const

        const inVaultOnFirst = firstPoolVaultA.vault.address
        const outVaultOnFirst = firstPoolVaultB.vault.address

        // inVaultB should be the same as outVaultA as it is cross-pool swap
        const inVaultOnSecond = outVaultOnFirst
        expect(
            secondPoolVaultA.vault.address.equals(inVaultOnSecond) ||
                secondPoolVaultB.vault.address.equals(inVaultOnSecond),
        ).toBeTruthy()
        const outVaultOnSecond = secondPoolVaultA.vault.address.equals(inVaultOnSecond)
            ? secondPoolVaultB.vault.address
            : secondPoolVaultA.vault.address

        const outAmountOnFirstBeforeSwap = await firstAmmPool.getReserveForVault(outVaultOnFirst)
        const inAmountOnSecondBeforeSwap = await secondAmmPool.getReserveForVault(inVaultOnSecond)

        const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()
        const payloadOnFailure = beginCell().storeStringTail("Failure").endCell()

        const randomReceiver = randomAddress()
        const swapResult = await swap(
            amountToSwap,
            "vaultA",
            expectedOutFirst,
            0n,
            false,
            null,
            payloadOnSuccess,
            payloadOnFailure,
            nextSwapStep,
            randomReceiver,
        )

        // Successful swap in the first pool
        expect(swapResult.transactions).toHaveTransaction({
            from: firstPoolVaultA.vault.address,
            to: firstAmmPool.address,
            op: AmmPool.opcodes.SwapIn,
            success: true,
        })

        // Successful swap in the second pool
        expect(swapResult.transactions).toHaveTransaction({
            from: firstAmmPool.address,
            to: secondAmmPool.address,
            op: AmmPool.opcodes.SwapIn,
            success: true,
        })

        const outAmountOnFirstAfterSwap = await firstAmmPool.getReserveForVault(outVaultOnFirst)
        const inAmountOnSecondAfterSwap = await secondAmmPool.getReserveForVault(inVaultOnSecond)

        const payoutTx = flattenTransaction(
            findTransactionRequired(swapResult.transactions, {
                from: secondAmmPool.address,
                op: AmmPool.opcodes.PayoutFromPool,
                success: true,
            }),
        )
        expect(payoutTx.to).toEqualAddress(outVaultOnSecond)
        if (payoutTx.body === undefined) {
            throw new Error("Payout transaction body is undefined")
        }
        const parsedPayoutBody = loadPayoutFromPool(payoutTx.body.asSlice())

        if (name !== "TON->Jetton->TON") {
            // Because in this case our `getExpectedOut is incorrect
            expect(parsedPayoutBody.amount).toEqual(expectedOutSecond)
        }

        expect(parsedPayoutBody.receiver).toEqualAddress(randomReceiver)
        expect(parsedPayoutBody.payloadToForward).toEqualCell(payloadOnSuccess)

        // Check the round swap
        if (name === "TON->Jetton->TON") {
            expect(firstAmmPool.address).toEqualAddress(secondAmmPool.address)
            expect(outVaultOnSecond).toEqualAddress(inVaultOnFirst)
        } else {
            // Using this expect statement, we check that the order
            // We don't check that in TON-Jetton-TON as both pools are actually the same
            expect(outAmountOnFirstAfterSwap).toBeLessThan(outAmountOnFirstBeforeSwap)
            expect(inAmountOnSecondAfterSwap).toBeGreaterThan(inAmountOnSecondBeforeSwap)
        }
    })

    test.each(createPoolCombinations)(
        "Testing $name layout. Failure of A->B->C swap on B->C should return tokens B to receiver with payloadOnFailure provided",
        async ({name, createVaults}) => {
            const blockchain = await Blockchain.create()
            const {firstPoolVaultA, firstPoolVaultB, secondPoolVaultA, secondPoolVaultB} =
                await createVaults(blockchain)

            const {
                ammPool: firstAmmPool,
                swap,
                initWithLiquidity: initWithLiquidityFirst,
            } = await createAmmPool(firstPoolVaultA, firstPoolVaultB, blockchain)

            const {ammPool: secondAmmPool, initWithLiquidity: initWithLiquiditySecond} =
                await createAmmPool(secondPoolVaultA, secondPoolVaultB, blockchain)

            // deploy liquidity deposit contract
            const initialRatio = 2n
            const amountA = toNano(1)
            const amountB = amountA * initialRatio // 1 a == 2 b ratio

            // TODO: This is a temporary workaround to get treasury, we must find a better way to get it
            // https://github.com/tact-lang/dex/issues/42
            const castToJettonVault = firstPoolVaultA.treasury as unknown as JettonTreasury
            let depositor
            if (typeof castToJettonVault.walletOwner !== "undefined") {
                depositor = castToJettonVault.walletOwner
            } else {
                depositor = firstPoolVaultA.treasury as unknown as TonTreasury
            }

            const firstLP = await initWithLiquidityFirst(depositor, amountA, amountB)
            expect(await firstLP.depositorLpWallet.getJettonBalance()).toBeGreaterThan(0)

            // Multiply by 2 only to get different values for the second pool
            const secondLP = await initWithLiquiditySecond(depositor, amountA * 2n, amountB * 2n)
            expect(await secondLP.depositorLpWallet.getJettonBalance()).toBeGreaterThan(0)

            const amountToSwap = toNano(0.1)
            const expectedOutFirst = await firstAmmPool.getExpectedOut(
                firstPoolVaultA.vault.address,
                amountToSwap,
            )
            let expectedOutSecond = await secondAmmPool.getExpectedOut(
                firstPoolVaultB.vault.address,
                expectedOutFirst,
            )
            if (name === "TON->Jetton->TON") {
                // Because in this case our `getExpectedOut is incorrect, as we swap in the same pool but in two different directions
                // Amount + 1 will fail because we can't get more coins we put in
                expectedOutSecond = amountToSwap + 1n
            }
            const nextSwapStep = {
                $$type: "SwapStep",
                pool: secondAmmPool.address,
                minAmountOut: expectedOutSecond + 1n, // +1 to make the next step fail
                nextStep: null,
            } as const

            // inVaultB should be the same as outVaultA as it is cross-pool swap
            const inVaultOnSecond = firstPoolVaultB.vault.address
            const outVaultOnSecond = secondPoolVaultA.vault.address.equals(inVaultOnSecond)
                ? secondPoolVaultB.vault.address
                : secondPoolVaultA.vault.address

            const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()
            const payloadOnFailure = beginCell().storeStringTail("Failure").endCell()

            const randomReceiver = randomAddress()
            const swapResult = await swap(
                amountToSwap,
                "vaultA",
                expectedOutFirst, // We will receive exactly this amount in the first pool
                0n,
                false,
                null,
                payloadOnSuccess,
                payloadOnFailure,
                nextSwapStep,
                randomReceiver,
            )

            expect(swapResult.transactions).toHaveTransaction({
                from: firstAmmPool.address,
                to: secondAmmPool.address,
                exitCode: AmmPool.errors["Pool: Amount out is less than desired amount"],
            })

            const payoutTx = flattenTransaction(
                findTransactionRequired(swapResult.transactions, {
                    from: secondAmmPool.address,
                    to: inVaultOnSecond,
                    op: AmmPool.opcodes.PayoutFromPool,
                }),
            )
            if (payoutTx.body === undefined) {
                throw new Error("Payout transaction body is undefined")
            }
            const parsedPayoutBody = loadPayoutFromPool(payoutTx.body.asSlice())

            // So we pay exactly the amount we got in the first pool
            expect(parsedPayoutBody.amount).toEqual(expectedOutFirst)
            expect(parsedPayoutBody.otherVault).toEqualAddress(outVaultOnSecond)
            expect(parsedPayoutBody.receiver).toEqualAddress(randomReceiver)
            expect(parsedPayoutBody.payloadToForward).toEqualCell(payloadOnFailure)
        },
    )
    test("Cross-pool swap next step is ignored if swap type is exactOut", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, initWithLiquidity, swap} =
            await createJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n
        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio
        const depositor = vaultA.treasury.walletOwner
        const _ = await initWithLiquidity(depositor, amountA, amountB)

        const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()
        const payloadOnFailure = beginCell().storeStringTail("Failure").endCell()

        const amountToGet = toNano(0.05)
        // No excesses should be sent as the result of ExactOut swap
        const amountToSend = await ammPool.getNeededInToGetX(vaultB.vault.address, amountToGet)
        const randomCashbackAddress = randomAddress()
        const randomNextPool = randomAddress()
        const nextSwapStep = {
            $$type: "SwapStep",
            pool: randomNextPool,
            // This does not matter anything as we will ignore this step
            minAmountOut: amountToGet,
            nextStep: null,
        } as const
        const swapResult = await swap(
            amountToSend,
            "vaultA",
            amountToGet,
            0n,
            true,
            randomCashbackAddress,
            payloadOnSuccess,
            payloadOnFailure,
            nextSwapStep,
        )
        expect(swapResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: ammPool.address,
            op: AmmPool.opcodes.SwapIn,
            success: true,
            exitCode: 0,
        })

        // The only transaction from pool must be to vaultB, no next step should be executed
        expect(swapResult.transactions).not.toHaveTransaction({
            from: ammPool.address,
            to: addr => addr === undefined || !addr.equals(vaultB.vault.address),
        })

        const payoutRes = flattenTransaction(
            findTransactionRequired(swapResult.transactions, {
                from: ammPool.address,
                to: vaultB.vault.address,
                op: AmmPool.opcodes.PayoutFromPool,
            }),
        )
        if (payoutRes.body === undefined) {
            throw new Error("Payout transaction body is undefined")
        }
        const parsedPayout = loadPayoutFromPool(payoutRes.body.asSlice())
        expect(parsedPayout.amount).toEqual(amountToGet)
        expect(parsedPayout.otherVault).toEqualAddress(vaultA.vault.address)
        expect(parsedPayout.payloadToForward).toEqualCell(payloadOnSuccess)
    })
})



================================================
FILE: sources/tests/factory.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/factory.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {toNano, beginCell} from "@ton/core"
import {Blockchain, SandboxContract, TreasuryContract} from "@ton/sandbox"
import {findTransactionRequired, flattenTransaction, randomAddress} from "@ton/test-utils"
import {
    Factory,
    AmmPoolParams,
    JettonVaultParams,
    storeAmmPoolParams,
    storeJettonVaultParams,
    AmmPoolAddrRequestId,
    LPDepositAddrRequestId,
    loadAddressResponse,
    JettonVaultAddrRequestId,
    LPDepositParams,
    storeLPDepositParams,
    AddressesRequest,
} from "../output/DEX_Factory"
import {AmmPool} from "../output/DEX_AmmPool"
import {LiquidityDepositContract} from "../output/DEX_LiquidityDepositContract"
import {sortAddresses} from "../utils/deployUtils"
import {JettonVault} from "../output/DEX_JettonVault"
import {randomInt} from "crypto"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {randomCoins} from "../utils/testUtils"

describe("Factory", () => {
    let factory: SandboxContract<Factory>
    let deployer: SandboxContract<TreasuryContract>

    beforeAll(async () => {
        const blockchain = await Blockchain.create()
        deployer = await blockchain.treasury("deployer")
        factory = blockchain.openContract(await Factory.fromInit())
        const deployResult = await factory.send(deployer.getSender(), {value: toNano("0.05")}, null)
        expect(deployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })
    })

    test("should calculate correct addresses", async () => {
        // Mock vaults
        const vaultA = randomAddress()
        const vaultB = randomAddress()
        const randomLeftSideAmount = randomCoins()
        const randomRightSideAmount = randomCoins()
        const sortedAddresses = sortAddresses(
            vaultA,
            vaultB,
            BigInt(randomLeftSideAmount),
            BigInt(randomRightSideAmount),
        )

        // Calculate pool address using factory
        const ammPoolParams: AmmPoolParams = {
            $$type: "AmmPoolParams",
            firstVault: vaultA,
            secondVault: vaultB,
        }
        const ammPoolParamsCell = beginCell().store(storeAmmPoolParams(ammPoolParams)).endCell()

        const expectedPoolAddress = (
            await AmmPool.fromInit(sortedAddresses.lower, sortedAddresses.higher, 0n, 0n, 0n, null)
        ).address

        const randomJettonMaster = randomAddress()
        const jettonVaultParams: JettonVaultParams = {
            $$type: "JettonVaultParams",
            jettonMaster: randomJettonMaster,
        }
        const jettonVaultParamsCell = beginCell()
            .store(storeJettonVaultParams(jettonVaultParams))
            .endCell()

        const expectedJettonVaultAddress = (await JettonVault.fromInit(randomJettonMaster, null))
            .address

        const randomLPDepositor = randomAddress()
        const randomContractId = randomInt(0, 281474976710655)
        const lpDepositParams: LPDepositParams = {
            $$type: "LPDepositParams",
            firstVault: vaultA,
            secondVault: vaultB,
            firstAmount: BigInt(randomLeftSideAmount),
            secondAmount: BigInt(randomRightSideAmount),
            depositor: randomLPDepositor,
            contractId: BigInt(randomContractId),
        }

        const expectedLPDepositAddress = (
            await LiquidityDepositContract.fromInit(
                sortedAddresses.lower,
                sortedAddresses.higher,
                sortedAddresses.leftAmount,
                sortedAddresses.rightAmount,
                randomLPDepositor,
                BigInt(randomContractId),
                0n,
                null,
                null,
            )
        ).address

        const lpDepositParamsCell = beginCell()
            .store(storeLPDepositParams(lpDepositParams))
            .endCell()

        const forwardPayload = beginCell().storeStringTail("test").endCell()
        const requestMsg: AddressesRequest = {
            $$type: "AddressesRequest",
            responseAddress: null,
            first: {
                $$type: "Request",
                requestId: AmmPoolAddrRequestId,
                request: ammPoolParamsCell,
            },
            second: {
                $$type: "Request",
                requestId: JettonVaultAddrRequestId,
                request: jettonVaultParamsCell,
            },
            third: {
                $$type: "Request",
                requestId: LPDepositAddrRequestId,
                request: lpDepositParamsCell,
            },
            forwardPayload: forwardPayload,
        }

        const result = await factory.send(deployer.getSender(), {value: toNano("0.05")}, requestMsg)
        // Check that the response contains the correct pool address
        const replyTx = flattenTransaction(
            findTransactionRequired(result.transactions, {
                from: factory.address,
                to: deployer.address,
                op: Factory.opcodes.AddressResponse,
                success: true,
            }),
        )
        if (replyTx.body === undefined) {
            throw new Error("No body in reply transaction")
        }
        const reply = loadAddressResponse(replyTx.body.beginParse())

        expect(reply.first).toEqualAddress(expectedPoolAddress)
        expect(reply.second).toEqualAddress(expectedJettonVaultAddress)
        expect(reply.third).toEqualAddress(expectedLPDepositAddress)
    })
})



================================================
FILE: sources/tests/liquidity-deposit.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/liquidity-deposit.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {toNano} from "@ton/core"
import {Blockchain} from "@ton/sandbox"
import {findTransactionRequired, flattenTransaction, randomAddress} from "@ton/test-utils"
import {AmmPool} from "../output/DEX_AmmPool"
import {LiquidityDepositContract} from "../output/DEX_LiquidityDepositContract"
import {
    createJettonAmmPool,
    createJettonVault,
    createTonJettonAmmPool,
    createTonVault,
} from "../utils/environment"
import {sortAddresses} from "../utils/deployUtils"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {ExtendedLPJettonWallet} from "../wrappers/ExtendedLPJettonWallet"

describe("Liquidity deposit", () => {
    test("Jetton vault should deploy correctly", async () => {
        // deploy vault -> send jetton transfer -> notify vault -> notify liq dep contract
        const blockchain = await Blockchain.create()
        const vaultSetup = await createJettonVault(blockchain)

        const vaultDeployResult = await vaultSetup.deploy()
        expect(vaultDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        const mockDepositLiquidityContract = randomAddress(0)

        const jettonTransferToVault = await vaultSetup.addLiquidity(
            mockDepositLiquidityContract,
            toNano(1),
        )

        expect(jettonTransferToVault.transactions).toHaveTransaction({
            success: true,
        })

        expect(jettonTransferToVault.transactions).toHaveTransaction({
            to: mockDepositLiquidityContract,
        })
    })

    test("should correctly deposit liquidity from both jetton vaults", async () => {
        // create and deploy 2 vaults
        // deploy liquidity deposit contract
        // send jetton transfer to both vaults and check notifications
        // on the 2nd notify on the liquidity deposit contract check ammDeploy
        // check lp token mint
        // check liquidity deposit contract destroy

        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, liquidityDepositSetup, isSwapped} =
            await createJettonAmmPool(blockchain)

        const poolState = (await blockchain.getContract(ammPool.address)).accountState?.type
        expect(poolState === "uninit" || poolState === undefined).toBe(true)

        // deploy liquidity deposit contract
        const amountA = toNano(1)
        const amountB = toNano(2) // 1 a == 2 b ratio

        // this is a bad way of doing it, we need to create new depositor, transfer
        // jettons to it, and use it as a parameter in all vaults methods too
        //
        // depositor should be the same for both vaults jettons transfers
        const depositor = vaultA.treasury.walletOwner

        const liqSetup = await liquidityDepositSetup(depositor, amountA, amountB)

        const liqDepositDeployResult = await liqSetup.deploy()

        expect(liqDepositDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // deploy vaultA
        const vaultADeployResult = await vaultA.deploy()
        // under the hood ?
        expect(vaultADeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // add liquidity to vaultA
        const vaultALiquidityAddResult = await vaultA.addLiquidity(
            liqSetup.liquidityDeposit.address,
            isSwapped ? amountB : amountA,
        )

        expect(vaultALiquidityAddResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: liqSetup.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })
        expect(await liqSetup.liquidityDeposit.getStatus()).toBeGreaterThan(0n) // It could be 1 = 0b01 or 2 = 0b10

        // deploy vaultB
        const vaultBDeployResult = await vaultB.deploy()
        expect(vaultBDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // add liquidity to vaultB
        const vaultBLiquidityAddResult = await vaultB.addLiquidity(
            liqSetup.liquidityDeposit.address,
            isSwapped ? amountA : amountB,
        )

        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: vaultB.vault.address,
            to: liqSetup.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        // liq deposit contract should be destroyed after depositing both parts of liquidity
        const contractState = (await blockchain.getContract(liqSetup.liquidityDeposit.address))
            .accountState?.type
        expect(contractState === "uninit" || contractState === undefined).toBe(true)

        // check amm pool deploy and notification
        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: liqSetup.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
            deploy: true,
        })

        const leftSide = await ammPool.getLeftSide()
        const rightSide = await ammPool.getRightSide()

        // the correct liquidity amount was added
        const sortedWithAmounts = sortAddresses(
            vaultA.vault.address,
            vaultB.vault.address,
            isSwapped ? amountB : amountA,
            isSwapped ? amountA : amountB,
        )
        expect(leftSide).toBe(sortedWithAmounts.leftAmount)
        expect(rightSide).toBe(sortedWithAmounts.rightAmount)

        // check LP token mint
        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: ammPool.address,
            to: liqSetup.depositorLpWallet.address,
            op: AmmPool.opcodes.MintViaJettonTransferInternal,
            success: true,
        })

        const lpBalance = await liqSetup.depositorLpWallet.getJettonBalance()
        // TODO: add off-chain precise balance calculations tests (with sqrt and separate cases)
        expect(lpBalance).toBeGreaterThan(0n)
    })

    test("should revert liquidity deposit with wrong ratio with both jetton vaults", async () => {
        const blockchain = await Blockchain.create()

        const {
            ammPool,
            vaultA,
            vaultB,
            isSwapped,
            sorted,
            liquidityDepositSetup,
            initWithLiquidity,
        } = await createJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n

        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        const depositor = vaultA.treasury.walletOwner

        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        // now we want to try to add liquidity in wrong ratio and check revert
        const amountABadRatio = toNano(1)
        const amountBBadRatio = amountABadRatio * initialRatio * 5n // wrong ratio

        const liqSetupBadRatio = await liquidityDepositSetup(
            depositor,
            amountABadRatio,
            amountBBadRatio,
        )
        const liqDepositDeployResultBadRatio = await liqSetupBadRatio.deploy()
        expect(liqDepositDeployResultBadRatio.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // both vaults are already deployed so we can just add next liquidity
        const vaultALiquidityAddResultBadRatio = await vaultA.addLiquidity(
            liqSetupBadRatio.liquidityDeposit.address,
            isSwapped ? amountBBadRatio : amountABadRatio,
        )

        expect(vaultALiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: liqSetupBadRatio.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        expect(await liqSetupBadRatio.liquidityDeposit.getStatus()).toBeGreaterThan(0n)

        // a lot of stuff happens here
        // 1. jetton transfer to vaultB
        // 2. vaultB sends notification to LPDepositContractBadRatio
        // 3. LPDepositContractBadRatio sends notification to ammPool
        // 4. ammPool receives notification and tries to add liquidity, but since we broke the ratio, it
        //    can add only a part of the liquidity, and the rest of the liquidity is sent back to deployer jetton wallet
        // (4.1 and 4.2 are pool-payout and jetton stuff)
        // 5. More LP jettons are minted
        const vaultBLiquidityAddResultBadRatio = await vaultB.addLiquidity(
            liqSetupBadRatio.liquidityDeposit.address,
            isSwapped ? amountABadRatio : amountBBadRatio,
        )

        // it is tx #2
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: vaultB.vault.address,
            to: liqSetupBadRatio.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        // it is tx #3
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: liqSetupBadRatio.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
        })

        // it is tx #4
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: ammPool.address,
            to: sorted.higher, // TODO: add dynamic test why we revert B here
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })

        // TODO: add tests for precise amounts of jettons sent back to deployer wallet
        // for tx #5

        const lpBalanceAfterSecond = await depositorLpWallet.getJettonBalance()
        // check that the second liquidity deposit was successful
        // and we got more LP tokens
        expect(lpBalanceAfterSecond).toBeGreaterThan(lpBalanceAfterFirstLiq)
    })

    test("should deploy ton vault", async () => {
        const blockchain = await Blockchain.create()

        const vaultSetup = await createTonVault(blockchain)

        const vaultDeployResult = await vaultSetup.deploy()
        expect(vaultDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        const mockDepositLiquidityContract = randomAddress(0)

        const tonTransferToVault = await vaultSetup.addLiquidity(
            mockDepositLiquidityContract,
            toNano(1),
        )

        expect(tonTransferToVault.transactions).toHaveTransaction({
            success: true,
        })

        expect(tonTransferToVault.transactions).toHaveTransaction({
            to: mockDepositLiquidityContract,
        })
    })

    test("should correctly deposit liquidity from jetton vault and ton vault", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, liquidityDepositSetup, isSwapped} =
            await createTonJettonAmmPool(blockchain)

        const poolState = (await blockchain.getContract(ammPool.address)).accountState?.type
        expect(poolState === "uninit" || poolState === undefined).toBe(true)

        // deploy liquidity deposit contract
        const amountA = toNano(1)
        const amountB = toNano(2) // 1 a == 2 b ratio

        const depositor = vaultB.treasury.walletOwner

        const liqSetup = await liquidityDepositSetup(depositor, amountA, amountB)

        const liqDepositDeployResult = await liqSetup.deploy()

        expect(liqDepositDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // deploy vaultA
        const vaultADeployResult = await vaultA.deploy()
        // under the hood ?
        expect(vaultADeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // add liquidity to vaultA
        const vaultALiquidityAddResult = await vaultA.addLiquidity(
            liqSetup.liquidityDeposit.address,
            isSwapped ? amountB : amountA,
        )

        expect(vaultALiquidityAddResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: liqSetup.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })
        expect(await liqSetup.liquidityDeposit.getStatus()).toBeGreaterThan(0n)

        // deploy vaultB
        const vaultBDeployResult = await vaultB.deploy()
        expect(vaultBDeployResult.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // add liquidity to vaultB
        const vaultBLiquidityAddResult = await vaultB.addLiquidity(
            liqSetup.liquidityDeposit.address,
            isSwapped ? amountA : amountB,
        )

        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: vaultB.vault.address,
            to: liqSetup.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        const contractState = (await blockchain.getContract(liqSetup.liquidityDeposit.address))
            .accountState?.type
        expect(contractState === "uninit" || contractState === undefined).toBe(true)

        // check amm pool deploy and notification
        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: liqSetup.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
            deploy: true,
        })

        const leftSide = await ammPool.getLeftSide()
        const rightSide = await ammPool.getRightSide()

        // the correct liquidity amount was added
        const sortedWithAmounts = sortAddresses(
            vaultA.vault.address,
            vaultB.vault.address,
            isSwapped ? amountB : amountA,
            isSwapped ? amountA : amountB,
        )
        expect(leftSide).toBe(sortedWithAmounts.leftAmount)
        expect(rightSide).toBe(sortedWithAmounts.rightAmount)

        // check LP token mint
        expect(vaultBLiquidityAddResult.transactions).toHaveTransaction({
            from: ammPool.address,
            to: liqSetup.depositorLpWallet.address,
            op: AmmPool.opcodes.MintViaJettonTransferInternal,
            success: true,
        })

        const lpBalance = await liqSetup.depositorLpWallet.getJettonBalance()
        // TODO: add off-chain precise balance calculations tests (with sqrt and separate cases)
        expect(lpBalance).toBeGreaterThan(0n)
    })

    test("should revert liquidity deposit with wrong ratio with jetton vault and ton vault", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, isSwapped, liquidityDepositSetup, initWithLiquidity} =
            await createTonJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n

        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        const depositor = vaultB.treasury.walletOwner

        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        // now we want to try to add liquidity in wrong ratio and check revert
        const amountABadRatio = toNano(1)
        const amountBBadRatio = amountABadRatio * initialRatio * 5n // wrong ratio

        const liqSetupBadRatio = await liquidityDepositSetup(
            depositor,
            amountABadRatio,
            amountBBadRatio,
        )
        const liqDepositDeployResultBadRatio = await liqSetupBadRatio.deploy()
        expect(liqDepositDeployResultBadRatio.transactions).toHaveTransaction({
            success: true,
            deploy: true,
        })

        // both vaults are already deployed so we can just add next liquidity
        const vaultALiquidityAddResultBadRatio = await vaultA.addLiquidity(
            liqSetupBadRatio.liquidityDeposit.address,
            isSwapped ? amountBBadRatio : amountABadRatio,
        )

        expect(vaultALiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: liqSetupBadRatio.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        expect(await liqSetupBadRatio.liquidityDeposit.getStatus()).toBeGreaterThan(0n)

        // a lot of stuff happens here
        // 1. ton vault transfer to vaultB
        // 2. vaultB sends notification to LPDepositContractBadRatio
        // 3. LPDepositContractBadRatio sends notification to ammPool
        // 4. ammPool receives notification and tries to add liquidity, but since we broke the ratio, it
        //    can add only a part of the liquidity, and the rest of the liquidity is sent back to deployer jetton wallet
        // (4.1 and 4.2 are pool-payout and jetton stuff)
        // 5. More LP jettons are minted
        const vaultBLiquidityAddResultBadRatio = await vaultB.addLiquidity(
            liqSetupBadRatio.liquidityDeposit.address,
            isSwapped ? amountABadRatio : amountBBadRatio,
        )

        // it is tx #2
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: vaultB.vault.address,
            to: liqSetupBadRatio.liquidityDeposit.address,
            op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
            success: true,
        })

        // it is tx #3
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: liqSetupBadRatio.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
        })

        // it is tx #4
        expect(vaultBLiquidityAddResultBadRatio.transactions).toHaveTransaction({
            from: ammPool.address,
            to: isSwapped ? vaultA.vault.address : vaultB.vault.address, // TODO: add dynamic test why we revert B here
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })

        // TODO: add tests for precise amounts of jettons sent back to deployer wallet
        // for tx #5

        const lpBalanceAfterSecond = await depositorLpWallet.getJettonBalance()
        // check that the second liquidity deposit was successful
        // and we got more LP tokens
        expect(lpBalanceAfterSecond).toBeGreaterThan(lpBalanceAfterFirstLiq)
    })

    test.each([
        {
            name: "Jetton->Jetton",
            createPool: createJettonAmmPool,
        },
        {
            name: "TON->Jetton",
            createPool: createTonJettonAmmPool,
        },
    ])(
        "should correctly deploy liquidity deposit contract from $name vault",
        async ({createPool}) => {
            const blockchain = await Blockchain.create()

            const {vaultB, vaultA, ammPool} = await createPool(blockchain)

            await vaultA.deploy()
            await vaultB.deploy()

            const amountA = toNano(1)
            const amountB = toNano(2)

            const addLiquidityWithDeploy = await vaultA.addLiquidity(
                randomAddress(0),
                amountA,
                null,
                null,
                0n,
                0n,
                {
                    id: 1n,
                    otherVaultAddress: vaultB.vault.address,
                    otherAmount: amountB,
                },
            )

            expect(addLiquidityWithDeploy.transactions).toHaveTransaction({
                from: vaultA.vault.address,
                // to: liquidity deposit contract address,
                op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
                success: true,
                deploy: true,
            })

            const returnFundsTx = flattenTransaction(
                findTransactionRequired(addLiquidityWithDeploy.transactions, {
                    from: vaultA.vault.address,
                    op: LiquidityDepositContract.opcodes.PartHasBeenDeposited,
                    success: true,
                    deploy: true,
                }),
            )

            const liquidityDepositContractAddress = returnFundsTx.to!

            await vaultB.addLiquidity(liquidityDepositContractAddress, amountB)

            const depositor = vaultB.treasury.walletOwner

            const depositorLpWallet = blockchain.openContract(
                await ExtendedLPJettonWallet.fromInit(0n, depositor.address, ammPool.address),
            )

            // check that after second lp deposit, the liquidity was added
            const lpBalance = await depositorLpWallet.getJettonBalance()
            expect(lpBalance).toBeGreaterThan(0n)
        },
    )
})



================================================
FILE: sources/tests/liquidity-math.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/liquidity-math.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {toNano} from "@ton/core"
import {Blockchain} from "@ton/sandbox"
import {createJettonAmmPool, createTonJettonAmmPool} from "../utils/environment"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {calculateLiquidityProvisioning, calculateLiquidityWithdraw} from "../utils/liquidityMath"
import {AmmPool} from "../output/DEX_AmmPool"

describe.each([
    {
        name: "Jetton->Jetton",
        createPool: createJettonAmmPool,
    },
    {
        name: "TON->Jetton",
        createPool: createTonJettonAmmPool,
    },
])("Liquidity math for $name", ({createPool}) => {
    // TODO: add tests for all combinations of pools (with it.each, it should be the same)
    test("should increase pool reserves by correct amount", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = 7n

        const amountARaw = toNano(1)
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()

        const expectedLpAmount = calculateLiquidityProvisioning(
            0n,
            0n,
            amountA,
            amountB,
            0n,
            0n,
            0n,
        )

        // check that first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toEqual(expectedLpAmount.lpTokens)
        // check that pool reserves are correct
        expect(await ammPool.getLeftSide()).toEqual(expectedLpAmount.reserveA)
        expect(await ammPool.getRightSide()).toEqual(expectedLpAmount.reserveB)
    })

    test("should increase pool reserves by correct amount with revert", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = 7n

        const amountARaw = toNano(1)
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        const reserveABefore = await ammPool.getLeftSide()
        const reserveBBefore = await ammPool.getRightSide()

        // change value a little so it won't be equal to reserveA
        const amountABadRatioRaw = toNano(1.1)
        const amountBBadRatioRaw = amountABadRatioRaw * initialRatio * 5n // wrong ratio

        const amountABadRatio = isSwapped ? amountABadRatioRaw : amountBBadRatioRaw
        const amountBBadRatio = isSwapped ? amountBBadRatioRaw : amountABadRatioRaw

        // second add
        await initWithLiquidity(depositor, amountABadRatio, amountBBadRatio)

        const lpBalanceAfterSecondLiq = await depositorLpWallet.getJettonBalance()

        const expectedLpAmountSecondTime = calculateLiquidityProvisioning(
            reserveABefore,
            reserveBBefore,
            amountABadRatio,
            amountBBadRatio,
            0n,
            0n,
            lpBalanceAfterFirstLiq,
        )

        // since we have same depositor
        const lpAmountMinted = lpBalanceAfterSecondLiq - lpBalanceAfterFirstLiq

        // something was minted
        expect(lpAmountMinted).toBeGreaterThan(0n)
        expect(lpAmountMinted).toEqual(expectedLpAmountSecondTime.lpTokens)

        // check that pool reserves are correct
        expect(await ammPool.getLeftSide()).toEqual(expectedLpAmountSecondTime.reserveA)
        expect(await ammPool.getRightSide()).toEqual(expectedLpAmountSecondTime.reserveB)
    })

    test("should follow math across multiple liquidity additions", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        let lpAmount = 0n
        const depositor = vaultB.treasury.walletOwner

        const getReserves = async () => {
            try {
                return {
                    left: await ammPool.getLeftSide(),
                    right: await ammPool.getRightSide(),
                }
            } catch (error) {
                return {
                    left: 0n,
                    right: 0n,
                }
            }
        }

        const random = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min

        for (let index = 0; index < 10; index++) {
            const initialRatio = BigInt(random(1, 10)) // Random ratio between 1 and 10

            const amountARaw = BigInt(random(1, 1000))
            const amountBRaw = amountARaw * initialRatio

            const amountA = isSwapped ? amountARaw : amountBRaw
            const amountB = isSwapped ? amountBRaw : amountARaw

            const {left: reserveABefore, right: reserveBBefore} = await getReserves()

            const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

            const mintedTotal = await depositorLpWallet.getJettonBalance()
            const lpAmountMinted = mintedTotal === lpAmount ? lpAmount : mintedTotal - lpAmount

            const expectedLpAmount = calculateLiquidityProvisioning(
                reserveABefore,
                reserveBBefore,
                amountA,
                amountB,
                0n,
                0n,
                lpAmount,
            )

            // check that first liquidity deposit was successful
            // +-1 nano bound checks
            expect(lpAmountMinted).toBeGreaterThanOrEqual(expectedLpAmount.lpTokens - 1n)
            expect(lpAmountMinted).toBeLessThanOrEqual(expectedLpAmount.lpTokens + 1n)
            // check that pool reserves are correct
            expect(await ammPool.getLeftSide()).toEqual(expectedLpAmount.reserveA)
            expect(await ammPool.getRightSide()).toEqual(expectedLpAmount.reserveB)

            lpAmount = mintedTotal
        }
    })

    test("should withdraw correct liquidity amount", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = 7n

        const amountARaw = toNano(1)
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        const {depositorLpWallet, withdrawLiquidity} = await initWithLiquidity(
            depositor,
            amountA,
            amountB,
        )

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()

        const expectedLpAmount = calculateLiquidityProvisioning(
            0n,
            0n,
            amountA,
            amountB,
            0n,
            0n,
            0n,
        )

        // send burn and check that amount is correct
        await withdrawLiquidity(lpBalanceAfterFirstLiq, 0n, 0n, 0n, null)

        const expectedBurnResult = calculateLiquidityWithdraw(
            expectedLpAmount.reserveA,
            expectedLpAmount.reserveB,
            lpBalanceAfterFirstLiq,
            0n,
            0n,
            lpBalanceAfterFirstLiq,
        )

        expect(await ammPool.getLeftSide()).toEqual(expectedBurnResult.reserveA)
        expect(await ammPool.getRightSide()).toEqual(expectedBurnResult.reserveB)

        const lpBalanceAfterWithdraw = await depositorLpWallet.getJettonBalance()
        expect(lpBalanceAfterWithdraw).toEqual(0n)
    })

    test("should reject withdraw if amount is less then min", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = 7n

        const amountARaw = toNano(1)
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        const {depositorLpWallet, withdrawLiquidity} = await initWithLiquidity(
            depositor,
            amountA,
            amountB,
        )

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()

        const expectedLpAmount = calculateLiquidityProvisioning(
            0n,
            0n,
            amountA,
            amountB,
            0n,
            0n,
            0n,
        )

        const expectedBurnResultSuccess = calculateLiquidityWithdraw(
            expectedLpAmount.reserveA,
            expectedLpAmount.reserveB,
            lpBalanceAfterFirstLiq,
            0n,
            0n,
            lpBalanceAfterFirstLiq,
        )

        // send burn with value more than min, it should fail
        const result = await withdrawLiquidity(
            lpBalanceAfterFirstLiq,
            expectedBurnResultSuccess.amountA + 1n,
            expectedBurnResultSuccess.amountB + 1n,
            0n,
            null,
        )

        const burnResultThatShouldFail = () =>
            calculateLiquidityWithdraw(
                expectedLpAmount.reserveA,
                expectedLpAmount.reserveB,
                lpBalanceAfterFirstLiq,
                expectedBurnResultSuccess.amountA + 1n,
                expectedBurnResultSuccess.amountB + 1n,
                lpBalanceAfterFirstLiq,
            )

        expect(burnResultThatShouldFail).toThrow("Insufficient A token amount")

        expect(result.transactions).toHaveTransaction({
            from: depositorLpWallet.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityWithdrawViaBurnNotification,
            success: false,
            exitCode: AmmPool.errors["Pool: Couldn't pay left more than asked"],
        })

        // same as before
        expect(await ammPool.getLeftSide()).toEqual(expectedLpAmount.reserveA)
        expect(await ammPool.getRightSide()).toEqual(expectedLpAmount.reserveB)

        // bounces
        const lpBalanceAfterWithdraw = await depositorLpWallet.getJettonBalance()
        expect(lpBalanceAfterWithdraw).toEqual(lpBalanceAfterFirstLiq)
    })
})



================================================
FILE: sources/tests/liquidity-payloads.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/liquidity-payloads.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {beginCell, toNano} from "@ton/core"
import {Blockchain} from "@ton/sandbox"
import {findTransactionRequired, flattenTransaction} from "@ton/test-utils"
import {AmmPool, loadMintViaJettonTransferInternal, loadPayoutFromPool} from "../output/DEX_AmmPool"
import {createJettonAmmPool} from "../utils/environment"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"

describe("Liquidity payloads", () => {
    test("should send both successful payloads via LP minting, and send no excesses on first deposit", async () => {
        const blockchain = await Blockchain.create()
        const {
            ammPool,
            vaultA: swappedVaultA,
            vaultB: swappedVaultB,
            liquidityDepositSetup,
            isSwapped,
        } = await createJettonAmmPool(blockchain)

        const {vaultA, vaultB} = isSwapped
            ? {vaultA: swappedVaultB, vaultB: swappedVaultA}
            : {vaultA: swappedVaultA, vaultB: swappedVaultB}

        const poolState = (await blockchain.getContract(ammPool.address)).accountState?.type
        expect(poolState === "uninit" || poolState === undefined).toBe(true)

        const leftPayloadOnSuccess = beginCell().storeStringTail("SuccessLeft").endCell()
        const leftPayloadOnFailure = beginCell().storeStringTail("FailureLeft").endCell()

        const rightPayloadOnSuccess = beginCell().storeStringTail("SuccessRight").endCell()
        const rightPayloadOnFailure = beginCell().storeStringTail("FailureRight").endCell()

        // deploy liquidity deposit contract
        const amountA = toNano(1)
        const amountB = toNano(2) // 1 a == 2 b ratio
        const depositor = vaultA.treasury.walletOwner
        const liqSetup = await liquidityDepositSetup(depositor, amountA, amountB)
        await liqSetup.deploy()
        await vaultA.deploy()

        const _ = await vaultA.addLiquidity(
            liqSetup.liquidityDeposit.address,
            amountA,
            leftPayloadOnSuccess,
            leftPayloadOnFailure,
        )
        await vaultB.deploy()

        const addSecondPartAndMintLP = await vaultB.addLiquidity(
            liqSetup.liquidityDeposit.address,
            amountB,
            rightPayloadOnSuccess,
            rightPayloadOnFailure,
        )

        expect(addSecondPartAndMintLP.transactions).not.toHaveTransaction({
            from: ammPool.address,
            to: vaultA.vault.address,
        })
        expect(addSecondPartAndMintLP.transactions).not.toHaveTransaction({
            from: ammPool.address,
            to: vaultB.vault.address,
        })

        // check LP token mint
        const mintLP = findTransactionRequired(addSecondPartAndMintLP.transactions, {
            from: ammPool.address,
            to: liqSetup.depositorLpWallet.address,
            op: AmmPool.opcodes.MintViaJettonTransferInternal,
            success: true,
        })
        const transferBody = flattenTransaction(mintLP).body?.beginParse()
        const parsedBody = loadMintViaJettonTransferInternal(transferBody!!)
        expect(parsedBody.forwardPayload.asCell()).toEqualCell(
            beginCell()
                .storeUint(0, 1) // Either bit equals 0
                .storeMaybeRef(leftPayloadOnSuccess)
                .storeMaybeRef(rightPayloadOnSuccess)
                .endCell(),
        )
    })

    test("Not-first liquidity deposit should send both successful payloads via LP minting, and one excess with success payload", async () => {
        const blockchain = await Blockchain.create()

        const {
            ammPool,
            vaultA: swappedVaultA,
            vaultB: swappedVaultB,
            initWithLiquidity,
            liquidityDepositSetup,
            isSwapped,
        } = await createJettonAmmPool(blockchain)

        const {vaultA, vaultB} = isSwapped
            ? {vaultA: swappedVaultB, vaultB: swappedVaultA}
            : {vaultA: swappedVaultA, vaultB: swappedVaultB}

        const leftPayloadOnSuccess = beginCell().storeStringTail("SuccessLeft").endCell()
        const leftPayloadOnFailure = beginCell().storeStringTail("FailureLeft").endCell()

        const rightPayloadOnSuccess = beginCell().storeStringTail("SuccessRight").endCell()
        const rightPayloadOnFailure = beginCell().storeStringTail("FailureRight").endCell()
        // deploy liquidity deposit contract
        const initialRatio = 2n

        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        const depositor = vaultA.treasury.walletOwner

        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that the first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        // now we want to try to add more liquidity
        const additionalAmountA = toNano(1)
        // Not exactly the same ratio. There are too much right tokens in out liquidity provision
        const additionalAmountB = (additionalAmountA * initialRatio * 11n) / 10n

        const liqSetup = await liquidityDepositSetup(
            depositor,
            additionalAmountA,
            additionalAmountB,
        )
        await liqSetup.deploy()

        const _ = await vaultA.addLiquidity(
            liqSetup.liquidityDeposit.address,
            additionalAmountA,
            leftPayloadOnSuccess,
            leftPayloadOnFailure,
        )
        await vaultB.deploy()

        const addSecondPartAndMintLP = await vaultB.addLiquidity(
            liqSetup.liquidityDeposit.address,
            additionalAmountB,
            rightPayloadOnSuccess,
            rightPayloadOnFailure,
        )

        const mintLPTx = findTransactionRequired(addSecondPartAndMintLP.transactions, {
            from: ammPool.address,
            to: depositorLpWallet.address,
            op: AmmPool.opcodes.MintViaJettonTransferInternal,
            success: true,
        })
        const mintBody = flattenTransaction(mintLPTx).body?.beginParse()
        const parsedMintBody = loadMintViaJettonTransferInternal(mintBody!!)
        expect(parsedMintBody.forwardPayload.asCell()).toEqualCell(
            beginCell()
                .storeUint(0, 1) // Either bit equals 0
                .storeMaybeRef(leftPayloadOnSuccess)
                .storeMaybeRef(rightPayloadOnSuccess)
                .endCell(),
        )

        const payExcessTx = findTransactionRequired(addSecondPartAndMintLP.transactions, {
            to: vaultB.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutFromPoolBody = flattenTransaction(payExcessTx).body?.beginParse()
        const parsedPayoutFromPoolBody = loadPayoutFromPool(payoutFromPoolBody!!)
        expect(parsedPayoutFromPoolBody.payloadToForward).toBeDefined()
        expect(parsedPayoutFromPoolBody.payloadToForward!!).toEqualCell(rightPayloadOnSuccess)
    })

    test("should fail when slippage exceeded and return left payload via left vault and right via right", async () => {
        const blockchain = await Blockchain.create()

        const {
            ammPool,
            vaultA: swappedVaultA,
            vaultB: swappedVaultB,
            initWithLiquidity,
            liquidityDepositSetup,
            isSwapped,
        } = await createJettonAmmPool(blockchain)

        const {vaultA, vaultB} = isSwapped
            ? {vaultA: swappedVaultB, vaultB: swappedVaultA}
            : {vaultA: swappedVaultA, vaultB: swappedVaultB}

        const leftPayloadOnSuccess = beginCell().storeStringTail("SuccessLeft").endCell()
        const leftPayloadOnFailure = beginCell().storeStringTail("FailureLeft").endCell()

        const rightPayloadOnSuccess = beginCell().storeStringTail("SuccessRight").endCell()
        const rightPayloadOnFailure = beginCell().storeStringTail("FailureRight").endCell()

        // deploy liquidity deposit contract with initial liquidity
        const initialRatio = 2n

        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        const depositor = vaultA.treasury.walletOwner

        // Initialize the pool with initial liquidity
        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that the first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        // Get current reserves from the pool
        const leftReserve = await ammPool.getLeftSide()
        const rightReserve = await ammPool.getRightSide()

        // For the next deposit, calculate the minimum necessary amount using the formula from AMM Pool
        const amountASecond = toNano(2) // Add more of token A

        // Calculate the expected amount of token B using the formula: expectedRightAmount = muldiv(amountA, rightReserve, leftReserve)
        // This is the correct amount that would be accepted based on the current ratio
        const expectedAmountB = (amountASecond * rightReserve) / leftReserve

        // Test case 1: Provide EXACTLY the expected amount - should succeed
        const liqSetupExact = await liquidityDepositSetup(depositor, amountASecond, expectedAmountB)
        await liqSetupExact.deploy()

        // Add liquidity to vault A
        await vaultA.addLiquidity(
            liqSetupExact.liquidityDeposit.address,
            amountASecond,
            leftPayloadOnSuccess,
            leftPayloadOnFailure,
            amountASecond,
        )

        // Add liquidity to vault B
        const exactLiquidityResult = await vaultB.addLiquidity(
            liqSetupExact.liquidityDeposit.address,
            expectedAmountB,
            rightPayloadOnSuccess,
            rightPayloadOnFailure,
            // Set expectedAmountB as minimal acceptable for provision amount
            expectedAmountB,
        )

        // Verify that the liquidity was successfully added
        expect(exactLiquidityResult.transactions).toHaveTransaction({
            from: liqSetupExact.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
        })

        // LP tokens should be minted
        expect(exactLiquidityResult.transactions).toHaveTransaction({
            from: ammPool.address,
            op: AmmPool.opcodes.MintViaJettonTransferInternal,
            success: true,
        })

        const lpBalanceAfterExactLiq = await depositorLpWallet.getJettonBalance()
        expect(lpBalanceAfterExactLiq).toBeGreaterThan(lpBalanceAfterFirstLiq)

        // Test case 2: Provide 1 nano TON LESS than expected - should fail

        const lessBThanExpected = expectedAmountB - 1n // 1 nano less than expected

        const liqSetupInsufficient = await liquidityDepositSetup(
            depositor,
            amountASecond,
            lessBThanExpected,
        )
        await liqSetupInsufficient.deploy()

        // Add liquidity to vault A
        await vaultA.addLiquidity(
            liqSetupInsufficient.liquidityDeposit.address,
            amountASecond,
            leftPayloadOnSuccess,
            leftPayloadOnFailure,
            amountASecond,
        )

        // Add liquidity to vault B with an insufficient amount (1 nano less)
        const insufficientLiquidityResult = await vaultB.addLiquidity(
            liqSetupInsufficient.liquidityDeposit.address,
            lessBThanExpected,
            rightPayloadOnSuccess,
            rightPayloadOnFailure,
            lessBThanExpected,
        )

        // Should fail on the left side, as the amount on B is less than expected, so A should be less too,
        // but minimal acceptable amount A is equal to actual amount A
        expect(insufficientLiquidityResult.transactions).toHaveTransaction({
            on: ammPool.address,
            exitCode:
                AmmPool.errors["Pool: Liquidity provision failed due to slippage on left side"],
            success: true,
        })

        // Verify that appropriate transactions occurred
        // First: liquidity deposit contract notified pool
        expect(insufficientLiquidityResult.transactions).toHaveTransaction({
            from: liqSetupInsufficient.liquidityDeposit.address,
            to: ammPool.address,
            op: AmmPool.opcodes.LiquidityDeposit,
            success: true,
        })

        // Then: pool should return funds due to slippage with payloadOnFailure attached
        const payoutFromPoolA = findTransactionRequired(insufficientLiquidityResult.transactions, {
            from: ammPool.address,
            to: vaultA.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutFromPoolABody = flattenTransaction(payoutFromPoolA).body?.beginParse()
        const parsedPayoutFromPoolABody = loadPayoutFromPool(payoutFromPoolABody!!)
        expect(parsedPayoutFromPoolABody.payloadToForward).not.toBe(null)
        expect(parsedPayoutFromPoolABody.payloadToForward!!).toEqualCell(leftPayloadOnFailure)

        const payoutFromPoolB = findTransactionRequired(insufficientLiquidityResult.transactions, {
            from: ammPool.address,
            to: vaultB.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutFromPoolBBody = flattenTransaction(payoutFromPoolB).body?.beginParse()
        const parsedPayoutFromPoolBBody = loadPayoutFromPool(payoutFromPoolBBody!!)
        expect(parsedPayoutFromPoolBBody.payloadToForward).not.toBe(null)
        expect(parsedPayoutFromPoolBBody.payloadToForward!!).toEqualCell(rightPayloadOnFailure)
        expect(insufficientLiquidityResult.transactions).toHaveTransaction({
            from: ammPool.address,
            to: vaultB.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })

        // LP balance should remain unchanged from the previous successful addition
        const lpBalanceAfterFailedLiq = await depositorLpWallet.getJettonBalance()
        expect(lpBalanceAfterFailedLiq).toEqual(lpBalanceAfterExactLiq)
    })

    test("should return withdrawal payload on both jettons", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, initWithLiquidity} = await createJettonAmmPool(blockchain)

        const successfulPayloadOnWithdraw = beginCell()
            .storeStringTail("SuccessWithdrawPayload")
            .endCell()

        // deploy liquidity deposit contract
        const initialRatio = 2n

        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio

        const depositor = vaultA.treasury.walletOwner

        const {depositorLpWallet, withdrawLiquidity} = await initWithLiquidity(
            depositor,
            amountA,
            amountB,
        )

        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that the first liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        const withdrawResultWithPayloads = await withdrawLiquidity(
            lpBalanceAfterFirstLiq,
            0n,
            0n,
            0n,
            successfulPayloadOnWithdraw,
        )

        // we have separate unit test that burn works as withdrawal at amm-pool.spec
        const payoutFromPoolA = findTransactionRequired(withdrawResultWithPayloads.transactions, {
            from: ammPool.address,
            to: vaultA.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutFromPoolABody = flattenTransaction(payoutFromPoolA).body?.beginParse()
        const parsedPayoutFromPoolABody = loadPayoutFromPool(payoutFromPoolABody!!)
        expect(parsedPayoutFromPoolABody.payloadToForward).not.toBe(null)
        expect(parsedPayoutFromPoolABody.payloadToForward!!).toEqualCell(
            successfulPayloadOnWithdraw,
        )

        const payoutFromPoolB = findTransactionRequired(withdrawResultWithPayloads.transactions, {
            from: ammPool.address,
            to: vaultB.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutFromPoolBBody = flattenTransaction(payoutFromPoolB).body?.beginParse()
        const parsedPayoutFromPoolBBody = loadPayoutFromPool(payoutFromPoolBBody!!)
        expect(parsedPayoutFromPoolBBody.payloadToForward).not.toBe(null)
        expect(parsedPayoutFromPoolBBody.payloadToForward!!).toEqualCell(
            successfulPayloadOnWithdraw,
        )
    })
})



================================================
FILE: sources/tests/offline-data/16_last_proofs.json
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/offline-data/16_last_proofs.json
================================================
[
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996197,
            "rootHash": "c886c93795f6c13e2b3f32f6b7e82f06d55ace4b3431636e803eb210ca9643a0",
            "fileHash": "fe33f609f8921edba74abf04b2cee23ac09c6aa79fd0b3ed439d0323e89a5541"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212285,
            "rootHash": "de47172c8d9225a8efa63dc9dbd19d9c5e336bab682f680667c96bccfb000cd7",
            "fileHash": "f057791df84899a000aba559d137be33989d9281c72443574f3162239c7d838a"
        },
        "shardProof": "b5ee9c7201021d0200050f0100094603313c50b332da47d82a8428c2bd4166a314033c10d09a7e5f719dc1d5d959324c016f02094603c886c93795f6c13e2b3f32f6b7e82f06d55ace4b3431636e803eb210ca9643a0001615245b9023afe2ffffff1100ffffffff000000000000000002eb9f65000000016853d88a0000353090244b4402eb9f63600304050628480101c1f3235cff33cc8ca864eae89620cdaeb4eb14e5db09f9d10ec194b75973cf8800012848010181f0772f173ef480c326a4ee0cea58f98ff5cdfcda60a4845f9486677d2c6901016e22330000000000000000ffffffffffffffff81ae20a167b23b74282807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576fbc5ba7257e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a61202a120880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c01011284801019a22e169d523ca10ff33326b01e173fa207f7e8b4993bb837a1a90a7cf4f0326000228480101a1a3ff24fa39dd353e5d36eaeb3096d63f9bef9186e9fa6fdf37839e8ebc08e1000101db5019d9b5e8175cfb280001a98480a848000001a98480a8482ef238b9646c912d477d31ee4ede8cece2f19b5d5b417b40333e4b5e67d80066bf82bbc8efc244cd00055d2ace89bdf19cc4ec940e39221aba798b111ce3ec1c5080005617c30000000000000000175cfb1b429ec44212001341f033f6b20ee6b28020284801016d4868b53ae223fd8fcefb7084e1688fd5d7b37456c9d4da58264b825ebfabab001a2848010144fd635888d75f3de47dfa4f7e38b6248159b32138ef7c1d75b7eeaf17d6c88b0012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f650000000100ffffffff00000000000000006853d88a0000353090244b400000353090244b44591ace7e000abc2302eb9f6302eb69b0c40000000b00000000000001ee1a2848010159f88539fa37ffd9e398d262a2133f8cb8955ee815f68f7b4f81eed06b21866b00032a8a04ff7b96d77c3e5760dd0105334a26058d54ba98cdf42b2bf520fed2ed23d0f6b8313c50b332da47d82a8428c2bd4166a314033c10d09a7e5f719dc1d5d959324c016f016f1b1c284801019f2fee914e5a0599172625030c3c4b942aa2b965015a347930c3098d07a4780d00070098000035309015090402eb9f64b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e74a5c0ae47effe610f1b385866a9b54b825bc71f27183cc67978cd1b308ce7462688c0103ff7b96d77c3e5760dd0105334a26058d54ba98cdf42b2bf520fed2ed23d0f6b8fdddb1dbeb8ecc7b479e3b23ccd3f89f2e9adb79474fd25b88e2d15bb6615963016f0013688c0103313c50b332da47d82a8428c2bd4166a314033c10d09a7e5f719dc1d5d959324cda905f6e2df56471fdc3717decfe95d4870f665a5e190501152c2b566d0dec58016f0014",
        "proof": "b5ee9c72010245020008f201000946033c92acc1349a24c027958fabe3cf4c4a5c746fa752eeb6617b45d4ded8706242020602094603de47172c8d9225a8efa63dc9dbd19d9c5e336bab682f680667c96bccfb000cd700213c235b9023afe2ffffff1102000000004000000000000000033b36bd000000016853d888000035309015090502eb9f6320030405284801017b9fbab4faf4c2d77581d894550103f67384ef6a55f54f82e3d1241bd57281fa00102213fa03192eeff736450130063b21d90000000000000000ffffffffffffffff80c64bbbfdcd91404b9c0ac90a39287c1000035308ff6848402eb9f63c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6bea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd0328483b231467d018c9777fb9b2280907083b284801014a740fffb4be0449c05ebccf024eaa3d252a92a88a4d2388765cc1a0c26b94ce020323133d01247bc6ba1b0ac318090a3b23133d010e40f4b607e1e9d80b0c1128480101d39602381dfba8f4e640dd49ba3d5aba932dd328cdde35f1a659ec135d0906b801c223133d010a2f60a8a8c7e0180d0e112848010134ba657365e58dd753ad3040240501cd562ed5ab0dfa949a8dc3b113cf278a95018c28480101685412dfda3121ce6f80ed89a6b767f17ac94553e94af2131cad1fa68c621f1801fe23133d0106c33f5840846b580f101122113ce16bcd533ec902c8121328480101392f943da04e0167df859b250829e272a0056305fb2b45bb321e86618e664756015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101f52a19ac0f212ac315f0f9f162f9724a648c361063e0ec71d84a8dda43e196050188221100e0cd1ff914f493281415284801016968ea877cf925f3aadf4fc191718b9f8cb5d23c5d78982b62c5d81d505853d20140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36bd00000001020000000040000000000000006853d88800003530901509000000353090150905146f6372000ac2f802eb9f6302eb69b0c40000000b00000000000001ee414228480101466172aea763c6c093287510c089eab00cb6a31a9d0b4d1efff43edfee4dd45700022a8a04f384ac42b0a65fdcda3bcfa8ad539706490e0d7dd25ed6d4267554b2a1492d8c3c92acc1349a24c027958fabe3cf4c4a5c746fa752eeb6617b45d4ded870624202060206434428480101e5f6b4a8ce323ff5731ad55c396c4027ab83a2a0741918538f900319acf6d6bd00130098000035308ff6848402eb9f63c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6bea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd032840098000035309005c6c3033b36bc641e9216f57a6d62314fe1aba8cf0f0065d8e2f0c39fc3190ae8d2da97fb72ea83a36382e924d1a6544141a6d027dd5a31fd324854a427a644538f12dd73d4f9688c0103f384ac42b0a65fdcda3bcfa8ad539706490e0d7dd25ed6d4267554b2a1492d8cb20d8ebea8f69bd9b4378d2f9c7c6c0379520d4ed3843b2d9df4a9c3c3af25aa0206001e688c01033c92acc1349a24c027958fabe3cf4c4a5c746fa752eeb6617b45d4ded8706242d1f9aa54629d6d43fe966f926562853cb6e08a977d7d6a70d563ca2dc304c41f0206001f",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996196,
            "rootHash": "b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e7",
            "fileHash": "4a5c0ae47effe610f1b385866a9b54b825bc71f27183cc67978cd1b308ce7462"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212283,
            "rootHash": "56396115445f8b0648c0157d46417ef7bac0e6707a53711dcd887339da35ec5e",
            "fileHash": "03bba1b0d9dae8aba6c2dda5118f9a36615a02c6c9982c1202079e1df609ed2c"
        },
        "shardProof": "b5ee9c7201021d0200050f0100094603ff7b96d77c3e5760dd0105334a26058d54ba98cdf42b2bf520fed2ed23d0f6b8016f02094603b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e7001615245b9023afe2ffffff1100ffffffff000000000000000002eb9f64000000016853d888000035309015090402eb9f61600304050628480101d3e64706f3730ad0d2fa95ed0f0919e2d5e462ebb7070aeca991df3da07422c00001284801010cda9803501d7a5603297de8dc67e5b07b34d06b0d14da16f85bd1587a198814016e22330000000000000000ffffffffffffffff81ae20a15c444699c82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576fb6dcfbb97e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611fed090880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c0101128480101c76f1f10b970795eb24d1892bce0e674040d0a7b592dd3709f96ea425aaf83d20002284801012a68b0fc2fc5a1c6f722bda0953e6329fb4479401bcd1ea61b665d41dfa883dd000101db5019d9b5d8175cfb200001a9847fb424000001a9847fb42422b1cb08aa22fc58324600abea320bf7bdd6073383d29b88ee6c4399ced1af62f01ddd0d86ced7455d3616ed288c7cd1b30ad016364cc16090103cf0efb04f696080005617c30000000000000000175cfb13429ec41a120013411a268f62077359402028480101d49da54a3d4efa09c2a0824da3d4011742e8632fd87786b4a939286484b58530001a28480101630241bd196c2a07db720ad208ecae7de07b5685b76342db8d9691025afaae050012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f640000000100ffffffff00000000000000006853d88800003530901509000000353090150904591ace7e000abc2302eb9f6102eb69b0c40000000b00000000000001ee1a2848010156c7f373b8e57997a12e8faccb3e15c05d391f5fa796d0d4d6eb832581ada2be00032a8a04adad15d8a344aa9a8e3b964afbc14697d6224fb3864f8099d6e49a01ca54552aff7b96d77c3e5760dd0105334a26058d54ba98cdf42b2bf520fed2ed23d0f6b8016f016f1b1c28480101466c174647346283cc0f26cfbd030aa4e4144a24b74b1699e493b1134ff062d100070098000035308ff6848402eb9f63c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6bea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd03284688c0103adad15d8a344aa9a8e3b964afbc14697d6224fb3864f8099d6e49a01ca54552a9ffbe710ae1e7133153d7cc77abbb1514aef31d32286afe0518e4cb630594c37016f0013688c0103ff7b96d77c3e5760dd0105334a26058d54ba98cdf42b2bf520fed2ed23d0f6b825bdedddbb10eb95f20da20df6cf8aeaa80c96f4f2f170f286798a39cce2b6c7016f0014",
        "proof": "b5ee9c72010245020008f20100094603e859d301136e6df74ac00a993892a7d9229c16b2dfe4e534c8e9719982f8445b02060209460356396115445f8b0648c0157d46417ef7bac0e6707a53711dcd887339da35ec5e002b3c235b9023afe2ffffff1102000000004000000000000000033b36bb000000016853d883000035308ff6848402eb9f62200304052848010164ef4a31b2e3ab0f56655e7834908e0279708f77e90c8ee8b7546e20a1999f4c00102213fa03192eeff8dcaed2f0063b21d90000000000000000ffffffffffffffff80c64bbbfe372bb4bb9c0ac8fab788c69000035308fe7424402eb9f62ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9ddfa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a783b231467d018c9777fc6e5769707083b2848010130fff6a84e4baec121ec85124e14ab177392f2aef155eaedb3e298f4a465737a020323133d01247bc6ba80059eb8090a3b23133d010e40f4b66cdcc5780b0c1128480101d39602381dfba8f4e640dd49ba3d5aba932dd328cdde35f1a659ec135d0906b801c223133d010a2f60a8a8c7e0180d0e1128480101ce3c00295a419c76914bca984fd779ce1467518ba8be285f8e8f0e2e1b785776018c28480101685412dfda3121ce6f80ed89a6b767f17ac94553e94af2131cad1fa68c621f1801fe23133d0106c33f5840846b580f101122113ce16bcd533ec902c8121328480101392f943da04e0167df859b250829e272a0056305fb2b45bb321e86618e664756015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101f52a19ac0f212ac315f0f9f162f9724a648c361063e0ec71d84a8dda43e196050188221100e0cd1ff914f493281415284801016968ea877cf925f3aadf4fc191718b9f8cb5d23c5d78982b62c5d81d505853d20140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36bb00000001020000000040000000000000006853d883000035308ff68480000035308ff68484146f6372000ac2f802eb9f6202eb69b0c40000000a00000000000001ee414228480101314d35ba38a2704e498b7a685589d0fc109bc6cac92350cc4361ea9aee33f7b000022a8a04104b46f054af7fb38b9aa87c4684bbd9460a4bc6dbd3f70fdba84e4b8a7c86d1e859d301136e6df74ac00a993892a7d9229c16b2dfe4e534c8e9719982f8445b020602064344284801014c769e43dc24ffa169f6acf61ca563269fcc00856e6205532e37d9277220d99a00160098000035308fe7424402eb9f62ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9ddfa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a70098000035308fe74249033b36baf9708987eb72977ebc6e69dd82b11c6a0cb021938f5264ebbec7a7f9e4b2d88008f0311954a57c082443a3f28c94dcf8c72886adf49e30b527311af62fb48174688c0103104b46f054af7fb38b9aa87c4684bbd9460a4bc6dbd3f70fdba84e4b8a7c86d18ff3f42b10679174123cc883519d1965e5597f44ea72b354de5b76f2967147560206001f688c0103e859d301136e6df74ac00a993892a7d9229c16b2dfe4e534c8e9719982f8445b23aca78412a0b99719c227cfa3fe5e0e22e983ac0146f0b972aeae5718892def02060029",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996195,
            "rootHash": "c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6b",
            "fileHash": "ea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd03284"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212282,
            "rootHash": "f9708987eb72977ebc6e69dd82b11c6a0cb021938f5264ebbec7a7f9e4b2d880",
            "fileHash": "08f0311954a57c082443a3f28c94dcf8c72886adf49e30b527311af62fb48174"
        },
        "shardProof": "b5ee9c7201021d0200050f0100094603adad15d8a344aa9a8e3b964afbc14697d6224fb3864f8099d6e49a01ca54552a016f02094603c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6b001615245b9023afe2ffffff1100ffffffff000000000000000002eb9f63000000016853d883000035308ff6848402eb9f5e6003040506284801012beb1cbca8928f963ab746610e84dfb9c35ca0ab8c13188843da3f8c7b2835d20001284801014b44562b98dd2310c531faf390bc32bbcfe53012d7c979930e5c9406e1f5ec0f016e22330000000000000000ffffffffffffffff81ae20a14f12389fd82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576fb06fe5257e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611fce848880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c01011284801017315984be4737f2074652a4cd324a5f19f0a4b39850f3665e5406dc449fd3444000228480101ccec6392ef295ced39dc9e9b960d8b3b3fed242e2c71ab131cddac0e3669dec0000101db5019d9b5d0175cfb180001a9847f3a12000001a9847f3a124fcb844c3f5b94bbf5e3734eec1588e35065810c9c7a93275df63d3fcf2596c400478188caa52be041221d1f9464a6e7c63944356fa4f185a93988d7b17da40ba080005617c30000000000000000175cfb03429ec40a12001341289f64e2077359402028480101097ff2fe8200f073e0bdfda94875df62d4109bcafaf5666ebbf92f32c55525b1001a284801018a4782474febc7258631f6db46ad5c539700433524560704035e8bdc62a6fcee0012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f630000000100ffffffff00000000000000006853d883000035308ff68480000035308ff68484591ace7e000abc2302eb9f5e02eb69b0c40000000b00000000000001ee1a2848010111cd6a40f35f77a8013411786dd8fc62a83839aff0aa6a12aefa20e35d0de4f300032a8a042650a3cb0b49ade9182b2f2e69214bde603e84b8ecf3dcae06fc54db41f75cb5adad15d8a344aa9a8e3b964afbc14697d6224fb3864f8099d6e49a01ca54552a016f016f1b1c28480101a6ed3b77274794086b20e98e2c2f39a211c83db08d058a754ff88ebe70334fd800070098000035308fe7424402eb9f62ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9ddfa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a7688c01032650a3cb0b49ade9182b2f2e69214bde603e84b8ecf3dcae06fc54db41f75cb5b87580fbcb7f4e10dc7316fe1079c83df385e14210320919567e858d7b5abb9f016f0013688c0103adad15d8a344aa9a8e3b964afbc14697d6224fb3864f8099d6e49a01ca54552a94a171c20af44334fba02017b3681a44718791d2aa4f019f5eb1fe5bc0a11fab016f0014",
        "proof": "b5ee9c72010245020008f20100094603104b46f054af7fb38b9aa87c4684bbd9460a4bc6dbd3f70fdba84e4b8a7c86d1020602094603f9708987eb72977ebc6e69dd82b11c6a0cb021938f5264ebbec7a7f9e4b2d88000223c235b9023afe2ffffff1102000000004000000000000000033b36ba000000016853d881000035308fe7424902eb9f60200304052848010177479d66ab80b57ae9e52d48b5f1275d3cb8a940f8f7205c1ab6bf6f8795fe5900112213fa03192eeffd2ce65a30063b21d90000000000000000ffffffffffffffff80c64bbbff4b39968b9c0ac8f1e6544b9000035308fc8bdc402eb9f605951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b86b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef283b231467d018c9777fe96732d107083b28480101c2e321ef413f1aa147d08874dd58d796f0f2e5fa44c8c9d0943d38ff308bf7b0020323133d01247bc6c2ca26a278090a3b23133d010e40f4be197d45380b0c112848010178f98882e4cb0ac99fefaa5441898e5d1a1452203a6be034a526701e46fe22fd01c223133d010a2f60b0a79a8c380d0e1128480101326ce9be827da7ffef28e69a50847b6ed95bc35873711d49671e24e5b76d2187018c28480101685412dfda3121ce6f80ed89a6b767f17ac94553e94af2131cad1fa68c621f1801fe23133d0106c33f603f5717780f101122113ce16bcd5b3d9ac468121328480101e19a79c575faf110c8bd16dc468283bc41ae0c7f50f069d968e8260649d0eac5015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101f52a19ac0f212ac315f0f9f162f9724a648c361063e0ec71d84a8dda43e196050188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36ba00000001020000000040000000000000006853d881000035308fe74240000035308fe74249146f6372000ac2f802eb9f6002eb69b0c40000000b00000000000001ee414228480101b4197d9fddfd237815a6169c5faeab38ee56b052f87cfc47c45e4ba46174c6d700022a8a04f055e090d8ab9c8c054400e087626c3297d08c984503d15b5fc63393b687c0ad104b46f054af7fb38b9aa87c4684bbd9460a4bc6dbd3f70fdba84e4b8a7c86d1020602064344284801015382d2ec61a45eba0a11f857dab4852e90ef53aa3ef0d2bfeead7070a958bd2800170098000035308fc8bdc402eb9f605951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b86b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef20098000035308fd80006033b36b9be2dc1089c67a1ba56e76965d7ee40fbf46ed477bf6d8b22e5893d5c695020ae920ca1b23f0289468dbc92f1d916c5ea69ced2b0413cc1f9cad22c800c6bafaf688c0103f055e090d8ab9c8c054400e087626c3297d08c984503d15b5fc63393b687c0ad5e524510c747eaacd3ab3e50fa13be6f6db5ff7c0c5f841c2ce86ba8ff127adc02060020688c0103104b46f054af7fb38b9aa87c4684bbd9460a4bc6dbd3f70fdba84e4b8a7c86d1ab8077f5fa5d3b3679fd1acf1ae3560b8ce08cc840579b7b43de5ed6c244013e02060020",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996194,
            "rootHash": "ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9dd",
            "fileHash": "fa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a7"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212281,
            "rootHash": "be2dc1089c67a1ba56e76965d7ee40fbf46ed477bf6d8b22e5893d5c695020ae",
            "fileHash": "920ca1b23f0289468dbc92f1d916c5ea69ced2b0413cc1f9cad22c800c6bafaf"
        },
        "shardProof": "b5ee9c7201021d0200050f01000946032650a3cb0b49ade9182b2f2e69214bde603e84b8ecf3dcae06fc54db41f75cb5016f02094603ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9dd001515245b9023afe2ffffff1100ffffffff000000000000000002eb9f62000000016853d881000035308fe7424402eb9f5e60030405062848010168394509d30253bb0b681dd3a92febc9707a3613cbd46aefce9315787afb96ed000128480101c36ac133b33e3df2ebdc8ce32c2438c13954ec69f1892aa11171587acf09c8d1016e22330000000000000000ffffffffffffffff81ae20a143b39816382807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576faaf139b97e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611fb0000880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c0101128480101960cfd762e1171a30243d3dedb24f23e26da99e4129b0ff0fa2adc78f67cb5ba0002284801018c271a48caa482c9bba5b546ce7510ecee37d7cb3766c9f6a078f84142c9ee66000101db5019d9b5c8175cfb100001a9847ec000000001a9847ec00035f16e0844e33d0dd2b73b4b2ebf7207dfa376a3bdfb6c59172c49eae34a81057490650d91f8144a346de4978ec8b62f534e76958209e60fce56916400635d7d7880005617c30000000000000000175cfafb429ec3f2120013410a32d3f2077359402028480101f81bb1f9918f07ce11249d114689b26717d81d45fdd8dd54321cc93e664b1325001a284801010c693b9d4dec827791b372b4d17d038d4b9decf22b08283d07e6372d20b53f340012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f620000000100ffffffff00000000000000006853d881000035308fe74240000035308fe74244591ace7e000abc2302eb9f5e02eb69b0c40000000b00000000000001ee1a2848010170be15775d0a9b8272d6aba896eac28185138f455c6a1b0e9a470d6d0dc3991a00032a8a04ac6ee1dc8c4bf29d1b73f22a0955971b9a8a7ab347759df5c3d46479bc8b412a2650a3cb0b49ade9182b2f2e69214bde603e84b8ecf3dcae06fc54db41f75cb5016f016f1b1c28480101c14d13ec28b770e411546cf112d31e727196cb08ec05db3f35889d5dfdef869100070098000035308fd8000402eb9f61e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e73ec63401f75ac3e894cc86dc109cc65d84873570eff778d2de8266d4a29ac5c688c0103ac6ee1dc8c4bf29d1b73f22a0955971b9a8a7ab347759df5c3d46479bc8b412ab393d9673a758b5cdad3d2f6b94055c68e75c5ebb965c40a5aa6499a868ba30d016f0013688c01032650a3cb0b49ade9182b2f2e69214bde603e84b8ecf3dcae06fc54db41f75cb560e580047c9b81c2cba51d9f7926c0e89fa013ec2a492a13098349ea63d3a771016f0013",
        "proof": "b5ee9c72010245020008f20100094603f055e090d8ab9c8c054400e087626c3297d08c984503d15b5fc63393b687c0ad020602094603be2dc1089c67a1ba56e76965d7ee40fbf46ed477bf6d8b22e5893d5c695020ae00213c235b9023afe2ffffff1102000000004000000000000000033b36b9000000016853d87e000035308fd8000602eb9f5f2003040528480101eb66253d3f4ad30501f48a6d86aabf750d47c775cdbcf136b65c8fd98221bb5000102213fa03192ef006cce47ab0063b21d90000000000000000ffffffffffffffff80c64bbc01b3391eab9c0ac8e8a159249000035308fb97b8402eb9f5f492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad4883b231467d018c97780366723d507083b28480101c6437a243f99b84285efe647295e6038a425157779cc2afc0c9cff4294dac094020323133d01247bc6e68c321cf8090a3b23133d010e40f4be6d4371380b0c1128480101c594f82be8b9d7d5b3690e292eb612f8b88f7dde18af2aaa296feb02bd30b60001c223133d010a2f60b0a79b60780d0e11284801012996ca2826219eb689e60a594d972bfe71afdebdfbb93aa7539034b0edb15be9018c28480101c7554e39660a0168e7d942a06bd641957e4ada0fb81cd87298df37467eea1e7c01fe23133d0106c33f603f57eb380f101122113ce16bcd5b3d9b9828121328480101e19a79c575faf110c8bd16dc468283bc41ae0c7f50f069d968e8260649d0eac5015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101d86b59a06c911e5a4f415db697a61b4b3f4526c966668a52f5d86cfe5f0c15c20188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b900000001020000000040000000000000006853d87e000035308fd80000000035308fd80006146f6372000ac2f802eb9f5f02eb69b0c40000000b00000000000001ee4142284801015b883af7aae0c5d8765980d13bc78314bfc301550c102e1b5be76653d876aa3e00022a8a045b59f9a6bef4bd46dc9fae845e475734b3cc79dda7453e0e86d8c99cbe94e3d3f055e090d8ab9c8c054400e087626c3297d08c984503d15b5fc63393b687c0ad020602064344284801017c427ff21807e4a40401b6c306f8199f8b0b2b7ed684a3192251e0f6bb6c723800140098000035308fb97b8402eb9f5f492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad480098000035308fc8bdc1033b36b8d5da945cddfde4fcbd70f18b24a2f271348c3c9dbdb8abecea734d5da643ebb65f3726f30f0f55d736a443970a8768f8ee5d071042707ca99a60fb3ec892db4a688c01035b59f9a6bef4bd46dc9fae845e475734b3cc79dda7453e0e86d8c99cbe94e3d3fc1fd779e3059d980096605ba2a079e708db836776c29b98df1a26d557dac8040206001f688c0103f055e090d8ab9c8c054400e087626c3297d08c984503d15b5fc63393b687c0ad6de08967f8adf1c505feb7ca65afcd34f4cb412335fcb141b413011f5f5e20470206001f",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996193,
            "rootHash": "e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e",
            "fileHash": "73ec63401f75ac3e894cc86dc109cc65d84873570eff778d2de8266d4a29ac5c"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212280,
            "rootHash": "d5da945cddfde4fcbd70f18b24a2f271348c3c9dbdb8abecea734d5da643ebb6",
            "fileHash": "5f3726f30f0f55d736a443970a8768f8ee5d071042707ca99a60fb3ec892db4a"
        },
        "shardProof": "b5ee9c7201021d0200050f0100094603ac6ee1dc8c4bf29d1b73f22a0955971b9a8a7ab347759df5c3d46479bc8b412a016f02094603e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e001515245b9023afe2ffffff1100ffffffff000000000000000002eb9f61000000016853d87f000035308fd8000402eb9f5b600304050628480101caf1bd474360d0e59765f058db2d9da8f566079be350505841b8bae49369e72000012848010176735636e300739386b38cd9dddb4c77d707d75b91b5358d7a7861c2376bf220016e22330000000000000000ffffffffffffffff81ae20a13a40800a582807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576fa660f9757e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611f917b8880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c010112848010136fc005217a16ba820bdf83a3783ae7b1ff2da91dadbdccde2ed3512ce0355060002284801018c271a48caa482c9bba5b546ce7510ecee37d7cb3766c9f6a078f84142c9ee66000101db5019d9b5c0175cfb080001a9847e45ee000001a9847e45ee0eaed4a2e6efef27e5eb878c5925179389a461e4ededc55f67539a6aed321f5db2f9b93798787aaeb9b5221cb8543b47c772e838821383e54cd307d9f64496da5080005617c30000000000000000175cfaf3429ec3e212001340ee6b2802077359402028480101e9942b68bb4df94e4573c004c6483d29efbe7a798f0e82ea23339c9a81117f12001a28480101203ca1076fa244cd1e6ec2b24409c3835b29c18c47d902a62ecf415e66c2950b0012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f610000000100ffffffff00000000000000006853d87f000035308fd80000000035308fd80004591ace7e000abc2302eb9f5b02eb69b0c40000000b00000000000001ee1a28480101aa1cc98386d93e38a4faf74f3ce4ed3b4fbbd875be3e5490d2facd5f92299de500032a8a0461f7b2a1b9ffb88f5d72989641242e8640dab47cac8d8456d17c302fa7b65c2bac6ee1dc8c4bf29d1b73f22a0955971b9a8a7ab347759df5c3d46479bc8b412a016f016f1b1c2848010168d84a7eb12bd8a1baf0def57930f4f3b8b9553f23bcb12ce0bf75a87fb5215700070098000035308fc8bdc402eb9f605951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b86b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef2688c010361f7b2a1b9ffb88f5d72989641242e8640dab47cac8d8456d17c302fa7b65c2b4b4301693e748071e9562e5cd58294f3912dcefc41f89739679370b881f8ac9a016f0013688c0103ac6ee1dc8c4bf29d1b73f22a0955971b9a8a7ab347759df5c3d46479bc8b412ab8145deb8a37b8f4fac653d0b5a4144b63d26b05875ec26d072622cf62e01a61016f0013",
        "proof": "b5ee9c72010245020008f201000946035b59f9a6bef4bd46dc9fae845e475734b3cc79dda7453e0e86d8c99cbe94e3d3020602094603d5da945cddfde4fcbd70f18b24a2f271348c3c9dbdb8abecea734d5da643ebb600043c235b9023afe2ffffff1102000000004000000000000000033b36b8000000016853d87c000035308fc8bdc102eb9f5e20030405284801010285fee4b2f9d3d84b2e795af465f1bfb3ed67e1e7cab7e63f8db2a12f6b0208000f2213fa03192eeff9bf18d1b0063b21d90000000000000000ffffffffffffffff80c64bbbfe6fc6346b9c0ac8e04fc2851000035308faa394402eb9f5ed27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc6983b231467d018c9777fcdf8c68d07083b284801010cb6ffff0860ced78cf5ab39c23f345ca1b63c581389d7c2297345a227dfe8f5020323133d01247bc6e68c321cf8090a3b23133d010e40f4be6d4371380b0c1128480101c594f82be8b9d7d5b3690e292eb612f8b88f7dde18af2aaa296feb02bd30b60001c223133d010a2f60b0a79b60780d0e11284801018d307b62a68192c43737097eb87392faf0bb36508f79be86cf1d718f53f7179c018c28480101c7554e39660a0168e7d942a06bd641957e4ada0fb81cd87298df37467eea1e7c01fe23133d0106c33f603f57eb380f101122113ce16bcd5b3d9b9828121328480101e19a79c575faf110c8bd16dc468283bc41ae0c7f50f069d968e8260649d0eac5015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101d86b59a06c911e5a4f415db697a61b4b3f4526c966668a52f5d86cfe5f0c15c20188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b800000001020000000040000000000000006853d87c000035308fc8bdc0000035308fc8bdc1146f6372000ac2f802eb9f5e02eb69b0c40000000b00000000000001ee414228480101e347294979aaec736892ef2526abc972c451f0a8259f707cc86879d64993416f00022a8a04c13d67c4ae91e090205342e35f4c12a440cfc2e49160397a0968a8a95c2a963c5b59f9a6bef4bd46dc9fae845e475734b3cc79dda7453e0e86d8c99cbe94e3d30206020643442848010165954488cedab4e3428d5a6f5fa21a06778e0b8ab562a2c373676c431cd9642600010098000035308faa394402eb9f5ed27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc690098000035308fb97b85033b36b7eb88d81fc77cc18c2f8c208169862da413cec4c9425bfd66fd0e0ca001ebd29083087c1dd5f543603e842da0b9613235c9b907e8414c90ac281fc26fffb1bb13688c0103c13d67c4ae91e090205342e35f4c12a440cfc2e49160397a0968a8a95c2a963c3ca4b51d9cefe2f312c4de5a6d32222b7851c2cbce7c35ee16c7dfd59186f3ae02060002688c01035b59f9a6bef4bd46dc9fae845e475734b3cc79dda7453e0e86d8c99cbe94e3d36b83d693bb6e7a803afbead6cb07420aea11053b9a182361bb1aaf8cf87730bc02060002",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996192,
            "rootHash": "5951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b8",
            "fileHash": "6b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef2"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212279,
            "rootHash": "eb88d81fc77cc18c2f8c208169862da413cec4c9425bfd66fd0e0ca001ebd290",
            "fileHash": "83087c1dd5f543603e842da0b9613235c9b907e8414c90ac281fc26fffb1bb13"
        },
        "shardProof": "b5ee9c7201021d0200050f010009460361f7b2a1b9ffb88f5d72989641242e8640dab47cac8d8456d17c302fa7b65c2b016f020946035951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b8001815245b9023afe2ffffff1100ffffffff000000000000000002eb9f60000000016853d87c000035308fc8bdc402eb9f5b600304050628480101580a89fd5fa2fb55aed475088c177544a2f46c1f726c0e3f5fe2b6cd789922210001284801015785ae6204b8e098fd15fe495df280f674494c3a7ea1ed43430dbf592cd290f5016e22330000000000000000ffffffffffffffff81ae20a130261edc182807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576fa159839d7e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611f72f70880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c010112848010118f8dd0e77010ec3ea42d9a5037d46a0d30bf168ecc5737b597c3c690b582ebb00022848010188d0946c46305f4462816af97caac0f7d856f1f86ee300277d2a461ad5a69981000101db5019d9b5b8175cfb000001a9847dcbdc000001a9847dcbdc2f5c46c0fe3be60c617c61040b4c316d209e76264a12dfeb37e87065000f5e94841843e0eeafaa1b01f4216d05cb0991ae4dc83f420a64856140fe137ffd8dd89880005617c30000000000000000175cfaf3429ec3d2120013420cc0e5520ee6b2802028480101c84effcee9414b182d5dc026e27c3d0398ca8318495b5ca57594f36e89c270c7001a2848010159c8c73b95480dba0fd9f32f161d449af4fb6cf2dc62146efdc472bc653b06c60012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f600000000100ffffffff00000000000000006853d87c000035308fc8bdc0000035308fc8bdc4591ace7e000abc2302eb9f5b02eb69b0c40000000b00000000000001ee1a28480101e8a54ff91b9bfeeb37cc3bd150e9f393ca650e59ec4423053194b4a1775cd04c00032a8a0489f98a95526dc131e367f4c9ff569687b026ae634d32a173eac73ef5ba269d4261f7b2a1b9ffb88f5d72989641242e8640dab47cac8d8456d17c302fa7b65c2b016f016f1b1c2848010158dd4c419266c27e8dd004445fa543768c40d991c85c65d9e02a6fee2b9013b000070098000035308fb97b8402eb9f5f492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad48688c010389f98a95526dc131e367f4c9ff569687b026ae634d32a173eac73ef5ba269d425d69e6d55334448d8f6fdce139fe4b1819ceb892b1283d4d7be290c9d53540be016f0015688c010361f7b2a1b9ffb88f5d72989641242e8640dab47cac8d8456d17c302fa7b65c2bb39b72f06615c8fbbd6fdc4f43936299665d197899862c277b827c66dddb9a7e016f0016",
        "proof": "b5ee9c72010245020008f20100094603c13d67c4ae91e090205342e35f4c12a440cfc2e49160397a0968a8a95c2a963c020602094603eb88d81fc77cc18c2f8c208169862da413cec4c9425bfd66fd0e0ca001ebd29000223c235b9023afe2ffffff1102000000004000000000000000033b36b7000000016853d87a000035308fb97b8502eb9f5e20030405284801010285fee4b2f9d3d84b2e795af465f1bfb3ed67e1e7cab7e63f8db2a12f6b0208000f2213fa03192eeff9bf18d1b0063b21d90000000000000000ffffffffffffffff80c64bbbfe6fc6346b9c0ac8d8dc69451000035308faa394402eb9f5ed27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc6983b231467d018c9777fcdf8c68d07083b284801010cb6ffff0860ced78cf5ab39c23f345ca1b63c581389d7c2297345a227dfe8f5020323133d01247bc6e68c321cf8090a3b23133d010e40f4be6d4371380b0c1128480101c594f82be8b9d7d5b3690e292eb612f8b88f7dde18af2aaa296feb02bd30b60001c223133d010a2f60b0a79b60780d0e11284801018d307b62a68192c43737097eb87392faf0bb36508f79be86cf1d718f53f7179c018c28480101c7554e39660a0168e7d942a06bd641957e4ada0fb81cd87298df37467eea1e7c01fe23133d0106c33f603f57eb380f101122113ce16bcd5b3d9b9828121328480101e19a79c575faf110c8bd16dc468283bc41ae0c7f50f069d968e8260649d0eac5015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101d86b59a06c911e5a4f415db697a61b4b3f4526c966668a52f5d86cfe5f0c15c20188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b700000001020000000040000000000000006853d87a000035308fb97b80000035308fb97b85146f6372000ac2f802eb9f5e02eb69b0c40000000b00000000000001ee414228480101a435e19a175af72b83a8b088e2c722e46e65ccfd3f7cdd0573849dd555ce7b0100022a8a0487d5f38b66dd4e4c0643ed4c1a631b8299a5617e68ab5776c55a476fd8add4c1c13d67c4ae91e090205342e35f4c12a440cfc2e49160397a0968a8a95c2a963c02060206434428480101651d8c2e9e7ddcb7e43306d72a3bd785d1d9f6181c9fecd7cb1db539d92caa1000130098000035308faa394402eb9f5ed27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc690098000035308f9af705033b36b63311e3c8a39eac65a9942e11d98a2408f082bd0e192cbb12591c8baa10c2348019104e33fde5167ee6f8bc935ea2688a8202e5c102fa92e01cafacf0adb0ea51688c010387d5f38b66dd4e4c0643ed4c1a631b8299a5617e68ab5776c55a476fd8add4c1db5bbaa763758c1efc3dae54111478173f57f1c8dea2044be6dbfeb6129c063c0206001f688c0103c13d67c4ae91e090205342e35f4c12a440cfc2e49160397a0968a8a95c2a963cce00b32d89c51fcb07240d2f7319428591670ca6c88970fd6efac42df00be0ef02060020",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996191,
            "rootHash": "492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490",
            "fileHash": "801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad48"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212277,
            "rootHash": "520b357d77a9816ff22a80233d17d54ac59b6d7f91bf8d55fda8be581df760bf",
            "fileHash": "1a6c789d560e0ee7e8fb3d448daacd5c8f0aca242aa6846b659270ca9c56a43b"
        },
        "shardProof": "b5ee9c7201021d0200050f010009460389f98a95526dc131e367f4c9ff569687b026ae634d32a173eac73ef5ba269d42016f02094603492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490001815245b9023afe2ffffff1100ffffffff000000000000000002eb9f5f000000016853d879000035308fb97b8402eb9f5b6003040506284801017b6c4218531f18a877eff08a48a4e5b4119303f107a71dc8cbd1bb52929cfd1b00012848010139cd8ae1994820e880abc8473fdae821cfb01649250b4673dc87ce0a7d0d64eb016e22330000000000000000ffffffffffffffff81ae20a122e84302f82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576f9aec6d097e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611f54728880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c010112848010108827131afb3feb1b9e64780c74643e9efb8d01855eb7e9c517763835815030900022848010155276f4a3cf7e98c46c00e586243fb4b056b3e8cfcc211fcd04472949cc9ce3c000101db5019d9b5a8175cfaf80001a9847c5da6000001a9847c5da6329059abebbd4c0b7f91540119e8beaa562cdb6bfc8dfc6aafed45f2c0efbb05f8d363c4eab070773f47d9ea246d566ae4785651215534235b2c938654e2b521d880005617c30000000000000000175cfae3429ec3aa120013412dd093b2077359402028480101e360074f088d6934374c396e477a74b23b38e0896482d7bd313eeeaac5735c04001a284801016d278ccaa0be53e7390c8e3a34223337dfdeb324a086e1edbcaa5929ff78dbe80012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f5f0000000100ffffffff00000000000000006853d879000035308fb97b80000035308fb97b84591ace7e000abc2302eb9f5b02eb69b0c40000000b00000000000001ee1a28480101c50b34ad1dc07885f1a7de6f688c72ae798b074b4f8cc4e613e6271fa7765bd000032a8a046096fc22c10c657afdb77138d6307d8709d3e362a2fc9a1600ffa68c47f2410189f98a95526dc131e367f4c9ff569687b026ae634d32a173eac73ef5ba269d42016f016f1b1c28480101e537605431f698b29f434b4e0efa129c24d37865bd6320976020bb5985d58b4c00070098000035308faa394402eb9f5ed27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc69688c01036096fc22c10c657afdb77138d6307d8709d3e362a2fc9a1600ffa68c47f24101301a13d148097312f12227a71b02ff2e1e7545589f00588a09ffbd049b72b5c7016f0014688c010389f98a95526dc131e367f4c9ff569687b026ae634d32a173eac73ef5ba269d426d336a34c2a7a4dd3f730076295315416f8c6e524e9a02975d6c23b53af41368016f0016",
        "proof": "b5ee9c72010245020008f2010009460383019c6f09ce2ee5e1f3e0ddfde0f7da744aa8c7366c556127adfbbb1a5a6d39020602094603520b357d77a9816ff22a80233d17d54ac59b6d7f91bf8d55fda8be581df760bf00283c235b9023afe2ffffff1102000000004000000000000000033b36b5000000016853d875000035308f8bb4c602eb9f5c2003040528480101810e0d96fa52d34243724044d18899f8fdaa8bda169cf9c2446c2a3190094702000f2213fa03192eef93a8e66e30063b21d90000000000000000ffffffffffffffff80c64bbbe4ea399b8b9c0ac8c876621a9000035308f7c728402eb9f5cd0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db883b231467d018c9777c9d47337107083b284801018187308fbc798d900b0b057584ff5e175143b214a380d92234587954d751bf1b020323133d01247bc6ead791d2d8090a3b23133d010e40f4ca7c55eef80b0c11284801016cc98c57209d939121b8148ed37fba5212c0328bcf503e241631378d0dc5264f01c223133d010a2f60b0b36506d80d0e112848010158f5c6d3b9951bcebc2e0e68a21dc70c90c8fe81085c029eb53457b3c95b1617018c284801017df1df489fde7757411480f12f693d78df72cf9967730113f8798f112b8479b901fe23133d0106c33f60a40d2b580f101122113ce16bcd5b3d9cf628121328480101cbbffc160e3d2ba5134a4c4c61149cdadea84f006d82298fec37493aa001a104015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101621edda6d6f0c9e580a2af6ce7aa48339d4dcb90da3ef8eac9fc28e43ba47fd70188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b500000001020000000040000000000000006853d875000035308f8bb4c0000035308f8bb4c6146f6372000ac2f802eb9f5c02eb69b0c40000000b00000000000001ee414228480101cf21c6af68b2223af64d49f8d6f593ca914be1410db90cfa3dd471cefaa131e600022a8a046875fe962b93153a04846901b93e15c16356769d13e67461401edcfeb4573bcd83019c6f09ce2ee5e1f3e0ddfde0f7da744aa8c7366c556127adfbbb1a5a6d39020602064344284801017c660989258cf7f71fc8d296a9510fcd3eb49726bde83986682fddf7563e714800270098000035308f7c728402eb9f5cd0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db80098000035308f7c7285033b36b44f517ef37791cf946232f9561785f199801aa016e9e40ccd35827ba65b74d67f058b6aeaa8d7eebcef25d166113dc7408a74885145d08450c824649fa07f8b53688c01036875fe962b93153a04846901b93e15c16356769d13e67461401edcfeb4573bcd5a18ba7d672546ec39dd93db6e2fcfc7197466df514d7e0b69e291a8b9eb403802060020688c010383019c6f09ce2ee5e1f3e0ddfde0f7da744aa8c7366c556127adfbbb1a5a6d39e2c9fae36302fc1666744ec236f05b1c15697d831a0eb7c74a16688628ab06dc02060025",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996190,
            "rootHash": "d27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819",
            "fileHash": "721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc69"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212276,
            "rootHash": "4f517ef37791cf946232f9561785f199801aa016e9e40ccd35827ba65b74d67f",
            "fileHash": "058b6aeaa8d7eebcef25d166113dc7408a74885145d08450c824649fa07f8b53"
        },
        "shardProof": "b5ee9c7201021d0200050f01000946036096fc22c10c657afdb77138d6307d8709d3e362a2fc9a1600ffa68c47f24101016f02094603d27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819001715245b9023afe2ffffff1100ffffffff000000000000000002eb9f5e000000016853d877000035308faa394402eb9f5b600304050628480101ac8321d89bd6d0c291d8f596f3dcca1ceb989fc56bc1adf3d31ecf38f52a9867000128480101f25903e6e76c68dd6c5b5ada7cadd80ae824427e71bf2954be161d1df441ce64016e22330000000000000000ffffffffffffffff81ae20a11985a429082807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576f965c2cc57e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611f17698880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c01011284801014e736146ae7eeafeec500e7c3ff0deddda6095318d1e26c9558982cc42e1bf3a00022848010146be5dbead85fd62d818ca4a7ddf277406daa3c3ec7eb510f7986f60c2cc0b6e000101db5019d9b5a0175cfaf00001a9847be394000001a9847be3942a7a8bf79bbc8e7ca31197cab0bc2f8ccc00d500b74f206669ac13dd32dba6b3f82c5b575546bf75e7792e8b3089ee3a0453a4428a2e842286412324fd03fc5a9880005617c30000000000000000175cfadb429ec39a12001341036aeb920773594020284801014a2ea5b0939743f50620e96c2c8893a982d303fd039e691d33b7ab5b804ce7cc001a284801017ff7ac5d1c35eee9e6c8e3a63317185a740a204c67e2789cf7701986f4a347140012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f5e0000000100ffffffff00000000000000006853d877000035308faa3940000035308faa3944591ace7e000abc2302eb9f5b02eb69b0c40000000b00000000000001ee1a28480101970f9a161fe343539e33014261a350e89d264b829ea2052e829b4bda0e9b02e100032a8a0404f9db5a32f26c2a191574400d2c3c9bbbb71c9530118d33ed441ad75a97012f6096fc22c10c657afdb77138d6307d8709d3e362a2fc9a1600ffa68c47f24101016f016f1b1c28480101ab31389e6fd2f90dd8e6097cbd3d1f8261f6dcf53c3545eb06c4d08fde95b87700070098000035308f8bb4c402eb9f5df44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d44876343e61a7a543c198dc6aa73af46bd0f1245e76d14087f0673c894f271ccec47688c010304f9db5a32f26c2a191574400d2c3c9bbbb71c9530118d33ed441ad75a97012fd3bdf7511132d666c22ea0ad04ad807e7d5b1b0ef4d4d8b937e1cb6d7be86834016f0014688c01036096fc22c10c657afdb77138d6307d8709d3e362a2fc9a1600ffa68c47f24101137c403668eb952181d7c03b76d8c9d3b556397623f1aadb962a2832aeb96696016f0015",
        "proof": "b5ee9c72010245020008f201000946036875fe962b93153a04846901b93e15c16356769d13e67461401edcfeb4573bcd0206020946034f517ef37791cf946232f9561785f199801aa016e9e40ccd35827ba65b74d67f00223c235b9023afe2ffffff1102000000004000000000000000033b36b4000000016853d873000035308f7c728502eb9f5b200304052848010152b6230591bb1ebf8285b3e5fc828c0acd117fcd3336ac3bae65af1d56c92fde00222213fa03192eefa59b4fcb30063b21d90000000000000000ffffffffffffffff80c64bbbe966d3f2cb9c0ac8bf07dd7d1000035308f6d304402eb9f5bd5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf076211032915e694c41a769d41d0be88d55ed62156764576b77ed46aeb50f3ad6ff4c83b231467d018c9777d2cda7e5907083b28480101aade12371bae5152ad22bc4af4c7e8bd0e5e3fac4d1dca3bb9bc2a7ea77cce1a020323133d01247bc6f4404d7978090a3b23133d010e40f4c9a72116b80b0c11284801014c2cd853ccdb6518c47213b395a3f99ace0647c207932ba68e67f4a32964505d01c223133d010a2f60b0b36506d80d0e1128480101f8d3ad7217ca267aaa8a584328657e0fd175016457810251457323f019cabbbd018c284801017df1df489fde7757411480f12f693d78df72cf9967730113f8798f112b8479b901fe23133d0106c33f60a40d2b580f101122113ce16bcd5b3d9cf628121328480101cbbffc160e3d2ba5134a4c4c61149cdadea84f006d82298fec37493aa001a104015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101621edda6d6f0c9e580a2af6ce7aa48339d4dcb90da3ef8eac9fc28e43ba47fd70188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b400000001020000000040000000000000006853d873000035308f7c7280000035308f7c7285146f6372000ac2f802eb9f5b02eb69b0c40000000b00000000000001ee4142284801010ea786367929e1bd2493f761b00aece2b5d250b3c8b5a59146d9d5180319f0b300022a8a04fb2bfabf20a8e6bf19dba289ebd4e7fd06ff66f35e8c58f71b13ce32176ddec36875fe962b93153a04846901b93e15c16356769d13e67461401edcfeb4573bcd020602064344284801014eb2ccc8ab2947ab3e78f89074666b00593a901326dd2cb4fa9530d02474ee6c000e0098000035308f6d304402eb9f5bd5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf076211032915e694c41a769d41d0be88d55ed62156764576b77ed46aeb50f3ad6ff4c0098000035308f6d3043033b36b3243a4448027912e541a1827426b5798228bbd712a8413da1fbf29489b54259fda4f3a6bbe3b2b476cc97be9d0aff5aa0a32b83b194b0202bf26fd8eda9bd5611688c0103fb2bfabf20a8e6bf19dba289ebd4e7fd06ff66f35e8c58f71b13ce32176ddec3c0900562d20a5c85d3e55343fcbe4cabc87877c15499015fa67b3e311a3b66db0206001f688c01036875fe962b93153a04846901b93e15c16356769d13e67461401edcfeb4573bcd71e5fb882580d4a649af5a28a602c1f4416919f549474c61e0e8cbce6e439ae902060020",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996189,
            "rootHash": "f44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d4487",
            "fileHash": "6343e61a7a543c198dc6aa73af46bd0f1245e76d14087f0673c894f271ccec47"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212275,
            "rootHash": "243a4448027912e541a1827426b5798228bbd712a8413da1fbf29489b54259fd",
            "fileHash": "a4f3a6bbe3b2b476cc97be9d0aff5aa0a32b83b194b0202bf26fd8eda9bd5611"
        },
        "shardProof": "b5ee9c7201021d0200050f010009460304f9db5a32f26c2a191574400d2c3c9bbbb71c9530118d33ed441ad75a97012f016f02094603f44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d4487001715245b9023afe2ffffff1100ffffffff000000000000000002eb9f5d000000016853d875000035308f8bb4c402eb9f59600304050628480101cb38250704556bae8703660c8b80604f6637edbb57696fe957aadc7c006289d200012848010138c272913b798da7c8854565c73c0926e72a28c1bb6bf6d2cf9b1a904b83436a016e22330000000000000000ffffffffffffffff81ae20a10e4cf1a6b82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576f90dd81597e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611ef8e50880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c01011284801019cded90c93c1ea68d252bd58d9862bc3f8c75150f6206b86fc2fe99af2953640000228480101b9ebbd6cf944899e96865637189916c16b4aa8024ac502a67dd217e1df7da5d8000101db5019d9b598175cfae80001a9847b6982000001a9847b69821921d2224013c8972a0d0c13a135abcc1145deb8954209ed0fdf94a44daa12cfed279d35df1d95a3b664bdf4e857fad505195c1d8ca581015f937ec76d4deab08880005617c30000000000000000175cfacb429ec38a12001340f687efc20773594020284801013668e9f49c540b9aa8ead615cf8062762b4318385ecf1dbd8e61175c45ef6be8001a284801015086288bde24c1f763db1e4bd781ca1473914dd21ec8a9fe3b93feac99f6a22b0012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f5d0000000100ffffffff00000000000000006853d875000035308f8bb4c0000035308f8bb4c4591ace7e000abc2302eb9f5902eb69b0c40000000b00000000000001ee1a28480101565247c9069b4ada551d607f3016fbf9df947ed4d1ad990211928c2aeda6ff4400032a8a04022cf2517395fec6c4108022861c398894c00f54b985adba951a8f0c5d96b44804f9db5a32f26c2a191574400d2c3c9bbbb71c9530118d33ed441ad75a97012f016f016f1b1c2848010105e80cac3437dcf1566f212634197eced93d80912071ff4da424ca82966d975c00070098000035308f7c728402eb9f5cd0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db8688c0103022cf2517395fec6c4108022861c398894c00f54b985adba951a8f0c5d96b448f2ac392088bb9b6c1197ebe931717519c6faf5aa66b62f6ad314c74e49dce3d4016f0014688c010304f9db5a32f26c2a191574400d2c3c9bbbb71c9530118d33ed441ad75a97012f3692946bd12c0d7884c7e3a8e25790a1e779f425ec76be416955d2b092c02dfc016f0015",
        "proof": "b5ee9c72010245020008f20100094603fb2bfabf20a8e6bf19dba289ebd4e7fd06ff66f35e8c58f71b13ce32176ddec3020602094603243a4448027912e541a1827426b5798228bbd712a8413da1fbf29489b54259fd001f3c235b9023afe2ffffff1102000000004000000000000000033b36b3000000016853d871000035308f6d304302eb9f5920030405284801013d2781ba26635501da420d9bafb08574c1cd7f134452c07898abbd48aae06e1100222213fa03192eef62f11df4b0063b21d90000000000000000ffffffffffffffff80c64bbbd8bc477d2b9c0ac8b6ec86209000035308f5dee0402eb9f5a91f3e3e70b8c2c7ab933cbf41f1cd903833692baca2ea3864b34d945a768260b1dcbb8e39ad8198e6f289d542d7360bfee4740f75914672387d843a6f084a18783b231467d018c9777b1788efa507083b284801016978b81adc8b8991a48bbdd3f86d638c24a3ba9b9e0f367f9bc2c8c6dac33ee5020323133d01247bc6f4a7e9ea18090a3b23133d010e40f4ca0ebd54380b0c1128480101934d481b415d17257bef3fc7d9511c8f5876d37455952c3d91b47a88b792791a01c223133d010a2f60b0b36506d80d0e11284801019cb418f3d7ff026770ba58e117a5017b36d974571e0c8993f561cd7a816115fe018c284801017df1df489fde7757411480f12f693d78df72cf9967730113f8798f112b8479b901fe23133d0106c33f60a40d2b580f101122113ce16bcd5b3d9cf628121328480101cbbffc160e3d2ba5134a4c4c61149cdadea84f006d82298fec37493aa001a104015528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf5000028480101621edda6d6f0c9e580a2af6ce7aa48339d4dcb90da3ef8eac9fc28e43ba47fd70188221100e0cd200113c654c81415284801012b56484dcabe92959bf581465b407d3d08920b1339dd66948032d36b4b9e1b950140221100e0a3aea80f6c11881617221100e0968e58ac2eb3081819284801018ff3cd01df5830fcfcb0aceaf2413d8303bb9fc72d1cb4a158f10e24fba61b76004628480101f94120c5dbe0b63af7c90a2449c538d00814d5eca7e73ff19102c30a7a3e986600ad220f00c4b6f56b43ad881a1b220f00c27f362faea9281c1d284801010ebce7216e90e163bea7bf99b3c96298dc7bbd65e85bf9f1b41be22bf53af820002b28480101955b7618c430824d517a71f426e9052a651dcae5b9d457ae434716e8b38843e50028220f00c0c18794584e081e1f220f00c091ab161053082021284801010e9fc8803e882653e2dd73ba430dc8048988848123a7e07b046e247cd0d6fe03002728480101810b35523ba79ac20432db5bda2bb9f45cc6c87d7198f3e800f3b04b5e4023dc0026220f00c0361a0833b0082223220d00b4e2d456b5882425284801015bc60e6ddc6d8a5538da4c0b5b6a2bb43c44d4308391f74ab187a2a1d7ec12f9002428480101e5098a6af7718f2ee965b1cde88d62eaaea80f62a0912d1d3a9f66c7152cf8a50020220d00a7d295d791282627284801012362cfcf17c17789fde1d7dc6f837e0c8a3dd24bb9d80aad5737481fd986d1d3001b220d00a1d53c7befe82829220d00a0f3435c8d082a2b28480101f9a3c767071da700bddea034309448bd36d19fee239019c1a4ed7c3a7de571df001c220d00a056938fdb882c2d284801019619c41e1ac2e5af5afa17bc7f6a5a93be5fcf1666fa21816cff8fb96ff9c8240019284801010ec20e9bc44aed8d2fcfcf9fcbf5aa417ef5ca29bb2944f057d855c1f46f3c870016220d00a02fa2fe92282e2f220d00a02b8f7ac908303128480101ca690cfd4c0e5c42a28292a6a9b7d707ba4851cded8ef195333373ce085f51b60015220d00a028ba0accc83233284801015a85e336325edaa75dfa692816fba15d7a9e5b84825f629cd524a694fcb48b330014284801013a1d209c088b4d3ce8b2421bc00666c604f8561fe5eed1ebd65250f591b7c9e5000d220d00a02832b973683435284801017827cc13e4568d8cdcc00c15858be04c11d21f7896acf62ae8a7b79d874ccc1e000b220d00a0279543d7a83637220d00a02768fdfd88383928480101a467aa248c5344887d1ad4b3638e59c00c1a100627e895ee8f6bda5fa66d4ac7000a284801012074a26d5a391e771a326e483f13c12d9012484e4aab92184e2a231312015252000a2199b96bc701d5d251b6791c471b3781ac352641fb8578f45ed90fadfdbf241005013a4d0a9b5c2cff9d320ec68f67bbc7d66f758b3b61b60c4f6f069a99777f4b369947b00100001a4f4d1d3ba0c03a284801014ba6e3d86c5a82d9887cc9ef06cf379ae28df0470374aabe2fc61bba2c949f90000828480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be0000241011ef55aaffffff113d3e3f4002a09bc7a987000000008401033b36b300000001020000000040000000000000006853d871000035308f6d3040000035308f6d3043146f6372000ac2f802eb9f5902eb69b0c40000000b00000000000001ee414228480101816bc317f7d34c8156f3052d54059d5506506fe5afc98aadab9dca6f3013276d00022a8a045fca2dedec2ce37a70ffc016c81fbbd8d569cb6dd205c6b9b00aaea74ff667defb2bfabf20a8e6bf19dba289ebd4e7fd06ff66f35e8c58f71b13ce32176ddec302060206434428480101441199c10268e64200a86c814ef6a00bd83bc5868aead59c34184aef2910f56d00100098000035308f5dee0402eb9f5a91f3e3e70b8c2c7ab933cbf41f1cd903833692baca2ea3864b34d945a768260b1dcbb8e39ad8198e6f289d542d7360bfee4740f75914672387d843a6f084a1870098000035308f5dee09033b36b2d245c34a9ad638bc19d6b8786b2e7e1a28c8c518ffa3417ff0dd49a86d4320a09762c3201834682be64f982513093cca2b460ab1b1ac5e0061507a06c1e3ca6a688c01035fca2dedec2ce37a70ffc016c81fbbd8d569cb6dd205c6b9b00aaea74ff667de752e71f20997d1ed471e5b3c6a3156750d13498b02e9094f96cf22ebc9d7404d0206001d688c0103fb2bfabf20a8e6bf19dba289ebd4e7fd06ff66f35e8c58f71b13ce32176ddec300e6279c8cfa79896d8eaf40a6c3850b711ca2d6d42514fc3d0bd6ae8b3ccd070206001d",
        "state": "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520"
    },
    {
        "id": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996188,
            "rootHash": "d0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be",
            "fileHash": "7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db8"
        },
        "shardblk": {
            "workchain": 0,
            "shard": "6000000000000000",
            "seqno": 54212274,
            "rootHash": "d245c34a9ad638bc19d6b8786b2e7e1a28c8c518ffa3417ff0dd49a86d4320a0",
            "fileHash": "9762c3201834682be64f982513093cca2b460ab1b1ac5e0061507a06c1e3ca6a"
        },
        "shardProof": "b5ee9c7201021d0200050f0100094603022cf2517395fec6c4108022861c398894c00f54b985adba951a8f0c5d96b448016f02094603d0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be001715245b9023afe2ffffff1100ffffffff000000000000000002eb9f5c000000016853d873000035308f7c728402eb9f59600304050628480101a03b7f365c32f764126999587b3e0002ccae43b251eaa6ef4fe46810127d40250001284801013d02410f2798190ab0daf04ba9096233613e1a5f376c19248bc7dd37f84469fd016e22330000000000000000ffffffffffffffff81ae20a10429c7f1c82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23a576f8bd60b817e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101769753258eb1145bc83b4d7e91fecd7ed720a182a3aba9a133629d58ad051b9500292103d0400d2848010149a0d1dc18aef7adee0d35c6a18027d673ee6587cf6ef13ac980fb5c2e16f1b5001222bf00014deadb89000abc23600006a611eda608880001a967ef67e620175b4d861218ea74c536b388c9309035bda6c95fb4859c66eb796974f22eda0682fc0b7c902988f62ebf68280bef390611b98ad115bbd199c002870d7dc4dc269292ece8be131428480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b600012201c00e0f2201c010112848010141c8113caa94d2bac7961da72f9a1b4314413681c1198509a19b0381d404fe64000228480101d0fb02919345b659e9fca6267379e5c54e4531b6edb1d034f2b8207aea974021000101db5019d9b590175cfae00001a9847aef70000001a9847aef704e922e1a54d6b1c5e0ceb5c3c35973f0d1464628c7fd1a0bff86ea4d436a190504bb161900c1a3415f327cc1289849e6515a30558d8d62f0030a83d0360f1e535080005617c30000000000000000175cfacb429ec372120013411d7517a20773594020284801016c0d974fd2ee208e7e8d642178aec3a3a31f768b2875733f7c77294b6abb8a72001a284801019c4a03ad4491c3e50817aacfac5936de7ac1a87c89211a7cd53b59b6c49565c60012241011ef55aaffffff111617181901a09bc7a98700000000040102eb9f5c0000000100ffffffff00000000000000006853d873000035308f7c7280000035308f7c7284591ace7e000abc2302eb9f5902eb69b0c40000000b00000000000001ee1a284801019fdf054d07eb0b01f08d7b515e98dfd619d1de08bb19aa6d171395d54408ec8400032a8a041153e4203d88c8bd5593b782cb04a2b574335bab5156524fb1e8f2585cc2e81a022cf2517395fec6c4108022861c398894c00f54b985adba951a8f0c5d96b448016f016f1b1c284801017d8f327ee6a46ab5ab6306706db39912cb547e53320a34491164b709bd00566700070098000035308f6d304402eb9f5bd5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf076211032915e694c41a769d41d0be88d55ed62156764576b77ed46aeb50f3ad6ff4c688c01031153e4203d88c8bd5593b782cb04a2b574335bab5156524fb1e8f2585cc2e81a98312844f6fd272fd699bd7e145abcb4a419f933c96c3738c207d9e7bab36deb016f0014688c0103022cf2517395fec6c4108022861c398894c00f54b985adba9

[Content truncated due to size limit]


================================================
FILE: sources/tests/offline-data/last-mc-blocks.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/offline-data/last-mc-blocks.ts
================================================
import {BlockId} from "@ton/sandbox"

export const lastMcBlocks: BlockId[] = [
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996197,
        rootHash: Buffer.from(
            "c886c93795f6c13e2b3f32f6b7e82f06d55ace4b3431636e803eb210ca9643a0",
            "hex",
        ),
        fileHash: Buffer.from(
            "fe33f609f8921edba74abf04b2cee23ac09c6aa79fd0b3ed439d0323e89a5541",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996196,
        rootHash: Buffer.from(
            "b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e7",
            "hex",
        ),
        fileHash: Buffer.from(
            "4a5c0ae47effe610f1b385866a9b54b825bc71f27183cc67978cd1b308ce7462",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996195,
        rootHash: Buffer.from(
            "c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6b",
            "hex",
        ),
        fileHash: Buffer.from(
            "ea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd03284",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996194,
        rootHash: Buffer.from(
            "ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9dd",
            "hex",
        ),
        fileHash: Buffer.from(
            "fa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a7",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996193,
        rootHash: Buffer.from(
            "e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e",
            "hex",
        ),
        fileHash: Buffer.from(
            "73ec63401f75ac3e894cc86dc109cc65d84873570eff778d2de8266d4a29ac5c",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996192,
        rootHash: Buffer.from(
            "5951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b8",
            "hex",
        ),
        fileHash: Buffer.from(
            "6b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef2",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996191,
        rootHash: Buffer.from(
            "492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490",
            "hex",
        ),
        fileHash: Buffer.from(
            "801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad48",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996190,
        rootHash: Buffer.from(
            "d27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819",
            "hex",
        ),
        fileHash: Buffer.from(
            "721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc69",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996189,
        rootHash: Buffer.from(
            "f44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d4487",
            "hex",
        ),
        fileHash: Buffer.from(
            "6343e61a7a543c198dc6aa73af46bd0f1245e76d14087f0673c894f271ccec47",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996188,
        rootHash: Buffer.from(
            "d0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be",
            "hex",
        ),
        fileHash: Buffer.from(
            "7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db8",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996187,
        rootHash: Buffer.from(
            "d5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf07621",
            "hex",
        ),
        fileHash: Buffer.from(
            "1032915e694c41a769d41d0be88d55ed62156764576b77ed46aeb50f3ad6ff4c",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996186,
        rootHash: Buffer.from(
            "91f3e3e70b8c2c7ab933cbf41f1cd903833692baca2ea3864b34d945a768260b",
            "hex",
        ),
        fileHash: Buffer.from(
            "1dcbb8e39ad8198e6f289d542d7360bfee4740f75914672387d843a6f084a187",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996185,
        rootHash: Buffer.from(
            "d277fcc21b6983234808c7ba368236900bf4d11895cb490ab2359f5baaeddb93",
            "hex",
        ),
        fileHash: Buffer.from(
            "cb7b100f4fbf9fbef7c1c5363d5407fbac8cc4a109e5597ff65e3de5950fe5e3",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996184,
        rootHash: Buffer.from(
            "ddd3cf5b8384c8fb1e85155badce432ee93af36efd0f332ab59df73f87a47ca7",
            "hex",
        ),
        fileHash: Buffer.from(
            "47b884014c9833827de738899afadee7f1b031e4721209c4da8b4509297ba725",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996183,
        rootHash: Buffer.from(
            "d8552066c07713a98674115a491cbf7c67ae49e3c5f6b223717ac38af7234696",
            "hex",
        ),
        fileHash: Buffer.from(
            "d40ee42118f20f017fcbca15a910cc06defd8e9701cc92adb16940c7dd209bac",
            "hex",
        ),
    },
    {
        workchain: -1,
        shard: 9223372036854775808n,
        seqno: 48996182,
        rootHash: Buffer.from(
            "548271992eea933b79c1d66deede9cc1ec059a4660d1e08a302f4c2305c5a349",
            "hex",
        ),
        fileHash: Buffer.from(
            "1c5208a3f9fba0fd9b64940fd65ebb2c76d01af6e3c85afa9dbe44cd79d3e4cb",
            "hex",
        ),
    },
]



================================================
FILE: sources/tests/offline-data/shardProofs.json
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/offline-data/shardProofs.json
================================================
[
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996197,
            "rootHash": "c886c93795f6c13e2b3f32f6b7e82f06d55ace4b3431636e803eb210ca9643a0",
            "fileHash": "fe33f609f8921edba74abf04b2cee23ac09c6aa79fd0b3ed439d0323e89a5541"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212285,
                    "rootHash": "de47172c8d9225a8efa63dc9dbd19d9c5e336bab682f680667c96bccfb000cd7",
                    "fileHash": "f057791df84899a000aba559d137be33989d9281c72443574f3162239c7d838a"
                },
                "proof": "b5ee9c720102140100027900094603c886c93795f6c13e2b3f32f6b7e82f06d55ace4b3431636e803eb210ca9643a0001601241011ef55aaffffff110203040528480101e361e2af1dbb510497268ba99b02b2f1cefbc60d932b284ee2ba6bb6506a6eee00012848010159f88539fa37ffd9e398d262a2133f8cb8955ee815f68f7b4f81eed06b21866b000328480101b61885ca93da73ca13097948c49903d39f3c606673156baad3e482ceae74f70a001524894a33f6fd932cc3c6d1af52eeb512aa16d246bc8d3fc1950ecede54c4adaa97eae2c7b036effbe05911e58a4be9531a97207ddbf9a174b93f4a73a08ca6b059544a0d604cc00607080928480101f4ecbeb0591d1f812301112031820bab0a337a80304d1a6c94feb27702165a3e000400010228480101de4cb5cdd3822958085a8c29915967ed40aff8f59481eb7d2b5695d6ca22cfed00062317cca568b12a799644a817c8040a0b0c2103d0400d28480101331d6e149c1b30c295505b41cd83e5bd3082b88f8426c42e9cda981056d85e3b0002210150132201c00e0f2201c01011284801019a22e169d523ca10ff33326b01e173fa207f7e8b4993bb837a1a90a7cf4f0326000228480101a1a3ff24fa39dd353e5d36eaeb3096d63f9bef9186e9fa6fdf37839e8ebc08e1000101db5019d9b5e8175cfb280001a98480a848000001a98480a8482ef238b9646c912d477d31ee4ede8cece2f19b5d5b417b40333e4b5e67d80066bf82bbc8efc244cd00055d2ace89bdf19cc4ec940e39221aba798b111ce3ec1c5080005617c30000000000000000175cfb1b429ec44212001341f033f6b20ee6b28020284801014d34699191975088f75674e3f686fe31d8bf3affd89474b4fbff617784b72ea40003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996196,
            "rootHash": "b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e7",
            "fileHash": "4a5c0ae47effe610f1b385866a9b54b825bc71f27183cc67978cd1b308ce7462"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212283,
                    "rootHash": "56396115445f8b0648c0157d46417ef7bac0e6707a53711dcd887339da35ec5e",
                    "fileHash": "03bba1b0d9dae8aba6c2dda5118f9a36615a02c6c9982c1202079e1df609ed2c"
                },
                "proof": "b5ee9c720102140100027900094603b52eaeea72ea914f2b608b96ff61b9c1deee542fb4acef209e89c598a58268e7001601241011ef55aaffffff110203040528480101975b43e739e01123731c95be8c340c2b72ed508245fdcd3ec469a35e3488498300012848010156c7f373b8e57997a12e8faccb3e15c05d391f5fa796d0d4d6eb832581ada2be0003284801017639faa3c5186087c2c031c28917e3aa98676786861164bda37d5b0004388692001524894a33f6fdda96c8cf5e3b891f1da5ad803b61a6d8c3cf065b186a19e103181954f9f2c0e6effbe05911e58a4be9531a97207ddbf9a174b93f4a73a08ca6b059544a0d604cc00607080928480101a48d89bdc04bb1d1a4ea6503a88bfd86bca1d7b77f5b5b17e75429e2eecb410400040001022848010187c616366cc84999c937caec34e197b4d67bfb520e7c8868ce549abd9d91f4d600062317cca568e695f77c4684ee18040a0b0c2103d0400d2848010127928a834df580c3e90f57ccc7aaefa1e11e19f7343bbafa4873d024785a33ae0002210150132201c00e0f2201c0101128480101c76f1f10b970795eb24d1892bce0e674040d0a7b592dd3709f96ea425aaf83d20002284801012a68b0fc2fc5a1c6f722bda0953e6329fb4479401bcd1ea61b665d41dfa883dd000101db5019d9b5d8175cfb200001a9847fb424000001a9847fb42422b1cb08aa22fc58324600abea320bf7bdd6073383d29b88ee6c4399ced1af62f01ddd0d86ced7455d3616ed288c7cd1b30ad016364cc16090103cf0efb04f696080005617c30000000000000000175cfb13429ec41a120013411a268f62077359402028480101d2ec5ce38675fdabf7398e7a2aa52b237c4665e8d21100c076107c8c6be2401f0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996195,
            "rootHash": "c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6b",
            "fileHash": "ea6cd83768cd3baa7be704dc89fab3184cf39f22a1c308e7468a307e6bd03284"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212282,
                    "rootHash": "f9708987eb72977ebc6e69dd82b11c6a0cb021938f5264ebbec7a7f9e4b2d880",
                    "fileHash": "08f0311954a57c082443a3f28c94dcf8c72886adf49e30b527311af62fb48174"
                },
                "proof": "b5ee9c720102140100027900094603c5a4416fb79921d7631ead937023da2f6d4cac549907c048cca5686d84f7fe6b001601241011ef55aaffffff110203040528480101d45fb4509563b7d783b78d071baa676631c78e9ed3587e409c720159f6bb0ada00012848010111cd6a40f35f77a8013411786dd8fc62a83839aff0aa6a12aefa20e35d0de4f3000328480101b076d93cfbf0c6f9e072e1b7a2856396850351cbacd32cba75fcdd7be9310f3c001524894a33f6fd1ad0a92b89b1433541c5b8d0e1d526fd9e9df63056580da8ff730e018a930c1d1e3836e60f351a69432976d479e3fef698b9e9a4c0c7ba323dec2f2bcc0cf59ec0060708092848010175dac31ce0f5f00be8fa1722982b453ab17d7e811f602968ca476ac72bf65ca2000400010228480101bd972de7ba5bac22c06018993d31996cede9c7fb2b1a400a9f6c99f769696e9900062317cca568ad55656844a817c8040a0b0c2103d0400d284801015ed8086a7ff527db29352030963722ed176db8eadb159bc2a78ae89bd8c326b00002210150132201c00e0f2201c01011284801017315984be4737f2074652a4cd324a5f19f0a4b39850f3665e5406dc449fd3444000228480101ccec6392ef295ced39dc9e9b960d8b3b3fed242e2c71ab131cddac0e3669dec0000101db5019d9b5d0175cfb180001a9847f3a12000001a9847f3a124fcb844c3f5b94bbf5e3734eec1588e35065810c9c7a93275df63d3fcf2596c400478188caa52be041221d1f9464a6e7c63944356fa4f185a93988d7b17da40ba080005617c30000000000000000175cfb03429ec40a12001341289f64e2077359402028480101936c9bede9c20d61cc621e952f1c42f324c913b5e692111fc20fd0f4c7e204c40003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996194,
            "rootHash": "ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9dd",
            "fileHash": "fa338f36a6f6e57850d5d5c8405b04312ff3e09c4ad927c072563359a47ee1a7"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212281,
                    "rootHash": "be2dc1089c67a1ba56e76965d7ee40fbf46ed477bf6d8b22e5893d5c695020ae",
                    "fileHash": "920ca1b23f0289468dbc92f1d916c5ea69ced2b0413cc1f9cad22c800c6bafaf"
                },
                "proof": "b5ee9c720102140100027900094603ff37113ac8e230da59d46e648a8cd9d742324966ef5a413d32ecebd7b8dba9dd001501241011ef55aaffffff1102030405284801015b213bebc9046f98a77d0345dc130591df044dae63c975aafc95931f06f8dc0500012848010170be15775d0a9b8272d6aba896eac28185138f455c6a1b0e9a470d6d0dc3991a000328480101b8cfe0d7472cc6f39d75c5ac215396399ec2d5e7a0c2e808e16b6804ab81543e001424894a33f6fdeb910f49f12a71542ce7de3b3645c67df79975c5922b09fe6b8b2ef66c022668fc5361dc94c11bf602223a97cb1f62981f717c3b3666132bb638a8aafc409873c00607080928480101f3de4510c656dc86f9422cf07155c477f9c3f3bca5afdf5e693b0755ffae5405000400010228480101f7ed21c9cf854d7bb067a9dcb6da49ddff5d7e909c4d561a7831ba6454439ca500062317cca5686e0e0ff642cb4178040a0b0c2103d0400d28480101b804f866a1acfe9e6dc37fc1cd4a5455299d1f054d2d11d082db5ba7594f68dc0002210150132201c00e0f2201c0101128480101960cfd762e1171a30243d3dedb24f23e26da99e4129b0ff0fa2adc78f67cb5ba0002284801018c271a48caa482c9bba5b546ce7510ecee37d7cb3766c9f6a078f84142c9ee66000101db5019d9b5c8175cfb100001a9847ec000000001a9847ec00035f16e0844e33d0dd2b73b4b2ebf7207dfa376a3bdfb6c59172c49eae34a81057490650d91f8144a346de4978ec8b62f534e76958209e60fce56916400635d7d7880005617c30000000000000000175cfafb429ec3f2120013410a32d3f20773594020284801016aa17308774a3df01948c37e6967ec9853bdd1a86b47f1c87985e63dd9da24c70003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996193,
            "rootHash": "e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e",
            "fileHash": "73ec63401f75ac3e894cc86dc109cc65d84873570eff778d2de8266d4a29ac5c"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212280,
                    "rootHash": "d5da945cddfde4fcbd70f18b24a2f271348c3c9dbdb8abecea734d5da643ebb6",
                    "fileHash": "5f3726f30f0f55d736a443970a8768f8ee5d071042707ca99a60fb3ec892db4a"
                },
                "proof": "b5ee9c720102140100027900094603e5f83536f1514c6b0664e17e7be324143a251162991977f597eca0e1b254182e001501241011ef55aaffffff1102030405284801012f77514c87d33f4931dcec2276d7f2d4ed776d6643b28f30275755227b9b8071000128480101aa1cc98386d93e38a4faf74f3ce4ed3b4fbbd875be3e5490d2facd5f92299de5000328480101bba600c5a8ccdc98bc0a8c7431af52254fcd9a5da57f50dded5d35e5adcf5c78001424894a33f6fd8827e85de20d849e0c09466d55baaa9f978721ce6c14eef25a3fa8d1ad61f03f606d608c2cb8f5edaf76a3caaeb4192b1d40153c3ddf027fac3c788c4cc16ab5c0060708092848010126fdb33cf094581607e263a2e67233e56176e061195ee53e9ec70a7ac3b5eac70004000102284801013a87b151178c1991be82ac9b4a9dd7869fbe6514f2fbaf29589411a5b5774b3700062317cca5687a12f38e43b9aca0040a0b0c2103d0400d2848010102649961b376fe67e46d8b96e5fd324aa4a9ca17455aaa8eaf13e5e5e1e680f70002210150132201c00e0f2201c010112848010136fc005217a16ba820bdf83a3783ae7b1ff2da91dadbdccde2ed3512ce0355060002284801018c271a48caa482c9bba5b546ce7510ecee37d7cb3766c9f6a078f84142c9ee66000101db5019d9b5c0175cfb080001a9847e45ee000001a9847e45ee0eaed4a2e6efef27e5eb878c5925179389a461e4ededc55f67539a6aed321f5db2f9b93798787aaeb9b5221cb8543b47c772e838821383e54cd307d9f64496da5080005617c30000000000000000175cfaf3429ec3e212001340ee6b28020773594020284801013db4642286104525e836443bd11154dedbc87b2a6ffda1b6b108b3ea5c44c6e20003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996192,
            "rootHash": "5951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b8",
            "fileHash": "6b155b13bf764e424a846fe6313db9a2d9b8b187de25655371f01ad9315ceef2"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212279,
                    "rootHash": "eb88d81fc77cc18c2f8c208169862da413cec4c9425bfd66fd0e0ca001ebd290",
                    "fileHash": "83087c1dd5f543603e842da0b9613235c9b907e8414c90ac281fc26fffb1bb13"
                },
                "proof": "b5ee9c7201021401000279000946035951c40a3aa1b79f6686425b6cc9d6359ae919732bde14ce3a2df9c2d32a17b8001801241011ef55aaffffff1102030405284801015de1f6ba9b563c9bab6318df5be4f4582f21806883b45a5c9f521cf775866aea000128480101e8a54ff91b9bfeeb37cc3bd150e9f393ca650e59ec4423053194b4a1775cd04c0003284801017456f2435c0d445bfd793b1e82a3cb2aac611331f58cf5b05675378c001d7396001724894a33f6fd0683806ef1c79e026400b83848685b4654d2b4a0f6f69039965c0aa6004a40954b605ac21a2679ef8804ae43078da058b1a87d95e23ff712253149a1d528fa13c00607080928480101cf2ff6832e4ad0172c4d3f1bed820ccb06e1a8a7f831e7a39b729c1fd95b32b100040001022848010124782f8caee1343ff6fc22874919336c6b2c8d9b8fbe3d6587fe8833a187d11c00062317cca568e9896f464684ee18040a0b0c2103d0400d284801018cd1d466556c497ffdedcdd882fd62c558914cc831e7656a8e5bbd291ebce6320002210150132201c00e0f2201c010112848010118f8dd0e77010ec3ea42d9a5037d46a0d30bf168ecc5737b597c3c690b582ebb00022848010188d0946c46305f4462816af97caac0f7d856f1f86ee300277d2a461ad5a69981000101db5019d9b5b8175cfb000001a9847dcbdc000001a9847dcbdc2f5c46c0fe3be60c617c61040b4c316d209e76264a12dfeb37e87065000f5e94841843e0eeafaa1b01f4216d05cb0991ae4dc83f420a64856140fe137ffd8dd89880005617c30000000000000000175cfaf3429ec3d2120013420cc0e5520ee6b280202848010187389fe193072c05c2e56f20d0920b6ee5a2f872d8784b3c42930f3f6af65dea0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996191,
            "rootHash": "492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490",
            "fileHash": "801eab9362c333a982f3d6b8b637bf8867b9e83f428d606552371f3d87c3ad48"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212277,
                    "rootHash": "520b357d77a9816ff22a80233d17d54ac59b6d7f91bf8d55fda8be581df760bf",
                    "fileHash": "1a6c789d560e0ee7e8fb3d448daacd5c8f0aca242aa6846b659270ca9c56a43b"
                },
                "proof": "b5ee9c720102140100027900094603492c7c64936f5efa355c64b22f86f0041e4425bd7f360f3d0d76ba44d8270490001801241011ef55aaffffff110203040528480101c70591738fc8704070e5e10e97291876fd88bbd3442eeff5d2104210630db1cd000128480101c50b34ad1dc07885f1a7de6f688c72ae798b074b4f8cc4e613e6271fa7765bd00003284801012d3895bbec9e52b9906f7687bfa707eb1419506bac07e5a9b997a6f64a9fd8a8001724894a33f6fd921e347b2be650c56dccabfc74226a30f026475076185bf9094b20638ff6177c0b8a6507b239c16b61067174bf3e8a80dbc98894c2fa63d99d86f87b5498e9b6c0060708092848010120a3c70dfffa4a212a87f6b8deb4fb106731ee982c2e36a5ccaadcd6ffa7c5cc000400010228480101fbb384fc3ee9791e7f4e539e3b281558115891d2d871aa9794b2759caa082e0f00062317cca56869efc37a42cb4178040a0b0c2103d0400d284801012e8a71a87c53c954fb239d20e9f1cf4c8b1b6b154987b8062f43284fa90e6ad40002210150132201c00e0f2201c010112848010108827131afb3feb1b9e64780c74643e9efb8d01855eb7e9c517763835815030900022848010155276f4a3cf7e98c46c00e586243fb4b056b3e8cfcc211fcd04472949cc9ce3c000101db5019d9b5a8175cfaf80001a9847c5da6000001a9847c5da6329059abebbd4c0b7f91540119e8beaa562cdb6bfc8dfc6aafed45f2c0efbb05f8d363c4eab070773f47d9ea246d566ae4785651215534235b2c938654e2b521d880005617c30000000000000000175cfae3429ec3aa120013412dd093b207735940202848010184f3946d7bf60310db2ad7ac90f3ab64811dd9cc236c7f30c10f9f6d478e694a0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996190,
            "rootHash": "d27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819",
            "fileHash": "721fec3b35ee8a74e86f8d3dc35dfafc008da6389f27d06350e716ca0a02fc69"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212276,
                    "rootHash": "4f517ef37791cf946232f9561785f199801aa016e9e40ccd35827ba65b74d67f",
                    "fileHash": "058b6aeaa8d7eebcef25d166113dc7408a74885145d08450c824649fa07f8b53"
                },
                "proof": "b5ee9c720102140100027900094603d27207560c05e9d520bdea5a7c006ddf222d044c69fb165b6acca25ecd2dd819001701241011ef55aaffffff110203040528480101b0cff900ddb1e66aecc556814b22c0be041c8c6583f9888348de659ebe3fdcd6000128480101970f9a161fe343539e33014261a350e89d264b829ea2052e829b4bda0e9b02e100032848010132d8272f9fa77ad373612ad018de3af7a01757b42c007cb094a3d87a7d0cc5a6001624894a33f6fd8d917f30071c8cee3b865a4394748e4cfc12a581539243200c2ea09521aca9fb04a789cff73a753dc2b0f898aaf9cf3e0fbde982e9ebfdde0c960a35c6de92bdc00607080928480101b994835e2103236c6aef5e37e79218bce1882fab2b2b21eb3e9bdfa083a19e3a000400010228480101c9d4bd2272a32a9f5b552c8ca776b87f57bb1153ab1dbc42070c93ef87da7cd800062317cca568a3d9e39244a817c8040a0b0c2103d0400d28480101f4c60f6694f03a52ec83f8eece43156d304a3b4cd8a0af43a2de23bd01cb20dc0002210150132201c00e0f2201c01011284801014e736146ae7eeafeec500e7c3ff0deddda6095318d1e26c9558982cc42e1bf3a00022848010146be5dbead85fd62d818ca4a7ddf277406daa3c3ec7eb510f7986f60c2cc0b6e000101db5019d9b5a0175cfaf00001a9847be394000001a9847be3942a7a8bf79bbc8e7ca31197cab0bc2f8ccc00d500b74f206669ac13dd32dba6b3f82c5b575546bf75e7792e8b3089ee3a0453a4428a2e842286412324fd03fc5a9880005617c30000000000000000175cfadb429ec39a12001341036aeb92077359402028480101abc06401d5adb3a8c1a27b6aa3a66b044edb8fe74c533607e0ff16f691367f110003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996189,
            "rootHash": "f44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d4487",
            "fileHash": "6343e61a7a543c198dc6aa73af46bd0f1245e76d14087f0673c894f271ccec47"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212275,
                    "rootHash": "243a4448027912e541a1827426b5798228bbd712a8413da1fbf29489b54259fd",
                    "fileHash": "a4f3a6bbe3b2b476cc97be9d0aff5aa0a32b83b194b0202bf26fd8eda9bd5611"
                },
                "proof": "b5ee9c720102140100027900094603f44243286033b11585123535c5a9f7e357227675c23e6f5118071a4e926d4487001701241011ef55aaffffff110203040528480101d30be90f48873a7667a44b6f360144f1447d33ada6bd41cd627bd6b443aab57e000128480101565247c9069b4ada551d607f3016fbf9df947ed4d1ad990211928c2aeda6ff44000328480101fd3506ddfb01ce9463f4d86c0c3ddaeccc09ccae32f90a5bac8d45cd331b2a0e001624894a33f6fd5f6c3ce738bc7eaa8a8d4f87197c3bc09930818164f157a95ba015b7a272e253eea781ae07f320eb1aa4dadd57852beaa3993efedca8d04804056f145099927ac00607080928480101e280d2df18cc0175312de28c78c2207aada7d8549bf0aa8ffebdfcab3f9311a00004000102284801012ea47e23ecaecd9ad3e9d48f94db145250c25c91dcc8ee3ece9c5ebace1af5e300062317cca5687c45153c43b9aca0040a0b0c2103d0400d284801017aaae482ef3dc967fc574da51068c4465d4b7b158e11a40fd7894d1fbf4d87f60002210150132201c00e0f2201c01011284801019cded90c93c1ea68d252bd58d9862bc3f8c75150f6206b86fc2fe99af2953640000228480101b9ebbd6cf944899e96865637189916c16b4aa8024ac502a67dd217e1df7da5d8000101db5019d9b598175cfae80001a9847b6982000001a9847b69821921d2224013c8972a0d0c13a135abcc1145deb8954209ed0fdf94a44daa12cfed279d35df1d95a3b664bdf4e857fad505195c1d8ca581015f937ec76d4deab08880005617c30000000000000000175cfacb429ec38a12001340f687efc207735940202848010123a7bf93853e5320727fddf44d7d71adee5f10fe35205d4d30735007876537060003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996188,
            "rootHash": "d0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be",
            "fileHash": "7a5b7393c4b042f124b936cfcfca600c0c0abb2683460c0a1ac862ba29eb7db8"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212274,
                    "rootHash": "d245c34a9ad638bc19d6b8786b2e7e1a28c8c518ffa3417ff0dd49a86d4320a0",
                    "fileHash": "9762c3201834682be64f982513093cca2b460ab1b1ac5e0061507a06c1e3ca6a"
                },
                "proof": "b5ee9c720102140100027900094603d0df112bf4d1892b22b825d872b1410c718418dfc9e63c4cd956b4c6475f61be001701241011ef55aaffffff1102030405284801011d060a63223e8f43b4591315dc7bb57020a4d993b701a87fc0035b44241154e20001284801019fdf054d07eb0b01f08d7b515e98dfd619d1de08bb19aa6d171395d54408ec8400032848010114a3c012583b06d3c560543d1118c20ef7445de2ae57bceb497e2d6fed836597001624894a33f6fd18a0c39dc1cef4e97562b4fbf40f9541f11b0860332c97837adf94ca2c7ecc74c459d4a9ade1c4511f8881283b386b8dd8b3c188dbad2d0dea4262cd4eec8d48c00607080928480101b3f0d2130618bf49163795f761701e1ae61070c3f9ee162af5ca5fa1d04151c0000400010228480101ac459ce009ed652f4ee6d9e8f6cf1a543e6c584555129746ff1a11e2cee4f3fe00062317cca5688d66e89043b9aca0040a0b0c2103d0400d284801015dc1ff421dacc8a8ba3b7ef7ac2d82b55490475fe33655f2cd675185b3ef0e170002210150132201c00e0f2201c010112848010141c8113caa94d2bac7961da72f9a1b4314413681c1198509a19b0381d404fe64000228480101d0fb02919345b659e9fca6267379e5c54e4531b6edb1d034f2b8207aea974021000101db5019d9b590175cfae00001a9847aef70000001a9847aef704e922e1a54d6b1c5e0ceb5c3c35973f0d1464628c7fd1a0bff86ea4d436a190504bb161900c1a3415f327cc1289849e6515a30558d8d62f0030a83d0360f1e535080005617c30000000000000000175cfacb429ec372120013411d7517a2077359402028480101de5d838e49111719d873561f1b375dbeb4db7edcb39ce953282207d8350f70de0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996187,
            "rootHash": "d5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf07621",
            "fileHash": "1032915e694c41a769d41d0be88d55ed62156764576b77ed46aeb50f3ad6ff4c"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212273,
                    "rootHash": "f2928e629ee5cbeeea23d152ccec1394fe506ac77d40fe78333d32288f40cdb1",
                    "fileHash": "6b0320c378048a4405a7af4c3291464093723a68c81ab701bc7150e30f3aa4cb"
                },
                "proof": "b5ee9c720102140100027900094603d5dc28c22b57685ac83b15d0516296afe6c84339d785e4e691515bbddcf07621001701241011ef55aaffffff11020304052848010188f7f3643ce03c2e4b128bb36372de5d75e17648f35b16ab217b59a7223f4190000128480101a0dd11798c1e50c29e0d1f5b90a895b360b7d63388e71c5bf9884371bfddf3eb000328480101ad927e1d7fe53e4f406c28bcfbf13e376176b829c116f85f06d6920165da780a001624894a33f6fd4f321f1ac78386a474621925911ebc6ee7f061e8a68d90f948a1f15bf9563c8e97c6111b9200f290c016a582f4bfd717457d73ed54299fec89be1cffbe0bcb87c006070809284801018f65b15f9958f20272fcaa59a5eeae9daf47b2ba042ddadb192563d4972767df0004000102284801019d9264ab56bdb3cefadfa2746f8f2539e79e076627bfaea96d2c22965da0a68400062317cca568844a47de43b9aca0040a0b0c2103d0400d28480101411c0190d8985c36a247ec549d8c406228e1721c0cbb438358d8ef822837e5ea0002210150132201c00e0f2201c01011284801016b99f2ba20c5eaa6d6bdf3d0e08d2e4ed8b5402ee9d4a9979a1c439ab6cd83b2000228480101e08f5328ab649d953beac7c0ef10f32ae265db7db883e62432605dcf9c88b58e000101db5019d9b588175cfad80001a9847a755e000001a9847a755e2f94947314f72e5f77511e8a9667609ca7f283563bea07f3c199e991447a066d8b5819061bc02452202d3d7a61948a32049b91d34640d5b80de38a871879d5265880005617c30000000000000000175cfac3429ec362120013410b3e3152077359402028480101b26bf766de9295843d88bfef9e85f70a47160ae4cbaad535e4f6b1184bd1b4e80003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996186,
            "rootHash": "91f3e3e70b8c2c7ab933cbf41f1cd903833692baca2ea3864b34d945a768260b",
            "fileHash": "1dcbb8e39ad8198e6f289d542d7360bfee4740f75914672387d843a6f084a187"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212272,
                    "rootHash": "fbfae61b7ec96d6e08deb047d7e5615ccdb5ed4854d1d986d638a0315734352d",
                    "fileHash": "c3223cb7236b6bdb2d973179d97cd50544ecb3c767bdcfc8e12897ac7610745a"
                },
                "proof": "b5ee9c72010214010002790009460391f3e3e70b8c2c7ab933cbf41f1cd903833692baca2ea3864b34d945a768260b001601241011ef55aaffffff11020304052848010164af3f25d48e19398ea6b68c1f2e1343624a479ea3d7edee28204ecd21a044d4000128480101463f972f8af2d2dc3a4ee1e1daf59856b1d5d1b1886b8babe5428da7aed0167c00032848010117bf0ed0e3cf1502b0aba2b674810ce9699b7ce3f5f6112ddca162e733e25c14001524894a33f6fd2280214c3640b07b47932d772e1bdf31249676de59ce8c36e01f74c979cc1ebc546477571afff6cc9536ff98233f5b50c0c4fc305dae8b61dd541f933672c261c00607080928480101d39b5891970935dde1a443ddd8d13838849c17a11b810dab1c2ba177e62e04c2000400010228480101e57375476e81e01153f5f85438724ccb20ccd635616be17ac079b663d821599300062317cca5689fbd2c0644a817c8040a0b0c2103d0400d28480101c2a3a5410fbf60500ca9be2b9d08d7002f983756e47a259e5689873ffb576c9b0002210150132201c00e0f2201c01011284801010fab5ba3649f4312a726c1316b6adfe1f4541309dc56f93f960c3548424b925b000228480101078220d83060a4a57b20eb6e84b09c7658f42e63051c8a01c6d09915285746ea000101db5019d9b580175cfad00001a98479fb4c000001a98479fb4c27dfd730dbf64b6b7046f5823ebf2b0ae66daf6a42a68ecc36b1c5018ab9a1a96e1911e5b91b5b5ed96cb98bcecbe6a82a27659e3b3dee7e470944bd63b083a2d080005617c30000000000000000175cfabb429ec35212001340f92fc19207735940202848010128c89d022d54c1e108d82b152fe812efc285922c4569906052050da7d61d8f5a0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996185,
            "rootHash": "d277fcc21b6983234808c7ba368236900bf4d11895cb490ab2359f5baaeddb93",
            "fileHash": "cb7b100f4fbf9fbef7c1c5363d5407fbac8cc4a109e5597ff65e3de5950fe5e3"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212271,
                    "rootHash": "76b79c3602c9246908e92f648449218e6cea9b66fa1e257ef36653bbe102a5bf",
                    "fileHash": "997d1a6601550b319d666c024083b9bada619feb5388bb5da20ff30ddb1c01e9"
                },
                "proof": "b5ee9c720102140100027900094603d277fcc21b6983234808c7ba368236900bf4d11895cb490ab2359f5baaeddb93001601241011ef55aaffffff1102030405284801017f5fb6f1881a63019a2f6aa21e7c444e50ad57890a7b5c617222d2cac126e60f000128480101b905d4f2638d050a2dc6281b0169bfab075248499dff614758430dc3113f546e00032848010192fff4e303b4d68dab7f97e240de8fe28bf76ed468f66edf3760f0d1f5a96f16001524894a33f6fd5eda48d2aff0b4aafaef0d9c48932036669e93cd8039e5b2889c75c9f3178821c1911519b788a24b413178cfaae8abe0e378eabb8e8c5e0d86f817eb1ddb3b42c006070809284801017c47905f61751dab35803ce3b496311b440959148e80fc43d083d1b971cea0bc000400010228480101ffe8545c4df09b6bf83e2d2966f9ce749e3ae4b7d934a3119f45ccf463bd649600062317cca568853552de43b9aca0040a0b0c2103d0400d28480101afb5b36e4e7bc240e3a425bcba88b761e53f4c5385b255a1ca497d7307927ccb0002210150132201c00e0f2201c0101128480101cbc18dfa040fde064db6b1584a73189bc941259d7bb6d831e4c7d27bd39870e3000228480101dc29659588061fa1210c808737b0c8ea2fb005300769f25eac47b720bc9417fe000101db5019d9b578175cfac80001a98479813a000001a98479813a23b5bce1b01649234847497b2422490c736754db37d0f12bf79b329ddf08152dfccbe8d3300aa8598ceb336012041dcdd6d30cff5a9c45daed107f986ed8e00f4880005617c30000000000000000175cfaab429ec33a120013410b015ab20773594020284801011971911f445fb099f4a54849c02484ce13ae8c9d06fc8fae7fb616efac9cc8ec0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996184,
            "rootHash": "ddd3cf5b8384c8fb1e85155badce432ee93af36efd0f332ab59df73f87a47ca7",
            "fileHash": "47b884014c9833827de738899afadee7f1b031e4721209c4da8b4509297ba725"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212270,
                    "rootHash": "33eac18cdb72d59ba91e21a33bd96ba2b2a36833a538fc38b930a873ef5bb210",
                    "fileHash": "07e3889ebd65d296d045ba53eda690a95af9760a690dd9e1729cecec01a10e33"
                },
                "proof": "b5ee9c720102140100027900094603ddd3cf5b8384c8fb1e85155badce432ee93af36efd0f332ab59df73f87a47ca7001701241011ef55aaffffff110203040528480101c355b64c50ddf6593acd1c4a84e7403f3e9d4801efffeacb147455f3ac0a7a64000128480101d3c96a0872aaee8d6260c0c72d12d0b49c347acf702b55b424c152fa0f4f33cb000328480101a5612970720f0d07edb78d847b2fae828c971e856778d997cdaffe427c0461f7001624894a33f6fdad82f25ef7ec2a01e750e52d6582ac41fe528052a4b2bb56a5865eb1c29836901b709f7aa687a21bf65bf5dca8518d590fd42a3a6e88e71ba33d5930135d286fc00607080928480101d205555a5251b9b31df2e4da8e667bfef96747f8e8d9591990579f1fc68f6aed00040001022848010135a6211acc7fac7629b060a36e6e7d88da7013fab97d4b07ff02ed942fb78d5e00062317cca5688355a42843b9aca0040a0b0c2103d0400d28480101e94586061fdbda78bbedd6576207b2e4090b01593e64bc6249da88a1c2986fd70002210150132201c00e0f2201c0101128480101b7630cc2e83dbbcad86525206c657751048c49b22979077cfec07aee9bf8be36000228480101de8a43e101230518b331a471ef83460149c0e7e141d7d6a5ef9ecca446773e86000101db5019d9b570175cfac00001a984790728000001a984790728219f560c66db96acdd48f10d19decb5d15951b419d29c7e1c5c985439f7add90803f1c44f5eb2e94b6822dd29f6d34854ad7cbb053486ecf0b94e767600d08719880005617c30000000000000000175cfaab429ec32a12001341076ec4d2077359402028480101972ed0338ffb9886f500da0e07abcc833d72e98f631102d2abb9d074d24e48430003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996183,
            "rootHash": "d8552066c07713a98674115a491cbf7c67ae49e3c5f6b223717ac38af7234696",
            "fileHash": "d40ee42118f20f017fcbca15a910cc06defd8e9701cc92adb16940c7dd209bac"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212269,
                    "rootHash": "dd76de4dcf7ce7a462f39f30f73fd774a60bbd65196f2809e72cb4ed38a89cfa",
                    "fileHash": "cc0a45ebead7578f20597befd5e69c877cbb8ebe2d895aca4f0092bd6d57b28c"
                },
                "proof": "b5ee9c720102140100027900094603d8552066c07713a98674115a491cbf7c67ae49e3c5f6b223717ac38af7234696001701241011ef55aaffffff1102030405284801019bf8d66633e7e887302c9fe2be0c340a162f1e3334cf44083028fdfcb7f44eb500012848010112182a2a9082b9914072b1c3dbf27d4585ac5caa09b2ca921092dac2aba07aa0000328480101af330a488fd4c4fd8bf54942955066e84582d14c7f80affdb7444a393bf49989001624894a33f6fdf7843f8463b9f2f540254f14beab6444c41007193f51f6899912cdef43e63310ec2b72015d2c0091cd92cde50a05376412643b087de05e7e3d5f9b373cdf2775c006070809284801012c019c1c2a3b35e843f1a057d35709096c676be990a37663cc0580cad45d35180004000102284801010612fb77d43a1d2eb62355684fb4d359bbb38621576377f5ae5e518adb9e5f3d00062317cca5689eb815a844a817c8040a0b0c2103d0400d284801011a36a524a5f1b31cd39f555cd0c8a0a49cab4a6cf3eab192b4577e4add2f801e0002210150132201c00e0f2201c01011284801012829bea8dfc4840e0b84386dd5517b11fc44bb5a6f441098aa58d2e34c0561bf000228480101bfae0fc5f6229a8b90656d709f701cc6b77efe604aa4413be2ede34cfcae356d000101db5019d9b568175cfab80001a984788d16000001a984788d163eebb6f26e7be73d23179cf987b9febba5305deb28cb79404f3965a769c544e7d660522f5f56babc7902cbdf7eaf34e43be5dc75f16c4ad652780495eb6abd946080005617c30000000000000000175cfaa3429ec31a120013410af7ede2077359402028480101fcbe8f9339ff94a4058ec132b2f9a99ddf55a80393294dec600ef0bafdd10afb0003"
            }
        ]
    },
    {
        "masterchainId": {
            "workchain": -1,
            "shard": "8000000000000000",
            "seqno": 48996182,
            "rootHash": "548271992eea933b79c1d66deede9cc1ec059a4660d1e08a302f4c2305c5a349",
            "fileHash": "1c5208a3f9fba0fd9b64940fd65ebb2c76d01af6e3c85afa9dbe44cd79d3e4cb"
        },
        "links": [
            {
                "id": {
                    "workchain": 0,
                    "shard": "6000000000000000",
                    "seqno": 54212268,
                    "rootHash": "c9ea07086f9a4959edbf7f05e43059667e97e2a4895175bfd71a4d417c2e32ca",
                    "fileHash": "3f1f096a60da97d2f485dc00e8c3051f28292141144d6e4a17621a5170d5d9af"
                },
                "proof": "b5ee9c720102140100027900094603548271992eea933b79c1d66deede9cc1ec059a4660d1e08a302f4c2305c5a349001601241011ef55aaffffff110203040528480101187abc4234fad563b93b87561abbf8f8ee42ac7de6eacb79029ce5867bd0473a0001284801011ca2d748e2627f8ca9c3ca88b5720aabfb911fb8fee60431641318246ff10f57000328480101b5161c3b55559f8ae38b5261df6505b39495ab9f882f8a0ca444556c2e5e37ab001524894a33f6fdc2a256559c998294388e938f3a09fb92de47021710992abd1242cdfa2cb12fd9060f7bf9505d75817d0e03ba86db587e41fad408c1256a479404c7b974caa7f5c0060708092848010152d1ff1b1635ade1ca9267cb232fd831bc9c67723f5246af6bf414358a457e0d000400010228480101c2fd0e584e8a3d32a03672a6de3f45e682d5bf77ab828f9cdf2fc736d44d1e8300062317cca56868c7145c42cb4178040a0b0c2103d0400d284801014f85e86d12140fafa2fae3b17e5b27fa16d53f9d1a9d7b929e4e420a44bc56230002210150132201c00e0f2201c01011284801010ec40a95da89e155178e9cb8991d77dbaa85a9cff37db56988b890395bdee8a30002284801016f38342681d1c129983b5db4961cec7bd5e2aa227dbc13f2f86248f197292252000101db5019d9b560175cfab00001a984781304000001a984781304364f5038437cd24acf6dfbf82f2182cb33f4bf15244a8badfeb8d26a0be1719651f8f84b5306d4be97a42ee007461828f941490a08a26b7250bb10d28b86aecd7880005617c30000000000000000175cfa9b429ec30a12001340fc3374c2077359402028480101d4c3d00b9e487634590f1fbed58fc93a20a983c5ca7472d29da9d43393d6c47f0003"
            }
        ]
    }
]



================================================
FILE: sources/tests/proofs.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/proofs.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {
    Address,
    beginCell,
    Cell,
    CellType,
    convertToMerkleProof,
    loadAccount,
    toNano,
    TupleBuilder,
} from "@ton/core"
import {Blockchain, BlockId, internal} from "@ton/sandbox"
import {findTransactionRequired, flattenTransaction, randomAddress} from "@ton/test-utils"
import {createJetton, createJettonVault} from "../utils/environment"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {createJettonVaultMessage} from "../utils/testUtils"
import {
    JettonVault,
    PROOF_STATE_TO_THE_BLOCK,
    storeJettonNotifyWithActionRequest,
    storeLPDepositPart,
    storeStateProof,
} from "../output/DEX_JettonVault"
import {LPDepositPartOpcode} from "../output/DEX_LiquidityDepositContract"
import {PROOF_TEP89, TEP89DiscoveryProxy} from "../output/DEX_TEP89DiscoveryProxy"
import {TonApiClient} from "@ton-api/client"
import allAccountStateAndProof from "./offline-data/16_last_proofs.json"
import shardBlockProofs from "./offline-data/shardProofs.json"
import {lastMcBlocks} from "./offline-data/last-mc-blocks"
import {randomInt} from "crypto"

// This function finds the path deepest pruned Cell
function walk(cell: Cell, depth = 0, path: number[] = [], best: any) {
    if (cell.isExotic && cell.type === CellType.PrunedBranch) {
        if (!best || depth > best.depth) best = {path, depth}
    }
    cell.refs.forEach((c, i) => {
        best = walk(c, depth + 1, [...path, i], best)
    })
    return best
}

// This function takes the path from the function above and replaces the deepest cell (in the path)
// With the needed cell
function rebuild(cell: Cell, path: number[], replacement: Cell): Cell {
    if (path.length === 0) {
        return replacement
    }

    const idx = path[0]
    const builder = beginCell()
    const slice = cell.beginParse()
    builder.storeBits(slice.loadBits(slice.remainingBits))

    cell.refs.forEach((r, i) => {
        builder.storeRef(i === idx ? rebuild(r, path.slice(1), replacement) : r)
    })
    return builder.endCell({exotic: cell.isExotic})
}

describe("Proofs", () => {
    test("TEP89 proof should correctly work for discoverable jettons", async () => {
        const blockchain = await Blockchain.create()
        // Our Jettons, used when creating the vault support TEP-89
        const vaultSetup = await createJettonVault(blockchain)

        const _ = await vaultSetup.deploy()
        const mockPayload = beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: {
                        $$type: "LiquidityDepositEitherAddress",
                        eitherBit: false,
                        liquidityDepositContract: randomAddress(0), // Mock LP contract address
                        initData: null,
                    },
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: 0n,
                        lpTimeout: 0n,
                        payloadOnSuccess: null,
                        payloadOnFailure: null,
                    },
                }),
            )
            .endCell()

        const sendNotifyWithTep89Proof = await vaultSetup.treasury.transfer(
            vaultSetup.vault.address,
            toNano(0.5),
            createJettonVaultMessage(
                // We can use any Jetton Vault opcode here because we don't need an actual operation here
                LPDepositPartOpcode,
                mockPayload,
                {
                    proofType: PROOF_TEP89,
                },
            ),
        )
        expect(sendNotifyWithTep89Proof.transactions).toHaveTransaction({
            to: vaultSetup.treasury.minter.address,
            op: JettonVault.opcodes.ProvideWalletAddress,
            success: true,
        })
        const replyWithWallet = findTransactionRequired(sendNotifyWithTep89Proof.transactions, {
            from: vaultSetup.treasury.minter.address,
            op: JettonVault.opcodes.TakeWalletAddress,
            success: true,
        })
        const tep89proxyAddress = flattenTransaction(replyWithWallet).to
        expect(sendNotifyWithTep89Proof.transactions).toHaveTransaction({
            from: tep89proxyAddress,
            op: JettonVault.opcodes.TEP89DiscoveryResult,
            // As there was a commit() after the proof was validated
            success: true,
            // However, probably there is not-null exit code, as we attached the incorrect payload
        })
        const jettonVaultInstance = blockchain.openContract(
            JettonVault.fromAddress(vaultSetup.vault.address),
        )
        expect(await jettonVaultInstance.getInited()).toBe(true)
    })

    test("Jettons are returned if TEP89 proof fails if wrong jetton sent", async () => {
        const blockchain = await Blockchain.create()
        // Our Jettons, used when creating the vault support TEP-89
        const vaultSetup = await createJettonVault(blockchain)

        const _ = await vaultSetup.deploy()
        const mockPayload = beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: {
                        $$type: "LiquidityDepositEitherAddress",
                        eitherBit: false,
                        liquidityDepositContract: randomAddress(0), // Mock LP contract address
                        initData: null,
                    },
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: 0n,
                        lpTimeout: 0n,
                        payloadOnSuccess: null,
                        payloadOnFailure: null,
                    },
                }),
            )
            .endCell()

        // Create different Jetton and send it to the vault
        const differentJetton = await createJetton(blockchain)

        const initialJettonBalance = await differentJetton.wallet.getJettonBalance()

        const sendNotifyFromIncorrectWallet = await differentJetton.transfer(
            vaultSetup.vault.address,
            toNano(0.5),
            createJettonVaultMessage(
                // We can use any Jetton Vault opcode here because we don't need an actual operation here
                LPDepositPartOpcode,
                mockPayload,
                {
                    proofType: PROOF_TEP89,
                },
            ),
        )

        // Vault deployed proxy that asked JettonMaster for the wallet address
        expect(sendNotifyFromIncorrectWallet.transactions).toHaveTransaction({
            to: vaultSetup.treasury.minter.address,
            op: TEP89DiscoveryProxy.opcodes.ProvideWalletAddress,
            success: true,
        })
        // Jetton Master replied with the correct wallet address
        const replyWithWallet = findTransactionRequired(
            sendNotifyFromIncorrectWallet.transactions,
            {
                from: vaultSetup.treasury.minter.address,
                op: JettonVault.opcodes.TakeWalletAddress,
                success: true,
            },
        )
        const tep89proxyAddress = flattenTransaction(replyWithWallet).to

        expect(sendNotifyFromIncorrectWallet.transactions).toHaveTransaction({
            from: tep89proxyAddress,
            op: JettonVault.opcodes.TEP89DiscoveryResult,
            success: true, // Because commit was called
            exitCode: JettonVault.errors["JettonVault: Expected and Actual wallets are not equal"],
        })

        expect(await vaultSetup.isInited()).toBe(false)
        const finalJettonBalance = await differentJetton.wallet.getJettonBalance()
        expect(finalJettonBalance).toEqual(initialJettonBalance)
    })
    test("Jettons are returned if proof type is incorrect", async () => {
        const blockchain = await Blockchain.create()
        const vaultSetup = await createJettonVault(blockchain)

        const _ = await vaultSetup.deploy()
        const mockActionPayload = beginCell()
            .storeStringTail("Random action that does not mean anything")
            .endCell()

        const initialJettonBalance = await vaultSetup.treasury.wallet.getJettonBalance()

        const sendNotifyWithNoProof = await vaultSetup.treasury.transfer(
            vaultSetup.vault.address,
            toNano(0.5),
            createJettonVaultMessage(
                // We can use any Jetton Vault opcode here because we don't need an actual operation here
                LPDepositPartOpcode,
                mockActionPayload,
                {
                    proofType: 0n, // No proof attached
                },
            ),
        )

        const toVaultTx = flattenTransaction(
            findTransactionRequired(sendNotifyWithNoProof.transactions, {
                to: vaultSetup.vault.address,
                op: JettonVault.opcodes.JettonNotifyWithActionRequest,
                success: true, // Because commit was called
                exitCode: JettonVault.errors["JettonVault: Unsupported proof type"],
            }),
        )

        expect(sendNotifyWithNoProof.transactions).toHaveTransaction({
            from: vaultSetup.vault.address,
            to: toVaultTx.from,
            op: JettonVault.opcodes.JettonTransfer,
            success: true,
        })

        expect(await vaultSetup.isInited()).toBe(false)
        const finalJettonBalance = await vaultSetup.treasury.wallet.getJettonBalance()
        expect(finalJettonBalance).toEqual(initialJettonBalance)
    })

    test("Jettons are returned if sent to wrong vault", async () => {
        const blockchain = await Blockchain.create()
        // Create and set up a correct jetton vault
        const vaultSetup = await createJettonVault(blockchain)
        const _ = await vaultSetup.deploy()

        // Create a different jetton (wrong one) for testing
        const wrongJetton = await createJetton(blockchain)

        // Get the initial balance of the wrong jetton wallet
        const initialWrongJettonBalance = await wrongJetton.wallet.getJettonBalance()

        // Create a mock payload to use with the transfer
        const mockPayload = beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: {
                        $$type: "LiquidityDepositEitherAddress",
                        eitherBit: false,
                        liquidityDepositContract: randomAddress(0), // Mock LP contract address
                        initData: null,
                    },
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: 0n,
                        lpTimeout: 0n,
                        payloadOnSuccess: null,
                        payloadOnFailure: null,
                    },
                }),
            )
            .endCell()

        // Number of jettons to send to the wrong vault
        const amountToSend = toNano(0.5)

        // First, we need to initialize the vault with the correct jettons
        const _initVault = await vaultSetup.treasury.transfer(
            vaultSetup.vault.address,
            amountToSend,
            createJettonVaultMessage(
                // We can use any Jetton Vault opcode here because we don't need an actual operation here
                LPDepositPartOpcode,
                mockPayload,
                {
                    proofType: PROOF_TEP89,
                },
            ),
        )
        expect(await vaultSetup.isInited()).toBeTruthy()

        // Send wrong Jetton to the vault
        const sendJettonsToWrongVault = await wrongJetton.transfer(
            vaultSetup.vault.address,
            amountToSend,
            createJettonVaultMessage(LPDepositPartOpcode, mockPayload, {
                proofType: PROOF_TEP89,
            }),
        )

        // Verify that the transaction to the vault has occurred but failed due to the wrong jetton
        const toVaultTx = flattenTransaction(
            findTransactionRequired(sendJettonsToWrongVault.transactions, {
                to: vaultSetup.vault.address,
                op: JettonVault.opcodes.JettonNotifyWithActionRequest,
                success: true, // Because commit was called
                exitCode: JettonVault.errors["JettonVault: Sender must be jetton wallet"],
            }),
        )

        // Check that the jettons were sent back to the original wallet
        expect(sendJettonsToWrongVault.transactions).toHaveTransaction({
            from: vaultSetup.vault.address,
            to: toVaultTx.from,
            op: JettonVault.opcodes.JettonTransfer,
            success: true,
        })

        expect(await vaultSetup.isInited()).toBeTruthy()

        // Verify that the balance of the wrong jetton wallet is unchanged (jettons returned)
        const finalWrongJettonBalance = await wrongJetton.wallet.getJettonBalance()
        expect(finalWrongJettonBalance).toEqual(initialWrongJettonBalance)
    })

    test("State proof should work correctly", async () => {
        const blockchain = await Blockchain.create()

        const jettonMinterToProofStateFor = Address.parse(
            "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
        )
        const cs = Cell.fromHex(
            "b5ee9c7201021e0100057a000271c0065aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf920823c89d70341ec66380000d27a68e9dd09404e9342a6d34001020114ff00f4a413f4bcf2c80b03025173b4555c113bad1801910d90954876876fd726d613ca31157ce1b1460c00f71e4c535b99d001cba6b10b0c02016204050202cc060702037a60090a01ddd9910e38048adf068698180b8d848adf07d201800e98fe99ff6a2687d007d206a6a18400aa9385d471a1a9a80e00079702428a26382f97024fd207d006a18106840306b90fd001812081a282178042a906428027d012c678b666664f6aa7041083deecbef0bdd71812f83c207f9784080093dfc142201b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064907c80383a6465816503e5ffe4e83bc00c646582ac678b28027d0109e5b589666664b8fd80400fc03fa00fa40f82854120870542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a1035024c85004fa0258cf16ccccc9ed5401fa403020d70b01c3008e1f8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb00915be2007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400023af16f6a2687d007d206a6a1811e0002a9040006c01697066733a2f2f516d6565625a6d3473436d5847644d39696944385474594479517779466133446d323768786f6e565179465434500114ff00f4a413f4bcf2c80b0d0201620e0f0202cc1011001ba0f605da89a1f401f481f481a8610201d41213020148141500bb0831c02497c138007434c0c05c6c2544d7c0fc02f83e903e900c7e800c5c75c87e800c7e800c00b4c7e08403e29fa954882ea54c4d167c0238208405e3514654882ea58c511100fc02780d60841657c1ef2ea4d67c02b817c12103fcbc2000113e910c1c2ebcb8536002012016170201201c1d01f500f4cffe803e90087c007b51343e803e903e90350c144da8548ab1c17cb8b04a30bffcb8b0950d109c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c032483e401c1d3232c0b281f2fff274013e903d010c7e801de0063232c1540233c59c3e8085f2dac4f3208405e351467232c7c6601803f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a020822625a004ad822860822625a028062849f8c3c975c2c070c008e0191a1b009acb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08208989680aa008208989680a0a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718018c8cb0524cf165006fa0215cb6a14ccc971fb0010241023000e10491038375f040076c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400db3b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b0a0822625a02a8005a805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083200835c87b51343e803e903e90350c0134c7e08405e3514654882ea0841ef765f784ee84ac7cb8b174cfcc7e800c04e81408f214013e809633c58073c5b3327b5520",
        ).beginParse()
        cs.skip(1)
        await blockchain.setShardAccount(jettonMinterToProofStateFor, {
            account: loadAccount(cs),
            lastTransactionLt: 57855797000001n,
            lastTransactionHash:
                0xb859ff3a641d8d1ecf778facdeeb1676c36c189ede0d3532eefe966d328f6002n,
        })

        const vault = blockchain.openContract(
            await JettonVault.fromInit(jettonMinterToProofStateFor, null),
        )

        const deployRes = await vault.send(
            (await blockchain.treasury("Proofs equals pain")).getSender(),
            {value: toNano(0.1), bounce: false},
            null,
        )
        expect(deployRes.transactions).toHaveTransaction({
            on: vault.address,
            deploy: true,
        })

        const mockPayload = beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: {
                        $$type: "LiquidityDepositEitherAddress",
                        eitherBit: false,
                        liquidityDepositContract: randomAddress(0), // Mock LP contract address
                        initData: null,
                    },
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: 0n,
                        lpTimeout: 0n,
                        payloadOnSuccess: null,
                        payloadOnFailure: null,
                    },
                }),
            )
            .endCell()

        blockchain.prevBlocks = {
            lastMcBlocks: lastMcBlocks,
            // Not real prevKeyBlock, but we won't use that so does not matter
            prevKeyBlock: lastMcBlocks[0],
        }

        for (let blockNum = 0; blockNum < 16; ++blockNum) {
            const blockToProofTo = lastMcBlocks[blockNum]
            const accountStateAndProof = allAccountStateAndProof[blockNum]

            const proofs = Cell.fromBoc(Buffer.from(accountStateAndProof.proof, "hex"))

            const scBlockProof = proofs[0]
            const newShardStateProof = proofs[1]
            const newShardState = newShardStateProof.refs[0]
            const accountState = Cell.fromHex(accountStateAndProof.state)

            const {path} = walk(newShardState, 0, [], null) // Find the deepest pruned branch cell
            const patchedShardState = rebuild(newShardState, path, accountState) // And replace it with the actual account state

            expect(newShardState.hash(0).toString("hex")).toEqual(
                patchedShardState.hash(0).toString("hex"),
            )

            const shardBlockProof = shardBlockProofs[blockNum]
            const tester = await blockchain.treasury("Proofs equals pain")
            const jettonMasterProvider = blockchain.provider(jettonMinterToProofStateFor)

            const builder = new TupleBuilder()
            builder.writeAddress(vault.address)
            const getMethodResult = await jettonMasterProvider.get(
                "get_wallet_address",
                builder.build(),
            )
            const jettonWalletAddress = getMethodResult.stack.readAddress()

            const vaultContract = await blockchain.getContract(vault.address)

            const _res = await vaultContract.receiveMessage(
                internal({
                    from: jettonWalletAddress,
                    to: vault.address,
                    value: toNano(0.5),
                    body: beginCell()
                        .store(
                            storeJettonNotifyWithActionRequest({
                                $$type: "JettonNotifyWithActionRequest",
                                queryId: 0n,
                                sender: tester.address,
                                // Amount doesn't matter
                                amount: 100n,
                                eitherBit: false,
                                actionOpcode: LPDepositPartOpcode,
                                actionPayload: mockPayload,
                                proofType: PROOF_STATE_TO_THE_BLOCK,
                                proof: beginCell()
                                    .store(
                                        storeStateProof({
                                            $$type: "StateProof",
                                            mcBlockSeqno: BigInt(blockToProofTo.seqno),
                                            shardBitLen: BigInt(
                                                Cell.fromHex(
                                                    shardBlockProof.links[0].proof,
                                                ).depth() - 6,
                                                // Subtracting 6 be unobvious, but actually what we need here is the depth of BinTree here
                                                // _ (HashmapE 32 ^(BinTree ShardDescr)) = ShardHashes;
                                                // But shardBlockProof.links[0].proof is Merkle proof made of a masterchain block
                                            ),
                                            mcBlockHeaderProof: Cell.fromHex(
                                                shardBlockProof.links[0].proof,
                                            ),
                                            shardBlockHeaderProof: scBlockProof,
                                            shardChainStateProof:
                                                convertToMerkleProof(patchedShardState),
                                        }),
                                    )
                                    .asSlice(),
                            }),
                        )
                        .endCell(),
                }),
            )
            // We only need to test that the vault has been successfully initialized.
            // Moreover, it is a sufficient check because we do not trust any data from the message and validate everything via hashes
            expect(await vault.getInited()).toBe(true)
        }
    })

    // This test checks exactly the same as the previous one, but it uses real fresh data from the blockchain
    // It is skipped as it needs TONAPI_KEY to work
    // And it is much slower than the previous one
    test.skip("State proof should work correctly if constructed in real time", async () => {
        const TONAPI_KEY = process.env.TONAPI_KEY
        if (TONAPI_KEY === undefined) {
            throw Error("TONAPI_KEY is not set. Please set it to run this test.")
        }
        const blockchain = await Blockchain.create()
        const jettonMinterToProofStateFor = Address.parse(
            "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE",
        )

        const vault = blockchain.openContract(
            await JettonVault.fromInit(jettonMinterToProofStateFor, null),
        )

        const deployRes = await vault.send(
            (await blockchain.treasury("Proofs equals pain")).getSender(),
            {value: toNano(0.1), bounce: false},
            null,
        )
        expect(deployRes.transactions).toHaveTransaction({
            on: vault.address,
            deploy: true,
        })

        const mockPayload = beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: {
                        $$type: "LiquidityDepositEitherAddress",
                        eitherBit: false,
                        liquidityDepositContract: randomAddress(0), // Mock LP contract address
                        initData: null,
                    },
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: 0n,
                        lpTimeout: 0n,
                        payloadOnSuccess: null,
                        payloadOnFailure: null,
                    },
                }),
            )
            .endCell()

        const client = new TonApiClient({
            apiKey: TONAPI_KEY,
        })
        const lastTestnetBlocksId = await client.blockchain.getBlockchainMasterchainHead()
        const lastSeqno = lastTestnetBlocksId.seqno

        const convertToBlockId = (
            from: Awaited<ReturnType<typeof client.blockchain.getBlockchainBlock>>,
        ): BlockId => {
            return {
                workchain: from.workchainId,
                shard: BigInt("0x" + from.shard),
                seqno: from.seqno,
                rootHash: Buffer.from(from.rootHash, "hex"),
                fileHash: Buffer.from(from.fileHash, "hex"),
            }
        }
        // We need to fetch the last 16 blocks and pass them to the emulation
        const lastMcBlocks: BlockId[] = []
        for (let i = 0; i < 16; i++) {
            const block = await client.blockchain.getBlockchainBlock(
                `(-1,8000000000000000,${lastSeqno - i})`,
            )
            lastMcBlocks.push(convertToBlockId(block))
        }

        blockchain.prevBlocks = {
            lastMcBlocks: lastMcBlocks,
            // Not real prevKeyBlock, but we won't use that so does not matter
            prevKeyBlock: lastMcBlocks[0],
        }

        const blockToProofTo = lastMcBlocks[randomInt(0, 16)]
        const blockToProofToStrId = `(-1,8000000000000000,${blockToProofTo.seqno},${blockToProofTo.rootHash.toString("hex")},${blockToProofTo.fileHash.toString("hex")})`

        const accountStateAndProof = await client.liteServer.getRawAccountState(
            jettonMinterToProofStateFor,
            {
                target_block: blockToProofToStrId,
            },
        )

        const proofs = Cell.fromBoc(Buffer.from(accountStateAndProof.proof, "hex"))

        const scBlockProof = proofs[0]
        const newShardStateProof = proofs[1]
        const newShardState = newShardStateProof.refs[0]
        const accountState = Cell.fromHex(accountStateAndProof.state)

        const {path} = walk(newShardState, 0, [], null) // Find the deepest pruned branch cell
        const patchedShardState = rebuild(newShardState, path, accountState) // And replace it with the actual account state

        expect(newShardState.hash(0).toString("hex")).toEqual(
            patchedShardState.hash(0).toString("hex"),
        )

        const shardBlockStrId = `(${accountStateAndProof.shardblk.workchain},${accountStateAndProof.shardblk.shard},${accountStateAndProof.shardblk.seqno},${accountStateAndProof.shardblk.rootHash},${accountStateAndProof.shardblk.fileHash})`
        const shardBlockProof = await client.liteServer.getRawShardBlockProof(shardBlockStrId)

        const tester = await blockchain.treasury("Proofs equals pain")
        const getMethodResult = await client.blockchain.execGetMethodForBlockchainAccount(
            jettonMinterToProofStateFor,
            "get_wallet_address",
            {
                args: [beginCell().storeAddress(vault.address).endCell().toBoc().toString("hex")],
            },
        )
        if (getMethodResult.stack[0].type !== "cell") {
            throw new Error("Unexpected get-method result type: " + getMethodResult.stack[0].type)
        }
        const jettonWalletAddress = getMethodResult.stack[0].cell.beginParse().loadAddress()

        const vaultContract = await blockchain.getContract(vault.address)
        //blockchain.verbosity.vmLogs = "vm_logs_verbose"
        const _res = await vaultContract.receiveMessage(
            internal({
                from: jettonWalletAddress,
                to: vault.address,
                value: toNano(0.5),
                body: beginCell()
                    .store(
                        storeJettonNotifyWithActionRequest({
                            $$type: "JettonNotifyWithActionRequest",
                            queryId: 0n,
                            sender: tester.address,
                            // Amount doesn't matter
                            amount: 100n,
                            eitherBit: false,
                            actionOpcode: LPDepositPartOpcode,
                            actionPayload: mockPayload,
                            proofType: PROOF_STATE_TO_THE_BLOCK,
                            proof: beginCell()
                                .store(
                                    storeStateProof({
                                        $$type: "StateProof",
                                        mcBlockSeqno: BigInt(blockToProofTo.seqno),
                                        shardBitLen: BigInt(
                                            Cell.fromHex(shardBlockProof.links[0].proof).depth() -
                                                6,
                                            // Subtracting 6 be unobvious, but actually what we need here is the depth of BinTree here
                                            // _ (HashmapE 32 ^(BinTree ShardDescr)) = ShardHashes;
                                            // But shardBlockProof.links[0].proof is Merkle proof made of a masterchain block
                                        ),
                                        mcBlockHeaderProof: Cell.fromHex(
                                            shardBlockProof.links[0].proof,
                                        ),
                                        shardBlockHeaderProof: scBlockProof,
                                        shardChainStateProof:
                                            convertToMerkleProof(patchedShardState),
                                    }),
                                )
                                .asSlice(),
                        }),
                    )
                    .endCell(),
            }),
        )

        // We only need to test that the vault has been successfully initialized.
        // Moreover, it is a sufficient check because we do not trust any data from the message and validate everything via hashes
        expect(await vault.getInited()).toBe(true)
    })
})



================================================
FILE: sources/tests/swap-payloads.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/swap-payloads.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Blockchain} from "@ton/sandbox"
import {createJettonAmmPool} from "../utils/environment"
import {beginCell, toNano} from "@ton/core"
import {AmmPool, loadPayoutFromPool, loadSendViaJettonTransfer} from "../output/DEX_AmmPool"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {JettonVault} from "../output/DEX_JettonVault"
import {findTransactionRequired, flattenTransaction} from "@ton/test-utils"

describe("Payloads", () => {
    test("Successful swap should return success payload", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, initWithLiquidity, swap} =
            await createJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 10n
        const amountA = toNano(5)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio
        const depositor = vaultA.treasury.walletOwner
        const {depositorLpWallet} = await initWithLiquidity(depositor, amountA, amountB)
        const lpBalanceAfterFirstLiq = await depositorLpWallet.getJettonBalance()
        // check that liquidity deposit was successful
        expect(lpBalanceAfterFirstLiq).toBeGreaterThan(0n)

        const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()

        const amountToSwap = toNano(0.05)
        const expectedOutput = await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)
        const amountBJettonBeforeSwap = await vaultB.treasury.wallet.getJettonBalance()

        const swapResult = await swap(
            amountToSwap,
            "vaultA",
            expectedOutput,
            0n,
            false,
            null,
            payloadOnSuccess,
        )

        // check that swap was successful
        expect(swapResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: ammPool.address,
            op: AmmPool.opcodes.SwapIn,
            success: true,
        })

        const payoutTx = findTransactionRequired(swapResult.transactions, {
            from: ammPool.address,
            to: vaultB.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })
        const payoutBody = flattenTransaction(payoutTx).body?.beginParse()
        const parsedPayout = loadPayoutFromPool(payoutBody!!)
        expect(parsedPayout.otherVault).toEqualAddress(vaultA.vault.address)
        expect(parsedPayout.amount).toEqual(expectedOutput)
        expect(parsedPayout.receiver).toEqualAddress(depositor.address)
        expect(parsedPayout.payloadToForward!!).toEqualCell(payloadOnSuccess)

        const tx = findTransactionRequired(swapResult.transactions, {
            from: vaultB.vault.address,
            // TODO: to: vaultB.jettonWallet
            op: JettonVault.opcodes.SendViaJettonTransfer,
            success: true,
        })

        const body = flattenTransaction(tx).body?.beginParse()
        const parsedBody = loadSendViaJettonTransfer(body!!)
        expect(parsedBody.destination).toEqualAddress(depositor.address)
        expect(parsedBody.responseDestination).toEqualAddress(depositor.address)
        expect(parsedBody.forwardPayload.asCell()).toEqualCell(
            beginCell().storeMaybeRef(payloadOnSuccess).endCell(),
        )

        const amountOfJettonBAfterSwap = await vaultB.treasury.wallet.getJettonBalance()
        expect(amountOfJettonBAfterSwap).toBeGreaterThan(amountBJettonBeforeSwap)
    })

    test("Swap failed due to slippage should return failure payload", async () => {
        const blockchain = await Blockchain.create()
        const {ammPool, vaultA, vaultB, initWithLiquidity, swap} =
            await createJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n
        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio
        const depositor = vaultA.treasury.walletOwner
        const _ = await initWithLiquidity(depositor, amountA, amountB)

        const payloadOnFailure = beginCell().storeStringTail("Failure").endCell()
        const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()

        const amountToSwap = toNano(0.05)
        const expectedOutput =
            (await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)) + 1n // +1 to fail transaction due to slippage

        const swapResult = await swap(
            amountToSwap,
            "vaultA",
            expectedOutput,
            0n,
            false,
            null,
            payloadOnSuccess,
            payloadOnFailure,
        )

        expect(swapResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: ammPool.address,
            op: AmmPool.opcodes.SwapIn,
            exitCode: AmmPool.errors["Pool: Amount out is less than desired amount"],
        })

        const payoutTx = findTransactionRequired(swapResult.transactions, {
            from: ammPool.address,
            to: vaultA.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })

        const payoutBody = flattenTransaction(payoutTx).body?.beginParse()
        const parsedPayout = loadPayoutFromPool(payoutBody!!)
        expect(parsedPayout.otherVault).toEqualAddress(vaultB.vault.address)
        expect(parsedPayout.amount).toEqual(amountToSwap)
        expect(parsedPayout.receiver).toEqualAddress(depositor.address)
        expect(parsedPayout.payloadToForward!!).toEqualCell(payloadOnFailure)
    })

    test("Swap failed due to timeout should return failure payload", async () => {
        const blockchain = await Blockchain.create()
        const {ammPool, vaultA, vaultB, initWithLiquidity, swap} =
            await createJettonAmmPool(blockchain)

        // deploy liquidity deposit contract
        const initialRatio = 2n
        const amountA = toNano(1)
        const amountB = amountA * initialRatio // 1 a == 2 b ratio
        const depositor = vaultA.treasury.walletOwner
        const _ = await initWithLiquidity(depositor, amountA, amountB)

        const payloadOnFailure = beginCell().storeStringTail("Failure").endCell()
        const payloadOnSuccess = beginCell().storeStringTail("Success").endCell()

        const amountToSwap = toNano(0.05)
        const expectedOutput = await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)
        const timeout = BigInt(Math.floor(Date.now() / 1000) - 42) // 42 seconds ago, random number

        const swapResult = await swap(
            amountToSwap,
            "vaultA",
            expectedOutput,
            timeout,
            false,
            null,
            payloadOnSuccess,
            payloadOnFailure,
        )

        expect(swapResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: ammPool.address,
            op: AmmPool.opcodes.SwapIn,
            exitCode: AmmPool.errors["Pool: Swap timeout"],
        })

        const payoutTx = findTransactionRequired(swapResult.transactions, {
            from: ammPool.address,
            to: vaultA.vault.address,
            op: AmmPool.opcodes.PayoutFromPool,
            success: true,
        })

        const payoutBody = flattenTransaction(payoutTx).body?.beginParse()
        const parsedPayout = loadPayoutFromPool(payoutBody!!)
        expect(parsedPayout.otherVault).toEqualAddress(vaultB.vault.address)
        expect(parsedPayout.amount).toEqual(amountToSwap)
        expect(parsedPayout.receiver).toEqualAddress(depositor.address)
        expect(parsedPayout.payloadToForward!!).toEqualCell(payloadOnFailure)
    })
})



================================================
FILE: sources/tests/swaps-math.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/swaps-math.spec.ts
================================================
import {Blockchain} from "@ton/sandbox"
import {createJettonAmmPool, createTonJettonAmmPool} from "../utils/environment"
import {toNano} from "@ton/core"
import {AmmPool} from "../output/DEX_AmmPool"
// eslint-disable-next-line
import {SendDumpToDevWallet} from "@tondevwallet/traces"
import {calculateAmountIn, calculateAmountOut, calculateSwapResult} from "../utils/liquidityMath"

const expectEqualTvmToJs = (expected: bigint, got: bigint) => {
    expect(expected).toBeGreaterThanOrEqual(got - 1n)
    expect(expected).toBeLessThanOrEqual(got + 1n)
}
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// this test suite ensures that swaps math is compatible with uniswap v2 spec
describe.each([
    {
        name: "Jetton->Jetton",
        createPool: createJettonAmmPool,
    },
    {
        name: "TON->Jetton",
        createPool: createTonJettonAmmPool,
    },
])("Swaps math for $name", ({createPool}) => {
    test("should correctly return expected out", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = BigInt(random(1, 100))

        const amountARaw = toNano(random(1, 50))
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        await initWithLiquidity(depositor, amountA, amountB)

        const leftReserve = await ammPool.getLeftSide()
        const rightReserve = await ammPool.getRightSide()

        const reserveA = isSwapped ? rightReserve : leftReserve
        const reserveB = isSwapped ? leftReserve : rightReserve

        const amountToSwap = BigInt(random(1, 50))
        const expectedOutput = await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)

        const res = calculateAmountOut(reserveA, reserveB, AmmPool.PoolFee, amountToSwap)

        // difference in tvm and js rounding
        expectEqualTvmToJs(expectedOutput, res)
    })

    test("should correctly change reserves after the swap", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, swap, isSwapped, initWithLiquidity} =
            await createPool(blockchain)

        const initialRatio = BigInt(random(1, 100))

        const amountARaw = toNano(random(1, 50))
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        await initWithLiquidity(depositor, amountA, amountB)

        const leftReserve = await ammPool.getLeftSide()
        const rightReserve = await ammPool.getRightSide()

        const reserveA = isSwapped ? rightReserve : leftReserve
        const reserveB = isSwapped ? leftReserve : rightReserve

        const amountToSwap = BigInt(random(1, 50))
        const expectedOutput = await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)

        const res = calculateSwapResult(reserveA, reserveB, AmmPool.PoolFee, amountToSwap, 0n)

        const swapResult = await swap(amountToSwap, "vaultA", expectedOutput, 0n, false, null, null)

        // check that swap was successful
        expect(swapResult.transactions).toHaveTransaction({
            from: vaultA.vault.address,
            to: ammPool.address,
            op: AmmPool.opcodes.SwapIn,
            success: true,
        })

        const leftReserveAfter = await ammPool.getLeftSide()
        const rightReserveAfter = await ammPool.getRightSide()

        const aReserveAfter = isSwapped ? rightReserveAfter : leftReserveAfter
        const bReserveAfter = isSwapped ? leftReserveAfter : rightReserveAfter

        // check reserves change
        expectEqualTvmToJs(aReserveAfter, res.reserveA)
        expectEqualTvmToJs(bReserveAfter, res.reserveB)
    })

    test("should correctly change reserves after series of swaps", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultA, vaultB, swap, isSwapped, initWithLiquidity} =
            await createPool(blockchain)

        const initialRatio = BigInt(random(1, 100))

        const amountARaw = toNano(random(1, 50))
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        await initWithLiquidity(depositor, amountA, amountB)

        // check that reserves correctly change after series of swaps
        // this is different from the previous test since there could be
        // an error with payouts that will appear only in the long term
        for (let index = 0; index < 20; index++) {
            const leftReserve = await ammPool.getLeftSide()
            const rightReserve = await ammPool.getRightSide()

            const reserveA = isSwapped ? rightReserve : leftReserve
            const reserveB = isSwapped ? leftReserve : rightReserve

            const amountToSwap = BigInt(random(1, 50))
            const expectedOutput = await ammPool.getExpectedOut(vaultA.vault.address, amountToSwap)

            const res = calculateSwapResult(reserveA, reserveB, AmmPool.PoolFee, amountToSwap, 0n)

            const swapResult = await swap(
                amountToSwap,
                "vaultA",
                expectedOutput,
                0n,
                false,
                null,
                null,
            )

            // check that swap was successful
            expect(swapResult.transactions).toHaveTransaction({
                from: vaultA.vault.address,
                to: ammPool.address,
                op: AmmPool.opcodes.SwapIn,
                success: true,
            })

            const leftReserveAfter = await ammPool.getLeftSide()
            const rightReserveAfter = await ammPool.getRightSide()

            const aReserveAfter = isSwapped ? rightReserveAfter : leftReserveAfter
            const bReserveAfter = isSwapped ? leftReserveAfter : rightReserveAfter

            // check reserves change
            expectEqualTvmToJs(aReserveAfter, res.reserveA)
            expectEqualTvmToJs(bReserveAfter, res.reserveB)
        }
    })

    test("should correctly return expected in for exact out", async () => {
        const blockchain = await Blockchain.create()

        const {ammPool, vaultB, isSwapped, initWithLiquidity} = await createPool(blockchain)

        const initialRatio = BigInt(random(1, 100))

        const amountARaw = toNano(random(1, 50))
        const amountBRaw = amountARaw * initialRatio // 1 a == 2 b ratio

        const amountA = isSwapped ? amountARaw : amountBRaw
        const amountB = isSwapped ? amountBRaw : amountARaw

        const depositor = vaultB.treasury.walletOwner

        await initWithLiquidity(depositor, amountA, amountB)

        const leftReserve = await ammPool.getLeftSide()
        const rightReserve = await ammPool.getRightSide()

        const reserveA = isSwapped ? rightReserve : leftReserve
        const reserveB = isSwapped ? leftReserve : rightReserve

        const amountToGetAfterSwap = BigInt(random(1, 50))
        const expectedInput = await ammPool.getNeededInToGetX(
            vaultB.vault.address,
            amountToGetAfterSwap,
        )

        const res = calculateAmountIn(reserveA, reserveB, AmmPool.PoolFee, amountToGetAfterSwap)

        // difference in tvm and js rounding
        expectEqualTvmToJs(expectedInput, res)
    })
})



================================================
FILE: sources/tests/ton-vault.spec.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/tests/ton-vault.spec.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Blockchain} from "@ton/sandbox"
import {createJetton, createTonVault} from "../utils/environment"
import {beginCell} from "@ton/core"
import {findTransactionRequired, flattenTransaction} from "@ton/test-utils"
import {randomInt} from "node:crypto"
import {TonVault} from "../output/DEX_TonVault"

describe("TON Vault", () => {
    test("Jettons are returned if sent to TON Vault", async () => {
        const blockchain = await Blockchain.create()
        const vaultSetup = await createTonVault(blockchain)

        const _ = await vaultSetup.deploy()
        const mockActionPayload = beginCell().storeStringTail("Random payload").endCell()

        const jetton = await createJetton(blockchain)
        const initialBalance = await jetton.wallet.getJettonBalance()
        const numberOfJettons = BigInt(randomInt(0, 100000000000))
        const sendResult = await jetton.transfer(
            vaultSetup.vault.address,
            numberOfJettons,
            mockActionPayload,
        )

        const toVaultTx = flattenTransaction(
            findTransactionRequired(sendResult.transactions, {
                to: vaultSetup.vault.address,
                op: TonVault.opcodes.UnexpectedJettonNotification,
                success: true, // Because commit was called
                exitCode:
                    TonVault.errors[
                        "TonVault: Jetton transfer must be performed to correct Jetton Vault"
                    ],
            }),
        )

        expect(sendResult.transactions).toHaveTransaction({
            from: vaultSetup.vault.address,
            to: toVaultTx.from,
            op: TonVault.opcodes.ReturnJettonsViaJettonTransfer,
            success: true,
        })
        const finalJettonBalance = await jetton.wallet.getJettonBalance()
        expect(finalJettonBalance).toEqual(initialBalance)
    })
})



================================================
FILE: sources/utils/deployUtils.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/utils/deployUtils.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Dictionary, beginCell, Cell, Address} from "@ton/core"
import {Sha256} from "@aws-crypto/sha256-js"

const ONCHAIN_CONTENT_PREFIX = 0x00
const SNAKE_PREFIX = 0x00
const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8)

const sha256 = (str: string) => {
    const sha = new Sha256()
    sha.update(str)
    return Buffer.from(sha.digestSync())
}

const toKey = (key: string) => {
    return BigInt(`0x${sha256(key).toString("hex")}`)
}

export function buildOnchainMetadata(data: {
    name: string
    description: string
    image: string
}): Cell {
    const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())

    // Store the on-chain metadata in the dictionary
    Object.entries(data).forEach(([key, value]) => {
        dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")))
    })

    return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell()
}

export function makeSnakeCell(data: Buffer) {
    // Create a cell that package the data
    const chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES)

    const b = chunks.reduceRight((curCell, chunk, index) => {
        if (index === 0) {
            curCell.storeInt(SNAKE_PREFIX, 8)
        }
        curCell.storeBuffer(chunk)
        if (index > 0) {
            const cell = curCell.endCell()
            return beginCell().storeRef(cell)
        } else {
            return curCell
        }
    }, beginCell())
    return b.endCell()
}
function bufferToChunks(buff: Buffer, chunkSize: number) {
    const chunks: Buffer[] = []
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize))
        buff = buff.slice(chunkSize)
    }
    return chunks
}

export function sortAddresses(
    address1: Address,
    address2: Address,
    leftAmount: bigint,
    rightAmount: bigint,
) {
    const address1Hash = BigInt("0x" + address1.hash.toString("hex"))
    const address2Hash = BigInt("0x" + address2.hash.toString("hex"))
    if (address1Hash < address2Hash) {
        return {lower: address1, higher: address2, leftAmount: leftAmount, rightAmount: rightAmount}
    } else {
        return {lower: address2, higher: address1, leftAmount: rightAmount, rightAmount: leftAmount}
    }
}



================================================
FILE: sources/utils/environment.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/utils/environment.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Blockchain, SandboxContract, SendMessageResult, TreasuryContract} from "@ton/sandbox"
import {ExtendedJettonMinter as JettonMinter} from "../wrappers/ExtendedJettonMinter"
import {ExtendedJettonWallet as JettonWallet} from "../wrappers/ExtendedJettonWallet"
import {Address, beginCell, Cell, SendMode, toNano} from "@ton/core"
import {JettonVault} from "../output/DEX_JettonVault"
import {sortAddresses} from "./deployUtils"
import {AmmPool, SwapStep} from "../output/DEX_AmmPool"
import {LiquidityDepositContract} from "../output/DEX_LiquidityDepositContract"
import {
    createJettonVaultLiquidityDepositPayload,
    createJettonVaultSwapRequest,
    createTonSwapRequest,
    createTonVaultLiquidityDepositPayload,
    createWithdrawLiquidityBody,
} from "./testUtils"
import {randomAddress} from "@ton/test-utils"
import {TonVault} from "../output/DEX_TonVault"
import {ExtendedLPJettonWallet} from "../wrappers/ExtendedLPJettonWallet"

// TODO: unify common prefix to structs on create setups
export const createJetton = async (blockchain: Blockchain) => {
    const minterOwner = await blockchain.treasury("jetton-owner")
    const walletOwner = await blockchain.treasury("wallet-owner")
    const mintAmount = toNano(100000)

    const minter = blockchain.openContract(
        await JettonMinter.fromInit(
            0n,
            minterOwner.address,
            beginCell().storeAddress(randomAddress(0)).endCell(), // salt
        ),
    )
    // external -> minter (from owner) -> wallet (to wallet owner)
    await minter.sendMint(minterOwner.getSender(), walletOwner.address, mintAmount, 0n, toNano(1))

    const wallet = blockchain.openContract(
        new JettonWallet(await minter.getGetWalletAddress(walletOwner.address)),
    )

    const transfer = async (to: Address, jettonAmount: bigint, forwardPayload: Cell | null) => {
        const transferResult = await wallet.sendTransfer(
            walletOwner.getSender(),
            toNano(2),
            jettonAmount,
            to,
            walletOwner.address,
            null,
            toNano(1),
            forwardPayload,
        )

        return transferResult
    }

    return {
        minter,
        wallet,
        walletOwner,
        transfer,
    }
}

export type JettonTreasury = Awaited<ReturnType<typeof createJetton>>
export type TonTreasury = SandboxContract<TreasuryContract>

export type Create<T> = (blockchain: Blockchain) => Promise<T>

type SandboxSendResult = SendMessageResult & {
    result: void
}

export type VaultInterface<T> = {
    vault: {
        address: Address
    }
    treasury: T
    deploy: () => Promise<SandboxSendResult>
    // TON Vault is always inited, no need to init explicitly
    isInited: () => Promise<boolean>
    addLiquidity: (
        liquidityDepositContractAddress: Address,
        amount: bigint,
        payloadOnSuccess?: Cell | null,
        payloadOnFailure?: Cell | null,
        minAmountToDeposit?: bigint,
        lpTimeout?: bigint,
        liquidityDepositContractData?: {
            otherVaultAddress: Address
            otherAmount: bigint
            id: bigint
        },
    ) => Promise<SandboxSendResult>
    sendSwapRequest: (
        amountToSwap: bigint,
        destinationPool: Address,
        isExactOutType: boolean,
        desiredAmount: bigint,
        timeout: bigint,
        // This value is needed only for exactOut swaps, for exactIn it is ignored
        cashbackAddress: Address | null,
        payloadOnSuccess: Cell | null,
        payloadOnFailure: Cell | null,
        nextStep: SwapStep | null,
        receiver: Address | null,
    ) => Promise<SandboxSendResult>
}

export const createJettonVault: Create<VaultInterface<JettonTreasury>> = async (
    blockchain: Blockchain,
) => {
    const jetton = await createJetton(blockchain)

    const vault = blockchain.openContract(await JettonVault.fromInit(jetton.minter.address, null))

    const deploy = async () => {
        const deployRes = await vault.send(
            (await blockchain.treasury("any-user")).getSender(),
            {value: toNano(0.1), bounce: false},
            null,
        )
        if ((await blockchain.getContract(vault.address)).balance > 0n) {
            throw new Error("Vault balance should be 0 after deploy")
        }
        return deployRes
    }

    const isInited = async () => {
        return await vault.getInited()
    }

    const addLiquidity = async (
        liquidityDepositContractAddress: Address,
        amount: bigint,
        payloadOnSuccess: Cell | null = null,
        payloadOnFailure: Cell | null = null,
        minAmountToDeposit: bigint = 0n,
        lpTimeout: bigint = BigInt(Math.ceil(Date.now() / 1000) + 5 * 60), // 5 minutes
        liquidityDepositContractData?: {
            otherVaultAddress: Address
            otherAmount: bigint
            id: bigint
        },
    ) => {
        return await jetton.transfer(
            vault.address,
            amount,
            createJettonVaultLiquidityDepositPayload(
                liquidityDepositContractAddress,
                jetton.minter.init?.code,
                jetton.minter.init?.data,
                minAmountToDeposit,
                lpTimeout,
                payloadOnSuccess,
                payloadOnFailure,
                liquidityDepositContractData,
            ),
        )
    }

    const sendSwapRequest = async (
        amountToSwap: bigint,
        destinationPool: Address,
        isExactOutType: boolean,
        desiredAmount: bigint,
        timeout: bigint,
        cashbackAddress: Address | null,
        payloadOnSuccess: Cell | null,
        payloadOnFailure: Cell | null,
        nextStep?: SwapStep | null,
        receiver: Address | null = null,
    ) => {
        const swapRequest = createJettonVaultSwapRequest(
            destinationPool,
            isExactOutType,
            desiredAmount,
            timeout,
            cashbackAddress,
            payloadOnSuccess,
            payloadOnFailure,
            nextStep,
            receiver,
        )

        return await jetton.transfer(vault.address, amountToSwap, swapRequest)
    }

    return {
        vault,
        treasury: jetton,
        isInited,
        deploy,
        addLiquidity,
        sendSwapRequest,
    }
}

export const createTonVault: Create<VaultInterface<TonTreasury>> = async (
    blockchain: Blockchain,
) => {
    const vaultOwner = await blockchain.treasury("vault-owner")

    const vault = blockchain.openContract(await TonVault.fromInit(vaultOwner.address))

    const wallet = await blockchain.treasury("wallet-owner")

    const deploy = async () => {
        const contractWasInited =
            (await blockchain.getContract(vault.address)).accountState?.type == "active"
        const deployRes = await vault.send(
            (await blockchain.treasury("any-user-3")).getSender(),
            {value: toNano(0.1), bounce: false},
            null,
        )
        const balance = (await blockchain.getContract(vault.address)).balance
        if (!contractWasInited && balance > 0n) {
            throw new Error("Vault balance should be 0 after deploy, got " + balance)
        }
        return deployRes
    }

    const addLiquidity = async (
        liquidityDepositContractAddress: Address,
        amount: bigint,
        payloadOnSuccess: Cell | null = null,
        payloadOnFailure: Cell | null = null,
        minAmountToDeposit: bigint = 0n,
        lpTimeout: bigint = BigInt(Math.ceil(Date.now() / 1000) + 5 * 60), // 5 minutes
        liquidityDepositContractData?: {
            otherVaultAddress: Address
            otherAmount: bigint
            id: bigint
        },
    ) => {
        return await wallet.send({
            to: vault.address,
            value: amount + toNano(0.2), // fee
            bounce: true,
            body: createTonVaultLiquidityDepositPayload(
                liquidityDepositContractAddress,
                amount,
                payloadOnSuccess,
                payloadOnFailure,
                minAmountToDeposit,
                lpTimeout,
                liquidityDepositContractData,
            ),
        })
    }

    const sendSwapRequest = async (
        amountToSwap: bigint,
        destinationPool: Address,
        isExactOutType: boolean,
        desiredAmount: bigint,
        timeout: bigint,
        cashbackAddress: Address | null,
        payloadOnSuccess: Cell | null,
        payloadOnFailure: Cell | null,
        nextStep: SwapStep | null,
        receiver: Address | null = null,
    ) => {
        const swapRequest = createTonSwapRequest(
            destinationPool,
            receiver,
            amountToSwap,
            isExactOutType,
            desiredAmount,
            timeout,
            cashbackAddress,
            payloadOnSuccess,
            payloadOnFailure,
            nextStep,
        )

        return await wallet.send({
            to: vault.address,
            value: amountToSwap + toNano(0.2), // fee
            bounce: true,
            body: swapRequest,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    return {
        deploy,
        vault,
        isInited: async () => {
            return true
        },
        treasury: wallet,
        addLiquidity,
        sendSwapRequest,
    }
}

const createLiquidityDepositSetup = (
    blockchain: Blockchain,
    vaultLeft: Address,
    vaultRight: Address,
) => {
    const depositorIds: Map<string, bigint> = new Map()

    return async (
        depositorContract: SandboxContract<TreasuryContract>,
        amountLeft: bigint,
        amountRight: bigint,
    ) => {
        const depositor = depositorContract.address

        const depositorKey = depositor.toRawString()
        const contractId = depositorIds.get(depositorKey) || 0n
        depositorIds.set(depositorKey, contractId + 1n)

        const sortedAddresses = sortAddresses(vaultLeft, vaultRight, amountLeft, amountRight)

        const liquidityDeposit = blockchain.openContract(
            await LiquidityDepositContract.fromInit(
                sortedAddresses.lower,
                sortedAddresses.higher,
                sortedAddresses.leftAmount,
                sortedAddresses.rightAmount,
                depositor,
                contractId,
                0n,
                null,
                null,
            ),
        )

        const deploy = async () => {
            const deployResult = await liquidityDeposit.send(
                (await blockchain.treasury("any-user-2")).getSender(),
                {value: toNano(0.1), bounce: false},
                null,
            )
            if ((await blockchain.getContract(liquidityDeposit.address)).balance > 0n) {
                throw new Error("Liquidity deposit balance should be 0 after deploy")
            }

            return deployResult
        }

        const ammPool = blockchain.openContract(
            await AmmPool.fromInit(sortedAddresses.lower, sortedAddresses.higher, 0n, 0n, 0n, null),
        )

        const depositorLpWallet = blockchain.openContract(
            await ExtendedLPJettonWallet.fromInit(0n, depositor, ammPool.address),
        )

        const withdrawLiquidity = async (
            amount: bigint,
            minAmountLeft: bigint,
            minAmountRight: bigint,
            timeout: bigint,
            successfulPayload: Cell | null,
        ) => {
            const withdrawResult = await depositorLpWallet.sendBurn(
                depositorContract.getSender(),
                toNano(2),
                amount,
                depositor,
                createWithdrawLiquidityBody(
                    minAmountLeft,
                    minAmountRight,
                    timeout,
                    depositor,
                    successfulPayload,
                ),
            )

            const balance = (await blockchain.getContract(liquidityDeposit.address)).balance

            if (balance > 0n) {
                throw new Error(
                    `AmmPool balance should be 0 after withdraw, and its: ${balance.toString()}`,
                )
            }

            return withdrawResult
        }

        return {
            deploy,
            liquidityDeposit,
            depositorLpWallet,
            withdrawLiquidity,
        }
    }
}

export const createAmmPoolFromCreators =
    <T, U>(createLeft: Create<VaultInterface<T>>, createRight: Create<VaultInterface<U>>) =>
    async (blockchain: Blockchain) => {
        const firstVault = await createLeft(blockchain)
        const secondVault = await createRight(blockchain)
        return createAmmPool(firstVault, secondVault, blockchain)
    }

export const createAmmPool = async <T, U>(
    firstVault: VaultInterface<T>,
    secondVault: VaultInterface<U>,
    blockchain: Blockchain,
) => {
    const sortedVaults = sortAddresses(firstVault.vault.address, secondVault.vault.address, 0n, 0n)

    const vaultA = sortedVaults.lower === firstVault.vault.address ? firstVault : secondVault
    const vaultB = sortedVaults.lower === firstVault.vault.address ? secondVault : firstVault

    const sortedAddresses = sortAddresses(vaultA.vault.address, vaultB.vault.address, 0n, 0n)

    const ammPool = blockchain.openContract(
        await AmmPool.fromInit(vaultA.vault.address, vaultB.vault.address, 0n, 0n, 0n, null),
    )

    const liquidityDepositSetup = createLiquidityDepositSetup(
        blockchain,
        sortedAddresses.lower,
        sortedAddresses.higher,
    )

    // for later stage setup do everything by obtaining the address of the liq deposit here
    //
    // - deploy vaults
    // - deploy liq deposit
    // - add liq to vaults
    const initWithLiquidity = async (
        depositor: SandboxContract<TreasuryContract>,
        amountLeft: bigint,
        amountRight: bigint,
    ) => {
        await vaultA.deploy()
        await vaultB.deploy()
        const liqSetup = await liquidityDepositSetup(depositor, amountLeft, amountRight)

        await liqSetup.deploy()
        await vaultA.addLiquidity(liqSetup.liquidityDeposit.address, amountLeft)
        await vaultB.addLiquidity(liqSetup.liquidityDeposit.address, amountRight)

        if ((await blockchain.getContract(ammPool.address)).balance > 0n) {
            throw new Error("Vault balance should be 0 after deploy")
        }

        return {
            depositorLpWallet: liqSetup.depositorLpWallet,
            withdrawLiquidity: liqSetup.withdrawLiquidity,
        }
    }

    const swap = async (
        amountToSwap: bigint,
        swapFrom: "vaultA" | "vaultB",
        desiredAmount: bigint = 0n,
        timeout: bigint = 0n,
        isExactOutType: boolean = false,
        cashbackAddress: Address | null = null,
        payloadOnSuccess: Cell | null = null,
        payloadOnFailure: Cell | null = null,
        nextSwapStep: SwapStep | null = null,
        receiver: Address | null = null,
    ) => {
        let swapRes
        if (swapFrom === "vaultA") {
            swapRes = await firstVault.sendSwapRequest(
                amountToSwap,
                ammPool.address,
                isExactOutType,
                desiredAmount,
                timeout,
                cashbackAddress,
                payloadOnSuccess,
                payloadOnFailure,
                nextSwapStep,
                receiver,
            )
        } else {
            swapRes = await secondVault.sendSwapRequest(
                amountToSwap,
                ammPool.address,
                isExactOutType,
                desiredAmount,
                timeout,
                cashbackAddress,
                payloadOnSuccess,
                payloadOnFailure,
                nextSwapStep,
                receiver,
            )
        }

        if ((await blockchain.getContract(ammPool.address)).balance > 0n) {
            throw new Error("AmmPool balance should be 0 after swap")
        }

        return swapRes
    }

    return {
        ammPool,
        vaultA: firstVault,
        vaultB: secondVault,
        sorted: sortedVaults,
        isSwapped: sortedVaults.lower !== firstVault.vault.address,
        liquidityDepositSetup,
        swap,
        initWithLiquidity,
    }
}

export const createJettonAmmPool = createAmmPoolFromCreators<JettonTreasury, JettonTreasury>(
    createJettonVault,
    createJettonVault,
)

export const createTonJettonAmmPool = createAmmPoolFromCreators<TonTreasury, JettonTreasury>(
    createTonVault,
    createJettonVault,
)



================================================
FILE: sources/utils/liquidityMath.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/utils/liquidityMath.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

const bigintSqrt = (value: bigint): bigint => {
    if (value < 0n) {
        throw new Error("Square root of negative numbers is not supported for bigints.")
    }
    if (value < 2n) {
        return value
    }

    let x0 = value
    let x1 = (value >> 1n) + 1n
    while (x1 < x0) {
        x0 = x1
        x1 = (value / x1 + x1) >> 1n // Newton's method
    }
    return x0
}

const bigintMin = (a: bigint, b: bigint): bigint => {
    return a < b ? a : b
}

type LiquidityProvisioningResult = {
    reserveA: bigint
    reserveB: bigint
    lpTokens: bigint
}

// https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L110
// https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router01.sol#L30
export const calculateLiquidityProvisioning = (
    tokenAReserveBefore: bigint,
    tokenBReserveBefore: bigint,
    amountADesired: bigint,
    amountBDesired: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    mintedLpTokenTotalSupply: bigint,
): LiquidityProvisioningResult => {
    if (tokenAReserveBefore === BigInt(0) && tokenBReserveBefore === BigInt(0)) {
        return {
            lpTokens: bigintSqrt(amountADesired * amountBDesired),
            reserveA: amountADesired,
            reserveB: amountBDesired,
        }
    }

    if (amountADesired * tokenBReserveBefore >= amountBDesired * tokenAReserveBefore) {
        if (amountBDesired < amountBMin) {
            throw new Error("Insufficient B token amount")
        }

        const amountA = (amountBDesired * tokenAReserveBefore) / tokenBReserveBefore
        if (amountA < amountAMin) {
            throw new Error("Insufficient A token amount")
        }

        return {
            lpTokens: bigintMin(
                (amountA * mintedLpTokenTotalSupply) / tokenAReserveBefore,
                (amountBDesired * mintedLpTokenTotalSupply) / tokenBReserveBefore,
            ),
            reserveA: amountA + tokenAReserveBefore,
            reserveB: amountBDesired + tokenBReserveBefore,
        }
    }

    if (amountADesired < amountAMin) {
        throw new Error("Insufficient A token amount")
    }
    const amountB = (amountADesired * tokenBReserveBefore) / tokenAReserveBefore
    if (amountB < amountBMin) {
        throw new Error("Insufficient B token amount")
    }

    return {
        lpTokens: bigintMin(
            (amountADesired * mintedLpTokenTotalSupply) / tokenAReserveBefore,
            (amountB * mintedLpTokenTotalSupply) / tokenBReserveBefore,
        ),
        reserveA: amountADesired + tokenAReserveBefore,
        reserveB: amountB + tokenBReserveBefore,
    }
}

export const calculateLiquidityWithdraw = (
    tokenAReserveBefore: bigint,
    tokenBReserveBefore: bigint,
    burnAmount: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    mintedLpTokenTotalSupply: bigint,
) => {
    const amountA = (tokenAReserveBefore * burnAmount) / mintedLpTokenTotalSupply
    const amountB = (tokenBReserveBefore * burnAmount) / mintedLpTokenTotalSupply

    if (amountA < amountAMin) {
        throw new Error("Insufficient A token amount")
    }

    if (amountB < amountBMin) {
        throw new Error("Insufficient B token amount")
    }

    return {
        reserveA: tokenAReserveBefore - amountA,
        reserveB: tokenBReserveBefore - amountB,
        amountA,
        amountB,
        totalSupply: mintedLpTokenTotalSupply - burnAmount,
    }
}

// https://github.com/Uniswap/v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol#L43
export const calculateAmountOut = (
    tokenAReserveBefore: bigint,
    tokenBReserveBefore: bigint,
    poolFee: bigint,
    tokenAIn: bigint,
) => {
    const amountInWithFee = tokenAIn * (1000n - poolFee)
    const numerator = amountInWithFee * tokenBReserveBefore
    const denominator = tokenAReserveBefore * 1000n + amountInWithFee

    return numerator / denominator
}

type SwapResult = {
    reserveA: bigint
    reserveB: bigint
    amountOut: bigint
}

export const calculateSwapResult = (
    tokenAReserveBefore: bigint,
    tokenBReserveBefore: bigint,
    poolFee: bigint,
    tokenAIn: bigint,
    minAmountOut: bigint,
): SwapResult => {
    const amountInWithFee = tokenAIn * (1000n - poolFee)
    const numerator = amountInWithFee * tokenBReserveBefore
    const denominator = tokenAReserveBefore * 1000n + amountInWithFee

    const amountOut = numerator / denominator

    if (amountOut < minAmountOut) {
        throw new Error("Could not satisfy min amount out")
    }

    return {
        amountOut,
        reserveA: tokenAReserveBefore + tokenAIn,
        reserveB: tokenBReserveBefore - amountOut,
    }
}

export const calculateAmountIn = (
    tokenAReserveBefore: bigint,
    tokenBReserveBefore: bigint,
    poolFee: bigint,
    tokenBOut: bigint,
) => {
    const numerator = tokenAReserveBefore * tokenBOut * 1000n
    const denominator = (tokenBReserveBefore - tokenBOut) * (1000n - poolFee)

    return numerator / denominator
}



================================================
FILE: sources/utils/testUtils.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/utils/testUtils.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {Address, beginCell, Builder, Cell} from "@ton/core"
import {
    SwapRequest,
    storeSwapRequest,
    SwapRequestOpcode,
    storeLPDepositPart,
    LPDepositPartOpcode,
    SwapStep,
    LiquidityDepositEitherAddress,
} from "../output/DEX_AmmPool"
import {
    PROOF_NO_PROOF_ATTACHED,
    PROOF_TEP89,
    PROOF_STATE_INIT,
    storeLiquidityWithdrawParameters,
    PROOF_STATE_TO_THE_BLOCK,
    storeStateProof,
} from "../output/DEX_JettonVault"
import {storeAddLiquidityPartTon, storeSwapRequestTon} from "../output/DEX_TonVault"
import {randomBytes} from "node:crypto"

export type NoProof = {
    proofType: 0n
}

export type TEP89Proof = {
    proofType: 1n
}

export type StateInitProof = {
    proofType: 2n
    code: Cell
    data: Cell
}

export type StateProof = {
    proofType: 3n
    mcBlockSeqno: bigint
    shardBitLen: bigint
    mcBlockHeaderProof: Cell
    shardBlockHeaderProof: Cell
    shardChainStateProof: Cell
}

export type Proof = NoProof | TEP89Proof | StateInitProof | StateProof

function storeProof(proof: Proof) {
    return (b: Builder) => {
        b.storeUint(proof.proofType, 8)
        switch (proof.proofType) {
            case PROOF_NO_PROOF_ATTACHED:
                break
            case PROOF_TEP89:
                break
            case PROOF_STATE_INIT:
                b.storeRef(proof.code)
                b.storeRef(proof.data)
                break
            case PROOF_STATE_TO_THE_BLOCK:
                b.store(
                    storeStateProof({
                        $$type: "StateProof",
                        mcBlockSeqno: proof.mcBlockSeqno,
                        shardBitLen: proof.shardBitLen,
                        mcBlockHeaderProof: proof.mcBlockHeaderProof,
                        shardBlockHeaderProof: proof.shardBlockHeaderProof,
                        shardChainStateProof: proof.shardChainStateProof,
                    }),
                )
                break
            default:
                throw new Error("Unknown proof type")
        }
    }
}

export function createJettonVaultMessage(opcode: bigint, payload: Cell, proof: Proof) {
    return beginCell()
        .storeUint(0, 1) // Either bit
        .storeUint(opcode, 32)
        .storeRef(payload)
        .store(storeProof(proof))
        .endCell()
}

export function createJettonVaultSwapRequest(
    destinationPool: Address,
    isExactOutType: boolean = false,
    // Default is exactIn
    desiredAmount: bigint = 0n,
    timeout: bigint = 0n,
    cashbackAddress: Address | null = null,
    payloadOnSuccess: Cell | null = null,
    payloadOnFailure: Cell | null = null,
    nextStep: SwapStep | null = null,
    receiver: Address | null = null,
) {
    const swapRequest: SwapRequest = {
        $$type: "SwapRequest",
        pool: destinationPool,
        receiver: receiver,
        params: {
            $$type: "SwapParameters",
            isExactOutType,
            cashbackAddress,
            desiredAmount,
            payloadOnSuccess,
            payloadOnFailure,
            timeout,
            nextStep,
        },
    }

    return createJettonVaultMessage(
        SwapRequestOpcode,
        beginCell().store(storeSwapRequest(swapRequest)).endCell(),
        // This function does not specify proof code and data as there is no sense to swap anything without ever providing a liquidity.
        {
            proofType: PROOF_NO_PROOF_ATTACHED,
        },
    )
}

const createLiquidityDepositEitherAddress = (
    LPContract: Address,
    liquidityDepositContractData?: {
        otherVaultAddress: Address
        otherAmount: bigint
        id: bigint
    },
) => {
    const eitherData: LiquidityDepositEitherAddress = {
        $$type: "LiquidityDepositEitherAddress",
        eitherBit: false,
        liquidityDepositContract: LPContract,
        initData: null,
    }

    if (typeof liquidityDepositContractData !== "undefined") {
        eitherData.eitherBit = true
        eitherData.liquidityDepositContract = null
        eitherData.initData = {
            $$type: "LiquidityDepositInitData",
            otherVault: liquidityDepositContractData.otherVaultAddress,
            otherAmount: liquidityDepositContractData.otherAmount,
            contractId: liquidityDepositContractData.id,
        }
    }

    return eitherData
}

export function createJettonVaultLiquidityDepositPayload(
    LPContract: Address,
    proofCode: Cell | undefined,
    proofData: Cell | undefined,
    minAmountToDeposit: bigint = 0n,
    lpTimeout: bigint = BigInt(Math.ceil(Date.now() / 1000) + 5 * 60), // 5 minutes
    payloadOnSuccess: Cell | null = null,
    payloadOnFailure: Cell | null = null,
    liquidityDepositContractData?: {
        otherVaultAddress: Address
        otherAmount: bigint
        id: bigint
    },
) {
    let proof: Proof
    if (proofCode !== undefined && proofData !== undefined) {
        proof = {
            proofType: PROOF_STATE_INIT,
            code: proofCode,
            data: proofData,
        }
    } else {
        proof = {
            proofType: PROOF_NO_PROOF_ATTACHED,
        }
    }

    const eitherData: LiquidityDepositEitherAddress = createLiquidityDepositEitherAddress(
        LPContract,
        liquidityDepositContractData,
    )

    return createJettonVaultMessage(
        LPDepositPartOpcode,
        beginCell()
            .store(
                storeLPDepositPart({
                    $$type: "LPDepositPart",
                    liquidityDepositContractData: eitherData,
                    additionalParams: {
                        $$type: "AdditionalParams",
                        minAmountToDeposit: minAmountToDeposit,
                        lpTimeout: lpTimeout,
                        payloadOnSuccess: payloadOnSuccess,
                        payloadOnFailure: payloadOnFailure,
                    },
                }),
            )
            .endCell(),
        proof,
    )
}

export function createTonVaultLiquidityDepositPayload(
    liquidityDepositContractAddress: Address,
    amount: bigint,
    payloadOnSuccess: Cell | null = null,
    payloadOnFailure: Cell | null = null,
    minAmountToDeposit: bigint = 0n,
    lpTimeout: bigint = BigInt(Math.ceil(Date.now() / 1000) + 5 * 60),
    liquidityDepositContractData?: {
        otherVaultAddress: Address
        otherAmount: bigint
        id: bigint
    },
) {
    const eitherData = createLiquidityDepositEitherAddress(
        liquidityDepositContractAddress,
        liquidityDepositContractData,
    )

    return beginCell()
        .store(
            storeAddLiquidityPartTon({
                $$type: "AddLiquidityPartTon",
                amountIn: amount,
                liquidityDepositContractData: eitherData,
                additionalParams: {
                    $$type: "AdditionalParams",
                    minAmountToDeposit: minAmountToDeposit,
                    lpTimeout: lpTimeout,
                    payloadOnSuccess: payloadOnSuccess,
                    payloadOnFailure: payloadOnFailure,
                },
            }),
        )
        .endCell()
}

export function createTonSwapRequest(
    pool: Address,
    receiver: Address | null,
    amountIn: bigint,
    isExactOutType: boolean,
    desiredAmount: bigint,
    timeout: bigint = 0n,
    cashbackAddress: Address | null = null,
    payloadOnSuccess: Cell | null = null,
    payloadOnFailure: Cell | null = null,
    nextStep: SwapStep | null = null,
) {
    return beginCell()
        .store(
            storeSwapRequestTon({
                $$type: "SwapRequestTon",
                amount: amountIn,
                action: {
                    $$type: "SwapRequest",
                    pool: pool,
                    receiver: receiver,
                    params: {
                        $$type: "SwapParameters",
                        isExactOutType,
                        cashbackAddress,
                        desiredAmount,
                        payloadOnSuccess,
                        payloadOnFailure,
                        timeout,
                        // Field for specifying the next step in the swap (for cross-pool swaps)
                        nextStep,
                    },
                },
            }),
        )
        .endCell()
}

export function createWithdrawLiquidityBody(
    minAmountLeft: bigint,
    minAmountRight: bigint,
    timeout: bigint,
    receiver: Address,
    successfulPayload: Cell | null,
) {
    return beginCell()
        .store(
            storeLiquidityWithdrawParameters({
                $$type: "LiquidityWithdrawParameters",
                leftAmountMin: minAmountLeft,
                rightAmountMin: minAmountRight,
                receiver,
                timeout,
                liquidityWithdrawPayload: successfulPayload,
            }),
        )
        .endCell()
}

// Coins is a value from 0 to 2^120-1 inclusive.
// https://github.com/ton-blockchain/ton/blob/6f745c04daf8861bb1791cffce6edb1beec62204/crypto/block/block.tlb#L116
export function randomCoins() {
    // 120 bits = 15 bytes
    return BigInt("0x" + randomBytes(15).toString("hex"))
}



================================================
FILE: sources/wrappers/ExtendedJettonMinter.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/wrappers/ExtendedJettonMinter.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {
    ChangeOwner,
    ClaimTON,
    JettonMinter,
    JettonUpdateContent,
    Mint,
    ProvideWalletAddress,
} from "../output/Jetton_JettonMinter"
import {Address, beginCell, Cell, ContractProvider, Sender, toNano} from "@ton/core"

export class ExtendedJettonMinter extends JettonMinter {
    constructor(address: Address, init?: {code: Cell; data: Cell}) {
        super(address, init)
    }

    static async fromInit(totalSupply: bigint, owner: Address, jettonContent: Cell) {
        const base = await JettonMinter.fromInit(totalSupply, owner, jettonContent, true)
        if (base.init === undefined) {
            throw new Error("JettonMinter init is not defined")
        }
        return new ExtendedJettonMinter(base.address, {code: base.init.code, data: base.init.data})
    }

    async getTotalSupply(provider: ContractProvider): Promise<bigint> {
        const res = await this.getGetJettonData(provider)
        return res.totalSupply
    }

    async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
        return this.getGetWalletAddress(provider, owner)
    }

    async getAdminAddress(provider: ContractProvider): Promise<Address> {
        const res = await this.getGetJettonData(provider)
        return res.adminAddress
    }

    async getContent(provider: ContractProvider): Promise<Cell> {
        const res = await this.getGetJettonData(provider)
        return res.jettonContent
    }

    /**
     * Sends a mint message to the Jetton Minter contract to mint new Jettons for a specified recipient.
     *
     * @param provider - The contract provider used to interact with the blockchain.
     * @param via - The sender object representing the wallet or account initiating the mint operation.
     * @param to - The recipient address to which the newly minted Jettons will be sent.
     * @param jettonAmount - The amount of Jettons to mint.
     * @param forwardTonAmount - The amount of TONs to forward to the recipient along with the Jettons.
     * @param totalTonAmount - The total amount of TONs to attach to the mint operation for fees and forwarding.
     *
     * @throws {Error} If the `totalTonAmount` is less than or equal to the `forwardTonAmount`.
     *
     * @returns A promise that resolves when the mint message has been sent.
     *
     * @example
     * await jettonMinter.sendMint(
     *     provider,
     *     sender,
     *     recipientAddress,
     *     toNano("1000"), // Jetton amount
     *     toNano("0.05"), // Forward TON amount
     *     toNano("0.1"),  // Total TON amount
     * );
     */
    async sendMint(
        provider: ContractProvider,
        via: Sender,
        to: Address,
        jettonAmount: bigint,
        forwardTonAmount: bigint,
        totalTonAmount: bigint,
    ): Promise<void> {
        if (totalTonAmount <= forwardTonAmount) {
            throw new Error("Total TON amount should be greater than the forward amount")
        }
        const msg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            receiver: to,
            tonAmount: totalTonAmount,
            mintMessage: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: jettonAmount,
                sender: this.address,
                responseDestination: this.address,
                forwardTonAmount: forwardTonAmount,
                forwardPayload: beginCell().storeUint(0, 1).asSlice(),
            },
        }
        return this.send(provider, via, {value: totalTonAmount + toNano("0.015")}, msg)
    }

    async sendChangeAdmin(
        provider: ContractProvider,
        via: Sender,
        newOwner: Address,
    ): Promise<void> {
        const msg: ChangeOwner = {
            $$type: "ChangeOwner",
            queryId: 0n,
            newOwner: newOwner,
        }
        return this.send(provider, via, {value: toNano("0.05")}, msg)
    }

    async sendChangeContent(provider: ContractProvider, via: Sender, content: Cell): Promise<void> {
        const msg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: content,
        }
        return this.send(provider, via, {value: toNano("0.05")}, msg)
    }

    async sendDiscovery(
        provider: ContractProvider,
        via: Sender,
        address: Address,
        includeAddress: boolean,
        value: bigint = toNano("0.1"),
    ): Promise<void> {
        const msg: ProvideWalletAddress = {
            $$type: "ProvideWalletAddress",
            queryId: 0n,
            ownerAddress: address,
            includeAddress: includeAddress,
        }
        return this.send(provider, via, {value: value}, msg)
    }

    async sendClaimTon(
        provider: ContractProvider,
        via: Sender,
        address: Address,
        value: bigint = toNano("0.1"),
    ): Promise<void> {
        const msg: ClaimTON = {
            $$type: "ClaimTON",
            receiver: address,
        }
        return this.send(provider, via, {value: value}, msg)
    }
}



================================================
FILE: sources/wrappers/ExtendedJettonWallet.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/wrappers/ExtendedJettonWallet.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {ClaimTON, JettonTransfer, JettonWallet} from "../output/Jetton_JettonWallet"
import {Address, Builder, Cell, ContractProvider, Sender, toNano} from "@ton/core"
import {JettonBurn, ProvideWalletBalance} from "../output/Jetton_JettonMinter"

export class ExtendedJettonWallet extends JettonWallet {
    constructor(address: Address, init?: {code: Cell; data: Cell}) {
        super(address, init)
    }

    static async fromInit(balance: bigint, owner: Address, minter: Address) {
        const base = await JettonWallet.fromInit(balance, owner, minter)
        if (base.init === undefined) {
            throw new Error("JettonWallet init is not defined")
        }
        return new ExtendedJettonWallet(base.address, {code: base.init.code, data: base.init.data})
    }

    getJettonBalance = async (provider: ContractProvider): Promise<bigint> => {
        const state = await provider.getState()
        if (state.state.type !== "active") {
            return 0n
        }
        return (await this.getGetWalletData(provider)).balance
    }

    /**
     * Sends a Jetton transfer message from this wallet to a specified recipient.
     *
     * @param provider - The contract provider used to interact with the blockchain. Automatically passed by the test environment proxy
     * @param via - The sender object representing the wallet or account initiating the transfer.
     * @param value - The amount of TONs to attach to the transfer for fees and forwarding.
     * @param jettonAmount - The amount of Jettons to transfer.
     * @param to - The recipient address to which the Jettons will be sent.
     * @param responseAddress - The address to receive the response from the transfer operation (Jetton excesses)
     * @param customPayload - An optional custom payload to include in the transfer message.
     * @param forwardTonAmount - The amount of TONs to forward to the recipient along with the Jettons.
     * @param forwardPayload - An optional payload to include in the forwarded message to the recipient.
     *
     * @returns A promise that resolves when the transfer message has been sent, returns SendResult.
     *
     * @example
     * await jettonWallet.sendTransfer(
     *     provider,
     *     sender,
     *     toNano("0.05"),
     *     toNano("100"),
     *     recipientAddress,
     *     responseAddress,
     *     null,
     *     toNano("0.01"),
     *     null
     * );
     */
    sendTransfer = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        jettonAmount: bigint,
        to: Address,
        responseAddress: Address,
        customPayload: Cell | null,
        forwardTonAmount: bigint,
        forwardPayload: Cell | null,
    ): Promise<void> => {
        const parsedForwardPayload =
            forwardPayload != null
                ? forwardPayload.beginParse()
                : new Builder().storeUint(0, 1).endCell().beginParse()

        const msg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonAmount,
            destination: to,
            responseDestination: responseAddress,
            customPayload: customPayload,
            forwardTonAmount: forwardTonAmount,
            forwardPayload: parsedForwardPayload,
        }

        await this.send(provider, via, {value}, msg)
    }

    sendBurn = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        jettonAmount: bigint,
        responseAddress: Address | null,
        customPayload: Cell | null,
    ): Promise<void> => {
        const msg: JettonBurn = {
            $$type: "JettonBurn",
            queryId: 0n,
            amount: jettonAmount,
            responseDestination: responseAddress,
            customPayload: customPayload,
        }

        await this.send(provider, via, {value}, msg)
    }

    sendProvideWalletBalance = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        receiver: Address,
        includeInfo: boolean,
    ): Promise<void> => {
        const msg: ProvideWalletBalance = {
            $$type: "ProvideWalletBalance",
            receiver: receiver,
            includeVerifyInfo: includeInfo,
        }

        await this.send(provider, via, {value}, msg)
    }

    async sendClaimTon(
        provider: ContractProvider,
        via: Sender,
        address: Address,
        value: bigint = toNano("0.1"),
    ): Promise<void> {
        const msg: ClaimTON = {
            $$type: "ClaimTON",
            receiver: address,
        }
        return this.send(provider, via, {value: value}, msg)
    }
}



================================================
FILE: sources/wrappers/ExtendedLPJettonWallet.ts
URL: https://github.com/tact-lang/dex/blob/main/sources/wrappers/ExtendedLPJettonWallet.ts
================================================
//  SPDX-License-Identifier: MIT
//  Copyright © 2025 TON Studio

import {ClaimTON, JettonTransfer, LPJettonWallet} from "../output/DEX_LPJettonWallet"
import {Address, Builder, Cell, ContractProvider, Sender, toNano} from "@ton/core"
import {LPWithdrawViaJettonBurn, ProvideWalletBalance} from "../output/DEX_AmmPool"

export class ExtendedLPJettonWallet extends LPJettonWallet {
    constructor(address: Address, init?: {code: Cell; data: Cell}) {
        super(address, init)
    }

    static async fromInit(balance: bigint, owner: Address, minter: Address) {
        const base = await LPJettonWallet.fromInit(balance, owner, minter)
        if (base.init === undefined) {
            throw new Error("JettonWallet init is not defined")
        }
        return new ExtendedLPJettonWallet(base.address, {
            code: base.init.code,
            data: base.init.data,
        })
    }

    getJettonBalance = async (provider: ContractProvider): Promise<bigint> => {
        const state = await provider.getState()
        if (state.state.type !== "active") {
            return 0n
        }
        return (await this.getGetWalletData(provider)).balance
    }

    /**
     * Sends a Jetton transfer message from this wallet to a specified recipient.
     *
     * @param provider - The contract provider used to interact with the blockchain. Automatically passed by the test environment proxy
     * @param via - The sender object representing the wallet or account initiating the transfer.
     * @param value - The amount of TONs to attach to the transfer for fees and forwarding.
     * @param jettonAmount - The amount of Jettons to transfer.
     * @param to - The recipient address to which the Jettons will be sent.
     * @param responseAddress - The address to receive the response from the transfer operation (Jetton excesses)
     * @param customPayload - An optional custom payload to include in the transfer message.
     * @param forwardTonAmount - The amount of TONs to forward to the recipient along with the Jettons.
     * @param forwardPayload - An optional payload to include in the forwarded message to the recipient.
     *
     * @returns A promise that resolves when the transfer message has been sent, returns SendResult.
     *
     * @example
     * await jettonWallet.sendTransfer(
     *     provider,
     *     sender,
     *     toNano("0.05"),
     *     toNano("100"),
     *     recipientAddress,
     *     responseAddress,
     *     null,
     *     toNano("0.01"),
     *     null
     * );
     */
    sendTransfer = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        jettonAmount: bigint,
        to: Address,
        responseAddress: Address,
        customPayload: Cell | null,
        forwardTonAmount: bigint,
        forwardPayload: Cell | null,
    ): Promise<void> => {
        const parsedForwardPayload =
            forwardPayload != null
                ? forwardPayload.beginParse()
                : new Builder().storeUint(0, 1).endCell().beginParse()

        const msg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonAmount,
            destination: to,
            responseDestination: responseAddress,
            customPayload: customPayload,
            forwardTonAmount: forwardTonAmount,
            forwardPayload: parsedForwardPayload,
        }

        await this.send(provider, via, {value}, msg)
    }

    sendBurn = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        jettonAmount: bigint,
        responseAddress: Address | null,
        customPayload: Cell | null,
    ): Promise<void> => {
        const msg: LPWithdrawViaJettonBurn = {
            $$type: "LPWithdrawViaJettonBurn",
            queryId: 0n,
            amount: jettonAmount,
            responseDestination: responseAddress,
            customPayload: customPayload,
        }

        await this.send(provider, via, {value}, msg)
    }

    sendProvideWalletBalance = async (
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        receiver: Address,
        includeInfo: boolean,
    ): Promise<void> => {
        const msg: ProvideWalletBalance = {
            $$type: "ProvideWalletBalance",
            receiver: receiver,
            includeVerifyInfo: includeInfo,
        }

        await this.send(provider, via, {value}, msg)
    }

    async sendClaimTon(
        provider: ContractProvider,
        via: Sender,
        address: Address,
        value: bigint = toNano("0.1"),
    ): Promise<void> {
        const msg: ClaimTON = {
            $$type: "ClaimTON",
            receiver: address,
        }
        return this.send(provider, via, {value: value}, msg)
    }
}



================================================
FILE: spell/custom-dictionary.txt
URL: https://github.com/tact-lang/dex/blob/main/spell/custom-dictionary.txt
================================================
Descr
Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU
Fift
Jettons
Merkle
Resolve
TONCENTER
Toncoin
Unbounceable
ahme
ahmn
basechain
bounceable
catchain
inited
ipfs
jwallet
masterchain
mintable
misti
nanoton
nonexist
nowarp
seqno
shardblk
tact
tock
tonapi
toncenter
tondevwallet
tonhub
tonscan
tonviewer
tonweb
uninit
utime
workchain
yada


================================================
FILE: spell/tvm-instructions.txt
URL: https://github.com/tact-lang/dex/blob/main/spell/tvm-instructions.txt
================================================
-ROT
-ROLLX
ABS
ACCEPT
ADD
ADDCONST
ADDDIVMOD
ADDDIVMODC
ADDDIVMODR
ADDRAND
ADDRSHIFTMOD
ADDRSHIFTMODC
ADDRSHIFTMODR
AGAIN
AGAINBRK
AGAINEND
AGAINENDBRK
AND
ATEXIT
ATEXITALT
BALANCE
BBITREFS
BBITS
BCHKBITREFS
BCHKBITREFSQ
BCHKBITS
BCHKBITSQ
BCHKBITSQ_VAR
BCHKBITS_VAR
BCHKREFS
BCHKREFSQ
BDEPTH
BITSIZE
BLESS
BLESSARGS
BLESSNUMARGS
BLESSVARARGS
BLKDROP
BLKDROP2
BLKPUSH
BLKSWAP
BLKSWX
BLOCKLT
BOOLEVAL
BRANCH
BREFS
BREMBITREFS
BREMBITS
BREMREFS
CADDR
CADR
CALLCC
CALLCCARGS
CALLCCVARARGS
CALLDICT
CALLDICT_LONG
CALLREF
CALLXARGS
CALLXARGS_VAR
CALLXVARARGS
CDATASIZE
CDATASIZEQ
CDDDR
CDDR
CDEPTH
CDEPTHIX
CHANGELIB
CHASHIX
CHKBIT
CHKBOOL
CHKDEPTH
CHKNAN
CHKSIGNS
CHKSIGNU
CHKTUPLE
CLEVEL
CLEVELMASK
CMP
COMMIT
COMPOS
COMPOSALT
COMPOSBOTH
CONDSEL
CONDSELCHK
CONFIGDICT
CONFIGOPTPARAM
CONFIGPARAM
CONFIGROOT
CTOS
DEBUG
DEBUGSTR
DEC
DEPTH
DICTADD
DICTADDB
DICTADDGET
DICTADDGETB
DICTADDGETREF
DICTADDREF
DICTDEL
DICTDELGET
DICTDELGETREF
DICTEMPTY
DICTGET
DICTGETNEXT
DICTGETNEXTEQ
DICTGETOPTREF
DICTGETPREV
DICTGETPREVEQ
DICTGETREF
DICTIADD
DICTIADDB
DICTIADDGET
DICTIADDGETB
DICTIADDGETREF
DICTIADDREF
DICTIDEL
DICTIDELGET
DICTIDELGETREF
DICTIGET
DICTIGETEXEC
DICTIGETEXECZ
DICTIGETJMP
DICTIGETJMPZ
DICTIGETNEXT
DICTIGETNEXTEQ
DICTIGETOPTREF
DICTIGETPREV
DICTIGETPREVEQ
DICTIGETREF
DICTIMAX
DICTIMAXREF
DICTIMIN
DICTIMINREF
DICTIREMMAX
DICTIREMMAXREF
DICTIREMMIN
DICTIREMMINREF
DICTIREPLACE
DICTIREPLACEB
DICTIREPLACEGET
DICTIREPLACEGETB
DICTIREPLACEGETREF
DICTIREPLACEREF
DICTISET
DICTISETB
DICTISETGET
DICTISETGETB
DICTISETGETOPTREF
DICTISETGETREF
DICTISETREF
DICTMAX
DICTMAXREF
DICTMIN
DICTMINREF
DICTPUSHCONST
DICTREMMAX
DICTREMMAXREF
DICTREMMIN
DICTREMMINREF
DICTREPLACE
DICTREPLACEB
DICTREPLACEGET
DICTREPLACEGETB
DICTREPLACEGETREF
DICTREPLACEREF
DICTSET
DICTSETB
DICTSETGET
DICTSETGETB
DICTSETGETOPTREF
DICTSETGETREF
DICTSETREF
DICTUADD
DICTUADDB
DICTUADDGET
DICTUADDGETB
DICTUADDGETREF
DICTUADDREF
DICTUDEL
DICTUDELGET
DICTUDELGETREF
DICTUGET
DICTUGETEXEC
DICTUGETEXECZ
DICTUGETJMP
DICTUGETJMPZ
DICTUGETNEXT
DICTUGETNEXTEQ
DICTUGETOPTREF
DICTUGETPREV
DICTUGETPREVEQ
DICTUGETREF
DICTUMAX
DICTUMAXREF
DICTUMIN
DICTUMINREF
DICTUREMMAX
DICTUREMMAXREF
DICTUREMMIN
DICTUREMMINREF
DICTUREPLACE
DICTUREPLACEB
DICTUREPLACEGET
DICTUREPLACEGETB
DICTUREPLACEGETREF
DICTUREPLACEREF
DICTUSET
DICTUSETB
DICTUSETGET
DICTUSETGETB
DICTUSETGETOPTREF
DICTUSETGETREF
DICTUSETREF
DIV
DIVC
DIVMOD
DIVMODC
DIVMODR
DIVR
DIV_BASE
DROP
DROP2
DROPX
DUEPAYMENT
DUMP
DUMPSTK
DUP
DUP2
ECRECOVER
ENDC
ENDS
ENDXC
EQINT
EQUAL
EXECUTE
EXPLODE
EXPLODEVAR
FIRST
FIRSTQ
FITS
FITSX
GASCONSUMED
GEQ
GETFORWARDFEE
GETFORWARDFEESIMPLE
GETGASFEE
GETGASFEESIMPLE
GETGLOB
GETGLOBVAR
GETORIGINALFWDFEE
GETPARAM
GETPRECOMPILEDGAS
GETSTORAGEFEE
GLOBALID
GLOBALID
GREATER
GTINT
HASHCU
HASHEXT
HASHEXTAR_BLAKE
HASHEXTAR_BLAKE2B
HASHEXTAR_KECCAK
HASHEXTAR_KECCAK256
HASHEXTAR_KECCAK512
HASHEXTAR_SHA
HASHEXTAR_SHA256
HASHEXTAR_SHA512
HASHEXTA_BLAKE
HASHEXTA_BLAKE2B
HASHEXTA_KECCAK
HASHEXTA_KECCAK256
HASHEXTA_KECCAK512
HASHEXTA_SHA256
HASHEXTA_SHA512
HASHEXTR_BLAKE2B
HASHEXTR_KECCAK256
HASHEXTR_KECCAK512
HASHEXTR_SHA256
HASHEXTR_SHA512
HASHEXT_BLAKE2B
HASHEXT_KECCAK256
HASHEXT_KECCAK512
HASHEXT_SHA256
HASHEXT_SHA512
HASHSU
IF
IFBITJMP
IFBITJMPREF
IFELSE
IFELSEREF
IFJMP
IFJMPREF
IFNBITJMP
IFNBITJMPREF
IFNOT
IFNOTJMP
IFNOTJMPREF
IFNOTREF
IFNOTRET
IFNOTRETALT
IFREF
IFREFELSE
IFREFELSEREF
IFRET
IFRETALT
INC
INCOMINGVALUE
INDEX
INDEX2
INDEX3
INDEXQ
INDEXVAR
INDEXVARQ
INVERT
ISNAN
ISNEG
ISNNEG
ISNPOS
ISNULL
ISPOS
ISTUPLE
ISZERO
JMPDICT
JMPREF
JMPREFDATA
JMPX
JMPXARGS
JMPXDATA
JMPXVARARGS
KECCAK
LAST
LDDICT
LDDICTQ
LDDICTS
LDGRAMS
LDI
LDILE4
LDILE4Q
LDILE8
LDILE8Q
LDIQ
LDIX
LDIXQ
LDI_ALT
LDMSGADDR
LDMSGADDRQ
LDONES
LDOPTREF
LDREF
LDREFRTOS
LDSAME
LDSLICE
LDSLICEQ
LDSLICEX
LDSLICEXQ
LDSLICE_ALT
LDU
LDULE4
LDULE4Q
LDULE8
LDULE8Q
LDUQ
LDUX
LDUXQ
LDU_ALT
LDVARINT
LDVARINT16
LDVARUINT
LDZEROES
LEQ
LESS
LESSINT
LSHIFT
LSHIFTADDDIVMOD
LSHIFTADDDIVMODC
LSHIFTADDDIVMODR
LSHIFTDIV
LSHIFTDIVC
LSHIFTDIVC_VAR
LSHIFTDIVR
LSHIFTDIVR_VAR
LSHIFTDIV_VAR
LSHIFT_VAR
LTIME
MAX
MIN
MINMAX
MOD
MODPOW2
MUL
MULADDDIVMOD
MULADDDIVMODC
MULADDDIVMODR
MULADDRSHIFTCMOD
MULADDRSHIFTMOD
MULADDRSHIFTRMOD
MULCONST
MULDIV
MULDIVC
MULDIVMOD
MULDIVR
MULRSHIFT
MULRSHIFTC
MULRSHIFTC_VAR
MULRSHIFTR
MULRSHIFTR_VAR
MULRSHIFT_VAR
MYADDR
MYCODE
NEGATE
NEQ
NEQINT
NEWC
NEWDICT
NIL
NIP
NOP
NOT
NOW
NULL
NULLROTRIF
NULLROTRIF2
NULLROTRIFNOT
NULLROTRIFNOT2
NULLSWAPIF
NULLSWAPIF2
NULLSWAPIFNOT
NULLSWAPIFNOT2
ONE
ONLYTOPX
ONLYX
OR
OVER
OVER2
P256_CHKSIGNS
P256_CHKSIGNU
PAIR
PARSEMSGADDR
PARSEMSGADDRQ
PFXDICTADD
PFXDICTCONSTGETJMP
PFXDICTDEL
PFXDICTGET
PFXDICTGETEXEC
PFXDICTGETJMP
PFXDICTGETQ
PFXDICTREPLACE
PFXDICTSET
PICK
PLDDICT
PLDDICTQ
PLDDICTS
PLDI
PLDILE4
PLDILE4Q
PLDILE8
PLDILE8Q
PLDIQ
PLDIX
PLDIXQ
PLDOPTREF
PLDREF
PLDREFIDX
PLDREFVAR
PLDSLICE
PLDSLICEQ
PLDSLICEX
PLDSLICEXQ
PLDU
PLDULE
PLDULE4
PLDULE4Q
PLDULE8
PLDULE8Q
PLDUQ
PLDUX
PLDUXQ
PLDUZ
POP
POPCTR
POPCTRX
POPROOT
POPSAVE
POP_LONG
POW2
PREPAREDICT
PREVBLOCKSINFOTUPLE
PREVKEYBLOCK
PREVMCBLOCKS
PU2XC
PUSH
PUSH2
PUSH3
PUSHCONT
PUSHCONT_SHORT
PUSHCTR
PUSHCTRX
PUSHINT
PUSHINT_16
PUSHINT_4
PUSHINT_8
PUSHINT_LONG
PUSHNAN
PUSHNEGPOW2
PUSHPOW2
PUSHPOW2DEC
PUSHREF
PUSHREFCONT
PUSHREFSLICE
PUSHROOT
PUSHSLICE
PUSHSLICE_LONG
PUSHSLICE_REFS
PUSH_LONG
PUXC
PUXC2
PUXCPU
QADD
QAND
QDEC
QDIV
QDIVC
QDIVMOD
QDIVMODC
QDIVMODR
QDIVR
QFITS
QFITSX
QINC
QLSHIFT
QMOD
QMUL
QMULDIVMOD
QMULDIVR
QNEGATE
QNOT
QOR
QPOW2
QRSHIFT
QSUB
QSUBR
QTLEN
QUFITS
QUFITSX
QXOR
RAND
RANDSEED
RANDU
RANDU256
RAWRESERVE
RAWRESERVEX
REPEAT
REPEATBRK
REPEATEND
REPEATENDBRK
RET
RETALT
RETARGS
RETDATA
RETURNARGS
RETURNVARARGS
RETVARARGS
REVERSE
REVX
REWRITESTDADDR
REWRITESTDADDRQ
REWRITEVARADDR
REWRITEVARADDRQ
RIST255_ADD
RIST255_FROMHASH
RIST255_MUL
RIST255_MULBASE
RIST255_PUSHL
RIST255_QADD
RIST255_QMUL
RIST255_QMULBASE
RIST255_QSUB
RIST255_QVALIDATE
RIST255_SUB
RIST255_VALIDATE
ROLL
ROLLREV
ROLLX
ROT
ROT2
ROTREV
RSHIFT
RSHIFTC
RSHIFTC_VAR
RSHIFTR
RSHIFTR_VAR
RSHIFT_VAR
RUNVM
RUNVMX
SAMEALT
SAMEALTSAVE
SAVE
SAVEALT
SAVEBOTH
SBITREFS
SBITS
SCHKBITREFS
SCHKBITREFSQ
SCHKBITS
SCHKBITSQ
SCHKREFS
SCHKREFSQ
SCUTFIRST
SCUTLAST
SDATASIZE
SDATASIZEQ
SDBEGINS
SDBEGINSQ
SDBEGINSX
SDBEGINSXQ
SDCNTLEAD0
SDCNTLEAD1
SDCNTTRAIL0
SDCNTTRAIL1
SDCUTFIRST
SDCUTLAST
SDEMPTY
SDEPTH
SDEQ
SDFIRST
SDLEXCMP
SDPFX
SDPFXREV
SDPPFX
SDPPFXREV
SDPSFX
SDPSFXREV
SDSFX
SDSFXREV
SDSKIPFIRST
SDSKIPLAST
SDSUBSTR
SECOND
SECONDQ
SEMPTY
SENDMSG
SENDRAWMSG
SETALTCTR
SETCODE
SETCONTARGS
SETCONTARGS_N
SETCONTCTR
SETCONTCTRX
SETCONTVARARGS
SETCP
SETCP0
SETCPX
SETCP_SPECIAL
SETEXITALT
SETFIRST
SETFIRSTQ
SETGASLIMIT
SETGLOB
SETGLOBVAR
SETINDEX
SETINDEXQ
SETINDEXVAR
SETINDEXVARQ
SETLIBCODE
SETNUMARGS
SETNUMVARARGS
SETRAND
SETRETCTR
SETSECOND
SETSECONDQ
SETTHIRD
SETTHIRDQ
SGN
SHA256U
SINGLE
SKIPDICT
SPLIT
SPLITQ
SREFS
SREMPTY
SSKIPFIRST
SSKIPLAST
STB
STBQ
STBR
STBREF
STBREFQ
STBREFR
STBREFRQ
STBREFR_ALT
STBRQ
STDICT
STDICTS
STGRAMS
STI
STILE4
STILE8
STIQ
STIR
STIRQ
STIX
STIXQ
STIXR
STIXRQ
STI_ALT
STONE
STONES
STOPTREF
STORAGEFEES
STREF
STREF2CONST
STREFCONST
STREFQ
STREFR
STREFRQ
STREF_ALT
STSAME
STSLICE
STSLICECONST
STSLICEQ
STSLICER
STSLICERQ
STSLICE_ALT
STU
STULE
STULE4
STULE8
STUQ
STUR
STURQ
STUX
STUXQ
STUXR
STUXRQ
STU_ALT
STVARINT16
STVARINT
STVARUINT
STZERO
STZEROES
SUB
SUBDICTGET
SUBDICTIGET
SUBDICTIRPGET
SUBDICTRPGET
SUBDICTUGET
SUBDICTURPGET
SUBR
SUBSLICE
SWAP
SWAP2
TEN
THENRET
THENRETALT
THIRD
THIRDQ
THROW
THROWANY
THROWANYIF
THROWANYIFNOT
THROWARG
THROWARGANY
THROWARGANYIF
THROWARGANYIFNOT
THROWARGIF
THROWARGIFNOT
THROWIF
THROWIFNOT
THROWIFNOT_SHORT
THROWIF_SHORT
THROW_SHORT
TLEN
TPOP
TPUSH
TRIPLE
TRUE
TRY
TRYARGS
TUCK
TUPLE
TUPLEVAR
TWO
UBITSIZE
UFITS
UFITSX
UNPACKEDCONFIGTUPLE
UNPACKFIRST
UNPACKFIRSTVAR
UNPAIR
UNSINGLE
UNTIL
UNTILBRK
UNTILEND
UNTILENDBRK
UNTRIPLE
UNTUPLE
UNTUPLEVAR
WHILE
WHILEBRK
WHILEEND
WHILEENDBRK
XC2PU
XCHG
XCHG2
XCHG3
XCHG3_ALT
XCHGX
XCHG_0I
XCHG_0I_LONG
XCHG_1I
XCHG_IJ
XCPU
XCPU2
XCPUXC
XCTOS
XLOAD
XLOADQ
XOR
ZERO


================================================
FILE: tact.config.json
URL: https://github.com/tact-lang/dex/blob/main/tact.config.json
================================================
{
    "projects": [
        {
            "name": "DEX",
            "path": "./sources/contracts/infra/factory.tact",
            "output": "./sources/output",
            "mode": "full",
            "options": {
                "external": false,
                "debug": true,
                "ipfsAbiGetter": false,
                "interfacesGetter": false,
                "experimental": {
                    "inline": true
                }
            }
        },
        {
            "name": "Jetton",
            "path": "./sources/contracts/jettons/jetton-minter.tact",
            "output": "./sources/output",
            "mode": "full",
            "options": {
                "external": false,
                "debug": false,
                "ipfsAbiGetter": false,
                "interfacesGetter": false,
                "experimental": {
                    "inline": true
                }
            }
        }
    ]
}




# Repository: defi-cookbook
URL: https://github.com/tact-lang/defi-cookbook
Branch: main

## Directory Structure:
```
└── defi-cookbook/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── .github/
        ├── workflows/
    ├── .husky/
    ├── README.md
    ├── basics/
        ├── update/
            ├── README.md
    ├── cspell.json
    ├── jettons/
        ├── impl/
            ├── basic/
                ├── constants.tact
                ├── jetton-minter.tact
                ├── jetton-wallet.tact
                ├── messages.tact
            ├── func-governance/
                ├── JettonMinter.compiled.json
                ├── JettonWallet.compiled.json
            ├── governance/
                ├── constants.tact
                ├── jetton-minter.tact
                ├── jetton-wallet.tact
                ├── messages.tact
            ├── utils.tact
        ├── mint-usdt/
            ├── .env.example
            ├── metadata.ts
            ├── mint-usdt-bot.ts
            ├── mint-usdt-terminal.ts
            ├── mint-usdt.ts
        ├── onchain-api/
            ├── fetcher.spec.ts
            ├── fetcher.tact
        ├── receive-jettons/
            ├── receiver.spec.ts
            ├── receiver.tact
        ├── receive-jettons-v2/
            ├── README.md
            ├── receiver.spec.ts
            ├── receiver.tact
        ├── receive-usdt/
            ├── receiver.tact
            ├── usdt-receiver.spec.ts
        ├── send-jettons/
            ├── sender.spec.ts
            ├── sender.tact
        ├── send-usdt/
            ├── sender.spec.ts
            ├── sender.tact
        ├── use-jetton/
            ├── README.md
            ├── tep-89-discovery-proxy.tact
            ├── use-jetton.tact
    ├── spell/
        ├── custom-dictionary.txt
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/tact-lang/defi-cookbook/blob/main/README.md
================================================
# Examples in Tact

## Overview

This project includes a set of examples for common use cases in Tact and consists of:

- Smart contracts written in the Tact language.
- A TypeScript + Jest testing environment with `@ton/sandbox`.
- Examples of off-chain and on-chain integrations with Jettons. Other TEPs are planned too.

> If you're new to TON and Tact, please check https://docs.tact-lang.org/

## Structure

The [jettons](./jettons/) folder consists of examples of common actions with Jettons in Tact.

Each folder inside it includes examples for one or more of the following:

- `*.tact` - Smart contracts written in Tact that run on-chain and need to be deployed. Use `yarn build` to compile them.
- `*.spec.ts` - TypeScript test files that validate the logic of the smart contracts. These tests also serve as examples of how to interact with smart contracts off-chain. Use `yarn test` to run them.
- `*.ts` - Scripts that perform actions on the blockchain. Use `yarn ts-node filename` to execute them.

## Examples

<details>
  <summary>Basics</summary>

### Update contract

[Update already deployed contract](./basics/update/)

These examples demonstrate how to update already deployed contract code and data. Note that this operation can permanently lock all funds present on the account if done incorrectly, so all production updates should be tested in the testnet first.

</details>

<details>
  <summary>Jettons</summary>

### Receive Jettons

[Receive and verify incoming Jettons](./jettons/receive-jettons/)

This example demonstrates how to receive and verify incoming Jettons. It can be extended to support any custom Jetton implementation and handle additional logic after receiving funds.

### Send Jettons

[Send Jettons from your contract](./jettons/send-jettons/)

This example shows how to send Jettons from a contract. It includes both basic and extended modes for sending Jettons, allowing for custom payloads and additional parameters.

### Mint USDT

[Mint USDT](./jettons/mint-usdt/)

This example provides tools to mint USDT Jettons on the testnet. It includes a terminal script for deploying a Jetton minter and minting Jettons, as well as a Telegram bot that generates QR codes for minting transactions.

### On-Chain API

[On-Chain API for Jettons](./jettons/onchain-api/)

This example demonstrates how to interact with Jetton contracts on-chain. It includes fetching Jetton wallet addresses and balances directly from the blockchain, showcasing how to integrate on-chain data into your applications.

### Send USDT

[Send USDT from your contract](./jettons/send-usdt/)

This example focuses on sending USDT (Governance) Jettons. It is very much like [Send Jettons](#send-jettons) example, but with slightly different message structures. It supports both basic and extended modes for sending Jettons.

### Receive USDT

[Receive USDT on your contract](./jettons/receive-usdt/)

This example illustrates how to receive USDT Jettons and verify incoming transfer notifications. It is tailored for governance Jettons and includes logic for handling governance-specific state initialization.

### Use Jetton Trait

[UseJetton Trait for safe jetton integration](./jettons/use-jetton/)

This example provides a reusable Tact trait that enables contracts to receive jetton transfers without requiring custom implementation of the TEP-89 wallet discovery protocol. The trait provides automatic wallet discovery, transfer validation, and security features including automatic refunds for unauthorized transfers.

### Receive Jettons v2

[Advanced jetton receiver using UseJetton trait](./jettons/receive-jettons-v2/)

This example demonstrates how to integrate the `UseJetton` trait to create a contract that can receive jetton transfers in a safe and standards-compliant manner.

</details>

## Contributing

**If a given example is missing, please send us a PR to add it!** Our aim is to have every example available in every option. We'd also love to see more contracts involving staking, wrapped tokens, oracles, DEXs and other TEPs. Please first create an issue for all new examples

## License

This project is licensed under the MIT License.



================================================
FILE: basics/update/README.md
URL: https://github.com/tact-lang/defi-cookbook/blob/main/basics/update/README.md
================================================
# Updating a contract

In this example, we will modify the logic of the deployed contract by using the contract update functionality of TON Blockchain.

Note that updating a contract is a potentially dangerous operation that can lock funds within the contract or disrupt its expected behavior. You must also be extra cautious when updating a contract with child contract dependencies.

To handle recursive dependencies between parent and child contracts, e.g., if they require `StateInit` from each other, the Tact compiler creates a ref cell with the data of other contracts, which is used to resolve such dependencies. Therefore, if you want to update one of the contracts in this dependency chain, you will also need to update this reference cell correctly.

Now, let's perform a simple update of the counter contract.

1. We will deploy the initial counter contract:

```tact
contract CounterBeforeUpdate(
    data: Int as uint32,
    updateAuthority: Address,
) {
    receive(msg: CounterAction) {
        self.data += 1;
    }

    receive(msg: UpdateContractRequest) {
        require(sender() == self.updateAuthority, "Incorrect update authority");
        setData(msg.data);
        setCode(msg.code);
    }

    get fun data(): Int {
        return self.data;
    }
}
```

Its storage contains two fields: counter data and update authority. Upon receiving a `CounterAction` message, this contract increases its internal `data` variable.

2. We will prepare and compile the second counter contract:

```tact
contract CounterAfterUpdate(
    data: Int as uint32,
) {
    receive(msg: CounterAction) {
        self.data -= 1;
    }

    get fun data(): Int {
        return self.data;
    }
}
```

This contract has only one field, the integer `data` variable, which it now _decreases_ upon receiving the `CounterAction` message.

3. Now, we want to send the `UpdateContractRequest` message to the deployed contract to update its code and data. The message struct would look like this:

```tact
message(0xa7ffd45e) UpdateContractRequest {
    code: Cell;
    data: Cell;
}
```

In TypeScript, the most optimal way to create such a message is to use Tact's autogenerated wrapper for the `CounterAfterUpdate`. After initializing it with the needed parameters, we can extract its code and data:

```ts
import {CounterAfterUpdate} from "../output/UpdateContract_CounterAfterUpdate"
// ...
const firstCounterValue = await initialCounterContract.getData()

const newCounterContractState = await CounterAfterUpdate.fromInit(firstCounterValue)
const updateResult = await initialCounterContract.send(
    deployer.getSender(),
    {value: toNano("0.1")},
    {
        $$type: "UpdateContractRequest",
        code: newCounterContractState.init?.code!,
        data: newCounterContractState.init?.data!,
    },
)
```

4. Now we need to verify the update result and find a way to interact with the new contract.

```ts
const counterContractStateAfterUpdate = await blockchain
    .provider(initialCounterContract.address)
    .getState()
if (counterContractStateAfterUpdate.state.type !== "active") {
    throw new Error("Contract should be active after update")
}

// check that contract state is updated
expect(Cell.fromBoc(counterContractStateAfterUpdate.state.code!)[0]).toEqualCell(
    newCounterContractState.init?.code!,
)
expect(Cell.fromBoc(counterContractStateAfterUpdate.state.data!)[0]).toEqualCell(
    newCounterContractState.init?.data!,
)
```

To interact with the updated contract, we can again use the newly generated wrapper:

```ts
const updatedCounterContract = blockchain.openContract(
    CounterAfterUpdate.fromAddress(initialCounterContract.address),
)

// now this action will decrease the counter, since we've updated the contract code
await updatedCounterContract.send(
    deployer.getSender(),
    {value: toNano("0.1")},
    {
        $$type: "CounterAction",
    },
)
```



================================================
FILE: cspell.json
URL: https://github.com/tact-lang/defi-cookbook/blob/main/cspell.json
================================================
{
    "version": "0.2",
    "language": "en",
    "dictionaries": ["typescript", "node", "npm", "custom-dictionary"],
    "dictionaryDefinitions": [
        {
            "name": "custom-dictionary",
            "path": "./spell/custom-dictionary.txt",
            "addWords": true
        }
    ],
    "ignorePaths": [
        "node_modules/**",
        "dist/**",
        "build/**",
        ".git/**",
        "package.json",
        "yarn.lock",
        "jettons/output/**",
        "basics/output/**",
        "tsconfig.json"
    ]
}



================================================
FILE: jettons/impl/basic/constants.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/basic/constants.tact
================================================
const gasForBurn: Int = 6700;
const gasForTransfer: Int = 10500;
const minTonsForStorage: Int = ton("0.01"); // This should use https://github.com/tact-lang/tact/issues/2336 in the future
const Basechain: Int = 0;



================================================
FILE: jettons/impl/basic/jetton-minter.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/basic/jetton-minter.tact
================================================
import "./jetton-wallet";
import "./messages";
import "./constants";
import "../utils.tact";
import "../utils";

struct JettonMinterState {
    totalSupply: Int as coins;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

contract JettonMinter(
    totalSupply: Int as coins,
    owner: Address,
    jettonContent: Cell,
    mintable: Bool, // Should be deployed with this flag set to true
) {
    // Owner of this contract may be masterchain address,
    // however minting is possible only to basechain addresses
    // it is asserted inside the deploy function
    receive(msg: Mint) {
        require(sender() == self.owner, "Incorrect sender");
        require(self.mintable, "Mint is closed");

        checkEitherForwardPayload(msg.mintMessage.forwardPayload);

        let ctx = context();
        // we don't add compute fees for mint itself and reserve here
        // it's okay since it’s sent only by the admin and excesses will return back
        require(
            ctx.value >
            minTonsForStorage +
            msg.mintMessage.forwardTonAmount +
            ctx.readForwardFee() +
            2 * getComputeFee(gasForTransfer, false),
            "Insufficient gas for mint",
        );

        self.totalSupply += msg.mintMessage.amount;

        // basechain destination is calculated inside deploy function
        deploy(DeployParameters {
            value: 0, // ignore msg.tonAmount and use SendMode 64 instead
            bounce: true,
            mode: SendRemainingValue | SendBounceIfActionFail,
            body: msg.mintMessage.toCell(),
            init: getJettonWalletInit(msg.receiver),
        });
    }

    receive(msg: ProvideWalletAddress) {
        let ownerWorkchain: Int = parseStdAddress(msg.ownerAddress.asSlice()).workchain;

        // If owner is basechain address, we can calculate jettonWallet
        let targetJettonWallet: BasechainAddress = (ownerWorkchain == Basechain)
            ? contractBasechainAddress(initOf JettonWallet(0, msg.ownerAddress, myAddress()))
            : emptyBasechainAddress();

        message(MessageParameters {
            body: makeTakeWalletAddressMsg(targetJettonWallet, msg),
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
        });
    }

    receive(msg: JettonBurnNotification) {
        let sender = parseStdAddress(sender().asSlice());
        let wallet = getJettonBasechainWalletByOwner(msg.sender);

        // Workchain 0 is basechain
        require(sender.workchain == Basechain && sender.address == wallet.hash!!, "Unauthorized burn");

        self.totalSupply -= msg.amount;

        if (msg.responseDestination != null) {
            message(MessageParameters {
                to: msg.responseDestination!!,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors, // ignore errors, because supply has already been updated
            });
        }
    }

    receive(msg: JettonUpdateContent) {
        require(sender() == self.owner, "Incorrect sender");
        self.jettonContent = msg.content;
    }

    receive(msg: ChangeOwner) {
        require(sender() == self.owner, "Incorrect sender");
        self.owner = msg.newOwner;
    }

    receive(msg: CloseMinting) {
        require(sender() == self.owner, "Incorrect sender");
        self.mintable = false;
        cashback(sender());
    }

    receive(msg: ClaimTON) {
        require(sender() == self.owner, "Incorrect sender");
        nativeReserve(minTonsForStorage, ReserveExact | ReserveBounceIfActionFail);

        // we allow bounce here and don't handle it, if claim fails we just accept the TONs back
        message(MessageParameters {
            bounce: true,
            to: msg.receiver,
            value: 0,
            mode: SendRemainingBalance,
        });
    }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.totalSupply -= msg.amount;
    }

    get fun get_jetton_data(): JettonMinterState {
        return JettonMinterState {
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            adminAddress: self.owner,
            jettonContent: self.jettonContent,
            jettonWalletCode: codeOf JettonWallet,
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        return getJettonWalletByOwner(ownerAddress);
    }
}

inline fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWallet(0, address, myAddress());
}

inline fun getJettonWalletByOwner(jettonWalletOwner: Address): Address {
    return contractAddress(getJettonWalletInit(jettonWalletOwner));
}

inline fun getJettonBasechainWalletByOwner(jettonWalletOwner: Address): BasechainAddress {
    return contractBasechainAddress(getJettonWalletInit(jettonWalletOwner));
}



================================================
FILE: jettons/impl/basic/jetton-wallet.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/basic/jetton-wallet.tact
================================================
import "./messages";
import "./constants";

contract JettonWallet(
    balance: Int as coins,
    owner: Address,
    minter: Address,
) {
    receive(msg: JettonTransfer) {
        forceBasechain(msg.destination);
        require(sender() == self.owner, "Incorrect sender");

        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");
        checkEitherForwardPayload(msg.forwardPayload);

        let ctx = context();
        let fwdCount = 1 + sign(msg.forwardTonAmount); // msg.forwardTonAmount is coins, so it's positive
        require(
            ctx.value >
            msg.forwardTonAmount +
            fwdCount * ctx.readForwardFee() +
            (2 * getComputeFee(gasForTransfer, false) + minTonsForStorage),
            "Insufficient amount of TON attached",
        );

        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonTransferInternal {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            init: initOf JettonWallet(0, msg.destination, self.minter),
        });
    }

    receive(msg: JettonTransferInternal) {
        self.balance += msg.amount;

        // This message should come only from master, or from other JettonWallet
        let wallet: StateInit = initOf JettonWallet(0, msg.sender, self.minter);
        if (!wallet.hasSameBasechainAddress(sender())) {
            require(self.minter == sender(), "Incorrect sender");
        }

        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg = myBalance() - msgValue;

        if (msg.forwardTonAmount > 0) {
            let fwdFee: Int = ctx.readForwardFee();
            msgValue -= msg.forwardTonAmount + fwdFee;
            message(MessageParameters {
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: JettonNotification { // 0x7362d09c -- Remind the new Owner
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }
        nativeReserve(max(tonBalanceBeforeMsg, minTonsForStorage), ReserveAtMost);
        // 0xd53276db -- Cashback to the original Sender
        if (msg.responseDestination != null && msgValue > 0) {
            message(MessageParameters {
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendRemainingBalance + SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
            });
        }
    }

    receive(msg: ProvideWalletBalance) {
        let info: VerifyInfo? = null;
        if (msg.includeVerifyInfo) {
            info = VerifyInfo {
                minter: self.minter,
                owner: self.owner,
                code: myCode(),
            };
        }

        message(MessageParameters {
            body: TakeWalletBalance {
                balance: self.balance,
                verifyInfo: info,
            }.toCell(),
            to: msg.receiver,
            value: 0,
            mode: SendRemainingValue,
        });
    }

    receive(msg: JettonBurn) {
        // we can skip forceBasechain here because with other checks in place it's not possible
        // to acquire jettons outside of basechain, so amount check is enough
        require(sender() == self.owner, "Incorrect sender");

        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");

        let ctx = context();
        let fwdFee: Int = ctx.readForwardFee();
        require(ctx.value > (fwdFee + 2 * getComputeFee(gasForBurn, false)), "Insufficient amount of TON attached");

        message(MessageParameters {
            to: self.minter,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: JettonBurnNotification {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    receive(msg: ClaimTON) {
        require(sender() == self.owner, "Incorrect sender");
        nativeReserve(minTonsForStorage, ReserveExact | ReserveBounceIfActionFail);

        // we allow bounce here and don't handle it, if claim fails we just accept the TONs back
        message(MessageParameters {
            to: msg.receiver,
            value: 0,
            mode: SendRemainingBalance,
        });
    }

    bounced(msg: bounced<JettonTransferInternal>) {
        self.balance += msg.amount;
    }

    bounced(msg: bounced<JettonBurnNotification>) {
        self.balance += msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData {
            balance: self.balance,
            owner: self.owner,
            minter: self.minter,
            code: myCode(),
        };
    }
}



================================================
FILE: jettons/impl/basic/messages.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/basic/messages.tact
================================================
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    minter: Address;
    code: Cell;
}

struct MaybeAddress {
    address: Address?;
}

message(4) JettonUpdateContent {
    queryId: Int as uint64;
    content: Cell;
}

message(0xf8a7ea5) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell?;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

const TakeWalletAddressOpcode: Int = 0xd1735400;
message(TakeWalletAddressOpcode) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Cell?; //It is Maybe ^Address, just encoded it like this
}

message(21) Mint {
    queryId: Int as uint64;
    receiver: Address;
    tonAmount: Int as coins;
    mintMessage: JettonTransferInternal;
}

message(22) CloseMinting {}

message(3) ChangeOwner {
    queryId: Int as uint64;
    newOwner: Address;
}

// provide_wallet_balance#7ac8d559 receiver:MsgAddress include_verify_info:Bool = InternalMsgBody
message(0x7ac8d559) ProvideWalletBalance {
    receiver: Address;
    includeVerifyInfo: Bool;
}

struct VerifyInfo {
    owner: Address;
    minter: Address;
    code: Cell;
}

// verify_info$_ owner:MsgAddress minter:MsgAddress code:^Cell = VerifyInfo
// take_wallet_balance#ca77fdc2 balance:Coins verify_info:(Maybe VerifyInfo) = InternalMsgBody
message(0xca77fdc2) TakeWalletBalance {
    balance: Int as coins;
    verifyInfo: VerifyInfo?;
}

// claim_ton#0393b1ce receiver:MsgAddress = InternalMsgBody
message(0x0393b1ce) ClaimTON {
    receiver: Address;
}



================================================
FILE: jettons/impl/func-governance/JettonMinter.compiled.json
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/func-governance/JettonMinter.compiled.json
================================================
{
    "hex": "b5ee9c72410218010005bb000114ff00f4a413f4bcf2c80b0102016207020201200603020271050400cfaf16f6a2687d007d207d206a6a68bf99e836c1783872ebdb514d9c97c283b7f0ae5179029e2b6119c39462719e4f46ed8f7413e62c780a417877407e978f01a40711411b1acb773a96bdd93fa83bb5ca8435013c8c4b3ac91f4589b4780a38646583fa0064a180400085adbcf6a2687d007d207d206a6a688a2f827c1400b82a3002098a81e46581ac7d0100e78b00e78b6490e4658089fa00097a00658064fc80383a6465816503e5ffe4e8400025bd9adf6a2687d007d207d206a6a6888122f8240202cb0908001da23864658380e78b64814183fa0bc002f3d0cb434c0c05c6c238ecc200835c874c7c0608405e351466ea44c38601035c87e800c3b51343e803e903e90353534541168504d3214017e809400f3c58073c5b333327b55383e903e900c7e800c7d007e800c7e80004c5c3e0e80b4c7c04074cfc044bb51343e803e903e9035353449a084190adf41eeb8c089a150a03fa82107bdd97deba8ee7363805fa00fa40f82854120a70546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d05008c705f2e04a12a14414506603c85005fa025003cf1601cf16ccccc9ed54fa40d120d70b01c000b3915be30de02682102c76b973bae302352514120b04f882106501f354ba8e223134365145c705f2e04902fa40d1103402c85005fa025003cf1601cf16ccccc9ed54e0258210fb88e119ba8e2132343603d15131c705f2e0498b025512c85005fa025003cf1601cf16ccccc9ed54e034248210235caf52bae30237238210cb862902bae302365b2082102508d66abae3026c310f0e0d0c00188210d372158cbadc840ff2f0001e3002c705f2e049d4d4d101ed54fb040044335142c705f2e049c85003cf16c9134440c85005fa025003cf1601cf16ccccc9ed5402ec3031325033c705f2e049fa40fa00d4d120d0d31f01018040d7212182100f8a7ea5ba8e4d36208210595f07bcba8e2c3004fa0031fa4031f401d120f839206e943081169fde718102f270f8380170f836a0811a7770f836a0bcf2b08e138210eed236d3ba9504d30331d19434f2c048e2e2e30d500370111000c082103b9aca0070fb02f828450470546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c920f9007074c8cb02ca07cbffc9d0c8801801cb0501cf1658fa02029858775003cb6bcccc9730017158cb6acce2c98011fb0000ce31fa0031fa4031fa4031f401fa0020d70b009ad74bc00101c001b0f2b19130e25442162191729171e2f839206e938124279120e2216e94318128739101e25023a813a0738103a370f83ca00270f83612a00170f836a07381040982100966018070f837a0bcf2b001fc145f04323401fa40d2000101d195c821cf16c9916de2c8801001cb055004cf1670fa027001cb6a8210d173540001cb1f500401cb3f23fa4430c0008e35f828440470546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d012cf1697316c127001cb01e2f400c91300088050fb000044c8801001cb0501cf1670fa027001cb6a8210d53276db01cb1f0101cb3fc98042fb00019635355161c705f2e04904fa4021fa4430c000f2e14dfa00d4d120d0d31f018210178d4519baf2e0488040d721fa00fa4031fa4031fa0020d70b009ad74bc00101c001b0f2b19130e254431b16018e2191729171e2f839206e938124279120e2216e94318128739101e25023a813a0738103a370f83ca00270f83612a00170f836a07381040982100966018070f837a0bcf2b025597f1700ec82103b9aca0070fb02f828450470546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c920f9007074c8cb02ca07cbffc9d0c8801801cb0501cf1658fa02029858775003cb6bcccc9730017158cb6acce2c98011fb005005a04314c85005fa025003cf1601cf16ccccc9ed546f6e5bfb"
}



================================================
FILE: jettons/impl/func-governance/JettonWallet.compiled.json
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/func-governance/JettonWallet.compiled.json
================================================
{
    "hex": "b5ee9c7241020f010003d1000114ff00f4a413f4bcf2c80b01020162050202012004030021bc508f6a2686981fd007d207d2068af81c0027bfd8176a2686981fd007d207d206899fc152098402f8d001d0d3030171b08e48135f038020d721ed44d0d303fa00fa40fa40d104d31f01840f218210178d4519ba0282107bdd97deba12b1f2f48040d721fa003012a0401303c8cb0358fa0201cf1601cf16c9ed54e0fa40fa4031fa0031f401fa0031fa00013170f83a02d31f012082100f8a7ea5ba8e85303459db3ce0330c0602d0228210178d4519ba8e84325adb3ce034218210595f07bcba8e843101db3ce032208210eed236d3ba8e2f30018040d721d303d1ed44d0d303fa00fa40fa40d1335142c705f2e04a403303c8cb0358fa0201cf1601cf16c9ed54e06c218210d372158cbadc840ff2f0080701f2ed44d0d303fa00fa40fa40d106d33f0101fa00fa40f401d15141a15288c705f2e04926c2fff2afc882107bdd97de01cb1f5801cb3f01fa0221cf1658cf16c9c8801801cb0526cf1670fa02017158cb6accc903f839206e943081169fde718102f270f8380170f836a0811a7770f836a0bcf2b0028050fb00030903f4ed44d0d303fa00fa40fa40d12372b0c002f26d07d33f0101fa005141a004fa40fa4053bac705f82a5464e070546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c9f9007074c8cb02ca07cbffc9d0500cc7051bb1f2e04a09fa0021925f04e30d26d70b01c000b393306c33e30d55020b0a09002003c8cb0358fa0201cf1601cf16c9ed54007a5054a1f82fa07381040982100966018070f837b60972fb02c8801001cb055005cf1670fa027001cb6a8210d53276db01cb1f5801cb3fc9810082fb00590060c882107362d09c01cb1f2501cb3f5004fa0258cf1658cf16c9c8801001cb0524cf1658fa02017158cb6accc98011fb0001f203d33f0101fa00fa4021fa4430c000f2e14ded44d0d303fa00fa40fa40d15309c7052471b0c00021b1f2ad522bc705500ab1f2e0495115a120c2fff2aff82a54259070546004131503c8cb0358fa0201cf1601cf16c921c8cb0113f40012f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f401fa00200d019820d70b009ad74bc00101c001b0f2b19130e2c88210178d451901cb1f500a01cb3f5008fa0223cf1601cf1626fa025007cf16c9c8801801cb055004cf1670fa024063775003cb6bccccc945370e00b42191729171e2f839206e938124279120e2216e94318128739101e25023a813a0738103a370f83ca00270f83612a00170f836a07381040982100966018070f837a0bcf2b0048050fb005803c8cb0358fa0201cf1601cf16c9ed5401f9319e"
}



================================================
FILE: jettons/impl/governance/constants.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/governance/constants.tact
================================================
const MyWorkchain: Bool = false;
// Storage constants

// This is enough for 1 year of storage
// And more than 8 years more until freeze
const minTonsForStorage: Int = ton("0.01");
const gasForTransfer: Int = 10200;
const gasForBurn: Int = 7500;



================================================
FILE: jettons/impl/governance/jetton-minter.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/governance/jetton-minter.tact
================================================
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

import "./jetton-wallet";
import "./messages";
import "./constants";
import "../utils.tact";

const Workchain: Int = 0;

struct JettonMinterState {
    totalSupply: Int as coins;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

contract GovernanceJettonMinter(
    totalSupply: Int as coins,
    adminAddress: Address,
    nextAdminAddress: Address?,
    jettonContent: Cell,
) {
    receive(msg: Mint) {
        require(sender() == self.adminAddress, "Incorrect sender");
        require(parseStdAddress(msg.toAddress.asSlice()).workchain == Workchain, "Wrong workchain");

        // No need to check the opcode here, as Tact will check it automatically
        // throw_unless(error::invalid_op, master_msg_slice~load_op() == op::internal_transfer);

        checkEitherForwardPayload(msg.masterMsg.forwardPayload);

        let fwdCount = 1 + sign(msg.masterMsg.forwardTonAmount);
        let ctx = context();
        require(
            ctx.value >
            msg.masterMsg.forwardTonAmount +
            fwdCount * ctx.readForwardFee() +
            (2 * getComputeFee(gasForTransfer, false) + minTonsForStorage),
            "Insufficient amount of TON attached",
        );

        self.totalSupply += msg.masterMsg.amount;

        deploy(DeployParameters {
            value: 0,
            bounce: true,
            mode: SendRemainingValue | SendBounceIfActionFail,
            body: msg.masterMsg.toCell(),
            init: getJettonWalletInit(msg.toAddress),
        });
    }

    receive(msg: JettonBurnNotification) {
        let sender = parseStdAddress(sender().asSlice());
        let wallet = getJettonBasechainWalletByOwner(msg.sender);

        require(sender.workchain == Workchain && sender.address == wallet.hash!!, "Unauthorized burn");

        self.totalSupply -= msg.amount;

        if (msg.responseDestination != null) {
            message(MessageParameters {
                to: msg.responseDestination!!,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors, // ignore errors, because supply has already been updated
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        let ownerWorkchain: Int = parseStdAddress(msg.ownerAddress.asSlice()).workchain;

        let targetJettonWallet: BasechainAddress = (ownerWorkchain == Workchain)
            ? contractBasechainAddress(initOf JettonWalletGovernance(0, 0, msg.ownerAddress, myAddress()))
            : emptyBasechainAddress();

        message(MessageParameters {
            bounce: false,
            body: makeTakeWalletAddressMsg(targetJettonWallet, msg),
            to: sender(),
            value: 0,
            mode: SendRemainingValue | SendBounceIfActionFail,
        });
    }

    receive(msg: ChangeAdmin) {
        require(sender() == self.adminAddress, "Incorrect sender");
        self.nextAdminAddress = msg.newAdminAddress;
    }

    receive(msg: ClaimAdmin) {
        require(sender() == self.nextAdminAddress, "Not next admin");
        self.adminAddress = sender();
        self.nextAdminAddress = null;
    }

    // can be used to lock, unlock or redeem funds
    receive(msg: CallTo) {
        require(sender() == self.adminAddress, "Incorrect sender");
        let masterMsgSlice = msg.masterMsg.beginParse();
        let op = masterMsgSlice.preloadUint(32);

        if (op == JettonTransferOpcode) {
            let msgToSend = JettonTransfer.fromSlice(masterMsgSlice);

            checkEitherForwardPayload(msgToSend.forwardPayload);

            let ctx = context();
            let fwdCount = 1 + sign(msgToSend.forwardTonAmount);
            require(
                ctx.value >
                msgToSend.forwardTonAmount +
                fwdCount * ctx.readForwardFee() +
                (2 * getComputeFee(gasForTransfer, false) + minTonsForStorage),
                "Insufficient amount of TON attached",
            );

            deploy(DeployParameters {
                bounce: false,
                value: msg.tonAmount,
                mode: SendPayGasSeparately | SendBounceIfActionFail,
                body: msg.masterMsg,
                init: getJettonWalletInit(msg.toAddress),
            });
        } else if (op == JettonBurnOpcode) {
            // It is needed to validate the message
            let _ = JettonBurn.fromSlice(masterMsgSlice);

            let ctx = context();
            require(
                ctx.value > (ctx.readForwardFee() + 2 * getComputeFee(gasForBurn, false)),
                "Insufficient amount of TON attached",
            );

            deploy(DeployParameters {
                bounce: false,
                value: msg.tonAmount,
                mode: SendPayGasSeparately | SendBounceIfActionFail,
                body: msg.masterMsg,
                init: getJettonWalletInit(msg.toAddress),
            });
        } else if (op == SetStatusOpcode) { // SetStatus opcode
            // It is needed to validate the message
            let _ = SetStatus.fromSlice(masterMsgSlice);

            deploy(DeployParameters {
                bounce: false,
                value: msg.tonAmount,
                mode: SendPayGasSeparately | SendBounceIfActionFail,
                body: msg.masterMsg,
                init: getJettonWalletInit(msg.toAddress),
            });
        } else {
            throw(0xffff); // error::invalid_op
        }
    }

    receive(msg: ChangeMetadataUri) {
        require(sender() == self.adminAddress, "Incorrect sender");
        self.jettonContent = msg.metadata.asCell();
    }

    receive(msg: Upgrade) {
        require(sender() == self.adminAddress, "Incorrect sender");
        setData(msg.newData);
        setCode(msg.newCode);
    }

    receive(_: TopUp) {}

    bounced(msg: bounced<JettonTransferInternal>) {
        self.totalSupply -= msg.amount;
    }

    get fun get_jetton_data(): JettonMinterState {
        return JettonMinterState {
            totalSupply: self.totalSupply,
            mintable: true,
            adminAddress: self.adminAddress,
            jettonContent: self.jettonContent,
            jettonWalletCode: codeOf JettonWalletGovernance,
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        return getJettonWalletByOwner(ownerAddress);
    }

    get fun get_next_admin_address(): Address? {
        return self.nextAdminAddress;
    }
}

inline fun getJettonWalletInit(address: Address): StateInit {
    return initOf JettonWalletGovernance(0, 0, address, myAddress());
}

inline fun getJettonWalletByOwner(jettonWalletOwner: Address): Address {
    return contractAddress(getJettonWalletInit(jettonWalletOwner));
}

inline fun getJettonBasechainWalletByOwner(jettonWalletOwner: Address): BasechainAddress {
    return contractBasechainAddress(getJettonWalletInit(jettonWalletOwner));
}

asm fun setData(newData: Cell) {
    c4 POP
}

asm fun setCode(newCode: Cell) {
    SETCODE
}



================================================
FILE: jettons/impl/governance/jetton-wallet.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/governance/jetton-wallet.tact
================================================
import "./messages";
import "./constants";

contract JettonWalletGovernance(
    status: Int as uint4,
    balance: Int as coins,
    owner: Address,
    master: Address,
) {
    receive(msg: JettonTransfer) {
        forceBasechain(msg.destination);
        let isFromMaster = sender() == self.master;

        let outgoingTransfersAllowed = ((self.status & 1) == 0);

        require(outgoingTransfersAllowed || isFromMaster, "Contract is locked");
        require(sender() == self.owner || isFromMaster, "Incorrect sender");

        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");

        checkEitherForwardPayload(msg.forwardPayload);

        let ctx = context();
        let fwdCount = 1 + sign(msg.forwardTonAmount); // msg.forwardTonAmount is coins, so it's non-negative

        require(
            ctx.value >
            msg.forwardTonAmount +
            fwdCount * ctx.readForwardFee() +
            (2 * getComputeFee(gasForTransfer, false) + minTonsForStorage),
            "Insufficient amount of TON attached",
        );

        deploy(DeployParameters {
            value: 0,
            mode: SendRemainingValue | SendBounceIfActionFail,
            bounce: true,
            body: JettonTransferInternal {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload,
            }.toCell(),
            init: initOf JettonWalletGovernance(0, 0, msg.destination, self.master),
        });
    }

    receive(msg: JettonTransferInternal) {
        let incomingTransfersLocked = ((self.status & 2) == 2);
        require(!incomingTransfersLocked, "Incoming transfers are locked");
        self.balance += msg.amount;

        // This message should come only from master, or from other JettonWallet
        let wallet: StateInit = initOf JettonWalletGovernance(0, 0, msg.sender, self.master);
        if (!wallet.hasSameBasechainAddress(sender())) {
            require(self.master == sender(), "Incorrect sender");
        }

        if (msg.forwardTonAmount > 0) {
            message(MessageParameters {
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayGasSeparately | SendBounceIfActionFail,
                bounce: false,
                body: JettonNotification { // 0x7362d09c -- Remind the new Owner
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.sender,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }
        // 0xd53276db -- Cashback to the original Sender
        if (msg.responseDestination != null) {
            let msgValue = context().value;
            let toLeaveOnBalance = myBalance() - msgValue + myStorageDue();
            nativeReserve(max(toLeaveOnBalance, minTonsForStorage), ReserveAtMost);
            message(MessageParameters {
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendRemainingBalance + SendIgnoreErrors,
                bounce: false,
                body: JettonExcesses { queryId: msg.queryId }.toCell(),
            });
        }
    }

    receive(msg: JettonBurn) {
        // Only master can burn the balance of governance contract
        require(sender() == self.master, "Not owner");

        self.balance -= msg.amount;
        require(self.balance >= 0, "Incorrect balance after send");

        let ctx = context();
        require(ctx.value > (ctx.readForwardFee() + 2 * getComputeFee(gasForBurn, false)), "Insufficient amount of TON attached");

        message(MessageParameters {
            to: self.master,
            value: 0,
            mode: SendRemainingValue | SendBounceIfActionFail,
            bounce: true,
            body: JettonBurnNotification {
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination,
            }.toCell(),
        });
    }

    receive(msg: SetStatus) {
        require(sender() == self.master, "Incorrect sender");
        self.status = msg.status;
    }

    receive(_: TopUp) {}

    bounced(msg: bounced<JettonTransferInternal>) {
        self.balance += msg.amount;
    }

    bounced(msg: bounced<JettonBurnNotification>) {
        self.balance += msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData {
            balance: self.balance,
            owner: self.owner,
            minter: self.master,
            code: myCode(),
        };
    }

    get fun get_status(): Int {
        return self.status;
    }
}



================================================
FILE: jettons/impl/governance/messages.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/governance/messages.tact
================================================
struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    minter: Address;
    code: Cell;
}

struct MaybeAddress {
    address: Address?;
}

//=======================================================================
// TEP - 74
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md

const JettonTransferOpcode: Int = 0xf8a7ea5;
message(JettonTransferOpcode) JettonTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

const JettonBurnOpcode: Int = 0x595f07bc;
message(JettonBurnOpcode) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell?;
}

message(0x7362d09c) JettonNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    forwardPayload: Slice as remaining;
}

message(0xd53276db) JettonExcesses {
    queryId: Int as uint64;
}

const JettonTransferInternalOpcode: Int = 0x178d4519;
message(JettonTransferInternalOpcode) JettonTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7bdd97de) JettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    sender: Address;
    responseDestination: Address?;
}

// ============== TEP-89: Jetton Wallet Discovery ==============
// https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

const TakeWalletAddressOpcode: Int = 0xd1735400;
message(TakeWalletAddressOpcode) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Cell?; // It is Maybe ^Address, just encoded it like this
}

//=======================================================================
// Stable

message(0xd372158c) TopUp {
    queryId: Int as uint64;
}

const SetStatusOpcode: Int = 0xeed236d3;
message(SetStatusOpcode) SetStatus {
    queryId: Int as uint64;
    status: Int as uint4;
}

message(0x642b7d07) Mint {
    queryId: Int as uint64;
    toAddress: Address;
    tonAmount: Int as coins;
    masterMsg: JettonTransferInternal;
}

message(0x6501f354) ChangeAdmin {
    queryId: Int as uint64;
    newAdminAddress: Address;
}

message(0xfb88e119) ClaimAdmin {
    queryId: Int as uint64;
}

message(0x235caf52) CallTo {
    queryId: Int as uint64;
    toAddress: Address;
    tonAmount: Int as coins;
    masterMsg: Cell;
}

message(0x2508d66a) Upgrade {
    queryId: Int as uint64;
    newData: Cell;
    newCode: Cell;
}

message(0xcb862902) ChangeMetadataUri {
    queryId: Int as uint64;
    metadata: Slice as remaining;
}

// ============== Additional messages ==============

// provide_wallet_balance#7ac8d559 receiver:MsgAddress include_verify_info:Bool = InternalMsgBody
message(0x7ac8d559) ProvideWalletBalance {
    receiver: Address;
    includeVerifyInfo: Bool;
}

struct VerifyInfo {
    owner: Address;
    minter: Address;
    code: Cell;
}

// verify_info$_ owner:MsgAddress minter:MsgAddress code:^Cell = VerifyInfo
// take_wallet_balance#ca77fdc2 balance:Coins verify_info:(Maybe VerifyInfo) = InternalMsgBody
message(0xca77fdc2) TakeWalletBalance {
    balance: Int as coins;
    verifyInfo: VerifyInfo?;
}



================================================
FILE: jettons/impl/utils.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/impl/utils.tact
================================================
inline fun checkEitherForwardPayload(forwardPayload: Slice) {
    if (forwardPayload.preloadUint(1) == 1) {
        let bitsAndRefs = calculateSliceBitsAndRefs(forwardPayload);
        require(bitsAndRefs.refs == 1 && bitsAndRefs.bits == 1, "Invalid forward payload in message");
    }
}

asm fun emptyAddress(): Address { b{00} PUSHSLICE }

inline fun makeTakeWalletAddressMsg(targetJettonWallet: BasechainAddress, msg: ProvideWalletAddress): Cell {
    return beginCell()
        .storeUint(TakeWalletAddressOpcode, 32)
        .storeUint(msg.queryId, 64)
        .storeBasechainAddress(targetJettonWallet)
        .storeMaybeRef(msg.includeAddress ? beginCell().storeAddress(msg.ownerAddress).endCell() : null)
        .endCell();
}

struct SliceBitsAndRefs {
    bits: Int;
    refs: Int;
}

asm fun calculateSliceBitsAndRefs(slice: Slice): SliceBitsAndRefs {
    SBITREFS
}



================================================
FILE: jettons/mint-usdt/.env.example
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/mint-usdt/.env.example
================================================
MNEMONICS="here goes your wallet v4r2 mnemonic..."
NETWORK="testnet"
JETTON_NAME="TactJetton"
JETTON_SYMBOL="TACT"
JETTON_DESCRIPTION="This is description of Jetton, written in Tact-lang"
JETTON_IMAGE="https://raw.githubusercontent.com/tact-lang/tact/refs/heads/main/docs/public/logomark-light.svg"
JETTON_SUPPLY=1000000000

BOT_TOKEN="80..."


================================================
FILE: jettons/mint-usdt/metadata.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/mint-usdt/metadata.ts
================================================
import {Sha256} from "@aws-crypto/sha256-js"
import {Dictionary, beginCell, Cell, Address} from "@ton/core"

const ONCHAIN_CONTENT_PREFIX = 0x00
const SNAKE_PREFIX = 0x00
const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8)

const sha256 = (str: string) => {
    const sha = new Sha256()
    sha.update(str)
    return Buffer.from(sha.digestSync())
}

const toKey = (key: string) => {
    return BigInt(`0x${sha256(key).toString("hex")}`)
}

export function buildOnchainMetadata(data: Metadata): Cell {
    const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())

    // Store the on-chain metadata in the dictionary
    Object.entries(data).forEach(([key, value]) => {
        dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")))
    })

    return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell()
}

function makeSnakeCell(data: Buffer) {
    // Create a cell that package the data
    const chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES)

    const b = chunks.reduceRight((curCell, chunk, index) => {
        if (index === 0) {
            curCell.storeInt(SNAKE_PREFIX, 8)
        }
        curCell.storeBuffer(chunk)
        if (index > 0) {
            const cell = curCell.endCell()
            return beginCell().storeRef(cell)
        } else {
            return curCell
        }
    }, beginCell())
    return b.endCell()
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
    const chunks: Buffer[] = []
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize))
        buff = buff.slice(chunkSize)
    }
    return chunks
}

export type Metadata = {
    name: string
    symbol: string
    description: string
    image: string
}

export type JettonParams = {
    address: Address
    metadata: Metadata
    totalSupply: bigint
    owner: Address
    jettonWalletCode: Cell
}



================================================
FILE: jettons/mint-usdt/mint-usdt-bot.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/mint-usdt/mint-usdt-bot.ts
================================================
import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.resolve(__dirname, ".env")})

import {Context, session, Telegraf} from "telegraf"

import qrcode from "qrcode"
import {message} from "telegraf/filters"
import {Address} from "@ton/ton"
import {getMintTransactionAsTonLink} from "./mint-usdt"

const MINT_PARAMETERS = {
    jettonMintAmount: process.env.MINT_AMOUNT ?? "100", // 100 TUSDT
    deployValueAmount: process.env.VALUE ?? "0.15", // 0.15 ton
}

// This is deployed in testnet patched Tact USDT Jetton,
// that allows mint for anyone, so you don't need to deploy your own jetton minter
const MINTER_ADDRESS = Address.parse("kQBEpNQPST_mYPpfoENd2abvEDb5WJnEpXxjufNHQNN9xuQI")

/*
    This script is a bot that allows you to mint Tact USDT on testnet.
    It shows example of how to create transaction body and pack it into QR code
    that can be scanned by wallet applications

    Fill .env file and run this script by "yarn ts-node jettons/mint-usdt/mint-usdt-bot.ts" in the terminal.
*/
const main = async () => {
    const botToken = process.env.BOT_TOKEN ?? "bot_token"

    interface SessionData {
        awaitingAddress?: boolean
    }

    interface CustomContext extends Context {
        session: SessionData
    }

    const bot: Telegraf<CustomContext> = new Telegraf(botToken)

    bot.use(
        session({
            defaultSession: (): SessionData => ({
                awaitingAddress: false,
            }),
        }),
    )

    bot.command("info", ctx => {
        ctx.reply(
            "Bot that gives you 100 Tact USDT on testnet for testing purposes. Use /mint_usdt to start.",
        )
    })

    bot.command("mint_usdt", async ctx => {
        ctx.session.awaitingAddress = true
        await ctx.reply("Please send your wallet address:")
    })

    bot.on(message("text"), async ctx => {
        if (ctx.session.awaitingAddress) {
            const userAddressRaw = ctx.message.text
            let userAddress: Address

            // Validate the address format
            try {
                const parsedAddress = Address.parse(userAddressRaw)
                ctx.session.awaitingAddress = false
                userAddress = parsedAddress
            } catch (error) {
                await ctx.reply("Invalid address format. Please send a valid wallet address.")
                return
            }

            const mintTransactionLink = await getMintTransactionAsTonLink(
                userAddress,
                MINTER_ADDRESS,
                MINT_PARAMETERS,
            )
            console.log(mintTransactionLink)

            const qrCodeBuffer = await qrcode.toBuffer(mintTransactionLink)

            await ctx.replyWithPhoto(
                {source: qrCodeBuffer},
                {
                    caption: `Scan this QR code with your TON wallet or <a href="${mintTransactionLink}">click here</a> to mint Tact USDT in testnet.`,
                    parse_mode: "HTML",
                },
            )
        }
    })

    // Start the bot
    bot.launch()
    console.log("Bot is running...")
}

main().catch(error => {
    console.error("Error starting the bot:", error)
})



================================================
FILE: jettons/mint-usdt/mint-usdt-terminal.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/mint-usdt/mint-usdt-terminal.ts
================================================
import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.resolve(__dirname, ".env")})

import {TonClient, WalletContractV4, internal, fromNano} from "@ton/ton"
import {getHttpEndpoint, Network} from "@orbs-network/ton-access"
import {mnemonicToPrivateKey} from "@ton/crypto"
import {Metadata} from "./metadata"
import {getMintTransaction} from "./mint-usdt"

/* 
   This is the metadata for the testnet USDT jetton.
   We need it to deploy the jetton minter.
   The metadata is stored on-chain in a cell dictionary.
*/
const JETTON_MINTER_PARAMETERS: Metadata = {
    name: process.env.JETTON_NAME ?? "Tact USDT",
    description: process.env.JETTON_DESCRIPTION ?? "Testnet Tact USDT",
    symbol: process.env.JETTON_SYMBOL ?? "TUSDT",
    image:
        process.env.JETTON_IMAGE ??
        "https://raw.githubusercontent.com/tact-lang/tact/refs/heads/main/docs/public/logomark-light.svg",
}

const MINT_PARAMETERS = {
    jettonMintAmount: process.env.MINT_AMOUNT ?? "1000000", // 1 million TUSDT
    deployValueAmount: process.env.VALUE ?? "1.5", // 1.5 ton
}

/*
    (Remember to install dependencies by running "yarn install" in the terminal)
    Here are the instructions to deploy the contract:
    1. Create new walletV4r2 or use existing one.
    2. Enter your mnemonics in .env file. (.env.example is provided)
    3. In .env file specify the network you want to deploy the contract.
    (testnet is chosen by default, if you are not familiar with it, read https://tonkeeper.helpscoutdocs.com/article/100-how-switch-to-the-testnet)

    4. In .env file specify the parameters of the Jetton. (Ticker, description, image, etc.)
    5. In .env file specify the total supply of the Jetton. It will be automatically converted to nano - jettons.
    Note: All supply will be automatically minted to your wallet.

    6. Run "yarn build" to compile the contract.
    7. Run this script by "yarn ts-node jettons/mint-usdt/mint-usdt-terminal.ts" in the terminal.
 */
const main = async () => {
    const mnemonics = process.env.MNEMONICS
    if (mnemonics === undefined) {
        console.error("Mnemonics is not provided, please add it to .env file")
        throw new Error("Mnemonics is not provided")
    }
    if (mnemonics.split(" ").length !== 24) {
        console.error("Invalid mnemonics, it should be 24 words")
        throw new Error("Invalid mnemonics, it should be 24 words")
    }

    const network = process.env.NETWORK ?? "testnet" // or "mainnet"

    const endpoint = await getHttpEndpoint({network: network as Network})
    const client = new TonClient({
        endpoint: endpoint,
    })

    const keyPair = await mnemonicToPrivateKey(mnemonics.split(" "))
    const secretKey = keyPair.secretKey
    const workchain = 0 // basechain

    const deployerWallet = WalletContractV4.create({
        workchain: workchain,
        publicKey: keyPair.publicKey,
    })

    const deployerWalletContract = client.open(deployerWallet)

    const mintTransaction = await getMintTransaction(
        deployerWalletContract.address,
        JETTON_MINTER_PARAMETERS,
        MINT_PARAMETERS,
    )

    // Send a message on new address contract to deploy it
    const seqno: number = await deployerWalletContract.getSeqno()
    console.log(
        "🛠️Preparing new outgoing massage from deployment wallet. \n" +
            deployerWalletContract.address,
    )
    console.log("Seqno: ", seqno + "\n")

    // Get deployment wallet balance
    const balance: bigint = await deployerWalletContract.getBalance()

    console.log("Current deployment wallet balance = ", fromNano(balance).toString(), "💎TON")

    if (balance < mintTransaction.value) {
        console.log(
            "Not enough balance to deploy the contract. Please add some funds to your wallet.",
        )
        return
    }

    // Send transaction to v4 wallet to the blockchain
    await deployerWalletContract.sendTransfer({
        seqno,
        secretKey,
        messages: [
            internal({
                to: mintTransaction.to,
                value: mintTransaction.value,
                init: mintTransaction.stateInit,
                body: mintTransaction.body,
            }),
        ],
    })
    console.log("====== Deployment message sent to =======\n", mintTransaction.to)
    const link = `https://testnet.tonviewer.com/${mintTransaction.to.toString({
        urlSafe: true,
    })}`

    console.log(`You can soon check your deployed contract at ${link}`)
}

void main()



================================================
FILE: jettons/mint-usdt/mint-usdt.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/mint-usdt/mint-usdt.ts
================================================
import {Address, beginCell, Cell, contractAddress, storeStateInit, toNano} from "@ton/core"
import {storeMint} from "../output/Governance Jetton_GovernanceJettonMinter"
import {buildOnchainMetadata, Metadata} from "./metadata"

// get it here https://github.com/ton-blockchain/stablecoin-contract/tree/main/build
import funcJettonMinter from "../impl/func-governance/JettonMinter.compiled.json"
import funcJettonWallet from "../impl/func-governance/JettonWallet.compiled.json"

const getJettonFuncCode = () => {
    // to work with identical func usdt minter and wallet, we need to use the same code
    // as the one used in the mainnet, hence we are using precompiled code from hex
    return {
        minterCode: Cell.fromHex(funcJettonMinter.hex),
        walletCode: Cell.fromHex(funcJettonWallet.hex),
    }
}

export async function buildJettonMinterFromMetadata(deployerAddress: Address, metadata: Metadata) {
    // build cell with metadata
    const content = buildOnchainMetadata(metadata)
    const code = getJettonFuncCode()

    // create init data cell
    const stateInitData = beginCell()
        .storeCoins(0) // initial balance
        .storeAddress(deployerAddress) // admin address
        .storeAddress(null) // next admin address
        .storeRef(code.walletCode) // wallet code
        .storeRef(content) // metadata cell
        .endCell()

    const init = {
        code: code.minterCode,
        data: stateInitData,
    }

    const jettonMinterAddress = contractAddress(0, init)

    // use metadata to initialize the jetton minter
    return {
        address: jettonMinterAddress,
        init: init,
        code: code.minterCode,
        walletCode: code.walletCode,
    }
}

type MintParameters = {
    jettonMintAmount: string
    deployValueAmount: string
}

// This function doesn't actually send anything, it just prepares the message
export const getMintTransaction = async (
    deployerAddress: Address,
    metadata: Metadata,
    mintParameters: MintParameters,
) => {
    const jettonMinter = await buildJettonMinterFromMetadata(deployerAddress, metadata)

    /* 
        To get Testnet USDT we need to do two things:
            1. Deploy the jetton minter
            2. Send a mint transaction to the jetton minter

        We can do this in one transaction (sending one message) by utilizing stateInit and body fields of the message
        Down here we are preparing everything needed to create this message
    */
    const mintBody = beginCell()
        .store(
            storeMint({
                $$type: "Mint",
                queryId: 0n,
                masterMsg: {
                    $$type: "JettonTransferInternal",
                    queryId: 0n,
                    amount: toNano(mintParameters.jettonMintAmount),
                    sender: deployerAddress,
                    responseDestination: deployerAddress,
                    forwardTonAmount: 0n,
                    forwardPayload: beginCell().storeUint(0, 1).asSlice(),
                },
                toAddress: deployerAddress,
                tonAmount: 0n,
            }),
        )
        .endCell()

    const stateInit = {
        code: jettonMinter.init.code,
        data: jettonMinter.init.data,
    }

    const stateInitCell = beginCell().store(storeStateInit(stateInit)).endCell()
    const sendValue = toNano(mintParameters.deployValueAmount)

    return {
        to: jettonMinter.address,
        stateInitCell: stateInitCell,
        stateInit,
        body: mintBody,
        value: sendValue,
    }
}

const getMintBodyCell = async (deployerAddress: Address, mintParameters: MintParameters) => {
    const mintBody = beginCell()
        .store(
            storeMint({
                $$type: "Mint",
                queryId: 0n,
                masterMsg: {
                    $$type: "JettonTransferInternal",
                    queryId: 0n,
                    amount: toNano(mintParameters.jettonMintAmount),
                    sender: deployerAddress,
                    responseDestination: deployerAddress,
                    forwardTonAmount: 0n,
                    forwardPayload: beginCell().storeUint(0, 1).asSlice(),
                },
                toAddress: deployerAddress,
                tonAmount: 0n,
            }),
        )
        .endCell()

    return mintBody
}

export const getMintTransactionAsTonLink = async (
    deployerAddress: Address,
    minterAddress: Address,
    mintParameters: MintParameters,
) => {
    const mintBody = await getMintBodyCell(deployerAddress, mintParameters)
    const sendValue = toNano(mintParameters.deployValueAmount)

    const tonLink = `ton://transfer/${minterAddress.toString({
        urlSafe: true,
    })}?amount=${sendValue.toString()}&bin=${mintBody.toBoc().toString(`base64url`)}`

    return tonLink
}



================================================
FILE: jettons/onchain-api/fetcher.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/onchain-api/fetcher.spec.ts
================================================
import "@ton/test-utils"
import {Address, beginCell, Cell, Dictionary, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {
    JettonMinter,
    JettonTransfer,
    JettonUpdateContent,
    Mint,
} from "../output/Basic Jetton_JettonMinter"
import {JettonWallet} from "../output/Basic Jetton_JettonWallet"
import {Fetcher} from "../output/JettonFetcherOnChain_Fetcher"

describe("Jetton Fetcher Tests", () => {
    let blockchain: Blockchain

    let jettonMinter: SandboxContract<JettonMinter>
    let jettonFetcherContract: SandboxContract<Fetcher>

    let deployer: SandboxContract<TreasuryContract>

    let defaultContent: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        defaultContent = beginCell().endCell()
        const msg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: new Cell(),
        }

        // deploy jetton minter
        jettonMinter = blockchain.openContract(
            await JettonMinter.fromInit(0n, deployer.address, defaultContent, true),
        )
        const deployResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            msg,
        )

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        })

        // deploy jetton receiver contract
        jettonFetcherContract = blockchain.openContract(
            await Fetcher.fromInit(Dictionary.empty(), Dictionary.empty(), 0n),
        )

        const testerDeployResult = await jettonFetcherContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(testerDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonFetcherContract.address,
            deploy: true,
            success: true,
        })

        // mint jettons to deployer address as part of the setup
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            receiver: deployer.address,
            tonAmount: 0n,
            mintMessage: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const mintResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            mintMsg,
        )
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // mint message
            op: JettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWallet.fromAddress(await jettonMinter.getGetWalletAddress(address)),
            )
        }
    })

    it("should correctly on-chain get jetton wallet address", async () => {
        const fetchAddressResult = await jettonFetcherContract.send(
            deployer.getSender(),
            {
                value: toNano(0.5),
            },
            {
                $$type: "FetchJettonAddressOnChain",
                jettonMinterAddress: jettonMinter.address,
                ownerAddress: deployer.address,
            },
        )

        // on-chain request
        expect(fetchAddressResult.transactions).toHaveTransaction({
            from: jettonFetcherContract.address,
            to: jettonMinter.address,
            op: Fetcher.opcodes.ProvideWalletAddress,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // response
        })

        // on-chain response
        expect(fetchAddressResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: jettonFetcherContract.address,
            op: Fetcher.opcodes.TakeWalletAddress,
            success: true,
            exitCode: 0,
        })

        const deployerJettonWallet = await userWallet(deployer.address)
        const knownJettonOwners = await jettonFetcherContract.getGetKnownJettonOwners()

        // verify that we correctly saved wallet owner and jetton address
        expect(knownJettonOwners.get(deployer.address)).toEqualAddress(deployerJettonWallet.address)
    })

    it("should correctly on-chain get jetton wallet balance", async () => {
        const jettonTransferAmount = toNano(1)
        const receiverAddress = Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")

        const deployerJettonWallet = await userWallet(deployer.address)

        const transferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: deployer.address,
            forwardTonAmount: toNano(1),
            forwardPayload: beginCell().storeBit(0).asSlice(),
            destination: receiverAddress,
            customPayload: null,
        }

        await deployerJettonWallet.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            transferMsg,
        )

        const receiverJettonWallet = await userWallet(receiverAddress)

        const fetchBalanceResult = await jettonFetcherContract.send(
            deployer.getSender(),
            {
                value: toNano(1),
            },
            {
                $$type: "FetchJettonBalanceOnChain",
                jettonWalletAddress: receiverJettonWallet.address,
            },
        )

        // on-chain request
        expect(fetchBalanceResult.transactions).toHaveTransaction({
            from: jettonFetcherContract.address,
            to: receiverJettonWallet.address,
            op: Fetcher.opcodes.ProvideWalletBalance,
            success: true,
            outMessagesCount: 1, // response
        })

        // on-chain response
        expect(fetchBalanceResult.transactions).toHaveTransaction({
            from: receiverJettonWallet.address,
            to: jettonFetcherContract.address,
            op: Fetcher.opcodes.TakeWalletBalance,
            success: true,
        })

        const actualBalanceData = await receiverJettonWallet.getGetWalletData()
        const lastFetchedBalance = await jettonFetcherContract.getLastFetchedBalance()

        expect(lastFetchedBalance).toEqual(actualBalanceData.balance)
    })
})



================================================
FILE: jettons/onchain-api/fetcher.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/onchain-api/fetcher.tact
================================================
import "../impl/basic/messages.tact";

message(0x9de952d9) FetchJettonAddressOnChain {
    ownerAddress: Address;
    jettonMinterAddress: Address;
}

message(0xf2300ed) FetchJettonBalanceOnChain {
    jettonWalletAddress: Address;
}

contract Fetcher(
    // NOTE: it's not recommended to use maps like this in production,
    // since that they could be filled to the overflow; use sharding instead
    requests: map<Address, Bool>,
    verifiedAddresses: map<Address, Address>,
    latestFetchedBalance: Int,
) {
    // in this receiver we send on-chain request to minter
    receive(msg: FetchJettonAddressOnChain) {
        // we need map to store the requests and later verify the responses
        self.requests.set(msg.jettonMinterAddress, true);

        message(MessageParameters {
            to: msg.jettonMinterAddress,
            value: 0,
            body: ProvideWalletAddress {
                queryId: 0,
                includeAddress: true,
                ownerAddress: msg.ownerAddress,
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    // receiver for the response from the jetton minter;
    // the message is defined in the tep-89
    receive(msg: TakeWalletAddress) {
        require(self.requests.get(sender()), "Request not found");
        let _ = self.requests.del(sender());

        let jettonWalletAddress = msg.walletAddress;
        // here we can do something with the jetton wallet address
        // for example, we can use it to send or receive jettons from this wallet, or some other logic

        // let jettonOwnerCell = msg.ownerAddress.beginParse().loadMaybeRef();
        let jettonOwner = msg.ownerAddress!!.beginParse().loadAddress();
        // map <jettonOwnerAddress> -> <jettonWalletAddress>
        self.verifiedAddresses.set(jettonOwner, jettonWalletAddress);
    }

    receive(msg: FetchJettonBalanceOnChain) {
        message(MessageParameters {
            to: msg.jettonWalletAddress,
            value: 0,
            body: ProvideWalletBalance {
                receiver: myAddress(),
                includeVerifyInfo: true,
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    // beware, that in general case, while the jetton balance response will reach
    // your contract, balance of this jetton could potentially change
    receive(msg: TakeWalletBalance) {
        let jettonBalance = msg.balance;

        // here you can either use msg.verifyInfo to proof this balance
        // or trust the specific jetton addresses and use this info in your logic
        self.latestFetchedBalance = jettonBalance;
    }

    // deploy
    receive() {}

    get fun getKnownJettonOwners(): map<Address, Address> {
        return self.verifiedAddresses;
    }

    get fun lastFetchedBalance(): Int {
        return self.latestFetchedBalance;
    }
}



================================================
FILE: jettons/receive-jettons-v2/README.md
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-jettons-v2/README.md
================================================
# Jetton Receiver v2

## 1. Overview

This example demonstrates how to integrate the `UseJetton` trait to create a contract that can receive jetton transfers in a safe and standards-compliant manner. The contract serves as a practical implementation showing the trait's capabilities.

## 2. Processing Flow

1. **Initial Deployment** – Deploy `JettonReceiver` with the required parameters:
    - `jettonMaster` – address of the jetton master contract
    - `jettonWallet = null` – wallet address will be resolved automatically
    - `amountChecker = 0` and `payloadChecker = b{}` – testing state variables
2. **First Transfer** – When the first jetton transfer arrives:
    - The embedded `UseJetton` trait initiates the TEP-89 discovery process
    - After successful discovery, the trait stores the resolved wallet address
    - The original `JettonNotification` is delivered to `receiveJettonHandler`
3. **Transfer Processing** – Inside `receiveJettonHandler`, the contract:
    - Accumulates `msg.amount` in `amountChecker` (running total)
    - Updates `payloadChecker` with `msg.forwardPayload` (latest payload)
4. **Subsequent Transfers** – Future transfers from the same wallet repeat step 3
5. **Security** – Transfers from unauthorized wallets are automatically refunded and rejected

## 3. Implementation Details

The example contract implements the minimal required interface:

- Extends the `UseJetton` trait
- Implements `receiveJettonHandler(msg: JettonNotification)` callback
- Provides getter methods for testing and verification

## 4. Usage

1. Deploy the contract with `jettonWallet = null`
2. Send jetton transfers to test the functionality
3. Use getter methods to verify the accumulated amounts and payloads
4. Observe automatic refunds for transfers from incorrect wallets

## 5. Related Documentation

For detailed trait documentation, see [`jettons/use-jetton`](../use-jetton).



================================================
FILE: jettons/receive-jettons-v2/receiver.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-jettons-v2/receiver.spec.ts
================================================
import {Address, beginCell, Cell, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {
    JettonMinter,
    JettonTransfer,
    JettonUpdateContent,
    Mint,
} from "../output/Basic Jetton_JettonMinter"
import {
    JettonNotification,
    JettonReceiver,
    storeJettonNotification,
} from "../output/JettonReceiverV2_JettonReceiver"
import {JettonWallet} from "../output/Basic Jetton_JettonWallet"
import {TEP89DiscoveryProxy} from "../output/JettonReceiverV2_TEP89DiscoveryProxy"
import {findTransactionRequired} from "@ton/test-utils"

describe("Jetton Receiver with trait and discovery Tests", () => {
    let blockchain: Blockchain

    let jettonMinter: SandboxContract<JettonMinter>
    let jettonReceiverContract: SandboxContract<JettonReceiver>

    let deployer: SandboxContract<TreasuryContract>

    let defaultContent: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        defaultContent = beginCell().endCell()
        const updateContentMsg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: new Cell(),
        }

        // Deploy jetton minter contract
        jettonMinter = blockchain.openContract(
            await JettonMinter.fromInit(0n, deployer.address, defaultContent, true),
        )
        const minterDeployResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            updateContentMsg,
        )

        expect(minterDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        })

        // Deploy jetton receiver contract with jettonWallet = null (required for discovery)
        jettonReceiverContract = blockchain.openContract(
            await JettonReceiver.fromInit(jettonMinter.address, null, 0n, beginCell().asSlice()),
        )

        const receiverDeployResult = await jettonReceiverContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(receiverDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonReceiverContract.address,
            deploy: true,
            success: true,
        })

        // Mint jettons to deployer for testing transfers
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            receiver: deployer.address,
            tonAmount: 0n,
            mintMessage: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const mintResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            mintMsg,
        )
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // JettonTransferInternal to deployer's wallet
            op: JettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWallet.fromAddress(await jettonMinter.getGetWalletAddress(address)),
            )
        }
    })

    it("should complete TEP-89 discovery flow", async () => {
        const deployerJettonWallet = await userWallet(deployer.address)
        const receiverJettonWallet = await userWallet(jettonReceiverContract.address)

        const transferAmount = toNano(1)
        const forwardPayload = beginCell().storeUint(239, 17).endCell()

        const transferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: transferAmount,
            responseDestination: deployer.address,
            forwardTonAmount: toNano(1),
            forwardPayload: beginCell()
                .storeBit(false) // Inline format
                .storeSlice(forwardPayload.asSlice())
                .endCell()
                .asSlice(),
            destination: jettonReceiverContract.address,
            customPayload: null,
        }

        const transferResult = await deployerJettonWallet.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            transferMsg,
        )

        // Step 1: JettonTransferInternal to receiver's jetton wallet (auto-deployed)
        expect(transferResult.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            to: receiverJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 2, // JettonNotification + JettonExcesses
            op: JettonWallet.opcodes.JettonTransferInternal,
            deploy: true,
        })

        // Step 2: JettonNotification triggers TEP-89 discovery (jettonWallet is null)
        const notificationTx = findTransactionRequired(transferResult.transactions, {
            from: receiverJettonWallet.address,
            to: jettonReceiverContract.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // Deploy TEP89DiscoveryProxy
            op: JettonWallet.opcodes.JettonNotification,
        })

        // Calculate expected proxy address based on discovery parameters
        const discoveryProxyContract = await TEP89DiscoveryProxy.fromInit(
            jettonMinter.address, // jettonMaster
            jettonReceiverContract.address, // discoveryRequester
            receiverJettonWallet.address, // expectedJettonWallet
            notificationTx.inMessage!.body!, // original JettonNotification as action
            notificationTx.lt, // discoveryId (logical time)
        )
        const proxyAddress = discoveryProxyContract.address

        // Step 3: TEP89DiscoveryProxy deployment by receiver contract
        expect(transferResult.transactions).toHaveTransaction({
            from: jettonReceiverContract.address,
            to: proxyAddress,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // ProvideWalletAddress to JettonMaster
            deploy: true,
        })

        // Step 4: Proxy requests wallet address from jetton master
        expect(transferResult.transactions).toHaveTransaction({
            from: proxyAddress,
            to: jettonMinter.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // TakeWalletAddress response
            op: JettonMinter.opcodes.ProvideWalletAddress,
        })

        // Step 5: Jetton master responds with wallet address
        expect(transferResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: proxyAddress,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // TEP89DiscoveryResult to receiver
            op: JettonMinter.opcodes.TakeWalletAddress,
        })

        // Step 6: Proxy sends discovery result back to receiver contract
        expect(transferResult.transactions).toHaveTransaction({
            from: proxyAddress,
            to: jettonReceiverContract.address,
            success: true,
            exitCode: 0,
            op: JettonReceiver.opcodes.TEP89DiscoveryResult,
        })

        // Verify receiver contract processed the transfer successfully
        const finalAmount = await jettonReceiverContract.getAmountChecker()
        expect(finalAmount).toEqual(transferAmount)

        const finalPayload = await jettonReceiverContract.getPayloadChecker()
        expect(finalPayload).toEqualSlice(forwardPayload.asSlice())
    })

    it("should reject malicious direct JettonNotification and refund tokens", async () => {
        // Attempt to send JettonNotification directly (bypassing jetton wallet)
        const maliciousNotification: JettonNotification = {
            $$type: "JettonNotification",
            queryId: 0n,
            amount: toNano(1),
            forwardPayload: beginCell().storeUint(239, 17).asSlice(),
            sender: deployer.address,
        }

        const notificationCell = beginCell()
            .store(storeJettonNotification(maliciousNotification))
            .endCell()

        // Send malicious notification directly from deployer (not from jetton wallet)
        const maliciousResult = await deployer.send({
            to: jettonReceiverContract.address,
            value: toNano(1),
            body: notificationCell,
        })

        // Step 1: JettonNotification triggers TEP-89 discovery (malicious attempt)
        const notificationTx = findTransactionRequired(maliciousResult.transactions, {
            to: jettonReceiverContract.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // Deploy TEP89DiscoveryProxy
            op: JettonWallet.opcodes.JettonNotification,
        })

        // Calculate expected proxy address based on discovery parameters
        const discoveryProxyContract = await TEP89DiscoveryProxy.fromInit(
            jettonMinter.address, // jettonMaster
            jettonReceiverContract.address, // discoveryRequester
            deployer.address, // expectedJettonWallet (sender from notification)
            notificationTx.inMessage!.body!, // malicious notification as action
            notificationTx.lt, // discoveryId
        )
        const proxyAddress = discoveryProxyContract.address

        // Step 2: TEP89DiscoveryProxy deployment by receiver contract
        expect(maliciousResult.transactions).toHaveTransaction({
            from: jettonReceiverContract.address,
            to: proxyAddress,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // ProvideWalletAddress to JettonMaster
            deploy: true,
        })

        // Step 3: Proxy requests wallet address from jetton master
        expect(maliciousResult.transactions).toHaveTransaction({
            from: proxyAddress,
            to: jettonMinter.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // TakeWalletAddress response
            op: JettonMinter.opcodes.ProvideWalletAddress,
        })

        // Step 4: Jetton master responds with wallet address
        expect(maliciousResult.transactions).toHaveTransaction({
            from: jettonMinter.address,
            to: proxyAddress,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // TEP89DiscoveryResult to receiver
            op: JettonMinter.opcodes.TakeWalletAddress,
        })

        // Step 5: Proxy sends discovery result back to receiver contract (mismatch detected)
        expect(maliciousResult.transactions).toHaveTransaction({
            from: proxyAddress,
            to: jettonReceiverContract.address,
            success: true,
            exitCode: 0,
            op: JettonReceiver.opcodes.TEP89DiscoveryResult,
            outMessagesCount: 1, // Refund transfer
        })

        // Step 6: Receiver contract refunds tokens to malicious sender
        expect(maliciousResult.transactions).toHaveTransaction({
            from: jettonReceiverContract.address,
            to: deployer.address,
            success: true,
            exitCode: 0,
            op: JettonWallet.opcodes.JettonTransfer,
        })

        // Verify malicious transfer was rejected (no state changes)
        const finalAmount = await jettonReceiverContract.getAmountChecker()
        expect(finalAmount).toEqual(0n)

        const finalPayload = await jettonReceiverContract.getPayloadChecker()
        expect(finalPayload).toEqualSlice(beginCell().asSlice())
    })

    it("should reject fake TEP89DiscoveryResult message", async () => {
        // Create a fake TEP89DiscoveryResult message
        const fakeDiscoveryResult = beginCell()
            .storeUint(JettonReceiver.opcodes.TEP89DiscoveryResult, 32)
            .storeUint(0n, 64)
            .storeAddress(null)
            .storeAddress(null)
            .storeRef(beginCell().endCell())
            .endCell()

        // Send fake message from deployer (not from a valid TEP-89 proxy)
        const fakeResult = await deployer.send({
            to: jettonReceiverContract.address,
            value: toNano(1),
            body: fakeDiscoveryResult,
        })

        // Verify the transaction failed with the expected error
        expect(fakeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonReceiverContract.address,
            success: false,
            exitCode: JettonReceiver.errors["UseJetton: Sender must be a valid TEP-89 proxy"],
        })

        // Verify no state changes occurred
        const finalAmount = await jettonReceiverContract.getAmountChecker()
        expect(finalAmount).toEqual(0n)

        const finalPayload = await jettonReceiverContract.getPayloadChecker()
        expect(finalPayload).toEqualSlice(beginCell().asSlice())
    })
})



================================================
FILE: jettons/receive-jettons-v2/receiver.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-jettons-v2/receiver.tact
================================================
import "../impl/basic/messages";
import "../use-jetton/use-jetton";

/// JettonReceiver Contract
/// ----------------------
/// A demonstration contract that integrates the `UseJetton` trait to receive
/// jetton transfers securely. This contract accumulates received jetton amounts
/// and preserves transfer payloads for testing and verification purposes.
///
/// The contract serves as a practical example of `UseJetton` integration,
/// showing the minimal implementation required to handle jetton transfers.
contract JettonReceiver(
    // Required variables for UseJetton trait
    jettonMaster: Address,
    jettonWallet: Address?, // Must be null during deployment
    // Testing and verification variables
    amountChecker: Int as coins,
    payloadChecker: Slice,
) with UseJetton {
    /// Handler for validated jetton transfer notifications.
    ///
    /// This method is invoked by the `UseJetton` trait after the jetton wallet
    /// address has been discovered and the incoming transfer has passed all
    /// security validations.
    ///
    /// The implementation accumulates the received amount and stores the
    /// forward payload for testing purposes.
    override fun receiveJettonHandler(msg: JettonNotification) {
        self.amountChecker += msg.amount;
        self.payloadChecker = msg.forwardPayload;
        return;
    }

    /// Accepts the initial deployment message.
    /// All subsequent message validation is handled automatically by the trait.
    receive() {}

    /// Returns the cumulative amount of jettons received.
    /// Used for testing and verification.
    get fun amountChecker(): Int {
        return self.amountChecker;
    }

    /// Returns the most recent forward payload received.
    /// Used for testing and verification.
    get fun payloadChecker(): Slice {
        return self.payloadChecker;
    }
}



================================================
FILE: jettons/receive-jettons/receiver.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-jettons/receiver.spec.ts
================================================
import "@ton/test-utils"
import {Address, beginCell, Cell, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {
    JettonMinter,
    JettonTransfer,
    JettonUpdateContent,
    Mint,
} from "../output/Basic Jetton_JettonMinter"
import {
    JettonNotification,
    JettonReceiver,
    storeJettonNotification,
} from "../output/JettonReceiver_JettonReceiver"
import {JettonWallet} from "../output/Basic Jetton_JettonWallet"

describe("Jetton Receiver Tests", () => {
    let blockchain: Blockchain

    let jettonMinter: SandboxContract<JettonMinter>
    let jettonReceiverContract: SandboxContract<JettonReceiver>

    let deployer: SandboxContract<TreasuryContract>

    let defaultContent: Cell
    let jettonWalletCode: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        defaultContent = beginCell().endCell()
        const msg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: new Cell(),
        }

        // deploy jetton minter
        jettonMinter = blockchain.openContract(
            await JettonMinter.fromInit(0n, deployer.address, defaultContent, true),
        )
        const deployResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            msg,
        )

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        })

        // quick setup to get jetton wallet code and reuse later
        const jettonWallet = blockchain.openContract(
            await JettonWallet.fromInit(0n, deployer.address, jettonMinter.address),
        )
        jettonWalletCode = jettonWallet.init!.code

        // deploy jetton receiver contract
        jettonReceiverContract = blockchain.openContract(
            await JettonReceiver.fromInit(
                jettonMinter.address,
                jettonWalletCode,
                0n,
                beginCell().asSlice(),
            ),
        )

        const testerDeployResult = await jettonReceiverContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(testerDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonReceiverContract.address,
            deploy: true,
            success: true,
        })

        // mint jettons to deployer address as part of the setup
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            receiver: deployer.address,
            tonAmount: 0n,
            mintMessage: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const mintResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            mintMsg,
        )
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // mint message
            op: JettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWallet.fromAddress(await jettonMinter.getGetWalletAddress(address)),
            )
        }
    })

    it("jetton receiver should accept correct transfer notification", async () => {
        const deployerJettonWallet = await userWallet(deployer.address)
        const receiverJettonWallet = await userWallet(jettonReceiverContract.address)

        const jettonTransferAmount = toNano(1)
        const jettonTransferForwardPayload = beginCell().storeUint(239, 32).endCell()
        const transferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: deployer.address,
            forwardTonAmount: toNano(1),
            forwardPayload: jettonTransferForwardPayload.asSlice(),
            destination: jettonReceiverContract.address,
            customPayload: null,
        }

        // -(external)-> deployer -(transfer)-> deployer jetton wallet --
        // -(internal transfer)-> receiver jetton wallet -(transfer notification)-> receiver.tact
        const transferResult = await deployerJettonWallet.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            transferMsg,
        )

        // check that jetton transfer was successful
        // and notification message was sent to receiver contract
        expect(transferResult.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            to: receiverJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 2, // notification + excesses
            op: JettonWallet.opcodes.JettonTransferInternal,
            deploy: true,
        })

        // notification message to receiver.tact contract, handled by our receiver contract logic
        expect(transferResult.transactions).toHaveTransaction({
            from: receiverJettonWallet.address,
            to: jettonReceiverContract.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 0, // we don't send anything
            op: JettonWallet.opcodes.JettonNotification,
        })

        // getters to ensure we successfully received notification and executed overridden fetch method
        const getAmount = await jettonReceiverContract.getAmountChecker()
        expect(getAmount).toEqual(jettonTransferAmount)

        const getPayload = await jettonReceiverContract.getPayloadChecker()
        expect(getPayload).toEqualSlice(jettonTransferForwardPayload.asSlice())
    })

    it("jetton receiver should reject malicious transfer notification", async () => {
        // try to send malicious notification message
        const msg: JettonNotification = {
            $$type: "JettonNotification",
            queryId: 0n,
            amount: toNano(1),
            forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            sender: deployer.address,
        }

        const msgCell = beginCell().store(storeJettonNotification(msg)).endCell()

        // no actual jetton transfer, just send notification message
        const maliciousSendResult = await deployer.send({
            to: jettonReceiverContract.address,
            value: toNano(1),
            body: msgCell,
        })

        expect(maliciousSendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonReceiverContract.address,
            // should be rejected
            success: false,
            exitCode: JettonReceiver.errors["Incorrect sender"],
        })

        const getAmount = await jettonReceiverContract.getAmountChecker()
        expect(getAmount).toEqual(0n)

        const getPayload = await jettonReceiverContract.getPayloadChecker()
        expect(getPayload).toEqualSlice(beginCell().asSlice())
    })
})



================================================
FILE: jettons/receive-jettons/receiver.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-jettons/receiver.tact
================================================
import "../impl/basic/messages.tact";

/// Struct that represents Tact Jetton Wallet state init. It's used to calculate the address of the Jetton Wallet
///
/// Different Jettons implementations may have different state init structures. For example, Governance Jetton Wallet (USDT)
/// has this:
/// ```tact
/// struct GovernanceJettonWalletStateInit {
///     status: Int as uint4 = 0,
///     balance: Int as coins = 0,
///     owner: Address,
///     master: Address,
/// }
/// ```
struct TactJettonWalletStateInit {
    balance: Int as coins = 0;
    owner: Address;
    minter: Address;
}

contract JettonReceiver(
    minterAddress: Address,
    jettonWalletCode: Cell,
    amountChecker: Int as coins,
    payloadChecker: Slice,
) {
    inline fun getTactJettonWalletStateInit(owner: Address): Cell {
        return TactJettonWalletStateInit {
            owner,
            minter: self.minterAddress,
        }.toCell();
    }

    inline fun calculateJettonWalletAddress(owner: Address): Address {
        let initData = self.getTactJettonWalletStateInit(owner);
        return contractAddress(StateInit { code: self.jettonWalletCode, data: initData });
    }

    receive(msg: JettonNotification) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        // Check if the sender is our jetton wallet, if not, reject the message
        require(sender() == thisContractJettonWallet, "Incorrect sender");

        // Handle incoming jetton transfer as needed by your contract logic
        // You can add your own logic here, such as updating balances or triggering events
        self.amountChecker += msg.amount;
        self.payloadChecker = msg.forwardPayload;
    }

    // deploy
    receive() {}

    // for testing
    get fun amountChecker(): Int {
        return self.amountChecker;
    }

    get fun payloadChecker(): Slice {
        return self.payloadChecker;
    }
}



================================================
FILE: jettons/receive-usdt/receiver.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-usdt/receiver.tact
================================================
import "../impl/governance/messages.tact";

/// Struct that represents Governance (USDT) Jetton Wallet state init. It's used to calculate the address of the Jetton Wallet
///
/// This struct is different from the Tact standard Jetton Wallet state init, as it includes the `status` field, that is used for
/// Governance mechanism.
struct GovernanceJettonWalletStateInit {
    status: Int as uint4 = 0;
    balance: Int as coins = 0;
    owner: Address;
    minter: Address;
}

/// The only difference between receiving the Tact Jetton (basic) and the Governance Jetton (USDT) is the `status` field in Governance State Init,
/// that changes how we calculate the address of the Governance Jetton Wallet.
///
/// The rest of the code is the same as the Tact Jetton Receiver.
contract JettonReceiverGovernance(
    minterAddress: Address,
    jettonWalletCode: Cell,
    amountChecker: Int as coins,
    payloadChecker: Slice,
) {
    inline fun getGovernanceJettonWalletStateInit(owner: Address): Cell {
        return GovernanceJettonWalletStateInit {
            owner,
            minter: self.minterAddress,
        }.toCell();
    }

    inline fun calculateJettonWalletAddress(owner: Address): Address {
        let initData = self.getGovernanceJettonWalletStateInit(owner);
        return contractAddress(StateInit { code: self.jettonWalletCode, data: initData });
    }

    receive(msg: JettonNotification) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        // Check if the sender is our jetton wallet, if not, reject the message
        require(sender() == thisContractJettonWallet, "Incorrect sender");

        // Handle incoming jetton transfer as needed by your contract logic
        // You can add your own logic here, such as updating balances or triggering events
        self.amountChecker += msg.amount;
        self.payloadChecker = msg.forwardPayload;
    }

    // deploy
    receive() {}

    // for testing
    get fun amountChecker(): Int {
        return self.amountChecker;
    }

    get fun payloadChecker(): Slice {
        return self.payloadChecker;
    }
}



================================================
FILE: jettons/receive-usdt/usdt-receiver.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/receive-usdt/usdt-receiver.spec.ts
================================================
import "@ton/test-utils"
import {Address, beginCell, Cell, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {
    JettonNotification,
    JettonReceiver,
    storeJettonNotification,
} from "../output/JettonReceiver_JettonReceiver"
import {Metadata} from "../mint-usdt/metadata"
import {buildJettonMinterFromMetadata} from "../mint-usdt/mint-usdt"
import {
    GovernanceJettonMinter,
    JettonTransfer,
    Mint,
} from "../output/Governance Jetton_GovernanceJettonMinter"
import {JettonWalletGovernance} from "../output/Governance Jetton_JettonWalletGovernance"
import {JettonReceiverGovernance} from "../output/JettonReceiverGovernance_JettonReceiverGovernance"

// helper function to deploy the USDT jetton minter
const deployUsdtJettonMinter = async (deployer: SandboxContract<TreasuryContract>) => {
    const metadata: Metadata = {
        description: "Tether USD",
        image: "https://example.com/usdt.png",
        name: "Tether USD",
        symbol: "USDT",
    }

    // to work with identical func usdt minter and wallet, we need to use the same code
    // as the one used in the mainnet, hence we are using precompiled code from hex
    const usdtMinterData = await buildJettonMinterFromMetadata(deployer.address, metadata)

    const minterDeployResult = await deployer.send({
        to: usdtMinterData.address,
        value: toNano("0.1"),
        body: beginCell().endCell(), // empty body
        init: usdtMinterData.init, // init with code and data
    })

    return {
        minterAddress: usdtMinterData.address,
        minterDeployResult,
        walletCode: usdtMinterData.walletCode,
    }
}

describe("USDT Jetton Receiver Tests", () => {
    let blockchain: Blockchain

    let jettonMinter: SandboxContract<GovernanceJettonMinter>
    let usdtJettonReceiverContract: SandboxContract<JettonReceiverGovernance>

    let deployer: SandboxContract<TreasuryContract>

    let jettonWalletCode: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWalletGovernance>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        // deploy usdt jetton minter
        const {minterAddress, minterDeployResult, walletCode} =
            await deployUsdtJettonMinter(deployer)
        expect(minterDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: minterAddress,
            deploy: true,
        })
        jettonMinter = blockchain.openContract(GovernanceJettonMinter.fromAddress(minterAddress))

        // quick setup to get jetton wallet code and reuse later
        jettonWalletCode = walletCode

        // deploy jetton receiver contract
        usdtJettonReceiverContract = blockchain.openContract(
            await JettonReceiverGovernance.fromInit(
                jettonMinter.address,
                jettonWalletCode,
                0n,
                beginCell().asSlice(),
            ),
        )

        const testerDeployResult = await usdtJettonReceiverContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(testerDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: usdtJettonReceiverContract.address,
            deploy: true,
            success: true,
        })

        // mint usdt to deployer address as part of the setup
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            toAddress: deployer.address,
            tonAmount: toNano("1"),
            masterMsg: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const usdtMintResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("3")},
            mintMsg,
        )
        expect(usdtMintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // mint message
            op: GovernanceJettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWalletGovernance.fromAddress(await jettonMinter.getGetWalletAddress(address)),
            )
        }
    })

    // in this test we check that the receiver contract accepts
    // the correct transfer notification message and accepts usdt
    it("usdt receiver should accept correct transfer notification", async () => {
        const deployerJettonWallet = await userWallet(deployer.address)
        const receiverJettonWallet = await userWallet(usdtJettonReceiverContract.address)

        const jettonTransferAmount = toNano(1)
        const jettonTransferForwardPayload = beginCell().storeUint(239, 32).endCell()

        const usdtTransferMsg: JettonTransfer = {
            $$type: "JettonTransfer",
            queryId: 0n,
            amount: jettonTransferAmount,
            responseDestination: deployer.address,
            forwardTonAmount: toNano(1),
            forwardPayload: jettonTransferForwardPayload.asSlice(),
            destination: usdtJettonReceiverContract.address,
            customPayload: null,
        }

        // -(external)-> deployer -(transfer)-> deployer jetton wallet --
        // -(internal transfer)-> usdt receiver jetton wallet -(transfer notification)-> receiver.tact
        const transferResult = await deployerJettonWallet.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            usdtTransferMsg,
        )

        // check that jetton transfer was successful
        // and notification message was sent to receiver contract
        expect(transferResult.transactions).toHaveTransaction({
            from: deployerJettonWallet.address,
            to: receiverJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 2, // notification + excesses
            op: JettonWalletGovernance.opcodes.JettonTransferInternal,
            deploy: true,
        })

        // notification message to receiver.tact contract, handled by our receiver contract logic
        expect(transferResult.transactions).toHaveTransaction({
            from: receiverJettonWallet.address,
            to: usdtJettonReceiverContract.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 0, // we don't send anything
            op: JettonWalletGovernance.opcodes.JettonNotification,
        })

        // getters to ensure we successfully received notification and executed overridden fetch method
        const getAmount = await usdtJettonReceiverContract.getAmountChecker()
        expect(getAmount).toEqual(jettonTransferAmount)

        const getPayload = await usdtJettonReceiverContract.getPayloadChecker()
        expect(getPayload).toEqualSlice(jettonTransferForwardPayload.asSlice())
    })

    it("jetton receiver should reject malicious transfer notification", async () => {
        // try to send malicious notification message
        const msg: JettonNotification = {
            $$type: "JettonNotification",
            queryId: 0n,
            amount: toNano(1),
            forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            sender: deployer.address,
        }

        const msgCell = beginCell().store(storeJettonNotification(msg)).endCell()

        // no actual jetton transfer, just send notification message
        const maliciousSendResult = await deployer.send({
            to: usdtJettonReceiverContract.address,
            value: toNano(1),
            body: msgCell,
        })

        expect(maliciousSendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: usdtJettonReceiverContract.address,
            // should be rejected
            success: false,
            exitCode: JettonReceiver.errors["Incorrect sender"],
        })

        const getAmount = await usdtJettonReceiverContract.getAmountChecker()
        expect(getAmount).toEqual(0n)

        const getPayload = await usdtJettonReceiverContract.getPayloadChecker()
        expect(getPayload).toEqualSlice(beginCell().asSlice())
    })
})



================================================
FILE: jettons/send-jettons/sender.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/send-jettons/sender.spec.ts
================================================
import "@ton/test-utils"
import {Address, beginCell, Cell, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {JettonMinter, JettonUpdateContent, Mint} from "../output/Basic Jetton_JettonMinter"
import {JettonWallet} from "../output/Basic Jetton_JettonWallet"
import {JettonSender} from "../output/JettonSender_JettonSender"

describe("Jetton Sender Tests", () => {
    let blockchain: Blockchain

    let jettonMinter: SandboxContract<JettonMinter>
    let jettonSenderContract: SandboxContract<JettonSender>

    let deployer: SandboxContract<TreasuryContract>

    let defaultContent: Cell
    let jettonWalletCode: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        defaultContent = beginCell().endCell()
        const msg: JettonUpdateContent = {
            $$type: "JettonUpdateContent",
            queryId: 0n,
            content: new Cell(),
        }

        // deploy jetton minter
        jettonMinter = blockchain.openContract(
            await JettonMinter.fromInit(0n, deployer.address, defaultContent, true),
        )
        const deployResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            msg,
        )

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        })

        // quick setup to get jetton wallet code and reuse later
        const jettonWallet = blockchain.openContract(
            await JettonWallet.fromInit(0n, deployer.address, jettonMinter.address),
        )
        jettonWalletCode = jettonWallet.init!.code

        // deploy jetton receiver contract
        jettonSenderContract = blockchain.openContract(
            await JettonSender.fromInit(jettonMinter.address, jettonWalletCode),
        )

        const testerDeployResult = await jettonSenderContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(testerDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonSenderContract.address,
            deploy: true,
            success: true,
        })

        // mint jettons to sender contract address as part of the setup
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            receiver: jettonSenderContract.address,
            tonAmount: 0n,
            mintMessage: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const mintResult = await jettonMinter.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            mintMsg,
        )
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // mint message
            op: JettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWallet.fromAddress(await jettonMinter.getGetWalletAddress(address)),
            )
        }
    })

    // basic send, without any extra params
    it("jetton sender should correctly send jettons in basic mode", async () => {
        const senderContractJettonWallet = await userWallet(jettonSenderContract.address)

        const jettonTransferAmount = toNano(1)
        const receiverAddress = Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")

        // -(external)-> deployer -(send jettons fast)-> sender.tact --
        // -(transfer)-> sender jetton wallet -(internal transfer)-> receiver jetton wallet
        const jettonSendResult = await jettonSenderContract.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            {
                $$type: "SendJettonsFast",
                amount: jettonTransferAmount,
                destination: receiverAddress,
            },
        )

        // message from our sender.tact to its jetton wallet
        // we need to only check that this one was send, the rest is handled by the jettons contracts
        expect(jettonSendResult.transactions).toHaveTransaction({
            from: jettonSenderContract.address,
            to: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // internal transfer
            op: JettonWallet.opcodes.JettonTransfer,
        })

        const receiverJettonWallet = await userWallet(receiverAddress)

        const jettonReceiverDataAfter = await receiverJettonWallet.getGetWalletData()

        expect(jettonReceiverDataAfter.balance).toEqual(jettonTransferAmount)
    })

    // extended send, check all the params
    it("jetton sender should correctly send jettons in extended mode", async () => {
        const senderContractJettonWallet = await userWallet(jettonSenderContract.address)

        const jettonTransferAmount = toNano(1)

        // this can be any payload that we want receiver to get with transfer notification
        const jettonTransferPayload = beginCell().storeUint(239, 32).storeUint(0, 32).asSlice()

        // ton amount that will be sent to the receiver with transfer notification
        const forwardTonAmount = toNano(1)

        // payload that could be used by the jetton wallets, usually just null
        const customPayload = beginCell().storeBit(true).endCell()

        const receiverAddress = Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")

        // -(external)-> deployer -(send jettons fast)-> sender.tact --
        // -(transfer)-> sender jetton wallet -(internal transfer)-> receiver jetton wallet
        const jettonExtendedSendResult = await jettonSenderContract.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            {
                $$type: "SendJettonsExtended",
                amount: jettonTransferAmount,
                destination: receiverAddress,
                forwardPayload: jettonTransferPayload,
                forwardTonAmount: forwardTonAmount,
                customPayload: customPayload,
            },
        )

        expect(jettonExtendedSendResult.transactions).toHaveTransaction({
            from: jettonSenderContract.address,
            to: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // internal transfer
            op: JettonWallet.opcodes.JettonTransfer,
        })

        // check that we correctly send notification message and excesses
        expect(jettonExtendedSendResult.transactions).toHaveTransaction({
            from: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 2, // notification + excesses
            op: JettonSender.opcodes.JettonTransferInternal,
        })

        const receiverJettonWallet = await userWallet(receiverAddress)

        const jettonReceiverDataAfter = await receiverJettonWallet.getGetWalletData()

        expect(jettonReceiverDataAfter.balance).toEqual(jettonTransferAmount)
    })
})



================================================
FILE: jettons/send-jettons/sender.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/send-jettons/sender.tact
================================================
import "../impl/basic/messages.tact";

/// Struct that represents Tact Jetton Wallet state init. It's used to calculate the address of the Jetton Wallet
///
/// Different Jettons implementations may have different state init structures. For example, Governance Jetton Wallet (USDT)
/// has this:
/// ```tact
/// struct GovernanceJettonWalletStateInit {
///     status: Int as uint4 = 0,
///     balance: Int as coins = 0,
///     owner: Address,
///     master: Address,
/// }
/// ```
struct TactJettonWalletStateInit {
    balance: Int as coins = 0;
    owner: Address;
    minter: Address;
}

/// Message that represents a request to send jettons. Contains the amount of jettons to send and the destination address.
message(0x6984f9bb) SendJettonsFast {
    amount: Int as coins;
    destination: Address;
}

/// Message that represents a request to send jettons with additional parameters.
message(0xe815f1d0) SendJettonsExtended {
    amount: Int as coins;
    destination: Address;
    customPayload: Cell;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

contract JettonSender(
    minterAddress: Address,
    jettonWalletCode: Cell,
) {
    inline fun getTactJettonWalletStateInit(owner: Address): Cell {
        return TactJettonWalletStateInit {
            owner,
            minter: self.minterAddress,
        }.toCell();
    }

    inline fun calculateJettonWalletAddress(owner: Address): Address {
        let initData = self.getTactJettonWalletStateInit(owner);
        return contractAddress(StateInit { code: self.jettonWalletCode, data: initData });
    }

    /// To send jettons, we need to send a message to our Jetton Wallet contract.
    fun sendJettons(receiver: Address, amount: Int) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        message(MessageParameters {
            to: thisContractJettonWallet,
            value: 0,
            body: JettonTransfer {
                queryId: 0,
                amount,
                destination: receiver,
                responseDestination: myAddress(),
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: beginCell().storeMaybeRef(null).asSlice(),
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    fun sendJettonsExtended(receiver: Address, amount: Int, forwardTonAmount: Int, forwardPayload: Slice, customPayload: Cell?) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        message(MessageParameters {
            to: thisContractJettonWallet,
            value: 0,
            body: JettonTransfer {
                queryId: 0,
                amount,
                destination: receiver,
                responseDestination: myAddress(),
                customPayload,
                forwardTonAmount,
                forwardPayload,
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    receive(msg: SendJettonsFast) {
        self.sendJettons(msg.destination, msg.amount);
    }

    receive(msg: SendJettonsExtended) {
        self.sendJettonsExtended(
            msg.destination,
            msg.amount,
            msg.forwardTonAmount,
            msg.forwardPayload,
            msg.customPayload,
        );
    }

    // deploy
    receive() {}
}



================================================
FILE: jettons/send-usdt/sender.spec.ts
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/send-usdt/sender.spec.ts
================================================
import "@ton/test-utils"
import {Address, beginCell, Cell, toNano} from "@ton/core"
import {SandboxContract, TreasuryContract, Blockchain} from "@ton/sandbox"
import {JettonSenderGovernance} from "../output/JettonSenderGovernance_JettonSenderGovernance"
import {JettonWalletGovernance} from "../output/Governance Jetton_JettonWalletGovernance"
import {GovernanceJettonMinter, Mint} from "../output/Governance Jetton_GovernanceJettonMinter"
import {Metadata} from "../mint-usdt/metadata"
import {buildJettonMinterFromMetadata} from "../mint-usdt/mint-usdt"

// helper function to deploy the USDT jetton minter
const deployUsdtJettonMinter = async (deployer: SandboxContract<TreasuryContract>) => {
    const metadata: Metadata = {
        description: "Tether USD",
        image: "https://example.com/usdt.png",
        name: "Tether USD",
        symbol: "USDT",
    }

    // to work with identical func usdt minter and wallet, we need to use the same code
    // as the one used in the mainnet, hence we are using precompiled code from hex
    const usdtMinterData = await buildJettonMinterFromMetadata(deployer.address, metadata)

    const minterDeployResult = await deployer.send({
        to: usdtMinterData.address,
        value: toNano("0.1"),
        body: beginCell().endCell(), // empty body
        init: usdtMinterData.init, // init with code and data
    })

    return {
        minterAddress: usdtMinterData.address,
        minterDeployResult,
        walletCode: usdtMinterData.walletCode,
    }
}

describe("USDT Sender Tests", () => {
    let blockchain: Blockchain

    let usdtJettonMinter: SandboxContract<GovernanceJettonMinter>
    let usdtSenderContract: SandboxContract<JettonSenderGovernance>

    let deployer: SandboxContract<TreasuryContract>

    let jettonWalletCode: Cell
    let userWallet: (address: Address) => Promise<SandboxContract<JettonWalletGovernance>>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        deployer = await blockchain.treasury("deployer")

        // deploy usdt jetton minter
        const {minterAddress, minterDeployResult, walletCode} =
            await deployUsdtJettonMinter(deployer)
        expect(minterDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: minterAddress,
            deploy: true,
        })
        usdtJettonMinter = blockchain.openContract(
            GovernanceJettonMinter.fromAddress(minterAddress),
        )

        // quick setup to get jetton wallet code and reuse later
        jettonWalletCode = walletCode

        // deploy jetton receiver contract
        usdtSenderContract = blockchain.openContract(
            await JettonSenderGovernance.fromInit(usdtJettonMinter.address, jettonWalletCode),
        )

        const testerDeployResult = await usdtSenderContract.send(
            deployer.getSender(),
            {value: toNano("0.1")},
            null,
        )

        expect(testerDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: usdtSenderContract.address,
            deploy: true,
            success: true,
        })

        // mint usdt to deployer address as part of the setup
        const mintMsg: Mint = {
            $$type: "Mint",
            queryId: 0n,
            toAddress: usdtSenderContract.address,
            tonAmount: toNano("1"),
            masterMsg: {
                $$type: "JettonTransferInternal",
                queryId: 0n,
                amount: toNano(1),
                sender: deployer.address,
                forwardTonAmount: 0n,
                responseDestination: deployer.address,
                forwardPayload: beginCell().storeUint(239, 32).asSlice(),
            },
        }

        const usdtMintResult = await usdtJettonMinter.send(
            deployer.getSender(),
            {value: toNano("3")},
            mintMsg,
        )
        expect(usdtMintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: usdtJettonMinter.address,
            success: true,
            endStatus: "active",
            outMessagesCount: 1, // mint message
            op: GovernanceJettonMinter.opcodes.Mint,
        })

        userWallet = async (address: Address) => {
            return blockchain.openContract(
                JettonWalletGovernance.fromAddress(
                    await usdtJettonMinter.getGetWalletAddress(address),
                ),
            )
        }
    })

    // basic send, without any extra params
    it("jetton sender should correctly send usdt in basic mode", async () => {
        const senderContractJettonWallet = await userWallet(usdtSenderContract.address)

        const jettonTransferAmount = toNano(1)
        const receiverAddress = Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")

        // -(external)-> deployer -(send jettons fast)-> sender.tact --
        // -(transfer)-> sender usdt jetton wallet -(internal transfer)-> receiver usdt jetton wallet
        const jettonSendResult = await usdtSenderContract.send(
            deployer.getSender(),
            {
                value: toNano(2),
            },
            {
                $$type: "SendJettonsFast",
                amount: jettonTransferAmount,
                destination: receiverAddress,
            },
        )

        // message from our sender.tact to its jetton wallet
        // we need to only check that this one was send, the rest is handled by the jettons contracts
        expect(jettonSendResult.transactions).toHaveTransaction({
            from: usdtSenderContract.address,
            to: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // internal transfer
            op: JettonWalletGovernance.opcodes.JettonTransfer,
        })

        const receiverJettonWallet = await userWallet(receiverAddress)

        const jettonReceiverDataAfter = await receiverJettonWallet.getGetWalletData()

        expect(jettonReceiverDataAfter.balance).toEqual(jettonTransferAmount)
    })

    // extended send, check all the params
    it("jetton sender should correctly send usdt in extended mode", async () => {
        const senderContractJettonWallet = await userWallet(usdtSenderContract.address)

        const jettonTransferAmount = toNano(1)

        // this can be any payload that we want receiver to get with transfer notification
        const jettonTransferPayload = beginCell().storeUint(239, 32).storeUint(0, 32).asSlice()

        // ton amount that will be sent to the receiver with transfer notification
        const forwardTonAmount = toNano(1)

        // payload that could be used by the jetton wallets, usually just null
        const customPayload = beginCell().storeBit(true).endCell()

        const receiverAddress = Address.parse("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ")

        // -(external)-> deployer -(send jettons fast)-> sender.tact --
        // -(transfer)-> sender usdt jetton wallet -(internal transfer)-> receiver usdt jetton wallet
        const jettonExtendedSendResult = await usdtSenderContract.send(
            deployer.getSender(),
            {
                value: toNano(3),
            },
            {
                $$type: "SendJettonsExtended",
                amount: jettonTransferAmount,
                destination: receiverAddress,
                forwardPayload: jettonTransferPayload,
                forwardTonAmount: forwardTonAmount,
                customPayload: customPayload,
            },
        )

        expect(jettonExtendedSendResult.transactions).toHaveTransaction({
            from: usdtSenderContract.address,
            to: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 1, // internal transfer
            op: JettonWalletGovernance.opcodes.JettonTransfer,
        })

        // check that we correctly send notification message and excesses
        expect(jettonExtendedSendResult.transactions).toHaveTransaction({
            from: senderContractJettonWallet.address,
            success: true,
            exitCode: 0,
            outMessagesCount: 2, // notification + excesses
            op: JettonSenderGovernance.opcodes.JettonTransferInternal,
        })

        const receiverJettonWallet = await userWallet(receiverAddress)

        const jettonReceiverDataAfter = await receiverJettonWallet.getGetWalletData()

        expect(jettonReceiverDataAfter.balance).toEqual(jettonTransferAmount)
    })
})



================================================
FILE: jettons/send-usdt/sender.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/send-usdt/sender.tact
================================================
import "../impl/governance/messages.tact";

/// Struct that represents Governance (USDT) Jetton Wallet state init. It's used to calculate the address of the Jetton Wallet
///
/// This struct is different from the Tact standard Jetton Wallet state init, as it includes the `status` field, that is used for
/// Governance mechanism.`
struct GovernanceJettonWalletStateInit {
    status: Int as uint4 = 0;
    balance: Int as coins = 0;
    owner: Address;
    minter: Address;
}

/// Message that represents a request to send jettons. Contains the amount of jettons to send and the destination address.
message(0x6984f9bb) SendJettonsFast {
    amount: Int as coins;
    destination: Address;
}

/// Message that represents a request to send jettons with additional parameters.
message(0xe815f1d0) SendJettonsExtended {
    amount: Int as coins;
    destination: Address;
    customPayload: Cell;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

/// The only difference between receiving the Tact Jetton (basic) and the Governance Jetton (USDT) is the `status` field in Governance State Init,
/// that changes how we calculate the address of the Governance Jetton Wallet.
///
/// The rest of the code is the same as the Tact Jetton Receiver.
contract JettonSenderGovernance(
    minterAddress: Address,
    jettonWalletCode: Cell,
) {
    inline fun getTactJettonWalletStateInit(owner: Address): Cell {
        return GovernanceJettonWalletStateInit {
            owner,
            minter: self.minterAddress,
        }.toCell();
    }

    inline fun calculateJettonWalletAddress(owner: Address): Address {
        let initData = self.getTactJettonWalletStateInit(owner);
        return contractAddress(StateInit { code: self.jettonWalletCode, data: initData });
    }

    /// To send jettons, we need to send a message to our Jetton Wallet contract.
    fun sendJettons(receiver: Address, amount: Int) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        message(MessageParameters {
            to: thisContractJettonWallet,
            value: 0,
            body: JettonTransfer {
                queryId: 0,
                amount,
                destination: receiver,
                responseDestination: myAddress(),
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: beginCell().storeMaybeRef(null).asSlice(),
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    fun sendJettonsExtended(receiver: Address, amount: Int, forwardTonAmount: Int, forwardPayload: Slice, customPayload: Cell?) {
        let thisContractJettonWallet = self.calculateJettonWalletAddress(
            myAddress(),
        );

        message(MessageParameters {
            to: thisContractJettonWallet,
            value: 0,
            body: JettonTransfer {
                queryId: 0,
                amount,
                destination: receiver,
                responseDestination: myAddress(),
                customPayload,
                forwardTonAmount,
                forwardPayload,
            }.toCell(),
            mode: SendRemainingValue,
        });
    }

    receive(msg: SendJettonsFast) {
        self.sendJettons(msg.destination, msg.amount);
    }

    receive(msg: SendJettonsExtended) {
        self.sendJettonsExtended(
            msg.destination,
            msg.amount,
            msg.forwardTonAmount,
            msg.forwardPayload,
            msg.customPayload,
        );
    }

    // deploy
    receive() {}
}



================================================
FILE: jettons/use-jetton/README.md
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/use-jetton/README.md
================================================
# UseJetton Trait

## 1. Overview

The `UseJetton` trait is a Tact trait that enables contracts to receive jetton transfers without requiring custom implementation of the TEP-89 wallet discovery protocol. The trait provides a secure, standards-compliant solution for jetton integration.

## 2. Processing Flow

1. **First Transfer** – The trait deploys a `TEP89DiscoveryProxy` contract that requests the wallet address from the Jetton Master using the TEP-89 standard
2. **Discovery Response** – The trait stores the resolved wallet address and forwards the original `JettonNotification` to the contract-specific handler
3. **Subsequent Transfers** – The trait verifies that the `sender()` matches the stored wallet address:
    - If verification succeeds, `receiveJettonHandler` is invoked
    - If verification fails, the transfer is automatically refunded

## 3. Integration Steps

1. Copy `use-jetton.tact` and `tep-89-discovery-proxy.tact` to your project
2. Add `with UseJetton` to your contract declaration
3. Implement the required `receiveJettonHandler(msg: JettonNotification)` method
4. Deploy your contract with `jettonWallet = null` – the trait will populate this field automatically after the first successful transfer

## 4. Security Features

- **Automatic wallet discovery** using TEP-89 standard instead of error-prone address calculation
- **Transfer validation** to prevent spoofed jetton notifications
- **Automatic refunds** for transfers from unauthorized wallets
- **State preservation** of original transfer payloads during discovery process

## 5. Example Implementation

A complete example contract demonstrating the trait usage is available in [`jettons/receive-jettons-v2`](../receive-jettons-v2).



================================================
FILE: jettons/use-jetton/tep-89-discovery-proxy.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/use-jetton/tep-89-discovery-proxy.tact
================================================
// VENDOR LOCK
// https://github.com/tact-lang/dex/blob/01d2e9fc19a74dbedbb839d835a597822c64da0e/sources/contracts/vaults/proofs/tep-89-discovery-proxy.tact

import "../impl/basic/messages";

/// TEP89DiscoveryResult Message
///
/// Response message sent by the discovery proxy back to the `discoveryRequester`
/// after completing the wallet discovery process, whether successful or failed.
///
/// Fields:
/// • `discoveryId` – unique identifier echoed from the proxy; the requester
///   recomputes the StateInit locally and verifies that the sender has the same
///   basechain address, ensuring the message originates from the expected proxy
/// • `expectedJettonWallet` – the wallet address initially provided by the
///   requester (from the original notification sender)
/// • `actualJettonWallet` – the verified wallet address returned by the jetton
///   master, or `null` if discovery failed
/// • `action` – the original `JettonNotification` preserved as a Cell for
///   re-processing after validation
message(0x7a1267fd) TEP89DiscoveryResult {
    discoveryId: Int as uint64;
    expectedJettonWallet: Address;
    actualJettonWallet: Address?;
    action: Cell;
}

/// TEP89DiscoveryProxy Contract
/// ----------------------------
/// A lightweight helper contract for jetton wallet address discovery using the
/// TEP-89 standard. The canonical `ProvideWalletAddress` request does not support
/// arbitrary forward payloads, but the `UseJetton` trait needs to preserve the
/// original `JettonNotification` during the discovery process.
///
/// This single-use proxy contract solves this limitation by storing the original
/// notification and managing the discovery workflow independently.
///
/// Lifecycle:
/// 1. `receive()` – forwards `ProvideWalletAddress` request to the jetton master
/// 2. `receive(TakeWalletAddress)` – successful discovery path, sends result and self-destructs
/// 3. `bounced(ProvideWalletAddress)` – failed discovery path, sends result with null address
///
/// Parameters:
/// • `jettonMaster` – address of the Jetton Master contract that manages wallets
/// • `discoveryRequester` – contract that deployed this proxy and awaits the result
/// • `expectedJettonWallet` – wallet address claimed by the original notification sender
/// • `action` – the original `JettonNotification` wrapped as a Cell for preservation
/// • `discoveryId` – unique salt (typically `curLt()`) ensuring unique contract addresses
///
/// The contract automatically self-destructs after delivering results, preventing
/// storage rent accumulation.
///
/// Reference: https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md
contract TEP89DiscoveryProxy(
    jettonMaster: Address,
    discoveryRequester: Address,
    expectedJettonWallet: Address,
    action: Cell, // Original JettonNotification stored as Cell for efficiency
    discoveryId: Int as uint64, // Unique discovery identifier
) {
    /// Initiates the discovery process immediately after deployment.
    ///
    /// Validates that the caller is the expected `discoveryRequester` and sends
    /// a `ProvideWalletAddress` message to the jetton master. The proxy forwards
    /// all remaining value while retaining only the minimum required for operation.
    receive() {
        require(sender() == self.discoveryRequester, "TEP89 proxy: Sender must be the discovery requester");

        // Request wallet address from jetton master
        message(MessageParameters {
            to: self.jettonMaster,
            bounce: true, // So we can save some tons (we won't pay storage fees for JettonMaster)
            value: 0,
            mode: SendRemainingValue,
            body: ProvideWalletAddress {
                queryId: 0,
                ownerAddress: self.discoveryRequester,
                includeAddress: false,
            }.toCell(),
        });
    }

    /// Handles successful wallet address discovery.
    ///
    /// Validates that the response originates from the jetton master, packages
    /// the discovery result, and sends it to the requester. The proxy then
    /// transfers its remaining balance and self-destructs to free resources.
    receive(msg: TakeWalletAddress) {
        require(sender() == self.jettonMaster, "TEP89 proxy: TakeWalletAddress must be sent by the jetton master");

        // Send successful discovery result to requester
        message(MessageParameters {
            to: self.discoveryRequester,
            bounce: false,
            value: 0,
            mode: SendRemainingBalance | SendDestroyIfZero,
            body: TEP89DiscoveryResult {
                discoveryId: self.discoveryId,
                expectedJettonWallet: self.expectedJettonWallet,
                actualJettonWallet: msg.walletAddress,
                action: self.action,
            }.toCell(),
        });
    }

    /// Handles failed wallet address discovery.
    ///
    /// This bounce handler is invoked when the jetton master cannot provide
    /// the requested wallet address. The proxy sends a discovery result with
    /// `actualJettonWallet` set to `null`, allowing the requester to distinguish
    /// between successful and failed discovery attempts. The proxy still
    /// self-destructs to prevent resource leaks.
    bounced(msg: bounced<ProvideWalletAddress>) {
        // Send failed discovery result to requester
        message(MessageParameters {
            to: self.discoveryRequester,
            bounce: false,
            value: 0,
            mode: SendRemainingBalance | SendDestroyIfZero,
            body: TEP89DiscoveryResult {
                discoveryId: self.discoveryId,
                expectedJettonWallet: self.expectedJettonWallet,
                actualJettonWallet: null,
                action: self.action,
            }.toCell(),
        });
    }
}



================================================
FILE: jettons/use-jetton/use-jetton.tact
URL: https://github.com/tact-lang/defi-cookbook/blob/main/jettons/use-jetton/use-jetton.tact
================================================
import "./tep-89-discovery-proxy";

/// UseJetton Trait
/// ---------------
/// The `UseJetton` trait encapsulates the implementation required for contracts
/// to correctly accept incoming jetton transfers and determine the corresponding
/// jetton wallet address during the first transfer.
///
/// The trait uses a lightweight helper contract (`TEP89DiscoveryProxy`) to perform
/// wallet address discovery via the standard TEP-89 protocol. This approach is
/// necessary because the original TEP-89 `ProvideWalletAddress` message does not
/// support arbitrary forward payloads that need to be preserved for the receiver.
///
/// After wallet address discovery, the trait stores the address in `jettonWallet`
/// and forwards all valid `JettonNotification` messages to the `receiveJettonHandler`
/// callback that the implementing contract must provide. The trait automatically
/// protects against malicious messages by refunding jettons from unauthorized
/// senders or wallets that do not match the discovered address.
trait UseJetton {
    jettonMaster: Address;
    jettonWallet: Address?; // Must be deployed with null value

    /// Entry point for JettonNotification messages
    ///
    /// FIRST TRANSFER:
    /// When `jettonWallet` is not initialized, the trait cannot verify the
    /// sender address. Instead of using unreliable address calculation methods,
    /// the trait deploys a `TEP89DiscoveryProxy` that queries the Jetton Master
    /// using the canonical TEP-89 protocol. The proxy preserves the original
    /// notification and returns it after address discovery.
    ///
    /// SUBSEQUENT TRANSFERS:
    /// For all subsequent calls, the trait verifies the `sender()` against the
    /// cached `jettonWallet` address and either:
    /// • Processes the notification if the sender is valid
    /// • Refunds the jettons and terminates execution if the sender is invalid
    receive(msg: JettonNotification) {
        if (self.jettonWallet == null) {
            let action = inMsg().asCell();
            // Deploy discovery proxy to validate jetton wallet address
            let prooferStateInit = initOf TEP89DiscoveryProxy(
                self.jettonMaster,
                myAddress(),
                sender(),
                action,
                curLt(),
            );

            deploy(DeployParameters {
                mode: SendRemainingValue,
                value: 0,
                // Internal protocol messages are not bounceable for consistency
                bounce: false,
                init: prooferStateInit,
            });
            stopExecution();
        }

        // Refund jettons if sender address does not match discovered wallet
        if (sender() != self.jettonWallet) {
            message(MessageParameters {
                mode: SendRemainingValue | SendIgnoreErrors,
                body: JettonTransfer {
                    queryId: msg.queryId,
                    amount: msg.amount,
                    destination: msg.sender,
                    responseDestination: msg.sender,
                    customPayload: null,
                    forwardTonAmount: 1,
                    forwardPayload: emptyForwardPayload(),
                }.toCell(),
                value: 0,
                to: sender(),
                bounce: true,
            });
            stopExecution();
        }

        msg.normalizeForwardPayload();
        self.receiveJettonHandler(msg);
    }

    receive(msg: TEP89DiscoveryResult) {
        let proxyStateInit = initOf TEP89DiscoveryProxy(
            self.jettonMaster,
            myAddress(),
            msg.expectedJettonWallet,
            msg.action,
            msg.discoveryId,
        );
        require(
            proxyStateInit.hasSameBasechainAddress(sender()),
            "UseJetton: Sender must be a valid TEP-89 proxy",
        );

        let jettonNotification = JettonNotification.fromCell(msg.action);
        jettonNotification.normalizeForwardPayload();

        if (msg.expectedJettonWallet == msg.actualJettonWallet) {
            self.jettonWallet = msg.actualJettonWallet;
            self.receiveJettonHandler(jettonNotification);
            return;
        } else {
            message(MessageParameters {
                mode: SendRemainingValue | SendIgnoreErrors,
                body: JettonTransfer {
                    queryId: jettonNotification.queryId,
                    amount: jettonNotification.amount,
                    destination: jettonNotification.sender,
                    responseDestination: jettonNotification.sender,
                    customPayload: null,
                    forwardTonAmount: 1,
                    forwardPayload: emptyForwardPayload(),
                }.toCell(),
                value: 0,
                to: msg.expectedJettonWallet,
                bounce: true,
            });
            return;
        }
    }

    get fun jettonWalletInited(): Bool {
        return self.jettonWallet != null;
    }

    get fun jettonWallet(): Address? {
        return self.jettonWallet;
    }

    get fun jettonMaster(): Address {
        return self.jettonMaster;
    }

    /// Jetton Transfer Handler
    ///
    /// This callback is the only method required for trait implementation. It is
    /// guaranteed to be invoked when all of the following conditions are met:
    /// • The jetton wallet address has been discovered and stored
    /// • The message sender matches the stored wallet address
    /// • The forward payload has been normalized for immediate consumption
    /// • All validation logic has completed successfully
    ///
    /// This method represents a "confirmed deposit" event. Implement your business
    /// logic here (balance updates, event emissions, etc.).
    abstract inline fun receiveJettonHandler(msg: JettonNotification);
}

/// Forward Payload Normalization
///
/// TEP-74 (Section 3.1 Jetton Transfer) specifies that `forward_payload` may be
/// delivered in two different wire formats:
/// 1. Inline format: First bit is `0`, remaining bits contain the payload
/// 2. Reference format: First bit is `1` followed by a reference containing the payload
///
/// The `JettonNotification` structure exposes `forwardPayload` in its raw format,
/// requiring application code to handle both variants manually. This would result
/// in repetitive validation code:
///
/// ```tact
/// if (notification.forwardPayload.loadBit()) {
///     let ref = notification.forwardPayload.loadRef();
///     notification.forwardPayload.endParse();
///     notification.forwardPayload = ref.asSlice();
/// }
/// ```
///
/// Additionally, Tact's type system does not support pattern matching on slice
/// content, preventing the use of enums for type-safe variant handling.
///
/// This helper function normalizes `forwardPayload` in-place, ensuring the slice
/// always points to the actual payload content regardless of the original encoding.
extends mutates fun normalizeForwardPayload(self: JettonNotification) {
    if (self.forwardPayload.loadBit()) {
        let ref = self.forwardPayload.loadRef();
        self.forwardPayload.endParse();
        self.forwardPayload = ref.asSlice();
    }
}

/// Low-level Utility Functions

/// Optimized execution termination without state persistence.
///
/// Unlike the high-level `return` statement, this function does not trigger
/// the implicit state save operation that Tact inserts at exit points. This
/// optimization is safe when the contract state remains unchanged. The function
/// creates an empty continuation and performs `CALLCC`, transferring control
/// to the default quit continuation and saving gas costs for unchanged state
/// serialization.
asm fun stopExecution() { <{ }> PUSHCONT CALLCC }

/// Creates an empty inline forward payload.
///
/// Produces a single-bit slice `b{0}` representing "inline payload, but empty".
/// According to TEP-74, this is the standard method for indicating no payload
/// when the receiver expects the inline variant (bit = 0).
///
/// This approach is more efficient than creating a separate cell, as the
/// ready-made slice avoids additional VM operations and saves approximately
/// 500 gas units per call.
asm fun emptyForwardPayload(): Slice {
    b{0} PUSHSLICE
}



================================================
FILE: spell/custom-dictionary.txt
URL: https://github.com/tact-lang/defi-cookbook/blob/main/spell/custom-dictionary.txt
================================================
basechain
bounceable
Ef8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAU
ipfs
Jettons
jwallet
kQBEpNQPST_mYPpfoENd2abvEDb5WJnEpXxjufNHQNN9xuQI
masterchain
mintable
misti
nowarp
qrcode
Resolve
seqno
tact
tock
tonapi
toncenter
TONCENTER
Toncoin
tonhub
tonscan
tonviewer
tonweb
TUSDT
UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ
workchain
yada




# Repository: website
URL: https://github.com/tact-lang/website
Branch: master

## Directory Structure:
```
└── website/
    ├── .eslint/
        ├── angular-functions/
            ├── rules/
            ├── utils/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── .husky/
    ├── README.md
    ├── docs/
        ├── assets/
            ├── favicon/
            ├── fonts/
                ├── Inter/
                ├── JetBrainsMono/
            ├── images/
                ├── icons/
            ├── pdfs/
                ├── 2025-01-ton-studio-tact-compiler-securityreview.pdf
    ├── pdfs/
        ├── 2025-01-ton-studio-tact-compiler-securityreview.pdf
    ├── src/
        ├── app/
            ├── core/
                ├── components/
                    ├── footer/
                    ├── header/
                ├── constants/
                ├── models/
                    ├── ace/
                    ├── tact/
            ├── features/
                ├── main/
                    ├── components/
                        ├── main-page-title/
                        ├── what-is-tact/
                    ├── models/
                    ├── services/
            ├── shared/
                ├── components/
                    ├── code-snippet/
                    ├── editor/
                ├── constants/
                ├── directives/
                ├── models/
        ├── assets/
            ├── favicon/
            ├── fonts/
                ├── Inter/
                ├── JetBrainsMono/
            ├── images/
                ├── icons/
        ├── environments/
        ├── scripts/
        ├── styles/
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/tact-lang/website/blob/master/README.md
================================================
# Tact Website

Developed by [TON Studio](https://tonstudio.io), powered by the community.

[![Website](https://img.shields.io/badge/Website-blue?style=flat)](https://tact-lang.org)
[![Documentation](https://img.shields.io/badge/Documentation-blue?style=flat)](https://docs.tact-lang.org)
[![Audited by Trail of Bits](https://img.shields.io/badge/Audited%20by-Trail%20of%20Bits-blue?style=flat-square)](https://github.com/trailofbits/publications/blob/master/reviews/2025-01-ton-studio-tact-compiler-securityreview.pdf)
[![Twitter](https://img.shields.io/badge/X%2FTwitter-white?logo=x&style=flat&logoColor=gray)](https://x.com/tact_language)
[![Telegram](https://img.shields.io/badge/Community_Chat-white?logo=telegram&style=flat)](https://t.me/tactlang)
[![Telegram](https://img.shields.io/badge/Tact_Kitchen_🥣-white?logo=telegram&style=flat)](https://t.me/tact_kitchen)

## Local setup

> [!IMPORTANT]
> Make sure you have Node.js version 16 or higher installed. To verify, run `node --version` — it should display at least 16.13.0 but not exceed version 22.
> Otherwise, download and install Node.js 22 from here: https://nodejs.org/en/download.

1. Install dependencies without altering the lockfile: `npm ci`
2. Start a local development server: `npm run start`

This will open a new browser window displaying the local version of the website. Most updates are automatically reflected.

## Project structure

Here is a top-level overview of the directory structure:

```
├── docs/             ← folder with compilation artifacts
├── pdfs/             ← docs: audits, whitepapers, etc.
├── src
│   ├── app           ← main code of the website
│   ├── assets        ← images, fonts, favicons, misc.
│   ├── environments
│   ├── favicon.ico
│   ├── global.d.ts
│   ├── index.html    ← landing page template
│   ├── main.ts
│   ├── polyfills.ts
│   ├── scripts
│   ├── styles        ← global Sass styles
│   └── styles.scss   ← main Sass style file
├── .gitignore
├── CNAME             ← Contains a URL for GitHub Pages deployments
├── package.json
├── tsconfig.json
└── angular.json      ← Angular configuration
```

If we switch to the `app/` directory, it has the following contents:

```
├── app.component.html
├── app.component.scss
├── app.component.ts
├── app.module.ts          ← root module (rarely modified)
├── app-routing.module.ts
├── core/
│   ├── components         ← footer and header components
│   ├── constants          ← link constants (docs, social media, etc.)
│   ├── core.module.ts     ← module declaring footer, header, and misc.
│   └── models
├── features/              ← IMPORTANT: modules that constitute the landing page
└── shared/                ← modules shared (rarely modified)
```

## Commands

All commands are run from the root of the project, from the terminal:

Command               | Action
:-------------------- | :-----
`npm ci`              | Install dependencies without changing the `package-lock.json`.
`npm run start`       | Starts local dev server at `localhost:4200`.
`npm run build`       | Build a production site to `./docs/`. This step is mandatory for correct [deployments](#deployment).
`npm run ng -- ...`   | Access and run Angular's CLI commands directly.

## Deployment

Deployments are done to GitHub Pages via GitHub Actions. The pipeline triggers when anything is merged into the `master` branch.

Currently, CI does NOT build the website for you. Instead, it only uses the built contents of the `docs/` folder as is. Therefore, after editing any code, you need to:

1. Stop the local server if it is currently running: `Ctrl+C` in the respective terminal
2. Make the build: `npm run build`
3. Commit the build together with all your changes
4. Open a PR with your changes — they should include the new build in `docs/`!



================================================
FILE: docs/assets/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf
URL: https://github.com/tact-lang/website/blob/master/docs/assets/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]


================================================
FILE: pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf
URL: https://github.com/tact-lang/website/blob/master/pdfs/2025-01-ton-studio-tact-compiler-securityreview.pdf
================================================
[PDF processing error: TypeError: pdfParse is not a function]



# Repository: awesome-tact
URL: https://github.com/tact-lang/awesome-tact
Branch: main

## Directory Structure:
```
└── awesome-tact/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── .github/
        ├── workflows/
    ├── README.md
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/tact-lang/awesome-tact/blob/main/README.md
================================================
<!-- lint disable awesome-github -->
<!-- lint disable double-link -->
# Awesome Tact [![Awesome badge](https://awesome.re/badge.svg)](https://awesome.re)

[<img src="logo.png" alt="" align="right" style="margin-left:2em" width="100" height="100">][tl]

> A curated list of resources for learning and using [Tact][tl] programming language.

Tact is an open-source statically typed smart contract programming language for TON Blockchain. It runs on the stack-oriented virtual machine (TVM) and is based on the actor model.

Developed by [TON Studio][tst], powered by the community.

[![Website](https://img.shields.io/badge/Website-blue?style=flat)][tl]
[![Documentation](https://img.shields.io/badge/Documentation-blue?style=flat)][td]
[![Twitter](https://img.shields.io/badge/X%2FTwitter-white?logo=x&style=flat&logoColor=gray)][tlx]
[![Telegram](https://img.shields.io/badge/Community_Chat-white?logo=telegram&style=flat)][tlchat]
[![Telegram](https://img.shields.io/badge/Tact_Kitchen_🥣-white?logo=telegram&style=flat)][tk]
<!-- See: https://shields.io/badges/static-badge -->

## Contents

<!-- lint ignore awesome-toc -->
- [Community](#community-)
- [Tact in Production](#tact-in-production-)
- [Plugins and extensions for editors and IDEs](#plugins-and-extensions-for-editors-and-ides-)
- [Tools and utilities](#tools-and-utilities-)
- [Documentation](#documentation-)
- [Articles](#articles-)
- [Videos](#videos-)
- [Smart contracts](#smart-contracts-)

## Community [↑](#contents)

- [`@tactlang` on Telegram][tlchat] - Main community chat.
- [`@tactlang_ru` on Telegram][tlchat_ru] *(Russian)*
- [`@tact_kitchen` on Telegram][tk] - Channel with updates from the team.
- [`@tact_language` on X/Twitter][tlx]
- [`tact-lang` organization on GitHub](https://github.com/tact-lang)
- [`@ton_studio` on Telegram](https://t.me/ton_studio)
- [`@thetonstudio` on X/Twitter](https://x.com/thetonstudio)

## Tact in Production [↑](#contents)

Software and applications based on contracts written in Tact, deployed in production, and consumed by end users.

###### Open Source or Source Available

- [Proof of Capital](https://github.com/proof-of-capital/TON) - [Proof of Capital](https://proofofcapital.org/) is a market-making smart contract that protects interests of all holders.
  - See the [security audit report](https://raw.githubusercontent.com/nowarp/public-reports/master/2025-01-proof-of-capital.pdf) by [Nowarp](https://nowarp.io).

###### Closed Source

- [Tradoor](https://tradoor.io) - Fast and social DEX on TON.
  - See the [security audit report](https://www.tonbit.xyz/reports/Tradoor-Smart-Contract-Audit-Report-Summary.pdf) by TonBit.
- [PixelSwap](https://www.pixelswap.io) - First modular and upgradeable DEX on TON.
  - See the [security audit report](https://github.com/trailofbits/publications/blob/master/reviews/2024-12-pixelswap-dex-securityreview.pdf) by Trail of Bits.
- [GasPump](https://gaspump.tg) - TON memecoin launchpad and trading platform.

## Plugins and extensions for editors and IDEs [↑](#contents)

- [TON Web IDE](https://ide.ton.org) - Try Tact online in an ultimate browser-based IDE designed to simplify the journey of writing, testing, compiling, deploying, and interacting with smart contracts on TON.
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact) - Powerful and feature-rich extension for Visual Studio Code (VSCode) and VSCode-based editors like VSCodium, Cursor, Windsurf, and others.
  - Get it on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact).
  - Get it on the [Open VSX Registry](https://open-vsx.org/extension/tonstudio/vscode-tact).
  - Or install from the [`.vsix` files in nightly releases](https://github.com/tact-lang/tact-language-server/releases).
- [Language Server (LSP Server)](https://github.com/tact-lang/tact-language-server) - Supports Sublime Text, (Neo)Vim, Helix, and other editors with LSP support.
- [Intelli Tact](https://plugins.jetbrains.com/plugin/27290-tact) - Powerful and feature-rich plugin for JetBrain IDEs like WebStorm, IntelliJ IDEA, and others.
- [tact.vim](https://github.com/tact-lang/tact.vim) - Vim 8+ plugin.
- [tact-sublime](https://github.com/tact-lang/tact-sublime) - Sublime Text 4 package.
  - Get it on the [Package Control](https://packagecontrol.io/packages/Tact).

## Tools and utilities [↑](#contents)

### Grammars and highlighting

###### Maintained by [TON Studio][tst]

- [tree-sitter-tact](https://github.com/tact-lang/tree-sitter-tact) - Tree-sitter grammar and parser, used for syntax highlighting, code navigation, and more.
- [Prism.js grammar](https://github.com/tact-lang/prism-ton/blob/main/langs/prism-tact.js) - Provides syntax highlighting.
- [TextMate grammar](https://github.com/tact-lang/tact-sublime/blob/main/package/Tact.tmLanguage.json) - Provides syntax highlighting in Sublime Text, VSCode, Tact Documentation (through [Shiki](https://www.npmjs.com/package/shiki)), and on GitHub.

###### Other

- [highlight.js grammar](https://github.com/bakkenbaeck/highlightjs-tact) - (outdated) Provides syntax highlighting.

### Templates

- [tact-template](https://github.com/tact-lang/tact-template) - Ready-to-use template with the development environment set up, including the Tact compiler with TypeScript + Jest, a local TON emulator, AI-based editor support, and examples of how to run tests.

### Frameworks and libraries

###### Featured

- [Blueprint](https://github.com/ton-community/blueprint) - Development environment for TON Blockchain to write, test, and deploy smart contracts.
- [TON Jest](https://github.com/tact-lang/ton-jest) - Testing tools for TON with Jest.
- [Foton](https://foton.sh) - TypeScript toolkit for interacting with TON wallets and the blockchain.
- [Tonion](https://github.com/ton-ion/tonion-contracts) - Collection of reusable traits, functions, and TypeScript scripts.

###### Other

- [Tact Emulator](https://github.com/tact-lang/tact-emulator) - Emulation toolkit for TON Smart Contracts.
- [Tact Deployer](https://github.com/tact-lang/tact-deployer) - Library to prepare the deployment of a Tact package.
- [TON Contract DNS](https://github.com/tact-lang/ton-contract-dns) - Small library for resolving TON DNS names.

### Security

- [Misti](https://github.com/nowarp/misti) - Static smart contract analyzer.
- [TON Symbolic Analyzer (TSA)](https://github.com/espritoxyz/tsa) - Static smart contract analysis tool based on symbolic execution.

### Debugging

- [TxTracer](https://txtracer.ton.org) - Tool to emulate and trace any transaction from TON blockchain.

## Documentation [↑](#contents)

- [Official Documentation](https://docs.tact-lang.org/)
- [Learn with Tact by Example](https://tact-by-example.org/)

## Articles [↑](#contents)

- [Introduction to Blockchain](https://blog.ton.org/what-is-blockchain)
- [The Open Network](https://docs.ton.org/learn/introduction)

## Videos [↑](#contents)

- [Tact & Blueprint](https://www.youtube.com/@AlefmanVladimirEN-xb4pq/videos) - Made by [@alefman](https://t.me/alefman).

###### Chinese

- [TON 开发从入门到应用](https://openbuild.xyz/learn/challenges/2023609337/2939) - Made by Jason.
- [Tact & TON Basic 手把手學習](https://www.youtube.com/@ton101_zh) - Made by [@howard_peng](https://t.me/ton101_zh).

###### Russian

- [Tact & Blueprint](https://www.youtube.com/watch?v=isYBvzM-MfQ&list=PLOIvUFGfwP93tZI_WnaLyJsZlskU4ao92) - Made by [@alefman](https://t.me/alefman)
- [Tact development](https://www.youtube.com/watch?v=S6wlNsKUHpE&list=PLyDBPwv9EPsAJpR7R0cC4kgo7BjiMmUy7&index=1) - Made by [@nonam3e](https://t.me/nonam3e).

<!-- ## Podcasts [↑](#contents) -->

## Smart contracts [↑](#contents)

- [Jetton (Fungible Token)](https://github.com/tact-lang/jetton) - TEP-compatible, gas-efficient Jetton implementation, which includes a complete setup with a pre-configured Tact compiler, production-ready smart contracts, and a TypeScript + Jest testing environment.
- [DeFi Cookbook](https://github.com/tact-lang/defi-cookbook) - Collection of common smart contract recipes for various needs. Each recipe consists of one or more smart contracts, auxiliary scripts, and a small testing suite.
- [Tact Wallet Contract](https://github.com/tact-lang/contract-wallet) - This wallet contract supports gasless transactions, allows operations on behalf of the wallet by other contracts, and can execute a scalable number of operations in a single transaction.
- [Tact Payouts Contract](https://github.com/tact-lang/contract-payouts) - Perfect solution for on-chain payouts. This contract generates a list of text tickets for each address entitled to a payout. Tickets are signed transactions serialized as comments to be parsed by the smart contract.
- [TON VOTE Contracts](https://github.com/orbs-network/ton-vote-contracts/tree/main) - Smart contracts for [ton.vote](https://ton.vote/).
- [Simple DNS Contract](https://github.com/tact-lang/contract-dns-simple) - Contract that allows you to manage DNS records in a simple way. It also allows to burn fuses disallowing certain modifications of records.
- [NFT Standard Example](https://github.com/howardpen9/nft-template-in-tact) - Basic implementation of NFT standard that conforms to [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) and [TEP-66](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md) standards. Made by [@howard_peng9](https://dune.com/Howard_Peng).
- [TonDynasty](https://github.com/Ton-Dynasty/tondynasty-contracts) - Ton Dynasty Contracts is a library built by the Perman Lab Team for efficient smart contract development using Tact. It provides a number of templates, including contract traits, for Ton developers to utilize. Perman Lab will always stand by you. Ask for our help in [Perman Lab Community](https://t.me/permanlab).
- [Tact Fireworks](https://github.com/ton-community/tact-fireworks) - Educational contract for learning Tact and writing tests for special cases, such as exit codes.
- [Jetton & NFT Templates](https://github.com/Laisky/tact-utils) - Ready-to-use templates for Jetton, NFT, Traits, as well as some commonly used tools.

## Contribute

Contributions welcome! Read the [contribution guidelines](CONTRIBUTING.md) first.

## Related

- [awesome-ton](https://github.com/ton-community/awesome-ton) - Awesome list for TON Blockchain.
- [awesome-ton-security](https://github.com/Polaristow/awesome-ton-security) - A curated list of awesome TON security resources.

[tl]: https://tact-lang.org
[td]: https://docs.tact-lang.org
[tlchat]: https://t.me/tactlang
[tlchat_ru]: https://t.me/tactlang_ru
[tk]: https://t.me/tact_kitchen
[tlx]: https://x.com/tact_language
[tst]: https://tonstudio.io




# Repository: tact-by-example
URL: https://github.com/tact-lang/tact-by-example
Branch: main

## Directory Structure:
```
└── tact-by-example/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── .vscode/
    ├── CHANGELOG.md
    ├── README.md
    ├── docs/
        ├── 00-hello-world.html
        ├── 01-a-simple-counter.html
        ├── 01-the-deployable-trait.html
        ├── 02-addresses.html
        ├── 02-bools.html
        ├── 02-constants.html
        ├── 02-integer-ops.html
        ├── 02-integers.html
        ├── 02-strings.html
        ├── 02-variables.html
        ├── 03-emit.html
        ├── 03-errors.html
        ├── 03-getters.html
        ├── 03-messages-between-contracts.html
        ├── 03-receive-coins.html
        ├── 03-receivers.html
        ├── 03-send-coins.html
        ├── 03-sender.html
        ├── 03-structs.html
        ├── 03-textual-messages.html
        ├── 04-arrays.html
        ├── 04-current-time.html
        ├── 04-decimal-point.html
        ├── 04-functions.html
        ├── 04-if-statements.html
        ├── 04-loops.html
        ├── 04-maps.html
        ├── 04-optionals.html
        ├── 05-the-ownable-trait.html
        ├── 05-the-ownable-transferable-trait.html
        ├── 05-the-resumable-trait.html
        ├── 05-the-stoppable-trait.html
        ├── 05-your-own-trait.html
        ├── 06-authenticating-children.html
        ├── 06-calc-contract-address.html
        ├── 06-communicating-subcontract.html
        ├── 06-contract-deploy-another.html
        ├── 06-multiple-contract-instances.html
        ├── 06-parent-child.html
        ├── 06-unbounded-arrays.html
        ├── 06-unbounded-maps.html
        ├── 07-jetton-standard.html
        ├── _app/
            ├── immutable/
                ├── assets/
                ├── chunks/
                ├── entry/
        ├── all.html
        ├── icons/
        ├── index.html
        ├── shiki/
            ├── languages/
            ├── themes/
    ├── src/
        ├── app.html
        ├── lib/
        ├── routes/
            ├── (examples)/
                ├── 00-hello-world/
                    ├── content.md
                ├── 01-a-simple-counter/
                    ├── content.md
                ├── 01-the-deployable-trait/
                    ├── content.md
                ├── 02-addresses/
                    ├── content.md
                ├── 02-bools/
                    ├── content.md
                ├── 02-constants/
                    ├── content.md
                ├── 02-integer-ops/
                    ├── content.md
                ├── 02-integers/
                    ├── content.md
                ├── 02-strings/
                    ├── content.md
                ├── 02-variables/
                    ├── content.md
                ├── 03-emit/
                    ├── content.md
                ├── 03-errors/
                    ├── content.md
                ├── 03-getters/
                    ├── content.md
                ├── 03-messages-between-contracts/
                    ├── content.md
                ├── 03-receive-coins/
                    ├── content.md
                ├── 03-receivers/
                    ├── content.md
                ├── 03-send-coins/
                    ├── content.md
                ├── 03-sender/
                    ├── content.md
                ├── 03-structs/
                    ├── content.md
                ├── 03-textual-messages/
                    ├── content.md
                ├── 04-arrays/
                    ├── content.md
                ├── 04-current-time/
                    ├── content.md
                ├── 04-decimal-point/
                    ├── content.md
                ├── 04-functions/
                    ├── content.md
                ├── 04-if-statements/
                    ├── content.md
                ├── 04-loops/
                    ├── content.md
                ├── 04-maps/
                    ├── content.md
                ├── 04-optionals/
                    ├── content.md
                ├── 05-the-ownable-trait/
                    ├── content.md
                ├── 05-the-ownable-transferable-trait/
                    ├── content.md
                ├── 05-the-resumable-trait/
                    ├── content.md
                ├── 05-the-stoppable-trait/
                    ├── content.md
                ├── 05-your-own-trait/
                    ├── content.md
                ├── 06-authenticating-children/
                    ├── content.md
                ├── 06-calc-contract-address/
                    ├── content.md
                ├── 06-communicating-subcontract/
                    ├── content.md
                ├── 06-contract-deploy-another/
                    ├── content.md
                ├── 06-multiple-contract-instances/
                    ├── content.md
                ├── 06-parent-child/
                    ├── content.md
                ├── 06-unbounded-arrays/
                    ├── content.md
                ├── 06-unbounded-maps/
                    ├── content.md
                ├── 07-jetton-standard/
                    ├── content.md
            ├── all/
    ├── static/
        ├── icons/
        ├── shiki/
            ├── languages/
            ├── themes/
```

## Files Content:

================================================
FILE: CHANGELOG.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/CHANGELOG.md
================================================
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Original goal is followed [Tact Compiler Changelog](https://github.com/tact-lang/tact/tree/main), and keep this project in sync. Enjoy! ❤️❤️❤️

## [0.6.2] - 2023-10-30

- Add 2 PRs from [Breakfast](https://github.com/topics/hacktoberfest)
  - https://github.com/tact-lang/tact-by-example/commit/19288b393e07cbf14fa6bffec995eebdad7b06be
  - https://github.com/tact-lang/tact-by-example/commit/eb8b47123218b24b5ecf8938eafe9ab31c0482d2
- Modify and add the new content and fix the grammer errors

## [0.5.0] - 2023-10-05

### Added

- Add the Jetton Token Standard example.

## [0.4.0] - 2023-09-29

### Changed

- Turn `src/routes/(examples)/00-hello-world` from 01 to 00.
- Optimzed `src/routes/(examples)/06-communicating-children/contract.tact` code in dump log.
- Optimzed `src/routes/(examples)/06-authenticating-children/contract.tact` code in dump log.
- Change the name of `06-communicating-children` to `06-communicating-subcontract`.

### Added

- Added `😃, 😑` in dump log in `src/routes/(examples)/06-authenticating-children` for better understanding.
- `require(sender() == parent, "not the parent");` in `src/routes/(examples)/06-authenticating-children/contract.tact` file.

## [0.3.0] - 2023-09-27

### Added

- Emoji support in terminal log. (📝, 🔍, 📤)

### Changed

- Optimized `src/routes/(examples)/06-unbounded-arrays/content.md` text and add the callout blocks.
- Fixed some type errors in the `src/routes/(examples)/06-unbounded-arrays/content.md` file.
- Fixed the text typo in the terminal log.

## [0.2.0] - 2023-09-08

### Added

- The first version of ChangeLog.md

## [0.1.0] - 2023-09-01

### Fixed

- Update the compiler version in the package.json
- Fix the `reply` syntax to the `self.reply`.



================================================
FILE: README.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/README.md
================================================
- [🔍 Changelog](/CHANGELOG.md)
- [🫂 Telegram Group Chat](https://t.me/tactlang)

## Developing

### About Tact Source Code

1. Tact code is under the `src` directory. The `src` directory contains the following files: `src/routes/(examples)` - The source code for the examples.
2. The terminal output is located in `src/routes/(examples)/+layout.svelte` file.
3. Run `npm run tact-build` to compile the Tact code you just added.

### About the Examples Order

1. Check the order in the `src/routes/(examples)/examples.json` file.
2. The `id` determines the sequence of the examples in the app.

### Running the project

Once you've run `npm install` start a development server:

```bash
npm run dev
# Use the Network option to view it on your phone

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Releasing

1. Test the app in dev mode.
2. Make sure to update the version in `package.json`.
3. Run `npm run build` which will build to the `docs` directory.
4. Run `npm run preview` to test the app in production mode.



================================================
FILE: docs/00-hello-world.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/00-hello-world.html
================================================
[HTML Document converted to Markdown]

File: 00-hello-world.html
Size: 5.41 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

[All Examples](all)

contract HelloWorld {

    get fun greeting(): String {
        return "hello world";
    }

}

Deploy

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 5\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 0, Paragraphs: 2



================================================
FILE: docs/01-a-simple-counter.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/01-a-simple-counter.html
================================================
[HTML Document converted to Markdown]

File: 01-a-simple-counter.html
Size: 7.39 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Hello World

This is probably the simplest possible Tact program. It will provide callers with the classic output "hello world".

Tact lets you write smart contracts. This code defines a single contract named `HelloWorld`. Smart contracts must be deployed to the blockchain network to be usable, try to deploy this contract by pressing the Deploy button.

Contract deployments usually cost gas. This website deploys to an [emulator](https://github.com/tact-lang/tact-emulator) of TON blockchain, so gas is emulated TON coin (which is free).

If you're unfamilar with terms like _contract_, _deployment_ and _gas_, please [read this post](https://blog.ton.org/what_is_blockchain) first. It's a great introduction to all blockchain terminology you will need to learn Tact.

## A simple interaction

Contracts can have _getters_ like `greeting()`. Getters are special external interface functions that allow users to query information from the contract. Try to call the getter by pressing the Get greeting button. Calling getters is free and does not cost gas.

Don't worry if some things aren't clear now, we will dive into getters in more detail later.

[All Examples](all)

contract Counter {
 
    // persistent state variable of type Int to hold the counter value
    val: Int as uint32;
 
    // initialize the state variable when contract is deployed
    init() {
        self.val = 0;
    }
 
    // handler for incoming increment messages that change the state
    receive("increment") {
        self.val = self.val + 1;
    }
 
    // read-only getter for querying the counter value
    get fun value(): Int {
        return self.val;
    }
}

Deploy

Get greeting

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 6\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/01-the-deployable-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/01-the-deployable-trait.html
================================================
[HTML Document converted to Markdown]

File: 01-the-deployable-trait.html
Size: 7.60 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# A Simple Counter

This is a simple counter contract that allows users to increment its value.

This contract has a state variable `val` that persists between contract calls - the counter value. When persisted, this variable is encoded `as uint32` - a 32-bit unsigned integer. Contracts pay rent in proportion to the amount of persistent space they consume, so compact representations are encouraged.

State variables should be initialized in `init()` that runs on deployment of the contract.

## Receiving messages

This contract can receive **_messages_** from users.

Unlike getters that are just read-only, messages can do write operations and change the contract's persistent state. Incoming messages are processed in `receive()` methods as transactions and cost gas for the sender.

After deploying the contract, send the `increment` message by pressing the Send increment button in order to increase the counter value by one. Afterwards, call the getter `value()` to see that the value indeed changed.

**Info**: We will learn more in details about "getter" functions in the next example.

[All Examples](all)

// this trait has to be imported
import "@stdlib/deploy";

// the Deployable trait adds a default receiver for the "Deploy" message
contract Counter with Deployable {
 
    val: Int as uint32;
 
    init() {
        self.val = 0;
    }
 
    receive("increment") {
        self.val = self.val + 1;
    }
 
    get fun value(): Int {
        return self.val;
    }
}

Deploy

Get value

Send increment

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 7\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/02-addresses.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-addresses.html
================================================
[HTML Document converted to Markdown]

File: 02-addresses.html
Size: 8.70 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# The Deployable Trait

Tact doesn't support classical class inheritance, but contracts can implement **_traits_**.

One commonly used trait is `Deployable`, which implements a simple receiver for the `Deploy` message. This helps deploy contracts in a standardized manner.

All contracts are deployed by sending them a message. While any message can be used for this purpose, best practice is to use the special `Deploy` message.

This message has a single field, `queryId`, provided by the deployer (usually set to zero). If the deployment succeeds, the contract will reply with a `DeployOk` message and echo the same `queryId` in the response.

* * *

If you're using Tact's [auto-generated](https://docs.tact-lang.org/ecosystem/tools/typescript#tact-contract-in-typescript) TypeScript classes to deploy, sending the deploy message should look like:

```ts
const msg = { $$type: "Deploy", queryId: 0n };
await contract.send(sender, { value: toNano(1) }, msg);
```

You can see the implementation of the trait [here](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/deploy.tact). Notice that the file **_deploy.tact_** needs to be imported from the standard library using the `import` keyword.

[All Examples](all)

import "@stdlib/deploy";

contract Addresses with Deployable {

    // contract persistent state variables
    // we have three representations of the same address
    a1: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // bouncable (same foundation wallet)
    a2: Address = address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"); // non-bounceable (same foundation wallet)
    a3: Address;

    a4: Address;
    a5: Address;
    a6: Address;

    init() {
        // this is the third representation of the same address
        self.a3 = newAddress(0, 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8); // raw (same foundation wallet)
        
        // here are a few other important addresses
        self.a4 = newAddress(0, 0); // the zero address (nobody)
        self.a5 = myAddress();      // address of this contract
        self.a6 = sender();         // address of the deployer (the sender during init())
    }

    receive("show all") {
        /// addresses cannot currently be dumped
        /// TODO: https://github.com/tact-lang/tact/issues/16
        /// dump(self.a1);
    }

    receive("show ops") {
        // temporary variable
        let a: Address = address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"); // bouncable (same foundation wallet)

        dump(a == self.a1);
        dump(a == self.a2);
        dump(a == self.a3);
        
        dump(a == self.a4);
        dump(a != self.a5);
    }

    get fun result(): Address {
        return self.a1;
    }
}

Deploy

Get value

Send increment

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 8\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 1, Paragraphs: 9



================================================
FILE: docs/02-bools.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-bools.html
================================================
[HTML Document converted to Markdown]

File: 02-bools.html
Size: 7.98 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Addresses

`Address` is another primitive data type. It represents standard addresses on the TON blockchain. Every smart contract on TON is identifiable by its address. Think of this as a unique id.

TON is divided into multiple chains called _workchains_. This allows to balance the load more effectively. One of the internal fields of the address is the workchain id:

-   `0` - The standard workchain, for regular users. Your contracts will be here.
    
-   `-1` - The masterchain, usually for validators. Gas on this chain is significantly more expensive, but you'll probably never use it.
    

There are multiple ways on TON to [represent](https://docs.ton.org/learn/overviews/addresses#bounceable-vs-non-bounceable-addresses) the same address. Notice in the contract that the bouncable and non-bouncable representations of the same address actually generate the exact same value. Inside the contract, it doesn't matter which representation you use.

## State costs

Most addresses take 267-bit to store (3 flag bits indicating standard address, 8-bit for the workchain id and 256-bit for the account id). This means that storing 1000 addresses [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about 0.191 TON per year.

[All Examples](all)

import "@stdlib/deploy";

contract Bools with Deployable {
 
    // contract persistent state variables
    b1: Bool = true;
    b2: Bool = false;
    b3: Bool;

    init() {
        self.b3 = !self.b2;
    }

    receive("show all") {
        dump(self.b1);
        dump(self.b2);
        dump(self.b3);
    }

    receive("show ops") {
        let b: Bool = true; // temporary variable
        dump(b);

        b = self.b1 && self.b2 || !self.b3;
        dump(b);

        dump(self.b1 == true);
        dump(self.b1 == self.b2);
        dump(self.b1 != self.b2);
    }

    get fun result(): Bool {
        return self.b1;
    }
}

Deploy

Get result

Send show all

Send show ops

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 9\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/02-constants.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-constants.html
================================================
[HTML Document converted to Markdown]

File: 02-constants.html
Size: 7.35 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Bools

This primitive data type can hold the values `true` or `false`.

`Bool` is convenient for boolean and logical operations. It is also useful for storing flags.

The only supported operations with booleans are `&&` `||` `!` - if you try to add them, for example, the code will not compile.

## State costs

Persisting bools to state is very space-efficient, they only take 1-bit. **Storing 1000 bools in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about 0.00072 TON per year.**

[All Examples](all)

import "@stdlib/deploy";

// global constants are calculated in compile-time and can't change
const GlobalConst1: Int = 1000 + ton("1.24") + pow(10, 9);

contract Constants with Deployable {

    // contract constants are calculated in compile-time and can't change
    const ContractConst1: Int = 2000 + ton("1.25") + pow(10, 9);
    
    // if your contract can be in multiple states, constants are an easy alternative to enums
    const StateUnpaid: Int = 0;
    const StatePaid: Int = 1;
    const StateDelivered: Int = 2;
    const StateDisputed: Int = 3;

    init() {}

    get fun sum(): Int {
        // you can read the constants anywhere
        return GlobalConst1 + self.ContractConst1 + self.StatePaid;
    }
}

Deploy

Get result

Send show all

Send show ops

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 10\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 6



================================================
FILE: docs/02-integer-ops.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-integer-ops.html
================================================
[HTML Document converted to Markdown]

File: 02-integer-ops.html
Size: 7.64 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Constants

Unlike variables, constants cannot change. Their values are calculated in _compile-time_ and cannot change during execution.

Constant initializations must be relatively simple and only rely on values known during compilation. If you add two numbers for example, the compiler will calculate the result during build and put the result in your compiled code.

You can read constants both in **_receivers_** and in **_getters_**.

Unlike contract variables, **constants don't consume space in persistent state. Their values are stored directly in the code cell.**

There isn't much difference between constants defined outside of a contract and inside the contract. Those defined outside can be used by other contracts in your project.

[All Examples](all)

import "@stdlib/deploy";

contract Integers with Deployable {
 
    // contract persistent state variables
    i1: Int as uint128 = 3001;
    i2: Int as int32 = 57;

    init() {}

    receive("show ops") {
        let i: Int = -12; // temporary variable, runtime Int type is always int257 (range -2^256 to 2^256 - 1)
        dump(i);

        i = self.i1 \* 3 + (self.i2 - i);    // basic math expressions
        dump(i);

        i = self.i1 % 10;                   // modulo (remainder after division), 3001 % 10 = 1
        dump(i);
        
        i = self.i1 / 1000;                 // integer division (truncation toward zero), 3001 / 1000 = 3
        dump(i);
        
        i = self.i1 >> 3;                   // shift right (divide by 2^n)
        dump(i);
        
        i = self.i1 << 2;                   // shift left (multiply by 2^n)
        dump(i);
        
        i = min(self.i2, 11);               // minimum between two numbers
        dump(i);
        
        i = max(self.i2, 66);               // maximum between two numbers
        dump(i);
        
        i = abs(-1 \* self.i2);              // absolute value
        dump(i);

        dump(self.i1 == 3001);
        dump(self.i1 > 2000);
        dump(self.i1 >= 3002);
        dump(self.i1 != 70);
    }
}

Deploy

Get sum

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 11\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 7



================================================
FILE: docs/02-integers.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-integers.html
================================================
[HTML Document converted to Markdown]

File: 02-integers.html
Size: 9.04 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Integer Operations

Since all runtime calculations with integers are done at 257-bit, overflows are quite rare. An overflow can happen if the result of a math operation is too big to fit.

**For example, multiplying 2^256 by 2^256 will not fit within 257-bit.**

Nevertheless, if any math operation overflows, an exception will be thrown, and the transaction will fail. You could say that Tact's math is safe by default.

There is no problem with mixing variables of different state sizes in the same calculation. At runtime, they are all the same type—**always 257-bit signed**. This is the largest supported integer type, so they all fit.

## Decimal Point with Integers

Arithmetic with dollars, for example, requires two decimal places. How can we represent the number `1.25` if we are only able to work with integers? The solution is to work with _cents_. In this way, `1.25` becomes `125`. We simply remember that the two rightmost digits represent the numbers after the decimal point.

Similarly, working with TON coins requires nine decimal places instead of two. Therefore, the amount of 1.25 TON, which can be represented in Tact as `ton("1.25")`, is actually the number `1250000000`.

**We refer to these as _nano-tons_ rather than cents.**

[All Examples](all)

import "@stdlib/deploy";

contract Integers with Deployable {
 
    // contract persistent state variables
    // integers can be persisted in state in various sizes
    i1: Int as int257 = 3001;   // range -2^256 to 2^256 - 1 (takes 257 bit = 32 bytes + 1 bit)
    i2: Int as uint256;         // range 0 to 2^256 - 1 (takes 256 bit = 32 bytes)
    i3: Int as int256 = 17;     // range -2^255 to 2^255 - 1 (takes 256 bit = 32 bytes)
    i4: Int as uint128;         // range 0 to 2^128 - 1 (takes 128 bit = 16 bytes)
    i5: Int as int128;          // range -2^127 to 2^127 - 1 (takes 128 bit = 16 bytes)
    i6: Int as coins;           // range 0 to 2^120 - 1 (takes 120 bit = 15 bytes)
    i7: Int as uint64 = 0x1c4a; // range 0 to 18,446,744,073,709,551,615 (takes 64 bit = 8 bytes)
    i8: Int as int64 = -203;    // range -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (takes 64 bit = 8 bytes)
    i9: Int as uint32 = 0;      // range 0 to 4,294,967,295 (takes 32 bit = 4 bytes)
    i10: Int as int32 = 0;      // range -2,147,483,648 to 2,147,483,647 (takes 32 bit = 4 bytes)
    i11: Int as uint16 = 0;     // range 0 to 65,535 (takes 16 bit = 2 bytes)
    i12: Int as int16 = 0;      // range -32,768 to 32,767 (takes 16 bit = 2 bytes)
    i13: Int as uint8 = 0;      // range 0 to 255 (takes 8 bit = 1 byte)
    i14: Int as int8 = 0;       // range -128 to 127 (takes 8 bit = 1 byte)

    init() {
        self.i2 = 0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8; // we can define numbers in hex (base 16)
        self.i4 = 1507998500293440234999; // we can define numbers in decimal (base 10)
        self.i5 = pow(10, 9);   // this is 10^9 = 1,000,000,000
        self.i6 = ton("1.23");  // easy to read coin balances (coins type is nano-tons, like cents, just with 9 decimals)
    }

    receive("show all") {
        dump(self.i1);
        dump(self.i2);
        dump(self.i3);
        dump(self.i4);
        dump(self.i5);
        dump(self.i6);
        dump(self.i7);
        dump(self.i8);
    }

    get fun result(): Int {
        return self.i1;
    }
}

Deploy

Send show ops

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 12\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 9



================================================
FILE: docs/02-strings.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-strings.html
================================================
[HTML Document converted to Markdown]

File: 02-strings.html
Size: 8.37 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Integers

Tact supports a number of primitive data types that are tailored for smart contract use.

`Int` is the primary number type. Math in smart contracts is always done with integers and never with floating points since floats are [unpredictable](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision).

The runtime type `Int` is _always_ 257-bit signed, so all runtime calculations are done at 257-bit. This should be large enough for pretty much anything you need as it's large enough to hold the number of atoms in the universe.

Persistent state variables can be initialized inline or inside `init()`. If you forget to initialize a state variable, the code will not compile.

## State costs

When encoding `Int` to persistent state, we will usually use smaller representations than 257-bit to reduce storage cost. The persistent state size is specified in every declaration of a state variable after the `as` keyword.

-   Storing 1000 257-bit integers in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about **0.184 TON** per year.
-   Storing 1000 32-bit integers only costs **0.023 TON** per year by comparison.

[All Examples](all)

import "@stdlib/deploy";

contract Strings with Deployable {
 
    // contract persistent state variables
    s1: String = "hello world";
    s2: String = "yes unicode 😀 😅 你好 no escaping"; /// TODO: https://github.com/tact-lang/tact/issues/25 \\n \\t";
    s3: String;
    s4: String;
    s5: String;
    s6: String;

    init() {
        let i1: Int = -12345;
        let i2: Int = 6780000000; // coins = ton("6.78")

        self.s3 = i1.toString();
        self.s4 = i1.toFloatString(3);
        self.s5 = i2.toCoinsString();

        // gas efficient helper to concatenate strings in run-time
        let sb: StringBuilder = beginString();
        sb.append(self.s1);
        sb.append(", your balance is: ");
        sb.append(self.s5);
        self.s6 = sb.toString();
    }

    receive("show all") {
        dump(self.s1);
        dump(self.s2);
        dump(self.s3);
        dump(self.s4);
        dump(self.s5);
        dump(self.s6);
    }

    receive("show ops") {
        let s: String = "how are you?"; // temporary variable
        dump(s);

        /// TODO: https://github.com/tact-lang/tact/issues/24
        /// dump(self.s1 == "hello world");
        /// dump(self.s1 != s);
    }

    get fun result(): String {
        return self.s1;
    }
}

Deploy

Get result

Send show all

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 13\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/02-variables.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/02-variables.html
================================================
[HTML Document converted to Markdown]

File: 02-variables.html
Size: 7.86 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Strings

Tact has basic support for strings. Strings support unicode and don't have any special escape characters like `\n`.

The use of strings in smart contracts should be quite limited. Smart contracts are very exact programs for managing money, they're not intended for interactive CLI.

Strings are immutable. Once a sequence of characters is created, this sequence cannot be modified.

If you need to concatenate strings in run-time, you can use a `StringBuilder`. This object handles gas efficiently and supports `append()` of various types to the string.

[All Examples](all)

import "@stdlib/deploy";

contract Variables with Deployable {

    // contract variables are persisted in state and can change their value between transactions
    // they cost rent per their specified size
    contractVar1: Int as coins = ton("1.26");
    contractVar2: Int as uint64;

    init(arg1: Int) {
        // contract variables support complex initializations that are calculated in run-time
        self.contractVar2 = min(arg1, pow(2, 64) - 1);
    }

    // receivers handle incoming messages and can change state
    receive("increment") {
        // local variables are temporary, not persisted in state
        let localVar1: Int = 100 \* 1000;
        localVar1 = localVar1 \* 2;

        // contract variables that are persisted in state can only change in receivers
        self.contractVar1 = self.contractVar1 + 1;
        self.contractVar2 = self.contractVar2 + 1;
    }

    // getters are executed by users to query data and can't change state
    get fun sum(arg1: Int): Int {
        // local variables are temporary, not persisted in state
        let localVar1: Int = 100 \* 1000;
        localVar1 = localVar1 \* 2;

        // getters can access everything but for read-only operations only
        return arg1 + self.contractVar1 + localVar1;
    }
}

Deploy

Get result

Send show all

Send show ops

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 14\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 6



================================================
FILE: docs/03-emit.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-emit.html
================================================
[HTML Document converted to Markdown]

File: 03-emit.html
Size: 7.78 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Variables

The most important variables are those that are persisted in state and retain their value between contract executions. They must be defined in the scope of the contract like `contractVar1`.

Persisting data in state costs gas. The contract must pay rent periodically from its balance. State storage is expensive, about [4 TON per MB per year](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees). If the contract runs out of balance, the data will be deleted. If you need to store large amounts of data, like images, a service like [TON Storage](https://ton.org/docs/participate/ton-storage/storage-faq) would be more suitable.

Persistent state variables can only change in _receivers_ by sending messages as transactions. **Sending these transactions will cost gas to users.**

Executing _getters_ is read-only, they can access all variables, but cannot change state variables. They are free to execute and don't cost any gas.

Local variables like `localVar1` are temporary. They're not persisted to state. You can define them in any function and they will only exist in run-time during the execution of the function. You can change their value in _getters_ too.

[All Examples](all)

import "@stdlib/deploy";

message TransferEvent {
    amount: Int as coins;
    recipient: Address;
}

message StakeEvent {
    amount: Int as coins;
}

contract Emit with Deployable {

    init() {}

    receive("action") {
        // handle action here
        // ...
        // emit log that the action was handled
        emit("Action handled".asComment());
    }

    receive("transfer") {
        // handle transfer here
        // ...
        // emit log that the transfer happened
        emit(TransferEvent{amount: ton("1.25"), recipient: sender()}.toCell());
    }

    receive("stake") {
        // handle stake here
        // ...
        // emit log that stake happened
        emit(StakeEvent{amount: ton("0.007")}.toCell());
    }
}

Deploy

Get sum

Send increment

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 15\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 1, Paragraphs: 7



================================================
FILE: docs/03-errors.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-errors.html
================================================
[HTML Document converted to Markdown]

File: 03-errors.html
Size: 7.89 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Emitting Logs

It is sometimes useful to emit events from the contract in order to indicate that certain things happened.

This data can later be analyzed off-chain and indexed by using [RPC API](https://orbs.com/ton-access) to query all transactions sent to the contract.

Consider for example a staking contract that wants to indicate how much time passed before users unstaked for analytics purposes. By analyzing this data, the developer can think of improvements to the product.

One way to achieve this is by sending messages back to the sender using `self.reply()` or by sending messages to the zero address. These two methods work, but they are not the most efficient in terms of gas.

The `emit()` function will output a message (binary or textual) from the contract. This message does not actually have a recipient and is very gas-efficient because it doesn't actually need to be delivered.

The messages emitted in this way are still recorded on the blockchain and can be analyzed by anyone at any later time.

[All Examples](all)

import "@stdlib/deploy";

message Divide {
    by: Int as uint32;
}

contract Errors with Deployable {

    val: Int as int64;
 
    init() {
        self.val = 0;
    }
 
    // not meeting the condition will raise an error, revert the transaction and all state changes
    receive("increment") {
        self.val = self.val + 1;
        require(self.val < 5, "Counter is too high");
    }

    // any exceptions during execution will also revert the transaction and all state changes
    receive(msg: Divide) {
        self.val = 4;
        self.val = self.val / msg.by;
    }

    // advanced: revert the transaction and return a specific non-zero exit code manually
    // https://ton.org/docs/learn/tvm-instructions/tvm-exit-codes
    receive("no access") {
        throw(132);
    }
 
    get fun value(): Int {
        return self.val;
    }
}

Deploy

Send action

Send transfer

Send stake

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 16\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 1, Paragraphs: 8



================================================
FILE: docs/03-getters.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-getters.html
================================================
[HTML Document converted to Markdown]

File: 03-getters.html
Size: 8.19 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Throwing Errors

Processing an incoming message in a transaction isn't always successful. The contract may encounter some error and fail.

This can be due to an explicit decision of the contract author, usually by writing a `require()` on a condition that isn't met, or this may happen implicitly due to some computation error in run-time, like a math overflow.

When an error is thrown, the transaction reverts. This means that all persistent state changes that took place during this transaction, even those that happened before the error was thrown, are all reverted and return to their original values.

## Notifying the sender about the error

How would the sender of the incoming message know that the message they had sent was rejected due to an error?

All communication is via messages, so naturally the sender should receive a message about the error. TON will actually return the original message back to the sender and mark it as _bounced_ - just like a snail mail letter that couldn't be delivered.

[All Examples](all)

import "@stdlib/deploy";

contract Getters with Deployable {
 
    count: Int as uint32;

    init() {
        self.count = 17;
    }
 
    get fun counter(): Int {
        return self.count;
    }

    get fun location(): Address {
        return myAddress();
    }

    get fun greeting(): String {
        return "hello world";
    }

    get fun sum(a: Int, b: Int): Int {
        return a + b;
    }

    get fun and(a: Bool, b: Bool): Bool {
        return a && b;
    }

    get fun answer(a: Int): String {
        let sb: StringBuilder = beginString();
        sb.append("The meaning of life is ");
        sb.append(a.toString());
        return sb.toString();
    }
}

Deploy

Get value

Send increment

Send Divide{2}

Send Divide{0}

Send no access

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 17\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/03-messages-between-contracts.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-messages-between-contracts.html
================================================
[HTML Document converted to Markdown]

File: 03-messages-between-contracts.html
Size: 10.52 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Getters

Getters are special contract functions that allow users to query information from the contract.

Contract methods starting with the prefix `get fun` are all getters. You can define as many getters are you want. Each getter must also specify its return type - `counter()` for example returns an `Int`.

Calling getters is free and does not cost gas. The call is executed by a full node and doesn't go through consensus with all the validators nor is added to a new block.

Getters are read-only, they cannot change the contract persistent state.

If we were to omit the `get` keyword from the function declaration of a getter, it will stop being a getter. External users would no longer be able call this function and it would essentially become a private method of the contract.

## Getters between contracts

**A contract cannot execute a getter of another contract.**

Getters are only executable by end-users off-chain. Since contracts are running on-chain, they do not have access to each other's getters.

So, if you can't call a getter, how can two contracts communicate?

The only way for contracts to communicate on-chain is by sending messages to each other. Messages are handled in _receivers_.

> **Info**: TON Blockchain is an asynchronous blockchain, which means that smart contracts can interact with each other only by sending messages.

[All Examples](all)

import "@stdlib/deploy";

message CounterValue {
    value: Int as uint32;
}

////////////////////////////////////////////////////////////////////////////
// this is our famous Counter contract, we've seen it before
// this contract is very annoying, it only allows to increment +1 at a time!

contract Counter with Deployable {

    val: Int as uint32;

    init() {
        self.val = 0;
    }

    // step 6: this contract allows anyone to ask it to increment by 1 (ie. the other contract)
    receive("increment") {
        self.val = self.val + 1;
        self.reply(CounterValue{value: self.val}.toCell());
    }

    // step 3: this contract replies with its current value to anyone asking (ie. the other contract)
    receive("query") {
        self.reply(CounterValue{value: self.val}.toCell());
    }

    get fun value(): Int {
        return self.val;
    }
}

message Reach {
    counter: Address;
    target: Int as uint32;
}

////////////////////////////////////////////////////////////////////////////
// let's write a second helper contract to make our lives a little easier
// it will keep incrementing the previous contract as many times as we need!

contract BulkAdder with Deployable {

    target: Int as uint32;

    init() {
        self.target = 0;
    }

    // step 1: users will send this message to tell us what target value we need to reach
    receive(msg: Reach) {
        self.target = msg.target;
        // step 2: this contract will query the current counter value from the other contract
        send(SendParameters{
            to: msg.counter,
            value: 0, /// TODO: https://github.com/tact-lang/tact/issues/31
            mode: SendRemainingValue + SendIgnoreErrors, /// TODO: issues/31
            body: "query".asComment()
        });
    }

    // step 4: the other contract will tell us what is its current value by sending us this message
    receive(msg: CounterValue) {
        if (msg.value < self.target) {
            // step 5: if its value is too low, send it another message to increment it by +1 more
            send(SendParameters{
                to: sender(),
                value: 0, /// TODO: same issue 31
                mode: SendRemainingValue + SendIgnoreErrors, /// TODO: https://github.com/tact-lang/tact/issues/31
                body: "increment".asComment()
            });
        }
    }
}

Deploy

Get counter

Get location

Get greeting

Get sum(3,4)

Get and(true,false)

Get answer(42)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 18\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 12



================================================
FILE: docs/03-receive-coins.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-receive-coins.html
================================================
[HTML Document converted to Markdown]

File: 03-receive-coins.html
Size: 8.17 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Messages Between Contracts

Different contracts can communicate with each other only by sending messages. This example showcases two separate contracts working in tandem:

-   `Counter` - A simple counter that can increment only by 1.
-   `BulkAdder` - This contract instructs `Counter` to increment multiple times.

Click the **Deploy** button to deploy both contracts. To make the counter reach 5, send the `Reach` message to BulkAdder by clicking the **Send Reach 5** button.

Observe the number of messages exchanged between the two contracts. Each message is processed as a _separate_ transaction. Also note that BulkAdder cannot call a _getter_ on Counter; it must send a `query` message instead.

## Who's Paying for Gas

**By default, the original sender is responsible for covering the gas costs of the entire cascade of messages they initiate.** This is funded by the original TON coin value sent with the first `Reach` message.

Internally, this is managed by each message handler forwarding the remaining excess TON coin value to the next message it sends.

**Challenge**: Try to modify the code to refund the original sender any unused excess gas.

[All Examples](all)

import "@stdlib/deploy";

contract ReceiveCoins with Deployable {

    val: Int as int64;

    init() {
        self.val = 0;
    }

    // receive empty messages, these are usually simple TON coin transfers to the contract
    receive() {
        dump("empty message received");
        // revert the transaction if balance is growing over 3 TON
        require(myBalance() <= ton("3"), "Balance getting too high");
    }

    receive("increment") {
        // print how much TON coin were sent with this message
        dump(context().value);
        self.val = self.val + 1;
    }

    receive("refunding increment") {
        // print how much TON coin were sent with this message
        dump(context().value);
        self.val = self.val + 1;
        // return all the unused excess TON coin value on the message back to the sender (with a textual string message)
        self.reply("increment refund".asComment());
    }
 
    get fun balance(): Int {
        return myBalance(); // in nano-tons (like cents, just with 9 decimals)
    }
}

Deploy

Get value

Send Reach{5}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 19\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/03-receivers.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-receivers.html
================================================
[HTML Document converted to Markdown]

File: 03-receivers.html
Size: 9.26 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Receiving TON Coins

Every contract has a TON coin balance. This balance is used to pay ongoing rent for storage and should not run out otherwise the contract may be deleted. You can store extra coins in the balance for any purpose.

Every incoming message normally carries some TON coin value sent by the sender. This value is used to pay gas for handling this message. Unused excess will stay in the contract balance. If the value doesn't cover the gas cost, the transaction will revert.

You can query the contract balance with `myBalance()` - note that the value is in nano-tons (like cents, just with 9 decimals). The balance already contains the incoming message value.

**Info**: More detail about myBalance() can be found here: [myBalance()](https://docs.tact-lang.org/ref/core-common/#mybalance)

## Refunding senders

If the transaction reverts, unused excess value will be sent back to sender on the _bounced_ message.

You can also refund the excess if the transaction succeeds by sending it back using `self.reply()` in a response message. This is the best way to guarantee senders are only paying for the exact gas that their message consumed.

[All Examples](all)

import "@stdlib/deploy";

// this message will cause our contract to add an amount to the counter
message Add {
    amount: Int as uint32;
}

// this message will cause our contract to subtract an amount from the counter
message Subtract {
    amount: Int as uint32;
}

// this message will cause our contract to do a complex math operation on the counter
message MultiMath {
    add: Int as uint32;
    subtract: Int as uint32;
    multiply: Int as uint32;
}

contract Receivers with Deployable {

    val: Int as int64;
 
    init() {
        self.val = 0;
    }

    // handler for the "Add" message - this is a binary message that has an input argument (amount)
    receive(msg: Add) {
        self.val = self.val + msg.amount;
    }

    // handler for the "Subtract" message - this is a different binary message although its format is identical
    receive(msg: Subtract) {
        self.val = self.val - msg.amount;
    }

    // handler for the "MultiMath" message - this is a binary message that holds multiple input arguments
    receive(msg: MultiMath) {
        self.val = self.val + msg.add;
        self.val = self.val - msg.subtract;
        self.val = self.val \* msg.multiply;
    }

    // handler for "increment" textual message - this is a textual string message, these cannot carry input arguments
    receive("increment") {
        self.val = self.val + 1;
    }

    // handler for "decrement" textual message - this is a different textual string message, you can have as many as you want
    receive("decrement") {
        self.val = self.val - 1;
    }
 
    get fun value(): Int {
        return self.val;
    }
}

Deploy

Get balance

Send 1 TON

Send increment

Send refunding increment

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 20\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/03-send-coins.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-send-coins.html
================================================
[HTML Document converted to Markdown]

File: 03-send-coins.html
Size: 9.99 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Receivers and Messages

In TON, users interact with contracts by sending them messages. Different contracts can only communicate with each other by sending each other messages.

Since users actually use wallet contracts, messages from users are actually messages coming from just another contract.

Sending a message to a contract costs gas and is processed in the course of a transaction. The transaction executes when validators add the transaction to a new block. This can take a few seconds. Messages are also able to change the contract's persistent state.

## Receivers

When designing your contract, make a list of every operation that your contract supports, then, define a message for each operation, and finally, implement a handler for each message containing the logic of what to do when it arrives.

Contract methods named `receive()` are the handlers that process each incoming message type. Tact will automatically route every incoming message to the correct receiver listening for it according to its type. A message is only handled by one receiver.

Messages are defined using the `message` keyword. They can carry input arguments. Notice that for integers, you must define the encoding size, just like in state variables. When somebody sends the message, they serialize it over the wire.

[All Examples](all)

import "@stdlib/deploy";

message Withdraw {
    amount: Int as coins;
}

contract SendCoins with Deployable {

    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years
    deployer: Address;

    init() {
        self.deployer = sender();
    }

    // accept incoming TON transfers
    receive() {
        dump("funds received");
    }

    // this will withdraw the entire balance of the contract and leave 0
    receive("withdraw all") {
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    }

    // this will withdraw the entire balance but leave 0.01 for storage rent costs
    receive("withdraw safe") {
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    // this will withdraw a specific amount but leave 0.01 for storage rent costs
    receive(msg: Withdraw) {
        require(sender() == self.deployer, "Only deployer is allowed to withdraw");
        let amount: Int = min(msg.amount, myBalance() - context().value - self.MinTonForStorage);
        require(amount > 0, "Insufficient balance");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: amount,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }
 
    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}

Deploy

Get value

Send increment

Send decrement

Send Add{3}

Send Subtract{2}

Send MultiMath{1,0,2}

Send MultiMath{0,3,3}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 21\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/03-sender.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-sender.html
================================================
[HTML Document converted to Markdown]

File: 03-sender.html
Size: 8.65 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Sending TON Coins

This contract allows to withdraw TON coins from its balance. Notice that only the deployer is permitted to do that, otherwise this money could be stolen.

The withdrawn funds are sent as value on an outgoing message to the sender. It's a good idea to set the `bounce` flag explicitly to `true` (although this also the default), so if the outgoing message fails for any reason, the money would return to the contract.

Contracts need to have a non-zero balance so they can pay storage costs occasionally, otherwise they may get deleted. This contract can make sure you always leave 0.01 TON which is [enough](https://ton.org/docs/develop/smart-contracts/fees#storage-fee) to store 1 KB of state for 2.5 years.

## The intricate math

`myBalance()` is the contract balance including the value for gas sent on the incoming message. `myBalance() - context().value` is the balance without the value for gas sent on the incoming message.

Send mode `SendRemainingValue` will add to the outgoing value any excess left from the incoming message after all gas costs are deducted from it.

Send mode `SendRemainingBalance` will ignore the outgoing value and send the entire balance of the contract. Note that this will not leave any balance for storage costs so the contract may be deleted.

> **Info**: More details for different sending modes can check [here](https://docs.tact-lang.org/book/message-mode#combining-modes-with-flags)

[All Examples](all)

import "@stdlib/deploy";

contract MessageSender with Deployable {

    deployer: Address;
    lastSender: Address;
 
    init() {
        self.deployer = sender(); // sender() of init is who deployed the contract
        self.lastSender = newAddress(0, 0); // zero address
    }

    receive("who") {
        if (sender() == self.deployer) {
            dump("deployer");
        } else {
            dump("not deployer!");
        }
    }
 
    receive("hello") {
        if (sender() != self.lastSender) {
            self.lastSender = sender();
            dump("hello new sender!");
        }
    }
}

Deploy

Get balance

Send 1 TON

Send withdraw all

Send withdraw safe

Send Withdraw{1 TON}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 22\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 9



================================================
FILE: docs/03-structs.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-structs.html
================================================
[HTML Document converted to Markdown]

File: 03-structs.html
Size: 7.94 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Message Sender

Every incoming message is sent from some contract that has an address.

You can query the address of the message sender by calling `sender()`. Alternatively, the address is also available through `context().sender`.

The sender during execution of the `init()` method of the contract is the address who deployed the contract.

## Authenticating messages

The main way to authenticate an incoming message, particularly for priviliges actions, is to verify the sender. This field is secure and impossible to fake.

> **Info**: More detail about context can be found here: [context()](https://docs.tact-lang.org/ref/core-contextstate/#context)

[All Examples](all)

import "@stdlib/deploy";

struct Point {
    x: Int as int64;
    y: Int as int64;
}

struct Params {
    name: String = "Satoshi";   // default value
    age: Int? = null;           // optional field
    point: Point;               // nested structs
}

message Add {
    point: Point;               // message can hold a struct
}

contract Structs with Deployable {

    // contract persistent state variables
    s1: Point;
    s2: Params;

    init() {
        self.s1 = Point{x: 2, y: 3};
        self.s2 = Params{point: self.s1};
    }

    receive("show ops") {
        // temporary variable
        let s: Point = Point{x: 4, y: 5};

        self.s1 = s;
    }

    receive(msg: Add) {
        self.s1.x = self.s1.x + msg.point.x;
        self.s1.y = self.s1.y + msg.point.y;
    }

    get fun point(): Point {
        return self.s1;
    }

    get fun params(): Params {
        return self.s2;
    }
}

Deploy

Send who (from deployer)

Send who (from sender 2)

Send hello (from deployer)

Send hello (from sender 2)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 23\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/03-textual-messages.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/03-textual-messages.html
================================================
[HTML Document converted to Markdown]

File: 03-textual-messages.html
Size: 8.44 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Structs

Structs allow you to combine multiple primitives together in a more semantic way. They're a great tool to make your code more readable.

Structs can define complex data types that contain multiple fields of different types. They can also be nested.

Structs can also include both default fields and optional fields. This can be quite useful when you have many fields but don't want to keep respecifying them.

Structs are also useful as return values from _getters_ or other internal functions. They effectively allow a single getter to return multiple return values.

The order of fields does not matter. Unlike other languages, Tact does not have any padding between fields.

**Info**: You can check more "Optionals" examples here: [Optionals](/04-optionals)

## Structs vs. messages

Structs and messages are almost identical with the only difference that messages have a 32-bit header containing their unique numeric id. This allows messages to be used with receivers since the contract can tell different types of messages apart based on this id.

[All Examples](all)

import "@stdlib/deploy";

contract Receivers with Deployable {

    val: Int as int64;
 
    init() {
        self.val = 0;
    }
 
    // this receiver is called when the string "increment" is received in an incoming string comment message
    receive("increment") {
        self.val = self.val + 1;
    }

    // this receiver is called when the string "decrement" is received in an incoming string comment message
    receive("decrement") {
        self.val = self.val - 1;
    }

    // this receiver is called when the string "increment by 2" is received in an incoming string comment message
    receive("increment by 2") {
        self.val = self.val + 2;
    }

    // if none of the previous receivers match the comment string, this one is called
    receive(msg: String) {
        dump("unknown textual message received:");
        dump(msg);
    }
 
    get fun value(): Int {
        return self.val;
    }
}

Deploy

Get point

Get params

Send show ops

Send Add{Point{1,-1}}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 24\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/04-arrays.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-arrays.html
================================================
[HTML Document converted to Markdown]

File: 04-arrays.html
Size: 9.21 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Textual Messages

Most of the messages we saw in the previous example were defined with the `message` keyword. They are considered _binary_ messages. This means that when somebody wants to send them, they serialize them into bits and bytes of binary data.

The disadvantage with binary messages is that they're not human readable.

## Hardware wallets and blind signing

When working with dangerous contracts that handle a lot of money, users are encouraged to use hardware wallets like [Ledger](https://www.ledger.com/). Hardware wallets cannot decode binary messages to confirm to the user what they're actually signing.

Tact supports textual messages for this reason, since they're human readable and can easily be confirmed with users, eliminating phishing risks.

**Textual messages are limited because they cannot contain arguments.** Future versions of Tact will add this functionality.

## Using the comment field

If you've ever made a transfer using a TON wallet, you probably noticed that you can add a _comment_ (also known as a _memo_ or a _tag_). This is how textual messages are sent.

Receivers for textual messages just define the string that they expect. Tact automatically does string matching and calls the matching receiver when a comment message arrives.

[All Examples](all)

import "@stdlib/deploy";

// this contract records the last 5 timestamps of when "timer" message was received
contract Arrays with Deployable {

    const MaxSize: Int = 5;
    arr: map; // this is our array implemented with a map
    arrLength: Int as uint8 = 0;
    arrStart: Int as uint8 = 0; // our array is cyclic

    init() {}

    // push an item to the end of the array
    fun arrPush(item: Int) {
        if (self.arrLength < self.MaxSize) {
            self.arr.set(self.arrLength, item);
            self.arrLength = self.arrLength + 1;
        } else {
            self.arr.set(self.arrStart, item);
            self.arrStart = (self.arrStart + 1) % self.MaxSize;
        }
    }

    // iterate over all items in the array and dump them
    fun arrPrint() {
        let i: Int = self.arrStart;
        repeat (self.arrLength) {
            dump(self.arr.get(i)!!); // !! tells the compiler this can't be null
            i = (i + 1) % self.MaxSize;
        }
    }

    // record the timestamp when each "timer" message is received
    receive("timer") {
        let timestamp: Int = now();
        self.arrPush(timestamp);
    }

    receive("dump") {
        self.arrPrint();
    }

    get fun length(): Int {
        return self.arrLength;
    }

    get fun mapping(): map {
        return self.arr;
    }
}

Deploy

Get value

Send increment

Send decrement

Send increment by 2

Send increment by 3

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 25\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 3, Paragraphs: 9



================================================
FILE: docs/04-current-time.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-current-time.html
================================================
[HTML Document converted to Markdown]

File: 04-current-time.html
Size: 8.08 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Arrays

You can implement simple arrays in Tact by using the `map` type.

To create an array, define a map with an `Int` type as the key. This key will represent the index in the array. Additionally, include a variable to keep track of the number of items in the array.

The example contract records the last five timestamps when the `timer` message was received. These timestamps are stored in a cyclical array, implemented as a map.

## Limit the Number of Items

Maps are designed to hold a limited number of items. Only use a map if you know the maximum number of items it will contain. It's also a good idea to [write a test](https://github.com/tact-lang/tact-emulator) to populate the map with its maximum number of elements and observe how gas consumption behaves under stress.

If the number of items is unbounded and could potentially grow into the billions, you will need to architect your contract differently. We will discuss unbounded arrays later, under the topic of contract sharding.

[All Examples](all)

import "@stdlib/deploy";

contract CurrentTime with Deployable {

    deployTime: Int as uint32;

    init() {
        self.deployTime = now(); // returns unix time, the number of seconds since the epoch
    }

    receive("wait 10s") {
        require(now() - self.deployTime > 10, "Did not wait long enough");
        dump("thanks for waiting 10 seconds");
    }

    receive("wait 10d") {
        require(now() - self.deployTime > 10\*24\*60\*60, "Did not wait long enough");
        dump("thanks for waiting 10 days");
    }

    get fun unixTime(): Int {
        return now();
    }

    get fun stringTime(): String {
        let sb: StringBuilder = beginString();
        sb.append(now().toString());
        sb.append(" seconds elapsed since 1 January 1970");
        return sb.toString();
    }
}

Deploy

Get length

Get mapping

Send timer

Send dump

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 26\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/04-decimal-point.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-decimal-point.html
================================================
[HTML Document converted to Markdown]

File: 04-decimal-point.html
Size: 8.51 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Current Time

Many blockchains rely on the current _block number_ to give a sense of progress to contracts. This approach isn't well suited for TON because contracts on TON can run on multiple workchains and those may have different block seqnos.

In TON, the best practice is to rely on the current time instead, which is available by calling `now()`. Standard [unix time](https://en.wikipedia.org/wiki/Unix_time) is returned, meaning the number of seconds since 1 January 1970.

Transactions are not executed until validators add them to a new block. The current time will therefore be the timestamp of the new block when called in the context of a _receiver_.

If you need to store the time in state or encode it in a message, use `Int as uint32`.

If you need to compare two points in time simply subtract the earlier from the later. This will give you the number of seconds between the two. Divide by 60 to get the difference in minutes, by 60 \* 60 to get the difference in hours and by 24 \* 60 \* 60 to get the difference in days.

[All Examples](all)

import "@stdlib/deploy";

message Deposit {
    amount: Int as coins; // nano-tons
}

message Withdraw {
    amount: Int as coins; // nano-tons
}

const SecondsPerYear: Int = 365 \* 24 \* 60 \* 60;

contract Interest with Deployable {
 
    interestPercent: Int as int32;
    depositTime: Int as uint32 = 0;  // seconds since the epoch
    depositAmount: Int as coins = 0; // nano-tons
    totalEarned: Int as coins = 0;   // nano-tons

    init() {
        self.interestPercent = 3250; // 3.25% yearly interest rate in percent-mille
    }

    receive(msg: Deposit) {
        require(self.depositAmount == 0, "No multiple deposits");
        self.depositTime = now();
        self.depositAmount = msg.amount;
    }

    receive(msg: Withdraw) {
        require(msg.amount >= self.depositAmount, "Cannot withdraw more than deposit");
        self.depositAmount = self.depositAmount - msg.amount;
        let durationSeconds: Int = now() - self.depositTime;
        let earned: Int = msg.amount \* durationSeconds \* self.interestPercent / SecondsPerYear / 100000;
        dump(earned);
        self.totalEarned = self.totalEarned + earned;
    }

    get fun total(): Int {
        return self.totalEarned; // in nano-tons
    }
}

Deploy

Get unixTime

Get stringTime

Send wait 10s

Send wait 10d

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 27\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 1, Paragraphs: 7



================================================
FILE: docs/04-functions.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-functions.html
================================================
[HTML Document converted to Markdown]

File: 04-functions.html
Size: 8.83 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Decimal Point

All numbers in Tact are integers. Floating point types are not used in smart contracts because they're [unpredictable](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision).

Arithmetics with dollars, for example, requires 2 decimal places. How can we represent the number `1.25` if we can only work with integers? The answer is to work with _cents_. So `1.25` becomes `125`. We just remember that the two lowest digits are coming after the decimal point.

In the same way, working with TON coins has 9 decimal places instead of 2. So the amount 1.25 TON is actually the number `1250000000` - we call these _nano-tons_ instead of cents.

## Calculating interest

This example calculates the earned interest over a deposit of 500 TON coins. The yearly interest rate in the example is 3.25%.

Since we can't hold the number `3.25` we will use thousandth of a percent as unit ([percent-mille](https://en.wikipedia.org/wiki/Per_cent_mille)). So 3.25% becomes `3250` (3.25 \* 1000).

On withdraw, to calculate earned interest, we multiply the amount by the fraction of a year that passed (duration in seconds divided by total seconds in a year) and then by the interest rate divided by 100,000 (100% in percent-mille, meaning 100 \* 1000).

**Info**: Notice that total is returned in nano-tons.

[All Examples](all)

import "@stdlib/deploy";

struct TokenInfo {
    ticker: String;
    decimals: Int as uint8;
}

// this is a global static function that can be called from anywhere
fun average(a: Int, b: Int): Int {
    return (a + b) / 2;
}

contract Functions with Deployable {

    deployer: Address;

    init() {
        self.deployer = sender();
    }

    // this contract method can be called from within this contract and access its variables
    fun onlyDeployer() {
        require(sender() == self.deployer, "Only the deployer is permitted here");
    }

    receive("priviliged") {
        self.onlyDeployer();
    }

    // this contract method returns multiple return values using a struct
    fun getInfo(index: Int): TokenInfo {
        if (index == 1) {
            return TokenInfo{ticker: "TON", decimals: 9};
        }
        if (index == 2) {
            return TokenInfo{ticker: "ETH", decimals: 18};
        }
        return TokenInfo{ticker: "unknown", decimals: 0};
    }

    receive("best L1") {
        let best: TokenInfo = self.getInfo(1);
        self.reply(best.ticker.asComment());
    }

    get fun result(): Int {
        return average(1, 10);
    }
}

Deploy

Get total

Send Deposit{500}

Send Withdraw{500}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 28\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/04-if-statements.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-if-statements.html
================================================
[HTML Document converted to Markdown]

File: 04-if-statements.html
Size: 7.40 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Functions

To make your code more readable and promote code reuse, you're encouraged to divide it into functions.

Functions in Tact start with the `fun` keyword. Functions can receive multiple input arguments and can optionally return a single output value. You can return a `struct` if you want to return multiple values.

Global static functions are defined outside the scope of contracts. You can call them from anywhere, but they can't access the contract or any of the contract state variables.

Contract methods are functions that are defined inside the scope of a contract. You can call them only from other contract methods like _receivers_ and _getters_. They can access the contract's state variables.

[All Examples](all)

import "@stdlib/deploy";

contract IfStatements with Deployable {

    val: Int as int32;

    init() {
        self.val = 17;
    }

    receive("check1") {
        if (self.val > 10) {
            dump("larger than 10");
        }
    }

    receive("check2")  {
        if (self.val > 100) {
            dump("larger than 100");
        } else {
            dump("smaller than 100");
        }
    }

    receive("check3") {
        if (self.val > 1000) {
            dump("larger than 1000");
        } else if (self.val > 500) {
            dump("between 500 and 1000");
        } else {
            dump("smaller than 500");
        }
    }
}

Deploy

Get result

Send priviliged

Send best L1

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 29\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 6



================================================
FILE: docs/04-loops.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-loops.html
================================================
[HTML Document converted to Markdown]

File: 04-loops.html
Size: 7.37 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# If Statements

Tact supports if statements in a similar syntax to most programming languages that you're used to. Curly braces are required though, so you can't leave them out.

The condition of the statement can be any boolean expression.

There is no `switch` statement in Tact. If you need to need to handle a group of outcomes separately, follow the `else if` pattern you can see in the third example.

[All Examples](all)

import "@stdlib/deploy";

contract Loops with Deployable {

    init() {}

    receive("loop1") {
        let sum: Int = 0;
        let i: Int = 0;
        repeat (10) {               // repeat exactly 10 times
            i = i + 1;
            sum = sum + i;
        }
        dump(sum);
    }

    receive("loop2") {
        let sum: Int = 0;
        let i: Int = 0;
        while (i < 10) {            // loop while a condition is true
            i = i + 1;
            sum = sum + i;
        }
        dump(sum);
    }

    receive("loop3") {
        let sum: Int = 0;
        let i: Int = 0;
        do {                        // loop until a condition is true
            i = i + 1;
            sum = sum + i;
        } until (i >= 10);
        dump(sum);
    }

    receive("out of gas") {
        let i: Int = 0;
        while (i < pow(10, 6)) {    // 1 million iterations is too much
            i = i + 1;
        }
        dump(i);
    }
}

Deploy

Send check1

Send check2

Send check3

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 30\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 5



================================================
FILE: docs/04-maps.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-maps.html
================================================
[HTML Document converted to Markdown]

File: 04-maps.html
Size: 9.72 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Loops

Tact does not support traditional `for` loops, but its loop statements are equivalent and can easily implement the same things. Also note that Tact does not support `break` and `continue` statements in loops like some languages.

The `repeat` loop statement input number must fit within an `int32`, otherwise an exception will be thrown.

The condition of the `while` and `until` loop statements can be any boolean expression.

Smart contracts consume gas for execution. The amount of gas is proportional to the number of iterations. The last example iterates too many times and reverts due to an out of gas exception.

[All Examples](all)

import "@stdlib/deploy";

struct TokenInfo {
    ticker: String;
    decimals: Int;
}

// messages can contain maps
message Replace {
    items: map;
}

contract Maps with Deployable {

    // maps with Int as key
    mi1: map;
    mi2: map;
    mi3: map;
    mi4: map;
    
    // maps with Address as key
    ma1: map;
    ma2: map;
    ma3: map;
    ma4: map;

    init(arg: map) {
        // no need to initialize maps if they're empty
        self.mi2 = arg;
    }

    receive("set keys") {
        // keys are Int
        self.mi1.set(17, TokenInfo{ticker: "SHIB", decimals: 9});
        self.mi2.set(0x9377433ff21832, true);
        self.mi3.set(pow(2,240), pow(2,230));
        self.mi4.set(-900, address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"));
        // keys are Address
        self.ma1.set(address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"), TokenInfo{ticker: "DOGE", decimals: 18});
        self.ma2.set(address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"), true);
        self.ma3.set(address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"), ton("1.23"));
        self.ma4.set(address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"), myAddress());
    }

    receive("delete keys") {
        // keys are Int
        self.mi1.set(17, null);
        self.mi2.set(0x9377433ff21832, null);
        self.mi3.set(pow(2,240), null);
        self.mi4.set(-900, null);
        // keys are Address
        self.ma1.set(address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"), null);
        self.ma2.set(address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"), null);
        self.ma3.set(address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"), null);
        self.ma4.set(address("UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"), null);
    }

    receive("clear") {
        self.mi1 = emptyMap();
        self.mi2 = emptyMap();
        self.mi3 = emptyMap();
        self.mi4 = emptyMap();
        self.ma1 = emptyMap();
        self.ma2 = emptyMap();
        self.ma3 = emptyMap();
        self.ma4 = emptyMap();
    }

    receive(msg: Replace) {
        // replace all items in the map with those coming in the message
        self.mi4 = msg.items;
    }

    // if the key is not found, the get() method returns null
    get fun oneItem(key: Int): Address? {
        return self.mi4.get(key);
    }

    get fun itemCheck(): String {
        if (self.mi1.get(17) == null) {
            return "not found";
        }
        let item: TokenInfo = self.mi1.get(17)!!; // !! tells the compiler this can't be null
        return item.ticker;
    }

    // you can return maps from getters
    get fun allItems(): map {
        return self.ma1;
    }
}

Deploy

Send loop1

Send loop2

Send loop3

Send out of gas

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 31\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 6



================================================
FILE: docs/04-optionals.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/04-optionals.html
================================================
[HTML Document converted to Markdown]

File: 04-optionals.html
Size: 9.18 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Maps

Maps are a dictionary type that can hold an arbitrary number of items, each under a different key.

The keys in maps can either be an `Int` type or an `Address` type.

You can check if a key is found in the map by calling the `get()` method. This will return `null` if the key is missing or the value if the key is found. Replace the value under a key by calling the `set()` method.

Integers in maps stored in state currently use the largest integer size (257-bit). Future versions of Tact will let you optimize the encoding size.

## Limit the number of items

Maps are designed to hold a limited number of items. Only use a map if you know the upper bound of items that it may hold. It's also a good idea to [write a test](https://github.com/tact-lang/tact-emulator) to add the maximum number of elements to the map and see how gas behaves under stress.

If the number of items is unbounded and can potentially grow to billions, you'll need to architect your contract differently. We will discuss unbounded maps later on under the topic of contract sharding.

[All Examples](all)

import "@stdlib/deploy";

struct StrctOpts {
    sa: Int?;
    sb: Bool?;
    sc: Address?;
}

message MsgOpts {
    ma: Int?;
    mb: Bool?;
    mc: Address?;
    md: StrctOpts?;
}

contract Optionals with Deployable {

    ca: Int?;
    cb: Bool?;
    cc: Address?;
    cd: StrctOpts?;

    init(a: Int?, b: Bool?, c: Address?) {
        self.ca = a;
        self.cb = b;
        self.cc = c;
        self.cd = StrctOpts{sa: null, sb: true, sc: null};
    }

    receive(msg: MsgOpts) {
        let i: Int = 12;
        if (msg.ma != null) {
            i = i + msg.ma!!; // !! tells the compiler this can't be null
            self.ca = i;
        }
    }

    get fun optInt(): Int? {
        return self.ca;
    }

    get fun optIntVal(): Int {
        if (self.ca == null) {
            return -1;
        } else {
            return self.ca!!; // !! tells the compiler this can't be null
        }
    }

    get fun optNested(): Int? {
        if (self.cd != null && (self.cd!!).sa != null) {
            return (self.cd!!).sa!!; // !! tells the compiler this can't be null
        } else {
            return null;
        }
    }
}

Deploy

Get oneItem(-900)

Get itemCheck

Get allItems

Send set keys

Send delete keys

Send clear

Send Replace{{-900:my}}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 32\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/05-the-ownable-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/05-the-ownable-trait.html
================================================
[HTML Document converted to Markdown]

File: 05-the-ownable-trait.html
Size: 7.69 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Optionals

Optionals are variables or struct fields that can be null and don't necessarily hold a value. They are useful to reduce state size when the variable isn't necessarily used.

You can make any variable optional by adding `?` after its type.

Optional variables that are not defined hold the `null` value. You cannot access them without checking for `null` first.

If you're certain an optional variable is not null, append to the end of its name `!!` to access its value. Trying to access the value without `!!` will result in a compilation error.

[All Examples](all)

// this trait has to be imported
import "@stdlib/ownable";
import "@stdlib/deploy";

// the Ownable trait can limit certain actions to the owner only
contract Counter with Deployable, Ownable {

    owner: Address; // The Ownable trait requires you to add this exact state variable
    val: Int as uint32;
 
    init() {
        self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case
        self.val = 0;
    }
 
    // this message is available to anyone
    receive("increment") {
        self.val = self.val + 1;
    }

    // this message in only available to the owner
    receive("double") {
        self.requireOwner();
        self.val = self.val \* 2;
    }
 
    get fun value(): Int {
        return self.val;
    }

    // get fun owner(): Address is added automatically to query who the owner is
}

Deploy

Get optInt

Get optIntVal

Get optNested

Send MsgOpts{ma:5}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 33\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 1, Paragraphs: 6



================================================
FILE: docs/05-the-ownable-transferable-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/05-the-ownable-transferable-trait.html
================================================
[HTML Document converted to Markdown]

File: 05-the-ownable-transferable-trait.html
Size: 8.74 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# The Ownable Trait

Tact allows you to add common boilerplate behaviors to your contract by using traits.

The Ownable trait allows the contract to set an `owner` role, which can have higher priviliges from everybody else.

For example, if your contract allows upgrades, it would make sense to limit upgrades to the owner only, otherwise anyone could break the contract.

Be aware that dapps are supposed to be _decentralized_ and an owner role is by definition [centralized](https://defi.org/ton). If you're building a dapp, try to minimize reliance on Ownable.

Note that this trait doesn't allow the owner to transfer ownership to a different owner.

## How to use Ownable

Define a state variable named `owner: Address` and call `self.requireOwner()` in priviliged receivers.

> Info: The Ownable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/ownable.tact)

[All Examples](all)

// this trait has to be imported
import "@stdlib/ownable";
import "@stdlib/deploy";

// the OwnableTransferable trait can limit certain actions to the owner only
contract Counter with Deployable, OwnableTransferable {

    owner: Address; // The OwnableTransferable trait requires you to add this exact state variable
    val: Int as uint32;
 
    init() {
        self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case
        self.val = 0;
    }
 
    // this message is available to anyone
    receive("increment") {
        self.val = self.val + 1;
    }

    // this message in only available to the owner
    receive("double") {
        self.requireOwner();
        self.val = self.val \* 2;
    }
 
    get fun value(): Int {
        return self.val;
    }

    // receive(msg: ChangeOwner) is added automatically to transfer ownership
    // get fun owner(): Address is added automatically to query who the owner is
}

Deploy

Get owner

Get value

Send increment (from deployer)

Send increment (from sender 2)

Send double (from deployer)

Send double (from sender 2)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 34\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 3, Images: 0, Headings: 2, Paragraphs: 9



================================================
FILE: docs/05-the-resumable-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/05-the-resumable-trait.html
================================================
[HTML Document converted to Markdown]

File: 05-the-resumable-trait.html
Size: 8.71 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# The Ownable-Transferable Trait

The Ownable-Transferable trait is almost identical to the Ownable trait that we covered in the previous example.

It adds one important feature which is the ability for the owner to transfer ownership to a new owner. This can also be used to renounce ownership completely by transferring ownership to an unusable address like the zero address.

If you're building a dapp and aiming for decentralization, always prefer this trait over Ownable. At some point in the dapps future, when you consider the owner role no longer unnecessary, you will be able to renounce ownership and make the dapp fully decentralized.

## How to use OwnableTransferable

Use it in a contract just like Ownable. Define a state variable named `owner: Address` and call `self.requireOwner()` in priviliged receivers.

Your contract will automatically handle the `ChangeOwner{newOwner: Address}` message which allows the owner to transfer ownership.

> Info: The OwnableTransferable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/ownable.tact)

[All Examples](all)

// this trait has to be imported
import "@stdlib/stoppable";
import "@stdlib/ownable";
import "@stdlib/deploy";

// the Resumable trait allows the owner to stop/resume the contract which can limit certain actions
contract Counter with Deployable, Resumable {

    owner: Address; // The Resumable trait requires you to add this exact state variable
    stopped: Bool;  // The Resumable trait requires you to add this exact state variable
    val: Int as uint32;
 
    init() {
        self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case
        self.stopped = false;
        self.val = 0;
    }
 
    // this message will only work as long as the contract is not stopped
    receive("increment") {
        self.requireNotStopped();
        self.val = self.val + 1;
    }
 
    get fun value(): Int {
        return self.val;
    }

    // receive("Resume") is added automatically to allow owner to resume the contract
    // receive("Stop") is added automatically to allow owner to stop the contract
    // get fun stopped(): Bool is added automatically to query if contract is stopped
    // get fun owner(): Address is added automatically to query who the owner is
}

Deploy

Get owner

Get value

Send ChangeOwner{sender 2} (from deployer)

Send ChangeOwner{deployer} (from sender 2)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 35\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/05-the-stoppable-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/05-the-stoppable-trait.html
================================================
[HTML Document converted to Markdown]

File: 05-the-stoppable-trait.html
Size: 8.74 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# The Resumable Trait

The Resumable trait is almost identical to the Stoppable trait that we covered in the previous example.

It adds one important feature which is the ability for the owner to resume a stopped contract.

The Stoppable trait by itself may be a little dangerous because the owner cannot change their mind. If you're not sure which trait to use, use this one.

This trait implicitly adds the Ownable and Stoppable traits. Note that the Ownable trait doesn't allow the owner to transfer ownership to a different owner. To allow changing ownership, also add the `OwnableTransferable` trait.

## How to use Resumable

Define state variables named `owner: Address` and `stopped: Bool` and call `self.requireNotStopped()` on actions that should be stopped.

**Info**: The OwnableTransferable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/stdlib/libs/stoppable.tact)

[All Examples](all)

// this trait has to be imported
import "@stdlib/stoppable";
import "@stdlib/ownable";
import "@stdlib/deploy";

// the Stoppable trait allows the owner to stop the contract which can limit certain actions
contract Counter with Deployable, Stoppable {

    owner: Address; // The Stoppable trait requires you to add this exact state variable
    stopped: Bool;  // The Stoppable trait requires you to add this exact state variable
    val: Int as uint32;
 
    init() {
        self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case
        self.stopped = false;
        self.val = 0;
    }
 
    // this message will only work until the contract was stopped
    receive("increment") {
        self.requireNotStopped();
        self.val = self.val + 1;
    }
 
    get fun value(): Int {
        return self.val;
    }

    // receive("Stop") is added automatically to allow owner to stop the contract
    // get fun stopped(): Bool is added automatically to query if contract is stopped
    // get fun owner(): Address is added automatically to query who the owner is
}

Deploy

Get stopped

Get value

Send increment

Send Stop

Send Resume

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 36\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/05-your-own-trait.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/05-your-own-trait.html
================================================
[HTML Document converted to Markdown]

File: 05-your-own-trait.html
Size: 10.10 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# The Stoppable Trait

Tact allows you to add common boilerplate behaviors to your contract by using traits.

The Stoppable trait allows the contract to allow an `owner` role to stop the contract.

Consider for example a protocol where users can deposit funds, like a staking service or a compounding vault. If somebody discovers a security issue, we may want to stop the contract from accepting funds from new users.

Note that this trait doesn't allow to resume the contract after it has been stopped.

This trait implicitly adds the Ownable trait. Note that the Ownable trait doesn't allow the owner to transfer ownership to a different owner. To allow changing ownership, also add the `OwnableTransferable` trait.

## How to use Stoppable

Define state variables named `owner: Address` and `stopped: Bool` and call `self.requireNotStopped()` on actions that should be stopped.

**Info**: The stoppable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/stdlib/libs/stoppable.tact)

[All Examples](all)

import "@stdlib/deploy";
import "@stdlib/ownable";

/////////////////////////////////////////////////////////////////////////////
// this trait adds basic analytics to any contract to track how popular it is

trait Trackable with Ownable {          // your new trait may rely on other traits

    // Storage

    owner: Address;
    numMessagesReceived: Int;           // your new trait may add state variables but should not specify their size

    // Receivers

    receive("reset stats") {            // your new trait may handle specific messages
        self.requireOwner();
        self.numMessagesReceived = 0;
        self.reply("reset done".asComment());
    }

    // Getters

    get fun stats(): Int {              // your new trait may add getters
        return self.numMessagesReceived;
    }

    // Methods

    fun receivedNewMessage() {          // your new trait may define new contract methods
        if (self.filterMessage()) {
            self.numMessagesReceived = self.numMessagesReceived + 1;
        }
    }

    virtual fun filterMessage(): Bool { // virtual functions can be overridden by users of this trait
        // the default filtering behavior is to ignore messages sent by the owner
        if (sender() == self.owner) {
            return false;
        }
        return true;
    }
}

/////////////////////////////////////////////////////////////////////////////
// this Counter contract is going to use our new trait to add analytics to it

contract Counter with Deployable, Trackable {

    owner: Address;                     // The Trackable trait requires this exact state variable
    numMessagesReceived: Int as uint64; // The Trackable trait requires this exact state variable
    val: Int as uint32;
 
    init() {
        self.owner = sender(); // we can initialize owner to any value we want, the deployer in this case
        self.numMessagesReceived = 0;
        self.val = 0;
    }
 
    receive("increment") {
        self.receivedNewMessage(); // here we are using our trait
        self.val = self.val + 1;
    }
 
    get fun value(): Int {
        return self.val;
    }

    // the trait allows us to override the default filtering behavior
    override fun filterMessage(): Bool {
        // our contract's custom filtering behavior is to remove all filters and count all messages
        return true;
    }

    // receive("reset stats") is added automatically to allow owner to reset the stats
    // get fun stats(): Int is added automatically to query the stats
    // get fun owner(): Address is added automatically to query who the owner is
}

Deploy

Get stopped

Get value

Send increment

Send Stop

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 37\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/06-authenticating-children.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-authenticating-children.html
================================================
[HTML Document converted to Markdown]

File: 06-authenticating-children.html
Size: 9.10 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Writing Your Own Trait

Tact doesn't support classical class inheritance and instead introduces the concept of _traits_. Traits are similar to simplified base classes that potentially add state variables, receivers, getters or contract methods.

Contracts can rely on multiple traits. Extract logic into a trait if you have multiple contracts that share this logic.

## The Trackable trait

This example shows how to write a new trait that adds simple analytics behavior to any contract.

This trait also makes use of the `virtual` keyword which lets the contract relying on the trait override some of the trait's behaviors. In the example, the default filter behavior ignores messages from owner in the analytics.

The contract relying on the trait can change this default behavior by specifying the `override` keyword and providing a new implementation to this method. In our case, the custom filter is to have no filters.

[All Examples](all)

import "@stdlib/deploy";

message HiFromParent {
    greeting: String;
}

message HiFromChild {
    fromSeqno: Int as uint64;
    greeting: String;
}

// we have multiple instances of the children
contract TodoChild {

    parent: Address; // we added this variable so a child always knows who the parent is
    seqno: Int as uint64;
 
    // when deploying an instance, we must specify its index (sequence number)
    init(parent: Address, seqno: Int) {
        require(sender() == parent, "not the parent");
        self.parent = parent;
        self.seqno = seqno;
    }

    receive(msg: HiFromParent) {
        require(sender() == self.parent, "Access denied");  // only the real parent can get here
       
        dump(self.seqno);
        dump("😃 handling hi from parent");
        self.reply(HiFromChild{fromSeqno: self.seqno, greeting: "sup"}.toCell());
    }
}

// we have one instance of the parent
contract TodoParent with Deployable {
 
    init() {}

    receive("greet 3") {
        let i: Int = 0;
        repeat (3) {
            i = i + 1;
            let init: StateInit = initOf TodoChild(myAddress(), i);
            send(SendParameters{
                to: contractAddress(init),
                body: HiFromParent{ greeting: "darling" }.toCell(),
                value: ton("0.1"),              // pay for message and potential deployment
                mode: SendIgnoreErrors,
                code: init.code,                // if child is not deployed, also deploy it
                data: init.data
            });
        }
    }

    receive(msg: HiFromChild) {
        let expectedAddress: Address = contractAddress(initOf TodoChild(myAddress(), msg.fromSeqno));
        
        require(sender() == expectedAddress, "Access denied");
        // only the real children can get here
        
        dump(msg.fromSeqno);
        dump("😑 handling hi from child");
    }
}

Deploy

Get value

Get stats

Send increment

Send reset stats

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 38\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/06-calc-contract-address.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-calc-contract-address.html
================================================
[HTML Document converted to Markdown]

File: 06-calc-contract-address.html
Size: 7.94 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Authenticating Children

If you look closely at the previous example you will notice that it is somewhat dangerous.

What happens if some user tries to send a `HiFromChild` message and impersonate a child? What happens if some user tries to send a `HiFromParent` message and impersonate the parent?

To add authentication that messages came from where we think they came from, we simply need to add `require()` in the beginning of every protected receiver and make sure that the sender is who we expect it is.

It is best practice to add this authentication to every message coming from a parent and every message coming from a child.

## Let's try to hack this contract

Try pressing the Send HiFromChild{1} button. This will send the parent an impersonated `HiFromChild` message, but from some user, not from a real child.

Since this code is now protected, it will notice that the sender is incorrect and reject the message with an access denied error.

**Info**: Having a error break in the \`Send HiFromChild{1}\` button is expected. Because only the message from the child can be accepted.

[All Examples](all)

import "@stdlib/deploy";

// first contract
contract Todo1 with Deployable {

    seqno: Int as uint64 = 1; // the code specifies the index (sequence number)

    init() {}

    get fun myAddress(): Address {
        return myAddress();
    }

    get fun otherAddress(): Address {
        let init: StateInit = initOf Todo2();
        return contractAddress(init);
    }
}

// second contract
contract Todo2 with Deployable {

    seqno: Int as uint64 = 2; // the code specifies the index (sequence number)

    init() {}

    get fun myAddress(): Address {
        return myAddress();
    }

    get fun otherAddress(): Address {
        let init: StateInit = initOf Todo1();
        return contractAddress(init);
    }
}

Deploy

Send greet 3

Send HiFromChild{1}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 39\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/06-communicating-subcontract.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-communicating-subcontract.html
================================================
[HTML Document converted to Markdown]

File: 06-communicating-subcontract.html
Size: 8.87 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Calculate Contract Address

When a contract is deployed to the chain, it receives an address by which users can refer to it and send it transactions.

In this example, we have two different contracts: `Todo1` and `Todo2`. They are deployed separately and each gets its own unique address. As we've seen before, a contract can always know its own address by running `myAddress()`.

The special bit in this example is that each contract can also get the address of the other contract by running `contractAddress(stateInit)`.

## How is the contract address generated?

Contract addresses on TON are [derived](https://docs.ton.org/learn/overviews/addresses#account-id) from the initial code of the contract (the compiled bytecode) and the initial data of the contract (the arguments of init).

Both contracts don't have any constructor arguments, so their initial data is the identical. Their addresses are different because their code is different.

The combination of the inital code and the initial data is called the _stateInit_ of the contract. Tact gives easy access to the _stateInit_ using the `initOf` statement.

[All Examples](all)

import "@stdlib/deploy";

message HiFromParent {
    greeting: String;
}

message HiFromChild {
    fromSeqno: Int as uint64;
    greeting: String;
}

// we have multiple instances of the children
contract TodoChild {

    seqno: Int as uint64;
 
    // when deploying an instance, we must specify its index (sequence number)
    init(seqno: Int) {
        self.seqno = seqno;
    }

    receive(msg: HiFromParent) {
        dump(self.seqno);
        dump("😃 handling hi from parent");
        self.reply(HiFromChild{fromSeqno: self.seqno, greeting: "sup"}.toCell());
    }
}

// we have one instance of the parent
contract TodoParent with Deployable {
 
    init() {}

    receive("greet 3") {
        let i: Int = 0;
        repeat (3) {
            i = i + 1;
            let init: StateInit = initOf TodoChild(i);
            send(SendParameters{
                to: contractAddress(init),
                body: HiFromParent{greeting: "darling"}.toCell(),
                value: ton("0.1"),              // pay for message and potential deployment
                mode: SendIgnoreErrors,
                code: init.code,                // if child is not deployed, also deploy it
                data: init.data
            });
        }
    }

    receive(msg: HiFromChild) {
        dump("😑 handling hi from child");
        dump(msg.fromSeqno);
    }
}

Deploy

Get Todo1.myAddress

Get Todo1.otherAddress

Get Todo2.myAddress

Get Todo2.otherAddress

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 40\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/06-contract-deploy-another.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-contract-deploy-another.html
================================================
[HTML Document converted to Markdown]

File: 06-contract-deploy-another.html
Size: 7.82 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Communicating with Children

In a parent-child relationship, the user would normally just deploy the parent. This is what's happening here when you press the Deploy button.

In this example, the user is only supposed to communicate with the parent. You can send the parent contract a message by pressing the Send greet 3 button.

This message will instruct the parent to send its own `HiFromParent` message to the first 3 children. Every child will respond to the greeting by sending the parent its own `HiFromChild` back.

## How can parent know if a child is deployed?

You can't send a message to a contract until it is deployed. How can the parent guarantee that they're not communicating with a child that wasn't deployed yet?

The best practice is to include the _stateInit_ on every message. This way, if the child isn't deployed, it will be. If the child is already deployed, this field will be ignored.

This is called lazy deployment.

[All Examples](all)

import "@stdlib/deploy";

// we're going to have multiple instances of this contract, each with a different seqno
contract Todo with Deployable {

    seqno: Int as uint64;
 
    // when deploying an instance, we must specify its index (sequence number)
    init(seqno: Int) {
        self.seqno = seqno;
    }

    // this message handler will just debug print the seqno so we can see when it's called
    receive("identify") {
        dump(self.seqno);
    }

    // this message handler will cause the contract to deploy the second instance
    receive("deploy 2nd") {
        let init: StateInit = initOf Todo(2);
        let address: Address = contractAddress(init);
        send(SendParameters{
            to: address,
            value: ton("0.1"),              // pay for message, the deployment and give some TON for storage
            mode: SendIgnoreErrors,
            code: init.code,                // attaching the state init will cause the message to deploy
            data: init.data,
            body: "identify".asComment()    // we must piggyback the deployment on another message
        });
    }
}

Deploy

Send greet 3

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 41\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/06-multiple-contract-instances.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-multiple-contract-instances.html
================================================
[HTML Document converted to Markdown]

File: 06-multiple-contract-instances.html
Size: 7.76 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# A Contract Deploying Another

Contracts are not necessarily only deployed by users, they can also be deployed by other contracts.

In this example, when pressing the Deploy button, we only deploy one contract instance - the one with constructor argument 1.

The second instance (with constructor argument 2) will be deployed by the first contract instance when it receives the `deploy 2nd` message. Send this message to the first instance by pressing the Send "deploy 2nd" to 1 button.

## Messages containing state init

The combination of the inital code and the initial data of a contract is called the _stateInit_ of the contract.

When sending any message to a contract, we can attach its _stateInit_ by specifying the `code` and `data` fields of the message. This will deploy the contract if it has not already been deployed. If the contract has already been deployed, these fields will be ignored.

Notice that in this example, we piggyback the deployment on the `indentify` message.

[All Examples](all)

import "@stdlib/deploy";

// we're going to have multiple instances of this contract, each with a different seqno
contract Todo with Deployable {

    seqno: Int as uint64;
 
    // when deploying an instance, we must specify its index (sequence number)
    init(seqno: Int) {
        self.seqno = seqno;
    }
 
    // each instance can calculate the address of every other instance
    get fun addressOf(otherSeqno: Int): Address {
        let init: StateInit = initOf Todo(otherSeqno);
        return contractAddress(init);
    }
}

Deploy

Send "identify" to 1

Send "identify" to 2

Send "deploy 2nd" to 1

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 42\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/06-parent-child.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-parent-child.html
================================================
[HTML Document converted to Markdown]

File: 06-parent-child.html
Size: 8.03 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Multiple Contract Instances

Instead of duplicating the code for the two contracts like in the previous example, we can write the code once and still deploy two separate instances. Each instance will have its own unique address.

We can do this by adding an argument to `init()`. When deploying the contract, we need to specify its init arguments. In this example we deploy twice, the first with the argument 1 and the second is deployed with 2.

We mentioned earlier that contract addresses on TON are [derived](https://docs.ton.org/learn/overviews/addresses#account-id) from the initial code of the contract (the compiled bytecode) and the initial data of the contract (the arguments of init).

Since we wrote the code once, the initial code is now identical. By adding an contructor argument, we've made the initial data different. This is why we're going to get two different addresses.

[All Examples](all)

import "@stdlib/deploy";

// we have multiple instances of the children
contract TodoChild {

    seqno: Int as uint64;
 
    // when deploying an instance, we must specify its index (sequence number)
    init(seqno: Int) {
        self.seqno = seqno;
    }

    // this message handler will just debug print the seqno so we can see when it's called
    receive("identify") {
        dump(self.seqno);
    }
}

// we have one instance of the parent
contract TodoParent with Deployable {

    numChildren: Int as uint64;
 
    init() {
        self.numChildren = 0;
    }

    // this message handler will cause the contract to deploy another child
    receive("deploy another") {
        self.numChildren = self.numChildren + 1;
        let init: StateInit = initOf TodoChild(self.numChildren);
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.1"),              // pay for message, the deployment and give some TON for storage
            mode: SendIgnoreErrors,
            code: init.code,                // attaching the state init will cause the message to deploy
            data: init.data,
            body: "identify".asComment()    // we must piggyback the deployment on another message
        });
    }

    get fun numChildren(): Int {
        return self.numChildren;
    }
}

Deploy

Get addressOf(1)

Get addressOf(2)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 43\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 2, Images: 0, Headings: 1, Paragraphs: 6



================================================
FILE: docs/06-unbounded-arrays.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-unbounded-arrays.html
================================================
[HTML Document converted to Markdown]

File: 06-unbounded-arrays.html
Size: 10.23 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Parent-Child Relationship

A very common design pattern in Tact is implementing two contracts with a parent-child relationship.

Under this pattern, we would normally have a single instance parent which is deployed by the user. This is the `TodoParent` contract in this example.

The child contract `TodoChild` will have multiple instances. These instances will normally be deployed by the parent by sending the parent a message.

Try this out. Press the Send "deploy another" to parent button multiple times to send the message to the parent and instruct it to deploy more and more children.

Also notice how we can omit the `Deployable` trait from the children. This trait is mostly useful for contracts that users deploy. Since the user only deploys the parent, omitting the trait from the children will explain our intent to readers.

## Unbounded data structures

An interesting property of this pattern is that the number of potential children is unbounded! We can have an infinite number of children.

In general, inifinite data structures that can actually scale to billions are very difficult to implement on blockchain efficiently. This pattern showcases the power of TON.

[All Examples](all)

import "@stdlib/deploy";
import "@stdlib/ownable";

message NewTodo {
    task: String;
}

message NewTodoResponse {
    seqno: Int as uint256;
}

message CompleteTodo {
    seqno: Int as uint256;
}

// users are supposed to interact with this parent contract only
contract TodoParent with Deployable, Ownable {
 
    owner: Address;
    numTodos: Int as uint256 = 0;

    init() {
        self.owner = sender(); // set the owner as the deployer
    }

    // anybody can add a new todo, not just the owner
    receive(msg: NewTodo) {
        self.numTodos = self.numTodos + 1;
        let init: StateInit = initOf TodoChild(myAddress(), self.numTodos);
        send(SendParameters{
            to: contractAddress(init),
            body: InternalSetTask{task: msg.task}.toCell(),
            value: ton("0.02"),             // pay for the deployment and leave some TON in the child for storage
            mode: SendIgnoreErrors,
            code: init.code,                // prepare the initial code when deploying the child contract
            data: init.data
        });
        self.reply(NewTodoResponse{seqno: self.numTodos}.toCell()); // this will return excess gas to sender
    }

    // only the owner can mark a todo as completed
    receive(msg: CompleteTodo) {
        self.requireOwner();
        require(msg.seqno <= self.numTodos, "Todo does not exist");
        send(SendParameters{ // this will forward excess gas
            to: contractAddress(initOf TodoChild(myAddress(), msg.seqno)),
            body: InternalComplete{excess: sender()}.toCell(),
            value: 0, /// TODO: https://github.com/tact-lang/tact/issues/31
            mode: SendRemainingValue + SendIgnoreErrors /// TODO: issues/31
        });
    }

    get fun numTodos(): Int {
        return self.numTodos;
    }

    get fun todoAddress(seqno: Int): Address {
        return contractAddress(initOf TodoChild(myAddress(), seqno));
    }
}

////////////////////////////////////////////////////////////////////////////
// child contract - internal interface that users shouldn't access directly

message InternalSetTask {
    task: String;
}

message InternalComplete {
    excess: Address;
}

struct TodoDetails {
    task: String;
    completed: Bool;
}

contract TodoChild {

    parent: Address;
    seqno: Int as uint256;
    task: String = "";
    completed: Bool = false;
 
    init(parent: Address, seqno: Int) {
        self.parent = parent;
        self.seqno = seqno;
    }

    receive(msg: InternalSetTask) {
        require(sender() == self.parent, "Parent only");
        self.task = msg.task;
    }

    receive(msg: InternalComplete) {
        require(sender() == self.parent, "Parent only");
        self.completed = true;
        send(SendParameters{ // this will return excess gas to original sender
            to: msg.excess,
            value: 0, /// TODO: https://github.com/tact-lang/tact/issues/31
            mode: SendRemainingBalance + SendIgnoreErrors /// TODO: issues/31
        });
    }

     get fun details(): TodoDetails {
        return TodoDetails{
            task: self.task, 
            completed: self.completed
        };
    }
}

Deploy

Get numChildren

Send "deploy another" to parent

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 44\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 9



================================================
FILE: docs/06-unbounded-maps.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/06-unbounded-maps.html
================================================
[HTML Document converted to Markdown]

File: 06-unbounded-maps.html
Size: 10.95 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Unbounded Arrays - Todo List

In general, infinite data structures that can grow to billions of elements are very difficult to implement on a blockchain. As the contract's persistent state grows in size, read and write operations become more expensive in terms of gas. In extreme cases, they may cost more than a transaction's gas limit, rendering the contract unusable.

Therefore, **it's important to design contracts with an upper bound on state size.** So, how would we implement a to-do list that can scale to billions of items?

## Infinitely scalable todo list

The secret to achieving infinite scalability on TON lies in sharding the data across multiple contracts. We can utilize the parent-child design pattern to achieve this.

In this example, each new todo item is deployed as a new child contract. Users interact with the child contracts through the `TodoParent` contract.

When the user sends the `NewTodo` message to the parent, the parent deploys a new child to hold the new item. If users want to query the item details, they can call the parent getter `todoAddress()` and then call the `details()` getter on the child.

**Info**: This example also handles gas efficiently. The excess gas from every operation is refunded to the original sender.

[All Examples](all)

import "@stdlib/deploy";

struct Metadata {
    symbol: String;
    totalSupply: Int;
}

message Transfer {
    amount: Int as coins;
    to: Address;
}

// the token parent, mostly used to query general metadata and get children addresses
contract TokenParent with Deployable {
 
    symbol: String;
    totalSupply: Int as coins;

    init() {
        self.symbol = "SHIB";
        self.totalSupply = 500 \* pow(10,9);
        self.mint(self.totalSupply, sender()); // mint the entire total supply to deployer
    }

    fun mint(amount: Int, to: Address) {
        let init: StateInit = initOf TokenChild(myAddress(), to);
        send(SendParameters{
            to: contractAddress(init),
            body: InternalAddTokens{amount: amount, origin: myAddress()}.toCell(),
            value: ton("0.03"),             // pay for the deployment and leave some TON in the child for storage
            mode: SendIgnoreErrors,
            code: init.code,                // deploy the child if needed
            data: init.data
        });
    }

    get fun metadata(): Metadata {
        return Metadata{symbol: self.symbol, totalSupply: self.totalSupply};
    }

    get fun childAddress(owner: Address): Address {
        return contractAddress(initOf TokenChild(myAddress(), owner));
    }
}

////////////////////////////////////////////////////////////////////////////
// child contract - the Transfer message is sent by users directly to a child

message InternalAddTokens {
    amount: Int as coins;
    origin: Address;
}

contract TokenChild {

    parent: Address;
    owner: Address;         // every child holds the balance of a different owner
    balance: Int as coins;  // this is the balance of the owner
 
    init(parent: Address, owner: Address) {
        self.parent = parent;
        self.owner = owner;
        self.balance = 0;
    }

    // sent by users to initiate a new transfer
    receive(msg: Transfer) {
        require(sender() == self.owner, "Access denied");
        require(self.balance >= msg.amount, "Insufficient balance");
        self.balance = self.balance - msg.amount;
        let init: StateInit = initOf TokenChild(self.parent, msg.to);
        send(SendParameters{
            to: contractAddress(init),
            body: InternalAddTokens{amount: msg.amount, origin: self.owner}.toCell(),
            value: ton("0.03"),             // pay for the deployment and leave some TON in the child for storage
            mode: SendIgnoreErrors,
            code: init.code,                // deploy the child if needed
            data: init.data
        });
        self.reply("transferred".asComment());
    }

    // internal message sent by one child to another to update balances
    receive(msg: InternalAddTokens) {
        if (msg.origin == self.parent) { // tokens originate in a mint
            require(sender() == self.parent, "Parent only");
        } else { // tokens originate in a Transfer
            require(sender() == contractAddress(initOf TokenChild(self.parent, msg.origin)), "Sibling only");
        }
        self.balance = self.balance + msg.amount;
    }

     get fun balance(): Int {
        return self.balance;
    }
}

Deploy

Get numTodos

Get details(todoAddress(2))

Send NewTodo{"bla"}

Send CompleteTodo{2}

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 45\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 7



================================================
FILE: docs/07-jetton-standard.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/07-jetton-standard.html
================================================
[HTML Document converted to Markdown]

File: 07-jetton-standard.html
Size: 18.42 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                         

# Unbounded Maps - Simplified Token

In general, inifinite data structures that can actually grow to billions of elements are very difficult to implement on blockchain. As the contract persistent state grows in size, read and write operations become more expensive in gas. In the extreme, they may cost more than a transaction gas limit, rendering the contract unusable.

**It is therefore important to design contracts to have an upper bound on state size.** If so, how would we implement a token with a map of balances that can scale to billions of holders?

## Infinitely scalable balance map

The secret of infinite scalability on TON is sharding the data across multiple contracts. We can apply the parent-child design pattern to do just this.

In this example, we hold the balance of every holder in a separate child contract.

To transfer tokens, the owner sends the `Transfer` message to the child contract holding their own balance. This will cause the child to deploy its sibling - the child contract holding the recipient's balance - by sending it the `InternalAddTokens` message.

This example also handles gas efficiently. The excess gas from every operation is refunded to the original sender.

[All Examples](all)

import "@stdlib/ownable";

message Mint {
    amount: Int;
    receiver: Address;
}

contract SampleJetton with Jetton {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;

    max\_supply: Int as coins; 

    init(owner: Address, content: Cell, max\_supply: Int) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;

        self.max\_supply = max\_supply; // Initial Setting for max\_supply
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not Owner");
        require(self.mintable, "Can't Mint Anymore");
        self.mint(msg.receiver, msg.amount, self.owner); // (to, amount, response\_destination)
    }

    receive("Mint: 100") { // Public Minting
        let ctx: Context = context();
        require(self.mintable, "Can't Mint Anymore");
        self.mint(ctx.sender, 100, self.owner);
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not Owner");
        self.mintable = false;
    }
} 

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

// ============================================================================================================ //
@interface("org.ton.jetton.master")
trait Jetton with Ownable {

    totalSupply: Int; // Already set initially 
    mintable: Bool;
    owner: Address;
    content: Cell;

    max\_supply: Int; // This is not in the TEP-74 interface

    receive(msg: TokenUpdateContent) {
        self.requireOwner();                // Allow changing content only by owner
        self.content = msg.content;         // Update content
    }

    receive(msg: TokenBurnNotification) {
        self.requireWallet(msg.owner);                     // Check wallet
        self.totalSupply = self.totalSupply - msg.amount; // Update supply

        if (msg.response\_destination != null) { // Cashback
            send(SendParameters{
                to: msg.response\_destination!!, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{
                    queryId: msg.queryId
                }.toCell()
            });
        }
    }

    // @to The Address receive the Jetton token after minting
    // @amount The amount of Jetton token being minted
    // @response\_destination The previous owner address
    fun mint(to: Address, amount: Int, response\_destination: Address) {
        require(self.totalSupply + amount <= self.max\_supply, "The total supply will be overlapping.");
        self.totalSupply = self.totalSupply + amount; // Update total supply

        let winit: StateInit = self.getJettonWalletInit(to); // Create message
        send(SendParameters{
            to: contractAddress(winit), 
            value: 0, 
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{ 
                queryId: 0,
                amount: amount,
                from: myAddress(),
                response\_destination: response\_destination,
                forward\_ton\_amount: 0,
                forward\_payload: emptySlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    fun requireWallet(owner: Address) {
        let ctx: Context = context();
        let winit: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(winit) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(myAddress(), address);
    }

    // ====== Get Methods ====== //
    get fun get\_jetton\_data(): JettonData {
        let code: Cell = self.getJettonWalletInit(myAddress()).code;
        return JettonData{ 
            totalSupply: self.totalSupply, 
            mintable: self.mintable, 
            owner: self.owner, 
            content: self.content, 
            walletCode: code
        };
    }

    get fun get\_wallet\_address(owner: Address): Address {
        let winit: StateInit = self.getJettonWalletInit(owner);
        return contractAddress(winit);
    }
}
// ============================================================ //
@interface("org.ton.jetton.wallet")
contract JettonDefaultWallet {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    balance: Int;
    owner: Address;
    master: Address;

    init(master: Address, owner: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenTransfer) { // 0xf8a7ea5
        let ctx: Context = context(); // Check sender
        require(ctx.sender == self.owner, "Invalid sender");

        // Gas checks
        let fwdFee: Int = ctx.readForwardFee() + ctx.readForwardFee();  
        let final: Int =  2 \* self.gasConsumption + self.minTonsForStorage + fwdFee;
        require(ctx.value > min(final, ton("0.01")), "Invalid value!!"); 

        // Update balance
        self.balance = self.balance - msg.amount; 
        require(self.balance >= 0, "Invalid balance");

        let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);  
        let walletAddress: Address = contractAddress(init);
        send(SendParameters{
                to: walletAddress, 
                value: 0,
                mode: SendRemainingValue, 
                bounce: false,
                body: TokenTransferInternal{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: self.owner,
                    response\_destination: msg.response\_destination,
                    forward\_ton\_amount: msg.forward\_ton\_amount,
                    forward\_payload: msg.forward\_payload
                }.toCell(),
                code: init.code,
                data: init.data
            });
    }

    receive(msg: TokenTransferInternal) { // 0x178d4519
        let ctx: Context = context();

        if (ctx.sender != self.master) {
            let sinit: StateInit = initOf JettonDefaultWallet(self.master, msg.from);
            require(contractAddress(sinit) == ctx.sender, "Invalid sender!");
        }

        // Update balance
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance"); 
        
        // Get value for gas
        let msgValue: Int = self.msgValue(ctx.value);  
        let fwdFee: Int = ctx.readForwardFee();
        msgValue = msgValue - msg.forward\_ton\_amount - fwdFee;
        
         // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete
        if (msg.forward\_ton\_amount > 0) { 
            send(SendParameters{
                to: self.owner,
                value: msg.forward\_ton\_amount,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                bounce: false,
                body: TokenNotification {
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forward\_payload: msg.forward\_payload
                }.toCell()
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.response\_destination != null) { 
            send(SendParameters {
                to: msg.response\_destination, 
                value: msgValue,  
                bounce: false,
                body: TokenExcesses { 
                    queryId: msg.queryId
                }.toCell(),
                mode: SendIgnoreErrors
            });
        }
    }

    receive(msg: TokenBurn) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");  // Check sender

        self.balance = self.balance - msg.amount; // Update balance
        require(self.balance >= 0, "Invalid balance");

        let fwdFee: Int = ctx.readForwardFee(); // Gas checks
        require(ctx.value > fwdFee + 2 \* self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");

        // Burn tokens
        send(SendParameters{  
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                owner: self.owner,
                response\_destination: self.owner
            }.toCell()
        });
    }

    get fun msgValue(value: Int): Int {
        let msgValue: Int = value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);
        return msgValue;
    }

    bounced(src: bounced) {
        self.balance = self.balance + src.amount;
    }

    bounced(src: bounced) {
        self.balance = self.balance + src.amount;
    }

    get fun get\_wallet\_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf JettonDefaultWallet(self.master, self.owner)).code
        };
    }
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response\_destination: Address;
    custom\_payload: Cell?;
    forward\_ton\_amount: Int as coins;
    forward\_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response\_destination: Address;
    forward\_ton\_amount: Int as coins;
    forward\_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward\_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}

message(0x595f07bc) TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response\_destination: Address;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response\_destination: Address?;
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}

message TokenUpdateContent {
    content: Cell;
}

Deploy

Get metadata

Get balance(childAddress(deployer))

Get balance(childAddress(user2))

Send Transfer{100,user2} (from deployer)

Send Transfer{100,deployer} (from user2)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 2, 46\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 1, Images: 0, Headings: 2, Paragraphs: 8



================================================
FILE: docs/all.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/all.html
================================================
[HTML Document converted to Markdown]

File: all.html
Size: 7.50 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                      

[Hello World](00-hello-world)

[A Simple Counter](01-a-simple-counter)

[The Deployable Trait](01-the-deployable-trait)

[Integers](02-integers)

[Integer Operations](02-integer-ops)

[Bools](02-bools)

[Addresses](02-addresses)

[Strings](02-strings)

[Variables](02-variables)

[Constants](02-constants)

[Getters](03-getters)

[Receivers and Messages](03-receivers)

[Textual Messages](03-textual-messages)

[Structs](03-structs)

[Message Sender](03-sender)

[Throwing Errors](03-errors)

[Receiving TON Coins](03-receive-coins)

[Messages Between Contracts](03-messages-between-contracts)

[Sending TON Coins](03-send-coins)

[Emitting Logs](03-emit)

[If Statements](04-if-statements)

[Loops](04-loops)

[Functions](04-functions)

[Optionals](04-optionals)

[Maps](04-maps)

[Arrays](04-arrays)

[Current Time](04-current-time)

[Decimal Point](04-decimal-point)

[The Ownable Trait](05-the-ownable-trait)

[The Ownable-Transferable Trait](05-the-ownable-transferable-trait)

[The Stoppable Trait](05-the-stoppable-trait)

[The Resumable Trait](05-the-resumable-trait)

[Writing Your Own Trait](05-your-own-trait)

[Calculate Contract Address](06-calc-contract-address)

[Multiple Contract Instances](06-multiple-contract-instances)

[A Contract Deploying Another](06-contract-deploy-another)

[Parent-Child Relationship](06-parent-child)

[Communicating with Sub-Contract](06-communicating-subcontract)

[Authenticating Children](06-authenticating-children)

[Unbounded Arrays - Todo List](06-unbounded-arrays)

[Unbounded Maps - Simplified Token](06-unbounded-maps)

[Jetton Token](07-jetton-standard)

Tact-by-Example is open-sourced on [GitHub](https://github.com/tact-lang/tact-by-example) and was created by [@talkol](https://t.me/talkol)

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 3, 47\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language

HTML Statistics:
Links: 44, Images: 0, Headings: 0, Paragraphs: 0



================================================
FILE: docs/index.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/docs/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 2.48 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example                  

{ \_\_sveltekit\_1mts8mq = { env: {}, base: new URL(".", location).pathname.slice(0, -1), element: document.currentScript.parentElement }; const data = \[null,null\]; Promise.all(\[ import("./\_app/immutable/entry/start.03ac1d3b.js"), import("./\_app/immutable/entry/app.8e617dc5.js") \]).then((\[kit, app\]) => { kit.start(app, \_\_sveltekit\_1mts8mq.element, { node\_ids: \[0, 4\], data, form: null, error: null }); }); }

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language



================================================
FILE: src/app.html
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/app.html
================================================
[HTML Document converted to Markdown]

File: app.html
Size: 1.21 KB
Modified: Thu Jun 26 2025 16:14:15 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

   Tact by example         %sveltekit.head%

%sveltekit.body%

==================================================
HTML Metadata:
Title: Tact by example
Description: Learn smart contract programming by example using Tact language



================================================
FILE: src/routes/(examples)/00-hello-world/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/00-hello-world/content.md
================================================
# Hello World

This is probably the simplest possible Tact program. It will provide callers with the classic output "hello world".

Tact lets you write smart contracts. This code defines a single contract named `HelloWorld`. Smart contracts must be deployed to the blockchain network to be usable, try to deploy this contract by pressing the <span class="mdButton blue">Deploy</span> button.

Contract deployments usually cost gas. This website deploys to an [emulator](https://github.com/tact-lang/tact-emulator) of TON blockchain, so gas is emulated TON coin (which is free).

If you're unfamilar with terms like *contract*, *deployment* and *gas*, please [read this post](https://blog.ton.org/what_is_blockchain) first. It's a great introduction to all blockchain terminology you will need to learn Tact.

## A simple interaction

Contracts can have *getters* like `greeting()`. Getters are special external interface functions that allow users to query information from the contract. Try to call the getter by pressing the <span class="mdButton teal">Get greeting</span> button. Calling getters is free and does not cost gas.

Don't worry if some things aren't clear now, we will dive into getters in more detail later.


================================================
FILE: src/routes/(examples)/01-a-simple-counter/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/01-a-simple-counter/content.md
================================================
# A Simple Counter

This is a simple counter contract that allows users to increment its value.

This contract has a state variable `val` that persists between contract calls - the counter value. When persisted, this variable is encoded `as uint32` - a 32-bit unsigned integer. Contracts pay rent in proportion to the amount of persistent space they consume, so compact representations are encouraged.

State variables should be initialized in `init()` that runs on deployment of the contract.

## Receiving messages

This contract can receive **_messages_** from users.

Unlike getters that are just read-only, messages can do write operations and change the contract's persistent state. Incoming messages are processed in `receive()` methods as transactions and cost gas for the sender.

After deploying the contract, send the `increment` message by pressing the <span class="mdButton grape">Send increment</span> button in order to increase the counter value by one. Afterwards, call the getter `value()` to see that the value indeed changed.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: We will learn more in details about "getter" functions in the next example.
</div>



================================================
FILE: src/routes/(examples)/01-the-deployable-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/01-the-deployable-trait/content.md
================================================
# The Deployable Trait

Tact doesn't support classical class inheritance, but contracts can implement **_traits_**.

One commonly used trait is `Deployable`, which implements a simple receiver for the `Deploy` message. This helps deploy contracts in a standardized manner.

All contracts are deployed by sending them a message. While any message can be used for this purpose, best practice is to use the special `Deploy` message.

This message has a single field, `queryId`, provided by the deployer (usually set to zero). If the deployment succeeds, the contract will reply with a `DeployOk` message and echo the same `queryId` in the response.

---

If you're using Tact's [auto-generated](https://docs.tact-lang.org/ecosystem/tools/typescript#tact-contract-in-typescript) TypeScript classes to deploy, sending the deploy message should look like:

```ts
const msg = { $$type: "Deploy", queryId: 0n };
await contract.send(sender, { value: toNano(1) }, msg);
```

You can see the implementation of the trait [here](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/deploy.tact). Notice that the file **_deploy.tact_** needs to be imported from the standard library using the `import` keyword.



================================================
FILE: src/routes/(examples)/02-addresses/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-addresses/content.md
================================================
# Addresses

`Address` is another primitive data type. It represents standard addresses on the TON blockchain. Every smart contract on TON is identifiable by its address. Think of this as a unique id.

TON is divided into multiple chains called _workchains_. This allows to balance the load more effectively. One of the internal fields of the address is the workchain id:

- `0` - The standard workchain, for regular users. Your contracts will be here.

- `-1` - The masterchain, usually for validators. Gas on this chain is significantly more expensive, but you'll probably never use it.

There are multiple ways on TON to [represent](https://docs.ton.org/learn/overviews/addresses#bounceable-vs-non-bounceable-addresses) the same address. Notice in the contract that the bouncable and non-bouncable representations of the same address actually generate the exact same value. Inside the contract, it doesn't matter which representation you use.

## State costs

Most addresses take 267-bit to store (3 flag bits indicating standard address, 8-bit for the workchain id and 256-bit for the account id). This means that storing 1000 addresses [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about 0.191 TON per year.



================================================
FILE: src/routes/(examples)/02-bools/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-bools/content.md
================================================
# Bools

This primitive data type can hold the values `true` or `false`.

`Bool` is convenient for boolean and logical operations. It is also useful for storing flags.

The only supported operations with booleans are `&&` `||` `!` - if you try to add them, for example, the code will not compile.

## State costs

Persisting bools to state is very space-efficient, they only take 1-bit. **Storing 1000 bools in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about 0.00072 TON per year.**



================================================
FILE: src/routes/(examples)/02-constants/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-constants/content.md
================================================
# Constants

Unlike variables, constants cannot change. Their values are calculated in _compile-time_ and cannot change during execution.

Constant initializations must be relatively simple and only rely on values known during compilation. If you add two numbers for example, the compiler will calculate the result during build and put the result in your compiled code.

You can read constants both in **_receivers_** and in **_getters_**.

Unlike contract variables, **constants don't consume space in persistent state. Their values are stored directly in the code cell.**

There isn't much difference between constants defined outside of a contract and inside the contract. Those defined outside can be used by other contracts in your project.



================================================
FILE: src/routes/(examples)/02-integer-ops/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-integer-ops/content.md
================================================
# Integer Operations

Since all runtime calculations with integers are done at 257-bit, overflows are quite rare. An overflow can happen if the result of a math operation is too big to fit.

**For example, multiplying 2^256 by 2^256 will not fit within 257-bit.**

Nevertheless, if any math operation overflows, an exception will be thrown, and the transaction will fail. You could say that Tact's math is safe by default.

There is no problem with mixing variables of different state sizes in the same calculation. At runtime, they are all the same type—**always 257-bit signed**. This is the largest supported integer type, so they all fit.

## Decimal Point with Integers

Arithmetic with dollars, for example, requires two decimal places. How can we represent the number `1.25` if we are only able to work with integers? The solution is to work with _cents_. In this way, `1.25` becomes `125`. We simply remember that the two rightmost digits represent the numbers after the decimal point.

Similarly, working with TON coins requires nine decimal places instead of two. Therefore, the amount of 1.25 TON, which can be represented in Tact as `ton("1.25")`, is actually the number `1250000000`.

**We refer to these as _nano-tons_ rather than cents.**



================================================
FILE: src/routes/(examples)/02-integers/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-integers/content.md
================================================
# Integers

Tact supports a number of primitive data types that are tailored for smart contract use.

`Int` is the primary number type. Math in smart contracts is always done with integers and never with floating points since floats are [unpredictable](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision).

The runtime type `Int` is _always_ 257-bit signed, so all runtime calculations are done at 257-bit. This should be large enough for pretty much anything you need as it's large enough to hold the number of atoms in the universe.

Persistent state variables can be initialized inline or inside `init()`. If you forget to initialize a state variable, the code will not compile.

## State costs

When encoding `Int` to persistent state, we will usually use smaller representations than 257-bit to reduce storage cost. The persistent state size is specified in every declaration of a state variable after the `as` keyword.

- Storing 1000 257-bit integers in state [costs](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees) about **0.184 TON** per year.
- Storing 1000 32-bit integers only costs **0.023 TON** per year by comparison.



================================================
FILE: src/routes/(examples)/02-strings/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-strings/content.md
================================================
# Strings

Tact has basic support for strings. Strings support unicode and don't have any special escape characters like `\n`.

The use of strings in smart contracts should be quite limited. Smart contracts are very exact programs for managing money, they're not intended for interactive CLI.

Strings are immutable. Once a sequence of characters is created, this sequence cannot be modified.

If you need to concatenate strings in run-time, you can use a `StringBuilder`. This object handles gas efficiently and supports `append()` of various types to the string.


================================================
FILE: src/routes/(examples)/02-variables/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/02-variables/content.md
================================================
# Variables

The most important variables are those that are persisted in state and retain their value between contract executions. They must be defined in the scope of the contract like `contractVar1`.

Persisting data in state costs gas. The contract must pay rent periodically from its balance. State storage is expensive, about [4 TON per MB per year](https://ton.org/docs/develop/smart-contracts/fees#how-to-calculate-fees). If the contract runs out of balance, the data will be deleted. If you need to store large amounts of data, like images, a service like [TON Storage](https://ton.org/docs/participate/ton-storage/storage-faq) would be more suitable.

Persistent state variables can only change in _receivers_ by sending messages as transactions. **Sending these transactions will cost gas to users.**

Executing _getters_ is read-only, they can access all variables, but cannot change state variables. They are free to execute and don't cost any gas.

Local variables like `localVar1` are temporary. They're not persisted to state. You can define them in any function and they will only exist in run-time during the execution of the function. You can change their value in _getters_ too.



================================================
FILE: src/routes/(examples)/03-emit/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-emit/content.md
================================================
# Emitting Logs

It is sometimes useful to emit events from the contract in order to indicate that certain things happened.

This data can later be analyzed off-chain and indexed by using [RPC API](https://orbs.com/ton-access) to query all transactions sent to the contract.

Consider for example a staking contract that wants to indicate how much time passed before users unstaked for analytics purposes. By analyzing this data, the developer can think of improvements to the product.

One way to achieve this is by sending messages back to the sender using `self.reply()` or by sending messages to the zero address. These two methods work, but they are not the most efficient in terms of gas.

The `emit()` function will output a message (binary or textual) from the contract. This message does not actually have a recipient and is very gas-efficient because it doesn't actually need to be delivered.

The messages emitted in this way are still recorded on the blockchain and can be analyzed by anyone at any later time.


================================================
FILE: src/routes/(examples)/03-errors/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-errors/content.md
================================================
# Throwing Errors

Processing an incoming message in a transaction isn't always successful. The contract may encounter some error and fail.

This can be due to an explicit decision of the contract author, usually by writing a `require()` on a condition that isn't met, or this may happen implicitly due to some computation error in run-time, like a math overflow.

When an error is thrown, the transaction reverts. This means that all persistent state changes that took place during this transaction, even those that happened before the error was thrown, are all reverted and return to their original values.

## Notifying the sender about the error

How would the sender of the incoming message know that the message they had sent was rejected due to an error?

All communication is via messages, so naturally the sender should receive a message about the error. TON will actually return the original message back to the sender and mark it as *bounced* - just like a snail mail letter that couldn't be delivered.


================================================
FILE: src/routes/(examples)/03-getters/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-getters/content.md
================================================
# Getters

Getters are special contract functions that allow users to query information from the contract.

Contract methods starting with the prefix `get fun` are all getters. You can define as many getters are you want. Each getter must also specify its return type - `counter()` for example returns an `Int`.

Calling getters is free and does not cost gas. The call is executed by a full node and doesn't go through consensus with all the validators nor is added to a new block.

Getters are read-only, they cannot change the contract persistent state.

If we were to omit the `get` keyword from the function declaration of a getter, it will stop being a getter. External users would no longer be able call this function and it would essentially become a private method of the contract.

## Getters between contracts

**A contract cannot execute a getter of another contract.**

Getters are only executable by end-users off-chain. Since contracts are running on-chain, they do not have access to each other's getters.

So, if you can't call a getter, how can two contracts communicate?

The only way for contracts to communicate on-chain is by sending messages to each other. Messages are handled in _receivers_.

> **Info**: TON Blockchain is an asynchronous blockchain, which means that smart contracts can interact with each other only by sending messages.



================================================
FILE: src/routes/(examples)/03-messages-between-contracts/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-messages-between-contracts/content.md
================================================
# Messages Between Contracts

Different contracts can communicate with each other only by sending messages. This example showcases two separate contracts working in tandem:

- `Counter` - A simple counter that can increment only by 1.
- `BulkAdder` - This contract instructs `Counter` to increment multiple times.

Click the **Deploy** button to deploy both contracts. To make the counter reach 5, send the `Reach` message to BulkAdder by clicking the **Send Reach 5** button.

Observe the number of messages exchanged between the two contracts. Each message is processed as a _separate_ transaction. Also note that BulkAdder cannot call a _getter_ on Counter; it must send a `query` message instead.

## Who's Paying for Gas

**By default, the original sender is responsible for covering the gas costs of the entire cascade of messages they initiate.** This is funded by the original TON coin value sent with the first `Reach` message.

Internally, this is managed by each message handler forwarding the remaining excess TON coin value to the next message it sends.

**Challenge**: Try to modify the code to refund the original sender any unused excess gas.



================================================
FILE: src/routes/(examples)/03-receive-coins/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-receive-coins/content.md
================================================
# Receiving TON Coins

Every contract has a TON coin balance. This balance is used to pay ongoing rent for storage and should not run out otherwise the contract may be deleted. You can store extra coins in the balance for any purpose.

Every incoming message normally carries some TON coin value sent by the sender. This value is used to pay gas for handling this message. Unused excess will stay in the contract balance. If the value doesn't cover the gas cost, the transaction will revert.

You can query the contract balance with `myBalance()` - note that the value is in nano-tons (like cents, just with 9 decimals). The balance already contains the incoming message value.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: More detail about myBalance() can be found here: <a href="https://docs.tact-lang.org/ref/core-common/#mybalance">myBalance()</a>
</div>

## Refunding senders

If the transaction reverts, unused excess value will be sent back to sender on the _bounced_ message.

You can also refund the excess if the transaction succeeds by sending it back using `self.reply()` in a response message. This is the best way to guarantee senders are only paying for the exact gas that their message consumed.



================================================
FILE: src/routes/(examples)/03-receivers/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-receivers/content.md
================================================
# Receivers and Messages

In TON, users interact with contracts by sending them messages. Different contracts can only communicate with each other by sending each other messages.

Since users actually use wallet contracts, messages from users are actually messages coming from just another contract.

Sending a message to a contract costs gas and is processed in the course of a transaction. The transaction executes when validators add the transaction to a new block. This can take a few seconds. Messages are also able to change the contract's persistent state.

## Receivers

When designing your contract, make a list of every operation that your contract supports, then, define a message for each operation, and finally, implement a handler for each message containing the logic of what to do when it arrives.

Contract methods named `receive()` are the handlers that process each incoming message type. Tact will automatically route every incoming message to the correct receiver listening for it according to its type. A message is only handled by one receiver.

Messages are defined using the `message` keyword. They can carry input arguments. Notice that for integers, you must define the encoding size, just like in state variables. When somebody sends the message, they serialize it over the wire.


================================================
FILE: src/routes/(examples)/03-send-coins/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-send-coins/content.md
================================================
# Sending TON Coins

This contract allows to withdraw TON coins from its balance. Notice that only the deployer is permitted to do that, otherwise this money could be stolen.

The withdrawn funds are sent as value on an outgoing message to the sender. It's a good idea to set the `bounce` flag explicitly to `true` (although this also the default), so if the outgoing message fails for any reason, the money would return to the contract.

Contracts need to have a non-zero balance so they can pay storage costs occasionally, otherwise they may get deleted. This contract can make sure you always leave 0.01 TON which is [enough](https://ton.org/docs/develop/smart-contracts/fees#storage-fee) to store 1 KB of state for 2.5 years.

## The intricate math

`myBalance()` is the contract balance including the value for gas sent on the incoming message. `myBalance() - context().value` is the balance without the value for gas sent on the incoming message.

Send mode `SendRemainingValue` will add to the outgoing value any excess left from the incoming message after all gas costs are deducted from it.

Send mode `SendRemainingBalance` will ignore the outgoing value and send the entire balance of the contract. Note that this will not leave any balance for storage costs so the contract may be deleted.

> **Info**: More details for different sending modes can check [here](https://docs.tact-lang.org/book/message-mode#combining-modes-with-flags)



================================================
FILE: src/routes/(examples)/03-sender/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-sender/content.md
================================================
# Message Sender

Every incoming message is sent from some contract that has an address.

You can query the address of the message sender by calling `sender()`. Alternatively, the address is also available through `context().sender`.

The sender during execution of the `init()` method of the contract is the address who deployed the contract.

## Authenticating messages

The main way to authenticate an incoming message, particularly for priviliges actions, is to verify the sender. This field is secure and impossible to fake.

> **Info**: More detail about context can be found here: [context()](https://docs.tact-lang.org/ref/core-contextstate/#context)



================================================
FILE: src/routes/(examples)/03-structs/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-structs/content.md
================================================
# Structs

Structs allow you to combine multiple primitives together in a more semantic way. They're a great tool to make your code more readable.

Structs can define complex data types that contain multiple fields of different types. They can also be nested.

Structs can also include both default fields and optional fields. This can be quite useful when you have many fields but don't want to keep respecifying them.

Structs are also useful as return values from _getters_ or other internal functions. They effectively allow a single getter to return multiple return values.

The order of fields does not matter. Unlike other languages, Tact does not have any padding between fields.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: You can check more "Optionals" examples here: <a href="/04-optionals">Optionals</a>
</div>

## Structs vs. messages

Structs and messages are almost identical with the only difference that messages have a 32-bit header containing their unique numeric id. This allows messages to be used with receivers since the contract can tell different types of messages apart based on this id.



================================================
FILE: src/routes/(examples)/03-textual-messages/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/03-textual-messages/content.md
================================================
# Textual Messages

Most of the messages we saw in the previous example were defined with the `message` keyword. They are considered _binary_ messages. This means that when somebody wants to send them, they serialize them into bits and bytes of binary data.

The disadvantage with binary messages is that they're not human readable.

## Hardware wallets and blind signing

When working with dangerous contracts that handle a lot of money, users are encouraged to use hardware wallets like [Ledger](https://www.ledger.com/). Hardware wallets cannot decode binary messages to confirm to the user what they're actually signing.

Tact supports textual messages for this reason, since they're human readable and can easily be confirmed with users, eliminating phishing risks.

**Textual messages are limited because they cannot contain arguments.** Future versions of Tact will add this functionality.

## Using the comment field

If you've ever made a transfer using a TON wallet, you probably noticed that you can add a _comment_ (also known as a _memo_ or a _tag_). This is how textual messages are sent.

Receivers for textual messages just define the string that they expect. Tact automatically does string matching and calls the matching receiver when a comment message arrives.



================================================
FILE: src/routes/(examples)/04-arrays/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-arrays/content.md
================================================
# Arrays

You can implement simple arrays in Tact by using the `map` type.

To create an array, define a map with an `Int` type as the key. This key will represent the index in the array. Additionally, include a variable to keep track of the number of items in the array.

The example contract records the last five timestamps when the `timer` message was received. These timestamps are stored in a cyclical array, implemented as a map.

## Limit the Number of Items

Maps are designed to hold a limited number of items. Only use a map if you know the maximum number of items it will contain. It's also a good idea to [write a test](https://github.com/tact-lang/tact-emulator) to populate the map with its maximum number of elements and observe how gas consumption behaves under stress.

If the number of items is unbounded and could potentially grow into the billions, you will need to architect your contract differently. We will discuss unbounded arrays later, under the topic of contract sharding.



================================================
FILE: src/routes/(examples)/04-current-time/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-current-time/content.md
================================================
# Current Time

Many blockchains rely on the current *block number* to give a sense of progress to contracts. This approach isn't well suited for TON because contracts on TON can run on multiple workchains and those may have different block seqnos. 

In TON, the best practice is to rely on the current time instead, which is available by calling `now()`. Standard [unix time](https://en.wikipedia.org/wiki/Unix_time) is returned, meaning the number of seconds since 1 January 1970. 

Transactions are not executed until validators add them to a new block. The current time will therefore be the timestamp of the new block when called in the context of a *receiver*.

If you need to store the time in state or encode it in a message, use `Int as uint32`.

If you need to compare two points in time simply subtract the earlier from the later. This will give you the number of seconds between the two. Divide by 60 to get the difference in minutes, by 60 * 60 to get the difference in hours and by 24 * 60 * 60 to get the difference in days.


================================================
FILE: src/routes/(examples)/04-decimal-point/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-decimal-point/content.md
================================================
# Decimal Point

All numbers in Tact are integers. Floating point types are not used in smart contracts because they're [unpredictable](https://learn.microsoft.com/en-us/cpp/build/why-floating-point-numbers-may-lose-precision).

Arithmetics with dollars, for example, requires 2 decimal places. How can we represent the number `1.25` if we can only work with integers? The answer is to work with _cents_. So `1.25` becomes `125`. We just remember that the two lowest digits are coming after the decimal point.

In the same way, working with TON coins has 9 decimal places instead of 2. So the amount 1.25 TON is actually the number `1250000000` - we call these _nano-tons_ instead of cents.

## Calculating interest

This example calculates the earned interest over a deposit of 500 TON coins. The yearly interest rate in the example is 3.25%.

Since we can't hold the number `3.25` we will use thousandth of a percent as unit ([percent-mille](https://en.wikipedia.org/wiki/Per_cent_mille)). So 3.25% becomes `3250` (3.25 \* 1000).

On withdraw, to calculate earned interest, we multiply the amount by the fraction of a year that passed (duration in seconds divided by total seconds in a year) and then by the interest rate divided by 100,000 (100% in percent-mille, meaning 100 \* 1000).

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: Notice that total is returned in nano-tons.

</div>



================================================
FILE: src/routes/(examples)/04-functions/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-functions/content.md
================================================
# Functions

To make your code more readable and promote code reuse, you're encouraged to divide it into functions.

Functions in Tact start with the `fun` keyword. Functions can receive multiple input arguments and can optionally return a single output value. You can return a `struct` if you want to return multiple values.

Global static functions are defined outside the scope of contracts. You can call them from anywhere, but they can't access the contract or any of the contract state variables.

Contract methods are functions that are defined inside the scope of a contract. You can call them only from other contract methods like *receivers* and *getters*. They can access the contract's state variables.


================================================
FILE: src/routes/(examples)/04-if-statements/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-if-statements/content.md
================================================
# If Statements

Tact supports if statements in a similar syntax to most programming languages that you're used to. Curly braces are required though, so you can't leave them out.

The condition of the statement can be any boolean expression.

There is no `switch` statement in Tact. If you need to need to handle a group of outcomes separately, follow the `else if` pattern you can see in the third example.



================================================
FILE: src/routes/(examples)/04-loops/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-loops/content.md
================================================
# Loops

Tact does not support traditional `for` loops, but its loop statements are equivalent and can easily implement the same things. Also note that Tact does not support `break` and `continue` statements in loops like some languages.

The `repeat` loop statement input number must fit within an `int32`, otherwise an exception will be thrown.

The condition of the `while` and `until` loop statements can be any boolean expression.

Smart contracts consume gas for execution. The amount of gas is proportional to the number of iterations. The last example iterates too many times and reverts due to an out of gas exception.


================================================
FILE: src/routes/(examples)/04-maps/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-maps/content.md
================================================
# Maps

Maps are a dictionary type that can hold an arbitrary number of items, each under a different key.

The keys in maps can either be an `Int` type or an `Address` type.

You can check if a key is found in the map by calling the `get()` method. This will return `null` if the key is missing or the value if the key is found. Replace the value under a key by calling the `set()` method.

Integers in maps stored in state currently use the largest integer size (257-bit). Future versions of Tact will let you optimize the encoding size.

## Limit the number of items

Maps are designed to hold a limited number of items. Only use a map if you know the upper bound of items that it may hold. It's also a good idea to [write a test](https://github.com/tact-lang/tact-emulator) to add the maximum number of elements to the map and see how gas behaves under stress.

If the number of items is unbounded and can potentially grow to billions, you'll need to architect your contract differently. We will discuss unbounded maps later on under the topic of contract sharding.


================================================
FILE: src/routes/(examples)/04-optionals/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/04-optionals/content.md
================================================
# Optionals

Optionals are variables or struct fields that can be null and don't necessarily hold a value. They are useful to reduce state size when the variable isn't necessarily used.

You can make any variable optional by adding `?` after its type.

Optional variables that are not defined hold the `null` value. You cannot access them without checking for `null` first.

If you're certain an optional variable is not null, append to the end of its name `!!` to access its value. Trying to access the value without `!!` will result in a compilation error.


================================================
FILE: src/routes/(examples)/05-the-ownable-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/05-the-ownable-trait/content.md
================================================
# The Ownable Trait

Tact allows you to add common boilerplate behaviors to your contract by using traits.

The Ownable trait allows the contract to set an `owner` role, which can have higher priviliges from everybody else.

For example, if your contract allows upgrades, it would make sense to limit upgrades to the owner only, otherwise anyone could break the contract.

Be aware that dapps are supposed to be _decentralized_ and an owner role is by definition [centralized](https://defi.org/ton). If you're building a dapp, try to minimize reliance on Ownable.

Note that this trait doesn't allow the owner to transfer ownership to a different owner.

## How to use Ownable

Define a state variable named `owner: Address` and call `self.requireOwner()` in priviliged receivers.

> Info: The Ownable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/ownable.tact)



================================================
FILE: src/routes/(examples)/05-the-ownable-transferable-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/05-the-ownable-transferable-trait/content.md
================================================
# The Ownable-Transferable Trait

The Ownable-Transferable trait is almost identical to the Ownable trait that we covered in the previous example.

It adds one important feature which is the ability for the owner to transfer ownership to a new owner. This can also be used to renounce ownership completely by transferring ownership to an unusable address like the zero address.

If you're building a dapp and aiming for decentralization, always prefer this trait over Ownable. At some point in the dapps future, when you consider the owner role no longer unnecessary, you will be able to renounce ownership and make the dapp fully decentralized.

## How to use OwnableTransferable

Use it in a contract just like Ownable. Define a state variable named `owner: Address` and call `self.requireOwner()` in priviliged receivers.

Your contract will automatically handle the `ChangeOwner{newOwner: Address}` message which allows the owner to transfer ownership.

> Info: The OwnableTransferable trait is defined in the [standard library](https://github.com/tact-lang/tact/blob/main/src/stdlib/stdlib/libs/ownable.tact)



================================================
FILE: src/routes/(examples)/05-the-resumable-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/05-the-resumable-trait/content.md
================================================
# The Resumable Trait

The Resumable trait is almost identical to the Stoppable trait that we covered in the previous example.

It adds one important feature which is the ability for the owner to resume a stopped contract.

The Stoppable trait by itself may be a little dangerous because the owner cannot change their mind. If you're not sure which trait to use, use this one.

This trait implicitly adds the Ownable and Stoppable traits. Note that the Ownable trait doesn't allow the owner to transfer ownership to a different owner. To allow changing ownership, also add the `OwnableTransferable` trait.

## How to use Resumable

Define state variables named `owner: Address` and `stopped: Bool` and call `self.requireNotStopped()` on actions that should be stopped.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: The OwnableTransferable trait is defined in the <a href="https://github.com/tact-lang/tact/blob/main/stdlib/libs/stoppable.tact">standard library</a>

</div>



================================================
FILE: src/routes/(examples)/05-the-stoppable-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/05-the-stoppable-trait/content.md
================================================
# The Stoppable Trait

Tact allows you to add common boilerplate behaviors to your contract by using traits.

The Stoppable trait allows the contract to allow an `owner` role to stop the contract.

Consider for example a protocol where users can deposit funds, like a staking service or a compounding vault. If somebody discovers a security issue, we may want to stop the contract from accepting funds from new users.

Note that this trait doesn't allow to resume the contract after it has been stopped.

This trait implicitly adds the Ownable trait. Note that the Ownable trait doesn't allow the owner to transfer ownership to a different owner. To allow changing ownership, also add the `OwnableTransferable` trait.

## How to use Stoppable

Define state variables named `owner: Address` and `stopped: Bool` and call `self.requireNotStopped()` on actions that should be stopped.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: The stoppable trait is defined in the <a href="https://github.com/tact-lang/tact/blob/main/stdlib/libs/stoppable.tact">standard library</a>

</div>



================================================
FILE: src/routes/(examples)/05-your-own-trait/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/05-your-own-trait/content.md
================================================
# Writing Your Own Trait

Tact doesn't support classical class inheritance and instead introduces the concept of *traits*. Traits are similar to simplified base classes that potentially add state variables, receivers, getters or contract methods.

Contracts can rely on multiple traits. Extract logic into a trait if you have multiple contracts that share this logic.

## The Trackable trait

This example shows how to write a new trait that adds simple analytics behavior to any contract.

This trait also makes use of the `virtual` keyword which lets the contract relying on the trait override some of the trait's behaviors. In the example, the default filter behavior ignores messages from owner in the analytics.

The contract relying on the trait can change this default behavior by specifying the `override` keyword and providing a new implementation to this method. In our case, the custom filter is to have no filters.


================================================
FILE: src/routes/(examples)/06-authenticating-children/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-authenticating-children/content.md
================================================
# Authenticating Children

If you look closely at the previous example you will notice that it is somewhat dangerous.

What happens if some user tries to send a `HiFromChild` message and impersonate a child? What happens if some user tries to send a `HiFromParent` message and impersonate the parent?

To add authentication that messages came from where we think they came from, we simply need to add `require()` in the beginning of every protected receiver and make sure that the sender is who we expect it is.

It is best practice to add this authentication to every message coming from a parent and every message coming from a child.

## Let's try to hack this contract

Try pressing the <span class="mdButton grape">Send HiFromChild{1}</span> button. This will send the parent an impersonated `HiFromChild` message, but from some user, not from a real child.

Since this code is now protected, it will notice that the sender is incorrect and reject the message with an access denied error.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: Having a error break in the `Send HiFromChild{1}` button is expected. Because only the message from the child can be accepted.
</div>



================================================
FILE: src/routes/(examples)/06-calc-contract-address/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-calc-contract-address/content.md
================================================
# Calculate Contract Address

When a contract is deployed to the chain, it receives an address by which users can refer to it and send it transactions.

In this example, we have two different contracts: `Todo1` and `Todo2`. They are deployed separately and each gets its own unique address. As we've seen before, a contract can always know its own address by running `myAddress()`.

The special bit in this example is that each contract can also get the address of the other contract by running `contractAddress(stateInit)`.

## How is the contract address generated?

Contract addresses on TON are [derived](https://docs.ton.org/learn/overviews/addresses#account-id) from the initial code of the contract (the compiled bytecode) and the initial data of the contract (the arguments of init). 

Both contracts don't have any constructor arguments, so their initial data is the identical. Their addresses are different because their code is different.

The combination of the inital code and the initial data is called the *stateInit* of the contract. Tact gives easy access to the *stateInit* using the `initOf` statement.


================================================
FILE: src/routes/(examples)/06-communicating-subcontract/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-communicating-subcontract/content.md
================================================
# Communicating with Children

In a parent-child relationship, the user would normally just deploy the parent. This is what's happening here when you press the <span class="mdButton blue">Deploy</span> button.

In this example, the user is only supposed to communicate with the parent. You can send the parent contract a message by pressing the <span class="mdButton grape">Send greet 3</span> button.

This message will instruct the parent to send its own `HiFromParent` message to the first 3 children. Every child will respond to the greeting by sending the parent its own `HiFromChild` back.

## How can parent know if a child is deployed?

You can't send a message to a contract until it is deployed. How can the parent guarantee that they're not communicating with a child that wasn't deployed yet?

The best practice is to include the *stateInit* on every message. This way, if the child isn't deployed, it will be. If the child is already deployed, this field will be ignored.

This is called lazy deployment.


================================================
FILE: src/routes/(examples)/06-contract-deploy-another/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-contract-deploy-another/content.md
================================================
# A Contract Deploying Another

Contracts are not necessarily only deployed by users, they can also be deployed by other contracts.

In this example, when pressing the <span class="mdButton blue">Deploy</span> button, we only deploy one contract instance - the one with constructor argument 1.

The second instance (with constructor argument 2) will be deployed by the first contract instance when it receives the `deploy 2nd` message. Send this message to the first instance by pressing the <span class="mdButton grape">Send "deploy 2nd" to 1</span> button.

## Messages containing state init

The combination of the inital code and the initial data of a contract is called the *stateInit* of the contract.

When sending any message to a contract, we can attach its *stateInit* by specifying the `code` and `data` fields of the message. This will deploy the contract if it has not already been deployed. If the contract has already been deployed, these fields will be ignored.

Notice that in this example, we piggyback the deployment on the `indentify` message.



================================================
FILE: src/routes/(examples)/06-multiple-contract-instances/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-multiple-contract-instances/content.md
================================================
# Multiple Contract Instances

Instead of duplicating the code for the two contracts like in the previous example, we can write the code once and still deploy two separate instances. Each instance will have its own unique address.

We can do this by adding an argument to `init()`. When deploying the contract, we need to specify its init arguments. In this example we deploy twice, the first with the argument 1 and the second is deployed with 2.

We mentioned earlier that contract addresses on TON are [derived](https://docs.ton.org/learn/overviews/addresses#account-id) from the initial code of the contract (the compiled bytecode) and the initial data of the contract (the arguments of init).

Since we wrote the code once, the initial code is now identical. By adding an contructor argument, we've made the initial data different. This is why we're going to get two different addresses.


================================================
FILE: src/routes/(examples)/06-parent-child/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-parent-child/content.md
================================================
# Parent-Child Relationship

A very common design pattern in Tact is implementing two contracts with a parent-child relationship.

Under this pattern, we would normally have a single instance parent which is deployed by the user. This is the `TodoParent` contract in this example.

The child contract `TodoChild` will have multiple instances. These instances will normally be deployed by the parent by sending the parent a message. 

Try this out. Press the <span class="mdButton grape">Send "deploy another" to parent</span> button multiple times to send the message to the parent and instruct it to deploy more and more children.

Also notice how we can omit the `Deployable` trait from the children. This trait is mostly useful for contracts that users deploy. Since the user only deploys the parent, omitting the trait from the children will explain our intent to readers.

## Unbounded data structures

An interesting property of this pattern is that the number of potential children is unbounded! We can have an infinite number of children.

In general, inifinite data structures that can actually scale to billions are very difficult to implement on blockchain efficiently. This pattern showcases the power of TON.


================================================
FILE: src/routes/(examples)/06-unbounded-arrays/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-unbounded-arrays/content.md
================================================
# Unbounded Arrays - Todo List

In general, infinite data structures that can grow to billions of elements are very difficult to implement on a blockchain. As the contract's persistent state grows in size, read and write operations become more expensive in terms of gas. In extreme cases, they may cost more than a transaction's gas limit, rendering the contract unusable.

Therefore, **it's important to design contracts with an upper bound on state size.** So, how would we implement a to-do list that can scale to billions of items?

## Infinitely scalable todo list

The secret to achieving infinite scalability on TON lies in sharding the data across multiple contracts. We can utilize the parent-child design pattern to achieve this.

In this example, each new todo item is deployed as a new child contract. Users interact with the child contracts through the `TodoParent` contract.

When the user sends the `NewTodo` message to the parent, the parent deploys a new child to hold the new item. If users want to query the item details, they can call the parent getter `todoAddress()` and then call the `details()` getter on the child.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: This example also handles gas efficiently. The excess gas from every operation is refunded to the original sender.
</div>



================================================
FILE: src/routes/(examples)/06-unbounded-maps/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/06-unbounded-maps/content.md
================================================
# Unbounded Maps - Simplified Token

In general, inifinite data structures that can actually grow to billions of elements are very difficult to implement on blockchain. As the contract persistent state grows in size, read and write operations become more expensive in gas. In the extreme, they may cost more than a transaction gas limit, rendering the contract unusable.

**It is therefore important to design contracts to have an upper bound on state size.** If so, how would we implement a token with a map of balances that can scale to billions of holders?

## Infinitely scalable balance map

The secret of infinite scalability on TON is sharding the data across multiple contracts. We can apply the parent-child design pattern to do just this.

In this example, we hold the balance of every holder in a separate child contract.

To transfer tokens, the owner sends the `Transfer` message to the child contract holding their own balance. This will cause the child to deploy its sibling - the child contract holding the recipient's balance - by sending it the `InternalAddTokens` message.

This example also handles gas efficiently. The excess gas from every operation is refunded to the original sender.


================================================
FILE: src/routes/(examples)/07-jetton-standard/content.md
URL: https://github.com/tact-lang/tact-by-example/blob/main/src/routes/(examples)/07-jetton-standard/content.md
================================================
# Jetton Token - Fungible Tokens

This is a general Jetton implementation example from zero to one. Although we didn't devote much space to detailing Jetton Content, remember, there are two ways to implement Jetton Token Data, as outlined in [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

## Infinitely Scalable Balance Map

In this example, we launch the Jetton Root Token which introduces the `Jetton` trait below, having a limitation of `max_supply` upon deployment.

The minting process has two different methods:

1. Send the text message "Mint: 100" to mint the token.
2. Send the `Mint` message with the `amount` to mint the token.

### Close the Mint Function

In this example, we set the functionality for turn-off the minting process. The string text message with `Owner: MintClose` method is used to close the minting process. The method is only enable to the owner of the contract.

## Transfer

Notice that the Jetton Token standard also implements the `Transfer` method below. The `Transfer` method is the most important method in the Jetton Token Standard, allowing you to transfer the token to another account.

Excess gas from every operation is refunded to the original sender.

<div style="padding-left: 1em; margin: 1em 0; position: relative;">
    <div style="position: absolute; top: 0; bottom: 0%; left: 0; width: 3px; background-color: green;"></div>
    <strong>Info</strong>: TEP-74 is the Jetton Token Standard. Detail can check <a href="https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md">here</a>
    
</div>




# Repository: sbt-template
URL: https://github.com/getgems-community-tact/sbt-template
Branch: tutorial

## Directory Structure:
```
└── sbt-template/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── README.md
    ├── contracts/
        ├── imports/
            ├── stdlib.fc
        ├── sbt_collection/
            ├── messages.tact
            ├── sbt_collection.tact
            ├── structs.tact
        ├── sbt_item/
            ├── messages.tact
            ├── sbt_item.tact
            ├── structs.tact
    ├── jest.config.ts
    ├── scripts/
        ├── deployNftCollection.ts
        ├── readNftCollection.ts
    ├── tests/
        ├── NftCollection.spec.ts
    ├── wrappers/
        ├── SbtCollection.compile.ts
        ├── SbtCollection.ts
        ├── SbtItem.compile.ts
        ├── SbtItem.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/README.md
================================================
# NFT Standard in Tact

```bash
yarn build # To build contract
yarn test # To run test cases
yarn deploy # To deploy contract
yarn read # The way to read the smart contract data after your deployed the code
```

=> Remember to go to `depoly.ts` to change the parameters you want!

---

This GitHub repository is dedicated to an NFT standard(TEP-62)[https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md], which provides a set of guidelines and specifications for creating and managing non-fungible tokens (NFTs) on blockchain platforms.

The repository contains a comprehensive collection of code files, documentation, and resources that developers can utilize to implement the standard in their NFT projects. It offers a well-defined structure and functionality for NFT contracts, including features like token metadata, ownership transfers, and token enumeration. The repository also includes sample code and examples to help developers understand and implement the NFT standard more easily. Collaborators and contributors actively maintain and update the repository, ensuring it remains up-to-date with the latest advancements and best practices in the NFT ecosystem.

-   https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
-   https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
-   https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md

## More

[https://docs.tact-lang.org/_next/static/media/banner.0c18b672.jpeg]

For more information about this GitHub repository, or if you have any questions related to Tact, feel free to visit:

-   https://t.me/ton101
-   https://t.me/tactlang

If you have more specific questions related to the Tact Language, please refer to:

-   https://tact-lang.org/


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: contracts/sbt_collection/messages.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_collection/messages.tact
================================================
message RequestMint {
    index: Int as uint64;
    owner_address: Address;
    authority_address: Address;
    content: Cell;
}

message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator:  Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}


================================================
FILE: contracts/sbt_collection/sbt_collection.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_collection/sbt_collection.tact
================================================
import "./structs";
import "./messages";
import "./../sbt_item/sbt_item";

contract SbtCollection {
    
    const minTonsForStorage: Int = ton("0.03");

    next_item_index: Int as uint64 = 0;
    owner_address: Address;
    royalty_params: RoyaltyParams;                      
    collection_content: Cell;   

    init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams){
        self.owner_address = owner_address;
        self.collection_content = collection_content; 
        self.royalty_params = royalty_params;
    }

    // [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
    receive(msg: RequestMint){
        let ctx: Context = context(); // get sender Info
        require(ctx.sender == self.owner_address, "Invalid Sender");
        require(msg.index <= self.next_item_index, "Invalid Index");

        nativeReserve(self.minTonsForStorage, 2);

        let nft_init: StateInit = self.getSbtItemInit(msg.index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: 0, 
                bounce: false,
                mode: SendRemainingBalance,
                body: DeployItem {
                    owner_address: msg.owner_address,
                    content: msg.content,
                    authority_address: msg.authority_address
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        if (self.next_item_index == msg.index) {
            self.next_item_index = self.next_item_index + 1;
        }
    }

    receive(msg: GetRoyaltyParams) {   
        let ctx: Context = context(); // get sender Info
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  self.royalty_params.numerator,
                denominator: self.royalty_params.denominator,
                destination: self.owner_address
            }.toCell()
        });        
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {     
        let b: StringBuilder = beginString();
        let collectionDataString: String = self.collection_content.asSlice().asString();
        b.append(collectionDataString);
        b.append("meta.json"); // You can changed this your self.
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: b.toCell(), 
            owner_address: self.owner_address
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getSbtItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getSbtItemInit(item_index: Int): StateInit {
        return initOf SbtItem(myAddress(), item_index);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        let b: StringBuilder = beginString();
        let cc: String = self.collection_content.asSlice().asString();
        b.append(cc);
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params;
    }
}


================================================
FILE: contracts/sbt_collection/structs.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_collection/structs.tact
================================================
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}


================================================
FILE: contracts/sbt_item/messages.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_item/messages.tact
================================================
// storage::owner_address     = in_msg_body~load_msg_addr();
//         storage::content           = in_msg_body~load_ref();
//         storage::authority_address = in_msg_body~load_msg_addr();
//         storage::revoked_at        = 0;

message DeployItem {
    owner_address: Address;
    content: Cell?;
    authority_address: Address;
}

// prove_ownership#04ded148 query_id:uint64 dest:MsgAddress 
// forward_payload:^Cell with_content:Bool = InternalMsgBody;

message(0x04ded148) ProveOwnership {
    query_id: Int as uint64;
    dest: Address;
    forward_payload: Cell;
    with_content: Bool;
}

// ownership_proof#0524c7ae query_id:uint64 item_id:uint256 owner:MsgAddress 
// data:^Cell revoked_at:uint64 content:(Maybe ^Cell) = InternalMsgBody;

message(0x0524c7ae) OwnershipProof {
    query_id: Int as uint64;
    item_id: Int as uint256;
    owner: Address;
    data: Cell;
    revoked_at: Int as uint64;
    content: Cell?;
}

message(0xc18e86d2) OwnershipProofBounced {
    query_id: Int as uint64;
}

// request_owner#d0c3bfea query_id:uint64 dest:MsgAddress 
// forward_payload:^Cell with_content:Bool = InternalMsgBody;

message(0xd0c3bfea) RequestOwner {
    query_id: Int as uint64;
    dest: Address;
    forward_payload: Cell;
    with_content: Bool;
}

// owner_info#0dd607e3 query_id:uint64 item_id:uint256 initiator:MsgAddress owner:MsgAddress 
// data:^Cell revoked_at:uint64 content:(Maybe ^Cell) = InternalMsgBody;

message(0x0dd607e3) OwnerInfo {
    query_id: Int as uint64;
    item_id: Int as uint256;
    initiator: Address;
    owner: Address;
    data: Cell;
    revoked_at: Int as uint64;
    content: Cell?;
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}

message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}

// destroy#1f04537a query_id:uint64 = InternalMsgBody;
message(0x1f04537a) Destroy {
    query_id: Int as uint64;
}

// revoke#6f89f5e3 query_id:uint64 = InternalMsgBody;

message(0x6f89f5e3) Revoke {
    query_id: Int as uint64;
}

// take_excess#d136d3b3 query_id:uint64 = InternalMsgBody;

message(0xd136d3b3) TakeExcess {
    query_id: Int as uint64;
}


================================================
FILE: contracts/sbt_item/sbt_item.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_item/sbt_item.tact
================================================
import "./structs";
import "./messages";

contract SbtItem {

    const minTonsForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03");
    
    item_index: Int as uint64;
    collection_address: Address;
    owner: Address? = null;
    content: Cell? = null;
    authority_address: Address? = null;
    revoked_at: Int as uint64 = 1;
    is_initialized: Bool = false;

    init(collection_address: Address, item_index: Int) {
        self.item_index = item_index;
        self.collection_address = collection_address;
    }

    receive(msg: DeployItem) {
        require(!self.is_initialized, "Already Initiated");
        require(sender() == self.collection_address, "Invalid Sender");
        self.owner = msg.owner_address;
        self.content = msg.content;
        self.authority_address = msg.authority_address;
        self.revoked_at = 0;
        self.is_initialized = true;
    }

    receive(msg: ProveOwnership) {
        require(self.is_initialized, "Not Initiated");
        require(self.owner == sender(), "Invalid Sender");
        let content: Cell? = null;
        if (msg.with_content) {
            content = self.content;
        }
        send(SendParameters{
            to: msg.dest,
            value: 0,
            mode: SendRemainingValue,
            body: OwnershipProof {
                query_id: msg.query_id, 
                item_id: self.item_index, 
                owner: self.owner!!, 
                data: msg.forward_payload, 
                revoked_at: self.revoked_at, 
                content: content
            }.toCell()
        });

        self.exit_without_saving();
    }

    receive(msg: RequestOwner) {
        require(self.is_initialized, "Not Initiated");
        let content: Cell? = null;
        if (msg.with_content) {
            content = self.content;
        }
        send(SendParameters{
            to: msg.dest,
            value: 0,
            mode: SendRemainingValue,
            body: OwnerInfo {
                query_id: msg.query_id, 
                item_id: self.item_index, 
                initiator: sender(),
                owner: self.owner!!, 
                data: msg.forward_payload, 
                revoked_at: self.revoked_at, 
                content: content
            }.toCell()
        });

        self.exit_without_saving();
    }

    receive(msg: Destroy) {
        require(self.is_initialized, "Not Initiated");
        require(self.owner == sender(), "Invalid Sender");
        send(SendParameters{
            to: self.owner!!,
            value: 0,
            mode: SendRemainingBalance,
            body: Excesses{query_id: msg.query_id}.toCell()
        });
        self.owner = null;
        self.authority_address = null;
    }

    receive(msg: Revoke) {
        require(self.is_initialized, "Not Initiated");
        require(self.authority_address == sender(), "Invalid Sender");
        require(self.revoked_at == 0, "Already revoked");
        self.revoked_at = now();
        send(SendParameters{
            to: self.authority_address!!,
            value: 0,
            mode: SendRemainingValue,
            body: Excesses{query_id: msg.query_id}.toCell()
        });
    }

    receive(msg: TakeExcess) {
        require(self.is_initialized, "Not Initiated");
        require(self.owner == sender(), "Invalid Sender");
        nativeReserve(self.minTonsForStorage, 2);
        send(SendParameters{
            to: self.owner!!,
            value: 0,
            mode: SendRemainingBalance,
            body: Excesses{query_id: msg.query_id}.toCell()
        });
        self.exit_without_saving();
    }
    
    receive(msg: GetStaticData) {
        require(self.is_initialized, "Not Initiated");
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
        self.exit_without_saving();
    }

    bounced(msg: bounced<OwnershipProof>) {
        send(SendParameters{
            to: self.owner!!,
            value: 0,
            mode: SendRemainingValue,
            body: OwnershipProofBounced{query_id: msg.query_id}.toCell()
        });
        self.exit_without_saving();
    }

    inline fun exit_without_saving() {
        commit();
        throw(0);
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = "";
        if (self.content != null) {
            collectionData = (self.content!!).asSlice().asString();
        }
        b.append(collectionData);
        b.append(self.item_index.toString());
        b.append(".json");

        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection_address, 
            owner_address: self.owner,
            individual_content: b.toCell()
        };
    }

    get fun get_authority_address(): Address? {
        return self.authority_address;
    }
    get fun get_revoked_time(): Int {
        return self.revoked_at;
    }
}




================================================
FILE: contracts/sbt_item/structs.tact
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/contracts/sbt_item/structs.tact
================================================
struct GetNftData { 
    is_initialized: Bool;
    index: Int;
    collection_address: Address; 
    owner_address: Address?;
    individual_content: Cell;
}


================================================
FILE: jest.config.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: scripts/deployNftCollection.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/scripts/deployNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { SbtCollection } from "../wrappers/SbtCollection";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/"; // Change to the content URL you prepared
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    // ===== Parameters =====
    // Replace owner with your address (if you use deeplink)
    let owner = provider.sender().address!;

    let collection = provider.open(await SbtCollection.fromInit(owner, newContent, {
        $$type: "RoyaltyParams",
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }));

    // Do deploy
    await collection.send(provider.sender(), {value: toNano("0.1")}, {$$type: 'RequestMint', index: 2n, owner_address: provider.sender().address!, authority_address: provider.sender().address!, content: beginCell().endCell()});

    console.log(collection.address);
    // https://testnet.getgems.io/collection/EQBLzYrl72T2vUJxR4Ju7OgXU8E4KeUOMcu8RrD5HAhi-vkn
    await provider.waitForDeploy(collection.address);

    // run methods on `collection`
}


================================================
FILE: scripts/readNftCollection.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/scripts/readNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { SbtCollection } from "../wrappers/SbtCollection";
import { SbtItem } from "../wrappers/SbtItem";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    let collection_address = Address.parse("EQBLzYrl72T2vUJxR4Ju7OgXU8E4KeUOMcu8RrD5HAhi-vkn");

    let collection = provider.open(SbtCollection.fromAddress(collection_address));

    const nft_index = 0n;
    let address_by_index = await collection.getGetNftAddressByIndex(nft_index);

    console.log("NFT ID[" + nft_index + "]: " + address_by_index);
}


================================================
FILE: tests/NftCollection.spec.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/tests/NftCollection.spec.ts
================================================
import { toNano, beginCell, comment } from "ton";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import "@ton-community/test-utils";

import { SbtCollection } from "../wrappers/SbtCollection";
import { SbtItem,  } from "../build/SbtCollection/tact_SbtItem";
import { storeOwnerInfo, storeOwnershipProof } from "../wrappers/SbtItem";

describe("contract", () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let authority: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<SbtCollection>;
    let nft0: SandboxContract<SbtItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = 2698781332;
        deployer = await blockchain.treasury("deployer");
        authority = await blockchain.treasury("authority");

        collection = blockchain.openContract(
            await SbtCollection.fromInit(deployer.address, newContent, {
                $$type: "RoyaltyParams",
                numerator: 350n, // 350n = 35%
                denominator: 1000n,
                destination: deployer.address,
            })
        );
        nft0 = blockchain.openContract(await SbtItem.fromInit(collection.address, 0n));

        const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, {$$type: 'RequestMint', index: 0n, owner_address: deployer.address, authority_address: authority.address, content: beginCell().endCell()});
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it("Test", async () => {
        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
        console.log("Collection Address: " + collection.address);
        expect((await collection.getGetCollectionData()).next_item_index).toEqual(1n);
    });

    it("should deploy correctly", async () => {
        let nft = blockchain.openContract(await SbtItem.fromInit(collection.address, 1n));
        let deploy_result = await nft.send(deployer.getSender(), {value: toNano(1)}, {$$type: 'DeployItem', owner_address: deployer.address, content: beginCell().endCell(), authority_address: deployer.address});
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: nft.address,
            success: false,
            exitCode: 23263
        });
        expect((await nft.getGetNftData()).is_initialized).toBeFalsy();
        deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, {$$type: 'RequestMint', index: 1n, owner_address: deployer.address, authority_address: deployer.address, content: beginCell().endCell()});
        console.log(deploy_result.events)
        console.log(nft.address)
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });
        expect(deploy_result.transactions).toHaveTransaction({
            from: collection.address,
            to: nft.address,
            success: true,
        });
        expect((await collection.getGetCollectionData()).next_item_index).toEqual(2n);
        expect((await nft.getGetNftData()).is_initialized).toBeTruthy();
        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
    });

    it("should return coins correctly", async () => {
        let transaction = await nft0.send(deployer.getSender(), {value: toNano("0.02")}, {$$type: 'TakeExcess', query_id: 12n});
        expect(transaction.transactions).toHaveTransaction({
            from: nft0.address,
            to: deployer.address,
            op: 0xd53276db,
        })
        expect((await blockchain.provider(nft0.address).getState()).balance).toEqual(toNano("0.03"));
    });
    it("should revoke", async () => {
        expect(await nft0.getGetAuthorityAddress()).toEqualAddress(authority.address);
        let transaction = await nft0.send(authority.getSender(), {value: toNano("0.02")}, {$$type: 'Revoke', query_id: 12n});
        expect(transaction.transactions).toHaveTransaction({
            from: nft0.address,
            to: authority.address,
            op: 0xd53276db,
        })
        expect(await nft0.getGetRevokedTime()).toEqual(BigInt(blockchain.now!));
    });
    it("should prove ownership", async () => {
        let dest = await blockchain.treasury("dest");
        let transaction = await nft0.send(dest.getSender(), {value: toNano("0.02")}, {$$type: 'ProveOwnership', query_id: 12n, dest: dest.address, forward_payload: comment("hello"), with_content: false});
        expect(transaction.transactions).toHaveTransaction({
            from: dest.address,
            to: nft0.address,
            success: false
        })
        transaction = await nft0.send(deployer.getSender(), {value: toNano("0.02")}, {$$type: 'ProveOwnership', query_id: 12n, dest: dest.address, forward_payload: comment("hello"), with_content: false});
        console.log(transaction.events)
        expect(transaction.transactions).toHaveTransaction({
            from: nft0.address,
            to: dest.address,
            success: true,
            body: beginCell().store(storeOwnershipProof({$$type: 'OwnershipProof', query_id: 12n, item_id: 0n, owner: deployer.address, data: comment("hello"), revoked_at: 0n, content: null})).endCell()
        })
    });
    it("should request owner", async () => {
        let dest = await blockchain.treasury("dest");
        let transaction = await nft0.send(dest.getSender(), {value: toNano("0.02")}, {$$type: 'RequestOwner', query_id: 12n, dest: dest.address, forward_payload: comment("hello"), with_content: false});
        expect(transaction.transactions).toHaveTransaction({
            from: nft0.address,
            to: dest.address,
            success: true,
            body: beginCell().store(storeOwnerInfo({$$type: 'OwnerInfo', query_id: 12n, item_id: 0n, initiator: dest.address, owner: deployer.address, data: comment("hello"), revoked_at: 0n, content: null})).endCell()
        })
    });
});


================================================
FILE: wrappers/SbtCollection.compile.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/wrappers/SbtCollection.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/sbt_collection/sbt_collection.tact',
};



================================================
FILE: wrappers/SbtCollection.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/wrappers/SbtCollection.ts
================================================
export * from '../build/SbtCollection/tact_SbtCollection';



================================================
FILE: wrappers/SbtItem.compile.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/wrappers/SbtItem.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/sbt_item/sbt_item.tact',
};



================================================
FILE: wrappers/SbtItem.ts
URL: https://github.com/getgems-community-tact/sbt-template/blob/tutorial/wrappers/SbtItem.ts
================================================
export * from '../build/SbtItem/tact_SbtItem';



# Repository: nft-template-in-tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact
Branch: tutorial

## Directory Structure:
```
└── nft-template-in-tact/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── README.md
    ├── contracts/
        ├── imports/
            ├── stdlib.fc
        ├── nft_collection/
            ├── messages.tact
            ├── nft_collection.tact
            ├── structs.tact
        ├── nft_item/
            ├── messages.tact
            ├── nft_item.tact
            ├── structs.tact
    ├── jest.config.ts
    ├── scripts/
        ├── deployNftCollection.ts
        ├── readNftCollection.ts
    ├── tests/
        ├── NftCollection.spec.ts
    ├── wrappers/
        ├── NftCollection.compile.ts
        ├── NftCollection.ts
        ├── NftItem.compile.ts
        ├── NftItem.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/README.md
================================================
# NFT Standard in Tact

```bash
yarn build # To build contract
yarn test # To run test cases
yarn deploy # To deploy contract
yarn read # The way to read the smart contract data after your deployed the code
```

=> Remember to go to `depoly.ts` to change the parameters you want!

---

This GitHub repository is dedicated to an NFT standard(TEP-62)[https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md], which provides a set of guidelines and specifications for creating and managing non-fungible tokens (NFTs) on blockchain platforms.

The repository contains a comprehensive collection of code files, documentation, and resources that developers can utilize to implement the standard in their NFT projects. It offers a well-defined structure and functionality for NFT contracts, including features like token metadata, ownership transfers, and token enumeration. The repository also includes sample code and examples to help developers understand and implement the NFT standard more easily. Collaborators and contributors actively maintain and update the repository, ensuring it remains up-to-date with the latest advancements and best practices in the NFT ecosystem.

-   https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
-   https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
-   https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md

## More

[https://docs.tact-lang.org/_next/static/media/banner.0c18b672.jpeg]

For more information about this GitHub repository, or if you have any questions related to Tact, feel free to visit:

-   https://t.me/ton101
-   https://t.me/tactlang

If you have more specific questions related to the Tact Language, please refer to:

-   https://tact-lang.org/


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: contracts/nft_collection/messages.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_collection/messages.tact
================================================
message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator:  Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}


================================================
FILE: contracts/nft_collection/nft_collection.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_collection/nft_collection.tact
================================================
import "./structs";
import "./messages";
import "./../nft_item/nft_item";

contract NftCollection {
    
    const minTonsForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03"); // gas consuption for different operations may differ, so it's better to separate such consts

    next_item_index: Int as uint32 = 0;
    owner_address: Address;
    royalty_params: RoyaltyParams;                      
    collection_content: Cell;   

    init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams){
        self.owner_address = owner_address;
        self.collection_content = collection_content; 
        self.royalty_params = royalty_params;
    }

    // [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
    receive("Mint"){
        let ctx: Context = context(); // get sender Info

        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        self.mint(ctx.sender, msgValue);
    }

    // ===== Private Methods ===== //
    fun mint(sender: Address, msgValue: Int) {
        require(self.next_item_index >= 0, "non-sequential NFTs");
        
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: msgValue, 
                bounce: false,
                mode: SendIgnoreErrors,
                body: Transfer {
                    query_id: 0,
                    new_owner: sender,
                    response_destination: self.owner_address,
                    custom_payload: emptyCell(),
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        self.next_item_index = self.next_item_index + 1;
    }

    receive(msg: GetRoyaltyParams) {   
        let ctx: Context = context(); // get sender Info
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  self.royalty_params.numerator,
                denominator: self.royalty_params.denominator,
                destination: self.owner_address
            }.toCell()
        });        
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {     
        let b: StringBuilder = beginString();
        let collectionDataString: String = self.collection_content.asSlice().asString();
        b.append(collectionDataString);
        b.append("meta.json"); // You can changed this your self.
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: b.toCell(), 
            owner_address: self.owner_address
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(myAddress(), item_index, self.owner_address, self.collection_content);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        let b: StringBuilder = beginString();
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params;
    }
}


================================================
FILE: contracts/nft_collection/structs.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_collection/structs.tact
================================================
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}


================================================
FILE: contracts/nft_item/messages.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_item/messages.tact
================================================
message(0x5fcc3d14) Transfer { 
    query_id: Int as uint64;            
    new_owner: Address; 
    response_destination: Address; 
    custom_payload: Cell?; 
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}

message(0x05138d91) OwnershipAssigned{
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining; 
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}

message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}


================================================
FILE: contracts/nft_item/nft_item.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_item/nft_item.tact
================================================
import "./structs";
import "./messages";

contract NftItem {

    const minTonsForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03");
    
    collection_address: Address;
    item_index: Int; 
    owner: Address;
    individual_content: Cell;
    is_initialized: Bool;

    init(collection_address: Address, item_index: Int, owner: Address, individual_content: Cell){
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.owner = collection_address;
        self.individual_content = individual_content;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context();
    
        let msgValue: Int = ctx.value; // Check the gasCost for storage
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);

        // Only Owner of the this NFT Item can transfer it.
        require(ctx.sender == self.owner, "not owner");

        if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT
            self.is_initialized = true;
            self.owner = msg.new_owner;
            send(SendParameters{
                to: msg.response_destination,
                value: 0,
                mode:  SendIgnoreErrors + SendRemainingValue,
                body: Excesses { query_id: msg.query_id }.toCell() //0xd53276db
            });
        } else {
            self.owner = msg.new_owner; // change current owner to the new_owner
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode: SendIgnoreErrors, 
                    bounce: false,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }
            msgValue = msgValue - ctx.readForwardFee(); 
            if (msg.response_destination != null) { 
                send(SendParameters{ 
                    to: msg.response_destination,
                    value: msgValue - msg.forward_amount,
                    mode: SendPayGasSeparately,
                    body: Excesses { query_id: msg.query_id }.toCell() // 0xd53276db
                });
            } 
        }
    }
    
    receive(msg: GetStaticData){ 
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = self.individual_content.asSlice().asString();
        b.append(collectionData);
        b.append(self.item_index.toString());
        b.append(".json");

        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection_address, 
            owner_address: self.owner,
            individual_content: b.toCell()
        };
    }
}




================================================
FILE: contracts/nft_item/structs.tact
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/contracts/nft_item/structs.tact
================================================
struct GetNftData { 
    is_initialized: Bool;
    index: Int;
    collection_address: Address; 
    owner_address: Address;
    individual_content: Cell;
}


================================================
FILE: jest.config.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: scripts/deployNftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/scripts/deployNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { NftCollection } from "../wrappers/NftCollection";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/"; // Change to the content URL you prepared
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    // ===== Parameters =====
    // Replace owner with your address (if you use deeplink)
    let owner = provider.sender().address!;

    let collection = provider.open(await NftCollection.fromInit(owner, newContent, {
        $$type: "RoyaltyParams",
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }));

    // Do deploy
    await collection.send(provider.sender(), {value: toNano("0.1")}, "Mint");


    await provider.waitForDeploy(collection.address);

    // run methods on `collection`
}


================================================
FILE: scripts/readNftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/scripts/readNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { NftCollection } from "../wrappers/NftCollection";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    let collection_address = Address.parse("YOUR Collection ADDRESS");

    let collection = provider.open(NftCollection.fromAddress(collection_address));

    const nft_index = 0n;
    let address_by_index = await collection.getGetNftAddressByIndex(nft_index);

    console.log("NFT ID[" + nft_index + "]: " + address_by_index);
}


================================================
FILE: tests/NftCollection.spec.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/tests/NftCollection.spec.ts
================================================
import { toNano, beginCell } from "ton";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import "@ton-community/test-utils";

import { NftCollection } from "../wrappers/NftCollection";
import { NftItem } from "../wrappers/NftItem";

describe("contract", () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        collection = blockchain.openContract(
            await NftCollection.fromInit(deployer.address, newContent, {
                $$type: "RoyaltyParams",
                numerator: 350n, // 350n = 35%
                denominator: 1000n,
                destination: deployer.address,
            })
        );

        const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, "Mint");
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it("Test", async () => {
        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
        console.log("Collection Address: " + collection.address);
    });

    it("should deploy correctly", async () => {
        const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, "Mint"); // Send Mint Transaction
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });

        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
    });
});


================================================
FILE: wrappers/NftCollection.compile.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/wrappers/NftCollection.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/nft_collection/nft_collection.tact',
};



================================================
FILE: wrappers/NftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/wrappers/NftCollection.ts
================================================
export * from '../build/NftCollection/tact_NftCollection';



================================================
FILE: wrappers/NftItem.compile.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/wrappers/NftItem.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/nft_item/nft_item.tact',
};



================================================
FILE: wrappers/NftItem.ts
URL: https://github.com/getgems-community-tact/nft-template-in-tact/blob/tutorial/wrappers/NftItem.ts
================================================
export * from '../build/NftItem/tact_NftItem';



# Repository: nft-marketplace
URL: https://github.com/getgems-community-tact/nft-marketplace
Branch: main

## Directory Structure:
```
└── nft-marketplace/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── README.md
    ├── contracts/
        ├── imports/
            ├── stdlib.fc
        ├── nft_offer.tact
    ├── jest.config.ts
    ├── scripts/
        ├── deployNftOffer.ts
    ├── tests/
        ├── NftOffer.spec.ts
    ├── wrappers/
        ├── NftOffer.compile.ts
        ├── NftOffer.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/README.md
================================================
# Getgems community Tact

## 🌐 Introduction
Hey there! This is the NFT Marketplace on Tact for HACK-TON-BERFEST 2023! This repository is dedicated to the conversion of smart contracts written in FunC to Tact. Among our primary focuses is the conversion of smart contracts from the renowned NFT marketplace, GetGems. The primary motivation behind this initiative is to demonstrate the simplicity and elegance of Tact as a language, providing tangible examples and projects to further its understanding and adoption.

# How to Contribute
0. Registration: Connect your [wallet]("https://tonkeeper.com/") and fill your GitHub and Telegram accounts in [ton society]()
1. Fork & Clone: Fork this repository and clone it to your local machine.
2. Pick an Issue: Browse open issues, choose one that interests you, and commit to it.
3. Code Away: Address the issue in your local environment.
4. Pull Request: Submit a PR for review. Please ensure your PR title is clear and your description is detailed.
5. Contact the team: notify the [team]() of your PR to check the code


>Video tutorial: If you prefer visual learning, check out [this video tutorial]() on contributing!

# Join the Community

Connect with fellow contributors on our [Telegram]("https://t.me/hack_ton_berfest_2023"). Engage in discussions, seek help, or share your progress!

# Development
1. Run the `npm create ton@latest` command to deploy the environment
2. Run the `npx blueprint create` command to create new smart contract
3. Run the `npx blueprint test` command to test your smart contracts
4. Run the `npx blueprint build` command to build your smart contracts

[//]: # (2. On push to the `main` branch, the app will be automatically deployed via github actions.)

# Conclusion
Can't wait to see your cool updates to Getgems community Tact during HACK-TON-BERFEST. Have fun coding!
# License
MIT



================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: contracts/nft_offer.tact
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/contracts/nft_offer.tact
================================================
struct Royalty {
    marketplaceFeeAddress: Address;
    marketplaceNumerator: Int as uint32; // TEP-66 says numerator and denominator are contained in uint16, but reference contract uses uint32
    marketplaceDenominator: Int as uint32;

    royaltyAddress: Address;
    royaltyNumerator: Int as uint32;
    royaltyDenominator: Int as uint32;
}

struct OfferParameters {
    type: Int = 0x4f46464552;
    isComplete: Bool;
    createdAt: Int as uint32;
    finishAt: Int as uint32;
    marketplaceAddress: Address; // aka admin address
    nftAddress: Address;
    offerOwnerAddress: Address;
    fullPrice: Int as coins;
    marketplaceFeeAddress: Address;
    marketplaceNumerator: Int as uint32; 
    marketplaceDenominator: Int as uint32;
    royaltyAddress: Address;
    royaltyNumerator: Int as uint32;
    royaltyDenominator: Int as uint32;
    profitPrice: Int as coins;
}

message(555) Fix {
    message: Cell;
    mode: Int as uint8;
}
message(3) CancelOffer{
    cs: Slice as remaining;
}

message(0x5fcc3d14) NftTransfer {
    queryId: Int as uint64;
    newOwner: Address;
    responseDestination: Address;
    customPayload: Cell? = null;
    forwardAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x05138d91) NftOwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Slice as remaining;
}

@name(muldiv)
native mulDiv(a: Int, b: Int, c: Int): Int;

contract NftOffer {
    const creationGas: Int = ton("0.1");
    const addValueGas: Int = ton("0.02");
    const nftTransferGas: Int = ton("1");
    const forwardAmount: Int = ton("0.001");
    const reserveValue: Int = ton("0.001");
    isComplete: Bool = false;
    createdAt: Int as uint32;
    finishAt: Int as uint32;
    marketplaceAddress: Address; // aka admin address
    nftAddress: Address;
    offerOwnerAddress: Address;
    fullPrice: Int as coins;
    fees: Royalty;
    // can_deploy seems to be useless here

    init(finishAt: Int, marketplaceAddress: Address, nftAddress: Address, offerOwnerAddress: Address, marketplaceFeeAddress: Address, marketplaceNumerator: Int, marketplaceDenominator: Int, royaltyAddress: Address, royaltyNumerator: Int, royaltyDenominator: Int) {
        self.createdAt = now();
        self.finishAt = finishAt;
        self.marketplaceAddress = marketplaceAddress;
        self.nftAddress = nftAddress;
        self.offerOwnerAddress = offerOwnerAddress;
        self.fullPrice = myBalance();
        self.fees = Royalty {
            marketplaceFeeAddress: marketplaceFeeAddress,
            marketplaceNumerator: marketplaceNumerator,
            marketplaceDenominator: marketplaceDenominator,
            royaltyAddress: royaltyAddress,
            royaltyNumerator: royaltyNumerator,
            royaltyDenominator: royaltyDenominator
        };
    }

    receive(msg: Fix) {
        require(self.isComplete, "Is not completed");
        require(sender() == self.marketplaceAddress, "Invalid sender");
        nativeSendMessage(msg.message, msg.mode);
    }
    receive(msg: CancelOffer) {
        let ctx: Context = context();
        if (ctx.sender == self.marketplaceAddress) {
            let coins: Int = msg.cs.loadCoins();
            if (coins > ton("0.5")) {
                coins = ton("0.5");
            }
            send(SendParameters{
                to: self.marketplaceAddress,
                value: coins,
                mode: SendPayGasSeparately,
                body: "Offer cancel fee".asComment()
            });
        }
        else {
            require(ctx.sender == self.offerOwnerAddress, "Invalid Sender");
        }
        nativeReserve(self.reserveValue, 0);

        send(SendParameters{
            to: self.offerOwnerAddress,
            value: 0,
            mode: SendRemainingBalance
        });
        self.isComplete = true;
    }
    receive(msg: NftOwnershipAssigned) {
        let ctx: Context = context();
        if (ctx.sender != self.nftAddress || ctx.value < self.nftTransferGas || self.isComplete) {
            send(SendParameters{
                to: ctx.sender,
                value: 0,
                mode: SendRemainingValue,
                body: NftTransfer{queryId: msg.queryId, newOwner: msg.prevOwner, responseDestination: msg.prevOwner, forwardAmount: self.forwardAmount, forwardPayload: emptySlice()}.toCell()
            });
            return;
        }
        let royaltyAmount: Int = self.getPercent(self.fullPrice, self.fees.royaltyNumerator, self.fees.royaltyDenominator);
        if (royaltyAmount > 0) {
            send(SendParameters{
                to: self.fees.royaltyAddress,
                value: royaltyAmount,
                mode: SendPayGasSeparately
            });
        }
        let marketplaceAmount: Int = self.getPercent(self.fullPrice, self.fees.marketplaceNumerator, self.fees.marketplaceDenominator);
        if (marketplaceAmount > 0) {
            send(SendParameters{
                to: self.fees.marketplaceFeeAddress,
                value: marketplaceAmount,
                mode: SendPayGasSeparately
            });
        }

        send(SendParameters{
            to: msg.prevOwner,
            value: self.fullPrice - royaltyAmount - marketplaceAmount,
            mode: SendPayGasSeparately
        });

        nativeReserve(self.reserveValue, 0);

        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendRemainingBalance,
            body: NftTransfer{queryId: msg.queryId, newOwner: self.offerOwnerAddress, responseDestination: self.offerOwnerAddress, forwardAmount: self.forwardAmount, forwardPayload: emptySlice()}.toCell()
        });
        self.isComplete = true;
    }
    receive() {
        let ctx: Context = context();
        require(ctx.sender == self.offerOwnerAddress, "Invalid sender");
        require(ctx.value > self.addValueGas, "Invalid value");
        self.fullPrice = ctx.value - self.addValueGas;
    }

    external("Cancel") {
        require(!self.isComplete, "Already completed");
        require(now() > self.finishAt, "Not expired");
        acceptMessage();
        nativeReserve(self.reserveValue, 0);
        send(SendParameters{
            to: self.offerOwnerAddress,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: "Offer expired".asComment()
        });
        self.isComplete = true;
    }

    fun getPercent(a: Int, numerator: Int, denominator: Int): Int {
        if (denominator == 0) {
            return 0;
        }
        return mulDiv(a, numerator, denominator); // muldiv(muldiv(a, numerator, 1000000000), 1000000000, denominator) = muldiv(a, numerator, denominator)
    }
    get fun get_offer_data(): OfferParameters {
        let profitPrice: Int = self.fullPrice - self.getPercent(self.fullPrice, self.fees.royaltyNumerator, self.fees.royaltyDenominator) - self.getPercent(self.fullPrice, self.fees.marketplaceNumerator, self.fees.marketplaceDenominator);
        return OfferParameters{
            isComplete: self.isComplete,
            createdAt: self.createdAt,
            finishAt: self.finishAt,
            marketplaceAddress: self.marketplaceAddress,
            nftAddress: self.nftAddress,
            offerOwnerAddress: self.offerOwnerAddress,
            fullPrice: self.fullPrice,
            marketplaceFeeAddress: self.fees.marketplaceFeeAddress,
            marketplaceNumerator: self.fees.marketplaceNumerator,
            marketplaceDenominator: self.fees.marketplaceDenominator,
            royaltyAddress: self.fees.royaltyAddress,
            royaltyNumerator: self.fees.royaltyNumerator,
            royaltyDenominator: self.fees.royaltyDenominator,
            profitPrice: profitPrice
        };
    }
}



================================================
FILE: jest.config.ts
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: scripts/deployNftOffer.ts
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/scripts/deployNftOffer.ts
================================================
import { toNano } from 'ton-core';
import { NftOffer } from '../wrappers/NftOffer';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nftOffer = provider.open(await NftOffer.fromInit());

    await nftOffer.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftOffer.address);

    // run methods on `nftOffer`
}



================================================
FILE: tests/NftOffer.spec.ts
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/tests/NftOffer.spec.ts
================================================
import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { NftOffer } from '../wrappers/NftOffer';
import '@ton-community/test-utils';

describe('NftOffer', () => {
    let blockchain: Blockchain;
    let nftOffer: SandboxContract<NftOffer>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nftOffer = blockchain.openContract(await NftOffer.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await nftOffer.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftOffer.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nftOffer are ready to use
    });
});



================================================
FILE: wrappers/NftOffer.compile.ts
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/wrappers/NftOffer.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/nft_offer.tact',
    options: {
        external: true
    }
};



================================================
FILE: wrappers/NftOffer.ts
URL: https://github.com/getgems-community-tact/nft-marketplace/blob/main/wrappers/NftOffer.ts
================================================
export * from '../build/NftOffer/tact_NftOffer';




# Repository: nft-template-editable
URL: https://github.com/getgems-community-tact/nft-template-editable
Branch: tutorial

## Directory Structure:
```
└── nft-template-editable/
    ├── .git/
        ├── hooks/
        ├── info/
        ├── logs/
            ├── refs/
                ├── heads/
                ├── remotes/
                    ├── origin/
        ├── objects/
            ├── info/
            ├── pack/
        ├── refs/
            ├── heads/
            ├── remotes/
                ├── origin/
            ├── tags/
    ├── README.md
    ├── contracts/
        ├── imports/
            ├── globals.tact
            ├── messages.tact
            ├── stdlib.fc
        ├── nft_collection.tact
        ├── nft_item.tact
    ├── jest.config.ts
    ├── scripts/
        ├── deployNftCollection.ts
        ├── readNftCollection.ts
    ├── tests/
        ├── NftCollection.spec.ts
    ├── wrappers/
        ├── NftCollection.compile.ts
        ├── NftCollection.ts
        ├── NftItem.compile.ts
        ├── NftItem.ts
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/README.md
================================================
# NFT Standard (ERC-721) in Tact.

```bash
yarn build # To build contract
yarn test # To run test cases
yarn deploy # To deploy contract
yarn read # The way to read the smart contract data after your deployed the code
```

=> Remember to go to `scripts/depolyNftCollection.ts` to change the parameters you want!



================================================
FILE: contracts/imports/globals.tact
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/contracts/imports/globals.tact
================================================
const minTonsForStorage: Int = ton("0.03");
const gasConsumption: Int = ton("0.03");


================================================
FILE: contracts/imports/messages.tact
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/contracts/imports/messages.tact
================================================
// [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
message(0x5fcc3d14) Transfer { 
    query_id: Int as uint64;            
    new_owner: Address; 
    response_destination: Address; 
    custom_payload: Cell?; 
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}

message(0x05138d91) OwnershipAssigned{
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining; 
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}

message TransferEditorship { 
    query_id: Int as uint64;            
    new_editor: Address; 
    response_destination: Address;
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}

message EditorshipAssigned{
    query_id: Int as uint64;
    prev_editor: Address;
    forward_payload: Slice as remaining; 
}

message UpdateNftContent { 
    query_id: Int as uint64;
    new_content: Cell;
}

message UpdateCollectionContent { 
    query_id: Int as uint64;
    new_content: Cell;
    numerator:  Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int as uint32;
    collection: Address;
}

message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator:  Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}


================================================
FILE: contracts/imports/stdlib.fc
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/contracts/imports/stdlib.fc
================================================
;; Standard library for funC
;;

{-
  # Tuple manipulation primitives
  The names and the types are mostly self-explaining.
  See [polymorhism with forall](https://ton.org/docs/#/func/functions?id=polymorphism-with-forall)
  for more info on the polymorphic functions.

  Note that currently values of atomic type `tuple` can't be cast to composite tuple type (e.g. `[int, cell]`)
  and vise versa.
-}

{-
  # Lisp-style lists

  Lists can be represented as nested 2-elements tuples.
  Empty list is conventionally represented as TVM `null` value (it can be obtained by calling [null()]).
  For example, tuple `(1, (2, (3, null)))` represents list `[1, 2, 3]`. Elements of a list can be of different types.
-}

;;; Adds an element to the beginning of lisp-style list.
forall X -> tuple cons(X head, tuple tail) asm "CONS";

;;; Extracts the head and the tail of lisp-style list.
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";

;;; Extracts the tail and the head of lisp-style list.
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";

;;; Returns the head of lisp-style list.
forall X -> X car(tuple list) asm "CAR";

;;; Returns the tail of lisp-style list.
tuple cdr(tuple list) asm "CDR";

;;; Creates tuple with zero elements.
tuple empty_tuple() asm "NIL";

;;; Appends a value `x` to a `Tuple t = (x1, ..., xn)`, but only if the resulting `Tuple t' = (x1, ..., xn, x)`
;;; is of length at most 255. Otherwise throws a type check exception.
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";

;;; Creates a tuple of length one with given argument as element.
forall X -> [X] single(X x) asm "SINGLE";

;;; Unpacks a tuple of length one
forall X -> X unsingle([X] t) asm "UNSINGLE";

;;; Creates a tuple of length two with given arguments as elements.
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";

;;; Unpacks a tuple of length two
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";

;;; Creates a tuple of length three with given arguments as elements.
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";

;;; Unpacks a tuple of length three
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";

;;; Creates a tuple of length four with given arguments as elements.
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";

;;; Unpacks a tuple of length four
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";

;;; Returns the first element of a tuple (with unknown element types).
forall X -> X first(tuple t) asm "FIRST";

;;; Returns the second element of a tuple (with unknown element types).
forall X -> X second(tuple t) asm "SECOND";

;;; Returns the third element of a tuple (with unknown element types).
forall X -> X third(tuple t) asm "THIRD";

;;; Returns the fourth element of a tuple (with unknown element types).
forall X -> X fourth(tuple t) asm "3 INDEX";

;;; Returns the first element of a pair tuple.
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";

;;; Returns the second element of a pair tuple.
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";

;;; Returns the first element of a triple tuple.
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";

;;; Returns the second element of a triple tuple.
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";

;;; Returns the third element of a triple tuple.
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";


;;; Push null element (casted to given type)
;;; By the TVM type `Null` FunC represents absence of a value of some atomic type.
;;; So `null` can actually have any atomic type.
forall X -> X null() asm "PUSHNULL";

;;; Moves a variable [x] to the top of the stack
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";



;;; Returns the current Unix time as an Integer
int now() asm "NOW";

;;; Returns the internal address of the current smart contract as a Slice with a `MsgAddressInt`.
;;; If necessary, it can be parsed further using primitives such as [parse_std_addr].
slice my_address() asm "MYADDR";

;;; Returns the balance of the smart contract as a tuple consisting of an int
;;; (balance in nanotoncoins) and a `cell`
;;; (a dictionary with 32-bit keys representing the balance of "extra currencies")
;;; at the start of Computation Phase.
;;; Note that RAW primitives such as [send_raw_message] do not update this field.
[int, cell] get_balance() asm "BALANCE";

;;; Returns the logical time of the current transaction.
int cur_lt() asm "LTIME";

;;; Returns the starting logical time of the current block.
int block_lt() asm "BLOCKLT";

;;; Computes the representation hash of a `cell` [c] and returns it as a 256-bit unsigned integer `x`.
;;; Useful for signing and checking signatures of arbitrary entities represented by a tree of cells.
int cell_hash(cell c) asm "HASHCU";

;;; Computes the hash of a `slice s` and returns it as a 256-bit unsigned integer `x`.
;;; The result is the same as if an ordinary cell containing only data and references from `s` had been created
;;; and its hash computed by [cell_hash].
int slice_hash(slice s) asm "HASHSU";

;;; Computes sha256 of the data bits of `slice` [s]. If the bit length of `s` is not divisible by eight,
;;; throws a cell underflow exception. The hash value is returned as a 256-bit unsigned integer `x`.
int string_hash(slice s) asm "SHA256U";

{-
  # Signature checks
-}

;;; Checks the Ed25519-`signature` of a `hash` (a 256-bit unsigned integer, usually computed as the hash of some data)
;;; using [public_key] (also represented by a 256-bit unsigned integer).
;;; The signature must contain at least 512 data bits; only the first 512 bits are used.
;;; The result is `−1` if the signature is valid, `0` otherwise.
;;; Note that `CHKSIGNU` creates a 256-bit slice with the hash and calls `CHKSIGNS`.
;;; That is, if [hash] is computed as the hash of some data, these data are hashed twice,
;;; the second hashing occurring inside `CHKSIGNS`.
int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";

;;; Checks whether [signature] is a valid Ed25519-signature of the data portion of `slice data` using `public_key`,
;;; similarly to [check_signature].
;;; If the bit length of [data] is not divisible by eight, throws a cell underflow exception.
;;; The verification of Ed25519 signatures is the standard one,
;;; with sha256 used to reduce [data] to the 256-bit number that is actually signed.
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

{---
  # Computation of boc size
  The primitives below may be useful for computing storage fees of user-provided data.
-}

;;; Returns `(x, y, z, -1)` or `(null, null, null, 0)`.
;;; Recursively computes the count of distinct cells `x`, data bits `y`, and cell references `z`
;;; in the DAG rooted at `cell` [c], effectively returning the total storage used by this DAG taking into account
;;; the identification of equal cells.
;;; The values of `x`, `y`, and `z` are computed by a depth-first traversal of this DAG,
;;; with a hash table of visited cell hashes used to prevent visits of already-visited cells.
;;; The total count of visited cells `x` cannot exceed non-negative [max_cells];
;;; otherwise the computation is aborted before visiting the `(max_cells + 1)`-st cell and
;;; a zero flag is returned to indicate failure. If [c] is `null`, returns `x = y = z = 0`.
(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";

;;; Similar to [compute_data_size?], but accepting a `slice` [s] instead of a `cell`.
;;; The returned value of `x` does not take into account the cell that contains the `slice` [s] itself;
;;; however, the data bits and the cell references of [s] are accounted for in `y` and `z`.
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";

;;; A non-quiet version of [compute_data_size?] that throws a cell overflow exception (`8`) on failure.
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; A non-quiet version of [slice_compute_data_size?] that throws a cell overflow exception (8) on failure.
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;;; Throws an exception with exit_code excno if cond is not 0 (commented since implemented in compilator)
;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

{--
  # Debug primitives
  Only works for local TVM execution with debug level verbosity
-}
;;; Dumps the stack (at most the top 255 values) and shows the total stack depth.
() dump_stack() impure asm "DUMPSTK";

{-
  # Persistent storage save and load
-}

;;; Returns the persistent contract storage cell. It can be parsed or modified with slice and builder primitives later.
cell get_data() asm "c4 PUSH";

;;; Sets `cell` [c] as persistent contract data. You can update persistent contract storage with this primitive.
() set_data(cell c) impure asm "c4 POP";

{-
  # Continuation primitives
-}
;;; Usually `c3` has a continuation initialized by the whole code of the contract. It is used for function calls.
;;; The primitive returns the current value of `c3`.
cont get_c3() impure asm "c3 PUSH";

;;; Updates the current value of `c3`. Usually, it is used for updating smart contract code in run-time.
;;; Note that after execution of this primitive the current code
;;; (and the stack of recursive function calls) won't change,
;;; but any other function call will use a function from the new code.
() set_c3(cont c) impure asm "c3 POP";

;;; Transforms a `slice` [s] into a simple ordinary continuation `c`, with `c.code = s` and an empty stack and savelist.
cont bless(slice s) impure asm "BLESS";

{---
  # Gas related primitives
-}

;;; Sets current gas limit `gl` to its maximal allowed value `gm`, and resets the gas credit `gc` to zero,
;;; decreasing the value of `gr` by `gc` in the process.
;;; In other words, the current smart contract agrees to buy some gas to finish the current transaction.
;;; This action is required to process external messages, which bring no value (hence no gas) with themselves.
;;;
;;; For more details check [accept_message effects](https://ton.org/docs/#/smart-contracts/accept).
() accept_message() impure asm "ACCEPT";

;;; Sets current gas limit `gl` to the minimum of limit and `gm`, and resets the gas credit `gc` to zero.
;;; If the gas consumed so far (including the present instruction) exceeds the resulting value of `gl`,
;;; an (unhandled) out of gas exception is thrown before setting new gas limits.
;;; Notice that [set_gas_limit] with an argument `limit ≥ 2^63 − 1` is equivalent to [accept_message].
() set_gas_limit(int limit) impure asm "SETGASLIMIT";

;;; Commits the current state of registers `c4` (“persistent data”) and `c5` (“actions”)
;;; so that the current execution is considered “successful” with the saved values even if an exception
;;; in Computation Phase is thrown later.
() commit() impure asm "COMMIT";

;;; Not implemented
;;() buy_gas(int gram) impure asm "BUYGAS";

;;; Computes the amount of gas that can be bought for `amount` nanoTONs,
;;; and sets `gl` accordingly in the same way as [set_gas_limit].
() buy_gas(int amount) impure asm "BUYGAS";

;;; Computes the minimum of two integers [x] and [y].
int min(int x, int y) asm "MIN";

;;; Computes the maximum of two integers [x] and [y].
int max(int x, int y) asm "MAX";

;;; Sorts two integers.
(int, int) minmax(int x, int y) asm "MINMAX";

;;; Computes the absolute value of an integer [x].
int abs(int x) asm "ABS";

{-
  # Slice primitives

  It is said that a primitive _loads_ some data,
  if it returns the data and the remainder of the slice
  (so it can also be used as [modifying method](https://ton.org/docs/#/func/statements?id=modifying-methods)).

  It is said that a primitive _preloads_ some data, if it returns only the data
  (it can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods)).

  Unless otherwise stated, loading and preloading primitives read the data from a prefix of the slice.
-}


;;; Converts a `cell` [c] into a `slice`. Notice that [c] must be either an ordinary cell,
;;; or an exotic cell (see [TVM.pdf](https://ton-blockchain.github.io/docs/tvm.pdf), 3.1.2)
;;; which is automatically loaded to yield an ordinary cell `c'`, converted into a `slice` afterwards.
slice begin_parse(cell c) asm "CTOS";

;;; Checks if [s] is empty. If not, throws an exception.
() end_parse(slice s) impure asm "ENDS";

;;; Loads the first reference from the slice.
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";

;;; Preloads the first reference from the slice.
cell preload_ref(slice s) asm "PLDREF";

  {- Functions below are commented because are implemented on compilator level for optimisation -}

;;; Loads a signed [len]-bit integer from a slice [s].
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";

;;; Loads an unsigned [len]-bit integer from a slice [s].
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";

;;; Preloads a signed [len]-bit integer from a slice [s].
;; int preload_int(slice s, int len) asm "PLDIX";

;;; Preloads an unsigned [len]-bit integer from a slice [s].
;; int preload_uint(slice s, int len) asm "PLDUX";

;;; Loads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";

;;; Preloads the first `0 ≤ len ≤ 1023` bits from slice [s] into a separate `slice s''`.
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";

;;; Loads serialized amount of TonCoins (any unsigned integer up to `2^128 - 1`).
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDGRAMS";

;;; Returns all but the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";

;;; Returns the first `0 ≤ len ≤ 1023` bits of `slice` [s].
slice first_bits(slice s, int len) asm "SDCUTFIRST";

;;; Returns all but the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";

;;; Returns the last `0 ≤ len ≤ 1023` bits of `slice` [s].
slice slice_last(slice s, int len) asm "SDCUTLAST";

;;; Loads a dictionary `D` (HashMapE) from `slice` [s].
;;; (returns `null` if `nothing` constructor is used).
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";

;;; Preloads a dictionary `D` from `slice` [s].
cell preload_dict(slice s) asm "PLDDICT";

;;; Loads a dictionary as [load_dict], but returns only the remainder of the slice.
slice skip_dict(slice s) asm "SKIPDICT";

;;; Loads (Maybe ^Cell) from `slice` [s].
;;; In other words loads 1 bit and if it is true
;;; loads first ref and return it with slice remainder
;;; otherwise returns `null` and slice remainder
(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";

;;; Preloads (Maybe ^Cell) from `slice` [s].
cell preload_maybe_ref(slice s) asm "PLDOPTREF";


;;; Returns the depth of `cell` [c].
;;; If [c] has no references, then return `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [c].
;;; If [c] is a `null` instead of a cell, returns zero.
int cell_depth(cell c) asm "CDEPTH";


{-
  # Slice size primitives
-}

;;; Returns the number of references in `slice` [s].
int slice_refs(slice s) asm "SREFS";

;;; Returns the number of data bits in `slice` [s].
int slice_bits(slice s) asm "SBITS";

;;; Returns both the number of data bits and the number of references in `slice` [s].
(int, int) slice_bits_refs(slice s) asm "SBITREFS";

;;; Checks whether a `slice` [s] is empty (i.e., contains no bits of data and no cell references).
int slice_empty?(slice s) asm "SEMPTY";

;;; Checks whether `slice` [s] has no bits of data.
int slice_data_empty?(slice s) asm "SDEMPTY";

;;; Checks whether `slice` [s] has no references.
int slice_refs_empty?(slice s) asm "SREMPTY";

;;; Returns the depth of `slice` [s].
;;; If [s] has no references, then returns `0`;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [s].
int slice_depth(slice s) asm "SDEPTH";

{-
  # Builder size primitives
-}

;;; Returns the number of cell references already stored in `builder` [b]
int builder_refs(builder b) asm "BREFS";

;;; Returns the number of data bits already stored in `builder` [b].
int builder_bits(builder b) asm "BBITS";

;;; Returns the depth of `builder` [b].
;;; If no cell references are stored in [b], then returns 0;
;;; otherwise the returned value is one plus the maximum of depths of cells referred to from [b].
int builder_depth(builder b) asm "BDEPTH";

{-
  # Builder primitives
  It is said that a primitive _stores_ a value `x` into a builder `b`
  if it returns a modified version of the builder `b'` with the value `x` stored at the end of it.
  It can be used as [non-modifying method](https://ton.org/docs/#/func/statements?id=non-modifying-methods).

  All the primitives below first check whether there is enough space in the `builder`,
  and only then check the range of the value being serialized.
-}

;;; Creates a new empty `builder`.
builder begin_cell() asm "NEWC";

;;; Converts a `builder` into an ordinary `cell`.
cell end_cell(builder b) asm "ENDC";

;;; Stores a reference to `cell` [c] into `builder` [b].
builder store_ref(builder b, cell c) asm(c b) "STREF";

;;; Stores an unsigned [len]-bit integer `x` into `b` for `0 ≤ len ≤ 256`.
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";

;;; Stores a signed [len]-bit integer `x` into `b` for` 0 ≤ len ≤ 257`.
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";


;;; Stores `slice` [s] into `builder` [b]
builder store_slice(builder b, slice s) asm "STSLICER";

;;; Stores (serializes) an integer [x] in the range `0..2^128 − 1` into `builder` [b].
;;; The serialization of [x] consists of a 4-bit unsigned big-endian integer `l`,
;;; which is the smallest integer `l ≥ 0`, such that `x < 2^8l`,
;;; followed by an `8l`-bit unsigned big-endian representation of [x].
;;; If [x] does not belong to the supported range, a range check exception is thrown.
;;;
;;; Store amounts of TonCoins to the builder as VarUInteger 16
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_coins(builder b, int x) asm "STGRAMS";

;;; Stores dictionary `D` represented by `cell` [c] or `null` into `builder` [b].
;;; In other words, stores a `1`-bit and a reference to [c] if [c] is not `null` and `0`-bit otherwise.
builder store_dict(builder b, cell c) asm(c b) "STDICT";

;;; Stores (Maybe ^Cell) to builder:
;;; if cell is null store 1 zero bit
;;; otherwise store 1 true bit and ref to cell
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";


{-
  # Address manipulation primitives
  The address manipulation primitives listed below serialize and deserialize values according to the following TL-B scheme:
  ```TL-B
  addr_none$00 = MsgAddressExt;
  addr_extern$01 len:(## 8) external_address:(bits len)
               = MsgAddressExt;
  anycast_info$_ depth:(#<= 30) { depth >= 1 }
    rewrite_pfx:(bits depth) = Anycast;
  addr_std$10 anycast:(Maybe Anycast)
    workchain_id:int8 address:bits256 = MsgAddressInt;
  addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
    workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
  _ _:MsgAddressInt = MsgAddress;
  _ _:MsgAddressExt = MsgAddress;

  int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
    src:MsgAddress dest:MsgAddressInt
    value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
    created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
  ```
  A deserialized `MsgAddress` is represented by a tuple `t` as follows:

  - `addr_none` is represented by `t = (0)`,
    i.e., a tuple containing exactly one integer equal to zero.
  - `addr_extern` is represented by `t = (1, s)`,
    where slice `s` contains the field `external_address`. In other words, `
    t` is a pair (a tuple consisting of two entries), containing an integer equal to one and slice `s`.
  - `addr_std` is represented by `t = (2, u, x, s)`,
    where `u` is either a `null` (if `anycast` is absent) or a slice `s'` containing `rewrite_pfx` (if anycast is present).
    Next, integer `x` is the `workchain_id`, and slice `s` contains the address.
  - `addr_var` is represented by `t = (3, u, x, s)`,
    where `u`, `x`, and `s` have the same meaning as for `addr_std`.
-}

;;; Loads from slice [s] the only prefix that is a valid `MsgAddress`,
;;; and returns both this prefix `s'` and the remainder `s''` of [s] as slices.
(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";

;;; Decomposes slice [s] containing a valid `MsgAddress` into a `tuple t` with separate fields of this `MsgAddress`.
;;; If [s] is not a valid `MsgAddress`, a cell deserialization exception is thrown.
tuple parse_addr(slice s) asm "PARSEMSGADDR";

;;; Parses slice [s] containing a valid `MsgAddressInt` (usually a `msg_addr_std`),
;;; applies rewriting from the anycast (if present) to the same-length prefix of the address,
;;; and returns both the workchain and the 256-bit address as integers.
;;; If the address is not 256-bit, or if [s] is not a valid serialization of `MsgAddressInt`,
;;; throws a cell deserialization exception.
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";

;;; A variant of [parse_std_addr] that returns the (rewritten) address as a slice [s],
;;; even if it is not exactly 256 bit long (represented by a `msg_addr_var`).
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

{-
  # Dictionary primitives
-}


;;; Sets the value associated with [key_len]-bit key signed index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";

;;; Sets the value associated with [key_len]-bit key unsigned index in dictionary [dict] to [value] (cell),
;;; and returns the resulting dictionary.
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";

cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF" "NULLSWAPIFNOT";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF" "NULLSWAPIFNOT";
(cell, cell) idict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETGETOPTREF";
(cell, cell) udict_set_get_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETGETOPTREF";
(cell, int) idict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDEL";
(cell, int) udict_delete?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDEL";
(slice, int) idict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGET" "NULLSWAPIFNOT";
(slice, int) udict_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGET" "NULLSWAPIFNOT";
(cell, slice, int) idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, slice, int) udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~idict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIDELGET" "NULLSWAPIFNOT";
(cell, (slice, int)) ~udict_delete_get?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUDELGET" "NULLSWAPIFNOT";
cell udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
(cell, ()) ~udict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUSET";
cell idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
(cell, ()) ~idict_set(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTISET";
cell dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, ()) ~dict_set(cell dict, int key_len, slice index, slice value) asm(value index dict key_len) "DICTSET";
(cell, int) udict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUADD";
(cell, int) udict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTUREPLACE";
(cell, int) idict_add?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIADD";
(cell, int) idict_replace?(cell dict, int key_len, int index, slice value) asm(value index dict key_len) "DICTIREPLACE";
cell udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
(cell, ()) ~udict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUSETB";
cell idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
(cell, ()) ~idict_set_builder(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTISETB";
cell dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, ()) ~dict_set_builder(cell dict, int key_len, slice index, builder value) asm(value index dict key_len) "DICTSETB";
(cell, int) udict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUADDB";
(cell, int) udict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTUREPLACEB";
(cell, int) idict_add_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIADDB";
(cell, int) idict_replace_builder?(cell dict, int key_len, int index, builder value) asm(value index dict key_len) "DICTIREPLACEB";
(cell, int, slice, int) udict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMIN" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_min(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMIN" "NULLSWAPIFNOT2";
(cell, int, slice, int) udict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~udict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTUREMMAX" "NULLSWAPIFNOT2";
(cell, int, slice, int) idict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, (int, slice, int)) ~idict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTIREMMAX" "NULLSWAPIFNOT2";
(cell, slice, slice, int) dict_delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(cell, (slice, slice, int)) ~dict::delete_get_max(cell dict, int key_len) asm(-> 0 2 1 3) "DICTREMMAX" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMIN" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAX" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMINREF" "NULLSWAPIFNOT2";
(int, cell, int) udict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTUMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_min?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMIN" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_max?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAX" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_min_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMINREF" "NULLSWAPIFNOT2";
(int, cell, int) idict_get_max_ref?(cell dict, int key_len) asm (-> 1 0 2) "DICTIMAXREF" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) udict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTUGETPREVEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_next?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXT" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_nexteq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETNEXTEQ" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_prev?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREV" "NULLSWAPIFNOT2";
(int, slice, int) idict_get_preveq?(cell dict, int key_len, int pivot) asm(pivot dict key_len -> 1 0 2) "DICTIGETPREVEQ" "NULLSWAPIFNOT2";

;;; Creates an empty dictionary, which is actually a null value. Equivalent to PUSHNULL
cell new_dict() asm "NEWDICT";
;;; Checks whether a dictionary is empty. Equivalent to cell_null?.
int dict_empty?(cell c) asm "DICTEMPTY";


{- Prefix dictionary primitives -}
(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

;;; Returns the value of the global configuration parameter with integer index `i` as a `cell` or `null` value.
cell config_param(int x) asm "CONFIGOPTPARAM";
;;; Checks whether c is a null. Note, that FunC also has polymorphic null? built-in.
int cell_null?(cell c) asm "ISNULL";

;;; Creates an output action which would reserve exactly amount nanotoncoins (if mode = 0), at most amount nanotoncoins (if mode = 2), or all but amount nanotoncoins (if mode = 1 or mode = 3), from the remaining balance of the account. It is roughly equivalent to creating an outbound message carrying amount nanotoncoins (or b − amount nanotoncoins, where b is the remaining balance) to oneself, so that the subsequent output actions would not be able to spend more money than the remainder. Bit +2 in mode means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved. Bit +8 in mode means `amount <- -amount` before performing any further actions. Bit +4 in mode means that amount is increased by the original balance of the current account (before the compute phase), including all extra currencies, before performing any other checks and actions. Currently, amount must be a non-negative integer, and mode must be in the range 0..15.
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
;;; Similar to raw_reserve, but also accepts a dictionary extra_amount (represented by a cell or null) with extra currencies. In this way currencies other than TonCoin can be reserved.
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
;;; Sends a raw message contained in msg, which should contain a correctly serialized object Message X, with the only exception that the source address is allowed to have dummy value addr_none (to be automatically replaced with the current smart contract address), and ihr_fee, fwd_fee, created_lt and created_at fields can have arbitrary values (to be rewritten with correct values during the action phase of the current transaction). Integer parameter mode contains the flags. Currently mode = 0 is used for ordinary messages; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract (instead of the value originally indicated in the message); mode = 64 is used for messages that carry all the remaining value of the inbound message in addition to the value initially indicated in the new message (if bit 0 is not set, the gas fees are deducted from this amount); mode' = mode + 1 means that the sender wants to pay transfer fees separately; mode' = mode + 2 means that any errors arising while processing this message during the action phase should be ignored. Finally, mode' = mode + 32 means that the current account must be destroyed if its resulting balance is zero. This flag is usually employed together with +128.
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
;;; Creates an output action that would change this smart contract code to that given by cell new_code. Notice that this change will take effect only after the successful termination of the current run of the smart contract
() set_code(cell new_code) impure asm "SETCODE";

;;; Generates a new pseudo-random unsigned 256-bit integer x. The algorithm is as follows: if r is the old value of the random seed, considered as a 32-byte array (by constructing the big-endian representation of an unsigned 256-bit integer), then its sha512(r) is computed; the first 32 bytes of this hash are stored as the new value r' of the random seed, and the remaining 32 bytes are returned as the next random value x.
int random() impure asm "RANDU256";
;;; Generates a new pseudo-random integer z in the range 0..range−1 (or range..−1, if range < 0). More precisely, an unsigned random value x is generated as in random; then z := x * range / 2^256 is computed.
int rand(int range) impure asm "RAND";
;;; Returns the current random seed as an unsigned 256-bit Integer.
int get_seed() impure asm "RANDSEED";
;;; Sets the random seed to unsigned 256-bit seed.
() set_seed(int x) impure asm "SETRAND";
;;; Mixes unsigned 256-bit integer x into the random seed r by setting the random seed to sha256 of the concatenation of two 32-byte strings: the first with the big-endian representation of the old seed r, and the second with the big-endian representation of x.
() randomize(int x) impure asm "ADDRAND";
;;; Equivalent to randomize(cur_lt());.
() randomize_lt() impure asm "LTIME" "ADDRAND";

;;; Checks whether the data parts of two slices coinside
int equal_slice_bits(slice a, slice b) asm "SDEQ";
int equal_slices(slice a, slice b) asm "SDEQ";

;;; Concatenates two builders
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: contracts/nft_collection.tact
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/contracts/nft_collection.tact
================================================
import "@stdlib/deploy";
import "@stdlib/ownable";
import "./imports/globals";
import "./imports/messages";
import "./nft_item";

struct CollectionData {
    next_item_index: Int as uint32;
    collection_content: Cell;
    owner: Address;
}

struct RoyaltyParams {
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

contract NftCollection with Deployable, OwnableTransferable {

    next_item_index: Int as uint32 = 0;
    owner: Address;
    royalty_params: RoyaltyParams;                      
    collection_content: Cell;   

    init(owner: Address, collection_content: Cell, royalty_params: RoyaltyParams){
        self.owner = owner;
        self.collection_content = collection_content; 
        self.royalty_params = royalty_params;
    }

    receive("Mint"){
        let ctx: Context = context(); // get sender Info

        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        self.mint(ctx.sender, msgValue);
    }

    // ===== Private Methods ===== //
    fun mint(sender: Address, msgValue: Int) {
        require(self.next_item_index >= 0, "non-sequential NFTs");
        
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: msgValue, 
                bounce: false,
                mode: SendIgnoreErrors,
                body: Transfer {
                    query_id: 0,
                    new_owner: sender,
                    response_destination: self.owner,
                    custom_payload: emptyCell(),
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        self.next_item_index = self.next_item_index + 1;
    }

    receive(msg: GetRoyaltyParams) {   
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  self.royalty_params.numerator,
                denominator: self.royalty_params.denominator,
                destination: self.owner
            }.toCell()
        });        
    }

    receive(msg: UpdateCollectionContent) {
        // Only Owner of the this NFT Collection can update it.
        self.requireOwner();

        self.collection_content = msg.new_content;
        self.royalty_params = RoyaltyParams{
            numerator: msg.numerator,
            denominator: msg.denominator,
            destination: msg.destination
        };
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {     
        let b: StringBuilder = beginString();
        let collectionDataString: String = self.collection_content.asSlice().asString();
        b.append(collectionDataString);
        b.append("meta.json"); // You can changed this your self.
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: b.toCell(), 
            owner: self.owner
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(myAddress(), item_index, self.owner, self.collection_content, self.owner);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        let b: StringBuilder = beginString();
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params;
    }
}


================================================
FILE: contracts/nft_item.tact
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/contracts/nft_item.tact
================================================
import "./imports/globals";
import "./imports/messages";

struct GetNftData { 
    is_initialized: Bool;
    index: Int as uint32;
    collection_address: Address; 
    owner: Address;
    individual_content: Cell;
    editor: Address;
}

contract NftItem {
    collection_address: Address;
    item_index: Int as uint32; 
    owner: Address;
    individual_content: Cell;
    editor: Address;
    is_initialized: Bool;

    init(collection_address: Address, item_index: Int, owner: Address, individual_content: Cell, editor: Address){
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.owner = collection_address;
        self.individual_content = individual_content;
        self.editor = editor;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context();
    
        let msgValue: Int = ctx.value; // Check the gasCost for storage
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        // Only Owner of the this NFT Item can transfer it.
        require(ctx.sender == self.owner, "access denied");

        require(msgValue > 0, "invalid amount");

        if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT
            self.is_initialized = true;
            self.owner = msg.new_owner;
            send(SendParameters{
                to: msg.response_destination,
                value: 0,
                mode:  SendIgnoreErrors + SendRemainingValue,
                body: Excesses { query_id: msg.query_id }.toCell() //0xd53276db
            });
        } else {
            self.owner = msg.new_owner; // change current owner to the new_owner
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode: SendIgnoreErrors, 
                    bounce: false,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }
            msgValue = msgValue - ctx.readForwardFee(); 
            if (msg.response_destination != null) { 
                send(SendParameters{ 
                    to: msg.response_destination,
                    value: msgValue - msg.forward_amount,
                    mode: SendPayGasSeparately,
                    body: Excesses { query_id: msg.query_id }.toCell() // 0xd53276db
                });
            } 
        }
    }

    receive(msg: GetStaticData){ 
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
    }

    receive(msg: TransferEditorship){
        let ctx: Context = context();
    
        let msgValue: Int = ctx.value; // Check the gasCost for storage
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        // Only Editor of the this NFT Item can transfer editorship.
        require(ctx.sender == self.editor, "access denied");
        require(msgValue > 0, "invalid amount");

        self.editor = msg.new_editor; // change current editor to the new_editor
        if (msg.forward_amount > 0) {
            send(SendParameters{
                to: msg.new_editor,
                value: msg.forward_amount,
                mode: SendIgnoreErrors, 
                bounce: false,
                body: EditorshipAssigned{
                    query_id: msg.query_id,
                    prev_editor: self.editor,
                    forward_payload: msg.forward_payload
                }.toCell()
            }); 
        }
        msgValue = msgValue - ctx.readForwardFee(); 
        if (msg.response_destination != null) { 
            send(SendParameters{ 
                to: msg.response_destination,
                value: msgValue - msg.forward_amount,
                mode: SendPayGasSeparately,
                body: Excesses { query_id: msg.query_id }.toCell() // 0xd53276db
            });
        } 
    }

    receive(msg: UpdateNftContent) {
        let ctx: Context = context();
        
        // Only Editor of the this NFT can edit it.
        require(ctx.sender == self.editor, "access denied");

        self.individual_content = msg.new_content;
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = self.individual_content.asSlice().asString();
        b.append(collectionData);
        b.append(self.item_index.toString());
        b.append(".json");

        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection_address, 
            owner: self.owner,
            individual_content: b.toCell(),
            editor: self.editor
        };
    }
}



================================================
FILE: jest.config.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/jest.config.ts
================================================
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;



================================================
FILE: scripts/deployNftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/scripts/deployNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { NftCollection } from "../wrappers/NftCollection";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/"; // Change to the content URL you prepared
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    // ===== Parameters =====
    // Replace owner with your address (if you use deeplink)
    let owner = provider.sender().address!;

    let collection = provider.open(await NftCollection.fromInit(owner, newContent, {
        $$type: "RoyaltyParams",
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }));

    // Do deploy
    await collection.send(provider.sender(), {value: toNano("0.1")}, "Mint");


    await provider.waitForDeploy(collection.address);

    // run methods on `collection`
}


================================================
FILE: scripts/readNftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/scripts/readNftCollection.ts
================================================
import { beginCell, contractAddress, toNano, Cell, Address } from "ton";
import { NetworkProvider } from '@ton-community/blueprint';
// ================================================================= //
import { NftCollection } from "../wrappers/NftCollection";
// ================================================================= //

export async function run(provider: NetworkProvider) {
    let collection_address = Address.parse("YOUR Collection ADDRESS");

    let collection = provider.open(NftCollection.fromAddress(collection_address));

    const nft_index = 0n;
    let address_by_index = await collection.getGetNftAddressByIndex(nft_index);

    console.log("NFT ID[" + nft_index + "]: " + address_by_index);
}


================================================
FILE: tests/NftCollection.spec.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/tests/NftCollection.spec.ts
================================================
import {toNano, beginCell, Address, Cell} from "ton";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton-community/sandbox";
import "@ton-community/test-utils";

import { NftCollection } from "../wrappers/NftCollection";
import {NftItem} from "../build/NftItem/tact_NftItem";

describe("nftCollection", () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;
    let nft: SandboxContract<NftItem>;
    let user: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");
        user = await blockchain.treasury("user");

        collection = blockchain.openContract(
            await NftCollection.fromInit(deployer.address, newContent, {
                $$type: "RoyaltyParams",
                numerator: 350n, // 350n = 35%
                denominator: 1000n,
                destination: deployer.address,
            })
        );

        const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, "Mint");
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it("Test", async () => {
        console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
        console.log("Collection Address: " + collection.address);
    });

    it("should deploy correctly", async () => {
        const deploy_result = await collection.send(deployer.getSender(),
            {
                value: toNano(1)
            }, "Mint"); // Send Mint Transaction
        
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });

        // Check getters
        expect((await collection.getRoyaltyParams()).numerator).toEqual(350n);

        console.log("next_item_index: " + (await collection.getGetCollectionData()).next_item_index);
    });

    it("should mint correctly", async () => {
        const result = await collection.send(deployer.getSender(), {
            value: toNano(1)
        }, "Mint");

        const nftAddress = new Address(0, Buffer.from(result.transactions[2].address.toString(16), 'hex'));
        expect(result.transactions).toHaveTransaction({
            from: collection.address,
            to: nftAddress,
            deploy: true,
            success: true
        });
        nft = blockchain.openContract(NftItem.fromAddress(nftAddress));
        let data = await nft.getGetNftData();
        expect(data.owner.toString()).toStrictEqual(deployer.address.toString());
        expect(data.collection_address.toString()).toStrictEqual(collection.address.toString());
        expect(data.index).toStrictEqual(2n);
    });

    it("should transfer", async () => {
       const result = await nft.send(deployer.getSender(), {
           value: toNano('0.2')
       },
       {
           $$type: 'Transfer',
           query_id: 0n,
           new_owner: user.address,
           response_destination: user.address,
           custom_payload: null,
           forward_amount: 0n,
           forward_payload: Cell.EMPTY
       }
       );
       expect(result.transactions).toHaveTransaction({
           from: deployer.address,
           to: nft.address,
           success: true
       });
       expect(result.transactions).toHaveTransaction({
           from: nft.address,
           to: user.address,
           success: true
       });
       expect((await nft.getGetNftData()).owner.toString()).toStrictEqual(user.address.toString());
    });

    it('should transfer editorship', async () => {
        await nft.send(deployer.getSender(), {
            value: toNano('0.2')
        },
        {
            $$type: 'TransferEditorship',
            query_id: 0n,
            new_editor: user.address,
            response_destination: user.address,
            forward_amount: 0n,
            forward_payload: Cell.EMPTY
        }
        );
        expect((await nft.getGetNftData()).editor.toString()).toStrictEqual(user.address.toString());
    });

    it('should edit metadata', async () => {
        const newContent = beginCell().storeStringTail('Spite').endCell();
        const result = await nft.send(user.getSender(), {
            value: toNano('0.2')
        },
        {
            $$type: 'UpdateNftContent',
            query_id: 0n,
            new_content: newContent
        }
        );
        expect(result.transactions).toHaveTransaction({
                from: user.address,
                to: nft.address,
                success: true
        });
        const content = beginCell()
            .storeStringTail('Spite') // collection data
            .storeStringTail('2') // index
            .storeStringTail('.json')
            .endCell();
        
        expect((await nft.getGetNftData()).individual_content.hash().toString('hex'))
            .toStrictEqual(content.hash().toString('hex'));
    });
});


================================================
FILE: wrappers/NftCollection.compile.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/wrappers/NftCollection.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/nft_collection.tact',
};



================================================
FILE: wrappers/NftCollection.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/wrappers/NftCollection.ts
================================================
export * from '../build/NftCollection/tact_NftCollection';



================================================
FILE: wrappers/NftItem.compile.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/wrappers/NftItem.compile.ts
================================================
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/nft_item.tact',
};



================================================
FILE: wrappers/NftItem.ts
URL: https://github.com/getgems-community-tact/nft-template-editable/blob/tutorial/wrappers/NftItem.ts
================================================
export * from '../build/NftItem/tact_NftItem';