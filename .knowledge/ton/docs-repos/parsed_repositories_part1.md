# GitHub Docs Parser - Part 1

# Repository: ton-docs
URL: https://github.com/ton-community/ton-docs
Branch: main

## Directory Structure:
```
└── ton-docs/
    ├── README.md
    ├── crowdin-oss.yml
    ├── docs/
        ├── v3/
            ├── concepts/
                ├── dive-into-ton/
                    ├── go-from-ethereum/
                        ├── blockchain-services.md
                        ├── difference-of-blockchains.md
                        ├── solidity-vs-func.md
                        ├── tvm-vs-evm.md
                    ├── introduction.mdx
                    ├── ton-blockchain/
                        ├── blockchain-comparison.md
                        ├── blockchain-of-blockchains.md
                        ├── cells-as-data-storage.md
                        ├── security-measures.md
                        ├── sharding.md
                        ├── smart-contract-addresses.md
                        ├── ton-networking.md
                    ├── ton-ecosystem/
                        ├── explorers-in-ton.mdx
                        ├── nft.md
                        ├── wallet-apps.mdx
                ├── educational-resources.mdx
                ├── glossary.md
                ├── qa-outsource/
                    ├── auditors.mdx
                    ├── outsource.mdx
            ├── contribute/
                ├── README.md
                ├── content-standardization.mdx
                ├── contribution-rules.md
                ├── docs/
                    ├── guidelines.md
                    ├── schemes-guidelines.mdx
                ├── localization-program/
                    ├── how-it-works.md
                    ├── how-to-contribute.md
                    ├── overview.md
                    ├── translation-style-guide.md
                ├── maintainers.md
                ├── participate.md
                ├── style-guide.mdx
                ├── tutorials/
                    ├── guidelines.md
                    ├── principles-of-a-good-tutorial.md
                    ├── sample-tutorial.md
                ├── typography.mdx
            ├── documentation/
                ├── archive/
                    ├── compile.md
                    ├── hacktoberfest-2022/
                        ├── README.mdx
                        ├── as-contributor.md
                        ├── as-maintainer.md
                    ├── mining.md
                    ├── pow-givers.md
                    ├── precompiled-binaries.md
                    ├── tg-bot-integration-py.md
                    ├── tg-bot-integration.mdx
                ├── dapps/
                    ├── assets/
                        ├── overview.md
                        ├── usdt.md
                    ├── dapps-overview.md
                    ├── defi/
                        ├── coins.md
                        ├── nft.md
                        ├── subscriptions.md
                        ├── tokens.mdx
                        ├── ton-payments.md
                    ├── oracles/
                        ├── about_blockchain_oracles.md
                        ├── pyth.mdx
                        ├── red_stone.mdx
                ├── data-formats/
                    ├── tl.md
                    ├── tlb/
                        ├── block-layout.md
                        ├── canonical-cell-serialization.md
                        ├── cell-boc.mdx
                        ├── crc32.md
                        ├── exotic-cells.md
                        ├── library-cells.md
                        ├── msg-tlb.mdx
                        ├── proofs.mdx
                        ├── tl-b-language.mdx
                        ├── tl-b-types.mdx
                        ├── tlb-ide.md
                        ├── tlb-tools.md
                        ├── transaction-layout.md
                ├── faq.md
                ├── infra/
                    ├── crosschain/
                        ├── bridge-addresses.md
                        ├── overview.md
                    ├── minter-flow.md
                    ├── nodes/
                        ├── mytonctrl/
                            ├── mytonctrl-errors.md
                            ├── mytonctrl-overview.mdx
                            ├── mytonctrl-status.mdx
                        ├── node-commands.mdx
                        ├── node-types.mdx
                        ├── validation/
                            ├── collators.md
                            ├── staking-incentives.md
                ├── network/
                    ├── configs/
                        ├── blockchain-configs.md
                        ├── config-params.md
                        ├── network-configs.md
                    ├── protocols/
                        ├── adnl/
                            ├── adnl-tcp.md
                            ├── adnl-udp.md
                            ├── low-level-adnl.md
                            ├── overview.md
                        ├── dht/
                            ├── dht-deep-dive.md
                            ├── ton-dht.md
                        ├── overlay.md
                        ├── rldp.md
                ├── smart-contracts/
                    ├── addresses.md
                    ├── contracts-specs/
                        ├── examples.md
                        ├── governance.md
                        ├── highload-wallet.md
                        ├── nominator-pool.mdx
                        ├── precompiled-contracts.md
                        ├── single-nominator-pool.md
                        ├── vesting-contract.mdx
                        ├── wallet-contracts.md
                    ├── fift/
                        ├── fift-and-tvm-assembly.md
                        ├── fift-deep-dive.md
                        ├── overview.mdx
                    ├── func/
                        ├── changelog.md
                        ├── cookbook.md
                        ├── docs/
                            ├── builtins.md
                            ├── comments.md
                            ├── compiler_directives.md
                            ├── dictionaries.md
                            ├── functions.md
                            ├── global_variables.md
                            ├── literals_identifiers.md
                            ├── statements.md
                            ├── stdlib.mdx
                            ├── types.md
                        ├── libraries.md
                        ├── overview.mdx
                    ├── getting-started/
                        ├── ide-plugins.md
                        ├── javascript.mdx
                        ├── testnet.md
                    ├── limits.md
                    ├── message-management/
                        ├── ecosystem-messages-layout.mdx
                        ├── external-messages.md
                        ├── internal-messages.md
                        ├── message-modes-cookbook.mdx
                        ├── messages-and-transactions.mdx
                        ├── non-bounceable-messages.md
                        ├── sending-messages.md
                    ├── overview.mdx
                    ├── shards/
                        ├── infinity-sharding-paradigm.mdx
                        ├── shards-intro.mdx
                    ├── tact.mdx
                    ├── tolk/
                        ├── changelog.md
                        ├── overview.mdx
                        ├── tolk-vs-func/
                            ├── create-message.md
                            ├── in-detail.mdx
                            ├── in-short.md
                            ├── mutability.mdx
                            ├── pack-to-from-cells.md
                            ├── stdlib.md
                    ├── transaction-fees/
                        ├── accept-message-effects.md
                        ├── fees-low-level.md
                        ├── fees.md
                        ├── forward-fees.md
                ├── ton-documentation.mdx
                ├── tvm/
                    ├── changelog/
                        ├── tvm-upgrade-2023-07.md
                        ├── tvm-upgrade-2024-04.md
                        ├── tvm-upgrade-2025-02.md
                    ├── specification/
                        ├── runvm.mdx
                    ├── tvm-exit-codes.md
                    ├── tvm-initialization.md
                    ├── tvm-overview.mdx
                ├── whitepapers/
                    ├── overview.md
            ├── guidelines/
                ├── dapps/
                    ├── apis-sdks/
                        ├── api-keys.mdx
                        ├── api-types.md
                        ├── getblock-ton-api.md
                        ├── overview.md
                        ├── sdk.mdx
                        ├── ton-adnl-apis.md
                        ├── ton-http-apis.md
                    ├── asset-processing/
                        ├── compressed-nfts.mdx
                        ├── jettons.md
                        ├── mass-mint-tools.mdx
                        ├── mintless-jettons.mdx
                        ├── nft-processing/
                            ├── metadata-parsing.md
                            ├── nfts.md
                        ├── payments-processing.md
                    ├── cookbook.mdx
                    ├── overview.mdx
                    ├── tma/
                        ├── grants.mdx
                        ├── guidelines/
                            ├── monetization.mdx
                            ├── publishing.mdx
                            ├── testing-apps.mdx
                            ├── tips-and-tricks.mdx
                        ├── notcoin.mdx
                        ├── overview.mdx
                        ├── tutorials/
                            ├── app-examples.mdx
                            ├── design-guidelines.mdx
                            ├── step-by-step-guide.mdx
                    ├── tutorials/
                        ├── jetton-airdrop.md
                        ├── mint-your-first-token.md
                        ├── nft-minting-guide.md
                        ├── telegram-bot-examples/
                            ├── accept-payments-in-a-telegram-bot-2.md
                            ├── accept-payments-in-a-telegram-bot-js.md
                            ├── accept-payments-in-a-telegram-bot.md
                        ├── web3-game-example.md
                        ├── zero-knowledge-proofs.md
                ├── get-started-with-ton.mdx
                ├── nodes/
                    ├── custom-overlays.md
                    ├── faq.mdx
                    ├── maintenance-guidelines/
                        ├── mytonctrl-backup-restore.md
                        ├── mytonctrl-private-alerting.md
                        ├── mytonctrl-prometheus.mdx
                        ├── mytonctrl-remote-controller.md
                        ├── mytonctrl-validator-standby.md
                    ├── monitoring/
                        ├── performance-monitoring.mdx
                    ├── node-maintenance-and-security.md
                    ├── nodes-troubleshooting.md
                    ├── overview.md
                    ├── persistent-states.md
                    ├── running-nodes/
                        ├── archive-node.md
                        ├── full-node.mdx
                        ├── liteserver-node.md
                        ├── run-mytonctrl-docker.md
                        ├── running-a-local-ton.md
                        ├── secure-guidelines.md
                        ├── staking-with-nominator-pools.md
                        ├── validator-node.md
                ├── overview.md
                ├── quick-start/
                    ├── blockchain-interaction/
                        ├── reading-from-network.mdx
                        ├── writing-to-network.mdx
                    ├── developing-smart-contracts/
                        ├── func-tolk-folder/
                            ├── blueprint-sdk-overview.mdx
                            ├── deploying-to-network.mdx
                            ├── processing-messages.mdx
                            ├── storage-and-get-methods.mdx
                        ├── setup-environment.mdx
                        ├── tact-folder/
                            ├── tact-blueprint-sdk-overview.mdx
                            ├── tact-deploying-to-network.mdx
                            ├── tact-storage-and-get-methods.mdx
                    ├── getting-started.mdx
                ├── smart-contracts/
                    ├── fee-calculation.md
                    ├── get-methods.md
                    ├── guidelines.mdx
                    ├── howto/
                        ├── airdrop-claim-best-practice.mdx
                        ├── compile/
                            ├── compilation-instructions.md
                            ├── instructions-low-memory.md
                        ├── multisig-js.md
                        ├── multisig.md
                        ├── nominator-pool.mdx
                        ├── shard-optimization.mdx
                        ├── single-nominator-pool.mdx
                        ├── wallet.md
                    ├── security/
                        ├── overview.mdx
                        ├── random-number-generation.md
                        ├── random.md
                        ├── secure-programming.mdx
                        ├── things-to-focus.md
                        ├── ton-hack-challenge-1.md
                    ├── testing/
                        ├── overview.mdx
                        ├── writing-test-examples.mdx
                ├── ton-connect/
                    ├── business/
                        ├── ton-connect-for-business.md
                        ├── ton-connect-for-security.md
                    ├── frameworks/
                        ├── react.mdx
                        ├── vue.mdx
                        ├── web.mdx
                    ├── guidelines/
                        ├── creating-manifest.md
                        ├── developers.md
                        ├── how-ton-connect-works.mdx
                        ├── integration-with-javascript-sdk.md
                        ├── preparing-messages.mdx
                        ├── sending-messages.md
                        ├── verifying-signed-in-users.mdx
                    ├── overview.mdx
                    ├── wallet.mdx
                ├── web3/
                    ├── overview.mdx
                    ├── ton-dns/
                        ├── dns.md
                        ├── subresolvers.md
                    ├── ton-proxy-sites/
                        ├── connect-with-ton-proxy.md
                        ├── how-to-open-any-ton-site.md
                        ├── how-to-run-ton-site.md
                        ├── running-your-own-ton-proxy.md
                        ├── site-and-domain-management.md
                        ├── ton-sites-for-applications.mdx
                    ├── ton-storage/
                        ├── storage-daemon.md
                        ├── storage-faq.md
                        ├── storage-provider.md
    ├── helm/
        ├── app/
            ├── Chart.yaml
            ├── templates/
                ├── ghcr-secret.yaml
                ├── ingress.yaml
                ├── ns-resource-quota.yaml
                ├── service-monitor.yaml
                ├── service.yaml
            ├── values-staging.yaml
            ├── values.yaml
    ├── i18n/
        ├── ja/
            ├── code.json
            ├── docusaurus-plugin-content-docs/
                ├── current/
                    ├── v3/
                        ├── contribute/
                            ├── docs/
                                ├── guidelines.md
                ├── current.json
        ├── ko/
            ├── code.json
            ├── docusaurus-plugin-content-docs/
                ├── current/
                    ├── v3/
                        ├── contribute/
                            ├── README.md
                            ├── archive/
                                ├── hacktoberfest-2022/
                                    ├── README.mdx
                                    ├── as-contributor.md
                                    ├── as-maintainer.md
                            ├── contribution-rules.md
                            ├── docs/
                                ├── guidelines.md
                                ├── schemes-guidelines.mdx
                            ├── maintainers.md
                            ├── participate.md
                            ├── tutorials/
                                ├── guidelines.md
                                ├── principles-of-a-good-tutorial.md
                                ├── sample-tutorial.md
                        ├── develop/
                            ├── archive/
                                ├── mining.md
                                ├── pow-givers.md
                            ├── blockchain/
                                ├── sharding-lifecycle.mdx
                                ├── shards.mdx
                            ├── companies/
                                ├── auditors.mdx
                                ├── outsource.mdx
                            ├── dapps/
                                ├── apis/
                                    ├── adnl.md
                                    ├── getblock-ton-api.md
                ├── current.json
            ├── docusaurus-plugin-content-pages/
                ├── index/
                    ├── features.js
                    ├── index.module.css
                ├── index.tsx
        ├── ru/
            ├── docusaurus-plugin-content-docs/
                ├── current/
                    ├── v3/
                        ├── concepts/
                            ├── dive-into-ton/
                                ├── go-from-ethereum/
                                    ├── blockchain-services.md
                                    ├── difference-of-blockchains.md
                                    ├── solidity-vs-func.md
                                    ├── tvm-vs-evm.md
                                ├── introduction.mdx
                                ├── ton-blockchain/
                                    ├── blockchain-comparison.md
                                    ├── blockchain-of-blockchains.md
                                    ├── cells-as-data-storage.md
                                    ├── security-measures.md
                                    ├── sharding.md
                                    ├── smart-contract-addresses.md
                                    ├── ton-networking.md
                                ├── ton-ecosystem/
                                    ├── explorers-in-ton.mdx
                                    ├── wallet-apps.mdx
                            ├── educational-resources.mdx
                            ├── glossary.md
                            ├── qa-outsource/
                                ├── auditors.mdx
                                ├── outsource.mdx
                        ├── contribute/
                            ├── README.md
                            ├── contribution-rules.md
                            ├── docs/
                                ├── guidelines.md
                                ├── schemes-guidelines.mdx
                            ├── localization-program/
                                ├── how-it-works.md
                                ├── how-to-contribute.md
                                ├── overview.md
                                ├── translation-style-guide.md
                            ├── maintainers.md
                            ├── participate.md
                            ├── style-guide.mdx
                            ├── tutorials/
                                ├── guidelines.md
                                ├── principles-of-a-good-tutorial.md
                                ├── sample-tutorial.md
                            ├── typography.mdx
                        ├── documentation/
                            ├── archive/
                                ├── compile.md
                                ├── hacktoberfest-2022/
                                    ├── README.mdx
                                    ├── as-contributor.md
                                    ├── as-maintainer.md
                                ├── mining.md
                                ├── pow-givers.md
                                ├── precompiled-binaries.md
                                ├── tg-bot-integration-py.md
                                ├── tg-bot-integration.mdx
                            ├── dapps/
                                ├── assets/
                                    ├── overview.md
                                    ├── usdt.md
                                ├── defi/
                                    ├── coins.md
                                    ├── subscriptions.md
                                    ├── tokens.mdx
                                    ├── ton-payments.md
                                ├── oracles/
                                    ├── about_blockchain_oracles.md
                                    ├── pyth.mdx
                                    ├── red_stone.mdx
                            ├── data-formats/
                                ├── tl.md
                                ├── tlb/
                                    ├── block-layout.md
                                    ├── canonical-cell-serialization.md
                                    ├── cell-boc.mdx
                                    ├── crc32.md
                                    ├── exotic-cells.md
                                    ├── library-cells.md
                                    ├── msg-tlb.mdx
                                    ├── proofs.mdx
                                    ├── tl-b-language.mdx
                                    ├── tl-b-types.mdx
                                    ├── tlb-ide.md
                                    ├── tlb-tools.md
                                    ├── transaction-layout.md
                            ├── faq.md
                            ├── infra/
                                ├── crosschain/
                                    ├── bridge-addresses.md
                                    ├── overview.md
                                ├── minter-flow.md
                                ├── nodes/
                                    ├── mytonctrl/
                                        ├── mytonctrl-alerting.md
                                        ├── mytonctrl-errors.md
                                        ├── mytonctrl-overview.mdx
                                        ├── mytonctrl-status.mdx
                                    ├── node-commands.mdx
                                    ├── node-types.mdx
                                    ├── validation/
                                        ├── collators.md
                                        ├── staking-incentives.md
                            ├── network/
                                ├── configs/
                                    ├── blockchain-configs.md
                                    ├── config-params.md
                                    ├── network-configs.md
                                ├── protocols/
                                    ├── adnl/
                                        ├── adnl-tcp.md
                                        ├── adnl-udp.md
                                        ├── low-level-adnl.md
                                        ├── overview.md
                                    ├── dht/
                                        ├── dht-deep-dive.md
                                        ├── ton-dht.md
                                    ├── overlay.md
                                    ├── rldp.md
                            ├── smart-contracts/
                                ├── addresses.md
                                ├── contracts-specs/
                                    ├── examples.md
                                    ├── governance.md
                                    ├── highload-wallet.md
                                    ├── nominator-pool.mdx
                                    ├── precompiled-contracts.md
                                    ├── single-nominator-pool.md
                                    ├── vesting-contract.mdx
                                    ├── wallet-contracts.md
                                ├── fift/
                                    ├── fift-and-tvm-assembly.md
                                    ├── fift-deep-dive.md
                                    ├── overview.mdx
                                ├── func/
                                    ├── changelog.md
                                    ├── cookbook.md
                                    ├── docs/
                                        ├── builtins.md
                                        ├── comments.md
                                        ├── compiler_directives.md
                                        ├── dictionaries.md
                                        ├── functions.md
                                        ├── global_variables.md
                                        ├── literals_identifiers.md
                                        ├── statements.md
                                        ├── stdlib.mdx
                                        ├── types.md
                                    ├── libraries.md
                                    ├── overview.mdx
                                ├── getting-started/
                                    ├── ide-plugins.md
                                    ├── javascript.mdx
                                    ├── testnet.md
                                ├── message-management/
                                    ├── ecosystem-messages-layout.mdx
                                    ├── external-messages.md
                                    ├── internal-messages.md
                                    ├── message-modes-cookbook.mdx
                                    ├── messages-and-transactions.mdx
                                    ├── non-bounceable-messages.md
                                    ├── sending-messages.md
                                ├── overview.mdx
                                ├── shards/
                                    ├── infinity-sharding-paradigm.mdx
                                    ├── shards-intro.mdx
                                ├── tolk/
                                    ├── changelog.md
                                    ├── overview.mdx
                                    ├── tolk-vs-func/
                                        ├── in-detail.mdx
                                        ├── in-short.md
                                        ├── mutability.mdx
                                        ├── stdlib.md
                                ├── transaction-fees/
                                    ├── accept-message-effects.md
                                    ├── fees-low-level.md
                                    ├── fees.md
                                    ├── forward-fees.md
                            ├── ton-documentation.mdx
                            ├── tvm/
                                ├── changelog/
                                    ├── tvm-upgrade-2023-07.md
                                    ├── tvm-upgrade-2024-04.md
                                ├── specification/
                                    ├── runvm.mdx
                                ├── tvm-exit-codes.md
                                ├── tvm-initialization.md
                                ├── tvm-overview.mdx
                            ├── whitepapers/
                                ├── overview.md
                        ├── guidelines/
                            ├── dapps/
                                ├── apis-sdks/
                                    ├── api-keys.mdx
                                    ├── api-types.md
                                    ├── getblock-ton-api.md
                                    ├── overview.md
                                    ├── sdk.mdx
                                    ├── ton-adnl-apis.md
                                    ├── ton-http-apis.md
                                ├── asset-processing/
                                    ├── jettons.md
                                    ├── mass-mint-tools.mdx
                                    ├── mintless-jettons.mdx
                                    ├── nft-processing/
                                        ├── metadata-parsing.md
                                        ├── nfts.md
                                    ├── payments-processing.md
                                ├── cookbook.mdx
                                ├── overview.mdx
                                ├── tma/
                                    ├── grants.mdx
                                    ├── guidelines/
                                        ├── monetization.mdx
                                        ├── publishing.mdx
                                        ├── testing-apps.mdx
                                        ├── tips-and-tricks.mdx
                                    ├── notcoin.mdx
                                    ├── overview.mdx
                                    ├── tutorials/
                                        ├── app-examples.mdx
                                        ├── design-guidelines.mdx
                                        ├── step-by-step-guide.mdx
                                ├── tutorials/
                                    ├── mint-your-first-token.md
                                    ├── nft-minting-guide.md
                                    ├── telegram-bot-examples/
                                        ├── accept-payments-in-a-telegram-bot-2.md
                                        ├── accept-payments-in-a-telegram-bot-js.md
                                        ├── accept-payments-in-a-telegram-bot.md
                                    ├── web3-game-example.md
                                    ├── zero-knowledge-proofs.md
                            ├── get-started-with-ton.mdx
                            ├── nodes/
                                ├── custom-overlays.md
                                ├── faq.mdx
                                ├── maintenance-guidelines/
                                    ├── mytonctrl-private-alerting.md
                                    ├── mytonctrl-prometheus.mdx
                                    ├── mytonctrl-remote-controller.md
                                ├── monitoring/
                                    ├── performance-monitoring.mdx
                                ├── node-maintenance-and-security.md
                                ├── nodes-troubleshooting.md
                                ├── overview.md
                                ├── persistent-states.md
                                ├── running-nodes/
                                    ├── archive-node.md
                                    ├── full-node.mdx
                                    ├── liteserver-node.md
                                    ├── run-mytonctrl-docker.md
                                    ├── running-a-local-ton.md
                                    ├── secure-guidelines.md
                                    ├── staking-with-nominator-pools.md
                                    ├── validator-node.md
                            ├── overview.md
                            ├── quick-start/
                                ├── blockchain-interaction/
                                    ├── reading-from-network.mdx
                                    ├── writing-to-network.mdx
                                ├── developing-smart-contracts/
                                    ├── func-tolk-folder/
                                        ├── blueprint-sdk-overview.mdx
                                        ├── deploying-to-network.mdx
                                        ├── processing-messages.mdx
                                        ├── storage-and-get-methods.mdx
                                    ├── setup-environment.mdx
                                    ├── tact-folder/
                                        ├── tact-blueprint-sdk-overview.mdx
                                        ├── tact-deploying-to-network.mdx
                                        ├── tact-storage-and-get-methods.mdx
                                ├── getting-started.mdx
                            ├── smart-contracts/
                                ├── fee-calculation.md
                                ├── get-methods.md
                                ├── guidelines.mdx
                                ├── howto/
                                    ├── airdrop-claim-best-practice.mdx
                                    ├── compile/
                                        ├── compilation-instructions.md
                                        ├── instructions-low-memory.md
                                    ├── multisig-js.md
                                    ├── multisig.md
                                    ├── nominator-pool.mdx
                                    ├── shard-optimization.mdx
                                    ├── single-nominator-pool.mdx
                                    ├── wallet.md
                                ├── security/
                                    ├── overview.mdx
                                    ├── random-number-generation.md
                                    ├── random.md
                                    ├── secure-programming.mdx
                                    ├── things-to-focus.md
                                    ├── ton-hack-challenge-1.md
                                ├── testing/
                                    ├── overview.mdx
                                    ├── writing-test-examples.mdx
                            ├── ton-connect/
                                ├── business/
                                    ├── ton-connect-comparison.md
                                    ├── ton-connect-for-business.md
                                    ├── ton-connect-for-security.md
                                ├── frameworks/
                                    ├── react.mdx
                                    ├── vue.mdx
                                    ├── web.mdx
                                ├── guidelines/
                                    ├── creating-manifest.md
                                    ├── developers.md
                                    ├── how-ton-connect-works.mdx
                                    ├── integration-with-javascript-sdk.md
                                    ├── preparing-messages.mdx
                                    ├── sending-messages.md
                                    ├── verifying-signed-in-users.mdx
                                ├── overview.mdx
                                ├── wallet.mdx
                            ├── web3/
                                ├── overview.mdx
                                ├── ton-dns/
                                    ├── dns.md
                                    ├── subresolvers.md
                                ├── ton-proxy-sites/
                                    ├── connect-with-ton-proxy.md
                                    ├── how-to-open-any-ton-site.md
                                    ├── how-to-run-ton-site.md
                                    ├── running-your-own-ton-proxy.md
                                    ├── site-and-domain-management.md
                                    ├── ton-sites-for-applications.mdx
                                ├── ton-storage/
                                    ├── storage-daemon.md
                                    ├── storage-faq.md
                                    ├── storage-provider.md
        ├── zh-CN/
            ├── code.json
            ├── docusaurus-plugin-content-docs/
                ├── current/
                    ├── v3/
                        ├── concepts/
                            ├── academy-overview.mdx
                            ├── dive-into-ton/
                                ├── go-from-ethereum/
                                    ├── blockchain-services.md
                                    ├── difference-of-blockchains.md
                                    ├── solidity-vs-func.md
                                    ├── tvm-vs-evm.md
                                ├── introduction.mdx
                                ├── ton-blockchain/
                                    ├── blockchain-comparison.md
                                    ├── blockchain-of-blockchains.md
                                    ├── cells-as-data-storage.md
                                    ├── security-measures.md
                                    ├── sharding.md
                                    ├── smart-contract-addresses.md
                                    ├── ton-networking.md
                                ├── ton-ecosystem/
                                    ├── explorers-in-ton.mdx
                                    ├── nft.md
                                    ├── wallet-apps.mdx
                            ├── educational-resources.mdx
                            ├── glossary.md
                            ├── qa-outsource/
                                ├── auditors.mdx
                                ├── outsource.mdx
                        ├── contribute/
                            ├── README.md
                            ├── contribution-rules.md
                            ├── docs/
                                ├── guidelines.md
                                ├── schemes-guidelines.mdx
                            ├── localization-program/
                                ├── how-it-works.md
                                ├── how-to-contribute.md
                                ├── overview.md
                                ├── translation-style-guide.md
                            ├── maintainers.md
                            ├── participate.md
                            ├── tutorials/
                                ├── guidelines.md
                                ├── principles-of-a-good-tutorial.md
                                ├── sample-tutorial.md
                        ├── documentation/
                            ├── archive/
                                ├── compile.md
                                ├── hacktoberfest-2022/
                                    ├── README.mdx
                                    ├── as-contributor.md
                                    ├── as-maintainer.md
                                ├── mining.md
                                ├── pow-givers.md
                                ├── precompiled-binaries.md
                                ├── tg-bot-integration-py.md
                                ├── tg-bot-integration.mdx
                            ├── dapps/
                                ├── assets/
                                    ├── overview.md
                                    ├── usdt.md
                                ├── defi/
                                    ├── coins.md
                                    ├── subscriptions.md
                                    ├── tokens.mdx
                                    ├── ton-payments.md
                                ├── oracles/
                                    ├── about_blockchain_oracles.md
                                    ├── pyth.mdx
                                    ├── red_stone.mdx
                            ├── data-formats/
                                ├── tl.md
                                ├── tlb/
                                    ├── block-layout.md
                                    ├── canonical-cell-serialization.md
                                    ├── cell-boc.mdx
                                    ├── crc32.md
                                    ├── exotic-cells.md
                                    ├── library-cells.md
                                    ├── msg-tlb.mdx
                                    ├── proofs.mdx
                                    ├── tl-b-language.mdx
                                    ├── tl-b-types.mdx
                                    ├── tlb-ide.md
                                    ├── tlb-tools.md
                                    ├── transaction-layout.md
                            ├── faq.md
                            ├── infra/
                                ├── crosschain/
                                    ├── bridge-addresses.md
                                    ├── overview.md
                                ├── minter-flow.md
                                ├── nodes/
                                    ├── mytonctrl/
                                        ├── mytonctrl-alerting.md
                                        ├── mytonctrl-errors.md
                                        ├── mytonctrl-overview.mdx
                                        ├── mytonctrl-status.mdx
                                    ├── node-commands.mdx
                                    ├── node-types.md
                                    ├── node-types.mdx
                                    ├── validation/
                                        ├── collators.md
                                        ├── staking-incentives.md
                            ├── network/
                                ├── configs/
                                    ├── blockchain-configs.md
                                    ├── config-params.md
                                    ├── network-configs.md
                                ├── protocols/
                                    ├── adnl/
                                        ├── adnl-tcp.md
                                        ├── adnl-udp.md
                                        ├── low-level-adnl.md
                                        ├── overview.md
                                    ├── dht/
                                        ├── dht-deep-dive.md
                                        ├── ton-dht.md
                                    ├── overlay.md
                                    ├── rldp.md
                            ├── smart-contracts/
                                ├── README.mdx
                                ├── addresses.md
                                ├── contracts-specs/
                                    ├── examples.md
                                    ├── governance.md
                                    ├── highload-wallet.md
                                    ├── nominator-pool.mdx
                                    ├── precompiled-contracts.md
                                    ├── single-nominator-pool.md
                                    ├── vesting-contract.mdx
                                    ├── wallet-contracts.md
                                ├── fift/
                                    ├── fift-and-tvm-assembly.md
                                    ├── fift-deep-dive.md
                                    ├── overview.mdx
                                ├── func/
                                    ├── changelog.md
                                    ├── cookbook.md
                                    ├── docs/
                                        ├── builtins.md
                                        ├── comments.md
                                        ├── compiler_directives.md
                                        ├── dictionaries.md
                                        ├── functions.md
                                        ├── global_variables.md
                                        ├── literals_identifiers.md
                                        ├── statements.md
                                        ├── stdlib.mdx
                                        ├── types.md
                                    ├── libraries.md
                                    ├── overview.mdx
                                ├── getting-started/
                                    ├── ide-plugins.md
                                    ├── javascript.mdx
                                    ├── testnet.md
                                ├── guidelines.mdx
                                ├── message-management/
                                    ├── ecosystem-messages-layout.mdx
                                    ├── external-messages.md
                                    ├── internal-messages.md
                                    ├── message-modes-cookbook.mdx
                                    ├── messages-and-transactions.mdx
                                    ├── non-bounceable-messages.md
                                    ├── sending-messages.md
                                ├── overview.mdx
                                ├── shards/
                                    ├── infinity-sharding-paradigm.mdx
                                    ├── shards-intro.mdx
                                ├── tolk/
                                    ├── changelog.md
                                    ├── overview.mdx
                                    ├── tolk-vs-func/
                                        ├── in-detail.mdx
                                        ├── in-short.md
                                        ├── mutability.mdx
                                        ├── stdlib.md
                                ├── transaction-fees/
                                    ├── accept-message-effects.md
                                    ├── fees-low-level.md
                                    ├── fees.md
                                    ├── forward-fees.md
                            ├── ton-documentation.mdx
                            ├── tvm/
                                ├── changelog/
                                    ├── tvm-upgrade-2023-07.md
                                    ├── tvm-upgrade-2024-04.md
                                ├── specification/
                                    ├── runvm.mdx
                                ├── tvm-exit-codes.md
                                ├── tvm-initialization.md
                                ├── tvm-overview.mdx
                            ├── whitepapers/
                                ├── overview.md
                        ├── guidelines/
                            ├── dapps/
                                ├── README.mdx
                                ├── apis-sdks/
                                    ├── api-keys.mdx
                                    ├── api-types.md
                                    ├── getblock-ton-api.md
                                    ├── overview.md
                                    ├── sdk.mdx
                                    ├── ton-adnl-apis.md
                                    ├── ton-http-apis.md
                                ├── asset-processing/
                                    ├── README.mdx
                                    ├── jettons.md
                                    ├── jettons.mdx
                                    ├── mass-mint-tools.mdx
                                    ├── mintless-jettons.mdx
                                    ├── nft-processing/
                                        ├── metadata-parsing.md
                                        ├── nfts.md
                                    ├── payments-processing.md
                                ├── cookbook.md
                                ├── cookbook.mdx
                                ├── overview.mdx
                                ├── tma/
                                    ├── README.mdx
                                    ├── grants.mdx
                                    ├── guidelines/
                                        ├── monetization.mdx
                                        ├── publishing.mdx
                                        ├── testing-apps.mdx
                                        ├── tips-and-tricks.mdx
                                    ├── notcoin.mdx
                                    ├── overview.mdx
                                    ├── tutorials/
                                        ├── app-examples.mdx
                                        ├── design-guidelines.mdx
                                        ├── step-by-step-guide.mdx
                                ├── tutorials/
                                    ├── mint-your-first-token.md
                                    ├── nft-minting-guide.md
                                    ├── telegram-bot-examples/
                                        ├── accept-payments-in-a-telegram-bot-2.md
                                        ├── accept-payments-in-a-telegram-bot-js.md
                                        ├── accept-payments-in-a-telegram-bot.md
                                    ├── web3-game-example.md
                                    ├── zero-knowledge-proofs.md
                            ├── get-started-with-ton.mdx
                            ├── nodes/
                                ├── custom-overlays.md
                                ├── faq.mdx
                                ├── monitoring/
                                    ├── performance-monitoring.mdx
                                ├── node-maintenance-and-security.md
                                ├── nodes-troubleshooting.md
                                ├── overview.md
                                ├── persistent-states.md
                                ├── running-nodes/
                                    ├── archive-node.md
                                    ├── full-node.mdx
                                    ├── liteserver-node.md
                                    ├── liteserver.mdx
                                    ├── run-mytonctrl-docker.md
                                    ├── running-a-local-ton.md
                                    ├── secure-guidelines.md
                                    ├── staking-with-nominator-pools.md
                                    ├── validator-node.md
                            ├── overview.md
                            ├── smart-contracts/
                                ├── fee-calculation.md
                                ├── get-methods.md
                                ├── guidelines.mdx
                                ├── howto/
                                    ├── airdrop-claim-best-practice.mdx
                                    ├── compile/
                                        ├── compilation-instructions.md
                                        ├── instructions-low-memory.md
                                    ├── multisig-js.md
                                    ├── multisig.md
                                    ├── nominator-pool.mdx
                                    ├── shard-optimization.mdx
                                    ├── single-nominator-pool.mdx
                                    ├── wallet.md
                                ├── security/
                                    ├── overview.mdx
                                    ├── random-number-generation.md
                                    ├── random.md
                                    ├── secure-programming.mdx
                                    ├── things-to-focus.md
                                    ├── ton-hack-challenge-1.md
                                ├── testing/
                                    ├── overview.mdx
                                    ├── writing-test-examples.mdx
                            ├── ton-connect/
                                ├── business/
                                    ├── ton-connect-comparison.md
                                    ├── ton-connect-for-business.md
                                    ├── ton-connect-for-security.md
                                ├── frameworks/
                                    ├── react.mdx
                                    ├── vue.mdx
                                    ├── web.mdx
                                ├── guidelines/
                                    ├── creating-manifest.md
                                    ├── developers.md
                                    ├── how-ton-connect-works.mdx
                                    ├── integration-with-javascript-sdk.md
                                    ├── preparing-messages.mdx
                                    ├── sending-messages.md
                                    ├── verifying-signed-in-users.mdx
                                ├── overview.mdx
                                ├── wallet.mdx
                            ├── web3/
                                ├── overview.mdx
                                ├── ton-dns/
                                    ├── dns.md
                                    ├── subresolvers.md
                                ├── ton-proxy-sites/
                                    ├── connect-with-ton-proxy.md
                                    ├── how-to-open-any-ton-site.md
                                    ├── how-to-run-ton-site.md
                                    ├── running-your-own-ton-proxy.md
                                    ├── site-and-domain-management.md
                                    ├── ton-sites-for-applications.mdx
                                ├── ton-storage/
                                    ├── storage-daemon.md
                                    ├── storage-faq.md
                                    ├── storage-provider.md
                ├── current.json
            ├── docusaurus-plugin-content-pages/
                ├── features.js
                ├── index.module.css
                ├── index.tsx
                ├── learn/
                    ├── archive/
                        ├── tvm-instructions.mdx
                    ├── tvm-instructions/
                        ├── instructions/
                            ├── app-specific.mdx
                            ├── arithmetic.mdx
                            ├── cell-manipulation.mdx
                            ├── constant.mdx
                            ├── control-flow.mdx
                            ├── data-comparison.mdx
                            ├── dictionary-manipulation.mdx
                            ├── exception-gen-and-handling.mdx
                            ├── miscellaneous.mdx
                            ├── stack-manipulation.mdx
                            ├── tuple-list-null.mdx
                        ├── instructions.mdx
            ├── docusaurus-theme-classic/
    ├── old-docs/
        ├── full-node.mdx
        ├── lite-client.md
        ├── validator.mdx
    ├── sidebars/
        ├── concepts.js
        ├── contribute.js
        ├── documentation.js
        ├── guidelines.js
    ├── src/
        ├── assets/
            ├── icons/
                ├── coinmarketcap.svg
                ├── dislike-dark.svg
                ├── dislike-light.svg
                ├── github.svg
                ├── index.ts
                ├── like-dark.svg
                ├── like-light.svg
                ├── linked_in.svg
                ├── logo.svg
                ├── logo_small.svg
                ├── mail.svg
                ├── telegram_circle.svg
                ├── twitter.svg
        ├── components/
            ├── Feedback/
                ├── Button.module.css
                ├── Button.tsx
                ├── index.module.css
                ├── index.tsx
            ├── Instructions/
                ├── DisplayableInstruction.ts
                ├── InstructionGroups.tsx
                ├── InstructionHead.tsx
                ├── InstructionRow.module.css
                ├── InstructionRow.tsx
                ├── InstructionSearch.module.css
                ├── InstructionSearch.tsx
                ├── InstructionTable.tsx
                ├── index.ts
                ├── types.ts
            ├── MDXPage/
                ├── index.js
                ├── styles.module.css
            ├── MnemonicGenerator.tsx
            ├── RedirectPage.tsx
            ├── SearchField/
                ├── SearchField.module.css
                ├── index.tsx
            ├── button.tsx
            ├── conceptImage.tsx
            ├── contentBlock.tsx
            ├── player.tsx
        ├── css/
            ├── bootstrap-only-grid.css
            ├── custom.css
        ├── data/
            ├── features.js
            ├── opcodes/
                ├── app_specific.json
                ├── arithmetic.json
                ├── cell_manipulation.json
                ├── comparison.json
                ├── constant.json
                ├── continuation.json
                ├── dictionaries.json
                ├── exceptions.json
                ├── index.ts
                ├── miscellaneous.json
                ├── opcodes.json
                ├── stack_manipulation.json
                ├── tuple.json
        ├── grammar/
            ├── commands-dictionary.txt
            ├── examples-dictionary.txt
            ├── names-dictionary.txt
            ├── tvm-dictionary.txt
        ├── hooks/
            ├── index.ts
            ├── use-debounce.ts
        ├── pages/
            ├── develop/
                ├── dapps/
                    ├── ton-connect/
                        ├── protocol/
                            ├── bridge.tsx
                            ├── index.tsx
                            ├── requests-responses.tsx
                            ├── session.tsx
                            ├── wallet-guidelines.tsx
                            ├── workflow.tsx
            ├── hacktonberfest.tsx
            ├── index.module.css
            ├── index.tsx
            ├── v3/
                ├── documentation/
                    ├── tvm/
                        ├── instructions.mdx
        ├── theme/
            ├── Footer/
                ├── Footer.scss
                ├── GridSystem/
                    ├── NewCol/
                        ├── NewCol.scss
                        ├── index.tsx
                    ├── NewRow/
                        ├── NewRow.scss
                        ├── index.tsx
                    ├── index.ts
                ├── Logo/
                    ├── Logo.scss
                    ├── index.tsx
                ├── NetworkIcon/
                    ├── index.tsx
                ├── Separator/
                    ├── Separator.scss
                    ├── index.tsx
                ├── Typography/
                    ├── Caption/
                        ├── Caption.scss
                        ├── Caption.tsx
                    ├── Text/
                        ├── Text.scss
                        ├── Text.tsx
                    ├── index.ts
                ├── config.ts
                ├── index.tsx
                ├── styles/
                    ├── _all.scss
                    ├── base/
                        ├── _breakpoints.scss
                        ├── _colors.scss
                        ├── _vars.scss
                    ├── utils/
                        ├── _media_queries.scss
                        ├── _mixins.scss
                        ├── _typography.scss
            ├── prism/
                ├── prism-fift.js
                ├── prism-func.js
                ├── prism-tact.js
                ├── prism-tlb.js
                ├── prism-tolk.js
            ├── prism-include-languages.js
    ├── static/
        ├── .nojekyll
        ├── audits/
            ├── TON_Blockchain_CertiK.pdf
            ├── TON_Blockchain_Formal_Verification_CertiK.pdf
            ├── TON_Blockchain_SlowMist.pdf
            ├── TON_Blockchain_ToB.pdf
            ├── TON_Blockchain_tonlib_Zellic.pdf
            ├── TVM_Upgrade_ToB_2023.pdf
            ├── TVM_and_Fift_ToB.pdf
        ├── catchain.pdf
        ├── example-code-snippets/
            ├── pythoniq/
                ├── jetton-offline-address-calc-wrapper.py
        ├── fiftbase.pdf
        ├── files/
            ├── HackTonB.mp4
            ├── TON_nodes.mp4
            ├── TonConnect.mp4
            ├── nft-sm.mp4
            ├── onboarding-nft.mp4
            ├── onboarding.mp4
            ├── tg-payments.mp4
            ├── twa.mp4
        ├── img/
            ├── arrow.svg
            ├── banner-bg.svg
            ├── blueprint/
                ├── logo.svg
            ├── docs/
                ├── Jetton
                ├── OpenMask.png
                ├── Sub-domains_ton.png
                ├── asset-processing/
                    ├── alicemsgDAG.svg
                    ├── jetton_contracts.png
                    ├── jetton_contracts.svg
                    ├── jetton_contracts_dark.png
                    ├── jetton_contracts_dark.svg
                    ├── jetton_transfer.png
                    ├── jetton_transfer.svg
                    ├── jetton_transfer_dark.png
                    ├── jetton_transfer_dark.svg
                    ├── msg_dag_example.svg
                ├── autorization.mp4
                ├── blockchain-configs/
                    ├── config15-mainnet.png
                    ├── config15-testnet.png
                ├── blockchain-fundamentals/
                    ├── scheme.png
                    ├── shardchains-merge.jpg
                    ├── shardchains-merge.png
                    ├── shardchains-split.jpg
                    ├── shardchains-split.png
                    ├── shardchains.jpg
                    ├── shardchains.png
                    ├── split-merge.svg
                ├── cells-as-data-storage/
                    ├── Cells-as-data-storage_1_dark.png
                    ├── dag.png
                ├── data-formats/
                    ├── structure shceme 6.png
                    ├── tl-b-docs-1-dark.png
                    ├── tl-b-docs-1.png
                    ├── tl-b-docs-10-dark.png
                    ├── tl-b-docs-10.png
                    ├── tl-b-docs-2-dark.png
                    ├── tl-b-docs-2.png
                    ├── tl-b-docs-3-dark.png
                    ├── tl-b-docs-3.png
                    ├── tl-b-docs-4-dark.png
                    ├── tl-b-docs-4.png
                    ├── tl-b-docs-5-dark.png
                    ├── tl-b-docs-5.png
                    ├── tl-b-docs-6-dark.png
                    ├── tl-b-docs-6.png
                    ├── tl-b-docs-7-dark.png
                    ├── tl-b-docs-7.png
                    ├── tl-b-docs-8-dark.png
                    ├── tl-b-docs-8.png
                    ├── tl-b-docs-9-dark.png
                    ├── tl-b-docs-9.png
                ├── ecosystem-messages-layout/
                    ├── ecosystem_messages_layout_1.svg
                    ├── ecosystem_messages_layout_10.svg
                    ├── ecosystem_messages_layout_10_dark.svg
                    ├── ecosystem_messages_layout_11.svg
                    ├── ecosystem_messages_layout_11_dark.svg
                    ├── ecosystem_messages_layout_12.svg
                    ├── ecosystem_messages_layout_12_dark.svg
                    ├── ecosystem_messages_layout_1_dark.svg
                    ├── ecosystem_messages_layout_2.svg
                    ├── ecosystem_messages_layout_2_dark.svg
                    ├── ecosystem_messages_layout_3.svg
                    ├── ecosystem_messages_layout_3_dark.svg
                    ├── ecosystem_messages_layout_4.svg
                    ├── ecosystem_messages_layout_4_dark.svg
                    ├── ecosystem_messages_layout_5.svg
                    ├── ecosystem_messages_layout_5_dark.svg
                    ├── ecosystem_messages_layout_6.png
                    ├── ecosystem_messages_layout_6.svg
                    ├── ecosystem_messages_layout_6_dark.png
                    ├── ecosystem_messages_layout_6_dark.svg
                    ├── ecosystem_messages_layout_7.svg
                    ├── ecosystem_messages_layout_7_dark.svg
                    ├── ecosystem_messages_layout_8.svg
                    ├── ecosystem_messages_layout_8_dark.svg
                    ├── ecosystem_messages_layout_9.svg
                    ├── ecosystem_messages_layout_9_dark.svg
                ├── foundation_ton.png
                ├── full-node/
                    ├── help.jpg
                    ├── import-acc.png
                    ├── local-validator-status-absent.png
                    ├── status-error.jpg
                ├── getblock-img/
                    ├── unnamed-2.png
                    ├── unnamed-3.png
                    ├── unnamed-4.png
                    ├── unnamed-5.png
                    ├── unnamed-6.png
                ├── hacktoberfest.webp
                ├── how-to-wallet/
                    ├── wallet_1.png
                ├── hyperlinks.mp4
                ├── in_a_browser.jpg
                ├── main_pic.png
                ├── message-delivery/
                    ├── message_delivery_1.png
                    ├── message_delivery_1_dark.png
                    ├── message_delivery_2.png
                    ├── message_delivery_2_dark.png
                    ├── message_delivery_3.png
                    ├── message_delivery_3_dark.png
                    ├── message_delivery_4.svg
                    ├── message_delivery_5.png
                    ├── message_delivery_5_dark.png
                    ├── message_delivery_6.png
                    ├── message_delivery_6_dark.png
                    ├── message_delivery_7.png
                    ├── message_delivery_7_dark.png
                    ├── msg-delivery-1-dark.png
                    ├── msg-delivery-1.png
                    ├── msg-delivery-2.png
                    ├── msg-delivery-3.png
                    ├── msg-delivery-3_dark.png
                    ├── msg-delivery-4.png
                    ├── msg-delivery-4_dark.png
                    ├── msg-delivery-5.png
                    ├── msg-delivery-5_dark.png
                    ├── msg-delivery-6-dark.png
                    ├── msg-delivery-6.png
                ├── message-modes-cookbook/
                    ├── carry_remaining_value_10.png
                    ├── carry_remaining_value_10_dark.png
                    ├── carry_remaining_value_11_error.png
                    ├── carry_remaining_value_11_error_dark.png
                    ├── carry_remaining_value_11_noerror.png
                    ├── carry_remaining_value_11_noerror_dark.png
                    ├── carry_remaining_value_12.png
                    ├── carry_remaining_value_12_dark.png
                    ├── carry_remaining_value_6.png
                    ├── carry_remaining_value_6_dark.png
                    ├── carry_remaining_value_7.png
                    ├── carry_remaining_value_7_dark.png
                    ├── carry_remaining_value_8_error.png
                    ├── carry_remaining_value_8_error_dark.png
                    ├── carry_remaining_value_8_noerror.png
                    ├── carry_remaining_value_8_noerror_dark.png
                    ├── carry_remaining_value_9_error.png
                    ├── carry_remaining_value_9_error_dark.png
                    ├── carry_remaining_value_9_noerror.png
                    ├── carry_remaining_value_9_noerror_dark.png
                    ├── send_regular_message_1.png
                    ├── send_regular_message_1_dark.png
                    ├── send_regular_message_2.png
                    ├── send_regular_message_2_dark.png
                    ├── send_regular_message_3_error.png
                    ├── send_regular_message_3_error_dark.png
                    ├── send_regular_message_3_noerror.png
                    ├── send_regular_message_3_noerror_dark.png
                    ├── send_regular_message_4.png
                    ├── send_regular_message_4_dark.png
                    ├── send_regular_message_5_error.png
                    ├── send_regular_message_5_error_dark.png
                    ├── send_regular_message_5_noerror.png
                    ├── send_regular_message_5_noerror_dark.png
                ├── mylocalton-demo.gif
                ├── mylocalton.jpeg
                ├── mytonctrl/
                    ├── bl.png
                    ├── db.png
                    ├── dw.png
                    ├── ew.png
                    ├── installer.png
                    ├── nb.png
                    ├── nw.png
                    ├── status.png
                    ├── test-pools-list.png
                    ├── tetsnet-conf.png
                    ├── vah.png
                    ├── vas.png
                    ├── wl.png
                ├── nodes-validator/
                    ├── manual-ubuntu_mytoncore-log.png
                    ├── manual-ubuntu_mytonctrl-set_ru.png
                    ├── manual-ubuntu_mytonctrl-vas-aw_ru.png
                    ├── manual-ubuntu_mytonctrl-wl_ru.png
                    ├── mytonctrl-status.png
                ├── oracles/
                    ├── red-stone/
                        ├── data-package-data.png
                        ├── data-package-sig.png
                        ├── payload-metadata.png
                        ├── sample-serialization.png
                ├── scheme-templates/
                    ├── message-processing-graphs/
                        ├── Graphic-Explanations-Guidelines_1.png
                        ├── Graphic-Explanations-Guidelines_1_dark.png
                        ├── circle_for_smart_contract.svg
                        ├── dashed_rectgl_for_optional_message.svg
                        ├── line_for_transaction.svg
                        ├── person_figure_for_actor.svg
                        ├── rectangle_for_regular_message.svg
                ├── security-measures/
                    ├── secure-programming/
                        ├── smart1.png
                        ├── smart2.png
                        ├── smart3.png
                ├── single-nominator/
                    ├── election-status.png
                    ├── new-stake.png
                    ├── status-validator.png
                    ├── testnet-status.png
                    ├── tetsnet-conf.png
                    ├── validator-profit-vas.png
                    ├── validator-profit.png
                    ├── vl-activated.png
                ├── sync-async.png
                ├── tact-abi-example.png
                ├── tact-abi.png
                ├── telegram-apps/
                    ├── closing-behaviour.svg
                    ├── eruda-1.png
                    ├── eruda-2.png
                    ├── eruda-3.png
                    ├── modern-1.png
                    ├── modern-2.png
                    ├── publish-tg-1.jpeg
                    ├── tapps.png
                ├── tlb.drawio.svg
                ├── tma-design-guidelines/
                    ├── tma-design_1.png
                    ├── tma-design_2.png
                    ├── tma-design_3.png
                    ├── tma-design_4.png
                    ├── tma-design_5.png
                    ├── tma-design_6.png
                    ├── tma-design_7.png
                ├── ton-connect/
                    ├── ton-connect-2_1.png
                    ├── ton-connect-overview.png
                    ├── ton-connect.png
                    ├── ton-connect_1-dark.svg
                    ├── ton-connect_1.svg
                    ├── ton_proof_scheme-dark.svg
                    ├── ton_proof_scheme.svg
                ├── ton-jetbrains-plugin.png
                ├── ton-payments.jpeg
                ├── ton_sites.png
                ├── ton_www.mp4
                ├── wallet-apps/
                    ├── CryptoBot.png
                    ├── MyTonWallet.png
                    ├── OpenMask.png
                    ├── TonWallet.png
                    ├── ToncoinWallet-testnet.png
                    ├── Tonhub.png
                    ├── Tonkeeper-testnet.png
                    ├── Tonkeeper.png
                    ├── Wallet.png
                    ├── send-bot.png
                    ├── tonrocketbot.png
                ├── wallet-contracts/
                    ├── wallet-contract-V5.png
                    ├── wallet-contract-V5_dark.png
                ├── wallets.mp4
                ├── writing-test-examples/
                    ├── fireworks_trace_tonviewer.png
                    ├── test-examples-schemes-dark.svg
                    ├── test-examples-schemes.svg
                    ├── test-examples-schemes_id0.svg
                    ├── test-examples-schemes_id1.svg
                    ├── test-examples-schemes_id1_dark.svg
                    ├── test-examples-schemes_id2.svg
                    ├── test-examples-schemes_id2_dark.svg
                    ├── test-examples-schemes_id3.svg
                    ├── test-examples-schemes_id3_dark.svg
                    ├── test-examples-schemes_id4.svg
                    ├── test-examples-schemes_id4_dark.svg
                    ├── test-examples-schemes_id5.svg
                    ├── test-examples-schemes_id5_dark.svg
                    ├── test-examples-schemes_id6.svg
                    ├── test-examples-schemes_id6_dark.svg
                    ├── test-examples-schemes_id7.svg
                    ├── test-examples-schemes_id7_dark.svg
                    ├── test-examples-schemes_id8.svg
                    ├── test-examples-schemes_id8_dark.svg
            ├── explorers-in-ton/
                ├── eit-dton-info.png
                ├── eit-dton-txn.png
                ├── eit-tonnftexplorer-info.png
                ├── eit-tonnftexplorer-nftdata.png
                ├── eit-tonscan-info.png
                ├── eit-tonscan-txn.png
                ├── eit-tonviewer-info.png
                ├── eit-tonviewer-txn.png
                ├── eit-tonwhales-info.png
                ├── eit-tonwhales-txn.png
            ├── favicon.ico
            ├── favicon32x32.png
            ├── gasless.jpg
            ├── interaction-schemes/
                ├── ecosystem.svg
                ├── jettons.svg
                ├── nft.svg
                ├── wallets.svg
            ├── localizationProgramGuideline/
                ├── create-tasks.png
                ├── generate-reports.png
                ├── howItWorked/
                    ├── config-crowdin-deepl.png
                    ├── create-new-project.png
                    ├── create-project-setting.png
                    ├── crowdin-glossary.png
                    ├── frequency-save.png
                    ├── github-glossary.png
                    ├── install-github-integration.png
                    ├── pre-translate-config.png
                    ├── pre-translation.png
                    ├── projectId.png
                    ├── search-repo.png
                    ├── select-api-tool.png
                    ├── select-deepl.png
                    ├── select-integration-mode.png
                    ├── setting-branch.png
                    ├── ton-i18n-glossary.png
                ├── ko_preview.png
                ├── localization-program.png
                ├── manage-members.png
                ├── preview-link.png
                ├── proofread-approved.png
                ├── proofread-filter.png
                ├── proofread-step1.png
                ├── redirect-to-next.png
                ├── side-by-side.png
                ├── translator-filter.png
                ├── translator-save.png
                ├── translator-select.png
            ├── mainPageCards/
                ├── developer-dark.svg
                ├── developer-light.svg
                ├── participate-dark.svg
                ├── participate-light.svg
                ├── what_is_ton-dark.svg
                ├── what_is_ton-light.svg
            ├── nominator-pool/
                ├── hot-wallet.png
                ├── nominator-pool.png
                ├── restricted-wallet.png
                ├── single-nominator-architecture.png
            ├── readme/
                ├── about.png
                ├── check.png
                ├── contribute.png
                ├── how.png
            ├── registration-process/
                ├── create-api-key.png
                ├── telegram-bot.png
                ├── toncenter-main-miniapp.png
            ├── snippet.png
            ├── ton_logo_dark_background.svg
            ├── ton_logo_light_background.svg
            ├── ton_symbol.svg
            ├── ton_symbol_old-dark.svg
            ├── ton_symbol_old-light.svg
            ├── tutorials/
                ├── .nojekyll
                ├── apiatb-bot.png
                ├── bot1.png
                ├── gamefi-flappy/
                    ├── jetton-active-status.png
                    ├── no-gamefi-yet.png
                    ├── purchase-confirmation.png
                    ├── purchase-done.png
                    ├── purchase-item.png
                    ├── sbt-rewarded.png
                    ├── sbts-in-wallet.png
                    ├── shop-enter-button.png
                    ├── wallet-connect-button.png
                    ├── wallet-connect-confirmation.png
                    ├── wallet-connected.png
                    ├── wallet-nonexist-status.png
                    ├── wallet-uninit-status.png
                ├── jetton/
                    ├── jetton-balance-token.PNG
                    ├── jetton-burn-tokens.png
                    ├── jetton-connect-wallet.png
                    ├── jetton-main-page.png
                    ├── jetton-receive-tokens.png
                    ├── jetton-send-how.PNG
                    ├── jetton-send-tokens.png
                    ├── jetton-send-tutorial.png
                    ├── jetton-send-what.PNG
                    ├── jetton-token-logo.png
                    ├── jetton-wallet-address.png
                ├── js-bot-preview.jpg
                ├── nft/
                    ├── collection-metadata.png
                    ├── collection.png
                    ├── ducks.zip
                    ├── eth-collection.png
                    ├── item-metadata.png
                    ├── nft-sale.png
                    ├── ton-collection.png
                ├── onboarding/
                    ├── 1-dark.png
                    ├── 1.png
                    ├── 2-dark.png
                    ├── 2.png
                    ├── 3-dark.png
                    ├── 3.png
                    ├── 4-dark.png
                    ├── 4.png
                    ├── 5-dark.png
                    ├── 5.png
                    ├── 6-dark.png
                    ├── 6.png
                    ├── 7-dark.png
                    ├── 7.png
                    ├── 8.svg
                ├── quick-start/
                    ├── active.png
                    ├── explorer1.png
                    ├── multi-contract-example-bright.png
                    ├── multi-contract-example-dark.png
                    ├── multi-contract.png
                    ├── nonexist.png
                    ├── tonkeeper-dark.jpg
                    ├── tonkeeper-light.jpg
                    ├── uninit.png
                    ├── wallet-address.jpg
                ├── tonkeeper/
                    ├── test-mode.webp
        ├── robots.txt
        ├── schemes-visio/
            ├── 10 message_delivery_7_dark.vsdx
            ├── 11 msg-delivery-3_dark.vsdx
            ├── 12 msg-delivery-4_dark.vsdx
            ├── 12 msg-delivery-5_dark.vsdx
            ├── 13 msg-delivery-6-dark.vsdx
            ├── 14 test-examples-schemes-dark.vsdx
            ├── 14 test-examples-schemes.vsdx
            ├── 15 test-examples-schemes_id1.vsdx
            ├── 15 test-examples-schemes_id1_dark.vsdx
            ├── 15 test-examples-schemes_id2.vsdx
            ├── 15 test-examples-schemes_id2_dark.vsdx
            ├── 15 test-examples-schemes_id3.vsdx
            ├── 15 test-examples-schemes_id3_dark.vsdx
            ├── 15 test-examples-schemes_id4.vsdx
            ├── 15 test-examples-schemes_id4_dark.vsdx
            ├── 15 test-examples-schemes_id5.vsdx
            ├── 15 test-examples-schemes_id5_dark.vsdx
            ├── 15 test-examples-schemes_id6.vsdx
            ├── 15 test-examples-schemes_id6_dark.vsdx
            ├── 15 test-examples-schemes_id7.vsdx
            ├── 15 test-examples-schemes_id7_dark.vsdx
            ├── 15 test-examples-schemes_id8.vsdx
            ├── 15 test-examples-schemes_id8_dark.vsdx
            ├── 2 Cells-as-data-storage_1_dark.vsdx
            ├── 23 jetton_contracts_dark.vsdx
            ├── 24 jetton_transfer_dark.vsdx
            ├── 25 carry_remaining_value_10.vsdx
            ├── 25 carry_remaining_value_11.vsdx
            ├── 25 carry_remaining_value_12.vsdx
            ├── 25 carry_remaining_value_6.vsdx
            ├── 25 carry_remaining_value_7.vsdx
            ├── 25 carry_remaining_value_8.vsdx
            ├── 25 carry_remaining_value_9.vsdx
            ├── 25 send_regular_message_1.vsdx
            ├── 25 send_regular_message_2.vsdx
            ├── 25 send_regular_message_3.vsdx
            ├── 25 send_regular_message_4.vsdx
            ├── 25 send_regular_message_5.vsdx
            ├── 26 Graphic-Explanations-Guidelines_1.vsdx
            ├── 26 Graphic-Explanations-Guidelines_1_dark.vsdx
            ├── 26 message_delivery_2.vsdx
            ├── 26 message_delivery_2_dark.vsdx
            ├── 26 message_delivery_7_dark.vsdx
            ├── 3 wallet-contract-V5.vsdx
            ├── 3 wallet-contract-V5_dark.vsdx
            ├── 3 wallet-contracts.vsdx
            ├── 4 message_delivery_1_dark.vsdx
            ├── 5 message_delivery_2_dark.vsdx
            ├── 6 message_delivery_3_dark.vsdx
            ├── 7 message_delivery_5_dark.vsdx
            ├── 8 msg-delivery-1-dark.vsdx
            ├── 9 message_delivery_6_dark.vsdx
            ├── New design.vsdx
            ├── ecosystem_messages_layout_1.vsdx
            ├── ecosystem_messages_layout_10.vsdx
            ├── ecosystem_messages_layout_10_dark.vsdx
            ├── ecosystem_messages_layout_11.vsdx
            ├── ecosystem_messages_layout_11_dark.vsdx
            ├── ecosystem_messages_layout_12.vsdx
            ├── ecosystem_messages_layout_12_dark.vsdx
            ├── ecosystem_messages_layout_1_dark.vsdx
            ├── ecosystem_messages_layout_2.vsdx
            ├── ecosystem_messages_layout_2_dark.vsdx
            ├── ecosystem_messages_layout_3.vsdx
            ├── ecosystem_messages_layout_3_dark.vsdx
            ├── ecosystem_messages_layout_4.vsdx
            ├── ecosystem_messages_layout_4_dark.vsdx
            ├── ecosystem_messages_layout_5.vsdx
            ├── ecosystem_messages_layout_5_dark.vsdx
            ├── ecosystem_messages_layout_6.vsdx
            ├── ecosystem_messages_layout_6_dark.vsdx
            ├── ecosystem_messages_layout_7.vsdx
            ├── ecosystem_messages_layout_7_dark.vsdx
            ├── ecosystem_messages_layout_8.vsdx
            ├── ecosystem_messages_layout_8_dark.vsdx
            ├── ecosystem_messages_layout_9.vsdx
            ├── ecosystem_messages_layout_9_dark.vsdx
            ├── jetton_transfer_dark.vsdx
            ├── message_processing.vsdx
            ├── message_processing_prototype.png
            ├── readme.md
            ├── send_regular_message_4.vsdx
            ├── test-examples-schemes-dark.vsdx
            ├── test-examples-schemes.vsdx
            ├── tlb-schemes — dark.vsdx
            ├── tlb-schemes.vsdx
            ├── ton-connect — dark.vsdx
            ├── ton-connect.vsdx
            ├── ton_proof_scheme.vsdx
            ├── ton_proof_scheme_dark.vsdx
            ├── ~$$ecosystem_messages_layout_6.~vsdx
            ├── ~$$message_processing.~vsdx
            ├── ~$$ton-connect — dark.~vsdx
        ├── svg/
            ├── wrench-24px-dark.svg
            ├── wrench-24px-light.svg
        ├── tblkch.pdf
        ├── ton-binaries/
            ├── windows/
                ├── Win64OpenSSL_Light-1_1_1q.msi
                ├── fiftlib.zip
        ├── ton-trustless-bridge_tvm-and-zk_v1.1_23-05-15.pdf
        ├── ton.pdf
        ├── trustless-interaction-with-ton_v1.1_23-05-15.pdf
        ├── tvm.pdf
    ├── tsconfig.json
```

## Files Content:

================================================
FILE: README.md
URL: https://github.com/ton-community/ton-docs/blob/main/README.md
================================================
# TON documentation 📚

<img align="left" width="300px" src="static\img\readme\about.png">

This is the official repository for The Open Network documentation.

Latest documentation release: [docs.ton.org](https://docs.ton.org).

Contribution guidelines: [How to contribute](https://docs.ton.org/v3/contribute).

TON Documentation is entirely open source. Community enthusiasts and early TON contributors have played a key role in creating this open-source TON documentation by turning their notes into detailed pages.

It was initially written by TON [contributors](/v3/contribute/maintainers/) and supported by [TON Studio](https://tonstudio.io/).

---



## Join TON Docs Club 💎

<img align="right" width="300px" src="static\img\readme\contribute.png">

TON is an actively growing ecosystem, and every day many devs contribute to its development. 

You can participate in TON by helping organize knowledge, making Pull Requests and creating tutorials to help other developers. 

Feedback, lectures, technical articles, tutorials, and examples. All this can help the developers community grow even faster!

Join TON Docs Club chat in Telegram to join contributors party:
* https://t.me/+c-0fVO4XHQsyOWM8

---

<img align="left" width="300px" src="static\img\readme\how.png">

## How to contribute? 🦄

— Have an issue? [Prepare a solution with TON Docs Wizard](https://t.me/ton_docs_bot).  

— Have an idea? [Submit a Feature Request](https://github.com/ton-community/ton-docs/issues/new/choose).  

— Want to contribute? [How to contribute](https://docs.ton.org/v3/contribute).

— Want to translate? [Localization](https://docs.ton.org/v3/contribute/localization-program/how-to-contribute).

— Have a question? [Documentation development chat](https://t.me/+c-0fVO4XHQsyOWM8).



---

## Set up your environment ☁️

If you're changing the sidebar or adding media-files, links, please make sure that your submission won't break production.

You can do this in two ways:

### Cloud

Use Gitpod for contributing. It'll launch a workspace with a single click:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ton-community/ton-docs)

### Local

1. Download repository from GitHub with its submodules

    ```
    git clone --recursive https://github.com/ton-community/ton-docs.git 
    ```

2. Install last version [NodeJS LTS](https://nodejs.org/en/download/) to run local build
3. Open Terminal in project directory
4. Install dependencies with command:

    ```
    npm install
    ```
5. Run project with command:

    ```
    npm run start
    ```
6. Build with multiple locales and run it locally

    ```
    npm run build
    npm run serve
    ```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Install recursive module

If you cloned the repository from GitHub without step 1, you'll need to install the submodules to enable local execution.
  ```
  git submodule update --init --recursive
  ```

## Contributors wall
<a href="https://github.com/ton-community/ton-docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ton-community/ton-docs&max=204" />
</a>

<p align="right" style="font-size: 14px; color: #555; margin-top: 20px;">
  <a href="#readme-top" style="text-decoration: none; color: blue; font-weight: bold;">
    ↑ Back to Top ↑
  </a>
</p>
## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)





================================================
FILE: crowdin-oss.yml
URL: https://github.com/ton-community/ton-docs/blob/main/crowdin-oss.yml
================================================
project_id: '798494'
api_token_env: CROWDIN_PERSONAL_TOKEN
preserve_hierarchy: 1

files:
  - source: i18n/en/**/*
    translation: i18n/%two_letters_code%/**/%original_file_name%
  - source: docs/**/*
    translation: i18n/%two_letters_code%/docusaurus-plugin-content-docs/current/**/%original_file_name%
    ignore:
      - docs/**/*.png
  - source: src/pages/learn/**/*
    translation: i18n/%two_letters_code%/docusaurus-plugin-content-pages/learn/**/%original_file_name%



================================================
FILE: docs/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services.md
================================================
import Feedback from '@site/src/components/Feedback';

# Blockchain services

## Domain name systems

In Ethereum, users use the **Ethereum Name Service (ENS)**, a decentralized naming system built on top of the Ethereum blockchain.

The TON blockchain includes an embedded domain name system called the TON DNS. This service allows users to register human-readable domain names for smart contracts, websites, or other online content. Such a device facilitates interaction with **decentralized applications (DApps)** and other resources on the TON blockchain. 

The DNS system in TON functions similarly to traditional Internet DNS systems, but its decentralized nature eliminates the need for a centralized authority to control and manage domain names, thereby reducing the risks of censorship, fraud, and domain name hijacking.

One key feature of TON DNS is the ability to bind crypto wallets to domain names directly. This feature allows users to send cryptocurrency to addresses like `alice.place.ton` without additional details. This feature simplifies the process of donations and payments, making it more intuitive and convenient.

## Proxy

TON Proxy is a tool based on the TON protocol that offers high security and anonymity. All data transmitted through TON Proxy is encrypted, thus protecting users' confidential information.

One of TON Proxy's key advantages is bypassing blockades imposed by ISPs or government agencies. This property makes it an essential tool for users who need free access to information on the Internet without restrictions.

In addition, TON Proxy helps to speed up Internet connection speeds. It automatically selects the servers with the lowest load, improving the quality of connection and Internet access speed. 

## Decentralized storage

Ethereum is not suitable for storing large amounts of data. Therefore, decentralized storage on Ethereum typically involves using distributed file systems to store and retrieve data in a decentralized and secure manner. One popular approach to decentralized storage on Ethereum is the **InterPlanetary File System (IPFS)**, a peer-to-peer file system that allows users to store and retrieve files from a distributed network.

The TON network has its own decentralized storage service called snapshots, which the TON blockchain uses to store archive copies of blocks and status data. The service can also store users’ files or other services running on the platform with torrent-like access technology. The most popular use case is to store NFT metadata directly on TON storage, not using additional distributed file storage services like IPFS.

## Payment services

TON Payments is a solution for lightning-fast transactions with zero network fees on the TON blockchain. While the TON blockchain is sufficient for most tasks, some applications, such as TON Proxy, TON Storage, or a particular decentralized application, require micro-transactions with much higher speed and lower costs. In TON, Payment channels solve this problem. 

Payment channels allow two parties to make transactions off-chain by creating a special smart contract on the blockchain with their initial balances. They can then perform as many transactions between them as they want without any speed limits or fees. The network charges fees only when opening and closing the channel. The technology guarantees proper operation by allowing a party to close the channel if the other party cheats or disappears.


<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains.md
================================================
import Feedback from '@site/src/components/Feedback';

# The differences of blockchains

## Introduction

In this chapter, we will examine the key differences between the Ethereum blockchain and the TON blockchain. The analysis will include an overview of the network architectures, highlight their unique features, and evaluate the advantages and disadvantages of each.

Starting with an overview of the Ethereum and TON ecosystems, we can note that both platforms offer a similar structure of participants and services, including users who hold assets and make transactions, validators who keep the network up and running and secure, and application developers who use the blockchain as the basis for their products and services. Both ecosystems include custodial and non-custodial services that give users different control over their assets.

Additionally, it is worth highlighting that both platforms facilitate the creation of **decentralized applications (DApps)**, offering developers powerful tools and standards for development. 

However, despite the similarities in overall structure and features offered, the key technological aspects and network design approaches of Ethereum and TON differ significantly. These differences lay the foundation for a thorough understanding of each platform's unique advantages and limitations, which is particularly important for developers seeking to maximize the capabilities of each network. In the following subsections, we will explore these differences in more detail, focusing on the network architecture, models, transaction mechanisms, and transaction settlement system to provide developers with the necessary insights.

## Differences between TON and Ethereum


### Account

In the first subsection, we compared Ethereum and TON, highlighting their key architectural differences and the main challenges faced by Ethereum. Of particular note are the different approaches to organizing interactions in these blockchains and using models. These differences come from the unique architectural choices of each platform. For developers accustomed to Ethereum, it is essential to deeply understand these differences to effectively transition to developing on TON. This understanding will allow the architecture to adapt and optimize the interaction of smart contracts in the new environment.

#### Ethereum

Ethereum uses an account-based model to track balances. An account stores information about different coin balances, like a regular bank account. There are two types of accounts:

- **Externally-owned accounts (EOAs)** - externally managed accounts are controlled by the user using public and private key pairs. The public key allows others to send payments to the account.
- Contract accounts are controlled by smart contract code rather than private keys. Contract accounts cannot initiate transactions independently because they do not have a private key.

When an Ethereum user creates a wallet, an EOA is added to the global state on all nodes in the decentralized network. Deploying a smart contract creates a contract account capable of storing and distributing funds programmatically based on certain conditions. All account types have balances and storage and can trigger transactions by calling functions in other accounts. This structure provides Ethereum's ability to serve as programmable money.

Ethereum has synchronous transaction processing, where each transaction is processed sequentially and in strict order. Synchronous processing ensures that the state of the blockchain always remains consistent and predictable for all participants in the network. All transactions are atomic; they either complete successfully or unsuccessfully without partial or incomplete execution. Moreover, when a smart contract invokes another smart contract, the invocation occurs instantaneously within the same transaction. But here again, there are disadvantages — a transaction can grow as much as it can. A negative effect of synchronicity is still overloading, as computations cannot run in parallel. The number of contracts and users grows, and the inability to parallelize computations becomes a major limiting factor in the growth of the network.

#### TON
The actor model is an approach to parallel and distributed computing where the main element is an actor - an independent executable block of code. Initially developed for cluster computing, this model is widely used in micro-server architectures to meet the needs of modern distributed systems due to its ability to scale, parallelism, and fault tolerance. Actors receive and process messages, depending on the logic of the message, respond by accepting local changes or performing actions in response, and can create other actors or send messages onward. They are thread-safe and reentrant, eliminating the need for locks and simplifying parallel processing of tasks. This model is ideal for building scalable and reliable server solutions, providing efficient concurrent access control and support for synchronous and asynchronous messaging.

In TON, smart contracts represent everything and are called actors within the actor model context. A smart contract is an object with address, code, data, and balance properties. It can store data and behaves according to instructions received from other smart contracts. After a contract receives a message and processes it by executing its code in the TVM, various scenarios can occur:
- The contract changes its properties `code`, `data`, and `balance`
- The contract optionally generates an outgoing message
- The contract goes into standby mode until the following event occurs

The result of the scripts is always the creation of a transaction. The transactions themselves are asynchronous, meaning that the system can continue processing other transactions while waiting for past transactions to complete. This approach provides more flexibility when processing complex transactions. Sometimes a single transaction may require multiple smart contract calls to be executed in a specific sequence. Because these calls are asynchronous, developers can more easily design and implement complex transaction flows that may involve multiple concurrent operations.

A developer coming from Ethereum needs to realize that smart contracts in the TON blockchain can only communicate with each other by sending asynchronous messages, which means that if there is a need to request data from another contract and an immediate response is required, this will not be possible. Instead, clients outside the network must call `get methods`, much like a wallet in Ethereum that uses RPC nodes such as Infura to request smart contract states. This is an important limitation for several reasons. For example, flash loans are transactions executed within a single block, relying on the ability to borrow and repay in the same transaction.

The synchronous nature of Ethereum's EVM facilitates such transactions, whereas the asynchronous nature of all transactions in TON makes executing a flash loan infeasible. Oracles, which provide smart contracts with external data, also involve a more intricate design process in TON. What Oracles are and how to use them in TON can be found [here](/v3/documentation/dapps/oracles/about_blockchain_oracles/).



### Wallets

#### Ethereum
We have already discussed that in Ethereum, a user's wallet is generated based on their address, which is in a 1-to-1 relationship with their public key.

In Ethereum, developers use multi-signature wallets like gnosis. They are just introducing so-called **account abstraction** with the ERC-4337 standard. This standard extends the functionality of wallets, such as sending transactions without a native token, recovering accounts after loss, etc.

Still, it's worth noting that wallet accounts are much more expensive to use in terms of gas fees compared to EOA in Ethereum.

#### TON

In TON, all wallets are smart contracts that the user must deploy. Since developers can configure smart contracts in different ways and have other features, there are several versions of wallets, which you can read about [here](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts/).

Because wallets are smart contracts, users can have multiple wallets with different addresses and initial parameters. To send a transaction, the user must sign the message with their private key and send it to their wallet contract, which forwards it to the smart contract of a particular DApp application. This approach dramatically increases flexibility in wallet design, and developers can add new versions of the wallet in the future.


### Transaction

#### Ethereum

Recall that in Ethereum transactions are cryptographically signed instructions from accounts. An account will initiate a transaction to update the state of the Ethereum network. The most straightforward transaction is transferring ETH from one account to another.

Transaction flow
1. A transaction hash is cryptographically generated: `0x97d99bc7729211111a21b12c933c949d4f31684f1d6954ff477d0477538ff017`
2. The transaction is then broadcast to the network and added to a transaction pool consisting of all other pending network transactions.
3. A validator must pick your transaction and include it in a block to verify and consider it successful.
4. As time passes, the block containing your transaction will be upgraded to `justified` and then `finalized.` These upgrades ensure that your transaction was successful and will never be altered. Once a block is finalized, it could only ever be changed by a network-level attack that would cost many billions of dollars.


#### TON

In TON, the entity that transfers data between two contracts is called a message. For example, a message contains arbitrary data about a token transfer sent to a specified address. When the message arrives at the contract, the contract processes this according to the code. The contract updates its state and optionally sends a new message. [Transaction](/v3/documentation/smart-contracts/message-management/messages-and-transactions/) is an entire flow from receiving messages to executing actions on the account.

For example, consider the interaction of accounts where we have messages from contract **A** to contract **B**. In this case, we have one message and two transactions.

But initially, to change the state of the blockchain, you need an outside signal. To invoke a smart contract, you need to send an external message to the validators, and they will apply it to the smart contract.

As we already discussed, a wallet is a smart contract, so this external message usually first goes to the wallet's smart contract, which records them as the first transaction, and that first transaction usually contains an embedded message for the actual destination contract.

When the wallet smart contract receives the message, it processes it and delivers it to the destination contract. In our example, contract **A** could be a wallet; when it receives the external message, it will have the first transaction.

We can represent the sequence of transactions as a chain. In this representation, each smart contract has its transactions, which means that each contract has its blockchain, so the network can process the transactions independently.

:::info
Read more in [Blockchain of blockchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).
:::

### Gas

#### Ethereum

In Ethereum, users pay fees in their native currency, ether (ETH). Usually, one quotes gas prices in gwei, which is a denomination of ETH. Each gwei is equal to one billionth of an ETH.

For example, 0.000000001 ether is equal to 1 gwei.

The gas cost is divided into a base fee set by the protocol and a `priority fee` that the user adds to speed up transaction processing by validators.

The `total fee` is equal:

```
total fee = units of gas used * (base fee + priority fee).
```

Additionally, storage in Ethereum is essentially free, meaning that once data is stored on the blockchain, there is no ongoing cost for keeping it there.

#### TON

The contract nominates all computation costs in gas units and fixes them in a specific gas amount. The blockchain config defines the gas, and one pays for it in Toncoins.

The chain configuration determines the price of gas units and may be changed only by consensus of validators. Note that, unlike in other systems, the user cannot set their gas price, and there is no fee market.
In TON, the calculation of transaction fees is complex. It includes several types of fees:
- fees for storing smart contracts in the blockchain
- fees for importing messages into the blockchain
- fees for executing code on a virtual machine
- fees for processing actions after code execution
- fees for sending messages outside the TON blockchain

The price of gas and some other parameters can be changed by voting on the main network. Unlike Ethereum, TON users cannot set the gas price themselves. Also, the developer needs to return the remaining gas funds to the owner manually, otherwise they will remain locked. Smart contract storage also affects the price: if a wallet's smart contract remains unused for a long time, the next transaction will incur higher costs.

:::info
Read more about [gas](/v3/documentation/smart-contracts/transaction-fees/fees).
:::

### Architecture

#### Ethereum
Ethereum inherits and extends the foundational principles of Bitcoin. This approach gives developers the flexibility to create complex DApps. A unique feature of Ethereum is its ability to provide each account with an individualized data store, allowing transactions to perform token transfers and change the state of the blockchain by interacting with smart contracts. As we know, this ability to synchronously interact between accounts offers great promise for application development, but also raises the issue of scalability. Each transaction on the Ethereum network requires nodes to update and maintain the entire state of the blockchain, which leads to significant latency and increases the cost of gas as network utilization increases.

#### TON
TON offers an alternative approach to improve scalability and performance in response to these challenges. Designed to provide developers with maximum flexibility to create various applications, TON uses the concept of shards and the MasterChain to optimize the block creation process. Each TON ShardChain and MasterChain generates a new block on average every 3 seconds, ensuring fast transaction execution. Unlike Ethereum, where state updates are synchronous, TON implements asynchronous messaging between smart contracts, allowing each transaction to be processed independently and in parallel, significantly speeding up transaction processing on the network. Sections and articles to familiarize yourself with:

* [Shards](/v3/documentation/smart-contracts/shards/shards-intro/)
* [Comparison of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)

In conclusion, by comparing TON and Ethereum's architecture and technological underpinnings, it's clear that TON offers significant advantages. With its innovative approach to asynchronous transaction processing and unique shard and MasterChain architecture, TON demonstrates the potential to support millions of transactions per second without compromising security or centralization. High scalability provides the platform with outstanding flexibility and efficiency, making it ideal for various applications.

## See also
- [Smart contract addresses](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses/)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func.md
================================================
import Feedback from '@site/src/components/Feedback';

# Solidity vs FunC

## Introduction 

Smart contract development involves using predefined languages such as Solidity for Ethereum and FunC for TON.
Solidity is an object-oriented, high-level, strictly typed language influenced by C++, Python, and JavaScript. It is designed explicitly to write smart contracts on Ethereum blockchain platforms.

FunC is a high-level language used to program smart contracts on TON Blockchain. It is a domain-specific, C-like, statically typed language.

The sections below will analyze briefly the following aspects of these languages: data types, storage, functions, flow control structures, and dictionaries (hashmaps).

## Differences of Solidity and FunC
### Storage layout

#### Solidity
Solidity uses a flat storage model, meaning it stores all state variables in a single, continuous block of memory called storage. The storage is a key-value store where each key is a 256-bit integer representing the storage slot number, and each value is the 256-bit word stored at that slot. Ethereum numbers the slots sequentially, starting from zero, and each slot can store a single word. Solidity allows the programmer to specify the storage layout using the storage keyword to define state variables. The order in which you define the variables determines their position in the storage.

#### FunC
Permanent storage data in TON Blockchain is stored as a cell. Cells play the role of memory in the stack-based TVM. To read data from a cell, you need to transform a cell into a slice and then obtain the data bits and references to other cells by loading them from the slice. To write data, you must store data bits and references to other cells in a builder and cast the builder into a new cell.

### Data types

#### Solidity
Solidity includes the following basic data types:
- **Signed** and **Unsigned** integers
- **Boolean**
- **Addresses**, typically around 20 bytes, are used to store Ethereum wallet or smart contract addresses. If the address type contains the suffix keyword `payable,` it restricts it from storing only wallet addresses and using the transfer and send crypto functions.
- **Byte arrays** — declared with the keyword **bytes**, is a fixed-size array used to store a predefined number of bytes up to 32, usually declared along with the keyword.
- **Literals** — Immutable values such as addresses, rationals and integers, strings, Unicode, and hexadecimal can be stored in a variable.
- **Enums**
- **Arrays** fixed or dynamic
- **Structs**
- **Mappings**

#### FunC
In the case of FunC, the main data types are:
- **Integers**
- **Cell** — basic for TON opaque data structure, which contains up to 1,023 bits and up to 4 references to other cells
- **Slice** and **Builder** — special flavors of the cell to read from and write to cells,
- **Continuation** — another flavour of cell that contains ready-to-execute TVM byte-code
- **Tuples** — is an ordered collection of up to 255 components, having arbitrary value types, possibly distinct.
- **Tensors** — is an ordered collection ready for mass assigning like: `(int, int) a = (2, 4)`. A special case of tensor type is the unit type `()`. It represents that a function doesn’t return any value or has no arguments.

Currently, FunC does not support defining custom types. Read more about types in the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### Declaring and using variables

#### Solidity
Solidity is a statically typed language, meaning each variable's type must be specified when declared.

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

#### FunC
FunC is a more abstract and function-oriented language. It supports dynamic typing and functional programming styles.

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### Loops

#### Solidity
Solidity supports `for`, `while`, and `do { ... } while` loops.

If you want to do something 10 times, you can do it this way:

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

#### FunC
FunC, in turn, supports `repeat`, `while`, and `do { ... } until` loops. The `for` loop is not supported. If you want to execute the same code as in the example above on Func, you can use `repeat`

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```
Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### Functions

#### Solidity

Solidity approaches function declarations with a blend of clarity and control. In this programming language, each function is initiated with the keyword `function`, followed by the function's name and its parameters. The function's body is enclosed within curly braces, clearly defining the operational scope. Additionally, return values are indicated using the `returns` keyword. 

What sets Solidity apart is its categorization of function visibility—you can designate functions as `public`, `private`, `internal`, or `external`. These definitions dictate the conditions under which developers can access and call other parts of the contract or external entities. Below is an example in which we set the global variable `num` in the Solidity language: 

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

#### FunC
Transitioning to FunC, the FunC program is essentially a list of function declarations/definitions and global variable declarations. A FunC function declaration typically starts with an optional declarator, followed by the return type and the function name. 

Parameters are listed next, and the declaration ends with a selection of specifiers—such as `impure`, `inline/inline_ref`, and `method_id`. These specifiers adjust the function's visibility, ability to modify contract storage, and inlining behavior. Below is an example in which we store a storage variable as a cell in persistent storage in the Func language: 

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```
Read more on [Functions](/v3/documentation/smart-contracts/func/docs/functions/) page.

### Flow control structures

#### Solidity
Most of the control structures known from curly-braces languages are available in Solidity, including: `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, with the usual semantics known from C or JavaScript.

#### FunC
FunC supports classic `if-else` statements, `ifnot`, `repeat`, `while`, and `do/until` loops.  Also, since v0.4.0, `try-catch` statements are supported.

Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### Dictionaries

Dictionary or hashmap data structure is essential for Solidity and FunC contract development because it allows developers to efficiently store and retrieve data in smart contracts, specifically data related to a specific key, such as a user’s balance or ownership of an asset.

#### Solidity

Mapping is a hash table in Solidity that stores data as key-value pairs, where the key can be any of the built-in data types, excluding reference types, and the data type's value can be any type. In Solidity and on the Ethereum blockchain, mappings typically connect a unique Ethereum address to a corresponding value type. In any other programming language, a mapping is equivalent to a dictionary.

In Solidity, mappings don't have a length or the concept of setting a key or a value. Mappings are only applicable to state variables that serve as store reference types. When you initialize mappings, they include every possible key and map to values whose byte representations are all zeros.

#### FunC 

An analogy of mappings in FunC is dictionaries or TON hashmaps. In the context of TON, a hashmap is a data structure represented by a tree of cells. Hashmap maps keys to values ​​of arbitrary type so that quick lookup and modification are possible. The abstract representation of a hashmap in TVM is a Patricia tree or a compact binary trie. 

Working with potentially large cell trees can create several problems. Each update operation builds an appreciable number of cells (each cell built costs 500 gas), meaning these operations can run out of resources if used carelessly. To avoid exceeding the gas limit, limit the number of dictionary updates in a single transaction. 

Also, a binary tree for `N` key-value pairs contains `N-1` forks, which means a total of at least `2N-1` cells. The storage of a smart contract is limited to `65536` unique cells, so the maximum number of entries in the dictionary is `32768`, or slightly more if there are repeating cells.

Read more about [Dictionaries in TON](/v3/documentation/smart-contracts/func/docs/dictionaries/).

### Smart contract communication

Solidity and FunC provide different approaches to interacting with smart contracts. The main difference lies in the mechanisms of invocation and interaction between contracts.

#### Solidity

Solidity uses object-orienteered contracts that interact with each other through method calls. This design is similar to method calls in traditional object-oriented programming languages.

```js
// External contract interface
interface IReceiver {
    function receiveData(uint x) external;
}

contract Sender {
    function sendData(address receiverAddress, uint x) public {
        IReceiver receiver = IReceiver(receiverAddress);
        receiver.receiveData(x);  // Direct call of the contract function
    }
}
```

#### FunC

FunC, used in the TON blockchain ecosystem, operates on messages to invoke and interact between smart contracts. Instead of calling methods directly, contracts send messages to each other, which can contain data and code for execution. 

Consider an example where a smart contract sender must send a message with a number, and a smart contract receiver must receive that number and perform some manipulation on it. 

Initially, the smart contract recipient must describe how it will receive messages.

```func
() recv_internal(int my_balance, int msg_value, cell in_msg, slice in_msg_body) impure {
    int op = in_msg_body~load_uint(32);
    
    if (op == 1) {
        int num = in_msg_body~load_uint(32);
        ;; do some manipulations
        return ();
    }

    if (op == 2) {
        ;;...
    }
}
```

**Receiving message flow:**
1. `recv_internal()` function is executed when a contract is accessed directly within the blockchain. For example, when a contract accesses our contract.
2. The function accepts the amount of the contract balance, the amount of the incoming message, the cell with the original message, and the `in_msg_body` slice, which stores only the body of the received message. 
3. Our message body will store two integer numbers. The first number is a 32-bit unsigned integer `op` defining the smart contract's operation. You can draw some analogy with Solidity and think of `op` as a function signature. 
4. We use `load_uint ()` to read `op` as a number from the resulting slice.
5. Next, we execute business logic for a given operation. Note that we omitted this functionality in this example.


Next, the sender's smart contract is to send the message correctly. This is accomplished with`send_raw_message`, which expects a serialized message as an argument.

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; in the example, we hardcode the recipient's address
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```
**Sending message flow:**
1. Initially, we need to build our message. The complete structure of the send can be found [here](/v3/documentation/smart-contracts/message-management/sending-messages/). 
2. The body of the message represents a cell. In `msg_body_cell` we do: `begin_cell()` - creates `Builder` for the future cell, first `store_uint` - stores the first uint into `Builder` (1 - this is our `op`), second `store_uint` - stores the second uint into `Builder` (num - this is our number that we will manipulate in the receiving contract), `end_cell()` - creates the cell.
3. To attach the body that will come in `recv_internal` in the message,  we reference the collected cell in the message itself with `store_ref`.
4. Sending a message.

This example presented how smart contracts can communicate with each other. 

Read more on the [Internal messages](/v3/documentation/smart-contracts/overview/) page.

## See also 

- [TON documentation](/v3/documentation/ton-documentation/)
- [FunC overview](/v3/documentation/smart-contracts/func/overview/)

<Feedback />



================================================
FILE: docs/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm.md
================================================
import Feedback from '@site/src/components/Feedback';

# TVM vs EVM

## Introduction
**Ethereum Virtual Machine (EVM)** and **TON Virtual Machine (TVM)** are stack-based virtual machines developed for running smart contract code. Although they have standard features, there are notable distinctions between them.

## Differences of TVM and EVM

### Data presentation

#### EVM
1. Fundamental data units

 - The EVM operates primarily on 256-bit integers, reflecting its design around Ethereum's cryptographic functions, such as Keccak-256 hashing and elliptic curve operations.
 - Data types are limited mainly to integers, bytes, and occasionally arrays of these types, but all must conform to 256-bit processing rules.
2. State storage
- The entire state of the Ethereum blockchain is a mapping of 256-bit addresses to 256-bit values. A data structure known as the **Merkle Patricia Trie (MPT)** maintains this mapping.
- The MPT enables Ethereum to efficiently prove the consistency and integrity of the blockchain state through cryptographic verification, which is vital for a decentralized system like Ethereum.
3. Data structure limitations
- The simplification to 256-bit word constraints means that the EVM is not inherently designed to handle complex or custom data structures directly.
Developers often need to implement additional logic within smart contracts to simulate more complex data structures, which can increase gas costs and complexity.

#### TVM
1. Cell-based architecture
- TVM uses a unique [bag of cells](/v3/documentation/data-formats/tlb/cell-boc/) model to represent data. Each cell can contain up to 128 data bytes and have up to 4 references to other cells.
- This structure allows the TVM to natively support arbitrary algebraic data types and more complex constructions such as trees or directed acyclic graphs (DAGs) directly within its storage model.
2. Flexibility and efficiency
- The cell model provides significant flexibility, enabling the TVM to handle various data structures more naturally and efficiently than the EVM.
- For example, creating linked structures through cell references allows for dynamic and potentially infinite data structures, which is crucial for specific applications like decentralized social networks or complex decentralized finance (DeFi) protocols.
3. Complex data handling
- The ability to manage complex data types inherently within the VM architecture reduces the need for workaround implementations in smart contracts, potentially lowering the execution cost and increasing execution speed.
TVM's design is particularly advantageous for applications requiring complex state management or interlinked data structures. It provides a robust foundation for developers to build sophisticated and scalable decentralized applications.

### Stack machine

#### EVM

- The EVM operates as a traditional stack-based machine, using a last-in, first-out (LIFO) stack to manage computation.
- It processes operations by pushing and popping 256-bit integers, the standard size for all elements in the stack.

#### TVM

- TVM also functions as a stack-based machine but with a key distinction: it supports both 257-bit integers and references to cells.
- This allows TVM to push and pop these two distinct types of data onto/from the stack, providing enhanced flexibility in direct data manipulation.

#### Example of stack operations

Suppose we want to add two numbers, `2` and `2`, in EVM. The process would involve pushing the numbers onto the stack and calling the `ADD` instruction. The result, `4`, would be left on top of the stack.

We can do this operation in the same way in TVM. But let’s look at another example with more complex data structures, such as hashmaps and cell references. Suppose we have a hashmap that stores key-value pairs, where keys are integers and values are either integers or cell references. Let’s say our hashmap contains the following entries:

```js
{
    1: 10
    2: cell_a (which contains 10)
}
```

We want to add the values associated with keys `1` and `2` and store the result with key `3`. Let’s look at stack operations:

1. Push key `1` onto the stack: `stack = (1)`
2. Call `DICTGET` for key `1` (retrieves the value associated with the key at the top of the stack): Retrieves value 10. `stack = (10)`
3. Push key `2` onto the stack: `stack = (10, 2)`
4. Call `DICTGET` for key `2`: Retrieves reference to Cell_A. `stack = (10, Cell_A)`
5. Load value from `Cell_A`: TVM executes an instruction to load the value from the cell reference. `stack = (10, 10)`
6. Call the `ADD` instruction: When the `ADD` instruction is executed, the TVM will pop the top two elements from the stack, add them together, and push the result back onto the stack. In this case, the top two elements are `10` and `10`. After the addition, the stack will contain the result: `stack = (20)`
7. Push key `3` onto the stack: `stack = (20, 3)`
8. Call `DICTSET`: Stores `20` with key `3`. Updated hashmap:

```js
{
    1: 10,
    2: cell_a,
    3: 20
}
```

To do the same in EVM, we need to define a mapping that stores key-value pairs and the function where we work directly with 256-bit integers stored in the mapping.
It’s essential to note that the EVM supports complex data structures by leveraging Solidity, but these structures are built on top of the EVM’s simpler data model, which is fundamentally different from the TVM's more expressive data model.

### Arithmetic operations

#### EVM

- The **Ethereum Virtual Machine (EVM)** uses 256-bit integers to handle arithmetic operations such as addition, subtraction, multiplication, and division, tailoring them to this data size. 

#### TVM

- The **TON Virtual Machine (TVM)** supports more diverse arithmetic operations, including 64-bit, 128-bit, and 256-bit integers, both unsigned and signed and modulo operations. TVM further enhances its arithmetic capabilities with multiplication-then-shift and shift-then-divide, which are particularly useful for implementing fixed-point arithmetic. This variety allows developers to select the most efficient arithmetic operations based on the specific requirements of their smart contracts, offering potential optimizations based on data size and type.

### Overflow checks

#### EVM

- In the EVM, the virtual machine does not perform overflow checks inherently. With the introduction of Solidity 0.8.0, automatic overflow and underflow checks were integrated into the language to enhance security. These checks help prevent common vulnerabilities related to arithmetic operations but require newer versions of Solidity, as earlier versions necessitate manual implementation of these safeguards. 

#### TVM

- In contrast, TVM automatically performs overflow checks on all arithmetic operations, a feature built directly into the virtual machine. This design choice simplifies the development of smart contracts by inherently reducing the risk of errors and enhancing the overall reliability and security of the code.

### Cryptography and hash functions

#### EVM

EVM supports Ethereum-specific cryptography schemes, such as the secp256k1 elliptic curve and the keccak256 hash function. However, it does not have built-in support for Merkle proofs, which are cryptographic proofs used to verify the membership of an element in a set.

#### TVM

- TVM supports 256-bit Elliptic Curve Cryptography (ECC) for predefined curves, like Curve25519. It also supports Weil pairings on some elliptic curves, which are helpful for the fast implementation of zk-SNARKs (zero-knowledge proofs). Popular hash functions like sha256 are also supported, providing more cryptographic operation options. In addition, TVM can work with Merkle proofs, providing additional cryptographic features that can be beneficial for specific use cases, such as verifying the inclusion of a transaction in a block.

### High-level languages

#### EVM

EVM primarily uses Solidity as its high-level language, an object-oriented, statically typed language similar to JavaScript. Other languages, such as Vyper and Yul, are also used for writing Ethereum smart contracts.

#### TVM

- TVM uses FunC as a high-level language for writing TON smart contracts. It is a procedural language with static types and support for algebraic data types. FunC compiles to Fift, which in turn compiles to TVM bytecode.

## Conclusion

In summary, while EVM and TVM are stack-based machines designed to execute smart contracts, TVM offers more flexibility, support for a broader range of data types and structures, built-in overflow checks, and advanced cryptographic features.

TVM’s support for sharding-aware smart contracts and its unique data representation approach make it better suited for specific use cases and scalable blockchain networks.

## See also

- [Solidity vs FunC](/v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func/)
- [TVM overview](/v3/documentation/tvm/tvm-overview/)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/introduction.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/introduction.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Player from '@site/src/components/player'
import Button from '@site/src/components/button'


# The Open Network


**The Open Network (TON)** is a decentralized and open internet platform comprising several components. These include TON Blockchain, TON DNS, TON Storage, TON Sites, and TON Proxy. TON Blockchain is the core protocol connecting TON’s underlying infrastructure to form the greater TON Ecosystem.

TON focuses on achieving widespread cross-chain interoperability while operating within a highly scalable and secure framework. It aims to process millions of transactions per second and eventually reach hundreds of millions of users.

__TON Blockchain__, designed as a distributed supercomputer, serves as the heart of TON. It aims to provide various products and services that contribute to developing the decentralized vision for the new internet.

To understand the true vision for the decentralized internet and how TON contributes to this inevitability, consider taking a deep dive into the video below:

<Player url="https://www.youtube.com/watch?v=XgzHmV_nnpY" />

* To learn more about the technical aspects of TON Blockchain, review the [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
* Learn more about the development of all things TON by reviewing this section: [Getting started](/v3/documentation/ton-documentation/)

## Blockchain basics with TON

This course introduces blockchain basics, focusing on practical skills in the TON ecosystem. You will understand how blockchain functions and its diverse applications. You will also acquire crucial TON-related skills, including wallet setup, crypto asset management, and creation. The course will also equip you with critical knowledge about cryptocurrency threats and fraud and give practical tips on protecting your crypto assets.

<Button href="https://stepik.org/course/201294/promo"
        colorType={'primary'} sizeType={'sm'}>

English

</Button>


<Button href="https://stepik.org/course/200976/promo"
        colorType={'secondary'} sizeType={'sm'}>

Mandarin

</Button>


<Button href="https://stepik.org/course/202221/promo"
        colorType={'secondary'} sizeType={'sm'}>

Russian

</Button>


## TON Blockchain development

__TON Blockchain course__ is a comprehensive TON Blockchain guide. The course is designed for developers who want to learn how to create smart contracts and decentralized applications (dApps) on the TON blockchain.

It consists of __9 modules__ and covers the basics of TON Blockchain, the FunC programming language, and the TON Virtual Machine (TVM).


<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

English

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

Mandarin

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

Russian

</Button>



## New to blockchain

If you're new to blockchain and don’t understand what makes the technology so revolutionary — consider taking a deep dive into these important resources:

* [What is Blockchain? What is a Smart Contract? What is Gas?](https://blog.ton.org/what_is_blockchain)
* [How a Blockchain Can Help You on a Deserted Island](https://talkol.medium.com/why-decentralized-consensus-blockchain-is-good-for-business-5ff263468210)
* [\[YouTube\] Crypto Networks and Why They Matter](https://youtu.be/2wxtiNgXBaU)


## Migration from Ethereum

For those familiar with Ethereum development, we suggest introductory articles to help you understand what sets TON apart in this regard:
* [The differences of blockchains](/v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains)
* [Six unique aspects of TON Blockchain that will surprise Solidity developers](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers)
* [It’s time to try something new: Asynchronous smart contracts](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison.md
================================================
import Feedback from '@site/src/components/Feedback';

# Comparison of blockchains

This document provides a comparative analysis of TON against Ethereum and Solana.

|                            | Ethereum 2.0 (ETH 2.0) | Solana (SOL)     | TON         |
|----------------------------|------------------------|------------------|-------------|
| **Consensus**              | Proof of Stake         | Proof of History | BFT PoS     |
| **TPS**                    | 100,000 TPS            | 59,400 TPS       | 104,715 TPS |
| **Block Time**             | 12 sec                 | < 1 sec          | < 1 sec     |
| **Time to Finalize Block** | 10-15 min              | ~13 sec          | < 3 sec     |
<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains.md
================================================
import Feedback from '@site/src/components/Feedback';

# Blockchain of blockchains


:::tip
Terms '**smart contract**', '**account**', and '**actor**' are used interchangeably in this document to describe a blockchain entity.
:::

## Single actor

Let's consider one smart contract.

In TON, it is a _thing_ with properties like `address`, `code`, `data`, `balance` and others. In other words, it is an object with some _storage_ and _behavior_.
That behavior has the following pattern:
* contract receives a message
* contract handles that event according to its properties by executing its `code` in TON Virtual Machine
* contract modifies its properties consisting of `code`, `data`, and others
* contract optionally generates outgoing messages
* contract goes into standby mode until the next event occurs

A combination of these steps is called a **transaction**. Since it is essential to handle events one by one, transactions follow a strict order and cannot interrupt each other.

This behavior pattern is well known and called **actor**.

### The lowest level: AccountChain

A **chain** can be viewed as a sequence of transactions, such as `Tx1 → Tx2 → Tx3 → …`. When this transaction sequence pertains to a single account, it is specifically termed an **AccountChain**.

Since nodes processing these transactions periodically need to synchronize the smart contract state to achieve consensus, transactions are grouped into batches called **blocks**. For instance:

```
[Tx1 → Tx2] → [Tx3 → Tx4 → Tx5] → [] → [Tx6]
```

Batching does not alter the underlying sequence. Each transaction still references exactly one preceding transaction (`prev tx`) and at most one succeeding transaction (`next tx`). Batching simply organizes this sequence into manageable blocks for consensus purposes.

Additionally, each block can contain queues of incoming and outgoing messages. Incorporating these queues ensures that a block fully encapsulates all events and state changes relevant to the smart contract within the block period.


## Many AccountChains: Shards

Now let's consider many accounts. We can get a few AccountChains and store them together; such a set of AccountChains is called a **ShardChain**. In the same way, we can cut ShardChain into **ShardBlocks**, which are an aggregation of individual AccountBlocks.

### Dynamic splitting and merging of ShardChains

Note that since a ShardChain consists of easily distinguished AccountChains, we can easily split it. That way, if we have one ShardChain that describes events that happen with one million accounts and there are too many transactions per second to be processed and stored in one node, so we just **split** that chain into two smaller ShardChains with each chain accounting for half a million accounts and each chain processed on a separate subset of nodes.

Analogously, if some shards become too unoccupied, they can be **merged** into one more enormous shard.

There are two limiting cases: when the shard contains only one account (and thus cannot be split further) and when the shard contains all accounts.

Accounts can interact with each other by sending messages.  A unique routing mechanism moves messages from outgoing queues to corresponding incoming queues and ensures:
1. The delivery of all messages
2. Consecutive delivery of messages — a message sent earlier will reach the destination earlier

:::info SIDE NOTE
An aggregation of AccountChains into shards is based on the bit-representation of account addresses to make splitting and merging deterministic. For example, an address looks like `(shard prefix, address)`. That way, all accounts in the ShardChain will have the same binary prefix (for instance, all addresses will start with `0b00101`).
:::


## Blockchain

An aggregation of all shards, which contains all accounts behaving according to one set of rules, is called a Blockchain.

In TON, there can be many sets of rules, and thus, many blockchains operate simultaneously and can interact with each other by sending messages cross-chain in the same way that accounts of one chain can interact with each other.

### WorkChain: a blockchain with your own rules

If you want to customize the rules of the ShardChains group, you could create a **WorkChain**. A good example is to make a workchain that works on the base of EVM to run Solidity smart contracts on it.


Theoretically, everyone in the community can create their own WorkChain. Building it isn't very easy, and then you have to pay a high price and receive 2/3 of votes from validators to approve it.

TON allows creating up to `2^32` workchains, subdivided into `2^60` shards.

Nowadays, there are only two workchains in TON: MasterChain and BaseChain.

BaseChain is used for everyday transactions between actors because it's cheap, while MasterChain has a crucial function for TON.

### MasterChain: blockchain of blockchains

There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON, a special chain called **MasterChain** is used for that purpose. Blocks of MasterChain contain additional information, like the latest block hashes, about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at a single MasterChain block.

## See also
- [Smart contract addresses](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses)


<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage.md
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Cells as data storage

In TON, a **cell** is a built material for the entire blockchain. The cell is a data structure containing:

- up to **1023 bits** of data
- up to **4 references** to other cells
- cell stores bits and references separately
- cell forbids circular references: for any cell, none of its descendant cells can reference this original cell.

Thus, all cells constitute a directed acyclic graph (DAG). Here's a good picture to illustrate:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
        dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
    }}
/>
<br></br>

## Cell types
Currently, there are five types of cells: one ordinary cell and four exotic cells.
The exotic types are the following:
* Pruned branch cell
* Library reference cell
* Merkle proof cell
* Merkle update cell

:::tip
See [**Exotic cells**](https://ton.org/tvm.pdf).
:::

## Cell flavors

A cell is an opaque object optimized for compact storage.

It deduplicates data: it only stores the content of several equivalent sub-cells referenced in different branches once. However, one cannot modify or read a cell directly because of its opacity. Thus, there are two additional flavors of the cells:
* **Builder** is a flavor for constructing cells
* **Slice** for a flavor for reading cells 

Another unique cell flavor in TVM:

* **Continuation**  for cells containing opcodes instructions for TON Virtual Machine, see [TVM bird's-eye overview](/v3/documentation/tvm/tvm-overview).

## Serialization of data to cells

Any object in TON, like the message, block, or whole blockchain state, serializes to a cell.

A TL-B scheme describes the serialization process: a formal description of how this object can be serialized into _builder_ or how to parse an object of a given type from the _Slice_.
TL-B for cells is the same as TL or ProtoBuf for byte-streams.

If you want more details about cell serialization and deserialization, read [Cell & bag of cells](/v3/documentation/data-formats/tlb/cell-boc) article.


## See also

- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)
- [TL-B language](/v3/documentation/data-formats/tlb/tl-b-language)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/security-measures.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON security audits

The security of the TON blockchain ecosystem is of utmost importance. Below is a summary of completed audits conducted by renowned auditing firms for key components of the TON blockchain.

## TON Blockchain

Various security providers audited core blockchain modules to ensure their robustness and security.

**Audit firms**: Trail of Bits, SlowMist, CertiK  
**Audit reports**:
- [Trail of Bits: TON Blockchain Audit Report](https://docs.ton.org/audits/TON_Blockchain_ToB.pdf)
- [SlowMist: TON Blockchain Audit Report](https://docs.ton.org/audits/TON_Blockchain_SlowMist.pdf)
- [CertiK: TON Blockchain Audit Report](https://docs.ton.org/audits/TON_Blockchain_CertiK.pdf)
- [CertiK: TON Masterchain Contracts Formal Verification](https://docs.ton.org/audits/TON_Blockchain_Formal_Verification_CertiK.pdf)

## TON Blockchain library (tonlib)

Zellic conducted a security assessment for TON from October 16th to November 17th, 2023. During this engagement, Zellic reviewed Tonlib’s code for security vulnerabilities, design issues, and general weaknesses in security posture.

**Audit firm**: Zellic  
**Audit report**:
- [Zellic: Audit Report](https://docs.ton.org/audits/TON_Blockchain_tonlib_Zellic.pdf)

## TVM and Fift

Audit for TON Virtual Machine and the Fift programming language.

**Audit firm**: Trail of Bits  
**Audit report**:
- [Trail of Bits Audit Report - TVM & Fift](https://docs.ton.org/audits/TVM_and_Fift_ToB.pdf)

## TVM Upgrade Jul 2023

Audit for security and potential vulnerabilities in TVM Upgrade 2023.07.

**Audit firm**: Trail of Bits  
**Audit report**:
- [Trail of Bits Audit Report - TVM Upgrade](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

---

## Bug bounty program
To further enhance the security of the TON ecosystem, we encourage security researchers and developers to participate in the [TON security bug bounty](https://github.com/ton-blockchain/bug-bounty) program.

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/sharding.md
================================================
import Feedback from '@site/src/components/Feedback';

# Sharding in TON

Sharding in TON refers to dividing the blockchain into smaller, manageable pieces, or shards, for scalability. An independent set of validators operates and maintains a shard as a smaller piece of the blockchain.

Validators in separate shards can handle transactions in parallel, ensuring high throughput even as the network grows. This approach unlocks the execution of a massive number of transactions. 

In TON, sharding is highly dynamic. Unlike other blockchains with a fixed number of shards, TON can create new shards on demand. 
Shards split as the transaction load increases, and as the load decreases, they merge. 
This flexibility ensures the system can adapt to varying workloads while maintaining efficiency.

![](/img/docs/blockchain-fundamentals/scheme.png)

The **MasterChain** is crucial in maintaining the network configuration and the final state of all **WorkChains** and **ShardChains**. 
While the MasterChain is responsible for overall coordination, WorkChains operate under their specific rules, each of which can be split further into SharChains. 
Only one WorkChain - the **BaseChain**, currently operates on TON.

At the heart of TON's efficiency is the [Infinity sharding paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm/), which treats each account as part of its own AccountChain.
These AccountChains are then aggregated into ShardChain blocks, facilitating efficient transaction processing.

In addition to dynamically creating shards, TON uses **split merge** functionality, which allows the network to efficiently respond to changing transaction loads. This system enhances scalability and interaction within the blockchain network, exemplifying TON's approach to resolving typical blockchain challenges with a focus on efficiency and global consistency.


## See also

* [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
* [Shards dive in](/v3/documentation/smart-contracts/shards/shards-intro/)
* [Infinity sharding paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm/)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses.md
================================================
import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

On the TON Blockchain, every actor, including wallets and smart contracts, is represented by an address. These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## Address components

Each address on TON consists of two main components:
- **Workchain ID**: A signed 32-bit integer that denotes which workchain the contract belongs to (e.g., `-1` for the Masterchain and `0` for the Basechain).
- **Account ID**: A unique identifier for the contract, generally 256 bits in length for the Masterchain and Basechain.

## Address states

Each address on TON can be in one of the following states:
- **Nonexist**: The address has no data (initial state for all addresses).
- **Uninit**: The address has a balance but no smart contract code.
- **Active**: The address is live with smart contract code and balance.
- **Frozen**: The address is locked due to storage costs exceeding its balance.

## Address formats

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## User-friendly address

A **user-friendly address** designed for blockchain users with features:
1. **Flags**: Indicates if the address is bounceable for contracts or non-bounceable for wallets.
2. **Checksum**: A 2-byte error-checking mechanism CRC16 that helps detect errors before sending.
3. **Encoding**: Transforms the raw address into a readable, compact form using base64 or base64url.

Example: `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF` (base64)

User-friendly addresses make transactions safer by preventing errors and allowing the return of funds in case of failed transactions.

### User-friendly address flags

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

| Address beginning | Binary form | Bounceable | Testnet-only |
|:-----------------:|:-----------:|:----------:|:------------:|
|        E...       |  000100.01  |    yes     |   no         |
|        U...       |  010100.01  |     no     |   no         |
|        k...       |  100100.01  |    yes     |   yes        |
|        0...       |  110100.01  |     no     |   yes        |

:::tip
The Testnet-only flag doesn't have representation in the blockchain at all. The non-bounceable flag makes a difference only when used as the destination address for a transfer: in this case, it [disallows bounce](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for a message sent; the address in blockchain, again, does not contain this flag.
:::

```
default bounceable: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
urlSafe: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
non-bounceable: UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
Testnet: kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
non-bounceable, Testnet: 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

## Raw address
A **raw address** contains only the basic elements:
- **Workchain ID** (e.g., `-1` for Masterchain)
- **Account ID**: A 256-bit unique identifier

Example:  
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

However, raw addresses have two main issues:
1. They lack built-in error checking, meaning a mistake in copying can lead to loss of funds.
2. They don't support additional features like bounceable/non-bounceable flags.

## Converting between address formats

Convert raw, user-friendly addresses using [ton.org/address](https://ton.org/address/).

For more details, refer to the refhandling guide in the [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses) section.

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
- [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-blockchain/ton-networking.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON networking

TON Ecosystem uses its peer-to-peer network protocols.

- **TON Blockchain** uses these protocols to propagate new blocks, send and collect transaction candidates, etc.

  While the networking demands of single-blockchain projects, such as Bitcoin or Ethereum, can be met quite easily: one essentially needs to construct a peer-to-peer overlay network and then propagate all new blocks and transaction candidates via a [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

Multi-blockchain projects, such as TON, are much more demanding. For example, one must be able to subscribe to updates for only some shardchains, not necessarily all of them.


- **TON Ecosystem services** like TON Proxy, TON Sites, TON Storage, and dApps run on these protocols.

  Once the more sophisticated network protocols are in place to support the TON blockchain. 
  They can easily be used for purposes not necessarily related to the immediate demands of the blockchain itself, thus providing more possibilities and flexibility for creating new services in TON Ecosystem.

## TON network protocols

* [TON Connect](/v3/guidelines/ton-connect/overview/)
* [ADNL protocol](/v3/documentation/network/protocols/adnl/overview/)
* [Overlay subnetworks](/v3/documentation/network/protocols/overlay/)
* [RLDP protocol](/v3/documentation/network/protocols/rldp/)
* [TON DHT service](/v3/documentation/network/protocols/dht/ton-dht/)

## See also
- [TON security audits](/v3/concepts/dive-into-ton/ton-blockchain/security-measures/)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton.mdx
================================================
import Feedback from "@site/src/components/Feedback";
import Player from "@site/src/components/player";

# Explorers in TON

This article will consider TON explorers and their capabilities and features from the user's perspective.

## What is an explorer?

An explorer is a website that allows you to view information in a blockchain, such as the account balance, transaction history, and blocks.

<Player url="https://www.youtube.com/watch?v=i5en19kzX6M" />

## Which explorers exist?

Among TON explorers, you can distinguish several categories:

- For everyday use
- With extended information for developers
- Specialized

This division into categories is mainly conditional, and one explorer can belong to several categories simultaneously. So let's not pay too much attention to this.

## General functionality

Blockchain explorers allow you to view and search the blockchain, similarly to how you might use a banking app to check transaction history and account balances. They provide a user-friendly interface to access real-time data about blockchain transactions, blocks, and addresses.

Just as you use a banking app to track where your money goes, who sends you payments, and when transactions occur, blockchain explorers let you see this information for digital assets on the blockchain. They are essential for transparency, allowing anyone to verify transactions independently, see the flow of cryptocurrency, and analyze the activity on the blockchain.

Typically, an explorer allows you to find a transaction or an account by its identifier. Some explorers also support DNS extensions or their own [address book](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton#address-alias-in-explorers), which adds a human-readable label to a specific account. Example: [TON Foundation](https://tonviewer.com/UQAFmjUoZUqKFEBGYFEMbv-m61sFStgAfUR8J6hJDwUU04VW).

## Native explorers

### Tonscan

It is a good explorer for everyday use. It provides a comprehensive view of the TON Blockchain, allowing users to search for transactions, addresses, blocks, and more.

- Mainnet: [tonscan.org](https://tonscan.org/)
- Testnet: [testnet.tonscan.org](https://testnet.tonscan.org/)

#### Features

- Convenient for everyday use and developers
- Advanced jetton and nominator pools pages for users
- Contract types and disassembler
- User-friendly search uses DNS and [address book](https://github.com/catchain/address-book) labels.

### Tonviewer

It is a good explorer for everyday use with a balanced UI for users and developers.

- Mainnet: [tonviewer.com](https://tonviewer.com/)
- Testnet: [testnet.tonviewer.com](https://testnet.tonviewer.com/)

#### Features

- Convenient for everyday use and developers
- Advanced information for developers with traces
- Contract types and disassembler
- User-friendly search uses DNS and [tonkeeper/ton-assets](https://github.com/tonkeeper/ton-assets) labels.

### Tonscan by Bastion

- Mainnet: [tonscan.com](https://tonscan.com/)

#### Features

- Transaction aggregation analytics
- Transaction traces

### DTON

DTON is another explorer for developers. It provides a lot of information about transactions in a convenient form.

It also has a feature that allows you to see the computation phase of the transaction step by step.

- Mainnet: [dton.io](https://dton.io/)

#### Features

- Convenient for developers
- Extended information about the computation phase
- Contract types and disassembler

### Ton Whales explorer

Explorer for developers.

- Mainnet: [tonwhales.com/explorer](https://tonwhales.com/explorer)

#### Features

- Convenient for developers
- Contract types and disassembler
- Simple and convenient validator details

### TON NFT EXPLORER

This explorer specializes in NFTs but is also suitable as a regular explorer.

- Mainnet: [explorer.tonnft.tools](https://explorer.tonnft.tools/)
- Testnet: [testnet.explorer.tonnft.tools](https://testnet.explorer.tonnft.tools/)

When viewing the wallet address, you can find out which NFT it stores, and when viewing the NFT, you can find the metadata, collection address, owner, and transaction history.

#### Features

- Convenient for developers
- Specialized in NFT
- Contract types

## Crosschain explorers

### OKX TON explorer

This explorer is designed to provide comprehensive and detailed data insights into TON. Whether you're tracking wallet addresses, exploring Jetton tokens, or delving into NFT collections, it offers a user-friendly experience tailored for both beginners and developers.

- Mainnet: [web3.okx.com/explorer/ton](https://web3.okx.com/explorer/ton)

#### Features

- Convenient for everyday use
- TON DNS support
- Jetton and NFT data

### TON NFTscan

This explorer is designed explicitly for Non-Fungible Tokens (NFTs) on the TON Blockchain. It allows users to explore, track, and verify NFT transactions, contracts, and metadata.

- Mainnet: [ton.nftscan.com](https://ton.nftscan.com/)

#### Features

- Convenient for regular users
- NFT collection ranking
- Useful information for traders, such as daily volume

## Analytics explorers

### TonStat

- Mainnet: [tonstat.com](https://www.tonstat.com/)

It displays various statistics, such as the number of registered network addresses and wallets, the volume of Toncoin burned, the volume of Toncoin staked, the volume of NFTs issued, the number of validators, and other metrics.

#### Features

- Convenient for regular users
- DeFi information
- Useful information for traders, such as daily volume

## Address alias in explorers

Make your service address more user-friendly by using an address alias. Create Pull Requests (PRs) according to the provided guidelines:

- [tonkeeper/ton-assets](https://github.com/tonkeeper/ton-assets) - Tonviewer.com alias
- [catchain/address-book](https://github.com/catchain/address-book)- Tonscan.org alias
- [ton-labels](https://github.com/ton-studio/ton-labels) - Public dataset of labeled TON blockchain addresses

## Want to be on this list?

Please write to one of the [maintainers](/v3/contribute/maintainers).

## See also

- [TON wallet apps](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps)
- [ton.app/explorers](https://ton.app/explorers)
- [Awesome TON repository](https://github.com/ton-community/awesome-ton)

<Feedback />



================================================
FILE: docs/v3/concepts/dive-into-ton/ton-ecosystem/nft.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-ecosystem/nft.md
================================================
---
---
import Feedback from '@site/src/components/Feedback';

# NFT use cases

After reading this article, you'll understand why NFTs are helpful and how to use them in real life.

## Introduction

**Non-fungible token (NFT)** is a type of unique digital asset that can't be replaced by another identical asset. This article describes the approaches and use cases of NFTs already implemented in TON Blockchain.

### Item ownership

Non-fungible tokens are mostly known as cool pictures that can be bought and sold on NFT marketplaces like OpenSea or [getgems.io](https://getgems.io).

NFT pictures and collections are funny and help people understand the concept of blockchain-based ownership. However, in the long term, the NFT focus should shift beyond this to illustrate its wide variety of potential use cases.

In 2024, Telegram introduced [gifts as NFT items](https://telegram.org/blog/wear-gifts-blockchain-and-more#move-gifts-to-the-blockchain).

### Support an artist

One of the initial motivations behind the development of NFTs was finding a way to support artists by buying their works packed as collections of NFTs stored in the blockchain.

In this way, artists could make money by selling new works and receiving royalties from subsequent resales of the NFT on the market.

This use case is one of the most common reasons why marketplaces like getgems.io or OpenSea are part of the essential infrastructure of any blockchain nowadays.

### Accounts as NFTs

In November, the Telegram team launched the [Fragment](https://fragment.com/) marketplace. This marketplace allows anyone to buy and sell Telegram usernames or Anonymous Numbers backed by an NFT on the TON Blockchain.

Moreover, in 2022, the Telegram team released [No-SIM sign-up](https://telegram.org/blog/ultimate-privacy-topics-2-0#sign-up-without-a-sim-card). You can buy a virtual phone number as an NFT to sign up in Telegram Messenger and ensure that your privacy is secured by the TON Blockchain.

### Domain as an NFT

The TON DNS service works fully on-chain. If you want to own a domain in the decentralized web backed by TON like `mystore.ton` you need to buy the NFT domain on [DNS marketplace](https://dns.ton.org/) for your wallet and pay a rental fee for storing and processing data in the blockchain.

You can also use the NFT usernames bought on Fragment for TON DNS to bind them to your wallet and use your `username.t.me` NFT as a wallet address.

### NFT as an address for your wallet

Everyone in crypto understands the idea of a unique wallet address like `Egbt...Ybgx`.

But if you want to receive money from your mom, it's a useless approach to blockchain mass adoption!

That's why a wallet backed by the domain `billy.ton` would work better for users outside of crypto.

Various TON wallet apps, like [Tonkeeper](https://tonkeeper.com/) wallet, have already implemented this approach. You can go ahead and check it out now.

### Ticket as an NFT

NFT tickets provide an excellent solution for verifying access to events, like concerts or conferences.

Owning an NFT ticket offers several unique advantages:

First and foremost, NFT tickets cannot be forged or copied, eliminating the possibility of fraudulently selling fake tickets. This NFT property ensures that buyers can trust the ticket's authenticity and the seller's legitimacy, giving them confidence in what they're paying for.

Secondly, NFT tickets open up exciting opportunities for collecting. As the owner of an NFT ticket, you can store it in your digital wallet and have access to a whole collection of tickets from various events. This opportunity creates a new aesthetic and financial satisfaction for music and art lovers.

Thirdly, NFT tickets provide accessibility and convenience. Users can quickly transfer NFTs using digital wallets, which eliminates the hassle of physically receiving or sending tickets. The process of exchanging tickets with friends or purchasing them on the secondary market becomes simpler and more convenient.

Additionally, owning an NFT ticket can include extra benefits and special privileges. Some artists or organizers may offer NFT ticket holders exclusive backstage access, meet-and-greets with artists, or other bonuses, adding to the unique cultural experience for NFT ticket holders.

### Authorization token as an NFT

Using NFTs as authorization tokens introduces a revolutionary approach to granting access rights and permissions.

NFT tokens ensure elevated security and cannot be easily copied or forged. This eliminates the risk of unauthorized access or fake authentication and provides reliable authentication.

Furthermore, thanks to their transparency and traceability, the authenticity and ownership of an NFT authorization token unlock easy verification. This feature ensures convenient access to various platforms, services, or restricted content.

It's also worth mentioning that NFTs provide flexibility and adaptability in managing permissions. Since you can programmatically encode NFTs with specific access rules or attributes, they can adapt to different authorization requirements. This flexibility allows for fine-grained control over access levels, granting or revoking permissions as needed, which can be particularly valuable in scenarios that require hierarchical access or temporary authorization restrictions.

One of the services currently offering NFT authentication is [Playmuse](https://playmuse.org/), a media service built on the TON blockchain. This service aims to attract Web3 musicians and other creators.

Owners of NFTs from Playmuse gain access to the holders' chat. Participating in this chat allows you to influence the service's development direction, vote on various initiatives, and receive early access to presales and NFT auctions featuring renowned creators.

A Telegram bot facilitates access to the chat by verifying the presence of a Playmuse NFT in the user's wallet.

It is important to note that this is just one example. As TON Ecosystem evolves, new services and technologies for authentication via NFTs may emerge. Keeping up with the latest developments in the TON space can help identify other platforms or open-source projects that provide similar authentication capabilities.

### NFT as a virtual asset in games

NFT integrated into a game allows players to own and trade in-game items in a verifiable and secure way, which adds an extra layer of value and excitement to the game.

## See also

- [TON wallet apps](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps)
- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)

<Feedback />




================================================
FILE: docs/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Player from '@site/src/components/player'

# Wallet apps

## Overview

This article describes wallets from a developmental perspective. The end goal is to create wallet applications that support TON mass adoption.

<br></br>
<Player url="https://www.youtube.com/watch?v=OfW96enpD4Q" />
<br></br>

Learn a [ton.org/wallets](https://ton.org/wallets) catalog for more wallet apps.

## Non-custodial software wallets (hot)

Non-custodial wallets provide users with complete control over their assets. The private keys are stored exclusively by the wallet owner, and access is secured through a seed phrase—a unique set of 12 or 24 words.

A software wallet, often known as a hot wallet, operates as software on a host device and stores your private keys in a device storage, such as a smartphone or laptop.


Here are some non-custodial wallets for TON Blockchain.

#### For users:
* [Tonkeeper](https://tonkeeper.com/) — an open-source multiplatform wallet with a great user base. Platforms: iOS, Android, Firefox, Chrome.
* [MyTonWallet](https://mytonwallet.io/) — an open-source multiplatform wallet for TON. Platforms: iOS, Android, Firefox, Chrome.
* [Tonhub](https://tonhub.com/) — an open-source alternative mobile phone wallet with advanced banking features. Platforms: iOS, Android.

#### For developers:
* [TONDevWallet](https://github.com/TonDevWallet/TonDevWallet) - an open-source wallet for developers.

:::warning
[TONDevWallet](https://github.com/TonDevWallet/TonDevWallet) is for development and testing only. Do **NOT** use it to store real funds — it is **insecure** and does **NOT** provide adequate protection.
:::

* [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) — Classic wallet of TON Ecosystem developed by TON Foundation. Platforms: iOS, Android, macOS, Linux, Windows.
* [OpenMask](https://www.openmask.app/) — an open-source Chrome extension wallet.

### Tonkeeper

[Tonkeeper](https://tonkeeper.com/) is a central wallet in TON Ecosystem. The Tonkeeper team developed it and has active support from both users and developers.

<img src="/img/docs/wallet-apps/Tonkeeper.png?raw=true" alt="Tonkeeper" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>


#### Highlights
- This app is the most widely used.
- Supports all up-to-date features, including NFT and token transfer between user wallets.
- It supports all major platforms, such as iOS and Android, but it also works on popular browsers like Firefox or Chrome.

#### Tonkeeper test environment

##### Tonkeeper mobile app

1. Create a new regular wallet to claim Recovery Phrase, the 24 keywords.
2. Go back to the Tonkeeper main screen.
3. Click on your wallet name at the top of the screen.
4. Push the Add Wallet button at the bottom of the screen.
4. Select the Testnet Account option.
8. Enter the Recovery Phrase from step 1.

Now, your Testnet wallet is created and connected to your Mainnet wallet.


#### Links
- [GitHub](https://github.com/tonkeeper/wallet)
- [Tonkeeper Wallet API](https://github.com/tonkeeper/wallet-api)


### MyTonWallet

[MyTonWallet](https://mytonwallet.io/) is a feature-rich web wallet and browser extension for TON that supports tokens, NFT, TON DNS, TON Sites, TON Proxy, and TON Magic.

<img src="/img/docs/wallet-apps/MyTonWallet.png?raw=true" alt="Tonkeeper" width="520" height="300" style={{ display: 'block', margin: 'auto' }}/>

#### Highlights

- Has all basic features implemented.
- Focus on the best UI for users.
- Multichain wallet that supports TRON Blockchain.
- Supports all major platforms and runs in Chrome as an extension.

#### MyTonWallet test environment (browser, desktop, and mobile application)

1. Go to the Settings section.
2. Scroll down and click on the MyTonWallet application version.
3. In the pop-up window, select the environment.

#### Links

- [GitHub](https://github.com/mytonwalletorg/mytonwallet)
- [MyTonWallet Telegram](https://t.me/MyTonWalletRu)

### Tonhub

[Tonhub](https://tonhub.com/) is another fully-fledged TON wallet with basic, up-to-date features and banking.

<img src="/img/docs/wallet-apps/Tonhub.png?raw=true" alt="Tonkeeper" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>

#### Highlights 

- Has own custom [Ton Nominator](https://github.com/tonwhales/ton-nominators) contract supported with Tonhub UI.
- Open-source wallet from the beginning of the existing app.
- [Bug bounty program](https://tonwhales.com/bounty).

#### Tonhub test environment
You must download a separate Sandbox application to connect to the Testnet.

#### Links
- [GitHub](https://github.com/tonwhales/wallet)
- [Sandbox iOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)
- [Sandbox Android](https://play.google.com/store/apps/details?id=com.tonhub.wallet)

### TONDevWallet

TonDevWallet is a wallet designed to simplify the development process for the TON Blockchain. It provides extensive tools and features to streamline your TON development experience.

#### Highlights
TON Connect integration: TonDevWallet seamlessly integrates with TON Connect, allowing you to connect your wallet to TON-compatible websites easily.
- Store and manage multiple private keys within TonDevWallet, giving you the flexibility to access and control various accounts.
- Create multiple wallets to organize and manage different accounts for your TON development projects.
- Local transaction emulation lets you preview transaction results before executing them on TON Blockchain. This feature helps you ensure the correctness of your transactions before submitting them to the blockchain.

#### Links
- [GitHub](https://github.com/TonDevWallet/TonDevWallet)

### TON Wallet

TON Wallet was the first step in massively adopting blockchain technology, and it's now available to ordinary users. It demonstrates for developers how a wallet should work on the TON Blockchain.

<img src="/img/docs/wallet-apps/TonWallet.png?raw=true" alt="TON wallet" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>

#### Highlights
TON Wallet is the original wallet developed by the TON Core team. It demonstrates a development approach that corresponds to the TON Blockchain architecture.
- ADNL connection implemented.
- Multiplatform architecture support. It works in Linux, Windows, macOS, iOS, Android, and a Chrome plugin.
- [Bug bounty program](https://github.com/ton-blockchain/bug-bounty)

#### Ton Wallet test environment

To switch TON Wallet to the Testnet environment, you should open in the browser with the Testnet parameter:

#### Links
- [GitHub](https://github.com/ton-blockchain/wallet-ios)

:::info
TON Wallet clients for every supported OS placed in nearby repositories.
:::


### OpenMask

[OpenMask](https://www.openmask.app/) is a trailblazing tool that enables user interactions and experiences in Web3 as a browser extension.

<img src="/img/docs/wallet-apps/OpenMask.png?raw=true" alt="Tonkeeper" width="520" height="300" style={{ display: 'block', margin: 'auto' }}/>

#### Highlights

- Convenient for developers to learn and create dApps via desktop without mobile devices.
- Unique functions, such as multiple wallets, with detailed descriptions and examples in its documentation.

#### OpenMask test environment
To switch OpenMask between Mainnet and Testnet, click the **mainnet/testnet** button at the top of the main screen and choose the network you need.

#### Links

- [GitHub](https://github.com/OpenProduct/openmask-extension)
- [Documentation](https://www.openmask.app/docs/introduction)

## Non-custodial hardware wallets (cold)

Non-custodial wallets provide users with complete control over their assets. The private keys are stored exclusively by the wallet owner, and access is secured through a seed phrase—a unique set of 12 or 24 words.

A hardware wallet is a physical device that stores the private keys to your cryptocurrency funds away from the internet. Even if you make transactions with it, the wallet confirms the transactions in an offline environment. This process helps keep your private keys away from the risks of the internet at all times.



### Ledger

[Ledger](https://www.ledger.com/) is a hardware wallet with a Ledger Live app.

#### Links

- [Ledger TON Blogpost](https://blog.ton.org/ton-is-coming-to-ledger-hardware-wallets) user manual for TON in the Ledger wallets.
- [Ledger](https://www.ledger.com/) official site.

### SafePal

[SafePal](https://www.safepal.com/en/) is your gateway to the rapidly expanding galaxy of decentralized applications.

#### Links

- [SafePal](https://www.safepal.com/en/) official site

## Custodial wallets

In custodial wallets, private keys are managed by a third party, such as a cryptocurrency exchange. This means that users delegate the storage and management of their assets to a trusted entity.


### @wallet

[@wallet](https://t.me/wallet) — a bot to send and receive or trade TON for real money using P2P in Telegram. Supports Telegram Mini App UI.

<img src="/img/docs/wallet-apps/Wallet.png?raw=true" alt="Tonkeeper" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>

### @cryptobot

[@cryptobot](https://t.me/cryptobot) — A Telegram bot wallet for storing, sending and exchanging TON.

<img src="/img/docs/wallet-apps/send-bot.png?raw=true" alt="Tonkeeper" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>

#### Links for 3d-party integrations

- [Crypto Pay API](https://help.crypt.bot/crypto-pay-api)

### @tonRocketBot

[@tonRocketBot](https://t.me/tonRocketBot) - A Telegram bot wallet for storing, sending, and trading TON assets.


<img src="/img/docs/wallet-apps/tonrocketbot.png?raw=true" alt="Tonkeeper" width="240" height="480" style={{ display: 'block', margin: 'auto' }}/>

#### Links for 3d-party integrations

- [Rocket exchange](https://trade.ton-rocket.com/api/)
- [Rocket pay docs](https://pay.ton-rocket.com/api/)


## Multi-signature wallets

### Tonkey

Tonkey is an advanced project that introduces multi-signature functionality to TON Blockchain.

### Links
- https://tonkey.app/
- [GitHub](https://github.com/tonkey-app)

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/)
- [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)
- [Wallet contracts](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts/)

<Feedback />




================================================
FILE: docs/v3/concepts/educational-resources.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/educational-resources.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Educational resources

### Courses

#### Blockchain basics

This course introduces blockchain basics, focusing on practical skills in the TON ecosystem. You will understand how blockchain functions and its diverse applications.

This course is for junior developers, new in crypto, non-tech people in IT, and curious about blockchains.
 
<Button href="https://stepik.org/course/201294/promo" 
        colorType={'primary'} sizeType={'sm'}>

English
 
</Button>

 
<Button href="https://stepik.org/course/200976/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Mandarin
 
</Button>

 
<Button href="https://stepik.org/course/202221/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Russian
 
</Button>


#### TON Blockchain development

We're proud to present the __TON Blockchain course__, a comprehensive guide to the TON Blockchain. The course is designed for developers who want to learn how to create smart contracts and decentralized applications on the TON Blockchain in engaging and interactive ways.

It consists of __9 modules__ and covers the basics of the TON Blockchain, the FunC programming language, and the TON Virtual Machine (TVM).

This course is for software developers and  smart contract architects.
 
<Button href="https://stepik.org/course/176754/promo" 
        colorType={'primary'} sizeType={'sm'}>

English
 
</Button>

 
<Button href="https://stepik.org/course/201638/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Mandarin
 
</Button>

 
<Button href="https://stepik.org/course/201855/promo" 
        colorType={'secondary'} sizeType={'sm'}>

Russian
 
</Button>


## See also

* [TON Hello World](https://helloworld.tonstudio.io/01-wallet/)
* [Get started with TON](/v3/guidelines/get-started-with-ton/)
* [Awesome TON](https://github.com/ton-community/awesome-ton)
* [TON Dev Study YouTube Channel](https://www.youtube.com/@TONDevStudy)


<Feedback />




================================================
FILE: docs/v3/concepts/glossary.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/glossary.md
================================================
import Feedback from '@site/src/components/Feedback';

# Glossary

## Introduction

In this glossary, you can find any TON- and crypto-related buzzwords.

____________

## A

### Airdrop

**Airdrop** — a free distribution of tokens among specific participants.

### Altcoin

**Altcoin** — all cryptocurrencies, except Bitcoin, are called altcoins.

### AMA

**AMA** — an online Q&A called “ask me anything” where project leaders answer questions from the community about a product or service.

### API

**API** — Application Programming Interface, a mechanism that allows two programs to interact with each other through a series of protocols.

### APY

**APY** — Annual Percentage Yield, a calculated yearly interest rate for a given asset.

____________

## B

### Bearish

**Bearish** — the term “bearish” is used when the price of an asset has declined due to investors selling. (The term is often used to describe the overall market sentiment.)

### Binance

**Binance** — the world’s biggest cryptocurrency exchange by daily trading volume.

### Bitcoin (BTC)

**Bitcoin (BTC)** — the preeminent cryptocurrency and the first decentralized network with open-source code, which laid the groundwork for the proliferation of blockchain technology.

### Blockchain

**Blockchain** — a distributed ledger of data in the form of a chain of blocks recording transaction information for every event on the network.

### Bloodbath

**Bloodbath** — a colloquial term often used to describe a severe and sustained market crash, which results in multiple deep red bars on price charts.

### BoC

**BoC** — Bag of Cells. Usually, used in code.

### BoF

**BoF** — Bag of Files. Usually, used in code.

### Bot

**Bot** — a program written for two ecosystems to interact with each other — e.g., The Open Network and the Telegram messenger. On Telegram, bots are accounts in the messenger operated by software.

### Bridge

**Bridge** — a program connecting various blockchains to transfer tokens and data from one network to another. TON Bridge is available at this [link](https://ton.org/bridge/).

### Bullish

**Bullish** — the term “bullish” is used to describe an asset whose value is appreciating. (“Bullish” is the opposite of “bearish” — i.e. when the market’s overall value is increasing.)

### Burning

**Burning** — the act of burning or removing a number of tokens from the circulating and total supply, which often results in increased demand.

___________

## C

### CEX

**CEX** — a centralized cryptocurrency exchange to trade tokens.

### CMC

**CMC** — CoinMarketCap, a crypto information aggregator that closely follows changes in token prices and market capitalization.

### Coinbase

**Coinbase** — the biggest crypto exchange in the United States.

### Cryptobot

**Cryptobot** — a peer-to-peer (P2P) bot service for buying, trading, and selling Toncoin and other cryptocurrencies without Know Your Customer (KYC) verification.

### Custodial

**Custodial** — a type of crypto wallet where a third party stores cryptocurrencies, and not their true owner.

___________

## D

### DApps

**DApps** — decentralized applications made for blockchains supported by a group of nodes instead of a centralized server.

### DCA

**DCA** — dollar-cost averaging, an investment strategy whereby investors buy crypto assets at a low yet fixed price to reduce exposure to risks.

### Decentralization

**Decentralization** — one of the main tenets behind TON and other blockchains. Without decentralization, Web3 would be impossible to achieve; therefore, every element of the TON Ecosystem revolves around maximizing decentralization.

### DeFi

**DeFi** — the decentralized analog to traditional finance, it includes accessible financial services and applications based on smart contracts.

### DEX

**DEX** — a decentralized exchange (DEX) where users can trade cryptocurrencies without any intermediaries. The online entity needed to guarantee safe transactions is the blockchain itself.

### Diamond hands

**Diamond hands** — a colloquial term describing an investor who has no intention of selling their assets regardless of the state of the market — even if there’s a crash or the market is bearish.

### DNS

**DNS** — Domain Name System, a technology that allows users to make transactions between human-readable domain names (ton.org) and machine-readable IP addresses (192.0.2.44).

### Dolphin

**Dolphin** — an investor who has low-level capital but has an influence on the community.

### Donate

**Donate** — a bot service on Telegram through which people can either donate money or content creators can monetize their channels and services on Telegram, with a payment option in Toncoin.

### Dump

**Dump** — manipulating the increase in value of a token or cryptocurrency and then cashing out.

### Durov

**Durov** — Pavel Durov, a Russian entrepreneur who is famous for having founded the VK social network and Telegram messenger. Nikolai Durov is Pavel's brother who participated in developing VK, Telegram and also TON.

### DYOR

**DYOR** — _Do Your Own Research_, the process by which you do research on a project, company or cryptocurrency before deciding to invest.

___________

## E

### EVM

**EVM** — Ethereum Virtual Machine, a machine behaving like a decentralized computer, it computes the state of the Ethereum blockchain after each new block and executes smart contracts.

### Exchange

**Exchange** — a place for trading and using other market instruments.

___________

## F

### Farming

**Farming** — lending your crypto assets to receive rewards.

### Fiat

**Fiat** — regular money issued by central banks or financial authorities.

### FOMO

**FOMO** — “fear of missing out,” a psychological state that consumes some investors when the idea of losing potential gains from an opportunity is present. It usually appears during a bull market and when traders don’t do their due diligence analyzing a particular project.

### Fungible tokens

**Fungible tokens** — cryptocurrencies that carry the same value as any other token of the same kind at any given moment.

### FUD

**FUD** — “Fear, uncertainty and doubt,” market sentiments based on many factors.

### Full Node

**Full Node** — a computer on TON Blockchain that synchronizes and copies the entire TON Blockchain.

### FunC

**FunC** — the smart contract language on TON.

___________

## G

### Gas

**Gas** — the fee paid for transactions on the blockchain.

### GitHub

**GitHub** — a platform where developers gather to create base code for programs.

___________

## H

### Hackathon

**Hackathon** — a gathering of programmers to develop software, programs, applications, etc.

### Hash

**Hash** — information about transaction data, created by a hashing algorithm.

### Hash rate

**Hash rate** — the indication of how much computational power is being used on a network for crypto mining.

### Hold

**Hold** — saving — i.e. not selling — an asset or assets from your portfolio.

___________

## I

### ICO

**ICO** — initial coin offering, a method for crypto projects to attract capital in the early stages.

### IDO

**IDO** — initial decentralized exchange offering, another method of attracting capital when launching a cryptocurrency or token on a decentralized exchange.

### Inflation

**Inflation** — the process when the value of a currency — e.g., U.S. dollar or the euro — decreases. Toncoin (and other cryptocurrencies) are emitted with a high degree of transparency and a predictable issuance, which has deflationary properties.

___________

## K

### KYC

**KYС** — _Know Your Customer_, the process by which a user verifies their identity when creating an account for a crypto service.

___________

## L

### Launchpad

**Launchpad** — a platform for crypto startups that brings investors and projects together. The main launchpad in the TON Ecosystem is Tonstarter.

### Liquidity pool

**Liquidity pool** — grouping together crypto assets and freezing them in a smart contract. Liquidity pools are used for decentralized trading, loans, and other endeavors.

__________

## M

### Mainnet

**Mainnet** — the main network of a blockchain.

### Market cap

**Market capitalization (Market cap)** — the total value of a cryptocurrency’s combined number of tokens.

### Masterchain

**Masterchain** — in a multi-layered blockchain, the masterchain is the most important. For TON, the masterchain is the main chain of the network. When operations happen on the blockchain, they do so on the masterchain.

### Metaverse

**Metaverse** — a digital universe similar to a video game where users create avatars and interact with the digital representations of other people or users.

### Moon

**Moon** — a crypto term that describes a crypto asset’s vertical trajectory on a price chart — i.e. it quickly gains value.

__________

## N

### NFA

**NFA** — not financial advice, this acronym is used as a disclaimer to avoid liability or responsibility when investors discuss cryptocurrencies or projects with other people.

### NFT

**NFT** — non-fungible token, a unique digital token on a blockchain that cannot be duplicated or minted more than once.

### Nominator

**Nominator** — those who provide financial resources to validators so the latter can confirm blocks on TON Blockchain.

### Non-custodial

**Non-custodial** — a kind of crypto wallet that gives full control over assets to the owner/user.

__________
## O

### Off-ramp

**Off-ramp** — ways to convert cryptocurrencies into fiat money.

### On-ramp

**On-ramp** — ways to convert (buy) cryptocurrency by spending fiat money.

### Onion routing

**Onion routing** — a technology similar to TOR that allows anonymous interactions on a network. All messages are encrypted in various layers akin to an onion. TON Proxy applies such a technique.

__________
## P

### Paper hands

**Paper hands** — an investor who’s inclined to panic-sell — an inexperienced investor.

### Proof-of-stake

**Proof-of-stake** — a consensus mechanism to process transactions in new blocks on the blockchain.

### Proof-of-work

**Proof-of-work** — a consensus algorithm where one party proves to another that a specific amount of computational work was spent. By expending a little energy, a party can verify this.

### Proxy

**Proxy** — a service on a computer network that allows clients to install indirect network connections with other network services.

### Pump

**Pump** — artificially inflating the price of a cryptocurrency or asset.

### P2P

**P2P** — _peer-to-peer_, transactions among users without the help of a third party or intermediary.

__________

## R

### Roadmap

**Roadmap** — a project’s strategic plan that displays when its products, services, updates, etc. will be released.

### ROI

**ROI** — _return on investment_, the profits made from investments.

_________

## S

### SBT 
**SBT** — _Soulbound token_, an NFT that can never be transferred because it contains information about its owner and their accomplishments.

### Scalability

**Scalability** — the ability of a blockchain network to process complex transactions as well as a large number of them.

### SEC

**SEC** — Securities and Exchange Commission, a financial regulator in the United States.

### Shard

**Shard** — a mechanism that helps a blockchain network to scale by breaking into smaller blockchains to relieve network congestion — something which TON Blockchain does.

### Smart contract

**Smart contract** — self-executing code that oversees and enables operations with the help of mathematical algorithms and without human intervention.

### Spot trading

**Spot trading** — trading a financial asset for money.

### Stablecoin

**Stablecoin** — a cryptocurrency whose value is stable (usually pegged to a fiat currency) and does not crash.

### Staking

**Staking** — a way for users to earn a passive income by storing coins or tokens in a proof-of-stake algorithm, which, in turn, ensures the blockchain runs smoothly. For this, they earn rewards as an incentive.

### Swap

**Swap** — the exchange of two financial assets — e.g. Toncoin for USDT.

________

## T

### TEP

**TON Enhancement Proposals (TEP)**—a [standard set](https://github.com/ton-blockchain/TEPs) of ways to interact with various parts of the TON ecosystem.

### Testnet

**Testnet** — a network for testing projects or services before launching on the mainnet.

### Ticker

**Ticker** — the short form of a cryptocurrency, asset, or token on exchanges, trading services, or other DeFi solutions — e.g. TON for Toncoin.

### The Merge

**The Merge** — the transition process of Ethereum switching from proof-of-work to proof-of-stake.

### Token

**Token** — a form of digital asset; it can have multiple functions.

### Tokenomics

**Tokenomics** — the economic plan and distribution strategy of a cryptocurrency (or token).

### To the moon

**To the moon** — a colloquial phrase used when people create FOMO. It refers to hopefuls wanting the value of a cryptocurrency rapidly gaining a lot of value — hence its trajectory to the moon.

### Toncoin

**Toncoin** — the native cryptocurrency of the TON Ecosystem, which is used to develop services and pay for fees and services. It can be bought, sold, and traded.

### Trading

**Trading** — buying and selling cryptocurrencies with the goal of making a profit.

### TVL

**TVL** (Total Value Locked) — Total value locked represents the number of assets currently being staked in a specific protocol.

### TVM

**TVM** — Ton Virtual Machine, a machine behaving like a decentralized computer, it computes the state of the Ton blockchain after each new block and executes smart contracts.

___________

## V

### Validator

**Validator** — those who verify new blocks on TON Blockchain.

___________

## W

### WAGMI

**WAGMI** — “we’re all gonna make it,” a sentence often used in the crypto community to express the aspirations of becoming rich one day by investing in cryptocurrencies.

### Wallet

**Wallet** — software that stores cryptocurrencies through a system of private keys needed to buy or sell cryptocurrencies and tokens. It is also a bot in the TON ecosystem for buying and selling Toncoin.

### Web3

**Web3** — a new generation of the internet based on blockchain technology that includes decentralization and tokenomics.

### Whale

**Whale** — an investor who owns a large number of cryptocurrencies and tokens.

### Whitelist

**Whitelist** — a list awarding people special perks.

### White paper

**White paper** — the main document of a project written by its developers. It explains the technology and the project’s goals.

### Watchlist

**Watchlist** — a customizable list of cryptocurrencies whose price action an investor wishes to follow.

### Workchain

**Workchain** — secondary chains that connect to the masterchain. They can contain a massive number of different connected chains that have their own consensus rules. They can also contain address and transaction information and virtual machines for smart contracts. Additionally, they can be compatible with the masterchain and interact with one another.

___________

## Y

### Yield farming

**Yield farming** — lending or placing cryptocurrencies or tokens in a smart contract to earn rewards in the form of transaction fees.

### Yolo

**Yolo** — “you only live once,” a slang acronym used as a call to live life to the fullest without taking into account the risk of the given endeavor.

<Feedback />




================================================
FILE: docs/v3/concepts/qa-outsource/auditors.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/qa-outsource/auditors.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

:::danger
This page will soon be deleted. Please list your service on [ton.org/auditor](https://ton.org/talents?filterBy=Auditors).
:::

# Security assurance providers

:::info
Find TON Ecosystem auditors on [ton.app/audit](https://ton.app/audit).
:::

## Primary TON Blockchain SAP

* [beosin.com](https://beosin.com/?lang=en-US)
* [certik.com](https://www.certik.com/)
* [quantstamp.com](https://quantstamp.com/)
* [ton.tech](https://ton.tech/)
* [trailofbits.com](https://www.trailofbits.com/)
* [zellic.io](https://www.zellic.io/)
* [tonbit.xyz](https://www.tonbit.xyz/)


## See Also
* [TON Ecosystem Auditors](https://ton.app/audit)
* [TON Jobs](https://jobs.ton.org/jobs)
* [TON Talents](https://ton.org/en/talents)

<Feedback />




================================================
FILE: docs/v3/concepts/qa-outsource/outsource.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/concepts/qa-outsource/outsource.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'



# Outsource development

:::danger
This page is outdated and will be deleted soon. Please, learn ecosystem developers on the [ton.org/en/talents](https://ton.org/en/talents).
:::

## Outsource teams list

Discover 3rd party development teams for your TON project

* [Astralyx](#astralyx)
* [Coinvent](#coinvent)
* [EvaCodes](#evacodes)
* [Pixelplex](#pixelplex)
* [Serokell](#serokell)
* [softstack](#softstack)

### Astralyx

#### Summary
Company with big experience in TON and other chains development. You can ask us to create design, Telegram Mini Application (TMA), website, anything.

#### Workstreams
- TON smart-contracts development (including audits & tests)
- Web 2.0 & Web 3.0 development
- design, arts, renting leads for projects

#### Projects
- [t.me/xjetswapbot](http://t.me/xjetswapbot) (frontend, design),
- [github.com/astralyxdev/lockup-jettons-contract](http://github.com/astralyxdev/lockup-jettons-contract) (smartcontract, web interface, tests)
- [github.com/astralyxdev/ton-proxy](http://github.com/astralyxdev/ton-proxy) (TON Proxy extension, one of the first)
- [scaleton.io](http://scaleton.io) (landing, frontend, design)

#### Contacts

[astralyx.dev](http://astralyx.dev), contact@astralyx.dev

### Coinvent

#### Summary
Coinvent is a dedicated outsource development team, passionately committed to creating successful projects. Their expertise ranges from crafting simple bots to developing complex DeFi protocols.

#### Workstreams
- Smart-contracts
- DeFi, NFTs
- dApps, Telegram Mini Apps
- Regular Web2
- Telegram Bots

#### Projects
- [Tonraffles Lock module](https://tonraffles.app/lock) (smart-contract, front-end)
- [Tonraffles NFT Launchpad](https://tonraffles.app/nft/launchpad) (smart-contracts)
- [Monaki NFT Staking](https://www.monaki.life/) (smart-contracts)

#### Contacts

- [coinvent.dev](https://coinvent.dev)
- [@coinvent_dev](https://t.me/coinvent_dev)
- contact@coinvent.dev

### EvaCodes

#### Summary
EvaCodes is a top Eastern European blockchain development company with teams located in Ukraine, Armenia, and Poland. The company comprises over 50 skilled developers who have delivered 60+ web3 solutions, including web3 banking solutions, L1 blockchains, and web3 infrastructure.

#### Workstreams
- DeFi
- Crypto Wallets
- NFT-based solutions

#### Projects
- [alium.finance](https://alium.finance/)
- [konsta.network](https://konsta.network/)

#### Contacts
- ton@evacodes.com
- [evacodes.com](https://evacodes.com/)
- Telegram [@salesevacodes](https://t.me/salesevacodes)


### Pixelplex

#### Summary
PixelPlex stands out in providing secure and scalable blockchain-powered solutions, from robust protocols to advanced risk management systems. Focused on driving tangible results and enhancing project value, PixelPlex adeptly addresses complex challenges where others struggle. The company’s expertise spans over 450 projects across various industries, including FinTech, healthcare, real estate, and eCommerce.

#### Workstreams
- Ecosystem-agnostic development
- Custom protocol engineering
- DeFi enhancing
- ZK rollup scaling solutions
- Smart contracts optimization
- NFT-enabled solutions
- Security token offering

#### Projects
- [web3antivirus.io](https://web3antivirus.io)
- [qtum.org](https://qtum.org)
- [blackfort.exchange](https://blackfort.exchange/)
- [patientory.com](https://patientory.com/)
- [cyndicate.io](https://cyndicate.io)
- [streamsettle.com](https://streamsettle.com/)
- [savage.app](https://savage.app/marketplace)

#### Contacts
- [pixelplex.io](https://pixelplex.io)
- [info@pixelplex.io](mailto:info@pixelplex.io)

### Serokell

#### Summary
The most bizarre company with the bravest ideas of Ton and FunC programming.

#### Workstreams
- Cybersecurity (Smart Contract Audits)
- Smart Contract & dApp Development
- Digital Asset Wallets

#### Projects
- [Symbiosis](https://symbiosis.finance/)
- [Serokell Case Studies](https://serokell.io/project-ton-blockchain)
- Delivered TON Wallet Contract security audit

#### Contacts
- [serokell.io](https://serokell.io/)
- Telegram [Roman Alterman](https://t.me/alterroman)
- hi@serokell.io

### softstack

#### Summary
Softstack is a leading service provider of comprehensive Web3 solutions, since 2017, with a focus on software development and smart contract auditing. Made in Germany

#### Workstreams
- Smart Contract & dApp Development
- Digital Asset Wallets
- Telegram Mini-Apps & Bots
- Cybersecurity (Smart Contract Audits, Penetration Testing)

#### Projects
- [DeGods](https://degods.com)
- [tixbase](https://tixbase.com)
- [TMRW Foundation](https://tmrw.com)
- [Bitcoin.com](https://bitcoin.com)
- [Coinlink Finance](https://coinlink.finance)

#### Contacts
- hello@softstack.io
- [softstack.io](https://softstack.io/)
- Telegram [@yannikheinze](https://t.me/yannikheinze)


## See also
* [Security Assurance Providers](/v3/concepts/qa-outsource/auditors/)

<Feedback />




================================================
FILE: docs/v3/contribute/README.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/README.md
================================================
# How to contribute

:::info
Learn how to submit content to TON documentation here.
:::

## Contribute rules

### Documentation maintain community

TON Documentation is entirely open source. Community enthusiasts and early TON contributors have played a key role in creating this open-source TON documentation by turning their notes into detailed pages.

It was initially written by TON [contributors](/v3/contribute/maintainers/) and supported by [TON Studio](https://tonstudio.io/).
We aim to educate users about TON through explicit, easily searchable content that appeals to technical experts and casual readers.


### How to contribute

:::info
This documentation is written in English. Please refer to [localization program](/v3/contribute/localization-program/how-to-contribute/) for other languages.
:::

1. Clone a current version from the [ton-docs](https://github.com/ton-community/ton-docs) GitHub repository.
1. Determine an area for contribution according to [Style guide](/v3/contribute/style-guide/) and open a related [issue](https://github.com/ton-community/ton-docs/issues).
2. Familiarize yourself with [Content standardization](/v3/contribute/content-standardization/) and [Typography](/v3/contribute/typography/).
3. Open a pull request against the `main` branch with a clear description and concise updates according to the template.

#### Pull request template

```md

## Description

Brief description of the changes introduced in this pull request. Include any relevant issue numbers or links.

Closes [link to issue].

## Checklist

- [ ] I have created an issue.
- [ ] I am working on content that aligns with the [Style guide](https://docs.ton.org/v3/contribute/style-guide/).
- [ ] I have reviewed and formatted the content according to [Content standardization](https://docs.ton.org/v3/contribute/content-standardization/).
- [ ] I have reviewed and formatted the text in the article according to [Typography](https://docs.ton.org/v3/contribute/typography/).

```
4. Before submitting your pull request, complete and verify each milestone in the description checklist.

:::info
To avoid excessive rework, read the contribution guidelines in the [Style guide](/v3/contribute/style-guide/), [Content standardization](/v3/contribute/content-standardization/), and [Typography](/v3/contribute/typography/) before contributing. Don't worry about minor issues; maintainers will help you fix them during the review process.
:::

### Development

- Learn the documentation development flow from a [ton-docs/README.md](https://github.com/ton-community/ton-docs?tab=readme-ov-file#set-up-your-environment-%EF%B8%8F) document.

#### Best practices for pull requests

1. **Keep your pull request small**. Minor pull requests (~300 lines of diff) are easier to review and more likely to get merged. Make sure the pull request does only one thing; otherwise, please split it.
2. **Use descriptive titles**. It would be best to follow the commit message style.
3. **Test your changes**. Run build locally, and make sure you have no crashes.
4. **Use soft wrap**: Don't wrap lines at 80 characters; configure your editor to soft-wrap.


## Communicate to other developers

- [Ask questions related to TON documentation in the TON Docs Club chat in Telegram.](https://t.me/+c-0fVO4XHQsyOWM8)
- [Get familiar with the most frequently asked questions in the TON Developers.](https://t.me/tondev_eng)
- [Create an issue with your ideas on improvement.](https://github.com/ton-community/ton-docs/issues)
- [Find and take available bounties for the documentation.](https://github.com/ton-society/ton-footsteps/issues?q=documentation) 
- [See docs-ton on GitHub.](https://github.com/ton-community/ton-docs)

## See also

- [Style guide](/v3/contribute/style-guide/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)



================================================
FILE: docs/v3/contribute/content-standardization.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/content-standardization.mdx
================================================
import Feedback from '@site/src/components/Feedback';
import ThemedImage from "@theme/ThemedImage";
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


# Content standardization

## Introduction

This guideline aims to maintain a consistent documentation style and help contributors standardize their content so that it seamlessly integrates into the documentation.

## Text preferences

### Use American English

For words that have multiple spellings, use American English over British English.

Examples:

- "decentralized" over "decentralised"
- "color" over "colour"
- "analyze" over "analyse"

### Use present tense

Use present tense to describe general behavior, current functionality, and step-by-step instructions.
This makes documentation clear and easy to follow.

**Examples:**
- This guideline provides an overview of the contribution process.
- The system checks the file format and shows an error if it is invalid.

*Avoid future or past tense for immediate or typical actions.*

**Avoid:**
- The system will check the file format.
- The user clicked the button.

### When to use the future or past tenses

Present tense is standard, but future and past tenses are allowed in specific cases.

**Future tense:** for actions that happen later, after a condition or delay.

**Examples:**
- After setup, the system will send a confirmation email.
- If payment fails, the user will get a notification.

*Avoid the future tense for immediate behavior or unreleased features. Also, avoid *would*.*

**Avoid:**

- The system will check the file format.
- The API would return an error.


**Past tense:** for describing past events like changelogs or logs.

**Examples:**
- Version 2.1 fixed a validation issue.
- The user submitted the form at 2 pm and got a 500 error.

*Avoid past tense in general documentation — it can imply outdated info.*

**Avoid:**

- The system checked the user’s location.
- The user clicked the button.



### Use active voice

Sentences using active voice are more concise and efficient, making your writing more engaging and easier to comprehend.

**Active voice sentence:** An actor acts on a target

> _"The smart contract processed a message."_

**Passive voice sentence:** A target acts on an actor

> _"The message was processed by the smart contract."_

[Read more on active voice](https://www.grammarly.com/blog/active-vs-passive-voice/)

_This isn't an easy one, especially for non-native English speakers. If you aren't sure, don't worry. We'll help with any of these._

### Grammar

This documentation uses [cspell](https://cspell.org/) to correct grammar during development.

The `cspell` will check the spelling and automatically suggest corrections in case of mistakes before creating a new commit. Feel free to add specific words to the [cspell.json](https://github.com/ton-community/ton-docs/blob/doc_editor_guidelines/cspell.json) config and include them in the verification dictionary.

### Date format

Use the **"Mon D, YYYY"** format. This approach is standard for American readers, spells out the month (or uses a three-letter abbreviation), and minimizes confusion with day–month ordering.

#### Preferred format:

- Nov 2, 2023
- Feb 11, 2023

#### Incorrect format:

- 2-Nov-2023
- 11/2/2023
- 2/11/2023

Adhering to these guidelines creates a unified approach to presenting dates, fostering clarity and comprehension throughout the TON documentation.

### Use of emojis and icons

#### In the Documentation section:
- Avoid using emojis and decorative icons.
- Technical documentation should be clear, professional, and distraction-free.
- Use only standard formatting elements like headings, lists, and code blocks.

#### In the Guidelines section:
- Emojis and icons are allowed to make content more engaging and friendly.
- Use them purposefully and consistently, preferring functional icons such as:

✅ Success, ⚠️ Warning, ❌ Error.
- Always use icons with supporting text — don’t rely on icons alone to convey meaning.
- Avoid overly decorative or emotional emojis that don’t add meaning.
- When in doubt, skip the icon. Clarity, consistency, and neutrality come first.


## Link preferences

### Linking to internal pages

When linking to another page on TON documentation, use the relative path over the absolute path.

#### Correct link:

```md
Read more about [smart contracts](/v3/documentation/smart-contracts/overview/)
```

#### Incorrect link:

```md
Read more about [smart contracts](https://docs.ton.org/v3/documentation/smart-contracts/overview)
```

Don't hard-code the language path (for example, `/mandarin/`) in any links. This maintains consistent capability across different language versions of the site.

#### Correct link:

```md
Read more about [smart contracts](/v3/documentation/smart-contracts/overview/)
```

#### Incorrect link:

```md
Read more about [smart contracts](/mandarin/v3/documentation/smart-contracts/overview)
```

Set a trailing slash to all links. This approach keeps links consistent and avoids redirects, which hurts site performance.

#### Correct link:

```md
Read more about [smart contracts](/v3/documentation/smart-contracts/overview/)
```

#### Incorrect link:

```md
Read more about [smart contracts](/v3/documentation/smart-contracts/overview)
```

### Article authors

When citing articles by a specific author or organization, use the article's name as a link, followed by a dash and the author's name italicized.

#### Correct description:

```md
- [How to shard your TON smart contract and why](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons) — _Tal Kol_
- [TON Teleport BTC Whitepaper](https://tgbtc.gitbook.io/docs/whitepaper/abstract) – _RSquad Blockchain Lab_
```

#### Incorrect description:

```md
- [How to shard your TON smart contract and why](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [TON Teleport BTC Whitepaper](https://tgbtc.gitbook.io/docs/whitepaper/abstract) by RSquad Blockchain Lab
```

### See also links section

Include related resources on your page in an H2 section titled `## See also`.

This section guides readers to additional materials and supports a cohesive developer journey.

#### Example:

```md
## See also

- [Style guide](/v3/contribute/style-guide/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)
```

## Image preferences

### Linking to images

When adding an image to a page, download and set an image in the TON documentation `static/img` folder.

#### Correct linking:

```md
![jetton_transfer](/img/docs/asset-processing/jetton_transfer.png)
```

#### Incorrect linking:

```md
![tact_logo](https://docs.tact-lang.org/_astro/logomark-dark.BSmgZYWc_ZKRrUl.svg)
```

This is helpful to ensure the image will be available.

### Light and dark theme modes

TON documentation supports theme-specific images. Follow these steps to add themed pictures to the page.

1. Themed mode is available only for `.mdx` files.

2. Import the `ThemedImage` module in the header.

```js
import ThemedImage from "@theme/ThemedImage";
```

3. Set the links for both images according to the example:

```js
<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.svg?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2_dark.svg?raw=true',
  }}
/>
<br></br>
```

### Annotation specification

To depict message processing, use a graphical representation that resembles a smart contract graph, including labels for transactions and messages.

If the transaction order isn't essential, omit their labels. This approach simplifies the diagram, making it easier to read and understand the message and contract details.

### Annotation primitives

<ThemedImage
  alt=""
  sources={{
    light:
      "/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1.png?raw=true",
    dark: "/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1_dark.png?raw=true",
  }}
/>
<br></br>

- Avoid using a large variety of bright colors.
- Modify figures by applying techniques such as a dashed border.
- To emphasize specific details, display transactions using distinct line styles (e.g., solid and dashed).

### Message processing schemes

On the TON blockchain, providing clear explanations of actor behavior and message processing for various smart contracts and fundamental scenarios is essential.

The message processing schemes offer additional context for readers seeking a clear understanding of actor behavior. These schemes should be unified throughout the TON documentation to ensure maximum clarity.

#### Example

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: "/img/docs/message-delivery/message_delivery_2.png?raw=true",
    dark: "/img/docs/message-delivery/message_delivery_2_dark.png?raw=true",
  }}
/>
<br></br>

### Sequence diagram

Use a sequence diagram for complex and repetitive communication schemes between 2-3 actors. For messages, use the notation of a typical synchronous message arrow.

#### Example

<br></br>
<div class="text--center">
  <ThemedImage
    alt=""
    sources={{
      light: "/img/docs/message-delivery/message_delivery_7.png?raw=true",
      dark: "/img/docs/message-delivery/message_delivery_7_dark.png?raw=true",
    }}
  />
</div>
<br></br>

### Scheme formats and colors

#### Format:

- Use a PNG format for the diagrams in the documentation to ensure readability on various devices.

#### Fonts:

- Use the [Inter](https://rsms.me/inter/) font family for all text within diagrams.
- Maintain a consistent text size.
- Avoid overusing **bold** and _italic_ formatting for optimal readability.

#### Themed colors for light mode:

- Pencil Hand Drawn, default Visio theme.

#### Themed colors for dark mode:

- Font `#e3e3e3`.
- Background `#232328`.
- Light Highlight, arrows and scheme borders `#058dd2`.
- Dark Highlight, arrows and scheme borders `#0088cc`.
- InnerBackGround, for nested blocks `#333337`.

#### Version control policy:

- Store the original files in the project's Git repository under the `/static/visio` directory to facilitate future modifications.
- Learn [Visio](https://www.microsoft.com/en-us/microsoft-365/visio/flowchart-software) references directly from [Visio sources](https://github.com/ton-community/ton-docs/tree/main/static/schemes-visio/).


## Math equations

To include mathematical expressions in documentation, use the [react-katex](https://katex.org/docs/supported) library. It supports both inline and block-level math using `LaTeX` syntax.

Import the required components at the top of your `.mdx` file:

```
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
```
These imports allow you to render `LaTeX` math expressions:
- `BlockMath` is used for centered, standalone formulas.
- `InlineMath` is used for short expressions inside the regular text.
- The `css` import applies the necessary styling for proper rendering.

Contributors can use the following examples to format various types of math expressions in the documentation:

### Systems of equations

For systems of equations, use `LaTeX` formatting for clarity:

```
<BlockMath math={`\\begin{cases}
x + y = 10 \\\\
2x - y = 4
\\end{cases}`} />
```

This renders the system of equations as:

<BlockMath math={`\\begin{cases}
x + y = 10 \\\\
2x - y = 4
\\end{cases}`} />


### Exponential functions

For exponential functions, you can use the following format:

```
<InlineMath math="e^{x} = \lim\limits_{n\to \infty} \left( 1 + \frac{x}{n} \right)^n" />
```

This renders the equation: <InlineMath math="e^{x} = \lim\limits_{n\to \infty} \left( 1 + \frac{x}{n} \right)^n" />


### Fractions

To represent fractions, use `\frac{numerator}{denominator}:`

```
<InlineMath math="\frac{a}{b}"/>
```

This renders the fraction: <InlineMath math="\frac{a}{b}"/>

### Summation

For summation notation, use the following `LaTeX` formatting:
```
<BlockMath math="\sum_{i=1}^{n} i^2" />
```
This renders the summation: <BlockMath math="\sum_{i=1}^{n} i^2" />

### Logarithmic expressions

For logarithmic equations, use the following `LaTeX` syntax:

```
<InlineMath math="\log_{b}(x)" />
```

This renders the logarithmic expression: <InlineMath math="\log_{b}(x)" />


## Terminology

### TON

TON should always be capitalized.

**Correct usage:**

- TON

### TON with a word

- It is essential to ensure the correct use of _THE_ in the TON documentation. _TON Blockchain_ and _TON Ecosystem_ are capitalized terms, and therefore, do not require _THE_ in their usage.
- We write _TON_ with regular nouns, and if it requires _THE_ according to English grammar, we use it. For instance: "_The_ TON Connect _protocol_ is a..."

**Correct usage:**

- TON Blockchain
- TON Ecosystem
- The TON Connect protocol

### TON Center

**Correct usage:**

- TON Center

**Incorrect usage:**

- Toncenter
- TonCenter
- TONcenter

### Mainnet

When referring to the TON Mainnet (i.e. not referring to a Testnet) use the proper noun. Proper nouns help avoid confusion and build greater understanding.

**Correct usage:**

- Mainnet
- TON Mainnet

**Incorrect usage:**

- main net
- mainnet
- Main net
- TON mainnet

### AccountChain

**Correct usage:**

- AccountChain

**Incorrect usage:**

- Account Chain
- Accountchain

### ShardChain

**Correct usage:**

- ShardChain

**Incorrect usage:**

- Shardchain
- Shard Chain

### WorkChain

**Correct usage:**

- WorkChain

**Incorrect usage:**

- Workchain
- Work Chain

### MasterChain

**Correct usage:**

- MasterChain

**Incorrect usage:**

- Masterchain
- Work Chain

### BaseChain

**Correct usage:**

- BaseChain

**Incorrect usage:**

- Basechain
- Base Chain

### Proof-of-work / Proof-of-stake

Proof-of-work should be capitalized only when at the beginning of a sentence. In any other instance, all letters should be lowercase. In either case, proof-of-work should be hyphenated between each word.

**Correct usage:**

- Proof-of-work
- proof-of-work
- Proof-of-stake
- proof-of-stake

**Incorrect usage:**

- Proof-of-Stake
- Proof of stake
- proof of stake

The same rules we apply to proof-of-work apply to proof-of-stake, proof-of-authority, proof-of-humanity, proof-of-individuality, etc.

### Smart contract

The smart contract is a common noun and should only be capitalized at the beginning of a sentence. In any other instance, all letters should be lowercase.

**Correct usage:**

- Smart contract
- smart contract

** Incorrect usage:**

- Smart Contract

### Zero-knowledge

Zero-knowledge is a common noun and should only be capitalized at the beginning of a sentence. In any other instance, all letters should be lowercase. In either case, zero-knowledge should be hyphenated between each word.

**Correct usage:**

- Zero-knowledge
- zero-knowledge

**Incorrect usage:**

- Zero-Knowledge
- Zero knowledge
- zero knowledge

### ZK-proof

When using the abbreviated form of zero-knowledge proof you should shorten zero-knowledge to ZK, and hyphenate the abbreviation.

**Correct usage:**

- ZK-proof

**Incorrect usage:**

- Zk-proof
- zK-proof
- zk-proof
- Zk proof
- zK proof
- zk proof

### ZK-rollup

When using the abbreviated form of zero-knowledge rollup you should shorten zero-knowledge to ZK, and hyphenate the abbreviation.

**Correct usage:**

- ZK-rollup

**Incorrect usage:**

- Zk-rollup
- zK-rollup
- zk-rollup
- Zk rollup
- zK rollup
- zk rollup

### Nominator, validator, collator, node, liteserver

When using these words, refer to them in lowercase unless they are the first word of a heading.

**Correct usage:**

- nominator
- validator
- collator
- node
- liteserver

**Incorrect usage:**

- Nominator
- Validator
- Collator
- Node
- Liteserver

### BoC, bag of cells

- Use either the abbreviation **BoC** or the full term **bag of cells**.
- **Bag of cells** is capitalized only when it starts a sentence or heading. In all other cases, write **bag of cells** in lowercase.
- Always abbreviate **BoC**. Do not use **BOC** or **boc**.

**Correct usage:**

- BoC
- Bag of cells
- bag of cells


**Incorrect usage:**

- BOC
- boc
- Bag Of Cells
- Bag of Cells

## See also

- [How to contribute](/v3/contribute/)
- [Content standardization](/v3/contribute/content-standardization/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)

<Feedback />




================================================
FILE: docs/v3/contribute/contribution-rules.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/contribution-rules.md
================================================
import Feedback from '@site/src/components/Feedback';

# Contribution Guidelines

:::danger
This page is outdated and will be deleted soon.
See the [How to contribute](/v3/contribute/).
:::

Before contributing any docs.ton.org page, please review the following list of general and important requirements to guarantee a smooth experience.


## Naming

- It is essential to ensure the correct use of _THE_ in the TON documentation. _TON Blockchain_ and _TON Ecosystem_ are capitalized terms, and therefore, do not require _THE_ in their usage.
- We write _TON_ with regular nouns, and if it requires _THE_ according to English grammar, we use it. For instance: "_The_ TON Connect _protocol_ is a..."

:::info
TON Blockchain...

TON Ecosystem...

The TON Connect protocol...
:::

Please refer to the actual TON brand assets [here](https://ton.org/en/brand-assets).


## Documentation References

Every page in TON documentation should be finished with See Also section. Place there page, you think relates to current page without additional description.

:::info
```
## See Also
* [TON Contribution Guidelines](/v3/contribute/contribution-rules/)
* [Tutorial Styling Guidelines](/v3/contribute/tutorials/guidelines/)
```
:::

## English Helpful Sources
The TON Ecosystem is being built for the entire world, so it's crucial that it's understandable for everyone on Earth. Here, we provide materials that are helpful for junior tech writers who want to improve their English skills.

* [Plural Nouns](https://www.grammarly.com/blog/plural-nouns/)
* [Articles: A versus An](https://owl.purdue.edu/owl/general_writing/grammar/articles_a_versus_an.html)


## See Also

* [TON Contribution Guidelines](/v3/contribute/contribution-rules/)
* [Tutorial Styling Guidelines](/v3/contribute/tutorials/guidelines/)

<Feedback />




================================================
FILE: docs/v3/contribute/docs/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/docs/guidelines.md
================================================
import Feedback from '@site/src/components/Feedback';

# Common Documentation Principals

:::danger
This page is outdated and will be deleted soon.
See the [How to contribute](/v3/contribute/).
:::

For optimal user experience and clarity, please keep in mind the list of general and important requirements that we aim to apply to all documentation on docs.ton.org while creating new content.


## Documentation crafted for Professionals
Documentations pages is primarily intended for documentation purposes and not as a tutorial, so it is important to minimize the use of personal examples or analogies in the text. It is crucial to ensure that the content is suitable for both professionals and non-professionals alike, while still providing valuable information.

## Use a consistent format
To make it easier for readers to navigate through the documentation, it is important to use a consistent format throughout the document. Use headings, subheadings, bullet points, and numbered lists to break up the text and make it easier to read.

## Provide examples in special section
Providing examples can help readers better understand the content and how to apply it. If you are writing documentation page and need refer several examples, please create special section Examples right before References and See Also sections. Do not mix description and examples in documentation pages. 
Use code snippets, screenshots, or diagrams to illustrate your points and make the documentation more engaging.

## Keep it up to date
Tech documentation can quickly become outdated due to changes in technology or software updates. It is important to review and update the documentation regularly to ensure that it remains accurate and relevant to the current version of the software.

## Get feedback
Before publishing the documentation, it is a good idea to get feedback from other contributors or users. This can help identify areas that may be confusing or unclear, and allow you to make improvements before the documentation is released.
<Feedback />




================================================
FILE: docs/v3/contribute/docs/schemes-guidelines.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/docs/schemes-guidelines.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Graphic Explanations Guidelines

:::danger
This page is outdated and will be deleted soon.
See the [How to contribute](/v3/contribute/).
:::

Maintaining consistency in documentation is crucial, and to achieve this, a specific standard for visualizing processes in smart contracts has been developed.

## Graphic Explanation Notation

### Message Processing Graph

To depict message processing, it's advisable to utilize a graphical representation resembling a smart contract graph, complete with labels for transactions and messages.

If the order of transactions doesn't matter, you can omit their labels. This simplifies the diagram, making it easier to read and understand the details related to messages and contracts.

#### Annotation Primitives

<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1.png?raw=true',
    dark: '/img/docs/scheme-templates/message-processing-graphs/Graphic-Explanations-Guidelines_1_dark.png?raw=true',
  }}
/>
<br></br>

* Avoid using big quantity different and bright colors.
* Use the modification of figures, such as using a dashed border line.
* For better comprehension, different transactions could be displayed with distinct line styles (solid and dashed).


#### Message Processing Example

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_2.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_2_dark.png?raw=true',
  }}
/>
<br></br>



Learn references directly from Visio [message-processing.vsdx](/schemes-visio/message_processing.vsdx).


### Formats and Colors

#### Fonts

* **Inter** fonts family  for all text within diagrams.

#### Colors - Light Mode
* Pencil Hand Drawn(default theme)

#### Colors - Dark Mode
* Font `#e3e3e3`
* Background `#232328`
* Light Highlight(arrows and scheme borders) `#058dd2`
* Dark Highlight(arrows and scheme borders) `#0088cc`
* InnerBackGround(for nested blocks) `#333337`


#### Version Control Policy

* Set diagrams in the documentation by SVG format for schemes to ensure readability on various devices.
* Store original files in the project's Git repository under the "/static/visio" directory, making them easier to modify in the future.


### Sequence Diagram
In the case of complex and repetitive communication schemes between 2-3 actors, it is advisable to use a sequence diagram. For messages, use the notation of a common synchronous message arrow.

#### Example

<br></br>
<div class="text--center">
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/message-delivery/message_delivery_7.png?raw=true',
    dark: '/img/docs/message-delivery/message_delivery_7_dark.png?raw=true',
  }}
/>
</div>
<br></br>


### Scheme References

* [message-processing.vsdx](/schemes-visio/message_processing.vsdx)


<Feedback />




================================================
FILE: docs/v3/contribute/localization-program/how-it-works.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/localization-program/how-it-works.md
================================================
import Feedback from '@site/src/components/Feedback';

# How it works

![how it works](/img/localizationProgramGuideline/localization-program.png)

The TownSquare Labs Localization Program comprises several key components. This chapter provides an overview of localization, helping you understand how it works and how to use it effectively.

Within this system, we integrate several applications to function seamlessly as a unified program:

- **GitHub**: Hosts the documentation, synchronizes docs from the upstream repository, and syncs translations to specific branches.
- **Crowdin**: Manages translation processes, including translating, proofreading, and setting language preferences.
- **AI Systems**: Utilizes advanced AI to assist translators, ensuring smooth workflow.
- **Customized Glossary**: This glossary guides translators and ensures AI generates accurate translations based on the project’s context. Users can also upload their glossaries as needed.

:::info
This guide won't cover the entire process but will highlight the key components that make the TownSquare Labs Localization Program unique. You can explore the program further on your own.
:::

## GitHub synchronization for documentation and translations

Our repository utilizes several branches to manage documentation and translations. Below is a detailed explanation of the purpose and function of each special branch:

### Branches overview

- **`dev`**  
  The `dev` branch runs GitHub Actions to handle synchronization tasks. You can find the workflow configurations in the [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) directory:

  - **`sync-fork.yml`**: This workflow synchronizes documentation from the upstream repository. It runs daily at 00:00.
  - **`sync-translations.yml`**: This workflow synchronizes updated translations to the respective language branches for preview purposes on the corresponding websites.

- **`main`**  
  This branch stays in sync with the upstream repository through GitHub Actions, which runs on the `dev` branch. It also updates specific codes we intend to propose to the original repository.

- **`l10n_main`**  
  This branch includes all changes from the `main` branch and translations from Crowdin. All modifications in this branch are periodically committed to the upstream repository using a new sub-branch named `l10n_main_[some data]`.

- **`l10n_feat` or `l10n_feat_[specific functions]`**  
  This branch will include changes to code or documentation related to the translation system. Once you finalize all content, the changes in this branch will be merged into `l10_main`.

- **`[lang]_preview`**  
  These branches are designated for specific language previews, such as `ko_preview` for Korean and `ja_preview` for Japanese. They allow us to preview the website in different languages.

By maintaining these branches and using GitHub Actions, we efficiently manage the synchronization of our documentation and translation updates, ensuring that our multilingual content is always up to date.

## How to set up a new crowdin project

1. Log in to your [**Crowdin account**](https://accounts.crowdin.com/login).
2. Click `Create new project` in the menu.
![Create new project](/img/localizationProgramGuideline/howItWorked/create-new-project.png)
3. Set your Project name and Target languages. You can change the languages in the settings later.
![Create project setting](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)
4. Go to the project you just created, select the Integrations tab, click the `Add Integration` button, search for `GitHub`, and install it.
![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
5. Before configuring GitHub integrations on Crowdin, specify which files to upload to Crowdin to avoid uploading unnecessary files:

    1. Create a **crowdin.yml** file in the root of **your GitHub repo** with the basic configuration:

      ```yml
      project_id: <Your project id>
      preserve_hierarchy: 1
      files:
        - source: <Path of your original files>
          translation: <Path of your translated files>
      ```

    2. Get the correct configuration values:
        - **project_id**: In your Crowdin project, go to the Tools tab, select API, and find the **project_id** there.
        ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
        ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
        - **preserve_hierarchy**: Maintains the GitHub directory structure on the Crowdin server.
        - **source** and **translation**: Specify the paths for the files to upload to Crowdin and where the translated files should be output.   

          For an example, refer to the [**config file**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml).   
          Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).

6. Configure Crowdin to connect to your GitHub repo:
    1. Click `Add Repository` and select `Source and translation files mode`.
    ![select-integration-mode](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
    2. Connect your GitHub account and search for the repo you want to translate.
    ![search-repo](/img/localizationProgramGuideline/howItWorked/search-repo.png)
    3. Select the branch on the left to generate a new branch where Crowdin will post the translations.
    ![setting-branch](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
    4. Choose the frequency for updating translations to your GitHub branch, then click save to enable the integration.
    ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

Find more details in the [**GitHub integration documentation**](https://support.crowdin.com/github-integration/).

7. Finally, you can click the `Sync Now` button to sync the repo and translations whenever needed.

## Glossary

### What is a glossary?

Sometimes, AI translators can't recognize untranslatable and specific terms. For instance, we don't want "Rust" translated when referring to the programming language. To prevent such mistakes, we use a glossary to guide translations.

A **glossary** allows you to create, store, and manage project-specific terminology in one place, ensuring that terms are translated correctly and consistently.

You can reference our [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary).
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### How to set up a glossary for a new language?

Most translation platforms support glossaries. In Crowdin, after setting up a glossary, each term appears as an underlined word in the Editor. Hover over the term to see its translation, part of speech, and definition (if provided).
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

In DeepL, upload your glossary, which will be used automatically during AI translation.

We have created [**a program for glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) that auto-uploads updates.

To add a term to the glossary:
1. If the English term already exists in the glossary, find the corresponding line and column for the language you want to translate, input the translation, and upload it.
2. To upload a new glossary, clone the project and run:

```bash
npm i
```
```bash
npm run generate -- <glossary name you want>
```

Repeat step 1 to add the new term.

## How to take advantage of AI translation copilot?

AI translation copilot helps break down language barriers with several advantages:

- **Enhanced Consistency**: AI translations are based on up-to-date information, providing the most accurate and current translations.
- **Speed and Efficiency**: AI translation is instantaneous, handling large volumes of content in real-time.
- **Robust Scalability**: AI systems continuously learn and improve, enhancing translation quality over time. 

We use DeepL for AI translation in our Crowdin project:
1. Select Machine Translation in the Crowdin menu and click edit on the DeepL line.
![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. Enable DeepL support and input the DeepL Translator API key.
      > [How to get DeepL Translator API key](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. Our DeepL setup uses a customized glossary. Check [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) for details on uploading the glossary.

4. In the repo, click Pre-translation and select via Machine Translation.
![pre-translation](/img/localizationProgramGuideline/howItWorked/pre-translation.png)
5. Choose DeepL as the Translation Engine, select the target languages, and select the translated files.
![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

That's it! Now, you can take a break and wait for the pre-translation to complete.

<Feedback />




================================================
FILE: docs/v3/contribute/localization-program/how-to-contribute.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/localization-program/how-to-contribute.md
================================================
import Feedback from '@site/src/components/Feedback';

# How to contribute

This page explains how to participate in the localization program for TON documentation.

## Prerequisites

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. Log in to your [Crowdin](https://crowdin.com) account or sign up.
2. Select the language you want to contribute to.
3. Familiarize yourself with the [How to use crowdin](/v3/contribute/localization-program/how-to-contribute/) guide and the [Translation style guide](/v3/contribute/localization-program/translation-style-guide/) for tips and best practices.
4. Use machine translations to aid your work, but do not rely solely on them.
5. Preview all translation results on the website after proofreading.

:::info
Before contributing, read the guidelines below to ensure standardization and quality, speeding up the review process.
:::

## Side-by-side mode

All tasks are performed in **side-by-side** mode in the Crowdin Editor. To enable this, click a file you want to work on. At the top right of the page, click the **Editor view** button and select **side-by-side** mode for a clearer editor view.  
![side-by-side mode](/img/localizationProgramGuideline/side-by-side.png)

## Roles

Here are the **roles** you can assume in the system:

- **Language Coordinator** – Manages project features within assigned languages.
- **Developer** – Uploads files, edits translatable text, connects integrations and uses the API.
- **Proofreader** – Translates and approves strings.
- **Translator** (in-house or community) – Translates strings and votes on translations added by others.

The localization project is hosted on [Crowdin](https://crowdin.com/project/ton-docs).


### Language coordinator guidelines
- Translate and approve strings
- Pre-translate project content
- Manage project members and join requests
  ![manage-members](/img/localizationProgramGuideline/manage-members.png)
- Generate project reports
  ![generate-reports](/img/localizationProgramGuideline/generate-reports.png)
- Create tasks
  ![create-tasks](/img/localizationProgramGuideline/create-tasks.png)

### Developer guidelines
- **Update footer configuration for your language:**
  1. Fork our [repository](https://github.com/TownSquareXYZ/ton-docs/tree/i18n_feat).
  2. Locate the file [**`src/theme/Footer/config.ts`**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts).
  3. Copy the value of the variable **`FOOTER_COLUMN_LINKS_EN`** to **`FOOTER_COLUMN_LINKS_[YOUR_LANG]`**.
  4. Translate the values of the keys **`headerLangKey`** and **`langKey`** to your language, as we did for Mandarin in **`FOOTER_COLUMN_LINKS_CN`**.
  5. Add a new property to **`FOOTER_LINKS_TRANSLATIONS`**:
      - Set **the key** as your [**ISO language code**](https://www.andiamo.co.uk/resources/iso-language-codes/) (**two letters**, **lowercase**).
      - **The value** should be the new variable you created for your language.
  6. Run the command **`yarn start:local [YOUR_IOS_LANG_CODE]`** to preview the new footer in your language.   
        (e.g., **`yarn start:local ru`** for a preview of the **Russian** footer)
  7. If everything looks good, create a pull request to the **`i18n_feat`** branch.
- **Upload files**
- **Edit translatable text**
- **Connect integrations** (e.g., add GitHub integration)
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **Use the [Crowdin API](https://developer.crowdin.com/api/v2/)**

### Proofreader guidelines

As a **Proofreader**, you'll work on files with a **blue progress bar**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Click on a file to enter the editing interface.

#### Contribution flow

1. Make sure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Not Approved** translations to see strings needing proofreading.
![proofread filter](/img/localizationProgramGuideline/proofread-filter.png)

2. Follow these rules:
   - Select strings with a **blue cube icon**. Check each translation:
      - If **correct**, click the ☑️ button.
      - If **incorrect**, move to the next line.

![proofread approved](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review the approved lines:
  1. Filter by **Approved**.
  2. If an approved line has issues, click the ☑️ button to revert it to needing proofreading.
:::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Previewing your work
The preview website displays all approved content within one hour. Check [**our repo**](https://github.com/TownSquareXYZ/ton-docs/pulls) for the **preview** link in the newest PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator guidelines

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

Follow these steps for a successful translation process:

1. Select files that haven't reached 100% translation.
![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Ensure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Untranslated** strings.
![translator filter](/img/localizationProgramGuideline/translator-filter.png)

3. Your workspace has four parts:
   - **Top left:** Input your translation based on the source string.
   - **Bottom left:** Preview the translated file. Maintain the original format.
   - **Bottom right:** Suggested translations from Crowdin. Click to use, but verify for accuracy, especially with links.
  
4. Save your translation by clicking the **Save** button at the top.
![translator save](/img/localizationProgramGuideline/translator-save.png)

5. To move to the next file, click the file name at the top and select the new file from the pop-up window.
![to next](/img/localizationProgramGuideline/redirect-to-next.png)

## How to add support for a new language

If you are a community manager, follow these steps:

1. Add a new branch named `[lang]_localization` (e.g., `ko_localization` for Korean) on [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs).
2. **Contact the Vercel owner of this repo** to add the new language to the menu.
3. Create a PR request to the dev branch. **Do not merge to dev**; this is for preview purposes only.

Once you complete these steps, you can see the preview of your language in the PR request.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

When your language is ready for the TON docs, create an issue, and we'll set your language into the production environment.

<Feedback />




================================================
FILE: docs/v3/contribute/localization-program/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/localization-program/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Localization

The localization is a collaborative effort to translate various TON-related documents into multiple languages, making the website accessible to billions of non-English speakers worldwide.

## System design philosophy
![how it works](/img/localizationProgramGuideline/localization-program.png)

The localization process is fully maintained by [TownSquare Labs](https://github.com/TownSquareXYZ).

TownSquare is committed to creating an open infrastructure for multilingual community collaboration to advance TON to a better phase, which includes:

* **Suitable for multilingual communities**   
   The program supports multiple languages, ensuring inclusivity and ease of access for users from diverse linguistic backgrounds.

* **Automate development, integration, and deployment**  
   The program simplifies development, integration, and deployment through automation tools, reducing manual efforts and enhancing efficiency and consistency across localization efforts.

* **Separation of roles for developer, translator, and verifier**  
   Our approach divides the responsibilities of developers, translators, and verifiers, allowing each role to focus on their tasks and ensuring high-quality translations and seamless collaboration without role conflicts.

* **Incentives for community contributions**  
   We offer incentives for community members who contribute to localization efforts. This fosters active participation, rewards contributors, and promotes a sense of ownership and community engagement.

* **Advanced AI system integration**  
   AI systems improve translation accuracy and efficiency by offering intelligent suggestions and automating repetitive tasks, ensuring high-quality outcomes with reduced effort.

This project is designed to support speakers of multiple languages and serve the global developer ecosystem.

## Acknowledgments
We sincerely appreciate the thousands of community members integral to the Translation Program. We aim to acknowledge our translators and support their career growth. In the future, we plan to create leaderboards and a list of all contributors.

## Guides and resources
If you are participating in or considering joining the Translation Program, refer to the translation guides below:
* [Translation style guide](/v3/contribute/localization-program/translation-style-guide) – Instructions and tips for translators.
* [Crowdin online editor guide](https://support.crowdin.com/online-editor/) – An in-depth guide to using the Crowdin online editor and some of Crowdin's advanced features.


<Feedback />




================================================
FILE: docs/v3/contribute/localization-program/translation-style-guide.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/localization-program/translation-style-guide.md
================================================
import Feedback from '@site/src/components/Feedback';

# Translation style guide
This translation style guide contains essential guidelines, instructions, and tips for translators, helping us localize the website.

This document serves as a general guide and is not specific to any language.

## Capturing the essence of the message
When translating TON docs content, avoid literal translations.

The translations must capture the essence of the message. This approach means rephrasing specific phrases or using descriptive translations instead of translating the content word for word.

Different languages have different grammar rules, conventions, and word order. When translating, please be mindful of structuring sentences in the target languages, and avoid word-for-word translation of the English source, as this can lead to poor sentence structure and readability.

Instead of translating the source text word for word, you should read the entire sentence and adapt it to fit the conventions of the target language.

## Formal vs. informal
We use the formal form of address, which is always polite and appropriate for all visitors.

Using the formal address allows us to avoid sounding unofficial or offensive and works regardless of the reader’s age and gender.

Most Indo-European and Afro-Asiatic languages use gender-specific second-person personal pronouns, distinguishing between males and females. When addressing the user or using possessive pronouns, we can avoid assuming the reader’s gender, as the formal address is generally applicable and consistent, regardless of how they identify.

## Straightforward vocabulary and meaning
Our goal is to make content on the website understandable to as many people as possible.

In most cases, contributors can achieve this result by using short and simple words that are easily understandable. If multiple possible translations exist for a word in your language with the same meaning, the best option is often the shortest word reflecting the meaning.

## Writing system

All of the content should be translated using the correct writing system for your language and should not include any words written using Latin characters.

When translating the content, you should ensure that the translations are consistent and do not include any Latin characters.

**Do not translate proper names defined by glossary**

## Translating page metadata
Some pages contain metadata, such as 'title', 'lang', 'description', 'sidebar', etc.

When uploading new pages to Crowdin, we hide content that translators should never translate. This feature makes visible to translators in Crowdin only the text that should be translated.

Please be especially careful when translating strings where the source text is 'en'. This represents the language page, which is available and should be translated to the [ISO language code for your language](https://www.andiamo.co.uk/resources/iso-language-codes/). These strings should always be translated using Latin characters, not the writing script, native to the target language.

Some examples of language codes for the most widely spoken languages:

* English - en
* Chinese Simplified - zh-CN
* Russian - ru
* Korean - ko
* Polish - pl
* Ukrainian - uk

## Titles of external articles
Some strings contain titles of external articles. Most of our developer documentation pages contain links to external articles for further reading. The strings containing article titles need to be translated, regardless of the article's language, to ensure a more consistent user experience for visitors viewing the page in their language.

## Crowdin warnings
Crowdin has a built-in feature that warns translators when they are about to make a mistake. Crowdin will automatically alert you before saving your translation if you forget to include a tag from the source, translate elements that should not be translated, add several consecutive spaces, forget end punctuation, etc. If you see a warning like this, please double-check the suggested translation.

:::warning
Never ignore these warnings, as they usually mean something is wrong or the translation lacks a key part of the source text.
:::

## Short vs. complete forms and abbreviations
The website uses many abbreviations, such as apps, DApps, NFT, DAO, DeFi, etc. These abbreviations are standard in English, and most visitors are familiar with them.

Since they usually don’t have established translations in other languages, the best approach to these and similar terms is to provide a descriptive translation of the entire form and add the English abbreviation in brackets.

Do not translate these abbreviations since most people are unfamiliar with them, and the localized versions would not make much sense to most visitors.

Example of how to translate DApps:

* Decentralized applications (DApps) → Translated in complete form (English abbreviation in brackets)

## Terms without established translations
Some terms might not have established translations in other languages but are widely known by their original English names. Such terms include newer concepts, like proof-of-work, proof-of-stake, Beacon Chain, staking, etc.

While translating these terms can sound unnatural, since the English version is a basis for other languages, it is highly recommended that they be translated.

Feel free to get creative, use descriptive translations, or translate them literally.

Most terms should be translated instead of leaving some in English, as this new terminology will become more widespread as more people start using TON and related technologies. To onboard more people to TON, we must provide understandable terminology in as many languages as possible, even if we need to create it ourselves.

## Buttons & CTAs
Do not translate the website's contents, such as buttons.

You may identify button text by viewing the context screenshots connected with most strings or by checking the context in the editor, which includes the phrase ‘’button’’.

Button translations should be as short as possible to prevent formatting mismatches. Additionally, button translations, i.e., presenting a command or request, should be imperative.

## Translating for inclusivity
TON docs visitors come from all over the world and from different backgrounds. Therefore, the language on the website should be neutral, welcoming to everyone, and not exclusive.

Gender neutrality is an essential aspect of this. Use the formal address form and avoid gender-specific words in the translations.

Another form of inclusivity is trying to translate for a global audience, not specific to any country, race, or region.

Finally, the language should be suitable for all audiences and ages.

## Language-specific translations
When translating, it is crucial to follow the grammar rules, conventions, and formatting used in your language instead of copying from the source. The source text follows English grammar rules and conventions, which do not apply to many other languages.

You should be aware of the rules for your language and translate accordingly. If you need help, contact us; we will help you with resources on translating elements for your language.

Some examples of what to be particularly mindful of:

### Punctuation, formatting

#### Capitalization

* There are vast differences in capitalization in different languages.
* In English, it is common to capitalize all words in titles and names, months and days, language names, holidays, etc. In many other languages, this is grammatically incorrect, as they have different capitalization rules.
* Some languages also have rules about capitalizing personal pronouns, nouns, and adjectives that you shouldn't capitalize in English.

#### Spacing

* Orthography rules define the use of spaces for each language. Because spaces are used everywhere, these rules are some of the most distinct, and spaces are some of the most mistranslated elements.
* Some common differences in spacing between English and other languages:
  * Space before units of measure and currencies. Example: USD, EUR, kB, MB
  * Space before degree signs. Example: °C, ℉
  * Space before some punctuation marks, especially the ellipsis. Example: Then… in summary
  * Space before and after slashes. Example: if / else

#### Lists

* Every language has a diverse and complex set of rules for writing lists. These can be significantly different from English.
* In some languages, the first word of each new line needs to be capitalized, while in others, new lines should start with lowercase letters. Many languages also have different rules about capitalization in lists, depending on the length of each line.
* The same applies to the punctuation of line items. The end punctuation in lists can be a period (.), comma (,), or semicolon (;), depending on the language.

#### Quotation marks

* Languages use many different quotation marks. Simply copying the English quotation marks from the source is often incorrect.
* Some of the most common types of quotation marks include:
  * „example text“
  * ‚example text’
  * »example text«
  * “example text”
  * ‘example text’
  * «example text»

#### Hyphens and dashes

* In English, a hyphen `-` is used to join words or different parts of a word, while a dash `—` indicates a range or a pause.
    * Example: TON — is ... proof-of-stake.
* Many languages have different rules for using hyphens and dashes that should be observed.


### Formats
#### Numbers

* The main difference in writing numbers in different languages is the separator for decimals and thousands. For thousands, this can be a period, comma, or space. Similarly, some languages use a decimal point, while others use a decimal comma.
  * Example:
    * English – **1,000.50**
    * Spanish – **1.000,50**
    * French – **1 000,50**
* The percent sign is another critical consideration when translating numbers. Write numbers in the typical format for the corresponding language.
  * Example: **100%**, **100 %**, or **%100**.
* Finally, negative numbers can be displayed differently, depending on the language
  * Example: -100, 100-, (100) or [100].

#### Dates

* When translating dates, there are several considerations and differences based on the language. These include the date format, separator, capitalization, and leading zeros. There are also differences between full-length and numerical dates.
  * Some examples of different date formats:
    * English UK (dd/mm/yyyy) – 1st January, 2022
    * English US (mm/dd/yyyy) – January 1st, 2022
    * Chinese (yyyy-mm-dd) – 2022 年 1 月 1 日
    * French (dd/mm/yyyy) – 1er janvier 2022
    * Italian (dd/mm/yyyy) – 1º gennaio 2022
    * German (dd/mm/yyyy) – 1. Januar 2022

#### Currencies

* Translating currencies can be challenging due to the different formats, conventions, and conversions. As a general rule, please keep currencies the same as the source. You can add your local currency and conversion in brackets for the reader's benefit.
* The main differences in writing currencies in different languages include symbol placement, decimal commas vs. decimal points, spacing, and abbreviations vs. symbols.
  * Symbol placement: $100 or 100$
  * Decimal commas vs. decimal points: 100,50$ or 100.50$
  * Spacing: 100$ or 100 $
  * Abbreviations vs. symbols: 100 $ or 100 USD

#### Units of measure

* As a general rule, please keep the units of measure as per the source. You can include the conversion in brackets if your country uses a different system.
* Aside from the localization of units of measure, it is also important to note the differences in how languages approach these units. The main difference is the spacing between the number and unit, which can differ based on the language. Examples of this include 100kB vs. 100 kB or 50ºF vs. 50 ºF.

## Conclusion

When translating, try not to rush. Take it easy and have fun!

Thank you for helping us localize the website and make it accessible to a wider audience. The TON community is global, and we are happy you are a part of it!

<Feedback />




================================================
FILE: docs/v3/contribute/maintainers.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/maintainers.md
================================================
import Feedback from '@site/src/components/Feedback';

# Maintainers

## Active team

Below is an alphabetical list of the current members of the TON documentation team.

### Alex Golev

Onboarding Lead at TON Studio

-   Telegram: [@alexgton](https://t.me/alexgton)
-   GitHub: [Reveloper](https://github.com/Reveloper)

## Acknowledgements

TON documentation was created by [tolya-yanot](https://github.com/tolya-yanot) and [EmelyanenkoK](https://github.com/EmelyanenkoK).

Over time, TON documentation has benefitted from the intellect and dedication of [numerous external contributors](https://github.com/ton-community/ton-docs/graphs/contributors). We extend our heartfelt gratitude to each of them.

However, we would like to acknowledge the substantial contributions made by the following individuals especially. Their respective contributions have greatly enriched the quality and depth of our documentation:

-   [akifoq](https://github.com/akifoq): early contributions
-   [amnch1](https://github.com/amnch1): fixes
-   [aSpite](https://github.com/aSpite): content
-   [awesome-doge](https://github.com/awesome-doge): early contributions
-   [coalus](https://github.com/coalus): content
-   [delovoyhomie](https://github.com/delovoyhomie): content
-   [Gusarich](https://github.com/Gusarich): content
-   [krau5](https://github.com/krau5): improvements
-   [LevZed](https://github.com/LevZed): content
-   [ProgramCrafter](https://github.com/ProgramCrafter): content
-   [siandreev](https://github.com/siandreev): content
-   [SpyCheese](https://github.com/SpyCheese): early contributions
-   [SwiftAdviser](https://github.com/SwiftAdviser): content, user-friendly docs inventor
-   [Tal Kol](https://github.com/talkol): early contributions
-   [TrueCarry](https://github.com/TrueCarry): content
-   [xssnick](https://github.com/xssnick): content

We sincerely appreciate each contributor who has helped make TON documentation a rich and reliable resource.

## See also

- [How to contribute](/v3/contribute/)
- [Content standardization](/v3/contribute/content-standardization/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)

<Feedback />




================================================
FILE: docs/v3/contribute/participate.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/participate.md
================================================
import Feedback from '@site/src/components/Feedback';


# Contribution Guide

:::danger
This page is outdated and will be deleted soon.
See the [How to contribute](/v3/contribute/).
:::

Here is a step-by-step guide of contributing to TON Documentation with Tutorials.

:::tip opportunity
You're lucky! It's a good opportunity to improve TON Ecosystem here.
:::

If you decide to write tutorial, you can get some reward for outstanding materials:
- **Special TON Bounty NFT** for the most valuable contributing to TON
- **Reward in TON** as payment for approved high-quality contribution like tutorial

Let's see how you can participate in contributing process.

## Decide what you want to write

Find or write a material which you want to describe.
1. Check a [list of issues on TON Docs GitHub](https://github.com/ton-community/ton-docs/issues) with `tutorial` label.
2. _OR_ write your own idea on TON Docs GitHub with [tutorial template](https://github.com/ton-community/ton-docs/issues/new?assignees=&labels=feature+%3Asparkles%3A%2Ccontent+%3Afountain_pen%3A&template=suggest_tutorial.yaml&title=Suggest+a+tutorial).

## Describe a problem to get a reward

Write a _ton-footstep_ to receive a funding for your contributing.
1. Read about [TON Bounties](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md) program more detailed.
    1. **TLDR:** Use [Improve TVM Instructions article](https://github.com/ton-society/grants-and-bounties/issues/361) as an example.
2. Write [your own bounty](https://github.com/ton-society/grants-and-bounties/issues/new/choose) to participate and wait for approve. [TON Bounties Creator Bot](https://t.me/footsteps_helper_bot) will help you.
3. After received `approved` label start to write your tutorial.

## Writing a tutorial

**Preparations**. Minimize future amount of requested changes, _save your time_:
1. Follow [Tutorial Guidelines](/v3/contribute/contribution-rules) and check them with [Sample Tutorial Structure](/v3/contribute/tutorials/sample-tutorial)
2. Read [Principles of a Good Tutorial](/v3/contribute/tutorials/principles-of-a-good-tutorial) to write amazing tutorial :)
3. Inspire with [Mint your first Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token) example in sources.
4. **Setup environment**. [Check the tutorial](/v3/contribute#online-one-click-contribution-setup) running your fork locally or using Gitpod.
5. **Write tutorial**. Using the environment, see how tutorial looks like on your fork.
6. **Make a Pull Request**. Open PR to get some feedback from maintainers.
7. Get merged!

## Receiving a reward

1. After your PR in TON Docs got merged, please write in your ton-footsteps task.
2. Follow a guide [How to complete ton-bounty?](https://github.com/ton-society/grants-and-bounties/blob/main/bounties/BOUNTIES_PROGRAM_GUIDELINES.md#got-assigned-submit-a-questbook-proposal) to complete bounty and get reward.
3. In your task, you will be asked for a wallet to send a reward.
4. Get rewarded!

<Feedback />




================================================
FILE: docs/v3/contribute/style-guide.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/style-guide.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Documentation style guide

## Introduction

This guideline aims to help you define your audience, which will influence your content’s style and placement.

## Audience

TON Documentation (**docs.ton.org**) is a resource developed for three key audiences.

[**Concepts**](/v3/concepts/dive-into-ton/introduction/) for **individuals:** 
Whether readers are new app users, investors, or blockchain enthusiasts, they’ll find answers to their questions about TON’s credibility, wallet capability, community engagement, and technical roadmap. Concepts simplify complex abstractions so that readers can dive in with confidence.

[**Guidelines**](/v3/guidelines/get-started-with-ton/) for **external developers:** 
Readers can learn how to run nodes, set up sample projects quickly, and integrate their projects with TON—all presented in straightforward, step-by-step guidelines. For developers with little or no background in blockchain, this content offers a practical introduction to the TON tech stack. 

[**Documentation**](/v3/documentation/ton-documentation/) for **TON developers:**
The documentation section focuses on enhancing developer experiences through deep, detailed documentation. Here technical experts can find best practices and technical insights for developing industrial-grade smart contracts and global market applications. It is also a manual for those planning to improve blockchain software and upgrade TON protocols. 


### Concepts for individuals
  App users, investors, enthusiasts, or anyone new to blockchain and TON

  **Example individuals journeys:**

  - “I want to explore TON’s credibility and, after answering some basic questions, try using it.”
  - “I know I need a TON wallet, and I want to learn how it works.”
  - “I want to get a sense of activity in the TON community, to decide if it’s active enough, so I can get help if needed.”
  - “I’m excited about TON and want to get involved, but I don’t know what to do next.”
  - “I want to learn about TON’s technical roadmap.”


### Guidelines for external developers

  **Example external developer journeys**:

  - “I’m a developer, but I have no background in crypto and want to understand the TON tech stack.”
  - “I want to learn how to run a TON node.”
  - “I want to get a sample TON project up and running fast to get a sense of how difficult or easy it is to build a real project on TON.”
  - “I’ve started working on integrating my project to TON and want to figure out how to do this best.”


### Documentation for TON developers

  **Example TON developer journeys**:

  - “I want to develop industrial smart contracts for TON Ecosystem according to best practice and specifications.”
  - “I want to participate in developing TON blockchain software.”
  - “I want to upgrade TON protocols to enhance the user experience.”
  - “I want to upgrade TON specification to enhance the developer experience.”


## Style best practices

This section describes best practices for concepts, guidelines, and documentation sections. Concepts and guidelines share a similar approach.

### Concepts and guidelines

These are shared content issues for readers of concepts and guidelines.

#### Common content issues:

- Overflowing with specific technical terms
- Content inconsistency across pages
- Articles are hard to digest due to
- Content is too abstract and detached from reality
- Too much text per page and paragraph
- Usage of complex sentences
- Too many links can overload readers, causing them to abandon the website

Make content suitable for its audience with the following rules.

#### Concepts and guidelines best practice 

- Focus on the advantages for the user instead of explaining technical details about the system
- Use active voice and clear, concise sentences that are easy to follow
- Break up longer chunks of text into smaller sections or paragraphs
- Consider using tables, bullet points, or numbered lists instead of paragraphs
- Highlight (bold) key phrases to support scanning and skimming through the article
- Limit the length of the article up to 2000 words
- Reduce the number of hyperlinks to approximately 10 per 2000 words
- Operate with a mindset that people just started curious about blockchain technology
- Users want to understand how the topic relates to them and how they can take part in it rather than going deep into the theory

### Documentation style

For documentation readers, these are a list of typical content issues.

#### Documentation issues

- Inconsistencies across documentation
- Different, unclear, and contradictory language and terminology
- Long sentences written in passive voice
- Outdated information
- Only code provided, without explanation and documentation

Make content documentation great for its audience with the following rules.

#### Documentation best practice
- Provide updates on the change documentation as soon as possible.
- Provide in-depth, clear explanations of all system components and processes.
- Use diagrams, examples, and highlighted key points to support the text.
- Structure content to combine thorough, on-page detail with strategic cross-references, maintaining ease of navigation without overwhelming a single page.
- Keep content unified according to contribution guides.
- Use active voice to craft clear, direct sentences for complex abstractions.
- Break long sentences into shorter, simpler ones to improve readability.


### Content ideas

#### All section
- Provide visual aids to explain the topic better
- Provide style updates and proofread

#### Concepts
- Use examples or real-life scenarios of the application of the technology to help illustrate complex concepts or ideas
- Explain how the idea can positively affect people now or in the future

#### Guidelines
- Add step-by-step how to take action
- Include relevant statistics or graphs to strengthen the arguments
- Add calls to action

#### Documentation
- Update or improve existing documentation.
- Add comprehensive new documentation about the TON Entity: node, oracle, smart contract, or TVM under the hood.


### Objectivity

TON Documentation aims to serve as a credible, neutral source of truth that informs readers about TON Ecosystem, its technology, and development. The following are examples of content that won't be accepted:

**Grand, unverifiable claims about TON or adjacent technologies**
    - Example: _"You should buy TON for giveaways..."_

**Hostile or confrontational language aimed at any organization or person**
    - Example: _"Company X is bad because they are centralized!"_

**Politically charged rhetoric**
    - Example: _"This political party is better for decentralization because..."_

:::warning
Any proposed content that does not align with the platform's objectives will be rejected without additional explanation. Spam and inappropriate behavior in comments will result in a ban.
:::

### Consistency

Learn the following guides in detail, and keep content consistent.

- [Content standardization](/v3/contribute/content-standardization/) - Learn how to organize content, add an image, attribute, etc, correctly.
- [Typography](/v3/contribute/typography/) - Learn the best practice on plain text and headers.

## See also

- [How to contribute](/v3/contribute/)
- [Content standardization](/v3/contribute/content-standardization/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)

<Feedback />




================================================
FILE: docs/v3/contribute/tutorials/guidelines.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/tutorials/guidelines.md
================================================
import Feedback from '@site/src/components/Feedback';

# Tutorial Styling Guidelines

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

So you've decided to write a tutorial for TON Documentation?

We're excited to have you among our contributors! Please review the guidelines below to make sure your tutorial follows the style and quality of the pre-existing content on TON Docs.

It is important that you take some time to become familiar with the tutorial structure and how headings should be used. Please read through some of our pre-existing tutorials and also have a look at [previous Pull Requests](https://github.com/ton-community/ton-docs/pulls?q=is%3Apr+is%3Aclosed) before submitting your own.

## Process

:::info IMPORTANT
Before you start writing, *read the guidelines below*! They will help you ensure the level of standardization and quality that will make the review process much faster.
:::

Also, be sure to refer to the [**sample tutorial structure**](/v3/contribute/tutorials/sample-tutorial) we have provided.


1. To begin, fork and then clone the [ton-docs](https://github.com/ton-community/ton-docs/) repository on GitHub and create a new branch in your local repository.
2. Write your tutorial keeping quality and readability in mind! Have a look at the existing tutorials to see what you should aim for.
3. When you're ready to submit it for review, [open a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) from your branch. We will be notified, and the review process will begin:
    1. **Please make every effort to submit only the final draft of your tutorial**. Some typos and grammar fixes are acceptable, but if there are significant changes to be made before we can publish the tutorial, it will take much longer to review and have you make the necessary changes.
4. Once we've reviewed your submission and you've made all necessary changes, we'll merge the Pull Request and publish the tutorial on TON Documentation. We'll contact you shortly after this to arrange your payment!
5. Once it is published, remember to **promote** your tutorial on social media! The [documentation maintainers](/v3/contribute/maintainers) can help to amplify this promotion as long as you cooperate with us.

To summarize, the workflow is as follows:  
1. ***Fork and Clone*** the **`ton-docs`** repository
2. ***Write and polish*** your tutorial
3. ***Submit a Pull Request*** for review
4. ***Make any necessary changes***
5. The tutorial is ***merged and published***
6. ***Promote your tutorial*** on social media!


## Context

The primary issue with adding "THE" before "TON" is that during the development of TON documentation and editorial policy, various departments such as marketing, vendors, and developers joined the discussion to capitalize words such as "Blockchain," "Ecosystem," and others in conjunction with "TON" to create a strong image of a single system, network, and brand. After lengthy discussions, we concluded that for a strong brand image, we should create a glossary of words and phrases that can be written without "THE" and capitalized. If it can be capitalized, the article is unnecessary. Currently, there are two such word combinations: TON Blockchain and TON Ecosystem.

For other TON module names such as TON Connect, TON SDK, TON Grants, etc., it depends on the context. We apply the capitalization rule but are flexible with the article rule. If the component name stands alone, it is better without the article. However, if it is combined with a common noun, such as the TON Connect protocol, the article is needed because it refers to the entity protocol.

Regarding other word combinations like "TON + noun" (e.g., "the TON world," "the TON community," etc.), we do not restrict the use of the article because we naturally expect to see the article in combination with a noun.

## General tips

- **Do not copy and paste pre-existing content**. Plagiarism is a serious issue and will not be tolerated. If the tutorial is inspired by some existing content, reference it and link to it. When linking to other tutorials/resources, use TON Docs resources if possible.
- **Include any walkthrough videos or video content** in the PR by uploading it to Google Drive.
- **Account funding from faucets must be clearly explained**, including which account is being funded, from where, and why. Do not assume learners can accomplish this task on their own!
- **Display sample outputs** in the form of Terminal snippets or screenshots to help learners understand what to expect. Trim long outputs.
- **Take an error-driven approach** where you bump into errors on purpose to teach learners how to debug them. For example, if you need to fund an account to be able to deploy a contract, first try and deploy without funding, observe the error that is returned, then fix the error (by funding the account) and try again.
- **Add potential errors and troubleshooting.** Of course, the tutorial shouldn't list every possible error, but it should make an effort to catch the important or most common ones.
- **Use React or Vue** for the client-side.
- **Before making the PR, run the code by yourself first** to avoid any obvious errors and make sure it works as expected.
- **Avoid including external/cross-links** to different sources between tutorials. If your tutorial is longer, we can discuss how to turn it into a longer course or Pathway.
- **Provide** **pictures or screenshots** to illustrate the complicated processes where needed.
- Upload your images to the `static` directory of the learn-tutorials repository — **DO NOT** use hotlinks to external sites, as this can result in broken images.
- **Image links must** **be in markdown format** and you must **ONLY** use the raw GitHub URL of the static directory in the repository: `![name of your image](https://raw.githubusercontent.com/ton-community/ton-docs/main/static/img/tutorials/<your image filename>.png?raw=true)`
    - Remember to add `?raw=true` at the end of the URL.

## How to structure your tutorial

:::info Sample tutorial structure
Feel free to check out the [sample tutorial structure](/v3/contribute/tutorials/sample-tutorial) to see it with your own eyes.
:::

- The **Title** should be direct and clear, summarizing the tutorial's goal. Do not add the tutorial title as a heading inside the document; instead, use the markdown document filename. 
  - *For example*: If your tutorial was titled "_Step by step guide for writing your first smart contract in FunC_," the filename should be:  
  `step-by-step-guide-for-writing-your-first-smart-contract-in-func.md`
- Include an **Introduction** section explaining *why* this tutorial matters and what the context of the tutorial is. Don't assume that it is obvious.
- Include a **Prerequisites** section explaining any *prior knowledge* required or any existing tutorials that need to be completed first, any tokens that are needed, etc.
- Include a **Requirements** section explaining any *technologies that must be installed* **prior** to starting the tutorial and that the tutorial will not cover, such as the TON Wallet extension, Node.js, etc. Do not list packages that will be installed during the tutorial.
- Use **subheadings** (H2: ##) to break down your explanations within the body of the tutorial. Keep the Table of Contents in mind when using subheadings, and try to keep them on point.
    - If the content below a subheading is short (for example, only a single paragraph and a code block), consider using bold text instead of a subheading.
- Include a **Conclusion** section that summarizes what was learned, reinforces key points, and also congratulates the learner for completing the tutorial.
- (***Optional***) Include a **What's Next** section pointing to good follow-up tutorials or other resources (projects, articles, etc.).
- (***Optional***) Include an **About The** **Author** section at the end. Your bio should include a link to your GitHub profile (which will have your name, website, etc.) and a link to your Telegram profile (so that users can contact/tag you for help and questions).
- A **References** section **must** be present if you have taken any help in writing this tutorial from other documents, GitHub repos, or other tutorials. Credit sources by adding their name and a link to the document when possible (if it is not a digital document, include an ISBN or other means of reference).

## Style Guide

- **Writing Tone -** Tutorials are written by community contributors for their peers. 
  - Given this, we recommend creating a tone of inclusion and interaction throughout the tutorial. Use words such as “we”, “us”, “our”.
    - _For example_: "We have successfully deployed our contract."
  - When providing direct instructions, feel free to use “you”, “your”, etc.
    - _For example_: “*Your file should look like this:*”.
- **Use Markdown properly** throughout your tutorial. Refer to [GitHub's markdown guide](https://guides.github.com/features/mastering-markdown/) as well as the [sample tutorial structure](/v3/contribute/tutorials/sample-tutorial).
- **Do not use pre-formatted text for emphasis**, *for example*:
    - ❌ "TON counter `smart contract` named `counter.fc`" is incorrect.
    - ✅ "TON counter **smart contract** named `counter.fc`" is correct.
- **Do not use any markdown formatting in a section heading**, *for example*:
    - ❌ # **Introduction** is incorrect.
    - ✅ # Introduction is correct.
- **Explain your code!** Don't just ask learners to blindly copy and paste.
    - Function names, variables, and constants **must** be consistent across the entire document.
    - Use a comment at the beginning of a code block to show the path and filename where the code exists. *For example*:

        ```jsx
        // test-application/src/filename.jsx
        
        import { useEffect, useState } from 'react';
        
        ...
        ```

- **Select the appropriate language** for code block syntax highlighting!
    - All code blocks *must* have syntax highlighting. Use **```text** if you are not sure what kind of syntax highlighting to apply.
- **Do not use code block syntax for pre-formatted text,** *for example*:
    - ❌ \```filename.jsx\``` is incorrect.
    - ✅ \`filename.jsx\` is correct.
- **Your code blocks should be well commented**. Comments should be short (usually two or three lines at a time) and effective. If you need more space to explain a piece of code, do it outside of the code block.
- **Remember to leave a blank line** before and after all code blocks.  
  *For example*:

```jsx  
  
// test-application/src/filename.jsx  
  
import { useEffect, useState } from 'react';
  
```  

  
- **Use a linter & prettifier** before pasting your code into the code blocks. We recommend `eslint` for JavaScript/React. Use `prettier` for code formatting.
- **Avoid the overuse of bullet points**, numbered lists, or complicated text formatting. The use of **bold** or *italic* emphasis is allowed but should be kept to a minimum.

# **App setup**

- Web3 projects will typically include several existing code libraries. Be sure to account for this when writing your tutorial. Where possible, provide a GitHub repository as a starting point to make it easier for learners to get started.
- If you are *not* using a GitHub repo to contain the code used in your tutorial, remember to explain to readers how to create a folder to keep the code organized. 
*For example*: `mkdir example && cd example`
- If you use `npm init` to initialize a project directory, explain the prompts or use the `-y` flag.
- If you use `npm install` use the `-save` flag.

<Feedback />




================================================
FILE: docs/v3/contribute/tutorials/principles-of-a-good-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/tutorials/principles-of-a-good-tutorial.md
================================================
import Feedback from '@site/src/components/Feedback';

# Principles of a good tutorial

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

Original comment with these principles by [talkol](https://github.com/talkol):

 - [Original comment on TON Footstep #7](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

Here is a summary of these points for new contributors.

## Principles

1. The full flow should run on the user's client. There shouldn't be any third-party services involved. You need to do everything so that the user can simply clone the repository and immediately run it.

2. The README should be VERY detailed. Do not assume the users know anything. If the tutorial requires it, it should also explain how to install the FunC compiler or Lite-client on your device. You can copy these parts from other tutorials in this documentation.

3. It would be good if the repository included the whole source code for the contracts used, so that users could make minor changes to the standard code. For example, the Jetton smart contract allows users to experiment with custom behavior.

4. If it is possible, create a user-friendly interface that will allow users to deploy or run the project without having to download the code or configure anything. Notice that this should still be standalone and served from GitHub Pages to run 100% client-side on the user's device. Example: https://minter.ton.org/

5. Explain to users what every field choice means and explain best practices.

6. Explain everything there is to know about security. You must explain enough that creators do not make mistakes and create dangerous smart contracts/bots/websites—you are teaching them the best security practices.

7. Ideally, the repository should include well-written tests that show the reader how to best implement them in the context of your tutorial.

8. The repository should have its own easy-to-understand compilation/deployment scripts. A user should be able to just `npm install` and use them.

9. Sometimes a GitHub repository is enough and there is no need to write a full article. Just a README with all the code you need in the repository. In this case, the code should be well-commented so that the user can easily read and understand it.
<Feedback />




================================================
FILE: docs/v3/contribute/tutorials/sample-tutorial.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/tutorials/sample-tutorial.md
================================================
import Feedback from '@site/src/components/Feedback';

# Sample tutorial structure 

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

## Introduction

The Introduction heading **must** be H2: `## Introduction`

This section is for you to explain the context of this tutorial and why it is important, what we're going to build and learn in this tutorial.

- Explain this section like you're explaining it to a 5-year-old (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**)
- Explain everything in 5–6 lines maximum.

*For example:*

>A smart contract is just a computer program that runs on TON Blockchain, or more specifically on its [TVM](/v3/documentation/tvm/tvm-overview) (_TON Virtual Machine_). The contract is made of code (_compiled TVM instructions_) and data (_persistent state_) that are stored at some address on TON.

## Prerequisites

The Prerequisites heading **must** be H2: `## Prerequisites`

This section is for you to explain any prior knowledge needed or any existing tutorials that need to be completed first. Any tokens that are needed—mention them here.

*For example:*

>In this tutorial, we're going to mint Jetton on testnet. Before we continue, make sure that your [testnet](/v3/documentation/smart-contracts/getting-started/testnet) wallet has sufficient balance. 

## Requirements

The Requirements heading **must** be H2: `## Requirements`

**OPTIONAL :** Embed any video content in this section if your tutorial has any.

Any technology that needs to be installed **prior** to starting the tutorial and that the tutorial will not cover (`TON Wallet Extension`, `node`, etc.). Do not list packages that will be installed during the tutorial.

*For example:*

- We'll need the TON Wallet extension in this tutorial; install it from [HERE](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).
- Make sure to have NodeJS 12.0.1+ installed.

## Body of the Tutorial

- Please do not use "Body of the Tutorial" as a heading, use your own heading that is relevant to the material.
  - "Getting started" is acceptable if you can't think of anything else 😉
- Add any text content necessary to guide readers through your tutorial, and ***remember to proofread your content*** for spelling and grammar before you submit your tutorial.
  - [Grammarly](http://grammarly.com) is a good free program that can help you avoid grammar mistakes.

### Key points

- Do not use "Body of the Tutorial" as a heading!
- **Keep all subheadings at H3,** don't go for H4 or any lower.
    - In Markdown syntax, two hashmarks are used for H2 headings: ##
    - Three hashmarks are used for H3 headings: ###
- Add only necessary comments to code blocks. ***Do not*** add # style comments to terminal input code blocks.
- Add all relevant code blocks:
    - Markdown syntax for code blocks consists of three backticks at the beginning and end of the code block.  Also, make sure that there is a newline before and after the backticks in all code blocks. *For example*:
        - 
        \```js  
        const testVariable = 'some string';  
        someFunctionCall();  
        \```  
        
    - ALL code blocks ***must*** have a syntax highlight type. Use ```text if you are not sure.
    - \```text must be used for terminal output, terminal commands, and plaintext.
    - \```javascript *or* ```js can be used for any JavaScript code.
    - \```typescript or ```ts can be used for any TypeScript code.
    - \```jsx is for ReactJS code.
    - \```cpp is for Func code.
    - Use \```graphql when highlighting GraphQL syntax.
    - Use \```json when highlighting valid JSON. (For invalid JSON examples use \```text instead.)
    - \```bash should *only* be used in code blocks where you need to have # style comments. This must be done carefully because in many situations the # character will render as a markdown heading. Typically, the Table of Contents will be affected if this occurs.
- Do not use `pre-formatted text` for emphasis; instead, use only **bold** or *italic* text.
- Add images or code blocks to reflect the expected terminal output.

- Take an error-driven approach when writing your tutorial. Add common errors and troubleshooting steps. *For example:*

> **Unable to connect to Testnet due to an error when executing the
> `node deploy:testnet` command.** 
>
> Let's look at some common causes:
>  
* Make sure you have enough funds in your generated testnet wallet in `.env`. If not, please add some testnet coins from the faucet giver. 
* If you're still experiencing the same issue, reach out to the devs in the [Dev Chat](https://t.me/TonDev_eng/) for help.
>

## Conclusion

The Conclusion heading **must** be H2: `## Conclusion`

This section should summarize what was learned in the tutorial, reinforce key points, and congratulate the learner on completing the tutorial. Use a maximum of 5–6 lines.
*For example*:

> We created a simple new FunC contract with counter functionality. We then built and deployed it on-chain, and finally interacted with it by calling a getter and sending a message.


Please remember that this code is not meant for production; there are still a few other things to consider if you wanted to deploy this to mainnet, such as disabling the transfer method if the token is listed on the market, and so on.
>

## See Also

The Next Steps heading **must** be H2: `## See Also`

Use this section to explain what can be done next after this tutorial to continue learning.
Feel free to add recommended projects and articles relating to this tutorial.
If you're working on any other advanced tutorials, you can briefly mention them here.
Typically, only related pages from docs.ton.org are placed here.

## About the Author *(Optional)*

The About the Author heading **must** be H2: `## About the Author`

Keep it short. One or two lines at most. You can include a link to your GitHub profile + Telegram profile. Please refrain from adding your LinkedIn or Twitter here.

## References *(Optional)*

The References heading **must** be H2: `## References`

This section ***must*** be present if you have taken any help in writing this tutorial from other documents, GitHub repos or pre-existing tutorials.

Credit sources by adding their name and a link to the document when possible.

If it is not a digital document, include an ISBN or other form of reference.
<Feedback />




================================================
FILE: docs/v3/contribute/typography.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/contribute/typography.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# Typography

## Introduction
This standard ensures a consistent and professional style across TON documentation. 

Following these guidelines, you help maintain clarity, enhance readability, and support easy navigation in the documentation site and any associated menus.

---

## File names
- **Naming convention:** Use **kebab-case** - all lowercase, words separated by hyphens.
- **Example:** `kebab-case-file-name.md`
- **Purpose:** Kebab-case is SEO-friendly, easy to read, and helps avoid naming conflicts or issues in case-sensitive file systems.

---

## Documents typography

### General text style
- Write concise, clear sentences.
- Use simple, direct language suitable for both new and experienced users.
- Avoid overly complex structures; aim for clarity and brevity.
- Avoid excessive use of bold or italic styles.
- All graphic elements containing text should use the [Inter](https://rsms.me/inter/) or a similarly compatible font.


### Acronyms

When introducing an unfamiliar acronym, spell the entire term and put the abbreviation in parentheses. Put both the full term and acronym in bold.

**Example:**

**The Open Network (TON)** is a decentralized and open internet platform...

### Headers

#### Header hierarchy:
1. **H1 (`#`)** – Document title
2. **H2 (`##`)** – Major sections
3. **H3 (`###`)** – Subsections under H2
4. **H4 (`####`)** and below – Use sparingly for finer detail

#### Header capitalization style:
- **H1, H2, H3 and H4:** **Sentence case**
  - Example: `# This sentence is in sentence case`
  - Example: `## This sentence is in sentence case`
  - Example: `### This sentence is in sentence case`
  - Example: `### This sentence is in sentence case`


- **Exception**: **Special terms**.
Despite the overall _sentence case_ rule,
  certain words or phrases—key concepts or defined terms within the documentation—must always be formatted
  using the title case.
  - Example: `## Use American English`
  - Example: `# Run the TON Center service`

#### Header consistency:
- Avoid repeating the exact words in consecutive headers.

#### Header formatting:

Use plain text for all headers.
Avoid using any formatting styles in headings:

- No code formatting `backticks` (``)
- No bold **text**
- No italics *text*
- No quotation marks (“ ” or " ")
- No ALL CAPS (unless it's an acronym)

Keep headers clean and consistent. Use formatting only in body text.

**Correct:**

- Run the TON Center service
- How the smart contract works

**Incorrect:**

- *Run the TON Center service*
- How the `smart contract` works
- “Run the TON Center service”
- HOW THE SMART CONTRACT WORKS


#### Capitalized terms in headers

Sometimes, you can face specific capitalization defined as capitalized according to American English rules.

- Capitalization standard for specific terms:
- Example: `## Use American English`
- Example: `### Date Format`
  
Date and Format are special terms and should be capitalized, regardless of the overall Sentence Case rule.

### Avoid "quotation marks"
Do not use "quotation marks" to highlight terms, variables, or functions. Instead, apply **bold** for terms and `code formatting` for code references.

**Correct usage:**
- Use **get_wallet_address** when introducing a term.
- Use `get_wallet_address` when referencing a code variable or function.

**Incorrect usage:**
- Do not use "get_wallet_address" for a term, code variable, or function.


### Navigation menu headings
The navigation menus should remain minimalistic in both the left sidebar and the top menu. For consistency and clarity, all menu headings must use Sentence case.

#### Left sidebar menu:
- Avoid lengthy descriptions.
- Use short, clear labels of two or three words.

:::info
Specify the left side menu with [sidebars](https://github.com/ton-community/ton-docs/tree/main/sidebars) configuration files.
:::

#### Navigation bar menu:
- Set only high-level hierarchy pages in this menu.
- Use broad, descriptive terms to categorize content, ensuring users can quickly identify the main section they need.

:::info
Specify the navigation bar menu with the [navbar.js](https://github.com/ton-community/ton-docs/blob/main/navbar.js) configuration file.
:::

#### Consistency between menu and in-page headers
- Match the header text used in the table of contents or side menu with the header text in the article, ensuring readers know they're on the correct page or section.


---

## Putting it all together
1. **Create your new documentation file** using the kebab-case naming convention
   * Example:`getting-started-guide.md`.
2. **Open the file** and set an H1 heading in sentence case
   * Example: `# Getting started guide`.
3. **Organize content** with H2 headings for main topics 
   * Example:`## Installation steps`, also in sentence case.
4. **Use H3 headings** for more detailed subtopics in sentence case 
   * Example: `### Installing on Linux`).
5. **Maintain consistency** in any side menus or tables of contents by matching the header text from within the document.

---

## Example structure

```md title="getting-started-with-ton.md"
# Getting started with TON

## Prerequisites

### What is TON
**The Open Network (TON)** is a decentralized and open internet platform...
The content goes here.

### Checking your environment
The content goes here.

## Installation steps

### Installing on Linux
The content goes here.

### Installing on macOS
The content goes here.

## Basic usage

### Running your first command
The content goes here.

## See also
- [How to contribute](/v3/contribute/)
```

## See also
- [How to contribute](/v3/contribute/)
- [Content standardization](/v3/contribute/content-standardization/)
- [Typography](/v3/contribute/typography/)
- [Localization program](/v3/contribute/localization-program/overview/)

<Feedback />




================================================
FILE: docs/v3/documentation/archive/compile.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/compile.md
================================================
import Feedback from '@site/src/components/Feedback';

# Compile and Build smart contracts on TON

Here is a list of libraries and repos to build your smart contract.

**TLDR:**
- In most cases, it's enough to use Blueprint SDK.
- If you need more low-level approach, you can use ton-compiler or func-js.

## Blueprint

### Overview

A development environment for TON blockchain for writing, testing, and deploying smart contracts. Read more in [Blueprint git repository](https://github.com/ton-community/blueprint).

### Installation

Run the following in terminal to create a new project and follow the on-screen instructions:

```bash
npm create ton@latest
```

&nbsp;

### Features

* Streamlined workflow for building, testing and deploying smart contracts
* Dead simple deployment to mainnet/testnet using your favorite wallet (eg. Tonkeeper)
* Blazing fast testing of multiple smart contracts in an isolated blockchain running in-process

### Tech stack

1. Compiling FunC with https://github.com/ton-community/func-js (no CLI)
2. Testing smart contracts with https://github.com/ton-community/sandbox
3. Deploying smart contracts with [TON Connect 2](https://github.com/ton-connect), [Tonhub wallet](https://tonhub.com/) or a `ton://` deeplink

### Requirements

* [Node.js](https://nodejs.org) with a recent version like v18, verify version with `node -v`
* IDE with TypeScript and FunC support like [Visual Studio Code](https://code.visualstudio.com/) with the [FunC plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### How to use?
* [Watch DoraHacks presentation with demo of working with blueprint](https://www.youtube.com/watch?v=5ROXVM-Fojo).
* Read well detailed explanation in [Blueprint repo](https://github.com/ton-community/blueprint#create-a-new-project).


## ton-compiler

### Overview

Packaged FunC compiler for TON smart contracts:
* GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
* NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### Installation

```bash npm2yarn
npm install ton-compiler
```

### Features

* Multiple FunC compiler versions
* Doesn't need to install and compile TON
* Programmatic and CLI interfaces
* Ready to use in unit-testing

### How to use

This packages adds `ton-compiler` binary to a project.

FunC compilation is a multi-stage process. One is compiling Func to Fift code that is then compiled to a binary representation. Fift compiler already has Asm.fif bundled.

FunC stdlib is bundled but could be disabled at runtime.

#### Console Use

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debugging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### Programmatic Use

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## func-js

### Overview

_Cross-platform_ bindings for TON FunC compiler.

It's more low-level than ton-compiler, so use it only if ton-compiler doesn't work for you.

* GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
* NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### Installation

```bash npm2yarn
npm install @ton-community/func-js
```

### Features

* No need to compile of download FunC binaries
* Works both in Node.js & **WEB** (WASM support is required)
* Compiles straight to BOC with code Cell
* Assembly is returned fot debugging purposes
* Does not depend on file-system


### How to use

Internally, this package uses both FunC compiler and Fift interpreter combined to single lib compiled to WASM.

Simple schema:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

Sources to the internal lib could be found [here](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib).

### Usage example

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

Note that all FunC source file contents used in your project should be passed to `sources`, including:

* entry points
* stdlib.fc (if you use it)
* all files included in entry points


### Validated by TON Community

* [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler) — ready-to-use FunC compiler for TON smart contracts.
* [ton-community/func-js](https://github.com/ton-community/func-js) — cross-platform bindings for the TON FunC compiler.

### Third-party contributors

* [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) — TON FunC smart contract compiler.
* [Termina1/tonc](https://github.com/Termina1/tonc) — TONC (TON Compiler). Uses WASM, so perfect for Linux.


## Other

* [disintar/toncli](https://github.com/disintar/toncli) — one of the most popular approaches. You even can use it with Docker.
* [tonthemoon/ton](https://github.com/tonthemoon/ton) — _(closed beta)_ one-line TON binaries installer.
* [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) — Package & CLI to generate opcodes by TL-B scheme

<Feedback />




================================================
FILE: docs/v3/documentation/archive/hacktoberfest-2022/README.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/hacktoberfest-2022/README.mdx
================================================
import Button from '@site/src/components/button'

# What is Hacktoberfest?

<div style={{ textAlign: 'center', margin: '50px 0' }}>
  <img alt="tlb structure"
       src="/img/docs/hacktoberfest.webp"
       width="100%" />
</div>

[Hacktoberfest](https://hacktoberfest.digitalocean.com/) is a month-long celebration of *open-source projects*, their *maintainers*, and the entire community of *contributors*. Each October, open source maintainers give new contributors extra attention as they guide developers through their first pull requests.

For the TON Community it's time to help ecosystem growth together, so let's join the whole world with our **Hack-TON-berfest** party and become *#1 open-source ecosystem of the year*!

## How to Participate?

The Hacktoberfest rules for 2022 are as follows:

* **Hacktoberfest is open to everyone**!
* Register anytime between September 26 and October 31
* Pull requests can be made in any GITHUB or GITLAB project:
  * [List of projects on TON Ecosystem](/hacktonberfest)
  * [List of projects on GitHub](https://github.com/topics/hacktoberfest)
* Have **4** pull/merge requests accepted between October 1 and October 31
* The first 40,000 participants (maintainers and contributors) who complete Hacktoberfest can choose between two prizes: a tree planted in their honor or a Hacktoberfest 2022 t-shirt. _(from the Hacktoberfest community)_
* Every participant (maintainer and contributor) to any of the TON Ecosystem projects will receive a [**Limited Hack-TON-berfest NFT**](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards). _(from TON Foundation)_

For everyone in TON it's an opportunity to drive the growth of the entire ecosystem and receive cool rewards from TON Foundation. Let's do it together!

## What are the rewards?

To motivate the community to contribute to open source projects in the TON Ecosystem, you'll be able to receive a special reward from TON Foundation. Every participant will receive a **Limited Hack-TON-berfest NFT** achievement as a proof of participating:

<div style={{width: '100%', textAlign:'center', margin: '0 auto'}}>
  <video width="300" style={{width: '100%', borderRadius:'10pt', margin:'15pt auto'}} muted={true} autoPlay={true} loop={true}>
    <source src="/files/nft-sm.mp4" type="video/mp4" />

Your browser does not support the video tag.

  </video>
</div>

:::info IMPORTANT!
TON Foundation will mint a collection in November to all wallet addresses submitted to the [@toncontests_bot](https://t.me/toncontests_bot). It will happen after the calculation and validation of all contribution results.
:::

You have plenty of time to participate in the event. Let's build decentralized Internet of the future with thousands of contributors from all over the world!




<Button href="/v3/documentation/archive/hacktoberfest-2022/as-contributor"
     colorType="primary" sizeType={'lg'}>

I want to become a Contributor

</Button>


<Button href="/v3/documentation/archive/hacktoberfest-2022/as-maintainer" colorType={'secondary'} sizeType={'lg'}>

I'm a Maintainer

</Button>




================================================
FILE: docs/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/hacktoberfest-2022/as-contributor.md
================================================
import Feedback from '@site/src/components/Feedback';

# Participate as a Contributor

To become a contributor who receives a limited *Hack-TON-berfest NFT*, please set up your own [TON Wallet](https://ton.org/wallets) and verify your GitHub account.

## Start your journey

1. Set up any wallet from the [ton.org/wallets](https://ton.org/wallets) page. ([TON Wallet extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd), for example.)
2. Please provide your wallet address to the [@toncontests_bot](https://t.me/toncontests_bot) in Telegram.
3. Validate your GitHub account in the same bot.

After these steps you are ready to contribute and receive a [limited Hack-TON-berfest NFT](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards).

Welcome to the club, this is just the beginning!

## New to contributing to open source?

Hacktoberfest is a great place to start dipping your toes into open source contributions for the first time. There are plenty of streams, posts, guides, and discussions about to get started. You’ll be joining many folks who are also starting their journey this month!

* [Basic information about Hacktoberfest for beginners](https://hacktoberfest.com/participation/#beginner-resources)
* [Guide to making your first contribution](https://dev.to/codesandboxio/how-to-make-your-first-open-source-contribution-2oim) by Ceora Ford
* [Practice the workflow to make your first contribution](https://github.com/firstcontributions/first-contributions)
* [Overcoming imposter syndrome in open source contribution](https://blackgirlbytes.dev/conquering-the-fear-of-contributing-to-open-source)

## How can I contribute to TON?

The TON Ecosystem has several organizations and repositories:

<span className="DocsMarkdown--button-group-content">
  <a href="/hacktonberfest"
     className="Button Button-is-docs-primary">
    List of projects looking for contributors
  </a>
</span>

<Feedback />




================================================
FILE: docs/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/hacktoberfest-2022/as-maintainer.md
================================================
import Feedback from '@site/src/components/Feedback';

# Participate as a Maintainer

The Hacktoberfest event is the best time of year to receive support from the community!

If your repository is relevant to the TON Ecosystem, many contributors will be interested in it. Let's help them dive right into your project!

## Prepare to party

To handle contributors in the right way, you need to have a repository in good standing.

Follow these best practices to prepare your project for contributions:

1. Add the “hacktoberfest” topic to your repository to **OPT-IN TO HACKTOBERFEST** and indicate you are looking for contributions.
2. Apply the “hacktoberfest” label to issues you want contributors to help you with in your GitHub or GitLab project.
3. Please read and use [the essential tips for new open source maintainers](https://blog.ton.org/essential-tips-for-new-open-source-maintainers) by TON Society.
4. Prepare to accept legitimate pull/merge requests by merging them, leaving an overall approving review, or adding the "hacktoberfest-accepted" label.
5. Reject any spam requests you receive by labeling them as “spam,” and close or label any other invalid contributions as "invalid."

Here is an example of a full repository: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)

After that, feel free to add your repository to the list.

## Rewards for Maintainers

As a repository maintainer in the TON Ecosystem, you will be able to receive two types of rewards:

1. [Hacktoberfest Reward Kit](https://hacktoberfest.com/participation/#maintainers) (_see REWARD FOR MAINTAINERS_)
2. [Limited Hack-TON-berfest NFT](/v3/documentation/archive/hacktoberfest-2022#what-are-the-rewards) (_please, register the wallet address in the [@toncontests_bot](https://t.me/toncontests_bot)_)

## How to join and be listed?

To participate in Hack-TON-berfest follow this link:

<span className="DocsMarkdown--button-group-content">
  <a href="https://airtable.com/shrgXIgZdBKKX64NL"
     className="Button Button-is-docs-primary">
    Add a repository to the list
  </a>
</span>

<Feedback />




================================================
FILE: docs/v3/documentation/archive/mining.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/mining.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON mining guide

:::warning deprecated
This information may be outdated and no longer relevant. You can skip it.
:::


## <a id="introduction"></a>Introduction
This document provides an introduction to the process of mining Toncoin using PoW givers. Please visit [ton.org/mining](https://ton.org/mining) for up-to-date status of TON mining.

## <a id="quick-start"></a>Quick start
To start mining right away:

1. Get a [computer suitable for mining](#hardware).
2. Install [Ubuntu](https://ubuntu.com) 20.04 desktop or server distribution.
3. Install [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) in `lite` mode.
4. Check your hardware and [expected mining income](/v3/documentation/archive/mining#income-estimates) by running `emi` command within `mytonctrl`.
5. If you do not yet have one, create `wallet address` using one of the [wallets](https://www.ton.org/wallets).
6. Define your `wallet address` as a mining target by executing `set minerAddr "..."` in `mytonctrl`.
7. Chose a giver contract from the list available on [ton.org/mining](https://ton.org/mining) and set your miner to mine it by executing `set powAddr "..."` in `mytonctrl`.
8. Start mining by executing `mon` in `mytonctrl`
9. Check the CPU load on your computer; the process called `pow-miner` should use most of your CPU.
10. Wait to get lucky; the output of step 4 should have told you approximately what your chances are to mine a block.

## <a id="basics"></a>Basics
Toncoin is distributed by `PoW Givers`, which are smart contracts with specific amounts of Toncoin assigned to them. Currently, there are 10 active PoW givers on the TON Network. Each giver distributes coins in blocks of 100 TON. To earn one of these blocks, your computer must solve a complex mathematical challenge faster than other miners. If another miner solves the problem before you, your machine's work is discarded, and a new round begins.

Mining profits are not gradual; they come in batches of 100 TON for each successfully solved giver challenge. This means that if your machine has a 10% chance to calculate a block within 24 hours (see step 4 of [Quick start](/v3/documentation/archive/mining#quick-start)) then you will probably need to wait for ~10 days before you will get a 100 TON reward.

The process of mining is largely automated by `mytonctrl`. Detailed information about the mining process can be found in [PoW givers](https://www.ton.org/#/howto/pow-givers) document.

## <a id="advanced"></a>Advanced
If you're serious about mining and want to operate multiple machines or a mining farm, it's essential to learn about TON and how mining works. Refer to the [HOWTO](https://ton.org/#/howto/) section for detailed information. Here is some general advice:

* **DO** run your own node / lite server on a separate machine; this will ensure that your mining farm does not depend on external lite servers that can go down or not process your queries in a timely fashion.
* **DO NOT** bombard public lite servers with `get_pow_params` queries, if you have custom scripts that poll givers status in high frequency you **must** use your own lite server. Clients that violate this rule risk having their IPs blacklisted on public lite servers.
* **DO** try to understand how [mining process](https://www.ton.org/#/howto/pow-givers) works; most larger miners use their own scripts that offer many advantages over `mytonctrl` in environments with multiple mining machines.

## <a id="hardware"></a>Miner hardware
The total network hashrate of TON mining is very high; miners need high-performance machines if they wish to succeed. Mining on standard home computers and notebooks is futile, and we advise against such attempts.

#### CPU
A modern CPU with [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) support is **essential**. Most miners use AMD EPYC or Threadripper machines with at least 32 cores and 64 threads.

#### GPU
Yes! You can mine TON using GPU. There is a version of a PoW miner that is capable to use both Nvidia and AMD GPUs; you can find the code and instructions on how to use it in the [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) repository.

As for now, one needs to be tech-savvy to use this, but we are working on a more user-friendly solution.

#### Memory
Almost the entire mining process happens in the L2 cache of the CPU. That means that memory speed and size play no role in mining performance. A dual AMD EPYC system with a single DIMM on one memory channel will mine just as fast as one with 16 DIMMs occupying all channels.

Please do note that this applies to the plain mining process **only**, if your machine also runs full node or other processes, then things change! But this is outside the scope of this guide.

#### Storage
A miner running in lite mode uses minimal storage space and does not store data.

#### Network
Plain miner needs the ability to open outgoing connections to the Internet.

#### FPGA / ASIC
See [can I use FPGA / ASICs?](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)

### <a id="hardware-cloud"></a>Cloud machines
Many people mine using AWS or Google compute cloud machines. As outlined in the specs above, what really matters is CPU. Therefore, we advise AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) or Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) instances.

### <a id="hardware-estimates"></a>Income estimates
The formula for calculating the income is quite simple: `($total_bleed / $total_hashrate) * $your_hashrate`. This will give you a **current** estimate. You can find out the variables on [ton.org/mining](https://ton.org/mining) or use the estimated mining income calculator (`emi` command) in `mytonctrl`. Here is sample output made on August 7th, 2021 using i5-11400F CPU:
```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Important**: Please do note that the information provided is based on *network hashrate at the moment of execution*. Your actual income over time will depend on many factors, such as changing network hashrate, the chosen giver, and a good portion of luck.


## <a id="faq"></a>FAQ
### <a id="faq-general"></a>General
#### <a id="faq-general-posorpow"></a>Is TON PoS or PoW network?
TON Blockchain operates on a Proof-of-Stake (PoS) consensus. Mining is not required to create new blocks.
#### <a id="faq-general-pow"></a>So how come TON is Proof-of-Work?
Well, the reason is that the initial issue of 5 billion Toncoins were transferred to ad hoc Proof-of-Work Giver smart contracts.
Mining is used to obtain Toncoins from this smart contract.
#### <a id="faq-general-supply"></a>How many coins are left for mining?
The most actual information is available on [ton.org/mining](https://ton.org/mining), see `bleed` graphs. PoW Giver contracts have their limits and will dry out once users mine all the available Toncoins.
#### <a id="faq-general-mined"></a>How many coins have been mined already?
As of August 2021, about 4.9BN Toncoins have been mined.
#### <a id="faq-general-whomined"></a>Who has mined those coins?
Coins have been mined to over 70,000 wallets. The owners of these wallets remain unknown.
#### <a id="faq-general-elite"></a>Is it difficult to start mining?
Not at all. All you need is [adequate hardware](#hardware) and to follow the steps outlined in the [quick start](#quick-start) section.
#### <a id="faq-general-pissed"></a>Is there another way to mine?
Yes, there is a third-party app—[TON Miner Bot](https://t.me/TonMinerBot).
#### <a id="faq-general-stats"></a>Where can I see mining statistics?
[ton.org/mining](https://ton.org/mining)
#### <a id="faq-general-howmany"></a>How many miners are out there?
We cannot say this. All we know is the total hashrate of all miners on the network. However, there are graphs on [ton.org/mining](https://ton.org/mining) that attempt to estimate quantity of machines of certain type needed to provide approximate total hashrate.
#### <a id="faq-general-noincome"></a>Do I need Toncoin to start mining?
No, you do not. Anyone can start mining without owning a single Toncoin.
#### <a id="faq-mining-noincome"></a>Why does my wallet balance not increase, even after hours of mining?
TON are mined in blocks of 100, you either guess a block and receive 100 TON or receive nothing. Please see [basics](#basics).
#### <a id="faq-mining-noblocks"></a>I've been mining for days and I see no results, why?
Did you check your current [Income estimates](/v3/documentation/archive/mining#income-estimates)? If field `Est. 24h chance to mine a block` is less than 100%, then you need to be patient. Also, please note that a 50% chance to mine a block within 24 hours does not automatically mean that you will mine one within 2 days; 50% applies to each day separately.
#### <a id="faq-mining-pools"></a>Are there mining pools?
No, as of now there are no implementations of mining pools, everyone mines for themselves.
#### <a id="faq-mining-giver"></a>Which giver should I mine?
It does not really matter which giver you choose. The difficulty tends to fluctuate on each giver, so the current easiest giver on [ton.org/mining](https://ton.org/mining) might become the most complex within an hour. The same applies in the opposite direction.
### <a id="faq-hw"></a>Hardware
#### <a id="faq-hw-machine"></a>Will a faster machine always win?
No, all miners take different roads to find the solution. A faster machine has a higher probability of success, but it doesn't guarantee victory!
#### <a id="faq-hw-machine"></a>How much income will my machine generate?
Please see [Income estimates](/v3/documentation/archive/mining#income-estimates).
#### <a id="faq-hw-asic"></a>Can I use my BTC/ETH rig to mine TON?
No, TON uses a single SHA256 hashing method which is different from BTC, ETH, and others. ASICS or FPGAs which are built for mining other cryptos will not help. 
#### <a id="faq-hw-svsm"></a>What is better, a single fast machine or several slow ones?
This is controversial. See: miner software launches threads for each core on the system, and each core gets its own set of keys to process, so if you have one machine capable to run 64 threads and 4 x machines capable to run 16 threads each, then they will be exactly as successful assuming that the speed of each thread is the same.

In the real world, however, CPUs with lower core count are usually clocked higher, so you will probably have better success with multiple machines.
#### <a id="faq-hw-mc"></a>If I run many machines, will they cooperate?
No, they will not. Each machine mines on its own, but the solution finding process is random: no machine, not even a single thread (see above) will take the same path. Thus, their hashrates add up in your favor without direct cooperation.
#### <a id="faq-hw-CPU"></a>Can I mine using ARM CPUs?
Depending on the CPU, AWS Graviton2 instances are indeed very capable miners and are able to hold price/performance ratio alongside AMD EPYC-based instances.
### <a id="faq-software"></a>Software
#### <a id="faq-software-os"></a>Can I mine using Windows/xBSD/some other OS?
Of course, [TON source code](https://github.com/ton-blockchain/ton) has been known to be built on Windows, xBSD and other OSes. However, there is no comfortable automated installation, as under Linux with `mytonctrl`, you will need to install the software manually and create your own scripts. For FreeBSD, there is a [port](https://github.com/sonofmom/freebsd_ton_port) source code that allows quick installation.
#### <a id="faq-software-node1"></a>Will my mining become faster if I run mytonctrl in full node mode?
Calculation process by itself will not be faster, but you will gain some stability and, most importantly, flexibility if you operate your own full node/lite server.
#### <a id="faq-software-node2"></a>What do I need to / how can I operate a full node?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/#/howto/full-node) and/or [mytonctrl instructions](https://github.com/igroman787/mytonctrl).
#### <a id="faq-software-build"></a>Can you help me to build software on my OS?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/#/howto/full-node) as well as [Mytonctrl installation scripts](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) for information about dependencies and process.

<Feedback />




================================================
FILE: docs/v3/documentation/archive/pow-givers.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/pow-givers.md
================================================
import Feedback from '@site/src/components/Feedback';

# POW Givers

:::warning deprecated
This information may be outdated and no longer relevant. You can skip it.
:::

The aim of this text is to describe how to interact with Proof-of-Work Giver smart contracts to obtain Toncoin. We assume familiarity with TON Blockchain Lite Client as explained in `Getting Started`, and with the procedure required to compile the Lite Client and other software. For obtaining the larger amount of Toncoin required for running a validator, we also assume acquaintance with the `Full Node` and `Validator` pages. You will also need a dedicated server powerful enough for running a Full Node in order to obtain the larger amount of Toncoin. Obtaining small amounts of Toncoin does not require a dedicated server and may be done in several minutes on a home computer.

> Note that, at the moment, large resources are required for any mining due to the large number of miners.

## 1. Proof-of-Work Giver smart contracts

In order to prevent a small number of malicious parties from collecting all Toncoin, a special kind of "Proof-of-Work Giver" smart contract has been deployed in the masterchain of the network. The addresses of these smart contacts are:

Small givers (deliver from 10 to 100 Toncoin every several minutes):

* kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
* kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
* kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
* kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
* kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
* kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
* kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
* kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
* kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
* kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

Large givers (deliver 10,000 Toncoin at least once a day):

* kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
* kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
* kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
* kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
* kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
* kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
* kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
* kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
* kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
* kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> Note that at the current moment all large givers are depleted.

The first ten smart contracts enable a user willing to obtain a small amount of Toncoin to obtain some without spending too much computing power (typically, several minutes of work on a home computer should suffice). The remaining smart contracts are for obtaining larger amounts of Toncoin required for running a validator in the network; typically, a day of work on a dedicated server powerful enough to run a validator should suffice to obtain the necessary amount.

> Note that at the moment, due to a large number of miners, large resources are required for mining small givers.

You should randomly choose one of these "proof-of-work giver" smart contracts (from one of these two lists depending on your purpose) and obtain Toncoin from this smart contract by a procedure similar to mining. Essentially, you have to present an external message containing the proof of work and the address of your wallet to the chosen "proof-of-work giver" smart contract, and then the necessary amount will be sent to you.

## 2. The mining process

In order to create an external message containing the "proof-of-work", you should run a special mining utility, compiled from the TON sources located in the GitHub repository. The utility is located in file `./crypto/pow-miner` with respect to the build directory and can be compiled by typing `make pow-miner` in the build directory.

However, before running `pow-miner`, you need to know the actual values of `seed` and `complexity` parameters of the chosen "proof-of-work giver" smart contract. This can be done by invoking the get-method `get_pow_params` of this smart contract. For instance, if you the use giver smart contract, `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN` you can simply type:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

in the Lite Client console and obtain an output like:

``` ...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

The two first large numbers in the "result:" line are the `seed` and the `complexity` of this smart contract. In this example, the seed is `229760179690128740373110445116482216837`, and the complexity is `53919893334301279589334030174039261347274288845081144962207220498432`.

Next, you invoke the `pow-miner` utility as follows:

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

Here:
* `<num-threads>` is the number of CPU cores that you want to use for mining.
* `<timeout-in-sec>` is the maximal amount of seconds that the miner would run before admitting failure.
* `<your-wallet-address>` is the address of your wallet (possibly not initialized yet).It is either on the masterchain or on the workchain (note that you need a masterchain wallet to control a validator).
* `<seed>` and `<complexity>` are the most recent values obtained by running get-method `get-pow-params`.
* `<pow-giver-address>` is the address of the chosen proof-of-work giver smart contract.
* `<boc-filename>` is the filename of the output file where the external message with the proof of work will be saved in the case of success.

For example, if your wallet address is `kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`, you might run:

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

The program will run for some time (at most 100 seconds in this case) and either terminate successfully (with a zero exit code) and save the required proof of work into file `mined.boc` or terminate with a non-zero exit code if no proof of work was found.

In the case of failure, you will see something like:

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

and the program will terminate with a non-zero exit code. Then you have to obtain the `seed` and `complexity` again (because they may have changed in the meantime as a result of processing requests from more successful miners) and re-run the `pow-miner` with the new parameters, repeating the process again and again until success.

In the case of success, you will see something like:

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

Then you can use the Lite Client to send an external message from file `mined.boc` to the proof-of-work giver smart contract (and you must do this as soon as possible):

```
> sendfile mined.boc
... external message status is 1
```

You can wait for several seconds and check the state of your wallet:

:::info
Please note here and further that the code, comments, and/or documentation may contain parameters, methods, and definitions such as “gram”, “nanogram”, etc. That is a legacy of the original TON code, developed by the Telegram. Gram cryptocurrency was never issued. The currency of TON is Toncoin and the currency of the TON testnet is Test Toncoin.
:::
```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

If nobody has sent a valid proof of work with this `seed` and `complexity` before you, the proof-of-work giver will accept your proof of work, and this will be reflected in the balance of your wallet (10 or 20 seconds may elapse after sending the external message before this happens; be sure to make several attempts and type `last` each time before checking the balance of your wallet to refresh the Lite Client state). In the case of success, you will see that the balance has been increased (and even that your wallet has been created in an uninitialized state if it did not exist before). In the case of failure, you will have to obtain the new `seed` and `complexity` and repeat the mining process from the very beginning.

If you have been lucky and the balance of your wallet has increased, you may want to initialize the wallet if it wasn't initialized before (more information on wallet creation can be found in `Step-by-Step`):

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

Now you are a happy owner of 100 Toncoin. Congratulations!

## 3. Automating the mining process in the case of failure

If you fail to obtain your Toncoin for a long time, this may happen because too many other users are simultaneously mining from the same proof-of-work giver smart contract. Maybe you should choose another proof-of-work giver smart contract from one of the lists given above. Alternatively, you can write a simple script to automatically run `pow-miner` with the correct parameters again and again until success (detected by checking the exit code of `pow-miner`) and invoke the Lite Client with the parameter `-c 'sendfile mined.boc'` to send the external message immediately after it is found.

<Feedback />




================================================
FILE: docs/v3/documentation/archive/precompiled-binaries.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/precompiled-binaries.md
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'


# Precompiled binaries

:::caution important
You no longer need to manually install binaries with Blueprint SDK.
:::

All binaries for development and testing are provided with the Blueprint SDK.

 
<Button href="/v3/documentation/smart-contracts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

Migrate to Blueprint SDK
 
</Button>


## Precompiled binaries

If you don't use Blueprint SDK for smart contracts development, you can use precompiled binaries for your operating system and tool of choice.

### Prerequisites

For the local development of TON smart contracts _without Javascript_, you need to prepare binaries of `func`, `fift`, and `lite client` on your device.

You can download and set them up below, or read this article from TON Society:
* [Setting up TON Development Environment](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. Download
 
Download the binaries from the table below.  Make sure to select the correct version for your operating system and to install any additional dependencies:

| OS             | TON binaries                                                                             | fift                                                                                        | func                                                                                        | lite-client | Additional dependencies                                                              |
|----------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------|
| MacOS x86-64   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)  | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)  | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)     |                                                                |
| MacOS arm64    | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                             ||| `brew install openssl ninja libmicrohttpd pkg-config`                                         |
| Windows x86-64 | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)         | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)         | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)            | Install [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux  x86_64  | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                             |
| Linux  arm64   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  | |                                                                                             |  | `sudo apt install libatomic1 libssl-dev`                                             |

### 2. Setup your binaries
 
export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

  1. After downloading, you need to `create` a new folder. For example: **`C:/Users/%USERNAME%/ton/bin`** and move the installed files there.

  2. To open the Windows environment variables, press the <Highlight color="#1877F2">Win + R</Highlight> buttons on the keyboard, type `sysdm.cpl`, and press Enter.

  3. On the "_Advanced_" tab, click the <Highlight color="#1877F2">"Environment Variables..."</Highlight> button.

  4. In the _"User variables"_ section, select the "_Path_" variable and click <Highlight color="#1877F2">"Edit"</Highlight> (this is usually required).
  
  5. To add a new value `(path)` to the system variable in the next window, click the  button <Highlight color="#1877F2">"New"</Highlight>.
  In the new field, you need to specify the path to the folder where the previously installed files are stored:

  ```
  C:\Users\%USERNAME%\ton\bin\
  ```

  6. To check whether everything was installed correctly, run in terminal (_cmd.exe_):

  ```bash
  fift -V -and func -V -and lite-client -V
  ```

  7. If you plan to use fift, you need `FIFTPATH` environment variable with the necessary imports:

     1. Download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
     2. Open the zip in some directory on your machine (like **`C:/Users/%USERNAME%/ton/lib/fiftlib`**)
     3. Create a new (click button <Highlight color="#1877F2">"New"</Highlight>) environment variable `FIFTPATH` in "_User variables_" section. 
     4. In the "_Variable value_" field, specify the path to the files: **`/%USERNAME%/ton/lib/fiftlib`** and click <Highlight color="#1877F2">OK</Highlight>. Done.


:::caution important
Instead of the `%USERNAME%` keyword, you must insert your own `username`.  
:::  

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

  1. After downloading, make sure the downloaded binaries are executable by changing their permissions.
   ```bash
   chmod +x func
   chmod +x fift
   chmod +x lite-client
   ```

  2. It's also useful to add these binaries to your path (or copy them to `/usr/local/bin`) so you can access them from anywhere.
   ```bash
   cp ./func /usr/local/bin/func
   cp ./fift /usr/local/bin/fift
   cp ./lite-client /usr/local/bin/lite-client
   ```

  3. To check that everything was installed correctly, run in terminal.
   ```bash
   fift -V && func -V && lite-client -V
   ```

  4. If you plan to `use fift`, also download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), open the zip in some directory on your device (like `/usr/local/lib/fiftlib`), and set the environment variable `FIFTPATH` to point to this directory.
   
   ```
   unzip fiftlib.zip
   mkdir -p /usr/local/lib/fiftlib
   cp fiftlib/* /usr/local/lib/fiftlib
   ```

:::info Hey, you're almost finished :)
Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

  </TabItem>
</Tabs>




## Build from source

If you don't want to rely on pre-compiled binaries and prefer to compile the binaries yourself, you can follow the [official instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions).

The ready-to-use gist instructions are provided below:

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```
## Other sources for binaries

The core team provides automatic builds for several operating systems as [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest).

Click on the link above, choose the workflow on the left relevant to your operating system, click on a recent green passing build, and download `ton-binaries` under "Artifacts".

<Feedback />




================================================
FILE: docs/v3/documentation/archive/tg-bot-integration-py.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/tg-bot-integration-py.md
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# TON Connect for Telegram Bots - Python

:::warning deprecated
This guide explains an outdated method of integrating TON Connect with Telegram bots. For a more secure and modern approach, consider using [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview for a more modern and secure integration.
:::

In this tutorial, we’ll create a sample telegram bot that supports TON Connect 2.0 authentication using Python TON Connect SDK [pytonconnect](https://github.com/XaBbl4/pytonconnect).
We will analyze connecting a wallet, sending a transaction, getting data about the connected wallet, and disconnecting a wallet.

 
<Button href="https://t.me/test_tonconnect_bot" colorType={'primary'} sizeType={'sm'}>

Open Demo Bot
 
</Button>

 
<Button href="https://github.com/yungwine/ton-connect-bot" colorType={'secondary'} sizeType={'sm'}>

Check out GitHub
 
</Button>


## Preparing

### Install libraries

To make bot we are going to use `aiogram` 3.0 Python library.
To start integrating TON Connect into your Telegram bot, you need to install the `pytonconnect` package.
And to use TON primitives and parse user address we need `pytoniq-core`.
You can use pip for this purpose:

```bash
pip install aiogram pytoniq-core python-dotenv
pip install pytonconnect
```

### Set up config
Specify in `.env` file [bot token](https://t.me/BotFather) and link to the TON Connect [manifest file](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). After load them in `config.py`:

```dotenv
# .env

TOKEN='1111111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  # your bot token here
MANIFEST_URL='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json'
```

```python
# config.py

from os import environ as env

from dotenv import load_dotenv
load_dotenv()

TOKEN = env['TOKEN']
MANIFEST_URL = env['MANIFEST_URL']
```

## Create simple bot

Create `main.py` file which will contain the main bot code:

```python
# main.py

import sys
import logging
import asyncio

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)
    

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    await message.answer(text='Hi!')

async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

## Wallet connection

### TON Connect Storage

Let's create simple storage for TON Connect

```python
# tc_storage.py

from pytonconnect.storage import IStorage, DefaultStorage


storage = {}


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        storage[self._get_key(key)] = value

    async def get_item(self, key: str, default_value: str = None):
        return storage.get(self._get_key(key), default_value)

    async def remove_item(self, key: str):
        storage.pop(self._get_key(key))

```

### Connection handler

Firstly, we need function which returns different instances for each user:

```python
# connector.py

from pytonconnect import TonConnect

import config
from tc_storage import TcStorage


def get_connector(chat_id: int):
    return TonConnect(config.MANIFEST_URL, storage=TcStorage(chat_id))

```
Secondary, let's add connection handler in `command_start_handler()`:

```python
# main.py

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())
    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())

```

Now, for a user who has not yet connected a wallet, the bot sends a message with buttons for all available wallets.
So we need to write function to handle `connect:{wallet["name"]}` callbacks:

```python
# main.py

async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])
```

Bot gives user 3 minutes to connect a wallet, after which it reports a timeout error. 

## Implement Transaction requesting

Let's take one of examples from the [Message builders](/v3/guidelines/ton-connect/guidelines/preparing-messages) article:

```python
# messages.py

from base64 import urlsafe_b64encode

from pytoniq_core import begin_cell


def get_comment_message(destination_address: str, amount: int, comment: str) -> dict:

    data = {
        'address': destination_address,
        'amount': str(amount),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0, 32)  # op code for comment message
            .store_string(comment)  # store comment
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }

    return data

```

And add `send_transaction()` function in the `main.py` file:

```python
# main.py

@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return
    
    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    await connector.send_transaction(
        transaction=transaction
    )
```

But we also should handle possible errors, so we wrap the `send_transaction` method into `try - except` statement:

```python
@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    ...
    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')
```

## Add disconnect handler

This function implementation is simple enough:

```python
async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')
```

Currently, the project has the following structure:

```bash
.
.env
├── config.py
├── connector.py
├── main.py
├── messages.py
└── tc_storage.py
```
And the `main.py` looks like this:

<details>
<summary>Show main.py</summary>

```python
# main.py

import sys
import logging
import asyncio
import time

import pytonconnect.exceptions
from pytoniq_core import Address
from pytonconnect import TonConnect

import config
from messages import get_comment_message
from connector import get_connector

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)


@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())

    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return

    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')


async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```
</details>

## Improving


### Add permanent storage - Redis

Currently, our TON Connect Storage uses dict which causes to lost sessions after bot restart. 
Let's add permanent database storage with Redis:

After you launched Redis database install python library to interact with it:

```bash
pip install redis
```

And update `TcStorage` class in `tc_storage.py`:

```python
import redis.asyncio as redis

client = redis.Redis(host='localhost', port=6379)


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        await client.set(name=self._get_key(key), value=value)

    async def get_item(self, key: str, default_value: str = None):
        value = await client.get(name=self._get_key(key))
        return value.decode() if value else default_value

    async def remove_item(self, key: str):
        await client.delete(self._get_key(key))
```

### Add QR Code

Install python `qrcode` package to generate them:

```bash
pip install qrcode
```

Change `connect_wallet()` function so it generates qrcode and sends it as a photo to the user:

```python
from io import BytesIO
import qrcode
from aiogram.types import BufferedInputFile


async def connect_wallet(message: Message, wallet_name: str):
    ...
    
    img = qrcode.make(generated_url)
    stream = BytesIO()
    img.save(stream)
    file = BufferedInputFile(file=stream.getvalue(), filename='qrcode')

    await message.answer_photo(photo=file, caption='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())
    
    ...
```

## Summary

What is next?
- You can add better errors handling in the bot.
- You can add start text and something like `/connect_wallet` command.

## See Also
- [Full bot code](https://github.com/yungwine/ton-connect-bot)
- [Preparing messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)

<Feedback />




================================================
FILE: docs/v3/documentation/archive/tg-bot-integration.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/archive/tg-bot-integration.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# TON Connect for Telegram Bots

:::warning deprecated
This guide explains an outdated method of integrating TON Connect with Telegram bots. For a more secure and modern approach, consider using [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) for a more modern and secure integration.
:::

In this tutorial, we will develop a sample Telegram bot using the JavaScript TON Connect SDK, supporting TON Connect 2.0 authentication.
This guide covers wallet connections, sending transactions, retrieving wallet information, and disconnecting wallets.

<Button href="https://t.me/ton_connect_example_bot" colorType={'primary'} sizeType={'sm'}>

Open Demo Bot

</Button>


<Button href="https://github.com/ton-connect/demo-telegram-bot" colorType={'secondary'} sizeType={'sm'}>

Check out GitHub

</Button>


## Documentation links

- [TON Connect SDK documentation](https://www.npmjs.com/package/@tonconnect/sdk)

## Prerequisites

- You need to create a telegram bot using [@BotFather](https://t.me/BotFather) and save its token.
- Node JS should be installed (we use version 18.1.0 in this tutorial).
- Docker should be installed.


## Creating project

### Setting up dependencies
Start by creating a Node.js project. We will use TypeScript and the [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api) library, though you can choose an alternative library if preferred. Also, we will use [qrcode](https://www.npmjs.com/package/qrcode) library for QR codes generation, but you can replace it with any other same library.

Let's create a directory `ton-connect-bot`. Add the following package.json file there:
```json
{
  "name": "ton-connect-bot",
  "version": "1.0.0",
  "scripts": {
    "compile": "npx rimraf dist && tsc",
    "run": "node ./dist/main.js"
  },
  "dependencies": {
    "@tonconnect/sdk": "^3.0.0-beta.1",
    "dotenv": "^16.0.3",
    "node-telegram-bot-api": "^0.61.0",
    "qrcode": "^1.5.1"
  },
  "devDependencies": {
    "@types/node-telegram-bot-api": "^0.61.4",
    "@types/qrcode": "^1.5.0",
    "rimraf": "^3.0.2",
    "typescript": "^4.9.5"
  }
}
```

Run `npm i` to install dependencies.

### Add a tsconfig.json
Create a `tsconfig.json`:

<details>
<summary>tsconfig.json code</summary>

```json
{
  "compilerOptions": {
    "declaration": true,
    "lib": ["ESNext", "dom"],
    "resolveJsonModule": true,
    "experimentalDecorators": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "target": "es6",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "useUnknownInCatchVariables": false,
    "noUncheckedIndexedAccess": true,
    "emitDecoratorMetadata": false,
    "importHelpers": false,
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "allowJs": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": [
    "./tests","node_modules", "lib", "types"]
}
```
</details>

[Read more about tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Add simple bot code
Create a `.env` file and add your bot token, DAppmanifest and wallets list cache time to live there:

[See more about tonconnect-manifes.json](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest)

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, E.G 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
TELEGRAM_BOT_LINK=<YOUR TG BOT LINK HERE, E.G. https://t.me/ton_connect_example_bot>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
```

Create directory `src` and file `bot.ts` inside. Let's create a TelegramBot instance there:

```ts
// src/bot.ts

import TelegramBot from 'node-telegram-bot-api';
import * as process from 'process';

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new TelegramBot(token, { polling: true });
```

Now we can create an entrypoint file `main.ts` inside the `src` directory:

```ts
// src/main.ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';

bot.on('message', msg => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Received your message');
});
```

Here we go. You can run `npm run compile` and `npm run start`, and send any message to your bot. Bot will reply "Received your message". We are ready for the TonConnect integration.

At the moment we have the following files structure:
```text
ton-connect-bot
├── src
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Connecting a wallet
After installing the  `@tonconnect/sdk`, we can begin by importing it to initialize wallet connections.

We will start with getting wallets list. We need only http-bridge-compatible wallets. Create a folder `ton-connect` into `src` and add `wallets.ts` file there:
We also define function `getWalletInfo` that queries detailed wallet info by its `appName`.
The difference between `name` and `appName` is that `name` is a human-readable label of the wallet, and `appName` is the wallet's uniq identifier.
```ts
// src/ton-connect/wallets.ts

import { isWalletInfoRemote, WalletInfoRemote, WalletsListManager } from '@tonconnect/sdk';

const walletsListManager = new WalletsListManager({
    cacheTTLMs: Number(process.env.WALLETS_LIST_CACHE_TTL_MS)
});

export async function getWallets(): Promise<WalletInfoRemote[]> {
    const wallets = await walletsListManager.getWallets();
    return wallets.filter(isWalletInfoRemote);
}

export async function getWalletInfo(walletAppName: string): Promise<WalletInfo | undefined> {
    const wallets = await getWallets();
    return wallets.find(wallet => wallet.appName.toLowerCase() === walletAppName.toLowerCase());
}
```

Now we need to define a TonConnect storage. TonConnect uses `localStorage` to save connection details when running in the browser, however there is no `localStorage` in NodeJS environment. That's why we should add a custom simple storage implementation.

[See details about TonConnect storage](https://github.com/ton-connect/sdk/tree/main/packages/sdk#init-connector)

Create `storage.ts` inside `ton-connect` directory:

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';

const storage = new Map<string, string>(); // temporary storage implementation. We will replace it with the redis later

export class TonConnectStorage implements IStorage {
  constructor(private readonly chatId: number) {} // we need to have different stores for different users

  private getKey(key: string): string {
    return this.chatId.toString() + key; // we will simply have different keys prefixes for different users
  }

  async removeItem(key: string): Promise<void> {
    storage.delete(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    storage.set(this.getKey(key), value);
  }

  async getItem(key: string): Promise<string | null> {
    return storage.get(this.getKey(key)) || null;
  }
}
```

We are moving on implementing a wallet connection.
Modify `src/main.ts` and add `connect` command. We are going to implement a wallet connection in this command handler.
```ts
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './ton-connect/storage';
import QRCode from 'qrcode';

bot.onText(/\/connect/, async msg => {
  const chatId = msg.chat.id;
  const wallets = await getWallets();

  const connector = new TonConnect({
    storage: new TonConnectStorage(chatId),
    manifestUrl: process.env.MANIFEST_URL
  });

  connector.onStatusChange(wallet => {
    if (wallet) {
      bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
    }
  });

  const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

  const link = connector.connect({
    bridgeUrl: tonkeeper.bridgeUrl,
    universalLink: tonkeeper.universalLink
  });
  const image = await QRCode.toBuffer(link);

  await bot.sendPhoto(chatId, image);
});
```

Let's analyze what we are doing here. Firstly we fetch the wallets list and create a TonConnect instance.
After that we subscribe to wallet change. When user connects a wallet, bot will send a message `${wallet.device.appName} wallet connected!`.
Next we find the Tonkeeper wallet and create connection link. In the end we generate a QR code with the link and send it as a photo to the user.

Now you can run the bot (`npm run compile` and `npm run start` then) and send `/connect` message to the bot. Bot should reply with the QR. Scan it with the Tonkeeper wallet. You will see a message `Tonkeeper wallet connected!` in the chat.


We will use connector in many places, so let's move connector creating code to a separate file:
```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

export function getConnector(chatId: number): TonConnect {
    return new TonConnect({
        manifestUrl: process.env.MANIFEST_URL,
        storage: new TonConnectStorage(chatId)
    });
}
```

And import it in the `src/main.ts`

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import { getConnector } from './ton-connect/connector';

bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const tonkeeper = wallets.find(wallet => wallet.appName === 'tonkeeper')!;

    const link = connector.connect({
        bridgeUrl: tonkeeper.bridgeUrl,
        universalLink: tonkeeper.universalLink
    });
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image);
});
```

At the moment we have the following files structure:
```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Creating connect wallet menu
### Add inline keyboard
We've done the Tonkeeper wallet connection. But we didn't implement connection via universal QR code for all wallets, and didn't allow the user to choose suitable wallet. Let's cover it now.

For better UX we are going to use `callback_query` and `inline_keyboard` Telegram features. If you don't fill familiar with that, you can read more about it [here](https://core.telegram.org/bots/api#callbackquery).

We will implement following UX for wallet connection:
```text
First screen:
<Unified QR>
<Open @wallet>, <Choose a wallet button (opens second screen)>, <Open wallet unified link>

Second screen:
<Unified QR>
<Back (opens first screen)>
<@wallet button (opens third screen)>, <Tonkeeper button (opens third screen)>, <Tonhub button (opens third screen)>, <...>

Third screen:
<Selected wallet QR>
<Back (opens second screen)>
<Open selected wallet link>
```

Let's start with adding inline keyboard to the `/connect` command handler in the `main.ts`
```ts
// src/main.ts
bot.onText(/\/connect/, async msg => {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(async wallet => {
        if (wallet) {
            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            bot.sendMessage(chatId, `${walletName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
});
```

We need to wrap TonConnect deeplink as https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)} because only `http` links are allowed in the Telegram inline keyboard.
Website https://ton-connect.github.io/open-tc just redirects user to link passed in the `connect` query param, so it's only workaround to open `tc://` link in the Telegram.

Note that we replaced `connector.connect` call arguments. Now we are generating a unified link for all wallets.

Next we tell Telegram to call `callback_query` handler with `{ "method": "chose_wallet" }` value when user clicks to the `Choose a Wallet` button.

### Add Choose a Wallet button handler
Create a file `src/connect-wallet-menu.ts`.

Let's add 'Choose a Wallet' button click handler there:

```ts
// src/connect-wallet-menu.ts

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}
```
Here we are replacing the message inline keyboard with a new one that contains clickable list of wallets and 'Back' button.


Now we will add global `callback_query` handler and register `onChooseWalletClick` there:
```ts
// src/connect-wallet-menu.ts
import { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';

export const walletMenuCallbacks = { // Define buttons callbacks
    chose_wallet: onChooseWalletClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponding function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks]) {
        return;
    }

    walletMenuCallbacks[request.method as keyof typeof walletMenuCallbacks](query, request.data);
});

// ... other code from the previous ster
async function onChooseWalletClick ...
```

Here we define buttons handlers list and `callback_query` parser. Unfortunately callback data is always string, so we have to pass JSON to the `callback_data` and parse it later in the `callback_query` handler.
Then we are looking for the requested method and call it with passed parameters.

Now we should add `connect-wallet-menu.ts` import to the `main.ts`
```ts
// src/main.ts

// ... other imports

import './connect-wallet-menu';

// ... other code
```

Compile and run the bot. You can click to the Choose a wallet button and bot will replace inline keyboard buttons!

### Add other buttons handlers
Let's complete this menu and add rest commands handlers.

Firstly we will create a utility function `editQR`. Editing message media (QR image) is a bit tricky. We need to store image to the file and send it to the Telegram server. Then we can remove this file.


```ts
// src/connect-wallet-menu.ts

// ... other code


async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```


In `onOpenUniversalQRClick` handler we just regenerate a QR and deeplink and modify the message:
```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```


In `onWalletClick` handler we are creating special QR and universal link for selected wallet only, and modify the message.
```ts
// src/connect-wallet-menu.ts

// ... other code

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

Now we have to register this functions as callbacks (`walletMenuCallbacks`):

```ts
// src/connect-wallet-menu.ts
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets } from './ton-connect/wallets';
import { bot } from './bot';
import * as fs from 'fs';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

// ... other code
```
<details>
<summary>Currently src/connect-wallet-menu.ts looks like that</summary>

```ts
// src/connect-wallet-menu.ts

import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import { bot } from './bot';
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';
import * as fs from 'fs';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

bot.on('callback_query', query => { // Parse callback data and execute corresponding function
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});


async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {
    const wallets = await getWallets();

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                wallets.map(wallet => ({
                    text: wallet.name,
                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                })),
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({
                            method: 'universal_qr'
                        })
                    }
                ]
            ]
        },
        {
            message_id: query.message!.message_id,
            chat_id: query.message!.chat.id
        }
    );
}

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

async function editQR(message: TelegramBot.Message, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}`, link);

    await bot.editMessageMedia(
        {
            type: 'photo',
            media: `attach://${fileName}`
        },
        {
            message_id: message?.message_id,
            chat_id: message?.chat.id
        }
    );

    await new Promise(r => fs.rm(`./${fileName}`, r));
}
```
</details>

Compile and run the bot to check how wallet connection works now.

You may note that we haven't considered QR code expiration and stopping connectors yet. We will handle it later.


At the moment we have the following files structure:
```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Implement transaction sending
Before write new code that sends a transaction, let's clean up the code. We're going to create a new file for bot commands handlers ('/connect', '/send_tx', ...)

```ts
// src/commands-handlers.ts

import { bot } from './bot';
import { getWallets } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange(wallet => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });
}
```

Let's import that in the `main.ts` and also move `callback_query` entrypoint from `connect-wallet-menu.ts` to the `main.ts`:

```ts
// src/main.ts

import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import './connect-wallet-menu';
import { handleConnectCommand } from './commands-handlers';
import { walletMenuCallbacks } from './connect-wallet-menu';

const callbacks = {
    ...walletMenuCallbacks
};

bot.on('callback_query', query => {
    if (!query.data) {
        return;
    }

    let request: { method: string; data: string };

    try {
        request = JSON.parse(query.data);
    } catch {
        return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
        return;
    }

    callbacks[request.method as keyof typeof callbacks](query, request.data);
});

bot.onText(/\/connect/, handleConnectCommand);
```

```ts
// src/connect-wallet-menu.ts

// ... imports


export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};

async function onChooseWalletClick(query: CallbackQuery, _: string): Promise<void> {

// ... other code
```

Now we can add `send_tx` command handler:

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    connector
        .sendTransaction({
            validUntil: Math.round(Date.now() / 1000) + 600, // timeout is SECONDS
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        })
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

Here we check if user's wallet is connected and process sending transaction.
Then we send a message to the user with a button that opens user's wallet (wallet universal link without additional parameters).
Note that this button contains an empty deeplink. It means that send transaction request data goes through the http-bridge, and transaction will appear it the user's wallet even if he just open the wallet app without clicking to this button.

Let's register this handler:
```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);

bot.onText(/\/send_tx/, handleSendTXCommand);
```

Compile and run the bot to check that transaction sending works correctly.

At the moment we have the following files structure:
```text
bot-demo
├── src
│   ├── ton-connect
│   │   ├── connector.ts
│   │   ├── wallets.ts
│   │   └── storage.ts
│   ├── bot.ts
│   ├── connect-wallet-menu.ts
│   ├── commands-handlers.ts
│   └── main.ts
├── package.json
├── package-lock.json
├── .env
└── tsconfig.json
```

## Add disconnect and show connected wallet commands
This commands implementation is simple enough:

```ts
// src/commands-handlers.ts

// ... other code

export async function handleDisconnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    await connector.disconnect();

    await bot.sendMessage(chatId, 'Wallet has been disconnected');
}

export async function handleShowMyWalletCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, "You didn't connect a wallet");
        return;
    }

    const walletName =
        (await getWalletInfo(connector.wallet!.device.appName))?.name ||
        connector.wallet!.device.appName;


    await bot.sendMessage(
        chatId,
        `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
            connector.wallet!.account.address,
            connector.wallet!.account.chain === CHAIN.TESTNET
        )}`
    );
}
```

And register this commands:
```ts
// src/main.ts

// ... other code

bot.onText(/\/connect/, handleConnectCommand);
bot.onText(/\/send_tx/, handleSendTXCommand);
bot.onText(/\/disconnect/, handleDisconnectCommand);
bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
```

Compile and run the bot to check that commands above works correctly.

## Optimisation
We've done all basic commands. But it is important to keep in mind that each connector keeps SSE connection opened until it is paused.
Also, we didn't handle case when user calls `/connect` multiple times, or calls `/connect` or `/send_tx` and doesn't scan the QR. We should set a timeout and close the connection to save server resources.
Then we should notify user that QR / transaction request is expired.

### Send transaction optimisation
Let's create a utility function that wraps a promise and rejects it after the specified timeout:

```ts
// src/utils.ts

export const pTimeoutException = Symbol();

export function pTimeout<T>(
    promise: Promise<T>,
    time: number,
    exception: unknown = pTimeoutException
): Promise<T> {
    let timer: ReturnType<typeof setTimeout>;
    return Promise.race([
        promise,
        new Promise((_r, rej) => (timer = setTimeout(rej, time, exception)))
    ]).finally(() => clearTimeout(timer)) as Promise<T>;
}
```

You can use this code or pick a library you like.

Let's add a timeout parameter value to the `.env`

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://raw.githubusercontent.com/ton-connect/demo-telegram-bot/master/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
```

Now we are going to improve `handleSendTXCommand` function and wrap tx sending to the `pTimeout`

```ts
// src/commands-handlers.ts

// export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> { ...

pTimeout(
    connector.sendTransaction({
        validUntil: Math.round(
            (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
        ),
        messages: [
            {
                amount: '1000000',
                address: '0:0000000000000000000000000000000000000000000000000000000000000000'
            }
        ]
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
)
    .then(() => {
        bot.sendMessage(chatId, `Transaction sent successfully`);
    })
    .catch(e => {
        if (e === pTimeoutException) {
            bot.sendMessage(chatId, `Transaction was not confirmed`);
            return;
        }

        if (e instanceof UserRejectsError) {
            bot.sendMessage(chatId, `You rejected the transaction`);
            return;
        }

        bot.sendMessage(chatId, `Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

// ... other code
```

<details>
<summary>Full handleSendTXCommand code</summary>

```ts
export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Open Wallet',
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}
```

</details>

If user doesn't confirm the transaction during `DELETE_SEND_TX_MESSAGE_TIMEOUT_MS` (10min), the transaction will be cancelled and bot will send a message `Transaction was not confirmed`.

You can set this parameter to `5000` compile and rerun the bot and test its behaviour.

### Wallet connect flow optimisation
At this moment we create a new connector on the every navigation through the wallet connection menu step.
That is poorly because we don't close previous connectors connection when create new connectors.
Let's improve this behaviour and create a cache-mapping for users connectors.

<details>
<summary>src/ton-connect/connector.ts code</summary>

```ts
// src/ton-connect/connector.ts

import TonConnect from '@tonconnect/sdk';
import { TonConnectStorage } from './storage';
import * as process from 'process';

type StoredConnectorData = {
    connector: TonConnect;
    timeout: ReturnType<typeof setTimeout>;
    onConnectorExpired: ((connector: TonConnect) => void)[];
};

const connectors = new Map<number, StoredConnectorData>();

export function getConnector(
    chatId: number,
    onConnectorExpired?: (connector: TonConnect) => void
): TonConnect {
    let storedItem: StoredConnectorData;
    if (connectors.has(chatId)) {
        storedItem = connectors.get(chatId)!;
        clearTimeout(storedItem.timeout);
    } else {
        storedItem = {
            connector: new TonConnect({
                manifestUrl: process.env.MANIFEST_URL,
                storage: new TonConnectStorage(chatId)
            }),
            onConnectorExpired: []
        } as unknown as StoredConnectorData;
    }

    if (onConnectorExpired) {
        storedItem.onConnectorExpired.push(onConnectorExpired);
    }

    storedItem.timeout = setTimeout(() => {
        if (connectors.has(chatId)) {
            const storedItem = connectors.get(chatId)!;
            storedItem.connector.pauseConnection();
            storedItem.onConnectorExpired.forEach(callback => callback(storedItem.connector));
            connectors.delete(chatId);
        }
    }, Number(process.env.CONNECTOR_TTL_MS));

    connectors.set(chatId, storedItem);
    return storedItem.connector;
}
```

</details>

This code may look a little tricky, but here we go.
Here we store a connector, it's cleaning timeout and list of callback that should be executed after the timeout for each user.

When `getConnector` is called we check if there is an existing connector for this `chatId` (user) it the cache. If it exists we reset the cleaning timeout and return the connector.
That allows keep active users connectors in cache. It there is no connector in the cache we create a new one, register a timeout clean function and return this connector.

To make it works we have to add a new parameter to the `.env`

```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
```

Now let's use it in the handelConnectCommand

<details>
<summary>src/commands-handlers.ts code</summary>

```ts
// src/commands-handlers.ts

import {
    CHAIN,
    isWalletInfoRemote,
    toUserFriendlyAddress,
    UserRejectsError
} from '@tonconnect/sdk';
import { bot } from './bot';
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import QRCode from 'qrcode';
import TelegramBot from 'node-telegram-bot-api';
import { getConnector } from './ton-connect/connector';
import { pTimeout, pTimeoutException } from './utils';

let newConnectRequestListenersMap = new Map<number, () => void>();

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;

        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>

We defined `newConnectRequestListenersMap` to store cleanup callback for the last connect request for each user.
If user calls `/connect` multiple times, bot will delete previous message with QR.
Also, we subscribed to the connector expiration timeout to delete the QR-code message when it is expired.


Now we should remove `connector.onStatusChange` subscription from the `connect-wallet-menu.ts` functions,
because they use the same connector instance and one subscription in the `handleConnectCommand` in enough.

<details>
<summary>src/connect-wallet-menu.ts code</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: 'Choose a Wallet',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: 'Open Link',
                        url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(
                            link
                        )}`
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const wallets = await getWallets();

    const selectedWallet = wallets.find(wallet => wallet.name === data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    await editQR(query.message!, link);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${data}`,
                        url: link
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

That's it! Compile and run the bot and try to call `/connect` twice.

### Improve interaction with @wallet
Starting from v3 TonConnect supports connection to TWA wallets like @wallet. At the moment in the tutorial the bot could be connected to the @wallet.
However, we should improve redirection strategy to provide better UX. Moreover, let's add `Connect @wallet` button to the first ("Universal QR") screen.

First, let's create some utility functions:
```ts
// src/utils.ts
import { encodeTelegramUrlParameters, isTelegramUrl } from '@tonconnect/sdk';

export const AT_WALLET_APP_NAME = 'telegram-wallet';

// ... other code
export function addTGReturnStrategy(link: string, strategy: string): string {
    const parsed = new URL(link);
    parsed.searchParams.append('ret', strategy);
    link = parsed.toString();

    const lastParam = link.slice(link.lastIndexOf('&') + 1);
    return link.slice(0, link.lastIndexOf('&')) + '-' + encodeTelegramUrlParameters(lastParam);
}

export function convertDeeplinkToUniversalLink(link: string, walletUniversalLink: string): string {
    const search = new URL(link).search;
    const url = new URL(walletUniversalLink);

    if (isTelegramUrl(walletUniversalLink)) {
        const startattach = 'tonconnect-' + encodeTelegramUrlParameters(search.slice(1));
        url.searchParams.append('startattach', startattach);
    } else {
        url.search = search;
    }

    return url.toString();
}
```

TonConnect parameters in Telegram links have to be encoded in special way, that's why we use `encodeTelegramUrlParameters` to encode return strategy parameter.
We will use `addTGReturnStrategy` to provide correct return url to the demo bot for @wallet.

Since we use Universal QR page creation code in two places, we are moving it to the separate function:
```ts
// src/utils.ts

// ... other code

export async function buildUniversalKeyboard(
    link: string,
    wallets: WalletInfoRemote[]
): Promise<InlineKeyboardButton[]> {
    const atWallet = wallets.find(wallet => wallet.appName.toLowerCase() === AT_WALLET_APP_NAME);
    const atWalletLink = atWallet
        ? addTGReturnStrategy(
            convertDeeplinkToUniversalLink(link, atWallet?.universalLink),
            process.env.TELEGRAM_BOT_LINK!
        )
        : undefined;

    const keyboard = [
        {
            text: 'Choose a Wallet',
            callback_data: JSON.stringify({ method: 'chose_wallet' })
        },
        {
            text: 'Open Link',
            url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}`
        }
    ];

    if (atWalletLink) {
        keyboard.unshift({
            text: '@wallet',
            url: atWalletLink
        });
    }

    return keyboard;
}
```

Here we are adding separate button for @wallet to the First screen (Universal QR screen). All that remains is to use this function in
connect-wallet-menu and command-handlers:


<details>
<summary>src/connect-wallet-menu.ts code</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code

async function onOpenUniversalQRClick(query: CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    const link = connector.connect(wallets);

    await editQR(query.message!, link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [keyboard]
        },
        {
            message_id: query.message?.message_id,
            chat_id: query.message?.chat.id
        }
    );
}

// ... other code
```

</details>

<details>
<summary>src/commands-handlers.ts code</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleConnectCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;
    let messageWasDeleted = false;

    newConnectRequestListenersMap.get(chatId)?.();

    const connector = getConnector(chatId, () => {
        unsubscribe();
        newConnectRequestListenersMap.delete(chatId);
        deleteMessage();
    });

    await connector.restoreConnection();
    if (connector.connected) {
        const connectedName =
            (await getWalletInfo(connector.wallet!.device.appName))?.name ||
            connector.wallet!.device.appName;
        await bot.sendMessage(
            chatId,
            `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
                connector.wallet!.account.address,
                connector.wallet!.account.chain === CHAIN.TESTNET
            )}\n\n Disconnect wallet firstly to connect a new one`
        );

        return;
    }

    const unsubscribe = connector.onStatusChange(async wallet => {
        if (wallet) {
            await deleteMessage();

            const walletName =
                (await getWalletInfo(wallet.device.appName))?.name || wallet.device.appName;
            await bot.sendMessage(chatId, `${walletName} wallet connected successfully`);
            unsubscribe();
            newConnectRequestListenersMap.delete(chatId);
        }
    });

    const wallets = await getWallets();

    const link = connector.connect(wallets);
    const image = await QRCode.toBuffer(link);

    const keyboard = await buildUniversalKeyboard(link, wallets);

    const botMessage = await bot.sendPhoto(chatId, image, {
        reply_markup: {
            inline_keyboard: [keyboard]
        }
    });

    const deleteMessage = async (): Promise<void> => {
        if (!messageWasDeleted) {
            messageWasDeleted = true;
            await bot.deleteMessage(chatId, botMessage.message_id);
        }
    };

    newConnectRequestListenersMap.set(chatId, async () => {
        unsubscribe();

        await deleteMessage();

        newConnectRequestListenersMap.delete(chatId);
    });
}

// ... other code
```

</details>


Now we are going to handle TG links properly when user clicks to a wallet button on the second Screen (Choosing a wallet):

<details>
<summary>src/connect-wallet-menu.ts code</summary>

```ts
// src/connect-wallet-menu.ts

// ... other code


async function onWalletClick(query: CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    let buttonLink = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl,
        universalLink: selectedWallet.universalLink
    });

    let qrLink = buttonLink;

    if (isTelegramUrl(selectedWallet.universalLink)) {
        buttonLink = addTGReturnStrategy(buttonLink, process.env.TELEGRAM_BOT_LINK!);
        qrLink = addTGReturnStrategy(qrLink, 'none');
    }

    await editQR(query.message!, qrLink);

    await bot.editMessageReplyMarkup(
        {
            inline_keyboard: [
                [
                    {
                        text: '« Back',
                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                    },
                    {
                        text: `Open ${selectedWallet.name}`,
                        url: buttonLink
                    }
                ]
            ]
        },
        {
            message_id: query.message?.message_id,
            chat_id: chatId
        }
    );
}

// ... other code
```

</details>

Note that we place different links to the QR and button-link (`qrLink` and `buttonLink`),
because we don't need redirection when user scans QR by @wallet, and at the same time we need redirect back to the bot when user connects @wallet using button-link.


Now let's add return strategy for TG links in `send transaction` handler:

<details>
<summary>src/commands-handlers.ts code</summary>

```ts
// src/commands-handlers.ts

// ... other code

export async function handleSendTXCommand(msg: TelegramBot.Message): Promise<void> {
    const chatId = msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
        await bot.sendMessage(chatId, 'Connect wallet to send transaction');
        return;
    }

    pTimeout(
        connector.sendTransaction({
            validUntil: Math.round(
                (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) / 1000
            ),
            messages: [
                {
                    amount: '1000000',
                    address: '0:0000000000000000000000000000000000000000000000000000000000000000'
                }
            ]
        }),
        Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)
    )
        .then(() => {
            bot.sendMessage(chatId, `Transaction sent successfully`);
        })
        .catch(e => {
            if (e === pTimeoutException) {
                bot.sendMessage(chatId, `Transaction was not confirmed`);
                return;
            }

            if (e instanceof UserRejectsError) {
                bot.sendMessage(chatId, `You rejected the transaction`);
                return;
            }

            bot.sendMessage(chatId, `Unknown error happened`);
        })
        .finally(() => connector.pauseConnection());

    let deeplink = '';
    const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
    if (walletInfo) {
        deeplink = walletInfo.universalLink;
    }

    if (isTelegramUrl(deeplink)) {
        const url = new URL(deeplink);
        url.searchParams.append('startattach', 'tonconnect');
        deeplink = addTGReturnStrategy(url.toString(), process.env.TELEGRAM_BOT_LINK!);
    }

    await bot.sendMessage(
        chatId,
        `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Open ${walletInfo?.name || connector.wallet!.device.appName}`,
                            url: deeplink
                        }
                    ]
                ]
            }
        }
    );
}

// ... other code
```

</details>

That is it. Now user is able to connect @wallet using special button on the main screen, also we have provided proper return strategy for TG links.

## Add a permanent storage
At this moment we store TonConnect sessions in the Map object. But you may want to store it to the database or other permanent storage to save the sessions when you restart the server.
We will use Redis for that, but you can pick any permanent storage.

### Set up redis
Firstly run `npm i redis`.

[See package details](https://www.npmjs.com/package/redis)

To work with redis you have to start redis server. We will use the Docker image:
`docker run -p 6379:6379 -it redis/redis-stack-server:latest`

Now add redis connection parameter to the `.env`. Default redis url is `redis://127.0.0.1:6379`.
```dotenv
# .env
TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN, LIKE 1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA>
MANIFEST_URL=https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json
WALLETS_LIST_CACHE_TTL_MS=86400000
DELETE_SEND_TX_MESSAGE_TIMEOUT_MS=600000
CONNECTOR_TTL_MS=600000
REDIS_URL=redis://127.0.0.1:6379
```

Let's integrate redis to the `TonConnectStorage`:

```ts
// src/ton-connect/storage.ts

import { IStorage } from '@tonconnect/sdk';
import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', err => console.log('Redis Client Error', err));

export async function initRedisClient(): Promise<void> {
    await client.connect();
}
export class TonConnectStorage implements IStorage {
    constructor(private readonly chatId: number) {}

    private getKey(key: string): string {
        return this.chatId.toString() + key;
    }

    async removeItem(key: string): Promise<void> {
        await client.del(this.getKey(key));
    }

    async setItem(key: string, value: string): Promise<void> {
        await client.set(this.getKey(key), value);
    }

    async getItem(key: string): Promise<string | null> {
        return (await client.get(this.getKey(key))) || null;
    }
}
```

To make it work we have to wait for the redis initialisation in the `main.ts`. Let's wrap code in this file to an async function:
```ts
// src/main.ts
// ... imports

async function main(): Promise<void> {
    await initRedisClient();

    const callbacks = {
        ...walletMenuCallbacks
    };

    bot.on('callback_query', query => {
        if (!query.data) {
            return;
        }

        let request: { method: string; data: string };

        try {
            request = JSON.parse(query.data);
        } catch {
            return;
        }

        if (!callbacks[request.method as keyof typeof callbacks]) {
            return;
        }

        callbacks[request.method as keyof typeof callbacks](query, request.data);
    });

    bot.onText(/\/connect/, handleConnectCommand);

    bot.onText(/\/send_tx/, handleSendTXCommand);

    bot.onText(/\/disconnect/, handleDisconnectCommand);

    bot.onText(/\/my_wallet/, handleShowMyWalletCommand);
}

main();
```

## Summary

What is next?
- If you want to run the bot in production you may want to install and use a process manager like [pm2](https://pm2.keymetrics.io/).
- You can add better errors handling in the bot.

## See Also
- [Sending messages](/v3/guidelines/ton-connect/guidelines/sending-messages)
- [Integration Manual](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/assets/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/assets/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Asset processing overview

Here you can find a **short overview** on [how TON transfers work](/v3/documentation/dapps/assets/overview#overview-on-messages-and-transactions), what [asset types](/v3/documentation/dapps/assets/overview#digital-asset-types-on-ton) can you find in TON (and what about will you read [next](/v3/documentation/dapps/assets/overview#read-next)) and how to [interact with ton](/v3/documentation/dapps/assets/overview#interaction-with-ton-blockchain) using your programming language, it's recommended to understand all information, discovered below, before going to the next pages.

## Overview on messages and transactions

Embodying a fully asynchronous approach, TON Blockchain involves a few concepts which are uncommon to traditional blockchains. Particularly, each interaction of any actor with the blockchain consists of a graph of asynchronously transferred [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions) between smart contracts and/or the external world. Each transaction consists of one incoming message and up to 255 outgoing messages.

There are 3 types of messages, that are fully described [here](/v3/documentation/smart-contracts/message-management/sending-messages#types-of-messages). To put it briefly:
* [external message](/v3/documentation/smart-contracts/message-management/external-messages):
  *  `external in message` (sometimes called just `external message`) is message that is sent from *outside* of the blockchain to a smart contract *inside* the blockchain.
  *  `external out message` (usually called `logs message`) is sent from a *blockchain entity* to the *outer world*.
* [internal message](/v3/documentation/smart-contracts/message-management/internal-messages) is sent from one *blockchain entity* to *another*, can carry some amount of digital assets and arbitrary portion of data.

The common path of any interaction starts with an external message sent to a `wallet` smart contract, which authenticates the message sender using public-key cryptography, takes charge of fee payment, and sends internal blockchain messages. That messages queue form directional acyclic graph, or a tree.

For example:

![](/img/docs/asset-processing/alicemsgDAG.svg)

* `Alice` use e.g [Tonkeeper](https://tonkeeper.com/) to send an `external message` to her wallet.
* `external message` is the input message for `wallet A v4` contract with empty source (a message from nowhere, such as [Tonkeeper](https://tonkeeper.com/)).
* `outgoing message` is the output message for `wallet A v4` contract and input message for `wallet B v4` contract with `wallet A v4` source and `wallet B v4` destination.

As a result there are 2 transactions with their set of input and output messages.

Each action, when contract take message as input (triggered by it), process it and generate or not generate outgoing messages as output, called `transaction`. Read more about transactions [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction).

That `transactions` can span a **prolonged period** of time. Technically, transactions with queues of messages are aggregated into blocks processed by validators. The asynchronous nature of the TON Blockchain **does not allow to predict the hash and lt (logical time) of a transaction** at the stage of sending a message.

The `transaction` accepted to the block is final and cannot be modified.

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Smart contracts pay several types of [fees](/v3/documentation/smart-contracts/transaction-fees/fees) for transactions (usually from the balance of an incoming message, behavior depends on [message mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)). Amount of fees depends on workchain configs with maximal fees on `masterchain` and substantially lower fees on `basechain`.

## Digital asset types on TON

TON has three types of digital assets.
- Toncoin, the main token of the network. It is used for all basic operations on the blockchain, for example, paying gas fees or staking for validation.
- Contract assets, such as tokens and NFTs, which are analogous to the ERC-20/ERC-721 standards and are managed by arbitrary contracts and thus can require custom rules for processing. You can find more info on it's processing in [process NFTs](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) and [process Jettons](/v3/guidelines/dapps/asset-processing/jettons) articles.
- Native token, which is special kind of assets that can be attached to any message on the network. But these asset is currently not in use since the functionality for issuing new native tokens is closed.

## Interaction with TON Blockchain
Basic operations on TON Blockchain can be carried out via TonLib. It is a shared library which can be compiled along with a TON node and expose APIs for interaction with the blockchain via so-called lite servers (servers for lite clients). TonLib follows a trustless approach by checking proofs for all incoming data; thus, there is no necessity for a trusted data provider. Methods available to TonLib are listed [in the TL scheme](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234). They can be used either as a shared library via [wrappers](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks).

## Read next

After reading this article you can check:
1. [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) to get how to work with `TON coins`
2. [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons) to get how to work with `jettons` (sometime called `tokens`)
3. [NFT processing](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) to get how to work with `NFT` (that is the special type of `jetton`)

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/assets/usdt.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/assets/usdt.md
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# USDT processing

## Tether

[Apr 18, 2023](https://t.me/toncoin/824), the public launch of native USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a>.

In TON Blockchain USD₮ supported as a [Jetton asset](/v3/guidelines/dapps/asset-processing/jettons).

:::info
To integrate Tether’s USD₮ Token on TON Blockchain use the contract address:
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>


## Advantages of USD₮ on TON

### Seamless Telegram integration

[USD₮ on TON](https://ton.org/borderless) will be seamlessly integrated into Telegram, offering a uniquely user-friendly experience that positions TON as the most convenient blockchain for USDt transactions. This integration will simplify DeFi for Telegram users, making it more accessible and understandable.

### Lower transaction fees

Fees for Ethereum USD₮ transfers are calculated dynamically depending on network load. This is why transactions can become expensive.

 ```cpp
transaction_fee = gas_used * gas_price
```

* `gas_used` is the amount of gas used during transaction execution.
* `gas_price` is the cost of one unit of gas in Gwei, calculated dynamically.

On the other hand average fee for sending any amount of USD₮ in TON Blockchain is about 0.0145 TON nowadays. Even if the price of TON increases 100 times, transactions will [remain ultra-cheap](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). The core TON development team has optimized Tether’s smart contract to make it three times cheaper than any other Jetton.

### Faster and scalable

TON’s high throughput and rapid confirmation times enable USD₮ transactions to be processed more quickly than ever before.

## Advanced details

:::caution IMPORTANT
In TON Blockchain jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

See important [recommendations](/v3/guidelines/dapps/asset-processing/jettons).
:::

## See also

* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/dapps-overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/dapps-overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Overview

*TON decentralized applications (DApps)* leverage blockchain technology, utilizing smart contracts as their backend. 

This documentation provides essential guidance for developers looking to build on TON, covering DeFi applications, digital asset management, and the integration of oracles for external data. 

## DeFi

### Native token: Toncoin

Toncoin, the native cryptocurrency of the TON blockchain, detailing its roles in transaction fees, gas payments, and validator staking, along with guidelines for managing and transferring Toncoin within dApps.

- [Native token: Toncoin](/v3/documentation/dapps/defi/coins/)

### Jetton : fungible tokens
Fungible tokens (Jettons) on TON, describing their smart contract implementation, issuance processes, and integration techniques for use within decentralized applications.
- [Tokens (FT, NFT)](/v3/documentation/dapps/defi/tokens/)

### NFT : non-fungible tokens 
Overview of Non-Fungible Tokens (NFTs) and Fungible Tokens (FT) on TON, explaining their application in representing unique digital assets, along with practical use cases and best practices.
- [NFT use cases](/v3/documentation/dapps/defi/nft/)

### Asset processing
Offers a general overview of asset processing on TON, covering asset types such as Toncoin, Jettons, and NFTs, alongside methods for managing transactions and assets within applications using TON libraries and SDKs.
- [Asset processing](/v3/documentation/dapps/assets/overview/)

### USDT
USDT on TONFocuses on the implementation and usage of Tether’s USD₮ stablecoin as a Jetton on the TON blockchain, emphasizing advantages like low fees and high throughput, with key integration details for developers.
- [USDT processing](/v3/documentation/dapps/assets/usdt/)

## Oracles

### TON oracles
Blockchain OraclesDescribes blockchain oracles and their importance in providing off-chain data to smart contracts, outlining general mechanisms for securely bridging external information with blockchain-based applications.
- [Oracles overview](/v3/documentation/dapps/oracles/about_blockchain_oracles/) 

### Pyth
Pyth Network's real-time price feed oracle, detailing integration methods, SDK usage, and example implementations for developers to incorporate reliable market data into their dApps.
- [Pyth](/v3/documentation/dapps/oracles/pyth/) 

### RedStone

RedStone's oracle solution, focusing on its on-demand data delivery method, including practical steps for attaching and verifying signed data packages within smart contracts, optimizing data efficiency in TON applications.

- [RedStone](/v3/documentation/dapps/oracles/red_stone/)
<Feedback />




================================================
FILE: docs/v3/documentation/dapps/defi/coins.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/defi/coins.md
================================================
import Feedback from '@site/src/components/Feedback';

# Native token: Toncoin

The native cryptocurrency of TON Blockchain is **Toncoin**.

Transaction fees, gas payments (i.e., smart contract message processing fees), and persistent storage payments are collected in Toncoin.

Toncoin is used to make the deposits required to become a blockchain validator.

The process of making Toncoin payments is described in the [corresponding section](/v3/guidelines/dapps/asset-processing/payments-processing).

You can find out where to buy or exchange Toncoin on the [website](https://ton.org/coin).

## Extra currencies

TON Blockchain supports up to 2^32 built-in extra currencies. 

Extra currency balances can be stored on each blockchain account and transferred to other accounts natively (in an internal message from one smart contract to another, you can specify a hashmap of the extra currency amounts in addition to the Toncoin amount).

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - hashmap of currency ID and amount.

However, extra currencies can only be stored and transferred (like Toncoin) and do not have their own arbitrary code or functionality.

Note that if there are a large number of extra currencies created, the accounts will "swell" because they need to store them.

Thus, extra currencies are best used for well-known decentralized currencies (for example, Wrapped Bitcoin or Ether), and creating such an extra currency should be quite expensive.

[Jettons](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens) are suitable for other tasks.

At the moment, no extra currency has been created on TON Blockchain. TON Blockchain has full support for extra currencies by accounts and messages, but the minter system contract for their creation has not yet been created. 

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/defi/nft.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/defi/nft.md
================================================
---
---

import Feedback from '@site/src/components/Feedback';

# NFT use cases

NFTs, or non-fungible tokens, are a type of digital asset that is unique, and cannot be replaced by another identical asset. This article describes the approaches and already implemented use cases of NFTs in TON Blockchain.

After reading this article, you will understand why are NFTs helpful and how you can use them in one of your projects.

## Item ownership

Non-fungible tokens are mostly known as cool pictures that you can buy and sell on NFT marketplaces like OpenSea or [getgems.io](https://getgems.io).

NFT pictures and collections are funny and help people understand the concept of blockchain-based ownership. However, in the long-term, the NFT focus should shift beyond this to illustrate their wide variety of potential use cases.

## Support an artist

One of the initial motivations behind the development of NFTs was finding a way to support artists by buying their works packed as collections of NFTs stored in the blockchain.

In this way, artists could make money from selling new works and also from the royalties they would receive after the NFT was later resold on the market.

This is one of the most common reasons why marketplaces like getgems.io or OpenSea are part of the essential infrastructure of any blockchain nowadays.

## Accounts as NFTs

In November, the Telegram team launched [Fragment](https://fragment.com/) marketplace, where anyone can buy and sell Telegram usernames or Anonymous Numbers backed by an NFT on the TON Blockchain.

Moreover, in December the Telegram team released [No-SIM sign-up](https://telegram.org/blog/ultimate-privacy-topics-2-0#sign-up-without-a-sim-card). You can buy a **virtual phone number** as an NFT to sign up in the Telegram Messenger and ensure that your privacy is secured by the TON Blockchain.

## Web3 Domain as an NFT

There is TON DNS service, which works fully onchain. It allows users to buy domains of format `mystore.ton` (the most convenient way to do that is via [DNS marketplace](https://dns.ton.org/)), and ensures unused domains are returned into circulation by requiring owner to pay a small, fixed fee to renew the domain.

NFT Telegram usernames from Fragment can also be used in TON DNS; `yourname.t.me` is a valid domain.

### Use cases of TON domains

1. You can set domain to resolve to your wallet address, so a person unfamiliar with crypto can transfer money not to `EQDyo...zuDf` but to easily readable `mystore.ton`.
2. You can attach a [TON Site](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site) to the domain; then, it will be accessible in TON Web3 network under a convenient name.

## Ticket as an NFT

NFT tickets provide an excellent solution for verifying access to events, like concerts or conferences.

Owning an NFT ticket offers several unique advantages:

First and foremost, NFT tickets cannot be forged or copied, eliminating the possibility of fraudulent sale of fake tickets. This ensures that buyers can trust the authenticity of the ticket and the legitimacy of the seller, giving them confidence in what they're paying for.

Secondly, NFT tickets open up exciting opportunities for collecting. As the owner of an NFT ticket, you can store it in your digital wallet and have access to a whole collection of tickets from various events. In particular, TON has created a leaderboard for participating in their conferences on [society.ton.org](https://society.ton.org/contributors?tab=leaderboard). This creates a new form of aesthetic and financial satisfaction for music and art lovers.

Thirdly, NFT tickets provide accessibility and convenience. They can be easily transferred using digital wallets, freeing users from the hassle of physically receiving or sending tickets. The process of exchanging tickets with friends or purchasing them on the secondary market becomes simpler and more convenient.

Additionally, owning an NFT ticket can come with extra benefits and special privileges. Some artists or organizers may offer NFT ticket holders exclusive backstage access, meet-and-greets with artists, or other bonuses, adding to the unique cultural experience for NFT ticket holders.

## Authorization token as an NFT

Using NFTs as authorization tokens introduces a revolutionary approach to granting access rights and permissions.

NFT tokens ensure elevated security and cannot be easily copied or forged. This eliminates the risk of unauthorized access or fake authentication, providing reliable authentication.

Furthermore, thanks to their transparency and traceability, the authenticity and ownership of an NFT authorization token can be easily verified. This enables quick and efficient verification, ensuring convenient access to various platforms, services, or restricted content.

It is also worth mentioning that NFTs provide flexibility and adaptability in managing permissions. Since NFTs can be programmatically encoded with specific access rules or attributes, they can adapt to different authorization requirements. This flexibility allows for fine-grained control over access levels, granting or revoking permissions as needed, which can be particularly valuable in scenarios that require hierarchical access or temporary authorization restrictions.

One of the services currently offering NFT authentication is [Playmuse](https://playmuse.org/), a media service built on the TON blockchain. This service aims to attract Web3 musicians as well as other creators.

Owners of NFTs from Playmuse gain access to the holders chat. Being a participant in this chat provides opportunity to influence the development direction of the service, vote on various initiatives, and receive early access to presales and NFT auctions featuring renowned creators.

Access to the chat is facilitated through a Telegram bot, which verifies the presence of a Playmuse NFT in the user's wallet.

It is important to note that this is just one example, and as the TON ecosystem evolves, new services and technologies for authentication via NFTs may emerge. Keeping up with the latest developments in the TON space can help identify other platforms or open-source projects that provide similar authentication capabilities.

## NFT as a virtual asset in games

NFT integrated to a game allows players to own and trade in-game items in a way that is verifiable and secure, which adds an extra layer of value and excitement to the game.

<Feedback />



================================================
FILE: docs/v3/documentation/dapps/defi/subscriptions.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/defi/subscriptions.md
================================================
import Feedback from '@site/src/components/Feedback';

# Content subscriptions

Due to the fact that transactions in TON Blockchain are fast and the network fees are low, you can process recurring payments on-chain via smart contracts.

For example, users can subscribe to digital content (or anything else) and be charged a monthly fee of 1 TON.

:::tip
This content is specific for wallets of version v4. Older wallets don't have this functionality; it is eligible to change in future versions as well.
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

On the other hand, user can't get subscription installed without their knowledge.
:::

## Example flow

- Users use a v4 wallet. It allows additional smart contracts, known as plugins, to extend its functionality.

   After ensuring their functionality, the user can approve the addresses of trusted smart contracts (plugins) for his wallet. Following that, the trusted smart contracts can withdraw Toncoin from the wallet. This is similar to "Infinite Approval" in some other blockchains.

- An intermediate subscription smart contract is used between each user and service as a wallet plugin.

   This smart contract guarantees that a specified amount of Toncoin will be debited from a user's wallet no more than once within a specified period.

- The service's backend initiates payments on a regular basis by sending an external message to subscription smart contracts.

- Either user or service can decide they no longer need a subscription and terminate it.

## Smart contract examples

* [Wallet v4 smart contract source code](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
* [Subscription smart contract source code](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## Implementation

A good example of implementation is decentralized subscriptions for Toncoin to private channels in Telegram by the [@donate](https://t.me/donate) bot and the [Tonkeeper wallet](https://tonkeeper.com).
<Feedback />




================================================
FILE: docs/v3/documentation/dapps/defi/tokens.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/defi/tokens.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# Tokens (FT, NFT)

[Distributed TON tokens overview](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

> TON-powered tokens and NFTs are decentralized, avoiding single points of failure and bottlenecks.
>
> Each NFT in a given collection is a separate smart contract. The token balance for each user is stored in a separate user wallet.
>
> Smart contracts interact directly with one another, distributing the load across the entire network.
>
> As the number of users and transactions grows, the network maintains an even load, enabling seamless scalability.

## TON Course: jettons & NFTs

:::tip
Before starting the course, make sure you have a good understanding of the basics of blockchain technology. If you have gaps in your knowledge, we recommend taking the [Blockchain Basics with TON](https://stepik.org/course/201294/promo) ([RU version](https://stepik.org/course/202221/), [CHN version](https://stepik.org/course/200976/)) course.
Module 4 covers the basic knowledge of NFT & Jettons.
:::

The [TON Blockchain Course](https://stepik.org/course/176754/) is a comprehensive guide to TON Blockchain development.

Module 7 completely covers __NFT & Jettons__ development.


<Button href="https://stepik.org/course/176754/promo"
        colorType={'primary'} sizeType={'sm'}>

Check TON Blockchain Course

</Button>


<Button href="https://stepik.org/course/201638/promo"
        colorType={'secondary'} sizeType={'sm'}>

CHN

</Button>


<Button href="https://stepik.org/course/201855/promo"
        colorType={'secondary'} sizeType={'sm'}>

RU

</Button>


## Tutorials
* [Web3 Game Tutorial](/v3/guidelines/dapps/tutorials/web3-game-example) - Learn how to build a Web3 game with TON Blockchain.
* [Mint your first Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token/) — Learn how to deploy and customize your first Jetton
* [[YouTube] TON Keeper founders Oleg Andreev and Oleg Illarionov on TON jettons](https://www.youtube.com/watch?v=oEO29KmOpv4)

### TON speed run

  - [🚩 Challenge 1: Simple NFT Deploy](https://github.com/romanovichim/TONQuest1)
  - [🚩 Challenge 2: Chatbot Contract](https://github.com/romanovichim/TONQuest2)
  - [🚩 Challenge 3: Jetton Vending Machine](https://github.com/romanovichim/TONQuest3)
  - [🚩 Challenge 4: Lottery/Raffle](https://github.com/romanovichim/TONQuest4)
  - [🚩 Challenge 5: Create UI to interact with the contract in 5 minutes](https://github.com/romanovichim/TONQuest5)
  - [🚩 Challenge 6: Analyzing NFT sales on the Getgems marketplace](https://github.com/romanovichim/TONQuest6)


## Jettons (fungible tokens)

### Guides
* [TON Jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
* [TON Metadata Parsing](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

### Standards

* [Jettons standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)

### Smart contracts

* [Smart contracts implementation (FunC)](https://github.com/ton-blockchain/token-contract/)

### Jetton deployer

Jettons are custom fungible tokens on TON Blockchain. You can create your own token on TON Blockchain using the Jetton Deployer example below:

* **[TON Minter](https://minter.ton.org/)** — open-source Jetton Deployer dApp
* [Jetton Deployer — contracts](https://github.com/ton-defi-org/jetton-deployer-contracts) (FunC, TL-B)
* [Jetton Deployer — WebClient](https://github.com/ton-defi-org/jetton-deployer-webclient) (React, TypeScript)

### Tools to work with jettons

* [NFT Jetton Sale Contract](https://github.com/dvlkv/nft-jetton-sale-smc) - NFT Sale contract with jetton support
* [Scaleton](http://scaleton.io)—see your custom token balance
* [@tegro/ton3-client](https://github.com/TegroTON/ton3-client#jettons-example)—SDK to query information about Jettons

## NFT

### Standards

* [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
* [SBT (Soulbound NFT) standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md)
* [NFTRoyalty standard extension](https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md)


### Smart contracts

* [Smart contracts implementation (FunC)](https://github.com/ton-blockchain/token-contract/)
* [Getgems NFT, sale, auctions smart contracts (FunC)](https://github.com/getgems-io/nft-contracts)

### NFT minters

* [NFT Deployer](https://github.com/tondiamonds/ton-nft-deployer) by TON Diamonds (TypeScript, no comments)
* [NFT Minter example](https://github.com/ton-foundation/token-contract/tree/main/nft/web-example) (JavaScript, with comments)
* [NFT Minter using React](https://github.com/tonbuilders/tonbuilders-minter) (React, no comments)
* [NFT Deployer](https://github.com/anomaly-guard/nft-deployer) (Python, with comments)
* [NFT Minter using Golang](https://github.com/xssnick/tonutils-go#nft) (Golang library, with comments and full examples)

### Tools to work with NFTs

* [LiberMall/tnt](https://github.com/LiberMall/tnt)—TNT is an all-in-one command-line tool to query, edit, and mint new Non-Fungible Tokens on The Open Network.

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/defi/ton-payments.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/defi/ton-payments.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON Payments

TON Payments is the platform for micropayment channels. 

It allows instant payments without the need to commit all transactions to the blockchain, pay the associated transaction fees (e.g., for the gas consumed), and wait five seconds until the block
containing the transactions in question is confirmed.

Because the overall expense of such instant payments is so minimal, they can be used for micropayments in games, APIs, and off-chain apps. [See examples](/v3/documentation/dapps/defi/ton-payments#examples).

* [Payments on TON](https://blog.ton.org/ton-payments)

## Payment channels

### Smart contracts

* [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

To use payment channels, you don’t need deep knowledge of cryptography.

You can use prepared SDKs:

* [toncenter/tonweb](https://github.com/toncenter/tonweb)  JavaScript SDK
* [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example)—how to use a payments channel with tonweb.

### Examples

Find examples of using payment channels in the [Hack-a-TON #1](https://ton.org/hack-a-ton-1) winners:

* [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON)—OnlyTONs payments project ([website](https://main.d3puvu1kvbh8ti.amplifyapp.com/), [video](https://www.youtube.com/watch?v=38JpX1vRNTk))
* [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario)—OnlyGrams payments project ([website](https://onlygrams.io/), [video](https://www.youtube.com/watch?v=gm5-FPWn1XM))
* [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton)—Pay-per-Request API usage in TON ([video](https://www.youtube.com/watch?v=7lAnbyJdpOA&feature=youtu.be))
* [illright/diamonds](https://github.com/illright/diamonds)—Pay-per-Minute learning platform ([website](https://diamonds-ton.vercel.app/), [video](https://www.youtube.com/watch?v=g9wmdOjAv1s))


## See also

* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
* [TON Connect](/v3/guidelines/ton-connect/overview) 

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/oracles/about_blockchain_oracles.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/oracles/about_blockchain_oracles.md
================================================
import Feedback from '@site/src/components/Feedback';

# About oracles

Blockchain oracles are entities that connect the blockchain to external systems, allowing smart contracts to be executed based on real-world inputs.

## How blockchain oracles work

Blockchain oracles are specialized services that act as bridges between the real world and blockchain technology. They provide smart contracts with relevant and necessary information from the outside world, such as exchange rates, payment statuses or even weather conditions. This data helps to automate and fulfill the terms of contracts without direct human intervention.
	
The basic principle behind oracles is their ability to function outside of the blockchain by connecting to various online sources to collect data. Although oracles are not part of the blockchain itself, they play a key role in making it functional by acting as a trusted intermediary that reliably feeds external data into the system.
	
Most oracles tend to be decentralized, avoiding the risks associated with dependence on a single source of data. This provides greater security and reliability to the system as data is verified and validated through a network of nodes before it is used in smart contracts. This approach minimizes the risk of manipulation and errors, ensuring that the information provided is accurate and up-to-date.

## Varieties of blockchain oracles

Blockchain oracles are categorized according to various aspects: mechanism of operation, data sources, data direction, and governance structure. Let's take a look at the most common types of oracles.

### Software and hardware oracles  
	
Software oracles work with online data that is stored in various digital sources such as databases, servers, cloud storage. Hardware oracles connect the physical world to the digital world, using sensors and scanners to transfer data about real-world events to the blockchain.

### Incoming and outgoing oracles
	
Inbound oracles feed information into the blockchain, such as weather data for insurance contracts. Outbound oracles, in turn, send data from the blockchain to the outside world, such as transaction notifications. Using both types of oracles improves the overall reliability of the system by ensuring a continuous and accurate flow of data in both directions. It also reduces the likelihood of a single point of failure problem by diversifying the sources and destinations of critical data, reducing the risk that a failure in one component could jeopardize the entire system.

### Centralized and decentralized oracles
	
Centralized oracles are controlled by a single party, which creates security and reliability risks. Decentralized oracles use multiple nodes to verify data, making them more secure and reliable.

### Oracles for specific smart-contracts
	
These oracles are developed individually for certain smart contracts and may not be as popular due to their specificity and high development costs.

### Crosschain oracles
	
These oracles are used to transfer data between different blockchains and are a critical component of bridges. They are used for decentralized applications that use cross-chain transactions, such as cross-chain transfer of crypto assets from one network to another.

## Application of blockchain oracles
	
Blockchain oracles build bridges between the digital world of blockchains and real life, opening up a wide range of applications. Let's take a look at some of the most popular uses of oracles.

### DeFi (decentralized finance)
	
Oracles play a critical role in the DeFi ecosystem by providing market price and cryptocurrency data. Price oracles allow DeFi platforms to link token values to real assets, which is essential for controlling liquidity and securing users' positions. Additionally, oracles are vital for lending platforms, where accurate price data ensures proper collateral valuation and risk management, safeguarding both lenders and borrowers. This makes transactions more transparent and secure, contributing to the stability and reliability of financial transactions.

### Insurance
	
Oracles can automatically read and analyze data from a variety of sources to determine the occurrence of insurance events. This allows insurance contracts to pay claims automatically, reducing the need to manually process each case and speeding up response times to insurance events.

### Logistics
	
The use of oracles in logistics allows smart contracts to automatically perform payments and other actions based on data received from barcode scanners or sensors on vehicles. This improves delivery accuracy and efficiency by minimizing errors and delays.

### Random number generation
	 
It is difficult to generate random numbers in smart contracts because all operations must be reproducible and predictable, which contradicts the concept of randomness. Computational oracles solve this problem by bringing data from the outside world into contracts. They can generate verifiable random numbers for games and lotteries, ensuring fairness and transparency of results.

## List of oracles in TON

* [Pyth oracles](/v3/documentation/dapps/oracles/pyth)
* [RedStone oracles](/v3/documentation/dapps/oracles/red_stone)


<Feedback />




================================================
FILE: docs/v3/documentation/dapps/oracles/pyth.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/oracles/pyth.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# Pyth oracles

## How to use real-time data in TON contracts

Pyth price feeds on TON are managed through the main TON Pyth smart
contract, enabling seamless interaction with on-chain data. In TON,
these interactions are facilitated by specific functions within the
Pyth receiver contract. This contract acts as an interface to Pyth
price feeds, handling the retrieval and updating of price data.

## Install the Pyth SDK

Install the Pyth TON SDK and other necessary dependencies using npm or yarn:

   ```ts
      npm install @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
      @ton/core @ton/ton @ton/crypto
   ```
   or
   ```ts
      yarn add @pythnetwork/pyth-ton-js @pythnetwork/hermes-client
      @ton/core @ton/ton @ton/crypto
   ```
    

## Write client code

The following code snippet demonstrates how to fetch price updates, interact with the Pyth contract on TON, and update price feeds:

- TON Mainnet: [EQBU6k8HH6yX4Jf3d18swWbnYr31D3PJI7PgjXT-flsKHqql](https://docs.pyth.network/price-feeds/contract-addresses/ton)
- TON Testnet: [EQB4ZnrI5qsP_IUJgVJNwEGKLzZWsQOFhiaqDbD7pTt_f9oU](https://docs.pyth.network/price-feeds/contract-addresses/ton)

The following example uses testnet contract. For mainnet usage, change the `PYTH_CONTRACT_ADDRESS_TESTNET` to `PYTH_CONTRACT_ADDRESS_MAINNET` accordingly. 

<details>
```ts
import { TonClient, Address, WalletContractV4 } from "@ton/ton";
import { toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { HermesClient } from "@pythnetwork/hermes-client";
import {
  PythContract,
  PYTH_CONTRACT_ADDRESS_TESTNET,
  calculateUpdatePriceFeedsFee,
} from "@pythnetwork/pyth-ton-js";
const BTC_PRICE_FEED_ID =
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
async function main() {
  // Initialize TonClient
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: "your-api-key-here", // Optional
  });
  // Create PythContract instance
  const contractAddress = Address.parse(PYTH_CONTRACT_ADDRESS_TESTNET);
  const contract = client.open(PythContract.createFromAddress(contractAddress));
  // Get current guardian set index
  const guardianSetIndex = await contract.getCurrentGuardianSetIndex();
  console.log("Guardian Set Index:", guardianSetIndex);
  // Get BTC price from TON contract
  const price = await contract.getPriceUnsafe(BTC_PRICE_FEED_ID);
  console.log("BTC Price from TON contract:", price);
  // Fetch latest price updates from Hermes
  const hermesEndpoint = "https://hermes.pyth.network";
  const hermesClient = new HermesClient(hermesEndpoint);
  const priceIds = [BTC_PRICE_FEED_ID];
  const latestPriceUpdates = await hermesClient.getLatestPriceUpdates(
    priceIds,
    { encoding: "hex" }
  );
  console.log("Hermes BTC price:", latestPriceUpdates.parsed?.[0].price);
  // Prepare update data
  const updateData = Buffer.from(latestPriceUpdates.binary.data[0], "hex");
  console.log("Update data:", updateData);
  // Get update fee
  const updateFee = await contract.getUpdateFee(updateData);
  console.log("Update fee:", updateFee);
  const totalFee =
    calculateUpdatePriceFeedsFee(BigInt(updateFee)) + BigInt(updateFee);
  // Update price feeds
  const mnemonic = "your mnemonic here";
  const key = await mnemonicToPrivateKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  const provider = client.open(wallet);
  await contract.sendUpdatePriceFeeds(
    provider.sender(key.secretKey),
    updateData,
    totalFee
  );
  console.log("Price feeds updated successfully.");
}
main().catch(console.error);
```
</details>

This code snippet does the following:

1. Initializes a `TonClient` and creates a `PythContract` instance.
2. Retrieves the current guardian set index and BTC price from the TON contract.
3. Fetches the latest price updates from Hermes.
4. Prepares the update data and calculates the update fee.
5. Updates the price feeds on the TON contract.

## Additional resources

You may find these additional resources helpful for developing your TON application:

- [TON documentation](https://ton.org/docs/)
- [Pyth price feed IDs](https://pyth.network/developers/price-feed-ids)
- [Pyth TON contract](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/contracts)
- [Pyth TON SDK](https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ton/sdk)
- [Pyth TON example](https://github.com/pyth-network/pyth-examples/tree/main/price_feeds/ton/sdk_js_usage)

<Feedback />




================================================
FILE: docs/v3/documentation/dapps/oracles/red_stone.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/dapps/oracles/red_stone.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# RedStone oracles

## How RedStone oracles work with TON

RedStone oracles use an alternative design of providing oracle data to smart contracts. Instead of constantly persisting data on the contract's storage (by data providers), the information is brought on-chain only when needed (by end users). Until that moment data remains in the decentralized cache layer, which is powered by RedStone light cache gateways and
streams data broadcasting protocol. Data is transferred to the contract by end users, who should attach signed data
packages to their function invocations. The information integrity is verified on-chain through signature checking.

To learn more about RedStone oracles design go to the [RedStone docs](https://docs.redstone.finance/docs/introduction).

## Documentation links

* [Redstone TON Connector](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector)

## Smart contracts

### price_manager.fc

- Sample oracle contract that consumes RedStone oracles data [price_manager.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/price_manager.fc) written in
  FunC. It requires [TVM Upgrade 2023.07](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).

#### initial data

As mentioned above, the data packages transferred to the contract are being verified by signature checking.
To be counted to achieve the `signer_count_threshold`, the signer signing the passed data
should be one of the `signers` passed in the initial data. There is also needed `signer_count_threshold` to be
passed.

Due to the architecture of TON contracts, the initial data must convene with the contract's storage structure,
which is constructed as below:

```ts
  begin_cell()
    .store_uint(signer_count_threshold, 8)  /// number as passed below
    .store_uint(timestamp, TIMESTAMP_BITS)  /// initially 0 representing the epoch 0
    .store_ref(signers)                     /// serialized tuple of values passed below
  .end_cell();
```

The value of `signers` should be passed as a serialized `tuple` of `int`s.
See [tuple](https://github.com/ton-core/ton-core/blob/main/src/tuple/tuple.ts).

<!-- To define the initial (storage) data for the Prices contract, use the predefined
class [PriceManagerInitData.ts](../src/price-manager/PriceManagerInitData.ts). -->

In the function parameters below, each `feed_id` is a string encoded to `int` which means, that's a value
consisting of hex-values of the particular letters in the string. For example:
`'ETH'` as an `int` is `0x455448` in hex or `4543560` in decimal, as `256*256*ord('E')+256*ord('T')+ord('H')`.

You can use: `feed_id=hexlify(toUtf8Bytes(feed_string))` to convert particular values or
the [endpoint](https://cairo-utils-web.vercel.app/).

The value of `feed_ids`  should be passed as a serialized `tuple` of `int`s.

The value `payload` is packed from an array of bytes representing the serialized RedStone payload.
See [TON RedStone payload packing](#ton-redstone-payload-packing) section below, as well as the file [constants.fc](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/contracts/redstone/constants.fc), containing all needed `int`-length constants.

#### get_prices

```func
(cell) get_prices_v2(cell data_feed_ids, cell payload) method_id;
```

The function process on-chain the `payload` passed as an argument
and returns a `cell` of aggregated values of each feed passed as an identifier inside `feed_ids`.

Due to HTTP GET method length limitation in TON API v4, the function is written for TON API v2.

That are just a `method_id` functions - they don't modify the contract's storage and don't consume TONs.

#### OP_REDSTONE_WRITE_PRICES

Regardless of the on-fly processing, there also exists a method for processing the `payload` on-chain, but
saving/writing the aggregated values to the contract's storage. The values persist in the contract's storage and then can be read by using `read_prices` function. The timestamp of data last saved/written to the contract is able to read by using the `read_timestamp` function.

The method must be invoked as a TON internal message. The arguments of the message are:

- an `int` representing RedStone_Write_Prices name hashed by keccak256 as defined
  in [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)
- a `cell` - ref representing the `data_feed_ids` as a serialized `tuple` of `int`s.\
- a `cell` - ref representing the packed RedStone payload

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICES) {
        cell data_feeds_cell = in_msg_body~load_ref();
        cell payload_cell = in_msg_body~load_ref();

    // ...
    }
```

That's an internal message - it consumes GAS and modifies the contract's storage, so must be paid by TONs.

See how it works on: https://ton-showroom.redstone.finance/

#### read_prices

```func
(tuple) read_prices(tuple data_feed_ids) method_id;
```

The function reads the values persisting in the contract's storage and returns a tuple corresponding to the
passed `feed_ids`.
The function doesn't modify the storage and can read only aggregated values of the `feed_ids` saved by
using `write_prices` function.

That's just a `method_id` function - it doesn't modify the contract's storage and don't consume TONs.

#### read_timestamp

```func
(int) read_timestamp() method_id;
```

Returns the timestamp of data last saved/written to the contract's storage by using `OP_REDSTONE_WRITE_PRICES` message.

That's just a `method_id` function - it doesn't modify the contract's storage and don't consume TONs.

### price_feed.fc

Due to the architecture of TON contracts, the initial data must convene with the contract's storage structure,
which is constructed as below:

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeAddress(Address.parse(this.managerAddress))
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)  /// initially 0 representing the epoch 0
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .endCell();
```

To define the initial (storage) data for the Price feed contract, use the predefined
class [PriceFeedInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/price-feed/PriceFeedInitData.ts).

#### OP_REDSTONE_FETCH_DATA

Regardless of reading the values persisting in the contract's from outside the network,
there is a possibility for fetching the value stored in the contract for a `feed_id` on-chain directly.
There must be invoked an internal message `OP_REDSTONE_FETCH_DATA`. The arguments of the message are:

* an `int` representing `RedStone_Fetch_Data` name hashed by keccak256 as defined
  in [constants.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)
* an `int` representing the `feed_id` value.
* a `slice` representing the `initial_sender` of the message, to allow they carried the remaining transaction balance
  when the returning transaction goes.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_FETCH_DATA) {
        int feed_id = in_msg_body~load_uint(DATA_FEED_ID_BITS);
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

The returning message `OP_REDSTONE_DATA_FETCHED` message is sent to the sender, containing the `value` and
the `timestamp` of the value has saved. The message can be then fetched in the sender and processed or saved in the
sender's storage.
The initial payload's `ref` (`initial_payload`) is added as a ref - containing for example the first message's sender,
to allow they carry the remaining transaction balance.

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

That's an internal message - it consumes GAS and modifies the contract's storage, so must be paid by TONs.

#### get_price_and_timestamp

```func
(int, int) get_price_and_timestamp() method_id;
```

Returns the value and timestamp of the last saved/written data to the adapter's storage by sending `OP_REDSTONE_FETCH_DATA` message and fetching the returned value of the `OP_REDSTONE_DATA_FETCHED` message.

That's just a `method_id` function - it doesn't modify the contract's storage and don't consume TONs.

### single_feed_man.fc

#### initial data

Similar to the `prices` and `price_feed` initial data. Due to the architecture of TON contracts, the initial data must convene with the contract's storage structure, which is constructed as below:

```ts
beginCell()
  .storeUint(BigInt(hexlify(toUtf8Bytes(this.feedId))), consts.DATA_FEED_ID_BS * 8)
  .storeUint(this.signerCountThreshold, SIGNER_COUNT_THRESHOLD_BITS)
  .storeUint(0, consts.DEFAULT_NUM_VALUE_BS * 8)
  .storeUint(0, consts.TIMESTAMP_BS * 8)
  .storeRef(serializeTuple(createTupleItems(this.signers)))
  .endCell();
```

To define the initial (storage) data for the Prices contract, use the predefined
class [SingleFeedManInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/single-feed-man/SingleFeedManInitData.ts).

A contract like `price_manager`, but supporting
the single feed only, to omit the communication needs between feed and manager contracts.

#### get_price

```func
(int, int) get_price(cell payload) method_id;
```

Similar to `get_prices`, but omitting the first (`data_feed_ids`) argument as have it configured during
the initialization. Returns also the min timestamp of the passed data packages.

#### read_price_and_timestamp

```func
(int, int) read_price_and_timestamp() method_id;
```

Works as the `get_price_and_timestamp` function.

#### OP_REDSTONE_WRITE_PRICE

Similar to `OP_REDSTONE_WRITE_PRICES`, but omitting the first (`data_feed_ids`) `cell`-ref as have it configured during the initialization.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_WRITE_PRICE) {
        cell payload_cell = in_msg_body~load_ref();

        // ...
    }
```

### sample_consumer.fc

A sample consumer for data stored in the `price_feed`. Works also with `single_feed_man`.
The `price_feed` to be called needs to be passed.

#### initial data

Similar to the `price_feed` initial data. Due to the architecture of TON contracts, the initial data must convene with the contract's storage structure, which is constructed as below:

```ts
beginCell()
  .storeAddress(Address.parse(this.feedAddress))
  .endCell();
```

To define the initial (storage) data for the Prices contract, use the predefined
class [SampleConsumerInitData.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/sample-consumer/SampleConsumerInitData.ts).

The contract calls the single feed.

#### OP_REDSTONE_READ_DATA

There is a possibility for fetching the value stored in the contract for a `feed_id` on-chain directly.
There must be invoked an internal message `OP_REDSTONE_READ_DATA`. The arguments of the message are:

* a `slice` representing the `initial_sender` of the message, to allow they carried the remaining transaction balance
  when the returning transaction goes.

```func
    int op = in_msg_body~load_uint(OP_NUMBER_BITS);

    if (op == OP_REDSTONE_READ_DATA) {
        cell initial_payload = in_msg_body~load_ref();

        // ...
    }
```

The returning message `OP_REDSTONE_DATA_READ` message is sent to the sender, containing the `feed_id`, `value` and
the `timestamp` of the value has saved. The message can be then fetched in the sender and processed or saved in the
sender's storage.
The initial payload's `ref` (`initial_payload`) is added as a ref - containing for example the first message's sender,
to allow they carry the remaining transaction balance.

```ts
begin_cell()
  .store_uint(value, MAX_VALUE_SIZE_BITS)
  .store_uint(timestamp, TIMESTAMP_BITS)
  .store_ref(initial_payload)
  .end_cell()
```

That's an internal message - it consumes GAS and modifies the contract's storage, so must be paid by TONs.

## TON RedStone payload packing

Due to limitations of the Bag-size in TON [see](/v3/documentation/data-formats/tlb/cell-boc),
the RedStone payload data - represented as a hex string - needed to be passed to a contract in a more complex way.

Having the RedStone payload as defined [here](https://docs.redstone.finance/img/payload.png),
the data should be passed as a Cell built as follows.

1. The main *payload* `cell` consists of:
    1. the metadata in the **data-level bits** consisting of the parts as on the image:

      ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)
    1. a **ref** containing a `udict` indexed by consecutive natural numbers (beginning from 0) containing the list of **data_package** `cell`s.
1. Each *data-package* `cell` consists of:
    1. the data package's signature in the **data-level bits**:

      ![payload-metadata.png](/img/docs/oracles/red-stone/payload-metadata.png)
    1. one **ref** to a `cell` containing the data of the rest of the data package on its **data-level**:

      ![payload-metadata.png](/img/docs/oracles/red-stone/data-package-data.png)

#### Current implementation limitations

* The RedStone payload must be fetched by explicitly defining data feeds,
  which leads to **one data point** belonging to **one data package**.
* The unsigned metadata size must not be exceeding `127 - (2 + 3 + 9) = 113` bytes.

#### Helper

The ```createPayloadCell``` method in the [create-payload-cell.ts](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/create-payload-cell.ts) file
checks the limitations and prepares the data to be sent to the contract as described above.

#### Sample serialization

The image below contains data for `2` feeds times `2` unique signers:
![payload-metadata.png](/img/docs/oracles/red-stone/sample-serialization.png)

## Possible transaction failures

* The number of signers recovered from the signatures matched with ```addresses``` passed in the initializer
  must be greater or equal that the ```signer_count_threshold``` in the constructor, for each feed.
    * Otherwise, it panics then with the `300` error, increased by the first index of the passed
      feed which has broken the validation.
* The timestamp of data-packages must be not older than 15 minutes in relation to the ```block_timestamp```.
    * Otherwise, it panics then with the `200` error, increased by the first index of the payload's
      data package which has broken the validation, increased additionally by `50` if the package's timestamp is too
      future.
* The internal messages consume gas and must be paid by TONs. The data are available on the contract
  just after the transaction successes.
* The other error codes are defined [here](https://github.com/redstone-finance/redstone-oracles-monorepo/blob/main/packages/ton-connector/src/config/constants.ts)

## See also

- [Internal messages docs](/v3/documentation/smart-contracts/message-management/internal-messages)
- [RedStone data-packing](https://docs.redstone.finance/docs/smart-contract-devs/how-it-works)
- [RedStone oracles smart-contracts](https://github.com/redstone-finance/redstone-oracles-monorepo/tree/main/packages/ton-connector/contracts)

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tl.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tl.md
================================================
import Feedback from '@site/src/components/Feedback';

# TL
TL (Type Language) is a language used to describe data structures.

[TL schemas](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme) are used to structure data when communicating. 

TL operates on 32-bit blocks, meaning the data size in TL must always be a multiple of 4 bytes. If the object's size is not a multiple of 4, zero padding must be added to make it align with a 4-byte boundary.

Numbers are always encoded in Little Endian order.

For more details on TL, refer to the [Telegram documentation](https://core.telegram.org/mtproto/TL).


## Encoding bytes array
To encode a byte array, we first determine its size. If the array is less than 254 bytes, the size is encoded using a single byte. If the array size exceeds 254 bytes, the first byte is set to `0xFE` to indicate an oversized array, followed by a 3-byte size field.

For example, to encode the array `[0xAA, 0xBB]` with size 2, we use 1 byte for the size, followed by the data itself, resulting in `[0x02, 0xAA, 0xBB]`. However, the total size is 3 bytes, which is not a multiple of 4. Therefore, we add 1 byte of padding to align it to 4 bytes, resulting in `[0x02, 0xAA, 0xBB, 0x00]`.

If we need to encode an array with a size of, for example, 396 bytes, we use 3 bytes for the size encoding and 1 byte for the oversize indicator. The encoding would be: `[0xFE, 0x8C, 0x01, 0x00, array bytes]`. The total size becomes `396+4 = 400` bytes, a multiple of 4, so no additional alignment is needed.

## Non-obvious serialization rules

A 4-byte prefix is often added before the schema itself—its ID. The schema ID is a CRC32 hash derived from the schema text using an IEEE table, with symbols like `;` and `()` removed beforehand. The serialization of a schema with an ID prefix is called **boxed**, which enables the parser to determine which schema is being used when multiple options exist.

If a schema is part of another schema, the decision to serialize it with or without a prefix depends on the specified field type. The schema is serialized without a prefix if the type is explicitly defined. If the type is not explicitly defined (which applies to many types), the schema should be serialized with the ID prefix (boxed). For example:

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

Consider the following scenario: if `PublicKey` is specified within the schema like this:

```
adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node;
```

Since the type is not explicitly defined, it needs to be serialized with an ID prefix (boxed). However, if the schema is specified as follows:

```
adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node;
```

The type is explicitly specified, so the prefix is not needed.

## Reference

[Link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md) - _[Oleg Baranov](https://github.com/xssnick)_.
<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/block-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/block-layout.md
================================================
import Feedback from '@site/src/components/Feedback';

# Block layout

:::info
To maximize comprehension of this page, it is highly recommended that you familiarize yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc).
:::

A block in the blockchain is a record of new transactions that, once confirmed, is added to the blockchain as a permanent and immutable part of the decentralized ledger. Each block includes transaction data, timestamps, and a reference to the previous block, forming a block chain.

Blocks in TON Blockchain have a relatively complex structure, reflecting the system’s overall design. This page outlines the structure and layout of these blocks.

## Block
The raw TL-B scheme of a block is as follows:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Let’s take a closer look at each field.

## global_id:int32

The identifier of the network where this block was created. For example, `-239` represents the Mainnet, and `-3` represents the Testnet.

## info:^BlockInfo

This field contains metadata about the block, including its version, sequence numbers, identifiers, and various flags.

```tlb
block_info#9bc7a987 version:uint32
    not_master:(## 1)
    after_merge:(## 1) before_split:(## 1)
    after_split:(## 1)
    want_split:Bool want_merge:Bool
    key_block:Bool vert_seqno_incr:(## 1)
    flags:(## 8) { flags <= 1 }
    seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr }
    { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no }
    shard:ShardIdent gen_utime:uint32
    start_lt:uint64 end_lt:uint64
    gen_validator_list_hash_short:uint32
    gen_catchain_seqno:uint32
    min_ref_mc_seqno:uint32
    prev_key_block_seqno:uint32
    gen_software:flags . 0?GlobalVersion
    master_ref:not_master?^BlkMasterInfo
    prev_ref:^(BlkPrevInfo after_merge)
    prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
    = BlockInfo;
```

| Field                           | Type                    | Description                                                                                                            |
| ------------------------------- | ----------------------- |------------------------------------------------------------------------------------------------------------------------|
| `version`                       | uint32                  | Specifies the version of the block structure.                                                                          |
| `not_master`                    | (## 1)                  | Indicates whether the block is a non-MasterChain block.                                                                |
| `after_merge`                   | (## 1)                  | Indicates whether the block was created immediately after merging two ShardChains, i.e., it has two parent blocks.     |
| `before_split`                  | (## 1)                  | Indicates whether the block was created immediately before a ShardChain split.                                         |
| `after_split`                   | (## 1)                  | Indicates whether the block was created immediately after a ShardChain split.                                          |
| `want_split`                    | Bool                    | Specifies whether a ShardChain split is desired.                                                                       |
| `want_merge`                    | Bool                    | Specifies whether a ShardChain merge is desired.                                                                       |
| `key_block`                     | Bool                    | Indicates whether the block is a key block.                                                                            |
| `vert_seqno_incr`               | (## 1)                  | Specifies the increment of the vertical sequence number.                                                               |
| `flags`                         | (## 8)                  | Contains additional flags related to the block.                                                                        |
| `seq_no`                        | #                       | The sequence number is assigned to the block.                                                                          |
| `vert_seq_no`                   | #                       | The vertical sequence number of the block.                                                                             |
| `shard`                         | ShardIdent              | Identifies the shard to which the block belongs.                                                                       |
| `gen_utime`                     | uint32                  | _The block generation time._                                                                                           |
| `start_lt`                      | uint64                  | Logical time at the start of the block’s lifespan.                                                                     |
| `end_lt`                        | uint64                  | Logical time at the end of the block’s lifespan.                                                                       |
| `gen_validator_list_hash_short` | uint32                  | A short hash of the validator list is active during block generation.                                                  |
| `gen_catchain_seqno`            | uint32                  | The [CatChain](/catchain.pdf)sequence number is associated with the block.                                             
| `min_ref_mc_seqno`              | uint32                  | The minimum sequence number of the referenced MasterChain block.                                                       |
| `prev_key_block_seqno`          | uint32                  | The sequence number of the previous key block.                                                                         |
| `gen_software`                  | GlobalVersion           | Specifies the software version that generated the block. Present only if the first bit of the `version` is set to `1`. |
| `master_ref`                    | BlkMasterInfo           | A reference to the MasterChain block if the current block is not a MasterChain block.                                  |
| `prev_ref`                      | BlkPrevInfo after_merge | A reference to the previous block in the chain.                             |
| `prev_vert_ref`                 | BlkPrevInfo 0           | A reference to the last block in the vertical sequence, if applicable.                      |

### value_flow:^ValueFlow

Represents the currency flow within the block, including collected fees and other currency-related transactions.

```tlb
value_flow#b8e48dfb ^[ from_prev_blk:CurrencyCollection
    to_next_blk:CurrencyCollection
    imported:CurrencyCollection
    exported:CurrencyCollection ]
    fees_collected:CurrencyCollection
    ^[
    fees_imported:CurrencyCollection
    recovered:CurrencyCollection
    created:CurrencyCollection
    minted:CurrencyCollection
    ] = ValueFlow;
```

| Field            | Type                                                                   | Description                                                                |
| ---------------- | ---------------------------------------------------------------------- |----------------------------------------------------------------------------|
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Indicates the currency flow from the previous block.                       |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Indicates the currency flow to the next block.                             |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Specifies the amount of currency imported into the block.                  |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Specifies the amount of currency exported from the block.                  |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The total amount of fees collected within the block.                       |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The fees imported into the block. Non-zero only in MasterChain.            |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The currency recovered in the block Non-zero only in MasterChain.          |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Amount of new currency created in the block. Non-zero only in MasterChain. |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The currency minted in the block. Non-zero only in MasterChain.            |

## state_update:^(MERKLE_UPDATE ShardState)

Indicates the updated state of the shard after this block.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Field      | Type                      | Description                                        |
| ---------- | ------------------------- |----------------------------------------------------|
| `old_hash` | bits256                   | The hash of the previous shard state.              |
| `new_hash` | bits256                   | The hash of the updated shard state.               |
| `old`      | [ShardState](#shardstate) | The previous shard state was stored as a reference.|
| `new`      | [ShardState](#shardstate) | The updated shard state is stored as a reference. |

### ShardState

`ShardState` can contain either information about a single shard or, if the shard has been split, information about its left and right parts.

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState unsplitted

```tlb
shard_state#9023afe2 global_id:int32
    shard_id:ShardIdent
    seq_no:uint32 vert_seq_no:#
    gen_utime:uint32 gen_lt:uint64
    min_ref_mc_seqno:uint32
    out_msg_queue_info:^OutMsgQueueInfo
    before_split:(## 1)
    accounts:^ShardAccounts
    ^[ overload_history:uint64 underload_history:uint64
    total_balance:CurrencyCollection
    total_validator_fees:CurrencyCollection
    libraries:(HashmapE 256 LibDescr)
    master_ref:(Maybe BlkMasterInfo) ]
    custom:(Maybe ^McStateExtra)
    = ShardStateUnsplit;
```

| Field                  | Type                                                                   | Required | Description                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------- | -------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `global_id`            | int32                                                                  | Yes      | An ID of the network where this shard resides. `-239` for Mainnet, `-3` for Testnet.                                                                              |
| `shard_id`             | ShardIdent                                                             | Yes      | The unique identifier of the shard.                                                                                                                               |
| `seq_no`               | uint32                                                                 | Yes      | The latest sequence number of this ShardChain.                                                                                                                    |
| `vert_seq_no`          | #                                                                      | Yes      | The latest vertical sequence number of this ShardChain.                                                                                                           |
| `gen_utime`            | uint32                                                                 | Yes      | The generation time associated with the creation of the shard.                                                                                                    |
| `gen_lt`               | uint64                                                                 | Yes      | The logical time at which the shard was generated.                                                                                                                |
| `min_ref_mc_seqno`     | uint32                                                                 | Yes      | The sequence number of the latest referenced MasterChain block.                                                                                                   |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                        | Yes      | Metadata about the shard’s outbound message queue. Stored in a reference.                                                                                         |
| `before_split`         | ## 1                                                                   | Yes      | A flag indicating that the next block of this ShardChain. It initiates a split.                                                                                   |
| `accounts`             | ShardAccounts                                                          | Yes      | A reference to the current state of accounts within the shard.                                                                                                    |
| `overload_history`     | uint64                                                                 | Yes      | A counter tracking shard overload events. Used to inform sharding decisions.                                                                                      |
| `underload_history`    | uint64                                                                 | Yes      | A counter tracking shard underload events. Used to inform sharding decisions.                                                                                     |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total balance is held across all accounts in the shard.                                                                                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total amount of validator fees accumulated within the shard.                                                                                                  |
| `libraries`            | HashmapE 256 LibDescr                                                  | Yes      | A hashmap of libraries used in the shard. This is usually empty, except in the MasterChain.                                                                       |
| `master_ref`           | BlkMasterInfo                                                          | No       | A reference to the masterchain block info.                                                                                                                        |
| `custom`               | McStateExtra                                                           | No       | MasterChain-specific extra data. Present only in the MasterChain. Stored in a reference.   |

### ShardState splitted

| Field   | Type                                        | Description                                                |
| ------- | ------------------------------------------- | ---------------------------------------------------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | The state of the left shard after the split. Stored in a reference.  |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | The state of the right shard after the split. Stored in a reference. |

## extra:^BlockExtra

This field contains extra information about the block.

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Field            | Type                          | Required | Description                                                                                                                                              |
| ---------------- | ----------------------------- | -------- |----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `in_msg_descr`   | InMsgDescr                    | Yes      | The descriptor for the incoming messages in the block. Stored in a reference.                                                                            |
| `out_msg_descr`  | OutMsgDescr                   | Yes      | The descriptor for the outgoing messages in the block. Stored in a reference.                                                                            |
| `account_blocks` | ShardAccountBlocks            | Yes      | The collection of all transactions processed in the block, along with updates to the states of accounts assigned to the shard and stored in a reference. |
| `rand_seed`      | bits256                       | Yes      | The random seed for the block.                                                                                                                       |
| `created_by`     | bits256                       | Yes      | The entity, usually a validator's public key, that created the block.                                                                    |
| `custom`         | [McBlockExtra](#mcblockextra) | No       | It contains masterchain-specific data, such as custom extra data for the block. Present only in the MasterChain. Stored in a reference.    |

### McBlockExtra

This field contains extra information about the MasterChain block.

```tlb
masterchain_block_extra#cca5
    key_block:(## 1)
    shard_hashes:ShardHashes
    shard_fees:ShardFees
    ^[ prev_blk_signatures:(HashmapE 16 CryptoSignaturePair)
    recover_create_msg:(Maybe ^InMsg)
    mint_msg:(Maybe ^InMsg) ]
    config:key_block?ConfigParams
    = McBlockExtra;
```

| Field                 | Type                            | Required | Description                                                                             |
| --------------------- | ------------------------------- | -------- |-----------------------------------------------------------------------------------------|
| `key_block`           | ## 1                            | Yes      | Flag indicating whether the block is a key block.                                       |
| `shard_hashes`        | ShardHashes                     | Yes      | The hashes of the latest blocks for the corresponding ShardChains.                      |
| `shard_fees`          | ShardFees                       | Yes      | The total fees are collected from all shards in this block.                             |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Yes      | Signatures of the previous block.                                                       |
| `recover_create_msg`  | InMsg                           | No       | The message related to recovering extra-currencies, if any. Stored in a reference.      |
| `mint_msg`            | InMsg                           | No       | The message related to minting extra-currencies, if any. Stored in a reference.         |
| `config`              | ConfigParams                    | No       | The actual configuration parameters for this block. Present only if `key_block` is set. |

## See also

- The initial explanation of the [block layout](https://docs.ton.org/tblkch.pdf#page=96&zoom=100,148,172) from the whitepaper.

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/canonical-cell-serialization.md
================================================
import Feedback from '@site/src/components/Feedback';

# Canonical cell serialization

## Cell weight

`Weight` is a property of each cell in the cell tree, defined as follows:
* If the cell is a leaf node: `weight = 1`
* For ordinary (non-leaf) cells: `weight = sum of children’s weights + 1`
* If the cell is _special_ : `weight = 0`

This concept is used to construct a weight-balanced tree structure when serializing cells. The following algorithm outlines how weights are assigned to each cell and how the tree is reordered accordingly.


## Weight reorder algorithm 

Each cell is part of a weight-balanced tree, and the [reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) method recalculates weights based on the cumulative weight of child cells.
The traversal order for recalculating weights is breadth-first, starting from the roots and moving toward the children. This is _likely_ chosen to preserve cache linearity.
The method also:
* Recalculates hash sizes 
* Reindexes the bag of cells (roots), and each tree 
* Assigns new indexes for empty references

Reindexing is performed in depth-first order, likely due to specific dependencies or optimizations. As stated in the whitepaper, this indexing order is preferred.

To follow the original node’s bag of cells (BoC) serialization format, the following steps should be applied:

- First, if the cell's weights have not been set, this is typically handled during cell import; the weight for each cell is set to `1 + sum_child_weight`, where `sum_child_weight` represents the total weight of its child nodes. The additional 1 ensures that leaf nodes receive a weight of 1.

- Iterate over all root cells. For each root cell:
  * Check whether each of its references has a weight less than `(maximum_possible_weight - 1 + ref_index) / num_references`, where `num_references` is the number of references in the root cell. This ensures that the parent’s weight is distributed uniformly among its children. The `ref_index` adjustment accounts for integer division rounding behavior in some languages (e.g., in C++, 5 / 3 yields 1, but we want 2 in this case).
  * If any reference violates this rule, add it to a list or, for efficiency, use a bitmask as done in the original implementation. Then, iterate over the invalid references and clamp their weight to `weight_left / invalid_ref_count`, where `weight_left` is calculated as `maximum_possible_weight - 1 - sum_of_valid_ref_weights`.
  * This can be implemented in code using a counter initialized to `maximum_possible_weight - 1`, which is then decremented for each valid reference as `counter -= valid_ref_weight`. This effectively redistributes the remaining weight among the invalid references to balance them.

- Iterate over the root cells again. For each root:
  * Ensure that the new sum of its reference weights is less than `maximum_possible_weight`. If this new sum is less than the root cell’s previous weight, clamp the root cell’s weight to the new sum (i.e., if `new_sum < root_cell_weight`, then set `root_cell_weight = new_sum`).
  * If the new sum exceeds the root cell’s weight, the node is considered a special node with a weight of 0. Set the weight to 0 accordingly. At this point, increment the Internal hashes count by the hash count of the node.
  
- Iterate over the root cells once more. For each root:
  * If the node is not special (i.e., weight > 0), increment the Top hashes count by the node’s hash count.

- Recursively reindex tree:
  * Begin by revisiting all root cells. If each node has not been revisited or visited, recursively check all its references for special nodes. If a special node is encountered, it must be revisited and visited before any other node. This ensures that the children of special nodes are added first to the resulting list, giving them the lowest indexes.
  * After handling special nodes, process the remaining children in order from the deepest to the highest in the tree.
  * Root nodes are added at the end of the list, thus receiving the highest indexes.
- The result is a sorted list in which deeper nodes receive lower indexes.

`maximum_possible_weight` is a constant value set to 64.
    
## Notes

* A special cell weights 0. 
* On import, ensure that the weight fits within 8 bits (weight \<= 255). 
* Internal hashes count is the sum of hash counts of all special root nodes. 
* The top hashes count is the sum of hash counts of all non-special (i.e., regular) root nodes.
<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/cell-boc.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/cell-boc.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# Cell & bag of cells (BoC)

## Cell

A cell is a fundamental data structure in the TON blockchain. Each cell can store up to 1023 bits of data and maintain up to 4 references to other cells.

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-5.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-5-dark.png?raw=true',
}}
/>
<br></br>


## Bag of cells

A Bag of Cells (BoC) is a serialization format that encodes cells into byte arrays, as defined by the [TL-B schema](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25).

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-6.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-6-dark.png?raw=true',
}}
/>
<br></br>

In TON, everything is built from cells—smart contract code, stored data, and even entire blocks—enabling a highly flexible and modular architecture.


<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-4.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-4-dark.png?raw=true',
}}
/>
<br></br>

### Cell serialization
Let’s walk through a basic example of a BoC:

<br></br>
<ThemedImage
alt=""
sources={{
    light: '/img/docs/data-formats/tl-b-docs-7.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-7-dark.png?raw=true',
}}
/>
<br></br>

```json
1[8_] -> {
  24[0AAAAA],
  7[FE] -> {
    24[0AAAAA]
  }
}
```
In this case, we have a 0-bit root cell that references two other cells:
* The first is a 24-bit cell.
* The second is a 7-bit cell that itself references a 24-bit cell.

To serialize this structure into a byte sequence, we first identify unique cells. In the example, we consider 3 unique cells out of 4 total.


```json
1[8_]
24[0AAAAA]
7[FE]
```
:::note
To filter out duplicates, cells must be compared by their [hashes](#cell-hash).
:::

Next, we arrange the cells in a specific order so that parent cells never reference cells that come before them in the list. In other words, any referenced cell must appear after the cells that reference it. We get:

```json
1[8_]      -> index 0 (root cell)
7[FE]      -> index 1
24[0AAAAA] -> index 2
```

Now, let’s calculate the descriptors for each of the 3 cells mentioned earlier. These descriptors consist of 2 bytes that encode metadata about the cell’s data size and reference structure.

1. **Refs descriptor (1st byte)**

  This byte is calculated using the formula: `r + 8·s + 32·l`.

Where:
- `r` is the number of cell's references (links) in the range `0 ≤ r ≤ 4`.
- `s` is the exotic flag (1 for [exotic](#special-exotic-cells) cells, 0 for ordinary ones).
- `l` is the  [level](#cell-level) of the cell in the range `0 ≤ l ≤ 3` .


2. **Bits descriptor (2nd byte)**

This byte indicates the size of the cell’s bitstring and is calculated as: `floor(b / 8) + ceil(b / 8)`.

Where `0 <= b <= 1023` is the number of bits in the cell.

This descriptor represents the length of full 4-bit groups in the cell’s data and is always at least 1 for non-empty data.

The result is:

```json
1[8_]      -> 0201 -> 2 refs, length 1
7[FE]      -> 0101 -> 1 ref, length 1
24[0AAAAA] -> 0006 -> 0 refs, length 6
```
For data with incomplete 4-bit groups, 1 bit is added to the end of the sequence. This means it denotes the end bit of the group and is used to determine the actual size of incomplete groups. Let's add the bits below:
Let’s add the end bits to each of the cells:


```json
1[8_]      -> C0     -> 0b10000000->0b11000000
7[FE]      -> FF     -> 0b11111110->0b11111111
24[0AAAAA] -> 0AAAAA -> do not change (full groups)
```

We now specify which cells each one references:
```json
0 1[8_]      -> 0201 -> refers to 2 cells with such indexes
1 7[FE]      -> 02 -> refers to cells with index 2
2 24[0AAAAA] -> no refs
```

Now we serialize the cells:
```json
0201 C0     0201
0101 FF     02
0006 0AAAAA
```

Finally, we concatenate all parts into a single-byte array:
`0201c002010101ff0200060aaaaa`

Size: 14 bytes.


<details>
  <summary><b>Show example</b></summary>

```golang
func (c *Cell) descriptors() []byte {
  ceilBytes := c.bitsSz / 8
  if c.bitsSz%8 ! = 0 {
    ceilBytes++
  }

	// calc size
	ln := ceilBytes + c.bitsSz / 8

	specBit := byte(0)
	if c.special {
	  specBit = 8
	}

	return []byte{byte(len(c.refs)) + specBit + c.level*32, byte(ln)}
}
```
[View source](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/tvm/cell/serialize.go#L205)

</details>


### Packing a bag of cells
Now that we've serialized our cells into a flat 14-byte array, it's time to pack them into a complete BoC format by building the appropriate header according to its [schema](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/tl/boc.tlb#L25).


```
b5ee9c72                      -> id tl-b of the BoC structure
01                            -> flags and size:(## 3), in our case the flags are all 0,
                                 and the number of bytes needed to store the number of cells is 1.
                                 we get - 0b0_0_0_00_001
01                            -> number of bytes to store the size of the serialized cells
03                            -> number of cells, 1 byte (defined by 3 bits size:(## 3), equal to 3.
01                            -> number of root cells - 1
00                            -> absent, always 0 (in current implementations)
0e                            -> size of serialized cells, 1 byte (size defined above), equal to 14
00                            -> root cell index, size 1 (determined by 3 size:(## 3) bits from header),
                                 always 0
0201c002010101ff0200060aaaaa  -> serialized cells
```


We now concatenate the header and the serialized cell content:
`b5ee9c7201010301000e000201c002010101ff0200060aaaaa`

**BoC implementation examples**
* [Serialization](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/serialize.go)
* [Deserialization](https://github.com/xssnick/tonutils-go/blob/master/tvm/cell/parse.go)

## Special (exotic) cells
In general, cells operating on TON are categorized into two main types: **ordinary cells** and **special (exotic) cells**.
Most user-facing cells are ordinary cells, which are responsible for carrying information.

However, special cells are occasionally required to support the network's internal functionality. Depending on their specific subtype, these cells serve various purposes.

## Cell level

Every cell has an attribute called `Level`, represented by an integer from 0 to 3.

### Ordinary cells level

The level of an ordinary cell is always equal to the maximum level among all of its references:

```cpp
Lvl(c) = max(Lvl(r_0), ..., Lvl(r_i), ..., Lvl(r_e))
```

Where `i` is a `c` reference index, `e` is a `c` reference amount.

_If an ordinary cell has no references, its level is zero._

### Exotic cells level
Exotic cells follow different rules for determining their level, which are described in [this](/v3/documentation/data-formats/tlb/exotic-cells) article.

## Cell hash

In most cases, users interact with ordinary cells at `level=0` with a single hash known as the representation hash, also called _infinity_.

For a cell `c` with level `Lvl(c) = l`, where `1 ≤ l ≤ 3`, it has one representation hash and `l` additional **"higher"** hashes.

### Standard representation hash calculation

To compute the representation hash of a cell, follow these steps:

1. Compute descriptor bytes.
2. Add serialized cell data.
3. For each cell reference, add its depth.
4. For each cell reference, add its representation hash.
5. Compute the SHA-256 hash of the result

Let's analyze a simple example:

#### Cell without references
```json
32[0000000F]
```
1. **Descriptors computation**

    * The reference descriptor is computed as `r + 8s + 32l = 0 + 0 + 0 = 0`, which equals `00`.
    * The bits descriptor is calculated as `floor(b / 8) + ceil(b / 8) = 8`, which equals `08`.
    * Combined descriptor bytes: `0008`.

2. **Cell data serialization**

    * We have a complete group of 4-bit values in this case, so no padding is needed.
    * Serialized data: `0000000F`

3. **Refs depth**

    * This cell has no references, so we skip depth and reference hash steps.

4. **Refs hashes**

    * This cell has no references, so we skip depth and reference hash steps.

5. **SHA256 computation**

    * Concatenate the bytes from the previous steps: `00080000000F`.
    * Compute the SHA-256 hash of this byte string: `57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`.

    This is the **representation hash** of the cell.

#### Cell with references
```json
24[00000B] -> {
	32[0000000F],
	32[0000000F]
}
```

1. **Descriptors computation**

    * The reference descriptor is calculated as:
      `r + 8s + 32l = 2 + 0 + 0 = 2`, which equals `02`.
    * The bits descriptor is computed as:
    `floor(b / 8) + ceil(b / 8) = 6`, which equals `06`.
    * Combined descriptor bytes: `0206`.

2. **Cell data serialization**

    * The data consists of complete 4-bit groups, so no padding is needed.
    * Serialized cell data: `00000B`.

3. **Refs depth**

    * The depth of each reference is represented using 2 bytes.
    * Since both references have a depth of 0, the result is: `00000000`.

4. **Refs hashes**

    * Each reference contributes its representation hash. From the previous example, the result is:

      `57b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`


5. **SHA256 computation**

    * By concatenating the bytes from the previous steps, we obtain the following byte string:

    `020600000b0000000057b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f957b520dbcb9d135863fc33963cde9f6db2ded1430d88056810a2c9434a3860f9`.

    * The SHA-256 hash of this byte string is:

    `f345277cc6cfa747f001367e1e873dcfa8a936b8492431248b7a3eeafa8030e7`.

    * This is the representation hash of the cell.



### Higher hashes calculation

The higher hashes of an ordinary cell `c` are computed similarly to its representation hash,
but instead of using the representation hashes of its references, their respective higher hashes are used.

Exotic cells follow separate rules for computing their higher hashes. These are described in detail in [this](/v3/documentation/data-formats/tlb/exotic-cells) article.

## See also

[//]: # (* [Original article on RU]&#40;https://github.com/xssnick/ton-deep-doc/blob/master/Cells-BoC.md&#41;)
* [Exotic (special) cells](/v3/documentation/data-formats/tlb/exotic-cells)
* [Merkle proofs verifying](/v3/documentation/data-formats/tlb/proofs)

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/crc32.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/crc32.md
================================================
import Feedback from '@site/src/components/Feedback';

# CRC32 

## Overview

CRC stands for **Cyclic Redundancy Check**, a widely used method for verifying the integrity of digital data. An error-detecting algorithm checks whether data has been altered during transmission or storage. CRC generates a short checksum or hash from the original data, which is appended to it. The checksum is recalculated and compared with the original upon retrieval or receipt. If the values match, the data is considered intact; if not, it indicates corruption and the data must be resent or recovered.

The CRC32 IEEE variant is used in TL-B schemes. You can refer to this [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) example to better understand how CRC32 values are calculated for various TL-B messages.

## Tools

### Online calculator

* [Online calculator example](https://emn178.github.io/online-tools/crc32.html)
* [Tonwhales introspection ID generator](https://tonwhales.com/tools/introspection-id)

### VS Code extension

* [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

### Python

```python
import zlib
print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF)
```

### Go

```python
func main() {

	var schema = "some"

	schema = strings.ReplaceAll(schema, "(", "")
	schema = strings.ReplaceAll(schema, ")", "")
	data := []byte(schema)
	var crc = crc32.Checksum(data, crc32.MakeTable(crc32.IEEE))

	var b_data = make([]byte, 4)
	binary.BigEndian.PutUint32(b_data, crc)
	var res = hex.EncodeToString(b_data)
	fmt.Println(res)
}
```

### TypeScript
```typescript
import * as crc32 from 'crc-32';

function calculateRequestOpcode_1(str: string): string {
    return (BigInt(crc32.str(str)) & BigInt(0x7fffffff)).toString(16);
}

function calculateResponseOpcode_2(str: string): string {
    const a = BigInt(crc32.str(str));
    const b = BigInt(0x80000000);
    return ((a | b) < 0 ? (a | b) + BigInt('4294967296') : a | b).toString(16);
}
```


<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/exotic-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/exotic-cells.md
================================================
import Feedback from '@site/src/components/Feedback';

# Exotic cells

Each cell has a type encoded by an integer ranging from -1 to 255. A cell with a type of -1 is considered an `ordinary` cell, while all other cells are classified as `exotic` or `special`.
The type of an exotic cell is stored in the first eight bits of its data. It is considered invalid if an exotic cell contains fewer than eight data bits.
Currently, there are 4 exotic cell types:

```json
{
  Prunned Branch: 1,
  Library Reference: 2,
  Merkle Proof: 3,
  Merkle Update: 4
}
```
### Pruned branch
Pruned branches are cells that represent deleted subtrees of other cells.

They can have a level `1 <= l <= 3` and contain exactly `8 + 8 + 256 * l + 16 * l` bits.

The structure of a pruned branch cell is as follows:
* The first byte is always `01`, indicating the cell type.
* The second byte contains the pruned branch-level mask.
* Next,  `l * 32` bytes represent hashes of the deleted subtrees.
* Then, `l * 2` bytes represent the depths of the deleted subtrees.

The level `l` of a pruned branch cell is also called its De Bruijn index, as it determines the outer Merkle proof or Merkle update during the construction process in which the branch was pruned.

Higher-level hashes of pruned branches are stored within their data and can be obtained as follows:


```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
``` 

### Library reference

Library reference cells are used to incorporate libraries in smart contracts.

They always have a level of 0 and contain precisely `8 + 256` bits.

The first byte is always `02`, indicating the cell type.
The following 32 bytes represent the referenced library cell's [Representation hash](/v3/documentation/data-formats/tlb/cell-boc#standard-representation-hash-calculation).

### Merkle proof

Merkle proof cells verify that some cell tree data belongs to the full tree. This design allows the verifier to avoid storing the entire tree's content while still being able to verify the content using the root hash.

A Merkle proof cell contains exactly one reference. Its level `0 <= l <= 3` must be `max(Lvl(ref) - 1, 0)`. These cells contain exactly `8 + 256 + 16 = 280` bits.

The first byte is always `03`, indicating the cell type.
The following 32 bytes are `Hash_1(ref)` or `ReprHash(ref)` if the reference level is 0.
The following 2 bytes represent the depth of the deleted subtree that was replaced by the reference.

Higher-level hashes `Hash_i` of a Merkle proof cell are computed similarly to the higher hashes of an ordinary cell but with `Hash_i+1(ref)` used instead of `Hash_i(ref)`.


### Merkle update

Merkle update cells always have two references and behave like a Merkle proof for both.

The level of a Merkle update cell `0 <= l <= 3` is determined by `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`. These cells contain exactly `8 + 256 + 256 + 16 + 16 = 552` bits.

The first byte is always `04`, indicating the cell type.
The following 64 bytes represent `Hash_1(ref1)` and `Hash_2(ref2)`, the old and new hashes, respectively.
Following that, 4 bytes represent the depth of the deleted old and new subtrees.


## Simple proof verifying example
Let's assume there is a cell `c`:

```json
24[000078] -> {
	32[0000000F] -> {
		1[80] -> {
			32[0000000E]
		},
		1[00] -> {
			32[0000000C]
		}
	},
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			512[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064]
		}
	}
}
```
We know only the cell's hash: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`. We want to prove that cell `a` (`267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]`) is actually part of `c` without receiving the entire `c`.
To achieve this, we request the prover to generate a Merkle proof, replacing all branches that are not relevant to the proof with pruned branch cells.


The first descendant of `c` from which there is no way to reach `a` is `ref1`:

```json
32[0000000F] -> {
	1[80] -> {
		32[0000000E]
	},
	1[00] -> {
		32[0000000C]
	}
}
```
The prover computes the hash of `ref1` `[ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc]`, creates a pruned branch `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]`, and replaces `ref1` with this pruned branch.

The next cell is `512[0000000...00000000064]`.

The prover creates a pruned branch to replace this cell as well:

```json
24[000078] -> {
	288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
		}
	}
}
```
The resulting Merkle proof that the prover sends to the verifier (us, in this example) looks like this:

```json
280[0344EFD0FDFFFA8F152339A0191DE1E1C5901FDCFE13798AF443640AF99616B9770003] -> {
	24[000078] -> {
		288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
		16[000B] -> {
			4[80] -> {
				267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
				288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
			}
		}
	}
}
```


When we receive the proof cell, as the verifier, we first ensure that its data contains the `c` hash. We then compute `Hash_1` from the only reference in the proof: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, and compare it to the hash of `c`.

Once we have verified that the hashes match, we traverse deeper into the cell structure to ensure that the target cell `a`, which we are interested in, is indeed present.

Such proofs significantly reduce computational load and minimize the amount of data that the verifier must transmit or store.

## See also

* [Advanced proofs verifying examples](/v3/documentation/data-formats/tlb/proofs)

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/library-cells.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/library-cells.md
================================================
import Feedback from '@site/src/components/Feedback';

# Library cells

## Introduction 
One of the native features of how TON stores data in cells is **deduplication:** duplicate cells are stored only once in storage, messages, blocks, transactions, and other elements. This significantly reduces the size of serialized data and enables efficient storage of incrementally updated data.

As a result, many data structures in TON are rich in information and optimized for performance. For example, the block structure may contain the same message in multiple places—such as in the message queue, the list of transactions, and Merkle updates. Since duplication carries no overhead, data can be stored redundantly wherever it is needed without impacting efficiency.

Library cells extend this deduplication mechanism on-chain, enabling the incorporation of the same efficiency into custom smart contracts.

:::info
For instance, If you store the `jetton-wallet` code as a library cell (1 cell with 256 + 8 bits, instead of ~20 cells and ~6000 bits), the forwarding fees for a message that includes `init_code` can be reduced from 0.011 TON to 0.003 TON.
:::


## General info

Let's consider a BaseChain step from block 1'000'000 to block 1'000'001. While each block contains small data (typically fewer than 1,000 transactions), the entire BaseChain state includes millions of accounts. Since the blockchain must maintain data integrity—particularly by committing the Merkle root hash of the entire state into the block—the entire state tree must be updated.

In earlier-generation blockchains, this typically means tracking only the most recent states, as storing separate full states for each block would consume excessive space. However, thanks to deduplication, only new cells are added to storage for each block in the TON blockchain. This accelerates processing and enables efficient historical queries—such as checking balances, inspecting contract states, or running `get` methods at any point in the blockchain's history—with minimal overhead.

In scenarios involving families of similar contracts, e.g., `jetton-wallets`, the node stores duplicated data—such as identical contract codes—only once. Library cells leverage this deduplication mechanism, reducing storage costs and forwarding fees for such contracts.


:::info Highlevel analogy
You can think of a library cell as a C++ pointer: a small cell that references a larger one, which may include many references. The referenced cell must exist and be registered publicly, i.e., _"published"_.
:::

## Library cells structure

A library cell is an [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells) that references another static cell by storing its 256-bit hash.


**Behavior in TVM**
In the TON Virtual Machine (TVM), library cells operate as follows:

When the TVM is instructed to convert a cell into a slice via the `CTOS` instruction or the FunC method `.begin_parse()`, it checks whether the cell is a library cell. If so, the TVM searches for a cell that matches the stored hash in the MasterChain library context. If the referenced cell is found, the TVM opens it and returns its slice.

Opening a library cell incurs the exact computational cost of opening an ordinary cell. Therefore, library cells serve as a transparent, space-efficient substitute for static cells, reducing storage and forwarding fees.

**Nested library cells**

It is possible to create a library cell that references another library cell, which in turn references another, and so on. However, attempting to parse such nested structures directly using `.begin_parse()` will raise an exception. Instead, nested library references can be unwrapped step-by-step using the `XLOAD` opcode.

**Immutability**

Another key characteristic of library cells is immutability. Since the cell stores only the hash of the referenced cell, it refers to static, unchangeable data. Once a library cell is created, it cannot be updated to point to a different Cell.


**Publishing a library cell**

To be usable within the MasterChain library context—i.e., to be found and loaded by a library cell—a source cell must be published. This is done by storing the cell within a MasterChain smart contract using the `public=true` flag. The opcode used for this is `SETLIBCODE`.

## Using library cells in smart contracts

Since a library cell behaves identically to an ordinary cell, it is referenced in all contexts except fee calculation; it can seamlessly replace any static cell in your smart contracts. 

**Example**

For instance, you can store the code of a `jetton-wallet` as a library cell. Usually, the code occupies around 20 Cells (~6000 bits). However, when stored as a library cell, it fits into a single cell with 256 + 8 bits, significantly reducing storage usage and forwarding fees.
In particular, the forwarding fee for an `internal_transfer` message containing `init_code` drops from 0.011 TON to 0.003 TON—an order-of-magnitude reduction.

### Store data in a library cell

Let's walk through the process using the `jetton-wallet` code as an example.

1. First, compile the contract, e.g., jetton-wallet, into a standard cell that contains its code.
2. Next, create a library cell referencing the code by inserting:
   - an 8-bit tag `0x02` indicating it's a library cell,
   - the 256-bit hash of the compiled code cell.


### Using in Fift


You can manually create a library cell in Fift by writing its tag and hash to a builder and closing it as an exotic cell. 

It can be done in Fift-asm construction like [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), example of compilation some contract directly to library cell [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts).

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — always has level 0 and contains 8+256 data bits, including its 8-bit type integer 2.  
;; The representation hash Hash(c) of the library cell being referred to. When loaded, a library.
;; If found in the current library context, the reference cell may be transparently replaced by the cell it refers to.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```
### Using in @ton/ton
You can construct a library cell entirely in TypeScript using the `@ton/ton` library without Fift. Here’s how to do it in a Blueprint project:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

* [View source](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90)

### Publish ordinary cell in masterchain library context
A practical example is available [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func). 

The core of this contract is the line: `set_lib_code(lib_to_publish, 2);`. This function call publishes an ordinary cell with the flag set to `2`, which indicates that the library is public and can be used by anyone.


**Note:** the contract that publishes the cell is responsible for paying its and MasterChain's storage fees. Storage costs in the MasterChain are approximately 1000 times higher than in the BaseChain. Therefore, using a library cell is only cost-effective for contracts that thousands of users utilize.

### Testing in the Blueprint

To test how contracts that use library cells work in Blueprint, manually add the referenced cells to the emulator’s library context. This can be done as follows:
1. Create a library context dictionary (a Hashmap) of type `uint256 -> Cell`, where `uint256` is the hash of the corresponding cell. 
2. Set this library context in the emulator’s settings.

An example implementation can be found [here](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32).

:::info
As of version `@ton/blueprint:0.19.0`, Blueprint does not automatically update the library context if a contract publishes a new library during emulation. You must update it manually.
This behavior is current as of April 2024 and is expected to be improved in a future release.
:::

### Get methods for library cell-based contracts



When working with a jetton wallet, where the code is stored in a library cell, you may need to check its balance. To do so, you must execute a get method in the code. This involves the following steps:
* Accessing the library cell 
* Retrieving the hash of the referenced cell 
* Finding the cell with that hash in the MasterChain's library collection 
* Executing the code from there


In Layered Solutions (LS), all these processes happen automatically behind the scenes, and users needn’t be concerned with the specific method of code storage.

However, the process differs when working locally. For example, when using an explorer or wallet, you might examine the account state to determine its type, such as whether it's an NFT, wallet, token, or auction.

You can review regular contracts' available get methods, the contract interface, to understand how they work. Alternatively, you may "steal" the account state to your local pseudonet and execute methods there.

This approach is not feasible for a library cell because it does not store data on its own. Instead, you must manually detect and retrieve the necessary cells from the context. This can be done using LS, though bindings do not yet support this, or via DTon.


#### Retrieving Library Cell with Liteserver
When running get methods with liteserver, the correct library context is automatically set. If you need to detect the contract type using get methods or run them locally, download the corresponding cells via the LS method [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96).

#### Retrieving Library Cell with DTon
You can also get the library from [dton.io/graphql](https://dton.io/graphql):
```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```
as well as a list of libraries for specific MasterChain block:
```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## See also

* [Exotic cells](/v3/documentation/data-formats/tlb/exotic-cells) 
* [TVM instructions](/v3/documentation/tvm/instructions)



<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/msg-tlb.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/msg-tlb.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# Messages TL-B schemes
This section provides a detailed explanation of the TL-B schemes used for messages.

## Message TL-B
### TL-B
The main TL-B scheme for messages is defined as a combination of several nested structures.

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;

message$_ {X:Type} info:CommonMsgInfoRelaxed
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = MessageRelaxed X;

_ (Message Any) = MessageAny;
```

* `Message X` refers to the standard message structure.
* `MessageRelaxed X` is a variant that uses a `CommonMsgInfoRelaxed` body.
* `Message Any` is a union of both structures.

The message structure is unified using X:Type, which in this context represents a cell.
According to TL-B rules, all data can be stored within a single cell—if it fits within 1023 bits—or distributed across references using the caret symbol `^`.

A serialized `Message X` is placed into the action list using the FunC method `send_raw_message()`. The smart contract then executes this action, and the message is sent.


### Definition of explicit serialization

To construct valid binary data according to a TL-B structure, serialization must be performed as defined recursively for each type. To serialize a `Message X`, you must also know how to serialize nested structures like `StateInit`, `CommonMsgInfo`, etc.

Each nested structure is defined in a separate TL-B scheme, which must be referenced and resolved recursively. This continues until the serialization of the top-level structure becomes explicit—that is, every bit is defined by a boolean or a bit-representable type, e.g., `bits`, `uint`, `varuint`.

Structures not commonly used in regular development are marked with an asterisk `*` in the Type column. For example, `*Anycast` is typically omitted during serialization.


### message$_

This is the top-level TL-B scheme for messages, referred to as `Message X`:

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;
```


| Structure | Type                            | Required | Description                                                                                                                     |
|-----------|---------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| message$_ | Constructor                     |          | Defined according to the constructor rule. The empty tag `$_` indicates that no bits are added initially.                       |
| info      | [CommonMsgInfo](#commonmsginfo) | Required | Contains detailed message properties such as destination and value. It is always stored in the message's root cell.             |
| init      | [StateInit](#stateinit-tl-b)    | Optional | The general structure is used in TON to initialize new contracts. It can be placed in either a cell reference or the root cell. |
| body      | X                               | Required | Message payload. It can be placed in either a cell reference or the root cell.                                                  |                                                                                            |


```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

Recall how `Maybe` and `Either` work—we can serialize different cases:

* `[CommonMsgInfo][10][StateInit][0][X]` - a `Message X` fully serialized into a single cell.


<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-9.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-9-dark.png?raw=true',
}}
/>
<br></br>

* `[CommonMsgInfo][11][^StateInit][1][^X]` - a `Message X` with references.


<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-8.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-8-dark.png?raw=true',
}}
/>
<br></br>



## CommonMsgInfo TL-B

### CommonMsgInfo

`CommonMsgInfo` is a set of parameters that define how the message will be delivered on the TON blockchain.

```tlb
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;

//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;

//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

### int_msg_info$0

`int_msg_info` represents an internal message, meaning it can only be sent between smart contracts.
Use case: regular cross-contract communication within the TON blockchain.


```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| Structure      | Type                                      | Required | Description                                                                                                                     |
|----------------|-------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| int_msg_info$0 | Constructor                               | Required | The `$0` tag indicates that the `CommonMsgInfo` begins with a `0` bit in serialization, denoting an internal message.           |
| ihr_disabled   | Bool                                      | Required | Flag indicating whether hypercube routing (IHR) is disabled.                                                                    |
| bounce         | Bool                                      | Required | Specifies whether the message should be bounced if an error occurs during processing. If set to `1`, the message is bounceable. |
| bounced        | Bool                                      | Required | Indicates that the message is a result of a bounce.                                                                             |
| src            | [MsgAddressInt](#msgaddressint-tl-b)      | Required | The sender's smart contract address.                                                                                            |
| dest           | [MsgAddressInt](#msgaddressint-tl-b)      | Required | The recipient's smart contract address.                                                                                         |
| value          | [CurrencyCollection](#currencycollection) | Required | Describes the currency details, including the total funds transferred with the message.                                         |
| ihr_fee        | [VarUInteger 16](#varuinteger-n)          | Required | Fee for delivering the message using hypercube routing.                                                                         |
| fwd_fee        | [VarUInteger 16](#varuinteger-n)          | Required | Validators set the fee for forwarding the message.                                                                              |
| created_lt     | uint64                                    | Required | Logic time of the message, used by validators to order actions in smart contracts.                                              |
| created_at     | uint32                                    | Required | UNIX timestamp indicating when the message was created.                                                                         |



### ext_in_msg_info$10
`ext_in_msg_info$10` – represents an external incoming message. This message is sent from the off-chain world to a smart contract.
Use case: a wallet application sending a request to a wallet contract.



```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
//external incoming message
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt
  import_fee:Grams = CommonMsgInfo;
```

| Structure          | Type                                 | Required | Description                                                                                                                     |
|--------------------|--------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| ext_in_msg_info$10 | Constructor                          | Required | The `$10` tag indicates that the `CommonMsgInfo` begins with `10` bits in serialization, denoting an external incoming message. |
| src                | [MsgAddressExt](#msgaddressext-tl-b) | Required | The external sender’s address.                                                                                                  |
| dest               | [MsgAddressInt](#msgaddressint-tl-b) | Required | The destination smart contract address.                                                                                         |
| import_fee         | [VarUInteger 16](#varuinteger-n)     | Required | The fee for executing and delivering the message.                                                                               |



### ext_out_msg_info$11

`ext_out_msg_info$11` – represents an external outgoing message. This message is sent from a smart contract to the off-chain world.
Use case: logs.

```tlb
//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```

| Structure           | Type                                 | Required | Description                                                                                                                     |
|---------------------|--------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| ext_out_msg_info$11 | Constructor                          | Required | The `$11` tag indicates that the `CommonMsgInfo` begins with `11` bits in serialization, denoting an external outgoing message. |
| src                 | [MsgAddressInt](#msgaddressint-tl-b) | Required | The sender’s smart contract address.                                                                                            |
| dest                | [MsgAddressExt](#msgaddressext-tl-b) | Required | The external destination address for the message.                                                                               |
| created_lt          | uint64                               | Required | Logic times of the message, assigned by the validator. Used for ordering actions in the smart contract.                         |
| created_at          | uint32                               | Required | UNIX timestamp representing when the message was created.                                                                       |


## StateInit TL-B

`StateInit` – delivers initial data to a contract during its deployment.

```tlb
_ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
  code:(Maybe ^Cell) data:(Maybe ^Cell)
  library:(HashmapE 256 SimpleLib) = StateInit;
```


| Structure   | Type                    | Required | Description                                                                                                                                                                                                                                                                                                                                                            |
|-------------|-------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| split_depth | (## 5)                  | Optional | A parameter for high-load contracts that defines the behavior of splitting into multiple instances across different shards. Currently, `StateInit` is used without it.                                                                                                                                                                                                 |
| special     | TickTock*               | Optional | A structure used for invoking smart contracts in every new blockchain block. Available only in the MasterChain and not typically used in regular user contracts.                                                                                                                                                                                                       |
| code        | Cell                    | Optional | The contract's serialized code.                                                                                                                                                                                                                                                                                                                                        |
| data        | Cell                    | Optional | The initial data for the contract.                                                                                                                                                                                                                                                                                                                                     |
| library     | HashmapE 256 SimpleLib* | Optional | Currently, `StateInit` is used without libraries.                                                                                                                                                                                                                                                                                                                        |


[General detailed explanations for Hashmaps](/v3/documentation/data-formats/tlb/tl-b-types#hashmap).

## MsgAddressExt TL-B


```tlb
addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```

`MsgAddress` is a scheme for various serializations of addresses. The structure depends on the participant, either off-chain or a smart contract, sending the message. Different structures are employed based on whether the message comes from an off-chain participant or a smart contract.

### addr_none$00

`addr_none$00` defines a null address for an off-chain participant. This indicates that an external message can be sent to a contract without specifying a unique sender's address.

```tlb
addr_none$00 = MsgAddressExt;
```

| Structure    | Type        | Required | Description                                                                                                                                   |
|--------------|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| addr_none$00 | Constructor | Required | The `$00` tag in serialization indicates that `MsgAddressExt` starts with `00` bits. This signifies that the entire external address is `00`. |


### addr_extern$01

```tlb
addr_extern$01 len:(## 9) external_address:(bits len)
= MsgAddressExt;
```


| Structure        | Type        | Required | Description                                                                                                            |
|------------------|-------------|----------|------------------------------------------------------------------------------------------------------------------------|
| addr_extern$01   | Constructor | Required | The `$01` tag in serialization indicates that `MsgAddressExt` starts with `01` bits and describes an external address. |
| len              | ## 9        | Required | Represents an unsigned N-bit number, similar to `uintN`.                                                               |
| external_address | (bits len)  | Required | A bitstring address, where the length of the address equals the previously defined `len`.                              |


## MsgAddressInt TL-B

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;

addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

### addr_std$10

```tlb
addr_std$10 anycast:(Maybe Anycast)
workchain_id:int8 address:bits256  = MsgAddressInt;
```


| Structure    | Type        | Required | Description                                                                                                                                                                                                                                                |
|--------------|-------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| addr_std$10  | Constructor | Required | The `$10` tag in serialization indicates that `MsgAddressInt` starts with `10` bits and describes an internal address.                                                                                                                                     |
| anycast      | Anycast*    | Optional | Represents additional address data. Currently not used in ordinary internal messages.                                                                                                                                                                      |
| workchain_id | int8        | Required | The WorkChain where the smart contract of the destination address is located. Currently, this value always equals zero.                                                                                                                                    |
| address      | (bits256)   | Required | The smart contract account ID number.                                                                                                                                                                                                                      |



### addr_var$11

```tlb
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9)
workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```




| Structure    | Type        | Required  | Description                                                                                                               |
|--------------|-------------|-----------|---------------------------------------------------------------------------------------------------------------------------|
| addr_var$11  | Constructor | Required  | The `$11` tag indicates that in the serialization of `MsgAddressInt`, the address starts with `11` bits, representing an internal contract address. |
| anycast      | Anycast*    | Optional  | Additional address data is not currently used in regular internal messages.               |
| addr_len     | ## 9        | Required  | Same as `uintN` – represents an unsigned N-bit number.                                                                       |
| workchain_id | int32       | Required  | The WorkChain is where the smart contract for the destination address is located. Currently, this is always set to zero.                           |
| address      | (bits256)   | Required  | The payload address (this could be the account ID).                                                                                   |


## Basic used types


### CurrencyCollection

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;
currencies$_ grams:Grams other:ExtraCurrencyCollection
= CurrencyCollection;
```



| Structure    | Type                    | Required | Description                                                                                                  |
|--------------|-------------------------|----------|--------------------------------------------------------------------------------------------------------------|
| currencies$_ | Constructor             | Required | The `$_` empty tag indicates that no bits are added at the beginning during the serialization of `CurrencyCollection`.|
| grams        | (VarUInteger 16)        | Required | Represents the message value, expressed in nanoTons.                                                                                |
| other        | ExtraCurrencyCollection | Optional | ExtraCurrencyCollection is a dictionary intended for additional, typically empty currencies.         |

* ExtraCurrencyCollection is a complex type usually written as an empty dictionary in messages.

### VarUInteger n

```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8))
= VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8))
= VarInteger n;
```



| Structure  | Type             | Required | Description                                                                                                                 |
|------------|------------------|----------|-----------------------------------------------------------------------------------------------------------------------------|
| var_uint$_ | Constructor      | Required | The `var_uint$_` is an empty tag, indicating that no bits are added at the beginning of `CurrencyCollection` serialization. |
| len        | uintN            | Required | Specifies the bit-length used to encode the next value.                                                                     |
| value      | (uint (len * 8)) | Optional | An optional unsigned integer encoded in `(len * 8)` bits.                                                                   |


## Message example

### Regular func internal message

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```
### Regular func message in short form

Validators always overwrite message parts, which can be skipped and filled with zero bits. The message's sender is also skipped and serialized as `addr_none$00`.

```func
  cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(amount)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(message_body)
.end_cell();
```

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/proofs.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/proofs.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# Proofs verifying (low-level)

## Overview
:::caution
This section provides instructions and guidance for interacting with TON at a low level.
It assumes you are familiar with [exotic cells](/v3/documentation/data-formats/tlb/exotic-cells) and the [TL-B language](/v3/documentation/data-formats/tlb/tl-b-language)
and understand the [simple proof verifying](/v3/documentation/data-formats/tlb/exotic-cells#simple-proof-verifying-example) example.
:::


This article presents advanced examples of proof verification using liteservers.

Verifying any data received from a node is essential for trustless interaction with the blockchain.
However, this article covers only a portion of the trustless communication process with a liteserver.
It assumes you have verified the block hash received from a liteserver or any other source.
Block hash verification is a more advanced topic.
It requires syncing key blocks and/or validating block signatures. This topic will be covered in a future article.
Nonetheless, even using only the examples provided here can significantly reduce the probability of accepting incorrect data from a liteserver.


## Block header

Suppose we have a known block ID:
```json
<TL BlockIdExt [wc=-1, shard=-9223372036854775808, seqno=31220993, root_hash=51ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406, file_hash=d4fcdc692de1a252deb379cd25774842b733e6a96525adf82b8ffc41da667bf5] >
```
We then request the corresponding block header from a liteserver.
The liteserver’s [response](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L36) includes a `header_proof` BoC.


<details>

  <summary><b>Show BoC</b></summary>

```boc

b5ee9c72010207010001470009460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001601241011ef55aaffffff110204050601a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e030098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c000328480101741100d622b0d5264bcdb86a14e36fc8c349b82ae49e037002eb07079ead8b060015284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f0007

```
</details>

After deserializing the BoC, we obtain the following cell:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```
We should deserialize the cell according to the block [TLB scheme](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L442):

```python
{
  'global_id': -239,
  'info':
    {
      'version': 0,
      'not_master': 0,
      'after_merge': 0,
      'before_split': 0,
      'after_split': 0,
      'want_split': False,
      'want_merge': True,
      'key_block': False,
      'vert_seqno_incr': 0,
      'flags': 1,
      'seqno': 31220993,
      'vert_seqno': 1,
      'shard': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
      'gen_utime': 1689699158,
      'start_lt': 39391488000000,
      'end_lt': 39391488000004,
      'gen_validator_list_hash_short': 2288844950,
      'gen_catchain_seqno': 459393,
      'min_ref_mc_seqno': 31220989,
      'prev_key_block_seqno': 31212222,
      'gen_software': {'version': 3, 'capabilities': 46},
      'master_ref': None,
      'prev_ref': {'type_': 'prev_blk_info', 'prev': {'end_lt': 39391487000004, 'seqno': 31220992, 'root_hash': b'H\xa3\x97\x1cFG+\x85\xc8\xd7a\x06\nnz\xe9\xf1:\x90\xcd\xda\x81Y\x15\xa8\x95\x97\xcf\xec\xb3\x93\xa6', 'file_hash': b'\xb5h\x80z\xdf\xb3\xc1\xc5\xef\xc9 \x90r%\x17]\xb6\x1c\xa3\x84\xe4\xf8\xb3\x13y\x9e<\xbb\x8b{@\x85'}},
      'prev_vert_ref': None
    },
  'value_flow': None,
  'state_update': None,
  'extra': None
}
```


Next, we need to verify that the `seqno` in the deserialized block matches the `seqno` of the block we know. After that, we compute `hash_1` for the single Merkle proof reference and compare it to our block hash.

```python
assert h_proof.refs[0].get_hash(0) == block_id.root_hash
```
Now, we can trust all other data in the cell.

_Checking proof examples:_ [Python](https://github.com/yungwine/pytoniq-core/blob/873a96aa2256db33b8f35fbe2ab8fe8cf8ae49c7/pytoniq_core/proof/check_proof.py#L19), [Kotlin](https://github.com/andreypfau/ton-kotlin/blob/b1edc4b134e89ccf252149f27c85fd530377cebe/ton-kotlin-liteclient/src/commonMain/kotlin/CheckProofUtils.kt#L15), [C++](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/check-proof.cpp#L34)

## Full block

In the `liteserver.getBlock` method, proof verification is performed in the same manner as described above. However, it includes full cells instead of pruned branches for the [value flow](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L464), [state update](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413), and [block extra](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L452) schemas.


## Shard block

Shard proofs verify that a shard reference is stored in the MasterChain block provided to the liteserver. These proofs are necessary when calling the following methods:
- `liteServer.getShardInfo`
- `liteServer.getAccountState`
- `liteServer.runSmcMethod`

To request shard info from the liteserver for the MasterChain block mentioned above, we can execute the following code:

```python
await client.raw_get_shard_info(master, wc=0)
```
The liteserver response contains the `BlockIdExt` of the shard block:
```json
<TL BlockIdExt [wc=0, shard=-9223372036854775808, seqno=36908135, root_hash=39e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27, file_hash=f1f0e5cdc4b8a12cf2438dcab60f4712d1dc04f3792b1d72f2500cbf640948b7] >
```
Shard proof BoC:

<details>

  <summary><b>Show BoC</b></summary>

```boc

b5ee9c72010219020004b9010009460332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f0209460351ed3b9e728e7c548b15a5e5ce988b4a74984c3f8374f3f1a52c7b1f46c26406001611245b9023afe2ffffff1100ffffffff000000000000000001dc65010000000164b6c356000023d38ba6400401dc64fd600304050628480101affe84cdd73951bce07eeaad120d00400295220d6f66f1163b5fa8668202d72b000128480101faed0dd3ca110ada3d22980e3795d2bdf15450e9159892bbf330cdfd13a3b880016e22330000000000000000ffffffffffffffff820ce9d9c3929379c82807082455cc26aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac23519b11eddc69b7e090a0b0c28480101a5a7d24057d8643b2527709d986cda3846adcb3eddc32d28ec21f69e17dbaaef000128480101deab5a5aaf79c5e24f8dcbbe51747d6804104f75f58ed5bed4702c353545c6ac00110103d0400d284801015394592e3a3f1e3bc2d4249e993d0ec1e33ca18f49533991274ebc65276cd9a5001122bf0001aaa0161d000702816000047a7172dfb88800011e8b625908200ee215f71061846393a08c682e87bc3a12aff2d246eb97a09164f5657f96f9a252ef71580fe5309a823f73f3c4c3f8ab73f5a85bbf204bfd22e68d36d0efab1818e7b428be0f1028480101b20e36a3b36a4cdee601106c642e90718b0a58daf200753dbb3189f956b494b6000101db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a0e001343c9b67a721dcd6500202848010150fcc05bd9723571b83316a5f650be31edb131d05fdc78d271486e5d4ef077e1001928480101e5be728200b172cf7e2356cba2ae1c6e2c790be7c03cd7814c6e6fe3080b944b0011241011ef55aaffffff111213141501a09bc7a98700000000040101dc65010000000100ffffffff000000000000000064b6c356000023d38ba64000000023d38ba64004886d00960007028101dc64fd01dc42bec400000003000000000000002e16284801018c6053c1185700c0fe4311d5cf8fa533ea0382e361a7b76d0cf299b75ac0356c00032a8a0478e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e432bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046016f016f1718284801015720b6aefcbf406209522895faa6c0d10cc3315d90bcaf09791b19f595e86f8f00070098000023d38b96fdc401dc650048a3971c46472b85c8d761060a6e7ae9f13a90cdda815915a89597cfecb393a6b568807adfb3c1c5efc920907225175db61ca384e4f8b313799e3cbb8b7b4085688c010378e0f0e601ba1161ecc1395e9a0475c4f80aadbd6c483f210e96e29cf36789e46492304dfb6ef9149781871464af686056a9627f882f60e3b24f8c944a75ebaf016f0014688c010332bf3592969931ca4fbc7715494b50597f1884c0d847456029d8cf0e526e6046da58493ccb5da3876129b0190f3c375e69e59c3ad9ff550be708999dad1f6f39016f0014

```
</details>

The `shard_descr` BoC can be used if the liteserver is trusted.

<details>

  <summary><b>Show BoC</b></summary>

```boc

b5ee9c7201010201007d0001db50119963380ee3280800011e9c5cb7ee0000011e9c5cb7ee29cf2e5e52dfb4ba85aecc4bc3961d06bd1f30a7290e29f26f3947d7f69c6e713f8f872e6e25c50967921c6e55b07a38968ee0279bc958eb97928065fb204a45b88000381abc00000000000000000ee327eb25b61a8a01001343c9b67a721dcd650020

```
</details>

After deserializing the shard proof BoC, 2 root cells are obtained:

```json
[<Cell 280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> 1 refs>, <Cell 280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> 1 refs>]
```

The first root is a MasterChain block Merkle proof, which must be verified using the `check_block_header` function:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```

The cell
```json
552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
    560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
    560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
}
```

Is a Merkle update of the [ShardState](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L412-L413) TLB schema. The resulting new hash should be stored.

After verifying that the only Merkle proof cell reference `Hash_1` matches the known block hash and storing the new ShardState hash, proceed to validate the second `shard proof` cell:


```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			9[D000] -> {
				878[50119963380EE3280800011E9C5CB7EE0000011E9C5CB7EE29CF2E5E52DFB4BA85AECC4BC3961D06BD1F30A7290E29F26F3947D7F69C6E713F8F872E6E25C50967921C6E55B07A38968EE0279BC958EB97928065FB204A45B88000381ABC00000000000000000EE327EB25B61A88] -> {
					74[43C9B67A721DCD650000]
				}
			},
			288[01015394592E3A3F1E3BC2D4249E993D0EC1E33CA18F49533991274EBC65276CD9A50011],
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			288[0101B20E36A3B36A4CDEE601106C642E90718B0A58DAF200753DBB3189F956B494B60001]
		}
	}
}
```

The Merkle proof reference in this cell has the prefix `9023AFE2`, corresponding to the [ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410) TLB schema. This reference's `Hash_1` must match the hash stored in the previous step:

```python
"""
Here mc_block_cell is the first shard proof root and mc_state_root is the second one.
The check_block_header_proof function returns new hash of the ShardState Merkle Update.
"""

mc_state_hash = mc_state_root[0].get_hash(0)
state_hash = check_block_header_proof(mc_block_cell[0], blk.root_hash, True)

if mc_state_hash != state_hash:
    raise ProofError('mc state hashes mismatch')
```

* _Why?_ — We can trust the associated cell data because the block header proof is verified. Therefore, the new hash from the ShardState Merkle update is considered trusted. We must confirm the hashes match to validate the second cell’s data.

Now, proceed to deserialize the second cell:

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': {
            0: {'list': [{
                    'seq_no': 36908135,
                    'reg_mc_seqno': 31220993,
                    'start_lt': 39391487000000,
                    'end_lt': 39391487000005,
                    'root_hash': b"9\xe5\xcb\xca[\xf6\x97P\xb5\xd9\x89xr\xc3\xa0\xd7\xa3\xe6\x14\xe5!\xc5>M\xe7(\xfa\xfe\xd3\x8d\xce'",
                    'file_hash': b'\xf1\xf0\xe5\xcd\xc4\xb8\xa1,\xf2C\x8d\xca\xb6\x0fG\x12\xd1\xdc\x04\xf3y+\x1dr\xf2P\x0c\xbfd\tH\xb7',
                    'before_split': False,
                    'before_merge': False,
                    'want_split': False,
                    'want_merge': True,
                    'nx_cc_updated': False,
                    'flags': 0,
                    'next_catchain_seqno': 459607,
                    'next_validator_shard': 9223372036854775808,
                    'min_ref_mc_seqno': 31220989,
                    'gen_utime': 1689699153,
                    'split_merge_at': None,
                    'fees_collected': {'grams': 1016817575, 'other': None}, 'funds_created': {'grams': 1000000000, 'other': None}
                }]
            }
        },
        'config': {'config_addr': '5555555555555555555555555555555555555555555555555555555555555555', 'config': None},
        'flags': 1,
        'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
        'prev_blocks': None,
        'after_key_block': True,
        'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
        'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
        'global_balance': {'grams': 5089971531496870767, 'other': None}
    }
}
```

Since this cell is trusted, we can also trust the shard block data  (`ShardStateUnsplit` -> `custom` -> `shard_hashes` -> `0 (shrdblk wc)` -> `leaf`).

## Account state

Next, let's prove the state of account `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG` for the same MasterChain block referenced at the beginning of this article.

The liteserver [response](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L38) includes the MasterChain block ID, which must match the one sent to the liteserver, the shard block ID, and a `shard_proof` BoC, which must be verified as described above, along with a `proof` BoC and a `state` BoC.


<details>

  <summary><b>Show BoCs</b></summary>

```boc
Proof BoC:
    b5ee9c7201023d020008480100094603f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6902190209460339e5cbca5bf69750b5d9897872c3a0d7a3e614e521c53e4de728fafed38dce27001d34235b9023afe2ffffff110000000000000000000000000002332c670000000164b6c351000023d38b96fdc501dc64fd200304052848010138f8d1c6e9f798a477d13aa26cb4d6cfe1a17949ac276b2f1e0ce037a521b9bc0001221382097522af06ffaff1f0063321d90000000000000000ffffffffffffffff825d48abc1bfebfc7bc2df8993c189361000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db83323130104ba9157837fd7f8f8070833231301032030fdc45f2d3838090a0b284801013e38e2548c5236a9652c45e553ced677f76550097b94138a4576f122443944d400692848010159e1a18ee4e5670306b5203912c87dffc17898f0999bd128a6965027d53b6fa40215231301013fa38088aaea2b780c0d10284801016f315f25b4a39ac12c85fea4ecfe7a83e5e59d1f059783fa0c3ef2797308806100002848010188d5f8a73382aea73dede03fc3bcda2634a717ef50e7428d5a4a44c771b014b90066231301005ecd9e51e5d22a380e0f1023130100303b3b607d7ffc781112132848010182eb0e24c842092ec2705486cbbe98de8016d55f5cff4ea910471a4c3a7a1cf1003b28480101ed7e26bd36efa6d5d9b4f6aaab9813af0742a84244977f74fd4074c9c98908be000028480101ca85960e3fc3dfb6d26e83ae87a837ae5c2faf7c8d43ea177393c602fadaa0300039221100e0f41ada252e2f08141528480101d7acbb602338c86d610f35cfb362fd76fc18b1812476b6fca99a0678e665fcf50000284801014fae109c41f3d5e2be0a3ff00a007f2e50a796797700d18a7aa663e531c37180002d221100e05c33225b78bce8161728480101545b5925b3ab2a8df2470fe22a5a3c9cc64e3cb24407c26167e0fbb476e05309002c221100e03480847f372168181928480101844a14c99695506e920635d18e76d9e685adee74e5fba6f6d3b371ca77e348130029220f00d0b1cce62aecc81a1b220f00c625c7e90dfc681c1d284801019ca2157c92d49b9d051388de45d07072c78a3aa65a5b05547d94e0369aa6bdee002a284801010326812b62712345473070d679bc38cdbbce58b7a2bf6c5c6f091fc8d36e81cd001f220f00c279d628dbf2081e1f220f00c0b8f29f9d04e82021284801019143abf2a72662054eda4f4949d010c897aff4383b514b387cff790408231c6c001a28480101de5072f46a0e0ecab2bbfc2cfc62a3fe200f12d5d457df833a46eb747fa004e30059220f00c03fa2ec9ad848222328480101baee90fd11a130d6d2e2ded21ae4a7b86553116015b7e7ebfc52369534d298b20017220f00c02e722bded7282425220d00ab138e7f18482627284801017f1df311101e472b1d443334d2426fd339539f558694c60e3428221dcb1a5478001628480101e1fc242c29e519f9740ca2570d85779aed0c593cc36b59119852945988e186960015220d00a21324d3ff2828292848010199fe288fdce2606d39f9b6af72f9c2643ef06e6bacc15dd72cfa84d63c9e44a40013220d00a1e877ec8ba82a2b284801019e019e92be76a5ae7aee239299f561682afbe445dc42ee57ccc31ecb427fdf42000e220d00a1db848431a82c2d284801012345b80e66c025fb62c41261b5d230616303ec47f3bb7a255872fada62a1e8bf0010220d00a1d633bc10682e2f220d00a02ca3ddc468303128480101654781e5d466ec4ca50cb2983b20170bb5d90e2e6ab83ed7d42a829651a5eec1000a219abb19e61b8190c2587677c010ce49a93364b965f7762a9810d916b082f45e080a02bc35ebaa649b46ac72e6e4d4c1293b66d58d9ed7a54902beefd97f5bff7977dd85998b3d000023c5643934413228480101edced2278013ea497dd2e286f495b4f7f8df6ea73e08e85414fc43a611c17797000b284801018282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488000828480101b3e9649d10ccb379368e81a3a7e8e49c8eb53f6acc69b0ba2ffa80082f70ee390001241011ef55aaffffff113536373802a09bc7a98700000000840102332c67000000010000000000000000000000000064b6c351000023d38b96fdc0000023d38b96fdc5d41c6e3c0007035701dc64fd01dc42bec400000003000000000000002e393a28480101cb54530ac857df730e82ee239b2150528c6e5f6ed3678eab6e1e789f0e3c7a5300032a8a04f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db0f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd69021902193b3c28480101d0cf03a1058c2fd6029288951051a0d82733953c1e9181a67c502ce59b180200000b0098000023d38b69370401dc64fd2fa78ec529bcf9931e14f9d8b27ec1469290c0baef8256d657ce573b9679c5997431fcda6bf2d0be39344a9336cfe0ae9c844a88d2bd8022102e4012a760d4db0098000023d38b87bb8402332c662b4e96320f9d0afb02e5d55b6b42c3349e33540620ecc07b399211fd56e4de3e2555617cdde457cd65a0ad033aafc0c6c25df716b04e455f49179668a46300db688c0103f2ad1ede336a68623ddabf36cb8fa405dbe70a38c453f711000f9a9f92592db04a4ff9713b206e420baaee4dd21febbeb426fcd9ce158db2a56dce9188fc313e0219001b688c0103f93fe5eda41a6ce9ecb353fd589842bd3f5d5e73b846cb898525293fc742fd6987d796744ca386906016c56921370d01f72cb004a1d7c294752afe4446da07bb0219001b
State BoC:
    b5ee9c720102160100033c000271c006f5bc67986e06430961d9df00433926a4cd92e597ddd8aa6043645ac20bd178222c859043259e0d9000008f1590e4d10d405786bd75534001020114ff00f4a413f4bcf2c80b030051000000e929a9a317c1b3226ce226d6d818bafe82d3633aa0f06a6c677272d1f9b760ff0d0dcf56d8400201200405020148060704f8f28308d71820d31fd31fd31f02f823bbf264ed44d0d31fd31fd3fff404d15143baf2a15151baf2a205f901541064f910f2a3f80024a4c8cb1f5240cb1f5230cbff5210f400c9ed54f80f01d30721c0009f6c519320d74a96d307d402fb00e830e021c001e30021c002e30001c0039130e30d03a4c8cb1f12cb1fcbff1213141502e6d001d0d3032171b0925f04e022d749c120925f04e002d31f218210706c7567bd22821064737472bdb0925f05e003fa403020fa4401c8ca07cbffc9d0ed44d0810140d721f404305c810108f40a6fa131b3925f07e005d33fc8258210706c7567ba923830e30d03821064737472ba925f06e30d08090201200a0b007801fa00f40430f8276f2230500aa121bef2e0508210706c7567831eb17080185004cb0526cf1658fa0219f400cb6917cb1f5260cb3f20c98040fb0006008a5004810108f45930ed44d0810140d720c801cf16f400c9ed540172b08e23821064737472831eb17080185005cb055003cf1623fa0213cb6acb1fcb3fc98040fb00925f03e20201200c0d0059bd242b6f6a2684080a06b90fa0218470d4080847a4937d29910ce6903e9ff9837812801b7810148987159f31840201580e0f0011b8c97ed44d0d70b1f8003db29dfb513420405035c87d010c00b23281f2fff274006040423d029be84c6002012010110019adce76a26840206b90eb85ffc00019af1df6a26840106b90eb858fc0006ed207fa00d4d422f90005c8ca0715cbffc9d077748018c8cb05cb0222cf165005fa0214cb6b12ccccc973fb00c84014810108f451f2a7020070810108d718fa00d33fc8542047810108f451f2a782106e6f746570748018c8cb05cb025006cf165004fa0214cb6a12cb1fcb3fc973fb0002006c810108d718fa00d33f305224810108f459f2a782106473747270748018c8cb05cb025005cf165003fa0213cb6acb1f12cb3fc973fb00000af400c9ed54
```
</details>

After verifying the `shard_proof`, the `proof` and `state` cells must be deserialized. The `proof` cell must contain exactly 2 root cells:


```json

[<Cell 280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> 1 refs>, <Cell 280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> 1 refs>]

```

The first `root` is a Merkle proof for the shard block, whose hash we have already verified and trusted.

```json
280[0339E5CBCA5BF69750B5D9897872C3A0D7A3E614E521C53E4DE728FAFED38DCE27001D] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000840102332C67000000010000000000000000000000000064B6C351000023D38B96FDC0000023D38B96FDC5D41C6E3C0007035701DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB],
			608[000023D38B87BB8402332C662B4E96320F9D0AFB02E5D55B6B42C3349E33540620ECC07B399211FD56E4DE3E2555617CDDE457CD65A0AD033AAFC0C6C25DF716B04E455F49179668A46300DB]
		},
		288[0101CB54530AC857DF730E82EE239B2150528C6E5F6ED3678EAB6E1E789F0E3C7A530003],
		552[04F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB0F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6902190219] -> {
			560[0103F2AD1EDE336A68623DDABF36CB8FA405DBE70A38C453F711000F9A9F92592DB04A4FF9713B206E420BAAEE4DD21FEBBEB426FCD9CE158DB2A56DCE9188FC313E0219001B],
			560[0103F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD6987D796744CA386906016C56921370D01F72CB004A1D7C294752AFE4446DA07BB0219001B]
		},
		288[0101D0CF03A1058C2FD6029288951051A0D82733953C1E9181A67C502CE59B180200000B]
	}
}
```

As in the `shard_proof` verification, the `check_block_header` function must validate the block cell and record the new `StateUpdate` hash.

Next, deserialize the second root (`state_cell`) and verify that its `Hash_1` matches the previously recorded hash:

```python
proof_cells = Cell.from_boc(proof)
if len(proof_cells) != 2:
    raise ProofError('expected 2 root cells in account state proof')

state_cell = proof_cells[1]

state_hash = check_block_header_proof(proof_cells[0][0], shrd_blk.root_hash, True)

if state_cell[0].get_hash(0) != state_hash:
    raise ProofError('state hashes mismatch')
```

Once the hash matches, the `state_cell` can be trusted. Its structure is as follows:

<details>

  <summary><b>Show cell</b></summary>

```json
280[03F93FE5EDA41A6CE9ECB353FD589842BD3F5D5E73B846CB898525293FC742FD690219] -> {
	362[9023AFE2FFFFFF110000000000000000000000000002332C670000000164B6C351000023D38B96FDC501DC64FD00] -> {
		288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001],
		75[82097522AF06FFAFF1E0] -> {
			76[0104BA9157837FD7F8F0] -> {
				76[01032030FDC45F2D3830] -> {
					288[010159E1A18EE4E5670306B5203912C87DFFC17898F0999BD128A6965027D53B6FA40215],
					76[01013FA38088AAEA2B70] -> {
						288[010188D5F8A73382AEA73DEDE03FC3BCDA2634A717EF50E7428D5A4A44C771B014B90066],
						76[01005ECD9E51E5D22A30] -> {
							76[0100303B3B607D7FFC70] -> {
								288[0101CA85960E3FC3DFB6D26E83AE87A837AE5C2FAF7C8D43EA177393C602FADAA0300039],
								68[00E0F41ADA252E2F00] -> {
									288[01014FAE109C41F3D5E2BE0A3FF00A007F2E50A796797700D18A7AA663E531C37180002D],
									68[00E05C33225B78BCE0] -> {
										288[0101545B5925B3AB2A8DF2470FE22A5A3C9CC64E3CB24407C26167E0FBB476E05309002C],
										68[00E03480847F372160] -> {
											288[0101844A14C99695506E920635D18E76D9E685ADEE74E5FBA6F6D3B371CA77E348130029],
											60[00D0B1CCE62AECC0] -> {
												60[00C625C7E90DFC60] -> {
													288[01010326812B62712345473070D679BC38CDBBCE58B7A2BF6C5C6F091FC8D36E81CD001F],
													60[00C279D628DBF200] -> {
														60[00C0B8F29F9D04E0] -> {
															288[0101DE5072F46A0E0ECAB2BBFC2CFC62A3FE200F12D5D457DF833A46EB747FA004E30059],
															60[00C03FA2EC9AD840] -> {
																288[0101BAEE90FD11A130D6D2E2DED21AE4A7B86553116015B7E7EBFC52369534D298B20017],
																60[00C02E722BDED720] -> {
																	52[00AB138E7F1840] -> {
																		288[0101E1FC242C29E519F9740CA2570D85779AED0C593CC36B59119852945988E186960015],
																		52[00A21324D3FF20] -> {
																			288[010199FE288FDCE2606D39F9B6AF72F9C2643EF06E6BACC15DD72CFA84D63C9E44A40013],
																			52[00A1E877EC8BA0] -> {
																				288[01019E019E92BE76A5AE7AEE239299F561682AFBE445DC42EE57CCC31ECB427FDF42000E],
																				52[00A1DB848431A0] -> {
																					288[01012345B80E66C025FB62C41261B5D230616303EC47F3BB7A255872FADA62A1E8BF0010],
																					52[00A1D633BC1060] -> {
																						52[00A02CA3DDC460] -> {
																							616[BB19E61B8190C2587677C010CE49A93364B965F7762A9810D916B082F45E080A02BC35EBAA649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
																								288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
																							},
																							288[0101EDCED2278013EA497DD2E286F495B4F7F8DF6EA73E08E85414FC43A611C17797000B]
																						},
																						288[0101654781E5D466EC4CA50CB2983B20170BB5D90E2E6AB83ED7D42A829651A5EEC1000A]
																					}
																				}
																			}
																		}
																	},
																	288[01017F1DF311101E472B1D443334D2426FD339539F558694C60E3428221DCB1A54780016]
																}
															}
														},
														288[01019143ABF2A72662054EDA4F4949D010C897AFF4383B514B387CFF790408231C6C001A]
													}
												},
												288[01019CA2157C92D49B9D051388DE45D07072C78A3AA65A5B05547D94E0369AA6BDEE002A]
											}
										}
									}
								},
								288[0101D7ACBB602338C86D610F35CFB362FD76FC18B1812476B6FCA99A0678E665FCF50000]
							},
							288[010182EB0E24C842092EC2705486CBBE98DE8016D55F5CFF4EA910471A4C3A7A1CF1003B],
							288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
						},
						288[0101ED7E26BD36EFA6D5D9B4F6AAAB9813AF0742A84244977F74FD4074C9C98908BE0000]
					},
					288[01016F315F25B4A39AC12C85FEA4ECFE7A83E5E59D1F059783FA0C3EF279730880610000]
				},
				288[01013E38E2548C5236A9652C45E553CED677F76550097B94138A4576F122443944D40069],
				288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
			},
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		},
		868[0000000000000000FFFFFFFFFFFFFFFF825D48ABC1BFEBFC7BC2DF8993C189361000023D38B69370401DC64FD2FA78EC529BCF9931E14F9D8B27EC1469290C0BAEF8256D657CE573B9679C5997431FCDA6BF2D0BE39344A9336CFE0AE9C844A88D2BD8022102E4012A760D4DB0] -> {
			288[0101B3E9649D10CCB379368E81A3A7E8E49C8EB53F6ACC69B0BA2FFA80082F70EE390001]
		}
	}
}
```

</details>

The only Merkle proof reference has the prefix `9023AFE2`, which corresponds to the [ShardStateUnsplit](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L410) TLB schema.
Therefore, it must be deserialized accordingly.

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': 0, 'shard_prefix': 0},
    'seq_no': 36908135,
    'vert_seq_no': 1,
    'gen_utime': 1689699153,
    'gen_lt': 39391487000005,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[010138F8D1C6E9F798A477D13AA26CB4D6CFE1A17949AC276B2F1E0CE037A521B9BC0001] -> 0 refs>,
    'before_split': 0,
    'accounts': (
        {
            50368879097771769677871174881221998657607998794347754829932074327482686052226: {
                'account': None,
                'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
                'last_trans_lt': 39330697000001,
                'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
            }
        },
        [
            {'split_depth': 0, 'balance': {'grams': 5873792469, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 5991493155, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63109456003, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 63822897549, 'other': None}},
            ...
            {'split_depth': 0, 'balance': {'grams': 21778458402704, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 54074699968483, 'other': None}},
            {'split_depth': 0, 'balance': {'grams': 2725956214994157511, 'other': None}}
        ]
    ),
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2725956214994157511, 'other': None},
    'total_validator_fees': {'grams': 37646260890702444, 'other': None},
    'libraries': None,
    'master_ref': {'master': {'end_lt': 39391484000004, 'seqno': 31220989, 'root_hash': b'/\xa7\x8e\xc5)\xbc\xf9\x93\x1e\x14\xf9\xd8\xb2~\xc1F\x92\x90\xc0\xba\xef\x82V\xd6W\xceW;\x96y\xc5\x99', 'file_hash': b't1\xfc\xdak\xf2\xd0\xbe94J\x936\xcf\xe0\xae\x9c\x84J\x88\xd2\xbd\x80"\x10.@\x12\xa7`\xd4\xdb'}},
    'custom': None
}
```

We now need the `account` field, which is of type [ShardAccounts](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L261).
`ShardAccounts` is a HashmapAugE, where the key is the address `hash_part`, the value is type `ShardAccount`, and the extra field is type `DeepBalanceInfo`.

Parsing the address `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`, we obtain the `hash_part` equal to:

`50368879097771769677871174881221998657607998794347754829932074327482686052226`

We then use this key to retrieve the corresponding value from the Hashmap.

```python
{
    50368879097771769677871174881221998657607998794347754829932074327482686052226: {
        'account': None,
        'last_trans_hash': b'd\x9bF\xacr\xe6\xe4\xd4\xc1);f\xd5\x8d\x9e\xd7\xa5I\x02\xbe\xef\xd9\x7f[\xffyw\xdd\x85\x99\x8b=',
        'last_trans_lt': 39330697000001,
        'cell': <Cell 320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> 1 refs>
    }
}
```

We need to store the values of `last_trans_hash` and `last_trans_lt`, as they can be used later to retrieve the account's transactions. Let's examine the entire cell containing this data.

```json
320[649B46AC72E6E4D4C1293B66D58D9ED7A54902BEEFD97F5BFF7977DD85998B3D000023C564393441] -> {
	288[01018282D13BF66B9ACE1FBF5D3ABD1C59CC46D61AF1D47AF1665D3013D8F9E474880008]
}
```

This is a regular cell with level 1, containing a single reference — the pruned account data. We compute the `Hash_1` of this pruned branch, which serves as the trusted account state hash:

`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`.

The next step is to deserialize the `state` BoC:

```json
449[C006F5BC67986E06430961D9DF00433926A4CD92E597DDD8AA6043645AC20BD178222C859043259E0D9000008F1590E4D10D405786BD755300] -> {
	80[FF00F4A413F4BCF2C80B] -> {
		2[00] -> {
			4[40] -> {
				920[D001D0D3032171B0925F04E022D749C120925F04E002D31F218210706C7567BD22821064737472BDB0925F05E003FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F07E005D33FC8258210706C7567BA923830E30D03821064737472BA925F06E30D] -> {
					480[01FA00F40430F8276F2230500AA121BEF2E0508210706C7567831EB17080185004CB0526CF1658FA0219F400CB6917CB1F5260CB3F20C98040FB0006],
					552[5004810108F45930ED44D0810140D720C801CF16F400C9ED540172B08E23821064737472831EB17080185005CB055003CF1623FA0213CB6ACB1FCB3FC98040FB00925F03E2]
				},
				2[00] -> {
					2[00] -> {
						4[50] -> {
							242[B29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C40],
							2[00] -> {
								97[ADCE76A26840206B90EB85FF80],
								97[AF1DF6A26840106B90EB858F80]
							}
						},
						68[B8C97ED44D0D70B1F0]
					},
					357[BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F3180]
				}
			},
			992[F28308D71820D31FD31FD31F02F823BBF264ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF] -> {
				440[D207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC973FB00C84014810108F451F2A702],
				448[810108D718FA00D33FC8542047810108F451F2A782106E6F746570748018C8CB05CB025006CF165004FA0214CB6A12CB1FCB3FC973FB0002],
				432[810108D718FA00D33F305224810108F459F2A782106473747270748018C8CB05CB025005CF165003FA0213CB6ACB1F12CB3FC973FB00],
				40[F400C9ED54]
			}
		}
	},
	321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800]
}
```

Compute its representation hash, and verify that it matches the trusted hash obtained from the pruned data:

`8282d13bf66b9ace1fbf5d3abd1c59cc46d61af1d47af1665d3013d8f9e47488`.

Finally, the BoC is deserialized using the [account](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L231-L233) TLB Scheme.

```python
{
    'addr': Address<EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG>,
    'storage_stat': {'used': {'cells': 22, 'bits': 5697, 'public_cells': None}, 'last_paid': 1689502130, 'due_payment': None},
    'storage': {
        'last_trans_lt': 39330697000003,
        'balance': {'grams': 5873792469, 'other': None},
        'state': {
            'type_': 'account_active',
            'state_init': {'split_depth': None, 'special': None, 'code': <Cell 80[FF00F4A413F4BCF2C80B] -> 1 refs>, 'data': <Cell 321[000000E929A9A317C1B3226CE226D6D818BAFE82D3633AA0F06A6C677272D1F9B760FF0D0DCF56D800] -> 0 refs>, 'library': None}
        }
    }
}
```

At this point, the account state data is verified and trusted.

## Account transactions

For the [liteServer.getTransactions](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L94) request, we must provide the `lt` and `hash` of the transaction to start from.
If we want to retrieve an account's latest transactions, we can extract the `lt` and `hash` from the trusted `ShardAccount`, as described above.

When the liteserver returns the transactions, it provides a BoC containing the requested number of transaction roots. Each root is a cell that should be deserialized using the [transaction](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L263-L269) TLB scheme.
For the first transaction cell, verify that its hash matches the `last_trans_hash` from the account state. Then, store the `prev_trans_hash` field, compare it to the hash of the second transaction root, and continue the verification process in this manner.



## Block transactions

Next, we query the liteserver for the list of transactions belonging to the block we started with at the beginning of this article.
The liteserver [response](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L47) includes `ids` field with the transaction list and a `proof` BoC.
The first step is to deserialize the `proof`:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		288[0101F8039FE65901BE422094ED29FA05DD4A9406708D7C54EBF7F6010F2E8A9DCBB10001],
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		288[0101741100D622B0D5264BCDB86A14E36FC8C349B82AE49E037002EB07079EAD8B060015],
		545[4A33F6FD11224E018A0801116DBA929FAA60F8B9DFB39286C07FDE613D4F158E4031612597E23F312DA061732C2DB7C7C7F0BCA6295EF25D04F46FA21A055CF213A1270A80] -> {
			288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004],
			6[00],
			6[80] -> {
				9[4000] -> {
					605[BFB333333333333333333333333333333333333333333333333333333333333333029999999999999999999999999999999999999999999999999999999999999999CF800008F4E2E9900000] -> {
						9[5000] -> {
							288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002]
						},
						9[4000] -> {
							288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002]
						},
						520[7239A4AED4308E2E6AC11C880CCB29DFEE407A3E94FC1EDBDD4D29AF3B5DFEEE58A9B07203A0F457150A2BF7972DA7E2A79642DEBE792E919DE5E2FC284D2B158A]
					},
					607[BF955555555555555555555555555555555555555555555555555555555555555502AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0000008F4E2E99000C0] -> {
						288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002],
						520[72899B3A210DDD28D905C583FF8559BCF73D0CF0C05C11210BD7059BAB2AB453E03524184B116C9E39D9D5293179588F4B7D8F5D8192FEFE66B9FE40A71518DBC7]
					}
				}
			},
			288[01010FC5CF36DC84BC46E7175768AB3EC0F94988D454F2C496DC1AC32E638CD3C23D0005]
		}
	}
}
```

We must verify the **block header proof** to trust the cell's contents. Once verified, we can deserialize it using the block TLB Scheme.

```python
{
    'global_id': -239,
    'info': None,
    'value_flow': None,
    'state_update': None,
    'extra': {
        'in_msg_descr': <Cell 288[0101E057F7AA0545EF9E6BF187542A5141298303A33BA7C9CE26C71FFD9C7D2050600004] -> 0 refs>,
        'out_msg_descr': ({}, [<Slice 5[00] -> 0 refs>]),
        'account_blocks': (
            {
                23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
                    'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
                    'transactions': (
                        {
                            39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                            39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
                        },
                        [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
                },
                38597363079105398474523661669562635951089994888546854679819194669304376546645: {
                    'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
                    'transactions': (
                        {
                            39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
                        },
                    [{'grams': 0, 'other': None}]
                    ),
                    'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
                }
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'rand_seed': b'\x11"N\x01\x8a\x08\x01\x11m\xba\x92\x9f\xaa`\xf8\xb9\xdf\xb3\x92\x86\xc0\x7f\xdea=O\x15\x8e@1a%',
        'created_by': b"\x97\xe2?1-\xa0as,-\xb7\xc7\xc7\xf0\xbc\xa6)^\xf2]\x04\xf4o\xa2\x1a\x05\\\xf2\x13\xa1'\n",
        'custom': None
    }
}
```

After successful deserialization, we should extract and remember the following field: `block` -> `extra` -> `account_blocks`.
This field has the type [ShardAccountBlocks](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L282), which is a `HashmapAugE`, where:
- The key is the address `hash_part`.
- The value is of type [AccountBlock](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L277-L280).
- The extra data is a `CurrencyCollection`.

```python
{
    23158417847463239084714197001737581570653996933128112807891516801582625927987:  {
        'account_addr': '3333333333333333333333333333333333333333333333333333333333333333',
        'transactions': (
            {
                39391488000001: <Cell 288[01015EF0532AF460BCF3BECF1A94597C1EC04879E0F26BF58269D319121376AAD4730002] -> 0 refs>,
                39391488000002: <Cell 288[0101B1E091FCB9DF53917EAA0CAE05041B3D0956242871E3CA8D6909D0AA31FF36040002] -> 0 refs>
            },
            [{'grams': 0, 'other': None}, {'grams': 0, 'other': None}, {'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'9\xa4\xae\xd40\x8e.j\xc1\x1c\x88\x0c\xcb)\xdf\xee@z>\x94\xfc\x1e\xdb\xddM)\xaf;]\xfe\xeeX', 'new_hash': b'\xa9\xb0r\x03\xa0\xf4W\x15\n+\xf7\x97-\xa7\xe2\xa7\x96B\xde\xbey.\x91\x9d\xe5\xe2\xfc(M+\x15\x8a'}
    },
    38597363079105398474523661669562635951089994888546854679819194669304376546645: {
        'account_addr': '5555555555555555555555555555555555555555555555555555555555555555',
        'transactions': (
            {
                39391488000003: <Cell 288[0101924B5992DF95114196994A6D449D89E1C002CB96C14D11C4A667F843A3FAF4410002] -> 0 refs>
            },
        [{'grams': 0, 'other': None}]
        ),
        'state_update': {'old_hash': b'\x89\x9b:!\r\xdd(\xd9\x05\xc5\x83\xff\x85Y\xbc\xf7=\x0c\xf0\xc0\\\x11!\x0b\xd7\x05\x9b\xab*\xb4S\xe0', 'new_hash': b'5$\x18K\x11l\x9e9\xd9\xd5)1yX\x8fK}\x8f]\x81\x92\xfe\xfef\xb9\xfe@\xa7\x15\x18\xdb\xc7'}
    }
}
```

Now, let's check the `ids` field:

```python
[
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000001, 'hash': '5ef0532af460bcf3becf1a94597c1ec04879e0f26bf58269d319121376aad473'},
    {'mode': 39, 'account': '3333333333333333333333333333333333333333333333333333333333333333', 'lt': 39391488000002, 'hash': 'b1e091fcb9df53917eaa0cae05041b3d0956242871e3ca8d6909d0aa31ff3604'},
    {'mode': 39, 'account': '5555555555555555555555555555555555555555555555555555555555555555', 'lt': 39391488000003, 'hash': '924b5992df95114196994a6d449d89e1c002cb96c14d11c4a667f843a3faf441'}
]
```

For each transaction, we should find its corresponding entry in the `account_blocks` we remembered and verify that their hashes match:

```python
block_trs: dict = acc_block.get(int(tr['account'], 16)).transactions[0]
block_tr: Cell = block_trs.get(tr['lt'])
assert block_tr.get_hash(0) == tr['hash']
```

:::note
In this example, checking the `ids` field was optional — we could have retrieved all transactions directly from the account blocks.
However, verifying the transaction proofs becomes essential when using the [liteServer.listBlockTransactionsExt](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L48) method, and you must compare transaction hashes.
:::

## Config

Request the following [config params](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L101) from the liteserver: 1, 4, 5, 7, 8, and 15 for [liteServer.getConfigAll](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L100), where all parameters are returned, and the proof verification remains the same.
The [response](https://github.com/ton-blockchain/ton/blob/v2025.03/tl/generate/scheme/lite_api.tl#L54) includes `state_proof` and `config_proof`.


First, deserialize the `state_proof` cell:

```json
280[0351ED3B9E728E7C548B15A5E5CE988B4A74984C3F8374F3F1A52C7B1F46C264060016] -> {
	64[11EF55AAFFFFFF11] -> {
		640[9BC7A98700000000040101DC65010000000100FFFFFFFF000000000000000064B6C356000023D38BA64000000023D38BA64004886D00960007028101DC64FD01DC42BEC400000003000000000000002E] -> {
			608[000023D38B96FDC401DC650048A3971C46472B85C8D761060A6E7AE9F13A90CDDA815915A89597CFECB393A6B568807ADFB3C1C5EFC920907225175DB61CA384E4F8B313799E3CBB8B7B4085]
		},
		288[01018C6053C1185700C0FE4311D5CF8FA533EA0382E361A7B76D0CF299B75AC0356C0003],
		552[0478E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E432BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F016F] -> {
			560[010378E0F0E601BA1161ECC1395E9A0475C4F80AADBD6C483F210E96E29CF36789E46492304DFB6EF9149781871464AF686056A9627F882F60E3B24F8C944A75EBAF016F0014],
			560[010332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046DA58493CCB5DA3876129B0190F3C375E69E59C3AD9FF550BE708999DAD1F6F39016F0014]
		},
		288[01015720B6AEFCBF406209522895FAA6C0D10CC3315D90BCAF09791B19F595E86F8F0007]
	}
}
```


To do this, verify the block header proof and store the new hash from the `StateUpdate`.

Next, deserialize the `config_proof` cell:

<details>

  <summary><b>Show cell</b></summary>

```json
280[0332BF3592969931CA4FBC7715494B50597F1884C0D847456029D8CF0E526E6046016F] -> {
	362[9023AFE2FFFFFF1100FFFFFFFF000000000000000001DC65010000000164B6C356000023D38BA6400401DC64FD40] -> {
		288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001],
		288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E],
		204[0000000000000000FFFFFFFFFFFFFFFF820CE9D9C3929379C820] -> {
			288[0101A5A7D24057D8643B2527709D986CDA3846ADCB3EDDC32D28EC21F69E17DBAAEF0001],
			288[0101DEAB5A5AAF79C5E24F8DCBBE51747D6804104F75F58ED5BED4702C353545C6AC0011]
		},
		342[CC26AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC23519B11EDDC69B7C] -> {
			288[0101C7DAE90A1FCEAD235CACC318A048986B2E12D0F68C136845669E02C4E28F018D0002],
			2[00] -> {
				8[D8] -> {
					2[00] -> {
						2[00] -> {
							2[00] -> {
								2[00] -> {
									2[00] -> {
										2[00] -> {
											288[0101F89085ED347F5F928A0DF7B1271F906F6E1EF43D89B5912774C8B42D0E24AB120001],
											2[00] -> {
												256[3333333333333333333333333333333333333333333333333333333333333333]
											}
										},
										4[40] -> {
											256[0000000000000000000000000000000000000000000000000000000000000000]
										}
									},
									2[00] -> {
										2[00] -> {
											2[00] -> {
												256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C]
											},
											2[00] -> {
												329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100]
											}
										},
										4[50] -> {
											1[80] -> {
												2[00] -> {
													83[BE000003BCB3670DC15540],
													83[BFFFFFFFBCBD1A94A20000]
												}
											}
										}
									}
								},
								2[00] -> {
									2[00] -> {
										2[00] -> {
											2[00] -> {
												104[C400000002000000000000002E]
											},
											288[0101C1F3C2ADA12BD901BBA1552C0C090CC3989649807C2B764D02548C1F664C20890007]
										},
										288[010187DADFBB3AE954E7F5472C46A729ED80AD087C5D9CEBB8D644D16DD73F88DF390009]
									},
									2[00] -> {
										288[01017CF937AF64AED1AB2CDD1435F8FF79F86E521320CC7B0CB30C9AAE81748124090002],
										2[00] -> {
											288[0101BEE8EB75C37500A75962E4FD99AFC62B3C9245948D2AC56061B0E21DDD6E9E840001],
											2[00] -> {
												128[00010000000080000000200000008000]
											}
										}
									}
								}
							},
							288[0101289F7704162F68EF3CC5B4865BD72067277E25B21514AB741396C54BD92294FA0009]
						},
						288[0101EF6962F43C1C86B216773B443F61829550DD9E956EE54EA3AC5C60E127DADD51000E]
					},
					288[0101112A0556A091DC4F72BD31FF2790783FB3238CE2AA41E1C137424D279664D7E3000A]
				},
				288[010124D21CF7AE96B1C55A1230E823DB0317CE24EC33E3BF2585C79605684304FAF20007]
			},
			766[0001AAA0161D000702816000047A7172DFB88800011E8B625908200EE215F71061846393A08C682E87BC3A12AFF2D246EB97A09164F5657F96F9A252EF71580FE5309A823F73F3C4C3F8AB73F5A85BBF204BFD22E68D36D0EFAB1818E7B428BC] -> {
				288[010150FCC05BD9723571B83316A5F650BE31EDB131D05FDC78D271486E5D4EF077E10019],
				288[0101E5BE728200B172CF7E2356CBA2AE1C6E2C790BE7C03CD7814C6E6FE3080B944B0011]
			},
			2[00] -> {
				83[BE000003BCB3670DC15540],
				83[BFFFFFFFBCBD1A94A20000]
			}
		}
	}
}
```

</details>
Compare the `Hash_1` from the Merkle proof (reference only) with the hash obtained from the `check_block_header` function above. If they match, the cell can be trusted:

```python
state_hash = check_block_header_proof(state_proof[0], block.root_hash, True)
if config_proof[0].get_hash(0) != state_hash:
    raise LiteClientError('hashes mismatch')
```

Next, deserialize the cell using the `ShardStateUnsplit` scheme:

```python
{
    'global_id': -239,
    'shard_id': {'shard_pfx_bits': 0, 'workchain_id': -1, 'shard_prefix': 0},
    'seq_no': 31220993,
    'vert_seq_no': 1,
    'gen_utime': 1689699158,
    'gen_lt': 39391488000004,
    'min_ref_mc_seqno': 31220989,
    'out_msg_queue_info': <Cell 288[0101AFFE84CDD73951BCE07EEAAD120D00400295220D6F66F1163B5FA8668202D72B0001] -> 0 refs>,
    'before_split': 0,
    'accounts': <Cell 288[0101FAED0DD3CA110ADA3D22980E3795D2BDF15450E9159892BBF330CDFD13A3B880016E] -> 0 refs>,
    'overload_history': 0,
    'underload_history': 18446744073709551615,
    'total_balance': {'grams': 2364000148715550620, 'other': None},
    'total_validator_fees': {'grams': 0, 'other': None},
    'libraries': None,
    'master_ref': None,
    'custom': {
        'shard_hashes': None,
        'config': {
            'config_addr': '5555555555555555555555555555555555555555555555555555555555555555',
            'config': {
                1: <Slice 256[3333333333333333333333333333333333333333333333333333333333333333] -> 0 refs>,
                4: <Slice 256[E56754F83426F69B09267BD876AC97C44821345B7E266BD956A7BFBFB98DF35C] -> 0 refs>,
                5: <Slice 329[01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF800000008000000100] -> 0 refs>,
                7: <Slice 1[80] -> 1 refs>,
                8: <Slice 104[C400000002000000000000002E] -> 0 refs>,
                15: <Slice 128[00010000000080000000200000008000] -> 0 refs>}
            },
            'flags': 1,
            'validator_info': {'validator_list_hash_short': 2862618141, 'catchain_seqno': 459393, 'nx_cc_updated': False},
            'prev_blocks': None,
            'after_key_block': True,
            'last_key_block': {'end_lt': 39382372000004, 'seqno': 31212222, 'root_hash': b'\xe2\x0c0\x8crt\x11\x8d\x05\xd0\xf7\x87BU\xfeZH\xddr\xf4\x12,\x9e\xac\xaf\xf2\xdf4J]\xee+', 'file_hash': b'\x01\xfc\xa6\x13PG\xee~x\x98\x7f\x15n~\xb5\x0bw\xe4\t\x7f\xa4\\\xd1\xa6\xda\x1d\xf5c\x03\x1c\xf6\x85'},
            'block_create_stats': {'type_': 'block_create_stats', 'counters': None},
            'global_balance': {'grams': 5089971531496870767, 'other': {239: 666666666666, 4294967279: 1000000000000}}
    }
}
```
Then, access the `ShardStateUnsplit` -> `custom` -> `config` -> `config` field, a Hashmap where the key is a `ConfigParam` number and the value is a cell containing the parameter value.

After deserializing all parameters, we obtain:

```python
{
    1: {
        'elector_addr': b'33333333333333333333333333333333',
    },
    4: {
        'dns_root_addr': b'\xe5gT\xf84&\xf6\x9b\t&{\xd8v\xac\x97\xc4H!4[~&k\xd9V\xa7\xbf\xbf\xb9\x8d\xf3\\',
    },
    5: {
        'blackhole_addr': b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff',
        'fee_burn_nom': 1,
        'fee_burn_denom': 2
    },
    7: {
        'to_mint': {'dict': {239: 666666666666, 4294967279: 1000000000000}}
    },
    8: {
        'version': 2,
        'capabilities': 46
    },
    15: {
        'validators_elected_for': 65536,
        'elections_start_before': 32768,
        'elections_end_before': 8192,
        'stake_held_for': 32768
    }
}
```

## See also

* [Exotic cells](/v3/documentation/data-formats/tlb/exotic-cells)

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/tl-b-language.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/tl-b-language.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# TL-B language

TL-B (Type Language - Binary) describes the type system, constructors, and available functions. For example, TL-B schemes can be used to define binary structures associated with the TON blockchain. Special TL-B parsers can read these schemes to deserialize binary data into various objects. TL-B specifically describes data schemes for `cell` objects. If you are unfamiliar with `cells`, please refer to the [Cell & Bag of Cells (BoC)](/v3/documentation/data-formats/tlb/cell-boc#cell) article.

## Overview

A set of TL-B constructs is referred to as a TL-B document. A typical TL-B document consists of type declarations, i.e., their constructors, and functional combinators. Each combinator declaration ends with a semicolon `;`.

Here is an example of a combinator declaration:

<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-2.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-2-dark.png?raw=true',
  }}
/>
<br></br>

## Constructors

The left-hand side of each equation defines how to construct or serialize a value of the type specified on the right-hand side.
Each description begins with the name of a constructor.


<br></br>
<ThemedImage
  alt=""
  sources={{
    light: '/img/docs/data-formats/tl-b-docs-3.png?raw=true',
    dark: '/img/docs/data-formats/tl-b-docs-3-dark.png?raw=true',
  }}
/>
<br></br>

Constructors define a combinator's type, including its state during serialization. For example, constructors can specify an `op` (operation code) in a query sent to a smart contract in TON.

```tlb
// ....
transfer#5fcc3d14 <...> = InternalMsgBody;
// ....
```
* Constructor name: `transfer`
* Constructor prefix code: `#5fcc3d14`

Note that every constructor name is immediately followed by an optional constructor tag, such as `#_` or `$10`, which specifies the bitstring used to encode (serialize) the corresponding constructor.

```tlb
message#3f5476ca value:# = CoolMessage;
bool_true$0 = Bool;
bool_false$1 = Bool;
```

The left-hand side of each equation defines how to construct or serialize a value of the type specified on the right-hand side.
It begins with the name of a constructor, such as a `message` or `bool_true`, followed by an optional constructor tag, such as `#3f5476ca` or `$0`, which specifies the bitstring used to encode (serialize) the constructor.

| Constructor                 | Serialization                             |
|-----------------------------|-------------------------------------------|
| `some#3f5476ca`             | A 32-bit uint is serialized from a hex value.      |
| `some#5fe`                  | A 12-bit uint is serialized from a hex value.      |
| `some$0101`                 | Serialize the `0101` raw bits.                 |
| `some` or `some#`           | Serialize `crc32(equation) \| 0x80000000`. |
| `some#_` or `some$_` or `_` | Serialize nothing.                         |

Constructor names, such as `some` in this example, are used as variables during code generation. For example:

```tlb
bool_true$1 = Bool;
bool_false$0 = Bool;
```

The type `Bool` has two tags: `0` and `1`. The code generation pseudocode might look like this:

```python3

class Bool:
    tags = [1, 0]
    tags_names = ['bool_true', 'bool_false']
```

If you do not want to assign a name to the current constructor, you can use `_`. For example: `_ a:(## 32) = 32Int;`

Constructor tags can be specified in binary (prefixed with a dollar sign) or hexadecimal (prefixed with a hash sign). If a tag is not explicitly provided, the TL-B parser will compute a default 32-bit constructor tag by applying the CRC32 algorithm to the text of the constructor "equation" with `| 0x80000000`. Therefore, if an empty tag is intended, it must be explicitly defined using `#_` or `$_`.


This tag is used during the deserialization process to determine the type of the bitstring. For example, if we have a 1-bit bitstring `0` and specify that it should be parsed as type `Bool`, the TL-B parser will interpret it as `Bool.bool_false`.

Let's now look at some more complex examples:

```tbl
tag_a$10 val:(## 32) = A;
tag_b$00 val(## 64) = A;
```

When parsing the binary string `1000000000000000000000000000000001`—a `1` followed by 32 zeros and ending with another `1`—using TLB type `A`, we first extract the initial two bits to determine the tag.
In this case, the first two bits are `10`, which correspond to `tag_a`.
After identifying the tag, the next 32 bits are interpreted as the `val` variable. In this example, the value is `1`.

The parsed pseudocode representation is as follows:

```python3
A.tag = 'tag_a'
A.tag_bits = '10'
A.val = 1
```


All constructor names must be distinct, and constructor tags within the same type must form a **prefix code** to ensure unambiguous deserialization. In other words, no tag can be a prefix of another tag within the same type.

* Maximum number of constructors per type: `64`.
* Maximum number of bits for a tag: `63`.


<b>Binary example:</b>

```tlb
example_a$10 = A;
example_b$01 = A;
example_c$11 = A;
example_d$00 = A;
```

The code generation pseudocode might look as follows:

```python3

class A:
    tags = [2, 1, 3, 0]
    tags_names = ['example_a', 'example_b', 'example_c', 'example_d']
```

<b>Hex tag example:</b>

```tlb
example_a#0 = A;
example_b#1 = A;
example_c#f = A;
```

The code generation pseudocode might look as follows:

```python3

class A:
    tags = [0, 1, 15]
    tags_names = ['example_a', 'example_b', 'example_c']
```

If the `hex` tag is used, remember that it is serialized as 4 bits per hexadecimal character. The maximum supported value is a 63-bit unsigned integer. This implies the following:

```tlb
a#32 a:(## 32) = AMultiTagInt;
b#1111 a:(## 32) = AMultiTagInt;
c#5FE a:(## 32) = AMultiTagInt;
d#3F5476CA a:(## 32) = AMultiTagInt;
```

| Constructor  | Serialization                        |
|--------------|--------------------------------------|
| `a#32`       | A 8-bit uint is serialized from a hex value.  |
| `b#1111`     | A 16-bit uint is serialized from a hex value. |
| `c#5FE`      | A 12-bit uint is serialized from a hex value. |
| `d#3F5476CA` | A 32-bit uint is serialized from a hex value. |

Hex values are allowed in both uppercase and lowercase formats.

#### More about the hex tags

In addition to the standard hex tag definition, a hexadecimal number may be followed by an underscore `_` character.
This indicates that the tag should be interpreted as the hexadecimal value with the **least significant bit (LSB) removed**.
For example, consider the following schema:

```tlb
vm_stk_int#0201_ value:int257 = VmStackValue;
```
In this case, the tag is not equal to `0x0201`. To compute the actual tag, remove the LSB from the binary representation of `0x0201`:

```
0000001000000001 -> 000000100000000
```

The resulting tag is the 15-bit binary number `0b000000100000000`.

## Field definitions

Field definitions follow each constructor and its optional tag. A field definition has the format `ident:type-expr`, where:
* `ident` is the field's name (use `_` for anonymous fields).
* `type-expr` is the field's type.

The `type-expr` can be a simple type, a parameterized type with appropriate arguments, or a more complex expression.

**Note: the total size of all fields in a type must not exceed the limits of a single cell —  `1023` bits and `4` references.**


### Simple types

- `_ a:# = Type;` - `Type.a` is a 32-bit integer.
- `_ a:(## 64) = Type;` - `Type.a` is a 64-bit integer.
- `_ a:Owner = NFT;` - `NFT.a` is of type `Owner`.
- `_ a:^Owner = NFT;` - `NFT.a` is a cell ref to `Owner` type - i.e., the `Owner` is stored in the next referenced cell.

### Anonymous fields

- `_ _:# = A;` - the first field is an anonymous 32-bit integer.

### Extend cell with references

```tlb
_ a:(##32) ^[ b:(## 32) c:(## 32) d:(## 32)] = A;
```

* If needed, specific fields can be stored in a separate cell using the `^[ ... ]` syntax.
For example, in the following structure, `A.a` / `A.b` / `A.c` / `A.d` are all 32-bit unsigned integers.
However, `A.a` is stored in the primary cell, while `A.b` / `A.c` / `A.d` are stored in a referenced cell using 1 cell reference:


```tlb
_ ^[ a:(## 32) ^[ b:(## 32) ^[ c:(## 32) ] ] ] = A;
```
* Chains of references are also allowed. In the following example, each variable (`a`, `b`, `c`) is stored in a separate cell, resulting in a chain of three referenced cells:

### Parametrized types

Suppose we have the `IntWithObj` type defined as follows:

```tlb
_ {X:Type} a:# b:X = IntWithObj X;
```

Now, we can use this type in other types, as shown in the following examples:

```tlb
_ a:(IntWithObj uint32) = IntWithUint32;
```

### Complex expressions

* **Conditional fields (only for `Nat`)**

  The expression `E?T` means that if the condition `E` is true, then the field has the type `T`.

  **Example**

     ```tlb
     _ a:(## 1) b:a?(## 32) = Example;
     ```
    In `Example` type, the field `b` is serialized only if `a` is equal to `1`.


* **Multiplicative expression for tuple creation**

  The expression `x * T` creates a tuple of length `x`, where each element is of type `T`.

  **Example**
      ```tlb
      a$_ a:(## 32) = A;
      b$_ b:(2 * A) = B;
      ```

     ```tlb
     _ (## 1) = Bit;
     _ 2bits:(2 * Bit) = 2Bits;
     ```

* **Bit selection (only for `Nat`)**

  The expression `E . B` means to take bit `B` from the `Nat` value `E`.

  **Example**
   ```tlb
   _ a:(## 2) b:(a . 1)?(## 32) = Example;
   ```

  In `Example` type, the variable `b` is serialized only if the second bit of `a` is `1`.


* **Other `Nat` operators**

  Other operations on `Nat` types are also supported (refer to `Allowed constraints`).

  Note: you can combine multiple complex expressions:

  **Example**
  ```tlb
  _ a:(## 1) b:(## 1) c:(## 2) d:(a?(b?((c . 1)?(## 64)))) = A;
  ```

## Built-in types

- `#` - `Nat`: 32-bit unsigned integer.
- `## x` - `Nat`: unsigned integer with `x` bits.
- `#< x` - `Nat`: unsigned integer less than `x` bits, stored as `lenBits(x - 1)` bits up to 31 bits.
- `#<= x` - `Nat`: unsigned integer less than or equal to `x` bits, stored as `lenBits(x)` bits up to 32 bits.
- `Any` / `Cell` - remaining bits and references.
- `Int` - 257 bits
- `UInt` - 256 bits
- `Bits` - 1023 bits
- `uint1` - `uint256` - 1 - 256 bits
- `int1` - `int257` - 1 - 257 bits
- `bits1` - `bits1023` - 1 - 1023 bits
- `uint X` / `int X` / `bits X` - same as `uintX` but can use a parametrized `X` in this types

## Constraints

```tlb
_ flags:(## 10) { flags <= 100 } = Flag;
```

`Nat` fields are allowed in constraints. For example, the constraint `{ flags <= 100 }` means that the `flags` variable is less than or equal to `100`.

Allowed contraints: `E` | `E = E` | `E <= E` | `E < E` | `E >= E` | `E > E` | `E + E` | `E * E` | `E ? E`

## Implicit fields

Some fields may be implicit. These fields are defined within curly brackets (`{`, `}`), indicating that they are not directly serialized. Instead, their values must be deduced from other data, usually the parameters of the type being serialized.

**Example**

```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```

```tlb
_ {x:#} a:(## 32) { ~x = a + 1 } = Example;
```

## Parametrized types

Variables — the identifiers of previously defined fields of types `#` (natural numbers) or `Type` (types of types) — may be used as parameters for parametrized types. During serialization, each field is recursively serialized according to its type. The final serialized value is the concatenation of bits representing the constructor, i.e., the constructor tag and the serialized field values.

### Natural numbers (`Nat`)

```tlb
_ {x:#} my_val:(## x) = A x;
```

This means that `A` is parametrized by `x`, where `x` is a `Nat`. During the deserialization process, we will fetch an `x`-bit unsigned integer. For example:

```tlb
_ value:(A 32) = My32UintValue;
```

This means that during the deserialization process of the `My32UintValue` type, we will fetch a 32-bit unsigned integer, as specified by the `32` parameters in the `A`-type.

### Types

```tlb
_ {X:Type} my_val:(## 32) next_val:X = A X;
```


This means that the `X` type parametrizes `A`. During the deserialization process, we will first fetch a 32-bit unsigned integer and then parse the bits and references of the `X` type.

An example usage of such a parametrized type can be:

```tlb
_ bit:(## 1) = Bit;
_ 32intwbit:(A Bit) = 32IntWithBit;
```


In this example, we pass the `Bit` type to `A` as a parameter.

If you don't want to define a type but still wish to deserialize according to this scheme, you can use the `Any` keyword:

```tlb
_ my_val:(A Any) = Example;
```
This means that when deserializing the `Example` type, we will fetch a 32-bit integer and then parse the remaining bits and references in the cell to assign to `my_val`.

You can create complex types with multiple parameters:


```tlb
_ {X:Type} {Y:Type} my_val:(## 32) next_val:X next_next_val:Y = A X Y;
_ bit:(## 1) = Bit;
_ a_with_two_bits:(A Bit Bit) = AWithTwoBits;
```

You can also use partial applications with such parametrized types:


```tlb
_ {X:Type} {Y:Type} v1:X v2:Y = A X Y;
_ bit:(## 1) = Bit;
_ {X:Type} bits:(A Bit X) = BitA X;
```

You can even apply partial application to parametrized types themselves:

```tlb
_ {X:Type} v1:X = A X;
_ {X:Type} d1:X = B X;
_ {X:Type} bits:(A (B X)) = AB X;
```

### NAT fields usage for parametrized types

You can use fields defined previously as parameters to types. The serialization will be determined at runtime.

**Simple example**

```tlb
_ a:(## 8) b:(## a) = A;
```
This means that the size of the `b` field is stored inside the `a` field. When serializing type `A`, we first load the 8-bit unsigned integer from the `a` field and then use this value to determine the size of the `b` field.

This strategy also works for parametrized types:


```tlb
_ {input:#} c:(## input) = B input;
_ a:(## 8) c_in_b:(B a) = A;
```

### Expression in parametrized types

```tlb
_ {x:#} value:(## x) = Example (x * 2);
_ _:(Example 4) = 2BitInteger;
```

In this example, the `Example.value` type is determined at runtime.

In the `2BitInteger` definition, we set the value to `Example 4`. To determine this type, we use the `Example (x * 2)` definition and calculate `x` using the formula `(y = 2, z = 4)`:

```c++
static inline bool mul_r1(int& x, int y, int z) {
  return y && !(z % y) && (x = z / y) >= 0;
}
```

We can also use the addition operator:

```tlb
_ {x:#} value:(## x) = ExampleSum (x + 3);
_ _:(ExampleSum 4) = 1BitInteger;
```

In the `1BitInteger` definition, we set the value to `ExampleSum 4`. To determine this type, we use the `ExampleSum (x + 3)` definition and calculate `x` using the formula `(y = 3, z = 4)`:

```c++
static inline bool add_r1(int& x, int y, int z) {
  return z >= y && (x = z - y) >= 0;
}
```

## Negate operator (`~`)

Some occurrences of "variables", i.e., already-defined fields, are prefixed by a tilde `~`. This indicates that the variable's occurrence is used oppositely from the default behavior. On the left-hand side of the equation, it means that the variable is deduced (computed) based on this occurrence, rather than substituting its previously calculated value. Conversely, on the right-hand side, the variable is not deduced from the serialized type but will instead be computed during the deserialization process. In other words, a tilde transforms an "input argument" into an "output argument" or vice versa.


A simple example of the negate operator is the definition of a new variable based on another variable:

```tlb
_ a:(## 32) { b:# } { ~b = a + 100 } = B_Calc_Example;
```

After definition, you can use the new variable as input for `Nat` types:


```tlb
_ a:(## 8) { b:# } { ~b = a + 10 }
  example_dynamic_var:(## b) = B_Calc_Example;
```

The size of `example_dynamic_var` is computed at runtime when we load the `a` variable and use its value to determine the size of `example_dynamic_var`.

Alternatively, it can be applied to other types:

```tlb
_ {X:Type} a:^X = PutToRef X;
_ a:(## 32) { b:# } { ~b = a + 100 }
  my_ref: (PutToRef b) = B_Calc_Example;
```

You can also define variables with the negate operator within add or multiply complex expressions:

```tlb
_ a:(## 32) { b:# } { ~b + 100 = a }  = B_Calc_Example;
```

```tlb
_ a:(## 32) { b:# } { ~b * 5 = a }  = B_Calc_Example;
```

### Negate operator (`~`) in type definition

```tlb
_ {m:#} n:(## m) = Define ~n m;
_ {n_from_define:#} defined_val:(Define ~n_from_define 8) real_value:(## n_from_define) = Example;
```

Assume we have a class `Define ~n m` that takes `m` and computes `n` by loading it from an `m`-bit unsigned integer.

In the `Example` type, we store the variable computed by the `Define` type into `n_from_define`. We also know it's an `8`-bit unsigned integer because we apply the `Define` type with `Define ~n_from_define 8`. Now, we can use the `n_from_define` variable for other kinds to determine the serialization process.

This technique leads to more complex type definitions, such as Unions or Hashmaps.


```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
_ u:(Unary Any) = UnaryChain;
```

This example is explained well in the [TL-B types](/v3/documentation/data-formats/tlb/tl-b-types#unary) article. The main idea here is that `UnaryChain` recursively deserializes until it reaches `unary_zero$0` because we know the last element of the `Unary X` type by the definition `unary_zero$0 = Unary ~0`. The value of `X` is calculated at runtime due to the definition `Unary ~(n + 1)`.


Note: `x:(Unary ~n)` means that `n` is defined during the serialization process of the `Unary` class.

## Special types

Currently, TVM allows the following types of cells:

- Ordinary
- PrunnedBranch
- Library
- MerkleProof
- MerkleUpdate

By default, all cells are classified as `Ordinary`. This applies to all cells described in the TLB as well.

To enable the loading of special types in the constructor, prepend `!` before the constructor.

**Example**

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
  old:^X new:^X = MERKLE_UPDATE X;

!merkle_proof#03 {X:Type} virtual_hash:bits256 depth:uint16 virtual_root:^X = MERKLE_PROOF X;
```

This technique allows code generation to mark `SPECIAL` cells when printing a structure and ensures proper validation of structures with special cells.

## Multiple instances of the same type without constructor uniqueness tag check

It is permitted to create multiple instances of the same type, provided only the type parameters differ.
In this case, the constructor tag uniqueness check will not be applied.

**Example**

```tlb
_ = A 1;
a$01 = A 2;
b$01 = A 3;
_ test:# = A 4;
```

This means that the A-type parameter determines the actual tag for deserialization:

```python3
# class for type `A`
class A(TLBComplex):
    class Tag(Enum):
        a = 0
        b = 1
        cons1 = 2
        cons4 = 3

    cons_len = [2, 2, 0, 0]
    cons_tag = [1, 1, 0, 0]

    m_: int = None

    def __init__(self, m: int):
        self.m_ = m

    def get_tag(self, cs: CellSlice) -> Optional["A.Tag"]:
        tag = self.m_

        if tag == 1:
            return A.Tag.cons1

        if tag == 2:
            return A.Tag.a

        if tag == 3:
            return A.Tag.b

        if tag == 4:
            return A.Tag.cons4

        return None
```

The same applies when multiple parameters are used:

```tlb
_ = A 1 1;
a$01 = A 2 1;
b$01 = A 3 3;
_ test:# = A 4 2;
```

Please note that when adding a parameterized type definition, the tags between the predefined type definition,
e.g.,`a` and `b` in our example, and the parameterized type definition, e.g., `c` in our example, must be unique:

**Invalid example**

```
a$01 = A 2 1;
b$11 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

**Valid example**

```tlb
a$01 = A 2 1;
b$01 = A 3 3;
c$11 {X:#} {Y:#} = A X Y;
```

## Comments

The comments follow the same conventions as in C++.

```tlb
/*
This is
a comment
*/

// This is one line comment
```

## References

- [A description of an older version of TL](https://core.telegram.org/mtproto/TL)
- [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
- [tlbc tool](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc.cpp)
- [CPP Codegen](https://github.com/ton-blockchain/ton/blob/master/crypto/tl/tlbc-gen-cpp.cpp)
- [tonpy tlb tests](https://github.com/disintar/tonpy/blob/main/src/tonpy/tests/test_tlb.py)
- [tonpy py codegen](https://github.com/disintar/ton/blob/master/crypto/tl/tlbc-gen-py.cpp)

<hr/>

The documentation is provided by the _[Disintar](https://dton.io/) team_.

<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/tl-b-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/tl-b-types.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';

# TL-B types
:::caution advanced level
This information is **very low-level **and may be difficult for newcomers to grasp.
Feel free to revisit it later if needed.
:::

This section analyzes complex and unconventional typed language binary (TL-B) structures.
We recommend reading [this documentation](/v3/documentation/data-formats/tlb/tl-b-language) to familiarize yourself with the topic and get started.

<img alt="tlb structure" src="/img/docs/tlb.drawio.svg" width={'100%'}/>


## Either
```tlb
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```

The **either** type is used when one of two possible result types may be present. The choice of type depends on the prefix bit: if the prefix bit is `0`, the left type is serialized; if it is `1`, the right type is serialized.

This construct is used, for example, when serializing messages—where the body is either included directly in the main cell or stored in a separate referenced cell.

## Maybe
```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```
The **maybe** type is used to represent optional values. In this case, the first bit indicates a value: if the bit is `0`, the value is not serialized and skipped; if the bit is `1`, the value follows and is serialized.

## Both
```tlb
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;
```
The **both** type variation is used exclusively with regular pairs, where both types are serialized sequentially without any conditions.

## Unary

The **unary** functional type is commonly used for dynamic sizing in structures such as [hml_short](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L29).

Unary supports two main options:

```tlb
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
```
### Unary serialization

The `unary_zero` variation is straightforward: if the first bit is `0`, the result of the entire unary deserialization is `0`.

The `unary_succ` variation, however, is more complex—it is loaded recursively and represents a value of `~(n + 1)`. This means it repeatedly calls itself until it reaches `unary_zero`. In other words, the desired value will equal the number of units in a row.

For example, consider the serialization of the bitstring `110`.
The deserialization call chain is as follows:

```tlb
unary_succ$1 -> unary_succ$1 -> unary_zero$0
```

Once `unary_zero` is reached, the value is returned up the call stack, similar to how values are returned in a recursive function.

To better visualize the result, let's trace the return path:

```0 -> ~(0 + 1) -> ~(1 + 1) -> 2```

This shows that the bitstring `110` corresponds to `Unary 2`.

### Unary deserialization

Suppose we have a `Foo` type defined as follows:

```tlb
foo$_  u:(Unary 2) = Foo;
```

Based on the explanation above, `Foo` is deserialized as:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/data-formats/tl-b-docs-10.png?raw=true',
dark: '/img/docs/data-formats/tl-b-docs-10-dark.png?raw=true',
}}
/>
<br></br>


```tlb
foo u:(unary_succ x:(unary_succ x:(unnary_zero)))
```



## Hashmap

The Hashmap complex type is used to store dictionaries from FunC smart contract code, i.e., `dict`.

The following TL-B structures are used to serialize a Hashmap with a fixed key length:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;

hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;

hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

hme_empty$0 {n:#} {X:Type} = HashmapE n X;
hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;
```

This means the root structure uses `HashmapE` and one of its two possible states: either `hme_empty` or `hme_root`.

### Hashmap parsing example

As an example, consider the following cell, represented in binary form:

```json
1[1] -> {
  2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
}
```

This cell uses the `HashmapE` structure with an 8-bit key size, and its values are represented using the `uint16` type—that is, `HashmapE 8 uint16`.

The `HashmapE` structure utilizes 3 distinct key types:

```
1 = 777
17 = 111
128 = 777
```

To parse this Hashmap, we must first determine which structure type to use: either `hme_empty` or `hme_root`. This is decided by identifying the `correct prefix`. The `hme_empty` variation is indicated by a single bit `0` (`hme_empty$0`), while the `hme_root` variation is indicated by a single bit `1` (`hme_root$1`). After reading the first bit, if it is `1` (`1[1]`), we know it is the `hme_root` variation.

Next, we can populate the structure variables with known values. The initial result is:

`hme_root$1 {n:#} {X:Type} root:^(Hashmap 8 uint16) = HashmapE 8 uint16;`

Here, the one-bit prefix is already read. The curly braces `{}` indicate conditions that need not be read. Specifically:
- `{n:#}` indicates that `n` is any `uint32` number.
- `{X:Type}` means that `X` can be any type.

The next portion to read is `root:^(Hashmap 8 uint16)`, where the `^` symbol denotes a link that must be loaded.

```json
2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
```

#### Initiating branch parsing

According to our schema, this is the correct `Hashmap 8 uint16` structure. Next, we populate it with known values, resulting in the following:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 8)
          {8 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

As shown above, conditional variables `{l:#}` and `{m:#}` have appeared, but both values are unknown at this stage. After reading the corresponding `label`, we can deduce that `n` is part of the equation `{n = (~m) + l}`. This means we must calculate both `l` and `m`, where the sign indicates the resulting value of `~`.

To determine the value of `l`, we need to load the `label:(HmLabel ~l uint16)` sequence. Below, we outline the 3 basic structural options for `HmLabel`:


```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;
```

Each option is determined by its corresponding prefix. Our root cell comprises 2 zero bits, displayed as (`2[00]`). Therefore, the only logical option is `hml_short$0`, which starts with a prefix of `0`.

Next, let's fill in the `hml_short` structure with known values:

```tlb
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= 8} s:(n * Bit) = HmLabel ~n 8
```

At this point, we don't know the value of `n`. However, since it includes a `~` character, we can calculate it. To do so, we load `len:(Unary ~n)`;  [more about unary here](#unary).

Starting with `2[00]`, only one bit remains after defining the `HmLabel` type.

We load this final bit and observe that its value is `0`, which indicates that the `unary_zero$0` variation is used. This means that the `n` value for the `HmLabel` variation is zero.

Now, we can complete the `hml_short` structure by using the calculated `n` value:

```tlb
hml_short$0 {m:#} {n:#} len:0 {n <= 8} s:(0 * Bit) = HmLabel 0 8
```
We have an empty `HmLabel`, denoted by `s = 0`, which means there is nothing to load.

Next, we complete our structure by incorporating the calculated value of `l`, as follows:

```tlb
hm_edge#_ {n:#} {X:Type} {l:0} {m:#} label:(HmLabel 0 8)
          {8 = (~m) + 0} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

Now that we have calculated the value of `l`, we can also calculate `m` using the equation `n = (~m) + 0`, which simplifies to `m = n - 0`. Therefore, `m = n = 8`.

With all unknown values determined, we can load the `node:(HashmapNode 8 uint16)`.

Regarding the HashmapNode, we have several options:

```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X)
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
```

In this case, we determine the option not by using the prefix but by examining the parameter. Specifically, if `n = 0`, the correct result will be either `hmn_leaf` or `hmn_fork`.
Since, in this example, `n = 8`, we use the `hmn_fork` variation. Now, we can fill in the known values as follows:

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap n uint16)
           right:^(Hashmap n uint16) = HashmapNode (n + 1) uint16;
```

After entering the known values, we must calculate the `HashmapNode (n + 1) uint16`. This means that the resulting value of `n` must be equal to our parameter, i.e., 8. To calculate the local value of `n`, we use the following formula:

`n = (n_local + 1)` -> `n_local = (n - 1)` -> `n_local = (8 - 1)` -> `n_local = 7`.

```tlb
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap 7 uint16)
           right:^(Hashmap 7 uint16) = HashmapNode (7 + 1) uint16;
```

Now that we know the formula obtaining the final result is straightforward.
Next, we load the left and right branches, and for each subsequent branch, [the process is repeated](#initiating-branch-parsing).

#### Analyzing loaded hashmap values
Continuing the previous example, let's examine how loading branches work for dictionary values. For instance, given the bitstring: `28[1011100000000000001100001001]`.

The result is once again `hm_edge`, and the next step is to fill in the sequence with the correct known values as follows:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 7)
          {7 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

Next, the `HmLabel` response is loaded using the `HmLabel` variation, as the prefix is `10`.

```tlb
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
```
Now, let's fill in the sequence:
```tlb
hml_long$10 {m:#} n:(#<= 7) s:(n * Bit) = HmLabel ~n 7;
```

The new construction, `n:(#<= 7)`, clearly denotes a sizing value that corresponds to the number 7, which is, in fact, the `log2` of the number `+ 1`. For simplicity, however, we can count the number of bits required to represent the number 7.
In binary, the number 7 is written as `111`, which means 3 bits are needed. Therefore, the value for `n = 3`.

```tlb
hml_long$10 {m:#} n:(## 3) s:(n * Bit) = HmLabel ~n 7;
```
Next, we load `n` into the sequence, which results in `111`. As noted earlier, this coincidentally equals 7. Then, we load `s` into the sequence, which consists of 7 bits: `0000000`. Remember, `s` is part of the key.

Afterwards, we return to the top of the sequence and fill in the resulting `l`:

```tlb
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel 7 7)
          {7 = (~m) + 7} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

Then we calculate the value of `m`: `m = 7 - 7`, which gives us `m = 0`.
Since `m = 0`, the structure is ideally suited for use with a `HashmapNode`:


```tlb
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
```

Next, we substitute our `uint16` type and load the value. When converted to decimal, the remaining 16 bits, `0000001100001001`, give us the value `777`.

Now, let's restore the key. We need to combine all the parts of the key that were computed previously. Each related key part is combined with one bit depending on the branch type used. A `1` bit is added for the right branch, and a `0` bit is added for the left branch. If a full `HmLabel` exists above, its bits are added to the key.

In this specific case, 7 bits are taken from the `HmLabel 0000000`, and a `1` bit is added before the sequence of zeros because the value was obtained from the right branch. The final result is 8 bits, or `10000000`, which means the key value equals `128`.


## Other hashmap types
Now that we have discussed Hashmaps and how to load the standardized Hashmap type, let's explain how the additional Hashmap types function.


### HashmapAugE
```tlb
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#}
  label:(HmLabel ~l n) {n = (~m) + l}
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;

ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;

ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y
          = HashmapAugE n X Y;

ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y)
  extra:Y = HashmapAugE n X Y;
```

The primary distinction between the `HashmapAugE` and the regular `Hashmap` is the presence of an `extra:Y` field in each node (not just in leaf nodes containing values).

### PfxHashmap
```tlb
phm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(PfxHashmapNode m X)
           = PfxHashmap n X;

phmn_leaf$0 {n:#} {X:Type} value:X = PfxHashmapNode n X;
phmn_fork$1 {n:#} {X:Type} left:^(PfxHashmap n X)
            right:^(PfxHashmap n X) = PfxHashmapNode (n + 1) X;

phme_empty$0 {n:#} {X:Type} = PfxHashmapE n X;
phme_root$1 {n:#} {X:Type} root:^(PfxHashmap n X)
            = PfxHashmapE n X;
```
The key difference between the `PfxHashmap` and the regular `Hashmap` lies in its ability to store keys of varying lengths due to the inclusion of the `phmn_leaf$0` and `phmn_fork$1` nodes.

### VarHashmap
```tlb
vhm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n)
           {n = (~m) + l} node:(VarHashmapNode m X)
           = VarHashmap n X;
vhmn_leaf$00 {n:#} {X:Type} value:X = VarHashmapNode n X;
vhmn_fork$01 {n:#} {X:Type} left:^(VarHashmap n X)
             right:^(VarHashmap n X) value:(Maybe X)
             = VarHashmapNode (n + 1) X;
vhmn_cont$1 {n:#} {X:Type} branch:Bit child:^(VarHashmap n X)
            value:X = VarHashmapNode (n + 1) X;

// nothing$0 {X:Type} = Maybe X;
// just$1 {X:Type} value:X = Maybe X;

vhme_empty$0 {n:#} {X:Type} = VarHashmapE n X;
vhme_root$1 {n:#} {X:Type} root:^(VarHashmap n X)
            = VarHashmapE n X;
```

Similarly, the main difference between the `VarHashmap` and the regular `Hashmap` is its ability to accommodate different key lengths, attributed to the presence of the `vhmn_leaf$00` and `vhmn_fork$01` nodes. Additionally, the `VarHashmap` can form a common value prefix (child map) by utilizing the `vhmn_cont$1` node.

### BinTree
```tlb
bta_leaf$0 {X:Type} {Y:Type} extra:Y leaf:X = BinTreeAug X Y;
bta_fork$1 {X:Type} {Y:Type} left:^(BinTreeAug X Y)
           right:^(BinTreeAug X Y) extra:Y = BinTreeAug X Y;
```

The binary tree key generation mechanism operates similarly to the standardized Hashmap framework but without using labels; instead, it relies on branch prefixes.


## Addresses
TON addresses are generated using the sha256 hashing mechanism within the TL-B StateInit structure, allowing the address to be computed before the network contract is deployed.

### Serialization

Standard addresses, such as `EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`, utilize base64 URI encoding for byte representation. Typically, these addresses are 36 bytes long, with the last 2 bytes representing the `CRC16 checksum`, calculated using the `XMODEM` table. The first byte denotes the flag, while the second indicates the WorkChain. The 32 middle bytes correspond to the address data, also called AccountID, often represented in schemas like int256.

[Decoding example](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/address/addr.go#L156)

## References

[Link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/TL-B.md) - _Oleg Baranov._


<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/tlb-ide.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/tlb-ide.md
================================================
import Feedback from '@site/src/components/Feedback';

# IDE support

The [intellij-ton](https://github.com/andreypfau/intellij-ton) plugin supports the Fift and FunC programming languages and the Typed Language Binary (TL-B) format.

The TL-B syntax specification is defined in the [TlbParser.bnf](https://github.com/ton-blockchain/intellij-ton/blob/main/modules/tlb/src/org/ton/intellij/tlb/parser/TlbParser.bnf) file.
<Feedback />



================================================
FILE: docs/v3/documentation/data-formats/tlb/tlb-tools.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/tlb-tools.md
================================================
import Feedback from '@site/src/components/Feedback';

# TL-B tools

## TL-B parsers

TL-B parsers serialize basic [TL-B types](/v3/documentation/data-formats/tlb/tl-b-types). Each parser implements TL-B types as objects and returns the corresponding serialized binary data.

| Language   | SDK                                        | Social                 |
|------------|--------------------------------------------|------------------------|
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (includes support for parsing `.tlb` files) | https://t.me/tonkotlin |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb) | https://t.me/tonutils  |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (includes support for parsing `.tlb` files) | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser) | -                      |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (includes support for parsing `.tlb` files) | https://t.me/dtontech  |

## TL-B generator
The [tlb-codegen](https://github.com/ton-community/tlb-codegen) package generates TypeScript code for serializing and deserializing structures based on a provided TL-B scheme.

The [tonpy](https://github.com/disintar/tonpy) package also supports code generation in Python for serializing and deserializing structures according to a given TL-B scheme.
<Feedback />




================================================
FILE: docs/v3/documentation/data-formats/tlb/transaction-layout.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/data-formats/tlb/transaction-layout.md
================================================
import Feedback from '@site/src/components/Feedback';

# Transaction layout

:::info
It's highly recommended that you familiarize yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc) to better understand this page.
:::

The TON blockchain functions through three main components: accounts, messages, and transactions. This section outlines the structure and organization of transactions.

A transaction is an action that handles incoming and outgoing messages for a particular account, modifying its state and potentially generating fees for validators.

## Transaction

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Field             | Type                                                                   | Required | Description                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------- | -------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `account_addr`    | bits256                                                                | Yes      | The hash of the address where the transaction was executed. [Learn more about addresses](/v3/documentation/smart-contracts/addresses#address-of-smart-contract)              |
| `lt`              | uint64                                                                 | Yes      | Represents _Logical time_. [Learn more about logical time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)            |
| `prev_trans_hash` | bits256                                                                | Yes      | The hash of the previous transaction for this account.                                                                                                                       |
| `prev_trans_lt`   | uint64                                                                 | Yes      | The `lt` of the previous transaction for this account.                                                                                                                       |
| `now`             | uint32                                                                 | Yes      | The `now` value set during the transaction execution. It is a UNIX timestamp in seconds.                                                                                     |
| `outmsg_cnt`      | uint15                                                                 | Yes      | The count of outgoing messages generated during the transaction execution.                                                                                                   |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | Yes      | The status of this account before the transaction was executed.                                                                                                              |
| `end_status`      | [AccountStatus](#accountstatus)                                        | Yes      | The status of the account after the transaction was executed.                                                                                                                |
| `in_msg`          | (Message Any)                                                          | No       | The incoming message that triggered the transaction execution. Stored as a reference.                                                                                        |
| `out_msgs`        | HashmapE 15 ^(Message Any)                                             | Yes      | A dictionary containing the outgoing messages created during the transaction execution.                                                                                      |
| `total_fees`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total fees collected during the transaction execution, including _TON coin_ and potentially some [extra-currencies](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Account                                    | Yes      | The `HASH_UPDATE` structure represents the state change. Stored as a reference.                                                                                              |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | Yes      | A detailed description of the transaction execution process. Stored as a reference.                                                                                      |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

-   `[00]`: Account is uninitialized
-   `[01]`: Account is frozen
-   `[10]`: Account is active
-   `[11]`: Account does not exist

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Field      | Type    | Description                                                            |
|------------|---------|------------------------------------------------------------------------|
| `old_hash` | bits256 | The hash represents the account state before transaction execution.    |
| `new_hash` | bits256 | The hash represents the account state following transaction execution. |

## TransactionDescr types

-   [Ordinary](#ordinary)
-   [Storage](#storage)
-   [Tick-tock](#tick-tock)
-   [Split prepare](#split-prepare)
-   [Split install](#split-install)
-   [Merge prepare](#merge-prepare)
-   [Merge install](#merge-install)

## Ordinary

This is the most common transaction type, meeting most developers' requirements. Transactions of this type have a single incoming message and can generate multiple outgoing messages.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                                                                                         |
| -------------- | -------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `credit_first` | Bool           | Yes      | A flag related to the `bounce` flag of an incoming message. `credit_first = !bounce`.                                                                               |
| `storage_ph`   | TrStoragePhase | No       | Contains information about the storage phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)              |
| `credit_ph`    | TrCreditPhase  | No       | Contains information about the credit phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)               |
| `compute_ph`   | TrComputePhase | Yes      | Contains information about the compute phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)              |
| `action`       | TrActionPhase  | No       | Contains information about the action phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`      | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                     |
| `bounce`       | TrBouncePhase  | No       | Contains information about the bounce phase during the transaction execution. [More info](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)       |
| `destroyed`    | Bool           | Yes      | Indicates whether the account was destroyed during the execution.                                                                        |

## Storage
Validators can add transactions of this type as they see fit. They do not handle incoming messages or trigger codes. Their sole purpose is to collect storage fees from an account, impacting its storage statistics and balance. If the resulting _TON coin_ balance of the account falls below a specified threshold, the account may be frozen, and its code and data will be replaced with their combined hash.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                      |
| ------------ | -------------- |--------------------------------------------------------------------------------------------------------------------------------------------------|
| `storage_ph` | TrStoragePhase | Contains information about the storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

`Tick` and `Tock` transactions are designated for special system smart contracts that must be automatically invoked in every block. `Tick` transactions are executed at the start of each MasterChain block, while `Tock` transactions are initiated at the end.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                         |
| ------------ | -------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `is_tock`    | Bool           | Yes      | A flag that indicates the type of transaction used to distinguish between `Tick` and `Tock` transactions.                                                           |
| `storage_ph` | TrStoragePhase | Yes      | Provides information about the storage phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `compute_ph` | TrComputePhase | Yes      | Provides information about the compute phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`     | TrActionPhase  | No       | Provides information about the action phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                       |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during execution.                                                                          |

## Split prepare

:::note
This type of transaction is currently not in use, and details about its implementation are limited.
:::

Split transactions are designed for large smart contracts that must be divided due to high load. The contract must support this transaction type and manage the splitting process to distribute the load effectively.

**Split prepare** transactions are triggered when a smart contract needs to be split. The smart contract should generate the state necessary to create a new instance that will be deployed.


```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                              |
| ------------ | -------------- | -------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info` | SplitMergeInfo | Yes      | Contains information about the split process.                                                                                                                            |
| `storage_ph` | TrStoragePhase | No       | Provides details about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                           |
| `compute_ph` | TrComputePhase | Yes      | Contains details about the compute phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                           |
| `action`     | TrActionPhase  | No       | Provides information about the action phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                          |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during execution.                                                                                 |

## Split install

:::note
This transaction type is currently unavailable, and available information is limited.
:::

**Split install** transactions are used to deploy new instances of large smart contracts. A [split prepare](#split-prepare) transaction generates the state for the new contract.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                                                                                  |
| --------------------- | --------------------------- |--------------------------------------------------------------------------------------------------------------|
| `split_info`          | SplitMergeInfo              | Information about the split process.                                                                         |
| `prepare_transaction` | [Transaction](#transaction) | Information about the [transaction prepared](#split-prepare) for the split operation. Stored as a reference. |
| `installed`           | Bool                        | Indicates whether the transaction was installed.                                                             |

## Merge prepare

:::note
This transaction type is currently unavailable, and available information is limited.
:::

Merge transactions are triggered for large smart contracts that need to recombine after being split under high load. The contract must support this transaction type and handle the merging process to help balance system resources.


**Merge prepare** transactions are initiated when two smart contracts are set to merge. The contract should generate a message to the other instance to initiate and facilitate the merge process.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                        |
| ------------ | -------------- |----------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info` | SplitMergeInfo | Information about the merge process.                                                                                                               |
| `storage_ph` | TrStoragePhase | Contains information about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Indicates whether the transaction execution was aborted.                                                                                           |

## Merge install

:::note
This transaction type is currently unavailable, and available information is limited.
:::

**Merge install** transactions are used to merge instances of large smart contracts. A [merge prepare](#merge-prepare) transaction generates a special message that facilitates the merge.

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                        | Required | Description                                                                                                                                                           |
| --------------------- | --------------------------- | -------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info`          | SplitMergeInfo              | Yes      | Information about the merge process.                                                                                                                                  |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | Information about the [transaction prepared](#merge-prepare) for the merge operation. Stored as a reference.                                                          |
| `storage_ph`          | TrStoragePhase              | No       | Contains information about the storage phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `credit_ph`           | TrCreditPhase               | No       | Contains information about the credit phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                         |
| `compute_ph`          | TrComputePhase              | Yes      | Contains information about the compute phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`              | TrActionPhase               | No       | Contains information about the action phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`             | Bool                        | Yes      | Indicates whether the transaction was aborted during execution.                                                                            |
| `destroyed`           | Bool                        | Yes      | Indicates whether the account was destroyed during execution.                                                                             |

## See also

- The initial explanation of the [transaction layout](/tblkch.pdf#page=75&zoom=100,148,290) from the whitepaper.

<Feedback />




================================================
FILE: docs/v3/documentation/faq.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/faq.md
================================================
import Feedback from '@site/src/components/Feedback';

# FAQ

This section answers the most popular questions about the TON Blockchain.

## Overview

### Could you share a brief overview of TON?

- [Introduction to The Open Network](/v3/concepts/dive-into-ton/introduction)
- [The TON Blockchain is based on PoS consensus](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [TON Whitepapers](/v3/documentation/whitepapers/overview)

### What are some of the main similarities and differences to EVM blockchains?

- [Ethereum to TON](/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm)
- [Comparison of TON, Solana and Ethereum 2.0](https://ton.org/comparison_of_blockchains.pdf)


### Does TON have a test environment?

- [Testnet](/v3/documentation/smart-contracts/getting-started/testnet)

## TON and L2

### Why are workchains better than L1 → L2?

Workchains in TON offer several advantages over traditional L1 and L2 layer architecture:

1. **Instantaneous transactions**

One of blockchain's key advantages is the instantaneous processing of transactions. In traditional L2 solutions, there can be delays in moving assets between layers. WorkChains eliminate this problem by providing seamless and instantaneous transactions across the network. This is especially important for applications requiring high speed and low latency.

2. **Cross-shard activity**

WorkChains support cross-shard activity, allowing users to interact between different ShardChains or WorkChains within the same network. In current L2 solutions, cross-shard operations are complex and often require additional bridges or interoperability solutions. In TON, users can easily exchange tokens or perform other transactions between different ShardChains without complicated procedures.

3. **Scalability**

Scalability is a significant challenge for modern blockchain systems. In traditional L2 solutions, scalability is limited by the capacity of the sequencer. If the transactions per second (TPS) on L2 exceed the sequencer's capacity, it can cause problems. In TON, WorkChains solve this problem by dividing a shard when the load exceeds its capacity. This allows the system to scale almost without limits.

### Is there a need for L2 on the TON?

While the TON platform offers highly optimized transaction fees and low latency, some applications may require lower transaction costs or further reduced latency. L2 solutions may be needed to meet specific application requirements in such cases. Thus, the need for L2 on TON could arise.

## MEV (Maximum Extractable Value)

### Is front-running possible in TON?

In the TON Blockchain, deterministic transaction ordering is critical to prevent front-running. Once transactions enter the pool, their order is predetermined and cannot be altered by any participant. This system ensures that no one can manipulate the order of transactions for profit.
Unlike blockchains such as Ethereum, where validators can change the order of transactions within a block, creating opportunities for MEV, TON’s architecture eliminates this possibility.


Additionally, TON does not rely on a market-based mechanism to determine transaction fees. Commissions are fixed and do not fluctuate based on transaction priority. This lack of fee variability further reduces the incentive and feasibility of front-running.
Due to the combination of fixed fees and deterministic transaction ordering,front-running in TON is not a trivial task.



## Block

### What is the RPC method used to retrieve block information?

Validators produce blocks, and existing blocks can be accessed via liteservers, which are available through lite clients. Additionally, third-party tools like wallets, explorers, and dApps are built on top of lite clients.

To access the core lite client, visit our GitHub repository:

[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

Here are three popular third-party block explorers:
- [TON Explorer](https://explorer.toncoin.org/last)
- [TON Center](https://toncenter.com/) 
- [TON Whales Explorer](https://tonwhales.com/explorer)

For more information, refer to our documentation's [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) section.


### Block time

_Block time: 2-5 seconds_

:::info
You can compare TON's on-chain metrics, including block time and time-to-finality, with Solana and Ethereum by reading our analysis at:
* [Comparison of Blockchains document](https://ton.org/comparison_of_blockchains.pdf)
* [Comparison of Blockchains table (much less informative than the document, but more visual)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Time-to-finality

_Time-to-finality: under 6 seconds_
:::info
Compare TON's on-chain metrics, including block time and time-to-finality, with Solana and Ethereum by reading our analysis at:
* [Comparison of Blockchains document](https://ton.org/comparison_of_blockchains.pdf)
* [Comparison of Blockchains table (much less informative than the document, but more visual)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Average block size

```bash 
max block size param 29
max_block_bytes:2097152
```

:::info
For more up-to-date parameters, refer to the [Network configs](/v3/documentation/network/configs/network-configs) section.
:::

### What is the layout of blocks on TON?

For detailed explanations of each field in the block layout, visit the [Block layout](/v3/documentation/data-formats/tlb/block-layout).

## Transactions

### RPC method to get transactions data

For details, please refer to the previous answer:
- [See answer above](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### Is the TON transaction asynchronous or synchronous? Can I access documentation that shows how this system works?

TON Blockchain messages are **asynchronous**:
- The sender prepares the transaction body (message BoC) and broadcasts it via the lite client (or a higher-level tool). 
- The lite client returns the status of the broadcast, not the result of executing the transaction. 
- To check the desired result, the sender must monitor the state of the target account (address) or the overall blockchain state.

An explanation of how TON asynchronous messaging works is provided in the context of **wallet smart contracts**:

- [How TON wallets work and how to access them using JavaScript](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

Example for wallet contract transfer (low-level):

- [Wallet transfer example](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)

### Can a transaction be determined to be 100% finalized? Is querying the transaction-level data sufficient to obtain this information?

**Short answer:**
The receiver's account must be checked to ensure a transaction is finalized.
For more details on transaction verification, refer to the following examples:

- Go: [Wallet example](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python: [Storefront bot with payments in TON](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript: [Bot being used for dumpling sales](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### What is the layout of a transaction in TON?

Detailed explanations of each field in the transaction layout can be found here:

- [Transaction layout](/v3/documentation/data-formats/tlb/transaction-layout)

### Is transaction batching possible?

Yes, transaction batching is possible in TON and can be achieved in two ways:

1. **Asynchronous transactions:** by sending independent transactions to the network. 
2. **Using smart contracts:** smart contracts can receive tasks and execute them in batches.

Example of using batch-featured contract (high-load wallet):
- [High-load wallet API example](https://github.com/tonuniverse/highload-wallet-api)

Default wallets (v3/v4) also support sending multiple messages (up to 4) in a single transaction.

## Standards

### What currency accuracy is available for TON?

_9 digits_

:::info
Mainnet supports a 9-digit accuracy for currencies.
:::

### Are there any standardized protocols for minting, burning, and transferring fungible and non-fungible tokens in transactions?

Non-fungible tokens (NFTs):
- [TEP-62: NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [NFT documentation](/v3/documentation/dapps/defi/tokens#nft)

Jettons (tokens):
- [TEP-74: Jettons standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [Distributed tokens overview](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [Fungible token documentation (Jettons)](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

Other standards:
- [TON TEPs repository](https://github.com/ton-blockchain/TEPs)

### Are there examples of parsing events with Jettons (Tokens) and NFTs?

On TON, all data is transmitted as BOC (Binary Object Container) messages. Using NFTs in transactions is treated as a regular message, similar to a transaction involving a standard wallet.

Certain indexed APIs allow you to view all messages sent to or from a contract and filter them based on your needs.
- [TON API (REST)](https://docs.tonconsole.com/tonapi/rest-api)

To understand this process better, refer to the [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) section.


## Account Structure

### What is the address format?

- [Smart contract address](/v3/documentation/smart-contracts/addresses)

### Is it possible to have a named account similar to ENS

Yes, use TON DNS:
- [TON DNS & domains](/v3/guidelines/web3/ton-dns/dns)

### How to distinguish between a normal account and a smart contract?

- [Everything is a smart contract](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### How to tell if an address is a token contract?

To identify a **Jetton** contract:

- It must implement the [Jetton standard interface (TEP-74)](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- It should respond to:
  - `get_wallet_data()` — for Jetton wallet contracts
  - `get_jetton_data()` —  for the main Jetton master contract

### Are there any special accounts (e.g. accounts owned by the network) that have different rules or methods from the rest?

Yes. TON includes a special master blockchain called the **MasterChain**, which holds contracts critical for network operations, including network-wide contracts with network configuration, validator-related contracts, etc. 

:::info
Read more about MasterChain, WorkChains and ShardChains in TON Blockchain overview article: [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).
:::

A good example is a smart governance contract, which is a part of MasterChain:
- [Governance contracts](/v3/documentation/smart-contracts/contracts-specs/governance)

## Smart contracts

### Is it possible to detect contract deployment events on TON?

[Everything in TON is a smart contract](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract).

An account address in TON is deterministically derived from its _initial state_, consisting of the _initial code_  and _initial data_. For wallets, the initial data typically includes a public key and other parameters.
If any part of the initial state changes, the resulting address will also change.

A smart contract can exist in an _uninitialized state_, meaning it is not yet deployed on the blockchain but may still hold a non-zero balance. The initial state can be submitted to the network later via internal or external messages—these messages can be monitored to detect when a contract is deployed.

To prevent message chains from getting stuck due to missing contracts, TON uses a "bounce" feature. You can read more about it in the following articles:

- [Deploying wallet via TonLib](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [Paying for processing queries and sending responses](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### Does the upgradability of a smart-contract pose a threat to its users?

The ability to upgrade smart contracts is currently a common practice and widely adopted across modern protocols. Upgradability allows developers to fix bugs, add new features, and enhance security over time.

How to mitigate the risks:

1. Choose projects with strong reputations and well-known development teams. 
2. Reputable projects typically undergo independent code audits to ensure the smart contract is secure and reliable. Look for multiple completed audits from trusted auditing firms. 
3. An active community and positive user feedback can serve as additional indicators of a project’s trustworthiness. 
4. Review how the project handles updates. The more transparent and decentralized the upgrade process is, the lower the risk for users.

### How can users be sure that the contract owner will not change certain conditions via an update?

The contract must be verified, which means its source code is publicly available for inspection. This allows users to confirm whether any upgrade logic is present. If the contract contains no mechanisms for modification, its behavior and terms are guaranteed to remain unchanged after deployment.

In some cases, upgrade logic may exist, but control over it can be transferred to an "empty" or null address. This effectively removes the ability to make future changes.


### Is it possible to redeploy code to an existing address, or must it be deployed as a new contract?

Yes, updating a contract's code at the same address is possible if the smart contract includes logic—typically through the `set_code()` instruction.

However, if a contract is not designed to execute `set_code()` internally or via external code, it is immutable. In this case, the contract's code cannot be changed, and it is impossible to redeploy a different contract to the same address.

### Can smart contract be deleted? 

Yes. A smart contract can be deleted in one of two ways:
- Through storage fee accumulation—if the contract’s balance drops to -1 TON, it will be automatically deleted. 
- By sending a message with [mode 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### Are smart contract addresses case-sensitive?

Yes, smart contract addresses are case-sensitive because they are encoded using the [base64 algorithm](https://en.wikipedia.org/wiki/Base64). You can learn more about how smart contract addresses work [here](/v3/documentation/smart-contracts/addresses).

### Is the Ton Virtual Machine (TVM) EVM-compatible?

No, the TON Virtual Machine (TVM) is incompatible with the Ethereum Virtual Machine (EVM).
TON uses an entirely different architecture: **asynchronous**, while Ethereum operates synchronously.

[Read more on asynchronous smart contracts](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

### Can smart contracts be written in Solidity on TON?

Relatedly, the TON ecosystem doesn't support development using Ethereum's Solidity language.

However, extending Solidity with asynchronous messaging and low-level data access would end up with something like FunC.

FunC is TON's native smart contract language. It features a syntax similar to many modern programming languages and was explicitly built for TON's architecture.


## Remote Procedure Calls (RPCs)

### Recommended node providers for data extraction

API types:

Learn more about the different [API Types](/v3/guidelines/dapps/apis-sdks/api-types) available in TON, including Indexed, HTTP, and ADNL.

Node providers partners:

- [TON Center API (v2)](https://toncenter.com/api/v2/)
- [GetBlock](https://getblock.io/)
- [TON Access by Orbs](https://www.orbs.com/ton-access/)
- [TON API by TON Center](https://github.com/toncenter/ton-http-api) 
- [NOWNodes](https://nownodes.io/nodes)
- [DTON GraphQL API](https://dton.io/graphql)

**TON Directory**
Explore a wide range of TON-related projects and tools curated by the community:

- [ton.app](https://ton.app/)

### Below are two primary resources for accessing information about public node endpoints on the TON Blockchain, including both Mainnet and Testnet.


- [Network configs](/v3/documentation/network/configs/network-configs)
- [Examples and tutorials](/v3/guidelines/dapps/overview#tutorials-and-examples)

<Feedback />




================================================
FILE: docs/v3/documentation/infra/crosschain/bridge-addresses.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/crosschain/bridge-addresses.md
================================================
import Feedback from '@site/src/components/Feedback';

# Bridges addresses

:::caution
For the most accurate current addresses of bridge smart contracts, please refer to the [blockchain config](/v3/documentation/infra/crosschain/overview#blockchain-configs). This is the most secure method.
:::

## Toncoin Mainnet

### Ethereum/Toncoin bridge

* Wrapped Toncoin address:  [0x582d872a1b094fc48f5de31d3b73f2d9be47def1](https://etherscan.io/token/0x582d872a1b094fc48f5de31d3b73f2d9be47def1)

* Bridge address: [Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr](https://tonscan.org/address/Ef_dJMSh8riPi3BTUTtcxsWjG8RLKnLctNjAM4rw8NN-xWdr)

* Collector address:  [EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5](https://tonscan.org/address/EQCuzvIOXLjH2tv35gY4tzhIvXCqZWDuK9kUhFGXKLImgxT5)

* Governance address: [Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY](https://tonscan.org/address/Ef87m7_QrVM4uXAPCDM4DuF9Rj5Rwa5nHubwiQG96JmyAjQY)

### BSC/Toncoin bridge

* Wrapped Toncoin address: [0x76A797A59Ba2C17726896976B7B3747BfD1d220f](https://bscscan.com/token/0x76A797A59Ba2C17726896976B7B3747BfD1d220f)

* Bridge address: [Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r](https://tonscan.org/address/Ef9NXAIQs12t2qIZ-sRZ26D977H65Ol6DQeXc5_gUNaUys5r)

* Collector address: [EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW](https://tonscan.org/address/EQAHI1vGuw7d4WG-CtfDrWqEPNtmUuKjKFEFeJmZaqqfWTvW)

* Governance Address - [Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp](https://tonscan.org/address/Ef8OvX_5ynDgbp4iqJIvWudSEanWo0qAlOjhWHtga9u2YjVp)

### Mainnet Toncoin oracles

* Oracle 0: [Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb](https://tonscan.org/address/Ef_P2CJw784O1qVd8Qbn8RCQc4EgxAs8Ra-M3bDhZn3OfzRb)

* Oracle 1: [Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M](https://tonscan.org/address/Ef8DfObDUrNqz66pr_7xMbUYckUFbIIvRh1FSNeVSLWrvo1M)

* Oracle 2: [Ef8JKqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-](https://tonscan.org/address/Ef8JKqx4I-XECLuVhTqeY1WMgbgTp8Ld3mzN-JUogBF4ZEW-)

* Oracle 3: [Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn](https://tonscan.org/address/Ef8voAFh-ByCeKD3SZhjMNzioqCmDOK6S6IaeefTwYmRhgsn)

* Oracle 4: [Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M](https://tonscan.org/address/Ef_uJVTTToU8b3o7-Jr5pcUqenxWzDNYpyklvhl73KSIA17M)

* Oracle 5: [Ef93olLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro](https://tonscan.org/address/Ef93olLWqh1OuBSTOnJKWZ4NwxNq_ELK55_h_laNPVwxcEro)

* Oracle 6: [Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn](https://tonscan.org/address/Ef_iUPZdKLOCrqcNpDuFGNEmiuBwMB18TBXNjDimewpDExgn)

* Oracle 7: [Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa](https://tonscan.org/address/Ef_tTGGToGmONePskH_Y6ZG-QLV9Kcg5DIXeKwBvCX4YifKa)

* Oracle 8: [Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC](https://tonscan.org/address/Ef94L53akPw-4gOk2uQOenUyDYLOaif2g2uRoiu1nv0cWYMC)

* EVM Addresses:  	 
	* 0xC4c9bd836ab8b446519736166919e3d62491E041
	* 0xCF4A7c26186aA41390E246FA04115A0495085Ab9
	* 0x17DcaB1B1481610F6C7a7A98cf0370dC0EC704a6
	* 0x32162CAaEd276E77EF63194820586C942009a962
	* 0x039f4e886432bd4f3cb5062f9861EFef3F6aDA28
	* 0xFf441F9889Aa475d9D3b1C638C59B84c5179846D
	* 0x0933738699dc733C46A0D4CBEbDA2f842e1Ac7d9
	* 0x7F2bbaaC14F0f1834E6D0219F8855A5F619Fe2C4
	* 0xfc5c6A2d01A984ba9eab7CF87A6D169aA9720c0C

## Toncoin Testnet
  

### Ethereum/Toncoin bridge

* Wrapped Toncoin Address - [0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6](https://goerli.etherscan.io/token/0xDB15ffaf2c88F2d89Db9365a5160D5b8c9448Ea6)

* Bridge Address - [Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC](https://testnet.tonscan.org/address/Ef-56ZiqKUbtp_Ax2Qg4Vwh7yXXJCO8cNJAb229J6XXe4-aC)

* Collector Address - [EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU](https://testnet.tonscan.org/address/EQCA1W_I267-luVo9CzV7iCcrA1OO5vVeXD0QHACvBn1jIVU)

* Governance Address - [kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n](https://testnet.tonscan.org/address/kf-OV1dpgFVEzEmyvAETT8gnhqZ1IqHn8RzT6dmEmvnze-9n)

### BSC/Toncoin bridge

* Wrapped Toncoin address: [0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6](https://testnet.bscscan.com/token/0xdb15ffaf2c88f2d89db9365a5160d5b8c9448ea6)

* Bridge address: [Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID](https://testnet.tonscan.org/address/Ef_GmJntTDokxfhLGF1jRvMGC8Jav2V5keoNj4El2jzhHsID)

* Collector address: [EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS](https://testnet.tonscan.org/address/EQDBNfV4DQzSyzNMw6BCTSZSoUi-CzWcYNsfhKxoDqfrwFtS)

* Governance address: [kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693](https://testnet.tonscan.org/address/kf83VnnXuaqQV1Ts2qvUr6agacM0ydOux5NNa1mcU-cEO693)

### Testnet Toncoin oracles

* Oracle 0

	* TON address: [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)

	* EVM address: 0xe54cd631c97be0767172ad16904688962d09d2fe

* Oracle 1

	* TON address: [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

	* EVM address: 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

* Oracle 2

	* TON address: [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

	* EVM address: 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51

## Token Mainnet

### TON/Ethereum token bridges

* Ethereum bridge address: [0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5](https://etherscan.io/address/0xb323692b6d4DB96af1f52E4499a2bd0Ded9af3C5)

* Bridge address: [Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB](https://tonscan.org/address/Ef-1JetbPF9ubc1ga-57oHoOyDA1IShJt-BVlJnA9rrVTfrB)

* Collector address: [EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl](https://tonscan.org/address/EQDF6fj6ydJJX_ArwxINjP-0H8zx982W4XgbkKzGvceUWvXl)

* Governance address: [Ef8hHxV0v2I9FHh3CMX91WXjKaJav6SQlemEQm8ZvPBJdLde](https://tonscan.org/address/Ef8hHxV0v2I9FHh3CMX91WXjKaJav6SQlemEQm8ZvPBJdLde)

### Mainnet token oracles

* Oracle 0
	* TON public key:  a0993546fbeb4e8c90eeab0baa627659aee01726809707008e38d5742ea38aef

	* TON address: [Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9](https://tonscan.org/address/Ef8WxwYOyAk-H0YGBc70gZFJc6oqUvcHywU-yJNBfSNh-GW9)

	* ETH address: 0x3154E640c56D023a98890426A24D1A772f5A38B2

* Oracle 1

	* TON public key: fe0a78726a82754b62517e4b7a492e1b1a8d4c9014955d2fa8f1345f1a3eafba

	* TON address: [Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj](https://tonscan.org/address/Ef8CbgwhUMYn2yHU343dcezKkvme3cyFJB7SHVY3FXhU9jqj)

	* ETH Address: 0x8B06A5D37625F41eE9D9F543482b6562C657EA6F

* Oracle 2

	* TON public key: 00164233e111509b0486df85d2743defd6e2525820ee7d341c8ad92ee68d41a6

* TON address: [Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH](https://tonscan.org/address/Ef-n3Vdme6nSe4FBDb3inTRF9B6lh3BbIwGlk0dDpUO5oFmH)

	* ETH address: 0x6D5E361F7E15ebA73e41904F4fB2A7d2ca045162

* Oracle 3

	* TON public key: 9af68ce3c030e8d21aae582a155a6f5c41ad006f9f3e4aacbb0ce579982b9ebb

	* TON address: [Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9](https://tonscan.org/address/Ef9D1-FOb82pREFPgW7AlzNlZ7f0XnvmGakW23wpWeILAum9)

	* ETH address: 0x43931B8c29e34a8C16695408CD56327F511Cf086

* Oracle 4

	* TON public key: a4fef528b1e841f5fce752feeac0971f7df909e37ffeb3fab71c5ce8deb9f7d4

	* TON address: [Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ](https://tonscan.org/address/Ef8TBPHHIowG5pGgSVX8n4KmOaX-EEjvnOSBRlQvVsJWP_WJ)

	* ETH address: 0x7a0d3C42f795BA2dB707D421Add31deda9F1fEc1

* Oracle 5

	* TON public key: 58a7ab3e3ff8281b668a86ad9fe8b72f2d14df5dcc711937915dacca1b94c07d

	* TON address: [Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45](https://tonscan.org/address/Ef8ceN7cTemTe4ZV6AIbg5f8LsHZsYV1UaiGntvkME0KtP45)

	* ETH address: 0x88352632350690EF22F9a580e6B413c747c01FB2

* Oracle 6

	* TON public key: db60c3f50cb0302b516cd42833c7e8cad8097ad94306564b057b16ace486fb07

	* TON address: [Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4](https://tonscan.org/address/Ef8uDTu2WCcJdtuKmkDmC1yRKVxZrTp83ke5PnMECOccg3w4)

	* ETH address: 0xeB8975966dAF0C86721C14b8Bb7DFb89FCBB99cA

* Oracle 7

	* TON public key: 98c037c6d3a92d9467dc62c0e3da9bb0ad08c6b3d1284d4a37c1c5c0c081c7df

	* TON address: [Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ](https://tonscan.org/address/Ef905jDDX87nPDbTSMqFB9ILVGX1zWc66PPrNhkjHrWxAnZZ)

	* ETH address: 0x48Bf4a783ECFb7f9AACab68d28B06fDafF37ac43

* Oracle 8

	* TON public key: 5503c54a1b27525376e83d6fc326090c7d9d03079f400071b8bf05de5fbba48d

	* TON address: [Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x](https://tonscan.org/address/Ef9Ubg96xQ8jVKbl7QQJ1k8pClQLmO1Ci68nuNfbLdm9uS-x)

	* ETH address: 0x954AE64BB0268b06ffEFbb6f454867a5F2CB3177

## Token Testnet

### TON/Ethereum token bridge

* Ethereum bridge address: [0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60](https://goerli.etherscan.io/address/0x4Efd8f04B6fb4CFAF0cfaAC11Fb489b97DBebB60)

* Bridge address: [Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp](https://testnet.tonscan.org/address/Ef-lJBALjXSSwSKiedKzriSHixwQUxJ1BxTE05Ur5AXwZVjp)

* Collector address: [EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v](https://testnet.tonscan.org/address/EQC1ZeKX1LNrlQ4bwi3je3KVM1AoZ3rkeyHM5hv9pYzmIh4v)

* Governance address: [kf9NLH8CsGUkEKGYzCxaLd9Th6T5YkO-MXsCEU9Rw1fiRhf9](https://testnet.tonscan.org/address/kf9NLH8CsGUkEKGYzCxaLd9Th6T5YkO-MXsCEU9Rw1fiRhf9)

### Testnet token oracles

> The same applies to the Toncoin Testnet bridge.

* Oracle 0

	* TON address: [Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR](https://testnet.tonscan.org/address/Ef9fwskZLEuGDfYTRAtvt9k-mEdkaIskkUOsEwPw1wzXk7zR)
	
	* EVM address: 0xe54cd631c97be0767172ad16904688962d09d2fe

* Oracle 1

	* TON address: [Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu](https://testnet.tonscan.org/address/Ef8jPzrhTYloKgTCsGgEFNx7OdH-sJ98etJnwrIVSsFxH9mu)

	* EVM address: 0xeb05E1B6AC0d574eF2CF29FDf01cC0bA3D8F9Bf1

* Oracle 2

	* TON address: [Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE](https://testnet.tonscan.org/address/Ef-fxGCPuPKNR6T4GcFxNQuLU5TykLKEAtkxWEfA1wBWy6JE)

	* EVM address: 0xF636f40Ebe17Fb2A1343e5EEee9D13AA90888b51
<Feedback />




================================================
FILE: docs/v3/documentation/infra/crosschain/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/crosschain/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# Cross-chain bridges

Decentralized cross-chain bridges function on TON Blockchain, allowing asset transfers between this blockchain and the others.

## Toncoin bridge

The Toncoin bridge enables transfers of Toncoin between TON and Ethereum Blockchain and between TON and the BSC (BNB Smart Chain).

This bridge is managed by [decentralized oracles](/v3/documentation/infra/crosschain/bridge-addresses).

### How to use it

The bridge frontend is hosted [here](https://ton.org/bridge).

:::info
[Bridge frontend source code](https://github.com/ton-blockchain/bridge)
:::

### Smart contract source codes

#### TON-Ethereum

* [FunC (TON side)](https://github.com/ton-blockchain/bridge-func)
* [Solidity (Ethereum side)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

#### TON-BSC (BNB Smart Chain)

* [FunC (TON side)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
* [Solidity (BSC side)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### Blockchain configurations

You can find the current bridge smart contract addresses and oracle addresses by checking the corresponding configuration:

* TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738)
* TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739)
* TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740)

### Documentation

* [How the bridge works](https://github.com/ton-blockchain/TIPs/issues/24)

### Cross-chain roadmap

* [@The Open Network](https://t.me/tonblockchain/146)

<Feedback />




================================================
FILE: docs/v3/documentation/infra/minter-flow.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/minter-flow.md
================================================
import Feedback from '@site/src/components/Feedback';

# Extra currency minting

## Extracurrency

According to [TON Blockchain Whitepaper 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55), the TON Blockchain allows users to create arbitrary cryptocurrencies or tokens, in addition to the Toncoin, provided certain conditions are met. These additional cryptocurrencies are identified by 32-bit **currency\_ids**. The list of these defined cryptocurrencies is a part of the blockchain configuration stored in the MasterChain. Each internal message and account balance includes a special field for `ExtraCurrencyCollection`, which is a set of extracurrencies attached to a message or maintained in a balance:

```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## Extracurrency config

A dictionary, specifically `ExtraCurrencyCollection`, containing all currencies to be minted is stored in `ConfigParam7`:

```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6` contains data related to the minting:

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2` contains the address of  **minter**.

## Low-level minting flow

In each block, the collator compares the old global balance (the global balance of all currencies at the end of the previous block) with `ConfigParam7`. If any amount for any currency in `ConfigParam7` is less than it is in the global balance, the config is invalid. If any amount of any currency in `ConfigParam7` is higher than it is in the global balance, a minting message will be created.

This minting message has source `-1:0000000000000000000000000000000000000000000000000000000000000000` and **minter** from `ConfigParam2` as destination and contains excesses of extracurrencies in `ConfigParam7` over the old global balance.

The problem here is that the minting message includes only additional currencies and no Toncoins.  As a result, even if the **Minter** is designated as a fundamental smart contract (as indicated in `ConfigParam31`), a minting message will lead to an aborted transaction with the error: `compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`.

## High-level minting flow

One possible high-level minting flow, which is implemented [here](https://github.com/ton-blockchain/governance-contract/tree/50ed2ecacc9e3cff4c77cbcc69aa07b39f5c46a2) (check `*.tolk` files) is as follows:
  
1. There is `ExtraCurrencyAuthorizationConfig`: the config contains information on which contracts (addresses) have authorization to request minter to mint new extracurrencies. This config has the following scheme:

```tlb
_ (Hashmap 32 std_addr) = ExtraCurrencyAuthorizationConfig;
```

where key - `currency_id` and `std_addr` is _admin_ of this currency (can be in any WorkChain).

2. Minter accepts mint requests from **admins**, forwards requests for mint to **config**, **config** updates `ConfigParam 7`, and responds to **minter**. Since extracurrencies would be minted to **minter** only on the next MasterChain block, withdrawing extra currencies to **admin** should be delayed. It is done via **echo** smart-contract, not in MasterChain. When a response from **echo** comes to **minter**, it sends extracurrencies to **admin**. So the scheme is as follows: 

	`Admin -> Minter -> Config -> Minter -> Echo (in other workchain to wait 	until the next masterchain block) -> Minter -> Admin`

An example of this flow is as follows: [minting 2'000'000'000 units of `currency_id=100`](https://testnet.tonviewer.com/transaction/20fe328c04b4896acecb6e96aaebfe6fef90dcc1441e27049302f29770904ef0)

:::danger
Each minting of new extracurrency or an increase in the supply of existing currency necessitates a change to `ConfigParam7`, which in turn alters the configuration and creation of keyblocks. Frequent keyblock generation can slow down shard performance since each key block causes a rotation of validator groups and affects the synchronization of liteclients. Therefore, contracts like `swap.tolk` should not be utilized in production environments. Instead, it is advisable to use schemes that involve reserves to minimize minting events.
:::

:::info
Sending of extracurrency to blackhole has the following effect: extracurrency amount is burnt, but since `ConfigParam7` is not changed, on the next block, **minter** will receive the burnt amount on its balance.
:::


## How to mint your own extracurrency

1. Ensure that your network has the **minter contract** and that `ConfigParam2` and `ConfigParam6` are set correctly.

2. Create a **currency admin contract** that will control how the extra currency is minted.

3. Submit a proposal to the validators to add your **currency admin** contract address to the `ExtraCurrencyAuthorizationConfig` for a specific `currency_id` and obtain their approval.

4. Send a `mint` request from the **currency admin contract** to the **minter**. Wait for the **minter** to return the extra currency.
<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors.md
================================================
import Feedback from '@site/src/components/Feedback';

# MyTonCtrl errors

## Overview

This document explains the errors that users may encounter with **MyTonCtrl**.

## Common errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| Unknown module name: `name`. Available modes: `modes` | Check available modes list |
| No mode named `name` found in current modes: `current_modes` | Check current modes list |
| GetWalletFromFile error: Private key not found | Check wallet name path |
| Cannot get own IP address | Verify access to the resources at [ipconfig.me](https://ifconfig.me/ip) and [ipinfo.io](https://ipinfo.io/ip) |

## Liteserver errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| Cannot enable liteserver mode while validator mode is enabled | Use `disable_mode validator` |
| LiteClient error: `error_msg` | Check MyTonCtrl parameters for running liteserver |

## Validator errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------|
| ValidatorConsole error: Validator console is not settings | Check [validator article](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings) |
| Cannot enable validator mode while liteserver mode is enabled | Use `disable_mode liteserver` |
| Validator wallet not found | Check [validator article](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets) |
| Validator is not synchronized | Wait more for sync or check [sync troubleshouting](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) |
| Stake less than the minimum stake. Minimum stake: `minStake` | Use [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) and [check stake parameters](/v3/documentation/network/configs/blockchain-configs#param-17) |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Add funds to your account `balance`, ensuring it reaches the required `stake` amount |

## Nominator pool errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| CreatePool error: Pool with the same parameters already exists | Check `pools_list` for existing pools |
| create_single_pool error: Pool with the same parameters already exists | Check `pools_list` for existing pools |

## See also

* [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)
<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MyTonCtrl

## Overview

To install and manage your own node, use the **MyTonCtrl** open-source tool developed by the TON Foundation. **MyTonCtrl** is reliable and tested on most TON nodes.

[MyTonCtrl](https://github.com/ton-blockchain/mytonctrl) is a console application that is a convenient wrapper for fift, lite-client, and validator-engine-console. It has been specifically developed to streamline the Linux operating system's wallet, domain, and validator management tasks.

We are actively seeking feedback about the installation process. If you have any questions or suggestions, please [contact us](https://t.me/Alexgton).

## Install the MyTonCtrl

Download and execute the installation script from a **non-root** user account with **sudo** permissions:

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh
```

  </TabItem>
  <TabItem value={'debian'} label={'Debian'}>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash install.sh'
```

  </TabItem>
</Tabs>

**Flags:**

- `-d` - **MyTonCtrl** will download a [dump](https://dump.ton.org/) of the latest blockchain state, significantly reducing synchronization time.
- `-c <path>` - Specify a non-public liteserver for synchronization (optional).
- `-i` - Ignore minimum requirements; use this only if you test the compilation process without running a real node.
- `-m` - Sett the mode either `validator` or `liteserver`.
- `-t` - Disable telemetry.

**To use testnet**, `-c` flag with the value `https://ton.org/testnet-global.config.json`.

The default value for the `-c` flag is `https://ton-blockchain.github.io/global.config.json`, which is default configuration for the mainnet.

## General Commands

### help

No args, prints help text.

### exit

No args, exits from the console.

### update

Updates MyTonCtrl. Param combinations:

| Format name            | Format                                                                     | Example                                                               | Description                                                                     |
| :--------------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No args                | `update`                                                                   | `update`                                                              | Update from current repo                                                        |
| URL format             | `update [https://github.com/author/repo/tree/branch]`                      | `update https://github.com/ton-blockchain/mytonctrl/tree/test`        | Update from specified URL                                                       |
| Branch Only format     | `update [BRANCH]`                                                          | `update test`                                                         | Update from specified branch of current repo                                    |
| Branch Override format | `update [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `update https://github.com/ton-blockchain/mytonctrl/tree/master test` | Update the branch specified by the second argument in the designated repository |

### upgrade

Updates the node. Param combinations:

| Format name            | Format                                                                      | Example                                                             | Description                                                                           |
| :--------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| No args                | `upgrade`                                                                   | `upgrade`                                                           | Upgrade from current repo                                                             |
| URL format             | `upgrade [https://github.com/author/repo/tree/branch]`                      | `upgrade https://github.com/ton-blockchain/ton/tree/master`         | Upgrade from specified URL                                                            |
| Branch Only format     | `upgrade [BRANCH]`                                                          | `upgrade master`                                                    | Upgrade from specified branch of current repo                                         |
| Branch Override format | `upgrade [https://github.com/authorName/repoName/tree/branchName] [BRANCH]` | `upgrade https://github.com/ton-blockchain/ton/tree/master testnet` | Upgrade from the branch specified by the second argument of the designated repository |

### status

Gets current MyTonCtrl and node status. Param combinations:

| Format name | Format        | Example       | Description                                                                                                                     |
| ----------- | ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| No args     | `status`      | `status`      | Full status report including validator efficiency and online validators.                                                        |
| Fast        | `status fast` | `status fast` | This must be used on Testnet. The status report should exclude the efficiency of validators and the count of online validators. |

[See more about status output](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status)

### installer

No args, runs the installer of TON modules (script `/usr/src/mytonctrl/mytoninstaller.py`).

### status_modes

No args, shows MTC modes.

### status_settings

No args, shows all available settings with their description and values.

### enable_mode

Enables a specific mode.

```bash
MyTonCtrl> enable_mode <mode_name>
```

Example:

```bash
MyTonCtrl> enable_mode validator
```

### disable_mode

Disables a specific mode.

```bash
MyTonCtrl> disable_mode <mode_name>
```

Example:

```bash
MyTonCtrl> disable_mode validator
```

### about

Provides a description of the specified mode.

```bash
MyTonCtrl> about <mode_name>
```

Example:

```bash
MyTonCtrl> about validator
```

### get

Gets the value of a specific setting in JSON format.

```bash
MyTonCtrl> get <setting_name>
```

Example:

```bash
MyTonCtrl> get stake
```

### set

Sets the specified value for a given setting. Skip the check for setting existence if `--force` is enabled.

```bash
MyTonCtrl> set <setting> <value> [--force]
```

Example:

```bash
MyTonCtrl> set stake 9000
```

### rollback

No args, rollbacks to MyTonCtrl 1.0. **You should avoid using MyTonCtrl 1.0 under any circumstances**.

### getconfig

Retrieves and displays the JSON representation of the configuration specified by `<config-id>`.

```bash
MyTonCtrl> getconfig <config_id> # config id can be omitted
```

Example:

```bash
MyTonCtrl> getconfig 0
```

### get_pool_data

Retrieves and displays the JSON representation of the pool data specified by `<pool-name>` or `<pool-addr>`.

```bash
MyTonCtrl> get_pool_data <<pool-name> | <pool-addr>>
```

Example:

```bash
get_pool_data pool_name # you can check possible pool names using ls /home/install_mytonctrl/.local/share/mytoncore/pools
```

## Overlays

To better understand overlays, read the information [here](/v3/guidelines/nodes/custom-overlays).

### add_custom_overlay

Adds a custom overlay with the given `<name>` using the configuration specified by `<path_to_config>`.

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

Example:

```bash
add_custom_overlay custom /config.json
# check link from above to know what config this command requires (/v3/guidelines/nodes/custom-overlays)
```

### list_custom_overlays

No args, prints custom overlays.

### delete_custom_overlay

Deletes the custom overlay with the specified `<name>`.

```bash
MyTonCtrl> delete_custom_overlay <name>
```

## Validator

### vo

Votes for the offer specified by `<offer-hash>`.

```bash
MyTonCtrl> vo <offer-hash> # use `ol` to get offers
```

### ve

No args, votes for election.

### vc

Votes for the complaint specified by `<complaint-hash>` in the election specified by `<election-id>`

```bash
MyTonCtrl> vc <election-id> <complaint-hash>
```

Actually, this will work as well, but you should use data from your current MyTonCtrl state:

```bash
MyTonCtrl> vc 0 0
```

### check_ef

Outputs validator efficiency data for the current and previous rounds.

**Note**: The accuracy of data improves as the current round progresses.

Based on the `validator index`, which can be obtained using the `status` command, there are three possible scenarios:

1. **Validator index in the range [0, `max_main_validators`)**:
   The `validator efficiency` must remain above 90% for the entire round. This percentage may be adjusted in the future based on statistics. If it falls below this threshold, a penalty (fine) may be imposed.

2. **Validator index in the range [`max_main_validators`, `max_validators`)**:
   The `validator efficiency` should still be above 90% for the full round (this percentage may be adjusted in the future based on statistics). Currently, no penalties will be applied; however, this may change in future updates.

3. **The user is not a validator**:
   No penalties apply, but the user is also not eligible for rewards. In this case, there is no `validator efficiency` to monitor. This situation can arise from having a low stake or an incorrect node configuration. Additionally, ensure that `MyTonCtrl` is running continuously.

Learn more about `max_validators` and `max_main_validators` [on config parameters page](/v3/documentation/network/configs/blockchain-configs#configuration-parameters-for-the-number-of-validators-for-elections). Get the current values [for mainnet](https://tonviewer.com/config#16) and [for testnet](https://testnet.tonviewer.com/config#16).

## Pool commands

Get more information [at nominator pool page](/v3/documentation/smart-contracts/contracts-specs/nominator-pool).

### deposit_to_pool

Deposits the specified `<amount>` to the pool specified by `<pool-addr>`.

```bash
MyTonCtrl> deposit_to_pool <pool-addr> <amount>
```

Example:

```bash
MyTonCtrl> deposit_to_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### withdraw_from_pool

Withdraws the specified `<amount>` from the pool specified by `<pool-addr>`

```bash
MyTonCtrl> withdraw_from_pool <pool-addr> <amount>
```

Example:

```bash
MyTonCtrl> withdraw_from_pool kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX 1
```

### cleanup

No args, cleans up the validator database.

### benchmark

No args, displays a table with several tests.

## Single pool

Get more information [at single nominator pool page](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool).

### new_single_pool

Creates a new single pool with the specified `<pool-name>` and `<owner-address>`.

```bash
MyTonCtrl> new_single_pool <pool-name> <owner-address>
```

Example:

```bash
MyTonCtrl> new_single_pool name kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT
```

### activate_single_pool

Activates the single pool specified by `<pool-name>`.

```bash
MyTonCtrl> activate_single_pool <pool-name> # pool name from above
```

## Wallet management

### Importing a wallet

MyTonCtrl supports various types of wallet-like contracts, including wallet-v1, wallet-v3, [lockup-wallet](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal), among others. It often offers a straightforward way to interact with these contracts.

#### Importing Using a Private Key

If you have access to a private key, you can easily import a wallet:

```bash
MyTonCtrl> iw <wallet-addr> <wallet-secret-key>
```

In this context, `<wallet-secret-key>` is your private key in base64 format.

Example:

```bash
MyTonCtrl> iw kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT AAAH++/ve+/vXrvv73vv73vv73vv71DWu+/vWcpA1E777+92Ijvv73vv70iV++/ve+/vUTvv70d77+9UFjvv71277+9bO+/ve+/vXgzdzzvv71i77+977+9CjLvv73vv73vv71i77+9Bu+/vV0oJe+/ve+/vUPvv73vv73vv70=
```

#### Importing using a mnemonic phrase

If you have a mnemonic phrase (a sequence of 24 words like `tattoo during ...`), follow these steps:

1. Install Node.js.
2. Clone and install [mnemonic2key](https://github.com/ton-blockchain/mnemonic2key):
   ```
   git clone https://github.com/ton-blockchain/mnemonic2key.git
   cd mnemonic2key
   npm install
   ```
3. Run the following command, replacing `word1`, `word2`... with your mnemonic phrase and `address` with the address of your wallet contract:
   ```
   node index.js word1 word2 ... word24 [address]
   ```
4. The script will generate `wallet.pk` and `wallet.addr`. Rename them to `imported_wallet.pk` and `imported_wallet.addr`.
5. Copy both files to the `~/.local/share/mytoncore/wallets/` directory.
6. Open the MyTonCtrl console and list the wallets using the `wl` command.
7. Verify that the wallet has been imported and displays the correct balance.
8. You can now send funds using the `mg` command. Enter `mg` to view the help documentation.
   Remember to replace placeholders (words inside `< >`) with your actual values when running commands.

### Show the list of wallets

```bash
MyTonCtrl> wl
```

![](/img/docs/mytonctrl/wl.png)

### Create a new local wallet

You can also create a new empty wallet:

```bash
MyTonCtrl> nw <workchain-id> <wallet-name> [<version> <subwallet>]
```

Example:

```bash
MyTonCtrl> nw 0 name v3 # by default subwallet is 0x29A9A317 + workchain
```

### Activate a local wallet

To use a wallet, you must activate it first:

```bash
MyTonCtrl> aw <wallet-name>
```

Before activating, send 1 Toncoin to the wallet:

```bash
MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            uninit  0.0               v1   0    0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs

MyTonCtrl> mg validator_wallet_001 0QBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Kbs 1
```

Then activate it:

```bash
MyTonCtrl> aw wallet_004
ActivateWallet - OK

MyTonCtrl> wl
Name                  Status  Balance           Ver  Wch  Address
validator_wallet_001  active  994.776032511     v1   -1   kf_dctjwS4tqWdeG4GcCLJ53rkgxZOGGrdDzHJ_mxPkm_Xct
wallet_004            active  0.998256399       v1   0    kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp
```

### Get the sequence number of the wallet

```bash
MyTonCtrl> seqno <wallet-name>
```

![](/img/docs/mytonctrl/nw.png)

### Set a wallet version

This command is needed when a modified wallet with interaction methods similar to a regular one is used.

```bash
MyTonCtrl> swv <wallet-addr> <wallet-version>
```

Example:

```bash
MyTonCtrl> swv kf9tZrL46Xjux3ZqvQFSgQkOIlteJK52slSYWbasqtOjrKUT v3
```

### Export a wallet

It is possible to obtain a specific wallet address along with its secret key:

```bash
MyTonCtrl> ew <wallet-name>
```

![](/img/docs/mytonctrl/ew.png)

### Delete a local wallet

```bash
MyTonCtrl> dw <wallet-name>
```

![](/img/docs/mytonctrl/dw.png)

## Account and transaction commands

### Account status

To check account status and its transaction history use the following command:

```bash
MyTonCtrl> vas <account-addr>
# For example, you can get the address of the validator wallet by the wl command and use vas to get more information.
```

![](/img/docs/mytonctrl/vas.png)

### Account history

To view your account transaction history, use the following command, specifying the number of listed operations as `limit`:

```bash
MyTonCtrl> vah <account-addr> <limit>
# limit is just unsigned integer number
```

![](/img/docs/mytonctrl/vah.png)

### Transfer coins

Transfer coins from the local wallet to another account:

```bash
MyTonCtrl> mg <wallet-name> <account-addr | bookmark-name> <amount>
```

Example:

```bash
MyTonCtrl> mg wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

:::caution
Wallet version 'v4' is not supported for the transferring
:::

### Transfer coins through a proxy

Transfer coins from local wallet to an account through a proxy:

```bash
MyTonCtrl> mgtp <wallet-name> <account-addr | bookmark-name> <amount>
```

Example:

```bash
MyTonCtrl> mgtp wallet_004 kQBxnZJq4oHVFs4ban3kJ5qllM1IQo57lIx8QP69Ue9A6Psp 1
```

## General pools commands

There are two types of pools in **MyTonCtrl**:

1. [Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)
2. [Single Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool)

All of them are managed by the following set of commands:

### List of pools

```bash
MyTonCtrl> pools_list
```

![](/img/docs/mytonctrl/test-pools-list.png)

### Delete a pool

```bash
MyTonCtrl> delete_pool <pool-name>
```

### Importing a pool

You can add an existing pool to the list of local pools:

```bash
MyTonCtrl> import_pool <pool-name> <pool-addr>
```

Example:

```bash
MyTonCtrl> import_pool name kf_JcC5pn3etTAdwOnc16_tyMmKE8-ftNUnf0OnUjAIdDJpX
```

## Bookmarks

You can create an alias (bookmark) for an account address to simplify its usage.

### Create a new bookmark

```bash
MyTonCtrl> nb <bookmark-name> <account-addr | domain-name>
```

![](/img/docs/mytonctrl/nb.png)

### Show the list of bookmarks

```bash
MyTonCtrl> bl
```

![](/img/docs/mytonctrl/bl.png)

### Delete a bookmark

```bash
MyTonCtrl> db <bookmark-name> <bookmark-type>
```

![](/img/docs/mytonctrl/db.png)

## The other MyTonCtrl commands

### ol

Show offers list:

| Format name         | Format           | Description                                                                                 |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| No arguments        | `ol`             | Prints the table with the hashes reduced.                                                   |
| JSON output         | `ol --json`      | Prints the JSON representation of `data`.                                                   |
| Full hash output    | `ol hash`        | Prints the table with full hashes.                                                          |
| JSON with full hash | `ol --json hash` | Prints the JSON representation of `data`. The `"hash"` argument has no effect in this case. |

### od

Retrieves the offer diff.

```bash
MyTonCtrl> od [offer-hash]
```

### el

Shows election entries list.

| Format name                       | Format                              | Description                                                                  |
| --------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| No arguments                      | `el`                                | Prints the table with ADNL, Pubkey, and Wallet reduced.                      |
| Any combination of following args | `el --json adnl pubkey wallet past` | Full ADNL, Pubkey, Wallet, and past election entries in JSON representation. |

Descriptions for each arg:

- `--json`: Prints the JSON representation of data.
- `past`: Includes past election entries.
- `adnl`: Prints full ADNL.
- `pubkey`: Displays full pubkey.
- `wallet`: Displays full wallet.

### vl

Show active validators

| Format name                       | Format                              | Description                                                                   |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| No arguments                      | `vl`                                | Prints the table with ADNL, Pubkey, and Wallet reduced.                       |
| Any combination of following args | `vl --json adnl pubkey wallet past` | Full ADNL, Pubkey, Wallet, and past validator entries in JSON representation. |

Descriptions for each arg:

- `--json`: Prints the JSON representation of data.
- `past`: Includes past validator entries.
- `adnl`: Prints full ADNL.
- `pubkey`: Displays full Pubkey.
- `wallet`: Displays full Wallet.
- `offline`: Excludes online validators.

### cl

Show complaints list

| Format name                       | Format                | Description                                            |
| --------------------------------- | --------------------- | ------------------------------------------------------ |
| No arguments                      | `cl`                  | Prints the table with ADNL reduced.                    |
| Any combination of following args | `cl --json adnl past` | Full ADNL with past complaints in JSON representation. |

Descriptions for each parameter:

- `--json`: Prints the JSON representation of data.
- `past`: Includes past complaints.
- `adnl`: Prints full ADNL.

## Installer

This section describes `installer` sub-console, that can be opened by command

```bash
MyTonCtrl> installer
```

Example:

![img.png](/img/docs/mytonctrl/installer.png)

All commands can be called directly from MyTonCtrl console:

```bash
MyTonCtrl> installer [command] [args]
```

### help

Displays all available commands.

### clear

Clears terminal screen.

### exit

Exits from `mytoninstaller` terminal

### status

Displays services status of Full node, MyTonCore, V.console, liteserver and node arguments.

### set_node_argument

| Format name        | Format                                      | Description                                                                                       |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Add or replace arg | `set_node_argument [-ARG_NAME] [ARG_VALUE]` | Add argument or replace it value if it exists. `-ARG_NAME` must have `-` or `--` at the beginning |
| Delete arg         | `set_node_argument [-ARG_NAME] -d`          | Delete argument from list.                                                                        |

Available arguments:

| Node argument name | Description                                                                                  | Default value                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `threads`          | count of threads                                                                             | `cpus count - 1`                                                                    |
| `daemonize`        |                                                                                              | No value                                                                            |
| `global-config`    | path to global config                                                                        | `/usr/bin/ton/global.config.json`                                                   |
| `db`               | path to database                                                                             | `/var/ton-work/db/`                                                                 |
| `logname`          | path to logs                                                                                 | `/var/ton-work/log`                                                                 |
| `state-ttl`        | ttl of blockchain states that node keep                                                      | 3600                                                                                |
| `archive-ttl`      | ttl of blocks node stores. _To force node not to store archive blocks use the value `86400`_ | 2592000 if liteserver mode was enabled during installation process, otherwise 86400 |

Example:

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

Example:

```bash
MyTonInstaller> set_node_argument --state-ttl 3601
```

### enable

Enables one of the modes for `ton-http-api` and creates the necessary configuration:

```bash
MyTonInstaller> enable <MODE_NAME>
```

Modes can have following names:

- `FN` - Full Node
- `VC` - Validator Console
- `LS` - Lite Server
- `DS` - DHT Server
- `JR` - JSON RPC
- `THA` - TON HTTP API
- `LSP` - ls proxy
- `TSP` - TON storage + TON storage provider

Example:

```bash
MyTonInstaller> enable FN
```

### update

Same as `enable` of `mytoninstaller`

```bash
MyTonInstaller> update FN
```

### plsc

Displays liteserver config.

Example:

```json
{
  "ip": 1111111111,
  "port": 11111,
  "id": {
    "@type": "pub.ed25519",
    "key": "UURGaaZZjsBbKHvnrBqslHerXYbMCVDKdswKNJvAHkc="
  }
}
```

### clcf

Creates a local config file (by default at `/usr/bin/ton/local.config.json`)

### print_ls_proxy_config

Displays ls proxy config.

### create_ls_proxy_config_file

Currently, it is in the development stage and is not functioning yet.

### drvcf

Dangerous recovery validator config file.

### setwebpass

No args. Sets a password for the web admin interface, runs `python3 /usr/src/mtc-jsonrpc/mtc-jsonrpc.py -p`.

## See also

- [FAQ](/v3/guidelines/nodes/faq)
- [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)

<Feedback />



================================================
FILE: docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/mytonctrl/mytonctrl-status.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# MyTonCtrl status

This document serves as a comprehensive guide to help you understand the output of **MyTonCtrl**'s `status` command.

![status](/img/docs/mytonctrl/status.png)

## TON network status

### Network name

Possible values are: `mainnet`, `testnet`, and `unknown`. However, the value `unknown` should never be displayed.

### Number of validators

There are two key values: one represented in green and the other in yellow. The green value indicates the number of online validators, while the yellow value represents the total number of validators.

Both values must be integers greater than 0. You can obtain the green value using the command `getconfig 34` with MyTonCtrl. For more information, please check the [relevant section here](/v3/documentation/network/configs/blockchain-configs#param-32-34-and-36) regarding parameters 32, 34, and 36.

### Number of shardchains

This value must be an integer greater than 0 and is displayed in green.

### Number of offers

- There are two values to note:
  - **Green**: Represents the number of `new offers`.
  - **Yellow**: Represents the total number of `all offers`.

### Number of complaints

- Similarly, there are two values to consider:
  - **Green**: Indicates the number of `new complaints`.
  - **Yellow**: Indicates the total number of `all complaints`.

### Election status

The election status can be indicated with green text for `open` or yellow text for `closed`.

## Local validator status

### Validator index

The validator index should be greater than or equal to 0 (which is the case if the validator mode is active). If it meets this requirement, it should be displayed in green; otherwise, it should be red.

### ADNL address of local validator

This section contains only the ADNL address.

### Local validator wallet address

The wallet address used for staking must be a valid TON address.

### Local validator wallet balance

This section shows the current balance of the wallet.

### Load average

The `load average` format is `[int]: int, int, int`. The first integer represents the number of CPUs, while the subsequent integers indicate the system load average for the last 1, 5, and 15 minutes.

### Network load average

This section also displays three integers, following the same logic as the `load average`: it presents the system load average for the last 1, 5, and 15 minutes.

### Memory load

**Absolute and Relative Memory Usage:** This refers to the usage of RAM and swap memory in two pairs of integers.

### Disk load average

This is similar to the `memory load`. However, it relates to the usage of all disk space instead.

### Mytoncore status

The status indicator should be green, showing how long Mytoncore has been operational.

### Local validator status

This indicator should also be green, displaying the uptime of the local validator.

### Local validator out of sync

This integer value should be less than 20, indicating that it is functioning properly (it will appear green).

### Local validator last state serialization

This entry displays the number of MasterChain blocks that are currently out of service.

### Local Validator database size

The absolute load size should be less than 1000 GB, and the relative load should be under 80%.

### Version of MyTonCtrl

This indicates the hash of the commit and the name of the branch.

### Version of validator

This shows the hash of the commit and the name of the branch.

## TON network configuration

### Configurator address

The address of the configurator. Refer to [this parameter-0](/v3/documentation/network/configs/blockchain-configs#param-0) for more information.

### Elector address

The address of the elector. Refer to [this parameter-1](/v3/documentation/network/configs/blockchain-configs#param-1) for additional details.

### Validation period

The duration of the validation period in seconds. Check [this parameter-15](/v3/documentation/network/configs/blockchain-configs#param-15).

### Duration of elections

This refers to the duration of elections in seconds. To know more, refer to [this parameter-15](/v3/documentation/network/configs/blockchain-configs#param-15).

### Hold period

The hold period in seconds, with details available at [this parameter-15](/v3/documentation/network/configs/blockchain-configs#param-15).

### Minimum stake

The minimum stake required in TONs. Check [this parameter-17](/v3/documentation/network/configs/blockchain-configs#param-17).

### Maximum stake

The maximum stake allowed in TONs. Check [this parameter-17](/v3/documentation/network/configs/blockchain-configs#param-17).

## TON timestamps

### TON network launch

This indicates the launch time of the current network, whether it is the Mainnet or Testnet.

### Start of the validation cycle

The timestamp indicates the beginning of the validation cycle. If it represents a future event, it will be displayed in green.

### End of the validation cycle

This is the timestamp for the end of the validation cycle; it will also appear green if it indicates a future date.

### Start of elections

The timestamp for when elections begin. This will be green if it represents a future date.

### End of elections

The timestamp indicating the end of elections is displayed in green if it predicts a future date.

### Beginning of the next elections

The timestamp for the start of the next elections will appear green if it signifies a future event.

<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/node-commands.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/node-commands.mdx
================================================
import Feedback from '@site/src/components/Feedback';

# TON node command-line flags

This document describes the various flags and options available when running a TON node. Each flag has a short name, a long name, a default value (if applicable), and a description of its functionality.

## General options

| Option                  | Description                                                                                             | Default                        | Usage                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------- |
| `-v`, `--verbosity`     | Sets the verbosity level of the log output                                                              | `INFO` (2)                     | `-v <level>` (e.g., `-v 2`) |
| `-V`, `--version`       | Shows validator-engine build information                                                                | N/A                            | `-V`                        |
| `-h`, `--help`          | Prints help information                                                                                 | N/A                            | `-h`                        |
| `-C`, `--global-config` | Specifies the file to read global configuration (bootstrap nodes, public liteservers, init blocks, etc) | N/A                            | `-C <file>`                 |
| `-c`, `--local-config`  | Specifies the file to read/write local node configuration (addresses, keys, etc)                        | N/A                            | `-c <file>`                 |
| `-I`, `--ip`            | Specifies the IP address and port of the instance. Used during the first run                            | N/A                            | `-I <ip:port>`              |
| `-D`, `--db`            | Specifies the root directory for the databases                                                          | N/A                            | `-D <path>`                 |
| `-f`, `--fift-dir`      | Specifies the directory with Fift scripts                                                               | N/A                            | `-f <path>`                 |
| `-d`, `--daemonize`     | Daemonizes the process by closing standard input and creating a new session                             | Disabled                       | `-d`                        |
| `-l`, `--logname`       | Specifies the log file to write logs                                                                    | N/A                            | `-l <file>`                 |
| `-s`, `--state-ttl`     | Sets the TTL (time-to-live) for the state in seconds                                                    | `86400` seconds (1 day)        | `-s <seconds>`              |
| `-m`, `--mempool-num`   | Specifies the maximum number of external messages in the mempool                                        | Unlimited                      | `-m <number>`               |
| `-b`, `--block-ttl`     | Sets the TTL for blocks in seconds.                                                                     | `86400` seconds (1 day)        | `-b <seconds>`              |
| `-A`, `--archive-ttl`   | Sets the TTL for archived blocks in seconds                                                             | `604800` seconds (7 days)      | `-A <seconds>`              |
| `-K`, `--key-proof-ttl` | Sets the TTL for key blocks in seconds.                                                                 | `315360000` seconds (10 years) | `-K <seconds>`              |
| `-S`, `--sync-before`   | During initial sync, download all blocks for the last given number of seconds                           | `3600` seconds (1 hour)        | `-S <seconds>`              |
| `-t`, `--threads`       | Specifies the number of threads to use                                                                  | `7`                            | `-t <number>`               |
| `-u`, `--user`          | Changes the user running the process                                                                    | N/A                            | `-u <username>`             |

## Advanced options

| Option                            | Description                                                                                                                                                 | Default                | Usage                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| `--shutdown-at`                   | Schedules the validator to shut down at the given Unix timestamp.                                                                                           | N/A                    | `--shutdown-at <timestamp>`                  |
| `-T`, `--truncate-db`             | Truncates the database with the specified sequence number as the new top masterchain block sequence number                                                  | N/A                    | `-T <seqno>`                                 |
| `-U`, `--unsafe-catchain-restore` | Enables the slow and dangerous catchain recovery method                                                                                                     | Disabled               | `-U <catchain-seqno>`                        |
| `-F`, `--unsafe-catchain-rotate`  | Enables forceful and dangerous catchain rotation.                                                                                                           | Disabled               | `-F <block-seqno>:<catchain-seqno>:<height>` |
| `--celldb-compress-depth`         | Optimizes CellDb by storing cells of depth X with whole subtrees                                                                                            | `0` (disabled)         | `--celldb-compress-depth <depth>`            |
| `--max-archive-fd`                | Sets a limit on the number of open file descriptors in the archive manager. `0` for unlimited                                                               | `0` (unlimited)        | `--max-archive-fd <number>`                  |
| `--archive-preload-period`        | Preloads archive slices for the past X seconds on startup                                                                                                   | `0` seconds (disabled) | `--archive-preload-period <seconds>`         |
| `--enable-precompiled-smc`        | Enables execution of precompiled smart contracts (experimental)                                                                                             | Disabled               | `--enable-precompiled-smc`                   |
| `--disable-rocksdb-stats`         | Disables the gathering of RocksDb statistics                                                                                                                | Enabled                | `--disable-rocksdb-stats`                    |
| `--nonfinal-ls`                   | Enables special local state (LS) queries to non-finalized blocks                                                                                            | Disabled               | `--nonfinal-ls`                              |
| `--celldb-cache-size`             | Sets the block cache size for RocksDb in CellDb, in bytes                                                                                                   | `1G` (1 Gigabyte)      | `--celldb-cache-size <size>`                 |
| `--celldb-direct-io`              | Enables direct I/O mode for RocksDb in CellDb (only applies when cache size is >= 30G)                                                                      | Disabled               | `--celldb-direct-io`                         |
| `--celldb-preload-all`            | Preloads all cells from CellDb on startup                                                                                                                   | Disabled               | `--celldb-preload-all`                       |
| `--celldb-in-memory`              | Stores the whole celldb in memory. For validators with default settings, size of `celldb` ~80-100GB, so 128 Gb is absolutely necessary and 256 is preferred | Disabled               | `--celldb-in-memory`                         |
| `--catchain-max-block-delay`      | Sets the delay before creating a new catchain block, in seconds                                                                                             | `0.4` seconds          | `--catchain-max-block-delay <seconds>`       |
| `--catchain-max-block-delay-slow` | Sets the maximum extended catchain block delay for too long rounds, in seconds                                                                              | `1.0` seconds          | `--catchain-max-block-delay-slow <seconds>`  |
| `--fast-state-serializer`         | Enables a faster persistent state serializer, requires more RAM                                                                                             | Disabled               | `--fast-state-serializer`                    |

## Session logs options

| Option           | Description                                         | Default                   | Usage                   |
| ---------------- | --------------------------------------------------- | ------------------------- | ----------------------- |
| `--session-logs` | Specifies the file for validator session statistics | `{logname}.session-stats` | `--session-logs <file>` |

<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/node-types.mdx
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/node-types.mdx
================================================
import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# TON node types

**A blockchain node** is a device, usually a computer, that runs the TON blockchain's software and participates in blockchain operations. In general, nodes ensure the decentralization of the TON network.

Nodes perform different functions within the TON protocol:

- **Full** and **archive nodes** maintain the blockchain block and transaction history, enable users and client applications to look for blocks and transactions, and send new transactions into the blockchain;
- **Validator nodes** verify transactions, ensuring blockchain security.

Below, you find more detailed information about each node type and the interaction of full and archive nodes with client applications.

## Full node

**The full node** is a basic node type within the TON blockchain. It serves as the backbone of the TON blockchain by keeping its block history—in other words, its _current state_.

Compared to **archive nodes**, full nodes keep only the latest part of the blockchain state, which is vital for ensuring client applications' network stability and operation. Full nodes _prune_ the state of the TON blockchain they keep. This means the full node automatically removes earlier blocks that become unnecessary for the network to manage its data volume effectively.

To allow client applications to look for blocks and transactions and send new transactions into the TON blockchain, full nodes are equipped with the liteserver functionality: see [Interacting with TON nodes](#interacting-with-ton-nodes) below.

<Button href="/v3/guidelines/nodes/running-nodes/full-node#run-a-node-video"
        colorType="primary" sizeType={'sm'}>

  Running a full node

</Button>


## Archive node

The archive node is a full node that keeps the entire block history of the TON blockchain. These nodes act as the decentralized point of truth to ensure consistency of the whole blockchain history. They are a backend for blockchain explorers and other applications relying on deep transaction history.

Archive nodes do not prune the blockchain state, elevating system requirements, especially in storage. According to the latest estimations, while full and validator nodes require about 1 TB of disk space, archive nodes need about 12 TB to store the complete block history.

<Button href="/v3/guidelines/nodes/running-nodes/archive-node"
        colorType="primary" sizeType={'sm'}>

  Running an archive node

</Button>


## Validator node

**Validator nodes** or **validators** are the TON network participants who propose new blocks and verify transactions according to the TON's _Proof-of-stake_ mechanism. In this way, validators contribute to the overall blockchain security.

Validators get [rewards in TON](/v3/documentation/infra/nodes/validation/staking-incentives/) for successful participation in the validation process.

To be entitled to propose and validate blocks, other participants elect validators based on the amount of TON they hold—in other words, their _stake_. The more TON a validator stakes, the higher its chances of being elected, validating blocks for the network, and earning rewards. As a rule, validator operators motivate other TON holders to stake with them to get passive income from the resulting rewards. In this way, validators ensure network stability and security and contribute to its growth.

<Button href="/v3/guidelines/nodes/running-nodes/validator-node"
        colorType="primary" sizeType={'sm'}>

  Running a validator node

</Button>


## Interacting with TON nodes

TON nodes can run in **liteserver mode**, which allows lite clients (external applications) to interact with the TON blockchain. In this mode, the nodes process requests from lite clients, enabling them to access blockchain data, send transactions, and retrieve information about blocks and transactions—for instance, to fetch and update wallet balances.

Full and archive nodes typically enable liteserver mode because they store blockchain history and handle external requests. In contrast, validator nodes do not need it as they focus on validating new blocks efficiently without extra workload from external queries.

You have two options to allow your lite client application to interact with the TON blockchain:

1. To have a stable connection, you can run your own full or archive node with a liteserver mode enabled in your node configuration file.
2. If you cannot set up your TON node with a liteserver, you can use the mesh of public liteservers provided by the TON Foundation. For this purpose, use the following configuration files:
 - [Public liteserver configurations - Mainnet](https://ton.org/global-config.json)
 - [Public liteserver configurations - Testnet](https://ton.org/testnet-global.config.json)



:::caution Usage of public liteservers in production
Because of a permanent high load on public liteservers, most of them are rate-limited, so it is not recommended that they be used in production.
This may cause instability in your lite client application.
:::

<Button href="/v3/guidelines/nodes/running-nodes/liteserver-node"
colorType="primary" sizeType={'sm'}>
Enable liteserver in your node
</Button>

To interact with liteservers, you can use the following tools:

- TON [ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis/), the lowest-level method for communicating with the blockchain;
- TON [SDKs](/v3/guidelines/dapps/apis-sdks/sdk/), which are available for various programming languages;
- TON [HTTP-based APIs](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/) that provide REST API middleware between your application and a liteserver.


<Button href="/v3/guidelines/dapps/apis-sdks/sdk"
colorType="primary" sizeType={'sm'}>
Choose a TON SDK
</Button>


<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/validation/collators.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/validation/collators.md
================================================
import Feedback from '@site/src/components/Feedback';

# Accelerator update

:::caution in development
This feature is currently available only on the Testnet! Participate at your own risk.
:::

The key feature of the TON Blockchain is the ability to distribute transaction processing over network nodes, switching from **everybody checks all transactions** to **every transaction is checked by a secure validator subset**. This ability to infinitely horizontally scale throughput over shards when one work chain splits to the required number of shard chains distinguishes TON from other L1 networks.

However, it is necessary to rotate validator subsets regularly, which process one or another shard, to prevent collusion. At the same time, to process transactions, validators obviously should know the state of the shard prior to the transaction. The simplest approach is to require all validators to know the state of all shards.

This approach works well when the number of TON users is within the range of a few million and TPS (transactions per second) is under a hundred. However, in the future, when TON Blockchain processes many thousands of transactions per second for hundreds of millions or billions of people, no single server will be able to keep the actual state of the whole network. Fortunately, TON was designed with such loads in mind and supports sharding both throughput and state updates.

# Accelerator

**Accelerator** is an upcoming update designed to improve blockchain scalability. Its main features are:

*  **Partial nodes**: A node will be able to monitor specific shards of the blockchain instead of the entire set of shards.

*  **Liteserver infrastructure**: Liteserver operators will be able to configure each LS to monitor a set of shards, and lite-clients will select a suitable LS for each request.

*  **Collator/validator separation**: Validators will only monitor MasterChain, significantly reducing their load.

Validator will use new **collator nodes** to collate new shard blocks.

The accelerator update is currently partially implemented in Testnet.

Testnet nodes can be configured to monitor a subset of shards, and lite clients can be set up to such partial liteservers.

Collator-validator separation has not yet been deployed in Testnet. However, you can test some parts of it by launching your own collator nodes.

# Partial nodes

Previously, each TON node was required to download all shards of the TON blockchain, which limited scalability.

To address this issue, the main feature of the update allows nodes to monitor only a subset of shards.

A node **monitors** a shard by maintaining its **shard state** and downloading all new blocks within that shard. Notably, each node always monitors the MasterChain.

The BaseChain includes a parameter called `monitor_min_split` in `ConfigParam 12`, which is set to `2` in the Testnet. This parameter divides the BaseChain into `2^monitor_min_split = 4` groups of shards:

- Shards with the prefix `0:2000000000000000`
- Shards with the prefix `0:6000000000000000`
- Shards with the prefix `0:a000000000000000`
- Shards with the prefix `0:e000000000000000`

Nodes can only monitor an entire group of shards at once. For instance, a node can choose to monitor all shards with the prefix `0:2000000000000000` but cannot selectively monitor just `0:1000000000000000` without also including `0:3000000000000000`. 

It is guaranteed that shards from different groups will not merge. This guarantees that a monitored shard will not unexpectedly merge with a non-monitored shard.

## Node configuration

To update your node to the latest commit of the `testnet` branch, follow these instructions:

* By default, a node monitors all shards. You can disable this behavior by adding the `-M` flag to the `validator-engine`.

* When you use the `-M` flag, the node will only monitor the MasterChain. If you want to monitor specific BaseChain shards, use the `--add-shard <wc:shard>` flag. For example:

	```
	validator-engine ... -M --add-shard 0:2000000000000000 --add-shard 0:e000000000000000
	```

* These flags will configure the node to monitor all shards with the prefixes `0:2000000000000000` and `0:e000000000000000`. You can either add these flags to an existing node or launch a new node with them included.

#### Notes:

1. **DO NOT** add these flags to a node that is participating in validation. Currently, validators are required to monitor all shards; this will be improved in future updates so that they only monitor the MasterChain.

2. If you use the `-M` flag, the node will begin downloading any missing shards, which may take some time. This is also true if you add new shards later using the `--add-shard` flag.

3. The command `--add-shard 0:0800000000000000` will add the entire shard group associated with the prefix `0:2000000000000000` due to the `monitor_min_split` configuration.

### Low-level configuration
`--add-shard` flag is a shorthand for certain validator console commands.
A node stores a list of shards to monitor in the config (see file `db/config.json`, section `shards_to_monitor`).
This list can be modified using `validator-engine-console`:
```
add-shard <wc>:<shard>
del-shard <wc>:<shard>
```
The `--add-shard X` flag is equivalent to the `add-shard X` command.

## Lite client configuration

If you have multiple liteservers, each configured to monitor certain shards, you can list them in the `liteservers_v2` section of the global config.

See the example:
```json
{
  "liteservers_v2": [
    {
      "ip": 123456789, "port": 10001,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 2305843009213693952 },
            { "workchain": 0, "shard": -6917529027641081856 }
          ]
        }
      ]
    },
    {
      "ip": 987654321, "port": 10002,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 6917529027641081856 },
            { "workchain": 0, "shard": -2305843009213693952 }
          ]
        }
      ]
    }
  ],
  "validator": "...",
  "dht": "..."
}
```

This config includes two liteservers:
* The first one monitors shards with prefixes `0:2000000000000000` and `0:a000000000000000`.
* The second one monitors shards with prefixes `0:6000000000000000` and `0:e000000000000000`.

Both liteservers monitor MasterChain, so it is not necessary to include MasterChain explicitly in the configuration.

#### Note:

* To obtain the value for `"shard": 6917529027641081856`, convert the shard ID in hexadecimal (`6000000000000000`) to decimal within the range of `[-2^63, 2^63)`.

* Both `lite-client` and `tonlib` support this new global configuration format. Clients select the appropriate liteserver for each request based on its shard.

## Proxy liteserver

**Proxy Liteserver** is a server designed to accept standard liteserver queries and forward them to other liteservers.

Its main purpose is to create a single liteserver that functions as a liteserver (LS) for all shards while distributing incoming queries to the appropriate child liteservers behind the scenes. This setup eliminates the need for clients to maintain multiple TCP connections for different shards and enables older clients to interact with sharded liteservers through the proxy.

**Usage:**
```
proxy-liteserver -p <tcp-port> -C global-config.json --db db-dir/ --logname ls.log
```
List all child liteservers in the global config. These can be partial liteservers, as shown in the example above.

To use the proxy liteserver in clients, create a new global config with this proxy in `liteservers` section. See `db-dir/config.json`:
```json
{
   "@type" : "proxyLiteserver.config",
   "port" : 10005,
   "id" : {
      "@type" : "pub.ed25519",
      "key" : "..."
   }
}
```

This file contains the port and public key for the proxy liteserver. You can copy these details to the new global configuration.

The key is generated upon the first launch and remains unchanged after any restarts.

If you need to use an existing private key, place the private key file in `db-dir/keyring/<key-hash-hex>` and launch `proxy-liteserver` with the `--adnl-id <key-hash-hex>` flag.

# Collator/validator separation

Currently, Testnet and Mainnet validators function as follows:

- All validators monitor all shards.
  
- For each shard, a **validator group** is randomly selected to generate and validate new blocks.

- Within this validator group, validators **collate** (generate) new block candidates one by one, while other validators **validate** and sign them.

Changes introduced in the accelerator update are as follows:

- Validators will monitor only the MasterChain, significantly reducing their workload (this feature is not yet enabled in Testnet).

- The process for selecting validator groups and signing blocks remains unchanged.

- MasterChain validators will continue to collate and validate blocks as before.

- The collation of a shard block requires monitoring the shard. To address this, a new type of node called **collator node** is introduced. Shard validators will send requests to collator nodes to generate block candidates.

- Validators will still validate blocks themselves. Collators will attach **collated data** (proof of shard state) to blocks, allowing for validation without the need to monitor the shard.

In the current `testnet` branch, validators must still monitor all shards. However, you can experiment with launching collator nodes and configuring your validators to collate through them.

## Launching a collator node

Firstly, update your node to the [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

To configure a collator node, use the following commands in the `validator-engine-console`:

```
new-key
add-adnl <key-id-hex> 0
add-collator <key-id-hex> <wc>:<shard>
```

The `new-key` and `add-adnl` commands create a new ADNL address, while `add-collator` starts a collator node for the specified shard using this ADNL address.

A collator for shard `X` can create blocks for all shards that are either ancestors or descendants of `X`. However, collator nodes cannot create blocks for the MasterChain; they are limited to the BaseChain.

In a simple scenario, you can use a node that monitors all shards and launch a collator for all of them by running: `add-collator <key-id-hex> 0:8000000000000000`.

Alternatively, you can launch a partial node that monitors and collates only a subset of shards. For example, to launch a node with flags `-M --add-shard 0:2000000000000000`, you would start the collator with the command `add-collator <key-id-hex> 0:2000000000000000`. This collator will generate blocks in the designated group of shards.

#### Notes:

- A collator node generates blocks automatically, even without requests from validators.

- A collator node configured to generate blocks for a specific shard does not need to monitor other shards. However, it does require access to outbound message queues from neighboring shard states for collation. This is accomplished by downloading these message queues from other nodes that monitor the relevant shards.

## Configuring a validator

Update your validator to [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

By default, validators collate all blocks themselves. To use collator nodes, create a **collators list** and provide it to the validator using `validator-engine-console`:
* `set-collators-list <filename>` installs a new list of collators.
* `clear-collators-list` resets the validator to the default behavior.
* `show-collators-list` displays the current list.

The **collators list** is a JSON file. It contains a list of collator node ADNL ids for each shard.

### Example 1: collators for all shards
```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": -9223372036854775808 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" },
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    }
  ]
}
```
This list contains two collators that can generate blocks in all shards in BaseChain (`shard_id` is `0:8000000000000000`).

When the validator needs to generate a shard block, it randomly selects one of the collators to send the request.

`"self_collate": true` means that if all collators are offline then the validator will collate the block on its own. It is recommended to use this option for testing, since validators are still able to generate shard blocks.

### Example 2: partial collators
```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": 4611686018427387904 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -6917529027641081856 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -2305843009213693952 },
      "self_collate": true,
      "select_mode": "random",
      "collators": []
    }
  ]
}
```

This list has one collator for prefix `0:4000000000000000`, one collator for prefix `0:a000000000000000` and no collators for `0:e000000000000000`. `self_collate` is `true`, so the validator will collate on its own if no collators for the shard are online.

### Formal protocol for selecting the collator

The **collators list** contains a list `shards`. Each entry has the following parameters: `shard_id`, `select_mode`, `self_collate`, `collators`. 

To generate a block in shard `X`, the validator does the following:
* If `X` is MasterChain then the validator generates the block itself.
* Take the first entry from `shards` where `shard_id` intersects with `X`.
* Validator periodically pings collators from the list to determine which ones are online and ready to respond.
* Choose an online collator from the `collators` list. `select_mode` determines the selection method:
  * `random`: random online collator.
  * `ordered`: the first from the list (skipping offline collators).
  * `round_robin`: select collators sequentially (skipping offline collators).
* Send a request to the selected collator.
* If all collators are offline and `self_collate` is `true` then the validator generates the block itself.

### Collation manager stats
Command `collation-manager-stats` in `validator-engine-console` displays the status of collators: which collators are currently used and which are online.

## Collator whitelist

By default, the collator node accepts requests from any validator.

You can enable whitelist to allow requests only from certain validators using `validator-engine-console`:
* `collator-whitelist-enable 1` enables the whitelist.
* `collator-whitelist-enable 0` disables the whitelist.
* `collator-whitelist-add <validator-adnl-id-hex>` adds a validator to the whitelist.
* `collator-whitelist-del <validator-adnl-id-hex>` removes a validator from the whitelist.

# Full collated data
By default validators proposing new block in validator set do not attach data that proves "prior to block" state. This data should be obtained by other validators from locally stored state. That way old (from master branch) and new nodes may reach consensus, but new validators should keep eye on all network state.

Once [ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49) capabilities in network configuration parameter 8 will be enabled `collated_data` will be included into blocks and validators will be able to get rid of monitoring anything except masterchain: incoming data will be enough to fully check correctness of the block.

# Next steps

Developers are planning to implement the following features:

- Add comprehensive and user-friendly support for validation using collators in MyTonCtrl.

- Optimize the size of `collated_data`: Although it currently functions well for most blocks, some transactions can lead to excessive data usage.

- Enable broadcasting of `collated_data`.

- Provide support in MyTonCtrl for automatic payments for collation to establish a market for collation and enhance its durability.

<Feedback />




================================================
FILE: docs/v3/documentation/infra/nodes/validation/staking-incentives.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/infra/nodes/validation/staking-incentives.md
================================================
import Feedback from '@site/src/components/Feedback';

# Staking incentives

## Election and staking

TON Blockchain uses the **Proof-of-stake (PoS)** consensus algorithm, meaning that, like all PoS networks, a set of network validators maintains the network's security and stability. In particular, validators propose candidates for new blocks (made up of transaction batches), while other validators _validate_ and approve them via digital signatures.

Validators are chosen using a special [Elector governance contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector). During each consensus round, validator candidates send an application for election along with their stake and desired _max_factor_ (a parameter that regulates the amount of maintenance the validator performs per consensus round).

During the validator election process, the governance smart contract chooses the next round of validators and assigns a voting weight to each validator to maximize their total stake while also considering the validator’s stake and _max_factor_. In this respect, the higher the stake and _max_factor_, the higher the voting weight of the validator, and vice versa.

Elected validators are selected to secure the network by participating in the next consensus round. However, to achieve horizontal scalability, each validator verifies only a portion of the network, unlike many other blockchains:

Each ShardChain and MasterChain has a dedicated set of validators. Sets of master chain validators consist of up to 100 validators exhibiting the highest voting weight (defined as Network Parameter `Config16:max_main_validators`).

Each ShardChain is validated by 23 validators, as defined by Network Parameter `Config28:shard_validators_num`. These validators are rotated randomly every 1000 seconds according to Network Parameter `Config28:shard_validators_lifetime`.

## Values of stakes: max effective stake

The current `max_factor` in config is __3__, meaning the stake of the _smallest_ validator cannot be more than three times less than the stake of the **largest** one.

The formula with the config parameters:

`max_factor` = [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### Selection algorithm review

This algorithm, run by the [Elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector), selects the best validator candidates based on the stake they have committed. Here's a breakdown of how it works:

1. **Initial selection**: Elector considers all candidates who have staked more than a set minimum amount (300K, as specified in the [configuration](https://tonviewer.com/config#17)).

2. **Ordering candidates**: These candidates are then arranged from highest to lowest based on their stake.

3. **Narrowing down**:

- If the number of candidates exceeds the maximum allowed number of validators ([see configuration](https://tonviewer.com/config#16)), those with the lowest stakes are excluded.

- The Elector then evaluates each potential group of candidates, starting from the largest group and moving to smaller ones:

	- It examines the top candidates in the ordered list, increasing the number one by one.

	- For each candidate, Elector calculates their **effective stake**. If a candidate's stake is significantly higher than the minimum, it's adjusted down (e.g., if someone staked 310k and the minimum is 100k, but there's a rule capping at three times the minimum, their effective stake is considered as 300k).

	- It sums up the effective stakes of all candidates in this group.

4. **Final selection**: The elector chooses the group of candidates with the highest total effective stake as the validators.

#### Validator selection algorithm

Based on the available stakes of potential validators, optimal values for the minimum and maximum stake are determined, with the aim of maximizing the magnitude of the total stake:

1. Elector takes all applicants who have a stake higher than the minimum ([300K in config](https://tonviewer.com/config#17)).

2. Elector sorts them in _descending_ order of stake.

3. If there are more participants than the [maximum number](https://tonviewer.com/config#16) of validators, Elector discards the tail of the list. Then Elector does the following:

	* For each cycle __i__ from _1 to N_ (the remaining number of participants), it takes the first __i__ applications from the sorted list.

	* It calculates the effective stake, considering the `max_factor`. That is, if a person has put in 310k, but with a `max_factor` of 3, and the minimum stake in the list is 100k Toncoins, then the effective stake will be min(310k, 3*100k) = 300k. One validator node may use up to 600k TON (in this example) in two rounds (half in odd rounds, half in even rounds). To increase the stake, it is necessary to set up multiple validator nodes.

	* It calculates the total effective stake of all __i__ participants.

Once Elector identifies such an __i__, where the total effective stake is maximized, we declare these __i__ participants as validators.

## Positive incentives

Similarly to all blockchain networks, each transaction on TON requires a computation fee called [gas](https://blog.ton.org/what-is-blockchain) to store the network and process the transaction on-chain. On TON, these fees are accumulated within the Elector contract in a reward pool.

The network also provides a subsidy for block creation by adding an amount of 1.7 TON to the reward pool for each MasterChain block and an amount equal to 1 TON for each BaseChain block (refer to Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). It is important to note that when a BaseChain is divided into multiple ShardChains, the subsidy for each ShardChain block is distributed accordingly. This approach helps maintain a consistent subsidy per unit of time.

:::info
In June 2023, the [Deflationary Burn Mechanism](https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism) was introduced. With this mechanism, a portion of the TON generated by the network is burned instead of being allocated to the rewards pool.
:::

After a validation cycle lasting 65536 seconds, or approximately 18 hours (as determined by the network parameter `Config15:validators_elected_for`), staked TON is not immediately released by each validator. Instead, it is held for an additional 32768 seconds, or about 9 hours (as specified by the network parameter `Config15:stake_held_for`). During this period, slashing penalties can be imposed on the validator as a consequence for any misbehavior. Once the funds are released, validators can withdraw their staked amount along with a share of the rewards accrued during the validation round, proportional to their voting **weight**.

As of April 2023, the total reward pool per consensus round for all validators on the network is approximately 40,000 TON, with the average reward per validator being ~ 120 TON (the maximum difference between voting weight and the accrued rewards is ~3 TON).

The total supply of Toncoin (5 billion TON) has an inflation rate of approximately 0.3-0.6% annually.

This inflation rate, however, is not always constant and may deviate depending on the network’s current state. Eventually, it will tend to deflate after the Deflation mechanism is activated and network utilization grows.

:::info
Learn current TON Blockchain stats [here](https://tontech.io/stats/).
:::

## Negative incentives

On TON Blockchain, there are generally two ways validators can be penalized for misbehaving: **idle** and **malicious** misbehaving. Both are prohibited and may result in fines (in a process called slashing) for their actions.

If a validator fails to participate in block creation and transaction signing for a significant period during a validation round, they may incur a fine based on the **Standard fine** parameter. As of April 2023, the Standard fine that can be accrued is 101 TON (Network Parameter `ConfigParam40:MisbehaviorPunishmentConfig`).

On the TON network, slashing penalties—also known as fines imposed on validators—allow any participant to file a complaint if they suspect a validator is misbehaving. When submitting a complaint, the participant must provide cryptographic evidence of the alleged misbehavior for submission to the Electors. 

During the `stake_held_for` dispute resolution period, all validators on the network assess the validity of the complaints and vote on whether to pursue each complaint collectively. They also evaluate the legitimacy of the provided evidence and determine the appropriate penalties.

If, based on weighted votes, at least 66% of the validators approve the complaint, the slashing penalty is applied. This penalty is deducted from the offending validator's total stake. Typically, the process of penalization and resolution of complaints is managed automatically using MyTonCtrl.

## Decentralized system of penalties

:::info
The following system of penalizing poorly performing validators was fully operational on September 9, 2024.
:::

### Determination of poor work

The TON is supplied with the [lite-client](https://github.com/newton-blockchain/ton/tree/master/lite-client) utility. In lite-client, there is a `checkloadall` command.

This command analyses the number of blocks the validator should have processed and the number it actually processed in a given period of time.

If the validator processed less than 90% of the expected number of blocks during a validation round, it is considered to be performing poorly and should be penalized.

:::info
Learn more about the technical description of the process [here](https://github.com/ton-blockchain/TIPs/issues/13#issuecomment-786627474)
:::

### Complain workflow

- Anyone can make a complaint and get a reward for the right complaint.

- Validation of complaints maintained by Validators and fully decentralized.

#### Make complaint

After each validation round (~18 hours), the validator stakes of the validators who participated in that round remain on the Elector smart contract for another ~9 hours.

During this time, anyone can send a complaint against a validator who performed poorly in said round. This happens on-chain on the Elector smart contract.

#### Validation of complaint

After each validation round, validators receive a list of complaints from the Elector smart contract. They then double-check these complaints by calling `checkloadall`.

If a complaint is validated, a vote is conducted on-chain in favor of that complaint.

These actions are integrated into MyTonCtrl and occur automatically.

When a complaint receives 66% of the validators' votes (weighted by their stake), the validator's stake is penalized.

No one has the authority to impose a fine on their own.

The list of penalized validators for each round is available at [@tonstatus_notifications](https://t.me/tonstatus_notifications).

### Fine value

The amount of the fine is fixed and equals 101 TON(Network Parameter `ConfigParam40:MisbehaviourPunishmentConfig`), which is roughly equal to the validator's income per round.

The value of the fine may change due to the rapidly growing audience and the number of transactions in TON, and it is vital that the quality of work is at its best.

### Fine distribution

The fine is distributed among the validators minus network costs, and a small reward (~8 TON) is given to the first complainer who sends the correct complaint to the Elector.

### Validator guidelines

To prevent your Validator node from being fined, it is advisable to ensure that the hardware, monitoring, and validator operations are set up properly.

Please ensure you comply with the [validator maintain guidelines](/v3/guidelines/nodes/running-nodes/validator-node#maintain-guidelines).

If you don't want to do this please consider [using staking services](https://ton.org/stake).

## See also

* [Running a validator](/v3/guidelines/nodes/running-nodes/validator-node)
* [Transaction fees](/v3/documentation/smart-contracts/transaction-fees/fees)
* [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)

<Feedback />




================================================
FILE: docs/v3/documentation/network/configs/blockchain-configs.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/configs/blockchain-configs.md
================================================
import Feedback from '@site/src/components/Feedback';

# Config parameters

:::info
You can view live values by using [Tonviewer](https://tonviewer.com/config).
:::

## Introduction

This page provides a description of the configuration parameters used in the TON Blockchain.

TON features a complex configuration consisting of many technical parameters, some of which are utilized by the blockchain itself, while others serve the ecosystem. However, only a limited number of individuals fully understand the significance of these parameters. This article aims to offer users a straightforward explanation of each parameter and its purpose.

## Prerequisites

This material should be read alongside the parameter list. 

You can view the parameter values in the [current configuration](https://explorer.toncoin.org/config), and the method of writing them into [cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) is outlined in the [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) file in [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) format.

:::info
The binary encoding found at the end of the TON Blockchain parameter represents a serialized binary format of its configuration. This allows for efficient storage and transmission of the configuration data. The specific details of the serialization process vary depending on the encoding scheme utilized by the TON Blockchain.
:::

All parameters are in place, and you won't get lost. For your convenience, please use the right sidebar for quick navigation.

## Param 0

This parameter is the address of a special smart contract that stores the blockchain's configuration. The configuration is stored in the contract to simplify its loading and modification during validator voting.

:::info
In the configuration parameter, only the hash portion of the address is recorded, as the contract always resides in the [MasterChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) (WorkChain -1). Therefore, the full address of the contract will be written as `-1:<value of the configuration parameter>`.
:::

## Param 1

This parameter is the address of the [elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector), responsible for appointing validators, distributing rewards, and voting on changes to blockchain parameters.

## Param 2

This parameter represents the address of the system, on behalf of which new Toncoins are minted and sent as rewards for validating the blockchain.

:::info
If the parameter 2 is missing, the parameter 0 is used instead (newly minted Toncoins come from the configuration smart contract).
:::

## Param 3

This parameter is the address of the transaction fee collector.

:::info
If the this parameter is missing (for the time being), transaction fees are directed to the elector smart contract (parameter 1).
:::

## Param 4

This parameter is the address of the root DNS contract of the TON network.

:::info
More detailed information, please see the [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns) documentation and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).

This contract is not responsible for selling **.ton** domains.
:::

## Param 6

This parameter is responsible for minting fees of new currencies.

:::info
Currently, the minting of additional currency is not implemented and does not function. The implementation and launch of the minter are planned for the future.

You can learn more about the issues and prospects in the [relevant documentation](/v3/documentation/infra/minter-flow).
:::

## Param 7

This parameter stores the volume of each additional currency in circulation. The data is organized as a dictionary (also referred to as a **hashmap**, although this name may be a typo during the TON Blockchain's development). The structure uses the format `extracurrency_id -> amount`, where the amount is represented as a `VarUint 32`, which is an integer ranging from `0` to `2^248`.

## Param 8

This parameter indicates the network version and additional capabilities supported by the validators.

:::info
Validators are nodes in the TON Blockchain network that are responsible for creating new blocks and verifying transactions.
:::

-  `version`: This field specifies the version.

-  `capabilities`: This field is a set of flags that are used to indicate the presence or absence of certain features or capabilities.

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON Blockchain network can be updated without downtime.

## Param 9

This parameter contains a list (binary tree) of mandatory parameters. It ensures that certain configuration parameters are always present and cannot be removed by a proposal to change the configuration until parameter 9 changes.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters whose change significantly affects the network, so more voting rounds are held.

## Param 11

This parameter indicates under what conditions proposals to change the TON configuration are accepted.

-  `min_tot_rounds`: The minimum number of rounds before a proposal can be applied

-  `max_tot_rounds`: The maximum number of rounds, upon reaching which the proposal will automatically be rejected

-  `min_wins`: The required number of wins (3/4 of validators by the sum of the pledge must vote in favor)

-  `max_losses`: The maximum number of losses, upon reaching which the proposal will automatically be rejected

-  `min_store_sec` and `max_store_sec` determine the possible time interval during which the proposal will be stored

-  `bit_price` and `cell_price` indicate the price of storing one bit or one cell of the proposal

## Param 12

This parameter represents the configuration of a WorkChain in the TON Blockchain. WorkChains are designed as independent blockchains that can operate in parallel, allowing TON to scale and process a large number of transactions and smart contracts.

### WorkChain configuration parameters

-  `enabled_since`: A UNIX timestamp of the moment this WorkChain was enabled.

-  `actual_min_split`: The minimum depth of the split (sharding) of this WorkChain, supported by validators.

-  `min_split`: The minimum depth of the split of this WorkChain, set by the configuration.

-  `max_split`: The maximum depth of the split of this WorkChain.

-  `basic`: A boolean flag (1 for true, 0 for false) indicating whether this WorkChain is basic (handles TON coins, smart contracts based on the TON Virtual Machine).

-  `active`: A boolean flag indicating whether this WorkChain is active at the moment.

-  `accept_msgs`: A boolean flag indicating whether this WorkChain is accepting messages at the moment.

-  `flags`: Additional flags for the WorkChain (reserved, currently always 0).

-  `zerostate_root_hash` and `zerostate_file_hash`: Hashes of the first block of the WorkChain.

-  `version`: Version of the WorkChain.

-  `format`: The format of the WorkChain, which includes `vm_version` and `vm_mode` - the virtual machine used there.

## Param 13

This parameter defines the cost of filing complaints about incorrect operation of validators in the [elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector).

## Param 14

This parameter indicates the reward for creating a block in the TON Blockchain. Nanograms represent nanoToncoins. Therefore, the reward for block creation in the MasterChain is 1.7 Toncoins, while in the basic WorkChain, it is 1.0 Toncoins. In the event of a WorkChain split, the block reward is also divided: if there are two ShardChains within the WorkChain, then the reward for each shard block will be 0.5 Toncoins.

## Param 15

This parameter contains the duration of different stages of elections and validators' work in the TON Blockchain.

For each validation period, there is an `election_id` equal to the UNIX-format time at the start of the validation.

You can get the current `election_id` (if elections are ongoing) or the past one by invoking the elector smart contract's respective get-methods `active_election_id` and `past_election_ids`.

### WorkChain configuration parameters

-  `validators_elected_for`: The number of seconds the elected set of validators perform their role (one round).

-  `elections_start_before`: The seconds before the end of the current round the election process for the next period will start.

-  `elections_end_before`: The seconds before the end of the current round, the validators for the next round will be chosen.

-  `stake_held_for`: The period for which a validator's stake is held (for handling complaints) after the round expires.

:::info
Each value in the arguments is determined by the `uint32` data type.
:::

### Examples

In the TON Blockchain, validation periods are typically divided into **even** and **odd** rounds that alternate. Voting for the next round occurs during the previous one, so a validator must allocate their funds into two separate pools to participate in both rounds.

#### Mainnet

Current values:

```python
constants = {
    'validators_elected_for': 65536,  # 18.2 hours
    'elections_start_before': 32768,  # 9.1 hours
    'elections_end_before': 8192,     # 2.2 hours
    'stake_held_for': 32768           # 9.1 hours
}
```

Scheme:

![image](/img/docs/blockchain-configs/config15-mainnet.png)

#### How to calculate periods?

Let `election_id = validation_start = 1600032768`. Then:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Therefore, at this time, the length of one round of one parity is `1600131072 - 1600000000 = 131072 seconds = 36.40888... hours`

#### Testnet

Current values:

```python
constants = {
    'validators_elected_for': 7200,  # 2 hours
    'elections_start_before': 2400,  # 40 minutes
    'elections_end_before': 180,     # 3 minutes
    'stake_held_for': 900            # 15 minutes
}
```

Scheme:

![image](/img/docs/blockchain-configs/config15-testnet.png)

#### How to calculate periods?

Let `election_id = validation_start = 160002400`. Then:

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

Therefore, at this time, the length of one round of one parity is `160010500 - 1600000000 = 10500 seconds = 175 minutes = 2.91666... hours`

## Param 16

This parameter represents the limits on the number of validators in the TON Blockchain. It is directly used by the elector smart contract.

### Configuration parameters for the number of validators for elections

-  `max_validators`: This parameter represents the maximum number of validators that can participate in the network operation at any given time.

-  `max_main_validators`: This parameter represents the maximum number of masterchain validators.

-  `min_validators`: This parameter represents the minimum number of validators that must support the network operation.

#### Notes

* The maximum number of validators is greater than or equal to the maximum number of MasterChain validators.

* The maximum number of MasterChain validators must be greater than or equal to the minimum number of validators.

* The minimum number of validators must be no less than 1.

## Param 17

This parameter represents the stake parameters configuration in the TON Blockchain. In many blockchain systems, especially those using the Proof-of-Stake or Delegated Proof-of-Stake consensus algorithm, cryptocurrency owners native to the network can "stake" their tokens to become validators and earn rewards.

### Configuration parameters

-  `min_stake`: This parameter represents the minimum amount of Toncoins that an interested party needs to stake to participate in the validation process.

-  `max_stake`: This parameter represents the maximum amount of Toncoins that an interested party can stake.

-  `min_total_stake`: This parameter represents the minimum total amount of Toncoins that the chosen set of validators must hold.

-  `max_stake_factor`: This parameter is a multiplier indicating how many times the maximum effective stake (pledge) can exceed the minimum stake sent by any other validator.

:::info
Each value in the arguments is determined by the `uint32` data type.
:::

## Param 18

This parameter represents the configuration for determining the prices for data storage on the TON Blockchain. This serves as a measure to prevent spam and encourages network maintenance.

### Dictionary of storage fee parameters

-  `utime_since`: This parameter provides the initial Unix timestamp from which the specified prices apply.

-  `bit_price_ps` and `cell_price_ps`: These parameters represent the storage prices for one bit or one cell of information in the main WorkChains of the TON Blockchain for 65536 seconds

-  `mc_bit_price_ps` and `mc_cell_price_ps`: These parameters represent the prices for computational resources specifically in the TON MasterChain for 65536 seconds

:::info
`utime_since` accepts values in the `uint32` data type.

The rest accept values in the `uint64` data type.
:::

## Param 20 and 21

These parameters define the cost of computations in the TON network. The complexity of any computation is estimated in gas units.

-  `flat_gas_limit` and `flat_gas_price`: A certain starting amount of gas is provided at a price of `flat_gas_price` (to offset the costs of launching the TON Virtual Machine).

-  `gas_price`: This parameter reflects the price of gas in the network, in nanotons per 65536 gas units.

-  `gas_limit`: This parameter represents the maximum amount of gas that can be consumed per transaction.

-  `special_gas_limit`: This parameter represents the limit on the amount of gas that can be consumed per transaction of a special (system) contract.

-  `gas_credit`: This parameter represents a credit in gas units provided to transactions to check an external message.

-  `block_gas_limit`: This parameter represents the maximum amount of gas that can be consumed within a single block.

-  `freeze_due_limit` and `delete_due_limit`: Limits of accumulated storage fees (in nanoToncoin) at which a contract is frozen and deleted, respectively.

:::info
You can find more about `gas_credit` and other parameters in the section of external messages [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#external-messages).
:::

## Param 22 and 23

These parameters set limits on the block, upon reaching which the block is finalized and the callback of the remaining messages (if any) is carried over to the next block.

### Configuration parameters

-  `bytes`: This section sets the limits on the block size in bytes.

-  `underload`: Underload is a state when the shard realizes that there is no load and is inclined to merge if a neighboring shard is willing.

-  `soft_limit`: Soft limit - when this limit is reached, internal messages stop being processed.

-  `hard_limit`: Hard limit - this is the absolute maximum size.

-  `gas`: This section sets the limits on the amount of gas that a block can consume. Gas, in the context of blockchain, is an indicator of computational work. The limits on underload, soft and hard limits, work the same as for size in bytes.

-  `lt_delta`: This section sets the limits on the difference in logical time between the first and last transaction. Logical time is a concept used in the TON Blockchain for ordering events. The limits on underload, soft and hard limits, work the same as for size in bytes and gas.

:::info
If a shard has insufficient load and there is an intention to merge with a neighboring shard, the `soft_limit` indicates a threshold. When this threshold is exceeded, internal messages will stop being processed, while external messages will still be handled. External messages will continue to be processed until the total reaches a limit that is equal to half the sum of the `soft_limit` and `hard_limit`, or `(soft_limit + hard_limit) / 2`.
:::

## Param 24 and 25

Parameter 24 represents the configuration for the cost of sending messages in the MasterChain of the TON Blockchain.

Parameter 25 represents the configuration for the cost of sending messages in all other cases.

### Configuration parameters defining the costs of forwarding

-  `lump_price`: This parameter means the base price for forwarding a message, regardless of its size or complexity.

-  `bit_price`: This parameter represents the cost per bit of message forwarding.

-  `cell_price`: This parameter reflects the cost of forwarding a message per cell. A cell is the basic unit of data storage on the TON Blockchain.

-  `ihr_price_factor`: This is a factor used to calculate the cost of immediate hypercube routing (IHR).

:::info
IHR is a method of message delivery in the TON Blockchain network, where messages are sent directly to the recipient's ShardChain.
:::

-  `first_frac`: This parameter defines the fraction of the remaining remainder that will be used for the first transition along the message route.

-  `next_frac`: This parameter defines the fraction of the remaining remainder that will be used for subsequent transitions along the message route.

## Param 28

This parameter provides the configuration for the `Catchain` protocol in the TON Blockchain. `Catchain` is the lowest-level consensus protocol used in the TON to achieve agreement among validators.

### Configuration parameters

-  `flags`: A general field that can be used to set various binary parameters. In this case, it equals 0, which means that no specific flags are set.

-  `shuffle_mc_validators`: A Boolean value indicating whether to shuffle the masterchain validators or not. If this parameter is set to 1, the validators will be shuffled; otherwise, they will not.

-  `mc_catchain_lifetime`: The lifetime of MasterChain's `Catchain` groups in seconds.

-  `shard_catchain_lifetime`: The lifetime of ShardChain's `Catchain` groups in seconds.

-  `shard_validators_lifetime`: The lifetime of a ShardChain's validators group in seconds.

-  `shard_validators_num`: The number of validators in each ShardChain validation group.

## Param 29

This parameter provides the configuration for the consensus protocol above `Catchain` ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters

-  `flags`: A general field that can be used to set various binary parameters. In this case, it equals 0, which means that no specific flags are set.

-  `new_catchain_ids`: A Boolean value indicating whether to generate new `Catchain` identifiers. If this parameter is set to 1, new identifiers will be generated. In this case, it is assigned the value of 1, which means that new identifiers will be generated.

-  `round_candidates`: The number of candidates to be considered in each round of the consensus protocol. Here, it is set to 3.

-  `next_candidate_delay_ms`: The delay in milliseconds before the right to generate a block candidate passes to the next validator. Here, it is set to 2000 ms (2 seconds).

-  `consensus_timeout_ms`: The timeout for block consensus in milliseconds. Here, it is set to 16000 ms (16 seconds).

-  `fast_attempts`: The number of "fast" attempts to reach consensus. Here, it is set to 3.

-  `attempt_duration`: The duration of each attempt at agreement. Here, it is set to 8.

-  `catchain_max_deps`: The maximum number of dependencies of a Catchain block. Here, it is set to 4.

-  `max_block_bytes`: The maximum size of a block in bytes. Here, it is set to 2097152 bytes (2 MB).

-  `max_collated_bytes`: The maximum size of serialized block correctness proofs in bytes. Here, it is set to 2097152 bytes (2 MB).

-  `proto_version`: The protocol version. Here, it is set to 2.

-  `catchain_max_blocks_coeff`: The coefficient limiting the rate of block generation in `Catchain`, [description](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Here, it is set to 10000.

## Param 31

This parameter represents the configuration of smart contract addresses from which no fees are charged for either gas or storage and where **tick-tok** transactions can be created. The list usually includes governance contracts. The parameter is presented as a binary tree structure — a tree (HashMap 256), where the keys are a 256-bit representation of the address. Only addresses in the MasterChain can be present in this list.

## Param 32, 34 and 36

Lists of validators from the previous (32), current (34), and next (36) rounds. Parameter 36 is set from the end of the elections until the start of the round.

### Configuration parameters

-  `cur_validators`: This is the current list of validators. Validators are typically responsible for verifying transactions in a blockchain network.

-  `utime_since` and `utime_until`: These parameters provide the time period during which these validators are active.

-  `total` and `main`: These parameters provide the total number of validators and the number of validators validating the MasterChain in the network.

-  `total_weight`: This adds up the weights of the validators.

-  `list`: A list of validators in the tree format `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: These parameters provide details about each validator - their 256 addresses in the MasterChain, public key, weight, ADNL address (the address used at the network level of the TON).

## Param 40

This parameter defines the structure of the configuration for punishment for improper behavior (non-validation). In the absence of the parameter, the default fine size is 101 Toncoins.

### Configuration parameters

`MisbehaviourPunishmentConfig`: This data structure defines how improper behavior in the system is punished.

It contains several fields:

-  `default_flat_fine`: This part of the fine does not depend on the stake size.

-  `default_proportional_fine`: This part of the fine is proportional to the validator's stake size.

-  `severity_flat_mult`: This is the multiplier applied to the `default_flat_fine` value for significant violations by the validator.

-  `severity_proportional_mult`: This is the multiplier applied to the `default_proportional_fine` value for significant violations by the validator.

-  `unpunishable_interval`: This parameter represents the period during which offenders are not punished to eliminate temporary network problems or other anomalies.

-  `long_interval`, `long_flat_mult`, `long_proportional_mult`: These parameters define a "long" period of time and multipliers for flat and proportional fines for improper behavior.

-  `medium_interval`, `medium_flat_mult`, `medium_proportional_mult`: Similarly, they define a "medium" period of time and multipliers for flat and proportional fines for improper behavior.

## Param 43

This parameter relates to the size limits and other features of accounts and messages.

### Configuration parameters

-  `max_msg_bits`: Maximum message size in bits.

-  `max_msg_cells`: Maximum number of cells (a form of storage unit) a message can occupy.

-  `max_library_cells`: Maximum number of cells that can be used for library cells.

-  `max_vm_data_depth`: Maximum cell depth in messages and account state.

-  `max_ext_msg_size`: Maximum external message size in bits.

-  `max_ext_msg_depth`: Maximum external message depth. This could refer to the depth of the data structure within the message.

-  `max_acc_state_cells`: Maximum number of cells that an account state can occupy.

-  `max_acc_state_bits`: Maximum account state size in bits.

If absent, the default parameters are taken:

-  `max_size` = 65535

-  `max_depth` = 512

-  `max_msg_bits` = 1 \<\< 21

-  `max_msg_cells` = 1 \<\< 13

-  `max_library_cells` = 1000

-  `max_vm_data_depth` = 512

-  `max_acc_state_cells` = 1 \<\< 16

-  `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
You can view more details about the standard parameters [here](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379) in the source code.
:::

## Param 44

This parameter defines the list of suspended addresses, which cannot be initialized until `suspended_until`. It only applies to yet uninitiated accounts. This is a measure for stabilizing the tokenomics (limiting early miners). If not set - there are no limitations. Each address is represented as an end node in this tree, and the tree-like structure allows to effectively check the presence or absence of an address in the list.

:::info
The stabilization of the tokenomics is further described in the [official report](https://t.me/tonblockchain/178) of the **@tonblockchain** Telegram channel.
:::

## Param 45

The list of precompiled contracts is stored in the MasterChain config:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

More details about precompiled contracts are on [this page](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts).

## Param 71 - 73

This parameter pertains to bridges for wrapping Toncoins in other networks:

- ETH-TON **(71)**

- BSC-TON **(72)**

- Polygon-TON **(73)**

  

### Configuration parameters

-  `bridge_address`: This is the bridge contract address that accepts TON to issue wrapped Toncoins in other networks.

-  `oracle_multisig_address`: This is the bridge management wallet address. A multisig wallet is a type of digital wallet that requires signatures from multiple parties to authorize a transaction. It is often used to increase security. The oracles act as the parties.

-  `oracles`: List of oracles in the form of a tree `id->address`

-  `external_chain_address`: This is the bridge contract address in the corresponding external blockchain.

## Param 79, 81 and 82

This parameter relates to bridges for wrapping tokens from other networks into tokens on the TON network:

- ETH-TON **(79)**

- BSC-TON **(81)**

- Polygon-TON **(82)**

### Configuration parameters

-  `bridge_address` and `oracles_address`: These are the blockchain addresses of the bridge and the bridge management contract (oracles multisig), respectively.

-  `oracles`: List of oracles in the form of a tree `id->address`

-  `state_flags`: State flag. This parameter is responsible for enabling/disabling separate bridge functions.

-  `prices`: This parameter contains a list or dictionary of prices for different operations or fees associated with the bridge, such as `bridge_burn_fee`, `bridge_mint_fee`, `wallet_min_tons_for_storage`, `wallet_gas_consumption`, `minter_min_tons_for_storage`, `discover_gas_consumption`.

-  `external_chain_address`: The bridge contract address in another blockchain.

## Negative parameters

:::info
The distinction between negative and positive parameters lies in the necessity for validators to verify them; negative parameters typically lack a specific assigned role.
:::

## Next steps

After thoroughly reviewing this article, it is highly recommended that you dedicate time for a more in-depth study of the following documents:
  
- The original descriptions are present, but they may be limited, in the documents:		
	* [The Open Network Whitepaper](https://ton.org/whitepaper.pdf)
	* [Telegram Open Network Blockchain](/tblkch.pdf)

- Source code:
    * [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h)
    * [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
    * [BlockMasterConfig Type](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type)

## See also

On these pages, you can find active network configurations of the TON Blockchain:

- [Mainnet configuration](https://ton.org/global-config.json)
- [Testnet configuration](https://ton.org/testnet-global.config.json)
- [Russian version](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md)

<Feedback />




================================================
FILE: docs/v3/documentation/network/configs/config-params.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/configs/config-params.md
================================================
import Feedback from '@site/src/components/Feedback';

# Changing the parameters

This document aims to provide a basic explanation of TON Blockchain's configuration parameters and give step-by-step instructions for changing these parameters based on a consensus of a majority of validators.

We assume that the reader is already familiar with [Fift](/v3/documentation/smart-contracts/fift/overview) and the [Lite Client](/v3/guidelines/nodes/running-nodes/liteserver-node), as explained in [FullNode-HOWTO (low-level)](/v3/guidelines/nodes/running-nodes/full-node), and [Validator-HOWTO (low-level)](/v3/guidelines/nodes/running-nodes/validator-node) particularly in the sections discussing how validators vote on configuration proposals.

## Configuration parameters

The **configuration parameters** are specific values that influence the behavior of validators and fundamental smart contracts on the TON Blockchain. The current values of all configuration parameters are stored as a distinct part of the MasterChain state and are retrieved whenever necessary. Consequently, we can refer to the values of the configuration parameters concerning a particular MasterChain block. Each ShardChain block includes a reference to the most recently known MasterChain block; the values from the corresponding MasterChain state are considered active for this ShardChain block and are used during its generation and validation.

For MasterChain blocks, the state of the previous MasterChain block is used to extract the active configuration parameters. Therefore, even if certain configuration parameters are attempted to be modified within a MasterChain block, any changes will only take effect in the subsequent MasterChain block.


Each configuration parameter is identified by a signed 32-bit integer known as the **configuration parameter index**, or simply the **index**. The value of a configuration parameter is always a `Cell`. In some cases, certain configuration parameters may be absent, and it is generally assumed that the value of these missing parameters is `Null`. Additionally, there is a list of **mandatory** configuration parameters that must always be present. This list is stored in the configuration parameter `#10`.

All configuration parameters are combined into a **configuration dictionary**, which is a `Hashmap` with signed 32-bit keys (the configuration parameter indices) and values that consist of exactly one cell reference. In other words, a configuration dictionary is a value of the TL-B type `HashmapE 32 ^Cell`. The collection of all configuration parameters is retained in the MasterChain state as a value of the TL-B type `ConfigParams`:

`_ config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;`

In addition to the configuration dictionary, `ConfigParams` contains `config_addr`—the 256-bit address of the configuration smart contract within the MasterChain. Further details on the configuration smart contract will be provided later.

The configuration dictionary, which contains the active values of all configuration parameters, is accessible to all smart contracts through a special TVM register called `c7` during the execution of a transaction. Specifically, when a smart contract is executed, `c7` is initialized as a tuple. This tuple consists of a single element, which is another tuple containing several "context" values that are useful for executing the smart contract, such as the current Unix time (as recorded in the block header). 

The tenth entry of this inner tuple (i.e., the one indexed with zero-based index 9) contains a `Cell` representing the configuration dictionary. This configuration dictionary can be accessed by using the TVM instructions `PUSH c7; FIRST; INDEX 9` or the equivalent instruction `CONFIGROOT`. Furthermore, special TVM instructions like `CONFIGPARAM` and `CONFIGOPTPARAM` streamline this process by combining the previous actions with a dictionary lookup, allowing smart contracts to retrieve any configuration parameter by its index.

It is important to note that all configuration parameters are readily accessible to all smart contracts, whether they operate on the MasterChain or ShardChain. As a result, smart contracts can inspect these parameters and utilize them for specific checks. For instance, a smart contract might extract data storage prices for different WorkChains from a configuration parameter in order to calculate the cost of storing a piece of user-provided data.


The values of configuration parameters are not arbitrary. Specifically, if the configuration parameter index `i` is non-negative, then its value must correspond to a valid value of the TL-B type `ConfigParam i`. Validators enforce this restriction and do not accept changes to configuration parameters with non-negative indices unless the values are valid for the corresponding TL-B type.

The structure of these parameters is defined in the source file `crypto/block/block.tlb`, where `ConfigParam i` is specified for different values of `i`. For example:

- `_config_addr: bits256 = ConfigParam 0;`
- `_elector_addr: bits256 = ConfigParam 1;`
- `_dns_root_addr: bits256 = ConfigParam 4; // root TON DNS resolver`
- `capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;`
- `_GlobalVersion = ConfigParam 8; // all zero if absent`

These entries illustrate how configuration parameters are structured and defined within the specified file.

The configuration parameter `#8` includes a `Cell` that has no references and contains exactly 104 data bits. The first four bits are allocated for `11000100`, followed by 32 bits that represent the currently enabled "global version." This is followed by a 64-bit integer with flags that correspond to the currently enabled capabilities. A more detailed description of all configuration parameters will be provided in an appendix to the TON Blockchain documentation. In the meantime, you can review the TL-B scheme in `crypto/block/block.tlb` to see how different parameters are utilized in the validator sources.

Unlike configuration parameters with non-negative indices, those with negative indices can hold arbitrary values. Validators do not enforce any restrictions on these values. As a result, they can be used to store essential information, such as the Unix time when specific smart contracts are set to begin operating. This information is not critical for block generation but is necessary for some fundamental smart contracts.

## Changing configuration parameters

The current values of configuration parameters are stored in a special section of the MasterChain state. But how are they changed?

There is a special smart contract known as the **configuration smart contract** that resides in the MasterChain. Its address is specified by the `config_addr` field in `ConfigParams`. The first cell reference in its data must contain an up-to-date copy of all configuration parameters. When a new MasterChain block is generated, the configuration smart contract is accessed using its address (`config_addr`), and the new configuration dictionary is extracted from the first cell reference of its data. 

Following some validity checks—like ensuring that any value with a non-negative 32-bit index `i` is indeed a valid TL-B type (`ConfigParam i`)—the validator copies this new configuration dictionary into the portion of the MasterChain that contains `ConfigParams`. This operation occurs after all transactions have been created, meaning only the final version of the new configuration dictionary stored in the smart contract is evaluated. 

If the validity checks fail, the existing configuration dictionary remains unchanged, ensuring that the configuration smart contract cannot install invalid parameter values. If the new configuration dictionary is identical to the current one, no checks are performed, and no changes are made.

All changes to configuration parameters are executed by the configuration smart contract, which defines the rules for modifying these parameters. Currently, the configuration smart contract supports two methods for changing configuration parameters:

- **External message**: This method involves an external message signed by a specific private key, which corresponds to a public key stored in the configuration smart contract's data. This approach is typically used in public testnets and possibly in smaller private test networks controlled by a single entity, as it allows the operator to easily modify any configuration parameter values. 

  It is important to note that this public key can be changed through a special external message signed by the previous key, and if changed to zero, this mechanism becomes disabled. This means the method can be used for fine-tuning right after launch and then permanently disabled.

- **Configuration proposals**: This method involves creating "configuration proposals" that validators vote on. Generally, a configuration proposal must gather votes from more than 3/4 (75%) of all validators by weight, and this requires approval in multiple rounds (i.e., several consecutive sets of validators must confirm the proposed parameter change). This serves as the distributed governance mechanism for the TON Blockchain Mainnet.

We will provide a more detailed explanation of the second method for changing configuration parameters.

## Creating configuration proposals

A new **configuration proposal** includes the following information:

- The index of the configuration parameter to be changed.
  
- The new value of the configuration parameter (or `Null`, if it is to be deleted).
  
- The expiration Unix time of the proposal.
  
- A flag indicating whether the proposal is **critical**.
  
- An optional **old value hash** that contains the cell hash of the current value (the proposal can only be activated if the current value matches the specified hash).

Anyone with a wallet in the MasterChain can create a new configuration proposal, provided they pay the required fee. However, only validators have the authority to vote for or against existing configuration proposals.

It is important to note that there are **critical** and **ordinary** configuration proposals. A critical configuration proposal can modify any configuration parameter, including those classified as critical. The list of critical configuration parameters is stored in configuration parameter `#10`, which is itself considered critical. Creating critical configuration proposals is more costly, and they typically require gathering more validator votes across multiple rounds. The specific voting requirements for both ordinary and critical configuration proposals are detailed in the critical configuration parameter `#11`. Conversely, ordinary configuration proposals are less expensive to create but cannot alter critical configuration parameters.

To create a new configuration proposal, one must first generate a BoC (bag-of-cells) file that contains the proposed new value. The method for doing this varies depending on the configuration parameter being modified. For example, if we want to create a parameter `-239` containing the UTF-8 string "TEST" (i.e., `0x54455354`), we would generate `config-param-239.boc` by invoking Fift and then typing:

```
<b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
bye
```

As a result, a 21-byte file named `config-param-239.boc` will be created, which contains the serialization of the required value.

For more complex cases, especially for configuration parameters with non-negative indices, this straightforward approach may not be easily applicable. We recommend using `create-state`, which is available as `crypto/create-state` in the build directory, instead of using `fift`. You should also consider copying and modifying relevant portions of the source files `crypto/smartcont/gen-zerostate.fif` and `crypto/smartcont/CreateState.fif`. These files are typically used to create the zero state, corresponding to the "genesis block" found in other blockchain architectures, for the TON Blockchain.

For example, consider configuration parameter `#8`, which contains the currently enabled global blockchain version and its capabilities:

```
capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_ GlobalVersion = ConfigParam 8;
```

We can check its current value by running the lite client and typing `getconfig 8`:

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))

x{C4000000010000000000000006}
```

Let’s consider enabling the capability represented by bit `#3` (which corresponds to `+8`), specifically the `capReportVersion` capability. When this capability is enabled, it requires all collators to include their supported versions and capabilities in the block headers of the blocks they generate. Therefore, we need to set `version=1` and `capabilities=14`. In this case, we can accurately guess the correct serialization and create the BoC file directly by entering commands in Fift.

```
x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file
```

A 30-byte file named `config-param8.boc` is created, containing the desired value.

In more complicated cases, this may not be an option. Therefore, let's approach this example differently. We can inspect the source files `crypto/smartcont/gen-zerostate.fif` and `crypto/smartcont/CreateState.fif` for relevant portions.

```
// version capabilities --
{ <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
```
    
and

```
// version capabilities
1 capCreateStats capBounceMsgBody or capReportVersion or config.version!
```

We observe that `config.version!`, excluding the last `8 config!`, effectively accomplishes our goal. Therefore, we can create a temporary Fift script named `create-param8.fif`:

```
#!/usr/bin/fift -s
"TonUtil.fif" include

1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

// create new value for config param #8
1 capCreateStats capBounceMsgBody or capReportVersion or prepare-param8
// check the validity of this value
dup 8 is-valid-config? not abort"not a valid value for chosen configuration parameter"
// print
dup ."Serialized value = " <s csr.
// save into file provided as first command line argument
2 boc+>B $1 tuck B>file
."(Saved into file " type .")" cr
```

To execute the command `fift -s create-param8.fif config-param8.boc` or, even better, use `crypto/create-state -s create-param8.fif config-param8.boc` from the build directory, we will see the following output:

```
Serialized value = x{C400000001000000000000000E}
(Saved into file config-param8.boc)
```

We have obtained a 30-byte file named `config-param8.boc`, which contains the same content as before.

To create a configuration proposal, we first need a file containing the desired value for the configuration parameter. Next, we execute the script `create-config-proposal.fif`, which is located in the `crypto/smartcont` directory of the source tree, using appropriate arguments. We recommend using `create-state` (found as `crypto/create-state` in the build directory) instead of `fift`. This is because `create-state` is a specialized version of Fift that performs additional blockchain related validity checks:

```
$ crypto/create-state -s create-config-proposal.fif 8 config-param8.boc -x 1100000


Loading new value of configuration parameter 8 from file config-param8.boc
x{C400000001000000000000000E}

Non-critical configuration proposal will expire at 1586779536 (in 1100000 seconds)
Query id is 6810441749056454664 
resulting internal message body: x{6E5650525E838CB0000000085E9455904_}
 x{F300000008A_}
  x{C400000001000000000000000E}

B5EE9C7241010301002C0001216E5650525E838CB0000000085E9455904001010BF300000008A002001AC400000001000000000000000ECD441C3C
(a total of 104 data bits, 0 cell references -> 59 BoC data bytes)
(Saved to file config-msg-body.boc)
```

We have acquired the content of an internal message intended for the configuration smart contract, along with an appropriate amount of Toncoin from any wallet smart contract located in the MasterChain. To find the address of the configuration smart contract, you can enter the `get config 0' command in the lite client:

```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```

We have the address of the configuration smart contract as `-1:5555...5555`. By using appropriate getter methods of this smart contract, we can determine the required payment for creating this configuration proposal:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0

arguments:  [ 0 1100000 104 0 75077 ] 
result:  [ 2340800000 ] 
remote result (not to be trusted):  [ 2340800000 ] 
```

The parameters for the `proposal_storage_price` get-method include the following: a critical flag set to 0, a time interval of 1.1 megaseconds during which the proposal will remain active, a total of 104 bits, and 0 cell references in the data. The latter two quantities can be found in the output of `create-config-proposal.fif`.
  
To create this proposal, we need to pay 2.3408 Toncoins. It's advisable to add at least 1.5 Toncoins to cover the processing fees. Therefore, we will send a total of 4 Toncoins with the request (any excess Toncoins will be returned). We will then use `wallet.fif` (or the appropriate Fift script for our wallet) to execute a transfer from our wallet to the configuration smart contract, including the 4 Toncoins and the body from `config-msg-body.boc`. This process typically looks like:

```
$ fift -s wallet.fif my-wallet -1:5555555555555555555555555555555555555555555555555555555555555555 31 4. -B config-msg-body.boc

Transferring GR$4. to account kf9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQft = -1:5555555555555555555555555555555555555555555555555555555555555555 seqno=0x1c bounce=-1 
Body of transfer message is x{6E5650525E835154000000085E9293944_}
 x{F300000008A_}
  x{C400000001000000000000000E}

signing message: x{0000001C03}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

resulting external message: x{89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C_}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

B5EE9C724101040100CB0001CF89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C010189627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944002010BF300000008A003001AC400000001000000000000000EE1F80CD3
(Saved to file wallet-query.boc)
```

We will now send the external message `wallet-query.boc` to the blockchain using the lite client.

    > sendfile wallet-query.boc
    ....
    external message status is 1

After waiting for a brief period, we can check the incoming messages in our wallet to look for response messages from the configuration smart contract. Alternatively, if we are feeling lucky, we can directly inspect the list of all active configuration proposals by using the `list_proposals` method of the configuration smart contract.

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
arguments:  [ 107394 ] 
result:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
remote result (not to be trusted):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
... caching cell FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
```

The list of all active configuration proposals contains exactly one entry represented by a pair.

```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```

The first number, `6465..6321`, serves as the unique identifier for the configuration proposal and represents its 256-bit hash. The second component of this pair is a tuple that describes the status of the configuration proposal. The first part of this tuple indicates the expiration Unix time of the proposal (`1586779546`), while the second part (`0`) acts as a criticality flag.

Next, we find the configuration proposal itself, which is expressed by the triple `[8 C{FDCD...} -1]`. In this notation, `8` represents the index of the configuration parameter to be modified, `C{FDCD...}` denotes the cell containing the new value (its hash is represented by the value that follows), and `-1` indicates the optional hash of the old value for this parameter (where `-1` means the old hash is not specified).

Following that, we encounter a large number, `1124...2998`, which identifies the current validator set. An empty list `()` is included to signify the set of all currently active validators who have voted for this proposal so far. Next is `weight_remaining`, equal to `8646...209`. This value is positive if the proposal has not yet garnered enough validator votes in this round, and negative otherwise.

Lastly, we see three numbers: `3 0 0`. These represent `rounds_remaining` (the proposal can survive at most three rounds, meaning changes to the current validator set), `wins` (the count of rounds in which the proposal received votes exceeding 3/4 of all validators by weight), and `losses` (the count of rounds where the proposal failed to secure 3/4 of all validator votes).

To inspect the proposed value for configuration parameter `#8`, you can ask the lite client to expand cell `C{FDCD...}` using its hash `FDCD...` or a sufficiently long prefix of this hash to uniquely identify the specific cell in question:

```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```

We observe that the value is `x{C400000001000000000000000E}`, which is the value we have incorporated into our configuration proposal. Additionally, we can ask the lite client to present this Cell as a TL-B type value (`ConfigParam 8`).

```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (capabilities version:1 capabilities:14))
```

This is particularly useful when we evaluate configuration proposals created by others.

Each configuration proposal is identified by its unique 256-bit hash, represented by the large decimal number `6465...6321`. To check the current status of a specific configuration proposal, you can use the `get_proposal` method, providing the identifier of the configuration proposal as the only argument:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```

We achieve essentially the same outcome as before, but for only one configuration proposal and without the identifier at the beginning.

## Voting for configuration proposals

Once a configuration proposal is created, it must collect votes from more than 75% of all current validators (based on their stake) during the current round and possibly in several subsequent rounds (with elected validator sets). This ensures that the decision to change a configuration parameter is approved by a significant majority, not only of the current set of validators but also of several future sets.

Voting for a configuration proposal is limited to the current validators listed (with their permanent public keys) in configuration parameter `#34`. The process is outlined below:

- The operator of a validator first looks up `val-idx`, the zero-based index of their validator in the current set of validators stored in configuration parameter `#34`.

- The operator then invokes a special Fift script, `config-proposal-vote-req.fif`, found in the `crypto/smartcont` directory of the source tree. They must indicate both `val-idx` and `config-proposal-id` as arguments:

  ```
    $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
    Creating a request to vote for configuration proposal 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 on behalf of validator with index 0 
    566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
    Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
    Saved to file validator-to-sign.req
  ```

- The vote request must then be signed using the current validator’s private key, with the command `sign <validator-key-id> 566F744...28A1` in the `validator-engine-console` connected to the validator. This process is similar to the steps described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) for participating in validator elections; however, the currently active key must be used.

- Next, the `config-proposal-signed.fif` script is invoked. This script has similar arguments to `config-proposal-req.fif`, but it also requires two additional arguments: the base64 representation of the public key used to sign the vote request and the base64 representation of the signature. The process is again akin to what is described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node).

- This process generates a file named `vote-msg-body.boc`, which contains the body of an internal message carrying a signed vote for this configuration proposal.

- After that, `vote-msg-body.boc` must be sent in an internal message from any smart contract residing in the masterchain (typically from the controlling smart contract of the validator) along with a small amount of Toncoin for processing (usually, 1.5 Toncoin is sufficient). This step follows the same procedure used during validator elections. The command is typically structured as follows:

  ```
  $ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
  ```

  (if a simple wallet controls the validator), followed by sending the resulting file `wallet-query.boc` from the lite client:

    ```
    > sendfile wallet-query.boc
    ```

- You can monitor the response messages from the configuration smart contract to the controlling smart contract to check the status of your voting queries. Alternatively, you can inspect the status of the configuration proposal by using the `get-method` `show_proposal` of the configuration smart contract:

  ```
  > runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
  ...
  arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
  result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
  ```
  In this output, the list of indices for validators that voted for this configuration proposal should not be empty and must include the index of your validator. For example, if the list contains (`0`), it indicates that only the validator with index `0` in configuration parameter `#34` has voted. If this list grows, the second-to-last integer (the first zero in `3 0 0`) in the proposal status will increase, reflecting another win for this proposal. If the number of wins reaches or exceeds the value indicated in configuration parameter `#11`, the configuration proposal is automatically accepted, and the proposed changes take effect immediately.

  Conversely, when the validator set changes, the list of validators that have already voted will become empty, the `rounds_remaining` value (currently three in `3 0 0`) will decrease by one, and if it becomes negative, the configuration proposal will be destroyed. If the proposal is not destroyed and has not won in the current round, the number of losses (the second zero in `3 0 0`) will increase. If this number exceeds the value specified in configuration parameter `#11`, the configuration proposal will be rejected.

## An automated way of voting on configuration proposals

The automation provided by the command `createelectionbid` in `validator-engine-console` facilitates participation in validator elections. Similarly, both `validator-engine` and `validator-engine-console` automate most of the steps mentioned in the previous section, allowing you to generate a `vote-msg-body.boc` that can be used with the controlling wallet.

To use this method, you need to install the Fift scripts `config-proposal-vote-req.fif` and `config-proposal-vote-signed.fif` in the same directory that the validator-engine uses to locate `validator-elect-req.fif` and `validator-elect-signed.fif`, as described in Section 5 of the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node). Once you have those files set up, you can create the `vote-msg-body.boc` by executing the following command in the validator-engine-console:

```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```

This command will generate the `vote-msg-body.boc`, which contains the body of the internal message to be sent to the configuration smart contract.

## Upgrading the code of the configuration smart contract and the elector smart contract

It may be necessary to upgrade the code of either the configuration smart contract or the elector smart contract. To do this, we will use the same mechanism described previously. The new code must be stored in a reference of a value cell, and this value cell should be proposed as the new value for the configuration parameter `-1000` (for upgrading the configuration smart contract) or `-1001` (for upgrading the elector smart contract). These parameters are considered critical, so a significant number of validator votes will be required to make changes to the configuration smart contract, similar to adopting a new constitution. We anticipate that such changes will first be tested in a test network and discussed in public forums before each validator operator makes their decision to vote for or against the proposed changes.

Alternatively, critical configuration parameters `0` (which indicates the address of the configuration smart contract) or `1` (which indicates the address of the elector smart contract) can be changed to other values, provided that these values match existing and correctly initialized smart contracts. Specifically, the new configuration smart contract must contain a valid configuration dictionary in the first reference of its persistent data. Since transferring changing data—such as the list of active configuration proposals or the previous and current participant lists of validator elections—between different smart contracts can be complicated, it is generally more beneficial to upgrade the code of an existing smart contract rather than change the address of the configuration smart contract.

There are two auxiliary scripts designed to create configuration proposals for upgrading the code of the configuration or elector smart contract. The script `create-config-upgrade-proposal.fif` loads a Fift assembler source file (`auto/config-code.fif` by default), which corresponds to the code automatically generated by the FunC compiler from `crypto/smartcont/config-code.fc`, and creates the corresponding configuration proposal for the configuration parameter `-1000`. Similarly, the script `create-elector-upgrade-proposal.fif` loads a Fift assembler source file (`auto/elector-code.fif` by default) and uses it to create a configuration proposal for configuration parameter `-1001`. This makes it simple to create configuration proposals to upgrade either of these two smart contracts. 

However, it is also essential to publish the modified FunC source code of the smart contract and specify the exact version of the FunC compiler used for compilation. This way, all validators (or their operators) will be able to reproduce the code in the configuration proposal, compare the hashes, and examine the source code and changes before deciding how to vote on the proposed changes.
<Feedback />




================================================
FILE: docs/v3/documentation/network/configs/network-configs.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/configs/network-configs.md
================================================
import Feedback from '@site/src/components/Feedback';

# Network configs

On this page, you can find the active network configurations for TON Blockchain:

- Mainnet: https://ton.org/global-config.json

- Testnet: https://ton.org/testnet-global.config.json

## See also

- [Node types](/v3/documentation/infra/nodes/node-types)

- [Blockchain parameters configurations](/v3/documentation/network/configs/blockchain-configs)
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/adnl/adnl-tcp.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/adnl/adnl-tcp.md
================================================
import Feedback from '@site/src/components/Feedback';

# ADNL TCP - liteserver

This is the low-level protocol that supports all interactions within the TON network. While it can operate on top of any protocol, it is most commonly used in conjunction with TCP and UDP. Typically, UDP facilitates communication between nodes, whereas TCP is employed for communication with liteservers.

In this section, we will analyze how ADNL operates over TCP and learn how to interact directly with liteservers.

In the TCP version of ADNL, network nodes utilize public keys (ed25519) as their addresses. Connections are established using a shared key obtained through the Elliptic Curve Diffie-Hellman (ECDH) procedure.

## Packet structure

Each ADNL TCP packet, except for the handshake, has the following structure:

* 4 bytes of packet size in little-endian (N)
* 32 bytes nonce (random bytes to protect against checksum attacks)
* (N - 64) payload bytes
* 32 bytes SHA256 checksum from nonce and payload

The entire packet, including its size, is encrypted using **AES-CTR**.

After decrypting the packet, you must verify that the checksum matches the data. To do this, simply calculate the checksum yourself and compare it to the checksum provided in the packet.

The handshake packet is an exception; it is transmitted partially unencrypted and is detailed in the next chapter.

## Establishing a connection

To establish a connection, we need to know the server's IP, port, and public key and generate our own private and public key, ed25519.

Public server data such as IP, port, and key can be obtained from the [global config](https://ton-blockchain.github.io/global.config.json). The IP in the config, which is numerical, can be converted to normal form using,(for example) [this tool](https://www.browserling.com/tools/dec-to-ip). The public key in the config is in base64 format.

The client generates 160 random bytes, some of which will be used by the parties as the basis for AES encryption.

Two permanent AES-CTR ciphers are created, which the parties will use to encrypt/decrypt messages after the handshake.

* Cipher A - key 0 - 31 bytes, iv 64 - 79 bytes
* Cipher B - key 32 - 63 bytes, iv 80 - 95 bytes

The ciphers are utilized in the following order:

* Cipher A is used by the server to encrypt the messages it sends.
* Cipher A is used by the client to decrypt messages it receives.
* Cipher B is used by the client to encrypt the messages it sends.
* Cipher B is used by the server to decrypt messages it receives.
  
To establish a connection, the client must send a handshake packet containing:

* [32 bytes] **Server key ID** [[see details here]](#getting-key-id)
* [32 bytes] **Our public key is ed25519**
* [32 bytes] **SHA256 hash from our 160 bytes**
* [160 bytes] **Our 160 bytes encrypted** [[see details here]](#handshake-packet-data-encryption)

When receiving a handshake packet, the server will do the same actions: receive an ECDH key, decrypt 160 bytes, and create 2 permanent keys. If everything works out, the server will respond with an empty ADNL packet, without payload, to decrypt which (as well as subsequent ones) we need to use one of the permanent ciphers.

From this point on, the connection can be considered established.

After we have established a connection, we can start receiving information; the TL language serializes data.

[Learn more about TL here](/v3/documentation/data-formats/tl).

## Ping and pong

It is optimal to send a ping packet once every 5 seconds. This is necessary to maintain the connection while no data is being transmitted, otherwise the server may terminate the connection.

Like all the others, the ping packet is built according to the standard schema described [above](#packet-structure) and carries the request ID and ping ID as payload data.

Let's find the desired schema for the ping request [here](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L35) and calculate the schema id as `crc32_IEEE("tcp.ping random_id:long = tcp.Pong")`. When converted to little endian bytes, we get **9a2b084d**.

Therefore, our ADNL ping packet will look like this:

* 4 bytes of packet size in little-endian -> 64 + (4+8) = **76**
* 32 bytes nonce -> random 32 bytes
* 4 bytes of ID TL schema -> **9a2b084d**
* 8 bytes of request-id -> random uint64 number
* 32 bytes of SHA256 checksum from nonce and payload

We send our packet and wait for [tcp.pong](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L23), `random_id` will be equal to the one we sent in ping packet.

## Receiving information from a liteserver

All requests that are aimed at obtaining information from the blockchain are wrapped in [Liteserver query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L83) schema, which in turn is wrapped in [ADNL query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L22) schema.

* LiteQuery:
	`liteServer.query data:bytes = Object`, id **df068c79**
* ADNLQuery:
  `adnl.message.query query_id:int256 query:bytes = adnl.Message`, id **7af98bb4**

LiteQuery is passed inside ADNLQuery as `query:bytes`, and the final query is passed inside LiteQuery as `data:bytes`.

[Learn more about parsing encoding bytes in TL here](/v3/documentation/data-formats/tl).

### getMasterchainInfo

Since we already know how to generate TL packets for the lite API, we can request information about the current TON MasterChain block.

The MasterChain block is used in many further requests as an input parameter to indicate the state (moment) in which we need information.

We are looking for the [TL schema we require](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L60), calculate its ID and build the packet:

* 4 bytes of packet size in little endian -> 64 + (4+32+(1+4+(1+4+3)+3)) = **116**
* 32 bytes nonce -> random 32 bytes
* 4 bytes of ID ADNLQuery schema -> **7af98bb4**
* 32 bytes `query_id:int256` -> random 32 bytes
  * 1 byte array size -> **12**
  * 4 byte of ID LiteQuery schema -> **df068c79**
    * 1 byte array size -> **4**
    * 4 bytes of ID getMasterchainInfo schema -> **2ee6b589**
    * 3 zero bytes of padding (alignment to 8)
  * 3 zero bytes of padding (alignment to 16)
* 32 bytes of checksum SHA256 from nonce and payload

Packet example in hex:

```
74000000                                                             -> packet size (116)
5fb13e11977cb5cff0fbf7f23f674d734cb7c4bf01322c5e6b928c5d8ea09cfd     -> nonce
  7af98bb4                                                           -> ADNLQuery
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4   -> query_id
    0c                                                               -> array size
    df068c79                                                         -> LiteQuery
      04                                                             -> array size
      2ee6b589                                                       -> getMasterchainInfo
      000000                                                         -> 3 bytes of padding
    000000                                                           -> 3 bytes of padding
ac2253594c86bd308ed631d57a63db4ab21279e9382e416128b58ee95897e164     -> sha256
```

In response, we expect to receive [liteServer.masterchainInfo](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L30), consisting of last:[ton.blockIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/tonlib_api.tl#L51) state_root_hash:int256 and init:[tonNode.zeroStateIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L359).

The received packet is deserialized in the same way as the sent one - has same algorithm, but in the opposite direction, except that the response is wrapped only in [ADNLAnswer](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L23).

After decoding the response, we get a packet of the form:

```
20010000                                                                  -> packet size (288)
5558b3227092e39782bd4ff9ef74bee875ab2b0661cf17efdfcd4da4e53e78e6          -> nonce
  1684ac0f                                                                -> ADNLAnswer
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4        -> query_id (identical to request)
    b8                                                                    -> array size
    81288385                                                              -> liteServer.masterchainInfo
                                                                          last:tonNode.blockIdExt
        ffffffff                                                          -> workchain:int
        0000000000000080                                                  -> shard:long
        27405801                                                          -> seqno:int   
        e585a47bd5978f6a4fb2b56aa2082ec9deac33aaae19e78241b97522e1fb43d4  -> root_hash:int256
        876851b60521311853f59c002d46b0bd80054af4bce340787a00bd04e0123517  -> file_hash:int256
      8b4d3b38b06bb484015faf9821c3ba1c609a25b74f30e1e585b8c8e820ef0976    -> state_root_hash:int256
                                                                          init:tonNode.zeroStateIdExt 
        ffffffff                                                          -> workchain:int
        17a3a92992aabea785a7a090985a265cd31f323d849da51239737e321fb05569  -> root_hash:int256      
        5e994fcf4d425c0a6ce6a792594b7173205f740a39cd56f537defd28b48a0f6e  -> file_hash:int256
    000000                                                                -> 3 bytes of padding
520c46d1ea4daccdf27ae21750ff4982d59a30672b3ce8674195e8a23e270d21          -> sha256
```

### runSmcMethod

We already know how to get the MasterChain block, so now we can call any liteserver methods.

Let's analyze **runSmcMethod** - this is a method that calls a function from a smart contract and returns a result. Here we need to understand some new data types such as [TL-B](/v3/documentation/data-formats/tlb/tl-b-language), [Cell](/v3/documentation/data-formats/tlb/cell-boc#cell) and [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells).

To execute the smart contract method, we need to build and send a request using the TL schema:

```tlb
liteServer.runSmcMethod mode:# id:tonNode.blockIdExt account:liteServer.accountId method_id:long params:bytes = liteServer.RunMethodResult
```

And wait for a response with schema:

```tlb
liteServer.runMethodResult mode:# id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:mode.0?bytes proof:mode.0?bytes state_proof:mode.1?bytes init_c7:mode.3?bytes lib_extras:mode.4?bytes exit_code:int result:mode.2?bytes = liteServer.RunMethodResult;
```

In the request, we see the following fields:

* mode:# - uint32 bitmask of what we want to see in the response, for example, `result:mode.2?bytes` will only be present in the response if the bit with index 2 is set to one.
* id:tonNode.blockIdExt - our master block state that we got in the previous chapter.
* account:[liteServer.accountId](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L27) - workchain and smart contract address data.
* method_id:long - 8 bytes, in which crc16 with the XMODEM table is written on behalf of the called method + bit 17 is set [[Calculation]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)
* params:bytes - [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) serialized in [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells), containing arguments to call the method. [[Implementation example]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/tlb/stack.go)

For example, we only need `result:mode.2?bytes`, then our mode will be equal to 0b100, that is 4. In response, we will get:
* mode:# -> what was sent - 4.
* id:tonNode.blockIdExt -> our master block against which the method was executed
* shardblk:tonNode.blockIdExt -> shard block where the contract account is located
* exit_code:int -> 4 bytes which is the exit code when executing the method. If everything is successful, then = 0, if not, it is equal to the exception code.
* result:mode.2?bytes -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) serialized in [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells), containing the values returned by the method.

Let's analyze the call and getting the result from the `a2` method of the contract `EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`:

Method code in FunC:

```func
(cell, cell) a2() method_id {
  cell a = begin_cell().store_uint(0xAABBCC8, 32).end_cell();
  cell b = begin_cell().store_uint(0xCCFFCC1, 32).end_cell();
  return (a, b);
}
```

Fill out our request:

* `mode` = 4, we only need the result -> `04000000`
* `id` = result of execution getMasterchainInfo
* `account` = workchain 0 (4 bytes `00000000`), and int256 [obtained from our contract address](/v3/documentation/data-formats/tlb/tl-b-types#addresses), i.e. 32 bytes `4bdbfde5322cb2c14d7b83ea2bf0deeff610e63c2a6db7304f1368ac176193ce`
* `method_id` = [computed](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16) id from `a2` -> `0a2e010000000000`
* `params:bytes` = Our method does not accept input parameters, so we need to pass it an empty stack (`000000`, cell 3 bytes - stack depth 0) serialized in [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) -> `b5ee9c72010101010005000006000000` -> serialize in bytes and get `10b5ee9c72410101010005000006000000000000` 0x10 - size, 3 bytes in the end - padding.

In response, we get:

* `mode:#` -> not interesting
* `id:tonNode.blockIdExt` -> not interesting
* `shardblk:tonNode.blockIdExt` -> not interesting
* `exit_code:int` -> is 0 if execution was successful
* `result:mode.2?bytes` -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783) containing the data returned by the method in [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) format, we will unpack it.

Inside `result` we received `b5ee9c7201010501001b000208000002030102020203030400080ccffcc1000000080aabbcc8`, this is [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) containing the data. When we deserialize it, we will get a cell:

```json
32[00000203] -> {
  8[03] -> {
    0[],
    32[0AABBCC8]
  },
  32[0CCFFCC1]
}
```

If we parse it, we will get 2 values of the cell type, which our FunC method returns. The first 3 bytes of the root cell `000002` - is the depth of the stack, that is 2. This means that the method returned 2 values.

We continue parsing, the next 8 bits (1 byte) is the value type at the current stack level. For some types, it may take 2 bytes. Possible options can be seen in [schema](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L766). In our case, we have `03`, which means:

```tlb
vm_stk_cell#03 cell:^Cell = VmStackValue;
```

Hence, the type of our value is - cell, and, according to the schema, it stores the value itself as a reference. However, if we look at the stack element storage schema:

```tlb
vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);
```

We will see that the first link `rest:^(VmStackList n)` - is the cell of the next value on the stack, and our value `tos:VmStackValue` comes second, so to get the value we need to read the second link, that is `32[0CCFFCC1]` - this is our first cell that the contract returned.

Now we can go deeper and get the second element of the stack, we go through the first link, now we have:

```json
8[03] -> {
    0[],
    32[0AABBCC8]
  }
```

We repeat the same process. The first 8 bits = `03` - that is, again cell. The second reference is the value `32[0AABBCC8]` and since our stack depth is 2, we complete the pass. n total, we have 2 values returned by the contract - `32[0CCFFCC1]` and `32[0AABBCC8]`.

Note that they are in reverse order. In the same way, you need to pass arguments when calling a function - in reverse order from what we see in the FunC code.

[Please see implementation example here](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ton/runmethod.go#L24)

### getAccountState

To get account state data such as balance, code and contract data, we can use [getAccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L68). For the request, we need a [fresh master block](#getmasterchaininfo) and account address. In response, we will receive the TL structure [AccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L38).

Let's analyze the AccountState TL schema:

```tlb
liteServer.accountState id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:bytes proof:bytes state:bytes = liteServer.AccountState;
```

* `id` - our master block, regarding which we got the data.
* `shardblk` - WorkChain shard block where our account is located, regarding which we received data.
* `shard_proof` - Merkle proof of a shard block.
* `proof` - Merkle proof of account status.
* `state` - [BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) TL-B [account state scheme](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L232).

Of all this data, what we need is in the state, we will analyze it.

For example, let's get the status of account `EQAhE3sLxHZpsyZ_HecMuwzvXHKLjYx4kEUehhOy2JmCcHCT`, `state` in the response will be (at the moment of writing this article):

```hex
b5ee9c720102350100051e000277c0021137b0bc47669b3267f1de70cbb0cef5c728b8d8c7890451e8613b2d899827026a886043179d3f6000006e233be8722201d7d239dba7d818134001020114ff00f4a413f4bcf2c80b0d021d0000000105036248628d00000000e003040201cb05060013a03128bb16000000002002012007080043d218d748bc4d4f4ff93481fd41c39945d5587b8e2aa2d8a35eaf99eee92d9ba96004020120090a0201200b0c00432c915453c736b7692b5b4c76f3a90e6aeec7a02de9876c8a5eee589c104723a18020004307776cd691fbe13e891ed6dbd15461c098b1b95c822af605be8dc331e7d45571002000433817dc8de305734b0c8a3ad05264e9765a04a39dbe03dd9973aa612a61f766d7c02000431f8c67147ceba1700d3503e54c0820f965f4f82e5210e9a3224a776c8f3fad1840200201200e0f020148101104daf220c7008e8330db3ce08308d71820f90101d307db3c22c00013a1537178f40e6fa1f29fdb3c541abaf910f2a006f40420f90101d31f5118baf2aad33f705301f00a01c20801830abcb1f26853158040f40e6fa120980ea420c20af2670edff823aa1f5340b9f2615423a3534e2a2d2b2c0202cc12130201201819020120141502016616170003d1840223f2980bc7a0737d0986d9e52ed9e013c7a21c2b2f002d00a908b5d244a824c8b5d2a5c0b5007404fc02ba1b04a0004f085ba44c78081ba44c3800740835d2b0c026b500bc02f21633c5b332781c75c8f20073c5bd0032600201201a1b02012020210115bbed96d5034705520db3c8340201481c1d0201201e1f0173b11d7420c235c6083e404074c1e08075313b50f614c81e3d039be87ca7f5c2ffd78c7e443ca82b807d01085ba4d6dc4cb83e405636cf0069006031003daeda80e800e800fa02017a0211fc8080fc80dd794ff805e47a0000e78b64c00015ae19574100d56676a1ec40020120222302014824250151b7255b678626466a4610081e81cdf431c24d845a4000331a61e62e005ae0261c0b6fee1c0b77746e102d0185b5599b6786abe06fedb1c68a2270081e8f8df4a411c4605a400031c34410021ae424bae064f613990039e2ca840090081e886052261c52261c52265c4036625ccd88302d02012026270203993828290111ac1a6d9e2f81b609402d0015adf94100cc9576a1ec1840010da936cf0557c1602d0015addc2ce0806ab33b50f6200220db3c02f265f8005043714313db3ced542d34000ad3ffd3073004a0db3c2fae5320b0f26212b102a425b3531cb9b0258100e1aa23a028bcb0f269820186a0f8010597021110023e3e308e8d11101fdb3c40d778f44310bd05e254165b5473e7561053dcdb3c54710a547abc2e2f32300020ed44d0d31fd307d307d33ff404f404d10048018e1a30d20001f2a3d307d3075003d70120f90105f90115baf2a45003e06c2170542013000c01c8cbffcb0704d6db3ced54f80f70256e5389beb198106e102d50c75f078f1b30542403504ddb3c5055a046501049103a4b0953b9db3c5054167fe2f800078325a18e2c268040f4966fa52094305303b9de208e1638393908d2000197d3073016f007059130e27f080705926c31e2b3e63006343132330060708e2903d08308d718d307f40430531678f40e6fa1f2a5d70bff544544f910f2a6ae5220b15203bd14a1236ee66c2232007e5230be8e205f03f8009322d74a9802d307d402fb0002e83270c8ca0040148040f44302f0078e1771c8cb0014cb0712cb0758cf0158cf1640138040f44301e201208e8a104510344300db3ced54925f06e234001cc8cb1fcb07cb07cb3ff400f400c9
```

[Parse this BoC](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells) and get:

<details>
  <summary>large cell</summary>

  ```json
  473[C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_] -> {
    80[FF00F4A413F4BCF2C80B] -> {
      2[0_] -> {
        4[4_] -> {
          8[CC] -> {
            2[0_] -> {
              13[D180],
              141[F2980BC7A0737D0986D9E52ED9E013C7A218] -> {
                40[D3FFD30730],
                48[01C8CBFFCB07]
              }
            },
            6[64] -> {
              178[00A908B5D244A824C8B5D2A5C0B5007404FC02BA1B048_],
              314[085BA44C78081BA44C3800740835D2B0C026B500BC02F21633C5B332781C75C8F20073C5BD00324_]
            }
          },
          2[0_] -> {
            2[0_] -> {
              84[BBED96D5034705520DB3C_] -> {
                112[C8CB1FCB07CB07CB3FF400F400C9]
              },
              4[4_] -> {
                2[0_] -> {
                  241[AEDA80E800E800FA02017A0211FC8080FC80DD794FF805E47A0000E78B648_],
                  81[AE19574100D56676A1EC0_]
                },
                458[B11D7420C235C6083E404074C1E08075313B50F614C81E3D039BE87CA7F5C2FFD78C7E443CA82B807D01085BA4D6DC4CB83E405636CF0069004_] -> {
                  384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232]
                }
              }
            },
            2[0_] -> {
              2[0_] -> {
                323[B7255B678626466A4610081E81CDF431C24D845A4000331A61E62E005AE0261C0B6FEE1C0B77746E0_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                531[B5599B6786ABE06FEDB1C68A2270081E8F8DF4A411C4605A400031C34410021AE424BAE064F613990039E2CA840090081E886052261C52261C52265C4036625CCD882_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                }
              },
              4[4_] -> {
                2[0_] -> {
                  65[AC1A6D9E2F81B6090_] -> {
                    128[ED44D0D31FD307D307D33FF404F404D1]
                  },
                  81[ADF94100CC9576A1EC180_]
                },
                12[993_] -> {
                  50[A936CF0557C14_] -> {
                    128[ED44D0D31FD307D307D33FF404F404D1]
                  },
                  82[ADDC2CE0806AB33B50F60_]
                }
              }
            }
          }
        },
        872[F220C7008E8330DB3CE08308D71820F90101D307DB3C22C00013A1537178F40E6FA1F29FDB3C541ABAF910F2A006F40420F90101D31F5118BAF2AAD33F705301F00A01C20801830ABCB1F26853158040F40E6FA120980EA420C20AF2670EDFF823AA1F5340B9F2615423A3534E] -> {
          128[DB3C02F265F8005043714313DB3CED54] -> {
            128[ED44D0D31FD307D307D33FF404F404D1],
            112[C8CB1FCB07CB07CB3FF400F400C9]
          },
          128[ED44D0D31FD307D307D33FF404F404D1],
          40[D3FFD30730],
          640[DB3C2FAE5320B0F26212B102A425B3531CB9B0258100E1AA23A028BCB0F269820186A0F8010597021110023E3E308E8D11101FDB3C40D778F44310BD05E254165B5473E7561053DCDB3C54710A547ABC] -> {
            288[018E1A30D20001F2A3D307D3075003D70120F90105F90115BAF2A45003E06C2170542013],
            48[01C8CBFFCB07],
            504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
            856[DB3CED54F80F70256E5389BEB198106E102D50C75F078F1B30542403504DDB3C5055A046501049103A4B0953B9DB3C5054167FE2F800078325A18E2C268040F4966FA52094305303B9DE208E1638393908D2000197D3073016F007059130E27F080705926C31E2B3E63006] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9],
              384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232],
              504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
              128[8E8A104510344300DB3CED54925F06E2] -> {
                112[C8CB1FCB07CB07CB3FF400F400C9]
              }
            }
          }
        }
      }
    },
    114[0000000105036248628D00000000C_] -> {
      7[CA] -> {
        2[0_] -> {
          2[0_] -> {
            266[2C915453C736B7692B5B4C76F3A90E6AEEC7A02DE9876C8A5EEE589C104723A1800_],
            266[07776CD691FBE13E891ED6DBD15461C098B1B95C822AF605BE8DC331E7D45571000_]
          },
          2[0_] -> {
            266[3817DC8DE305734B0C8A3AD05264E9765A04A39DBE03DD9973AA612A61F766D7C00_],
            266[1F8C67147CEBA1700D3503E54C0820F965F4F82E5210E9A3224A776C8F3FAD18400_]
          }
        },
        269[D218D748BC4D4F4FF93481FD41C39945D5587B8E2AA2D8A35EAF99EEE92D9BA96000]
      },
      74[A03128BB16000000000_]
    }
  }
  ```

</details>

Now we need to parse the cell according to the TL-B structure:

```tlb
account_none$0 = Account;

account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

Our structure references other structures, such as:

```tlb
anycast_info$_ depth:(#<= 30) { depth >= 1 } rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
   
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
  
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;

currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
           
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;  
           
account_uninit$00 = AccountState;
account_active$1 _:StateInit = AccountState;
account_frozen$01 state_hash:bits256 = AccountState;
```

As we can see, the cell contains a lot of data, but we will analyze the main cases and get a balance. You can analyze the rest in a similar way.

Let's start parsing. In the root cell data we have:

```
C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_
```

Convert it to binary form and get:

```
11000000000000100001000100110111101100001011110001000111011001101001101100110010011001111111000111011110011100001100101110110000110011101111010111000111001010001011100011011000110001111000100100000100010100011110100001100001001110110010110110001001100110000010011100000010011010101000100001100000010000110001011110011101001111110110000000000000000000000110111000100011001110111110100001110010001000100000000111010111110100100011100111011011101001111101100000011000000100110
```

Let's look at our main TL-B structure, we see that we have two options for what can be there - `account_none$0` or `account$1`. We can understand which option we have by reading the prefix declared after the symbol $, in our case it is 1 bit. If there is 0, then we have `account_none`, or 1, then `account`.

Our first bit from the data above = 1, so we are working with `account$1` and will use the schema:

```tlb
account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```

Next, we have `addr:MsgAddressInt`, we see that for MsgAddressInt we also have several options:

```tlb
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```

To determine which structure to work with, we follow a similar approach as last time by reading the prefix bits. This time, we read 2 bits. After processing the first bit, we have `1000000...` remaining. Reading the first 2 bits yields `10`, indicating that we are working with `addr_std$10`.

Next, we encounter `anycast:(Maybe Anycast)`. The "Maybe" indicates that we should read 1 bit; if it's 1, we read `Anycast`; if it's 0, we skip it. After processing, our remaining bits are `00000...`. We read 1 bit and find it to be 0, so we skip reading `Anycast`.

Now, we move on to `workchain_id: int8`. This is straightforward— we read 8 bits to obtain the WorkChain ID. The next 8 bits are all zeros, so the WorkChain ID is 0.

Following this, we read `address: bits256`, which consists of 256 bits for the address, similar to how we handled the `workchain_id`. Upon reading, we receive `21137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D8998270` in hexadecimal representation.

Next, we read the address `addr: MsgAddressInt` and then proceed to `storage_stat: StorageInfo` from the main structure. Its schema is:

```tlb
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
```

First, we have `used:StorageUsed`, along with its schema:

```tlb
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
```

This is the number of cells and bits used to store account data. Each field is defined as `VarUInteger 7`, which means a uint of dynamic size, but a maximum of 7 bits. You can understand how it is arranged according to the schema:

```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
```

In our case, n will be equal to 7. In len we will have `(#< 7)` which means the number of bits that can hold a number up to 7. You can determine it by translating 7-1=6 into binary form - `110`, we get 3 bits, so length len = 3 bits. And value is `(uint (len * 8))`. To determine it, we need to read 3 bits of the length, get a number and multiply by 8, this will be the size of `value`, that is, the number of bits that need to be read to get the value of VarUInteger.

Read `cells:(VarUInteger 7)`, take our next bits from the root cell, look at the next 16 bits to understand, this is `0010011010101000`. We read the first 3 bits of len, this is `001`, i.e. 1, we get the size (uint (1 * 8)), we get uint 8, we read 8 bits, it will be `cells`, `00110101`, i.e. 53 in decimal form. We do the same for `bits` and `public_cells`.

We successfully read `used:StorageUsed`, next we have `last_paid:uint32`, we read 32 bits. Everything is just as simple with `due_payment:(Maybe Grams)` here Maybe, which will be 0, so we skip Grams. But, if Maybe is 1, we can look at the Grams `amount:(VarUInteger 16) = Grams` schema and immediately understand that we already know how to work with this. Like last time, only instead of 7 we have 16.

Next we have `storage:AccountStorage` with a schema:

```tlb
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;
```

We read `last_trans_lt:uint64`, this is 64 bits, storing lt of the last account transaction. And finally, the balance represented by the schema:

```tlb
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

From here we will read `grams:Grams` which will be the account balance in nano-tones. `grams:Grams` is `VarUInteger 16`, to store 16 (in binary form `10000`, subtracting 1 we get `1111`), then we read the first 4 bits, and multiply the resulting value by 8, then we read the received number of bits, it is our balance.

Let's analyze our remaining bits according to our data:

```
100000000111010111110100100011100111011011101001111101100000011000000100110
```

Read first 4 bits - `1000`, this is 8. 8*8=64, read next 64 bits = `0000011101011111010010001110011101101110100111110110000001100000`, removing extra zero bits, we get `11101011111010010001110011101101110100111110110000001100000`, that is equal to `531223439883591776`, and, translating from nano to TON, we get `531223439.883591776`.

We will stop here, since we have already analyzed all the main cases, the rest can be obtained in a similar way with what we have analyzed. Also, additional information on parsing TL-B can be found in [official documentation](/v3/documentation/data-formats/tlb/tl-b-language).

### Other methods

After studying all the information, you can call and process responses for other liteserver methods using the same principle.

## Additional technical details of the handshake

### Getting key ID
The key id is the SHA256 hash of the serialized TL schema.

The most commonly used TL schemas for the keys are:

```tlb
pub.ed25519 key:int256 = PublicKey -- ID c6b41348
pub.aes key:int256 = PublicKey     -- ID d4adbc2d
pub.overlay name:bytes = PublicKey -- ID cb45ba34
pub.unenc data:bytes = PublicKey   -- ID 0a451fb6
pk.aes key:int256 = PrivateKey     -- ID 3751e8a5
```

As an example, for keys of type ed25519 that are used for handshake, the key ID will be the SHA256 hash from **[0xC6, 0xB4, 0x13, 0x48]** and **public key**, (36 byte array, prefix + key).

[Please see code example](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L16).

### Handshake packet data encryption

The handshake packet is sent in a semi-open form, only 160 bytes are encrypted, containing information about permanent ciphers.

To encrypt them, we need an AES-CTR cipher, to get it we need a SHA256 hash of 160 bytes and [ECDH shared key](#getting-a-shared-key-using-ecdh).

The cipher is built like this:
* key = (0 - 15 bytes of public key) + (16 - 31 bytes of hash)
* iv = (0 - 3 hash bytes) + (20 - 31 public key bytes)

After the cipher is assembled, we encrypt our 160 bytes with it.

[Please see code example](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/connection.go#L361).

### Getting a shared key using ECDH

To calculate the shared key, we need our private key and the server's public key.

The essence of DH is to obtain a shared secret key, without disclosing private information. I will give an example of how this happens, in the most simplified form. Suppose we need to generate a shared key between us and the server, the process will look like this:
* We generate secret and public numbers like **6** and **7**
* The server generates secret and public numbers like **5** and **15**
* We exchange public numbers with the server, send **7** to the server, it sends us **15**.
* We calculate: **7^6 mod 15 = 4**
* The server calculates: **7^5 mod 15 = 7**
* We exchange the received numbers, we give the server **4**, it gives us **7**
* We calculate **7^6 mod 15 = 4**
* The server calculates: **4^5 mod 15 = 4**
* Shared key = **4**

The details of the ECDH itself will be omitted for the sake of simplicity. It is calculated using 2 keys, private and public, by finding a common point on the curve. If interested, it is better to read about it separately.

[Please see code example](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L32).

## References

Here is a [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-TCP-Liteserver.md) - _[Oleg Baranov](https://github.com/xssnick)_.

<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/adnl/adnl-udp.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/adnl/adnl-udp.md
================================================
import Feedback from '@site/src/components/Feedback';

# ADNL UDP - internode

ADNL over UDP is a low-level protocol used by nodes and TON components to communicate with one another. It serves as the foundation for other higher-level TON protocols, such as DHT (Distributed Hash Table) and RLDP (Reliable Large Datagram Protocol).

This article will explain how ADNL over UDP facilitates basic communication between nodes.

Unlike ADNL over TCP, the UDP implementation involves a different form of handshake and includes an additional layer in the form of channels. However, the underlying principles remain similar: encryption keys are generated based on our private key and the peer's public key, which is either known in advance from the configuration or received from other network nodes.

In the UDP version of ADNL, the connection is established simultaneously with the reception of initial data from the peer. If the initiator sends a **create channel** message, the channel’s key will be calculated, and the channel's creation will be confirmed.

Once the channel is established, further communication continues within it.

## Packet structure and communication

### First packets

Let's analyze the connection initialization with the DHT node and obtain a signed list of its addresses to understand how the protocol functions. 

Find a node you prefer in the [global config](https://ton-blockchain.github.io/global.config.json), specifically in the `dht.nodes` section.  For example:

```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

Let's take the ed25519 key, `fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`, and decode it from base64.

Next, we will take its IP address, 1091897261, and convert it into a readable format using [this service](https://www.browserling.com/tools/dec-to-ip) or by converting it to little-endian bytes. This will give us the IP address `65.21.7.173`.

Finally, we will combine this IP address with the port to obtain `65.21.7.173:15813` and establish a UDP connection.

We aim to establish a communication channel with the node to obtain specific information, particularly a list of signed addresses. To achieve this, we will generate two messages. The first message will be to create the channel [(see the code)](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129):

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

We have two parameters to consider: a key and a date. The date will be represented by the current Unix timestamp. For the key, we need to generate a new ed25519 private and public key pair specifically for the channel. This key pair will be used to initialize the public encryption key, as outlined in the [link here](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh). We will use the generated public key as the value for the `key` parameter in the message, while we will store the private key for future use.

Next, we will serialize the populated TL structure to get the final result:

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

Next, let's proceed to our main query - [retrieve a list of addresses](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198). 

To execute it, we first need to serialize its TL structure:

```tlb
dht.getSignedAddressList = dht.Node
```

There are no parameters to consider, so we will simply serialize it. The result will be just its ID: `ed4879a9`.

Next, since this is a higher-level request within the DHT protocol, we must first wrap it in an `adnl.message.query` TL structure:

```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```

We generate a random 32 bytes for `query_id`, and the `query` represents our main request, [wrapped as an array of bytes](/v3/documentation/data-formats/tl#encoding-bytes-array):

```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

### Building the packet

All communication is conducted using packets, which contain the following structure: [TL structure](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81):

```tlb
adnl.packetContents 
  rand1:bytes                                     -- random 7 or 15 bytes
  flags:#                                         -- bit flags, used to determine the presence of fields further
  from:flags.0?PublicKey                          -- sender's public key
  from_short:flags.1?adnl.id.short                -- sender's ID
  message:flags.2?adnl.Message                    -- message (used if there is only one message)
  messages:flags.3?(vector adnl.Message)          -- messages (if there are > 1)
  address:flags.4?adnl.addressList                -- list of our addresses
  priority_address:flags.5?adnl.addressList       -- priority list of our addresses
  seqno:flags.6?long                              -- packet sequence number
  confirm_seqno:flags.7?long                      -- sequence number of the last packet received
  recv_addr_list_version:flags.8?int              -- address version 
  recv_priority_addr_list_version:flags.9?int     -- priority address version
  reinit_date:flags.10?int                        -- connection reinitialization date (counter reset)
  dst_reinit_date:flags.10?int                    -- connection reinitialization date from the last received packet
  signature:flags.11?bytes                        -- signature
  rand2:bytes                                     -- random 7 or 15 bytes
        = adnl.PacketContents
        
```

Once we have serialized all the messages we wish to send, we can begin building the packet.

Packets sent to a channel have a different content structure compared to packets sent before the channel is initialized.

First, let’s examine the main packet used for initialization.

During the initial data exchange, before the channel is established, the packet's serialized content structure is prefixed with the peer's public key, which is 32 bytes.

Our public key is also 32 bytes, and the SHA-256 hash of the serialized TL of the packet's content structure is another 32 bytes.

The content of the packet is encrypted using the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh), which is derived from our private key and the public key of the server.

Let's serialize the structure of our packet content and parse it byte by byte:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 messages   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID [adnl.message.query](/)
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

After serialization, we need to sign the resulting byte array using our private client's key, specifically ed25519, which we generated and saved earlier. 

Once we have created the signature (which is 64 bytes in size), we must add it to the packet and serialize it again. This time, we will also set the 11th bit in the flag to indicate the presence of the signature:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 message   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

We now have an assembled, signed, and serialized packet, which consists of an array of bytes.

Next, we need to calculate the packet's SHA-256 hash, allowing the recipient to verify its integrity later. For instance, let’s say the hash is `408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`.

Now, we will encrypt the contents of our packet using the AES-CTR cipher, utilizing the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh) that is derived from our private key and the peer’s public key (not the channel's key).

We are almost ready to send the packet; we just need to [calculate the ID](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) of the ed25519 peer key and concatenate everything together:


```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- server Key ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- our public key
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 content hash (before encryption)
...                                                               -- encrypted content of the packet
```

We can now send our constructed packet to the peer via UDP and await a response. 

In response, we will receive a packet with a similar structure, but containing different messages. It will consist of:

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- ID of our key
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- server public key, for shared key
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 content hash (before encryption)
...                                                               -- the encrypted content of the packet
```

The process of deserializing the packet from the server is as follows:

* We first check the ID of the key within the packet to confirm that the packet is intended for us.
* Using the server's public key found in the packet along with our private key, we calculate a shared key to decrypt the packet's content.
* We then compare the SHA-256 hash provided to us with the hash obtained from the decrypted data; they must match.
* Finally, we begin deserializing the packet content using the `adnl.packetContents` TL schema.

The content of the packet will look like this:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) random bytes
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (because flag's first bit = 1)
02000000                                                               -- messages (present because flag's third bit = 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (server channel public key)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (our public channel key)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (the answer to our request, we will analyze its content in an article about DHT)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0100000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
94848863                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
ee354563                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
94848863                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) random bytes
```

The server responded with two messages: `adnl.message.confirmChannel` and `adnl.message.answer`.

The `adnl.message.answer` is straightforward; it is the response to our request for `dht.getSignedAddressList`, which we will explore further in the article about DHT.

Now, let’s focus on `adnl.message.confirmChannel`. This indicates that the peer has confirmed the creation of the channel and has sent us its public channel key. With our private channel key and the peer's public channel key, we can compute the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh).

Once we have calculated the shared channel key, we need to derive two keys from it: one for encrypting outgoing messages and another for decrypting incoming messages.

Deriving these two keys is quite simple. The second key is simply the shared key written in reverse order. For example:

```
Shared key : AABB2233

First key: AABB2233
Second key: 3322BBAA
```

We need to determine which key to use for specific purposes. To do this, we can compare the ID of our public key with the ID of the server's public key, converting both to a numerical format (uint256). 

This method ensures that both the server and the client agree on which key is used for what function. If the server uses the first key for encryption, this approach guarantees that the client will always use it for decryption. 

The terms of use are:

```
The server id is smaller than our id:
Encryption: First Key
Decryption: Second Key

The server id is larger than our id:
Encryption: Second Key
Decryption: First Key

If the ids are equal (nearly impossible):
Encryption: First Key
Decryption: First Key
```

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502).

### Communication in a channel

All future packet exchanges will take place within the channel, and the channel keys will be utilized for encryption.

Let's send the same `dht.getSignedAddressList` request within a newly created channel to observe the differences.

We will construct the packet for the channel using the same `adnl.packetContents` structure:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) random bytes
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (because second bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (our dht.getSignedAddressList packed in bytes with padding 3)
0200000000000000                                                       -- seqno (because flag's sixth bit = 1), 2 because it is our second message
0100000000000000                                                       -- confirm_seqno (flag's seventh bit = 1), 1 because it is the last seqno received from the server
07 e4092842a8ae18                                                      -- rand2, 7 (07) random bytes
```

The packets in a channel are quite straightforward and essentially consist of a sequence number (seqno) and the messages themselves. 

After serialization, as we did last time, we calculate the SHA256 hash of the packet. Next, we encrypt the packet using the designated key for outgoing packets in the channel.

To do this we [calculate](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) `pub.aes` - ID of the encryption key for our outgoing messages and then build our packet:

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- ID of encryption key of our outgoing messages 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 content hash (before encryption)
...                                                              -- the encrypted content of the packet
```

We send a packet via UDP and wait for a response. In response, we receive a packet of the same type as the one we sent, containing the answer to our request for `dht.getSignedAddressList`.

## Other message types

For basic communication, messages such as `adnl.message.query` and `adnl.message.answer` are utilized, which we discussed earlier. However, there are also other types of messages used for specific situations, which we will cover in this section.

### adnl.message.part

This message type is part of another possible message type, such as `adnl.message.answer`. This method of data transfer is used when a message is too large to be sent in a single UDP datagram.

```tlb
adnl.message.part 
hash:int256            -- sha256 hash of the original message
total_size:int         -- original message size
offset:int             -- offset according to the beginning of the original message
data:bytes             -- piece of data of the original message
   = adnl.Message;
```

To reconstruct the original message, we need to gather several parts and concatenate them into a single-byte array based on the specified offsets.

 We will then process this array as a message using the ID prefix contained within it.
  

### adnl.message.custom

```tlb
adnl.message.custom data:bytes = adnl.Message;
```

Messages of this type are utilized when the logic at a higher level does not align with the typical request-response format. These messages allow for the complete relocation of processing to a higher level, as they consist solely of an array of bytes without including query IDs or other fields.

For instance, in RLDP, such messages are used since there can be only one response to multiple requests. RLDP itself manages this logic.

Further communication occurs based on the logic outlined in this article, though the content of the packets relies on higher-level protocols like DHT and RLDP.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md) - _[Oleg Baranov](https://github.com/xssnick)._
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/adnl/low-level-adnl.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/adnl/low-level-adnl.md
================================================
import Feedback from '@site/src/components/Feedback';

# Low-level ADNL

Abstract Datagram Network Layer (ADNL) is the core protocol of TON, which helps network peers communicate.

## Peer identity

Each peer must have at least one identity; while it's possible to use multiple identities, it is not required. Each identity consists of a keypair used for performing the Diffie-Hellman exchange between peers. An abstract network address is derived from the public key in the following way: `address = SHA-256(type_id || public_key)`. Note that the `type_id` must be serialized as a little-endian uint32.

## Public-key cryptosystems list

| type_id | cryptosystem |
|------------|---------------------|
| 0x4813b4c6 | ed25519<sup>1</sup> |

* **To perform x25519, the keypair must be generated in "x25519" format. However, the public key is transmitted over the network in ed25519 format, so you have to convert the public key from x25519 to ed25519, examples of such conversions can be found [here](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39) for Kotlin.**

## Client-server protocol (ADNL over TCP)

The client connects to the server using TCP and sends an ADNL handshake packet. This packet contains a server abstract address, a client public key, and encrypted AES-CTR session parameters, which the client determines.

### Handshake

First, the client must perform a key agreement protocol (for example, x25519) using their private key and server public key, taking into account the server key's `type_id`. As a result, the client will gain `secret`, which is used to encrypt session keys in future steps.

Then, the client has to generate AES-CTR session parameters, a 16-byte nonce and 32-byte key, both for TX (client->server) and RX (server->client) directions and serialize it into a 160-byte buffer as follows:

| Parameter | Size |
|--------------|----------|
| rx_key | 32 bytes |
| tx_key | 32 bytes |
| rx_nonce | 16 bytes |
| tx_nonce | 16 bytes |
| padding | 64 bytes |


The purpose of padding is unknown; it is not used by server implementations. It is recommended that the whole 160-byte buffer be filled with random bytes. Otherwise, an attacker may perform an active MitM attack using compromised AES-CTR session parameters.

The next step is to encrypt the session parameters using the `secret` through the key agreement protocol outlined above. To achieve this, AES-256 needs to be initialized in CTR mode with a 128-bit big-endian counter. This will utilize a (key, nonce) pair that is computed as follows (note that `aes_params` is a 160-byte buffer that was created earlier):

```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```

After encrypting `aes_params`, noted as `E(aes_params)`, remove AES as it is no longer needed. We are now ready to serialize all this information into the 256-byte handshake packet and send it to the server.

| Parameter | Size | Notes |
|---------------------|-----------|------------------------------------------------------------|
| receiver_address | 32 bytes | Server peer identity as described in the corresponding section |
| sender_public | 32 bytes | Client public key |
| SHA-256(aes_params) | 32 bytes | Integrity proof of session parameters |
| E(aes_params) | 160 bytes | Encrypted session parameters |

The server must decrypt session parameters using a secret derived from the key agreement protocol, just as the client does. After decryption, the server must perform the following checks to ensure the security properties of the protocol:

- The server must possess the corresponding private key for `receiver_address`. Without this key, it cannot execute the key agreement protocol.

- The condition `SHA-256(aes_params) == SHA-256(D(E(aes_params)))` must hold true. If this condition is not met, it indicates that the key agreement protocol has failed and the `secret` values on both sides are not equal.

If any of these checks fail, the server will immediately drop the connection without responding to the client. If all checks pass, the server must issue an empty datagram (see the [Datagram](#datagram) section) to the client in order to prove that it owns the private key for the specified `receiver_address`.

### Datagram

Both the client and server must initialize two AES-CTR instances each for both transmission (TX) and reception (RX) directions. The AES-256 must be used in CTR mode with a 128-bit big-endian counter. Each AES instance is initialized using a (key, nonce) pair, which can be taken from the `aes_params` during the handshake.

To send a datagram, either the client or the server must construct the following structure, encrypt it, and send it to the other peer:

| Parameter | Size | Notes |
|-----------|----------------------|------------------------------------------------------------|
| length | 4 bytes (LE) | Length of the whole datagram, excluding `length` field |
| nonce | 32 bytes | Random value |
| buffer | `length - 64` bytes | Actual data to be sent to the other side |
| hash | 32 bytes | `SHA-256(nonce \|\| buffer)` to ensure integrity |

The whole structure must be encrypted using the corresponding AES instance (TX for client -> server, RX for server -> client).

The receiving peer must fetch the first 4 bytes, decrypt it into the `length` field, and read exactly the `length` bytes to get the full datagram. The receiving peer may start to decrypt and process `buffer` earlier, but it must take into account that it may be corrupted, intentionally or occasionally. Datagram `hash` must be checked to ensure the integrity of the `buffer`. In case of failure, no new datagrams can be issued and the connection must be dropped.

The first datagram in the session always goes from the server to the client after a handshake packet is successfully accepted by the server and its actual buffer is empty. The client should decrypt it and disconnect from the server in case of failure because it means that the server has not followed the protocol properly and the actual session keys differ on the server and client side.

### Communication details

If you want to dive into communication details, you could check the article [ADNL TCP - liteserver](/v3/documentation/network/protocols/adnl/adnl-tcp) to see some examples.

### Security considerations

#### Handshake padding

It is unknown why the initial TON team decided to include this field in the handshake. `aes_params` integrity is protected by a SHA-256 hash, and confidentiality is protected by the key derived from the `secret` parameter. Probably, it was intended to migrate from AES-CTR at some point. To do this, the specification may be extended to include a special magic value in `aes_params`, which will signal that the peer is ready to use the updated primitives. The response to such a handshake may be decrypted twice, with new and old schemes, to clarify which scheme the other peer is actually using.

#### Session parameters encryption key derivation process

If an encryption key is derived only from the `secret` parameter, it will be static because the secret is static. To derive a new encryption key for each session, developers also use `SHA-256(aes_params)`, which is random if `aes_params` is random. However, the actual key derivation algorithm with the concatenation of different subarrays is considered harmful.

#### Datagram nonce

The purpose of the `nonce` field in the datagram may not be immediately clear. Even without it, any two ciphertexts will differ due to the session-bounded keys used in AES and the encryption method in CTR mode. However, if a nonce is absent or predictable, a potential attack can occur. 

In CTR encryption mode, block ciphers like AES function as stream ciphers, allowing for bit-flipping attacks. If an attacker knows the plaintext corresponding to an encrypted datagram, they can create an exact key stream and XOR it with their own plaintext, effectively replacing the original message sent by a peer. Although buffer integrity is protected by a hash (referred to here as SHA-256), an attacker can still manipulate it because if they know the entire plaintext, they can also compute its hash. 

The nonce field is crucial for preventing such attacks, as it ensures that an attacker cannot replace the SHA-256 without also having access to the nonce.

## P2P protocol (ADNL over UDP)

A detailed description can be found in the article [ADNL UDP - internode](/v3/documentation/network/protocols/adnl/adnl-udp).

## References

- [The Open Network, p. 80](https://ton.org/whitepaper.pdf#80)

- [ADNL implementation in TON](https://github.com/ton-blockchain/ton/tree/master/adnl)

_Thanks to the [hacker-volodya](https://github.com/hacker-volodya) for contributing to the community!_
_Here a [link to the original article](https://github.com/tonstack/ton-docs/tree/main/ADNL) on GitHub._
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/adnl/overview.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/adnl/overview.md
================================================
import Feedback from '@site/src/components/Feedback';

# ADNL protocol

Please see the [**implementation**](https://github.com/ton-blockchain/ton/tree/master/adnl) first.

## Overview

The Abstract Datagram Network Layer (ADNL) is a fundamental component of the TON. 

ADNL is an overlay, peer-to-peer, unreliable (small-size) datagram protocol that operates over **UDP** in **IPv4**, with plans to support **IPv6** in the future. Additionally, it has an optional **TCP fallback** for instances when UDP is unavailable.

## ADNL address

Each participant in the network possesses a 256-bit ADNL Address.

The ADNL Protocol enables the sending and receiving of datagrams using only ADNL Addresses, concealing the underlying IP Addresses and Ports.

An ADNL Address effectively functions as a 256-bit ECC public key, which can be generated arbitrarily, allowing for the creation of multiple network identities as needed by the node.

However, the corresponding private key must be known to receive and decrypt messages intended for a specific address.

In practice, the ADNL Address is not the public key itself; rather, it is a 256-bit SHA256 hash of a serialized TL object. Depending on its constructor, this TL object can represent various types of public keys and addresses.

## Encryption and security

Typically, each datagram sent is signed by the sender and encrypted so that only the intended recipient can decrypt the message and verify its integrity using the signature.

## Neighbor tables

A TON ADNL node will typically maintain a **neighbor table** that contains information about other known nodes, including their abstract addresses, public keys, IP addresses, and UDP ports. Over time, this table expands with information gathered from these known nodes, which may come from responses to specific queries or by removing outdated records.

ADNL facilitates the establishment of point-to-point channels and tunnels (chains of proxies).

A TCP-like stream protocol can be constructed on top of ADNL.

## What's next?

* To learn more about ADNL, refer to the [Low-level ADNL documentation](/v3/documentation/network/protocols/adnl/low-level-adnl).
* See Chapter 3.1 of the [TON Whitepaper](https://docs.ton.org/ton.pdf).
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/dht/dht-deep-dive.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/dht/dht-deep-dive.md
================================================
import Feedback from '@site/src/components/Feedback';

# DHT

DHT stands for Distributed Hash Table, which is a type of distributed key-value database. In this system, each member of the network can store information, such as details about themselves.

The implementation of DHT in TON is similar to the [Kademlia](https://codethechange.stanford.edu/guides/guide_kademlia.html) protocol, which is also used in IPFS.

Any network participant can operate a DHT node, generate keys, and store data. To do this, they need to create a random ID and inform other nodes about their presence.

An algorithm determines the "distance" between the node and the key, which helps identify which node should store the data. The algorithm is straightforward: it takes the node's ID and the key's ID and performs the `XOR` operation. A smaller resulting value indicates a closer proximity between the node and the key.

The goal is to store the key on nodes that are as close as possible to the key so that other network participants can, using the same algorithm, easily locate a node that can provide data associated with that key.

## Finding a value by key

Let's examine an example involving a search for a key: [connect to any DHT node and establish a connection via ADNL UDP](/v3/documentation/network/protocols/adnl/adnl-udp#packet-structure-and-communication).

Suppose we want to find the address and public key needed to connect to the node hosting the `foundation.ton` site.

Assuming we have already obtained this site's ADNL address by executing the "get method" of the DNS contract, the ADNL address in hexadecimal format is `516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174`.

Our objective is to determine the IP address, port number, and public key of the node associated with this address.

To achieve this, we first need to get the ID of the DHT key. We will begin by populating the DHT key schema:

```tlb
dht.key id:int256 name:bytes idx:int = dht.Key
```

The term `name` refers to the type of key. For ADNL addresses, the term `address` is used. For instance, when searching for ShardChain nodes, the term `nodes` is used. However, the key type can vary and may consist of any array of bytes, depending on the specific value you are seeking.

By applying this schema, we get:

```
8fde67f6                                                           -- TL ID dht.key
516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174   -- our searched ADNL address
07 61646472657373                                                  -- key type, the word "address" as an TL array of bytes
00000000                                                           -- index 0 because there is only 1 key
```

Next, retrieve the key ID and the SHA256 hash from the bytes serialized above. It will be `b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75`. 

Now we can begin our search. To do this, we need to execute a query that has [schema](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L197):

```tlb
dht.findValue key:int256 k:int = dht.ValueResult
```

The `key` represents the ID of our DHT key, while `k` indicates the "width" of the search. A smaller value for `k` results in a more accurate search but limits the number of potential nodes to query. In a TON, the maximum value for `k` is 10, although 6 is typically used.

Now, let's populate this structure, serialize it, and send the request using the `adnl.message.query` schema. For more details, please refer to the documentation [here](/v3/documentation/network/protocols/adnl/adnl-udp#packet-structure-and-communication).

In response, we can get:

* `dht.valueNotFound` - if the value is not found.
* `dht.valueFound` - if the value is found on this node.

### dht.valueNotFound

If we receive `dht.valueNotFound`, the response will include a list of nodes that are known to the node we queried and as close as possible to the key we requested. In this situation, we need to connect to these received nodes and add them to our list of known nodes.

Afterwards, we will select the closest, accessible nodes that have not yet been queried from our entire list of known nodes and send the same request to one of them. We will continue this process until we have tried all the nodes within our chosen range or until we stop receiving new nodes.

Now, let's take a closer look at the fields in the response and the schemas that are used:

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.node id:PublicKey addr_list:adnl.addressList version:int signature:bytes = dht.Node;
dht.nodes nodes:(vector dht.node) = dht.Nodes;

dht.valueNotFound nodes:dht.nodes = dht.ValueResult;
```

`dht.nodes -> nodes` -  list of DHT nodes (array).

Each node has an `id`, which serves as its public key, typically represented as [pub.ed25519](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L47). This key is used to connect to the node via ADNL. Additionally, each node contains a list of addresses, `addr_list:adnl.addressList`, along with its version and signature.

We need to verify the signature of each node. To do this, we first read the value of the `signature` field and then set it to zero, effectively making it an empty byte array. Next, we serialize the TL structure `dht.node` using this empty signature and check the `signature` field that we emptied earlier.

We validate the serialized bytes using the public key from the `id` field. [[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91).

From the list `addrs:(vector adnl.Address)`, we select an address and attempt to establish an ADNL UDP connection, using `id` (the public key) as the server key.

To determine the "distance" to this node, we retrieve the [key ID](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) from the `id` field and calculate the distance using the `XOR` operation between the node's key ID and the desired key. If the distance is small enough, we can make the same request to this node. This process continues until we find a value or run out of new nodes.

### dht.valueFound

The response will include the value itself, complete key information, and optionally a signature, depending on the value type.


Let's analyze the response fields in more detail, the schemas used:

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.key id:int256 name:bytes idx:int = dht.Key;

dht.updateRule.signature = dht.UpdateRule;
dht.updateRule.anybody = dht.UpdateRule;
dht.updateRule.overlayNodes = dht.UpdateRule;

dht.keyDescription key:dht.key id:PublicKey update_rule:dht.UpdateRule signature:bytes = dht.KeyDescription;

dht.value key:dht.keyDescription value:bytes ttl:int signature:bytes = dht.Value; 

dht.valueFound value:dht.Value = dht.ValueResult;
```

Let's determine `key:dht.keyDescription`. This provides a complete description of the key, including the key itself and information about who can update its value and how.

* `key:dht.key` - the key must match the one from which we took the key ID for the search.
* `id:PublicKey` - the public key of the record owner.
* `update_rule:dht.UpdateRule` - record update rule.
  * `dht.updateRule.signature` - only the owner of the private key can update the record, the `signature` of both the key and the value must be valid
  * `dht.updateRule.anybody` - everyone can update the record, `signature` is empty and not checked
  * `dht.updateRule.overlayNodes` - nodes from the same overlay can update the key, used to find nodes of the same overlay and add yourself

### dht.updateRule.signature

After reviewing the key's description, we proceed based on the `updateRule`. In the ADNL address lookup, the type is always `dht.updateRule.signature`.

We verify the key signature in the same manner as before. First, we set the signature to an empty byte array, serialize it, and perform the necessary checks. Next, we repeat this process for the entire `dht.value` object while ensuring that the key signature is restored to its original state.

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L331).

### dht.updateRule.overlayNodes

Used for keys that contain information about other nodes, shards of the WorkChain in the network, the value always follows the TL structure `overlay.nodes`. 

The value field must be empty.

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;
```

To check for validity, we must check all `nodes` and for each check `signature` against its `id` by serializing the TL structure:

```tlb
overlay.node.toSign id:adnl.id.short overlay:int256 version:int = overlay.node.ToSign;
```

We should replace the `id` with `adnl.id.short`, which is the key identifier (hash) from the original structure's `id` field. After serialization, we will verify the signature against the data.

As a result, we obtain a valid list of nodes that can provide information about the required WorkChain shard.

### dht.updateRule.anybody

There are no signatures required; anyone can make updates.

### Using a value

Once everything has been verified and the `ttl:int` value has not expired, we can begin working with the value itself, specifically `value:bytes`. For an ADNL address, this will include an `adnl.addressList` structure. 

This structure will contain the IP addresses and ports of the servers corresponding to the requested ADNL address. In our case, we will most likely have one RLDP-HTTP address associated with the `foundation.ton` service.

We will use the public key, `id:PublicKey`, from the DHT key information as the server key.

After establishing the connection, we can request the site's pages using the RLDP protocol. At this stage, the task from the DHT perspective is complete.

### Search for nodes that store the state of the blockchain

DHT is also used to locate information about the nodes storing the data of WorkChains and their shards. The process for retrieving this information is similar to searching for any key; however, the key serialization and response validation differ. We will examine these aspects in this section.

To retrieve data, such as that of the MasterChain and its shards, we need to complete the TL structure:

```
tonNode.shardPublicOverlayId workchain:int shard:long zero_state_file_hash:int256 = tonNode.ShardPublicOverlayId;
```

In the context of a MasterChain, the `workchain` value will be set to `-1`. The corresponding shard will be represented as `-922337203685477580 (0xFFFFFFFFFFFFFFFF)`. Additionally, the `zero_state_file_hash` refers to the hash of the chain’s zero state (file_hash). Like other data, this can be obtained from the global network configuration in the `validator` field.

```json
"zero_state": {
  "workchain": -1,
  "shard": -9223372036854775808, 
  "seqno": 0,
  "root_hash": "F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=",
  "file_hash": "XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24="
}
```

Once we fill in `tonNode.shardPublicOverlayId`, we will serialize it and obtain the key ID by hashing, as we normally do.

Next, we use this key ID as the `name` to populate the `pub.overlay name:bytes = PublicKey` structure, wrapping it in a TL bytes array. After serialization, we will retrieve the key ID again from this structure.

This resulting ID will serve as the key for the command:

```bash
dht.findValue
```

In this command, the `name` field will have the value `nodes`. We will repeat the process from the previous section; everything remains the same as before, but this time the `updateRule` will be set to [dht.updateRule.overlayNodes](#dhtupdateruleoverlaynodes).

After the validation process, we will obtain the public keys (IDs) of the nodes that have information about our workchain and shard. To access the ADNL addresses of these nodes, we will hash the keys to create IDs and repeat the same procedure for each ADNL address, similar to how we did for the `foundation.ton` domain.

As a result, we will have the addresses of the nodes. If desired, we can use these addresses to discover additional nodes within the same chain using [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237).

These nodes will also provide us with all the information regarding the blocks.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md) - _[Oleg Baranov](https://github.com/xssnick)._
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/dht/ton-dht.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/dht/ton-dht.md
================================================
import Feedback from '@site/src/components/Feedback';

# TON DHT service

Please see the implementations:

* [DHT](https://github.com/ton-blockchain/ton/tree/master/dht)
* [DHT Server](https://github.com/ton-blockchain/ton/tree/master/dht-server)

## Overview

The Kademlia-like Distributed Hash Table (DHT) plays a crucial role in the networking aspect of the TON project, enabling the discovery of other nodes within the network.

The keys used in the TON DHT are 256-bit integers, often derived from a SHA256 of a TL-serialized object.

The values associated with these 256-bit keys are essentially arbitrary byte strings of limited length. The meaning of these byte strings is determined by the pre-image of the corresponding key; this is typically known by both the node performing the key lookup and the node storing the key.

In its simplest form, the key represents an ADNL address of a node, while the value could be its IP address and port.

The key-value mappings of the TON DHT are maintained on the DHT nodes.

## DHT nodes

Each DHT node has a 256-bit DHT address. Unlike an ADNL address, a DHT address should not change too frequently; otherwise, other nodes will be unable to locate the keys they are searching for.

The value of key `K` is expected to be stored on the `S` Kademlia-nearest nodes to `K`.

Kademlia distance is calculated by performing a 256-bit `XOR` operation between the key `X` and the 256-bit DHT node address. This distance does not relate to geographic location.

`S` is a small parameter, for instance, `S = 7`, which helps improve the reliability of the DHT. If the key were stored only on a single node (the nearest one to `K`) the value of that key would be lost if that node were to go offline.
 
## Kademlia routing table

A node participating in a DHT typically maintains a Kademlia routing table.

This table consists of 256 buckets, numbered from 0 to 255. The `i`-th bucket contains information about known nodes that lie within a Kademlia distance from `2^i` to `2^(i+1) − 1` from the node’s address `a`. Each bucket holds a fixed number of the “best” nodes, along with some additional candidate nodes.

The information stored in these buckets includes the DHT addresses, IP addresses, UDP ports, and availability details, such as the time and delay of the last ping.

When a Kademlia node discovers another Kademlia node through a query, it places that node into the appropriate bucket as a candidate. If some of the “best” nodes in that bucket become unresponsive (for example, if they do not reply to ping queries for an extended period), they can be replaced by some of these candidates. This process ensures that the Kademlia routing table remains populated.

## Key-value pairs

Key-value pairs can be added and updated in the TON DHT. The rules for these updates can vary. In some cases, they allow for the old value to be replaced with a new one as long as the new value is signed by the owner or creator. This signature must be retained as part of the value so that it can be verified later by any other nodes that receive this key's value.

In other cases, the old value impacts the new value in some way. For example, the old value may contain a sequence number, and it can only be overwritten if the new sequence number is larger. This helps prevent replay attacks.

The TON DHT is not only used to store the IP addresses of ADNL nodes; it also serves other purposes. It can store a list of addresses of nodes that are holding a specific torrent in TON Storage, a list of addresses of nodes included in an overlay subnetwork, ADNL addresses of TON services, and ADNL addresses of accounts on the TON Blockchain, among others.

:::info
Learn more about TON DHT in [DHT](/v3/documentation/network/protocols/dht/dht-deep-dive) documentation, or in Chapter 3.2. of the [TON Whitepaper](https://docs.ton.org/ton.pdf).
:::
<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/overlay.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/overlay.md
================================================
import Feedback from '@site/src/components/Feedback';

# Overlay subnetworks

Please see the implementation:

* [Overlay](https://github.com/ton-blockchain/ton/tree/master/overlay)

## Overview


The architecture of the TON is designed to support multiple chains that can operate simultaneously and independently, whether they are private or public. Nodes have the flexibility to choose which shards and chains they store and process.

Despite this variability, the communication protocol remains consistent due to its universal nature. Protocols such as DHT (Distributed Hash Table), RLDP (Reliable Layered Datagram Protocol), and overlays facilitate this functionality.

We are already familiar with the first two protocols; in this section, we will focus on overlays.

Overlays are responsible for partitioning a single network into additional subnetworks. These overlays can be public, allowing anyone to connect, or private, requiring specific credentials for access, which are known only to a limited group of individuals. All chains in the TON ecosystem, including the MasterChain, communicate using their respective overlays. To join an overlay, a node must locate other nodes that are already part of it and begin exchanging data with them.

For public overlays, you can discover nodes using the DHT protocol.

## ADNL vs overlay networks

In contrast to ADNL, TON overlay networks typically do not allow the sending of datagrams to arbitrary nodes. Instead, they establish "semi-permanent links" between specific nodes, known as "neighbors," within the overlay network. Messages are usually forwarded along these links, meaning communication happens from one node to one of its neighbors.

Each overlay subnetwork is assigned a 256-bit network identifier, which is usually equivalent to a SHA256 that describes the overlay network as a TL-serialized object.

Overlay subnetworks can either be public or private.

These subnetworks operate using a special [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

## Interaction with overlay nodes

We have already analyzed an example of finding overlay nodes in an article about Distributed Hash Tables (DHT). This was discussed in the section titled [Search for nodes that store the state of the blockchain](/v3/documentation/network/protocols/dht/dht-deep-dive#search-for-nodes-that-store-the-state-of-the-blockchain).

In this section, we will focus on how to interact with these nodes.

When querying the DHT, we will retrieve the addresses of the overlay nodes. From these addresses, we can discover the addresses of additional nodes within the overlay by using the [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237) query.

After connecting to a sufficient number of nodes, we will be able to receive information about all blocks and other chain events from them. Additionally, we can send our transactions to these nodes for processing.

### Find more neighbors

To retrieve nodes in an overlay, send a request `overlay.getRandomPeers` to any known node. 

Make sure to serialize the TL schema:

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

The `peers` array should include the peers we are aware of so that we do not receive messages from them again. Since we currently do not know any peers, `peers.nodes` will initially be an empty array.

If we want to retrieve information, participate in the overlay, and receive broadcasts, we need to include information about our own node in the `peers` array during the request. Once the peers are aware of our presence, they will begin to send us broadcasts using ADNL or RLDP.

Additionally, each request made within the overlay must be prefixed with the TL schema:

```tlb
overlay.query overlay:int256 = True;
```

The `overlay` should be the overlay's ID, specifically the ID of the `tonNode.ShardPublicOverlayId` schema key, which we also used to search the DHT.

To combine two serialized schemas, we should concatenate two serialized byte arrays: `overlay.query` will come first, followed by `overlay.getRandomPeers`.

We then wrap the resulting array in the `adnl.message.query` schema and send it via ADNL. In response, we expect `overlay.nodes`, which will be a list of overlay nodes that we can connect to. If necessary, we can repeat the request to any new nodes until we acquire enough connections.

### Functional requests

Once the connection is established, we can access the overlay nodes using `tonNode.*` via the [requests](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413). 

We utilize the RLDP protocol for these types of requests. It's crucial to remember that every query in the overlay must begin with the `overlay.query` prefix. 

The requests themselves are quite standard and resemble those we discussed in the article about ADNL TCP found [here](/v3/documentation/network/protocols/adnl/adnl-tcp#getmasterchaininfo).

For example, the `downloadBlockFull` request follows the familiar block ID schema:

```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```

By passing this step, we can download complete information about the block, and in response, we will receive:

```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
  or
tonNode.dataFullEmpty = tonNode.DataFull;
```

If the `block` field is present, it will contain data in TL-B format.

This allows us to receive information directly from the nodes.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md) - _[Oleg Baranov](https://github.com/xssnick)._

<Feedback />




================================================
FILE: docs/v3/documentation/network/protocols/rldp.md
URL: https://github.com/ton-community/ton-docs/blob/main/docs/v3/documentation/network/protocols/rldp.md
================================================
import Feedback from '@site/src/components/Feedback';

# RLDP

Please see the implementations:

* [RLDP Part 1](https://github.com/ton-blockchain/ton/tree/master/rldp)
* [RLDP Part 2](https://github.com/ton-blockchain/ton/tree/master/rldp2)
* [RLDP HTTP Proxy](https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy)

## Overview

The Reliable Large Datagram Protocol (RLDP) operates on top of the ADNL UDP protocol and is designed for transferring large data blocks. It incorporates Forward Error Correction (FEC) algorithms, which allow it to replace acknowledgment packets typically sent from the receiver back to the sender.

This capability enables more efficient data transfer between network components, although it results in increased traffic consumption.

RLDP plays a crucial role throughout the TON infrastructure. It is used for various purposes, such as downloading blocks from other nodes, transferring data to those nodes, and accessing TON websites and TON Storage.

## Protocol

RLDP utilizes the following TL structures for communication:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

The serialized structure is encapsulated in the `adnl.message.custom` TL schema and transmitted over ADNL UDP.