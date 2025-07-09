# GitHub Docs Parser - Part 13

        });
    }
    sendCancelSale(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(3, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendBuy(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)().
                    storeUint(params.queryId || 0, 32).
                    endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getSaleData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_sale_data', []);
            // pops out saleType
            stack.pop();
            return {
                // saleType: stack.readBigNumber(),
                isComplete: stack.readBigNumber(),
                createdAt: stack.readBigNumber(),
                marketplaceAddress: stack.readAddressOpt(),
                nftAddress: stack.readAddressOpt(),
                nftOwnerAddress: stack.readAddressOpt(),
                fullPrice: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddressOpt(),
                marketplaceFee: stack.readBigNumber(),
                royaltyAddress: stack.readAddressOpt(),
                royaltyAmount: stack.readBigNumber()
            };
        });
    }
}
exports.NftFixedPriceV2 = NftFixedPriceV2;
function buildNftFixPriceSaleV2DataCell(data) {
    let feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeAddress(data.marketplaceFeeAddress);
    feesCell.storeCoins(data.marketplaceFee);
    feesCell.storeAddress(data.royaltyAddress);
    feesCell.storeCoins(data.royaltyAmount);
    let dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeUint(data.isComplete ? 1 : 0, 1);
    dataCell.storeUint(data.createdAt, 32);
    dataCell.storeAddress(data.marketplaceAddress);
    dataCell.storeAddress(data.nftAddress);
    dataCell.storeAddress(data.nftOwnerAddress);
    dataCell.storeCoins(data.fullPrice);
    dataCell.storeRef(feesCell);
    return dataCell.endCell();
}
exports.buildNftFixPriceSaleV2DataCell = buildNftFixPriceSaleV2DataCell;
// Data
exports.NftFixPriceSaleV2CodeBoc = 'te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=';
exports.NftFixPriceSaleV2CodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftFixPriceSaleV2CodeBoc, 'base64'))[0];
//# sourceMappingURL=NftFixedPriceV2.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPriceV2.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPriceV2.js.map
================================================
{"version":3,"file":"NftFixedPriceV2.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftFixedPriceV2.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,eAAe;IACxB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,eAAe,CACtB,OAAO,CACN,CAAC;IACV,CAAC;IAED,MAAM,CAAO,gBAAgB,CACzB,MAA6B;;YAG7B,IAAI,IAAI,GAAG,8BAA8B,CAAC,MAAM,CAAC,CAAC;YAClD,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,iCAAyB;gBAC/B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,eAAe,CACtB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,iCAAyB;gBAC/B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,SAAS,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGxD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,cAAc,CAAC,QAA0B,EAAE,GAAW,EAAE,MAG7D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,OAAO,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGtD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;oBACb,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;oBAClC,OAAO,EAAE;gBACb,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,WAAW,CAAC,QAA0B;;YACxC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;YAEzD,oBAAoB;YACpB,KAAK,CAAC,GAAG,EAAE,CAAA;YAEX,OAAO;gBACH,mCAAmC;gBACnC,UAAU,EAAE,KAAK,CAAC,aAAa,EAAE;gBACjC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,kBAAkB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC1C,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;gBAClC,eAAe,EAAE,KAAK,CAAC,cAAc,EAAE;gBACvC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,qBAAqB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC7C,cAAc,EAAE,KAAK,CAAC,aAAa,EAAE;gBACrC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,aAAa,EAAG,KAAK,CAAC,aAAa,EAAE;aACxC,CAAA;QACL,CAAC;KAAA;CACJ;AAxGD,0CAwGC;AAiBD,SAAgB,8BAA8B,CAAC,IAA2B;IAEtE,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA;IACjD,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IACxC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IAC1C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,aAAa,CAAC,CAAA;IAEvC,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA;IAC9C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,SAAS,EAAE,EAAE,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAA;IAC9C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,eAAe,CAAC,CAAA;IAC3C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA;IACnC,QAAQ,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAA;IAE3B,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AApBD,wEAoBC;AAED,OAAO;AAEM,QAAA,wBAAwB,GAAG,0vBAA0vB,CAAA;AAErxB,QAAA,yBAAyB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,gCAAwB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPriceV3.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPriceV3.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftFixPriceSaleV3CodeCell = exports.buildNftFixPriceSaleV3DataCell = exports.NftFixedPriceV3 = void 0;
const ton_core_1 = require("ton-core");
class NftFixedPriceV3 {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftFixedPriceV3(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftFixPriceSaleV3DataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftFixPriceSaleV3CodeCell,
                data: data
            });
            return new NftFixedPriceV3(address, 0, {
                code: exports.NftFixPriceSaleV3CodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCoins(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(1, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendCancelSale(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(3, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendBuy(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)().endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getSaleData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_sale_data', []);
            // pops out saleType
            stack.pop();
            return {
                // saleType: stack.readBigNumber(),
                isComplete: stack.readBigNumber(),
                createdAt: stack.readBigNumber(),
                marketplaceAddress: stack.readAddressOpt(),
                nftAddress: stack.readAddressOpt(),
                nftOwnerAddress: stack.readAddressOpt(),
                fullPrice: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddressOpt(),
                marketplaceFee: stack.readBigNumber(),
                royaltyAddress: stack.readAddressOpt(),
                royaltyAmount: stack.readBigNumber()
            };
        });
    }
}
exports.NftFixedPriceV3 = NftFixedPriceV3;
function buildNftFixPriceSaleV3DataCell(data) {
    const feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeAddress(data.marketplaceFeeAddress);
    feesCell.storeCoins(data.marketplaceFee);
    feesCell.storeAddress(data.royaltyAddress);
    feesCell.storeCoins(data.royaltyAmount);
    const dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeUint(data.isComplete ? 1 : 0, 1);
    dataCell.storeUint(data.createdAt, 32);
    dataCell.storeAddress(data.marketplaceAddress);
    dataCell.storeAddress(data.nftAddress);
    dataCell.storeAddress(data.nftOwnerAddress);
    dataCell.storeCoins(data.fullPrice);
    dataCell.storeRef(feesCell);
    dataCell.storeUint(data.canDeployByExternal ? 1 : 0, 1); // can_deploy_by_external
    return dataCell.endCell();
}
exports.buildNftFixPriceSaleV3DataCell = buildNftFixPriceSaleV3DataCell;
// Data
const NftFixPriceSaleV3CodeBoc = 'te6cckECDAEAAqAAART/APSkE/S88sgLAQIBIAMCAH7yMO1E0NMA0x/6QPpA+kD6ANTTADDAAY4d+ABwB8jLABbLH1AEzxZYzxYBzxYB+gLMywDJ7VTgXweCAP/+8vACAUgFBABXoDhZ2omhpgGmP/SB9IH0gfQBqaYAYGGh9IH0AfSB9ABhBCCMkrCgFYACqwECAs0IBgH3ZghA7msoAUmCgUjC+8uHCJND6QPoA+kD6ADBTkqEhoVCHoRagUpBwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhdQRXCAEMjLBVADzxYB+gLLaslx+wAQI5I0NOJacIAQyMsFUAPPFgH6AstqyXH7AHAgghBfzD0UgcAlsjLHxPLPyPPFlADzxbKAIIJycOA+gLKAMlxgBjIywUmzxZw+gLLaszJgwb7AHFVUHAHyMsAFssfUATPFljPFgHPFgH6AszLAMntVAP10A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppgBgYOCmE44BgAEwthGmP6Z+lVW8Q4AHxgRDAgRXdFOAA2CnT44LYTwhWL4ZqGGhpg+oYAP2AcBRgAPloyhJrpOEBWfGBHByUYABOGxuIHCOyiiGYOHgC8BRgAMCwoJAC6SXwvgCMACmFVEECQQI/AF4F8KhA/y8ACAMDM5OVNSxwWSXwngUVHHBfLh9IIQBRONkRW68uH1BPpAMEBmBXAHyMsAFssfUATPFljPFgHPFgH6AszLAMntVADYMTc4OYIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxXLPyfPFifPFhTKACP6AhPKAMmAQPsAcVBmRRUEcAfIywAWyx9QBM8WWM8WAc8WAfoCzMsAye1UM/Vflw==';
exports.NftFixPriceSaleV3CodeCell = ton_core_1.Cell.fromBoc(Buffer.from(NftFixPriceSaleV3CodeBoc, 'base64'))[0];
//# sourceMappingURL=NftFixedPriceV3.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftFixedPriceV3.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftFixedPriceV3.js.map
================================================
{"version":3,"file":"NftFixedPriceV3.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftFixedPriceV3.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,eAAe;IACxB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,eAAe,CACtB,OAAO,CACN,CAAC;IACV,CAAC;IAGD,MAAM,CAAO,gBAAgB,CACzB,MAA6B;;YAG7B,IAAI,IAAI,GAAG,8BAA8B,CAAC,MAAM,CAAC,CAAC;YAClD,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,iCAAyB;gBAC/B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,eAAe,CACtB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,iCAAyB;gBAC/B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,SAAS,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGxD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,cAAc,CAAC,QAA0B,EAAE,GAAW,EAAE,MAG7D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,OAAO,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGtD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;gBAC3B,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,WAAW,CAAC,QAA0B;;YACxC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;YAEzD,oBAAoB;YACpB,KAAK,CAAC,GAAG,EAAE,CAAA;YAEX,OAAO;gBACH,mCAAmC;gBACnC,UAAU,EAAE,KAAK,CAAC,aAAa,EAAE;gBACjC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,kBAAkB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC1C,UAAU,EAAE,KAAK,CAAC,cAAc,EAAE;gBAClC,eAAe,EAAE,KAAK,CAAC,cAAc,EAAE;gBACvC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,qBAAqB,EAAE,KAAK,CAAC,cAAc,EAAE;gBAC7C,cAAc,EAAE,KAAK,CAAC,aAAa,EAAE;gBACrC,cAAc,EAAE,KAAK,CAAC,cAAc,EAAE;gBACtC,aAAa,EAAG,KAAK,CAAC,aAAa,EAAE;aACxC,CAAA;QACL,CAAC;KAAA;CACJ;AAvGD,0CAuGC;AAkBC,SAAgB,8BAA8B,CAAC,IAA2B;IACxE,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE5B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA;IACjD,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IACxC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IAC1C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,aAAa,CAAC,CAAA;IAEvC,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE5B,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA;IAC9C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,SAAS,EAAE,EAAE,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAA;IAC9C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,eAAe,CAAC,CAAA;IAC3C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA;IACnC,QAAQ,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAA;IAC3B,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,mBAAmB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA,CAAC,yBAAyB;IAEjF,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC3B,CAAC;AApBD,wEAoBC;AAGH,OAAO;AAEP,MAAM,wBAAwB,GAC5B,05BAA05B,CAAA;AAE/4B,QAAA,yBAAyB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,wBAAwB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftItem.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftItem.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftItemCodeCell = exports.NftItemCodeBoc = exports.buildNftItemDataCell = exports.NftItem = void 0;
const ton_core_1 = require("ton-core");
class NftItem {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftItem(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftItemDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftItemCodeCell,
                data: data
            });
            return new NftItem(address, 0, {
                code: exports.NftItemCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendTransfer(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x5fcc3d14, 32)
                    .storeUint(params.queryId, 64)
                    .storeAddress(params.newOwner)
                    .storeAddress(params.responseDestination)
                    .storeMaybeRef(params.customPayload)
                    .storeCoins(params.forwardAmount)
                    .storeMaybeRef(params.forwardPayload)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendGetStaticData(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x2fcb26a2, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendGetRoyaltyParams(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x693d3950, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTransferEditorship(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x1c04412a, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeAddress(params.newEditor)
                    .storeAddress(params.responseTo)
                    .storeBit(false)
                    .storeCoins(params.forwardAmount || 0)
                    .storeBit(false)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getNftData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_data', []);
            return {
                init: stack.readBoolean(),
                index: stack.readBigNumber(),
                collectionAddress: stack.readAddressOpt(),
                ownerAddress: stack.readAddressOpt(),
                individualContent: stack.readCellOpt(),
            };
        });
    }
}
exports.NftItem = NftItem;
function buildNftItemDataCell(data) {
    let dataCell = (0, ton_core_1.beginCell)();
    let contentCell = (0, ton_core_1.beginCell)();
    // contentCell.bits.writeString(data.content)
    contentCell.storeBuffer(Buffer.from(data.content));
    dataCell.storeUint(data.index, 64);
    dataCell.storeAddress(data.collectionAddress);
    dataCell.storeAddress(data.ownerAddress);
    dataCell.storeRef(contentCell);
    return dataCell.endCell();
}
exports.buildNftItemDataCell = buildNftItemDataCell;
// Data
exports.NftItemCodeBoc = 'te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu';
exports.NftItemCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftItemCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftItem.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftItem.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftItem.js.map
================================================
{"version":3,"file":"NftItem.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftItem.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,OAAO;IAChB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,OAAO,CACd,OAAO,CACV,CAAC;IACN,CAAC;IAGD,MAAM,CAAO,gBAAgB,CACzB,MAAmB;;YAGnB,IAAI,IAAI,GAAG,oBAAoB,CAAC,MAAM,CAAC,CAAC;YACxC,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,uBAAe;gBACrB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,OAAO,CACd,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,uBAAe;gBACrB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,YAAY,CAAC,QAA0B,EAAE,GAAW,EAAE,MAQ3D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,QAAQ,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,mBAAmB,CAAC;qBACxC,aAAa,CAAC,MAAM,CAAC,aAAa,CAAC;qBACnC,UAAU,CAAC,MAAM,CAAC,aAAa,CAAC;qBAChC,aAAa,CAAC,MAAM,CAAC,cAAc,CAAC;qBACpC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,iBAAiB,CACnB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,oBAAoB,CACtB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,sBAAsB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAMrE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,YAAY,CAAC,MAAM,CAAC,SAAS,CAAC;qBAC9B,YAAY,CAAC,MAAM,CAAC,UAAU,CAAC;qBAC/B,QAAQ,CAAC,KAAK,CAAC;qBACf,UAAU,CAAC,MAAM,CAAC,aAAa,IAAI,CAAC,CAAC;qBACrC,QAAQ,CAAC,KAAK,CAAC;qBACf,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,UAAU,CAAC,QAA0B;;YACvC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,cAAc,EAAE,EAAE,CAAC,CAAA;YACxD,OAAO;gBACH,IAAI,EAAE,KAAK,CAAC,WAAW,EAAE;gBACzB,KAAK,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC5B,iBAAiB,EAAE,KAAK,CAAC,cAAc,EAAE;gBACzC,YAAY,EAAE,KAAK,CAAC,cAAc,EAAE;gBACpC,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;aACzC,CAAA;QACL,CAAC;KAAA;CACJ;AAxID,0BAwIC;AAWD,SAAgB,oBAAoB,CAAC,IAAiB;IAClD,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,IAAI,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC7B,6CAA6C;IAC7C,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAA;IAElD,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,KAAK,EAAE,EAAE,CAAC,CAAA;IAClC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAA;IAC7C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,YAAY,CAAC,CAAA;IACxC,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAE9B,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AAbD,oDAaC;AAED,OAAO;AAEM,QAAA,cAAc,GAAG,koBAAkoB,CAAA;AAEnpB,QAAA,eAAe,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,sBAAc,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftMarketplace.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftMarketplace.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftMarketplaceCodeCell = exports.NftMarketplaceCodeBoc = exports.buildSignature = exports.buildNftMarketplaceDataCell = exports.NftMarketplace = void 0;
const ton_core_1 = require("ton-core");
const ton_crypto_1 = require("ton-crypto");
class NftMarketplace {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftMarketplace(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftMarketplaceDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftMarketplaceCodeCell,
                data: data
            });
            return new NftMarketplace(address, 0, {
                code: exports.NftMarketplaceCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCoins(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(1, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
}
exports.NftMarketplace = NftMarketplace;
function buildNftMarketplaceDataCell(data) {
    let dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeUint(data.seqno, 32);
    dataCell.storeUint(data.subwallet, 32);
    dataCell.storeBuffer(data.publicKey);
    return dataCell.endCell();
}
exports.buildNftMarketplaceDataCell = buildNftMarketplaceDataCell;
function buildSignature(params) {
    let bodyCell = (0, ton_core_1.beginCell)();
    bodyCell.storeRef(params.saleStateInit);
    bodyCell.storeRef(params.saleMessageBody);
    return (0, ton_crypto_1.sign)(bodyCell.endCell().hash(), params.keyPair.secretKey);
}
exports.buildSignature = buildSignature;
// Data
exports.NftMarketplaceCodeBoc = 'te6cckEBDAEA7wABFP8A9KQT9LzyyAsBAgEgAwIAePKDCNcYINMf0x/THwL4I7vyY/ABUTK68qFRRLryogT5AVQQVfkQ8qP4AJMg10qW0wfUAvsA6DABpALwAgIBSAcEAgFIBgUAEbjJftRNDXCx+AAXuznO1E0NM/MdcL/4AgLOCQgAF0AsjLH8sfy//J7VSAIBIAsKABU7UTQ0x/TH9P/MIACpGwiIMcAkVvgAdDTAzBxsJEw4PABbCEB0x8BwAGONIMI1xgg+QFAA/kQ8qPU1DAh+QBwyMoHy//J0Hd0gBjIywXLAljPFnD6AstrEszMyYBA+wDgW4NC26jQ=';
exports.NftMarketplaceCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftMarketplaceCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftMarketplace.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftMarketplace.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftMarketplace.js.map
================================================
{"version":3,"file":"NftMarketplace.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftMarketplace.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AACnH,2CAA2C;AAE3C,MAAa,cAAc;IACvB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,cAAc,CACrB,OAAO,CACN,CAAC;IACV,CAAC;IAGD,MAAM,CAAO,gBAAgB,CACzB,MAA0B;;YAG1B,IAAI,IAAI,GAAG,2BAA2B,CAAC,MAAM,CAAC,CAAC;YAC/C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,8BAAsB;gBAC5B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,cAAc,CACrB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,8BAAsB;gBAC5B,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,SAAS,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGxD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC;qBAChB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;CACJ;AAzDD,wCAyDC;AAUD,SAAgB,2BAA2B,CAAC,IAAwB;IAChE,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,KAAK,EAAE,EAAE,CAAC,CAAA;IAClC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,SAAS,EAAE,EAAE,CAAC,CAAA;IACtC,QAAQ,CAAC,WAAW,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA;IAEpC,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AARD,kEAQC;AAED,SAAgB,cAAc,CAAC,MAI9B;IACC,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC1B,QAAQ,CAAC,QAAQ,CAAC,MAAM,CAAC,aAAa,CAAC,CAAA;IACvC,QAAQ,CAAC,QAAQ,CAAC,MAAM,CAAC,eAAe,CAAC,CAAA;IAEzC,OAAO,IAAA,iBAAI,EAAC,QAAQ,CAAC,OAAO,EAAE,CAAC,IAAI,EAAE,EAAE,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,CAAA;AAClE,CAAC;AAVD,wCAUC;AAGD,OAAO;AAEM,QAAA,qBAAqB,GAAG,sVAAsV,CAAA;AAE9W,QAAA,sBAAsB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,6BAAqB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftOffer.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftOffer.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftOfferCodeCell = exports.buildNftOfferDataCell = exports.NftOffer = void 0;
const ton_core_1 = require("ton-core");
class NftOffer {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftOffer(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildNftOfferDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftOfferCodeCell,
                data: data
            });
            return new NftOffer(address, 0, {
                code: exports.NftOfferCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendCancelOffer(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextPayload = (0, ton_core_1.beginCell)();
            if (params.message) {
                nextPayload.storeUint(0, 32);
                const m = Buffer.from(params.message.substring(0, 121), 'utf-8');
                nextPayload.storeBuffer(m.slice(0, 121));
            }
            nextPayload.endCell();
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0, 32)
                    .storeBuffer(Buffer.from('cancel'))
                    .storeRef(nextPayload)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendCancelOfferByMarketplace(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextPayload = (0, ton_core_1.beginCell)();
            if (params.message) {
                nextPayload.storeUint(0, 32);
                const m = Buffer.from(params.message.substring(0, 121), 'utf-8');
                nextPayload.storeBuffer(m.slice(0, 121));
            }
            nextPayload.endCell();
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(3, 32)
                    .storeCoins(params.amount)
                    .storeRef(nextPayload)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getOfferData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_offer_data', []);
            return {
                offerType: stack.readBigNumber(),
                isComplete: stack.readBoolean(),
                createdAt: stack.readBigNumber(),
                finishAt: stack.readBigNumber(),
                marketplaceAddress: stack.readAddress(),
                nftAddress: stack.readAddress(),
                offerOwnerAddress: stack.readAddress(),
                fullPrice: stack.readBigNumber(),
                marketplaceFeeAddress: stack.readAddress(),
                marketplaceFactor: stack.readBigNumber(),
                marketplaceBase: stack.readBigNumber(),
                royaltyAddress: stack.readAddress(),
                royaltyFactor: stack.readBigNumber(),
                royaltyBase: stack.readBigNumber(),
                profitPrice: stack.readBigNumber(),
            };
        });
    }
}
exports.NftOffer = NftOffer;
function buildNftOfferDataCell(data) {
    const feesCell = (0, ton_core_1.beginCell)();
    feesCell.storeAddress(data.marketplaceFeeAddress);
    feesCell.storeUint(data.marketplaceFactor, 32);
    feesCell.storeUint(data.marketplaceBase, 32);
    feesCell.storeAddress(data.royaltyAddress);
    feesCell.storeUint(data.royaltyFactor, 32);
    feesCell.storeUint(data.royaltyBase, 32);
    const dataCell = (0, ton_core_1.beginCell)();
    dataCell.storeUint(data.isComplete ? 1 : 0, 1);
    dataCell.storeUint(data.createdAt, 32);
    dataCell.storeUint(data.finishAt, 32);
    dataCell.storeAddress(data.marketplaceAddress);
    dataCell.storeAddress(data.nftAddress);
    dataCell.storeAddress(data.offerOwnerAddress);
    dataCell.storeCoins(data.fullPrice); // fullPrice
    dataCell.storeRef(feesCell);
    dataCell.storeUint(1, 1); // can_deploy
    return dataCell.endCell();
}
exports.buildNftOfferDataCell = buildNftOfferDataCell;
// Data
const NftOfferCodeBoc = 'te6cckECFgEABEkAART/APSkE/S88sgLAQIBIAQCAVby7UTQ0wDTH9Mf+kD6QPpA+gDU0wAwMAfAAfLRlPgjJb7jAl8IggD//vLwAwDOB9MfgQ+jAsMAEvLygQ+kIddKwwDy8oEPpSHXSYEB9Lzy8vgAgggPQkBw+wJwIIAQyMsFJM8WIfoCy2rLHwHPFsmDBvsAcQdVBXAIyMsAF8sfFcsfUAPPFgHPFgHPFgH6AszLAMntVAIBSAYFAIOhRh/aiaGmAaY/pj/0gfSB9IH0AammAGBhofSBpj+mP/SBpj+mPmCo7CHgBqjuqeAGpQVCA0MEMJ6MjIqkHYACq4ECAswLBwP322ERFofSBpj+mP/SBpj+mPmBSs+AGqJCH4Aam4UJHQxbKDk3szS6QTrLgQQAhkZYKoAueLKAH9AQnltWWPgOeLZLj9gBFhABFrpOEBWEk2EPGGkGEASK3xhrgQQQgv5h6KZGWPieWfk2eLKAHni2UAQQRMS0B9AWUAZLjAoJCAB4gBjIywUmzxZw+gLLasyCCA9CQHD7AsmDBvsAcVVgcAjIywAXyx8Vyx9QA88WAc8WAc8WAfoCzMsAye1UAEyLlPZmZlciBmZWWHAggBDIywVQBc8WUAP6AhPLassfAc8WyXH7AABYi+T2ZmZXIgcm95YWxpZXOBNwIIAQyMsFUAXPFlAD+gITy2rLHwHPFslx+wACAUgPDAIBIA4NAB0IMAAk18DcOBZ8AIB8AGAAESCEDuaygCphIAIBIBEQABMghA7msoAAamEgAfcAdDTAwFxsJJfBOD6QDDtRNDTANMf0x/6QPpA+kD6ANTTADDAAY4lMTc3OFUzEnAIyMsAF8sfFcsfUAPPFgHPFgHPFgH6AszLAMntVOB/KscBwACOGjAJ0x8hwACLZjYW5jZWyFIgxwWwknMy3lCq3iCBAiu6KcABsFOmgEgLQxwWwnhCsXwzUMNDTB9QwAfsA4IIQBRONkVIQuuMCPCfAAfLRlCvAAFOTxwWwjis4ODlQdqAQN0ZQRAMCcAjIywAXyx8Vyx9QA88WAc8WAc8WAfoCzMsAye1U4Dc5CcAD4wJfCYQP8vAVEwGsU1jHBVNixwWx8uHKgggPQkBw+wJRUccFjhQ1cIAQyMsFKM8WIfoCy2rJgwb7AOMNcUcXUGYFBANwCMjLABfLHxXLH1ADzxYBzxYBzxYB+gLMywDJ7VQUALYF+gAhghAdzWUAvJeCEB3NZQAy3o0EE9mZmVyIGNhbmNlbCBmZWWBURzNwIIAQyMsFUAXPFlAD+gITy2rLHwHPFslx+wDUMHGAEMjLBSnPFnD6AstqzMmDBvsAAMYwCdM/+kAwU5THBQnAABmwK4IQO5rKAL6wnjgQWhBJEDhHFQNEZPAIjjg5XwYzM3AgghBfzD0UyMsfE8s/I88WUAPPFsoAIfoCygDJcYAYyMsFUAPPFnD6AhLLaszJgED7AOK1Lpfy';
exports.NftOfferCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(NftOfferCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftOffer.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftOffer.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftOffer.js.map
================================================
{"version":3,"file":"NftOffer.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftOffer.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AAEnH,MAAa,QAAQ;IACjB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,QAAQ,CACf,OAAO,CACN,CAAC;IACV,CAAC;IAED,MAAM,CAAO,gBAAgB,CACzB,MAAoB;;YAGpB,IAAI,IAAI,GAAG,qBAAqB,CAAC,MAAM,CAAC,CAAC;YACzC,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,wBAAgB;gBACtB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,QAAQ,CACf,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,wBAAgB;gBACtB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,eAAe,CAAC,QAA0B,EAAE,GAAW,EAAE,MAG9D;;YACG,MAAM,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;YAE/B,IAAI,MAAM,CAAC,OAAO,EAAE;gBAChB,WAAW,CAAC,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC,CAAA;gBAC5B,MAAM,CAAC,GAAG,MAAM,CAAC,IAAI,CAAC,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,CAAC,EAAE,GAAG,CAAC,EAAE,OAAO,CAAC,CAAA;gBAChE,WAAW,CAAC,WAAW,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,EAAE,GAAG,CAAC,CAAC,CAAA;aAC3C;YAED,WAAW,CAAC,OAAO,EAAE,CAAC;YAEtB,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,WAAW,CAAC,MAAM,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;qBAClC,QAAQ,CAAC,WAAW,CAAC;qBACrB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,4BAA4B,CAAC,QAA0B,EAAE,GAAW,EAAE,MAI3E;;YACG,MAAM,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;YAE/B,IAAI,MAAM,CAAC,OAAO,EAAE;gBAChB,WAAW,CAAC,SAAS,CAAC,CAAC,EAAE,EAAE,CAAC,CAAA;gBAC5B,MAAM,CAAC,GAAG,MAAM,CAAC,IAAI,CAAC,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,CAAC,EAAE,GAAG,CAAC,EAAE,OAAO,CAAC,CAAA;gBAChE,WAAW,CAAC,WAAW,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,EAAE,GAAG,CAAC,CAAC,CAAA;aAC3C;YAED,WAAW,CAAC,OAAO,EAAE,CAAC;YAEtB,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,CAAC,EAAC,EAAE,CAAC;qBACf,UAAU,CAAC,MAAM,CAAC,MAAM,CAAC;qBACzB,QAAQ,CAAC,WAAW,CAAC;qBACrB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,YAAY,CAAC,QAA0B;;YACzC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,gBAAgB,EAAE,EAAE,CAAC,CAAA;YAE1D,OAAO;gBACH,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,UAAU,EAAE,KAAK,CAAC,WAAW,EAAE;gBAC/B,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,QAAQ,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC/B,kBAAkB,EAAE,KAAK,CAAC,WAAW,EAAE;gBACvC,UAAU,EAAE,KAAK,CAAC,WAAW,EAAE;gBAC/B,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;gBACtC,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,qBAAqB,EAAE,KAAK,CAAC,WAAW,EAAE;gBAC1C,iBAAiB,EAAE,KAAK,CAAC,aAAa,EAAE;gBACxC,eAAe,EAAE,KAAK,CAAC,aAAa,EAAE;gBACtC,cAAc,EAAE,KAAK,CAAC,WAAW,EAAE;gBACnC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,WAAW,EAAE,KAAK,CAAC,aAAa,EAAE;gBAClC,WAAW,EAAE,KAAK,CAAC,aAAa,EAAE;aACnC,CAAA;QACP,CAAC;KAAA;CACJ;AAnHD,4BAmHC;AAoBD,SAAgB,qBAAqB,CAAC,IAAkB;IACpD,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE5B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,qBAAqB,CAAC,CAAA;IACjD,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,iBAAiB,EAAE,EAAE,CAAC,CAAA;IAC9C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,eAAe,EAAE,EAAE,CAAC,CAAA;IAC5C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,cAAc,CAAC,CAAA;IAC1C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA;IAC1C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,WAAW,EAAE,EAAE,CAAC,CAAA;IAExC,MAAM,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE5B,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA;IAC9C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,SAAS,EAAE,EAAE,CAAC,CAAA;IACtC,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,QAAQ,EAAE,EAAE,CAAC,CAAA;IACrC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,kBAAkB,CAAC,CAAA;IAC9C,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,UAAU,CAAC,CAAA;IACtC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAA;IAC7C,QAAQ,CAAC,UAAU,CAAC,IAAI,CAAC,SAAS,CAAC,CAAA,CAAC,YAAY;IAChD,QAAQ,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAA;IAC3B,QAAQ,CAAC,SAAS,CAAC,CAAC,EAAE,CAAC,CAAC,CAAA,CAAC,aAAa;IAEtC,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AAvBD,sDAuBC;AAED,OAAO;AAEP,MAAM,eAAe,GACnB,88CAA88C,CAAA;AAEn8C,QAAA,gBAAgB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,eAAe,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftSingle.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftSingle.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftSingleCodeCell = exports.NftSingleCodeBoc = exports.NftSingleSource = exports.buildeNftSingleDataCell = exports.NftSingle = void 0;
const ton_core_1 = require("ton-core");
const OffchainContent_1 = require("../../types/OffchainContent");
const combineFunc_1 = require("../../utils/combineFunc");
class NftSingle {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new NftSingle(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildeNftSingleDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.NftSingleCodeCell,
                data: data
            });
            return new NftSingle(address, 0, {
                code: exports.NftSingleCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendTransfer(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x5fcc3d14, 32)
                    .storeUint(params.queryId, 64)
                    .storeAddress(params.newOwner)
                    .storeAddress(params.responseDestination)
                    .storeMaybeRef(params.customPayload)
                    .storeCoins(params.forwardAmount)
                    .storeMaybeRef(params.forwardPayload)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendGetStaticData(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x2fcb26a2, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendGetRoyaltyParams(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x693d3950, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTransferEditorship(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x1c04412a, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeAddress(params.newEditor)
                    .storeAddress(params.responseTo)
                    .storeBit(false)
                    .storeCoins(params.forwardAmount || 0)
                    .storeBit(false)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getNftData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_data', []);
            return {
                init: stack.readBoolean(),
                index: stack.readBigNumber(),
                collectionAddress: stack.readAddressOpt(),
                ownerAddress: stack.readAddressOpt(),
                individualContent: stack.readCellOpt(),
            };
        });
    }
}
exports.NftSingle = NftSingle;
function buildeNftSingleDataCell(data) {
    let dataCell = (0, ton_core_1.beginCell)();
    let contentCell = (0, OffchainContent_1.encodeOffChainContent)(data.content);
    let royaltyCell = (0, ton_core_1.beginCell)();
    royaltyCell.storeUint(data.royaltyParams.royaltyFactor, 16);
    royaltyCell.storeUint(data.royaltyParams.royaltyBase, 16);
    royaltyCell.storeAddress(data.royaltyParams.royaltyAddress);
    dataCell.storeAddress(data.ownerAddress);
    dataCell.storeAddress(data.editorAddress);
    dataCell.storeRef(contentCell);
    dataCell.storeRef(royaltyCell);
    return dataCell.endCell();
}
exports.buildeNftSingleDataCell = buildeNftSingleDataCell;
// Data
exports.NftSingleSource = (0, combineFunc_1.combineFunc)(__dirname, [
    '../../sources/stdlib.fc',
    '../../sources/op-codes.fc',
    '../../sources/params.fc',
    '../../sources/nft-single.fc',
]);
exports.NftSingleCodeBoc = 'te6cckECFQEAAwoAART/APSkE/S88sgLAQIBYgcCAgEgBAMAI7x+f4ARgYuGRlgOS/uAFoICHAIBWAYFABG0Dp4AQgRr4HAAHbXa/gBNhjoaYfph/0gGEAICzgsIAgEgCgkAGzIUATPFljPFszMye1UgABU7UTQ+kD6QNTUMIAIBIA0MABE+kQwcLry4U2AEuQyIccAkl8D4NDTAwFxsJJfA+D6QPpAMfoAMXHXIfoAMfoAMPACBtMf0z+CEF/MPRRSMLqOhzIQRxA2QBXgghAvyyaiUjC64wKCEGk9OVBSMLrjAoIQHARBKlIwuoBMSEQ4BXI6HMhBHEDZAFeAxMjQ1NYIQGgudURK6n1ETxwXy4ZoB1NQwECPwA+BfBIQP8vAPAfZRNscF8uGR+kAh8AH6QNIAMfoAggr68IAboSGUUxWgod4i1wsBwwAgkgahkTbiIML/8uGSIY4+ghBRGkRjyFAKzxZQC88WcSRKFFRGsHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAEFeUECo4W+IQAIICjjUm8AGCENUydtsQN0UAbXFwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AJMwMzTiVQLwAwBUFl8GMwHQEoIQqMsArXCAEMjLBVAFzxYk+gIUy2oTyx/LPwHPFsmAQPsAAIYWXwZsInDIywHJcIIQi3cXNSHIy/8D0BPPFhOAQHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAAfZRN8cF8uGR+kAh8AH6QNIAMfoAggr68IAboSGUUxWgod4i1wsBwwAgkgahkTbiIMIA8uGSIY4+ghAFE42RyFALzxZQC88WcSRLFFRGwHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAEGeUECo5W+IUAIICjjUm8AGCENUydtsQN0YAbXFwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AJMwNDTiVQLwA+GNLv4=';
exports.NftSingleCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.NftSingleCodeBoc, 'base64'))[0];
//# sourceMappingURL=NftSingle.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftSingle.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftSingle.js.map
================================================
{"version":3,"file":"NftSingle.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftSingle.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AACnH,iEAAoE;AACpE,yDAAsD;AAEtD,MAAa,SAAS;IAClB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,SAAS,CAChB,OAAO,CACV,CAAC;IACN,CAAC;IAGD,MAAM,CAAO,gBAAgB,CACzB,MAAqB;;YAGrB,IAAI,IAAI,GAAG,uBAAuB,CAAC,MAAM,CAAC,CAAC;YAC3C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,yBAAiB;gBACvB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,SAAS,CAChB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,yBAAiB;gBACvB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,YAAY,CAAC,QAA0B,EAAE,GAAW,EAAE,MAQ3D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,QAAQ,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,mBAAmB,CAAC;qBACxC,aAAa,CAAC,MAAM,CAAC,aAAa,CAAC;qBACnC,UAAU,CAAC,MAAM,CAAC,aAAa,CAAC;qBAChC,aAAa,CAAC,MAAM,CAAC,cAAc,CAAC;qBACpC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,iBAAiB,CACnB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,oBAAoB,CACtB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,sBAAsB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAMrE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,YAAY,CAAC,MAAM,CAAC,SAAS,CAAC;qBAC9B,YAAY,CAAC,MAAM,CAAC,UAAU,CAAC;qBAC/B,QAAQ,CAAC,KAAK,CAAC;qBACf,UAAU,CAAC,MAAM,CAAC,aAAa,IAAI,CAAC,CAAC;qBACrC,QAAQ,CAAC,KAAK,CAAC;qBACf,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,UAAU,CAAC,QAA0B;;YACvC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,cAAc,EAAE,EAAE,CAAC,CAAA;YACxD,OAAO;gBACH,IAAI,EAAE,KAAK,CAAC,WAAW,EAAE;gBACzB,KAAK,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC5B,iBAAiB,EAAE,KAAK,CAAC,cAAc,EAAE;gBACzC,YAAY,EAAE,KAAK,CAAC,cAAc,EAAE;gBACpC,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;aACzC,CAAA;QACL,CAAC;KAAA;CACJ;AAxID,8BAwIC;AAmBD,SAAgB,uBAAuB,CAAC,IAAmB;IACvD,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,IAAI,WAAW,GAAG,IAAA,uCAAqB,EAAC,IAAI,CAAC,OAAO,CAAC,CAAA;IAErD,IAAI,WAAW,GAAG,IAAA,oBAAS,GAAE,CAAA;IAC7B,WAAW,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,CAAC,aAAa,EAAE,EAAE,CAAC,CAAA;IAC3D,WAAW,CAAC,SAAS,CAAC,IAAI,CAAC,aAAa,CAAC,WAAW,EAAE,EAAE,CAAC,CAAA;IACzD,WAAW,CAAC,YAAY,CAAC,IAAI,CAAC,aAAa,CAAC,cAAc,CAAC,CAAA;IAE3D,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,YAAY,CAAC,CAAA;IACxC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,aAAa,CAAC,CAAA;IACzC,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAC9B,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAE9B,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AAhBD,0DAgBC;AAED,OAAO;AAEM,QAAA,eAAe,GAAG,IAAA,yBAAW,EAAC,SAAS,EAAE;IAClD,yBAAyB;IACzB,2BAA2B;IAC3B,yBAAyB;IACzB,6BAA6B;CAChC,CAAC,CAAA;AAEW,QAAA,gBAAgB,GAAG,siCAAsiC,CAAA;AAEzjC,QAAA,iBAAiB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,wBAAgB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAA"}


================================================
FILE: cli/dist/src/wrappers/getgems/NftSwap.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftSwap.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftSwap = void 0;
const ton_core_1 = require("ton-core");
const OperationCodes = {
    ownershipAssigned: 0x05138d91,
    addCoins: 1,
    cancel: 2,
    maintain: 3,
    topup: 4,
    transferCommission: 0x82bd8f2a,
    transferCancel: 0xb5188860,
    transferComplete: 0xef03d009,
};
class NftSwap {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address, workchain, init) {
        return new NftSwap(address, workchain, init);
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendOwnershipAssigned(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.ownershipAssigned, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeAddress(params.prevOwner)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendCancel(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.cancel, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendAddCoins(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.addCoins, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeCoins(params.coins)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTransferCommission(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.transferCommission, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTransferCancel(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.transferCancel, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTransferComplete(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.transferComplete, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendMaintain(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.maintain, 32)
                    .storeUint(params.queryId || 0, 64)
                    .storeUint(params.mode, 8)
                    .storeRef(params.msg)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendTopup(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(OperationCodes.topup, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendMakeMessage(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x18, 6)
                    .storeUint(params.queryId || 0, 64)
                    .storeAddress(params.to)
                    .storeCoins(params.amount)
                    .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .storeRef(params.body)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getRaffleState(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('raffle_state', []);
            return {
                state: stack.readBigNumber(),
                rightNftsCount: stack.readBigNumber(),
                rightNftsReceived: stack.readBigNumber(),
                leftNftsCount: stack.readBigNumber(),
                leftNftsReceived: stack.readBigNumber(),
                leftUser: stack.readAddressOpt(),
                rightUser: stack.readAddressOpt(),
                superUser: stack.readAddressOpt(),
                leftCommission: stack.readBigNumber(),
                rightCommission: stack.readBigNumber(),
                leftCoinsGot: stack.readBigNumber(),
                rightCoinsGot: stack.readBigNumber(),
                nftTransferFee: stack.readCell(),
                nfts: stack.readCell(),
                raffledNfts: stack.readCell()
            };
        });
    }
}
exports.NftSwap = NftSwap;
// Utils
// export const SwapState = {
//     Active: 1,
//     Cancelled: 2,
//     Completed: 3,
// }
// interface NFTItem {
//     addr: Address
//     sent: boolean
// }
// export type SwapData = {
//     state: number,
//     leftAddress: Address
//     rightAddress: Address
//     rightNft: NFTItem[]
//     leftNft: NFTItem[]
//     supervisorAddress: Address
//     commissionAddress: Address
//     leftCommission: bigint
//     leftAmount: bigint
//     leftCoinsGot: bigint
//     rightCommission: bigint
//     rightAmount: bigint
//     rightCoinsGot: bigint
// }
// export function buildSwapDataCell(data: SwapData) {
//     let dataCell = beginCell()
//     dataCell.storeUint(data.state, 2)
//     dataCell.storeAddress(data.leftAddress)
//     dataCell.storeAddress(data.rightAddress)
//     dataCell.storeCoins(data.leftCommission)
//     dataCell.storeCoins(data.leftAmount)
//     dataCell.storeCoins(data.leftCoinsGot)
//     dataCell.storeBit(data.leftNft.length > 0)
//     if (data.leftNft.length > 0) {
//         let leftNft = Dictionary.empty(256)
//         for (const leftNftKey in data.leftNft) {
//             let bitCell = beginCell();
//             bitCell.storeBit(data.leftNft[leftNftKey].sent);
//             leftNft.storeCell(data.leftNft[leftNftKey].addr.hash, bitCell)
//         }
//         dataCell.storeRef(leftNft.endCell())
//     }
//     dataCell.storeCoins(data.rightCommission)
//     dataCell.storeCoins(data.rightAmount)
//     dataCell.storeCoins(data.rightCoinsGot)
//     dataCell.storeBit(data.rightNft.length > 0)
//     if (data.rightNft.length > 0) {
//         let rightNft = new DictBuilder(256)
//         for (const rightNftKey in data.rightNft) {
//             let bitCell = beginCell();
//             bitCell.storeBit(data.rightNft[rightNftKey].sent);
//             rightNft.storeCell(data.rightNft[rightNftKey].addr.hash, bitCell)
//         }
//         dataCell.storeRef(rightNft.endCell())
//     }
//     let marketCell = beginCell()
//     marketCell.storeAddress(data.commissionAddress)
//     marketCell.storeAddress(data.supervisorAddress)
//     dataCell.storeRef(marketCell)
//     return dataCell
// }
// Data
//# sourceMappingURL=NftSwap.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/NftSwap.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/NftSwap.js.map
================================================
{"version":3,"file":"NftSwap.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/NftSwap.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAA+H;AAE/H,MAAM,cAAc,GAAG;IACnB,iBAAiB,EAAE,UAAU;IAC7B,QAAQ,EAAE,CAAC;IACX,MAAM,EAAE,CAAC;IACT,QAAQ,EAAE,CAAC;IACX,KAAK,EAAE,CAAC;IACR,kBAAkB,EAAE,UAAU;IAC9B,cAAc,EAAE,UAAU;IAC1B,gBAAgB,EAAE,UAAU;CAC/B,CAAA;AAED,MAAa,OAAO;IAChB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB,EAChB,SAAiB,EACjB,IAGC;QAED,OAAO,IAAI,OAAO,CACd,OAAO,EACP,SAAS,EACT,IAAI,CACH,CAAC;IACV,CAAC;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAGK,qBAAqB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAIpE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,iBAAiB,EAAE,EAAE,CAAC;qBAC/C,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,YAAY,CAAC,MAAM,CAAC,SAAS,CAAC;qBAC9B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGzD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,MAAM,EAAE,EAAE,CAAC;qBACpC,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,YAAY,CAAC,QAA0B,EAAE,GAAW,EAAE,MAI3D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,QAAQ,EAAE,EAAE,CAAC;qBACtC,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,UAAU,CAAC,MAAM,CAAC,KAAK,CAAC;qBACxB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,sBAAsB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGrE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,kBAAkB,EAAE,EAAE,CAAC;qBAChD,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,kBAAkB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGjE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,cAAc,EAAE,EAAE,CAAC;qBAC5C,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,oBAAoB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGnE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,gBAAgB,EAAE,EAAE,CAAC;qBAC9C,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,YAAY,CACd,QAA0B,EAC1B,GAAW,EACX,MAKC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,QAAQ,EAAE,EAAE,CAAC;qBACtC,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,SAAS,CAAC,MAAM,CAAC,IAAI,EAAE,CAAC,CAAC;qBACzB,QAAQ,CAAC,MAAM,CAAC,GAAG,CAAC;qBACpB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,SAAS,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGxD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,cAAc,CAAC,KAAK,EAAE,EAAE,CAAC;qBACnC,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,eAAe,CACjB,QAA0B,EAC1B,GAAW,EACX,MAMC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,IAAI,EAAE,CAAC,CAAC;qBAClB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,YAAY,CAAC,MAAM,CAAC,EAAE,CAAC;qBACvB,UAAU,CAAC,MAAM,CAAC,MAAM,CAAC;qBACzB,SAAS,CAAC,CAAC,EAAE,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,EAAE,GAAG,EAAE,GAAG,CAAC,GAAE,CAAC,CAAC;qBACxC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC;qBACrB,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,cAAc,CAChB,QAA0B;;YAE1B,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,cAAc,EAAE,EAAE,CAAC,CAAA;YACxD,OAAO;gBACH,KAAK,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC5B,cAAc,EAAE,KAAK,CAAC,aAAa,EAAE;gBACrC,iBAAiB,EAAE,KAAK,CAAC,aAAa,EAAE;gBACxC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,gBAAgB,EAAE,KAAK,CAAC,aAAa,EAAE;gBACvC,QAAQ,EAAE,KAAK,CAAC,cAAc,EAAE;gBAChC,SAAS,EAAE,KAAK,CAAC,cAAc,EAAE;gBACjC,SAAS,EAAE,KAAK,CAAC,cAAc,EAAE;gBACjC,cAAc,EAAE,KAAK,CAAC,aAAa,EAAE;gBACrC,eAAe,EAAE,KAAK,CAAC,aAAa,EAAE;gBACtC,YAAY,EAAE,KAAK,CAAC,aAAa,EAAE;gBACnC,aAAa,EAAE,KAAK,CAAC,aAAa,EAAE;gBACpC,cAAc,EAAE,KAAK,CAAC,QAAQ,EAAE;gBAChC,IAAI,EAAE,KAAK,CAAC,QAAQ,EAAE;gBACtB,WAAW,EAAE,KAAK,CAAC,QAAQ,EAAE;aAChC,CAAA;QACL,CAAC;KAAA;CACJ;AAtMD,0BAsMC;AAED,QAAQ;AAER,6BAA6B;AAC7B,iBAAiB;AACjB,oBAAoB;AACpB,oBAAoB;AACpB,IAAI;AAEJ,sBAAsB;AACtB,oBAAoB;AACpB,oBAAoB;AACpB,IAAI;AAEJ,2BAA2B;AAC3B,qBAAqB;AACrB,2BAA2B;AAC3B,4BAA4B;AAC5B,0BAA0B;AAC1B,yBAAyB;AACzB,iCAAiC;AACjC,iCAAiC;AACjC,6BAA6B;AAC7B,yBAAyB;AACzB,2BAA2B;AAC3B,8BAA8B;AAC9B,0BAA0B;AAC1B,4BAA4B;AAC5B,IAAI;AAEJ,sDAAsD;AACtD,iCAAiC;AACjC,wCAAwC;AACxC,8CAA8C;AAC9C,+CAA+C;AAE/C,+CAA+C;AAC/C,2CAA2C;AAC3C,6CAA6C;AAC7C,iDAAiD;AAEjD,qCAAqC;AACrC,8CAA8C;AAC9C,mDAAmD;AACnD,yCAAyC;AACzC,+DAA+D;AAE/D,6EAA6E;AAC7E,YAAY;AACZ,+CAA+C;AAC/C,QAAQ;AAER,gDAAgD;AAChD,4CAA4C;AAC5C,8CAA8C;AAC9C,kDAAkD;AAElD,sCAAsC;AACtC,8CAA8C;AAC9C,qDAAqD;AACrD,yCAAyC;AACzC,iEAAiE;AAEjE,gFAAgF;AAChF,YAAY;AACZ,gDAAgD;AAChD,QAAQ;AAER,mCAAmC;AACnC,sDAAsD;AACtD,sDAAsD;AACtD,oCAAoC;AAEpC,sBAAsB;AACtB,IAAI;AAEJ,OAAO"}


================================================
FILE: cli/dist/src/wrappers/getgems/SbtSingle.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/SbtSingle.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbtSingleCodeCell = exports.SbtSingleCodeBoC = exports.SbtSingleSource = exports.buildSingleSbtDataCell = exports.SbtSingle = void 0;
const ton_core_1 = require("ton-core");
const OffchainContent_1 = require("../../types/OffchainContent");
const combineFunc_1 = require("../../utils/combineFunc");
class SbtSingle {
    constructor(address, workchain, init) {
        this.address = address;
        this.workchain = workchain;
        this.init = init;
    }
    static createFromAddress(address) {
        return new SbtSingle(address);
    }
    static createFromConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = buildSingleSbtDataCell(config);
            let address = (0, ton_core_1.contractAddress)(0, {
                code: exports.SbtSingleCodeCell,
                data: data
            });
            return new SbtSingle(address, 0, {
                code: exports.SbtSingleCodeCell,
                data: data
            });
        });
    }
    // Deployment
    sendDeploy(provider, via, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value,
                body: (0, ton_core_1.beginCell)().endCell(),
            });
        });
    }
    sendProveOwnership(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x04ded148, 32)
                    .storeUint(params.queryId, 64)
                    .storeAddress(params.dest)
                    .storeMaybeRef(params.forwardPayload)
                    .storeBit(params.withContent)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendRequestOwner(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0xd0c3bfea, 32)
                    .storeUint(params.queryId, 64)
                    .storeAddress(params.dest)
                    .storeMaybeRef(params.forwardPayload)
                    .storeBit(params.withContent)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    sendRevoke(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x6f89f5e3, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    getNftData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_data', []);
            return {
                init: stack.readBoolean(),
                index: stack.readBigNumber(),
                collectionAddress: stack.readAddressOpt(),
                ownerAddress: stack.readAddressOpt(),
                individualContent: stack.readCellOpt(),
            };
        });
    }
    getAuthorityAddress(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_authority_address', []);
            return {
                authorityAddress: stack.readAddressOpt(),
            };
        });
    }
    getRevokedTime(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_revoked_time', []);
            return {
                revoked_time: stack.readBigNumber(),
            };
        });
    }
}
exports.SbtSingle = SbtSingle;
function buildSingleSbtDataCell(data) {
    let dataCell = (0, ton_core_1.beginCell)();
    let contentCell = (0, OffchainContent_1.encodeOffChainContent)(data.content);
    dataCell.storeAddress(data.ownerAddress);
    dataCell.storeAddress(data.editorAddress);
    dataCell.storeRef(contentCell);
    dataCell.storeAddress(data.authorityAddress);
    dataCell.storeUint(data.revokedAt ? data.revokedAt : 0, 64);
    return dataCell.endCell();
}
exports.buildSingleSbtDataCell = buildSingleSbtDataCell;
// Data
exports.SbtSingleSource = (0, combineFunc_1.combineFunc)(__dirname, [
    '../../sources/stdlib.fc',
    '../../sources/op-codes.fc',
    '../../sources/params.fc',
    '../../sources/sbt-single.fc',
]);
exports.SbtSingleCodeBoC = 'te6ccgECGQEABBgAART/APSkE/S88sgLAQIBYgIDAgLOBAUCASATFAIBIAYHAgEgERIB7QyIccAkl8D4NDTA/pA+kAx+gAxcdch+gAx+gAw8AID0x8DcbCOTBAkXwTTH4IQBSTHrhK6jjnTPzCAEPhCcIIQwY6G0lUDbYBAA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wCRMOLgAtM/gCAARPpEMHC68uFNgBPyCEC/LJqJSQLqOQDBsIjJwyMv/iwLPFoAQcIIQi3cXNUBVA4BAA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wDgghDQw7/qUkC64wKCEATe0UhSQLrjAoIQHARBKlJAuo6FM0AD2zzgNDSCEBoLnVFSILoJCgsMAMBsM/pA1NMAMPhFcMjL/1AGzxb4Qs8WEswUyz9SMMsAA8MAlvhDUAPMAt6AEHixcIIQDdYH40A1FIBAA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wAAyGwz+EJQA8cF8uGRAfpA1NMAMPhFcMjL//hCzxYTzBLLP1IQywABwwCU+EMBzN6AEHixcIIQBSTHrkBVA4BAA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wAB9PhBFMcF8uGR+kAh8AH6QNIAMfoAggr68IAXoSGUUxWgod4i1wsBwwAgkgahkTbiIML/8uGSIY49yPhBzxZQB88WgBCCEFEaRGMTcSZUSFADyMsfEss/IW6zkwHPF5Ex4slxBcjLBVAEzxZY+gITy2rMyQH7AJI2MOIDDQP+jhAxMvhBEscF8uGa1DD4Y/AD4DKCEB8EU3pSELqORzD4QiHHBfLhkYAQcIIQ1TJ220EEbYMGA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wCLAvhiiwL4ZPAD4IIQb4n141IQuuMCghDRNtOzUhC64wJsIQ4PEACAjjYi8AGAEIIQ1TJ22xRFA21xA8jLHxLLPyFus5MBzxeRMeLJcQXIywVQBM8WWPoCE8tqzMkB+wCSbDHi+GHwAwAuMDH4RAHHBfLhkfhFwADy4ZP4I/hl8AMAijD4QiHHBfLhkYIK+vCAcPsCgBBwghDVMnbbQQRtgwYDyMsfEss/IW6zkwHPF5Ex4slxBcjLBVAEzxZY+gITy2rMyQH7AAAgghBfzD0UupPywZ3ehA/y8AA3O1E0PpAAfhi+kAB+GHUAfhj+kAB+GTTPzD4ZYAAvPhF+EPI+ELPFvhBzxbM+ETPFss/ye1UgAgFYFRYAGbx+f4AT+4RYF8IXwhwADbVjHgBfCJACASAXGAANsB08AL4QYAANs2D8AL4RYA==';
exports.SbtSingleCodeCell = ton_core_1.Cell.fromBoc(Buffer.from(exports.SbtSingleCodeBoC, 'base64'))[0];
//# sourceMappingURL=SbtSingle.js.map


================================================
FILE: cli/dist/src/wrappers/getgems/SbtSingle.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/getgems/SbtSingle.js.map
================================================
{"version":3,"file":"SbtSingle.js","sourceRoot":"","sources":["../../../../../src/wrappers/getgems/SbtSingle.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAmH;AACnH,iEAAoE;AACpE,yDAAsD;AAEtD,MAAa,SAAS;IAClB,YAAqB,OAAgB,EAAW,SAAkB,EAAW,IAAiC;QAAzF,YAAO,GAAP,OAAO,CAAS;QAAW,cAAS,GAAT,SAAS,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAElH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,SAAS,CAChB,OAAO,CACV,CAAC;IACN,CAAC;IAGD,MAAM,CAAO,gBAAgB,CACzB,MAAqB;;YAGrB,IAAI,IAAI,GAAG,sBAAsB,CAAC,MAAM,CAAC,CAAC;YAC1C,IAAI,OAAO,GAAG,IAAA,0BAAe,EACzB,CAAC,EACD;gBACI,IAAI,EAAE,yBAAiB;gBACvB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;YAED,OAAO,IAAI,SAAS,CAChB,OAAO,EACP,CAAC,EACD;gBACI,IAAI,EAAE,yBAAiB;gBACvB,IAAI,EAAE,IAAI;aACb,CACJ,CAAA;QACL,CAAC;KAAA;IAED,aAAa;IACP,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,KAAa;;YACnE,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK;gBACL,IAAI,EAAE,IAAA,oBAAS,GAAE,CAAC,OAAO,EAAE;aAC9B,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,kBAAkB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAMjE;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,IAAI,CAAC;qBACzB,aAAa,CAAC,MAAM,CAAC,cAAc,CAAC;qBACpC,QAAQ,CAAC,MAAM,CAAC,WAAW,CAAC;qBAC5B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,gBAAgB,CAAC,QAA0B,EAAE,GAAW,EAAE,MAM/D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,IAAI,CAAC;qBACzB,aAAa,CAAC,MAAM,CAAC,cAAc,CAAC;qBACpC,QAAQ,CAAC,MAAM,CAAC,WAAW,CAAC;qBAC5B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,UAAU,CAAC,QAA0B,EAAE,GAAW,EAAE,MAGzD;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAEK,UAAU,CAAC,QAA0B;;YACvC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,cAAc,EAAE,EAAE,CAAC,CAAA;YACxD,OAAO;gBACH,IAAI,EAAE,KAAK,CAAC,WAAW,EAAE;gBACzB,KAAK,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC5B,iBAAiB,EAAE,KAAK,CAAC,cAAc,EAAE;gBACzC,YAAY,EAAE,KAAK,CAAC,cAAc,EAAE;gBACpC,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;aACzC,CAAA;QACL,CAAC;KAAA;IAEK,mBAAmB,CAAC,QAA0B;;YAChD,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,uBAAuB,EAAE,EAAE,CAAC,CAAA;YACjE,OAAO;gBACH,gBAAgB,EAAE,KAAK,CAAC,cAAc,EAAE;aAC3C,CAAA;QACL,CAAC;KAAA;IAGK,cAAc,CAAC,QAA0B;;YAC3C,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,kBAAkB,EAAE,EAAE,CAAC,CAAA;YAC5D,OAAO;gBACH,YAAY,EAAE,KAAK,CAAC,aAAa,EAAE;aACtC,CAAA;QACL,CAAC;KAAA;CACJ;AA1HD,8BA0HC;AAaD,SAAgB,sBAAsB,CAAC,IAAmB;IACtD,IAAI,QAAQ,GAAG,IAAA,oBAAS,GAAE,CAAA;IAE1B,IAAI,WAAW,GAAG,IAAA,uCAAqB,EAAC,IAAI,CAAC,OAAO,CAAC,CAAA;IAErD,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,YAAY,CAAC,CAAA;IACxC,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,aAAa,CAAC,CAAA;IACzC,QAAQ,CAAC,QAAQ,CAAC,WAAW,CAAC,CAAA;IAC9B,QAAQ,CAAC,YAAY,CAAC,IAAI,CAAC,gBAAgB,CAAC,CAAA;IAC5C,QAAQ,CAAC,SAAS,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,CAAC,IAAI,CAAC,SAAS,CAAC,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAA;IAE3D,OAAO,QAAQ,CAAC,OAAO,EAAE,CAAA;AAC7B,CAAC;AAZD,wDAYC;AAED,OAAO;AAEM,QAAA,eAAe,GAAG,IAAA,yBAAW,EAAC,SAAS,EAAE;IAClD,yBAAyB;IACzB,2BAA2B;IAC3B,yBAAyB;IACzB,6BAA6B;CAChC,CAAC,CAAA;AAEW,QAAA,gBAAgB,GAAG,04CAA04C,CAAA;AAE75C,QAAA,iBAAiB,GAAG,eAAI,CAAC,OAAO,CAAC,MAAM,CAAC,IAAI,CAAC,wBAAgB,EAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC"}


================================================
FILE: cli/dist/src/wrappers/standard/NftItem.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/standard/NftItem.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftItem = void 0;
const ton_core_1 = require("ton-core");
const EligibleInternalTx_1 = require("../../utils/EligibleInternalTx");
/**
 * Represents an NFT item contract.
 */
class NftItem {
    constructor(address, init) {
        this.address = address;
        this.init = init;
    }
    /**
     * Sends a transfer from the contract.
     * @param provider - The ContractProvider to facilitate the transfer.
     * @param via - The Sender initiating the transfer.
     * @param params - The parameters for the transfer.
     */
    sendTransfer(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x5fcc3d14, 32)
                    .storeUint(params.queryId, 64)
                    .storeAddress(params.newOwner)
                    .storeAddress(params.responseDestination)
                    .storeMaybeRef(params.customPayload)
                    .storeCoins(params.forwardAmount)
                    .storeMaybeRef(params.forwardPayload)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    /**
     * Gets static data from the contract.
     * @param provider - The ContractProvider to facilitate the data retrieval.
     * @param via - The Sender initiating the data retrieval.
     * @param params - The parameters for the data retrieval.
     */
    sendGetStaticData(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x2fcb26a2, 32)
                    .storeUint(params.queryId || 0, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    // Getter Functions
    /**
     * Retrieves the data of the NFT from the contract.
     * @param provider - The ContractProvider to facilitate the data retrieval.
     */
    getNftData(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('get_nft_data', []);
            return {
                init: stack.readBoolean(),
                index: stack.readBigNumber(),
                collectionAddress: stack.readAddressOpt(),
                ownerAddress: stack.readAddressOpt(),
                individualContent: stack.readCellOpt(),
            };
        });
    }
    // Transaction Parsing
    /**
     * Parses a transfer transaction.
     * @param tx - The Transaction to be parsed.
     * @returns A NftTransfer object if the transaction is valid, undefined otherwise.
     */
    static parseTransfer(tx) {
        var _a, _b, _c;
        try {
            const body = (_a = tx.inMessage) === null || _a === void 0 ? void 0 : _a.body.beginParse();
            if (body === undefined)
                return undefined;
            const op = body.loadUint(32);
            if (op !== 0x5fcc3d14)
                return undefined;
            if (!(0, EligibleInternalTx_1.isEligibleTransaction)(tx)) {
                return undefined;
            }
            return {
                queryId: body.loadUint(64),
                from: (_c = (_b = tx.inMessage) === null || _b === void 0 ? void 0 : _b.info.src) !== null && _c !== void 0 ? _c : undefined,
                to: body.loadAddress(),
                responseTo: body.loadAddress(),
                customPayload: body.loadMaybeRef(),
                forwardAmount: body.loadCoins(),
                forwardPayload: body.loadMaybeRef(),
            };
        }
        catch (e) {
            console.log(e);
        }
        return undefined;
    }
}
exports.NftItem = NftItem;
//# sourceMappingURL=NftItem.js.map


================================================
FILE: cli/dist/src/wrappers/standard/NftItem.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/standard/NftItem.js.map
================================================
{"version":3,"file":"NftItem.js","sourceRoot":"","sources":["../../../../../src/wrappers/standard/NftItem.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAA+H;AAC/H,uEAAsE;AAGtE;;GAEG;AACH,MAAa,OAAO;IAChB,YAAqB,OAAgB,EAAW,IAAiC;QAA5D,YAAO,GAAP,OAAO,CAAS;QAAW,SAAI,GAAJ,IAAI,CAA6B;IAAG,CAAC;IAErF;;;;;OAKG;IACG,YAAY,CAAC,QAA0B,EAAE,GAAW,EAAE,MAQ3D;;YACG,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,QAAQ,CAAC;qBAC7B,YAAY,CAAC,MAAM,CAAC,mBAAmB,CAAC;qBACxC,aAAa,CAAC,MAAM,CAAC,aAAa,CAAC;qBACnC,UAAU,CAAC,MAAM,CAAC,aAAa,CAAC;qBAChC,aAAa,CAAC,MAAM,CAAC,cAAc,CAAC;qBACpC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAED;;;;;OAKG;IACG,iBAAiB,CACnB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,IAAI,CAAC,EAAE,EAAE,CAAC;qBAClC,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAED,mBAAmB;IAEnB;;;OAGG;IACG,UAAU,CAAC,QAA0B;;YACvC,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,cAAc,EAAE,EAAE,CAAC,CAAA;YACxD,OAAO;gBACH,IAAI,EAAE,KAAK,CAAC,WAAW,EAAE;gBACzB,KAAK,EAAE,KAAK,CAAC,aAAa,EAAE;gBAC5B,iBAAiB,EAAE,KAAK,CAAC,cAAc,EAAE;gBACzC,YAAY,EAAE,KAAK,CAAC,cAAc,EAAE;gBACpC,iBAAiB,EAAE,KAAK,CAAC,WAAW,EAAE;aACzC,CAAA;QACL,CAAC;KAAA;IAED,sBAAsB;IAEtB;;;;OAIG;IACH,MAAM,CAAC,aAAa,CAAC,EAAe;;QAChC,IAAI;YACA,MAAM,IAAI,GAAG,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,UAAU,EAAE,CAAA;YAE5C,IAAI,IAAI,KAAK,SAAS;gBAAE,OAAO,SAAS,CAAA;YAExC,MAAM,EAAE,GAAG,IAAI,CAAC,QAAQ,CAAC,EAAE,CAAC,CAAA;YAE5B,IAAI,EAAE,KAAK,UAAU;gBAAE,OAAO,SAAS,CAAA;YAEvC,IAAI,CAAC,IAAA,0CAAqB,EAAC,EAAE,CAAC,EAAE;gBAC5B,OAAO,SAAS,CAAA;aACnB;YAED,OAAO;gBACH,OAAO,EAAE,IAAI,CAAC,QAAQ,CAAC,EAAE,CAAC;gBAC1B,IAAI,EAAE,MAAA,MAAA,EAAE,CAAC,SAAS,0CAAE,IAAI,CAAC,GAAG,mCAAI,SAAS;gBACzC,EAAE,EAAE,IAAI,CAAC,WAAW,EAAE;gBACtB,UAAU,EAAE,IAAI,CAAC,WAAW,EAAE;gBAC9B,aAAa,EAAE,IAAI,CAAC,YAAY,EAAE;gBAClC,aAAa,EAAE,IAAI,CAAC,SAAS,EAAE;gBAC/B,cAAc,EAAE,IAAI,CAAC,YAAY,EAAE;aACtC,CAAA;SACJ;QAAC,OAAO,CAAC,EAAE;YAAE,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,CAAA;SAAE;QAE9B,OAAO,SAAS,CAAA;IACpB,CAAC;CACJ;AA5GD,0BA4GC"}


================================================
FILE: cli/dist/src/wrappers/standard/NftItemRoyalty.js
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/standard/NftItemRoyalty.js
================================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftItemRoyalty = void 0;
const ton_core_1 = require("ton-core");
const NftItem_1 = require("./NftItem");
/**
 * Represents an NFT item contract with royalty features.
 * Inherits from the NftItem class.
 */
class NftItemRoyalty extends NftItem_1.NftItem {
    /**
     * Constructs an instance of the NftItemRoyalty contract from an address.
     * @param address - The address of the contract.
     * @returns An instance of NftItemRoyalty.
     */
    static createFromAddress(address) {
        return new NftItemRoyalty(address);
    }
    /**
     * Sends a request to get the royalty parameters from the contract.
     * @param provider - The ContractProvider to facilitate the data retrieval.
     * @param via - The Sender initiating the data retrieval.
     * @param params - The parameters for the data retrieval.
     */
    sendGetRoyaltyParams(provider, via, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.internal(via, {
                value: params.value,
                body: (0, ton_core_1.beginCell)()
                    .storeUint(0x693d3950, 32)
                    .storeUint(params.queryId, 64)
                    .endCell(),
                sendMode: ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
        });
    }
    /**
     * Retrieves the royalty parameters of the NFT from the contract.
     * @param provider - The ContractProvider to facilitate the data retrieval.
     * @returns An object with the royalty parameters.
     */
    getRoyaltyParams(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stack } = yield provider.get('royalty_params', []);
            return {
                init: stack.readBoolean(),
                numerator: stack.readBigNumber(),
                denominator: stack.readBigNumber(),
                destination: stack.readAddressOpt()
            };
        });
    }
}
exports.NftItemRoyalty = NftItemRoyalty;
//# sourceMappingURL=NftItemRoyalty.js.map


================================================
FILE: cli/dist/src/wrappers/standard/NftItemRoyalty.js.map
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/dist/src/wrappers/standard/NftItemRoyalty.js.map
================================================
{"version":3,"file":"NftItemRoyalty.js","sourceRoot":"","sources":["../../../../../src/wrappers/standard/NftItemRoyalty.ts"],"names":[],"mappings":";;;;;;;;;;;;AAAA,uCAAiF;AACjF,uCAAmC;AAEnC;;;GAGG;AACH,MAAa,cAAe,SAAQ,iBAAO;IACvC;;;;OAIG;IACH,MAAM,CAAC,iBAAiB,CACpB,OAAgB;QAEhB,OAAO,IAAI,cAAc,CACrB,OAAO,CACV,CAAA;IACL,CAAC;IAED;;;;;OAKG;IACG,oBAAoB,CACtB,QAA0B,EAC1B,GAAW,EACX,MAGC;;YAED,MAAM,QAAQ,CAAC,QAAQ,CAAC,GAAG,EAAE;gBACzB,KAAK,EAAE,MAAM,CAAC,KAAK;gBACnB,IAAI,EAAE,IAAA,oBAAS,GAAE;qBACZ,SAAS,CAAC,UAAU,EAAE,EAAE,CAAC;qBACzB,SAAS,CAAC,MAAM,CAAC,OAAO,EAAE,EAAE,CAAC;qBAC7B,OAAO,EAAE;gBACd,QAAQ,EAAE,mBAAQ,CAAC,kBAAkB;aACxC,CAAC,CAAA;QACN,CAAC;KAAA;IAED;;;;OAIG;IACG,gBAAgB,CAClB,QAA0B;;YAE1B,MAAM,EAAE,KAAK,EAAE,GAAG,MAAM,QAAQ,CAAC,GAAG,CAAC,gBAAgB,EAAE,EAAE,CAAC,CAAA;YAC1D,OAAO;gBACH,IAAI,EAAE,KAAK,CAAC,WAAW,EAAE;gBACzB,SAAS,EAAE,KAAK,CAAC,aAAa,EAAE;gBAChC,WAAW,EAAE,KAAK,CAAC,aAAa,EAAE;gBAClC,WAAW,EAAE,KAAK,CAAC,cAAc,EAAE;aACtC,CAAA;QACL,CAAC;KAAA;CACJ;AAtDD,wCAsDC"}


================================================
FILE: cli/package.json
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/package.json
================================================
{
  "name": "cli",
  "version": "1.0.0",
  "main": "index.js",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@ton-community/blueprint": "^0.9.0",
    "@types/node": "^18.16.3",
    "@types/yargs": "^17.0.24",
    "ton": "latest",
    "ton-crypto": "^3.2.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4",
    "yargs": "^17.7.2"
  },
  "bin": {
    "ton-nft-cli": "./dist/cli/src/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "link": "npm link"
  }
}



================================================
FILE: cli/src/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/index.ts
================================================
#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {Pinata} from "../../src/storage/Pinata"
import {AmazonS3} from "../../src/storage/AmazonS3"
import {TonNftClient} from '../../src/ton-api'
import {TonAPI} from '../../src/ton-api/TonAPI'
import { Address } from 'ton-core'
import {createNftSingle, transfer} from "./nftSingle"
import {createNftCollection} from "./nftCollection"
import { TonClient4 } from 'ton';
import createKeyPair from './utils/createKeyPair';

yargs(hideBin(process.argv))
  .command(
    'upload pinata [path]',
    'Upload an NFT via Pinata',
    (yargs) => {
      return yargs
        .positional('path', {
          describe: 'Path to the file to be uploaded',
          type: 'string',
          default: './assets',
        })
        .option('apiKey', {
          alias: 'k',
          describe: 'API key for authentication',
          type: 'string',
          demandOption: true,
        })
        .option('secretApiKey', {
          alias: 's',
          describe: 'Secret API key for authentication',
          type: 'string',
          demandOption: true,
        });
    },
    async (argv) => {
      if (typeof argv.path === 'string' 
          && typeof argv.apiKey === 'string' 
          && typeof argv.secretApiKey == 'string'
      ) {
        console.log(`Using API key: ${argv.apiKey}`);
        console.log(`Using secret API key: ${argv.secretApiKey}`);

        let pinata = new Pinata(argv.apiKey, argv.secretApiKey);
        let imagesUrls = await pinata.uploadBulk(argv.path)

        console.log(`URLs: ${imagesUrls}`)
      }
    }
  )

  .command(
    'upload s3 [path]',
    'Upload an NFT via Amazon S3',
    (yargs) => {
      return yargs
        .positional('path', {
          describe: 'Path to the file to be uploaded',
          type: 'string',
          default: './assets',
        })
        .option('accessKey', {
          alias: 'k',
          describe: 'Access key for authentication',
          type: 'string',
          demandOption: true,
        })
        .option('secretAccessKey', {
          alias: 's',
          describe: 'Secret access key for authentication',
          type: 'string',
          demandOption: true,
        })
        .option('bucketName', {
          alias: 'b',
          describe: 'Bucket Name',
          type:'string',
          demandOption: true,
        })
        .option('fileType', {
          alias: 'f',
          describe: 'File type of the image',
          type: 'string',
          demandOption: true,
          default: "image/jpeg"
        });
    },
    async (argv) => {
      if (typeof argv.path === 'string' 
          && typeof argv.apiKey === 'string' 
          && typeof argv.secretApiKey == 'string'
      ) {
        console.log(`Using API key: ${argv.apiKey}`);
        console.log(`Using secret API key: ${argv.secretApiKey}`);
        console.log(`Using bucket name: ${argv.bucketName}`);

        let s3 = new AmazonS3(argv.apiKey, argv.secretApiKey, argv.bucketName);
        let imagesUrls = await s3.uploadBulk(argv.path)

        console.log(`URLs: ${imagesUrls}`)
      }
    }
  )

  // New command for getNftCollections
  .command(
    'collections [limit] [offset]',
    'Get NFT collections',
    (yargs) => {
      return yargs
        .positional('limit', {
          describe: 'Maximum number of collections to return',
          type: 'number',
          default: 10,
        })
        .positional('offset', {
          describe: 'Number of collections to skip',
          type: 'number',
          default: 0,
        });
    },
    async (argv) => {
      const tonClient = new TonNftClient(new TonAPI());
      const collections = await tonClient.getNftCollections(argv.limit, argv.offset);
      console.log(collections);
    }
  )
  // New command for getNftCollectionByAddress
  .command(
    'collection <address>',
    'Get NFT collection by address',
    (yargs) => {
      return yargs.positional('address', {
        describe: 'Collection address',
        type: 'string',
      });
    },
    async (argv) => {
      if (typeof argv.address === 'string') {
        const tonClient = new TonNftClient(new TonAPI());
        const collection = await tonClient.getNftCollection(argv.address);
        console.log(collection);
      }
    }
  )
  // New command for getNftItemsFromCollectionByAddress
  .command(
    'collection-items <address> [limit] [offset]',
    'Get NFT items from collection by address',
    (yargs) => {
      return yargs
        .positional('address', {
          describe: 'Collection address',
          type: 'string',
        })
        .positional('limit', {
          describe: 'Maximum number of items to return',
          type: 'number',
          default: 10,
        })
        .positional('offset', {
          describe: 'Number of items to skip',
          type: 'number',
          default: 0,
        });
    },
    async (argv) => {
      if (typeof argv.address === 'string') {
        const tonClient = new TonNftClient(new TonAPI());
        const items = await tonClient.getNftItems(argv.address, argv.limit, argv.offset);
        console.log(items);
      }
    }
  )

  // New command for getNftItemByAddress
  .command(
    'item <address>',
    'Get NFT item by its address',
    (yargs) => {
      return yargs.positional('address', {
        describe: 'Item address',
        type: 'string',
      });
    },
    async (argv) => {
      if (typeof argv.address === 'string') {
        const tonClient = new TonNftClient(new TonAPI());
        const item = await tonClient.getNftItem(argv.address);
        console.log(item);
      }
    }
  )

  .command(
    'keypair create',
    'Creates Keypair',
    (yargs) => {
      
    },
    async (argv) => {
      await createKeyPair();
  })

  .command(
    'nft-single create <configPath> [secretKey]',
    'Create a single NFT',
    (yargs) => {
      return yargs
        .positional('configPath', {
          describe: 'Path to the NFT single data config JSON file',
          type: 'string',
        })
        .positional('secretKey', {
          describe: 'Secret key for creating the NFT',
          type: 'string',
          default: undefined,
        });
    },
    async (argv) => {
      if (typeof argv.configPath === 'string') {
        const client = new TonClient4({
          endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });
        const config = require(argv.configPath);
        const options = { secretKey: argv.secretKey };
        await createNftSingle(client, config, options);
      }
    }
  )

  .command(
    'nft-single transfer <destination> [configPath] [secretKey]',
    'Transfer an NFT Single',
    (yargs) => {
      return yargs
        .positional('destination', {
          describe: 'Destination address',
          type: 'string',
        })
        .positional('configPath', {
          describe: 'Path to the transfer configuration JSON file',
          type: 'string',
          default: undefined,
        })
        .positional('secretKey', {
          describe: 'Secret key of the Sender',
          type: 'string',
          default: undefined,
        });
    },
    async (argv) => {
      if (typeof argv.destination === 'string') {
        const client = new TonClient4({
          endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });

        const options = { configPath: argv.configPath, secretKey: argv.secretKey };
        await transfer(client, argv.destination, options);
      }
    }
  )

  .command(
    'nft-collection create <configPath> [secretKey]',
    'Create a NFT Collection',
    (yargs) => {
      return yargs
       .positional('configPath', {
          describe: 'Path to the NFT collection data config JSON file',
          type:'string',
        })
       .positional('secretKey', {
          describe: 'Secret key for creating the NFT',
          type:'string',
          default: undefined,
        });
        },
    async (argv) => {
      if (typeof argv.configPath ==='string') {
        const client = new TonClient4({
          endpoint: "https://toncenter.com/api/v2/jsonRPC"
        });
        const config = require(argv.configPath);
        const options = { secretKey: argv.secretKey };
        await createNftCollection(client, config, options);
      }
    }
  )

  
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .alias('h', 'help')
  .strict()
  .parse();



================================================
FILE: cli/src/nftCollection.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/nftCollection.ts
================================================
import { Sender, toNano } from 'ton-core'
import {NftCollection, NftCollectionData} from '../../src/wrappers/getgems/NftCollection/NftCollection'
import importKeyPair from './utils/importKeyPair';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { error } from 'console';
import { env } from 'process';
import { Address } from 'ton-core'
import { TonClient4 } from 'ton';
import createSender from './utils/createSender'

export async function createNftCollection(
    client: TonClient4,
    config: NftCollectionData,
    options?: {
        secretKey?: string
    }
) {
    let keypair = await importKeyPair(options?.secretKey);
    
    let sender = await createSender(keypair, client)
    

    const nftCollection = client.open(
        await NftCollection.createFromConfig(
            config
        )
    );

    await nftCollection.sendDeploy(sender, toNano('0.05'));

    console.log(
        `NFT Single deployed at ${nftCollection.address}`
    )

    await writeFileSync(
        './NftCollection.json',
        JSON.stringify({
            config: config,
            address: nftCollection.address,
            init: nftCollection.init
        }
    ))
    
    console.log(
        `Saved Config`
    )

    return nftCollection;
}

export async function importExistingNftCollection(
    client: TonClient4,
    options?: {
        configPath?: string,
        address?: Address
    }
) {
    if (options?.configPath) {
        const config = JSON.parse(
            readFileSync(
                options?.configPath,
                'utf-8'
            )
        )

        const nftCollection = client.open(
            await NftCollection.createFromAddress(
                config.address
            )
        );

        return nftCollection
    } else if (existsSync(String(env.PATH_TO_CONFIG))) {
        const config = JSON.parse(readFileSync(String(env.PATH_TO_CONFIG), 'utf-8'));

        const nftCollection = client.open(
            await NftCollection.createFromAddress(
                config.address
            )
        );

        return nftCollection;
    } else {
        const nftCollection = client.open(
            await NftCollection.createFromAddress(
                options?.address ?? Address.parse(String(env.NFT_COLLECTION_ADDRESS))
            )
        );

        return nftCollection;
    }
}


export async function mint(
    client: TonClient4,
    itemOwner: Address,
    collectionAddress: Address,
    itemContent: string,
    options?: {
        configPath?: string,
        secretKey?: string
    }
) {
    const nftCollection = await importExistingNftCollection(
        client,
        {
            configPath: options?.configPath,
            address: collectionAddress
        }
    );

    let keypair = await importKeyPair(
        options?.secretKey
    )

    let sender = await createSender(keypair, client);

    let collectionData = await nftCollection.getCollectionData();

    let tx = await nftCollection.sendMint(
        sender,
        {
            value: toNano("0.05"),
            passAmount: toNano("0"),
            itemIndex: Number(collectionData.nextItemIndex),
            itemOwnerAddress: itemOwner,
            itemContent: itemContent
        }
    );

    console.log(
        `Minted NFT to ${itemOwner.toString()}`
    )
}


================================================
FILE: cli/src/nftSingle.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/nftSingle.ts
================================================
import { Sender, toNano } from 'ton-core'
import {NftSingle, NftSingleData} from '../../src/wrappers/getgems/NftSingle/NftSingle'
import importKeyPair from './utils/importKeyPair';
import { readFileSync, writeFileSync } from 'fs';
import { error } from 'console';
import { env } from 'process';
import { Address } from 'ton-core'
import { TonClient4 } from 'ton';
import createSender from './utils/createSender'

export async function createNftSingle(
    client: TonClient4,
    config: NftSingleData,
    options?: {
        secretKey?: string
    }
) {
    let keypair = await importKeyPair(options?.secretKey);
    
    let sender = await createSender(keypair, client)
    

    const nftSingle = client.open(
        await NftSingle.createFromConfig(
            config
        )
    );

    await nftSingle.sendDeploy(sender, toNano('0.05'));

    console.log(
        `NFT Single deployed at ${nftSingle.address}`
    )

    await writeFileSync(
        './nftSingle.json',
        JSON.stringify({
            config: config,
            address: nftSingle.address,
            init: nftSingle.init
        }
    ))
    
    console.log(
        `Saved Config`
    )

    return nftSingle;
}

export async function importExistingNftSingle(
    client: TonClient4,
    options?: {
        configPath?: string
    }
) {
    if (options?.configPath) {
        const config = JSON.parse(
            readFileSync(
                options?.configPath,
                'utf-8'
            )
        )

        const nftSingle = client.open(
            await NftSingle.createFromAddress(
                config.address
            )
        );

        return nftSingle
    } else {
        const config = JSON.parse(readFileSync(String(env.PATH_TO_CONFIG), 'utf-8'));

        const nftSingle = client.open(
            await NftSingle.createFromAddress(
                config.address
            )
        );

        return nftSingle;
    }
}

export async function transfer(
    client: TonClient4,
    destination: string,
    options?: {
        configPath?: string,
        secretKey?: string
    }
) {
    const nftSingle = await importExistingNftSingle(
        client,
        options
    );

    let keypair = await importKeyPair(
        options?.secretKey
    )

    let sender = await createSender(keypair, client);

    let tx = await nftSingle.sendTransfer(
        sender,
        {
            value: toNano('0.05'),
            queryId: toNano('0'),
            newOwner: Address.parse(destination),
            responseDestination: sender.address,
            forwardAmount: toNano('0')
        }
    );

    console.log(
        `Transferred NFT from ${sender.address?.toString()} to ${destination}`
    )
}


================================================
FILE: cli/src/utils/createKeyPair.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/utils/createKeyPair.ts
================================================
import { writeFileSync } from "fs";
import {mnemonicNew, mnemonicToPrivateKey} from "ton-crypto"

export async function createKeyPair() {
    let mnemonic = await mnemonicNew()
    let keypair = await mnemonicToPrivateKey(mnemonic)

    writeFileSync(
        "./keypair.json",
        JSON.stringify(keypair)
    );

    writeFileSync(
        "./.env",
        `SECRET_KEY=${keypair.secretKey.toString()}`
    )
}

export default createKeyPair;


================================================
FILE: cli/src/utils/createSender.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/utils/createSender.ts
================================================
import { KeyPair } from "ton-crypto";
import { TonClient4, WalletContractV4 } from "ton";

export async function createSender(
    keypair: KeyPair,
    client: TonClient4
) {
    let wallet = WalletContractV4.create(
        {
            workchain: 0,
            publicKey: keypair.publicKey
        }
    )
    
    let contract = client.open(
        wallet
    );

    return contract.sender(keypair.secretKey);
}

export default createSender;


================================================
FILE: cli/src/utils/importKeyPair.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/cli/src/utils/importKeyPair.ts
================================================
import { env } from 'process'
import { KeyPair, keyPairFromSecretKey } from "ton-crypto"
import { readFileSync } from 'fs';

export async function importKeyPair(
    secretKey?: string
) {
    let keyPair: KeyPair;

    if (secretKey) {
        keyPair = keyPairFromSecretKey(Buffer.from(secretKey, 'hex'));
    } else {
        const content = readFileSync(String(env.SECRET_KEY), 'utf-8');
        keyPair = keyPairFromSecretKey(Buffer.from(content, 'hex'));
    }

    return keyPair;
}

export default importKeyPair;


================================================
FILE: docs/.nojekyll
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/.nojekyll
================================================
TypeDoc added this file to prevent GitHub Pages from using Jekyll. You can turn off this behavior by setting the `githubPages` option to false.


================================================
FILE: docs/assets/highlight.css
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/assets/highlight.css
================================================
:root {
    --light-code-background: #FFFFFF;
    --dark-code-background: #1E1E1E;
}

@media (prefers-color-scheme: light) { :root {
    --code-background: var(--light-code-background);
} }

@media (prefers-color-scheme: dark) { :root {
    --code-background: var(--dark-code-background);
} }

:root[data-theme='light'] {
    --code-background: var(--light-code-background);
}

:root[data-theme='dark'] {
    --code-background: var(--dark-code-background);
}

pre, code { background: var(--code-background); }



================================================
FILE: docs/assets/main.js
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/assets/main.js
================================================
"use strict";
"use strict";(()=>{var Se=Object.create;var re=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var Te=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,Qe=Object.prototype.hasOwnProperty;var Pe=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Ie=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Te(e))!Qe.call(t,i)&&i!==r&&re(t,i,{get:()=>e[i],enumerable:!(n=we(e,i))||n.enumerable});return t};var Ce=(t,e,r)=>(r=t!=null?Se(ke(t)):{},Ie(e||!t||!t.__esModule?re(r,"default",{value:t,enumerable:!0}):r,t));var ae=Pe((se,oe)=>{(function(){var t=function(e){var r=new t.Builder;return r.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),r.searchPipeline.add(t.stemmer),e.call(r,r),r.build()};t.version="2.3.9";t.utils={},t.utils.warn=function(e){return function(r){e.console&&console.warn&&console.warn(r)}}(this),t.utils.asString=function(e){return e==null?"":e.toString()},t.utils.clone=function(e){if(e==null)return e;for(var r=Object.create(null),n=Object.keys(e),i=0;i<n.length;i++){var s=n[i],o=e[s];if(Array.isArray(o)){r[s]=o.slice();continue}if(typeof o=="string"||typeof o=="number"||typeof o=="boolean"){r[s]=o;continue}throw new TypeError("clone is not deep and does not support nested objects")}return r},t.FieldRef=function(e,r,n){this.docRef=e,this.fieldName=r,this._stringValue=n},t.FieldRef.joiner="/",t.FieldRef.fromString=function(e){var r=e.indexOf(t.FieldRef.joiner);if(r===-1)throw"malformed field ref string";var n=e.slice(0,r),i=e.slice(r+1);return new t.FieldRef(i,n,e)},t.FieldRef.prototype.toString=function(){return this._stringValue==null&&(this._stringValue=this.fieldName+t.FieldRef.joiner+this.docRef),this._stringValue};t.Set=function(e){if(this.elements=Object.create(null),e){this.length=e.length;for(var r=0;r<this.length;r++)this.elements[e[r]]=!0}else this.length=0},t.Set.complete={intersect:function(e){return e},union:function(){return this},contains:function(){return!0}},t.Set.empty={intersect:function(){return this},union:function(e){return e},contains:function(){return!1}},t.Set.prototype.contains=function(e){return!!this.elements[e]},t.Set.prototype.intersect=function(e){var r,n,i,s=[];if(e===t.Set.complete)return this;if(e===t.Set.empty)return e;this.length<e.length?(r=this,n=e):(r=e,n=this),i=Object.keys(r.elements);for(var o=0;o<i.length;o++){var a=i[o];a in n.elements&&s.push(a)}return new t.Set(s)},t.Set.prototype.union=function(e){return e===t.Set.complete?t.Set.complete:e===t.Set.empty?this:new t.Set(Object.keys(this.elements).concat(Object.keys(e.elements)))},t.idf=function(e,r){var n=0;for(var i in e)i!="_index"&&(n+=Object.keys(e[i]).length);var s=(r-n+.5)/(n+.5);return Math.log(1+Math.abs(s))},t.Token=function(e,r){this.str=e||"",this.metadata=r||{}},t.Token.prototype.toString=function(){return this.str},t.Token.prototype.update=function(e){return this.str=e(this.str,this.metadata),this},t.Token.prototype.clone=function(e){return e=e||function(r){return r},new t.Token(e(this.str,this.metadata),this.metadata)};t.tokenizer=function(e,r){if(e==null||e==null)return[];if(Array.isArray(e))return e.map(function(m){return new t.Token(t.utils.asString(m).toLowerCase(),t.utils.clone(r))});for(var n=e.toString().toLowerCase(),i=n.length,s=[],o=0,a=0;o<=i;o++){var l=n.charAt(o),u=o-a;if(l.match(t.tokenizer.separator)||o==i){if(u>0){var d=t.utils.clone(r)||{};d.position=[a,u],d.index=s.length,s.push(new t.Token(n.slice(a,o),d))}a=o+1}}return s},t.tokenizer.separator=/[\s\-]+/;t.Pipeline=function(){this._stack=[]},t.Pipeline.registeredFunctions=Object.create(null),t.Pipeline.registerFunction=function(e,r){r in this.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+r),e.label=r,t.Pipeline.registeredFunctions[e.label]=e},t.Pipeline.warnIfFunctionNotRegistered=function(e){var r=e.label&&e.label in this.registeredFunctions;r||t.utils.warn(`Function is not registered with pipeline. This may cause problems when serialising the index.
`,e)},t.Pipeline.load=function(e){var r=new t.Pipeline;return e.forEach(function(n){var i=t.Pipeline.registeredFunctions[n];if(i)r.add(i);else throw new Error("Cannot load unregistered function: "+n)}),r},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(r){t.Pipeline.warnIfFunctionNotRegistered(r),this._stack.push(r)},this)},t.Pipeline.prototype.after=function(e,r){t.Pipeline.warnIfFunctionNotRegistered(r);var n=this._stack.indexOf(e);if(n==-1)throw new Error("Cannot find existingFn");n=n+1,this._stack.splice(n,0,r)},t.Pipeline.prototype.before=function(e,r){t.Pipeline.warnIfFunctionNotRegistered(r);var n=this._stack.indexOf(e);if(n==-1)throw new Error("Cannot find existingFn");this._stack.splice(n,0,r)},t.Pipeline.prototype.remove=function(e){var r=this._stack.indexOf(e);r!=-1&&this._stack.splice(r,1)},t.Pipeline.prototype.run=function(e){for(var r=this._stack.length,n=0;n<r;n++){for(var i=this._stack[n],s=[],o=0;o<e.length;o++){var a=i(e[o],o,e);if(!(a==null||a===""))if(Array.isArray(a))for(var l=0;l<a.length;l++)s.push(a[l]);else s.push(a)}e=s}return e},t.Pipeline.prototype.runString=function(e,r){var n=new t.Token(e,r);return this.run([n]).map(function(i){return i.toString()})},t.Pipeline.prototype.reset=function(){this._stack=[]},t.Pipeline.prototype.toJSON=function(){return this._stack.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})};t.Vector=function(e){this._magnitude=0,this.elements=e||[]},t.Vector.prototype.positionForIndex=function(e){if(this.elements.length==0)return 0;for(var r=0,n=this.elements.length/2,i=n-r,s=Math.floor(i/2),o=this.elements[s*2];i>1&&(o<e&&(r=s),o>e&&(n=s),o!=e);)i=n-r,s=r+Math.floor(i/2),o=this.elements[s*2];if(o==e||o>e)return s*2;if(o<e)return(s+1)*2},t.Vector.prototype.insert=function(e,r){this.upsert(e,r,function(){throw"duplicate index"})},t.Vector.prototype.upsert=function(e,r,n){this._magnitude=0;var i=this.positionForIndex(e);this.elements[i]==e?this.elements[i+1]=n(this.elements[i+1],r):this.elements.splice(i,0,e,r)},t.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var e=0,r=this.elements.length,n=1;n<r;n+=2){var i=this.elements[n];e+=i*i}return this._magnitude=Math.sqrt(e)},t.Vector.prototype.dot=function(e){for(var r=0,n=this.elements,i=e.elements,s=n.length,o=i.length,a=0,l=0,u=0,d=0;u<s&&d<o;)a=n[u],l=i[d],a<l?u+=2:a>l?d+=2:a==l&&(r+=n[u+1]*i[d+1],u+=2,d+=2);return r},t.Vector.prototype.similarity=function(e){return this.dot(e)/this.magnitude()||0},t.Vector.prototype.toArray=function(){for(var e=new Array(this.elements.length/2),r=1,n=0;r<this.elements.length;r+=2,n++)e[n]=this.elements[r];return e},t.Vector.prototype.toJSON=function(){return this.elements};t.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},r={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",i="[aeiouy]",s=n+"[^aeiouy]*",o=i+"[aeiou]*",a="^("+s+")?"+o+s,l="^("+s+")?"+o+s+"("+o+")?$",u="^("+s+")?"+o+s+o+s,d="^("+s+")?"+i,m=new RegExp(a),y=new RegExp(u),b=new RegExp(l),g=new RegExp(d),E=/^(.+?)(ss|i)es$/,f=/^(.+?)([^s])s$/,p=/^(.+?)eed$/,w=/^(.+?)(ed|ing)$/,S=/.$/,k=/(at|bl|iz)$/,_=new RegExp("([^aeiouylsz])\\1$"),B=new RegExp("^"+s+i+"[^aeiouwxy]$"),A=/^(.+?[^aeiou])y$/,j=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,q=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,V=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,$=/^(.+?)(s|t)(ion)$/,I=/^(.+?)e$/,z=/ll$/,W=new RegExp("^"+s+i+"[^aeiouwxy]$"),H=function(c){var v,C,T,h,x,O,F;if(c.length<3)return c;if(T=c.substr(0,1),T=="y"&&(c=T.toUpperCase()+c.substr(1)),h=E,x=f,h.test(c)?c=c.replace(h,"$1$2"):x.test(c)&&(c=c.replace(x,"$1$2")),h=p,x=w,h.test(c)){var L=h.exec(c);h=m,h.test(L[1])&&(h=S,c=c.replace(h,""))}else if(x.test(c)){var L=x.exec(c);v=L[1],x=g,x.test(v)&&(c=v,x=k,O=_,F=B,x.test(c)?c=c+"e":O.test(c)?(h=S,c=c.replace(h,"")):F.test(c)&&(c=c+"e"))}if(h=A,h.test(c)){var L=h.exec(c);v=L[1],c=v+"i"}if(h=j,h.test(c)){var L=h.exec(c);v=L[1],C=L[2],h=m,h.test(v)&&(c=v+e[C])}if(h=q,h.test(c)){var L=h.exec(c);v=L[1],C=L[2],h=m,h.test(v)&&(c=v+r[C])}if(h=V,x=$,h.test(c)){var L=h.exec(c);v=L[1],h=y,h.test(v)&&(c=v)}else if(x.test(c)){var L=x.exec(c);v=L[1]+L[2],x=y,x.test(v)&&(c=v)}if(h=I,h.test(c)){var L=h.exec(c);v=L[1],h=y,x=b,O=W,(h.test(v)||x.test(v)&&!O.test(v))&&(c=v)}return h=z,x=y,h.test(c)&&x.test(c)&&(h=S,c=c.replace(h,"")),T=="y"&&(c=T.toLowerCase()+c.substr(1)),c};return function(R){return R.update(H)}}(),t.Pipeline.registerFunction(t.stemmer,"stemmer");t.generateStopWordFilter=function(e){var r=e.reduce(function(n,i){return n[i]=i,n},{});return function(n){if(n&&r[n.toString()]!==n.toString())return n}},t.stopWordFilter=t.generateStopWordFilter(["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"]),t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter");t.trimmer=function(e){return e.update(function(r){return r.replace(/^\W+/,"").replace(/\W+$/,"")})},t.Pipeline.registerFunction(t.trimmer,"trimmer");t.TokenSet=function(){this.final=!1,this.edges={},this.id=t.TokenSet._nextId,t.TokenSet._nextId+=1},t.TokenSet._nextId=1,t.TokenSet.fromArray=function(e){for(var r=new t.TokenSet.Builder,n=0,i=e.length;n<i;n++)r.insert(e[n]);return r.finish(),r.root},t.TokenSet.fromClause=function(e){return"editDistance"in e?t.TokenSet.fromFuzzyString(e.term,e.editDistance):t.TokenSet.fromString(e.term)},t.TokenSet.fromFuzzyString=function(e,r){for(var n=new t.TokenSet,i=[{node:n,editsRemaining:r,str:e}];i.length;){var s=i.pop();if(s.str.length>0){var o=s.str.charAt(0),a;o in s.node.edges?a=s.node.edges[o]:(a=new t.TokenSet,s.node.edges[o]=a),s.str.length==1&&(a.final=!0),i.push({node:a,editsRemaining:s.editsRemaining,str:s.str.slice(1)})}if(s.editsRemaining!=0){if("*"in s.node.edges)var l=s.node.edges["*"];else{var l=new t.TokenSet;s.node.edges["*"]=l}if(s.str.length==0&&(l.final=!0),i.push({node:l,editsRemaining:s.editsRemaining-1,str:s.str}),s.str.length>1&&i.push({node:s.node,editsRemaining:s.editsRemaining-1,str:s.str.slice(1)}),s.str.length==1&&(s.node.final=!0),s.str.length>=1){if("*"in s.node.edges)var u=s.node.edges["*"];else{var u=new t.TokenSet;s.node.edges["*"]=u}s.str.length==1&&(u.final=!0),i.push({node:u,editsRemaining:s.editsRemaining-1,str:s.str.slice(1)})}if(s.str.length>1){var d=s.str.charAt(0),m=s.str.charAt(1),y;m in s.node.edges?y=s.node.edges[m]:(y=new t.TokenSet,s.node.edges[m]=y),s.str.length==1&&(y.final=!0),i.push({node:y,editsRemaining:s.editsRemaining-1,str:d+s.str.slice(2)})}}}return n},t.TokenSet.fromString=function(e){for(var r=new t.TokenSet,n=r,i=0,s=e.length;i<s;i++){var o=e[i],a=i==s-1;if(o=="*")r.edges[o]=r,r.final=a;else{var l=new t.TokenSet;l.final=a,r.edges[o]=l,r=l}}return n},t.TokenSet.prototype.toArray=function(){for(var e=[],r=[{prefix:"",node:this}];r.length;){var n=r.pop(),i=Object.keys(n.node.edges),s=i.length;n.node.final&&(n.prefix.charAt(0),e.push(n.prefix));for(var o=0;o<s;o++){var a=i[o];r.push({prefix:n.prefix.concat(a),node:n.node.edges[a]})}}return e},t.TokenSet.prototype.toString=function(){if(this._str)return this._str;for(var e=this.final?"1":"0",r=Object.keys(this.edges).sort(),n=r.length,i=0;i<n;i++){var s=r[i],o=this.edges[s];e=e+s+o.id}return e},t.TokenSet.prototype.intersect=function(e){for(var r=new t.TokenSet,n=void 0,i=[{qNode:e,output:r,node:this}];i.length;){n=i.pop();for(var s=Object.keys(n.qNode.edges),o=s.length,a=Object.keys(n.node.edges),l=a.length,u=0;u<o;u++)for(var d=s[u],m=0;m<l;m++){var y=a[m];if(y==d||d=="*"){var b=n.node.edges[y],g=n.qNode.edges[d],E=b.final&&g.final,f=void 0;y in n.output.edges?(f=n.output.edges[y],f.final=f.final||E):(f=new t.TokenSet,f.final=E,n.output.edges[y]=f),i.push({qNode:g,output:f,node:b})}}}return r},t.TokenSet.Builder=function(){this.previousWord="",this.root=new t.TokenSet,this.uncheckedNodes=[],this.minimizedNodes={}},t.TokenSet.Builder.prototype.insert=function(e){var r,n=0;if(e<this.previousWord)throw new Error("Out of order word insertion");for(var i=0;i<e.length&&i<this.previousWord.length&&e[i]==this.previousWord[i];i++)n++;this.minimize(n),this.uncheckedNodes.length==0?r=this.root:r=this.uncheckedNodes[this.uncheckedNodes.length-1].child;for(var i=n;i<e.length;i++){var s=new t.TokenSet,o=e[i];r.edges[o]=s,this.uncheckedNodes.push({parent:r,char:o,child:s}),r=s}r.final=!0,this.previousWord=e},t.TokenSet.Builder.prototype.finish=function(){this.minimize(0)},t.TokenSet.Builder.prototype.minimize=function(e){for(var r=this.uncheckedNodes.length-1;r>=e;r--){var n=this.uncheckedNodes[r],i=n.child.toString();i in this.minimizedNodes?n.parent.edges[n.char]=this.minimizedNodes[i]:(n.child._str=i,this.minimizedNodes[i]=n.child),this.uncheckedNodes.pop()}};t.Index=function(e){this.invertedIndex=e.invertedIndex,this.fieldVectors=e.fieldVectors,this.tokenSet=e.tokenSet,this.fields=e.fields,this.pipeline=e.pipeline},t.Index.prototype.search=function(e){return this.query(function(r){var n=new t.QueryParser(e,r);n.parse()})},t.Index.prototype.query=function(e){for(var r=new t.Query(this.fields),n=Object.create(null),i=Object.create(null),s=Object.create(null),o=Object.create(null),a=Object.create(null),l=0;l<this.fields.length;l++)i[this.fields[l]]=new t.Vector;e.call(r,r);for(var l=0;l<r.clauses.length;l++){var u=r.clauses[l],d=null,m=t.Set.empty;u.usePipeline?d=this.pipeline.runString(u.term,{fields:u.fields}):d=[u.term];for(var y=0;y<d.length;y++){var b=d[y];u.term=b;var g=t.TokenSet.fromClause(u),E=this.tokenSet.intersect(g).toArray();if(E.length===0&&u.presence===t.Query.presence.REQUIRED){for(var f=0;f<u.fields.length;f++){var p=u.fields[f];o[p]=t.Set.empty}break}for(var w=0;w<E.length;w++)for(var S=E[w],k=this.invertedIndex[S],_=k._index,f=0;f<u.fields.length;f++){var p=u.fields[f],B=k[p],A=Object.keys(B),j=S+"/"+p,q=new t.Set(A);if(u.presence==t.Query.presence.REQUIRED&&(m=m.union(q),o[p]===void 0&&(o[p]=t.Set.complete)),u.presence==t.Query.presence.PROHIBITED){a[p]===void 0&&(a[p]=t.Set.empty),a[p]=a[p].union(q);continue}if(i[p].upsert(_,u.boost,function(Ee,be){return Ee+be}),!s[j]){for(var V=0;V<A.length;V++){var $=A[V],I=new t.FieldRef($,p),z=B[$],W;(W=n[I])===void 0?n[I]=new t.MatchData(S,p,z):W.add(S,p,z)}s[j]=!0}}}if(u.presence===t.Query.presence.REQUIRED)for(var f=0;f<u.fields.length;f++){var p=u.fields[f];o[p]=o[p].intersect(m)}}for(var H=t.Set.complete,R=t.Set.empty,l=0;l<this.fields.length;l++){var p=this.fields[l];o[p]&&(H=H.intersect(o[p])),a[p]&&(R=R.union(a[p]))}var c=Object.keys(n),v=[],C=Object.create(null);if(r.isNegated()){c=Object.keys(this.fieldVectors);for(var l=0;l<c.length;l++){var I=c[l],T=t.FieldRef.fromString(I);n[I]=new t.MatchData}}for(var l=0;l<c.length;l++){var T=t.FieldRef.fromString(c[l]),h=T.docRef;if(H.contains(h)&&!R.contains(h)){var x=this.fieldVectors[T],O=i[T.fieldName].similarity(x),F;if((F=C[h])!==void 0)F.score+=O,F.matchData.combine(n[T]);else{var L={ref:h,score:O,matchData:n[T]};C[h]=L,v.push(L)}}}return v.sort(function(xe,Le){return Le.score-xe.score})},t.Index.prototype.toJSON=function(){var e=Object.keys(this.invertedIndex).sort().map(function(n){return[n,this.invertedIndex[n]]},this),r=Object.keys(this.fieldVectors).map(function(n){return[n,this.fieldVectors[n].toJSON()]},this);return{version:t.version,fields:this.fields,fieldVectors:r,invertedIndex:e,pipeline:this.pipeline.toJSON()}},t.Index.load=function(e){var r={},n={},i=e.fieldVectors,s=Object.create(null),o=e.invertedIndex,a=new t.TokenSet.Builder,l=t.Pipeline.load(e.pipeline);e.version!=t.version&&t.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+t.version+"' does not match serialized index '"+e.version+"'");for(var u=0;u<i.length;u++){var d=i[u],m=d[0],y=d[1];n[m]=new t.Vector(y)}for(var u=0;u<o.length;u++){var d=o[u],b=d[0],g=d[1];a.insert(b),s[b]=g}return a.finish(),r.fields=e.fields,r.fieldVectors=n,r.invertedIndex=s,r.tokenSet=a.root,r.pipeline=l,new t.Index(r)};t.Builder=function(){this._ref="id",this._fields=Object.create(null),this._documents=Object.create(null),this.invertedIndex=Object.create(null),this.fieldTermFrequencies={},this.fieldLengths={},this.tokenizer=t.tokenizer,this.pipeline=new t.Pipeline,this.searchPipeline=new t.Pipeline,this.documentCount=0,this._b=.75,this._k1=1.2,this.termIndex=0,this.metadataWhitelist=[]},t.Builder.prototype.ref=function(e){this._ref=e},t.Builder.prototype.field=function(e,r){if(/\//.test(e))throw new RangeError("Field '"+e+"' contains illegal character '/'");this._fields[e]=r||{}},t.Builder.prototype.b=function(e){e<0?this._b=0:e>1?this._b=1:this._b=e},t.Builder.prototype.k1=function(e){this._k1=e},t.Builder.prototype.add=function(e,r){var n=e[this._ref],i=Object.keys(this._fields);this._documents[n]=r||{},this.documentCount+=1;for(var s=0;s<i.length;s++){var o=i[s],a=this._fields[o].extractor,l=a?a(e):e[o],u=this.tokenizer(l,{fields:[o]}),d=this.pipeline.run(u),m=new t.FieldRef(n,o),y=Object.create(null);this.fieldTermFrequencies[m]=y,this.fieldLengths[m]=0,this.fieldLengths[m]+=d.length;for(var b=0;b<d.length;b++){var g=d[b];if(y[g]==null&&(y[g]=0),y[g]+=1,this.invertedIndex[g]==null){var E=Object.create(null);E._index=this.termIndex,this.termIndex+=1;for(var f=0;f<i.length;f++)E[i[f]]=Object.create(null);this.invertedIndex[g]=E}this.invertedIndex[g][o][n]==null&&(this.invertedIndex[g][o][n]=Object.create(null));for(var p=0;p<this.metadataWhitelist.length;p++){var w=this.metadataWhitelist[p],S=g.metadata[w];this.invertedIndex[g][o][n][w]==null&&(this.invertedIndex[g][o][n][w]=[]),this.invertedIndex[g][o][n][w].push(S)}}}},t.Builder.prototype.calculateAverageFieldLengths=function(){for(var e=Object.keys(this.fieldLengths),r=e.length,n={},i={},s=0;s<r;s++){var o=t.FieldRef.fromString(e[s]),a=o.fieldName;i[a]||(i[a]=0),i[a]+=1,n[a]||(n[a]=0),n[a]+=this.fieldLengths[o]}for(var l=Object.keys(this._fields),s=0;s<l.length;s++){var u=l[s];n[u]=n[u]/i[u]}this.averageFieldLength=n},t.Builder.prototype.createFieldVectors=function(){for(var e={},r=Object.keys(this.fieldTermFrequencies),n=r.length,i=Object.create(null),s=0;s<n;s++){for(var o=t.FieldRef.fromString(r[s]),a=o.fieldName,l=this.fieldLengths[o],u=new t.Vector,d=this.fieldTermFrequencies[o],m=Object.keys(d),y=m.length,b=this._fields[a].boost||1,g=this._documents[o.docRef].boost||1,E=0;E<y;E++){var f=m[E],p=d[f],w=this.invertedIndex[f]._index,S,k,_;i[f]===void 0?(S=t.idf(this.invertedIndex[f],this.documentCount),i[f]=S):S=i[f],k=S*((this._k1+1)*p)/(this._k1*(1-this._b+this._b*(l/this.averageFieldLength[a]))+p),k*=b,k*=g,_=Math.round(k*1e3)/1e3,u.insert(w,_)}e[o]=u}this.fieldVectors=e},t.Builder.prototype.createTokenSet=function(){this.tokenSet=t.TokenSet.fromArray(Object.keys(this.invertedIndex).sort())},t.Builder.prototype.build=function(){return this.calculateAverageFieldLengths(),this.createFieldVectors(),this.createTokenSet(),new t.Index({invertedIndex:this.invertedIndex,fieldVectors:this.fieldVectors,tokenSet:this.tokenSet,fields:Object.keys(this._fields),pipeline:this.searchPipeline})},t.Builder.prototype.use=function(e){var r=Array.prototype.slice.call(arguments,1);r.unshift(this),e.apply(this,r)},t.MatchData=function(e,r,n){for(var i=Object.create(null),s=Object.keys(n||{}),o=0;o<s.length;o++){var a=s[o];i[a]=n[a].slice()}this.metadata=Object.create(null),e!==void 0&&(this.metadata[e]=Object.create(null),this.metadata[e][r]=i)},t.MatchData.prototype.combine=function(e){for(var r=Object.keys(e.metadata),n=0;n<r.length;n++){var i=r[n],s=Object.keys(e.metadata[i]);this.metadata[i]==null&&(this.metadata[i]=Object.create(null));for(var o=0;o<s.length;o++){var a=s[o],l=Object.keys(e.metadata[i][a]);this.metadata[i][a]==null&&(this.metadata[i][a]=Object.create(null));for(var u=0;u<l.length;u++){var d=l[u];this.metadata[i][a][d]==null?this.metadata[i][a][d]=e.metadata[i][a][d]:this.metadata[i][a][d]=this.metadata[i][a][d].concat(e.metadata[i][a][d])}}}},t.MatchData.prototype.add=function(e,r,n){if(!(e in this.metadata)){this.metadata[e]=Object.create(null),this.metadata[e][r]=n;return}if(!(r in this.metadata[e])){this.metadata[e][r]=n;return}for(var i=Object.keys(n),s=0;s<i.length;s++){var o=i[s];o in this.metadata[e][r]?this.metadata[e][r][o]=this.metadata[e][r][o].concat(n[o]):this.metadata[e][r][o]=n[o]}},t.Query=function(e){this.clauses=[],this.allFields=e},t.Query.wildcard=new String("*"),t.Query.wildcard.NONE=0,t.Query.wildcard.LEADING=1,t.Query.wildcard.TRAILING=2,t.Query.presence={OPTIONAL:1,REQUIRED:2,PROHIBITED:3},t.Query.prototype.clause=function(e){return"fields"in e||(e.fields=this.allFields),"boost"in e||(e.boost=1),"usePipeline"in e||(e.usePipeline=!0),"wildcard"in e||(e.wildcard=t.Query.wildcard.NONE),e.wildcard&t.Query.wildcard.LEADING&&e.term.charAt(0)!=t.Query.wildcard&&(e.term="*"+e.term),e.wildcard&t.Query.wildcard.TRAILING&&e.term.slice(-1)!=t.Query.wildcard&&(e.term=""+e.term+"*"),"presence"in e||(e.presence=t.Query.presence.OPTIONAL),this.clauses.push(e),this},t.Query.prototype.isNegated=function(){for(var e=0;e<this.clauses.length;e++)if(this.clauses[e].presence!=t.Query.presence.PROHIBITED)return!1;return!0},t.Query.prototype.term=function(e,r){if(Array.isArray(e))return e.forEach(function(i){this.term(i,t.utils.clone(r))},this),this;var n=r||{};return n.term=e.toString(),this.clause(n),this},t.QueryParseError=function(e,r,n){this.name="QueryParseError",this.message=e,this.start=r,this.end=n},t.QueryParseError.prototype=new Error,t.QueryLexer=function(e){this.lexemes=[],this.str=e,this.length=e.length,this.pos=0,this.start=0,this.escapeCharPositions=[]},t.QueryLexer.prototype.run=function(){for(var e=t.QueryLexer.lexText;e;)e=e(this)},t.QueryLexer.prototype.sliceString=function(){for(var e=[],r=this.start,n=this.pos,i=0;i<this.escapeCharPositions.length;i++)n=this.escapeCharPositions[i],e.push(this.str.slice(r,n)),r=n+1;return e.push(this.str.slice(r,this.pos)),this.escapeCharPositions.length=0,e.join("")},t.QueryLexer.prototype.emit=function(e){this.lexemes.push({type:e,str:this.sliceString(),start:this.start,end:this.pos}),this.start=this.pos},t.QueryLexer.prototype.escapeCharacter=function(){this.escapeCharPositions.push(this.pos-1),this.pos+=1},t.QueryLexer.prototype.next=function(){if(this.pos>=this.length)return t.QueryLexer.EOS;var e=this.str.charAt(this.pos);return this.pos+=1,e},t.QueryLexer.prototype.width=function(){return this.pos-this.start},t.QueryLexer.prototype.ignore=function(){this.start==this.pos&&(this.pos+=1),this.start=this.pos},t.QueryLexer.prototype.backup=function(){this.pos-=1},t.QueryLexer.prototype.acceptDigitRun=function(){var e,r;do e=this.next(),r=e.charCodeAt(0);while(r>47&&r<58);e!=t.QueryLexer.EOS&&this.backup()},t.QueryLexer.prototype.more=function(){return this.pos<this.length},t.QueryLexer.EOS="EOS",t.QueryLexer.FIELD="FIELD",t.QueryLexer.TERM="TERM",t.QueryLexer.EDIT_DISTANCE="EDIT_DISTANCE",t.QueryLexer.BOOST="BOOST",t.QueryLexer.PRESENCE="PRESENCE",t.QueryLexer.lexField=function(e){return e.backup(),e.emit(t.QueryLexer.FIELD),e.ignore(),t.QueryLexer.lexText},t.QueryLexer.lexTerm=function(e){if(e.width()>1&&(e.backup(),e.emit(t.QueryLexer.TERM)),e.ignore(),e.more())return t.QueryLexer.lexText},t.QueryLexer.lexEditDistance=function(e){return e.ignore(),e.acceptDigitRun(),e.emit(t.QueryLexer.EDIT_DISTANCE),t.QueryLexer.lexText},t.QueryLexer.lexBoost=function(e){return e.ignore(),e.acceptDigitRun(),e.emit(t.QueryLexer.BOOST),t.QueryLexer.lexText},t.QueryLexer.lexEOS=function(e){e.width()>0&&e.emit(t.QueryLexer.TERM)},t.QueryLexer.termSeparator=t.tokenizer.separator,t.QueryLexer.lexText=function(e){for(;;){var r=e.next();if(r==t.QueryLexer.EOS)return t.QueryLexer.lexEOS;if(r.charCodeAt(0)==92){e.escapeCharacter();continue}if(r==":")return t.QueryLexer.lexField;if(r=="~")return e.backup(),e.width()>0&&e.emit(t.QueryLexer.TERM),t.QueryLexer.lexEditDistance;if(r=="^")return e.backup(),e.width()>0&&e.emit(t.QueryLexer.TERM),t.QueryLexer.lexBoost;if(r=="+"&&e.width()===1||r=="-"&&e.width()===1)return e.emit(t.QueryLexer.PRESENCE),t.QueryLexer.lexText;if(r.match(t.QueryLexer.termSeparator))return t.QueryLexer.lexTerm}},t.QueryParser=function(e,r){this.lexer=new t.QueryLexer(e),this.query=r,this.currentClause={},this.lexemeIdx=0},t.QueryParser.prototype.parse=function(){this.lexer.run(),this.lexemes=this.lexer.lexemes;for(var e=t.QueryParser.parseClause;e;)e=e(this);return this.query},t.QueryParser.prototype.peekLexeme=function(){return this.lexemes[this.lexemeIdx]},t.QueryParser.prototype.consumeLexeme=function(){var e=this.peekLexeme();return this.lexemeIdx+=1,e},t.QueryParser.prototype.nextClause=function(){var e=this.currentClause;this.query.clause(e),this.currentClause={}},t.QueryParser.parseClause=function(e){var r=e.peekLexeme();if(r!=null)switch(r.type){case t.QueryLexer.PRESENCE:return t.QueryParser.parsePresence;case t.QueryLexer.FIELD:return t.QueryParser.parseField;case t.QueryLexer.TERM:return t.QueryParser.parseTerm;default:var n="expected either a field or a term, found "+r.type;throw r.str.length>=1&&(n+=" with value '"+r.str+"'"),new t.QueryParseError(n,r.start,r.end)}},t.QueryParser.parsePresence=function(e){var r=e.consumeLexeme();if(r!=null){switch(r.str){case"-":e.currentClause.presence=t.Query.presence.PROHIBITED;break;case"+":e.currentClause.presence=t.Query.presence.REQUIRED;break;default:var n="unrecognised presence operator'"+r.str+"'";throw new t.QueryParseError(n,r.start,r.end)}var i=e.peekLexeme();if(i==null){var n="expecting term or field, found nothing";throw new t.QueryParseError(n,r.start,r.end)}switch(i.type){case t.QueryLexer.FIELD:return t.QueryParser.parseField;case t.QueryLexer.TERM:return t.QueryParser.parseTerm;default:var n="expecting term or field, found '"+i.type+"'";throw new t.QueryParseError(n,i.start,i.end)}}},t.QueryParser.parseField=function(e){var r=e.consumeLexeme();if(r!=null){if(e.query.allFields.indexOf(r.str)==-1){var n=e.query.allFields.map(function(o){return"'"+o+"'"}).join(", "),i="unrecognised field '"+r.str+"', possible fields: "+n;throw new t.QueryParseError(i,r.start,r.end)}e.currentClause.fields=[r.str];var s=e.peekLexeme();if(s==null){var i="expecting term, found nothing";throw new t.QueryParseError(i,r.start,r.end)}switch(s.type){case t.QueryLexer.TERM:return t.QueryParser.parseTerm;default:var i="expecting term, found '"+s.type+"'";throw new t.QueryParseError(i,s.start,s.end)}}},t.QueryParser.parseTerm=function(e){var r=e.consumeLexeme();if(r!=null){e.currentClause.term=r.str.toLowerCase(),r.str.indexOf("*")!=-1&&(e.currentClause.usePipeline=!1);var n=e.peekLexeme();if(n==null){e.nextClause();return}switch(n.type){case t.QueryLexer.TERM:return e.nextClause(),t.QueryParser.parseTerm;case t.QueryLexer.FIELD:return e.nextClause(),t.QueryParser.parseField;case t.QueryLexer.EDIT_DISTANCE:return t.QueryParser.parseEditDistance;case t.QueryLexer.BOOST:return t.QueryParser.parseBoost;case t.QueryLexer.PRESENCE:return e.nextClause(),t.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+n.type+"'";throw new t.QueryParseError(i,n.start,n.end)}}},t.QueryParser.parseEditDistance=function(e){var r=e.consumeLexeme();if(r!=null){var n=parseInt(r.str,10);if(isNaN(n)){var i="edit distance must be numeric";throw new t.QueryParseError(i,r.start,r.end)}e.currentClause.editDistance=n;var s=e.peekLexeme();if(s==null){e.nextClause();return}switch(s.type){case t.QueryLexer.TERM:return e.nextClause(),t.QueryParser.parseTerm;case t.QueryLexer.FIELD:return e.nextClause(),t.QueryParser.parseField;case t.QueryLexer.EDIT_DISTANCE:return t.QueryParser.parseEditDistance;case t.QueryLexer.BOOST:return t.QueryParser.parseBoost;case t.QueryLexer.PRESENCE:return e.nextClause(),t.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+s.type+"'";throw new t.QueryParseError(i,s.start,s.end)}}},t.QueryParser.parseBoost=function(e){var r=e.consumeLexeme();if(r!=null){var n=parseInt(r.str,10);if(isNaN(n)){var i="boost must be numeric";throw new t.QueryParseError(i,r.start,r.end)}e.currentClause.boost=n;var s=e.peekLexeme();if(s==null){e.nextClause();return}switch(s.type){case t.QueryLexer.TERM:return e.nextClause(),t.QueryParser.parseTerm;case t.QueryLexer.FIELD:return e.nextClause(),t.QueryParser.parseField;case t.QueryLexer.EDIT_DISTANCE:return t.QueryParser.parseEditDistance;case t.QueryLexer.BOOST:return t.QueryParser.parseBoost;case t.QueryLexer.PRESENCE:return e.nextClause(),t.QueryParser.parsePresence;default:var i="Unexpected lexeme type '"+s.type+"'";throw new t.QueryParseError(i,s.start,s.end)}}},function(e,r){typeof define=="function"&&define.amd?define(r):typeof se=="object"?oe.exports=r():e.lunr=r()}(this,function(){return t})})()});var ne=[];function G(t,e){ne.push({selector:e,constructor:t})}var U=class{constructor(){this.alwaysVisibleMember=null;this.createComponents(document.body),this.ensureActivePageVisible(),this.ensureFocusedElementVisible(),this.listenForCodeCopies(),window.addEventListener("hashchange",()=>this.ensureFocusedElementVisible())}createComponents(e){ne.forEach(r=>{e.querySelectorAll(r.selector).forEach(n=>{n.dataset.hasInstance||(new r.constructor({el:n,app:this}),n.dataset.hasInstance=String(!0))})})}filterChanged(){this.ensureFocusedElementVisible()}ensureActivePageVisible(){let e=document.querySelector(".tsd-navigation .current"),r=e?.parentElement;for(;r&&!r.classList.contains(".tsd-navigation");)r instanceof HTMLDetailsElement&&(r.open=!0),r=r.parentElement;if(e){let n=e.getBoundingClientRect().top-document.documentElement.clientHeight/4;document.querySelector(".site-menu").scrollTop=n}}ensureFocusedElementVisible(){if(this.alwaysVisibleMember&&(this.alwaysVisibleMember.classList.remove("always-visible"),this.alwaysVisibleMember.firstElementChild.remove(),this.alwaysVisibleMember=null),!location.hash)return;let e=document.getElementById(location.hash.substring(1));if(!e)return;let r=e.parentElement;for(;r&&r.tagName!=="SECTION";)r=r.parentElement;if(r&&r.offsetParent==null){this.alwaysVisibleMember=r,r.classList.add("always-visible");let n=document.createElement("p");n.classList.add("warning"),n.textContent="This member is normally hidden due to your filter settings.",r.prepend(n)}}listenForCodeCopies(){document.querySelectorAll("pre > button").forEach(e=>{let r;e.addEventListener("click",()=>{e.previousElementSibling instanceof HTMLElement&&navigator.clipboard.writeText(e.previousElementSibling.innerText.trim()),e.textContent="Copied!",e.classList.add("visible"),clearTimeout(r),r=setTimeout(()=>{e.classList.remove("visible"),r=setTimeout(()=>{e.textContent="Copy"},100)},1e3)})})}};var ie=(t,e=100)=>{let r;return()=>{clearTimeout(r),r=setTimeout(()=>t(),e)}};var ce=Ce(ae());function de(){let t=document.getElementById("tsd-search");if(!t)return;let e=document.getElementById("tsd-search-script");t.classList.add("loading"),e&&(e.addEventListener("error",()=>{t.classList.remove("loading"),t.classList.add("failure")}),e.addEventListener("load",()=>{t.classList.remove("loading"),t.classList.add("ready")}),window.searchData&&t.classList.remove("loading"));let r=document.querySelector("#tsd-search input"),n=document.querySelector("#tsd-search .results");if(!r||!n)throw new Error("The input field or the result list wrapper was not found");let i=!1;n.addEventListener("mousedown",()=>i=!0),n.addEventListener("mouseup",()=>{i=!1,t.classList.remove("has-focus")}),r.addEventListener("focus",()=>t.classList.add("has-focus")),r.addEventListener("blur",()=>{i||(i=!1,t.classList.remove("has-focus"))});let s={base:t.dataset.base+"/"};Oe(t,n,r,s)}function Oe(t,e,r,n){r.addEventListener("input",ie(()=>{Re(t,e,r,n)},200));let i=!1;r.addEventListener("keydown",s=>{i=!0,s.key=="Enter"?Fe(e,r):s.key=="Escape"?r.blur():s.key=="ArrowUp"?ue(e,-1):s.key==="ArrowDown"?ue(e,1):i=!1}),r.addEventListener("keypress",s=>{i&&s.preventDefault()}),document.body.addEventListener("keydown",s=>{s.altKey||s.ctrlKey||s.metaKey||!r.matches(":focus")&&s.key==="/"&&(r.focus(),s.preventDefault())})}function _e(t,e){t.index||window.searchData&&(e.classList.remove("loading"),e.classList.add("ready"),t.data=window.searchData,t.index=ce.Index.load(window.searchData.index))}function Re(t,e,r,n){if(_e(n,t),!n.index||!n.data)return;e.textContent="";let i=r.value.trim(),s=i?n.index.search(`*${i}*`):[];for(let o=0;o<s.length;o++){let a=s[o],l=n.data.rows[Number(a.ref)],u=1;l.name.toLowerCase().startsWith(i.toLowerCase())&&(u*=1+1/(1+Math.abs(l.name.length-i.length))),a.score*=u}s.sort((o,a)=>a.score-o.score);for(let o=0,a=Math.min(10,s.length);o<a;o++){let l=n.data.rows[Number(s[o].ref)],u=le(l.name,i);globalThis.DEBUG_SEARCH_WEIGHTS&&(u+=` (score: ${s[o].score.toFixed(2)})`),l.parent&&(u=`<span class="parent">${le(l.parent,i)}.</span>${u}`);let d=document.createElement("li");d.classList.value=l.classes??"";let m=document.createElement("a");m.href=n.base+l.url,m.innerHTML=u,d.append(m),e.appendChild(d)}}function ue(t,e){let r=t.querySelector(".current");if(!r)r=t.querySelector(e==1?"li:first-child":"li:last-child"),r&&r.classList.add("current");else{let n=r;if(e===1)do n=n.nextElementSibling??void 0;while(n instanceof HTMLElement&&n.offsetParent==null);else do n=n.previousElementSibling??void 0;while(n instanceof HTMLElement&&n.offsetParent==null);n&&(r.classList.remove("current"),n.classList.add("current"))}}function Fe(t,e){let r=t.querySelector(".current");if(r||(r=t.querySelector("li:first-child")),r){let n=r.querySelector("a");n&&(window.location.href=n.href),e.blur()}}function le(t,e){if(e==="")return t;let r=t.toLocaleLowerCase(),n=e.toLocaleLowerCase(),i=[],s=0,o=r.indexOf(n);for(;o!=-1;)i.push(K(t.substring(s,o)),`<b>${K(t.substring(o,o+n.length))}</b>`),s=o+n.length,o=r.indexOf(n,s);return i.push(K(t.substring(s))),i.join("")}var Me={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"};function K(t){return t.replace(/[&<>"'"]/g,e=>Me[e])}var P=class{constructor(e){this.el=e.el,this.app=e.app}};var M="mousedown",fe="mousemove",N="mouseup",J={x:0,y:0},he=!1,ee=!1,De=!1,D=!1,pe=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);document.documentElement.classList.add(pe?"is-mobile":"not-mobile");pe&&"ontouchstart"in document.documentElement&&(De=!0,M="touchstart",fe="touchmove",N="touchend");document.addEventListener(M,t=>{ee=!0,D=!1;let e=M=="touchstart"?t.targetTouches[0]:t;J.y=e.pageY||0,J.x=e.pageX||0});document.addEventListener(fe,t=>{if(ee&&!D){let e=M=="touchstart"?t.targetTouches[0]:t,r=J.x-(e.pageX||0),n=J.y-(e.pageY||0);D=Math.sqrt(r*r+n*n)>10}});document.addEventListener(N,()=>{ee=!1});document.addEventListener("click",t=>{he&&(t.preventDefault(),t.stopImmediatePropagation(),he=!1)});var X=class extends P{constructor(r){super(r);this.className=this.el.dataset.toggle||"",this.el.addEventListener(N,n=>this.onPointerUp(n)),this.el.addEventListener("click",n=>n.preventDefault()),document.addEventListener(M,n=>this.onDocumentPointerDown(n)),document.addEventListener(N,n=>this.onDocumentPointerUp(n))}setActive(r){if(this.active==r)return;this.active=r,document.documentElement.classList.toggle("has-"+this.className,r),this.el.classList.toggle("active",r);let n=(this.active?"to-has-":"from-has-")+this.className;document.documentElement.classList.add(n),setTimeout(()=>document.documentElement.classList.remove(n),500)}onPointerUp(r){D||(this.setActive(!0),r.preventDefault())}onDocumentPointerDown(r){if(this.active){if(r.target.closest(".col-sidebar, .tsd-filter-group"))return;this.setActive(!1)}}onDocumentPointerUp(r){if(!D&&this.active&&r.target.closest(".col-sidebar")){let n=r.target.closest("a");if(n){let i=window.location.href;i.indexOf("#")!=-1&&(i=i.substring(0,i.indexOf("#"))),n.href.substring(0,i.length)==i&&setTimeout(()=>this.setActive(!1),250)}}}};var te;try{te=localStorage}catch{te={getItem(){return null},setItem(){}}}var Q=te;var me=document.head.appendChild(document.createElement("style"));me.dataset.for="filters";var Y=class extends P{constructor(r){super(r);this.key=`filter-${this.el.name}`,this.value=this.el.checked,this.el.addEventListener("change",()=>{this.setLocalStorage(this.el.checked)}),this.setLocalStorage(this.fromLocalStorage()),me.innerHTML+=`html:not(.${this.key}) .tsd-is-${this.el.name} { display: none; }
`}fromLocalStorage(){let r=Q.getItem(this.key);return r?r==="true":this.el.checked}setLocalStorage(r){Q.setItem(this.key,r.toString()),this.value=r,this.handleValueChange()}handleValueChange(){this.el.checked=this.value,document.documentElement.classList.toggle(this.key,this.value),this.app.filterChanged(),document.querySelectorAll(".tsd-index-section").forEach(r=>{r.style.display="block";let n=Array.from(r.querySelectorAll(".tsd-index-link")).every(i=>i.offsetParent==null);r.style.display=n?"none":"block"})}};var Z=class extends P{constructor(r){super(r);this.summary=this.el.querySelector(".tsd-accordion-summary"),this.icon=this.summary.querySelector("svg"),this.key=`tsd-accordion-${this.summary.dataset.key??this.summary.textContent.trim().replace(/\s+/g,"-").toLowerCase()}`;let n=Q.getItem(this.key);this.el.open=n?n==="true":this.el.open,this.el.addEventListener("toggle",()=>this.update()),this.update()}update(){this.icon.style.transform=`rotate(${this.el.open?0:-90}deg)`,Q.setItem(this.key,this.el.open.toString())}};function ve(t){let e=Q.getItem("tsd-theme")||"os";t.value=e,ye(e),t.addEventListener("change",()=>{Q.setItem("tsd-theme",t.value),ye(t.value)})}function ye(t){document.documentElement.dataset.theme=t}de();G(X,"a[data-toggle]");G(Z,".tsd-index-accordion");G(Y,".tsd-filter-item input[type=checkbox]");var ge=document.getElementById("tsd-theme");ge&&ve(ge);var Ae=new U;Object.defineProperty(window,"app",{value:Ae});})();
/*! Bundled license information:

lunr/lunr.js:
  (**
   * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
   * Copyright (C) 2020 Oliver Nightingale
   * @license MIT
   *)
  (*!
   * lunr.utils
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Set
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.tokenizer
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Pipeline
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Vector
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.stemmer
   * Copyright (C) 2020 Oliver Nightingale
   * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
   *)
  (*!
   * lunr.stopWordFilter
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.trimmer
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.TokenSet
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Index
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Builder
   * Copyright (C) 2020 Oliver Nightingale
   *)
*/



================================================
FILE: docs/assets/search.js
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/assets/search.js
================================================
window.searchData = JSON.parse("{\"rows\":[{\"kind\":8,\"name\":\"ENDPOINT\",\"url\":\"enums/ENDPOINT.html\",\"classes\":\"\"},{\"kind\":16,\"name\":\"MAINNET\",\"url\":\"enums/ENDPOINT.html#MAINNET\",\"classes\":\"\",\"parent\":\"ENDPOINT\"},{\"kind\":16,\"name\":\"TESTNET\",\"url\":\"enums/ENDPOINT.html#TESTNET\",\"classes\":\"\",\"parent\":\"ENDPOINT\"},{\"kind\":4,\"name\":\"TransactionParsing\",\"url\":\"modules/TransactionParsing.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"parseTransaction\",\"url\":\"functions/TransactionParsing.parseTransaction.html\",\"classes\":\"\",\"parent\":\"TransactionParsing\"},{\"kind\":128,\"name\":\"AmazonS3\",\"url\":\"classes/AmazonS3.html\",\"classes\":\"\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/AmazonS3.html#constructor\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":1024,\"name\":\"s3\",\"url\":\"classes/AmazonS3.html#s3\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":1024,\"name\":\"bucketName\",\"url\":\"classes/AmazonS3.html#bucketName\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":2048,\"name\":\"uploadImage\",\"url\":\"classes/AmazonS3.html#uploadImage\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":2048,\"name\":\"uploadImages\",\"url\":\"classes/AmazonS3.html#uploadImages\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":2048,\"name\":\"uploadJson\",\"url\":\"classes/AmazonS3.html#uploadJson\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":2048,\"name\":\"uploadJsonBulk\",\"url\":\"classes/AmazonS3.html#uploadJsonBulk\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":2048,\"name\":\"uploadBulk\",\"url\":\"classes/AmazonS3.html#uploadBulk\",\"classes\":\"\",\"parent\":\"AmazonS3\"},{\"kind\":128,\"name\":\"Pinata\",\"url\":\"classes/Pinata.html\",\"classes\":\"\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/Pinata.html#constructor\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":1024,\"name\":\"pinata\",\"url\":\"classes/Pinata.html#pinata\",\"classes\":\"tsd-is-private\",\"parent\":\"Pinata\"},{\"kind\":2048,\"name\":\"uploadImage\",\"url\":\"classes/Pinata.html#uploadImage\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":2048,\"name\":\"uploadImages\",\"url\":\"classes/Pinata.html#uploadImages\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":2048,\"name\":\"uploadJson\",\"url\":\"classes/Pinata.html#uploadJson\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":2048,\"name\":\"uploadJsonBulk\",\"url\":\"classes/Pinata.html#uploadJsonBulk\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":2048,\"name\":\"uploadBulk\",\"url\":\"classes/Pinata.html#uploadBulk\",\"classes\":\"\",\"parent\":\"Pinata\"},{\"kind\":128,\"name\":\"Storage\",\"url\":\"classes/Storage.html\",\"classes\":\"\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/Storage.html#constructor\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":1024,\"name\":\"provider\",\"url\":\"classes/Storage.html#provider\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":2048,\"name\":\"uploadImage\",\"url\":\"classes/Storage.html#uploadImage\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":2048,\"name\":\"uploadImages\",\"url\":\"classes/Storage.html#uploadImages\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":2048,\"name\":\"uploadJson\",\"url\":\"classes/Storage.html#uploadJson\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":2048,\"name\":\"uploadJsonBulk\",\"url\":\"classes/Storage.html#uploadJsonBulk\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":2048,\"name\":\"uploadBulk\",\"url\":\"classes/Storage.html#uploadBulk\",\"classes\":\"\",\"parent\":\"Storage\"},{\"kind\":4194304,\"name\":\"CollectionMintItemInput\",\"url\":\"types/CollectionMintItemInput.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/CollectionMintItemInput.html#__type\",\"classes\":\"\",\"parent\":\"CollectionMintItemInput\"},{\"kind\":1024,\"name\":\"passAmount\",\"url\":\"types/CollectionMintItemInput.html#__type.passAmount\",\"classes\":\"\",\"parent\":\"CollectionMintItemInput.__type\"},{\"kind\":1024,\"name\":\"index\",\"url\":\"types/CollectionMintItemInput.html#__type.index\",\"classes\":\"\",\"parent\":\"CollectionMintItemInput.__type\"},{\"kind\":1024,\"name\":\"ownerAddress\",\"url\":\"types/CollectionMintItemInput.html#__type.ownerAddress\",\"classes\":\"\",\"parent\":\"CollectionMintItemInput.__type\"},{\"kind\":1024,\"name\":\"content\",\"url\":\"types/CollectionMintItemInput.html#__type.content\",\"classes\":\"\",\"parent\":\"CollectionMintItemInput.__type\"},{\"kind\":4194304,\"name\":\"RoyaltyParams\",\"url\":\"types/RoyaltyParams.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/RoyaltyParams.html#__type\",\"classes\":\"\",\"parent\":\"RoyaltyParams\"},{\"kind\":1024,\"name\":\"royaltyFactor\",\"url\":\"types/RoyaltyParams.html#__type.royaltyFactor\",\"classes\":\"\",\"parent\":\"RoyaltyParams.__type\"},{\"kind\":1024,\"name\":\"royaltyBase\",\"url\":\"types/RoyaltyParams.html#__type.royaltyBase\",\"classes\":\"\",\"parent\":\"RoyaltyParams.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/RoyaltyParams.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"RoyaltyParams.__type\"},{\"kind\":32,\"name\":\"OperationCodes\",\"url\":\"variables/OperationCodes.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"variables/OperationCodes.html#__type\",\"classes\":\"\",\"parent\":\"OperationCodes\"},{\"kind\":1024,\"name\":\"Mint\",\"url\":\"variables/OperationCodes.html#__type.Mint\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":1024,\"name\":\"BatchMint\",\"url\":\"variables/OperationCodes.html#__type.BatchMint\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":1024,\"name\":\"ChangeOwner\",\"url\":\"variables/OperationCodes.html#__type.ChangeOwner\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":1024,\"name\":\"EditContent\",\"url\":\"variables/OperationCodes.html#__type.EditContent\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":1024,\"name\":\"GetRoyaltyParams\",\"url\":\"variables/OperationCodes.html#__type.GetRoyaltyParams\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":1024,\"name\":\"GetRoyaltyParamsResponse\",\"url\":\"variables/OperationCodes.html#__type.GetRoyaltyParamsResponse\",\"classes\":\"\",\"parent\":\"OperationCodes.__type\"},{\"kind\":128,\"name\":\"NftCollection\",\"url\":\"classes/NftCollection.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftCollection.html#code-1\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftCollection.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftCollection.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftCollection.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"parseMint\",\"url\":\"classes/NftCollection.html#parseMint\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"parseOwnershipTransfer\",\"url\":\"classes/NftCollection.html#parseOwnershipTransfer\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftCollection.html#constructor\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftCollection.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"sendMint\",\"url\":\"classes/NftCollection.html#sendMint\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"sendChangeOwner\",\"url\":\"classes/NftCollection.html#sendChangeOwner\",\"classes\":\"\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"sendGetRoyaltyParams\",\"url\":\"classes/NftCollection.html#sendGetRoyaltyParams\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"getRoyaltyParams\",\"url\":\"classes/NftCollection.html#getRoyaltyParams\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftCollection.html#address\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftCollection.html#init\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftCollection.html#init.__type\",\"classes\":\"\",\"parent\":\"NftCollection.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftCollection.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftCollection.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftCollection.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftCollection.init.__type\"},{\"kind\":2048,\"name\":\"getCollectionData\",\"url\":\"classes/NftCollection.html#getCollectionData\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"getNftAddressByIndex\",\"url\":\"classes/NftCollection.html#getNftAddressByIndex\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":2048,\"name\":\"getNftContent\",\"url\":\"classes/NftCollection.html#getNftContent\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftCollection\"},{\"kind\":4194304,\"name\":\"NftCollectionData\",\"url\":\"types/NftCollectionData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftCollectionData.html#__type\",\"classes\":\"\",\"parent\":\"NftCollectionData\"},{\"kind\":1024,\"name\":\"ownerAddress\",\"url\":\"types/NftCollectionData.html#__type.ownerAddress\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":1024,\"name\":\"nextItemIndex\",\"url\":\"types/NftCollectionData.html#__type.nextItemIndex\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":1024,\"name\":\"collectionContent\",\"url\":\"types/NftCollectionData.html#__type.collectionContent\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":1024,\"name\":\"commonContent\",\"url\":\"types/NftCollectionData.html#__type.commonContent\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":1024,\"name\":\"nftItemCode\",\"url\":\"types/NftCollectionData.html#__type.nftItemCode\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":1024,\"name\":\"royaltyParams\",\"url\":\"types/NftCollectionData.html#__type.royaltyParams\",\"classes\":\"\",\"parent\":\"NftCollectionData.__type\"},{\"kind\":4194304,\"name\":\"NftMint\",\"url\":\"types/NftMint.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftMint.html#__type\",\"classes\":\"\",\"parent\":\"NftMint\"},{\"kind\":1024,\"name\":\"queryId\",\"url\":\"types/NftMint.html#__type.queryId\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":1024,\"name\":\"from\",\"url\":\"types/NftMint.html#__type.from\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":1024,\"name\":\"to\",\"url\":\"types/NftMint.html#__type.to\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":1024,\"name\":\"itemIndex\",\"url\":\"types/NftMint.html#__type.itemIndex\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":1024,\"name\":\"passAmount\",\"url\":\"types/NftMint.html#__type.passAmount\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":1024,\"name\":\"nftItemMessage\",\"url\":\"types/NftMint.html#__type.nftItemMessage\",\"classes\":\"\",\"parent\":\"NftMint.__type\"},{\"kind\":4194304,\"name\":\"OwnershipTransfer\",\"url\":\"types/OwnershipTransfer.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/OwnershipTransfer.html#__type\",\"classes\":\"\",\"parent\":\"OwnershipTransfer\"},{\"kind\":1024,\"name\":\"queryId\",\"url\":\"types/OwnershipTransfer.html#__type.queryId\",\"classes\":\"\",\"parent\":\"OwnershipTransfer.__type\"},{\"kind\":1024,\"name\":\"oldOwner\",\"url\":\"types/OwnershipTransfer.html#__type.oldOwner\",\"classes\":\"\",\"parent\":\"OwnershipTransfer.__type\"},{\"kind\":1024,\"name\":\"newOwner\",\"url\":\"types/OwnershipTransfer.html#__type.newOwner\",\"classes\":\"\",\"parent\":\"OwnershipTransfer.__type\"},{\"kind\":128,\"name\":\"NftItem\",\"url\":\"classes/NftItem.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftItem.html#code-1\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftItem.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftItem.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftItem.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"parseTransfer\",\"url\":\"classes/NftItem.html#parseTransfer\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftItem.html#constructor\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftItem.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"sendTransferEditorship\",\"url\":\"classes/NftItem.html#sendTransferEditorship\",\"classes\":\"\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"sendGetRoyaltyParams\",\"url\":\"classes/NftItem.html#sendGetRoyaltyParams\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"getRoyaltyParams\",\"url\":\"classes/NftItem.html#getRoyaltyParams\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftItem.html#address\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftItem.html#init\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftItem.html#init.__type\",\"classes\":\"\",\"parent\":\"NftItem.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftItem.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftItem.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftItem.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftItem.init.__type\"},{\"kind\":2048,\"name\":\"sendTransfer\",\"url\":\"classes/NftItem.html#sendTransfer\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"sendGetStaticData\",\"url\":\"classes/NftItem.html#sendGetStaticData\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":2048,\"name\":\"getNftData\",\"url\":\"classes/NftItem.html#getNftData\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItem\"},{\"kind\":4194304,\"name\":\"NftItemData\",\"url\":\"types/NftItemData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftItemData.html#__type\",\"classes\":\"\",\"parent\":\"NftItemData\"},{\"kind\":1024,\"name\":\"index\",\"url\":\"types/NftItemData.html#__type.index\",\"classes\":\"\",\"parent\":\"NftItemData.__type\"},{\"kind\":1024,\"name\":\"collectionAddress\",\"url\":\"types/NftItemData.html#__type.collectionAddress\",\"classes\":\"\",\"parent\":\"NftItemData.__type\"},{\"kind\":1024,\"name\":\"ownerAddress\",\"url\":\"types/NftItemData.html#__type.ownerAddress\",\"classes\":\"\",\"parent\":\"NftItemData.__type\"},{\"kind\":1024,\"name\":\"content\",\"url\":\"types/NftItemData.html#__type.content\",\"classes\":\"\",\"parent\":\"NftItemData.__type\"},{\"kind\":128,\"name\":\"SbtSingle\",\"url\":\"classes/SbtSingle.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/SbtSingle.html#code-1\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/SbtSingle.html#buildDataCell\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/SbtSingle.html#createFromAddress\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/SbtSingle.html#createFromConfig\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/SbtSingle.html#constructor\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/SbtSingle.html#address\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/SbtSingle.html#init\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/SbtSingle.html#init.__type\",\"classes\":\"\",\"parent\":\"SbtSingle.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/SbtSingle.html#init.__type.code\",\"classes\":\"\",\"parent\":\"SbtSingle.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/SbtSingle.html#init.__type.data\",\"classes\":\"\",\"parent\":\"SbtSingle.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/SbtSingle.html#sendDeploy\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"sendProveOwnership\",\"url\":\"classes/SbtSingle.html#sendProveOwnership\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"sendRequestOwner\",\"url\":\"classes/SbtSingle.html#sendRequestOwner\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"sendRevoke\",\"url\":\"classes/SbtSingle.html#sendRevoke\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"getNftData\",\"url\":\"classes/SbtSingle.html#getNftData\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"getAuthorityAddress\",\"url\":\"classes/SbtSingle.html#getAuthorityAddress\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":2048,\"name\":\"getRevokedTime\",\"url\":\"classes/SbtSingle.html#getRevokedTime\",\"classes\":\"\",\"parent\":\"SbtSingle\"},{\"kind\":4194304,\"name\":\"SbtSingleData\",\"url\":\"types/SbtSingleData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/SbtSingleData.html#__type\",\"classes\":\"\",\"parent\":\"SbtSingleData\"},{\"kind\":1024,\"name\":\"ownerAddress\",\"url\":\"types/SbtSingleData.html#__type.ownerAddress\",\"classes\":\"\",\"parent\":\"SbtSingleData.__type\"},{\"kind\":1024,\"name\":\"editorAddress\",\"url\":\"types/SbtSingleData.html#__type.editorAddress\",\"classes\":\"\",\"parent\":\"SbtSingleData.__type\"},{\"kind\":1024,\"name\":\"content\",\"url\":\"types/SbtSingleData.html#__type.content\",\"classes\":\"\",\"parent\":\"SbtSingleData.__type\"},{\"kind\":1024,\"name\":\"authorityAddress\",\"url\":\"types/SbtSingleData.html#__type.authorityAddress\",\"classes\":\"\",\"parent\":\"SbtSingleData.__type\"},{\"kind\":1024,\"name\":\"revokedAt\",\"url\":\"types/SbtSingleData.html#__type.revokedAt\",\"classes\":\"\",\"parent\":\"SbtSingleData.__type\"},{\"kind\":128,\"name\":\"NftItemRoyalty\",\"url\":\"classes/NftItemRoyalty.html\",\"classes\":\"\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftItemRoyalty.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftItemRoyalty\"},{\"kind\":2048,\"name\":\"parseTransfer\",\"url\":\"classes/NftItemRoyalty.html#parseTransfer\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftItemRoyalty.html#constructor\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":2048,\"name\":\"sendGetRoyaltyParams\",\"url\":\"classes/NftItemRoyalty.html#sendGetRoyaltyParams\",\"classes\":\"\",\"parent\":\"NftItemRoyalty\"},{\"kind\":2048,\"name\":\"getRoyaltyParams\",\"url\":\"classes/NftItemRoyalty.html#getRoyaltyParams\",\"classes\":\"\",\"parent\":\"NftItemRoyalty\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftItemRoyalty.html#address\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftItemRoyalty.html#init\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftItemRoyalty.html#init.__type\",\"classes\":\"\",\"parent\":\"NftItemRoyalty.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftItemRoyalty.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftItemRoyalty.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftItemRoyalty.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftItemRoyalty.init.__type\"},{\"kind\":2048,\"name\":\"sendTransfer\",\"url\":\"classes/NftItemRoyalty.html#sendTransfer\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":2048,\"name\":\"sendGetStaticData\",\"url\":\"classes/NftItemRoyalty.html#sendGetStaticData\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":2048,\"name\":\"getNftData\",\"url\":\"classes/NftItemRoyalty.html#getNftData\",\"classes\":\"tsd-is-inherited\",\"parent\":\"NftItemRoyalty\"},{\"kind\":128,\"name\":\"NftAuction\",\"url\":\"classes/NftAuction.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftAuction.html#code-1\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftAuction.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftAuction.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftAuction.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftAuction.html#constructor\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftAuction.html#address\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftAuction.html#init\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftAuction.html#init.__type\",\"classes\":\"\",\"parent\":\"NftAuction.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftAuction.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftAuction.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftAuction.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftAuction.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftAuction.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"sendCancel\",\"url\":\"classes/NftAuction.html#sendCancel\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"sendStop\",\"url\":\"classes/NftAuction.html#sendStop\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"sendRepeatEndAuction\",\"url\":\"classes/NftAuction.html#sendRepeatEndAuction\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"sendEmergencyMessage\",\"url\":\"classes/NftAuction.html#sendEmergencyMessage\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":2048,\"name\":\"getSaleData\",\"url\":\"classes/NftAuction.html#getSaleData\",\"classes\":\"\",\"parent\":\"NftAuction\"},{\"kind\":4194304,\"name\":\"NftAuctionData\",\"url\":\"types/NftAuctionData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftAuctionData.html#__type\",\"classes\":\"\",\"parent\":\"NftAuctionData\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftAuctionData.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeFactor\",\"url\":\"types/NftAuctionData.html#__type.marketplaceFeeFactor\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeBase\",\"url\":\"types/NftAuctionData.html#__type.marketplaceFeeBase\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftAuctionData.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"royaltyFactor\",\"url\":\"types/NftAuctionData.html#__type.royaltyFactor\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"royaltyBase\",\"url\":\"types/NftAuctionData.html#__type.royaltyBase\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"minBid\",\"url\":\"types/NftAuctionData.html#__type.minBid\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"maxBid\",\"url\":\"types/NftAuctionData.html#__type.maxBid\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"minStep\",\"url\":\"types/NftAuctionData.html#__type.minStep\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"endTimestamp\",\"url\":\"types/NftAuctionData.html#__type.endTimestamp\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"createdAtTimestamp\",\"url\":\"types/NftAuctionData.html#__type.createdAtTimestamp\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"stepTimeSeconds\",\"url\":\"types/NftAuctionData.html#__type.stepTimeSeconds\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"tryStepTimeSeconds\",\"url\":\"types/NftAuctionData.html#__type.tryStepTimeSeconds\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"nftOwnerAddress\",\"url\":\"types/NftAuctionData.html#__type.nftOwnerAddress\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftAuctionData.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"end\",\"url\":\"types/NftAuctionData.html#__type.end\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftAuctionData.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":1024,\"name\":\"activated\",\"url\":\"types/NftAuctionData.html#__type.activated\",\"classes\":\"\",\"parent\":\"NftAuctionData.__type\"},{\"kind\":128,\"name\":\"NftAuctionV2\",\"url\":\"classes/NftAuctionV2.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftAuctionV2.html#code-1\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftAuctionV2.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftAuctionV2.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftAuctionV2.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftAuctionV2.html#constructor\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftAuctionV2.html#address\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftAuctionV2.html#init\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftAuctionV2.html#init.__type\",\"classes\":\"\",\"parent\":\"NftAuctionV2.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftAuctionV2.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftAuctionV2.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftAuctionV2.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftAuctionV2.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftAuctionV2.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"sendCancel\",\"url\":\"classes/NftAuctionV2.html#sendCancel\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"sendStop\",\"url\":\"classes/NftAuctionV2.html#sendStop\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":2048,\"name\":\"getSaleData\",\"url\":\"classes/NftAuctionV2.html#getSaleData\",\"classes\":\"\",\"parent\":\"NftAuctionV2\"},{\"kind\":4194304,\"name\":\"NftAuctionV2Data\",\"url\":\"types/NftAuctionV2Data.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftAuctionV2Data.html#__type\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftAuctionV2Data.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeFactor\",\"url\":\"types/NftAuctionV2Data.html#__type.marketplaceFeeFactor\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeBase\",\"url\":\"types/NftAuctionV2Data.html#__type.marketplaceFeeBase\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftAuctionV2Data.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"royaltyFactor\",\"url\":\"types/NftAuctionV2Data.html#__type.royaltyFactor\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"royaltyBase\",\"url\":\"types/NftAuctionV2Data.html#__type.royaltyBase\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"minBid\",\"url\":\"types/NftAuctionV2Data.html#__type.minBid\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"maxBid\",\"url\":\"types/NftAuctionV2Data.html#__type.maxBid\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"minStep\",\"url\":\"types/NftAuctionV2Data.html#__type.minStep\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"endTimestamp\",\"url\":\"types/NftAuctionV2Data.html#__type.endTimestamp\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"createdAtTimestamp\",\"url\":\"types/NftAuctionV2Data.html#__type.createdAtTimestamp\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"stepTimeSeconds\",\"url\":\"types/NftAuctionV2Data.html#__type.stepTimeSeconds\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"tryStepTimeSeconds\",\"url\":\"types/NftAuctionV2Data.html#__type.tryStepTimeSeconds\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"nftOwnerAddress\",\"url\":\"types/NftAuctionV2Data.html#__type.nftOwnerAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftAuctionV2Data.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"end\",\"url\":\"types/NftAuctionV2Data.html#__type.end\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftAuctionV2Data.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":1024,\"name\":\"activated\",\"url\":\"types/NftAuctionV2Data.html#__type.activated\",\"classes\":\"\",\"parent\":\"NftAuctionV2Data.__type\"},{\"kind\":128,\"name\":\"NftFixedPrice\",\"url\":\"classes/NftFixedPrice.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPrice.html#code-1\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftFixedPrice.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftFixedPrice.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftFixedPrice.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftFixedPrice.html#constructor\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftFixedPrice.html#address\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftFixedPrice.html#init\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftFixedPrice.html#init.__type\",\"classes\":\"\",\"parent\":\"NftFixedPrice.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPrice.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftFixedPrice.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftFixedPrice.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftFixedPrice.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftFixedPrice.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":2048,\"name\":\"getSaleData\",\"url\":\"classes/NftFixedPrice.html#getSaleData\",\"classes\":\"\",\"parent\":\"NftFixedPrice\"},{\"kind\":4194304,\"name\":\"NftFixPriceSaleData\",\"url\":\"types/NftFixPriceSaleData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftFixPriceSaleData.html#__type\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftFixPriceSaleData.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftFixPriceSaleData.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"nftOwnerAddress\",\"url\":\"types/NftFixPriceSaleData.html#__type.nftOwnerAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"fullPrice\",\"url\":\"types/NftFixPriceSaleData.html#__type.fullPrice\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFee\",\"url\":\"types/NftFixPriceSaleData.html#__type.marketplaceFee\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftFixPriceSaleData.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"royaltyAmount\",\"url\":\"types/NftFixPriceSaleData.html#__type.royaltyAmount\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftFixPriceSaleData.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleData.__type\"},{\"kind\":128,\"name\":\"NftFixedPriceV2\",\"url\":\"classes/NftFixedPriceV2.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPriceV2.html#code-1\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftFixedPriceV2.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftFixedPriceV2.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftFixedPriceV2.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftFixedPriceV2.html#constructor\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftFixedPriceV2.html#address\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftFixedPriceV2.html#init\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftFixedPriceV2.html#init.__type\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPriceV2.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftFixedPriceV2.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftFixedPriceV2.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"sendCoins\",\"url\":\"classes/NftFixedPriceV2.html#sendCoins\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"sendCancelSale\",\"url\":\"classes/NftFixedPriceV2.html#sendCancelSale\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"sendBuy\",\"url\":\"classes/NftFixedPriceV2.html#sendBuy\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":2048,\"name\":\"getSaleData\",\"url\":\"classes/NftFixedPriceV2.html#getSaleData\",\"classes\":\"\",\"parent\":\"NftFixedPriceV2\"},{\"kind\":4194304,\"name\":\"NftFixPriceSaleV2Data\",\"url\":\"types/NftFixPriceSaleV2Data.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data\"},{\"kind\":1024,\"name\":\"isComplete\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.isComplete\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"createdAt\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.createdAt\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"nftOwnerAddress\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.nftOwnerAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"fullPrice\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.fullPrice\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFee\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.marketplaceFee\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":1024,\"name\":\"royaltyAmount\",\"url\":\"types/NftFixPriceSaleV2Data.html#__type.royaltyAmount\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV2Data.__type\"},{\"kind\":128,\"name\":\"NftFixedPriceV3\",\"url\":\"classes/NftFixedPriceV3.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPriceV3.html#code-1\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftFixedPriceV3.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftFixedPriceV3.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftFixedPriceV3.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftFixedPriceV3.html#constructor\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftFixedPriceV3.html#address\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftFixedPriceV3.html#init\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftFixedPriceV3.html#init.__type\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftFixedPriceV3.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftFixedPriceV3.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftFixedPriceV3.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"sendCoins\",\"url\":\"classes/NftFixedPriceV3.html#sendCoins\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"sendCancelSale\",\"url\":\"classes/NftFixedPriceV3.html#sendCancelSale\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"sendBuy\",\"url\":\"classes/NftFixedPriceV3.html#sendBuy\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":2048,\"name\":\"getSaleData\",\"url\":\"classes/NftFixedPriceV3.html#getSaleData\",\"classes\":\"\",\"parent\":\"NftFixedPriceV3\"},{\"kind\":4194304,\"name\":\"NftFixPriceSaleV3Data\",\"url\":\"types/NftFixPriceSaleV3Data.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data\"},{\"kind\":1024,\"name\":\"isComplete\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.isComplete\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"createdAt\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.createdAt\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"nftOwnerAddress\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.nftOwnerAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"fullPrice\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.fullPrice\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"marketplaceFee\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.marketplaceFee\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"royaltyAmount\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.royaltyAmount\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":1024,\"name\":\"canDeployByExternal\",\"url\":\"types/NftFixPriceSaleV3Data.html#__type.canDeployByExternal\",\"classes\":\"\",\"parent\":\"NftFixPriceSaleV3Data.__type\"},{\"kind\":64,\"name\":\"buildSignature\",\"url\":\"functions/buildSignature.html\",\"classes\":\"\"},{\"kind\":128,\"name\":\"NftMarketplace\",\"url\":\"classes/NftMarketplace.html\",\"classes\":\"\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftMarketplace.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftMarketplace.html#code-1\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftMarketplace.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftMarketplace.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftMarketplace.html#constructor\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftMarketplace.html#address\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftMarketplace.html#init\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftMarketplace.html#init.__type\",\"classes\":\"\",\"parent\":\"NftMarketplace.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftMarketplace.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftMarketplace.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftMarketplace.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftMarketplace.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftMarketplace.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":2048,\"name\":\"sendCoins\",\"url\":\"classes/NftMarketplace.html#sendCoins\",\"classes\":\"\",\"parent\":\"NftMarketplace\"},{\"kind\":4194304,\"name\":\"NftMarketplaceData\",\"url\":\"types/NftMarketplaceData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftMarketplaceData.html#__type\",\"classes\":\"\",\"parent\":\"NftMarketplaceData\"},{\"kind\":1024,\"name\":\"seqno\",\"url\":\"types/NftMarketplaceData.html#__type.seqno\",\"classes\":\"\",\"parent\":\"NftMarketplaceData.__type\"},{\"kind\":1024,\"name\":\"subwallet\",\"url\":\"types/NftMarketplaceData.html#__type.subwallet\",\"classes\":\"\",\"parent\":\"NftMarketplaceData.__type\"},{\"kind\":1024,\"name\":\"publicKey\",\"url\":\"types/NftMarketplaceData.html#__type.publicKey\",\"classes\":\"\",\"parent\":\"NftMarketplaceData.__type\"},{\"kind\":128,\"name\":\"NftOffer\",\"url\":\"classes/NftOffer.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftOffer.html#code-1\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftOffer.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftOffer.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftOffer.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftOffer.html#constructor\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftOffer.html#address\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftOffer.html#init\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftOffer.html#init.__type\",\"classes\":\"\",\"parent\":\"NftOffer.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftOffer.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftOffer.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftOffer.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftOffer.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftOffer.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"sendCancelOffer\",\"url\":\"classes/NftOffer.html#sendCancelOffer\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"sendCancelOfferByMarketplace\",\"url\":\"classes/NftOffer.html#sendCancelOfferByMarketplace\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":2048,\"name\":\"getOfferData\",\"url\":\"classes/NftOffer.html#getOfferData\",\"classes\":\"\",\"parent\":\"NftOffer\"},{\"kind\":4194304,\"name\":\"NftOfferData\",\"url\":\"types/NftOfferData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/NftOfferData.html#__type\",\"classes\":\"\",\"parent\":\"NftOfferData\"},{\"kind\":1024,\"name\":\"isComplete\",\"url\":\"types/NftOfferData.html#__type.isComplete\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"createdAt\",\"url\":\"types/NftOfferData.html#__type.createdAt\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"finishAt\",\"url\":\"types/NftOfferData.html#__type.finishAt\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"marketplaceAddress\",\"url\":\"types/NftOfferData.html#__type.marketplaceAddress\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"nftAddress\",\"url\":\"types/NftOfferData.html#__type.nftAddress\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"offerOwnerAddress\",\"url\":\"types/NftOfferData.html#__type.offerOwnerAddress\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"fullPrice\",\"url\":\"types/NftOfferData.html#__type.fullPrice\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFeeAddress\",\"url\":\"types/NftOfferData.html#__type.marketplaceFeeAddress\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"royaltyAddress\",\"url\":\"types/NftOfferData.html#__type.royaltyAddress\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"marketplaceFactor\",\"url\":\"types/NftOfferData.html#__type.marketplaceFactor\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"marketplaceBase\",\"url\":\"types/NftOfferData.html#__type.marketplaceBase\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"royaltyFactor\",\"url\":\"types/NftOfferData.html#__type.royaltyFactor\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":1024,\"name\":\"royaltyBase\",\"url\":\"types/NftOfferData.html#__type.royaltyBase\",\"classes\":\"\",\"parent\":\"NftOfferData.__type\"},{\"kind\":32,\"name\":\"SwapState\",\"url\":\"variables/SwapState.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"variables/SwapState.html#__type\",\"classes\":\"\",\"parent\":\"SwapState\"},{\"kind\":1024,\"name\":\"Active\",\"url\":\"variables/SwapState.html#__type.Active\",\"classes\":\"\",\"parent\":\"SwapState.__type\"},{\"kind\":1024,\"name\":\"Cancelled\",\"url\":\"variables/SwapState.html#__type.Cancelled\",\"classes\":\"\",\"parent\":\"SwapState.__type\"},{\"kind\":1024,\"name\":\"Completed\",\"url\":\"variables/SwapState.html#__type.Completed\",\"classes\":\"\",\"parent\":\"SwapState.__type\"},{\"kind\":4194304,\"name\":\"SwapData\",\"url\":\"types/SwapData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"types/SwapData.html#__type\",\"classes\":\"\",\"parent\":\"SwapData\"},{\"kind\":1024,\"name\":\"state\",\"url\":\"types/SwapData.html#__type.state\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"leftAddress\",\"url\":\"types/SwapData.html#__type.leftAddress\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"rightAddress\",\"url\":\"types/SwapData.html#__type.rightAddress\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"rightNft\",\"url\":\"types/SwapData.html#__type.rightNft\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"leftNft\",\"url\":\"types/SwapData.html#__type.leftNft\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"supervisorAddress\",\"url\":\"types/SwapData.html#__type.supervisorAddress\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"commissionAddress\",\"url\":\"types/SwapData.html#__type.commissionAddress\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"leftCommission\",\"url\":\"types/SwapData.html#__type.leftCommission\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"leftAmount\",\"url\":\"types/SwapData.html#__type.leftAmount\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"leftCoinsGot\",\"url\":\"types/SwapData.html#__type.leftCoinsGot\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"rightCommission\",\"url\":\"types/SwapData.html#__type.rightCommission\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"rightAmount\",\"url\":\"types/SwapData.html#__type.rightAmount\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":1024,\"name\":\"rightCoinsGot\",\"url\":\"types/SwapData.html#__type.rightCoinsGot\",\"classes\":\"\",\"parent\":\"SwapData.__type\"},{\"kind\":128,\"name\":\"NftSwap\",\"url\":\"classes/NftSwap.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftSwap.html#code-1\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"buildDataCell\",\"url\":\"classes/NftSwap.html#buildDataCell\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"createFromAddress\",\"url\":\"classes/NftSwap.html#createFromAddress\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"createFromConfig\",\"url\":\"classes/NftSwap.html#createFromConfig\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/NftSwap.html#constructor\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":1024,\"name\":\"address\",\"url\":\"classes/NftSwap.html#address\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":1024,\"name\":\"init\",\"url\":\"classes/NftSwap.html#init\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"classes/NftSwap.html#init.__type\",\"classes\":\"\",\"parent\":\"NftSwap.init\"},{\"kind\":1024,\"name\":\"code\",\"url\":\"classes/NftSwap.html#init.__type.code\",\"classes\":\"\",\"parent\":\"NftSwap.init.__type\"},{\"kind\":1024,\"name\":\"data\",\"url\":\"classes/NftSwap.html#init.__type.data\",\"classes\":\"\",\"parent\":\"NftSwap.init.__type\"},{\"kind\":2048,\"name\":\"sendDeploy\",\"url\":\"classes/NftSwap.html#sendDeploy\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"sendCancel\",\"url\":\"classes/NftSwap.html#sendCancel\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"sendAddCoins\",\"url\":\"classes/NftSwap.html#sendAddCoins\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"sendMaintain\",\"url\":\"classes/NftSwap.html#sendMaintain\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"sendTopup\",\"url\":\"classes/NftSwap.html#sendTopup\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"getTradeState\",\"url\":\"classes/NftSwap.html#getTradeState\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":2048,\"name\":\"getSupervisor\",\"url\":\"classes/NftSwap.html#getSupervisor\",\"classes\":\"\",\"parent\":\"NftSwap\"},{\"kind\":64,\"name\":\"isEligibleTransaction\",\"url\":\"functions/isEligibleTransaction.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"createTempFile\",\"url\":\"functions/createTempFile.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"randomAddress\",\"url\":\"functions/randomAddress.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"randomKeyPair\",\"url\":\"functions/randomKeyPair.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"uuid\",\"url\":\"functions/uuid.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"importKeyPair\",\"url\":\"functions/importKeyPair.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"createSender\",\"url\":\"functions/createSender.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"loadFullContent\",\"url\":\"functions/loadFullContent.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeFullContent\",\"url\":\"functions/storeFullContent.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeFullContent.html#storeFullContent.__type\",\"classes\":\"\",\"parent\":\"storeFullContent.storeFullContent\"},{\"kind\":64,\"name\":\"loadOnchainContent\",\"url\":\"functions/loadOnchainContent.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeOnchainContent\",\"url\":\"functions/storeOnchainContent.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeOnchainContent.html#storeOnchainContent.__type\",\"classes\":\"\",\"parent\":\"storeOnchainContent.storeOnchainContent\"},{\"kind\":64,\"name\":\"loadOffchainContent\",\"url\":\"functions/loadOffchainContent.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeOffchainContent\",\"url\":\"functions/storeOffchainContent.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeOffchainContent.html#storeOffchainContent.__type\",\"classes\":\"\",\"parent\":\"storeOffchainContent.storeOffchainContent\"},{\"kind\":64,\"name\":\"loadContentData\",\"url\":\"functions/loadContentData.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"loadSnakeData\",\"url\":\"functions/loadSnakeData.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeSnakeData\",\"url\":\"functions/storeSnakeData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeSnakeData.html#storeSnakeData.__type\",\"classes\":\"\",\"parent\":\"storeSnakeData.storeSnakeData\"},{\"kind\":64,\"name\":\"loadChunkedData\",\"url\":\"functions/loadChunkedData.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeChunkedData\",\"url\":\"functions/storeChunkedData.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeChunkedData.html#storeChunkedData.__type\",\"classes\":\"\",\"parent\":\"storeChunkedData.storeChunkedData\"},{\"kind\":64,\"name\":\"loadChunkedRaw\",\"url\":\"functions/loadChunkedRaw.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeChunkedRaw\",\"url\":\"functions/storeChunkedRaw.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeChunkedRaw.html#storeChunkedRaw.__type\",\"classes\":\"\",\"parent\":\"storeChunkedRaw.storeChunkedRaw\"},{\"kind\":64,\"name\":\"loadOnchainDict\",\"url\":\"functions/loadOnchainDict.html\",\"classes\":\"\"},{\"kind\":64,\"name\":\"storeOnchainDict\",\"url\":\"functions/storeOnchainDict.html\",\"classes\":\"\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"functions/storeOnchainDict.html#storeOnchainDict.__type\",\"classes\":\"\",\"parent\":\"storeOnchainDict.storeOnchainDict\"},{\"kind\":128,\"name\":\"TonNftClient\",\"url\":\"classes/TonNftClient.html\",\"classes\":\"\"},{\"kind\":512,\"name\":\"constructor\",\"url\":\"classes/TonNftClient.html#constructor\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":1024,\"name\":\"client\",\"url\":\"classes/TonNftClient.html#client\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":2048,\"name\":\"getNftCollections\",\"url\":\"classes/TonNftClient.html#getNftCollections\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":2048,\"name\":\"getNftCollection\",\"url\":\"classes/TonNftClient.html#getNftCollection\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":2048,\"name\":\"getNftItems\",\"url\":\"classes/TonNftClient.html#getNftItems\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":2048,\"name\":\"getNftItem\",\"url\":\"classes/TonNftClient.html#getNftItem\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":2048,\"name\":\"getTransactionsByAddress\",\"url\":\"classes/TonNftClient.html#getTransactionsByAddress\",\"classes\":\"\",\"parent\":\"TonNftClient\"},{\"kind\":256,\"name\":\"ClientInterface\",\"url\":\"interfaces/ClientInterface.html\",\"classes\":\"\"},{\"kind\":1024,\"name\":\"getNftCollections\",\"url\":\"interfaces/ClientInterface.html#getNftCollections\",\"classes\":\"\",\"parent\":\"ClientInterface\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"interfaces/ClientInterface.html#getNftCollections.__type-2\",\"classes\":\"\",\"parent\":\"ClientInterface.getNftCollections\"},{\"kind\":1024,\"name\":\"getNftCollection\",\"url\":\"interfaces/ClientInterface.html#getNftCollection\",\"classes\":\"\",\"parent\":\"ClientInterface\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"interfaces/ClientInterface.html#getNftCollection.__type\",\"classes\":\"\",\"parent\":\"ClientInterface.getNftCollection\"},{\"kind\":1024,\"name\":\"getNftItems\",\"url\":\"interfaces/ClientInterface.html#getNftItems\",\"classes\":\"\",\"parent\":\"ClientInterface\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"interfaces/ClientInterface.html#getNftItems.__type-6\",\"classes\":\"\",\"parent\":\"ClientInterface.getNftItems\"},{\"kind\":1024,\"name\":\"getNftItem\",\"url\":\"interfaces/ClientInterface.html#getNftItem\",\"classes\":\"\",\"parent\":\"ClientInterface\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"interfaces/ClientInterface.html#getNftItem.__type-4\",\"classes\":\"\",\"parent\":\"ClientInterface.getNftItem\"},{\"kind\":1024,\"name\":\"getTransactionsByAddress\",\"url\":\"interfaces/ClientInterface.html#getTransactionsByAddress\",\"classes\":\"\",\"parent\":\"ClientInterface\"},{\"kind\":65536,\"name\":\"__type\",\"url\":\"interfaces/ClientInterface.html#getTransactionsByAddress.__type-8\",\"classes\":\"\",\"parent\":\"ClientInterface.getTransactionsByAddress\"}],\"index\":{\"version\":\"2.3.9\",\"fields\":[\"name\",\"comment\"],\"fieldVectors\":[[\"name/0\",[0,56.881]],[\"comment/0\",[]],[\"name/1\",[1,56.881]],[\"comment/1\",[]],[\"name/2\",[2,56.881]],[\"comment/2\",[]],[\"name/3\",[3,56.881]],[\"comment/3\",[]],[\"name/4\",[4,56.881]],[\"comment/4\",[]],[\"name/5\",[5,56.881]],[\"comment/5\",[]],[\"name/6\",[6,32.902]],[\"comment/6\",[]],[\"name/7\",[7,56.881]],[\"comment/7\",[]],[\"name/8\",[8,56.881]],[\"comment/8\",[]],[\"name/9\",[9,48.408]],[\"comment/9\",[]],[\"name/10\",[10,48.408]],[\"comment/10\",[]],[\"name/11\",[11,48.408]],[\"comment/11\",[]],[\"name/12\",[12,48.408]],[\"comment/12\",[]],[\"name/13\",[13,48.408]],[\"comment/13\",[]],[\"name/14\",[14,51.773]],[\"comment/14\",[]],[\"name/15\",[6,32.902]],[\"comment/15\",[]],[\"name/16\",[14,51.773]],[\"comment/16\",[]],[\"name/17\",[9,48.408]],[\"comment/17\",[]],[\"name/18\",[10,48.408]],[\"comment/18\",[]],[\"name/19\",[11,48.408]],[\"comment/19\",[]],[\"name/20\",[12,48.408]],[\"comment/20\",[]],[\"name/21\",[13,48.408]],[\"comment/21\",[]],[\"name/22\",[15,56.881]],[\"comment/22\",[]],[\"name/23\",[6,32.902]],[\"comment/23\",[]],[\"name/24\",[16,56.881]],[\"comment/24\",[]],[\"name/25\",[9,48.408]],[\"comment/25\",[]],[\"name/26\",[10,48.408]],[\"comment/26\",[]],[\"name/27\",[11,48.408]],[\"comment/27\",[]],[\"name/28\",[12,48.408]],[\"comment/28\",[]],[\"name/29\",[13,48.408]],[\"comment/29\",[]],[\"name/30\",[17,56.881]],[\"comment/30\",[]],[\"name/31\",[18,23.679]],[\"comment/31\",[]],[\"name/32\",[19,51.773]],[\"comment/32\",[]],[\"name/33\",[20,51.773]],[\"comment/33\",[]],[\"name/34\",[21,45.895]],[\"comment/34\",[]],[\"name/35\",[22,48.408]],[\"comment/35\",[]],[\"name/36\",[23,51.773]],[\"comment/36\",[]],[\"name/37\",[18,23.679]],[\"comment/37\",[]],[\"name/38\",[24,45.895]],[\"comment/38\",[]],[\"name/39\",[25,45.895]],[\"comment/39\",[]],[\"name/40\",[26,40.787]],[\"comment/40\",[]],[\"name/41\",[27,56.881]],[\"comment/41\",[]],[\"name/42\",[18,23.679]],[\"comment/42\",[]],[\"name/43\",[28,56.881]],[\"comment/43\",[]],[\"name/44\",[29,56.881]],[\"comment/44\",[]],[\"name/45\",[30,56.881]],[\"comment/45\",[]],[\"name/46\",[31,56.881]],[\"comment/46\",[]],[\"name/47\",[32,45.895]],[\"comment/47\",[]],[\"name/48\",[33,56.881]],[\"comment/48\",[]],[\"name/49\",[34,56.881]],[\"comment/49\",[]],[\"name/50\",[35,29.366]],[\"comment/50\",[]],[\"name/51\",[36,36.512]],[\"comment/51\",[]],[\"name/52\",[37,35.678]],[\"comment/52\",[]],[\"name/53\",[38,36.512]],[\"comment/53\",[]],[\"name/54\",[39,56.881]],[\"comment/54\",[]],[\"name/55\",[40,56.881]],[\"comment/55\",[]],[\"name/56\",[6,32.902]],[\"comment/56\",[]],[\"name/57\",[41,36.512]],[\"comment/57\",[]],[\"name/58\",[42,56.881]],[\"comment/58\",[]],[\"name/59\",[43,56.881]],[\"comment/59\",[]],[\"name/60\",[44,48.408]],[\"comment/60\",[]],[\"name/61\",[32,45.895]],[\"comment/61\",[]],[\"name/62\",[45,35.678]],[\"comment/62\",[]],[\"name/63\",[46,35.678]],[\"comment/63\",[]],[\"name/64\",[18,23.679]],[\"comment/64\",[]],[\"name/65\",[35,29.366]],[\"comment/65\",[]],[\"name/66\",[47,35.678]],[\"comment/66\",[]],[\"name/67\",[48,56.881]],[\"comment/67\",[]],[\"name/68\",[49,56.881]],[\"comment/68\",[]],[\"name/69\",[50,56.881]],[\"comment/69\",[]],[\"name/70\",[51,56.881]],[\"comment/70\",[]],[\"name/71\",[18,23.679]],[\"comment/71\",[]],[\"name/72\",[21,45.895]],[\"comment/72\",[]],[\"name/73\",[52,56.881]],[\"comment/73\",[]],[\"name/74\",[53,56.881]],[\"comment/74\",[]],[\"name/75\",[54,56.881]],[\"comment/75\",[]],[\"name/76\",[55,56.881]],[\"comment/76\",[]],[\"name/77\",[23,51.773]],[\"comment/77\",[]],[\"name/78\",[56,56.881]],[\"comment/78\",[]],[\"name/79\",[18,23.679]],[\"comment/79\",[]],[\"name/80\",[57,51.773]],[\"comment/80\",[]],[\"name/81\",[58,56.881]],[\"comment/81\",[]],[\"name/82\",[59,56.881]],[\"comment/82\",[]],[\"name/83\",[60,56.881]],[\"comment/83\",[]],[\"name/84\",[19,51.773]],[\"comment/84\",[]],[\"name/85\",[61,56.881]],[\"comment/85\",[]],[\"name/86\",[62,56.881]],[\"comment/86\",[]],[\"name/87\",[18,23.679]],[\"comment/87\",[]],[\"name/88\",[57,51.773]],[\"comment/88\",[]],[\"name/89\",[63,56.881]],[\"comment/89\",[]],[\"name/90\",[64,56.881]],[\"comment/90\",[]],[\"name/91\",[65,56.881]],[\"comment/91\",[]],[\"name/92\",[35,29.366]],[\"comment/92\",[]],[\"name/93\",[36,36.512]],[\"comment/93\",[]],[\"name/94\",[37,35.678]],[\"comment/94\",[]],[\"name/95\",[38,36.512]],[\"comment/95\",[]],[\"name/96\",[66,51.773]],[\"comment/96\",[]],[\"name/97\",[6,32.902]],[\"comment/97\",[]],[\"name/98\",[41,36.512]],[\"comment/98\",[]],[\"name/99\",[67,56.881]],[\"comment/99\",[]],[\"name/100\",[44,48.408]],[\"comment/100\",[]],[\"name/101\",[32,45.895]],[\"comment/101\",[]],[\"name/102\",[45,35.678]],[\"comment/102\",[]],[\"name/103\",[46,35.678]],[\"comment/103\",[]],[\"name/104\",[18,23.679]],[\"comment/104\",[]],[\"name/105\",[35,29.366]],[\"comment/105\",[]],[\"name/106\",[47,35.678]],[\"comment/106\",[]],[\"name/107\",[68,51.773]],[\"comment/107\",[]],[\"name/108\",[69,51.773]],[\"comment/108\",[]],[\"name/109\",[70,48.408]],[\"comment/109\",[]],[\"name/110\",[71,56.881]],[\"comment/110\",[]],[\"name/111\",[18,23.679]],[\"comment/111\",[]],[\"name/112\",[20,51.773]],[\"comment/112\",[]],[\"name/113\",[72,56.881]],[\"comment/113\",[]],[\"name/114\",[21,45.895]],[\"comment/114\",[]],[\"name/115\",[22,48.408]],[\"comment/115\",[]],[\"name/116\",[73,56.881]],[\"comment/116\",[]],[\"name/117\",[35,29.366]],[\"comment/117\",[]],[\"name/118\",[36,36.512]],[\"comment/118\",[]],[\"name/119\",[37,35.678]],[\"comment/119\",[]],[\"name/120\",[38,36.512]],[\"comment/120\",[]],[\"name/121\",[6,32.902]],[\"comment/121\",[]],[\"name/122\",[45,35.678]],[\"comment/122\",[]],[\"name/123\",[46,35.678]],[\"comment/123\",[]],[\"name/124\",[18,23.679]],[\"comment/124\",[]],[\"name/125\",[35,29.366]],[\"comment/125\",[]],[\"name/126\",[47,35.678]],[\"comment/126\",[]],[\"name/127\",[41,36.512]],[\"comment/127\",[]],[\"name/128\",[74,56.881]],[\"comment/128\",[]],[\"name/129\",[75,56.881]],[\"comment/129\",[]],[\"name/130\",[76,56.881]],[\"comment/130\",[]],[\"name/131\",[70,48.408]],[\"comment/131\",[]],[\"name/132\",[77,56.881]],[\"comment/132\",[]],[\"name/133\",[78,56.881]],[\"comment/133\",[]],[\"name/134\",[79,56.881]],[\"comment/134\",[]],[\"name/135\",[18,23.679]],[\"comment/135\",[]],[\"name/136\",[21,45.895]],[\"comment/136\",[]],[\"name/137\",[80,56.881]],[\"comment/137\",[]],[\"name/138\",[22,48.408]],[\"comment/138\",[]],[\"name/139\",[81,56.881]],[\"comment/139\",[]],[\"name/140\",[82,56.881]],[\"comment/140\",[]],[\"name/141\",[83,56.881]],[\"comment/141\",[]],[\"name/142\",[37,35.678]],[\"comment/142\",[]],[\"name/143\",[66,51.773]],[\"comment/143\",[]],[\"name/144\",[6,32.902]],[\"comment/144\",[]],[\"name/145\",[44,48.408]],[\"comment/145\",[]],[\"name/146\",[32,45.895]],[\"comment/146\",[]],[\"name/147\",[45,35.678]],[\"comment/147\",[]],[\"name/148\",[46,35.678]],[\"comment/148\",[]],[\"name/149\",[18,23.679]],[\"comment/149\",[]],[\"name/150\",[35,29.366]],[\"comment/150\",[]],[\"name/151\",[47,35.678]],[\"comment/151\",[]],[\"name/152\",[68,51.773]],[\"comment/152\",[]],[\"name/153\",[69,51.773]],[\"comment/153\",[]],[\"name/154\",[70,48.408]],[\"comment/154\",[]],[\"name/155\",[84,56.881]],[\"comment/155\",[]],[\"name/156\",[35,29.366]],[\"comment/156\",[]],[\"name/157\",[36,36.512]],[\"comment/157\",[]],[\"name/158\",[37,35.678]],[\"comment/158\",[]],[\"name/159\",[38,36.512]],[\"comment/159\",[]],[\"name/160\",[6,32.902]],[\"comment/160\",[]],[\"name/161\",[45,35.678]],[\"comment/161\",[]],[\"name/162\",[46,35.678]],[\"comment/162\",[]],[\"name/163\",[18,23.679]],[\"comment/163\",[]],[\"name/164\",[35,29.366]],[\"comment/164\",[]],[\"name/165\",[47,35.678]],[\"comment/165\",[]],[\"name/166\",[41,36.512]],[\"comment/166\",[]],[\"name/167\",[85,48.408]],[\"comment/167\",[]],[\"name/168\",[86,51.773]],[\"comment/168\",[]],[\"name/169\",[87,56.881]],[\"comment/169\",[]],[\"name/170\",[88,56.881]],[\"comment/170\",[]],[\"name/171\",[89,43.888]],[\"comment/171\",[]],[\"name/172\",[90,56.881]],[\"comment/172\",[]],[\"name/173\",[18,23.679]],[\"comment/173\",[]],[\"name/174\",[91,42.218]],[\"comment/174\",[]],[\"name/175\",[92,51.773]],[\"comment/175\",[]],[\"name/176\",[93,51.773]],[\"comment/176\",[]],[\"name/177\",[26,40.787]],[\"comment/177\",[]],[\"name/178\",[24,45.895]],[\"comment/178\",[]],[\"name/179\",[25,45.895]],[\"comment/179\",[]],[\"name/180\",[94,51.773]],[\"comment/180\",[]],[\"name/181\",[95,51.773]],[\"comment/181\",[]],[\"name/182\",[96,51.773]],[\"comment/182\",[]],[\"name/183\",[97,51.773]],[\"comment/183\",[]],[\"name/184\",[98,51.773]],[\"comment/184\",[]],[\"name/185\",[99,51.773]],[\"comment/185\",[]],[\"name/186\",[100,51.773]],[\"comment/186\",[]],[\"name/187\",[101,43.888]],[\"comment/187\",[]],[\"name/188\",[102,42.218]],[\"comment/188\",[]],[\"name/189\",[103,51.773]],[\"comment/189\",[]],[\"name/190\",[104,42.218]],[\"comment/190\",[]],[\"name/191\",[105,51.773]],[\"comment/191\",[]],[\"name/192\",[106,56.881]],[\"comment/192\",[]],[\"name/193\",[35,29.366]],[\"comment/193\",[]],[\"name/194\",[36,36.512]],[\"comment/194\",[]],[\"name/195\",[37,35.678]],[\"comment/195\",[]],[\"name/196\",[38,36.512]],[\"comment/196\",[]],[\"name/197\",[6,32.902]],[\"comment/197\",[]],[\"name/198\",[45,35.678]],[\"comment/198\",[]],[\"name/199\",[46,35.678]],[\"comment/199\",[]],[\"name/200\",[18,23.679]],[\"comment/200\",[]],[\"name/201\",[35,29.366]],[\"comment/201\",[]],[\"name/202\",[47,35.678]],[\"comment/202\",[]],[\"name/203\",[41,36.512]],[\"comment/203\",[]],[\"name/204\",[85,48.408]],[\"comment/204\",[]],[\"name/205\",[86,51.773]],[\"comment/205\",[]],[\"name/206\",[89,43.888]],[\"comment/206\",[]],[\"name/207\",[107,56.881]],[\"comment/207\",[]],[\"name/208\",[18,23.679]],[\"comment/208\",[]],[\"name/209\",[91,42.218]],[\"comment/209\",[]],[\"name/210\",[92,51.773]],[\"comment/210\",[]],[\"name/211\",[93,51.773]],[\"comment/211\",[]],[\"name/212\",[26,40.787]],[\"comment/212\",[]],[\"name/213\",[24,45.895]],[\"comment/213\",[]],[\"name/214\",[25,45.895]],[\"comment/214\",[]],[\"name/215\",[94,51.773]],[\"comment/215\",[]],[\"name/216\",[95,51.773]],[\"comment/216\",[]],[\"name/217\",[96,51.773]],[\"comment/217\",[]],[\"name/218\",[97,51.773]],[\"comment/218\",[]],[\"name/219\",[98,51.773]],[\"comment/219\",[]],[\"name/220\",[99,51.773]],[\"comment/220\",[]],[\"name/221\",[100,51.773]],[\"comment/221\",[]],[\"name/222\",[101,43.888]],[\"comment/222\",[]],[\"name/223\",[102,42.218]],[\"comment/223\",[]],[\"name/224\",[103,51.773]],[\"comment/224\",[]],[\"name/225\",[104,42.218]],[\"comment/225\",[]],[\"name/226\",[105,51.773]],[\"comment/226\",[]],[\"name/227\",[108,56.881]],[\"comment/227\",[]],[\"name/228\",[35,29.366]],[\"comment/228\",[]],[\"name/229\",[36,36.512]],[\"comment/229\",[]],[\"name/230\",[37,35.678]],[\"comment/230\",[]],[\"name/231\",[38,36.512]],[\"comment/231\",[]],[\"name/232\",[6,32.902]],[\"comment/232\",[]],[\"name/233\",[45,35.678]],[\"comment/233\",[]],[\"name/234\",[46,35.678]],[\"comment/234\",[]],[\"name/235\",[18,23.679]],[\"comment/235\",[]],[\"name/236\",[35,29.366]],[\"comment/236\",[]],[\"name/237\",[47,35.678]],[\"comment/237\",[]],[\"name/238\",[41,36.512]],[\"comment/238\",[]],[\"name/239\",[89,43.888]],[\"comment/239\",[]],[\"name/240\",[109,56.881]],[\"comment/240\",[]],[\"name/241\",[18,23.679]],[\"comment/241\",[]],[\"name/242\",[104,42.218]],[\"comment/242\",[]],[\"name/243\",[102,42.218]],[\"comment/243\",[]],[\"name/244\",[101,43.888]],[\"comment/244\",[]],[\"name/245\",[110,45.895]],[\"comment/245\",[]],[\"name/246\",[111,48.408]],[\"comment/246\",[]],[\"name/247\",[91,42.218]],[\"comment/247\",[]],[\"name/248\",[112,48.408]],[\"comment/248\",[]],[\"name/249\",[26,40.787]],[\"comment/249\",[]],[\"name/250\",[113,56.881]],[\"comment/250\",[]],[\"name/251\",[35,29.366]],[\"comment/251\",[]],[\"name/252\",[36,36.512]],[\"comment/252\",[]],[\"name/253\",[37,35.678]],[\"comment/253\",[]],[\"name/254\",[38,36.512]],[\"comment/254\",[]],[\"name/255\",[6,32.902]],[\"comment/255\",[]],[\"name/256\",[45,35.678]],[\"comment/256\",[]],[\"name/257\",[46,35.678]],[\"comment/257\",[]],[\"name/258\",[18,23.679]],[\"comment/258\",[]],[\"name/259\",[35,29.366]],[\"comment/259\",[]],[\"name/260\",[47,35.678]],[\"comment/260\",[]],[\"name/261\",[41,36.512]],[\"comment/261\",[]],[\"name/262\",[114,48.408]],[\"comment/262\",[]],[\"name/263\",[115,51.773]],[\"comment/263\",[]],[\"name/264\",[116,51.773]],[\"comment/264\",[]],[\"name/265\",[89,43.888]],[\"comment/265\",[]],[\"name/266\",[117,56.881]],[\"comment/266\",[]],[\"name/267\",[18,23.679]],[\"comment/267\",[]],[\"name/268\",[118,48.408]],[\"comment/268\",[]],[\"name/269\",[119,48.408]],[\"comment/269\",[]],[\"name/270\",[104,42.218]],[\"comment/270\",[]],[\"name/271\",[102,42.218]],[\"comment/271\",[]],[\"name/272\",[101,43.888]],[\"comment/272\",[]],[\"name/273\",[110,45.895]],[\"comment/273\",[]],[\"name/274\",[91,42.218]],[\"comment/274\",[]],[\"name/275\",[111,48.408]],[\"comment/275\",[]],[\"name/276\",[26,40.787]],[\"comment/276\",[]],[\"name/277\",[112,48.408]],[\"comment/277\",[]],[\"name/278\",[120,56.881]],[\"comment/278\",[]],[\"name/279\",[35,29.366]],[\"comment/279\",[]],[\"name/280\",[36,36.512]],[\"comment/280\",[]],[\"name/281\",[37,35.678]],[\"comment/281\",[]],[\"name/282\",[38,36.512]],[\"comment/282\",[]],[\"name/283\",[6,32.902]],[\"comment/283\",[]],[\"name/284\",[45,35.678]],[\"comment/284\",[]],[\"name/285\",[46,35.678]],[\"comment/285\",[]],[\"name/286\",[18,23.679]],[\"comment/286\",[]],[\"name/287\",[35,29.366]],[\"comment/287\",[]],[\"name/288\",[47,35.678]],[\"comment/288\",[]],[\"name/289\",[41,36.512]],[\"comment/289\",[]],[\"name/290\",[114,48.408]],[\"comment/290\",[]],[\"name/291\",[115,51.773]],[\"comment/291\",[]],[\"name/292\",[116,51.773]],[\"comment/292\",[]],[\"name/293\",[89,43.888]],[\"comment/293\",[]],[\"name/294\",[121,56.881]],[\"comment/294\",[]],[\"name/295\",[18,23.679]],[\"comment/295\",[]],[\"name/296\",[118,48.408]],[\"comment/296\",[]],[\"name/297\",[119,48.408]],[\"comment/297\",[]],[\"name/298\",[104,42.218]],[\"comment/298\",[]],[\"name/299\",[102,42.218]],[\"comment/299\",[]],[\"name/300\",[101,43.888]],[\"comment/300\",[]],[\"name/301\",[110,45.895]],[\"comment/301\",[]],[\"name/302\",[91,42.218]],[\"comment/302\",[]],[\"name/303\",[111,48.408]],[\"comment/303\",[]],[\"name/304\",[26,40.787]],[\"comment/304\",[]],[\"name/305\",[112,48.408]],[\"comment/305\",[]],[\"name/306\",[122,56.881]],[\"comment/306\",[]],[\"name/307\",[123,56.881]],[\"comment/307\",[]],[\"name/308\",[124,56.881]],[\"comment/308\",[]],[\"name/309\",[37,35.678]],[\"comment/309\",[]],[\"name/310\",[35,29.366]],[\"comment/310\",[]],[\"name/311\",[36,36.512]],[\"comment/311\",[]],[\"name/312\",[38,36.512]],[\"comment/312\",[]],[\"name/313\",[6,32.902]],[\"comment/313\",[]],[\"name/314\",[45,35.678]],[\"comment/314\",[]],[\"name/315\",[46,35.678]],[\"comment/315\",[]],[\"name/316\",[18,23.679]],[\"comment/316\",[]],[\"name/317\",[35,29.366]],[\"comment/317\",[]],[\"name/318\",[47,35.678]],[\"comment/318\",[]],[\"name/319\",[41,36.512]],[\"comment/319\",[]],[\"name/320\",[114,48.408]],[\"comment/320\",[]],[\"name/321\",[125,56.881]],[\"comment/321\",[]],[\"name/322\",[18,23.679]],[\"comment/322\",[]],[\"name/323\",[126,56.881]],[\"comment/323\",[]],[\"name/324\",[127,56.881]],[\"comment/324\",[]],[\"name/325\",[128,56.881]],[\"comment/325\",[]],[\"name/326\",[129,56.881]],[\"comment/326\",[]],[\"name/327\",[35,29.366]],[\"comment/327\",[]],[\"name/328\",[36,36.512]],[\"comment/328\",[]],[\"name/329\",[37,35.678]],[\"comment/329\",[]],[\"name/330\",[38,36.512]],[\"comment/330\",[]],[\"name/331\",[6,32.902]],[\"comment/331\",[]],[\"name/332\",[45,35.678]],[\"comment/332\",[]],[\"name/333\",[46,35.678]],[\"comment/333\",[]],[\"name/334\",[18,23.679]],[\"comment/334\",[]],[\"name/335\",[35,29.366]],[\"comment/335\",[]],[\"name/336\",[47,35.678]],[\"comment/336\",[]],[\"name/337\",[41,36.512]],[\"comment/337\",[]],[\"name/338\",[130,56.881]],[\"comment/338\",[]],[\"name/339\",[131,56.881]],[\"comment/339\",[]],[\"name/340\",[132,56.881]],[\"comment/340\",[]],[\"name/341\",[133,56.881]],[\"comment/341\",[]],[\"name/342\",[18,23.679]],[\"comment/342\",[]],[\"name/343\",[118,48.408]],[\"comment/343\",[]],[\"name/344\",[119,48.408]],[\"comment/344\",[]],[\"name/345\",[134,56.881]],[\"comment/345\",[]],[\"name/346\",[104,42.218]],[\"comment/346\",[]],[\"name/347\",[102,42.218]],[\"comment/347\",[]],[\"name/348\",[135,56.881]],[\"comment/348\",[]],[\"name/349\",[110,45.895]],[\"comment/349\",[]],[\"name/350\",[91,42.218]],[\"comment/350\",[]],[\"name/351\",[26,40.787]],[\"comment/351\",[]],[\"name/352\",[136,56.881]],[\"comment/352\",[]],[\"name/353\",[137,56.881]],[\"comment/353\",[]],[\"name/354\",[24,45.895]],[\"comment/354\",[]],[\"name/355\",[25,45.895]],[\"comment/355\",[]],[\"name/356\",[138,56.881]],[\"comment/356\",[]],[\"name/357\",[18,23.679]],[\"comment/357\",[]],[\"name/358\",[139,56.881]],[\"comment/358\",[]],[\"name/359\",[140,56.881]],[\"comment/359\",[]],[\"name/360\",[141,56.881]],[\"comment/360\",[]],[\"name/361\",[142,56.881]],[\"comment/361\",[]],[\"name/362\",[18,23.679]],[\"comment/362\",[]],[\"name/363\",[143,56.881]],[\"comment/363\",[]],[\"name/364\",[144,56.881]],[\"comment/364\",[]],[\"name/365\",[145,56.881]],[\"comment/365\",[]],[\"name/366\",[146,56.881]],[\"comment/366\",[]],[\"name/367\",[147,56.881]],[\"comment/367\",[]],[\"name/368\",[148,56.881]],[\"comment/368\",[]],[\"name/369\",[149,56.881]],[\"comment/369\",[]],[\"name/370\",[150,56.881]],[\"comment/370\",[]],[\"name/371\",[151,56.881]],[\"comment/371\",[]],[\"name/372\",[152,56.881]],[\"comment/372\",[]],[\"name/373\",[153,56.881]],[\"comment/373\",[]],[\"name/374\",[154,56.881]],[\"comment/374\",[]],[\"name/375\",[155,56.881]],[\"comment/375\",[]],[\"name/376\",[156,56.881]],[\"comment/376\",[]],[\"name/377\",[35,29.366]],[\"comment/377\",[]],[\"name/378\",[36,36.512]],[\"comment/378\",[]],[\"name/379\",[37,35.678]],[\"comment/379\",[]],[\"name/380\",[38,36.512]],[\"comment/380\",[]],[\"name/381\",[6,32.902]],[\"comment/381\",[]],[\"name/382\",[45,35.678]],[\"comment/382\",[]],[\"name/383\",[46,35.678]],[\"comment/383\",[]],[\"name/384\",[18,23.679]],[\"comment/384\",[]],[\"name/385\",[35,29.366]],[\"comment/385\",[]],[\"name/386\",[47,35.678]],[\"comment/386\",[]],[\"name/387\",[41,36.512]],[\"comment/387\",[]],[\"name/388\",[85,48.408]],[\"comment/388\",[]],[\"name/389\",[157,56.881]],[\"comment/389\",[]],[\"name/390\",[158,56.881]],[\"comment/390\",[]],[\"name/391\",[159,56.881]],[\"comment/391\",[]],[\"name/392\",[160,56.881]],[\"comment/392\",[]],[\"name/393\",[161,56.881]],[\"comment/393\",[]],[\"name/394\",[162,56.881]],[\"comment/394\",[]],[\"name/395\",[163,56.881]],[\"comment/395\",[]],[\"name/396\",[164,56.881]],[\"comment/396\",[]],[\"name/397\",[165,56.881]],[\"comment/397\",[]],[\"name/398\",[166,56.881]],[\"comment/398\",[]],[\"name/399\",[167,56.881]],[\"comment/399\",[]],[\"name/400\",[168,56.881]],[\"comment/400\",[]],[\"name/401\",[169,56.881]],[\"comment/401\",[]],[\"name/402\",[170,56.881]],[\"comment/402\",[]],[\"name/403\",[18,23.679]],[\"comment/403\",[]],[\"name/404\",[171,56.881]],[\"comment/404\",[]],[\"name/405\",[172,56.881]],[\"comment/405\",[]],[\"name/406\",[18,23.679]],[\"comment/406\",[]],[\"name/407\",[173,56.881]],[\"comment/407\",[]],[\"name/408\",[174,56.881]],[\"comment/408\",[]],[\"name/409\",[18,23.679]],[\"comment/409\",[]],[\"name/410\",[175,56.881]],[\"comment/410\",[]],[\"name/411\",[176,56.881]],[\"comment/411\",[]],[\"name/412\",[177,56.881]],[\"comment/412\",[]],[\"name/413\",[18,23.679]],[\"comment/413\",[]],[\"name/414\",[178,56.881]],[\"comment/414\",[]],[\"name/415\",[179,56.881]],[\"comment/415\",[]],[\"name/416\",[18,23.679]],[\"comment/416\",[]],[\"name/417\",[180,56.881]],[\"comment/417\",[]],[\"name/418\",[181,56.881]],[\"comment/418\",[]],[\"name/419\",[18,23.679]],[\"comment/419\",[]],[\"name/420\",[182,56.881]],[\"comment/420\",[]],[\"name/421\",[183,56.881]],[\"comment/421\",[]],[\"name/422\",[18,23.679]],[\"comment/422\",[]],[\"name/423\",[184,56.881]],[\"comment/423\",[]],[\"name/424\",[6,32.902]],[\"comment/424\",[]],[\"name/425\",[185,56.881]],[\"comment/425\",[]],[\"name/426\",[186,51.773]],[\"comment/426\",[]],[\"name/427\",[187,51.773]],[\"comment/427\",[]],[\"name/428\",[188,51.773]],[\"comment/428\",[]],[\"name/429\",[189,51.773]],[\"comment/429\",[]],[\"name/430\",[190,51.773]],[\"comment/430\",[]],[\"name/431\",[191,56.881]],[\"comment/431\",[]],[\"name/432\",[186,51.773]],[\"comment/432\",[]],[\"name/433\",[18,23.679]],[\"comment/433\",[]],[\"name/434\",[187,51.773]],[\"comment/434\",[]],[\"name/435\",[18,23.679]],[\"comment/435\",[]],[\"name/436\",[188,51.773]],[\"comment/436\",[]],[\"name/437\",[18,23.679]],[\"comment/437\",[]],[\"name/438\",[189,51.773]],[\"comment/438\",[]],[\"name/439\",[18,23.679]],[\"comment/439\",[]],[\"name/440\",[190,51.773]],[\"comment/440\",[]],[\"name/441\",[18,23.679]],[\"comment/441\",[]]],\"invertedIndex\":[[\"__type\",{\"_index\":18,\"name\":{\"31\":{},\"37\":{},\"42\":{},\"64\":{},\"71\":{},\"79\":{},\"87\":{},\"104\":{},\"111\":{},\"124\":{},\"135\":{},\"149\":{},\"163\":{},\"173\":{},\"200\":{},\"208\":{},\"235\":{},\"241\":{},\"258\":{},\"267\":{},\"286\":{},\"295\":{},\"316\":{},\"322\":{},\"334\":{},\"342\":{},\"357\":{},\"362\":{},\"384\":{},\"403\":{},\"406\":{},\"409\":{},\"413\":{},\"416\":{},\"419\":{},\"422\":{},\"433\":{},\"435\":{},\"437\":{},\"439\":{},\"441\":{}},\"comment\":{}}],[\"activated\",{\"_index\":105,\"name\":{\"191\":{},\"226\":{}},\"comment\":{}}],[\"active\",{\"_index\":139,\"name\":{\"358\":{}},\"comment\":{}}],[\"address\",{\"_index\":45,\"name\":{\"62\":{},\"102\":{},\"122\":{},\"147\":{},\"161\":{},\"198\":{},\"233\":{},\"256\":{},\"284\":{},\"314\":{},\"332\":{},\"382\":{}},\"comment\":{}}],[\"amazons3\",{\"_index\":5,\"name\":{\"5\":{}},\"comment\":{}}],[\"authorityaddress\",{\"_index\":81,\"name\":{\"139\":{}},\"comment\":{}}],[\"batchmint\",{\"_index\":29,\"name\":{\"44\":{}},\"comment\":{}}],[\"bucketname\",{\"_index\":8,\"name\":{\"8\":{}},\"comment\":{}}],[\"builddatacell\",{\"_index\":36,\"name\":{\"51\":{},\"93\":{},\"118\":{},\"157\":{},\"194\":{},\"229\":{},\"252\":{},\"280\":{},\"311\":{},\"328\":{},\"378\":{}},\"comment\":{}}],[\"buildsignature\",{\"_index\":123,\"name\":{\"307\":{}},\"comment\":{}}],[\"cancelled\",{\"_index\":140,\"name\":{\"359\":{}},\"comment\":{}}],[\"candeploybyexternal\",{\"_index\":122,\"name\":{\"306\":{}},\"comment\":{}}],[\"changeowner\",{\"_index\":30,\"name\":{\"45\":{}},\"comment\":{}}],[\"client\",{\"_index\":185,\"name\":{\"425\":{}},\"comment\":{}}],[\"clientinterface\",{\"_index\":191,\"name\":{\"431\":{}},\"comment\":{}}],[\"code\",{\"_index\":35,\"name\":{\"50\":{},\"65\":{},\"92\":{},\"105\":{},\"117\":{},\"125\":{},\"150\":{},\"156\":{},\"164\":{},\"193\":{},\"201\":{},\"228\":{},\"236\":{},\"251\":{},\"259\":{},\"279\":{},\"287\":{},\"310\":{},\"317\":{},\"327\":{},\"335\":{},\"377\":{},\"385\":{}},\"comment\":{}}],[\"collectionaddress\",{\"_index\":72,\"name\":{\"113\":{}},\"comment\":{}}],[\"collectioncontent\",{\"_index\":53,\"name\":{\"74\":{}},\"comment\":{}}],[\"collectionmintiteminput\",{\"_index\":17,\"name\":{\"30\":{}},\"comment\":{}}],[\"commissionaddress\",{\"_index\":149,\"name\":{\"369\":{}},\"comment\":{}}],[\"commoncontent\",{\"_index\":54,\"name\":{\"75\":{}},\"comment\":{}}],[\"completed\",{\"_index\":141,\"name\":{\"360\":{}},\"comment\":{}}],[\"constructor\",{\"_index\":6,\"name\":{\"6\":{},\"15\":{},\"23\":{},\"56\":{},\"97\":{},\"121\":{},\"144\":{},\"160\":{},\"197\":{},\"232\":{},\"255\":{},\"283\":{},\"313\":{},\"331\":{},\"381\":{},\"424\":{}},\"comment\":{}}],[\"content\",{\"_index\":22,\"name\":{\"35\":{},\"115\":{},\"138\":{}},\"comment\":{}}],[\"createdat\",{\"_index\":119,\"name\":{\"269\":{},\"297\":{},\"344\":{}},\"comment\":{}}],[\"createdattimestamp\",{\"_index\":98,\"name\":{\"184\":{},\"219\":{}},\"comment\":{}}],[\"createfromaddress\",{\"_index\":37,\"name\":{\"52\":{},\"94\":{},\"119\":{},\"142\":{},\"158\":{},\"195\":{},\"230\":{},\"253\":{},\"281\":{},\"309\":{},\"329\":{},\"379\":{}},\"comment\":{}}],[\"createfromconfig\",{\"_index\":38,\"name\":{\"53\":{},\"95\":{},\"120\":{},\"159\":{},\"196\":{},\"231\":{},\"254\":{},\"282\":{},\"312\":{},\"330\":{},\"380\":{}},\"comment\":{}}],[\"createsender\",{\"_index\":168,\"name\":{\"400\":{}},\"comment\":{}}],[\"createtempfile\",{\"_index\":163,\"name\":{\"395\":{}},\"comment\":{}}],[\"data\",{\"_index\":47,\"name\":{\"66\":{},\"106\":{},\"126\":{},\"151\":{},\"165\":{},\"202\":{},\"237\":{},\"260\":{},\"288\":{},\"318\":{},\"336\":{},\"386\":{}},\"comment\":{}}],[\"editcontent\",{\"_index\":31,\"name\":{\"46\":{}},\"comment\":{}}],[\"editoraddress\",{\"_index\":80,\"name\":{\"137\":{}},\"comment\":{}}],[\"end\",{\"_index\":103,\"name\":{\"189\":{},\"224\":{}},\"comment\":{}}],[\"endpoint\",{\"_index\":0,\"name\":{\"0\":{}},\"comment\":{}}],[\"endtimestamp\",{\"_index\":97,\"name\":{\"183\":{},\"218\":{}},\"comment\":{}}],[\"finishat\",{\"_index\":134,\"name\":{\"345\":{}},\"comment\":{}}],[\"from\",{\"_index\":58,\"name\":{\"81\":{}},\"comment\":{}}],[\"fullprice\",{\"_index\":110,\"name\":{\"245\":{},\"273\":{},\"301\":{},\"349\":{}},\"comment\":{}}],[\"getauthorityaddress\",{\"_index\":77,\"name\":{\"132\":{}},\"comment\":{}}],[\"getcollectiondata\",{\"_index\":48,\"name\":{\"67\":{}},\"comment\":{}}],[\"getnftaddressbyindex\",{\"_index\":49,\"name\":{\"68\":{}},\"comment\":{}}],[\"getnftcollection\",{\"_index\":187,\"name\":{\"427\":{},\"434\":{}},\"comment\":{}}],[\"getnftcollections\",{\"_index\":186,\"name\":{\"426\":{},\"432\":{}},\"comment\":{}}],[\"getnftcontent\",{\"_index\":50,\"name\":{\"69\":{}},\"comment\":{}}],[\"getnftdata\",{\"_index\":70,\"name\":{\"109\":{},\"131\":{},\"154\":{}},\"comment\":{}}],[\"getnftitem\",{\"_index\":189,\"name\":{\"429\":{},\"438\":{}},\"comment\":{}}],[\"getnftitems\",{\"_index\":188,\"name\":{\"428\":{},\"436\":{}},\"comment\":{}}],[\"getofferdata\",{\"_index\":132,\"name\":{\"340\":{}},\"comment\":{}}],[\"getrevokedtime\",{\"_index\":78,\"name\":{\"133\":{}},\"comment\":{}}],[\"getroyaltyparams\",{\"_index\":32,\"name\":{\"47\":{},\"61\":{},\"101\":{},\"146\":{}},\"comment\":{}}],[\"getroyaltyparamsresponse\",{\"_index\":33,\"name\":{\"48\":{}},\"comment\":{}}],[\"getsaledata\",{\"_index\":89,\"name\":{\"171\":{},\"206\":{},\"239\":{},\"265\":{},\"293\":{}},\"comment\":{}}],[\"getsupervisor\",{\"_index\":161,\"name\":{\"393\":{}},\"comment\":{}}],[\"gettradestate\",{\"_index\":160,\"name\":{\"392\":{}},\"comment\":{}}],[\"gettransactionsbyaddress\",{\"_index\":190,\"name\":{\"430\":{},\"440\":{}},\"comment\":{}}],[\"importkeypair\",{\"_index\":167,\"name\":{\"399\":{}},\"comment\":{}}],[\"index\",{\"_index\":20,\"name\":{\"33\":{},\"112\":{}},\"comment\":{}}],[\"init\",{\"_index\":46,\"name\":{\"63\":{},\"103\":{},\"123\":{},\"148\":{},\"162\":{},\"199\":{},\"234\":{},\"257\":{},\"285\":{},\"315\":{},\"333\":{},\"383\":{}},\"comment\":{}}],[\"iscomplete\",{\"_index\":118,\"name\":{\"268\":{},\"296\":{},\"343\":{}},\"comment\":{}}],[\"iseligibletransaction\",{\"_index\":162,\"name\":{\"394\":{}},\"comment\":{}}],[\"itemindex\",{\"_index\":60,\"name\":{\"83\":{}},\"comment\":{}}],[\"leftaddress\",{\"_index\":144,\"name\":{\"364\":{}},\"comment\":{}}],[\"leftamount\",{\"_index\":151,\"name\":{\"371\":{}},\"comment\":{}}],[\"leftcoinsgot\",{\"_index\":152,\"name\":{\"372\":{}},\"comment\":{}}],[\"leftcommission\",{\"_index\":150,\"name\":{\"370\":{}},\"comment\":{}}],[\"leftnft\",{\"_index\":147,\"name\":{\"367\":{}},\"comment\":{}}],[\"loadchunkeddata\",{\"_index\":178,\"name\":{\"414\":{}},\"comment\":{}}],[\"loadchunkedraw\",{\"_index\":180,\"name\":{\"417\":{}},\"comment\":{}}],[\"loadcontentdata\",{\"_index\":175,\"name\":{\"410\":{}},\"comment\":{}}],[\"loadfullcontent\",{\"_index\":169,\"name\":{\"401\":{}},\"comment\":{}}],[\"loadoffchaincontent\",{\"_index\":173,\"name\":{\"407\":{}},\"comment\":{}}],[\"loadonchaincontent\",{\"_index\":171,\"name\":{\"404\":{}},\"comment\":{}}],[\"loadonchaindict\",{\"_index\":182,\"name\":{\"420\":{}},\"comment\":{}}],[\"loadsnakedata\",{\"_index\":176,\"name\":{\"411\":{}},\"comment\":{}}],[\"mainnet\",{\"_index\":1,\"name\":{\"1\":{}},\"comment\":{}}],[\"marketplaceaddress\",{\"_index\":104,\"name\":{\"190\":{},\"225\":{},\"242\":{},\"270\":{},\"298\":{},\"346\":{}},\"comment\":{}}],[\"marketplacebase\",{\"_index\":137,\"name\":{\"353\":{}},\"comment\":{}}],[\"marketplacefactor\",{\"_index\":136,\"name\":{\"352\":{}},\"comment\":{}}],[\"marketplacefee\",{\"_index\":111,\"name\":{\"246\":{},\"275\":{},\"303\":{}},\"comment\":{}}],[\"marketplacefeeaddress\",{\"_index\":91,\"name\":{\"174\":{},\"209\":{},\"247\":{},\"274\":{},\"302\":{},\"350\":{}},\"comment\":{}}],[\"marketplacefeebase\",{\"_index\":93,\"name\":{\"176\":{},\"211\":{}},\"comment\":{}}],[\"marketplacefeefactor\",{\"_index\":92,\"name\":{\"175\":{},\"210\":{}},\"comment\":{}}],[\"maxbid\",{\"_index\":95,\"name\":{\"181\":{},\"216\":{}},\"comment\":{}}],[\"minbid\",{\"_index\":94,\"name\":{\"180\":{},\"215\":{}},\"comment\":{}}],[\"minstep\",{\"_index\":96,\"name\":{\"182\":{},\"217\":{}},\"comment\":{}}],[\"mint\",{\"_index\":28,\"name\":{\"43\":{}},\"comment\":{}}],[\"newowner\",{\"_index\":64,\"name\":{\"90\":{}},\"comment\":{}}],[\"nextitemindex\",{\"_index\":52,\"name\":{\"73\":{}},\"comment\":{}}],[\"nftaddress\",{\"_index\":102,\"name\":{\"188\":{},\"223\":{},\"243\":{},\"271\":{},\"299\":{},\"347\":{}},\"comment\":{}}],[\"nftauction\",{\"_index\":84,\"name\":{\"155\":{}},\"comment\":{}}],[\"nftauctiondata\",{\"_index\":90,\"name\":{\"172\":{}},\"comment\":{}}],[\"nftauctionv2\",{\"_index\":106,\"name\":{\"192\":{}},\"comment\":{}}],[\"nftauctionv2data\",{\"_index\":107,\"name\":{\"207\":{}},\"comment\":{}}],[\"nftcollection\",{\"_index\":34,\"name\":{\"49\":{}},\"comment\":{}}],[\"nftcollectiondata\",{\"_index\":51,\"name\":{\"70\":{}},\"comment\":{}}],[\"nftfixedprice\",{\"_index\":108,\"name\":{\"227\":{}},\"comment\":{}}],[\"nftfixedpricev2\",{\"_index\":113,\"name\":{\"250\":{}},\"comment\":{}}],[\"nftfixedpricev3\",{\"_index\":120,\"name\":{\"278\":{}},\"comment\":{}}],[\"nftfixpricesaledata\",{\"_index\":109,\"name\":{\"240\":{}},\"comment\":{}}],[\"nftfixpricesalev2data\",{\"_index\":117,\"name\":{\"266\":{}},\"comment\":{}}],[\"nftfixpricesalev3data\",{\"_index\":121,\"name\":{\"294\":{}},\"comment\":{}}],[\"nftitem\",{\"_index\":65,\"name\":{\"91\":{}},\"comment\":{}}],[\"nftitemcode\",{\"_index\":55,\"name\":{\"76\":{}},\"comment\":{}}],[\"nftitemdata\",{\"_index\":71,\"name\":{\"110\":{}},\"comment\":{}}],[\"nftitemmessage\",{\"_index\":61,\"name\":{\"85\":{}},\"comment\":{}}],[\"nftitemroyalty\",{\"_index\":83,\"name\":{\"141\":{}},\"comment\":{}}],[\"nftmarketplace\",{\"_index\":124,\"name\":{\"308\":{}},\"comment\":{}}],[\"nftmarketplacedata\",{\"_index\":125,\"name\":{\"321\":{}},\"comment\":{}}],[\"nftmint\",{\"_index\":56,\"name\":{\"78\":{}},\"comment\":{}}],[\"nftoffer\",{\"_index\":129,\"name\":{\"326\":{}},\"comment\":{}}],[\"nftofferdata\",{\"_index\":133,\"name\":{\"341\":{}},\"comment\":{}}],[\"nftowneraddress\",{\"_index\":101,\"name\":{\"187\":{},\"222\":{},\"244\":{},\"272\":{},\"300\":{}},\"comment\":{}}],[\"nftswap\",{\"_index\":156,\"name\":{\"376\":{}},\"comment\":{}}],[\"offerowneraddress\",{\"_index\":135,\"name\":{\"348\":{}},\"comment\":{}}],[\"oldowner\",{\"_index\":63,\"name\":{\"89\":{}},\"comment\":{}}],[\"operationcodes\",{\"_index\":27,\"name\":{\"41\":{}},\"comment\":{}}],[\"owneraddress\",{\"_index\":21,\"name\":{\"34\":{},\"72\":{},\"114\":{},\"136\":{}},\"comment\":{}}],[\"ownershiptransfer\",{\"_index\":62,\"name\":{\"86\":{}},\"comment\":{}}],[\"parsemint\",{\"_index\":39,\"name\":{\"54\":{}},\"comment\":{}}],[\"parseownershiptransfer\",{\"_index\":40,\"name\":{\"55\":{}},\"comment\":{}}],[\"parsetransaction\",{\"_index\":4,\"name\":{\"4\":{}},\"comment\":{}}],[\"parsetransfer\",{\"_index\":66,\"name\":{\"96\":{},\"143\":{}},\"comment\":{}}],[\"passamount\",{\"_index\":19,\"name\":{\"32\":{},\"84\":{}},\"comment\":{}}],[\"pinata\",{\"_index\":14,\"name\":{\"14\":{},\"16\":{}},\"comment\":{}}],[\"provider\",{\"_index\":16,\"name\":{\"24\":{}},\"comment\":{}}],[\"publickey\",{\"_index\":128,\"name\":{\"325\":{}},\"comment\":{}}],[\"queryid\",{\"_index\":57,\"name\":{\"80\":{},\"88\":{}},\"comment\":{}}],[\"randomaddress\",{\"_index\":164,\"name\":{\"396\":{}},\"comment\":{}}],[\"randomkeypair\",{\"_index\":165,\"name\":{\"397\":{}},\"comment\":{}}],[\"revokedat\",{\"_index\":82,\"name\":{\"140\":{}},\"comment\":{}}],[\"rightaddress\",{\"_index\":145,\"name\":{\"365\":{}},\"comment\":{}}],[\"rightamount\",{\"_index\":154,\"name\":{\"374\":{}},\"comment\":{}}],[\"rightcoinsgot\",{\"_index\":155,\"name\":{\"375\":{}},\"comment\":{}}],[\"rightcommission\",{\"_index\":153,\"name\":{\"373\":{}},\"comment\":{}}],[\"rightnft\",{\"_index\":146,\"name\":{\"366\":{}},\"comment\":{}}],[\"royaltyaddress\",{\"_index\":26,\"name\":{\"40\":{},\"177\":{},\"212\":{},\"249\":{},\"276\":{},\"304\":{},\"351\":{}},\"comment\":{}}],[\"royaltyamount\",{\"_index\":112,\"name\":{\"248\":{},\"277\":{},\"305\":{}},\"comment\":{}}],[\"royaltybase\",{\"_index\":25,\"name\":{\"39\":{},\"179\":{},\"214\":{},\"355\":{}},\"comment\":{}}],[\"royaltyfactor\",{\"_index\":24,\"name\":{\"38\":{},\"178\":{},\"213\":{},\"354\":{}},\"comment\":{}}],[\"royaltyparams\",{\"_index\":23,\"name\":{\"36\":{},\"77\":{}},\"comment\":{}}],[\"s3\",{\"_index\":7,\"name\":{\"7\":{}},\"comment\":{}}],[\"sbtsingle\",{\"_index\":73,\"name\":{\"116\":{}},\"comment\":{}}],[\"sbtsingledata\",{\"_index\":79,\"name\":{\"134\":{}},\"comment\":{}}],[\"sendaddcoins\",{\"_index\":157,\"name\":{\"389\":{}},\"comment\":{}}],[\"sendbuy\",{\"_index\":116,\"name\":{\"264\":{},\"292\":{}},\"comment\":{}}],[\"sendcancel\",{\"_index\":85,\"name\":{\"167\":{},\"204\":{},\"388\":{}},\"comment\":{}}],[\"sendcanceloffer\",{\"_index\":130,\"name\":{\"338\":{}},\"comment\":{}}],[\"sendcancelofferbymarketplace\",{\"_index\":131,\"name\":{\"339\":{}},\"comment\":{}}],[\"sendcancelsale\",{\"_index\":115,\"name\":{\"263\":{},\"291\":{}},\"comment\":{}}],[\"sendchangeowner\",{\"_index\":43,\"name\":{\"59\":{}},\"comment\":{}}],[\"sendcoins\",{\"_index\":114,\"name\":{\"262\":{},\"290\":{},\"320\":{}},\"comment\":{}}],[\"senddeploy\",{\"_index\":41,\"name\":{\"57\":{},\"98\":{},\"127\":{},\"166\":{},\"203\":{},\"238\":{},\"261\":{},\"289\":{},\"319\":{},\"337\":{},\"387\":{}},\"comment\":{}}],[\"sendemergencymessage\",{\"_index\":88,\"name\":{\"170\":{}},\"comment\":{}}],[\"sendgetroyaltyparams\",{\"_index\":44,\"name\":{\"60\":{},\"100\":{},\"145\":{}},\"comment\":{}}],[\"sendgetstaticdata\",{\"_index\":69,\"name\":{\"108\":{},\"153\":{}},\"comment\":{}}],[\"sendmaintain\",{\"_index\":158,\"name\":{\"390\":{}},\"comment\":{}}],[\"sendmint\",{\"_index\":42,\"name\":{\"58\":{}},\"comment\":{}}],[\"sendproveownership\",{\"_index\":74,\"name\":{\"128\":{}},\"comment\":{}}],[\"sendrepeatendauction\",{\"_index\":87,\"name\":{\"169\":{}},\"comment\":{}}],[\"sendrequestowner\",{\"_index\":75,\"name\":{\"129\":{}},\"comment\":{}}],[\"sendrevoke\",{\"_index\":76,\"name\":{\"130\":{}},\"comment\":{}}],[\"sendstop\",{\"_index\":86,\"name\":{\"168\":{},\"205\":{}},\"comment\":{}}],[\"sendtopup\",{\"_index\":159,\"name\":{\"391\":{}},\"comment\":{}}],[\"sendtransfer\",{\"_index\":68,\"name\":{\"107\":{},\"152\":{}},\"comment\":{}}],[\"sendtransfereditorship\",{\"_index\":67,\"name\":{\"99\":{}},\"comment\":{}}],[\"seqno\",{\"_index\":126,\"name\":{\"323\":{}},\"comment\":{}}],[\"state\",{\"_index\":143,\"name\":{\"363\":{}},\"comment\":{}}],[\"steptimeseconds\",{\"_index\":99,\"name\":{\"185\":{},\"220\":{}},\"comment\":{}}],[\"storage\",{\"_index\":15,\"name\":{\"22\":{}},\"comment\":{}}],[\"storechunkeddata\",{\"_index\":179,\"name\":{\"415\":{}},\"comment\":{}}],[\"storechunkedraw\",{\"_index\":181,\"name\":{\"418\":{}},\"comment\":{}}],[\"storefullcontent\",{\"_index\":170,\"name\":{\"402\":{}},\"comment\":{}}],[\"storeoffchaincontent\",{\"_index\":174,\"name\":{\"408\":{}},\"comment\":{}}],[\"storeonchaincontent\",{\"_index\":172,\"name\":{\"405\":{}},\"comment\":{}}],[\"storeonchaindict\",{\"_index\":183,\"name\":{\"421\":{}},\"comment\":{}}],[\"storesnakedata\",{\"_index\":177,\"name\":{\"412\":{}},\"comment\":{}}],[\"subwallet\",{\"_index\":127,\"name\":{\"324\":{}},\"comment\":{}}],[\"supervisoraddress\",{\"_index\":148,\"name\":{\"368\":{}},\"comment\":{}}],[\"swapdata\",{\"_index\":142,\"name\":{\"361\":{}},\"comment\":{}}],[\"swapstate\",{\"_index\":138,\"name\":{\"356\":{}},\"comment\":{}}],[\"testnet\",{\"_index\":2,\"name\":{\"2\":{}},\"comment\":{}}],[\"to\",{\"_index\":59,\"name\":{\"82\":{}},\"comment\":{}}],[\"tonnftclient\",{\"_index\":184,\"name\":{\"423\":{}},\"comment\":{}}],[\"transactionparsing\",{\"_index\":3,\"name\":{\"3\":{}},\"comment\":{}}],[\"trysteptimeseconds\",{\"_index\":100,\"name\":{\"186\":{},\"221\":{}},\"comment\":{}}],[\"uploadbulk\",{\"_index\":13,\"name\":{\"13\":{},\"21\":{},\"29\":{}},\"comment\":{}}],[\"uploadimage\",{\"_index\":9,\"name\":{\"9\":{},\"17\":{},\"25\":{}},\"comment\":{}}],[\"uploadimages\",{\"_index\":10,\"name\":{\"10\":{},\"18\":{},\"26\":{}},\"comment\":{}}],[\"uploadjson\",{\"_index\":11,\"name\":{\"11\":{},\"19\":{},\"27\":{}},\"comment\":{}}],[\"uploadjsonbulk\",{\"_index\":12,\"name\":{\"12\":{},\"20\":{},\"28\":{}},\"comment\":{}}],[\"uuid\",{\"_index\":166,\"name\":{\"398\":{}},\"comment\":{}}]],\"pipeline\":[]}}");


================================================
FILE: docs/assets/style.css
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/assets/style.css
================================================
:root {
    /* Light */
    --light-color-background: #f2f4f8;
    --light-color-background-secondary: #eff0f1;
    --light-color-warning-text: #222;
    --light-color-background-warning: #e6e600;
    --light-color-icon-background: var(--light-color-background);
    --light-color-accent: #c5c7c9;
    --light-color-active-menu-item: var(--light-color-accent);
    --light-color-text: #222;
    --light-color-text-aside: #6e6e6e;
    --light-color-link: #1f70c2;

    --light-color-ts-project: #b111c9;
    --light-color-ts-module: var(--light-color-ts-project);
    --light-color-ts-namespace: var(--light-color-ts-project);
    --light-color-ts-enum: #7e6f15;
    --light-color-ts-enum-member: var(--light-color-ts-enum);
    --light-color-ts-variable: #4760ec;
    --light-color-ts-function: #572be7;
    --light-color-ts-class: #1f70c2;
    --light-color-ts-interface: #108024;
    --light-color-ts-constructor: var(--light-color-ts-class);
    --light-color-ts-property: var(--light-color-ts-variable);
    --light-color-ts-method: var(--light-color-ts-function);
    --light-color-ts-call-signature: var(--light-color-ts-method);
    --light-color-ts-index-signature: var(--light-color-ts-property);
    --light-color-ts-constructor-signature: var(--light-color-ts-constructor);
    --light-color-ts-parameter: var(--light-color-ts-variable);
    /* type literal not included as links will never be generated to it */
    --light-color-ts-type-parameter: var(--light-color-ts-type-alias);
    --light-color-ts-accessor: var(--light-color-ts-property);
    --light-color-ts-get-signature: var(--light-color-ts-accessor);
    --light-color-ts-set-signature: var(--light-color-ts-accessor);
    /* object literal not included as it is not used and will be removed in 0.25 */
    --light-color-ts-type-alias: #d51270;
    /* reference not included as links will be colored with the kind that it points to */

    --light-external-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='10' height='10'><path fill-opacity='0' stroke='%23000' stroke-width='10' d='m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z'/></svg>");
    --light-color-scheme: light;

    /* Dark */
    --dark-color-background: #2b2e33;
    --dark-color-background-secondary: #1e2024;
    --dark-color-background-warning: #bebe00;
    --dark-color-warning-text: #222;
    --dark-color-icon-background: var(--dark-color-background-secondary);
    --dark-color-accent: #9096a2;
    --dark-color-active-menu-item: #5d5d6a;
    --dark-color-text: #f5f5f5;
    --dark-color-text-aside: #dddddd;
    --dark-color-link: #00aff4;

    --dark-color-ts-project: #e358ff;
    --dark-color-ts-module: var(--dark-color-ts-project);
    --dark-color-ts-namespace: var(--dark-color-ts-project);
    --dark-color-ts-enum: #f4d93e;
    --dark-color-ts-enum-member: var(--dark-color-ts-enum);
    --dark-color-ts-variable: #798dff;
    --dark-color-ts-function: #a280ff;
    --dark-color-ts-class: #8ac4ff;
    --dark-color-ts-interface: #6cff87;
    --dark-color-ts-constructor: var(--dark-color-ts-class);
    --dark-color-ts-property: var(--dark-color-ts-variable);
    --dark-color-ts-method: var(--dark-color-ts-function);
    --dark-color-ts-call-signature: var(--dark-color-ts-method);
    --dark-color-ts-index-signature: var(--dark-color-ts-property);
    --dark-color-ts-constructor-signature: var(--dark-color-ts-constructor);
    --dark-color-ts-parameter: var(--dark-color-ts-variable);
    /* type literal not included as links will never be generated to it */
    --dark-color-ts-type-parameter: var(--dark-color-ts-type-alias);
    --dark-color-ts-accessor: var(--dark-color-ts-property);
    --dark-color-ts-get-signature: var(--dark-color-ts-accessor);
    --dark-color-ts-set-signature: var(--dark-color-ts-accessor);
    /* object literal not included as it is not used and will be removed in 0.25 */
    --dark-color-ts-type-alias: #ff6492;
    /* reference not included as links will be colored with the kind that it points to */

    --dark-external-icon: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='10' height='10'><path fill-opacity='0' stroke='%23fff' stroke-width='10' d='m43,35H5v60h60V57M45,5v10l10,10-30,30 20,20 30-30 10,10h10V5z'/></svg>");
    --dark-color-scheme: dark;
}

@media (prefers-color-scheme: light) {
    :root {
        --color-background: var(--light-color-background);
        --color-background-secondary: var(--light-color-background-secondary);
        --color-background-warning: var(--light-color-background-warning);
        --color-warning-text: var(--light-color-warning-text);
        --color-icon-background: var(--light-color-icon-background);
        --color-accent: var(--light-color-accent);
        --color-active-menu-item: var(--light-color-active-menu-item);
        --color-text: var(--light-color-text);
        --color-text-aside: var(--light-color-text-aside);
        --color-link: var(--light-color-link);

        --color-ts-module: var(--light-color-ts-module);
        --color-ts-namespace: var(--light-color-ts-namespace);
        --color-ts-enum: var(--light-color-ts-enum);
        --color-ts-enum-member: var(--light-color-ts-enum-member);
        --color-ts-variable: var(--light-color-ts-variable);
        --color-ts-function: var(--light-color-ts-function);
        --color-ts-class: var(--light-color-ts-class);
        --color-ts-interface: var(--light-color-ts-interface);
        --color-ts-constructor: var(--light-color-ts-constructor);
        --color-ts-property: var(--light-color-ts-property);
        --color-ts-method: var(--light-color-ts-method);
        --color-ts-call-signature: var(--light-color-ts-call-signature);
        --color-ts-index-signature: var(--light-color-ts-index-signature);
        --color-ts-constructor-signature: var(
            --light-color-ts-constructor-signature
        );
        --color-ts-parameter: var(--light-color-ts-parameter);
        --color-ts-type-parameter: var(--light-color-ts-type-parameter);
        --color-ts-accessor: var(--light-color-ts-accessor);
        --color-ts-get-signature: var(--light-color-ts-get-signature);
        --color-ts-set-signature: var(--light-color-ts-set-signature);
        --color-ts-type-alias: var(--light-color-ts-type-alias);

        --external-icon: var(--light-external-icon);
        --color-scheme: var(--light-color-scheme);
    }
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-background: var(--dark-color-background);
        --color-background-secondary: var(--dark-color-background-secondary);
        --color-background-warning: var(--dark-color-background-warning);
        --color-warning-text: var(--dark-color-warning-text);
        --color-icon-background: var(--dark-color-icon-background);
        --color-accent: var(--dark-color-accent);
        --color-active-menu-item: var(--dark-color-active-menu-item);
        --color-text: var(--dark-color-text);
        --color-text-aside: var(--dark-color-text-aside);
        --color-link: var(--dark-color-link);

        --color-ts-module: var(--dark-color-ts-module);
        --color-ts-namespace: var(--dark-color-ts-namespace);
        --color-ts-enum: var(--dark-color-ts-enum);
        --color-ts-enum-member: var(--dark-color-ts-enum-member);
        --color-ts-variable: var(--dark-color-ts-variable);
        --color-ts-function: var(--dark-color-ts-function);
        --color-ts-class: var(--dark-color-ts-class);
        --color-ts-interface: var(--dark-color-ts-interface);
        --color-ts-constructor: var(--dark-color-ts-constructor);
        --color-ts-property: var(--dark-color-ts-property);
        --color-ts-method: var(--dark-color-ts-method);
        --color-ts-call-signature: var(--dark-color-ts-call-signature);
        --color-ts-index-signature: var(--dark-color-ts-index-signature);
        --color-ts-constructor-signature: var(
            --dark-color-ts-constructor-signature
        );
        --color-ts-parameter: var(--dark-color-ts-parameter);
        --color-ts-type-parameter: var(--dark-color-ts-type-parameter);
        --color-ts-accessor: var(--dark-color-ts-accessor);
        --color-ts-get-signature: var(--dark-color-ts-get-signature);
        --color-ts-set-signature: var(--dark-color-ts-set-signature);
        --color-ts-type-alias: var(--dark-color-ts-type-alias);

        --external-icon: var(--dark-external-icon);
        --color-scheme: var(--dark-color-scheme);
    }
}

html {
    color-scheme: var(--color-scheme);
}

body {
    margin: 0;
}

:root[data-theme="light"] {
    --color-background: var(--light-color-background);
    --color-background-secondary: var(--light-color-background-secondary);
    --color-background-warning: var(--light-color-background-warning);
    --color-warning-text: var(--light-color-warning-text);
    --color-icon-background: var(--light-color-icon-background);
    --color-accent: var(--light-color-accent);
    --color-active-menu-item: var(--light-color-active-menu-item);
    --color-text: var(--light-color-text);
    --color-text-aside: var(--light-color-text-aside);
    --color-link: var(--light-color-link);

    --color-ts-module: var(--light-color-ts-module);
    --color-ts-namespace: var(--light-color-ts-namespace);
    --color-ts-enum: var(--light-color-ts-enum);
    --color-ts-enum-member: var(--light-color-ts-enum-member);
    --color-ts-variable: var(--light-color-ts-variable);
    --color-ts-function: var(--light-color-ts-function);
    --color-ts-class: var(--light-color-ts-class);
    --color-ts-interface: var(--light-color-ts-interface);
    --color-ts-constructor: var(--light-color-ts-constructor);
    --color-ts-property: var(--light-color-ts-property);
    --color-ts-method: var(--light-color-ts-method);
    --color-ts-call-signature: var(--light-color-ts-call-signature);
    --color-ts-index-signature: var(--light-color-ts-index-signature);
    --color-ts-constructor-signature: var(
        --light-color-ts-constructor-signature
    );
    --color-ts-parameter: var(--light-color-ts-parameter);
    --color-ts-type-parameter: var(--light-color-ts-type-parameter);
    --color-ts-accessor: var(--light-color-ts-accessor);
    --color-ts-get-signature: var(--light-color-ts-get-signature);
    --color-ts-set-signature: var(--light-color-ts-set-signature);
    --color-ts-type-alias: var(--light-color-ts-type-alias);

    --external-icon: var(--light-external-icon);
    --color-scheme: var(--light-color-scheme);
}

:root[data-theme="dark"] {
    --color-background: var(--dark-color-background);
    --color-background-secondary: var(--dark-color-background-secondary);
    --color-background-warning: var(--dark-color-background-warning);
    --color-warning-text: var(--dark-color-warning-text);
    --color-icon-background: var(--dark-color-icon-background);
    --color-accent: var(--dark-color-accent);
    --color-active-menu-item: var(--dark-color-active-menu-item);
    --color-text: var(--dark-color-text);
    --color-text-aside: var(--dark-color-text-aside);
    --color-link: var(--dark-color-link);

    --color-ts-module: var(--dark-color-ts-module);
    --color-ts-namespace: var(--dark-color-ts-namespace);
    --color-ts-enum: var(--dark-color-ts-enum);
    --color-ts-enum-member: var(--dark-color-ts-enum-member);
    --color-ts-variable: var(--dark-color-ts-variable);
    --color-ts-function: var(--dark-color-ts-function);
    --color-ts-class: var(--dark-color-ts-class);
    --color-ts-interface: var(--dark-color-ts-interface);
    --color-ts-constructor: var(--dark-color-ts-constructor);
    --color-ts-property: var(--dark-color-ts-property);
    --color-ts-method: var(--dark-color-ts-method);
    --color-ts-call-signature: var(--dark-color-ts-call-signature);
    --color-ts-index-signature: var(--dark-color-ts-index-signature);
    --color-ts-constructor-signature: var(
        --dark-color-ts-constructor-signature
    );
    --color-ts-parameter: var(--dark-color-ts-parameter);
    --color-ts-type-parameter: var(--dark-color-ts-type-parameter);
    --color-ts-accessor: var(--dark-color-ts-accessor);
    --color-ts-get-signature: var(--dark-color-ts-get-signature);
    --color-ts-set-signature: var(--dark-color-ts-set-signature);
    --color-ts-type-alias: var(--dark-color-ts-type-alias);

    --external-icon: var(--dark-external-icon);
    --color-scheme: var(--dark-color-scheme);
}

.always-visible,
.always-visible .tsd-signatures {
    display: inherit !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    line-height: 1.2;
}

h1 > a,
h2 > a,
h3 > a,
h4 > a,
h5 > a,
h6 > a {
    text-decoration: none;
    color: var(--color-text);
}

h1 {
    font-size: 1.875rem;
    margin: 0.67rem 0;
}

h2 {
    font-size: 1.5rem;
    margin: 0.83rem 0;
}

h3 {
    font-size: 1.25rem;
    margin: 1rem 0;
}

h4 {
    font-size: 1.05rem;
    margin: 1.33rem 0;
}

h5 {
    font-size: 1rem;
    margin: 1.5rem 0;
}

h6 {
    font-size: 0.875rem;
    margin: 2.33rem 0;
}

.uppercase {
    text-transform: uppercase;
}

dl,
menu,
ol,
ul {
    margin: 1em 0;
}

dd {
    margin: 0 0 0 40px;
}

.container {
    max-width: 1700px;
    padding: 0 2rem;
}

/* Footer */
.tsd-generator {
    border-top: 1px solid var(--color-accent);
    padding-top: 1rem;
    padding-bottom: 1rem;
    max-height: 3.5rem;
}

.tsd-generator > p {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0 1rem;
}

.container-main {
    margin: 0 auto;
    /* toolbar, footer, margin */
    min-height: calc(100vh - 41px - 56px - 4rem);
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        opacity: 1;
        visibility: visible;
    }
    to {
        opacity: 0;
    }
}
@keyframes fade-in-delayed {
    0% {
        opacity: 0;
    }
    33% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes fade-out-delayed {
    0% {
        opacity: 1;
        visibility: visible;
    }
    66% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
}
@keyframes pop-in-from-right {
    from {
        transform: translate(100%, 0);
    }
    to {
        transform: translate(0, 0);
    }
}
@keyframes pop-out-to-right {
    from {
        transform: translate(0, 0);
        visibility: visible;
    }
    to {
        transform: translate(100%, 0);
    }
}
body {
    background: var(--color-background);
    font-family: "Segoe UI", sans-serif;
    font-size: 16px;
    color: var(--color-text);
}

a {
    color: var(--color-link);
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
a.external[target="_blank"] {
    background-image: var(--external-icon);
    background-position: top 3px right;
    background-repeat: no-repeat;
    padding-right: 13px;
}

code,
pre {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    padding: 0.2em;
    margin: 0;
    font-size: 0.875rem;
    border-radius: 0.8em;
}

pre {
    position: relative;
    white-space: pre;
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: 10px;
    border: 1px solid var(--color-accent);
}
pre code {
    padding: 0;
    font-size: 100%;
}
pre > button {
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    transition: opacity 0.1s;
    box-sizing: border-box;
}
pre:hover > button,
pre > button.visible {
    opacity: 1;
}

blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid gray;
}

.tsd-typography {
    line-height: 1.333em;
}
.tsd-typography ul {
    list-style: square;
    padding: 0 0 0 20px;
    margin: 0;
}
.tsd-typography h4,
.tsd-typography .tsd-index-panel h3,
.tsd-index-panel .tsd-typography h3,
.tsd-typography h5,
.tsd-typography h6 {
    font-size: 1em;
    margin: 0;
}
.tsd-typography h5,
.tsd-typography h6 {
    font-weight: normal;
}
.tsd-typography p,
.tsd-typography ul,
.tsd-typography ol {
    margin: 1em 0;
}

.tsd-breadcrumb {
    margin: 0;
    padding: 0;
    color: var(--color-text-aside);
}
.tsd-breadcrumb a {
    color: var(--color-text-aside);
    text-decoration: none;
}
.tsd-breadcrumb a:hover {
    text-decoration: underline;
}
.tsd-breadcrumb li {
    display: inline;
}
.tsd-breadcrumb li:after {
    content: " / ";
}

.tsd-comment-tags {
    display: flex;
    flex-direction: column;
}
dl.tsd-comment-tag-group {
    display: flex;
    align-items: center;
    overflow: hidden;
    margin: 0.5em 0;
}
dl.tsd-comment-tag-group dt {
    display: flex;
    margin-right: 0.5em;
    font-size: 0.875em;
    font-weight: normal;
}
dl.tsd-comment-tag-group dd {
    margin: 0;
}
code.tsd-tag {
    padding: 0.25em 0.4em;
    border: 0.1em solid var(--color-accent);
    margin-right: 0.25em;
    font-size: 70%;
}
h1 code.tsd-tag:first-of-type {
    margin-left: 0.25em;
}

dl.tsd-comment-tag-group dd:before,
dl.tsd-comment-tag-group dd:after {
    content: " ";
}
dl.tsd-comment-tag-group dd pre,
dl.tsd-comment-tag-group dd:after {
    clear: both;
}
dl.tsd-comment-tag-group p {
    margin: 0;
}

.tsd-panel.tsd-comment .lead {
    font-size: 1.1em;
    line-height: 1.333em;
    margin-bottom: 2em;
}
.tsd-panel.tsd-comment .lead:last-child {
    margin-bottom: 0;
}

.tsd-filter-visibility h4 {
    font-size: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.5rem;
    margin: 0;
}
.tsd-filter-item:not(:last-child) {
    margin-bottom: 0.5rem;
}
.tsd-filter-input {
    display: flex;
    width: fit-content;
    width: -moz-fit-content;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
}
.tsd-filter-input input[type="checkbox"] {
    cursor: pointer;
    position: absolute;
    width: 1.5em;
    height: 1.5em;
    opacity: 0;
}
.tsd-filter-input input[type="checkbox"]:disabled {
    pointer-events: none;
}
.tsd-filter-input svg {
    cursor: pointer;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.5em;
    border-radius: 0.33em;
    /* Leaving this at full opacity breaks event listeners on Firefox.
    Don't remove unless you know what you're doing. */
    opacity: 0.99;
}
.tsd-filter-input input[type="checkbox"]:focus + svg {
    transform: scale(0.95);
}
.tsd-filter-input input[type="checkbox"]:focus:not(:focus-visible) + svg {
    transform: scale(1);
}
.tsd-checkbox-background {
    fill: var(--color-accent);
}
input[type="checkbox"]:checked ~ svg .tsd-checkbox-checkmark {
    stroke: var(--color-text);
}
.tsd-filter-input input:disabled ~ svg > .tsd-checkbox-background {
    fill: var(--color-background);
    stroke: var(--color-accent);
    stroke-width: 0.25rem;
}
.tsd-filter-input input:disabled ~ svg > .tsd-checkbox-checkmark {
    stroke: var(--color-accent);
}

.tsd-theme-toggle {
    padding-top: 0.75rem;
}
.tsd-theme-toggle > h4 {
    display: inline;
    vertical-align: middle;
    margin-right: 0.75rem;
}

.tsd-hierarchy {
    list-style: square;
    margin: 0;
}
.tsd-hierarchy .target {
    font-weight: bold;
}

.tsd-panel-group.tsd-index-group {
    margin-bottom: 0;
}
.tsd-index-panel .tsd-index-list {
    list-style: none;
    line-height: 1.333em;
    margin: 0;
    padding: 0.25rem 0 0 0;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    grid-template-rows: auto;
}
@media (max-width: 1024px) {
    .tsd-index-panel .tsd-index-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 768px) {
    .tsd-index-panel .tsd-index-list {
        grid-template-columns: repeat(1, 1fr);
    }
}
.tsd-index-panel .tsd-index-list li {
    -webkit-page-break-inside: avoid;
    -moz-page-break-inside: avoid;
    -ms-page-break-inside: avoid;
    -o-page-break-inside: avoid;
    page-break-inside: avoid;
}

.tsd-flag {
    display: inline-block;
    padding: 0.25em 0.4em;
    border-radius: 4px;
    color: var(--color-comment-tag-text);
    background-color: var(--color-comment-tag);
    text-indent: 0;
    font-size: 75%;
    line-height: 1;
    font-weight: normal;
}

.tsd-anchor {
    position: relative;
    top: -100px;
}

.tsd-member {
    position: relative;
}
.tsd-member .tsd-anchor + h3 {
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: none;
}

.tsd-navigation.settings {
    margin: 1rem 0;
}
.tsd-navigation > a,
.tsd-navigation .tsd-accordion-summary {
    width: calc(100% - 0.5rem);
}
.tsd-navigation a,
.tsd-navigation summary > span,
.tsd-page-navigation a {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem;
    color: var(--color-text);
    text-decoration: none;
    box-sizing: border-box;
}
.tsd-navigation a.current,
.tsd-page-navigation a.current {
    background: var(--color-active-menu-item);
}
.tsd-navigation a:hover,
.tsd-page-navigation a:hover {
    text-decoration: underline;
}
.tsd-navigation ul,
.tsd-page-navigation ul {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
    list-style: none;
}
.tsd-navigation li,
.tsd-page-navigation li {
    padding: 0;
    max-width: 100%;
}
.tsd-nested-navigation {
    margin-left: 3rem;
}
.tsd-nested-navigation > li > details {
    margin-left: -1.5rem;
}
.tsd-small-nested-navigation {
    margin-left: 1.5rem;
}
.tsd-small-nested-navigation > li > details {
    margin-left: -1.5rem;
}

.tsd-nested-navigation > li > a,
.tsd-nested-navigation > li > span {
    width: calc(100% - 1.75rem - 0.5rem);
}

.tsd-page-navigation ul {
    padding-left: 1.75rem;
}

#tsd-sidebar-links a {
    margin-top: 0;
    margin-bottom: 0.5rem;
    line-height: 1.25rem;
}
#tsd-sidebar-links a:last-of-type {
    margin-bottom: 0;
}

a.tsd-index-link {
    padding: 0.25rem 0 !important;
    font-size: 1rem;
    line-height: 1.25rem;
    display: inline-flex;
    align-items: center;
    color: var(--color-text);
}
.tsd-accordion-summary {
    list-style-type: none;
    display: flex;
    align-items: center;
}
.tsd-accordion-summary,
.tsd-accordion-summary a {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    cursor: pointer;
}
.tsd-accordion-summary a {
    flex-grow: 1;
}
.tsd-accordion-summary > * {
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
}
.tsd-index-accordion .tsd-accordion-summary > svg {
    margin-left: 0.25rem;
}
.tsd-index-content > :not(:first-child) {
    margin-top: 0.75rem;
}
.tsd-index-heading {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.tsd-kind-icon {
    margin-right: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
    min-height: 1.25rem;
}
.tsd-kind-icon path {
    transform-origin: center;
    transform: scale(1.1);
}
.tsd-signature > .tsd-kind-icon {
    margin-right: 0.8rem;
}

.tsd-panel {
    margin-bottom: 2.5rem;
}
.tsd-panel.tsd-member {
    margin-bottom: 4rem;
}
.tsd-panel:empty {
    display: none;
}
.tsd-panel > h1,
.tsd-panel > h2,
.tsd-panel > h3 {
    margin: 1.5rem -1.5rem 0.75rem -1.5rem;
    padding: 0 1.5rem 0.75rem 1.5rem;
}
.tsd-panel > h1.tsd-before-signature,
.tsd-panel > h2.tsd-before-signature,
.tsd-panel > h3.tsd-before-signature {
    margin-bottom: 0;
    border-bottom: none;
}

.tsd-panel-group {
    margin: 4rem 0;
}
.tsd-panel-group.tsd-index-group {
    margin: 2rem 0;
}
.tsd-panel-group.tsd-index-group details {
    margin: 2rem 0;
}

#tsd-search {
    transition: background-color 0.2s;
}
#tsd-search .title {
    position: relative;
    z-index: 2;
}
#tsd-search .field {
    position: absolute;
    left: 0;
    top: 0;
    right: 2.5rem;
    height: 100%;
}
#tsd-search .field input {
    box-sizing: border-box;
    position: relative;
    top: -50px;
    z-index: 1;
    width: 100%;
    padding: 0 10px;
    opacity: 0;
    outline: 0;
    border: 0;
    background: transparent;
    color: var(--color-text);
}
#tsd-search .field label {
    position: absolute;
    overflow: hidden;
    right: -40px;
}
#tsd-search .field input,
#tsd-search .title,
#tsd-toolbar-links a {
    transition: opacity 0.2s;
}
#tsd-search .results {
    position: absolute;
    visibility: hidden;
    top: 40px;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
}
#tsd-search .results li {
    padding: 0 10px;
    background-color: var(--color-background);
}
#tsd-search .results li:nth-child(even) {
    background-color: var(--color-background-secondary);
}
#tsd-search .results li.state {
    display: none;
}
#tsd-search .results li.current,
#tsd-search .results li:hover {
    background-color: var(--color-accent);
}
#tsd-search .results a {
    display: block;
}
#tsd-search .results a:before {
    top: 10px;
}
#tsd-search .results span.parent {
    color: var(--color-text-aside);
    font-weight: normal;
}
#tsd-search.has-focus {
    background-color: var(--color-accent);
}
#tsd-search.has-focus .field input {
    top: 0;
    opacity: 1;
}
#tsd-search.has-focus .title,
#tsd-search.has-focus #tsd-toolbar-links a {
    z-index: 0;
    opacity: 0;
}
#tsd-search.has-focus .results {
    visibility: visible;
}
#tsd-search.loading .results li.state.loading {
    display: block;
}
#tsd-search.failure .results li.state.failure {
    display: block;
}

#tsd-toolbar-links {
    position: absolute;
    top: 0;
    right: 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
#tsd-toolbar-links a {
    margin-left: 1.5rem;
}
#tsd-toolbar-links a:hover {
    text-decoration: underline;
}

.tsd-signature {
    margin: 0 0 1rem 0;
    padding: 1rem 0.5rem;
    border: 1px solid var(--color-accent);
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 14px;
    overflow-x: auto;
}

.tsd-signature-symbol {
    color: var(--color-text-aside);
    font-weight: normal;
}

.tsd-signature-type {
    font-style: italic;
    font-weight: normal;
}

.tsd-signatures {
    padding: 0;
    margin: 0 0 1em 0;
    list-style-type: none;
}
.tsd-signatures .tsd-signature {
    margin: 0;
    border-color: var(--color-accent);
    border-width: 1px 0;
    transition: background-color 0.1s;
}
.tsd-description .tsd-signatures .tsd-signature {
    border-width: 1px;
}

ul.tsd-parameter-list,
ul.tsd-type-parameter-list {
    list-style: square;
    margin: 0;
    padding-left: 20px;
}
ul.tsd-parameter-list > li.tsd-parameter-signature,
ul.tsd-type-parameter-list > li.tsd-parameter-signature {
    list-style: none;
    margin-left: -20px;
}
ul.tsd-parameter-list h5,
ul.tsd-type-parameter-list h5 {
    font-size: 16px;
    margin: 1em 0 0.5em 0;
}
.tsd-sources {
    margin-top: 1rem;
    font-size: 0.875em;
}
.tsd-sources a {
    color: var(--color-text-aside);
    text-decoration: underline;
}
.tsd-sources ul {
    list-style: none;
    padding: 0;
}

.tsd-page-toolbar {
    position: sticky;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    color: var(--color-text);
    background: var(--color-background-secondary);
    border-bottom: 1px var(--color-accent) solid;
    transition: transform 0.3s ease-in-out;
}
.tsd-page-toolbar a {
    color: var(--color-text);
    text-decoration: none;
}
.tsd-page-toolbar a.title {
    font-weight: bold;
}
.tsd-page-toolbar a.title:hover {
    text-decoration: underline;
}
.tsd-page-toolbar .tsd-toolbar-contents {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    margin: 0 auto;
}
.tsd-page-toolbar .table-cell {
    position: relative;
    white-space: nowrap;
    line-height: 40px;
}
.tsd-page-toolbar .table-cell:first-child {
    width: 100%;
}
.tsd-page-toolbar .tsd-toolbar-icon {
    box-sizing: border-box;
    line-height: 0;
    padding: 12px 0;
}

.tsd-widget {
    display: inline-block;
    overflow: hidden;
    opacity: 0.8;
    height: 40px;
    transition: opacity 0.1s, background-color 0.2s;
    vertical-align: bottom;
    cursor: pointer;
}
.tsd-widget:hover {
    opacity: 0.9;
}
.tsd-widget.active {
    opacity: 1;
    background-color: var(--color-accent);
}
.tsd-widget.no-caption {
    width: 40px;
}
.tsd-widget.no-caption:before {
    margin: 0;
}

.tsd-widget.options,
.tsd-widget.menu {
    display: none;
}
input[type="checkbox"] + .tsd-widget:before {
    background-position: -120px 0;
}
input[type="checkbox"]:checked + .tsd-widget:before {
    background-position: -160px 0;
}

img {
    max-width: 100%;
}

.tsd-anchor-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
    vertical-align: middle;
    color: var(--color-text);
}

.tsd-anchor-icon svg {
    width: 1em;
    height: 1em;
    visibility: hidden;
}

.tsd-anchor-link:hover > .tsd-anchor-icon svg {
    visibility: visible;
}

.deprecated {
    text-decoration: line-through;
}

.warning {
    padding: 1rem;
    color: var(--color-warning-text);
    background: var(--color-background-warning);
}

.tsd-kind-project {
    color: var(--color-ts-project);
}
.tsd-kind-module {
    color: var(--color-ts-module);
}
.tsd-kind-namespace {
    color: var(--color-ts-namespace);
}
.tsd-kind-enum {
    color: var(--color-ts-enum);
}
.tsd-kind-enum-member {
    color: var(--color-ts-enum-member);
}
.tsd-kind-variable {
    color: var(--color-ts-variable);
}
.tsd-kind-function {
    color: var(--color-ts-function);
}
.tsd-kind-class {
    color: var(--color-ts-class);
}
.tsd-kind-interface {
    color: var(--color-ts-interface);
}
.tsd-kind-constructor {
    color: var(--color-ts-constructor);
}
.tsd-kind-property {
    color: var(--color-ts-property);
}
.tsd-kind-method {
    color: var(--color-ts-method);
}
.tsd-kind-call-signature {
    color: var(--color-ts-call-signature);
}
.tsd-kind-index-signature {
    color: var(--color-ts-index-signature);
}
.tsd-kind-constructor-signature {
    color: var(--color-ts-constructor-signature);
}
.tsd-kind-parameter {
    color: var(--color-ts-parameter);
}
.tsd-kind-type-literal {
    color: var(--color-ts-type-literal);
}
.tsd-kind-type-parameter {
    color: var(--color-ts-type-parameter);
}
.tsd-kind-accessor {
    color: var(--color-ts-accessor);
}
.tsd-kind-get-signature {
    color: var(--color-ts-get-signature);
}
.tsd-kind-set-signature {
    color: var(--color-ts-set-signature);
}
.tsd-kind-type-alias {
    color: var(--color-ts-type-alias);
}

/* if we have a kind icon, don't color the text by kind */
.tsd-kind-icon ~ span {
    color: var(--color-text);
}

* {
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent) var(--color-icon-background);
}

*::-webkit-scrollbar {
    width: 0.75rem;
}

*::-webkit-scrollbar-track {
    background: var(--color-icon-background);
}

*::-webkit-scrollbar-thumb {
    background-color: var(--color-accent);
    border-radius: 999rem;
    border: 0.25rem solid var(--color-icon-background);
}

/* mobile */
@media (max-width: 769px) {
    .tsd-widget.options,
    .tsd-widget.menu {
        display: inline-block;
    }

    .container-main {
        display: flex;
    }
    html .col-content {
        float: none;
        max-width: 100%;
        width: 100%;
    }
    html .col-sidebar {
        position: fixed !important;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 1024;
        top: 0 !important;
        bottom: 0 !important;
        left: auto !important;
        right: 0 !important;
        padding: 1.5rem 1.5rem 0 0;
        width: 75vw;
        visibility: hidden;
        background-color: var(--color-background);
        transform: translate(100%, 0);
    }
    html .col-sidebar > *:last-child {
        padding-bottom: 20px;
    }
    html .overlay {
        content: "";
        display: block;
        position: fixed;
        z-index: 1023;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        visibility: hidden;
    }

    .to-has-menu .overlay {
        animation: fade-in 0.4s;
    }

    .to-has-menu .col-sidebar {
        animation: pop-in-from-right 0.4s;
    }

    .from-has-menu .overlay {
        animation: fade-out 0.4s;
    }

    .from-has-menu .col-sidebar {
        animation: pop-out-to-right 0.4s;
    }

    .has-menu body {
        overflow: hidden;
    }
    .has-menu .overlay {
        visibility: visible;
    }
    .has-menu .col-sidebar {
        visibility: visible;
        transform: translate(0, 0);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-height: 100vh;
        padding: 1rem 2rem;
    }
    .has-menu .tsd-navigation {
        max-height: 100%;
    }
}

/* one sidebar */
@media (min-width: 770px) {
    .container-main {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        grid-template-areas: "sidebar content";
        margin: 2rem auto;
    }

    .col-sidebar {
        grid-area: sidebar;
    }
    .col-content {
        grid-area: content;
        padding: 0 1rem;
    }
}
@media (min-width: 770px) and (max-width: 1399px) {
    .col-sidebar {
        max-height: calc(100vh - 2rem - 42px);
        overflow: auto;
        position: sticky;
        top: 42px;
        padding-top: 1rem;
    }
    .site-menu {
        margin-top: 1rem;
    }
}

/* two sidebars */
@media (min-width: 1200px) {
    .container-main {
        grid-template-columns: minmax(0, 1fr) minmax(0, 2.5fr) minmax(0, 20rem);
        grid-template-areas: "sidebar content toc";
    }

    .col-sidebar {
        display: contents;
    }

    .page-menu {
        grid-area: toc;
        padding-left: 1rem;
    }
    .site-menu {
        grid-area: sidebar;
    }

    .site-menu {
        margin-top: 1rem 0;
    }

    .page-menu,
    .site-menu {
        max-height: calc(100vh - 2rem - 42px);
        overflow: auto;
        position: sticky;
        top: 42px;
    }
}



================================================
FILE: docs/classes/AmazonS3.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/AmazonS3.html
================================================
[HTML Document converted to Markdown]

File: AmazonS3.html
Size: 47.41 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

AmazonS3 | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [AmazonS3](AmazonS3.html)

# Class AmazonS3

AmazonS3 is a class that provides utility functions for interacting with Amazon S3.

#### Hierarchy

-   AmazonS3

#### Implements

-   ProviderInterface

-   Defined in [storage/AmazonS3.ts:10](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L10)

##### Index

### Constructors

[constructor](AmazonS3.html#constructor)

### Properties

[bucketName](AmazonS3.html#bucketName) [s3](AmazonS3.html#s3)

### Methods

[uploadBulk](AmazonS3.html#uploadBulk) [uploadImage](AmazonS3.html#uploadImage) [uploadImages](AmazonS3.html#uploadImages) [uploadJson](AmazonS3.html#uploadJson) [uploadJsonBulk](AmazonS3.html#uploadJsonBulk)

## Constructors

### constructor[](#constructor)

-   new AmazonS3(accessKeyId, secretAccessKey, bucketName): [AmazonS3](AmazonS3.html)[](#constructor.new_AmazonS3)
-   Creates an instance of the AmazonS3 class.
    
    #### Parameters
    
    -   ##### accessKeyId: string
        
        The access key ID for your AWS account.
        
    -   ##### secretAccessKey: string
        
        The secret access key for your AWS account.
        
    -   ##### bucketName: string
        
    
    #### Returns [AmazonS3](AmazonS3.html)
    
    -   Defined in [storage/AmazonS3.ts:18](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L18)
    

## Properties

### `Readonly` bucketName[](#bucketName)

bucketName: string

-   Defined in [storage/AmazonS3.ts:21](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L21)

### s3[](#s3)

s3: S3

-   Defined in [storage/AmazonS3.ts:11](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L11)

## Methods

### uploadBulk[](#uploadBulk)

-   uploadBulk(assetsFolderPath): Promise<\[string\[\], string\[\]\]\>[](#uploadBulk.uploadBulk-1)
-   Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
    
    #### Parameters
    
    -   ##### assetsFolderPath: string
        
        The path to the folder containing the image and JSON files.
        
    
    #### Returns Promise<\[string\[\], string\[\]\]\>
    
    A Promise that resolves to an array of two arrays:
    
    -   The first array contains the URLs of the uploaded images on IPFS.
    -   The second array contains the URLs of the uploaded JSON files on IPFS.
    
    Implementation of ProviderInterface.uploadBulk
    
    -   Defined in [storage/AmazonS3.ts:108](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L108)
    

### uploadImage[](#uploadImage)

-   uploadImage(imagePath): Promise<string\>[](#uploadImage.uploadImage-1)
-   Uploads an image file to an S3 bucket.
    
    #### Parameters
    
    -   ##### imagePath: string
        
        The path to the image file to be uploaded.
        
    
    #### Returns Promise<string\>
    
    A Promise that resolves to the URL of the uploaded image.
    
    Implementation of ProviderInterface.uploadImage
    
    -   Defined in [storage/AmazonS3.ts:36](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L36)
    

### uploadImages[](#uploadImages)

-   uploadImages(folderPath): Promise<string\[\]\>[](#uploadImages.uploadImages-1)
-   Uploads multiple image files from a folder to an S3 bucket.
    
    #### Parameters
    
    -   ##### folderPath: string
        
        The path to the folder containing the image files.
        
    
    #### Returns Promise<string\[\]\>
    
    A Promise that resolves to an array of URLs of the uploaded images.
    
    Implementation of ProviderInterface.uploadImages
    
    -   Defined in [storage/AmazonS3.ts:58](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L58)
    

### uploadJson[](#uploadJson)

-   uploadJson(jsonPath): Promise<string\>[](#uploadJson.uploadJson-1)
-   Uploads a JSON file to an S3 bucket.
    
    #### Parameters
    
    -   ##### jsonPath: string
        
        The path to the JSON file to be uploaded.
        
    
    #### Returns Promise<string\>
    
    A Promise that resolves to the URL of the uploaded JSON file.
    
    Implementation of ProviderInterface.uploadJson
    
    -   Defined in [storage/AmazonS3.ts:71](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L71)
    

### uploadJsonBulk[](#uploadJsonBulk)

-   uploadJsonBulk(folderPath): Promise<string\[\]\>[](#uploadJsonBulk.uploadJsonBulk-1)
-   Uploads multiple JSON files from a folder to an S3 bucket.
    
    #### Parameters
    
    -   ##### folderPath: string
        
        The path to the folder containing the JSON files.
        
    
    #### Returns Promise<string\[\]\>
    
    A Promise that resolves to an array of URLs of the uploaded JSON files.
    
    Implementation of ProviderInterface.uploadJsonBulk
    
    -   Defined in [storage/AmazonS3.ts:93](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/AmazonS3.ts#L93)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [bucketName](#bucketName)
-   [s3](#s3)
-   [uploadBulk](#uploadBulk)
-   [uploadImage](#uploadImage)
-   [uploadImages](#uploadImages)
-   [uploadJson](#uploadJson)
-   [uploadJsonBulk](#uploadJsonBulk)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: AmazonS3 | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 107, Images: 0, Headings: 42, Paragraphs: 47



================================================
FILE: docs/classes/NftAuction.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftAuction.html
================================================
[HTML Document converted to Markdown]

File: NftAuction.html
Size: 75.10 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftAuction | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftAuction](NftAuction.html)

# Class NftAuction

Class representing an NFT auction contract.

#### Hierarchy

-   NftAuction

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L6)

##### Index

### Constructors

[constructor](NftAuction.html#constructor)

### Properties

[address](NftAuction.html#address) [init?](NftAuction.html#init) [code](NftAuction.html#code-1)

### Methods

[getSaleData](NftAuction.html#getSaleData) [sendCancel](NftAuction.html#sendCancel) [sendDeploy](NftAuction.html#sendDeploy) [sendEmergencyMessage](NftAuction.html#sendEmergencyMessage) [sendRepeatEndAuction](NftAuction.html#sendRepeatEndAuction) [sendStop](NftAuction.html#sendStop) [buildDataCell](NftAuction.html#buildDataCell) [createFromAddress](NftAuction.html#createFromAddress) [createFromConfig](NftAuction.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftAuction(address, init?): [NftAuction](NftAuction.html)[](#constructor.new_NftAuction)
-   Creates an `NftAuction` instance from an address and initialization data.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        The initialization data.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftAuction](NftAuction.html)
    
    A new `NftAuction` instance.
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L13)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L13)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

The initialization data.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L13)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:15](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L15)

## Methods

### getSaleData[](#getSaleData)

-   getSaleData(provider): Promise<{  
        createdAt: bigint;  
        end: boolean;  
        endTimestamp: bigint;  
        isCanceled: bigint;  
        lastBidAddress: null | Address;  
        lastBidAmount: bigint;  
        lastBidAt: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFeeAddress: null | Address;  
        marketplaceFeeBase: bigint;  
        marketplaceFeeFactor: bigint;  
        maxBid: bigint;  
        minBid: bigint;  
        minStep: bigint;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>[](#getSaleData.getSaleData-1)
-   Retrieves the sale data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        createdAt: bigint;  
        end: boolean;  
        endTimestamp: bigint;  
        isCanceled: bigint;  
        lastBidAddress: null | Address;  
        lastBidAmount: bigint;  
        lastBidAt: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFeeAddress: null | Address;  
        marketplaceFeeBase: bigint;  
        marketplaceFeeFactor: bigint;  
        maxBid: bigint;  
        minBid: bigint;  
        minStep: bigint;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>
    
    The sale data.
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:214](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L214)
    

### sendCancel[](#sendCancel)

-   sendCancel(provider, via, params): Promise<void\>[](#sendCancel.sendCancel-1)
-   Sends a cancel command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the cancel command.
        
    -   ##### params: {  
            value: bigint;  
        }
        
        The parameters for the cancel command.
        
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:127](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L127)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:114](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L114)
    

### sendEmergencyMessage[](#sendEmergencyMessage)

-   sendEmergencyMessage(provider, via, params): Promise<void\>[](#sendEmergencyMessage.sendEmergencyMessage-1)
-   Sends an emergency message to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the emergency message.
        
    -   ##### params: {  
            coins: bigint;  
            marketplaceAddress: Address;  
            value: bigint;  
        }
        
        The parameters for the emergency message.
        
        -   ##### coins: bigint
            
        -   ##### marketplaceAddress: Address
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:184](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L184)
    

### sendRepeatEndAuction[](#sendRepeatEndAuction)

-   sendRepeatEndAuction(provider, via, params): Promise<void\>[](#sendRepeatEndAuction.sendRepeatEndAuction-1)
-   Sends a repeat end auction command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the repeat end auction command.
        
    -   ##### params: {  
            value: bigint;  
        }
        
        The parameters for the repeat end auction command.
        
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:165](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L165)
    

### sendStop[](#sendStop)

-   sendStop(provider, via, params): Promise<void\>[](#sendStop.sendStop-1)
-   Sends a stop command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the stop command.
        
    -   ##### params: {  
            value: bigint;  
        }
        
        The parameters for the stop command.
        
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:146](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L146)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for the auction contract.
    
    #### Parameters
    
    -   ##### data: [NftAuctionData](../types/NftAuctionData.html)
        
        The data for building the data cell.
        
    
    #### Returns Cell
    
    The built data cell.
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:22](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L22)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftAuction](NftAuction.html)[](#createFromAddress.createFromAddress-1)
-   Creates an `NftAuction` instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftAuction](NftAuction.html)
    
    A new `NftAuction` instance.
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:71](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L71)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftAuction](NftAuction.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an `NftAuction` instance from configuration data.
    
    #### Parameters
    
    -   ##### config: [NftAuctionData](../types/NftAuctionData.html)
        
        The configuration data for creating the instance.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default: 0).
        
    
    #### Returns Promise<[NftAuction](NftAuction.html)\>
    
    A new `NftAuction` instance.
    
    -   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:85](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L85)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSaleData](#getSaleData)
-   [sendCancel](#sendCancel)
-   [sendDeploy](#sendDeploy)
-   [sendEmergencyMessage](#sendEmergencyMessage)
-   [sendRepeatEndAuction](#sendRepeatEndAuction)
-   [sendStop](#sendStop)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftAuction | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 137, Images: 0, Headings: 80, Paragraphs: 65



================================================
FILE: docs/classes/NftAuctionV2.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftAuctionV2.html
================================================
[HTML Document converted to Markdown]

File: NftAuctionV2.html
Size: 66.63 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftAuctionV2 | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftAuctionV2](NftAuctionV2.html)

# Class NftAuctionV2

Class representing an NFT auction contract version 2.

#### Hierarchy

-   NftAuctionV2

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L6)

##### Index

### Constructors

[constructor](NftAuctionV2.html#constructor)

### Properties

[address](NftAuctionV2.html#address) [init?](NftAuctionV2.html#init) [code](NftAuctionV2.html#code-1)

### Methods

[getSaleData](NftAuctionV2.html#getSaleData) [sendCancel](NftAuctionV2.html#sendCancel) [sendDeploy](NftAuctionV2.html#sendDeploy) [sendStop](NftAuctionV2.html#sendStop) [buildDataCell](NftAuctionV2.html#buildDataCell) [createFromAddress](NftAuctionV2.html#createFromAddress) [createFromConfig](NftAuctionV2.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftAuctionV2(address, init?): [NftAuctionV2](NftAuctionV2.html)[](#constructor.new_NftAuctionV2)
-   Creates an `NftAuctionV2` instance from an address and initialization data.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        The initialization data.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftAuctionV2](NftAuctionV2.html)
    
    A new `NftAuctionV2` instance.
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L13)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L13)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

The initialization data.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L13)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:15](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L15)

## Methods

### getSaleData[](#getSaleData)

-   getSaleData(provider): Promise<{  
        createdAt: bigint;  
        end: bigint;  
        endTimestamp: bigint;  
        isCanceled: bigint;  
        lastBidAddress: null | Address;  
        lastBidAmount: bigint;  
        lastBidAt: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFeeAddress: null | Address;  
        marketplaceFeeBase: bigint;  
        marketplaceFeeFactor: bigint;  
        maxBid: bigint;  
        minBid: bigint;  
        minStep: bigint;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>[](#getSaleData.getSaleData-1)
-   Retrieves the sale data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        createdAt: bigint;  
        end: bigint;  
        endTimestamp: bigint;  
        isCanceled: bigint;  
        lastBidAddress: null | Address;  
        lastBidAmount: bigint;  
        lastBidAt: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFeeAddress: null | Address;  
        marketplaceFeeBase: bigint;  
        marketplaceFeeFactor: bigint;  
        maxBid: bigint;  
        minBid: bigint;  
        minStep: bigint;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>
    
    The sale data.
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:160](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L160)
    

### sendCancel[](#sendCancel)

-   sendCancel(provider, via, params): Promise<void\>[](#sendCancel.sendCancel-1)
-   Sends a cancel command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the cancel command.
        
    -   ##### params: {  
            value: bigint;  
        }
        
        The parameters for the cancel command.
        
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:123](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L123)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:110](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L110)
    

### sendStop[](#sendStop)

-   sendStop(provider, via, params): Promise<void\>[](#sendStop.sendStop-1)
-   Sends a stop command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the stop command.
        
    -   ##### params: {  
            value: bigint;  
        }
        
        The parameters for the stop command.
        
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:142](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L142)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for the auction contract.
    
    #### Parameters
    
    -   ##### data: [NftAuctionV2Data](../types/NftAuctionV2Data.html)
        
        The data for building the data cell.
        
    
    #### Returns Cell
    
    The built data cell.
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:22](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L22)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftAuctionV2](NftAuctionV2.html)[](#createFromAddress.createFromAddress-1)
-   Creates an `NftAuctionV2` instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftAuctionV2](NftAuctionV2.html)
    
    A new `NftAuctionV2` instance.
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:68](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L68)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): [NftAuctionV2](NftAuctionV2.html)[](#createFromConfig.createFromConfig-1)
-   Creates an `NftAuctionV2` instance from configuration data.
    
    #### Parameters
    
    -   ##### config: [NftAuctionV2Data](../types/NftAuctionV2Data.html)
        
        The configuration data for creating the instance.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default: 0).
        
    
    #### Returns [NftAuctionV2](NftAuctionV2.html)
    
    A new `NftAuctionV2` instance.
    
    -   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:82](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L82)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSaleData](#getSaleData)
-   [sendCancel](#sendCancel)
-   [sendDeploy](#sendDeploy)
-   [sendStop](#sendStop)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftAuctionV2 | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 127, Images: 0, Headings: 64, Paragraphs: 57



================================================
FILE: docs/classes/NftCollection.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftCollection.html
================================================
[HTML Document converted to Markdown]

File: NftCollection.html
Size: 86.32 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftCollection | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftCollection](NftCollection.html)

# Class NftCollection

Class representing a Non-Fungible Token (NFT) collection contract. This class extends from the `NftCollectionRoyalty` class.

#### Hierarchy

-   NftCollectionRoyalty
    -   NftCollection

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:33](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L33)

##### Index

### Constructors

[constructor](NftCollection.html#constructor)

### Properties

[address](NftCollection.html#address) [init?](NftCollection.html#init) [code](NftCollection.html#code-1)

### Methods

[getCollectionData](NftCollection.html#getCollectionData) [getNftAddressByIndex](NftCollection.html#getNftAddressByIndex) [getNftContent](NftCollection.html#getNftContent) [getRoyaltyParams](NftCollection.html#getRoyaltyParams) [sendChangeOwner](NftCollection.html#sendChangeOwner) [sendDeploy](NftCollection.html#sendDeploy) [sendGetRoyaltyParams](NftCollection.html#sendGetRoyaltyParams) [sendMint](NftCollection.html#sendMint) [buildDataCell](NftCollection.html#buildDataCell) [createFromAddress](NftCollection.html#createFromAddress) [createFromConfig](NftCollection.html#createFromConfig) [parseMint](NftCollection.html#parseMint) [parseOwnershipTransfer](NftCollection.html#parseOwnershipTransfer)

## Constructors

### constructor[](#constructor)

-   new NftCollection(address, init?): [NftCollection](NftCollection.html)[](#constructor.new_NftCollection)
-   Constructs an instance of the NftCollection contract.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        Optional initialization data for the contract's code and data.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftCollection](NftCollection.html)
    
    Inherited from NftCollectionRoyalty.constructor
    
    -   Defined in [wrappers/standard/NftCollection.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L13)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Inherited from NftCollectionRoyalty.address

-   Defined in [wrappers/standard/NftCollection.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L13)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

Optional initialization data for the contract's code and data.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Inherited from NftCollectionRoyalty.init

-   Defined in [wrappers/standard/NftCollection.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L13)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:34](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L34)

## Methods

### getCollectionData[](#getCollectionData)

-   getCollectionData(provider): Promise<{  
        collectionContent: null | Cell;  
        nextItemIndex: bigint;  
        ownerAddress: null | Address;  
    }\>[](#getCollectionData.getCollectionData-1)
-   Retrieves the collection data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        collectionContent: null | Cell;  
        nextItemIndex: bigint;  
        ownerAddress: null | Address;  
    }\>
    
    An object with the collection data.
    
    Inherited from NftCollectionRoyalty.getCollectionData
    
    -   Defined in [wrappers/standard/NftCollection.ts:33](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L33)
    

### getNftAddressByIndex[](#getNftAddressByIndex)

-   getNftAddressByIndex(provider, index): Promise<{  
        nftAddress: null | Address;  
    }\>[](#getNftAddressByIndex.getNftAddressByIndex-1)
-   Retrieves the NFT address by index from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### index: bigint
        
        The index of the NFT in the collection.
        
    
    #### Returns Promise<{  
        nftAddress: null | Address;  
    }\>
    
    An object with the NFT address.
    
    Inherited from NftCollectionRoyalty.getNftAddressByIndex
    
    -   Defined in [wrappers/standard/NftCollection.ts:50](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L50)
    

### getNftContent[](#getNftContent)

-   getNftContent(provider, index, individualContent): Promise<{  
        fullContent: null | Cell;  
    }\>[](#getNftContent.getNftContent-1)
-   Retrieves the NFT content from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### index: bigint
        
        The index of the NFT in the collection.
        
    -   ##### individualContent: Cell
        
        The individual content of the NFT.
        
    
    #### Returns Promise<{  
        fullContent: null | Cell;  
    }\>
    
    An object with the full NFT content.
    
    Inherited from NftCollectionRoyalty.getNftContent
    
    -   Defined in [wrappers/standard/NftCollection.ts:69](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollection.ts#L69)
    

### getRoyaltyParams[](#getRoyaltyParams)

-   getRoyaltyParams(provider): Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>[](#getRoyaltyParams.getRoyaltyParams-1)
-   Retrieves the royalty parameters of the NFT collection from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>
    
    An object with the royalty parameters.
    
    Inherited from NftCollectionRoyalty.getRoyaltyParams
    
    -   Defined in [wrappers/standard/NftCollectionRoyalty.ts:51](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollectionRoyalty.ts#L51)
    

### sendChangeOwner[](#sendChangeOwner)

-   sendChangeOwner(provider, via, params): Promise<void\>[](#sendChangeOwner.sendChangeOwner-1)
-   Sends a change owner command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the change owner command.
        
    -   ##### params: {  
            newOwner: Address;  
            queryId?: number;  
            value: bigint;  
        }
        
        The parameters for the change owner command.
        
        -   ##### newOwner: Address
            
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:169](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L169)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:120](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L120)
    

### sendGetRoyaltyParams[](#sendGetRoyaltyParams)

-   sendGetRoyaltyParams(provider, via, params): Promise<void\>[](#sendGetRoyaltyParams.sendGetRoyaltyParams-1)
-   Sends a request to get the royalty parameters from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### via: Sender
        
        The Sender initiating the data retrieval.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the data retrieval.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from NftCollectionRoyalty.sendGetRoyaltyParams
    
    -   Defined in [wrappers/standard/NftCollectionRoyalty.ts:28](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftCollectionRoyalty.ts#L28)
    

### sendMint[](#sendMint)

-   sendMint(provider, via, params): Promise<void\>[](#sendMint.sendMint-1)
-   Sends a mint command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the mint command.
        
    -   ##### params: {  
            itemContent: string;  
            itemIndex: number;  
            itemOwnerAddress: Address;  
            passAmount: bigint;  
            queryId?: number;  
            value: bigint;  
        }
        
        The parameters for the mint command.
        
        -   ##### itemContent: string
            
        -   ##### itemIndex: number
            
        -   ##### itemOwnerAddress: Address
            
        -   ##### passAmount: bigint
            
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:133](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L133)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT collection.
    
    #### Parameters
    
    -   ##### data: [NftCollectionData](../types/NftCollectionData.html)
        
        The data for the NFT collection.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT collection.
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:41](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L41)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftCollection](NftCollection.html)[](#createFromAddress.createFromAddress-1)
-   Creates an `NftCollection` instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftCollection](NftCollection.html)
    
    A new `NftCollection` instance.
    
    Overrides NftCollectionRoyalty.createFromAddress
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:77](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L77)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftCollection](NftCollection.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an `NftCollection` instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftCollectionData](../types/NftCollectionData.html)
        
        The configuration data for the NFT collection.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftCollection](NftCollection.html)\>
    
    A new `NftCollection` instance.
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:91](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L91)
    

### `Static` parseMint[](#parseMint)

-   parseMint(tx): undefined | [NftMint](../types/NftMint.html)[](#parseMint.parseMint-1)
-   Parses a mint transaction.
    
    #### Parameters
    
    -   ##### tx: Transaction
        
        The transaction to parse.
        
    
    #### Returns undefined | [NftMint](../types/NftMint.html)
    
    The parsed mint transaction, or undefined if parsing failed.
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:190](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L190)
    

### `Static` parseOwnershipTransfer[](#parseOwnershipTransfer)

-   parseOwnershipTransfer(tx): undefined | [OwnershipTransfer](../types/OwnershipTransfer.html)[](#parseOwnershipTransfer.parseOwnershipTransfer-1)
-   Parses an ownership transfer transaction.
    
    #### Parameters
    
    -   ##### tx: Transaction
        
        The transaction to parse.
        
    
    #### Returns undefined | [OwnershipTransfer](../types/OwnershipTransfer.html)
    
    The parsed ownership transfer transaction, or undefined if parsing failed.
    
    -   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:223](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L223)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getCollectionData](#getCollectionData)
-   [getNftAddressByIndex](#getNftAddressByIndex)
-   [getNftContent](#getNftContent)
-   [getRoyaltyParams](#getRoyaltyParams)
-   [sendChangeOwner](#sendChangeOwner)
-   [sendDeploy](#sendDeploy)
-   [sendGetRoyaltyParams](#sendGetRoyaltyParams)
-   [sendMint](#sendMint)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)
-   [parseMint](#parseMint)
-   [parseOwnershipTransfer](#parseOwnershipTransfer)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftCollection | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 161, Images: 0, Headings: 101, Paragraphs: 85



================================================
FILE: docs/classes/NftFixedPrice.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftFixedPrice.html
================================================
[HTML Document converted to Markdown]

File: NftFixedPrice.html
Size: 54.56 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixedPrice | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixedPrice](NftFixedPrice.html)

# Class NftFixedPrice

Class representing a Non-Fungible Token (NFT) fixed price sale contract.

#### Hierarchy

-   NftFixedPrice

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L6)

##### Index

### Constructors

[constructor](NftFixedPrice.html#constructor)

### Properties

[address](NftFixedPrice.html#address) [init?](NftFixedPrice.html#init) [code](NftFixedPrice.html#code-1)

### Methods

[getSaleData](NftFixedPrice.html#getSaleData) [sendDeploy](NftFixedPrice.html#sendDeploy) [buildDataCell](NftFixedPrice.html#buildDataCell) [createFromAddress](NftFixedPrice.html#createFromAddress) [createFromConfig](NftFixedPrice.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftFixedPrice(address, init?): [NftFixedPrice](NftFixedPrice.html)[](#constructor.new_NftFixedPrice)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftFixedPrice](NftFixedPrice.html)
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L7)
    

## Properties

### `Readonly` address[](#address)

address: Address

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L7)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L7)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L9)

## Methods

### getSaleData[](#getSaleData)

-   getSaleData(provider): Promise<{  
        fullPrice: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>[](#getSaleData.getSaleData-1)
-   Retrieves the sale data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        fullPrice: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>
    
    An object containing the sale data.
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:96](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L96)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:84](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L84)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT fixed price sale.
    
    #### Parameters
    
    -   ##### data: [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
        
        The data for the NFT sale.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT sale.
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:16](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L16)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftFixedPrice](NftFixedPrice.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftFixedPrice instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftFixedPrice](NftFixedPrice.html)
    
    A new NftFixedPrice instance.
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:41](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L41)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftFixedPrice](NftFixedPrice.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftFixedPrice instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
        
        The configuration data for the NFT sale.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftFixedPrice](NftFixedPrice.html)\>
    
    A new NftFixedPrice instance.
    
    -   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:55](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L55)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSaleData](#getSaleData)
-   [sendDeploy](#sendDeploy)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixedPrice | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 117, Images: 0, Headings: 50, Paragraphs: 43



================================================
FILE: docs/classes/NftFixedPriceV2.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftFixedPriceV2.html
================================================
[HTML Document converted to Markdown]

File: NftFixedPriceV2.html
Size: 67.66 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixedPriceV2 | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)

# Class NftFixedPriceV2

Class representing a NFT fixed price sale contract (Version 2).

#### Hierarchy

-   NftFixedPriceV2

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L6)

##### Index

### Constructors

[constructor](NftFixedPriceV2.html#constructor)

### Properties

[address](NftFixedPriceV2.html#address) [init?](NftFixedPriceV2.html#init) [code](NftFixedPriceV2.html#code-1)

### Methods

[getSaleData](NftFixedPriceV2.html#getSaleData) [sendBuy](NftFixedPriceV2.html#sendBuy) [sendCancelSale](NftFixedPriceV2.html#sendCancelSale) [sendCoins](NftFixedPriceV2.html#sendCoins) [sendDeploy](NftFixedPriceV2.html#sendDeploy) [buildDataCell](NftFixedPriceV2.html#buildDataCell) [createFromAddress](NftFixedPriceV2.html#createFromAddress) [createFromConfig](NftFixedPriceV2.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftFixedPriceV2(address, init?): [NftFixedPriceV2](NftFixedPriceV2.html)[](#constructor.new_NftFixedPriceV2)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftFixedPriceV2](NftFixedPriceV2.html)
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L7)
    

## Properties

### `Readonly` address[](#address)

address: Address

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L7)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L7)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L9)

## Methods

### getSaleData[](#getSaleData)

-   getSaleData(provider): Promise<{  
        createdAt: bigint;  
        fullPrice: bigint;  
        isComplete: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>[](#getSaleData.getSaleData-1)
-   Retrieves the sale data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        createdAt: bigint;  
        fullPrice: bigint;  
        isComplete: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>
    
    An object containing the sale data.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:157](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L157)
    

### sendBuy[](#sendBuy)

-   sendBuy(provider, via, params): Promise<void\>[](#sendBuy.sendBuy-1)
-   Sends a command to buy the NFT.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the command.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:139](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L139)
    

### sendCancelSale[](#sendCancelSale)

-   sendCancelSale(provider, via, params): Promise<void\>[](#sendCancelSale.sendCancelSale-1)
-   Sends a command to cancel the sale.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the command.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:119](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L119)
    

### sendCoins[](#sendCoins)

-   sendCoins(provider, via, params): Promise<void\>[](#sendCoins.sendCoins-1)
-   Sends coins to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the coins.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:99](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L99)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:86](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L86)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT fixed price sale.
    
    #### Parameters
    
    -   ##### data: [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
        
        The data for the NFT sale.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT sale.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:16](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L16)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftFixedPriceV2](NftFixedPriceV2.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftFixedPriceV2 instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftFixedPriceV2](NftFixedPriceV2.html)
    
    A new NftFixedPriceV2 instance.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:43](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L43)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftFixedPriceV2](NftFixedPriceV2.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftFixedPriceV2 instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
        
        The configuration data for the NFT sale.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftFixedPriceV2](NftFixedPriceV2.html)\>
    
    A new NftFixedPriceV2 instance.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:57](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L57)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSaleData](#getSaleData)
-   [sendBuy](#sendBuy)
-   [sendCancelSale](#sendCancelSale)
-   [sendCoins](#sendCoins)
-   [sendDeploy](#sendDeploy)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixedPriceV2 | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 132, Images: 0, Headings: 74, Paragraphs: 55



================================================
FILE: docs/classes/NftFixedPriceV3.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftFixedPriceV3.html
================================================
[HTML Document converted to Markdown]

File: NftFixedPriceV3.html
Size: 67.65 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixedPriceV3 | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)

# Class NftFixedPriceV3

Class representing a NFT fixed price sale contract V3

#### Hierarchy

-   NftFixedPriceV3

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L6)

##### Index

### Constructors

[constructor](NftFixedPriceV3.html#constructor)

### Properties

[address](NftFixedPriceV3.html#address) [init?](NftFixedPriceV3.html#init) [code](NftFixedPriceV3.html#code-1)

### Methods

[getSaleData](NftFixedPriceV3.html#getSaleData) [sendBuy](NftFixedPriceV3.html#sendBuy) [sendCancelSale](NftFixedPriceV3.html#sendCancelSale) [sendCoins](NftFixedPriceV3.html#sendCoins) [sendDeploy](NftFixedPriceV3.html#sendDeploy) [buildDataCell](NftFixedPriceV3.html#buildDataCell) [createFromAddress](NftFixedPriceV3.html#createFromAddress) [createFromConfig](NftFixedPriceV3.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftFixedPriceV3(address, init?): [NftFixedPriceV3](NftFixedPriceV3.html)[](#constructor.new_NftFixedPriceV3)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftFixedPriceV3](NftFixedPriceV3.html)
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L7)
    

## Properties

### `Readonly` address[](#address)

address: Address

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L7)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L7)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L9)

## Methods

### getSaleData[](#getSaleData)

-   getSaleData(provider): Promise<{  
        createdAt: bigint;  
        fullPrice: bigint;  
        isComplete: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>[](#getSaleData.getSaleData-1)
-   Retrieves the sale data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        createdAt: bigint;  
        fullPrice: bigint;  
        isComplete: bigint;  
        marketplaceAddress: null | Address;  
        marketplaceFee: bigint;  
        marketplaceFeeAddress: null | Address;  
        nftAddress: null | Address;  
        nftOwnerAddress: null | Address;  
        royaltyAddress: null | Address;  
        royaltyAmount: bigint;  
    }\>
    
    An object containing the sale data.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:155](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L155)
    

### sendBuy[](#sendBuy)

-   sendBuy(provider, via, params): Promise<void\>[](#sendBuy.sendBuy-1)
-   Sends a command to buy the NFT.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the command.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:139](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L139)
    

### sendCancelSale[](#sendCancelSale)

-   sendCancelSale(provider, via, params): Promise<void\>[](#sendCancelSale.sendCancelSale-1)
-   Sends a command to cancel the sale.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the command.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:119](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L119)
    

### sendCoins[](#sendCoins)

-   sendCoins(provider, via, params): Promise<void\>[](#sendCoins.sendCoins-1)
-   Sends coins to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the coins.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:99](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L99)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:86](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L86)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT fixed price sale.
    
    #### Parameters
    
    -   ##### data: [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
        
        The data for the NFT sale.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT sale.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:16](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L16)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftFixedPriceV3](NftFixedPriceV3.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftFixedPriceV3 instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftFixedPriceV3](NftFixedPriceV3.html)
    
    A new NftFixedPriceV3 instance.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:43](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L43)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftFixedPriceV3](NftFixedPriceV3.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftFixedPriceV3 instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
        
        The configuration data for the NFT sale.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftFixedPriceV3](NftFixedPriceV3.html)\>
    
    A new NftFixedPriceV3 instance.
    
    -   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:57](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L57)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSaleData](#getSaleData)
-   [sendBuy](#sendBuy)
-   [sendCancelSale](#sendCancelSale)
-   [sendCoins](#sendCoins)
-   [sendDeploy](#sendDeploy)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixedPriceV3 | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 132, Images: 0, Headings: 74, Paragraphs: 55



================================================
FILE: docs/classes/NftItem.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftItem.html
================================================
[HTML Document converted to Markdown]

File: NftItem.html
Size: 81.83 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftItem | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftItem](NftItem.html)

# Class NftItem

Class representing a Non-Fungible Token (NFT) Item. This class extends the NftItemRoyalty class.

#### Hierarchy

-   [NftItemRoyalty](NftItemRoyalty.html)
    -   NftItem

-   Defined in [wrappers/getgems/NftItem/NftItem.ts:8](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L8)

##### Index

### Constructors

[constructor](NftItem.html#constructor)

### Properties

[address](NftItem.html#address) [init?](NftItem.html#init) [code](NftItem.html#code-1)

### Methods

[getNftData](NftItem.html#getNftData) [getRoyaltyParams](NftItem.html#getRoyaltyParams) [sendDeploy](NftItem.html#sendDeploy) [sendGetRoyaltyParams](NftItem.html#sendGetRoyaltyParams) [sendGetStaticData](NftItem.html#sendGetStaticData) [sendTransfer](NftItem.html#sendTransfer) [sendTransferEditorship](NftItem.html#sendTransferEditorship) [buildDataCell](NftItem.html#buildDataCell) [createFromAddress](NftItem.html#createFromAddress) [createFromConfig](NftItem.html#createFromConfig) [parseTransfer](NftItem.html#parseTransfer)

## Constructors

### constructor[](#constructor)

-   new NftItem(address, init?): [NftItem](NftItem.html)[](#constructor.new_NftItem)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftItem](NftItem.html)
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[constructor](NftItemRoyalty.html#constructor)
    
    -   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)
    

## Properties

### `Readonly` address[](#address)

address: Address

Inherited from [NftItemRoyalty](NftItemRoyalty.html).[address](NftItemRoyalty.html#address)

-   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Inherited from [NftItemRoyalty](NftItemRoyalty.html).[init](NftItemRoyalty.html#init)

-   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftItem/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L9)

## Methods

### getNftData[](#getNftData)

-   getNftData(provider): Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>[](#getNftData.getNftData-1)
-   Retrieves the data of the NFT from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[getNftData](NftItemRoyalty.html#getNftData)
    
    -   Defined in [wrappers/standard/NftItem.ts:71](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L71)
    

### getRoyaltyParams[](#getRoyaltyParams)

-   getRoyaltyParams(provider): Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>[](#getRoyaltyParams.getRoyaltyParams-1)
-   Retrieves the royalty parameters of the NFT from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>
    
    An object with the royalty parameters.
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[getRoyaltyParams](NftItemRoyalty.html#getRoyaltyParams)
    
    -   Defined in [wrappers/standard/NftItemRoyalty.ts:51](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L51)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftItem/NftItem.ts:79](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L79)
    

### sendGetRoyaltyParams[](#sendGetRoyaltyParams)

-   sendGetRoyaltyParams(provider, via, params): Promise<void\>[](#sendGetRoyaltyParams.sendGetRoyaltyParams-1)
-   Sends a request to get the royalty parameters from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### via: Sender
        
        The Sender initiating the data retrieval.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the data retrieval.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[sendGetRoyaltyParams](NftItemRoyalty.html#sendGetRoyaltyParams)
    
    -   Defined in [wrappers/standard/NftItemRoyalty.ts:28](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L28)
    

### sendGetStaticData[](#sendGetStaticData)

-   sendGetStaticData(provider, via, params): Promise<void\>[](#sendGetStaticData.sendGetStaticData-1)
-   Gets static data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### via: Sender
        
        The Sender initiating the data retrieval.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the data retrieval.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[sendGetStaticData](NftItemRoyalty.html#sendGetStaticData)
    
    -   Defined in [wrappers/standard/NftItem.ts:47](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L47)
    

### sendTransfer[](#sendTransfer)

-   sendTransfer(provider, via, params): Promise<void\>[](#sendTransfer.sendTransfer-1)
-   Sends a transfer from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the transfer.
        
    -   ##### via: Sender
        
        The Sender initiating the transfer.
        
    -   ##### params: {  
            customPayload?: Cell;  
            forwardAmount: bigint;  
            forwardPayload?: Cell;  
            newOwner: Address;  
            queryId: bigint;  
            responseDestination?: Address;  
            value: bigint;  
        }
        
        The parameters for the transfer.
        
        -   ##### `Optional` customPayload?: Cell
            
        -   ##### forwardAmount: bigint
            
        -   ##### `Optional` forwardPayload?: Cell
            
        -   ##### newOwner: Address
            
        -   ##### queryId: bigint
            
        -   ##### `Optional` responseDestination?: Address
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[sendTransfer](NftItemRoyalty.html#sendTransfer)
    
    -   Defined in [wrappers/standard/NftItem.ts:17](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L17)
    

### sendTransferEditorship[](#sendTransferEditorship)

-   sendTransferEditorship(provider, via, params): Promise<void\>[](#sendTransferEditorship.sendTransferEditorship-1)
-   Sends a command to transfer editorship of the NFT item.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the command.
        
    -   ##### params: {  
            forwardAmount?: bigint;  
            newEditor: Address;  
            queryId?: number;  
            responseTo: null | Address;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value, queryId, new editor address, response address, and forward amount.
        
        -   ##### `Optional` forwardAmount?: bigint
            
        -   ##### newEditor: Address
            
        -   ##### `Optional` queryId?: number
            
        -   ##### responseTo: null | Address
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftItem/NftItem.ts:92](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L92)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT item.
    
    #### Parameters
    
    -   ##### data: [NftItemData](../types/NftItemData.html)
        
        The data for the NFT item.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT item.
    
    -   Defined in [wrappers/getgems/NftItem/NftItem.ts:16](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L16)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftItem](NftItem.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftItem instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftItem](NftItem.html)
    
    A new NftItem instance.
    
    Overrides [NftItemRoyalty](NftItemRoyalty.html).[createFromAddress](NftItemRoyalty.html#createFromAddress)
    
    -   Defined in [wrappers/getgems/NftItem/NftItem.ts:36](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L36)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftItem](NftItem.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftItem instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftItemData](../types/NftItemData.html)
        
        The configuration data for the NFT item.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftItem](NftItem.html)\>
    
    A new NftItem instance.
    
    -   Defined in [wrappers/getgems/NftItem/NftItem.ts:50](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L50)
    

### `Static` parseTransfer[](#parseTransfer)

-   parseTransfer(tx): undefined | NftTransfer[](#parseTransfer.parseTransfer-1)
-   Parses a transfer transaction.
    
    #### Parameters
    
    -   ##### tx: Transaction
        
        The Transaction to be parsed.
        
    
    #### Returns undefined | NftTransfer
    
    A NftTransfer object if the transaction is valid, undefined otherwise.
    
    Inherited from [NftItemRoyalty](NftItemRoyalty.html).[parseTransfer](NftItemRoyalty.html#parseTransfer)
    
    -   Defined in [wrappers/standard/NftItem.ts:89](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L89)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getNftData](#getNftData)
-   [getRoyaltyParams](#getRoyaltyParams)
-   [sendDeploy](#sendDeploy)
-   [sendGetRoyaltyParams](#sendGetRoyaltyParams)
-   [sendGetStaticData](#sendGetStaticData)
-   [sendTransfer](#sendTransfer)
-   [sendTransferEditorship](#sendTransferEditorship)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)
-   [parseTransfer](#parseTransfer)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftItem | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 168, Images: 0, Headings: 97, Paragraphs: 72



================================================
FILE: docs/classes/NftItemRoyalty.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftItemRoyalty.html
================================================
[HTML Document converted to Markdown]

File: NftItemRoyalty.html
Size: 64.88 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftItemRoyalty | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftItemRoyalty](NftItemRoyalty.html)

# Class NftItemRoyalty

Represents an NFT item contract with royalty features. Inherits from the NftItem class.

#### Hierarchy

-   NftItem
    -   NftItemRoyalty
        -   [NftItem](NftItem.html)

-   Defined in [wrappers/standard/NftItemRoyalty.ts:8](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L8)

##### Index

### Constructors

[constructor](NftItemRoyalty.html#constructor)

### Properties

[address](NftItemRoyalty.html#address) [init?](NftItemRoyalty.html#init)

### Methods

[getNftData](NftItemRoyalty.html#getNftData) [getRoyaltyParams](NftItemRoyalty.html#getRoyaltyParams) [sendGetRoyaltyParams](NftItemRoyalty.html#sendGetRoyaltyParams) [sendGetStaticData](NftItemRoyalty.html#sendGetStaticData) [sendTransfer](NftItemRoyalty.html#sendTransfer) [createFromAddress](NftItemRoyalty.html#createFromAddress) [parseTransfer](NftItemRoyalty.html#parseTransfer)

## Constructors

### constructor[](#constructor)

-   new NftItemRoyalty(address, init?): [NftItemRoyalty](NftItemRoyalty.html)[](#constructor.new_NftItemRoyalty)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftItemRoyalty](NftItemRoyalty.html)
    
    Inherited from NftItem.constructor
    
    -   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)
    

## Properties

### `Readonly` address[](#address)

address: Address

Inherited from NftItem.address

-   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Inherited from NftItem.init

-   Defined in [wrappers/standard/NftItem.ts:9](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L9)

## Methods

### getNftData[](#getNftData)

-   getNftData(provider): Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>[](#getNftData.getNftData-1)
-   Retrieves the data of the NFT from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>
    
    Inherited from NftItem.getNftData
    
    -   Defined in [wrappers/standard/NftItem.ts:71](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L71)
    

### getRoyaltyParams[](#getRoyaltyParams)

-   getRoyaltyParams(provider): Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>[](#getRoyaltyParams.getRoyaltyParams-1)
-   Retrieves the royalty parameters of the NFT from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    
    #### Returns Promise<{  
        denominator: bigint;  
        destination: null | Address;  
        init: boolean;  
        numerator: bigint;  
    }\>
    
    An object with the royalty parameters.
    
    -   Defined in [wrappers/standard/NftItemRoyalty.ts:51](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L51)
    

### sendGetRoyaltyParams[](#sendGetRoyaltyParams)

-   sendGetRoyaltyParams(provider, via, params): Promise<void\>[](#sendGetRoyaltyParams.sendGetRoyaltyParams-1)
-   Sends a request to get the royalty parameters from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### via: Sender
        
        The Sender initiating the data retrieval.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the data retrieval.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/standard/NftItemRoyalty.ts:28](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L28)
    

### sendGetStaticData[](#sendGetStaticData)

-   sendGetStaticData(provider, via, params): Promise<void\>[](#sendGetStaticData.sendGetStaticData-1)
-   Gets static data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the data retrieval.
        
    -   ##### via: Sender
        
        The Sender initiating the data retrieval.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the data retrieval.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from NftItem.sendGetStaticData
    
    -   Defined in [wrappers/standard/NftItem.ts:47](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L47)
    

### sendTransfer[](#sendTransfer)

-   sendTransfer(provider, via, params): Promise<void\>[](#sendTransfer.sendTransfer-1)
-   Sends a transfer from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The ContractProvider to facilitate the transfer.
        
    -   ##### via: Sender
        
        The Sender initiating the transfer.
        
    -   ##### params: {  
            customPayload?: Cell;  
            forwardAmount: bigint;  
            forwardPayload?: Cell;  
            newOwner: Address;  
            queryId: bigint;  
            responseDestination?: Address;  
            value: bigint;  
        }
        
        The parameters for the transfer.
        
        -   ##### `Optional` customPayload?: Cell
            
        -   ##### forwardAmount: bigint
            
        -   ##### `Optional` forwardPayload?: Cell
            
        -   ##### newOwner: Address
            
        -   ##### queryId: bigint
            
        -   ##### `Optional` responseDestination?: Address
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    Inherited from NftItem.sendTransfer
    
    -   Defined in [wrappers/standard/NftItem.ts:17](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L17)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftItemRoyalty](NftItemRoyalty.html)[](#createFromAddress.createFromAddress-1)
-   Constructs an instance of the NftItemRoyalty contract from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    
    #### Returns [NftItemRoyalty](NftItemRoyalty.html)
    
    An instance of NftItemRoyalty.
    
    -   Defined in [wrappers/standard/NftItemRoyalty.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItemRoyalty.ts#L14)
    

### `Static` parseTransfer[](#parseTransfer)

-   parseTransfer(tx): undefined | NftTransfer[](#parseTransfer.parseTransfer-1)
-   Parses a transfer transaction.
    
    #### Parameters
    
    -   ##### tx: Transaction
        
        The Transaction to be parsed.
        
    
    #### Returns undefined | NftTransfer
    
    A NftTransfer object if the transaction is valid, undefined otherwise.
    
    Inherited from NftItem.parseTransfer
    
    -   Defined in [wrappers/standard/NftItem.ts:89](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/standard/NftItem.ts#L89)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [getNftData](#getNftData)
-   [getRoyaltyParams](#getRoyaltyParams)
-   [sendGetRoyaltyParams](#sendGetRoyaltyParams)
-   [sendGetStaticData](#sendGetStaticData)
-   [sendTransfer](#sendTransfer)
-   [createFromAddress](#createFromAddress)
-   [parseTransfer](#parseTransfer)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftItemRoyalty | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 120, Images: 0, Headings: 70, Paragraphs: 54



================================================
FILE: docs/classes/NftMarketplace.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftMarketplace.html
================================================
[HTML Document converted to Markdown]

File: NftMarketplace.html
Size: 52.00 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftMarketplace | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftMarketplace](NftMarketplace.html)

# Class NftMarketplace

Class representing a NFT Marketplace contract.

#### Hierarchy

-   NftMarketplace

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L7)

##### Index

### Constructors

[constructor](NftMarketplace.html#constructor)

### Properties

[address](NftMarketplace.html#address) [init?](NftMarketplace.html#init) [code](NftMarketplace.html#code-1)

### Methods

[sendCoins](NftMarketplace.html#sendCoins) [sendDeploy](NftMarketplace.html#sendDeploy) [buildDataCell](NftMarketplace.html#buildDataCell) [createFromAddress](NftMarketplace.html#createFromAddress) [createFromConfig](NftMarketplace.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftMarketplace(address, init?): [NftMarketplace](NftMarketplace.html)[](#constructor.new_NftMarketplace)
-   Constructs an instance of the NftMarketplace contract.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        The initial code and data for the contract.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftMarketplace](NftMarketplace.html)
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L13)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L13)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

The initial code and data for the contract.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:13](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L13)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:28](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L28)

## Methods

### sendCoins[](#sendCoins)

-   sendCoins(provider, via, params): Promise<void\>[](#sendCoins.sendCoins-1)
-   Sends coins to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the coins.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        Parameters for the operation, including the value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:93](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L93)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:80](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L80)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT marketplace.
    
    #### Parameters
    
    -   ##### data: [NftMarketplaceData](../types/NftMarketplaceData.html)
        
        The data for the NFT marketplace.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT marketplace.
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:35](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L35)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftMarketplace](NftMarketplace.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftMarketplace instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftMarketplace](NftMarketplace.html)
    
    A new NftMarketplace instance.
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:20](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L20)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftMarketplace](NftMarketplace.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftMarketplace instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftMarketplaceData](../types/NftMarketplaceData.html)
        
        The configuration data for the NFT marketplace.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftMarketplace](NftMarketplace.html)\>
    
    A new NftMarketplace instance.
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:51](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L51)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [sendCoins](#sendCoins)
-   [sendDeploy](#sendDeploy)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftMarketplace | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 117, Images: 0, Headings: 54, Paragraphs: 49



================================================
FILE: docs/classes/NftOffer.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftOffer.html
================================================
[HTML Document converted to Markdown]

File: NftOffer.html
Size: 65.54 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftOffer | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftOffer](NftOffer.html)

# Class NftOffer

Class representing a Non-Fungible Token (NFT) Offer contract.

#### Hierarchy

-   NftOffer

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L6)

##### Index

### Constructors

[constructor](NftOffer.html#constructor)

### Properties

[address](NftOffer.html#address) [init?](NftOffer.html#init) [code](NftOffer.html#code-1)

### Methods

[getOfferData](NftOffer.html#getOfferData) [sendCancelOffer](NftOffer.html#sendCancelOffer) [sendCancelOfferByMarketplace](NftOffer.html#sendCancelOfferByMarketplace) [sendDeploy](NftOffer.html#sendDeploy) [buildDataCell](NftOffer.html#buildDataCell) [createFromAddress](NftOffer.html#createFromAddress) [createFromConfig](NftOffer.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftOffer(address, init?): [NftOffer](NftOffer.html)[](#constructor.new_NftOffer)
-   Constructs an instance of the NftOffer contract.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        The initial code and data for the contract.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftOffer](NftOffer.html)
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:12](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L12)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:12](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L12)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

The initial code and data for the contract.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:12](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L12)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L14)

## Methods

### getOfferData[](#getOfferData)

-   getOfferData(provider): Promise<{  
        createdAt: bigint;  
        finishAt: bigint;  
        fullPrice: bigint;  
        isComplete: boolean;  
        marketplaceAddress: Address;  
        marketplaceBase: bigint;  
        marketplaceFactor: bigint;  
        marketplaceFeeAddress: Address;  
        nftAddress: Address;  
        offerOwnerAddress: Address;  
        offerType: bigint;  
        profitPrice: bigint;  
        royaltyAddress: Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>[](#getOfferData.getOfferData-1)
-   Gets the data of the offer.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        createdAt: bigint;  
        finishAt: bigint;  
        fullPrice: bigint;  
        isComplete: boolean;  
        marketplaceAddress: Address;  
        marketplaceBase: bigint;  
        marketplaceFactor: bigint;  
        marketplaceFeeAddress: Address;  
        nftAddress: Address;  
        offerOwnerAddress: Address;  
        offerType: bigint;  
        profitPrice: bigint;  
        royaltyAddress: Address;  
        royaltyBase: bigint;  
        royaltyFactor: bigint;  
    }\>
    
    The current data of the offer.
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:169](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L169)
    

### sendCancelOffer[](#sendCancelOffer)

-   sendCancelOffer(provider, via, params): Promise<void\>[](#sendCancelOffer.sendCancelOffer-1)
-   Sends a cancel offer command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the cancel command.
        
    -   ##### params: {  
            message?: string;  
            value: bigint;  
        }
        
        Parameters for the cancel command including optional message and value.
        
        -   ##### `Optional` message?: string
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:107](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L107)
    

### sendCancelOfferByMarketplace[](#sendCancelOfferByMarketplace)

-   sendCancelOfferByMarketplace(provider, via, params): Promise<void\>[](#sendCancelOfferByMarketplace.sendCancelOfferByMarketplace-1)
-   Sends a cancel offer command to the contract by the marketplace.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the cancel command.
        
    -   ##### params: {  
            amount: bigint;  
            message?: string;  
            value: bigint;  
        }
        
        Parameters for the cancel command including amount, optional message and value.
        
        -   ##### amount: bigint
            
        -   ##### `Optional` message?: string
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:138](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L138)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value to send with the command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:94](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L94)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds the data cell for an NFT offer.
    
    #### Parameters
    
    -   ##### data: [NftOfferData](../types/NftOfferData.html)
        
        The data for the NFT offer.
        
    
    #### Returns Cell
    
    A cell containing the data for the NFT offer.
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:21](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L21)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftOffer](NftOffer.html)[](#createFromAddress.createFromAddress-1)
-   Creates an NftOffer instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address to create from.
        
    
    #### Returns [NftOffer](NftOffer.html)
    
    A new NftOffer instance.
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:51](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L51)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftOffer](NftOffer.html)\>[](#createFromConfig.createFromConfig-1)
-   Creates an NftOffer instance from a configuration object.
    
    #### Parameters
    
    -   ##### config: [NftOfferData](../types/NftOfferData.html)
        
        The configuration data for the NFT offer.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[NftOffer](NftOffer.html)\>
    
    A new NftOffer instance.
    
    -   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:65](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L65)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getOfferData](#getOfferData)
-   [sendCancelOffer](#sendCancelOffer)
-   [sendCancelOfferByMarketplace](#sendCancelOfferByMarketplace)
-   [sendDeploy](#sendDeploy)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftOffer | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 127, Images: 0, Headings: 67, Paragraphs: 56



================================================
FILE: docs/classes/NftSwap.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/NftSwap.html
================================================
[HTML Document converted to Markdown]

File: NftSwap.html
Size: 76.21 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftSwap | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftSwap](NftSwap.html)

# Class NftSwap

Class representing an NFT Swap, implementing the Contract interface.

#### Hierarchy

-   NftSwap

#### Implements

-   Contract

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:56](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L56)

##### Index

### Constructors

[constructor](NftSwap.html#constructor)

### Properties

[address](NftSwap.html#address) [init?](NftSwap.html#init) [code](NftSwap.html#code-1)

### Methods

[getSupervisor](NftSwap.html#getSupervisor) [getTradeState](NftSwap.html#getTradeState) [sendAddCoins](NftSwap.html#sendAddCoins) [sendCancel](NftSwap.html#sendCancel) [sendDeploy](NftSwap.html#sendDeploy) [sendMaintain](NftSwap.html#sendMaintain) [sendTopup](NftSwap.html#sendTopup) [buildDataCell](NftSwap.html#buildDataCell) [createFromAddress](NftSwap.html#createFromAddress) [createFromConfig](NftSwap.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new NftSwap(address, init?): [NftSwap](NftSwap.html)[](#constructor.new_NftSwap)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [NftSwap](NftSwap.html)
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:57](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L57)
    

## Properties

### `Readonly` address[](#address)

address: Address

Implementation of Contract.address

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:57](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L57)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:57](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L57)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:59](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L59)

## Methods

### getSupervisor[](#getSupervisor)

-   getSupervisor(provider): Promise<{  
        supervisor: null | Address;  
    }\>[](#getSupervisor.getSupervisor-1)
-   Gets the supervisor of the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        supervisor: null | Address;  
    }\>
    
    An object representing the supervisor.
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:286](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L286)
    

### getTradeState[](#getTradeState)

-   getTradeState(provider): Promise<{  
        leftAddress: null | Address;  
        leftAmount: bigint;  
        leftComm: bigint;  
        leftGot: bigint;  
        leftNft: Cell;  
        left\_ok: boolean;  
        rightAddress: null | Address;  
        rightAmount: bigint;  
        rightComm: bigint;  
        rightGot: bigint;  
        rightNft: Cell;  
        right\_ok: boolean;  
        state: bigint;  
    }\>[](#getTradeState.getTradeState-1)
-   Gets the current state of the trade from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        leftAddress: null | Address;  
        leftAmount: bigint;  
        leftComm: bigint;  
        leftGot: bigint;  
        leftNft: Cell;  
        left\_ok: boolean;  
        rightAddress: null | Address;  
        rightAmount: bigint;  
        rightComm: bigint;  
        rightGot: bigint;  
        rightNft: Cell;  
        right\_ok: boolean;  
        state: bigint;  
    }\>
    
    An object representing the current state of the trade.
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:260](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L260)
    

### sendAddCoins[](#sendAddCoins)

-   sendAddCoins(provider, via, params): Promise<void\>[](#sendAddCoins.sendAddCoins-1)
-   Sends an addCoins command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the addCoins command.
        
    -   ##### params: {  
            coins: bigint;  
            queryId?: number;  
            value: bigint;  
        }
        
        Parameters for the addCoins command including value, optional queryId, and coins.
        
        -   ##### coins: bigint
            
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:191](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L191)
    

### sendCancel[](#sendCancel)

-   sendCancel(provider, via, params): Promise<void\>[](#sendCancel.sendCancel-1)
-   Sends a cancel command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the cancel command.
        
    -   ##### params: {  
            queryId?: number;  
            value: bigint;  
        }
        
        Parameters for the cancel command including value and optional queryId.
        
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:171](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L171)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Method to send a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value sent with the deploy command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:158](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L158)
    

### sendMaintain[](#sendMaintain)

-   sendMaintain(provider, via, params): Promise<void\>[](#sendMaintain.sendMaintain-1)
-   Sends a maintain command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the maintain command.
        
    -   ##### params: {  
            mode: number;  
            msg: Cell;  
            queryId?: number;  
            value: bigint;  
        }
        
        Parameters for the maintain command including value, optional queryId, mode, and msg.
        
        -   ##### mode: number
            
        -   ##### msg: Cell
            
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:213](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L213)
    

### sendTopup[](#sendTopup)

-   sendTopup(provider, via, params): Promise<void\>[](#sendTopup.sendTopup-1)
-   Sends a topup command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the topup command.
        
    -   ##### params: {  
            queryId?: number;  
            value: bigint;  
        }
        
        Parameters for the topup command including value and optional queryId.
        
        -   ##### `Optional` queryId?: number
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:241](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L241)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   #### Parameters
    
    -   ##### data: [SwapData](../types/SwapData.html)
        
    
    #### Returns Cell
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:61](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L61)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [NftSwap](NftSwap.html)[](#createFromAddress.createFromAddress-1)
-   Method to create a new NftSwap instance from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the swap.
        
    
    #### Returns [NftSwap](NftSwap.html)
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:117](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L117)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[NftSwap](NftSwap.html)\>[](#createFromConfig.createFromConfig-1)
-   Method to create a new NftSwap instance from a configuration.
    
    #### Parameters
    
    -   ##### config: [SwapData](../types/SwapData.html)
        
        The configuration of the swap.
        
    -   ##### workchain: number = 0
        
        The workchain of the swap.
        
    
    #### Returns Promise<[NftSwap](NftSwap.html)\>
    
    -   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:130](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L130)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getSupervisor](#getSupervisor)
-   [getTradeState](#getTradeState)
-   [sendAddCoins](#sendAddCoins)
-   [sendCancel](#sendCancel)
-   [sendDeploy](#sendDeploy)
-   [sendMaintain](#sendMaintain)
-   [sendTopup](#sendTopup)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftSwap | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 142, Images: 0, Headings: 89, Paragraphs: 57



================================================
FILE: docs/classes/Pinata.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/Pinata.html
================================================
[HTML Document converted to Markdown]

File: Pinata.html
Size: 46.00 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

Pinata | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [Pinata](Pinata.html)

# Class Pinata

Pinata is a class that provides utility functions for interacting with Pinata for IPFS integration.

#### Hierarchy

-   Pinata

#### Implements

-   ProviderInterface

-   Defined in [storage/Pinata.ts:10](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L10)

##### Index

### Constructors

[constructor](Pinata.html#constructor)

### Properties

[pinata](Pinata.html#pinata)

### Methods

[uploadBulk](Pinata.html#uploadBulk) [uploadImage](Pinata.html#uploadImage) [uploadImages](Pinata.html#uploadImages) [uploadJson](Pinata.html#uploadJson) [uploadJsonBulk](Pinata.html#uploadJsonBulk)

## Constructors

### constructor[](#constructor)

-   new Pinata(apiKey, secretApiKey): [Pinata](Pinata.html)[](#constructor.new_Pinata)
-   Creates an instance of the Pinata class.
    
    #### Parameters
    
    -   ##### apiKey: string
        
        The API key for Pinata.
        
    -   ##### secretApiKey: string
        
        The secret API key for Pinata.
        
    
    #### Returns [Pinata](Pinata.html)
    
    -   Defined in [storage/Pinata.ts:18](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L18)
    

## Properties

### `Private` pinata[](#pinata)

pinata: PinataClient

-   Defined in [storage/Pinata.ts:11](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L11)

## Methods

### uploadBulk[](#uploadBulk)

-   uploadBulk(assetsFolderPath): Promise<\[string\[\], string\[\]\]\>[](#uploadBulk.uploadBulk-1)
-   Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
    
    #### Parameters
    
    -   ##### assetsFolderPath: string
        
        The path to the folder containing the image and JSON files.
        
    
    #### Returns Promise<\[string\[\], string\[\]\]\>
    
    A Promise that resolves to an array of two arrays:
    
    -   The first array contains the URLs of the uploaded images on IPFS.
    -   The second array contains the URLs of the uploaded JSON files on IPFS.
    
    Implementation of ProviderInterface.uploadBulk
    
    -   Defined in [storage/Pinata.ts:77](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L77)
    

### uploadImage[](#uploadImage)

-   uploadImage(imagePath): Promise<string\>[](#uploadImage.uploadImage-1)
-   Uploads an image file to IPFS using Pinata SDK.
    
    #### Parameters
    
    -   ##### imagePath: string
        
        The path to the image file to be uploaded.
        
    
    #### Returns Promise<string\>
    
    A Promise that resolves to the URL of the uploaded image on IPFS.
    
    Implementation of ProviderInterface.uploadImage
    
    -   Defined in [storage/Pinata.ts:30](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L30)
    

### uploadImages[](#uploadImages)

-   uploadImages(folderPath): Promise<string\[\]\>[](#uploadImages.uploadImages-1)
-   Uploads multiple image files from a folder to IPFS using Pinata SDK.
    
    #### Parameters
    
    -   ##### folderPath: string
        
        The path to the folder containing the image files.
        
    
    #### Returns Promise<string\[\]\>
    
    A Promise that resolves to an array of URLs of the uploaded images on IPFS.
    
    Implementation of ProviderInterface.uploadImages
    
    -   Defined in [storage/Pinata.ts:41](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L41)
    

### uploadJson[](#uploadJson)

-   uploadJson(jsonPath): Promise<string\>[](#uploadJson.uploadJson-1)
-   Uploads a JSON file to IPFS using Pinata SDK.
    
    #### Parameters
    
    -   ##### jsonPath: string
        
        The path to the JSON file to be uploaded.
        
    
    #### Returns Promise<string\>
    
    A Promise that resolves to the URL of the uploaded JSON file on IPFS.
    
    Implementation of ProviderInterface.uploadJson
    
    -   Defined in [storage/Pinata.ts:52](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L52)
    

### uploadJsonBulk[](#uploadJsonBulk)

-   uploadJsonBulk(folderPath): Promise<string\[\]\>[](#uploadJsonBulk.uploadJsonBulk-1)
-   Uploads multiple JSON files from a folder to IPFS using Pinata SDK.
    
    #### Parameters
    
    -   ##### folderPath: string
        
        The path to the folder containing the JSON files.
        
    
    #### Returns Promise<string\[\]\>
    
    A Promise that resolves to an array of URLs of the uploaded JSON files on IPFS.
    
    Implementation of ProviderInterface.uploadJsonBulk
    
    -   Defined in [storage/Pinata.ts:64](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/Pinata.ts#L64)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [pinata](#pinata)
-   [uploadBulk](#uploadBulk)
-   [uploadImage](#uploadImage)
-   [uploadImages](#uploadImages)
-   [uploadJson](#uploadJson)
-   [uploadJsonBulk](#uploadJsonBulk)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: Pinata | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 103, Images: 0, Headings: 40, Paragraphs: 47



================================================
FILE: docs/classes/SbtSingle.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/SbtSingle.html
================================================
[HTML Document converted to Markdown]

File: SbtSingle.html
Size: 74.89 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

SbtSingle | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [SbtSingle](SbtSingle.html)

# Class SbtSingle

Represents a single item of the SBT (Soul Bound Token) NFT. Implements the Contract interface.

#### Hierarchy

-   SbtSingle

#### Implements

-   Contract

-   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:8](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L8)

##### Index

### Constructors

[constructor](SbtSingle.html#constructor)

### Properties

[address](SbtSingle.html#address) [init?](SbtSingle.html#init) [code](SbtSingle.html#code-1)

### Methods

[getAuthorityAddress](SbtSingle.html#getAuthorityAddress) [getNftData](SbtSingle.html#getNftData) [getRevokedTime](SbtSingle.html#getRevokedTime) [sendDeploy](SbtSingle.html#sendDeploy) [sendProveOwnership](SbtSingle.html#sendProveOwnership) [sendRequestOwner](SbtSingle.html#sendRequestOwner) [sendRevoke](SbtSingle.html#sendRevoke) [buildDataCell](SbtSingle.html#buildDataCell) [createFromAddress](SbtSingle.html#createFromAddress) [createFromConfig](SbtSingle.html#createFromConfig)

## Constructors

### constructor[](#constructor)

-   new SbtSingle(address, init?): [SbtSingle](SbtSingle.html)[](#constructor.new_SbtSingle)
-   Constructs an instance of the SbtSingle contract.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    -   ##### `Optional` init: {  
            code: Cell;  
            data: Cell;  
        }
        
        Optional initialization data for the contract.
        
        -   ##### code: Cell
            
        -   ##### data: Cell
            
    
    #### Returns [SbtSingle](SbtSingle.html)
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L14)
    

## Properties

### `Readonly` address[](#address)

address: Address

The address of the contract.

Implementation of Contract.address

-   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L14)

### `Optional` `Readonly` init[](#init)

init?: {  
    code: Cell;  
    data: Cell;  
}

Optional initialization data for the contract.

#### Type declaration

-   ##### code: Cell
    
-   ##### data: Cell
    

Implementation of Contract.init

-   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L14)

### `Static` code[](#code-1)

code: Cell = ...

-   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:18](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L18)

## Methods

### getAuthorityAddress[](#getAuthorityAddress)

-   getAuthorityAddress(provider): Promise<{  
        authorityAddress: null | Address;  
    }\>[](#getAuthorityAddress.getAuthorityAddress-1)
-   Retrieves the authority address from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        authorityAddress: null | Address;  
    }\>
    
    An object containing the authority address.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:190](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L190)
    

### getNftData[](#getNftData)

-   getNftData(provider): Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>[](#getNftData.getNftData-1)
-   Retrieves the NFT data from the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        collectionAddress: null | Address;  
        index: bigint;  
        individualContent: null | Cell;  
        init: boolean;  
        ownerAddress: null | Address;  
    }\>
    
    An object containing the NFT data, including init, index, collectionAddress, ownerAddress, and individualContent.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:174](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L174)
    

### getRevokedTime[](#getRevokedTime)

-   getRevokedTime(provider): Promise<{  
        revoked\_time: bigint;  
    }\>[](#getRevokedTime.getRevokedTime-1)
-   Retrieves the time when the contract was revoked.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    
    #### Returns Promise<{  
        revoked\_time: bigint;  
    }\>
    
    An object containing the revoked time.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:202](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L202)
    

### sendDeploy[](#sendDeploy)

-   sendDeploy(provider, via, value): Promise<void\>[](#sendDeploy.sendDeploy-1)
-   Sends a deploy command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the deploy command.
        
    -   ##### value: bigint
        
        The value sent with the deploy command.
        
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:90](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L90)
    

### sendProveOwnership[](#sendProveOwnership)

-   sendProveOwnership(provider, via, params): Promise<void\>[](#sendProveOwnership.sendProveOwnership-1)
-   Sends a prove ownership command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the prove ownership command.
        
    -   ##### params: {  
            dest: Address;  
            forwardPayload?: Cell;  
            queryId: bigint;  
            value: bigint;  
            withContent: boolean;  
        }
        
        The parameters for the prove ownership command, including value, queryId, dest, forwardPayload, and withContent.
        
        -   ##### dest: Address
            
        -   ##### `Optional` forwardPayload?: Cell
            
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
        -   ##### withContent: boolean
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:103](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L103)
    

### sendRequestOwner[](#sendRequestOwner)

-   sendRequestOwner(provider, via, params): Promise<void\>[](#sendRequestOwner.sendRequestOwner-1)
-   Sends a request owner command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the request owner command.
        
    -   ##### params: {  
            dest: Address;  
            forwardPayload?: Cell;  
            queryId: bigint;  
            value: bigint;  
            withContent: boolean;  
        }
        
        The parameters for the request owner command, including value, queryId, dest, forwardPayload, and withContent.
        
        -   ##### dest: Address
            
        -   ##### `Optional` forwardPayload?: Cell
            
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
        -   ##### withContent: boolean
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:129](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L129)
    

### sendRevoke[](#sendRevoke)

-   sendRevoke(provider, via, params): Promise<void\>[](#sendRevoke.sendRevoke-1)
-   Sends a revoke command to the contract.
    
    #### Parameters
    
    -   ##### provider: ContractProvider
        
        The contract provider.
        
    -   ##### via: Sender
        
        The sender of the revoke command.
        
    -   ##### params: {  
            queryId: bigint;  
            value: bigint;  
        }
        
        The parameters for the revoke command, including value and queryId.
        
        -   ##### queryId: bigint
            
        -   ##### value: bigint
            
    
    #### Returns Promise<void\>
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:155](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L155)
    

### `Static` buildDataCell[](#buildDataCell)

-   buildDataCell(data): Cell[](#buildDataCell.buildDataCell-1)
-   Builds a data cell for the SbtSingle contract.
    
    #### Parameters
    
    -   ##### data: [SbtSingleData](../types/SbtSingleData.html)
        
        The data for the contract.
        
    
    #### Returns Cell
    
    A data cell.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:25](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L25)
    

### `Static` createFromAddress[](#createFromAddress)

-   createFromAddress(address): [SbtSingle](SbtSingle.html)[](#createFromAddress.createFromAddress-1)
-   Constructs an instance of the SbtSingle contract from an address.
    
    #### Parameters
    
    -   ##### address: Address
        
        The address of the contract.
        
    
    #### Returns [SbtSingle](SbtSingle.html)
    
    An instance of SbtSingle.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:47](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L47)
    

### `Static` createFromConfig[](#createFromConfig)

-   createFromConfig(config, workchain?): Promise<[SbtSingle](SbtSingle.html)\>[](#createFromConfig.createFromConfig-1)
-   Constructs an instance of the SbtSingle contract from a configuration object.
    
    #### Parameters
    
    -   ##### config: [SbtSingleData](../types/SbtSingleData.html)
        
        The configuration object for the contract.
        
    -   ##### workchain: number = 0
        
        The workchain ID (default is 0).
        
    
    #### Returns Promise<[SbtSingle](SbtSingle.html)\>
    
    An instance of SbtSingle.
    
    -   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:61](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L61)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [address](#address)
-   [init](#init)
-   [code](#code-1)
-   [getAuthorityAddress](#getAuthorityAddress)
-   [getNftData](#getNftData)
-   [getRevokedTime](#getRevokedTime)
-   [sendDeploy](#sendDeploy)
-   [sendProveOwnership](#sendProveOwnership)
-   [sendRequestOwner](#sendRequestOwner)
-   [sendRevoke](#sendRevoke)
-   [buildDataCell](#buildDataCell)
-   [createFromAddress](#createFromAddress)
-   [createFromConfig](#createFromConfig)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: SbtSingle | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 142, Images: 0, Headings: 88, Paragraphs: 66



================================================
FILE: docs/classes/Storage.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/Storage.html
================================================
[HTML Document converted to Markdown]

File: Storage.html
Size: 43.32 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

Storage | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [Storage](Storage.html)

# Class Storage

#### Hierarchy

-   Storage

-   Defined in [storage/index.ts:1](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L1)

##### Index

### Constructors

[constructor](Storage.html#constructor)

### Properties

[provider](Storage.html#provider)

### Methods

[uploadBulk](Storage.html#uploadBulk) [uploadImage](Storage.html#uploadImage) [uploadImages](Storage.html#uploadImages) [uploadJson](Storage.html#uploadJson) [uploadJsonBulk](Storage.html#uploadJsonBulk)

## Constructors

### constructor[](#constructor)

-   new Storage(provider): [Storage](Storage.html)[](#constructor.new_Storage)
-   #### Parameters
    
    -   ##### provider: ProviderInterface
        
    
    #### Returns [Storage](Storage.html)
    
    -   Defined in [storage/index.ts:2](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L2)
    

## Properties

### `Readonly` provider[](#provider)

provider: ProviderInterface

-   Defined in [storage/index.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L3)

## Methods

### uploadBulk[](#uploadBulk)

-   uploadBulk(assetsFolderPath): Promise<\[string\[\], string\[\]\]\>[](#uploadBulk.uploadBulk-1)
-   #### Parameters
    
    -   ##### assetsFolderPath: string
        
    
    #### Returns Promise<\[string\[\], string\[\]\]\>
    
    -   Defined in [storage/index.ts:35](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L35)
    

### uploadImage[](#uploadImage)

-   uploadImage(imagePath): Promise<string\>[](#uploadImage.uploadImage-1)
-   #### Parameters
    
    -   ##### imagePath: string
        
    
    #### Returns Promise<string\>
    
    -   Defined in [storage/index.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L7)
    

### uploadImages[](#uploadImages)

-   uploadImages(folderPath): Promise<string\[\]\>[](#uploadImages.uploadImages-1)
-   #### Parameters
    
    -   ##### folderPath: string
        
    
    #### Returns Promise<string\[\]\>
    
    -   Defined in [storage/index.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L14)
    

### uploadJson[](#uploadJson)

-   uploadJson(jsonPath): Promise<string\>[](#uploadJson.uploadJson-1)
-   #### Parameters
    
    -   ##### jsonPath: string
        
    
    #### Returns Promise<string\>
    
    -   Defined in [storage/index.ts:21](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L21)
    

### uploadJsonBulk[](#uploadJsonBulk)

-   uploadJsonBulk(folderPath): Promise<string\[\]\>[](#uploadJsonBulk.uploadJsonBulk-1)
-   #### Parameters
    
    -   ##### folderPath: string
        
    
    #### Returns Promise<string\[\]\>
    
    -   Defined in [storage/index.ts:28](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/storage/index.ts#L28)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [provider](#provider)
-   [uploadBulk](#uploadBulk)
-   [uploadImage](#uploadImage)
-   [uploadImages](#uploadImages)
-   [uploadJson](#uploadJson)
-   [uploadJsonBulk](#uploadJsonBulk)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: Storage | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 103, Images: 0, Headings: 38, Paragraphs: 23



================================================
FILE: docs/classes/TonNftClient.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/classes/TonNftClient.html
================================================
[HTML Document converted to Markdown]

File: TonNftClient.html
Size: 44.30 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

TonNftClient | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [TonNftClient](TonNftClient.html)

# Class TonNftClient

#### Hierarchy

-   TonNftClient

-   Defined in [ton-api/index.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L3)

##### Index

### Constructors

[constructor](TonNftClient.html#constructor)

### Properties

[client](TonNftClient.html#client)

### Methods

[getNftCollection](TonNftClient.html#getNftCollection) [getNftCollections](TonNftClient.html#getNftCollections) [getNftItem](TonNftClient.html#getNftItem) [getNftItems](TonNftClient.html#getNftItems) [getTransactionsByAddress](TonNftClient.html#getTransactionsByAddress)

## Constructors

### constructor[](#constructor)

-   new TonNftClient(client): [TonNftClient](TonNftClient.html)[](#constructor.new_TonNftClient)
-   #### Parameters
    
    -   ##### client: [ClientInterface](../interfaces/ClientInterface.html)
        
    
    #### Returns [TonNftClient](TonNftClient.html)
    
    -   Defined in [ton-api/index.ts:4](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L4)
    

## Properties

### `Readonly` client[](#client)

client: [ClientInterface](../interfaces/ClientInterface.html)

-   Defined in [ton-api/index.ts:5](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L5)

## Methods

### getNftCollection[](#getNftCollection)

-   getNftCollection(collectionAddress): Promise<unknown\>[](#getNftCollection.getNftCollection-1)
-   #### Parameters
    
    -   ##### collectionAddress: string
        
    
    #### Returns Promise<unknown\>
    
    -   Defined in [ton-api/index.ts:15](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L15)
    

### getNftCollections[](#getNftCollections)

-   getNftCollections(limit?, offset?): Promise<unknown\>[](#getNftCollections.getNftCollections-1)
-   #### Parameters
    
    -   ##### `Optional` limit: number
        
    -   ##### `Optional` offset: number
        
    
    #### Returns Promise<unknown\>
    
    -   Defined in [ton-api/index.ts:8](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L8)
    

### getNftItem[](#getNftItem)

-   getNftItem(itemAddress): Promise<unknown\>[](#getNftItem.getNftItem-1)
-   #### Parameters
    
    -   ##### itemAddress: string
        
    
    #### Returns Promise<unknown\>
    
    -   Defined in [ton-api/index.ts:29](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L29)
    

### getNftItems[](#getNftItems)

-   getNftItems(collectionAddress, limit?, offset?): Promise<unknown\>[](#getNftItems.getNftItems-1)
-   #### Parameters
    
    -   ##### collectionAddress: string
        
    -   ##### `Optional` limit: number
        
    -   ##### `Optional` offset: number
        
    
    #### Returns Promise<unknown\>
    
    -   Defined in [ton-api/index.ts:21](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L21)
    

### getTransactionsByAddress[](#getTransactionsByAddress)

-   getTransactionsByAddress(address, limit?): Promise<unknown\>[](#getTransactionsByAddress.getTransactionsByAddress-1)
-   #### Parameters
    
    -   ##### address: Address
        
    -   ##### `Optional` limit: number
        
    
    #### Returns Promise<unknown\>
    
    -   Defined in [ton-api/index.ts:35](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L35)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [constructor](#constructor)
-   [client](#client)
-   [getNftCollection](#getNftCollection)
-   [getNftCollections](#getNftCollections)
-   [getNftItem](#getNftItem)
-   [getNftItems](#getNftItems)
-   [getTransactionsByAddress](#getTransactionsByAddress)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](AmazonS3.html)
-   [NftAuction](NftAuction.html)
-   [NftAuctionV2](NftAuctionV2.html)
-   [NftCollection](NftCollection.html)
-   [NftFixedPrice](NftFixedPrice.html)
-   [NftFixedPriceV2](NftFixedPriceV2.html)
-   [NftFixedPriceV3](NftFixedPriceV3.html)
-   [NftItem](NftItem.html)
-   [NftItemRoyalty](NftItemRoyalty.html)
-   [NftMarketplace](NftMarketplace.html)
-   [NftOffer](NftOffer.html)
-   [NftSwap](NftSwap.html)
-   [Pinata](Pinata.html)
-   [SbtSingle](SbtSingle.html)
-   [Storage](Storage.html)
-   [TonNftClient](TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: TonNftClient | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 105, Images: 0, Headings: 42, Paragraphs: 23



================================================
FILE: docs/enums/ENDPOINT.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/enums/ENDPOINT.html
================================================
[HTML Document converted to Markdown]

File: ENDPOINT.html
Size: 27.21 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

ENDPOINT | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [ENDPOINT](ENDPOINT.html)

# Enumeration ENDPOINT

-   Defined in [index.ts:39](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/index.ts#L39)

##### Index

### Enumeration Members

[MAINNET](ENDPOINT.html#MAINNET) [TESTNET](ENDPOINT.html#TESTNET)

## Enumeration Members

### MAINNET[](#MAINNET)

MAINNET: "https://toncenter.com/api/v2/jsonRPC"

-   Defined in [index.ts:40](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/index.ts#L40)

### TESTNET[](#TESTNET)

TESTNET: "https://testnet.toncenter.com/api/v2/jsonRPC"

-   Defined in [index.ts:41](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/index.ts#L41)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [MAINNET](#MAINNET)
-   [TESTNET](#TESTNET)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: ENDPOINT | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 75, Images: 0, Headings: 10, Paragraphs: 21



================================================
FILE: docs/functions/TransactionParsing.parseTransaction.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/TransactionParsing.parseTransaction.html
================================================
[HTML Document converted to Markdown]

File: TransactionParsing.parseTransaction.html
Size: 26.54 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

parseTransaction | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [TransactionParsing](../modules/TransactionParsing.html)
-   [parseTransaction](TransactionParsing.parseTransaction.html)

# Function parseTransaction

-   parseTransaction<E\>(tx, parsers): (E extends ((input) => infer RR)  
        ? RR  
        : never) | undefined[](#parseTransaction)
-   #### Type Parameters
    
    -   #### E extends ((input) => any)
        
    
    #### Parameters
    
    -   ##### tx: Transaction
        
    -   ##### parsers: E\[\]
        
    
    #### Returns (E extends ((input) => infer RR)  
        ? RR  
        : never) | undefined
    
    -   Defined in [transaction-parsing/index.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/transaction-parsing/index.ts#L3)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: parseTransaction | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 69, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/buildSignature.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/buildSignature.html
================================================
[HTML Document converted to Markdown]

File: buildSignature.html
Size: 25.43 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

buildSignature | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [buildSignature](buildSignature.html)

# Function buildSignature

-   buildSignature(params): Buffer[](#buildSignature)
-   Builds a signature for an operation.
    
    #### Parameters
    
    -   ##### params: {  
            keyPair: KeyPair;  
            saleMessageBody: Cell;  
            saleStateInit: Cell;  
        }
        
        Parameters for the signature, including the key pair, sale state initialization, and sale message body.
        
        -   ##### keyPair: KeyPair
            
        -   ##### saleMessageBody: Cell
            
        -   ##### saleStateInit: Cell
            
    
    #### Returns Buffer
    
    The generated signature.
    
    -   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:122](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L122)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: buildSignature | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 21



================================================
FILE: docs/functions/createSender.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/createSender.html
================================================
[HTML Document converted to Markdown]

File: createSender.html
Size: 24.27 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

createSender | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [createSender](createSender.html)

# Function createSender

-   createSender(keypair, client): Promise<Sender\>[](#createSender)
-   #### Parameters
    
    -   ##### keypair: KeyPair
        
    -   ##### client: TonClient4
        
    
    #### Returns Promise<Sender\>
    
    -   Defined in [utils/createSender.ts:4](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/createSender.ts#L4)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: createSender | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 8, Paragraphs: 18



================================================
FILE: docs/functions/createTempFile.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/createTempFile.html
================================================
[HTML Document converted to Markdown]

File: createTempFile.html
Size: 25.71 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

createTempFile | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [createTempFile](createTempFile.html)

# Function createTempFile

-   createTempFile(ext): Promise<{  
        destroy: (() => Promise<void\>);  
        name: string;  
    }\>[](#createTempFile)
-   #### Parameters
    
    -   ##### ext: string
        
    
    #### Returns Promise<{  
        destroy: (() => Promise<void\>);  
        name: string;  
    }\>
    
    -   Defined in [utils/createTempFile.ts:6](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/createTempFile.ts#L6)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: createTempFile | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/importKeyPair.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/importKeyPair.html
================================================
[HTML Document converted to Markdown]

File: importKeyPair.html
Size: 24.22 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

importKeyPair | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [importKeyPair](importKeyPair.html)

# Function importKeyPair

-   importKeyPair(secretKey?): Promise<KeyPair\>[](#importKeyPair)
-   #### Parameters
    
    -   ##### `Optional` secretKey: string
        
    
    #### Returns Promise<KeyPair\>
    
    -   Defined in [utils/importKeyPair.ts:5](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/importKeyPair.ts#L5)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: importKeyPair | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/isEligibleTransaction.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/isEligibleTransaction.html
================================================
[HTML Document converted to Markdown]

File: isEligibleTransaction.html
Size: 23.90 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

isEligibleTransaction | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [isEligibleTransaction](isEligibleTransaction.html)

# Function isEligibleTransaction

-   isEligibleTransaction(tx): boolean[](#isEligibleTransaction)
-   #### Parameters
    
    -   ##### tx: Transaction
        
    
    #### Returns boolean
    
    -   Defined in [utils/EligibleInternalTx.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/EligibleInternalTx.ts#L3)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: isEligibleTransaction | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadChunkedData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadChunkedData.html
================================================
[HTML Document converted to Markdown]

File: loadChunkedData.html
Size: 23.84 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadChunkedData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadChunkedData](loadChunkedData.html)

# Function loadChunkedData

-   loadChunkedData(slice): string[](#loadChunkedData)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns string
    
    -   Defined in [types/Content.ts:158](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L158)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadChunkedData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadChunkedRaw.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadChunkedRaw.html
================================================
[HTML Document converted to Markdown]

File: loadChunkedRaw.html
Size: 23.84 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadChunkedRaw | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadChunkedRaw](loadChunkedRaw.html)

# Function loadChunkedRaw

-   loadChunkedRaw(slice): string[](#loadChunkedRaw)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns string
    
    -   Defined in [types/Content.ts:178](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L178)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadChunkedRaw | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadContentData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadContentData.html
================================================
[HTML Document converted to Markdown]

File: loadContentData.html
Size: 23.84 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadContentData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadContentData](loadContentData.html)

# Function loadContentData

-   loadContentData(slice): string[](#loadContentData)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns string
    
    -   Defined in [types/Content.ts:120](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L120)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadContentData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadFullContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadFullContent.html
================================================
[HTML Document converted to Markdown]

File: loadFullContent.html
Size: 23.85 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadFullContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadFullContent](loadFullContent.html)

# Function loadFullContent

-   loadFullContent(slice): FullContent[](#loadFullContent)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns FullContent
    
    -   Defined in [types/Content.ts:24](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L24)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadFullContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadOffchainContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadOffchainContent.html
================================================
[HTML Document converted to Markdown]

File: loadOffchainContent.html
Size: 23.89 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadOffchainContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadOffchainContent](loadOffchainContent.html)

# Function loadOffchainContent

-   loadOffchainContent(slice): OffchainContent[](#loadOffchainContent)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns OffchainContent
    
    -   Defined in [types/Content.ts:96](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L96)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadOffchainContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadOnchainContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadOnchainContent.html
================================================
[HTML Document converted to Markdown]

File: loadOnchainContent.html
Size: 23.88 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadOnchainContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadOnchainContent](loadOnchainContent.html)

# Function loadOnchainContent

-   loadOnchainContent(slice): OnchainContent[](#loadOnchainContent)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns OnchainContent
    
    -   Defined in [types/Content.ts:52](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L52)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadOnchainContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadOnchainDict.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadOnchainDict.html
================================================
[HTML Document converted to Markdown]

File: loadOnchainDict.html
Size: 24.29 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadOnchainDict | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadOnchainDict](loadOnchainDict.html)

# Function loadOnchainDict

-   loadOnchainDict(slice): Map<bigint, string\>[](#loadOnchainDict)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns Map<bigint, string\>
    
    -   Defined in [types/Content.ts:221](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L221)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadOnchainDict | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/loadSnakeData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/loadSnakeData.html
================================================
[HTML Document converted to Markdown]

File: loadSnakeData.html
Size: 23.83 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

loadSnakeData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [loadSnakeData](loadSnakeData.html)

# Function loadSnakeData

-   loadSnakeData(slice): string[](#loadSnakeData)
-   #### Parameters
    
    -   ##### slice: Slice
        
    
    #### Returns string
    
    -   Defined in [types/Content.ts:136](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L136)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: loadSnakeData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 7, Paragraphs: 18



================================================
FILE: docs/functions/randomAddress.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/randomAddress.html
================================================
[HTML Document converted to Markdown]

File: randomAddress.html
Size: 23.56 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

randomAddress | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [randomAddress](randomAddress.html)

# Function randomAddress

-   randomAddress(): Address[](#randomAddress)
-   #### Returns Address
    
    -   Defined in [utils/randomAddress.ts:4](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/randomAddress.ts#L4)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: randomAddress | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 5, Paragraphs: 18



================================================
FILE: docs/functions/randomKeyPair.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/randomKeyPair.html
================================================
[HTML Document converted to Markdown]

File: randomKeyPair.html
Size: 23.84 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

randomKeyPair | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [randomKeyPair](randomKeyPair.html)

# Function randomKeyPair

-   randomKeyPair(): Promise<KeyPair\>[](#randomKeyPair)
-   #### Returns Promise<KeyPair\>
    
    -   Defined in [utils/randomKeyPair.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/randomKeyPair.ts#L3)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: randomKeyPair | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 5, Paragraphs: 18



================================================
FILE: docs/functions/storeChunkedData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeChunkedData.html
================================================
[HTML Document converted to Markdown]

File: storeChunkedData.html
Size: 25.11 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeChunkedData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeChunkedData](storeChunkedData.html)

# Function storeChunkedData

-   storeChunkedData(src): ((builder) => void)[](#storeChunkedData)
-   #### Parameters
    
    -   ##### src: string
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:168](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L168)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeChunkedData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeChunkedRaw.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeChunkedRaw.html
================================================
[HTML Document converted to Markdown]

File: storeChunkedRaw.html
Size: 25.10 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeChunkedRaw | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeChunkedRaw](storeChunkedRaw.html)

# Function storeChunkedRaw

-   storeChunkedRaw(src): ((builder) => void)[](#storeChunkedRaw)
-   #### Parameters
    
    -   ##### src: string
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:199](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L199)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeChunkedRaw | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeFullContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeFullContent.html
================================================
[HTML Document converted to Markdown]

File: storeFullContent.html
Size: 25.11 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeFullContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeFullContent](storeFullContent.html)

# Function storeFullContent

-   storeFullContent(src): ((builder) => void)[](#storeFullContent)
-   #### Parameters
    
    -   ##### src: FullContent
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:39](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L39)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeFullContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeOffchainContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeOffchainContent.html
================================================
[HTML Document converted to Markdown]

File: storeOffchainContent.html
Size: 25.15 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeOffchainContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeOffchainContent](storeOffchainContent.html)

# Function storeOffchainContent

-   storeOffchainContent(src): ((builder) => void)[](#storeOffchainContent)
-   #### Parameters
    
    -   ##### src: OffchainContent
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:109](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L109)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeOffchainContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeOnchainContent.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeOnchainContent.html
================================================
[HTML Document converted to Markdown]

File: storeOnchainContent.html
Size: 25.14 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeOnchainContent | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeOnchainContent](storeOnchainContent.html)

# Function storeOnchainContent

-   storeOnchainContent(src): ((builder) => void)[](#storeOnchainContent)
-   #### Parameters
    
    -   ##### src: OnchainContent
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:77](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L77)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeOnchainContent | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeOnchainDict.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeOnchainDict.html
================================================
[HTML Document converted to Markdown]

File: storeOnchainDict.html
Size: 25.33 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeOnchainDict | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeOnchainDict](storeOnchainDict.html)

# Function storeOnchainDict

-   storeOnchainDict(src): ((builder) => void)[](#storeOnchainDict)
-   #### Parameters
    
    -   ##### src: Map<bigint, string\>
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:237](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L237)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeOnchainDict | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/storeSnakeData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/storeSnakeData.html
================================================
[HTML Document converted to Markdown]

File: storeSnakeData.html
Size: 25.09 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

storeSnakeData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [storeSnakeData](storeSnakeData.html)

# Function storeSnakeData

-   storeSnakeData(src): ((builder) => void)[](#storeSnakeData)
-   #### Parameters
    
    -   ##### src: string
        
    
    #### Returns ((builder) => void)
    
    -   -   (builder): void
        -   #### Parameters
            
            -   ##### builder: Builder
                
            
            #### Returns void
            
    
    -   Defined in [types/Content.ts:146](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/types/Content.ts#L146)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: storeSnakeData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 10, Paragraphs: 18



================================================
FILE: docs/functions/uuid.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/functions/uuid.html
================================================
[HTML Document converted to Markdown]

File: uuid.html
Size: 23.47 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

uuid | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [uuid](uuid.html)

# Function uuid

-   uuid(): string[](#uuid)
-   #### Returns string
    
    -   Defined in [utils/uuid.ts:3](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/utils/uuid.ts#L3)
    

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](buildSignature.html)
-   [createSender](createSender.html)
-   [createTempFile](createTempFile.html)
-   [importKeyPair](importKeyPair.html)
-   [isEligibleTransaction](isEligibleTransaction.html)
-   [loadChunkedData](loadChunkedData.html)
-   [loadChunkedRaw](loadChunkedRaw.html)
-   [loadContentData](loadContentData.html)
-   [loadFullContent](loadFullContent.html)
-   [loadOffchainContent](loadOffchainContent.html)
-   [loadOnchainContent](loadOnchainContent.html)
-   [loadOnchainDict](loadOnchainDict.html)
-   [loadSnakeData](loadSnakeData.html)
-   [randomAddress](randomAddress.html)
-   [randomKeyPair](randomKeyPair.html)
-   [storeChunkedData](storeChunkedData.html)
-   [storeChunkedRaw](storeChunkedRaw.html)
-   [storeFullContent](storeFullContent.html)
-   [storeOffchainContent](storeOffchainContent.html)
-   [storeOnchainContent](storeOnchainContent.html)
-   [storeOnchainDict](storeOnchainDict.html)
-   [storeSnakeData](storeSnakeData.html)
-   [uuid](uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: uuid | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 5, Paragraphs: 18



================================================
FILE: docs/index.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/index.html
================================================
[HTML Document converted to Markdown]

File: index.html
Size: 24.99 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](index.html)

[](#)

## nft-sdk

# [NFT SDK](#md:nft-sdk)

## [Description](#md:description)

This SDK is designed for The Open Network, a decentralized platform that provides a high-performance blockchain infrastructure. The NFT SDK is a tool that enables developers to create and manage their own NFTs (Non-Fungible Tokens) on The Open Network.

NFTs are unique digital assets that can represent anything from art and music to collectibles and virtual real estate. The NFT SDK provides developers with the ability to create, manage, and trade these unique assets on The Open Network.

The NFT SDK provides a simple and intuitive API for developers to create and manage their NFTs. It also includes features such as metadata management, transaction support, and token ownership management. The NFT SDK is designed to be scalable, secure, and easy to use, allowing developers to focus on building their NFT projects rather than worrying about technical details.

In summary, the NFT SDK is an essential tool for developers looking to create and manage NFTs on The Open Network. It provides a powerful and flexible API that allows developers to easily create, manage, and trade unique digital assets. With the NFT SDK, developers can unleash their creativity and build exciting new applications on The Open Network.

## [Feature List](#md:feature-list)

-    Deploy Single NFTs
-    Deploy NFT Collections
-    Put NFTs on Sale
-    Fetch Information on NFTs, collections and sales using TonClient
-    Rarity Calculation (TBD)
-    Transfer NFTs
-    Work with Decentralized Storage

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   -   [NFT SDK](#md:nft-sdk)
    -   -   [Description](#md:description)
        -   [Feature List](#md:feature-list)

[nft-sdk](modules.html)

-   [TransactionParsing](modules/TransactionParsing.html)
    
    -   [parseTransaction](functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](enums/ENDPOINT.html)
-   [AmazonS3](classes/AmazonS3.html)
-   [NftAuction](classes/NftAuction.html)
-   [NftAuctionV2](classes/NftAuctionV2.html)
-   [NftCollection](classes/NftCollection.html)
-   [NftFixedPrice](classes/NftFixedPrice.html)
-   [NftFixedPriceV2](classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](classes/NftFixedPriceV3.html)
-   [NftItem](classes/NftItem.html)
-   [NftItemRoyalty](classes/NftItemRoyalty.html)
-   [NftMarketplace](classes/NftMarketplace.html)
-   [NftOffer](classes/NftOffer.html)
-   [NftSwap](classes/NftSwap.html)
-   [Pinata](classes/Pinata.html)
-   [SbtSingle](classes/SbtSingle.html)
-   [Storage](classes/Storage.html)
-   [TonNftClient](classes/TonNftClient.html)
-   [ClientInterface](interfaces/ClientInterface.html)
-   [CollectionMintItemInput](types/CollectionMintItemInput.html)
-   [NftAuctionData](types/NftAuctionData.html)
-   [NftAuctionV2Data](types/NftAuctionV2Data.html)
-   [NftCollectionData](types/NftCollectionData.html)
-   [NftFixPriceSaleData](types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](types/NftFixPriceSaleV3Data.html)
-   [NftItemData](types/NftItemData.html)
-   [NftMarketplaceData](types/NftMarketplaceData.html)
-   [NftMint](types/NftMint.html)
-   [NftOfferData](types/NftOfferData.html)
-   [OwnershipTransfer](types/OwnershipTransfer.html)
-   [RoyaltyParams](types/RoyaltyParams.html)
-   [SbtSingleData](types/SbtSingleData.html)
-   [SwapData](types/SwapData.html)
-   [OperationCodes](variables/OperationCodes.html)
-   [SwapState](variables/SwapState.html)
-   [buildSignature](functions/buildSignature.html)
-   [createSender](functions/createSender.html)
-   [createTempFile](functions/createTempFile.html)
-   [importKeyPair](functions/importKeyPair.html)
-   [isEligibleTransaction](functions/isEligibleTransaction.html)
-   [loadChunkedData](functions/loadChunkedData.html)
-   [loadChunkedRaw](functions/loadChunkedRaw.html)
-   [loadContentData](functions/loadContentData.html)
-   [loadFullContent](functions/loadFullContent.html)
-   [loadOffchainContent](functions/loadOffchainContent.html)
-   [loadOnchainContent](functions/loadOnchainContent.html)
-   [loadOnchainDict](functions/loadOnchainDict.html)
-   [loadSnakeData](functions/loadSnakeData.html)
-   [randomAddress](functions/randomAddress.html)
-   [randomKeyPair](functions/randomKeyPair.html)
-   [storeChunkedData](functions/storeChunkedData.html)
-   [storeChunkedRaw](functions/storeChunkedRaw.html)
-   [storeFullContent](functions/storeFullContent.html)
-   [storeOffchainContent](functions/storeOffchainContent.html)
-   [storeOnchainContent](functions/storeOnchainContent.html)
-   [storeOnchainDict](functions/storeOnchainDict.html)
-   [storeSnakeData](functions/storeSnakeData.html)
-   [uuid](functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 70, Images: 0, Headings: 8, Paragraphs: 20



================================================
FILE: docs/interfaces/ClientInterface.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/interfaces/ClientInterface.html
================================================
[HTML Document converted to Markdown]

File: ClientInterface.html
Size: 40.62 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

ClientInterface | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [ClientInterface](ClientInterface.html)

# Interface ClientInterface

#### Hierarchy

-   ClientInterface

-   Defined in [ton-api/index.ts:43](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L43)

##### Index

### Properties

[getNftCollection](ClientInterface.html#getNftCollection) [getNftCollections](ClientInterface.html#getNftCollections) [getNftItem](ClientInterface.html#getNftItem) [getNftItems](ClientInterface.html#getNftItems) [getTransactionsByAddress](ClientInterface.html#getTransactionsByAddress)

## Properties

### getNftCollection[](#getNftCollection)

getNftCollection: ((collectionAddress) => Promise<unknown\>)

#### Type declaration

-   -   (collectionAddress): Promise<unknown\>
    -   #### Parameters
        
        -   ##### collectionAddress: string
            
        
        #### Returns Promise<unknown\>
        

-   Defined in [ton-api/index.ts:45](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L45)

### getNftCollections[](#getNftCollections)

getNftCollections: ((limit?, offset?) => Promise<unknown\>)

#### Type declaration

-   -   (limit?, offset?): Promise<unknown\>
    -   #### Parameters
        
        -   ##### `Optional` limit: number
            
        -   ##### `Optional` offset: number
            
        
        #### Returns Promise<unknown\>
        

-   Defined in [ton-api/index.ts:44](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L44)

### getNftItem[](#getNftItem)

getNftItem: ((itemAddress) => Promise<unknown\>)

#### Type declaration

-   -   (itemAddress): Promise<unknown\>
    -   #### Parameters
        
        -   ##### itemAddress: string
            
        
        #### Returns Promise<unknown\>
        

-   Defined in [ton-api/index.ts:47](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L47)

### getNftItems[](#getNftItems)

getNftItems: ((collectionAddress, limit?, offset?) => Promise<unknown\>)

#### Type declaration

-   -   (collectionAddress, limit?, offset?): Promise<unknown\>
    -   #### Parameters
        
        -   ##### collectionAddress: string
            
        -   ##### `Optional` limit: number
            
        -   ##### `Optional` offset: number
            
        
        #### Returns Promise<unknown\>
        

-   Defined in [ton-api/index.ts:46](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L46)

### getTransactionsByAddress[](#getTransactionsByAddress)

getTransactionsByAddress: ((address, limit?) => Promise<unknown\>)

#### Type declaration

-   -   (address, limit?): Promise<unknown\>
    -   #### Parameters
        
        -   ##### address: Address
            
        -   ##### `Optional` limit: number
            
        
        #### Returns Promise<unknown\>
        

-   Defined in [ton-api/index.ts:48](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/ton-api/index.ts#L48)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

### On This Page

-   [getNftCollection](#getNftCollection)
-   [getNftCollections](#getNftCollections)
-   [getNftItem](#getNftItem)
-   [getNftItems](#getNftItems)
-   [getTransactionsByAddress](#getTransactionsByAddress)

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: ClientInterface | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 87, Images: 0, Headings: 38, Paragraphs: 21



================================================
FILE: docs/modules.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/modules.html
================================================
[HTML Document converted to Markdown]

File: modules.html
Size: 37.55 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](index.html)

[](#)

## nft-sdk

### Index

### Namespaces

[TransactionParsing](modules/TransactionParsing.html)

### Enumerations

[ENDPOINT](enums/ENDPOINT.html)

### Classes

[AmazonS3](classes/AmazonS3.html) [NftAuction](classes/NftAuction.html) [NftAuctionV2](classes/NftAuctionV2.html) [NftCollection](classes/NftCollection.html) [NftFixedPrice](classes/NftFixedPrice.html) [NftFixedPriceV2](classes/NftFixedPriceV2.html) [NftFixedPriceV3](classes/NftFixedPriceV3.html) [NftItem](classes/NftItem.html) [NftItemRoyalty](classes/NftItemRoyalty.html) [NftMarketplace](classes/NftMarketplace.html) [NftOffer](classes/NftOffer.html) [NftSwap](classes/NftSwap.html) [Pinata](classes/Pinata.html) [SbtSingle](classes/SbtSingle.html) [Storage](classes/Storage.html) [TonNftClient](classes/TonNftClient.html)

### Interfaces

[ClientInterface](interfaces/ClientInterface.html)

### Type Aliases

[CollectionMintItemInput](types/CollectionMintItemInput.html) [NftAuctionData](types/NftAuctionData.html) [NftAuctionV2Data](types/NftAuctionV2Data.html) [NftCollectionData](types/NftCollectionData.html) [NftFixPriceSaleData](types/NftFixPriceSaleData.html) [NftFixPriceSaleV2Data](types/NftFixPriceSaleV2Data.html) [NftFixPriceSaleV3Data](types/NftFixPriceSaleV3Data.html) [NftItemData](types/NftItemData.html) [NftMarketplaceData](types/NftMarketplaceData.html) [NftMint](types/NftMint.html) [NftOfferData](types/NftOfferData.html) [OwnershipTransfer](types/OwnershipTransfer.html) [RoyaltyParams](types/RoyaltyParams.html) [SbtSingleData](types/SbtSingleData.html) [SwapData](types/SwapData.html)

### Variables

[OperationCodes](variables/OperationCodes.html) [SwapState](variables/SwapState.html)

### Functions

[buildSignature](functions/buildSignature.html) [createSender](functions/createSender.html) [createTempFile](functions/createTempFile.html) [importKeyPair](functions/importKeyPair.html) [isEligibleTransaction](functions/isEligibleTransaction.html) [loadChunkedData](functions/loadChunkedData.html) [loadChunkedRaw](functions/loadChunkedRaw.html) [loadContentData](functions/loadContentData.html) [loadFullContent](functions/loadFullContent.html) [loadOffchainContent](functions/loadOffchainContent.html) [loadOnchainContent](functions/loadOnchainContent.html) [loadOnchainDict](functions/loadOnchainDict.html) [loadSnakeData](functions/loadSnakeData.html) [randomAddress](functions/randomAddress.html) [randomKeyPair](functions/randomKeyPair.html) [storeChunkedData](functions/storeChunkedData.html) [storeChunkedRaw](functions/storeChunkedRaw.html) [storeFullContent](functions/storeFullContent.html) [storeOffchainContent](functions/storeOffchainContent.html) [storeOnchainContent](functions/storeOnchainContent.html) [storeOnchainDict](functions/storeOnchainDict.html) [storeSnakeData](functions/storeSnakeData.html) [uuid](functions/uuid.html)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](modules.html)

-   [TransactionParsing](modules/TransactionParsing.html)
    
    -   [parseTransaction](functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](enums/ENDPOINT.html)
-   [AmazonS3](classes/AmazonS3.html)
-   [NftAuction](classes/NftAuction.html)
-   [NftAuctionV2](classes/NftAuctionV2.html)
-   [NftCollection](classes/NftCollection.html)
-   [NftFixedPrice](classes/NftFixedPrice.html)
-   [NftFixedPriceV2](classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](classes/NftFixedPriceV3.html)
-   [NftItem](classes/NftItem.html)
-   [NftItemRoyalty](classes/NftItemRoyalty.html)
-   [NftMarketplace](classes/NftMarketplace.html)
-   [NftOffer](classes/NftOffer.html)
-   [NftSwap](classes/NftSwap.html)
-   [Pinata](classes/Pinata.html)
-   [SbtSingle](classes/SbtSingle.html)
-   [Storage](classes/Storage.html)
-   [TonNftClient](classes/TonNftClient.html)
-   [ClientInterface](interfaces/ClientInterface.html)
-   [CollectionMintItemInput](types/CollectionMintItemInput.html)
-   [NftAuctionData](types/NftAuctionData.html)
-   [NftAuctionV2Data](types/NftAuctionV2Data.html)
-   [NftCollectionData](types/NftCollectionData.html)
-   [NftFixPriceSaleData](types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](types/NftFixPriceSaleV3Data.html)
-   [NftItemData](types/NftItemData.html)
-   [NftMarketplaceData](types/NftMarketplaceData.html)
-   [NftMint](types/NftMint.html)
-   [NftOfferData](types/NftOfferData.html)
-   [OwnershipTransfer](types/OwnershipTransfer.html)
-   [RoyaltyParams](types/RoyaltyParams.html)
-   [SbtSingleData](types/SbtSingleData.html)
-   [SwapData](types/SwapData.html)
-   [OperationCodes](variables/OperationCodes.html)
-   [SwapState](variables/SwapState.html)
-   [buildSignature](functions/buildSignature.html)
-   [createSender](functions/createSender.html)
-   [createTempFile](functions/createTempFile.html)
-   [importKeyPair](functions/importKeyPair.html)
-   [isEligibleTransaction](functions/isEligibleTransaction.html)
-   [loadChunkedData](functions/loadChunkedData.html)
-   [loadChunkedRaw](functions/loadChunkedRaw.html)
-   [loadContentData](functions/loadContentData.html)
-   [loadFullContent](functions/loadFullContent.html)
-   [loadOffchainContent](functions/loadOffchainContent.html)
-   [loadOnchainContent](functions/loadOnchainContent.html)
-   [loadOnchainDict](functions/loadOnchainDict.html)
-   [loadSnakeData](functions/loadSnakeData.html)
-   [randomAddress](functions/randomAddress.html)
-   [randomKeyPair](functions/randomKeyPair.html)
-   [storeChunkedData](functions/storeChunkedData.html)
-   [storeChunkedRaw](functions/storeChunkedRaw.html)
-   [storeFullContent](functions/storeFullContent.html)
-   [storeOffchainContent](functions/storeOffchainContent.html)
-   [storeOnchainContent](functions/storeOnchainContent.html)
-   [storeOnchainDict](functions/storeOnchainDict.html)
-   [storeSnakeData](functions/storeSnakeData.html)
-   [uuid](functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 123, Images: 0, Headings: 12, Paragraphs: 15



================================================
FILE: docs/modules/TransactionParsing.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/modules/TransactionParsing.html
================================================
[HTML Document converted to Markdown]

File: TransactionParsing.html
Size: 23.45 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

TransactionParsing | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [TransactionParsing](TransactionParsing.html)

# Namespace TransactionParsing

-   Defined in [transaction-parsing/index.ts:1](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/transaction-parsing/index.ts#L1)

### Index

### Functions

[parseTransaction](../functions/TransactionParsing.parseTransaction.html)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: TransactionParsing | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 68, Images: 0, Headings: 6, Paragraphs: 15



================================================
FILE: docs/types/CollectionMintItemInput.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/CollectionMintItemInput.html
================================================
[HTML Document converted to Markdown]

File: CollectionMintItemInput.html
Size: 24.71 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

CollectionMintItemInput | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)

# Type alias CollectionMintItemInput

CollectionMintItemInput: {  
    content: string;  
    index: number;  
    ownerAddress: Address;  
    passAmount: bigint;  
}

#### Type declaration

-   ##### content: string
    
-   ##### index: number
    
-   ##### ownerAddress: Address
    
-   ##### passAmount: bigint
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:7](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L7)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: CollectionMintItemInput | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 9, Paragraphs: 15



================================================
FILE: docs/types/NftAuctionData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftAuctionData.html
================================================
[HTML Document converted to Markdown]

File: NftAuctionData.html
Size: 30.54 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftAuctionData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftAuctionData](NftAuctionData.html)

# Type alias NftAuctionData

NftAuctionData: {  
    activated: boolean;  
    createdAtTimestamp: number;  
    end: boolean;  
    endTimestamp: number;  
    marketplaceAddress: Address;  
    marketplaceFeeAddress: Address;  
    marketplaceFeeBase: bigint;  
    marketplaceFeeFactor: bigint;  
    maxBid: bigint;  
    minBid: bigint;  
    minStep: bigint;  
    nftAddress: Address;  
    nftOwnerAddress: Address | null;  
    royaltyAddress: Address;  
    royaltyBase: bigint;  
    royaltyFactor: bigint;  
    stepTimeSeconds: number;  
    tryStepTimeSeconds: number;  
}

Type representing the data for an NFT auction contract version 2.

#### Type declaration

-   ##### activated: boolean
    
-   ##### createdAtTimestamp: number
    
-   ##### end: boolean
    
-   ##### endTimestamp: number
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### marketplaceFeeBase: bigint
    
-   ##### marketplaceFeeFactor: bigint
    
-   ##### maxBid: bigint
    
-   ##### minBid: bigint
    
-   ##### minStep: bigint
    
-   ##### nftAddress: Address
    
-   ##### nftOwnerAddress: Address | null
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyBase: bigint
    
-   ##### royaltyFactor: bigint
    
-   ##### stepTimeSeconds: number
    
-   ##### tryStepTimeSeconds: number
    

-   Defined in [wrappers/getgems/NftAuction/NftAuction.ts:248](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuction/NftAuction.ts#L248)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftAuctionData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 23, Paragraphs: 16



================================================
FILE: docs/types/NftAuctionV2Data.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftAuctionV2Data.html
================================================
[HTML Document converted to Markdown]

File: NftAuctionV2Data.html
Size: 30.56 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftAuctionV2Data | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)

# Type alias NftAuctionV2Data

NftAuctionV2Data: {  
    activated: boolean;  
    createdAtTimestamp: number;  
    end: boolean;  
    endTimestamp: number;  
    marketplaceAddress: Address;  
    marketplaceFeeAddress: Address;  
    marketplaceFeeBase: bigint;  
    marketplaceFeeFactor: bigint;  
    maxBid: bigint;  
    minBid: bigint;  
    minStep: bigint;  
    nftAddress: Address;  
    nftOwnerAddress: Address | null;  
    royaltyAddress: Address;  
    royaltyBase: bigint;  
    royaltyFactor: bigint;  
    stepTimeSeconds: number;  
    tryStepTimeSeconds: number;  
}

Type representing the data for an NFT auction contract version 2.

#### Type declaration

-   ##### activated: boolean
    
-   ##### createdAtTimestamp: number
    
-   ##### end: boolean
    
-   ##### endTimestamp: number
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### marketplaceFeeBase: bigint
    
-   ##### marketplaceFeeFactor: bigint
    
-   ##### maxBid: bigint
    
-   ##### minBid: bigint
    
-   ##### minStep: bigint
    
-   ##### nftAddress: Address
    
-   ##### nftOwnerAddress: Address | null
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyBase: bigint
    
-   ##### royaltyFactor: bigint
    
-   ##### stepTimeSeconds: number
    
-   ##### tryStepTimeSeconds: number
    

-   Defined in [wrappers/getgems/NftAuctionV2/NftAuctionV2.ts:193](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts#L193)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftAuctionV2Data | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 23, Paragraphs: 16



================================================
FILE: docs/types/NftCollectionData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftCollectionData.html
================================================
[HTML Document converted to Markdown]

File: NftCollectionData.html
Size: 25.89 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftCollectionData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftCollectionData](NftCollectionData.html)

# Type alias NftCollectionData

NftCollectionData: {  
    collectionContent: string;  
    commonContent: string;  
    nextItemIndex: number | bigint;  
    nftItemCode: Cell;  
    ownerAddress: Address;  
    royaltyParams: [RoyaltyParams](RoyaltyParams.html);  
}

Type definition for the data of an NFT collection.

#### Type declaration

-   ##### collectionContent: string
    
-   ##### commonContent: string
    
-   ##### nextItemIndex: number | bigint
    
-   ##### nftItemCode: Cell
    
-   ##### ownerAddress: Address
    
-   ##### royaltyParams: [RoyaltyParams](RoyaltyParams.html)
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:251](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L251)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftCollectionData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 69, Images: 0, Headings: 11, Paragraphs: 16



================================================
FILE: docs/types/NftFixPriceSaleData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftFixPriceSaleData.html
================================================
[HTML Document converted to Markdown]

File: NftFixPriceSaleData.html
Size: 26.64 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixPriceSaleData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)

# Type alias NftFixPriceSaleData

NftFixPriceSaleData: {  
    fullPrice: bigint;  
    marketplaceAddress: Address;  
    marketplaceFee: bigint;  
    marketplaceFeeAddress: Address;  
    nftAddress: Address;  
    nftOwnerAddress: Address | null;  
    royaltyAddress: Address;  
    royaltyAmount: bigint;  
}

Type definition for the data of an NFT fixed price sale.

#### Type declaration

-   ##### fullPrice: bigint
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceFee: bigint
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### nftAddress: Address
    
-   ##### nftOwnerAddress: Address | null
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyAmount: bigint
    

-   Defined in [wrappers/getgems/NftFixedPrice/NftFixedPrice.ts:114](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts#L114)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixPriceSaleData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 13, Paragraphs: 16



================================================
FILE: docs/types/NftFixPriceSaleV2Data.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftFixPriceSaleV2Data.html
================================================
[HTML Document converted to Markdown]

File: NftFixPriceSaleV2Data.html
Size: 27.45 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixPriceSaleV2Data | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)

# Type alias NftFixPriceSaleV2Data

NftFixPriceSaleV2Data: {  
    createdAt: number;  
    fullPrice: bigint;  
    isComplete: boolean;  
    marketplaceAddress: Address;  
    marketplaceFee: bigint;  
    marketplaceFeeAddress: Address;  
    nftAddress: Address;  
    nftOwnerAddress: Address | null;  
    royaltyAddress: Address;  
    royaltyAmount: bigint;  
}

Type definition for the data of an NFT fixed price sale, version 2.

#### Type declaration

-   ##### createdAt: number
    
-   ##### fullPrice: bigint
    
-   ##### isComplete: boolean
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceFee: bigint
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### nftAddress: Address
    
-   ##### nftOwnerAddress: Address | null
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyAmount: bigint
    

-   Defined in [wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts:181](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts#L181)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixPriceSaleV2Data | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 15, Paragraphs: 16



================================================
FILE: docs/types/NftFixPriceSaleV3Data.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftFixPriceSaleV3Data.html
================================================
[HTML Document converted to Markdown]

File: NftFixPriceSaleV3Data.html
Size: 27.91 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftFixPriceSaleV3Data | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)

# Type alias NftFixPriceSaleV3Data

NftFixPriceSaleV3Data: {  
    canDeployByExternal?: boolean;  
    createdAt: number;  
    fullPrice: bigint;  
    isComplete: boolean;  
    marketplaceAddress: Address;  
    marketplaceFee: bigint;  
    marketplaceFeeAddress: Address;  
    nftAddress: Address;  
    nftOwnerAddress: Address | null;  
    royaltyAddress: Address;  
    royaltyAmount: bigint;  
}

Type definition for the data of an NFT fixed price sale.

#### Type declaration

-   ##### `Optional` canDeployByExternal?: boolean
    
-   ##### createdAt: number
    
-   ##### fullPrice: bigint
    
-   ##### isComplete: boolean
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceFee: bigint
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### nftAddress: Address
    
-   ##### nftOwnerAddress: Address | null
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyAmount: bigint
    

-   Defined in [wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts:180](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts#L180)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftFixPriceSaleV3Data | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 16, Paragraphs: 16



================================================
FILE: docs/types/NftItemData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftItemData.html
================================================
[HTML Document converted to Markdown]

File: NftItemData.html
Size: 24.91 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftItemData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftItemData](NftItemData.html)

# Type alias NftItemData

NftItemData: {  
    collectionAddress: Address | null;  
    content: string;  
    index: number;  
    ownerAddress: Address;  
}

Type definition for the data of an NFT item.

#### Type declaration

-   ##### collectionAddress: Address | null
    
-   ##### content: string
    
-   ##### index: number
    
-   ##### ownerAddress: Address
    

-   Defined in [wrappers/getgems/NftItem/NftItem.ts:118](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftItem/NftItem.ts#L118)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftItemData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 9, Paragraphs: 16



================================================
FILE: docs/types/NftMarketplaceData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftMarketplaceData.html
================================================
[HTML Document converted to Markdown]

File: NftMarketplaceData.html
Size: 24.40 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftMarketplaceData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftMarketplaceData](NftMarketplaceData.html)

# Type alias NftMarketplaceData

NftMarketplaceData: {  
    publicKey: Buffer;  
    seqno: number;  
    subwallet: number;  
}

Type definition for the data of an NFT marketplace.

#### Type declaration

-   ##### publicKey: Buffer
    
-   ##### seqno: number
    
-   ##### subwallet: number
    

-   Defined in [wrappers/getgems/NftMarketplace/NftMarketplace.ts:111](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftMarketplace/NftMarketplace.ts#L111)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftMarketplaceData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 8, Paragraphs: 16



================================================
FILE: docs/types/NftMint.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftMint.html
================================================
[HTML Document converted to Markdown]

File: NftMint.html
Size: 26.54 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftMint | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftMint](NftMint.html)

# Type alias NftMint

NftMint: {  
    from?: Address | Maybe<ExternalAddress\>;  
    itemIndex: number;  
    nftItemMessage: Cell;  
    passAmount: bigint;  
    queryId: number;  
    to?: Address | Maybe<ExternalAddress\>;  
}

Type definition for the data of an NFT mint transaction.

#### Type declaration

-   ##### `Optional` from?: Address | Maybe<ExternalAddress\>
    
-   ##### itemIndex: number
    
-   ##### nftItemMessage: Cell
    
-   ##### passAmount: bigint
    
-   ##### queryId: number
    
-   ##### `Optional` to?: Address | Maybe<ExternalAddress\>
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:263](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L263)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftMint | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 11, Paragraphs: 16



================================================
FILE: docs/types/NftOfferData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/NftOfferData.html
================================================
[HTML Document converted to Markdown]

File: NftOfferData.html
Size: 28.34 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

NftOfferData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [NftOfferData](NftOfferData.html)

# Type alias NftOfferData

NftOfferData: {  
    createdAt: number;  
    finishAt: number;  
    fullPrice: bigint;  
    isComplete: boolean;  
    marketplaceAddress: Address;  
    marketplaceBase: number;  
    marketplaceFactor: number;  
    marketplaceFeeAddress: Address;  
    nftAddress: Address;  
    offerOwnerAddress: Address;  
    royaltyAddress: Address;  
    royaltyBase: number;  
    royaltyFactor: number;  
}

Type definition for the data of an NFT offer.

#### Type declaration

-   ##### createdAt: number
    
-   ##### finishAt: number
    
-   ##### fullPrice: bigint
    
-   ##### isComplete: boolean
    
-   ##### marketplaceAddress: Address
    
-   ##### marketplaceBase: number
    
-   ##### marketplaceFactor: number
    
-   ##### marketplaceFeeAddress: Address
    
-   ##### nftAddress: Address
    
-   ##### offerOwnerAddress: Address
    
-   ##### royaltyAddress: Address
    
-   ##### royaltyBase: number
    
-   ##### royaltyFactor: number
    

-   Defined in [wrappers/getgems/NftOffer/NftOffer.ts:195](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftOffer/NftOffer.ts#L195)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: NftOfferData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 18, Paragraphs: 16



================================================
FILE: docs/types/OwnershipTransfer.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/OwnershipTransfer.html
================================================
[HTML Document converted to Markdown]

File: OwnershipTransfer.html
Size: 24.94 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

OwnershipTransfer | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [OwnershipTransfer](OwnershipTransfer.html)

# Type alias OwnershipTransfer

OwnershipTransfer: {  
    newOwner: Address;  
    oldOwner?: Address | Maybe<ExternalAddress\>;  
    queryId: number;  
}

Type definition for the data of an ownership transfer transaction.

#### Type declaration

-   ##### newOwner: Address
    
-   ##### `Optional` oldOwner?: Address | Maybe<ExternalAddress\>
    
-   ##### queryId: number
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:275](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L275)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: OwnershipTransfer | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 8, Paragraphs: 16



================================================
FILE: docs/types/RoyaltyParams.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/RoyaltyParams.html
================================================
[HTML Document converted to Markdown]

File: RoyaltyParams.html
Size: 24.30 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

RoyaltyParams | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [RoyaltyParams](RoyaltyParams.html)

# Type alias RoyaltyParams

RoyaltyParams: {  
    royaltyAddress: Address;  
    royaltyBase: number;  
    royaltyFactor: number;  
}

#### Type declaration

-   ##### royaltyAddress: Address
    
-   ##### royaltyBase: number
    
-   ##### royaltyFactor: number
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:14](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L14)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: RoyaltyParams | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 8, Paragraphs: 15



================================================
FILE: docs/types/SbtSingleData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/SbtSingleData.html
================================================
[HTML Document converted to Markdown]

File: SbtSingleData.html
Size: 25.24 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

SbtSingleData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [SbtSingleData](SbtSingleData.html)

# Type alias SbtSingleData

SbtSingleData: {  
    authorityAddress: Address;  
    content: string;  
    editorAddress: Address;  
    ownerAddress: Address;  
    revokedAt?: number;  
}

Represents the data required to create a new SbtSingle contract.

#### Type declaration

-   ##### authorityAddress: Address
    
-   ##### content: string
    
-   ##### editorAddress: Address
    
-   ##### ownerAddress: Address
    
-   ##### `Optional` revokedAt?: number
    

-   Defined in [wrappers/getgems/SbtSingle/SbtSingle.ts:215](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/SbtSingle/SbtSingle.ts#L215)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: SbtSingleData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 10, Paragraphs: 16



================================================
FILE: docs/types/SwapData.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/types/SwapData.html
================================================
[HTML Document converted to Markdown]

File: SwapData.html
Size: 28.45 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

SwapData | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [SwapData](SwapData.html)

# Type alias SwapData

SwapData: {  
    commissionAddress: Address;  
    leftAddress: Address;  
    leftAmount: bigint;  
    leftCoinsGot: bigint;  
    leftCommission: bigint;  
    leftNft: NFTItem\[\];  
    rightAddress: Address;  
    rightAmount: bigint;  
    rightCoinsGot: bigint;  
    rightCommission: bigint;  
    rightNft: NFTItem\[\];  
    state: number;  
    supervisorAddress: Address;  
}

SwapData represents the information of a swap operation.

#### Type declaration

-   ##### commissionAddress: Address
    
-   ##### leftAddress: Address
    
-   ##### leftAmount: bigint
    
-   ##### leftCoinsGot: bigint
    
-   ##### leftCommission: bigint
    
-   ##### leftNft: NFTItem\[\]
    
-   ##### rightAddress: Address
    
-   ##### rightAmount: bigint
    
-   ##### rightCoinsGot: bigint
    
-   ##### rightCommission: bigint
    
-   ##### rightNft: NFTItem\[\]
    
-   ##### state: number
    
-   ##### supervisorAddress: Address
    

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:37](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L37)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](CollectionMintItemInput.html)
-   [NftAuctionData](NftAuctionData.html)
-   [NftAuctionV2Data](NftAuctionV2Data.html)
-   [NftCollectionData](NftCollectionData.html)
-   [NftFixPriceSaleData](NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](NftFixPriceSaleV3Data.html)
-   [NftItemData](NftItemData.html)
-   [NftMarketplaceData](NftMarketplaceData.html)
-   [NftMint](NftMint.html)
-   [NftOfferData](NftOfferData.html)
-   [OwnershipTransfer](OwnershipTransfer.html)
-   [RoyaltyParams](RoyaltyParams.html)
-   [SbtSingleData](SbtSingleData.html)
-   [SwapData](SwapData.html)
-   [OperationCodes](../variables/OperationCodes.html)
-   [SwapState](../variables/SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: SwapData | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 18, Paragraphs: 16



================================================
FILE: docs/variables/OperationCodes.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/variables/OperationCodes.html
================================================
[HTML Document converted to Markdown]

File: OperationCodes.html
Size: 25.68 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

OperationCodes | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [OperationCodes](OperationCodes.html)

# Variable OperationCodes`Const`

OperationCodes: {  
    BatchMint: number;  
    ChangeOwner: number;  
    EditContent: number;  
    GetRoyaltyParams: number;  
    GetRoyaltyParamsResponse: number;  
    Mint: number;  
} = ...

#### Type declaration

-   ##### BatchMint: number
    
-   ##### ChangeOwner: number
    
-   ##### EditContent: number
    
-   ##### GetRoyaltyParams: number
    
-   ##### GetRoyaltyParamsResponse: number
    
-   ##### Mint: number
    

-   Defined in [wrappers/getgems/NftCollection/NftCollection.ts:20](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftCollection/NftCollection.ts#L20)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](OperationCodes.html)
-   [SwapState](SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: OperationCodes | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 11, Paragraphs: 15



================================================
FILE: docs/variables/SwapState.html
URL: https://github.com/ton-community/nft-sdk/blob/main/docs/variables/SwapState.html
================================================
[HTML Document converted to Markdown]

File: SwapState.html
Size: 24.51 KB
Modified: Thu Jun 26 2025 16:13:33 GMT+0400 (Georgia Standard Time)

Converted Markdown Content:
==================================================

SwapState | nft-sdkdocument.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os"

-   Preparing search index...
-   The search index is not available

[nft-sdk](../index.html)

[](#)

-   [nft-sdk](../modules.html)
-   [SwapState](SwapState.html)

# Variable SwapState`Const`

SwapState: {  
    Active: number;  
    Cancelled: number;  
    Completed: number;  
} = ...

SwapState represents the different states of a swap.

#### Type declaration

-   ##### Active: number
    
-   ##### Cancelled: number
    
-   ##### Completed: number
    

-   Defined in [wrappers/getgems/NftSwap/NftSwap.ts:20](https://github.com/ton-community/nft-sdk/blob/cc935a3/src/wrappers/getgems/NftSwap/NftSwap.ts#L20)

### Settings

#### Member Visibility

-   Protected
-   Private
-   Inherited
-   External

#### Theme

OSLightDark

[nft-sdk](../modules.html)

-   [TransactionParsing](../modules/TransactionParsing.html)
    
    -   [parseTransaction](../functions/TransactionParsing.parseTransaction.html)
    
-   [ENDPOINT](../enums/ENDPOINT.html)
-   [AmazonS3](../classes/AmazonS3.html)
-   [NftAuction](../classes/NftAuction.html)
-   [NftAuctionV2](../classes/NftAuctionV2.html)
-   [NftCollection](../classes/NftCollection.html)
-   [NftFixedPrice](../classes/NftFixedPrice.html)
-   [NftFixedPriceV2](../classes/NftFixedPriceV2.html)
-   [NftFixedPriceV3](../classes/NftFixedPriceV3.html)
-   [NftItem](../classes/NftItem.html)
-   [NftItemRoyalty](../classes/NftItemRoyalty.html)
-   [NftMarketplace](../classes/NftMarketplace.html)
-   [NftOffer](../classes/NftOffer.html)
-   [NftSwap](../classes/NftSwap.html)
-   [Pinata](../classes/Pinata.html)
-   [SbtSingle](../classes/SbtSingle.html)
-   [Storage](../classes/Storage.html)
-   [TonNftClient](../classes/TonNftClient.html)
-   [ClientInterface](../interfaces/ClientInterface.html)
-   [CollectionMintItemInput](../types/CollectionMintItemInput.html)
-   [NftAuctionData](../types/NftAuctionData.html)
-   [NftAuctionV2Data](../types/NftAuctionV2Data.html)
-   [NftCollectionData](../types/NftCollectionData.html)
-   [NftFixPriceSaleData](../types/NftFixPriceSaleData.html)
-   [NftFixPriceSaleV2Data](../types/NftFixPriceSaleV2Data.html)
-   [NftFixPriceSaleV3Data](../types/NftFixPriceSaleV3Data.html)
-   [NftItemData](../types/NftItemData.html)
-   [NftMarketplaceData](../types/NftMarketplaceData.html)
-   [NftMint](../types/NftMint.html)
-   [NftOfferData](../types/NftOfferData.html)
-   [OwnershipTransfer](../types/OwnershipTransfer.html)
-   [RoyaltyParams](../types/RoyaltyParams.html)
-   [SbtSingleData](../types/SbtSingleData.html)
-   [SwapData](../types/SwapData.html)
-   [OperationCodes](OperationCodes.html)
-   [SwapState](SwapState.html)
-   [buildSignature](../functions/buildSignature.html)
-   [createSender](../functions/createSender.html)
-   [createTempFile](../functions/createTempFile.html)
-   [importKeyPair](../functions/importKeyPair.html)
-   [isEligibleTransaction](../functions/isEligibleTransaction.html)
-   [loadChunkedData](../functions/loadChunkedData.html)
-   [loadChunkedRaw](../functions/loadChunkedRaw.html)
-   [loadContentData](../functions/loadContentData.html)
-   [loadFullContent](../functions/loadFullContent.html)
-   [loadOffchainContent](../functions/loadOffchainContent.html)
-   [loadOnchainContent](../functions/loadOnchainContent.html)
-   [loadOnchainDict](../functions/loadOnchainDict.html)
-   [loadSnakeData](../functions/loadSnakeData.html)
-   [randomAddress](../functions/randomAddress.html)
-   [randomKeyPair](../functions/randomKeyPair.html)
-   [storeChunkedData](../functions/storeChunkedData.html)
-   [storeChunkedRaw](../functions/storeChunkedRaw.html)
-   [storeFullContent](../functions/storeFullContent.html)
-   [storeOffchainContent](../functions/storeOffchainContent.html)
-   [storeOnchainContent](../functions/storeOnchainContent.html)
-   [storeOnchainDict](../functions/storeOnchainDict.html)
-   [storeSnakeData](../functions/storeSnakeData.html)
-   [uuid](../functions/uuid.html)

Generated using [TypeDoc](https://typedoc.org/)

==================================================
HTML Metadata:
Title: SwapState | nft-sdk
Description: Documentation for nft-sdk

HTML Statistics:
Links: 67, Images: 0, Headings: 8, Paragraphs: 16



================================================
FILE: examples/TonAPI.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/TonAPI.ts
================================================
import {TonNftClient} from '../src/ton-api'
import {TonAPI} from '../src/ton-api/TonAPI'

async function main() {
    const tonApi = new TonAPI()
    const tonClient = new TonNftClient(
        tonApi
    )

    // Telegram Number Collection
    const collection = await tonClient.getNftCollection('EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N')

    // Prints the Collection Data
    console.log(collection)

    // NFT Collections
    const collections = await tonClient.getNftCollections(
        10,
        10
    )

    // Prints the Collection Data
    console.log(collections)

    // Get NFT items from collection by collection address
    const items = await tonClient.getNftItems('EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N',10,10)

    // Prints the Collection Data
    console.log(items)

    // Get NFT item by its address
    const item = await tonClient.getNftItem('EQBn9d_1SaXIqogjb884eIDlbA3_4lgVv1rl8GyTpQpp_1Oi')

    // Prints the Collection Data
    console.log(item)
}

main()



================================================
FILE: examples/assets/0.jpg
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/assets/0.jpg
================================================
[Binary file blocked: 0.jpg]


================================================
FILE: examples/assets/0.json
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/assets/0.json
================================================
{"name":"Test 1","description":"Test 1","content_url":"https://ton.org/_next/static/media/dimond_1_VP9.29bcaf8e.webm","attributes":[],"image":"https://gateway.pinata.cloud/ipfs/QmQFrrZnqS1VoSgmgtMomLXGr4NRnFjCTdFfemsbaGczQv"}


================================================
FILE: examples/deployNftCollection.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/deployNftCollection.ts
================================================
import {toNano} from 'ton-core'
import {NftCollection} from '../src/wrappers/getgems/NftCollection/NftCollection'
import {NftItem} from '../src/wrappers/getgems/NftItem/NftItem'
import {randomAddress, importKeyPair, createSender} from '../src/utils'
import {ENDPOINT} from '../src'
import { TonClient4 } from 'ton'
import { Storage } from '../src/storage'
import { Pinata } from '../src/storage/Pinata'

async function main() {
    // Config
    const keypair = await importKeyPair('')
    const client = new TonClient4({endpoint: ENDPOINT.TESTNET})
    const wallet = await createSender(keypair, client)
    const address = wallet.address ?? randomAddress()

    // Addresses
    const ownerAddress = address

    // Deploying Assets
    const pinata = new Pinata('<apiKey>', '<secretApiKey>')
    const storage = new Storage(pinata)

    // String [0] - Images
    // String [1] - Json
    const data: [string[], string[]] = await storage.uploadBulk('./assets')

    // Creates NFT Collection
    const nftCollection = client.open(
        await NftCollection.createFromConfig({
            ownerAddress: ownerAddress,
            nextItemIndex: 1,
            collectionContent: data[1][0],
            commonContent: '',
            nftItemCode: NftItem.code,
            royaltyParams: {
                royaltyFactor: 10,
                royaltyBase: 100,
                royaltyAddress: ownerAddress
            }
        })
    )

    // Deploys Nft Collection
    const deployResult = await nftCollection.sendDeploy(wallet, toNano('0.05'))

    // Prints Result
    console.log(deployResult)

    // Fetches Nft Collection Data
    const collectionData = await nftCollection.getCollectionData()

    // Prints Nft Collection Data
    console.log(collectionData)    
}

main()


================================================
FILE: examples/mintNft.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/mintNft.ts
================================================
import {Address, toNano} from 'ton-core'
import {NftCollection} from '../src/wrappers/getgems/NftCollection/NftCollection'
import {randomAddress, importKeyPair, createSender} from '../src/utils'
import {ENDPOINT} from '../src'
import { TonClient4 } from 'ton'
import { Storage } from '../src/storage'
import { Pinata } from '../src/storage/Pinata'

async function main() {
    // Config
    const keypair = await importKeyPair('')
    const client = new TonClient4({endpoint: ENDPOINT.TESTNET})
    const wallet = await createSender(keypair, client)
    const address = wallet.address ?? randomAddress()

    // Addresses
    const ownerAddress = address
    const collectionAddress = Address.parse('')

    // Deploying Assets
    const pinata = new Pinata('<apiKey>', '<secretApiKey>')
    const storage = new Storage(pinata)
    const data: [string[], string[]] = await storage.uploadBulk('./assets')

    // Creates NFT Item
    const nftCollection = client.open(
        await NftCollection.createFromAddress(
            collectionAddress
        )
    )

    // Mints NFT
    const mintResult = await nftCollection.sendMint(
        wallet,
        {
            queryId: 1,
            value: toNano(1),
            passAmount: toNano(1),
            itemIndex: 0,
            itemOwnerAddress: ownerAddress,
            itemContent: data[1][0]
        }
    )

    // Prints Result
    console.log(mintResult)

    // Fetches Nft Data
    const collectionData = await nftCollection.getCollectionData()

    // Prints Nft Data
    console.log(collectionData)    
}

main()


================================================
FILE: examples/transaction-parsing.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/transaction-parsing.ts
================================================
import {Address} from 'ton-core'
import {NftItem} from '../src/wrappers/standard/NftItem'
import { TonClient } from 'ton'
import { getHttpEndpoint } from '@orbs-network/ton-access'

async function main() {
    // Config
    const client = new TonClient({
        endpoint: await getHttpEndpoint()
    })

    // Transfer TX
    const txData = await client.getTransactions(Address.parse('EQCWbV3k8hlLGiFlxPE_RAJDLUpm_WnCCbCxaprvWxh1_AOI'), {
        limit: 10,
        hash: 'odtysMOr5JY0JQ+31TtmzGzldPBH2IMTIL21CAiJ9G8='
    })

    console.log(txData)

    const data = NftItem.parseTransfer(txData[0])

    // Prints Transaction Data
    console.log(data)
}

main()


================================================
FILE: examples/transferNft.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/examples/transferNft.ts
================================================
import {toNano} from 'ton-core'
import {NftItem} from '../src/wrappers/getgems/NftItem/NftItem'
import {randomAddress, importKeyPair, createSender} from '../src/utils'
import {ENDPOINT} from '../src'
import { TonClient4 } from 'ton'

async function main() {
    // Config
    const keypair = await importKeyPair('')
    const client = new TonClient4({endpoint: ENDPOINT.TESTNET})
    const wallet = await createSender(keypair, client)
    const address = wallet.address ?? randomAddress()

    // Addresses
    const ownerAddress = address
    const newOwner = randomAddress()
    const nft = randomAddress()

    // Creates NFT Item Instance
    const nftItem = client.open(
        await NftItem.createFromAddress(
            nft
        )
    )

    // Transfers Nft
    const result = await nftItem.sendTransfer(
        wallet,
        {
            value: toNano(1),
            queryId: BigInt(1),
            newOwner: newOwner,
            responseDestination: ownerAddress,
            forwardAmount: toNano(0)
        }
    )

    // Prints Result
    console.log(result)

    // Fetches Nft Data
    const nftData = await nftItem.getNftData()

    // Prints Nft Data
    console.log(nftData)    
}

main()


================================================
FILE: package.json
URL: https://github.com/ton-community/nft-sdk/blob/main/package.json
================================================
{
  "name": "nft-sdk",
  "version": "0.1.0",
  "description": "NFT SDK for TON",
  "main": "index.js",
  "repository": "https://github.com/ton-community/nft-sdk",
  "author": "Gajesh Naik @Gajesh2007",
  "license": "MIT",
  "scripts": {
    "lint": "eslint ."
  },
  "dependencies": {
    "@orbs-network/ton-access": "^2.3.3",
    "@pinata/sdk": "^2.1.0",
    "@ton-community/blueprint": "^0.9.0",
    "@ton-community/sandbox": "^0.8.0",
    "@ton.org/func-js": "^0.1.3",
    "@types/commander": "^2.3.15-alpha",
    "@types/jest": "^29.5.0",
    "@types/node": "^18.15.10",
    "@types/uuid": "^8.3.4",
    "aws-sdk": "^2.1356.0",
    "buffer": "^6.0.3",
    "chai": "^4.3.6",
    "commander": "^10.0.1",
    "mocha": "^10.2.0",
    "nft.storage": "^7.0.3",
    "node-fetch": "^3.3.1",
    "ton": "latest",
    "ton-compiler": "^2.3.0",
    "ton-contract-executor": "^0.5.2",
    "ton-core": "^0.49.0",
    "typedoc": "^0.24.6",
    "typescript": "^5.0.4",
    "uuid": "^8.3.2"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.59.2",
    "@typescript-eslint/parser": "^5.59.2",
    "eslint": "^8.39.0"
  }
}



================================================
FILE: src/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/index.ts
================================================
// Storage
import {AmazonS3} from './storage/AmazonS3'
import {Pinata} from './storage/Pinata'

// Wrappers
export * from './wrappers/getgems/NftCollection/NftCollection'
export * from './wrappers/getgems/NftItem/NftItem'
export * from './wrappers/getgems/SbtSingle/SbtSingle'
export * from './wrappers/standard/NftItemRoyalty'
export * from './wrappers/getgems/NftAuction/NftAuction'
export * from './wrappers/getgems/NftAuctionV2/NftAuctionV2'
export * from './wrappers/getgems/NftFixedPrice/NftFixedPrice'
export * from './wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2'
export * from './wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3'
export * from './wrappers/getgems/NftMarketplace/NftMarketplace'
export * from './wrappers/getgems/NftOffer/NftOffer'
export * from './wrappers/getgems/NftSwap/NftSwap'

// Utils
export * from './utils'

// Data Encoders & Decoders
export * from './types/Content'

// Transaction Parsing
export * as TransactionParsing from './transaction-parsing/'

export {
    AmazonS3, 
    Pinata
}

export {Storage} from './storage'

// TON API
export * from './ton-api'

// Endpoints
export enum ENDPOINT {
    MAINNET = 'https://toncenter.com/api/v2/jsonRPC',
    TESTNET = 'https://testnet.toncenter.com/api/v2/jsonRPC'
}


================================================
FILE: src/sources/nft-item-editable-DRAFT.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/sources/nft-item-editable-DRAFT.fc
================================================
;;
;;  TON NFT Item Smart Contract
;;

{-

    NOTE that this tokens can be transferred within the same workchain.

    This is suitable for most tokens, if you need tokens transferable between workchains there are two solutions:

    1) use more expensive but universal function below to calculate message forward fee for arbitrary destination (see `misc/forward-fee-calc.cs`)

    2) use token holder proxies in target workchain (that way even 'non-universal' token can be used from any workchain)

-}

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt editor_address
;;

(int, int, slice, slice, cell, slice) load_data() {
    slice ds = get_data().begin_parse();
    var (index, collection_address) = (ds~load_uint(64), ds~load_msg_addr());
    if (ds.slice_bits() > 0) {
      return (-1, index, collection_address, ds~load_msg_addr(), ds~load_ref(),  ds~load_msg_addr());
    } else {
      return (0, index, collection_address, null(), null(), null()); ;; nft not initialized yet
    }
}

() store_data(int index, slice collection_address, slice owner_address, cell content, slice editor_address) impure {
    set_data(
        begin_cell()
            .store_uint(index, 64)
            .store_slice(collection_address)
            .store_slice(owner_address)
            .store_ref(content)
            .store_slice(editor_address)
            .end_cell()
    );
}

() send_msg(slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
    .store_slice(to_address)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op, 32)
    .store_uint(query_id, 64);

  if (~ builder_null?(payload)) {
    msg = msg.store_builder(payload);
  }

  send_raw_message(msg.end_cell(), send_mode);
}

() transfer_ownership(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices(sender_address, owner_address));

    slice new_owner_address = in_msg_body~load_msg_addr();
    force_chain(new_owner_address);
    slice response_destination = in_msg_body~load_msg_addr();
    in_msg_body~load_int(1); ;; this nft don't use custom_payload
    int forward_amount = in_msg_body~load_coins();

    int rest_amount = my_balance - min_tons_for_storage();
    if (forward_amount) {
      rest_amount -= (forward_amount + fwd_fees);
    }
    int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
    if (need_response) {
      rest_amount -= fwd_fees;
    }

    throw_unless(402, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

    if (forward_amount) {
      send_msg(new_owner_address, forward_amount, op::ownership_assigned(), query_id, begin_cell().store_slice(owner_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
    }
    if (need_response) {
      force_chain(response_destination);
      send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
    }

    store_data(index, collection_address, new_owner_address, content, editor_address);
}

() transfer_editorship(int my_balance, int index, slice collection_address, slice owner_address, cell content, slice editor_address, slice sender_address, int query_id, slice in_msg_body, int fwd_fees) impure inline {
    throw_unless(401, equal_slices(sender_address, editor_address));

    slice new_editor_address = in_msg_body~load_msg_addr();
    force_chain(new_editor_address);
    slice response_destination = in_msg_body~load_msg_addr();
    in_msg_body~load_int(1); ;; this nft don't use custom_payload
    int forward_amount = in_msg_body~load_coins();

    int rest_amount = my_balance - min_tons_for_storage();
    if (forward_amount) {
      rest_amount -= (forward_amount + fwd_fees);
    }
    int need_response = response_destination.preload_uint(2) != 0; ;; if NOT addr_none: 00
    if (need_response) {
      rest_amount -= fwd_fees;
    }

    throw_unless(402, rest_amount >= 0); ;; base nft spends fixed amount of gas, will not check for response

    if (forward_amount) {
      send_msg(new_editor_address, forward_amount, op::editorship_assigned(), query_id, begin_cell().store_slice(editor_address).store_slice(in_msg_body), 1);  ;; paying fees, revert on errors
    }
    if (need_response) {
      force_chain(response_destination);
      send_msg(response_destination, rest_amount, op::excesses(), query_id, null(), 1); ;; paying fees, revert on errors
    }

    store_data(index, collection_address, owner_address, content, new_editor_address);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    cs~load_msg_addr(); ;; skip dst
    cs~load_coins(); ;; skip value
    cs~skip_bits(1); ;; skip extracurrency collection
    cs~load_coins(); ;; skip ihr_fee
    int fwd_fee = cs~load_coins(); ;; we use message fwd_fee for estimation of forward_payload costs

    (int init?, int index, slice collection_address, slice owner_address, cell content, slice editor_address) = load_data();
    if (~ init?) {
      throw_unless(405, equal_slices(collection_address, sender_address));
      store_data(index, collection_address, in_msg_body~load_msg_addr(), in_msg_body~load_ref(), in_msg_body~load_msg_addr());
      return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == op::transfer()) {
      transfer_ownership(my_balance, index, collection_address, owner_address, content, editor_address, sender_address, query_id, in_msg_body, fwd_fee);
      return ();
    }
    if (op == op::get_static_data()) {
      send_msg(sender_address, 0, op::report_static_data(), query_id, begin_cell().store_uint(index, 256).store_slice(collection_address), 64);  ;; carry all the remaining value of the inbound message
      return ();
    }
    if (op == op::transfer_editorship()) {
      transfer_editorship(my_balance, index, collection_address, owner_address, content, editor_address, sender_address, query_id, in_msg_body, fwd_fee);
      return ();
    }
    if (op == op::edit_content()) {
      throw_unless(410, equal_slices(sender_address, editor_address));
      store_data(index, collection_address, owner_address, in_msg_body~load_ref(), editor_address);
      return ();
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
  (int init?, int index, slice collection_address, slice owner_address, cell content, _) = load_data();
  return (init?, index, collection_address, owner_address, content);
}

slice get_editor() method_id {
  (_, _, _, _, _, slice editor_address) = load_data();
  return editor_address;
}


================================================
FILE: src/sources/nft-marketplace-v2.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/sources/nft-marketplace-v2.fc
================================================
;; NFT marketplace smart contract v2
;; Extends wallet v3r2 & adds ability to deploy sales

;;
;; storage scheme
;;
;; storage#_ seqno:uint32 subwallet:uint32 public_key:uint25
;;           = Storage;
;;
_ load_data() {
    var ds = get_data().begin_parse();
    return (
        ds~load_uint(32),   ;; seqno
        ds~load_uint(32),   ;; subwallet
        ds~load_uint(256)   ;; public_key
    );
}

() store_data(var data) impure {
    (
        int seqno,
        int subwallet,
        int public_key
    ) = data;

    set_data(
        begin_cell()
            .store_uint(seqno, 32)
            .store_uint(subwallet, 32)
            .store_uint(public_key, 256)
            .end_cell()
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();
    var (seqno, subwallet, public_key) = load_data();

    int op = in_msg_body~load_uint(32);

    if (op == 1) { ;; deploy new signed sale
        var signature = in_msg_body~load_bits(512);
        throw_unless(35, check_signature(slice_hash(in_msg_body), signature, public_key));

        (cell state_init, cell body) = (in_msg_body~load_ref(), in_msg_body~load_ref());

        int state_init_hash = cell_hash(state_init);
        slice dest_address = begin_cell().store_int(0, 8).store_uint(state_init_hash, 256).end_cell().begin_parse();

        var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_uint(4, 3).store_slice(dest_address)
            .store_grams(0)
            .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
            .store_ref(state_init)
            .store_ref(body);

        send_raw_message(msg.end_cell(), 64); ;; carry remaining value of message
        return ();
    }

    return ();
}

() recv_external(slice in_msg) impure {
    var signature = in_msg~load_bits(512);
    var cs = in_msg;
    var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
    throw_if(35, valid_until <= now());
    var (seqno, subwallet, public_key) = load_data();
    throw_unless(33, msg_seqno == seqno);
    throw_unless(34, subwallet_id == subwallet);
    throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
    accept_message();
    cs~touch();
    while (cs.slice_refs()) {
        var mode = cs~load_uint(8);
        send_raw_message(cs~load_ref(), mode);
    }

    store_data(
        seqno + 1,
        subwallet,
        public_key
    );
}

;; Get methods

int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}

int get_public_key() method_id {
    var cs = get_data().begin_parse();
    cs~load_uint(64);
    return cs.preload_uint(256);
}


================================================
FILE: src/sources/nft-sale.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/sources/nft-sale.fc
================================================
;; NFT sale smart contract

int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON

(slice, slice, slice, int, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return
    (ds~load_msg_addr(), ;; marketplace_address
      ds~load_msg_addr(), ;; nft_address
      ds~load_msg_addr(),  ;; nft_owner_address
      ds~load_coins(), ;; full_price
      ds~load_ref() ;; fees_cell
     );
}

(int, slice, int) load_fees(cell fees_cell) inline {
  var ds = fees_cell.begin_parse();
  return
    (ds~load_coins(), ;; marketplace_fee,
      ds~load_msg_addr(), ;; royalty_address
      ds~load_coins() ;; royalty_amount
     );
}


() save_data(slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
  set_data(begin_cell()
    .store_slice(marketplace_address)
    .store_slice(nft_address)
    .store_slice(nft_owner_address)
    .store_coins(full_price)
    .store_ref(fees_cell)
    .end_cell());
}

() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(nft_owner_address)
           .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);


  var royalty_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(royalty_address)
           .store_coins(royalty_amount)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(royalty_msg.end_cell(), 1);


  var marketplace_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(marketplace_address)
           .store_coins(marketplace_fee)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(marketplace_msg.end_cell(), 1);

  var nft_msg = begin_cell()
           .store_uint(0x18, 6)
           .store_slice(nft_address)
           .store_coins(0)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
           .store_uint(op::transfer(), 32)
           .store_uint(query_id, 64)
           .store_slice(sender_address) ;; new_owner_address
           .store_slice(sender_address) ;; response_address
           .store_int(0, 1) ;; empty custom_payload
           .store_coins(0) ;; forward amount to new_owner_address
           .store_int(0, 1); ;; empty forward_payload


  send_raw_message(nft_msg.end_cell(), 128 + 32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {  ;; ignore all bounced messages
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();

    var is_initialized = nft_owner_address.slice_bits() > 2; ;; not initialized if null address

    if (~ is_initialized) {

      if (equal_slices(sender_address, marketplace_address)) {
         return (); ;; just accept coins on deploy
      }

      throw_unless(500, equal_slices(sender_address, nft_address));
      int op = in_msg_body~load_uint(32);
      throw_unless(501, op == op::ownership_assigned());
      int query_id = in_msg_body~load_uint(64);
      slice prev_owner_address = in_msg_body~load_msg_addr();

      save_data(marketplace_address, nft_address, prev_owner_address, full_price, fees_cell);

      return ();

    }

    if (in_msg_body.slice_empty?()) {
        buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, 0);
        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == 1) { ;; just accept coins
        return ();
    }

    if (op == 2) { ;; buy

      buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, query_id);

      return ();

    }

    if (op == 3) { ;; cancel sale
         throw_unless(457, msg_value >= min_gas_amount());
         throw_unless(458, equal_slices(sender_address, nft_owner_address) | equal_slices(sender_address, marketplace_address));

         var msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(nft_address)
           .store_coins(0)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
           .store_uint(op::transfer(), 32)
           .store_uint(query_id, 64)
           .store_slice(nft_owner_address) ;; new_owner_address
           .store_slice(nft_owner_address) ;; response_address;
           .store_int(0, 1) ;; empty custom_payload
           .store_coins(0) ;; forward amount to new_owner_address
           .store_int(0, 1); ;; empty forward_payload

        send_raw_message(msg.end_cell(), 128 + 32);

        return ();
    }

    throw(0xffff);

}

() recv_external(slice in_msg) impure {
}

(slice, slice, slice, int, int, slice, int) get_sale_data() method_id {
  var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();
  var (marketplace_fee, royalty_address, royalty_amount) = load_fees(fees_cell);
  return (marketplace_address, nft_address, nft_owner_address, full_price, marketplace_fee, royalty_address, royalty_amount);
}


================================================
FILE: src/sources/sbt-item.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/sources/sbt-item.fc
================================================
;;
;;  TON SBT Item Smart Contract
;;

int min_tons_for_storage() asm "50000000 PUSHINT"; ;; 0.05 TON

;;
;;  Storage
;;
;;  uint64 index
;;  MsgAddressInt collection_address
;;  MsgAddressInt owner_address
;;  cell content
;;  MsgAddressInt authority_address
;;  uint64 revoked_at
;;

global int storage::index;
global int init?;
global slice storage::collection_address;
global slice storage::owner_address;
global slice storage::authority_address;
global cell storage::content;
global int storage::revoked_at;

() load_data() impure {
    slice ds = get_data().begin_parse();

    storage::index              = ds~load_uint(64);
    storage::collection_address = ds~load_msg_addr();
    init?                       = false;

    if (ds.slice_bits() > 0) {
        init?                      = true;
        storage::owner_address     = ds~load_msg_addr();
        storage::content           = ds~load_ref();
        storage::authority_address = ds~load_msg_addr();
        storage::revoked_at        = ds~load_uint(64);
    }
}

() store_data() impure {
    set_data(
            begin_cell()
                    .store_uint(storage::index, 64)
                    .store_slice(storage::collection_address)
                    .store_slice(storage::owner_address)
                    .store_ref(storage::content)
                    .store_slice(storage::authority_address)
                    .store_uint(storage::revoked_at, 64)
                    .end_cell()
    );
}

() send_msg(int flag, slice to_address, int amount, int op, int query_id, builder payload, int send_mode) impure inline {
    var body = begin_cell().store_uint(op, 32).store_uint(query_id, 64);
    if (~ builder_null?(payload)) {
        body = body.store_builder(payload);
    }

    var msg = begin_cell()
            .store_uint(flag, 6)
            .store_slice(to_address)
            .store_coins(amount)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(body.end_cell());

    send_raw_message(msg.end_cell(), send_mode);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    slice sender_address = cs~load_msg_addr();

    load_data();

    if (~ init?) {
        throw_unless(405, equal_slices(storage::collection_address, sender_address));

        storage::owner_address     = in_msg_body~load_msg_addr();
        storage::content           = in_msg_body~load_ref();
        storage::authority_address = in_msg_body~load_msg_addr();
        storage::revoked_at        = 0;

        store_data();
        return ();
    }

    int op = in_msg_body~load_uint(32);

    if (flags & 1) { ;; route all prove_ownership bounced messages to owner
        ;; first op was 0xffffffff, because of bounced, now we need to read real one
        op = in_msg_body~load_uint(32);

        if (op == op::ownership_proof()) {
            int query_id = in_msg_body~load_uint(64);
            ;; mode 64 = carry all the remaining value of the inbound message
            send_msg(flag::regular(), storage::owner_address, 0, op::ownership_proof_bounced(), query_id, null(), 64);
        }
        return ();
    }

    int query_id = in_msg_body~load_uint(64);

    if (op == op::request_owner()) {
        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
                .store_uint(storage::index, 256)
                .store_slice(sender_address)
                .store_slice(storage::owner_address)
                .store_ref(body)
                .store_uint(storage::revoked_at, 64)
                .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::owner_info(), query_id, msg, 64);
        return ();
    }
    if (op == op::prove_ownership()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        slice dest = in_msg_body~load_msg_addr();
        cell body = in_msg_body~load_ref();
        int with_content = in_msg_body~load_uint(1);

        var msg = begin_cell()
                .store_uint(storage::index, 256)
                .store_slice(storage::owner_address)
                .store_ref(body)
                .store_uint(storage::revoked_at, 64)
                .store_uint(with_content, 1);

        if (with_content != 0) {
            msg = msg.store_ref(storage::content);
        }

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular() | flag::bounce(), dest, 0, op::ownership_proof(), query_id, msg, 64);
        return ();
    }
    if (op == op::get_static_data()) {
        var msg = begin_cell().store_uint(storage::index, 256).store_slice(storage::collection_address);

        ;; mode 64 = carry all the remaining value of the inbound message
        send_msg(flag::regular(), sender_address, 0, op::report_static_data(), query_id, msg, 64);
        return ();
    }
    if (op == op::destroy()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);

        storage::owner_address = null_addr();
        storage::authority_address = null_addr();
        store_data();
        return ();
    }
    if (op == op::revoke()) {
        throw_unless(401, equal_slices(storage::authority_address, sender_address));
        throw_unless(403, storage::revoked_at == 0);

        storage::revoked_at = now();
        store_data();
        return ();
    }
    if (op == op::take_excess()) {
        throw_unless(401, equal_slices(storage::owner_address, sender_address));

        ;; reserve amount for storage
        raw_reserve(min_tons_for_storage(), 0);

        send_msg(flag::regular(), sender_address, 0, op::excesses(), query_id, null(), 128);
        return ();
    }
    if (op == op::transfer()) {
        throw(413);
    }
    throw(0xffff);
}

;;
;;  GET Methods
;;

(int, int, slice, slice, cell) get_nft_data() method_id {
    load_data();
    return (init?, storage::index, storage::collection_address, storage::owner_address, storage::content);
}

slice get_authority_address() method_id {
    load_data();
    return storage::authority_address;
}

int get_revoked_time() method_id {
    load_data();
    return storage::revoked_at;
}


================================================
FILE: src/storage/AmazonS3.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/storage/AmazonS3.ts
================================================
import { S3 } from 'aws-sdk'
import { error } from 'console'
import fs from 'fs'
import path from 'path'
import {ProviderInterface} from './'

/**
 * AmazonS3 is a class that provides utility functions for interacting with Amazon S3.
 */
export class AmazonS3 implements ProviderInterface {
    public s3: S3

    /**
     * Creates an instance of the AmazonS3 class.
     * @param accessKeyId - The access key ID for your AWS account.
     * @param secretAccessKey - The secret access key for your AWS account.
     */
    constructor (
        accessKeyId: string,
        secretAccessKey: string,
        readonly bucketName: string
    ) {
        this.s3 = new S3(
            {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            }
        )
    }

    /**
     * Uploads an image file to an S3 bucket.
     * @param imagePath - The path to the image file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded image.
     */
    async uploadImage(
        imagePath: string
    ): Promise<string> {
        const fileContent = fs.readFileSync(imagePath)

        const params = {
            Bucket: this.bucketName, // Set the bucket name passed as an option or use the default bucket name
            Key: path.basename(imagePath), // File name you want to save as in S3
            Body: fileContent,
            ContentType: 'image/jpeg', // adjust as needed
        }

        await this.s3.upload(params).promise()

        return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`
    }

    /**
     * Uploads multiple image files from a folder to an S3 bucket.
     * @param folderPath - The path to the folder containing the image files.
     * @returns A Promise that resolves to an array of URLs of the uploaded images.
     */
    async uploadImages(
        folderPath: string
    ): Promise<string[]> {
        const files = fs.readdirSync(folderPath)
        const uploadPromises = files.map(file => this.uploadImage(path.join(folderPath, file)))
        return Promise.all(uploadPromises)
    }

    /**
     * Uploads a JSON file to an S3 bucket.
     * @param jsonPath - The path to the JSON file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded JSON file.
     */
    async uploadJson(
        jsonPath: string
    ): Promise<string> {
        const fileContent = fs.readFileSync(jsonPath)

        const params = {
            Bucket: this.bucketName,
            Key: path.basename(jsonPath), // File name you want to save as in S3
            Body: fileContent,
            ContentType: 'application/json', // JSON file mimetype
        }

        await this.s3.upload(params).promise()

        return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`
    }

    /**
     * Uploads multiple JSON files from a folder to an S3 bucket.
     * @param folderPath - The path to the folder containing the JSON files.
     * @returns A Promise that resolves to an array of URLs of the uploaded JSON files.
     */
    async uploadJsonBulk(
        folderPath: string
    ): Promise<string[]> {
        const files = fs.readdirSync(folderPath)
        const uploadPromises = files.map(file => this.uploadJson(path.join(folderPath, file)))
        return Promise.all(uploadPromises)
    }

    /**
     * Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
     * @param assetsFolderPath - The path to the folder containing the image and JSON files.
     * @returns A Promise that resolves to an array of two arrays:
     * - The first array contains the URLs of the uploaded images on IPFS.
     * - The second array contains the URLs of the uploaded JSON files on IPFS.
     */
    async uploadBulk(
        assetsFolderPath: string
    ): Promise<[string[], string[]]> {
        try {
            // Read the directory
            const files = fs.readdirSync(assetsFolderPath)
    
            // Filter and sort image files
            const imageFiles = files
                .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
                .sort((a, b) => parseInt(a) - parseInt(b))
    
            // Process image uploads in ascending order and collect their URLs
            const imageUrls: string[] = []
            const jsonUrls: string[] = []
    
            for (const imageFile of imageFiles) {
                // Read image file
                const imagePath = path.join(assetsFolderPath, imageFile)
    
                // Upload the image to S3
                const imageUrl = await this.uploadImage(imagePath)
                imageUrls.push(imageUrl)
    
                // Read the JSON file with the same filename as the image
                const jsonFilePath = path.join(
                    assetsFolderPath,
                    `${path.parse(imageFile).name}.json`
                )
    
                if (fs.existsSync(jsonFilePath)) {
                    // Upload the JSON file to S3
                    const jsonUrl = await this.uploadJson(jsonFilePath)
                    jsonUrls.push(jsonUrl)
                    console.log(`JSON file uploaded to S3: ${jsonUrl}`)
                } else {
                    error('Metadata not found for', path.parse(imageFile).name)
                }
            }
    
            console.log('All images uploaded successfully!')
            return [imageUrls, jsonUrls]
        } catch (error) {
            console.error('Error uploading images to S3:', error)
            throw error
        }
    }    
}


================================================
FILE: src/storage/Pinata.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/storage/Pinata.ts
================================================
import PinataClient from '@pinata/sdk'
import { error } from 'console'
import fs from 'fs'
import path from 'path'
import { ProviderInterface } from '.'

/**
 * Pinata is a class that provides utility functions for interacting with Pinata for IPFS integration.
 */
export class Pinata implements ProviderInterface {
    private pinata: PinataClient

    /**
     * Creates an instance of the Pinata class.
     * @param apiKey - The API key for Pinata.
     * @param secretApiKey - The secret API key for Pinata.
     */
    constructor (
        apiKey: string,
        secretApiKey: string,
    ) {
        this.pinata = new PinataClient(apiKey, secretApiKey)
    }

    /**
     * Uploads an image file to IPFS using Pinata SDK.
     * @param imagePath - The path to the image file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded image on IPFS.
     */
    async uploadImage(imagePath: string): Promise<string> {
        const fileContent = fs.createReadStream(imagePath)
        const response = await this.pinata.pinFileToIPFS(fileContent)
        return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`
    }
    
    /**
     * Uploads multiple image files from a folder to IPFS using Pinata SDK.
     * @param folderPath - The path to the folder containing the image files.
     * @returns A Promise that resolves to an array of URLs of the uploaded images on IPFS.
     */
    async uploadImages(folderPath: string): Promise<string[]> {
        const files = fs.readdirSync(folderPath)
        const uploadPromises = files.map(file => this.uploadImage(path.join(folderPath, file)))
        return Promise.all(uploadPromises)
    }
    
    /**
     * Uploads a JSON file to IPFS using Pinata SDK.
     * @param jsonPath - The path to the JSON file to be uploaded.
     * @returns A Promise that resolves to the URL of the uploaded JSON file on IPFS.
     */
    async uploadJson(jsonPath: string): Promise<string> {
        const fileContent = fs.readFileSync(jsonPath)
        const jsonData = JSON.parse(fileContent.toString())
        const response = await this.pinata.pinJSONToIPFS(jsonData)
        return `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`
    }
    
    /**
     * Uploads multiple JSON files from a folder to IPFS using Pinata SDK.
     * @param folderPath - The path to the folder containing the JSON files.
     * @returns A Promise that resolves to an array of URLs of the uploaded JSON files on IPFS.
     */
    async uploadJsonBulk(folderPath: string): Promise<string[]> {
        const files = fs.readdirSync(folderPath)
        const uploadPromises = files.map(file => this.uploadJson(path.join(folderPath, file)))
        return Promise.all(uploadPromises)
    }

    /**
     * Uploads images in bulk to IPFS using Pinata SDK in ascending order of file names and returns their URLs.
     * @param assetsFolderPath - The path to the folder containing the image and JSON files.
     * @returns A Promise that resolves to an array of two arrays:
     * - The first array contains the URLs of the uploaded images on IPFS.
     * - The second array contains the URLs of the uploaded JSON files on IPFS.
     */
    async uploadBulk(
        assetsFolderPath: string
    ): Promise<[string[], string[]]> {
        try {
            // Read the directory
            const files = fs.readdirSync(assetsFolderPath)
        
            // Filter and sort image files
            const imageFiles = files
                .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
                .sort((a, b) => parseInt(a) - parseInt(b))
        
            // Process image uploads in ascending order and collect their URLs
            const imageUrls: string[] = []

            const jsonUrls: string[] = []
        
            for (const imageFile of imageFiles) {
                // Read image file
                const imagePath = path.join(assetsFolderPath, imageFile)
                const imageData = fs.createReadStream(imagePath)
        
                // Upload the image to IPFS using Pinata SDK
                const result = await this.pinata.pinFileToIPFS(imageData, {
                    pinataMetadata: {
                        name: imageFile,
                    },
                })
        
                // Add the image URL to the array
                const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
                imageUrls.push(ipfsUrl)
        
                // Read the JSON file with the same filename as the image
                const jsonFilePath = path.join(
                    assetsFolderPath,
                    `${path.parse(imageFile).name}.json`
                )
        
                if (fs.existsSync(jsonFilePath)) {
                    const jsonFile = fs.readFileSync(jsonFilePath, 'utf8')
                    const jsonData = JSON.parse(jsonFile)
            
                    // Add the IPFS URL to the JSON data
                    jsonData.image = ipfsUrl
            
                    // Write the updated JSON data to the file
                    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData))

                    // Upload the JSON file to IPFS using Pinata SDK
                    const jsonFileData = fs.createReadStream(
                        jsonFilePath
                    )
                
                    const jsonResult = await this.pinata.pinFileToIPFS(jsonFileData, {
                        pinataMetadata: {
                            name: `${path.parse(imageFile).name}.json`,
                        },
                    })
                
                    const jsonUrl = `https://gateway.pinata.cloud/ipfs/${jsonResult.IpfsHash}`
                    jsonUrls.push(jsonUrl)
                    console.log(`JSON file uploaded to IPFS: ${jsonUrl}`)
                } else {
                    error('Metadata not found for', path.parse(imageFile).name)
                }
            }
        
            console.log('All images uploaded successfully!')
            return [imageUrls, jsonUrls]
        } catch (error) {
            console.error('Error uploading images to IPFS:', error)
            throw error
        }            
    }
}



================================================
FILE: src/storage/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/storage/index.ts
================================================
export class Storage {
    constructor(
        readonly provider: ProviderInterface
    ) {}

    // Function to upload images
    async uploadImage(
        imagePath: string
    ): Promise<string> {
        return await this.provider.uploadImage(imagePath)
    }

    // Function to upload multiple images
    async uploadImages(
        folderPath: string
    ): Promise<string[]> {
        return await this.provider.uploadImages(folderPath)
    }

    // Function to upload json file
    async uploadJson(
        jsonPath: string
    ): Promise<string> {
        return await this.provider.uploadJson(jsonPath)
    }

    // Function to upload multiple json files
    async uploadJsonBulk(
        folderPath: string
    ): Promise<string[]> {
        return await this.provider.uploadJsonBulk(folderPath)
    }

    // Function to upload multiple json files
    async uploadBulk(
        assetsFolderPath: string
    ): Promise<[string[], string[]]> {
        return await this.provider.uploadBulk(assetsFolderPath)
    }
}

export interface ProviderInterface {
    uploadImage: (imagePath: string) => Promise<string>
    uploadImages: (folderPath: string) => Promise<string[]>
    uploadJson: (jsonPath: string) => Promise<string>
    uploadJsonBulk: (folderPath: string) => Promise<string[]>
    uploadBulk: (assetsFolderPath: string) => Promise<[string[], string[]]>
}


================================================
FILE: src/ton-api/TonAPI.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/ton-api/TonAPI.ts
================================================
import { Address, Transaction } from 'ton-core'
import {ClientInterface} from './'

/**
 * Class representing a TON API client.
 */
export class TonAPI implements ClientInterface {
    private url: string

    /**
     * Create a new TON API client.
     * @param {string} [url] - The base URL for the TON API. Default is 'https://tonapi.io'.
     */
    constructor(url?: string) {
        this.url = url ? url : 'https://tonapi.io'
    }

    /**
     * Fetch NFT collections.
     * @param {number} [limit] - The maximum number of collections to fetch.
     * @param {number} [offset] - The offset to start fetching from.
     */
    async getNftCollections(
        limit?: number,
        offset?: number,
    ) {
        const response = await request(
            `${this.url}/v2/nfts/collections?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }

    /**
     * Fetch an NFT collection by its address.
     * @param {string} collectionAddress - The address of the collection to fetch.
     */
    async getNftCollection(
        collectionAddress: string,
    ) {
        const response = await request(
            `${this.url}/v2/nfts/collections/${collectionAddress}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }

    /**
     * Fetch NFT items from a collection by the collection's address.
     * @param {string} collectionAddress - The address of the collection to fetch items from.
     * @param {number} [limit] - The maximum number of items to fetch.
     * @param {number} [offset] - The offset to start fetching from.
     */
    async getNftItems(
        collectionAddress: string,
        limit?: number,
        offset?: number,
    ) {
        const response = await request(
            `${this.url}/v2/nfts/collections/${collectionAddress}/items?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }

    /**
     * Fetch an NFT item by its address.
     * @param {string} itemAddress - The address of the item to fetch.
     */
    async getNftItem(
        itemAddress: string,
    ) {
        const response = await request(
            `${this.url}/v2/nfts/${itemAddress}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }

    /**
     * Fetch transactions by address.
     * @param {Address} address - The address to fetch transactions for.
     * @param {number} limit - The maximum number of transactions to fetch.
     * @returns {Promise<any>} A promise resolving with the fetched transactions.
     */
    async getTransactionsByAddress(
        address: Address,
        limit?: number
    ) {
        const response = await request(
            `${this.url}/v1/blockchain/getTransactions?account=${address.toString()}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }

    /**
     * Fetch transaction data.
     * @param {string} transactionId - The ID of the transaction to fetch data for.
     * @returns {Promise<Transaction>} A promise resolving with the fetched transaction data.
     */
    async getTransactionData(
        transactionId: string
    ): Promise<Transaction> {
        const response: Transaction = await request(
            `${this.url}/v2/blockchain/transactions/${transactionId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        return response
    }
}

/**
 * Send a request to a URL and return the response as JSON.
 * @template TResponse The expected shape of the response body.
 * @param {string} url - The URL to send the request to.
 * @param {RequestInit} config - The configuration options for the request.
 * @returns {Promise<TResponse>} A promise resolving with the response body.
 */
async function request<TResponse>(
    url: string, 
    config: RequestInit
): Promise<TResponse> {
    const response = await fetch(url, config)
    return (await response.json()) as TResponse
}


================================================
FILE: src/ton-api/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/ton-api/index.ts
================================================
import { Address } from 'ton-core'

export class TonNftClient {
    constructor(
        readonly client: ClientInterface
    ) {}

    async getNftCollections(
        limit?: number,
        offset?: number,
    ) {
        return await this.client.getNftCollections(limit, offset)
    }

    async getNftCollection(
        collectionAddress: string,
    ) {
        return await this.client.getNftCollection(collectionAddress)
    }

    async getNftItems(
        collectionAddress: string,
        limit?: number,
        offset?: number,
    ) {
        return await this.client.getNftItems(collectionAddress, limit, offset)
    }

    async getNftItem(
        itemAddress: string,
    ) {
        return await this.client.getNftItem(itemAddress)
    }

    async getTransactionsByAddress(
        address: Address,
        limit?: number
    ) {
        return await this.client.getTransactionsByAddress(address, limit)
    }
}

export interface ClientInterface {
    getNftCollections: (limit?: number, offset?: number) => Promise<unknown>
    getNftCollection: (collectionAddress: string) => Promise<unknown>
    getNftItems: (collectionAddress: string, limit?: number, offset?: number) => Promise<unknown>
    getNftItem: (itemAddress: string) => Promise<unknown>
    getTransactionsByAddress: (address: Address, limit?: number) => Promise<unknown>
}


================================================
FILE: src/transaction-parsing/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/transaction-parsing/index.ts
================================================
import { Transaction } from "ton-core"

export function parseTransaction<E extends ((input: Transaction) => any)>(tx: Transaction, parsers: E[]): (E extends ((input: Transaction) => infer RR) ? RR : never) | undefined {

    for (const p of parsers) {
        const parsed = p(tx);
        if (parsed !== undefined) return parsed;
    }

    return undefined;
}


================================================
FILE: src/types/Content.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/types/Content.ts
================================================
import { beginCell, Builder, Slice, Dictionary } from 'ton-core'
import {sha256_sync} from 'ton-crypto'

// offchain#01 uri:Text = FullContent

type OnchainContent = {
    type: 'onchain'
    knownKeys: Map<string, string>
    unknownKeys: Map<bigint, string>
};
  
type OffchainContent = {
    type: 'offchain'
    uri: string
};
  
type FullContent = OnchainContent | OffchainContent;

const propertyNames = ['uri', 'name', 'description', 'image', 'image_data']
  
// onchain#00 data:(HashMapE 256 ^ContentData) = FullContent;
// offchain#01 uri:Text = FullContent;
// preloads a uint8 then calls either the onchain or the offchain variant
export function loadFullContent(slice: Slice): FullContent {
    const data = slice.preloadUint(8)

    switch (data) {

    case 0x00:
        return loadOnchainContent(slice)
    case 0x01:
        return loadOffchainContent(slice)
    default:    
        throw new Error(`Unknown content type: ${data.toString(16)}`)
        
    }
}

export function storeFullContent(src: FullContent): (builder: Builder) => void {
    switch (src.type) {
    case 'onchain':
        return storeOnchainContent(src)
    case 'offchain':
        return storeOffchainContent(src)
    default:
        throw new Error('Unknown content type')
    }
}
  
// onchain#00 data:(HashMapE 256 ^ContentData) = FullContent;
// loads a uint8, checks that it is 0x00, calls loadOnchainDict, inserts known keys into the respective fields
export function loadOnchainContent(slice: Slice): OnchainContent {
    const data = slice.loadUint(8)

    if (data !== 0x00) {
        throw new Error(`Unknown content type: ${data.toString(16)}`)
    }

    const onchainDict = loadOnchainDict(slice)
    const knownKeys = new Map<string, string>()
    for (const knownProperty of propertyNames) {
        const hashedKey = BigInt('0x' + sha256_sync(knownProperty).toString('hex'))
        const value = onchainDict.get(hashedKey)
        
        if (onchainDict.has(hashedKey) && value !== undefined) {
            knownKeys.set(knownProperty, value)
        }
    }

    return {
        type: 'onchain',
        knownKeys,
        unknownKeys: onchainDict
    }
}

export function storeOnchainContent(src: OnchainContent): (builder: Builder) => void {
    const map = new Map<bigint, string>()

    for (const [key, value] of src.unknownKeys) map.set(key, value)


    for (const [key] of src.knownKeys) {
        const hashedKey = BigInt('0x' + sha256_sync(key).toString('hex'))
        map.set(hashedKey, key)
    }

    return (builder: Builder) => {
        builder.storeUint(8, 0x00)
        builder.store(storeOnchainDict(map))
    }
}

// offchain#01 uri:Text = FullContent;
// loads a uint8, checks that it is 0x01, calls loadSnakeData
export function loadOffchainContent(slice: Slice): OffchainContent {
    const prefix = slice.loadUint(8)

    if (prefix !== 0x01) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
    }
    
    return {
        type: 'offchain',
        uri: slice.loadStringTail()
    }
}

export function storeOffchainContent(src: OffchainContent): (builder: Builder) => void {
    return (builder: Builder) => {
        builder
            .storeUint(0x01, 8)
            .storeStringTail(src.uri)
    }
}

// snake#00 data:(SnakeData ~n) = ContentData;
// chunks#01 data:ChunkedData = ContentData;
// preloads a uint8 then calls either loadSnakeData or loadChunkedData
export function loadContentData(slice: Slice): string {
    const data = slice.preloadUint(8)

    switch (data) {
    case 0x00:
        return loadSnakeData(slice)
    case 0x01:
        return loadChunkedData(slice)
    default:
        throw new Error(`Unknown content type: ${data.toString(16)}`)
    }
}
// notice that there is no storeContentData

// snake#00 data:(SnakeData ~n) = ContentData;
// loads a uint8, checks that it is 0x00, calls slice.loadStringTail
export function loadSnakeData(slice: Slice): string {
    const prefix = slice.loadUint(8)

    if (prefix !== 0x00) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
    }
    
    return slice.loadStringTail()
}

export function storeSnakeData(src: string): (builder: Builder) => void {
    return (builder: Builder) => {
        builder
            .storeUint(0x00, 8)
            .storeStringTail(src)
    }
}

// chunks#01 data:ChunkedData = ContentData;
// chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
// notice that above it is `SnakeData ~0` which means `the last layer` so there must be no refs in it, and it should be an integer number of bytes
// loads a uint8, checks that it is 0x01, calls loadChunkedRaw
export function loadChunkedData(slice: Slice): string {
    const prefix = slice.loadUint(8)

    if (prefix !== 0x01) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
    }

    return loadChunkedRaw(slice)
}

export function storeChunkedData(src: string): (builder: Builder) => void {
    return (builder: Builder) => {
        builder
            .storeUint(0x01, 8)
            .store(storeChunkedRaw(src))
    }
}

// these two only work with the dict (HashMapE 32 ^(SnakeData ~0))
// load must iterate over all parts and combine them, store must split the string as needed
export function loadChunkedRaw(slice: Slice): string {
    const dict = slice.loadDict(
        Dictionary.Keys.Uint(32), 
        Dictionary.Values.Cell()
    )

    let data = ''

    for (let i = 0; i < dict.size; i++) {
        const value = dict.get(i)

        if (!value) {
            throw new Error(`Missing value for key: ${i.toString(16)}`)
        }
    
        data += (value.beginParse().loadStringRefTail())
    }

    return data
}

export function storeChunkedRaw(src: string): (builder: Builder) => void {
    const dict = Dictionary.empty(
        Dictionary.Keys.Uint(32),
        Dictionary.Values.Cell()
    )

    const nChunks = Math.ceil(src.length / 127)

    for (let i = 0; i < nChunks; i++) {
        const chunk = src.slice(i * 127, (i + 1) * 127)
        dict.set(i, beginCell().storeStringRefTail(chunk).endCell())
    }

    return (builder: Builder) => {
        builder
            .storeDict(
                dict
            )
    }
}

// uses the Dictionary primitive with loadContentData to parse the dict
export function loadOnchainDict(slice: Slice): Map<bigint, string> {
    const dict = slice.loadDict(
        Dictionary.Keys.BigUint(256), 
        Dictionary.Values.Cell()
    )

    const data = new Map<bigint, string>()

    for (const [key, value] of dict) {
        data.set(key, loadContentData(value.beginParse()))
    }

    return data
}

// uses the Dictionary primitive and either storeSnakeData or storeChunkedData (probably just choose the former one for now)
export function storeOnchainDict(src: Map<bigint, string>): (builder: Builder) => void {
    const dict = Dictionary.empty(
        Dictionary.Keys.BigUint(256),
        Dictionary.Values.Cell()
    )

    for (const [key, value] of src) {
        dict.set(key, beginCell().store(storeSnakeData(value)).endCell())
    }

    return (builder: Builder) => {
        builder.storeDict(dict)
    }
}


================================================
FILE: src/utils/EligibleInternalTx.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/EligibleInternalTx.ts
================================================
import { Transaction } from 'ton-core'

export function isEligibleTransaction(tx: Transaction): boolean {
    return (
        tx.inMessage?.info.type == 'internal' &&
        tx.description.type == 'generic' &&
        tx.description.computePhase.type == 'vm' &&
        tx.description.computePhase.exitCode == 0
    )
}


================================================
FILE: src/utils/createKeyPair.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/createKeyPair.ts
================================================
import { writeFileSync } from "fs";
import {mnemonicNew, mnemonicToPrivateKey} from "ton-crypto"

export async function createKeyPair() {
    let mnemonic = await mnemonicNew()
    let keypair = await mnemonicToPrivateKey(mnemonic)

    writeFileSync(
        "./keypair.json",
        JSON.stringify(keypair)
    );

    writeFileSync(
        "./.env",
        `SECRET_KEY=${keypair.secretKey}`
    )
}

export default createKeyPair;


================================================
FILE: src/utils/createSender.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/createSender.ts
================================================
import { KeyPair } from "ton-crypto";
import { TonClient4, WalletContractV4 } from "ton";

export async function createSender(
    keypair: KeyPair,
    client: TonClient4
) {
    let wallet = WalletContractV4.create(
        {
            workchain: 0,
            publicKey: keypair.publicKey
        }
    )
    
    let contract = client.open(
        wallet
    );

    return contract.sender(keypair.secretKey);
}

export default createSender;


================================================
FILE: src/utils/createTempFile.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/createTempFile.ts
================================================
import {uuid} from './uuid'
import * as os from 'os'
import path from 'path'
import {writeFile, unlink} from 'fs/promises'

export async function createTempFile(ext: string) {
    const name = uuid()
    const fullPath = path.resolve(os.tmpdir(), name + ext)
    await writeFile(fullPath, Buffer.alloc(0))
    return {
        name: fullPath,
        destroy: async  () => {
            await unlink(fullPath)
        }
    }
}



================================================
FILE: src/utils/importKeyPair.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/importKeyPair.ts
================================================
import { env } from 'process'
import { KeyPair, keyPairFromSecretKey } from "ton-crypto"
import { readFileSync } from 'fs';

export async function importKeyPair(
    secretKey?: string
) {
    let keyPair: KeyPair;

    if (secretKey) {
        keyPair = keyPairFromSecretKey(Buffer.from(secretKey, 'hex'));
    } else {
        const content = readFileSync(String(env.SECRET_KEY), 'utf-8');
        keyPair = keyPairFromSecretKey(Buffer.from(content, 'hex'));
    }

    return keyPair;
}

export default importKeyPair;


================================================
FILE: src/utils/index.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/index.ts
================================================
export * from './EligibleInternalTx'
export * from './createTempFile'
export * from './randomAddress'
export * from './randomKeyPair'
export * from './uuid'
export * from './importKeyPair'
export * from './createSender'


================================================
FILE: src/utils/randomAddress.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/randomAddress.ts
================================================
import {Address} from "ton-core";
import {pseudoRandomBytes} from "crypto";

export function randomAddress() {
    return new Address(0, pseudoRandomBytes(256/8))
}


================================================
FILE: src/utils/randomKeyPair.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/randomKeyPair.ts
================================================
import {mnemonicNew, mnemonicToPrivateKey} from "ton-crypto";

export async function randomKeyPair() {
    let mnemonics = await mnemonicNew()
    return mnemonicToPrivateKey(mnemonics)
}


================================================
FILE: src/utils/uuid.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/utils/uuid.ts
================================================
import {v4} from 'uuid'

export const uuid = () => v4()


================================================
FILE: src/wrappers/getgems/NftAuction/NftAuction.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/NftAuction.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, contractAddress } from 'ton-core'

/**
 * Class representing an NFT auction contract.
 */
export class NftAuction implements Contract {
    /**
     * Creates an `NftAuction` instance from an address and initialization data.
     * @param address - The address of the contract.
     * @param init - The initialization data.
     * @returns A new `NftAuction` instance.
     */
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}
    
    static code = Cell.fromBoc(Buffer.from('te6cckECLgEABqIAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8LBkCAs4GBwIBIBwdAgEgCAkCASAaGwT1DPQ0wMBcbDyQPpAMNs8+ENSEMcF+EKwwP+Oz1vTHyHAAI0EnJlcGVhdF9lbmRfYXVjdGlvboFIgxwWwjoNb2zzgAcAAjQRZW1lcmdlbmN5X21lc3NhZ2WBSIMcFsJrUMNDTB9QwAfsA4DDg+FdSEMcFjoQxAds84PgjgLBEKCwATIIQO5rKAAGphIAFcMYED6fhW10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HZw+GJ/+GTbPBkESPhTvo8GbCHbPNs84PhCwP+OhGwh2zzg+FZSEMcF+ENSIMcFsRcRFwwEeI+4MYED6wLTHwHDABPy8otmNhbmNlbIUiDHBY6DIds83otHN0b3CBLHBfhWUiDHBbCPBNs82zyRMOLgMg0XEQ4B9oED7ItmNhbmNlbIEscFs/Ly+FHCAI5FcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsA3nAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAA8BBNs8EAFMyXGAGMjLBfhXzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwZBPSBA+34QsD/8vL4U/gjuY8FMNs82zzg+E7CAPhOUiC+sI7V+FGORXAggBjIywX4UM8W+FH6Astqyx+NClZb3VyIGJpZCBoYXMgYmVlbiBvdXRiaWQgYnkgYW5vdGhlciB1c2VyLoM8WyXL7AN4B+HD4cfgj+HLbPOD4UxcRERICkvhRwACOPHAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAMlxgBjIywX4V88WcPoCy2rMgggPQkBw+wLJgwb7AOMOf/hi2zwTGQP8+FWh+CO5l/hT+FSg+HPe+FGOlIED6PhNUiC58vL4cfhw+CP4cts84fhR+E+gUhC5joMw2zzgcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsAAfhwGRcYA/hwIPglghBfzD0UyMsfyz/4UM8W+FbPFssAggnJw4D6AssAyXGAGMjLBfhXzxaCEDuaygD6AstqzMly+wD4UfhI+EnwAyDCAJEw4w34UfhL+EzwAyDCAJEw4w2CCA9CQHD7AnAggBjIywX4Vs8WIfoCy2rLH4nPFsmDBvsAFBUWAHhwIIAYyMsF+EfPFlAD+gISy2rLH40H01hcmtldHBsYWNlIGNvbW1pc3Npb24gd2l0aGRyYXeDPFslz+wAAcHAggBjIywX4Ss8WUAP6AhLLassfjQbUm95YWx0eSBjb21taXNzaW9uIHdpdGhkcmF3gzxbJc/sAAC5QcmV2aW91cyBvd25lciB3aXRoZHJhdwCIcCCAGMjLBVADzxYh+gISy2rLH40J1lvdXIgdHJhbnNhY3Rpb24gaGFzIG5vdCBiZWVuIGFjY2VwdGVkLoM8WyYBA+wABEPhx+CP4cts8GQDQ+Ez4S/hJ+EjI+EfPFssfyx/4Ss8Wyx/LH/hV+FT4U/hSyPhN+gL4TvoC+E/6AvhQzxb4UfoCyx/LH8sfyx/I+FbPFvhXzxbJAckCyfhG+EX4RPhCyMoA+EPPFsoAyh/KAMwSzMzJ7VQAESCEDuaygCphIAANFnwAgHwAYAIBIB4fAgEgJCUCAWYgIQElupFds8+FbXScEDknAg4PhW+kSCwBEa8u7Z58KH0iQCwCASAiIwEYqrLbPPhI+En4S/hMLAFeqCzbPIIIQVVD+EL4U/hD+Ff4VvhR+FD4T/hH+Ej4SfhK+Ev4TPhO+E34RfhS+EYsAgEgJicCAW4qKwEdt++7Z58JvwnfCf8KPwpwLAIBICgpARGwybbPPhK+kSAsARGxlvbPPhH+kSAsARGvK22efCH9IkAsASWsre2efCvrpOCByTgQcHwr/SJALAH2+EFu3e1E0NIAAfhi+kAB+GPSAAH4ZNIfAfhl0gAB+GbUAdD6QAH4Z9MfAfho0x8B+Gn6QAH4atMfAfhr0x8w+GzUAdD6AAH4bfoAAfhu+gAB+G/6QAH4cPoAAfhx0x8B+HLTHwH4c9MfAfh00x8w+HXUMND6QAH4dvpALQAMMPh3f/hhRQVNYw==', 'base64'))[0]

    /**
     * Builds the data cell for the auction contract.
     * @param data - The data for building the data cell.
     * @returns The built data cell.
     */
    static buildDataCell(data: NftAuctionData) {

        const feesCell = beginCell()
        feesCell.storeAddress(data.marketplaceFeeAddress)      // mp_fee_addr
        feesCell.storeUint(data.marketplaceFeeFactor, 32)               // mp_fee_factor
        feesCell.storeUint(data.marketplaceFeeBase, 32)   // mp_fee_base
        feesCell.storeAddress(data.royaltyAddress)  // royalty_fee_addr
        feesCell.storeUint(data.royaltyFactor, 32)              // royalty_fee_factor
        feesCell.storeUint(data.royaltyBase, 32)   // royalty_fee_base


        const bidsCell = beginCell()
        bidsCell.storeCoins(data.minBid)       // min_bid
        bidsCell.storeCoins(data.maxBid)       // max_bid
        bidsCell.storeCoins(data.minStep)       // min_step
        bidsCell.storeBuffer(Buffer.from([0,0]))        // last_member
        bidsCell.storeCoins(0)       // last_bid
        bidsCell.storeUint(0, 32) // last_bid_at
        bidsCell.storeUint(data.endTimestamp, 32)    // end_time
        bidsCell.storeUint(data.stepTimeSeconds, 32)               // step_time
        bidsCell.storeUint(data.tryStepTimeSeconds, 32)               // try_step_time

        const nftCell = beginCell()
        if (data.nftOwnerAddress) {
            nftCell.storeAddress(data.nftOwnerAddress)
        } else {
            nftCell.storeBuffer(Buffer.from([0, 0]))
        }
        nftCell.storeAddress(data.nftAddress)          // nft_addr


        const storage = beginCell()
        storage.storeBit(data.end)     // end?
        storage.storeAddress(data.marketplaceAddress)   // mp_addr
        storage.storeBit(data.activated)    // activated
        storage.storeUint(data.createdAtTimestamp, 32)
        storage.storeBit(false) // is_canceled
        storage.storeRef(feesCell.endCell())
        storage.storeRef(bidsCell.endCell())
        storage.storeRef(nftCell.endCell())

        return storage.endCell()
    }

    /**
     * Creates an `NftAuction` instance from an address.
     * @param address - The address to create from.
     * @returns A new `NftAuction` instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftAuction(
            address
        )
    }

    /**
     * Creates an `NftAuction` instance from configuration data.
     * @param config - The configuration data for creating the instance.
     * @param workchain - The workchain ID (default: 0).
     * @returns A new `NftAuction` instance.
     */
    static async createFromConfig(
        config: NftAuctionData,
        workchain = 0
    ) {

        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftAuction(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends a cancel command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the cancel command.
     * @param params - The parameters for the cancel command.
     */
    async sendCancel(provider: ContractProvider, via: Sender, params: { 
        value: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(0,32)
                .storeBuffer(Buffer.from('cancel'))
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }
    
    /**
     * Sends a stop command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the stop command.
     * @param params - The parameters for the stop command.
     */
    async sendStop(provider: ContractProvider, via: Sender, params: { 
        value: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(0,32)
                .storeBuffer(Buffer.from('cancel'))
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a repeat end auction command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the repeat end auction command.
     * @param params - The parameters for the repeat end auction command.
     */
    async sendRepeatEndAuction(provider: ContractProvider, via: Sender, params: { 
        value: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(0,32)
                .storeBuffer(Buffer.from('repeat_end_auction'))
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends an emergency message to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the emergency message.
     * @param params - The parameters for the emergency message.
     */
    async sendEmergencyMessage(provider: ContractProvider, via: Sender, params: { 
        value: bigint,
        marketplaceAddress: Address,
        coins: bigint
    }) {
        const transfer = beginCell()
        transfer.storeUint(0x18, 6)
        transfer.storeAddress(params.marketplaceAddress)
        transfer.storeCoins(params.coins)
        transfer.storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        transfer.storeRef(beginCell().storeUint(555,32).endCell())

        const transferBox = beginCell()
        transferBox.storeUint(2, 8)
        transferBox.storeRef(transfer.endCell())

        const msgResend = beginCell().storeUint(0, 32).storeBuffer(Buffer.from('emergency_message')).storeRef(transferBox.endCell()).endCell()

        await provider.internal(via, {
            value: params.value,
            body: msgResend,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Retrieves the sale data from the contract.
     * @param provider - The contract provider.
     * @returns The sale data.
     */
    async getSaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_sale_data', [])
        
        // pops out saleType
        stack.pop()
        
        return {
            // saleType: stack.readBigNumber(),
            end: stack.readBoolean(),
            endTimestamp: stack.readBigNumber(),
            marketplaceAddress: stack.readAddressOpt(),
            nftAddress: stack.readAddressOpt(),
            nftOwnerAddress: stack.readAddressOpt(),
            lastBidAmount: stack.readBigNumber(),
            lastBidAddress: stack.readAddressOpt(),
            minStep: stack.readBigNumber(),
            marketplaceFeeAddress: stack.readAddressOpt(),
            marketplaceFeeFactor: stack.readBigNumber(), 
            marketplaceFeeBase: stack.readBigNumber(),
            royaltyAddress: stack.readAddressOpt(),
            royaltyFactor: stack.readBigNumber(), 
            royaltyBase: stack.readBigNumber(),
            maxBid: stack.readBigNumber(),
            minBid: stack.readBigNumber(),
            createdAt: stack.readBigNumber(),
            lastBidAt: stack.readBigNumber(),
            isCanceled: stack.readBigNumber(),
        }
    }
}

/**
 * Type representing the data for an NFT auction contract version 2.
 */
export type NftAuctionData = {
    marketplaceFeeAddress: Address,
    marketplaceFeeFactor: bigint,
    marketplaceFeeBase: bigint,


    royaltyAddress: Address,
    royaltyFactor: bigint,
    royaltyBase: bigint,


    minBid: bigint,
    maxBid: bigint,
    minStep: bigint,
    endTimestamp: number,
    createdAtTimestamp: number,

    stepTimeSeconds: number,
    tryStepTimeSeconds: number,

    nftOwnerAddress: Address | null,
    nftAddress: Address,

    end: boolean,
    marketplaceAddress: Address,
    activated: boolean,
}


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/build.sh
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/build.sh
================================================
#!/bin/bash

MINPUT="./nft-auction.func"
OUTPUT="./nft-auction-code"
FUNC_STDLIB_PATH="../stdlib.fc"

echo "building \"${MINPUT}\""

# build you own func compiler
/Users/i.nedzvetskiy/projects/ton/build/crypto/func -PA -o "${OUTPUT}.fif" ${FUNC_STDLIB_PATH} ${MINPUT}
echo -e "\"TonUtil.fif\" include\n$(cat ${OUTPUT}.fif)" > "${OUTPUT}.fif"
echo "\"${OUTPUT}.fif\" include 2 boc+>B \"${OUTPUT}.boc\" B>file" | fift -s
base64 "${OUTPUT}.boc" > "${OUTPUT}.base64"


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.base64
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.base64
================================================
te6cckECLgEABqIAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8LBkCAs4GBwIBIBwdAgEgCAkCASAaGwT1DPQ0wMBcbDyQPpAMNs8+ENSEMcF+EKwwP+Oz1vTHyHAAI0EnJlcGVhdF9lbmRfYXVjdGlvboFIgxwWwjoNb2zzgAcAAjQRZW1lcmdlbmN5X21lc3NhZ2WBSIMcFsJrUMNDTB9QwAfsA4DDg+FdSEMcFjoQxAds84PgjgLBEKCwATIIQO5rKAAGphIAFcMYED6fhW10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HZw+GJ/+GTbPBkESPhTvo8GbCHbPNs84PhCwP+OhGwh2zzg+FZSEMcF+ENSIMcFsRcRFwwEeI+4MYED6wLTHwHDABPy8otmNhbmNlbIUiDHBY6DIds83otHN0b3CBLHBfhWUiDHBbCPBNs82zyRMOLgMg0XEQ4B9oED7ItmNhbmNlbIEscFs/Ly+FHCAI5FcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsA3nAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAA8BBNs8EAFMyXGAGMjLBfhXzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwZBPSBA+34QsD/8vL4U/gjuY8FMNs82zzg+E7CAPhOUiC+sI7V+FGORXAggBjIywX4UM8W+FH6Astqyx+NClZb3VyIGJpZCBoYXMgYmVlbiBvdXRiaWQgYnkgYW5vdGhlciB1c2VyLoM8WyXL7AN4B+HD4cfgj+HLbPOD4UxcRERICkvhRwACOPHAg+CWCEF/MPRTIyx/LP/hWzxb4Vs8WywAh+gLLAMlxgBjIywX4V88WcPoCy2rMgggPQkBw+wLJgwb7AOMOf/hi2zwTGQP8+FWh+CO5l/hT+FSg+HPe+FGOlIED6PhNUiC58vL4cfhw+CP4cts84fhR+E+gUhC5joMw2zzgcCCAGMjLBfhQzxb4UfoCy2rLH40KVlvdXIgYmlkIGhhcyBiZWVuIG91dGJpZCBieSBhbm90aGVyIHVzZXIugzxbJcvsAAfhwGRcYA/hwIPglghBfzD0UyMsfyz/4UM8W+FbPFssAggnJw4D6AssAyXGAGMjLBfhXzxaCEDuaygD6AstqzMly+wD4UfhI+EnwAyDCAJEw4w34UfhL+EzwAyDCAJEw4w2CCA9CQHD7AnAggBjIywX4Vs8WIfoCy2rLH4nPFsmDBvsAFBUWAHhwIIAYyMsF+EfPFlAD+gISy2rLH40H01hcmtldHBsYWNlIGNvbW1pc3Npb24gd2l0aGRyYXeDPFslz+wAAcHAggBjIywX4Ss8WUAP6AhLLassfjQbUm95YWx0eSBjb21taXNzaW9uIHdpdGhkcmF3gzxbJc/sAAC5QcmV2aW91cyBvd25lciB3aXRoZHJhdwCIcCCAGMjLBVADzxYh+gISy2rLH40J1lvdXIgdHJhbnNhY3Rpb24gaGFzIG5vdCBiZWVuIGFjY2VwdGVkLoM8WyYBA+wABEPhx+CP4cts8GQDQ+Ez4S/hJ+EjI+EfPFssfyx/4Ss8Wyx/LH/hV+FT4U/hSyPhN+gL4TvoC+E/6AvhQzxb4UfoCyx/LH8sfyx/I+FbPFvhXzxbJAckCyfhG+EX4RPhCyMoA+EPPFsoAyh/KAMwSzMzJ7VQAESCEDuaygCphIAANFnwAgHwAYAIBIB4fAgEgJCUCAWYgIQElupFds8+FbXScEDknAg4PhW+kSCwBEa8u7Z58KH0iQCwCASAiIwEYqrLbPPhI+En4S/hMLAFeqCzbPIIIQVVD+EL4U/hD+Ff4VvhR+FD4T/hH+Ej4SfhK+Ev4TPhO+E34RfhS+EYsAgEgJicCAW4qKwEdt++7Z58JvwnfCf8KPwpwLAIBICgpARGwybbPPhK+kSAsARGxlvbPPhH+kSAsARGvK22efCH9IkAsASWsre2efCvrpOCByTgQcHwr/SJALAH2+EFu3e1E0NIAAfhi+kAB+GPSAAH4ZNIfAfhl0gAB+GbUAdD6QAH4Z9MfAfho0x8B+Gn6QAH4atMfAfhr0x8w+GzUAdD6AAH4bfoAAfhu+gAB+G/6QAH4cPoAAfhx0x8B+HLTHwH4c9MfAfh00x8w+HXUMND6QAH4dvpALQAMMPh3f/hhRQVNYw==



================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.boc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.boc
================================================
��rA. � � ������ H(�0�<���D����� �d�<,�  	 ��4��\l<�>�6�>Ԅ1�~�0?�����p #A'&WVE�V�E�V7F����1�l#����8 p #AV�W&vV�7���W76vX�1�l&�44�� ~�88>Ԅ1�c�@v�8>�,
  �沀 ja \1���V�I�����������@�!�@0�vp�b�d�<H�S��l!�<�<��B����l!�<��VR��CR ��x��1���� ��f6�6V�R ���!�<ދG7F���VR ����<�<�0��2���f6�6V������Q� �Ep ����P��Q��j��
V[�\��Y\��Y[��]�Y�H[��\�\�\����r� �p �%�_�=���?�V��V�� !�� �<L�q����W�p��ĵB@p�Ƀ� �b�f�<���B�����S�#��0�<�<��N� �NR �����Q�Ep ����P��Q��j��
V[�\��Y\��Y[��]�Y�H[��\�\�\����r� ��p�q�#�r�<��S��Q� �<p �%�_�=���?�V��V�� !�� �q����W�p��ĵB@p�Ƀ� ��b�<��U��#���S�T��s��Q�����MR ����q�p�#�r�<��Q�O�R���0�<�p ����P��Q��j��
V[�\��Y\��Y[��]�Y�H[��\�\�\����r� �p�p �%�_�=���?�P��V�� �	�À�� �q����W��;�� ��j��r� �Q�H�I� � �0��Q�K�L� � �0��B@p�p ����V�!��j���Ƀ�  xp ����G�P��j���X\��]X�H��[Z\��[ۈ�]�]���s�  pp ����J�P��j��ԛ�X[H��[Z\��[ۈ�]�]���s�  .Previous owner withdraw �p ���P�!��j��	�[�\��[��X�[ۈ\����Y[�X��\Y��ɀ@� �q�#�r�< ��L�K�I�H��G����J����U�T�S�R��M��N��O��P��Q�������V��W�����F�E�D�B�� �C�� �� �����T  �沀*a  | �| `  $%f !%��]�υmt�9'�o�H,�.�|(}"@, "#���<�H�I�K�L,^�,�<�AUC�B�S�C�W�V�Q�P�O�G�H�I�J�K�L�N�M�E�R�F, &'n*+��g�	�	�	�
?
p, ()�ɶ�>�� ,����>�� ,�+m�|!�"@,%���|+����8p|+�"@,��An��D�� �b�@�c� �d��e� �f���@�g��h��i�@�j��k�0�l��� �m� �n� �o�@�p� �q��r��s��t�0�u�0��@�v�@- 0�w�aEMc


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.fif
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/nft-auction-code.fif
================================================
"TonUtil.fif" include
"Asm.fif" include
// automatically generated from `../stdlib.fc` `./nft-auction.func` incl:`./struct/op-codes.func` incl:`./struct/exit-codes.func` incl:`./struct/math.func` incl:`./struct/msg-utils.func` incl:`./struct/storage.func` incl:`./struct/handles.func` incl:`./struct/get-met.func` 
PROGRAM{
  DECLPROC division
  DECLPROC multiply
  DECLPROC math::get_percent
  DECLPROC init_data
  DECLPROC pack_data
  DECLPROC handle::return_transaction
  DECLPROC handle::try_init_auction
  DECLPROC handle::try_cancel
  DECLPROC handle::end_auction
  DECLPROC handle::new_bid
  92437 DECLMETHOD get_nft_owner
  129371 DECLMETHOD get_nft_addr
  71261 DECLMETHOD get_last_member
  128598 DECLMETHOD get_mp_addr
  112219 DECLMETHOD get_mp_fee_addr
  107302 DECLMETHOD get_royalty_fee_addr
  72370 DECLMETHOD get_fees_info
  106365 DECLMETHOD get_bid_info
  72748 DECLMETHOD get_sale_data
  DECLPROC recv_internal
  DECLPROC recv_external
  DECLGLOBVAR init?
  DECLGLOBVAR end?
  DECLGLOBVAR mp_addr
  DECLGLOBVAR activated?
  DECLGLOBVAR created_at?
  DECLGLOBVAR is_canceled?
  DECLGLOBVAR mp_fee_addr
  DECLGLOBVAR mp_fee_factor
  DECLGLOBVAR mp_fee_base
  DECLGLOBVAR royalty_fee_addr
  DECLGLOBVAR royalty_fee_factor
  DECLGLOBVAR royalty_fee_base
  DECLGLOBVAR min_bid
  DECLGLOBVAR max_bid
  DECLGLOBVAR min_step
  DECLGLOBVAR last_member
  DECLGLOBVAR last_bid
  DECLGLOBVAR last_bid_at
  DECLGLOBVAR end_time
  DECLGLOBVAR step_time
  DECLGLOBVAR try_step_time
  DECLGLOBVAR nft_owner
  DECLGLOBVAR nft_addr
  division PROC:<{
    1000000000 PUSHINT
    SWAP
    MULDIV
  }>
  multiply PROC:<{
    1000000000 PUSHINT
    MULDIV
  }>
  math::get_percent PROC:<{
    -ROT
    multiply CALLDICT
    SWAP
    division CALLDICT
  }>
  init_data PROCREF:<{
    init? GETGLOB
    ISNULL
    IFNOTJMP:<{
    }>
    c4 PUSH
    CTOS
    1 LDI
    SWAP
    end? SETGLOB
    LDMSGADDR
    SWAP
    mp_addr SETGLOB
    1 LDI
    SWAP
    activated? SETGLOB
    32 LDI
    SWAP
    created_at? SETGLOB
    1 LDI
    SWAP
    is_canceled? SETGLOB
    LDREF
    SWAP
    CTOS
    LDMSGADDR
    SWAP
    mp_fee_addr SETGLOB
    32 LDU
    SWAP
    mp_fee_factor SETGLOB
    32 LDU
    SWAP
    mp_fee_base SETGLOB
    LDMSGADDR
    SWAP
    royalty_fee_addr SETGLOB
    32 LDU
    SWAP
    royalty_fee_factor SETGLOB
    32 LDU
    DROP
    royalty_fee_base SETGLOB
    LDREF
    SWAP
    CTOS
    LDVARUINT16
    SWAP
    min_bid SETGLOB
    LDVARUINT16
    SWAP
    max_bid SETGLOB
    LDVARUINT16
    SWAP
    min_step SETGLOB
    LDMSGADDR
    SWAP
    last_member SETGLOB
    LDVARUINT16
    SWAP
    last_bid SETGLOB
    32 LDU
    SWAP
    last_bid_at SETGLOB
    32 LDU
    SWAP
    end_time SETGLOB
    32 LDU
    SWAP
    step_time SETGLOB
    32 LDU
    DROP
    try_step_time SETGLOB
    LDREF
    DROP
    CTOS
    LDMSGADDR
    SWAP
    nft_owner SETGLOB
    LDMSGADDR
    DROP
    nft_addr SETGLOB
    TRUE
    init? SETGLOB
  }>
  pack_data PROCREF:<{
    royalty_fee_base GETGLOB
    royalty_fee_factor GETGLOB
    mp_fee_base GETGLOB
    mp_fee_factor GETGLOB
    NEWC
    mp_fee_addr GETGLOB
    STSLICER
    32 STU
    32 STU
    royalty_fee_addr GETGLOB
    STSLICER
    32 STU
    32 STU
    try_step_time GETGLOB
    step_time GETGLOB
    end_time GETGLOB
    last_bid_at GETGLOB
    NEWC
    min_bid GETGLOB
    STVARUINT16
    max_bid GETGLOB
    STVARUINT16
    min_step GETGLOB
    STVARUINT16
    last_member GETGLOB
    STSLICER
    last_bid GETGLOB
    STVARUINT16
    32 STU
    32 STU
    32 STU
    32 STU
    NEWC
    nft_owner GETGLOB
    STSLICER
    nft_addr GETGLOB
    STSLICER
    ENDC
    SWAP
    ENDC
    s0 s2 XCHG
    ENDC
    is_canceled? GETGLOB
    created_at? GETGLOB
    activated? GETGLOB
    end? GETGLOB
    NEWC
    1 STI
    mp_addr GETGLOB
    STSLICER
    1 STI
    32 STI
    1 STI
    STREF
    s1 s2 XCHG
    STREF
    STREF
    ENDC
    c4 POP
  }>
  handle::return_transaction PROCREF:<{
    0 PUSHINT
    DUP
    24 PUSHINT
    NEWC
    6 STU
    s0 s3 XCHG2
    STSLICER
    OVER
    STVARUINT16
    s1 s2 XCHG
    107 STU
    32 STU
    <b 124 word Your transaction has not been accepted.| $, b> <s PUSHSLICE
    STSLICER
    ENDC
    64 PUSHINT
    SENDRAWMSG
  }>
  handle::try_init_auction PROCREF:<{
    NIP
    1001 PUSHINT
    nft_owner GETGLOB
    SBITS
    2 GTINT
    THROWANYIF
    1002 PUSHINT
    SWAP
    32 LDU
    0x05138d91 PUSHINT
    s1 s2 XCHG
    EQUAL
    s1 s2 XCHG
    THROWANYIFNOT
    64 PUSHINT
    SDSKIPFIRST
    LDMSGADDR
    DROP
    nft_owner SETGLOB
    FALSE
    end? SETGLOB
    TRUE
    activated? SETGLOB
    pack_data INLINECALLDICT
  }>
  handle::try_cancel PROCREF:<{
    1004 PUSHINT
    <b 124 word cancel| $, b> <s PUSHSLICE
    s1 s2 XCHG
    SDEQ
    NOT
    THROWANYIF
    last_bid GETGLOB
    0 GTINT
    IF:<{
      0 PUSHINT
      DUP
      24 PUSHINT
      NEWC
      6 STU
      last_member GETGLOB
      STSLICER
      last_bid GETGLOB
      STVARUINT16
      107 STU
      32 STU
      <b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE
      STSLICER
      ENDC
      2 PUSHINT
      SENDRAWMSG
    }>
    0 PUSHINT
    DUP
    LTIME
    0x5fcc3d14 PUSHINT
    NEWC
    32 STU
    64 STU
    nft_owner GETGLOB
    STSLICER
    nft_owner GETGLOB
    STSLICER
    1 STU
    OVER
    STVARUINT16
    1 STU
    ENDC
    1 PUSHINT
    24 PUSHINT
    NEWC
    6 STU
    nft_addr GETGLOB
    STSLICER
    0 PUSHINT
    STVARUINT16
    107 STU
    STREF
    1000000 PUSHINT
    0 PUSHINT
    RAWRESERVE
    ENDC
    7 PUSHPOW2
    SENDRAWMSG
    TRUE
    end? SETGLOB
    TRUE
    is_canceled? SETGLOB
    pack_data INLINECALLDICT
  }>
  handle::end_auction PROCREF:<{
    last_bid GETGLOB
    0 EQINT
    IF:<{
      0 PUSHINT
      DUP
      LTIME
      0x5fcc3d14 PUSHINT
      NEWC
      32 STU
      64 STU
      nft_owner GETGLOB
      STSLICER
      nft_owner GETGLOB
      STSLICER
      1 STU
      OVER
      STVARUINT16
      1 STU
      ENDC
      1 PUSHINT
      24 PUSHINT
      NEWC
      6 STU
      nft_addr GETGLOB
      STSLICER
      0 PUSHINT
      STVARUINT16
      107 STU
      STREF
      1000000 PUSHINT
      0 PUSHINT
      RAWRESERVE
      ENDC
      7 PUSHPOW2
      SENDRAWMSG
    }>ELSE<{
      0 PUSHINT
      DUP
      LTIME
      0x5fcc3d14 PUSHINT
      NEWC
      32 STU
      64 STU
      last_member GETGLOB
      STSLICER
      nft_owner GETGLOB
      STSLICER
      1 STU
      30000000 PUSHINT
      STVARUINT16
      1 STU
      ENDC
      1 PUSHINT
      24 PUSHINT
      NEWC
      6 STU
      nft_addr GETGLOB
      STSLICER
      1000000000 PUSHINT
      STVARUINT16
      107 STU
      STREF
      ENDC
      2 PUSHINT
      SENDRAWMSG
      last_bid GETGLOB
      mp_fee_factor GETGLOB
      mp_fee_base GETGLOB
      math::get_percent CALLDICT
      DUP
      0 GTINT
      IF:<{
        0 PUSHINT
        DUP
        24 PUSHINT
        NEWC
        6 STU
        mp_fee_addr GETGLOB
        STSLICER
        s0 s3 XCHG2
        STVARUINT16
        s1 s2 XCHG
        107 STU
        32 STU
        <b 124 word Marketplace commission withdraw| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        3 PUSHINT
        SENDRAWMSG
      }>ELSE<{
        DROP
      }>
      last_bid GETGLOB
      royalty_fee_factor GETGLOB
      royalty_fee_base GETGLOB
      math::get_percent CALLDICT
      DUP
      0 GTINT
      IF:<{
        0 PUSHINT
        DUP
        24 PUSHINT
        NEWC
        6 STU
        royalty_fee_addr GETGLOB
        STSLICER
        s0 s3 XCHG2
        STVARUINT16
        s1 s2 XCHG
        107 STU
        32 STU
        <b 124 word Royalty commission withdraw| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        3 PUSHINT
        SENDRAWMSG
      }>ELSE<{
        DROP
      }>
      1000000 PUSHINT
      0 PUSHINT
      RAWRESERVE
      0 PUSHINT
      DUP
      24 PUSHINT
      NEWC
      6 STU
      nft_owner GETGLOB
      STSLICER
      OVER
      STVARUINT16
      107 STU
      32 STU
      <b 124 word Previous owner withdraw| $, b> <s PUSHSLICE
      STSLICER
      ENDC
      7 PUSHPOW2
      SENDRAWMSG
    }>
    TRUE
    end? SETGLOB
    pack_data INLINECALLDICT
  }>
  handle::new_bid PROCREF:<{
    1005 PUSHINT
    end? GETGLOB
    -1 EQINT
    THROWANYIF
    end_time GETGLOB
    NOW
    LESS
    IFJMP:<{
      DROP
      handle::return_transaction INLINECALLDICT
      handle::end_auction INLINECALLDICT
    }>
    max_bid GETGLOB
    0 GTINT
    max_bid GETGLOB
    s2 s(-1) PUXC
    GEQ
    AND
    IFJMP:<{
      last_bid GETGLOB
      IF:<{
        0 PUSHINT
        DUP
        24 PUSHINT
        NEWC
        6 STU
        last_member GETGLOB
        STSLICER
        last_bid GETGLOB
        STVARUINT16
        107 STU
        32 STU
        <b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        2 PUSHINT
        SENDRAWMSG
      }>
      SWAP
      last_member SETGLOB
      last_bid SETGLOB
      NOW
      last_bid_at SETGLOB
      handle::end_auction INLINECALLDICT
    }>
    end_time GETGLOB
    try_step_time GETGLOB
    SUB
    NOW
    LESS
    IF:<{
      end_time GETGLOB
      step_time GETGLOB
      ADD
      end_time SETGLOB
    }>
    last_bid GETGLOB
    IFNOTJMP:<{
      1000 PUSHINT
      min_bid GETGLOB
      s2 s(-1) PUXC
      LESS
      THROWANYIF
      last_bid SETGLOB
      last_member SETGLOB
      NOW
      last_bid_at SETGLOB
      pack_data INLINECALLDICT
    }>
    last_bid GETGLOB
    min_step GETGLOB
    ADD
    s1 s(-1) PUXC
    LESS
    IFJMP:<{
      DROP
      handle::return_transaction INLINECALLDICT
    }>
    0 PUSHINT
    DUP
    24 PUSHINT
    NEWC
    6 STU
    last_member GETGLOB
    STSLICER
    last_bid GETGLOB
    STVARUINT16
    107 STU
    32 STU
    <b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE
    STSLICER
    ENDC
    2 PUSHINT
    SENDRAWMSG
    SWAP
    last_member SETGLOB
    last_bid SETGLOB
    NOW
    last_bid_at SETGLOB
    pack_data INLINECALLDICT
  }>
  get_nft_owner PROC:<{
    init_data INLINECALLDICT
    nft_owner GETGLOB
    SBITS
    3 LESSINT
    IFJMP:<{
      0 PUSHINT
      DUP
    }>
    nft_owner GETGLOB
    REWRITESTDADDR
  }>
  get_nft_addr PROC:<{
    init_data INLINECALLDICT
    nft_addr GETGLOB
    SBITS
    3 LESSINT
    IFJMP:<{
      0 PUSHINT
      DUP
    }>
    nft_addr GETGLOB
    REWRITESTDADDR
  }>
  get_last_member PROC:<{
    init_data INLINECALLDICT
    last_member GETGLOB
    REWRITESTDADDR
  }>
  get_mp_addr PROC:<{
    init_data INLINECALLDICT
    mp_addr GETGLOB
    REWRITESTDADDR
  }>
  get_mp_fee_addr PROC:<{
    init_data INLINECALLDICT
    mp_fee_addr GETGLOB
    REWRITESTDADDR
  }>
  get_royalty_fee_addr PROC:<{
    init_data INLINECALLDICT
    royalty_fee_addr GETGLOB
    REWRITESTDADDR
  }>
  get_fees_info PROC:<{
    init_data INLINECALLDICT
    mp_fee_factor GETGLOB
    mp_fee_base GETGLOB
    royalty_fee_factor GETGLOB
    royalty_fee_base GETGLOB
  }>
  get_bid_info PROC:<{
    init_data INLINECALLDICT
    min_bid GETGLOB
    max_bid GETGLOB
    min_step GETGLOB
    last_bid GETGLOB
    end_time GETGLOB
  }>
  get_sale_data PROC:<{
    init_data INLINECALLDICT
    4281667 PUSHINT
    end? GETGLOB
    end_time GETGLOB
    mp_addr GETGLOB
    nft_addr GETGLOB
    nft_owner GETGLOB
    last_bid GETGLOB
    last_member GETGLOB
    min_step GETGLOB
    mp_fee_addr GETGLOB
    mp_fee_factor GETGLOB
    mp_fee_base GETGLOB
    royalty_fee_addr GETGLOB
    royalty_fee_factor GETGLOB
    royalty_fee_base GETGLOB
    max_bid GETGLOB
    min_bid GETGLOB
    created_at? GETGLOB
    last_bid_at GETGLOB
    is_canceled? GETGLOB
  }>
  recv_internal PROC:<{
    s3 POP
    CTOS
    4 LDU
    SWAP
    1 PUSHINT
    AND
    0 THROWIF
    LDMSGADDR
    DROP
    init_data INLINECALLDICT
    mp_addr GETGLOB
    s1 s(-1) PUXC
    SDEQ
    end? GETGLOB
    AND
    -1 EQINT
    IFJMP:<{
      2DROP
      32 LDU
      OVER
      0 EQINT
      <b 124 word repeat_end_auction| $, b> <s PUSHSLICE
      s2 s(-1) PUXC
      SDEQ
      AND
      IFJMP:<{
        2DROP
        handle::end_auction INLINECALLDICT
      }>
      SWAP
      0 EQINT
      <b 124 word emergency_message| $, b> <s PUSHSLICE
      s2 s(-1) PUXC
      SDEQ
      AND
      IFJMP:<{
        LDREF
        DROP
        CTOS
        8 LDU
        LDREF
        DROP
        SWAP
        SENDRAWMSG
      }>
      DROP
    }>
    nft_addr GETGLOB
    s1 s(-1) PUXC
    SDEQ
    IFJMP:<{
      NIP
      SWAP
      handle::try_init_auction INLINECALLDICT
    }>
    NOW
    end_time GETGLOB
    GEQ
    IFJMP:<{
      2 1 BLKDROP2
      handle::return_transaction INLINECALLDICT
      handle::end_auction INLINECALLDICT
    }>
    end? GETGLOB
    -1 EQINT
    IFJMP:<{
      2 1 BLKDROP2
      handle::return_transaction INLINECALLDICT
    }>
    nft_owner GETGLOB
    s1 s(-1) PUXC
    SDEQ
    mp_addr GETGLOB
    s2 s(-1) PUXC
    SDEQ
    OR
    IFJMP:<{
      NIP
      1003 PUSHINT
      s0 s2 XCHG
      32 LDU
      SWAP
      0 NEQINT
      s1 s3 XCHG
      THROWANYIF
      <b 124 word cancel| $, b> <s PUSHSLICE
      s2 s(-1) PUXC
      SDEQ
      IF:<{
        OVER
        handle::try_cancel INLINECALLDICT
      }>
      <b 124 word stop| $, b> <s PUSHSLICE
      s1 s2 XCHG
      SDEQ
      nft_owner GETGLOB
      s2 s(-1) PUXC
      SDEQ
      AND
      IF:<{
        handle::return_transaction INLINECALLDICT
        handle::end_auction INLINECALLDICT
      }>ELSE<{
        DROP
      }>
    }>
    s2 POP
    handle::new_bid INLINECALLDICT
  }>
  recv_external PROC:<{
    DROP
    init_data INLINECALLDICT
    1006 PUSHINT
    activated? GETGLOB
    -1 EQINT
    THROWANYIF
    ACCEPT
    TRUE
    activated? SETGLOB
    pack_data INLINECALLDICT
  }>
}END>c



================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/nft-auction.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/nft-auction.func
================================================
;;
;;  main FunC file git@github.com:cryshado/nft-auc-contest.git
;;

int equal_slices? (slice a, slice b) asm "SDEQ";

#include "struct/stdlib.fc";
#include "struct/op-codes.func";
#include "struct/exit-codes.func";
#include "struct/math.func";
#include "struct/msg-utils.func";
#include "struct/storage.func";
#include "struct/handles.func";
#include "struct/get-met.func";

{-
    SHOULD
    [+] accept coins for deploy
    [+] accept nft and change auction statud
    [+] return transaction if auction already end
    [+] can cancel auction
    [+] accept new bid -> check auction end -> end auction
-}
() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
    slice cs = in_msg_cell.begin_parse();
    throw_if(0, cs~load_uint(4) & 1);

    slice sender_addr = cs~load_msg_addr();
    init_data();

    if (equal_slices?(sender_addr, mp_addr) & end? == true) {
        int op = in_msg_body~load_uint(32);
        if ((op == 0) & equal_slices(in_msg_body, msg::repeat_end_auction())) {
            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            handle::end_auction();
            return ();
        }
        if ((op == 0) & equal_slices(in_msg_body, msg::emergency_message())) {
            ;; way to fix unexpected troubles with auction contract
            ;; for example if some one transfer nft to this contract
            var msg = in_msg_body~load_ref().begin_parse();
            var mode = msg~load_uint(8);
            send_raw_message(msg~load_ref(), mode);
            return ();
        }
        ;; accept coins for deploy
        return ();
    }

    if (equal_slices?(sender_addr, nft_addr)) {
        handle::try_init_auction(sender_addr, in_msg_body);
        return ();
    }

    if (now() >= end_time) {
        handle::return_transaction(sender_addr);
        handle::end_auction();
        return ();
    }

    if (end? == true) {
        handle::return_transaction(sender_addr);
        return ();
    }

    if (equal_slices?(sender_addr, nft_owner)) | (equal_slices?(sender_addr, mp_addr)) {
        throw_if(;;throw if it`s not message
                exit::not_message(),
                in_msg_body~load_uint(32) != 0
        );

        if (equal_slices?(in_msg_body, msg::cancel_msg())) {
            handle::try_cancel(in_msg_body);
        }

        if (equal_slices?(in_msg_body, msg::stop_msg()) & equal_slices?(sender_addr, nft_owner)) {
            handle::return_transaction(sender_addr);
            handle::end_auction();
        }

        return ();
    }

    handle::new_bid(sender_addr, msg_value);
}

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure {
    init_data();
    throw_if(exit::already_activated(), activated? == true);
    accept_message();
    activated? = true;
    pack_data();
}


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/exit-codes.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/exit-codes.func
================================================
;;
;;  custom TVM exit codes
;;

int exit::low_bid()           asm "1000 PUSHINT";
int exit::auction_init()      asm "1001 PUSHINT";
int exit::no_transfer()       asm "1002 PUSHINT";
int exit::not_message()       asm "1003 PUSHINT";
int exit::not_cancel()        asm "1004 PUSHINT";
int exit::auction_end()       asm "1005 PUSHINT";
int exit::already_activated() asm "1006 PUSHINT";



================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/get-met.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/get-met.func
================================================
(int, int) get_nft_owner() method_id {
    init_data();

    if (nft_owner.slice_bits() <= 2) { return (0, 0);}

    (int wc, int addr) = parse_std_addr(nft_owner);
    return (wc, addr);
}

(int, int) get_nft_addr() method_id {
    init_data();

    if (nft_addr.slice_bits() <= 2) { return (0, 0);}

    (int wc, int addr) = parse_std_addr(nft_addr);
    return (wc, addr);
}

(int, int) get_last_member() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(last_member);
    return (wc, addr);
}

(int, int) get_mp_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(mp_addr);
    return (wc, addr);
}

(int, int) get_mp_fee_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(mp_fee_addr);
    return (wc, addr);
}

(int, int) get_royalty_fee_addr() method_id {
    init_data();
    ;; trhow error of addr not std
    (int wc, int addr) = parse_std_addr(royalty_fee_addr);
    return (wc, addr);
}

(int, int, int, int) get_fees_info() method_id {
    init_data();
    return (
            mp_fee_factor, mp_fee_base,
            royalty_fee_factor, royalty_fee_base
    );
}

(int, int, int, int, int) get_bid_info() method_id {
    init_data();
    return (
            min_bid, max_bid, min_step,
            last_bid, end_time
    );
}

;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
    init_data();

    return (
            0x415543, ;; 1 nft aucion ("AUC")
            end?, ;; 2
            end_time, ;; 3
            mp_addr, ;; 4
            nft_addr, ;; 5
            nft_owner, ;; 6
            last_bid, ;; 7
            last_member, ;; 8
            min_step, ;; 9
            mp_fee_addr, ;; 10
            mp_fee_factor, mp_fee_base, ;; 11, 12
            royalty_fee_addr, ;; 13
            royalty_fee_factor, royalty_fee_base, ;; 14, 15
            max_bid, ;; 16
            min_bid, ;; 17
            created_at?, ;; 18
            last_bid_at, ;; 19
            is_canceled? ;; 20
    );
}



================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/handles.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/handles.func
================================================
;;
;;  function handlers
;;

() handle::return_transaction(slice sender_addr) impure inline_ref {
    builder return_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender_addr)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(0, 32)
            .store_slice(msg::return_msg());
    send_raw_message(return_msg.end_cell(), 64);
}

{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    throw_if(exit::auction_init(), nft_owner.slice_bits() > 2); ;; throw if auction already init
    throw_unless(exit::no_transfer(), in_msg_body~load_uint(32) == op::ownership_assigned()); ;; throw if it`s not ownership assigned
    in_msg_body~skip_bits(64); ;; query id
    nft_owner = in_msg_body~load_msg_addr();
    end? = false;
    activated? = true;
    pack_data();
}


{-
    SHOULD
    [+] return prev bid 
    [+] return nft to owner
    [+] reserve 0,001 ton 
-}
() handle::try_cancel(slice in_msg_body) impure inline_ref {
    throw_if(;; throw if msg not "cancel"
            exit::not_cancel(),
            ~(equal_slices?(in_msg_body, msg::cancel_msg()))
    );

    if (last_bid > 0) {
        builder bid_return = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(last_member)
                .store_coins(last_bid)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice(msg::bid_return());

        send_raw_message(bid_return.end_cell(), 2); ;; ignore errors
    }

    builder nft_return_body = begin_cell()
            .store_uint(op::transfer(), 32)
            .store_uint(cur_lt(), 64) ;; query id
            .store_slice(nft_owner) ;; new owner
            .store_slice(nft_owner) ;; response_destination
            .store_uint(0, 1) ;; custom payload
            .store_coins(0) ;; forward amount
            .store_uint(0, 1); ;; forward payload

    builder nft_return_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_addr)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(nft_return_body.end_cell());

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    send_raw_message(nft_return_msg.end_cell(), 128);
    end? = true;
    is_canceled? = true;
    pack_data();
}

{-
    SHOULD
    [+] transfer nft
    [+] send marketplace fee
    [+] send royalty fee
    [+] reserve 0,001 ton 
    [+] send profit to previous nft owner
    [+] change auction status
-}
() handle::end_auction() impure inline_ref {
    if (last_bid == 0) {
        builder nft_return_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(nft_owner) ;; new owner
                .store_slice(nft_owner) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(0) ;; forward amount
                .store_uint(0, 1); ;; forward payload

        builder nft_return_msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_return_body.end_cell());

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        send_raw_message(nft_return_msg.end_cell(), 128);
    } else {
        builder nft_transfer_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(last_member) ;; new owner
                .store_slice(nft_owner) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(30000000) ;; forward amount  0,03 ton
                .store_uint(0, 1); ;; forward payload
        builder nft_transfer = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(1000000000) ;; 1 ton
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_transfer_body.end_cell());
        send_raw_message(nft_transfer.end_cell(), 2);


        int mp_fee = math::get_percent(last_bid, mp_fee_factor, mp_fee_base);

        if (mp_fee > 0) {
            builder mp_transfer = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(mp_fee_addr)
                    .store_coins(mp_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::mp_msg());

            send_raw_message(mp_transfer.end_cell(), 3);
        }

        int royalty_fee = math::get_percent(last_bid, royalty_fee_factor, royalty_fee_base);

        if (royalty_fee > 0) {
            builder royalty_transfer = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(royalty_fee_addr)
                    .store_coins(royalty_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::royalty_msg());

            send_raw_message(royalty_transfer.end_cell(), 3);
        }

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        builder prev_owner_msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_owner)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice(msg::profit_msg());

        send_raw_message(prev_owner_msg.end_cell(), 128);
    }
    end? = true;
    pack_data();
}


{-
    SHOULD 
    [+] check if first bid
    [+] check time  
    [+] check bid step amount
    [+] check init auction or not 
    [+] return prev bid
    [+] change bid info
    [+] check max bid
-}
() handle::new_bid(slice sender_addr, int msg_value) impure inline_ref {
    throw_if(exit::auction_end(), end? == true);

    if (end_time < now()) {
        handle::return_transaction(sender_addr);
        handle::end_auction();
        return ();
    }

    if ((max_bid > 0) & (msg_value >= max_bid)) {
        if (last_bid) {
            builder return_prev_bid = begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(last_member)
                    .store_coins(last_bid)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::bid_return());
            send_raw_message(return_prev_bid.end_cell(), 2);
        }
        last_member = sender_addr;
        last_bid = msg_value;
        last_bid_at = now();
        handle::end_auction();
        return ();
    }

    ;; 990(now) 1000(end time) 100(try step time)
    if ((end_time - try_step_time) < now()) {
        end_time += step_time;
    }

    ifnot(last_bid) {
        throw_if(exit::low_bid(), msg_value < min_bid);
        last_bid = msg_value;
        last_member = sender_addr;
        last_bid_at = now();
        pack_data();
        return ();
    }

    if (msg_value < (last_bid + min_step)) {
        handle::return_transaction(sender_addr);
        return ();
    }

    builder return_prev_bid = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(last_member)
            .store_coins(last_bid)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(0, 32)
            .store_slice(msg::bid_return());

    send_raw_message(return_prev_bid.end_cell(), 2);

    last_member = sender_addr;
    last_bid = msg_value;
    last_bid_at = now();

    pack_data();
}



================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/math.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/math.func
================================================
;;
;;  math utils
;;

int division(int a, int b) { ;; division with factor
    return muldiv(a, 1000000000 {- 1e9 -}, b);
}

int multiply(int a, int b) { ;; multiply with factor
    return muldiv (a, b, 1000000000 {- 1e9 -});
}

int math::get_percent(int a, int percent, int factor) {
    return division(multiply(a, percent), factor);
}


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/msg-utils.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/msg-utils.func
================================================
;;
;;  text constants for msg comments
;;

slice msg::cancel_msg()     asm "<b 124 word cancel| $, b> <s PUSHSLICE";
slice msg::stop_msg()       asm "<b 124 word stop| $, b> <s PUSHSLICE";

slice msg::return_msg()     asm "<b 124 word Your transaction has not been accepted.| $, b> <s PUSHSLICE";
slice msg::bid_return()     asm "<b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE";
slice msg::mp_msg()         asm "<b 124 word Marketplace commission withdraw| $, b> <s PUSHSLICE";
slice msg::royalty_msg()    asm "<b 124 word Royalty commission withdraw| $, b> <s PUSHSLICE";
slice msg::profit_msg()     asm "<b 124 word Previous owner withdraw| $, b> <s PUSHSLICE";

slice msg::repeat_end_auction()     asm "<b 124 word repeat_end_auction| $, b> <s PUSHSLICE";
slice msg::emergency_message()      asm "<b 124 word emergency_message| $, b> <s PUSHSLICE";


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/op-codes.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/op-codes.func
================================================
;;
;;  op codes
;;

int op::transfer()              asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned()    asm "0x05138d91 PUSHINT";


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/stdlib.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/stdlib.fc
================================================
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
    builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
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
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: src/wrappers/getgems/NftAuction/nft-auction/struct/storage.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuction/nft-auction/struct/storage.func
================================================
;;
;;  persistant and runtime storage вescription
;;

global int      init?; ;; init_data safe check
global int      end?; ;; end auction or not
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed
global int      activated?; ;; contract is activated by external message or by nft transfer
global int      created_at?; ;; timestamp of created acution
global int      is_canceled?; ;; auction was cancelled by owner

;; fees cell (ref)
global slice    mp_fee_addr; ;; the address of the marketplace where the commission goes
global int      mp_fee_factor; ;;
global int      mp_fee_base; ;;
global slice    royalty_fee_addr; ;; the address of the collection owner where the commission goes
global int      royalty_fee_factor; ;;
global int      royalty_fee_base; ;;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)
global int      try_step_time; ;; after what time to start increasing the time (e.g. 60)

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address


() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

    slice ds = get_data().begin_parse();
    end? = ds~load_int(1);
    mp_addr = ds~load_msg_addr();
    activated? = ds~load_int(1);
    created_at? = ds~load_int(32);
    is_canceled? = ds~load_int(1);

    slice fees_cell = ds~load_ref().begin_parse();
    mp_fee_addr = fees_cell~load_msg_addr();
    mp_fee_factor = fees_cell~load_uint(32);
    mp_fee_base = fees_cell~load_uint(32);
    royalty_fee_addr = fees_cell~load_msg_addr();
    royalty_fee_factor = fees_cell~load_uint(32);
    royalty_fee_base = fees_cell~load_uint(32);

    slice bids_cell = ds~load_ref().begin_parse();
    min_bid = bids_cell~load_coins();
    max_bid = bids_cell~load_coins();
    min_step = bids_cell~load_coins();
    last_member = bids_cell~load_msg_addr();
    last_bid = bids_cell~load_coins();
    last_bid_at = bids_cell~load_uint(32);
    end_time = bids_cell~load_uint(32);
    step_time = bids_cell~load_uint(32);
    try_step_time = bids_cell~load_uint(32);

    slice nft_cell = ds~load_ref().begin_parse();
    nft_owner = nft_cell~load_msg_addr();
    nft_addr = nft_cell~load_msg_addr();

    init? = true;
}

() pack_data() impure inline_ref {
    builder fees_cell = begin_cell()
            .store_slice(mp_fee_addr) ;; + max    267 ($10 with Anycast = 0)
            .store_uint(mp_fee_factor, 32) ;; + stc    32
            .store_uint(mp_fee_base, 32) ;; + stc    32
            .store_slice(royalty_fee_addr) ;; + max    267 ($10 with Anycast = 0)
            .store_uint(royalty_fee_factor, 32) ;; + stc    32
            .store_uint(royalty_fee_base, 32); ;; + stc    32
    ;; total: (267 * 2) + (32 * 4) = 662 maximum bits

    builder bids_cell = begin_cell()
            .store_coins(min_bid) ;; + max    124
            .store_coins(max_bid) ;; + max    124
            .store_coins(min_step) ;; + max    124
            .store_slice(last_member) ;; + max    267 ($10 with Anycast = 0)
            .store_coins(last_bid) ;; + max    124
            .store_uint(last_bid_at, 32) ;; + stc    32
            .store_uint(end_time, 32) ;; + stc    32
            .store_uint(step_time, 32) ;; + stc    32
            .store_uint(try_step_time, 32); ;; +stc     32
    ;; total 32*4 + 124*4 + 267 = 891

    builder nft_cell = begin_cell()
            .store_slice(nft_owner) ;; + max    267 ($10 with Anycast = 0)
            .store_slice(nft_addr); ;; + max    267 ($10 with Anycast = 0)
    ;; total: 267 * 2 = 534 maximum bits

    set_data(
            begin_cell()
                    .store_int(end?, 1) ;; + stc    1
                    .store_slice(mp_addr) ;; + max    267 ($10 with Anycast = 0)
                    .store_int(activated?, 1) ;; activated?
                    .store_int(created_at?, 32)
                    .store_int(is_canceled?, 1)
                    .store_ref(fees_cell.end_cell()) ;; + ref
                    .store_ref(bids_cell.end_cell()) ;; + ref
                    .store_ref(nft_cell.end_cell()) ;; + ref
                    .end_cell()
    );
}




================================================
FILE: src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/NftAuctionV2.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, contractAddress } from 'ton-core'

/**
 * Class representing an NFT auction contract version 2.
 */
export class NftAuctionV2 implements Contract {
    /**
     * Creates an `NftAuctionV2` instance from an address and initialization data.
     * @param address - The address of the contract.
     * @param init - The initialization data.
     * @returns A new `NftAuctionV2` instance.
     */
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static code = Cell.fromBoc(Buffer.from('te6cckECHQEABZMAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8GxwCAs4GBwKLoDhZtnm2eQQQgqqH8IXwofCH8KfwpfCd8JvwmfCX8JXwi/Cf8IwaIiYaGCIkGBYiIhYUIiAUIT4hHCD6INggtiD0INIgsRsaAgEgCAkCASAYGQT1AHQ0wMBcbDyQPpAMNs8+ELA//hDUiDHBbCO0DMx0x8hwACNBJyZXBlYXRfZW5kX2F1Y3Rpb26BSIMcFsI6DW9s84DLAAI0EWVtZXJnZW5jeV9tZXNzYWdlgUiDHBbCa1DDQ0wfUMAH7AOAw4PhTUhDHBY6EMzHbPOABgGxIKCwATIIQO5rKAAGphIAFcMYED6fhS10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HJw+GJ/+GTbPBwEhts8IMABjzgwgQPt+CP4UL7y8oED7fhCwP/y8oED8AKCEDuaygC5EvLy+FJSEMcF+ENSIMcFsfLhkwF/2zzbPOAgwAIMFQ0OAIwgxwDA/5IwcODTHzGLZjYW5jZWyCHHBZIwceCLRzdG9wghxwWSMHLgi2ZmluaXNoghxwWSMHLgi2ZGVwbG95gBxwWRc+BwAYpwIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwcBPyOwzAygQPt+ELA//LygQPwAYIQO5rKALny8vgj+FC+jhf4UlIQxwX4Q1IgxwWx+E1SIMcFsfLhk5n4UlIQxwXy4ZPi2zzgwAOSXwPg+ELA//gj+FC+sZdfA4ED7fLw4PhLghA7msoAoFIgvvhLwgCw4wL4UPhRofgjueMA+E4SDxARAiwCcNs8IfhtghA7msoAofhu+CP4b9s8FRIADvhQ+FGg+HADcI6VMoED6PhKUiC58vL4bvht+CP4b9s84fhO+EygUiC5l18DgQPo8vDgAnDbPAH4bfhu+CP4b9s8HBUcApT4TsAAjj1wIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsA4w5/+GLbPBMcAvrbPPhOQFTwAyDCAI4rcCCAEMjLBVAHzxYi+gIWy2oVyx+L9NYXJrZXRwbGFjZSBmZWWM8WyXL7AJE04vhOQAPwAyDCAI4jcCCAEMjLBVAEzxYi+gITy2oSyx+LdSb3lhbHR5jPFsly+wCRMeKCCA9CQHD7AvhOWKEBoSDCABoUAMCOInAggBDIywX4Us8WUAP6AhLLassfi2UHJvZml0jPFsly+wCRMOJwIPglghBfzD0UyMsfyz/4Tc8WUAPPFhLLAIIImJaA+gLLAMlxgBjIywX4U88WcPoCy2rMyYMG+wAC8vhOwQGRW+D4TvhHoSKCCJiWgKFSELyZMAGCCJiWgKEBkTLijQpWW91ciBiaWQgaGFzIGJlZW4gb3V0YmlkIGJ5IGFub3RoZXIgdXNlci6ABwP+OHzCNBtBdWN0aW9uIGhhcyBiZWVuIGNhbmNlbGxlZC6DeIcIA4w8WFwA4cCCAGMjLBfhNzxZQBPoCE8tqEssfAc8WyXL7AAACWwARIIQO5rKAKmEgAB0IMAAk18DcOBZ8AIB8AGAAIPhI0PpA0x/TH/pA0x/THzAAyvhBbt3tRNDSAAH4YtIAAfhk0gAB+Gb6QAH4bfoAAfhu0x8B+G/THwH4cPpAAfhy1AH4aNQw+Gn4SdDSHwH4Z/pAAfhj+gAB+Gr6AAH4a/oAAfhs0x8B+HH6QAH4c9MfMPhlf/hhAFT4SfhI+FD4T/hG+ET4QsjKAMoAygD4Tc8W+E76Assfyx/4Us8WzMzJ7VQBqlR8', 'base64'))[0]

    /**
     * Builds the data cell for the auction contract.
     * @param data - The data for building the data cell.
     * @returns The built data cell.
     */
    static buildDataCell(data: NftAuctionV2Data) {

        const constantCell = beginCell()
        const subGasPriceFromBid = 8449000
        constantCell.storeUint(subGasPriceFromBid, 32)
        constantCell.storeAddress(data.marketplaceAddress)
        constantCell.storeCoins(data.minBid)
        constantCell.storeCoins(data.maxBid)
        constantCell.storeCoins(data.minStep)
        constantCell.storeUint(data.stepTimeSeconds, 32) // step_time
        constantCell.storeAddress(data.nftAddress)
        constantCell.storeUint(data.createdAtTimestamp, 32)

        const feesCell = beginCell()
        feesCell.storeAddress(data.marketplaceFeeAddress)      // mp_fee_addr
        feesCell.storeUint(data.marketplaceFeeFactor, 32)               // mp_fee_factor
        feesCell.storeUint(data.marketplaceFeeBase, 32)   // mp_fee_base
        feesCell.storeAddress(data.royaltyAddress)  // royalty_fee_addr
        feesCell.storeUint(data.royaltyFactor, 32)              // royalty_fee_factor
        feesCell.storeUint(data.royaltyBase, 32)   // royalty_fee_base


        const storage = beginCell()
        storage.storeBit(data.end) // end?
        storage.storeBit(data.activated) // activated
        storage.storeBit(false) // is_canceled
        storage.storeBuffer(Buffer.from([0, 0]))        // last_member
        storage.storeCoins(0)       // last_bid
        storage.storeUint(0, 32) // last_bid_at
        storage.storeUint(data.endTimestamp, 32)    // end_time
        if (data.nftOwnerAddress) {
            storage.storeAddress(data.nftOwnerAddress)
        } else {
            storage.storeBuffer(Buffer.from([0, 0]))
        }
        storage.storeRef(feesCell.endCell())
        storage.storeRef(constantCell.endCell())

        return storage.endCell()
    }

    /**
     * Creates an `NftAuctionV2` instance from an address.
     * @param address - The address to create from.
     * @returns A new `NftAuctionV2` instance.
     */
    static createFromAddress(
        address: Address,
    ) {
        return new NftAuctionV2(
            address
        )
    }

    /**
     * Creates an `NftAuctionV2` instance from configuration data.
     * @param config - The configuration data for creating the instance.
     * @param workchain - The workchain ID (default: 0).
     * @returns A new `NftAuctionV2` instance.
     */
    static createFromConfig(
        config: NftAuctionV2Data,
        workchain = 0
    ) {
        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftAuctionV2(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends a cancel command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the cancel command.
     * @param params - The parameters for the cancel command.
     */
    async sendCancel(provider: ContractProvider, via: Sender, params: { 
        value: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(0,32)
                .storeBuffer(Buffer.from('cancel'))
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }
    
    /**
     * Sends a stop command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the stop command.
     * @param params - The parameters for the stop command.
     */
    async sendStop(provider: ContractProvider, via: Sender, params: { 
        value: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(0,32)
                .storeBuffer(Buffer.from('cancel'))
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Retrieves the sale data from the contract.
     * @param provider - The contract provider.
     * @returns The sale data.
     */
    async getSaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_sale_data', [])

        // pops out saleType
        stack.pop()

        return {
            end: stack.readBigNumber(),
            endTimestamp: stack.readBigNumber(),
            marketplaceAddress: stack.readAddressOpt(),
            nftAddress: stack.readAddressOpt(),
            nftOwnerAddress: stack.readAddressOpt(),
            lastBidAmount: stack.readBigNumber(),
            lastBidAddress: stack.readAddressOpt(),
            minStep: stack.readBigNumber(),
            marketplaceFeeAddress: stack.readAddressOpt(),
            marketplaceFeeFactor: stack.readBigNumber(), 
            marketplaceFeeBase: stack.readBigNumber(),
            royaltyAddress: stack.readAddressOpt(),
            royaltyFactor: stack.readBigNumber(), 
            royaltyBase: stack.readBigNumber(),
            maxBid: stack.readBigNumber(),
            minBid: stack.readBigNumber(),
            createdAt: stack.readBigNumber(),
            lastBidAt: stack.readBigNumber(),
            isCanceled: stack.readBigNumber(),
        }
    }
}

/**
 * Type representing the data for an NFT auction contract version 2.
 */
export type NftAuctionV2Data = {
    marketplaceFeeAddress: Address,
    marketplaceFeeFactor: bigint,
    marketplaceFeeBase: bigint,


    royaltyAddress: Address,
    royaltyFactor: bigint,
    royaltyBase: bigint,


    minBid: bigint,
    maxBid: bigint,
    minStep: bigint,
    endTimestamp: number,
    createdAtTimestamp: number,

    stepTimeSeconds: number,
    tryStepTimeSeconds: number,

    nftOwnerAddress: Address | null,
    nftAddress: Address,

    end: boolean,
    marketplaceAddress: Address,
    activated: boolean,

}


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/build.sh
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/build.sh
================================================
#!/bin/bash
set -e
MINPUT="./nft-auction-v2.func"
OUTPUT="./nft-auction-v2-code"
FUNC_STDLIB_PATH="../stdlib.fc"

echo "building \"${MINPUT}\""

# build you own func compiler
/Users/i.nedzvetskiy/projects/ton/build/crypto/func -PA -o "${OUTPUT}.fif" ${FUNC_STDLIB_PATH} ${MINPUT}
echo -e "\"TonUtil.fif\" include\n$(cat ${OUTPUT}.fif)" > "${OUTPUT}.fif"
echo "\"${OUTPUT}.fif\" include 2 boc+>B \"${OUTPUT}.boc\" B>file" | fift -s
base64 "${OUTPUT}.boc" > "${OUTPUT}.base64"


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.base64
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.base64
================================================
te6cckECHQEABZMAART/APSkE/S88sgLAQIBIAIDAgFIBAUCKPIw2zyBA+74RMD/8vL4AH/4ZNs8GxwCAs4GBwKLoDhZtnm2eQQQgqqH8IXwofCH8KfwpfCd8JvwmfCX8JXwi/Cf8IwaIiYaGCIkGBYiIhYUIiAUIT4hHCD6INggtiD0INIgsRsaAgEgCAkCASAYGQT1AHQ0wMBcbDyQPpAMNs8+ELA//hDUiDHBbCO0DMx0x8hwACNBJyZXBlYXRfZW5kX2F1Y3Rpb26BSIMcFsI6DW9s84DLAAI0EWVtZXJnZW5jeV9tZXNzYWdlgUiDHBbCa1DDQ0wfUMAH7AOAw4PhTUhDHBY6EMzHbPOABgGxIKCwATIIQO5rKAAGphIAFcMYED6fhS10nCAvLygQPqAdMfghAFE42REroS8vSAQNch+kAw+HJw+GJ/+GTbPBwEhts8IMABjzgwgQPt+CP4UL7y8oED7fhCwP/y8oED8AKCEDuaygC5EvLy+FJSEMcF+ENSIMcFsfLhkwF/2zzbPOAgwAIMFQ0OAIwgxwDA/5IwcODTHzGLZjYW5jZWyCHHBZIwceCLRzdG9wghxwWSMHLgi2ZmluaXNoghxwWSMHLgi2ZGVwbG95gBxwWRc+BwAYpwIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsAf/hif/hm2zwcBPyOwzAygQPt+ELA//LygQPwAYIQO5rKALny8vgj+FC+jhf4UlIQxwX4Q1IgxwWx+E1SIMcFsfLhk5n4UlIQxwXy4ZPi2zzgwAOSXwPg+ELA//gj+FC+sZdfA4ED7fLw4PhLghA7msoAoFIgvvhLwgCw4wL4UPhRofgjueMA+E4SDxARAiwCcNs8IfhtghA7msoAofhu+CP4b9s8FRIADvhQ+FGg+HADcI6VMoED6PhKUiC58vL4bvht+CP4b9s84fhO+EygUiC5l18DgQPo8vDgAnDbPAH4bfhu+CP4b9s8HBUcApT4TsAAjj1wIPglghBfzD0UyMsfyz/4Us8WUAPPFhLLACH6AssAyXGAGMjLBfhTzxZw+gLLasyCCA9CQHD7AsmDBvsA4w5/+GLbPBMcAvrbPPhOQFTwAyDCAI4rcCCAEMjLBVAHzxYi+gIWy2oVyx+L9NYXJrZXRwbGFjZSBmZWWM8WyXL7AJE04vhOQAPwAyDCAI4jcCCAEMjLBVAEzxYi+gITy2oSyx+LdSb3lhbHR5jPFsly+wCRMeKCCA9CQHD7AvhOWKEBoSDCABoUAMCOInAggBDIywX4Us8WUAP6AhLLassfi2UHJvZml0jPFsly+wCRMOJwIPglghBfzD0UyMsfyz/4Tc8WUAPPFhLLAIIImJaA+gLLAMlxgBjIywX4U88WcPoCy2rMyYMG+wAC8vhOwQGRW+D4TvhHoSKCCJiWgKFSELyZMAGCCJiWgKEBkTLijQpWW91ciBiaWQgaGFzIGJlZW4gb3V0YmlkIGJ5IGFub3RoZXIgdXNlci6ABwP+OHzCNBtBdWN0aW9uIGhhcyBiZWVuIGNhbmNlbGxlZC6DeIcIA4w8WFwA4cCCAGMjLBfhNzxZQBPoCE8tqEssfAc8WyXL7AAACWwARIIQO5rKAKmEgAB0IMAAk18DcOBZ8AIB8AGAAIPhI0PpA0x/TH/pA0x/THzAAyvhBbt3tRNDSAAH4YtIAAfhk0gAB+Gb6QAH4bfoAAfhu0x8B+G/THwH4cPpAAfhy1AH4aNQw+Gn4SdDSHwH4Z/pAAfhj+gAB+Gr6AAH4a/oAAfhs0x8B+HH6QAH4c9MfMPhlf/hhAFT4SfhI+FD4T/hG+ET4QsjKAMoAygD4Tc8W+E76Assfyx/4Us8WzMzJ7VQBqlR8



================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.boc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.boc
================================================
��rA � � ������ H(�0�<���D����� �d�<���8Y�y�y��������������������"&"$""" !>! � � � � � � 	 � t4��\l<�>�6�>�?�Ԉ1�l#��t��p #A'&WVE�V�E�V7F����1�l#����8� #AV�W&vV�7���W76vX�1�l&�44�� ~�88>Ԅ1�c��v�8 `
  �沀 ja \1���R�I�����������@�!�@0�rp�b�d�<��< ��80���#�P�����B������;�� ����RR��CR �����<�<� � � � ���0p��1�f6�6V�!��0q��G7F�!��0r��ff��6�!��0r��fFW�����s�p�p �%�_�=���?�R�P�� !�� �q����S�p��ĵB@p�Ƀ� �b�f�<���02���B������;�� ����#�P���RR��CR ���MR ���ᓙ�RR�����<���_��B���#�P���_������K�;�� �R ��K� ���P�Q��#�� �N,p�<!�m�;�� ��n�#�o�< �P�Q��pp��2���JR ����n�m�#�o�<��N�L�R ��_�����p�<�m�n�#�o�<��N� �=p �%�_�=���?�R�P�� !�� �q����S�p��ĵB@p�Ƀ� ��b�<��<�N@T� � �+p ���P�"��j����&�WG�6RfVX��r� �4��N@� � �#p ���P�"��j��u&���G���r� �1�B@p��NX�� �  ��"p ����R�P��j��e&�f�H��r� �0�p �%�_�=���?�M�P�� ������ �q����S�p��j�Ƀ� ��N��[��N�G�"�����R��0������2�
V[�\��Y\��Y[��]�Y�H[��\�\�\�����0��]X�[ۈ\��Y[��[��[Y��!� � 8p ����M�P��j���r�  [  �沀*a  0 $���8| �| `  �H��@���@��0 ��An��D�� �b� �d� �f�@�m� �n��o��p�@�r��h�0�i�I���g�@�c� �j� �k� �l��q�@�s�0�e�a T�I�H�P�O�F�D�B�� � � �M��N����R�����T�T|


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.fif
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2-code.fif
================================================
"TonUtil.fif" include
"Asm.fif" include
// automatically generated from `../stdlib.fc` `./nft-auction-v2.func` incl:`./struct/op-codes.func` incl:`./struct/exit-codes.func` incl:`./struct/math.func` incl:`./struct/msg-utils.func` incl:`./struct/storage.func` incl:`./struct/handles.func` incl:`./struct/get-met.func` 
PROGRAM{
  DECLPROC division
  DECLPROC multiply
  DECLPROC math::get_percent
  DECLPROC init_data
  DECLPROC pack_data
  DECLPROC get_fees
  DECLPROC handle::try_init_auction
  DECLPROC handle::cancel
  DECLPROC handle::end_auction
  72748 DECLMETHOD get_sale_data
  DECLPROC return_last_bid
  DECLPROC get_command_code
  DECLPROC recv_internal
  DECLPROC recv_external
  DECLGLOBVAR init?
  DECLGLOBVAR end?
  DECLGLOBVAR mp_addr
  DECLGLOBVAR activated?
  DECLGLOBVAR created_at?
  DECLGLOBVAR is_canceled?
  DECLGLOBVAR sub_gas_price_from_bid?
  DECLGLOBVAR fees_cell
  DECLGLOBVAR constant_cell
  DECLGLOBVAR min_bid
  DECLGLOBVAR max_bid
  DECLGLOBVAR min_step
  DECLGLOBVAR last_member
  DECLGLOBVAR last_bid
  DECLGLOBVAR last_bid_at
  DECLGLOBVAR end_time
  DECLGLOBVAR step_time
  DECLGLOBVAR nft_owner
  DECLGLOBVAR nft_addr
  division PROC:<{
    1000000000 PUSHINT
    SWAP
    MULDIV
  }>
  multiply PROC:<{
    1000000000 PUSHINT
    MULDIV
  }>
  math::get_percent PROC:<{
    DUP
    0 EQINT
    IFJMP:<{
      3 BLKDROP
      0 PUSHINT
    }>
    -ROT
    multiply CALLDICT
    SWAP
    division CALLDICT
  }>
  init_data PROCREF:<{
    init? GETGLOB
    ISNULL
    IFNOTJMP:<{
    }>
    c4 PUSH
    CTOS
    1 LDI
    SWAP
    end? SETGLOB
    1 LDI
    SWAP
    activated? SETGLOB
    1 LDI
    SWAP
    is_canceled? SETGLOB
    LDMSGADDR
    SWAP
    last_member SETGLOB
    LDVARUINT16
    SWAP
    last_bid SETGLOB
    32 LDU
    SWAP
    last_bid_at SETGLOB
    32 LDU
    SWAP
    end_time SETGLOB
    LDMSGADDR
    SWAP
    nft_owner SETGLOB
    LDREF
    SWAP
    fees_cell SETGLOB
    LDREF
    DROP
    constant_cell SETGLOB
    constant_cell GETGLOB
    CTOS
    32 LDI
    SWAP
    sub_gas_price_from_bid? SETGLOB
    LDMSGADDR
    SWAP
    mp_addr SETGLOB
    LDVARUINT16
    SWAP
    min_bid SETGLOB
    LDVARUINT16
    SWAP
    max_bid SETGLOB
    LDVARUINT16
    SWAP
    min_step SETGLOB
    32 LDU
    SWAP
    step_time SETGLOB
    LDMSGADDR
    SWAP
    nft_addr SETGLOB
    32 LDU
    DROP
    created_at? SETGLOB
    TRUE
    init? SETGLOB
  }>
  pack_data PROCREF:<{
    constant_cell GETGLOB
    fees_cell GETGLOB
    end_time GETGLOB
    last_bid_at GETGLOB
    is_canceled? GETGLOB
    activated? GETGLOB
    end? GETGLOB
    NEWC
    1 STI
    1 STI
    1 STI
    last_member GETGLOB
    STSLICER
    last_bid GETGLOB
    STVARUINT16
    32 STU
    32 STU
    nft_owner GETGLOB
    STSLICER
    STREF
    STREF
    ENDC
    c4 POP
  }>
  get_fees PROCREF:<{
    fees_cell GETGLOB
    CTOS
    LDMSGADDR
    32 LDU
    32 LDU
    LDMSGADDR
    32 LDU
    32 LDU
    DROP
  }>
  handle::try_init_auction PROCREF:<{
    NIP
    1001 PUSHINT
    nft_owner GETGLOB
    SBITS
    2 GTINT
    THROWANYIF
    1002 PUSHINT
    SWAP
    32 LDU
    0x05138d91 PUSHINT
    s1 s2 XCHG
    EQUAL
    s1 s2 XCHG
    THROWANYIFNOT
    64 PUSHINT
    SDSKIPFIRST
    LDMSGADDR
    DROP
    nft_owner SETGLOB
    FALSE
    end? SETGLOB
    TRUE
    activated? SETGLOB
    pack_data INLINECALLDICT
  }>
  handle::cancel PROCREF:<{
    0 PUSHINT
    DUP
    LTIME
    0x5fcc3d14 PUSHINT
    NEWC
    32 STU
    64 STU
    nft_owner GETGLOB
    STSLICER
    s0 s3 XCHG2
    STSLICER
    s1 s2 XCHG
    1 STU
    OVER
    STVARUINT16
    1 STU
    ENDC
    1 PUSHINT
    24 PUSHINT
    NEWC
    6 STU
    nft_addr GETGLOB
    STSLICER
    0 PUSHINT
    STVARUINT16
    107 STU
    STREF
    1000000 PUSHINT
    0 PUSHINT
    RAWRESERVE
    ENDC
    7 PUSHPOW2
    SENDRAWMSG
    TRUE
    end? SETGLOB
    TRUE
    is_canceled? SETGLOB
    pack_data INLINECALLDICT
  }>
  handle::end_auction PROCREF:<{
    last_bid GETGLOB
    0 EQINT
    IF:<{
      0 PUSHINT
      DUP
      LTIME
      0x5fcc3d14 PUSHINT
      NEWC
      32 STU
      64 STU
      nft_owner GETGLOB
      STSLICER
      s0 s3 XCHG2
      STSLICER
      s1 s2 XCHG
      1 STU
      OVER
      STVARUINT16
      1 STU
      ENDC
      1 PUSHINT
      24 PUSHINT
      NEWC
      6 STU
      nft_addr GETGLOB
      STSLICER
      0 PUSHINT
      STVARUINT16
      107 STU
      STREF
      1000000 PUSHINT
      0 PUSHINT
      RAWRESERVE
      ENDC
      7 PUSHPOW2
      SENDRAWMSG
    }>ELSE<{
      get_fees INLINECALLDICT
      last_bid GETGLOB
      s0 s5 s4 XCHG3
      math::get_percent CALLDICT
      DUP
      0 GTINT
      IF:<{
        0 PUSHINT
        DUP
        16 PUSHINT
        NEWC
        6 STU
        s0 s7 XCHG2
        STSLICER
        s2 PUSH
        STVARUINT16
        s1 s6 XCHG
        107 STU
        s1 s5 XCHG
        32 STU
        <b 124 word Marketplace fee| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        2 PUSHINT
        SENDRAWMSG
      }>ELSE<{
        s4 POP
      }>
      last_bid GETGLOB
      s0 s0 s3 XCHG3
      math::get_percent CALLDICT
      DUP
      0 GTINT
      IF:<{
        0 PUSHINT
        DUP
        16 PUSHINT
        NEWC
        6 STU
        s0 s4 XCHG2
        STSLICER
        s2 PUSH
        STVARUINT16
        s1 s3 XCHG
        107 STU
        s1 s2 XCHG
        32 STU
        <b 124 word Royalty| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        2 PUSHINT
        SENDRAWMSG
      }>ELSE<{
        NIP
      }>
      1000000 PUSHINT
      0 PUSHINT
      RAWRESERVE
      last_bid GETGLOB
      ROT
      SUB
      SWAP
      SUB
      DUP
      0 GTINT
      IF:<{
        0 PUSHINT
        DUP
        16 PUSHINT
        NEWC
        6 STU
        nft_owner GETGLOB
        STSLICER
        s0 s3 XCHG2
        STVARUINT16
        s1 s2 XCHG
        107 STU
        32 STU
        <b 124 word Profit| $, b> <s PUSHSLICE
        STSLICER
        ENDC
        2 PUSHINT
        SENDRAWMSG
      }>ELSE<{
        DROP
      }>
      0 PUSHINT
      DUP
      LTIME
      0x5fcc3d14 PUSHINT
      NEWC
      32 STU
      64 STU
      last_member GETGLOB
      STSLICER
      s0 s3 XCHG2
      STSLICER
      s1 s2 XCHG
      1 STU
      10000000 PUSHINT
      STVARUINT16
      1 STU
      ENDC
      1 PUSHINT
      24 PUSHINT
      NEWC
      6 STU
      nft_addr GETGLOB
      STSLICER
      0 PUSHINT
      STVARUINT16
      107 STU
      STREF
      ENDC
      7 PUSHPOW2
      SENDRAWMSG
    }>
    TRUE
    end? SETGLOB
    pack_data INLINECALLDICT
  }>
  get_sale_data PROC:<{
    init_data INLINECALLDICT
    get_fees INLINECALLDICT
    4281667 PUSHINT
    end? GETGLOB
    end_time GETGLOB
    mp_addr GETGLOB
    nft_addr GETGLOB
    nft_owner GETGLOB
    last_bid GETGLOB
    last_member GETGLOB
    min_step GETGLOB
    max_bid GETGLOB
    min_bid GETGLOB
    created_at? GETGLOB
    last_bid_at GETGLOB
    is_canceled? GETGLOB
    s13 19 s() XCHG
    s12 18 s() XCHG
    s11 17 s() XCHG
    s10 16 s() XCHG
    s9 s15 XCHG
    s8 s14 XCHG
    s7 s13 XCHG
    s6 s12 XCHG
    s5 s11 XCHG
    s7 s10 XCHG
    s6 s9 XCHG
    s5 s8 XCHG
  }>
  return_last_bid PROCREF:<{
    last_bid GETGLOB
    1 LESSINT
    IFJMP:<{
      2DROP
    }>
    last_bid GETGLOB
    sub_gas_price_from_bid? GETGLOB
    SUB
    s2 PUSH
    10000000 PUSHINT
    SUB
    s1 s(-1) PUXC
    GREATER
    IF:<{
      DROP
      SWAP
      10000000 PUSHINT
      SUB
      SWAP
    }>ELSE<{
      s2 POP
    }>
    <b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE
    SWAP
    -1 EQINT
    IF:<{
      DROP
      <b 124 word Auction has been cancelled.| $, b> <s PUSHSLICE
    }>
    OVER
    0 GTINT
    IF:<{
      0 PUSHINT
      DUP
      24 PUSHINT
      NEWC
      6 STU
      last_member GETGLOB
      STSLICER
      s0 s4 XCHG2
      STVARUINT16
      s1 s3 XCHG
      107 STU
      s1 s2 XCHG
      32 STU
      SWAP
      STSLICER
      ENDC
      2 PUSHINT
      SENDRAWMSG
    }>ELSE<{
      2DROP
    }>
  }>
  get_command_code PROCREF:<{
    DUP
    SEMPTY
    -1 EQINT
    IFJMP:<{
      DROP
      0 PUSHINT
    }>
    32 LDU
    NIP
    <b 124 word cancel| $, b> <s PUSHSLICE
    OVER
    SDEQ
    IFJMP:<{
      DROP
      1 PUSHINT
    }>
    <b 124 word stop| $, b> <s PUSHSLICE
    OVER
    SDEQ
    IFJMP:<{
      DROP
      2 PUSHINT
    }>
    <b 124 word finish| $, b> <s PUSHSLICE
    OVER
    SDEQ
    IFJMP:<{
      DROP
      2 PUSHINT
    }>
    <b 124 word deploy| $, b> <s PUSHSLICE
    SWAP
    SDEQ
    IFJMP:<{
      3 PUSHINT
    }>
    0 PUSHINT
  }>
  recv_internal PROC:<{
    SWAP
    CTOS
    4 LDU
    SWAP
    1 PUSHINT
    AND
    0 THROWIF
    LDMSGADDR
    DROP
    init_data INLINECALLDICT
    end? GETGLOB
    -1 EQINT
    mp_addr GETGLOB
    s2 s(-1) PUXC
    SDEQ
    AND
    IFJMP:<{
      s3 POP
      NIP
      32 LDU
      OVER
      0 EQINT
      <b 124 word repeat_end_auction| $, b> <s PUSHSLICE
      s2 s(-1) PUXC
      SDEQ
      AND
      IFJMP:<{
        2DROP
        handle::end_auction INLINECALLDICT
      }>
      s2 POP
      0 EQINT
      <b 124 word emergency_message| $, b> <s PUSHSLICE
      s2 s(-1) PUXC
      SDEQ
      AND
      IFJMP:<{
        LDREF
        DROP
        CTOS
        8 LDU
        LDREF
        DROP
        SWAP
        SENDRAWMSG
      }>
      DROP
    }>
    nft_addr GETGLOB
    s1 s(-1) PUXC
    SDEQ
    IFJMP:<{
      s3 POP
      NIP
      handle::try_init_auction INLINECALLDICT
    }>
    SWAP
    get_command_code INLINECALLDICT
    DUP
    1 EQINT
    IFJMP:<{
      DROP
      1005 PUSHINT
      NOW
      end_time GETGLOB
      GEQ
      THROWANYIF
      1005 PUSHINT
      end? GETGLOB
      -1 EQINT
      THROWANYIF
      1008 PUSHINT
      s0 s2 XCHG
      1000000000 PUSHINT
      LESS
      s1 s2 XCHG
      THROWANYIF
      nft_owner GETGLOB
      s1 s(-1) PUXC
      SDEQ
      mp_addr GETGLOB
      s2 s(-1) PUXC
      SDEQ
      OR
      403 THROWIFNOT
      SWAP
      TRUE
      return_last_bid INLINECALLDICT
      handle::cancel INLINECALLDICT
    }>
    DUP
    2 EQINT
    IFJMP:<{
      DROP
      s2 POP
      1005 PUSHINT
      end? GETGLOB
      -1 EQINT
      THROWANYIF
      1008 PUSHINT
      SWAP
      1000000000 PUSHINT
      LESS
      THROWANYIF
      NOW
      end_time GETGLOB
      GEQ
      IF:<{
        nft_owner GETGLOB
        s1 s(-1) PUXC
        SDEQ
        mp_addr GETGLOB
        s2 s(-1) PUXC
        SDEQ
        OR
        last_member GETGLOB
        s2 s(-1) PUXC
        SDEQ
        OR
        403 THROWIFNOT
      }>ELSE<{
        nft_owner GETGLOB
        s1 s(-1) PUXC
        SDEQ
        403 THROWIFNOT
      }>
      handle::end_auction INLINECALLDICT
    }>
    3 EQINT
    IFJMP:<{
      3 BLKDROP
    }>
    end? GETGLOB
    -1 EQINT
    NOW
    end_time GETGLOB
    GEQ
    OR
    IFJMP:<{
      3 BLKDROP
      1005 PUSHINT
      THROWANY
    }>
    max_bid GETGLOB
    1000000000 PUSHINT
    ADD
    s2 s(-1) PUXC
    GEQ
    max_bid GETGLOB
    0 GTINT
    AND
    IFJMP:<{
      s0 s2 XCHG
      FALSE
      return_last_bid INLINECALLDICT
      OVER
      last_member SETGLOB
      1000000000 PUSHINT
      SUB
      last_bid SETGLOB
      NOW
      last_bid_at SETGLOB
      handle::end_auction INLINECALLDICT
    }>
    end_time GETGLOB
    step_time GETGLOB
    SUB
    NOW
    LESS
    IF:<{
      end_time GETGLOB
      step_time GETGLOB
      ADD
      end_time SETGLOB
    }>
    last_bid GETGLOB
    IFNOTJMP:<{
      s2 POP
      1000 PUSHINT
      min_bid GETGLOB
      s2 s(-1) PUXC
      LESS
      THROWANYIF
      last_bid SETGLOB
      last_member SETGLOB
      NOW
      last_bid_at SETGLOB
      pack_data INLINECALLDICT
    }>
    last_bid GETGLOB
    min_step GETGLOB
    ADD
    s2 s(-1) PUXC
    LESS
    IFJMP:<{
      3 BLKDROP
      1000 PUSHINT
      THROWANY
    }>
    s0 s2 XCHG
    FALSE
    return_last_bid INLINECALLDICT
    SWAP
    last_member SETGLOB
    last_bid SETGLOB
    NOW
    last_bid_at SETGLOB
    pack_data INLINECALLDICT
  }>
  recv_external PROC:<{
    DROP
    init_data INLINECALLDICT
    1006 PUSHINT
    activated? GETGLOB
    -1 EQINT
    THROWANYIF
    ACCEPT
    TRUE
    activated? SETGLOB
    pack_data INLINECALLDICT
  }>
}END>c



================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/nft-auction-v2.func
================================================

#include "struct/stdlib.fc";
#include "struct/op-codes.func";
#include "struct/exit-codes.func";
#include "struct/math.func";
#include "struct/msg-utils.func";
#include "struct/storage.func";
#include "struct/handles.func";
#include "struct/get-met.func";

() return_last_bid(int my_balance, int is_cancel_auc) impure inline_ref {
    if (last_bid <= 0) {
        return ();
    }

    int return_bid_amount = last_bid - sub_gas_price_from_bid?; ;; 0.009909 TON magic gas price per bid processing
    if (return_bid_amount > (my_balance - 10000000)) { ;; - 0.01 TON
        return_bid_amount = my_balance - 10000000;
    }

    slice msg = msg::bid_return();

    if (is_cancel_auc == true) {
        msg = msg::auc_is_canceled();
    }

    if (return_bid_amount > 0) {
        builder return_prev_bid = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(last_member)
                .store_coins(return_bid_amount)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_uint(0, 32)
                .store_slice(msg);

        send_raw_message(return_prev_bid.end_cell(), 2);
    }
}

(int) get_command_code(slice s) inline_ref {
    if (slice_empty?(s) == true) {
        return 0;
    }

    int op = s~load_uint(32);
    if (equal_slices(msg::cancel_msg(), s)) {
        return 1;
    } elseif (equal_slices(msg::stop_msg(), s)) {
        return 2;
    } elseif (equal_slices(msg::finish_msg(), s)) {
        return 2; ;; 2 its ok
    } elseif (equal_slices(msg::deploy(), s)) {
        return 3;
    } else {
        return 0;
    }
}

() recv_internal(int my_balance, int msg_value, cell in_msg_cell, slice in_msg_body) impure {
    slice cs = in_msg_cell.begin_parse();
    throw_if(0, cs~load_uint(4) & 1);

    slice sender_addr = cs~load_msg_addr();
    init_data();

    if ((end? == true) & equal_slices(sender_addr, mp_addr)) {
        int op = in_msg_body~load_uint(32);
        if ((op == 0) & equal_slices(in_msg_body, msg::repeat_end_auction())) {
            ;; special case for repeat end_auction logic if nft not transfered from auc contract
            handle::end_auction(sender_addr);
            return ();
        }
        if ((op == 0) & equal_slices(in_msg_body, msg::emergency_message())) {
            ;; way to fix unexpected troubles with auction contract
            ;; for example if some one transfer nft to this contract
            var msg = in_msg_body~load_ref().begin_parse();
            var mode = msg~load_uint(8);
            send_raw_message(msg~load_ref(), mode);
            return ();
        }
        ;; accept coins for deploy
        return ();
    }

    if (equal_slices(sender_addr, nft_addr)) {
        handle::try_init_auction(sender_addr, in_msg_body);
        return ();
    }

    int command = get_command_code(in_msg_body);


    if (command == 1) { ;; cancel command, return nft, return last bid
        throw_if(exit::auction_end(), now() >= end_time); ;; after timeout can't cancel
        throw_if(exit::auction_end(), end? == true); ;; already canceled/ended
        throw_if(exit::low_amount(), msg_value < 1000000000);
        throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr));
        return_last_bid(my_balance, true);
        handle::cancel(sender_addr);
        return ();
    }

    if (command == 2) { ;; stop auction
        throw_if(exit::auction_end(), end? == true); ;; end = true mean this action already executed
        throw_if(exit::low_amount(), msg_value < 1000000000);
        if (now() >= end_time) { ;; after end time stop auc can any of createor marpetplace or last_bid
            throw_unless(403, equal_slices(sender_addr, nft_owner) | equal_slices(sender_addr, mp_addr) | equal_slices(sender_addr, last_member));
        } else { ;; brfore time end stop only for creator
            throw_unless(403, equal_slices(sender_addr, nft_owner));
        }
        handle::end_auction(sender_addr);
        return ();
    }

    if (command == 3) {
        ;; jsut accept coins
        return ();
    }


    if ((end? == true) | (now() >= end_time)) {
        throw(exit::auction_end());
        return ();
    }

    ;; new bid

    ;; max bid buy nft
    if ((msg_value >= max_bid + 1000000000) & (max_bid > 0)) { ;; 1 TON
        ;; end aution for this bid
        return_last_bid(my_balance, false);
        last_member = sender_addr;
        last_bid = msg_value - 1000000000;
        last_bid_at = now();
        handle::end_auction(sender_addr);
        return ();
    }

    ;; prevent bid at last second
    if ((end_time - step_time) < now()) {
        end_time += step_time;
    }

    ifnot(last_bid) {
        throw_if(exit::low_bid(), msg_value < min_bid);
        last_bid = msg_value;
        last_member = sender_addr;
        last_bid_at = now();
        pack_data();
        return ();
    }

    if (msg_value < (last_bid + min_step)) {
        throw(exit::low_bid());
        return ();
    }

    return_last_bid(my_balance, false);

    last_member = sender_addr;
    last_bid = msg_value;
    last_bid_at = now();

    pack_data();
}

{-
    Message for deploy contract external
-}
() recv_external(slice in_msg) impure {
    init_data();
    throw_if(exit::already_activated(), activated? == true);
    accept_message();
    activated? = true;
    pack_data();
}


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/exit-codes.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/exit-codes.func
================================================
;;
;;  custom TVM exit codes
;;

int exit::low_bid()           asm "1000 PUSHINT";
int exit::auction_init()      asm "1001 PUSHINT";
int exit::no_transfer()       asm "1002 PUSHINT";
int exit::not_message()       asm "1003 PUSHINT";
int exit::not_cancel()        asm "1004 PUSHINT";
int exit::auction_end()       asm "1005 PUSHINT";
int exit::already_activated() asm "1006 PUSHINT";
int exit::cant_cancel_end()   asm "1007 PUSHINT";
int exit::low_amount()        asm "1008 PUSHINT";




================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/get-met.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/get-met.func
================================================
;; 1  2    3    4      5      6      7    8      9    10     11   12   13     14   15   16   17   18   19   20
(int, int, int, slice, slice, slice, int, slice, int, slice, int, int, slice, int, int, int, int, int, int, int) get_sale_data() method_id {
    init_data();

    var (
            mp_fee_addr,
            mp_fee_factor,
            mp_fee_base,
            royalty_fee_addr,
            royalty_fee_factor,
            royalty_fee_base
    ) = get_fees();

    return (
            0x415543, ;; 1 nft aucion ("AUC")
            end?, ;; 2
            end_time, ;; 3
            mp_addr, ;; 4
            nft_addr, ;; 5
            nft_owner, ;; 6
            last_bid, ;; 7
            last_member, ;; 8
            min_step, ;; 9
            mp_fee_addr, ;; 10
            mp_fee_factor, mp_fee_base, ;; 11, 12
            royalty_fee_addr, ;; 13
            royalty_fee_factor, royalty_fee_base, ;; 14, 15
            max_bid, ;; 16
            min_bid, ;; 17
            created_at?, ;; 18
            last_bid_at, ;; 19
            is_canceled? ;; 20
    );
}



================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/handles.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/handles.func
================================================
{-
    SHOULD
    [+] check init auction or not
    [+] check op
    [+] change nft owner
    [+] change auction status
-}
() handle::try_init_auction(slice sender_addr, slice in_msg_body) impure inline_ref {
    throw_if(exit::auction_init(), nft_owner.slice_bits() > 2); ;; throw if auction already init
    throw_unless(exit::no_transfer(), in_msg_body~load_uint(32) == op::ownership_assigned()); ;; throw if it`s not ownership assigned
    in_msg_body~skip_bits(64); ;; query id
    nft_owner = in_msg_body~load_msg_addr();
    end? = false;
    activated? = true;
    pack_data();
}


() handle::cancel(slice sender_addr) impure inline_ref {
    builder nft_transfer_body = begin_cell()
            .store_uint(op::transfer(), 32)
            .store_uint(cur_lt(), 64) ;; query id
            .store_slice(nft_owner) ;; return nft no creator
            .store_slice(sender_addr) ;; response_destination
            .store_uint(0, 1) ;; custom payload
            .store_coins(0) ;; forward amount
            .store_uint(0, 1); ;; forward payload

    builder nft_return_msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_addr)
            .store_coins(0)
            .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(nft_transfer_body.end_cell());

    raw_reserve(1000000, 0); ;; reserve some bebras  🐈

    send_raw_message(nft_return_msg.end_cell(), 128);
    end? = true;
    is_canceled? = true;
    pack_data();
}

() handle::end_auction(slice sender_addr) impure inline_ref {
    if (last_bid == 0) { ;; just return nft
        builder nft_transfer_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(nft_owner) ;; owner who create auction
                .store_slice(sender_addr) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(0) ;; forward amount
                .store_uint(0, 1); ;; forward payload

        builder nft_return_msg = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_transfer_body.end_cell());

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        send_raw_message(nft_return_msg.end_cell(), 128);
    } else {
        var (
                mp_fee_addr,
                mp_fee_factor,
                mp_fee_base,
                royalty_fee_addr,
                royalty_fee_factor,
                royalty_fee_base
        ) = get_fees();

        int mp_fee = math::get_percent(last_bid, mp_fee_factor, mp_fee_base);

        if (mp_fee > 0) {
            builder mp_transfer = begin_cell()
                    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
                    .store_slice(mp_fee_addr)
                    .store_coins(mp_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::mp_msg());

            send_raw_message(mp_transfer.end_cell(), 2);
        }

        int royalty_fee = math::get_percent(last_bid, royalty_fee_factor, royalty_fee_base);

        if (royalty_fee > 0) {
            builder royalty_transfer = begin_cell()
                    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
                    .store_slice(royalty_fee_addr)
                    .store_coins(royalty_fee)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::royalty_msg());

            send_raw_message(royalty_transfer.end_cell(), 2);
        }

        raw_reserve(1000000, 0); ;; reserve some bebras  🐈

        int profit = last_bid - mp_fee - royalty_fee;
        if (profit > 0) {
            builder prev_owner_msg = begin_cell()
                    .store_uint(0x10, 6) ;; 0 (int_msg_info) 1 (ihr_disabled) 1 (no bounces) 00 (address)
                    .store_slice(nft_owner)
                    .store_coins(profit)
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                    .store_uint(0, 32)
                    .store_slice(msg::profit_msg());

            send_raw_message(prev_owner_msg.end_cell(), 2);
        }

        builder nft_transfer_body = begin_cell()
                .store_uint(op::transfer(), 32)
                .store_uint(cur_lt(), 64) ;; query id
                .store_slice(last_member) ;; new owner
                .store_slice(sender_addr) ;; response_destination
                .store_uint(0, 1) ;; custom payload
                .store_coins(10000000) ;; forward amount  0.01 ton
                .store_uint(0, 1); ;; forward payload
        builder nft_transfer = begin_cell()
                .store_uint(0x18, 6)
                .store_slice(nft_addr)
                .store_coins(0)
                .store_uint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1)
                .store_ref(nft_transfer_body.end_cell());
        send_raw_message(nft_transfer.end_cell(), 128);
    }
    end? = true;
    pack_data();
}



================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/math.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/math.func
================================================
;;
;;  math utils
;;

int division(int a, int b) { ;; division with factor
    return muldiv(a, 1000000000 {- 1e9 -}, b);
}

int multiply(int a, int b) { ;; multiply with factor
    return muldiv (a, b, 1000000000 {- 1e9 -});
}

int math::get_percent(int a, int percent, int factor) {
    if (factor == 0) {
        return 0;
    } else {
        return division(multiply(a, percent), factor);
    }
}


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/msg-utils.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/msg-utils.func
================================================
;;
;;  text constants for msg comments
;;

slice msg::cancel_msg()     asm "<b 124 word cancel| $, b> <s PUSHSLICE";
slice msg::stop_msg()       asm "<b 124 word stop| $, b> <s PUSHSLICE";
slice msg::finish_msg()       asm "<b 124 word finish| $, b> <s PUSHSLICE";
slice msg::deploy()       asm "<b 124 word deploy| $, b> <s PUSHSLICE";

slice msg::return_msg()     asm "<b 124 word Your transaction has not been accepted.| $, b> <s PUSHSLICE";
slice msg::bid_return()     asm "<b 124 word Your bid has been outbid by another user.| $, b> <s PUSHSLICE";
slice msg::mp_msg()         asm "<b 124 word Marketplace fee| $, b> <s PUSHSLICE";
slice msg::royalty_msg()    asm "<b 124 word Royalty| $, b> <s PUSHSLICE";
slice msg::profit_msg()     asm "<b 124 word Profit| $, b> <s PUSHSLICE";
slice msg::auc_is_canceled() asm "<b 124 word Auction has been cancelled.| $, b> <s PUSHSLICE";

slice msg::repeat_end_auction()     asm "<b 124 word repeat_end_auction| $, b> <s PUSHSLICE";
slice msg::emergency_message()      asm "<b 124 word emergency_message| $, b> <s PUSHSLICE";


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/op-codes.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/op-codes.func
================================================
;;
;;  op codes
;;

int op::transfer()              asm "0x5fcc3d14 PUSHINT";
int op::ownership_assigned()    asm "0x05138d91 PUSHINT";


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/stdlib.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/stdlib.fc
================================================
;; Standard library for funC
;;

forall X -> tuple cons(X head, tuple tail) asm "CONS";
forall X -> (X, tuple) uncons(tuple list) asm "UNCONS";
forall X -> (tuple, X) list_next(tuple list) asm( -> 1 0) "UNCONS";
forall X -> X car(tuple list) asm "CAR";
tuple cdr(tuple list) asm "CDR";
tuple empty_tuple() asm "NIL";
forall X -> tuple tpush(tuple t, X value) asm "TPUSH";
forall X -> (tuple, ()) ~tpush(tuple t, X value) asm "TPUSH";
forall X -> [X] single(X x) asm "SINGLE";
forall X -> X unsingle([X] t) asm "UNSINGLE";
forall X, Y -> [X, Y] pair(X x, Y y) asm "PAIR";
forall X, Y -> (X, Y) unpair([X, Y] t) asm "UNPAIR";
forall X, Y, Z -> [X, Y, Z] triple(X x, Y y, Z z) asm "TRIPLE";
forall X, Y, Z -> (X, Y, Z) untriple([X, Y, Z] t) asm "UNTRIPLE";
forall X, Y, Z, W -> [X, Y, Z, W] tuple4(X x, Y y, Z z, W w) asm "4 TUPLE";
forall X, Y, Z, W -> (X, Y, Z, W) untuple4([X, Y, Z, W] t) asm "4 UNTUPLE";
forall X -> X first(tuple t) asm "FIRST";
forall X -> X second(tuple t) asm "SECOND";
forall X -> X third(tuple t) asm "THIRD";
forall X -> X fourth(tuple t) asm "3 INDEX";
forall X, Y -> X pair_first([X, Y] p) asm "FIRST";
forall X, Y -> Y pair_second([X, Y] p) asm "SECOND";
forall X, Y, Z -> X triple_first([X, Y, Z] p) asm "FIRST";
forall X, Y, Z -> Y triple_second([X, Y, Z] p) asm "SECOND";
forall X, Y, Z -> Z triple_third([X, Y, Z] p) asm "THIRD";
forall X -> X null() asm "PUSHNULL";
forall X -> (X, ()) ~impure_touch(X x) impure asm "NOP";

int now() asm "NOW";
slice my_address() asm "MYADDR";
[int, cell] get_balance() asm "BALANCE";
int cur_lt() asm "LTIME";
int block_lt() asm "BLOCKLT";

int cell_hash(cell c) asm "HASHCU";
int slice_hash(slice s) asm "HASHSU";
int string_hash(slice s) asm "SHA256U";

int check_signature(int hash, slice signature, int public_key) asm "CHKSIGNU";
int check_data_signature(slice data, slice signature, int public_key) asm "CHKSIGNS";

(int, int, int) compute_data_size(cell c, int max_cells) impure asm "CDATASIZE";
(int, int, int) slice_compute_data_size(slice s, int max_cells) impure asm "SDATASIZE";
(int, int, int, int) compute_data_size?(cell c, int max_cells) asm "CDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";
(int, int, int, int) slice_compute_data_size?(cell c, int max_cells) asm "SDATASIZEQ NULLSWAPIFNOT2 NULLSWAPIFNOT";

;; () throw_if(int excno, int cond) impure asm "THROWARGIF";

() dump_stack() impure asm "DUMPSTK";

cell get_data() asm "c4 PUSH";
() set_data(cell c) impure asm "c4 POP";
cont get_c3() impure asm "c3 PUSH";
() set_c3(cont c) impure asm "c3 POP";
cont bless(slice s) impure asm "BLESS";

() accept_message() impure asm "ACCEPT";
() set_gas_limit(int limit) impure asm "SETGASLIMIT";
() commit() impure asm "COMMIT";
() buy_gas(int gram) impure asm "BUYGAS";

int min(int x, int y) asm "MIN";
int max(int x, int y) asm "MAX";
(int, int) minmax(int x, int y) asm "MINMAX";
int abs(int x) asm "ABS";

slice begin_parse(cell c) asm "CTOS";
() end_parse(slice s) impure asm "ENDS";
(slice, cell) load_ref(slice s) asm( -> 1 0) "LDREF";
cell preload_ref(slice s) asm "PLDREF";
;; (slice, int) ~load_int(slice s, int len) asm(s len -> 1 0) "LDIX";
;; (slice, int) ~load_uint(slice s, int len) asm( -> 1 0) "LDUX";
;; int preload_int(slice s, int len) asm "PLDIX";
;; int preload_uint(slice s, int len) asm "PLDUX";
;; (slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";
;; slice preload_bits(slice s, int len) asm "PLDSLICEX";
(slice, int) load_grams(slice s) asm( -> 1 0) "LDGRAMS";
slice skip_bits(slice s, int len) asm "SDSKIPFIRST";
(slice, ()) ~skip_bits(slice s, int len) asm "SDSKIPFIRST";
slice first_bits(slice s, int len) asm "SDCUTFIRST";
slice skip_last_bits(slice s, int len) asm "SDSKIPLAST";
(slice, ()) ~skip_last_bits(slice s, int len) asm "SDSKIPLAST";
slice slice_last(slice s, int len) asm "SDCUTLAST";
(slice, cell) load_dict(slice s) asm( -> 1 0) "LDDICT";
cell preload_dict(slice s) asm "PLDDICT";
slice skip_dict(slice s) asm "SKIPDICT";

(slice, cell) load_maybe_ref(slice s) asm( -> 1 0) "LDOPTREF";
cell preload_maybe_ref(slice s) asm "PLDOPTREF";
builder store_maybe_ref(builder b, cell c) asm(c b) "STOPTREF";

int cell_depth(cell c) asm "CDEPTH";

int slice_refs(slice s) asm "SREFS";
int slice_bits(slice s) asm "SBITS";
(int, int) slice_bits_refs(slice s) asm "SBITREFS";
int slice_empty?(slice s) asm "SEMPTY";
int slice_data_empty?(slice s) asm "SDEMPTY";
int slice_refs_empty?(slice s) asm "SREMPTY";
int slice_depth(slice s) asm "SDEPTH";

int builder_refs(builder b) asm "BREFS";
int builder_bits(builder b) asm "BBITS";
int builder_depth(builder b) asm "BDEPTH";

builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
    builder store_ref(builder b, cell c) asm(c b) "STREF";
;; builder store_uint(builder b, int x, int len) asm(x b len) "STUX";
;; builder store_int(builder b, int x, int len) asm(x b len) "STIX";
builder store_slice(builder b, slice s) asm "STSLICER";
builder store_grams(builder b, int x) asm "STGRAMS";
builder store_dict(builder b, cell c) asm(c b) "STDICT";

(slice, slice) load_msg_addr(slice s) asm( -> 1 0) "LDMSGADDR";
tuple parse_addr(slice s) asm "PARSEMSGADDR";
(int, int) parse_std_addr(slice s) asm "REWRITESTDADDR";
(int, slice) parse_var_addr(slice s) asm "REWRITEVARADDR";

cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
(cell, ()) ~idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
cell udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
(cell, ()) ~udict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTUSETREF";
cell idict_get_ref(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETOPTREF";
(cell, int) idict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTIGETREF";
(cell, int) udict_get_ref?(cell dict, int key_len, int index) asm(index dict key_len) "DICTUGETREF";
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
cell new_dict() asm "NEWDICT";
int dict_empty?(cell c) asm "DICTEMPTY";

(slice, slice, slice, int) pfxdict_get?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTGETQ" "NULLSWAPIFNOT2";
(cell, int) pfxdict_set?(cell dict, int key_len, slice key, slice value) asm(value key dict key_len) "PFXDICTSET";
(cell, int) pfxdict_delete?(cell dict, int key_len, slice key) asm(key dict key_len) "PFXDICTDEL";

cell config_param(int x) asm "CONFIGOPTPARAM";
int cell_null?(cell c) asm "ISNULL";

() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
() raw_reserve_extra(int amount, cell extra_amount, int mode) impure asm "RAWRESERVEX";
() send_raw_message(cell msg, int mode) impure asm "SENDRAWMSG";
() set_code(cell new_code) impure asm "SETCODE";

int random() impure asm "RANDU256";
int rand(int range) impure asm "RAND";
int get_seed() impure asm "RANDSEED";
int set_seed() impure asm "SETRAND";
() randomize(int x) impure asm "ADDRAND";
() randomize_lt() impure asm "LTIME" "ADDRAND";

builder store_coins(builder b, int x) asm "STVARUINT16";
(slice, int) load_coins(slice s) asm( -> 1 0) "LDVARUINT16";

int equal_slices (slice a, slice b) asm "SDEQ";
int builder_null?(builder b) asm "ISNULL";
builder store_builder(builder to, builder from) asm "STBR";


================================================
FILE: src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/storage.func
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftAuctionV2/nft-auction-v2/struct/storage.func
================================================
;;
;;  persistant and runtime storage вescription
;;

global int      init?; ;; init_data safe check
global int      end?; ;; end auction or not
global slice    mp_addr; ;; the address of the marketplace from which the contract is deployed
global int      activated?; ;; contract is activated by external message or by nft transfer
global int      created_at?; ;; timestamp of created acution
global int      is_canceled?; ;; auction was cancelled by owner
global int      sub_gas_price_from_bid?; ;; amound of gas used for processing bif

global cell fees_cell;
global cell constant_cell;

;; bids info cell (ref)
global int      min_bid; ;; minimal bid
global int      max_bid; ;; maximum bid
global int      min_step; ;; minimum step (can be 0)
global slice    last_member; ;; last member address
global int      last_bid; ;; last bid amount
global int      last_bid_at; ;; timestamp of last bid
global int      end_time; ;; unix end time
global int      step_time; ;; by how much the time increases with the new bid (e.g. 30)

;; nft info cell (ref)
global slice    nft_owner; ;; nft owner addres (should be sent nft if auction canceled or money from auction)
global slice    nft_addr; ;; nft address


() init_data() impure inline_ref {- save for get methods -} {
    ifnot(null?(init?)) { return ();}

    slice ds = get_data().begin_parse();
    end? = ds~load_int(1);
    activated? = ds~load_int(1);
    is_canceled? = ds~load_int(1);
    last_member = ds~load_msg_addr();
    last_bid = ds~load_coins();
    last_bid_at = ds~load_uint(32);
    end_time = ds~load_uint(32);
    nft_owner = ds~load_msg_addr();

    fees_cell = ds~load_ref();
    constant_cell = ds~load_ref();
    slice constants = constant_cell.begin_parse();
    sub_gas_price_from_bid? = constants~load_int(32);
    mp_addr = constants~load_msg_addr();
    min_bid = constants~load_coins();
    max_bid = constants~load_coins();
    min_step = constants~load_coins();
    step_time = constants~load_uint(32);
    nft_addr = constants~load_msg_addr();
    created_at? = constants~load_uint(32);


    init? = true;
}

() pack_data() impure inline_ref {
    set_data(
            begin_cell()
                    .store_int(end?, 1) ;; + stc    1
                    .store_int(activated?, 1) ;; activated? 1
                    .store_int(is_canceled?, 1) ;; 1
                    .store_slice(last_member) ;; + max    267 ($10 with Anycast = 0)
                    .store_coins(last_bid) ;; + max    124
                    .store_uint(last_bid_at, 32) ;; + stc    32
                    .store_uint(end_time, 32) ;; + stc    32
                    .store_slice(nft_owner) ;; 267
                    .store_ref(fees_cell) ;; + ref
                    .store_ref(constant_cell) ;; + ref
                    .end_cell()
            ;; total 267 + 124 + 32 + 32 + 267 + 1 + 1 + 1 = 725
    );
}

(slice, int, int, slice, int, int) get_fees() inline_ref {
    slice fees = fees_cell.begin_parse();
    slice mp_fee_addr = fees~load_msg_addr();
    int mp_fee_factor = fees~load_uint(32);
    int mp_fee_base = fees~load_uint(32);
    slice royalty_fee_addr = fees~load_msg_addr();
    int royalty_fee_factor = fees~load_uint(32);
    int royalty_fee_base = fees~load_uint(32);
    return (
            mp_fee_addr,
            mp_fee_factor,
            mp_fee_base,
            royalty_fee_addr,
            royalty_fee_factor,
            royalty_fee_base
    );
}



================================================
FILE: src/wrappers/getgems/NftCollection/NftCollection.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftCollection/NftCollection.ts
================================================
import { Address, beginCell, Cell, ContractProvider, Transaction, Sender, SendMode, contractAddress, ExternalAddress } from 'ton-core'
import { storeOffchainContent } from '../../../types/Content'
import { NftCollectionRoyalty } from '../../standard/NftCollectionRoyalty'
import { isEligibleTransaction } from '../../../utils/EligibleInternalTx'
import { Maybe } from 'ton-core/dist/utils/maybe'

export type CollectionMintItemInput = {
    passAmount: bigint
    index: number
    ownerAddress: Address
    content: string
}

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}

export const OperationCodes = {
    Mint: 1,
    BatchMint: 2,
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad
}

/**
 * Class representing a Non-Fungible Token (NFT) collection contract.
 * This class extends from the `NftCollectionRoyalty` class.
 */
export class NftCollection extends NftCollectionRoyalty {
    static code = Cell.fromBoc(Buffer.from('te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==', 'base64'))[0]

    /**
     * Builds the data cell for an NFT collection.
     * @param data - The data for the NFT collection.
     * @returns A cell containing the data for the NFT collection.
     */
    static buildDataCell(data: NftCollectionData) {
        const dataCell = beginCell()

        dataCell.storeAddress(data.ownerAddress)
        dataCell.storeUint(data.nextItemIndex, 64)

        const contentCell = beginCell()

        const collectionContent = storeOffchainContent({
            type: 'offchain',
            uri: data.collectionContent
        })

        const commonContent = beginCell()
        commonContent.storeBuffer(Buffer.from(data.commonContent))

        contentCell.store(collectionContent)
        contentCell.storeRef(commonContent)
        dataCell.storeRef(contentCell)

        dataCell.storeRef(data.nftItemCode)

        const royaltyCell = beginCell()
        royaltyCell.storeUint(data.royaltyParams.royaltyFactor, 16)
        royaltyCell.storeUint(data.royaltyParams.royaltyBase, 16)
        royaltyCell.storeAddress(data.royaltyParams.royaltyAddress)
        dataCell.storeRef(royaltyCell)

        return dataCell.endCell()
    }

    /**
     * Creates an `NftCollection` instance from an address.
     * @param address - The address to create from.
     * @returns A new `NftCollection` instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftCollection(
            address
        )
    }

    /**
     * Creates an `NftCollection` instance from a configuration object.
     * @param config - The configuration data for the NFT collection.
     * @param workchain - The workchain ID (default is 0).
     * @returns A new `NftCollection` instance.
     */
    static async createFromConfig(
        config: NftCollectionData,
        workchain = 0
    ) {

        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftCollection(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends a mint command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the mint command.
     * @param params - The parameters for the mint command.
     */
    async sendMint(provider: ContractProvider, via: Sender, params: { 
        queryId?: number, 
        value: bigint,
        passAmount: bigint, 
        itemIndex: number, 
        itemOwnerAddress: Address, 
        itemContent: string 
    }) {
        const itemContent = beginCell()
        // itemContent.bits.writeString(params.itemContent)
        itemContent.storeBuffer(Buffer.from(params.itemContent)).endCell()

        const nftItemMessage = beginCell()

        nftItemMessage.storeAddress(params.itemOwnerAddress)
        nftItemMessage.storeRef(itemContent).endCell()

        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(params.queryId || 0, 64)
                .storeUint(params.itemIndex, 64)
                .storeCoins(params.passAmount)
                .storeRef(nftItemMessage)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a change owner command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the change owner command.
     * @param params - The parameters for the change owner command.
     */
    async sendChangeOwner(provider: ContractProvider, via: Sender, params: { 
        queryId?: number, 
        value: bigint,
        newOwner: Address
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(OperationCodes.ChangeOwner, 32)
                .storeUint(params.queryId || 0, 64)
                .storeAddress(params.newOwner)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY
        })
    }

    /**
     * Parses a mint transaction.
     * @param tx - The transaction to parse.
     * @returns The parsed mint transaction, or undefined if parsing failed.
     */
    static parseMint(tx: Transaction): NftMint | undefined {
        try {
            const body = tx.inMessage?.body.beginParse()

            if (body === undefined) return undefined 

            const op = body.loadUint(32)
            
            if (op !== 1) return undefined 


            if (!isEligibleTransaction(tx)) {
                return undefined
            }

            return {
                queryId: body.loadUint(64),
                from: tx.inMessage?.info.src ?? undefined,
                to: tx.inMessage?.info.dest ?? undefined,
                itemIndex: body.loadUint(64),
                passAmount: body.loadCoins(),
                nftItemMessage: body.loadRef()
            }
        } catch (e) { /* empty */ }
        return undefined
    }


    /**
     * Parses an ownership transfer transaction.
     * @param tx - The transaction to parse.
     * @returns The parsed ownership transfer transaction, or undefined if parsing failed.
     */
    static parseOwnershipTransfer(tx: Transaction): OwnershipTransfer | undefined {
        try {
            const body = tx.inMessage?.body.beginParse()

            if (body === undefined) return undefined 

            const op = body.loadUint(32)
            
            if (op !== 3) return undefined 

            if (!isEligibleTransaction(tx)) {
                return undefined
            }

            return {
                queryId: body.loadUint(64),
                oldOwner: tx.inMessage?.info.src ?? undefined,
                newOwner: body.loadAddress()
            }
        } catch (e) { /* empty */ }

        return undefined
    }
}

/**
 * Type definition for the data of an NFT collection.
 */
export type NftCollectionData = {
    ownerAddress: Address,
    nextItemIndex: number | bigint
    collectionContent: string
    commonContent: string
    nftItemCode: Cell
    royaltyParams: RoyaltyParams
}

/**
 * Type definition for the data of an NFT mint transaction.
 */
export type NftMint = {
    queryId: number
    from?: Address | Maybe<ExternalAddress>
    to?: Address | Maybe<ExternalAddress>
    itemIndex: number
    passAmount: bigint
    nftItemMessage: Cell
}

/**
 * Type definition for the data of an ownership transfer transaction.
 */
export type OwnershipTransfer = {
    queryId: number
    oldOwner?: Address | Maybe<ExternalAddress>
    newOwner: Address
}


================================================
FILE: src/wrappers/getgems/NftCollection/nft-collection.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftCollection/nft-collection.fc
================================================
;; NFT collection smart contract

#include "../stdlib.fc";
#include "../params.fc";
#include "../op-codes.fc";

;; storage scheme
;; default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;; storage#_ owner_address:MsgAddress next_item_index:uint64
;;           ^[collection_content:^Cell common_content:^Cell]
;;           nft_item_code:^Cell
;;           royalty_params:^RoyaltyParams
;;           = Storage;

(slice, int, cell, cell, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return
    (ds~load_msg_addr(), ;; owner_address
     ds~load_uint(64), ;; next_item_index
     ds~load_ref(), ;; content
     ds~load_ref(), ;; nft_item_code
     ds~load_ref()  ;; royalty_params
     );
}

() save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code, cell royalty_params) impure inline {
  set_data(begin_cell()
    .store_slice(owner_address)
    .store_uint(next_item_index, 64)
    .store_ref(content)
    .store_ref(nft_item_code)
    .store_ref(royalty_params)
    .end_cell());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
  cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(int wc, cell state_init) {
  return begin_cell().store_uint(4, 3)
                     .store_int(wc, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
  slice nft_address = calculate_nft_item_address(workchain(), state_init);
  var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_address)
            .store_coins(amount)
            .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
            .store_ref(state_init)
            .store_ref(nft_content);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
    .store_slice(to_address)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op::report_royalty_params(), 32)
    .store_uint(query_id, 64)
    .store_slice(data);
  send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
        return ();
    }

    throw_unless(401, equal_slices(sender_address, owner_address));


    if (op == 1) { ;; deploy new nft
      int item_index = in_msg_body~load_uint(64);
      throw_unless(402, item_index <= next_item_index);
      var is_last = item_index == next_item_index;
      deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());
      if (is_last) {
        next_item_index += 1;
        save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
      }
      return ();
    }
    if (op == 2) { ;; batch deploy of new nfts
      int counter = 0;
      cell deploy_list = in_msg_body~load_ref();
      do {
        var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
        if (f?) {
          counter += 1;
          if (counter >= 250) { ;; Limit due to limits of action list size
            throw(399);
          }

          throw_unless(403 + counter, item_index <= next_item_index);
          deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
          if (item_index == next_item_index) {
            next_item_index += 1;
          }
        }
      } until ( ~ f?);
      save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
      return ();
    }
    if (op == 3) { ;; change owner
      slice new_owner = in_msg_body~load_msg_addr();
      save_data(new_owner, next_item_index, content, nft_item_code, royalty_params);
      return ();
    }
    throw(0xffff);
}

;; Get methods

(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}

slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(0, state_init);
}

(int, int, slice) royalty_params() method_id {
     var (_, _, _, _, royalty) = load_data();
     slice rs = royalty.begin_parse();
     return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
  var (_, _, content, _, _) = load_data();
  slice cs = content.begin_parse();
  cs~load_ref();
  slice common_content = cs~load_ref().begin_parse();
  return (begin_cell()
                      .store_uint(1, 8) ;; offchain tag
                      .store_slice(common_content)
                      .store_ref(individual_nft_content)
          .end_cell());
}


================================================
FILE: src/wrappers/getgems/NftCollectionEditable/NftCollectionEditable.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftCollectionEditable/NftCollectionEditable.ts
================================================
import { Address, beginCell, ContractProvider, Sender, SendMode } from 'ton-core'
import { NftCollectionRoyalty } from '../../standard/NftCollectionRoyalty'

export type CollectionMintItemInput = {
    passAmount: bigint
    index: number
    ownerAddress: Address
    content: string
}

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}

const OperationCodes = {
    Mint: 1,
    BatchMint: 2,
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad
}

/**
 * Class representing an editable Non-Fungible Token (NFT) collection contract.
 * This class extends from the `NftCollectionRoyalty` class.
 */
export class NftCollectionEditable extends NftCollectionRoyalty {
    /**
     * Creates an `NftCollectionEditable` instance from an address.
     * @param address - The address to create from.
     * @returns A new `NftCollectionEditable` instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftCollectionEditable(
            address
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends a mint command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the mint command.
     * @param params - The parameters for the mint command.
     */
    async sendMint(provider: ContractProvider, via: Sender, params: { 
        queryId?: number, 
        value: bigint,
        passAmount: bigint, 
        itemIndex: number, 
        itemOwnerAddress: Address, 
        itemContent: string 
    }) {
        const itemContent = beginCell()
        itemContent.storeBuffer(Buffer.from(params.itemContent)).endCell()

        const nftItemMessage = beginCell()

        nftItemMessage.storeAddress(params.itemOwnerAddress)
        nftItemMessage.storeRef(itemContent).endCell()

        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(params.queryId || 0, 64)
                .storeUint(params.itemIndex, 64)
                .storeCoins(params.passAmount)
                .storeRef(nftItemMessage)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a change owner command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the change owner command.
     * @param params - The parameters for the change owner command.
     */
    async sendChangeOwner(provider: ContractProvider, via: Sender, params: { 
        queryId?: number, 
        value: bigint,
        newOwner: Address
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(OperationCodes.ChangeOwner, 32)
                .storeUint(params.queryId || 0, 64)
                .storeAddress(params.newOwner)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY
        })
    }
}



================================================
FILE: src/wrappers/getgems/NftCollectionEditable/nft-collection-editable.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftCollectionEditable/nft-collection-editable.fc
================================================
;; NFT collection smart contract

#include "../stdlib.fc";
#include "../params.fc";
#include "../op-codes.fc";

;; storage scheme
;; default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
;; storage#_ owner_address:MsgAddress next_item_index:uint64
;;           ^[collection_content:^Cell common_content:^Cell]
;;           nft_item_code:^Cell
;;           royalty_params:^RoyaltyParams
;;           = Storage;

(slice, int, cell, cell, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return
    (ds~load_msg_addr(), ;; owner_address
     ds~load_uint(64), ;; next_item_index
     ds~load_ref(), ;; content
     ds~load_ref(), ;; nft_item_code
     ds~load_ref()  ;; royalty_params
     );
}

() save_data(slice owner_address, int next_item_index, cell content, cell nft_item_code, cell royalty_params) impure inline {
  set_data(begin_cell()
    .store_slice(owner_address)
    .store_uint(next_item_index, 64)
    .store_ref(content)
    .store_ref(nft_item_code)
    .store_ref(royalty_params)
    .end_cell());
}

cell calculate_nft_item_state_init(int item_index, cell nft_item_code) {
  cell data = begin_cell().store_uint(item_index, 64).store_slice(my_address()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(nft_item_code).store_dict(data).store_uint(0, 1).end_cell();
}

slice calculate_nft_item_address(int wc, cell state_init) {
  return begin_cell().store_uint(4, 3)
                     .store_int(wc, 8)
                     .store_uint(cell_hash(state_init), 256)
                     .end_cell()
                     .begin_parse();
}

() deploy_nft_item(int item_index, cell nft_item_code, int amount, cell nft_content) impure {
  cell state_init = calculate_nft_item_state_init(item_index, nft_item_code);
  slice nft_address = calculate_nft_item_address(workchain(), state_init);
  var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice(nft_address)
            .store_coins(amount)
            .store_uint(4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
            .store_ref(state_init)
            .store_ref(nft_content);
  send_raw_message(msg.end_cell(), 1); ;; pay transfer fees separately, revert on errors
}

() send_royalty_params(slice to_address, int query_id, slice data) impure inline {
  var msg = begin_cell()
    .store_uint(0x10, 6) ;; nobounce - int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool packages:MsgAddress -> 011000
    .store_slice(to_address)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op::report_royalty_params(), 32)
    .store_uint(query_id, 64)
    .store_slice(data);
  send_raw_message(msg.end_cell(), 64); ;; carry all the remaining value of the inbound message
}

() recv_internal(cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_empty?()) { ;; ignore empty messages
        return ();
    }
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) { ;; ignore all bounced messages
        return ();
    }
    slice sender_address = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    var (owner_address, next_item_index, content, nft_item_code, royalty_params) = load_data();

    if (op == op::get_royalty_params()) {
        send_royalty_params(sender_address, query_id, royalty_params.begin_parse());
        return ();
    }

    throw_unless(401, equal_slices(sender_address, owner_address));


    if (op == 1) { ;; deploy new nft
      int item_index = in_msg_body~load_uint(64);
      throw_unless(402, item_index <= next_item_index);
      var is_last = item_index == next_item_index;
      deploy_nft_item(item_index, nft_item_code, in_msg_body~load_coins(), in_msg_body~load_ref());
      if (is_last) {
        next_item_index += 1;
        save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
      }
      return ();
    }
    if (op == 2) { ;; batch deploy of new nfts
      int counter = 0;
      cell deploy_list = in_msg_body~load_ref();
      do {
        var (item_index, item, f?) = deploy_list~udict::delete_get_min(64);
        if (f?) {
          counter += 1;
          if (counter >= 250) { ;; Limit due to limits of action list size
            throw(399);
          }

          throw_unless(403 + counter, item_index <= next_item_index);
          deploy_nft_item(item_index, nft_item_code, item~load_coins(), item~load_ref());
          if (item_index == next_item_index) {
            next_item_index += 1;
          }
        }
      } until ( ~ f?);
      save_data(owner_address, next_item_index, content, nft_item_code, royalty_params);
      return ();
    }
    if (op == 3) { ;; change owner
      slice new_owner = in_msg_body~load_msg_addr();
      save_data(new_owner, next_item_index, content, nft_item_code, royalty_params);
      return ();
    }
    if (op == 4) { ;; change content
      save_data(owner_address, next_item_index, in_msg_body~load_ref(), nft_item_code, in_msg_body~load_ref());
      return ();
    }
    throw(0xffff);
}

;; Get methods

(int, cell, slice) get_collection_data() method_id {
  var (owner_address, next_item_index, content, _, _) = load_data();
  slice cs = content.begin_parse();
  return (next_item_index, cs~load_ref(), owner_address);
}

slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(0, state_init);
}

(int, int, slice) royalty_params() method_id {
     var (_, _, _, _, royalty) = load_data();
     slice rs = royalty.begin_parse();
     return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}

cell get_nft_content(int index, cell individual_nft_content) method_id {
  var (_, _, content, _, _) = load_data();
  slice cs = content.begin_parse();
  cs~load_ref();
  slice common_content = cs~load_ref().begin_parse();
  return (begin_cell()
                      .store_uint(1, 8) ;; offchain tag
                      .store_slice(common_content)
                      .store_ref(individual_nft_content)
          .end_cell());
}


================================================
FILE: src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPrice/NftFixedPrice.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, contractAddress } from 'ton-core'

/**
 * Class representing a Non-Fungible Token (NFT) fixed price sale contract.
 */
export class NftFixedPrice implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static code = Cell.fromBoc(Buffer.from('te6cckECCgEAAbIAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEADegOFnaiaH0gfSB9IH0AahhofQB9IH0gfQAYCBHAgLNCAYB99G8EIHc1lACkgUCkQX3lw4QFofQB9IH0gfQAYOEAIZGWCqATniyi6UJDQqFrQilAK/QEK5bVkuP2AOEAIZGWCrGeLKAP9AQtltWS4/YA4QAhkZYKsZ4ssfQFltWS4/YA4EEEIL+YeihDADGRlgqgC54sRfQEKZbUJ5Y+JwHAC7LPyPPFlADzxYSygAh+gLKAMmBAKD7AAH30A6GmBgLjYSS+CcH0gGHaiaH0gfSB9IH0AahgRa6ThAVnHHZkbGymQ44LJL4NwKJFjgvlw+gFpj8EIAonGyIldeXD66Z+Y/SAYIBpkKALniygB54sA54sA/QFmZPaqcBNjgEybCBsimYI4eAJwA2mP6Z+YEOAAyS+FcBDAkAtsACmjEQRxA2RUAS8ATgMjQ0NDXAA449ghA7msoAE77y4clwIIIQX8w9FCGAEMjLBVAHzxYi+gIWy2oVyx8Tyz8hzxYBzxYSygAh+gLKAMmBAKD7AOBfBIQP8vCVeDe4', 'base64'))[0]

    /**
     * Builds the data cell for an NFT fixed price sale.
     * @param data - The data for the NFT sale.
     * @returns A cell containing the data for the NFT sale.
     */
    static buildDataCell(data: NftFixPriceSaleData) {

        const feesCell = beginCell()
    
        feesCell.storeCoins(data.marketplaceFee)
        feesCell.storeAddress(data.marketplaceFeeAddress)
        feesCell.storeAddress(data.royaltyAddress)
        feesCell.storeCoins(data.royaltyAmount)
    
        const dataCell = beginCell()
    
        dataCell.storeAddress(data.marketplaceAddress)
        dataCell.storeAddress(data.nftAddress)
        dataCell.storeAddress(data.nftOwnerAddress)
        dataCell.storeCoins(data.fullPrice)
        dataCell.storeRef(feesCell)
    
        return dataCell.endCell()
    }

    /**
     * Creates an NftFixedPrice instance from an address.
     * @param address - The address to create from.
     * @returns A new NftFixedPrice instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftFixedPrice(
            address
        )
    }

    /**
     * Creates an NftFixedPrice instance from a configuration object.
     * @param config - The configuration data for the NFT sale.
     * @param workchain - The workchain ID (default is 0).
     * @returns A new NftFixedPrice instance.
     */
    static async createFromConfig(
        config: NftFixPriceSaleData,
        workchain = 0
    ) {

        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftFixedPrice(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Retrieves the sale data from the contract.
     * @param provider - The contract provider.
     * @returns An object containing the sale data.
     */
    async getSaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_sale_data', [])
        return {
            marketplaceAddress: stack.readAddressOpt(),
            nftAddress: stack.readAddressOpt(),
            nftOwnerAddress: stack.readAddressOpt(),
            fullPrice: stack.readBigNumber(),
            marketplaceFeeAddress: stack.readAddressOpt(),
            marketplaceFee: stack.readBigNumber(),
            royaltyAddress: stack.readAddressOpt(),
            royaltyAmount:  stack.readBigNumber()
        }
    }
}

/**
 * Type definition for the data of an NFT fixed price sale.
 */
export type NftFixPriceSaleData = {
    marketplaceAddress: Address
    nftAddress: Address
    nftOwnerAddress: Address|null
    fullPrice: bigint
    marketplaceFee: bigint
    marketplaceFeeAddress: Address
    royaltyAmount: bigint
    royaltyAddress: Address
}


================================================
FILE: src/wrappers/getgems/NftFixedPrice/nft-fixprice-sale.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPrice/nft-fixprice-sale.fc
================================================
;; NFT sale smart contract

#include "../stdlib.fc";
#include "../params.fc";
#include "../op-codes.fc";

int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON

(slice, slice, slice, int, cell) load_data() inline {
  var ds = get_data().begin_parse();
  return
    (ds~load_msg_addr(), ;; marketplace_address
      ds~load_msg_addr(), ;; nft_address
      ds~load_msg_addr(),  ;; nft_owner_address
      ds~load_coins(), ;; full_price
      ds~load_ref()  ;; fees_cell
     );
}

(int, slice, slice, int) load_fees(cell fees_cell) inline {
  var ds = fees_cell.begin_parse();
  return
    (ds~load_coins(), ;; marketplace_fee,
      ds~load_msg_addr(), ;; marketplace_fee_address
      ds~load_msg_addr(), ;; royalty_address
      ds~load_coins() ;; royalty_amount
     );
}


() save_data(slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
  set_data(begin_cell()
    .store_slice(marketplace_address)
    .store_slice(nft_address)
    .store_slice(nft_owner_address)
    .store_coins(full_price)
    .store_ref(fees_cell)
    .end_cell());
}

() buy(int my_balance, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell, int msg_value, slice sender_address, int query_id) impure {
  throw_unless(450, msg_value >= full_price + min_gas_amount());

  var (marketplace_fee, marketplace_fee_address, royalty_address, royalty_amount) = load_fees(fees_cell);

  var owner_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(nft_owner_address)
           .store_coins(full_price - marketplace_fee - royalty_amount + (my_balance - msg_value))
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(owner_msg.end_cell(), 1);


  var royalty_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(royalty_address)
           .store_coins(royalty_amount)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(royalty_msg.end_cell(), 1);


  var marketplace_msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(marketplace_fee_address)
           .store_coins(marketplace_fee)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1);

  send_raw_message(marketplace_msg.end_cell(), 1);

  var nft_msg = begin_cell()
           .store_uint(0x18, 6)
           .store_slice(nft_address)
           .store_coins(0)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
           .store_uint(op::transfer(), 32)
           .store_uint(query_id, 64)
           .store_slice(sender_address) ;; new_owner_address
           .store_slice(sender_address) ;; response_address
           .store_int(0, 1) ;; empty custom_payload
           .store_coins(0) ;; forward amount to new_owner_address
           .store_int(0, 1); ;; empty forward_payload


  send_raw_message(nft_msg.end_cell(), 128 + 32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {  ;; ignore all bounced messages
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();

    var is_initialized = nft_owner_address.slice_bits() > 2; ;; not initialized if null address

    if (~ is_initialized) {

      if (equal_slices(sender_address, marketplace_address)) {
         return (); ;; just accept coins on deploy
      }

      throw_unless(500, equal_slices(sender_address, nft_address));
      int op = in_msg_body~load_uint(32);
      throw_unless(501, op == op::ownership_assigned());
      int query_id = in_msg_body~load_uint(64);
      slice prev_owner_address = in_msg_body~load_msg_addr();

      save_data(marketplace_address, nft_address, prev_owner_address, full_price, fees_cell);

      return ();

    }

    if (in_msg_body.slice_empty?()) {
        buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, 0);
        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == 1) { ;; just accept coins
        return ();
    }

    if (op == 2) { ;; buy

      buy(my_balance, marketplace_address, nft_address, nft_owner_address, full_price, fees_cell, msg_value, sender_address, query_id);

      return ();

    }

    if (op == 3) { ;; cancel sale
         throw_unless(457, msg_value >= min_gas_amount());

         var msg = begin_cell()
           .store_uint(0x10, 6) ;; nobounce
           .store_slice(nft_address)
           .store_coins(0)
           .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
           .store_uint(op::transfer(), 32)
           .store_uint(query_id, 64)
           .store_slice(nft_owner_address) ;; new_owner_address
           .store_slice(nft_owner_address) ;; response_address;
           .store_int(0, 1) ;; empty custom_payload
           .store_coins(0) ;; forward amount to new_owner_address
           .store_int(0, 1); ;; empty forward_payload

        send_raw_message(msg.end_cell(), 128 + 32);

        return ();
    }

    throw(0xffff);

}

() recv_external(slice in_msg) impure {
}

(slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id {
    var (marketplace_address, nft_address, nft_owner_address, full_price, fees_cell) = load_data();
    var (marketplace_fee, marketplace_fee_address, royalty_address, royalty_amount) = load_fees(fees_cell);
    return (
        marketplace_address,
        nft_address,
        nft_owner_address,
        full_price,
        marketplace_fee_address,
        marketplace_fee,
        royalty_address,
        royalty_amount
    );
}


================================================
FILE: src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPriceV2/NftFixedPriceV2.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, contractAddress } from 'ton-core'

/**
 * Class representing a NFT fixed price sale contract (Version 2).
 */
export class NftFixedPriceV2 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static code = Cell.fromBoc(Buffer.from('te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=', 'base64'))[0]

    /**
     * Builds the data cell for an NFT fixed price sale.
     * @param data - The data for the NFT sale.
     * @returns A cell containing the data for the NFT sale.
     */
    static buildDataCell(data: NftFixPriceSaleV2Data) {

        const feesCell = beginCell()
    
        feesCell.storeAddress(data.marketplaceFeeAddress)
        feesCell.storeCoins(data.marketplaceFee)
        feesCell.storeAddress(data.royaltyAddress)
        feesCell.storeCoins(data.royaltyAmount)
    
        const dataCell = beginCell()
    
        dataCell.storeUint(data.isComplete ? 1 : 0, 1)
        dataCell.storeUint(data.createdAt, 32)
        dataCell.storeAddress(data.marketplaceAddress)
        dataCell.storeAddress(data.nftAddress)
        dataCell.storeAddress(data.nftOwnerAddress)
        dataCell.storeCoins(data.fullPrice)
        dataCell.storeRef(feesCell)
    
        return dataCell.endCell()
    }

    /**
     * Creates an NftFixedPriceV2 instance from an address.
     * @param address - The address to create from.
     * @returns A new NftFixedPriceV2 instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftFixedPriceV2(
            address
        )
    }

    /**
     * Creates an NftFixedPriceV2 instance from a configuration object.
     * @param config - The configuration data for the NFT sale.
     * @param workchain - The workchain ID (default is 0).
     * @returns A new NftFixedPriceV2 instance.
     */
    static async createFromConfig(
        config: NftFixPriceSaleV2Data,
        workchain = 0
    ) {

        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftFixedPriceV2(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends coins to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the coins.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendCoins(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(params.queryId, 64)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a command to cancel the sale.
     * @param provider - The contract provider.
     * @param via - The sender of the command.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendCancelSale(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(3, 32)
                .storeUint(params.queryId, 64)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a command to buy the NFT.
     * @param provider - The contract provider.
     * @param via - The sender of the command.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendBuy(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell().
                storeUint(params.queryId || 0, 32).
                endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Retrieves the sale data from the contract.
     * @param provider - The contract provider.
     * @returns An object containing the sale data.
     */
    async getSaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_sale_data', [])

        // pops out saleType
        stack.pop()
        
        return {
            isComplete: stack.readBigNumber(),
            createdAt: stack.readBigNumber(),
            marketplaceAddress: stack.readAddressOpt(),
            nftAddress: stack.readAddressOpt(),
            nftOwnerAddress: stack.readAddressOpt(),
            fullPrice: stack.readBigNumber(),
            marketplaceFeeAddress: stack.readAddressOpt(),
            marketplaceFee: stack.readBigNumber(),
            royaltyAddress: stack.readAddressOpt(),
            royaltyAmount:  stack.readBigNumber()
        }
    }
}

/**
 * Type definition for the data of an NFT fixed price sale, version 2.
 */
export type NftFixPriceSaleV2Data = {
    isComplete: boolean
    createdAt: number
    marketplaceAddress: Address
    nftAddress: Address
    nftOwnerAddress: Address|null
    fullPrice: bigint
    marketplaceFeeAddress: Address
    marketplaceFee: bigint
    royaltyAddress: Address
    royaltyAmount: bigint
}


================================================
FILE: src/wrappers/getgems/NftFixedPriceV2/nft-fixprice-sale-v2.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPriceV2/nft-fixprice-sale-v2.fc
================================================
;; NFT sale smart contract v2

#include "../stdlib.fc";
#include "../params.fc";
#include "../op-codes.fc";

int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON

_ load_data() inline {
    var ds = get_data().begin_parse();
    return (
        ds~load_uint(1),    ;; is_complete
        ds~load_uint(32),   ;; created_at
        ds~load_msg_addr(), ;; marketplace_address
        ds~load_msg_addr(), ;; nft_address
        ds~load_msg_addr(), ;; nft_owner_address
        ds~load_coins(),    ;; full_price
        ds~load_ref()       ;; fees_cell
    );
}

_ load_fees(cell fees_cell) inline {
    var ds = fees_cell.begin_parse();
    return (
        ds~load_msg_addr(), ;; marketplace_fee_address
        ds~load_coins(),    ;; marketplace_fee,
        ds~load_msg_addr(), ;; royalty_address
        ds~load_coins()     ;; royalty_amount
    );
}

() save_data(int is_complete, int created_at, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
    set_data(
        begin_cell()
            .store_uint(is_complete, 1)
            .store_uint(created_at, 32)
            .store_slice(marketplace_address)
            .store_slice(nft_address)
            .store_slice(nft_owner_address)
            .store_coins(full_price)
            .store_ref(fees_cell)
            .end_cell()
    );
}

() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_coins(amount)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .end_cell();

    send_raw_message(msg, 1);
}

() buy(var args) impure {

    (
        int created_at,
        slice marketplace_address,
        slice nft_address,
        slice nft_owner_address,
        int full_price,
        cell fees_cell,

        int my_balance,
        int msg_value,
        slice sender_address,
        int query_id
    ) = args;

    throw_unless(450, msg_value >= full_price + min_gas_amount());

    var (
        marketplace_fee_address,
        marketplace_fee,
        royalty_address,
        royalty_amount
    ) = load_fees(fees_cell);

    ;; Owner message
    send_money(
    nft_owner_address,
    full_price - marketplace_fee - royalty_amount + (my_balance - msg_value)
    );

    ;; Royalty message
    if ((royalty_amount > 0) & (royalty_address.slice_bits() > 2)) {
        send_money(
        royalty_address,
        royalty_amount
        );
    }

    ;; Marketplace fee message
    send_money(
        marketplace_fee_address,
        marketplace_fee
    );

    var nft_msg = begin_cell()
       .store_uint(0x18, 6)
       .store_slice(nft_address)
       .store_coins(0)
       .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
       .store_uint(op::transfer(), 32)
       .store_uint(query_id, 64)
       .store_slice(sender_address) ;; new_owner_address
       .store_slice(sender_address) ;; response_address
       .store_int(0, 1) ;; empty custom_payload
       .store_coins(0) ;; forward amount to new_owner_address
       .store_int(0, 1); ;; empty forward_payload

    send_raw_message(nft_msg.end_cell(), 128);

    ;; Set sale as complete
    save_data(
        1,
        created_at,
        marketplace_address,
        nft_address,
        nft_owner_address,
        full_price,
        fees_cell
    );
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    slice cs = in_msg_full.begin_parse();
    int flags = cs~load_uint(4);

    if (flags & 1) {  ;; ignore all bounced messages
        return ();
    }

    slice sender_address = cs~load_msg_addr();

    var (
        is_complete,
        created_at,
        marketplace_address,
        nft_address,
        nft_owner_address,
        full_price,
        fees_cell
    ) = load_data();

    ;; Throw if sale is complete
    throw_if(404, is_complete == 1);

    var is_initialized = nft_owner_address.slice_bits() > 2; ;; not initialized if null address

    if (~ is_initialized) {

        if (equal_slices(sender_address, marketplace_address)) {
            return (); ;; just accept coins on deploy
        }

        throw_unless(500, equal_slices(sender_address, nft_address));
        int op = in_msg_body~load_uint(32);
        throw_unless(501, op == op::ownership_assigned());
        int query_id = in_msg_body~load_uint(64);
        slice prev_owner_address = in_msg_body~load_msg_addr();

        save_data(
            is_complete,
            created_at,
            marketplace_address,
            nft_address,
            prev_owner_address,
            full_price,
            fees_cell
        );

        return ();
    }

    if (in_msg_body.slice_empty?()) {
        buy(
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell,

            my_balance,
            msg_value,
            sender_address,
            0
        );
        return ();
    }

    int op = in_msg_body~load_uint(32);
    int query_id = in_msg_body~load_uint(64);

    if (op == 1) { ;; just accept coins
        return ();
    }

    if (op == 2) { ;; buy
        buy(
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell,

            my_balance,
            msg_value,
            sender_address,
            query_id
        );
        return ();
    }

    if (op == 3) { ;; cancel sale
         throw_unless(457, msg_value >= min_gas_amount());
         throw_unless(458, equal_slices(sender_address, nft_owner_address) | equal_slices(sender_address, marketplace_address));

         var msg = begin_cell()
            .store_uint(0x10, 6) ;; nobounce
            .store_slice(nft_address)
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_uint(op::transfer(), 32)
            .store_uint(query_id, 64)
            .store_slice(nft_owner_address) ;; new_owner_address
            .store_slice(nft_owner_address) ;; response_address;
            .store_int(0, 1) ;; empty custom_payload
            .store_coins(0) ;; forward amount to new_owner_address
            .store_int(0, 1); ;; empty forward_payload

        send_raw_message(msg.end_cell(), 64);

        save_data(
            1,
            created_at,
            marketplace_address,
            nft_address,
            nft_owner_address,
            full_price,
            fees_cell
        );
        return ();
    }

    throw(0xffff);
}

() recv_external(slice in_msg) impure {
}

(int, int, int, slice, slice, slice, int, slice, int, slice, int) get_sale_data() method_id {
    var (
        is_complete,
        created_at,
        marketplace_address,
        nft_address,
        nft_owner_address,
        full_price,
        fees_cell
    ) = load_data();

    var (
        marketplace_fee_address,
        marketplace_fee,
        royalty_address,
        royalty_amount
    ) = load_fees(fees_cell);

    return (
        0x46495850,    ;; fix price sale ("FIXP")
        is_complete == 1,
        created_at,
        marketplace_address,
        nft_address,
        nft_owner_address,
        full_price,
        marketplace_fee_address,
        marketplace_fee,
        royalty_address,
        royalty_amount
    );
}


================================================
FILE: src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPriceV3/NftFixedPriceV3.ts
================================================
import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, contractAddress } from 'ton-core'

/**
 * Class representing a NFT fixed price sale contract V3
 */
export class NftFixedPriceV3 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static code = Cell.fromBoc(Buffer.from('te6cckECDAEAAqAAART/APSkE/S88sgLAQIBIAMCAH7yMO1E0NMA0x/6QPpA+kD6ANTTADDAAY4d+ABwB8jLABbLH1AEzxZYzxYBzxYB+gLMywDJ7VTgXweCAP/+8vACAUgFBABXoDhZ2omhpgGmP/SB9IH0gfQBqaYAYGGh9IH0AfSB9ABhBCCMkrCgFYACqwECAs0IBgH3ZghA7msoAUmCgUjC+8uHCJND6QPoA+kD6ADBTkqEhoVCHoRagUpBwgBDIywVQA88WAfoCy2rJcfsAJcIAJddJwgKwjhdQRXCAEMjLBVADzxYB+gLLaslx+wAQI5I0NOJacIAQyMsFUAPPFgH6AstqyXH7AHAgghBfzD0UgcAlsjLHxPLPyPPFlADzxbKAIIJycOA+gLKAMlxgBjIywUmzxZw+gLLaszJgwb7AHFVUHAHyMsAFssfUATPFljPFgHPFgH6AszLAMntVAP10A6GmBgLjYSS+CcH0gGHaiaGmAaY/9IH0gfSB9AGppgBgYOCmE44BgAEwthGmP6Z+lVW8Q4AHxgRDAgRXdFOAA2CnT44LYTwhWL4ZqGGhpg+oYAP2AcBRgAPloyhJrpOEBWfGBHByUYABOGxuIHCOyiiGYOHgC8BRgAMCwoJAC6SXwvgCMACmFVEECQQI/AF4F8KhA/y8ACAMDM5OVNSxwWSXwngUVHHBfLh9IIQBRONkRW68uH1BPpAMEBmBXAHyMsAFssfUATPFljPFgHPFgH6AszLAMntVADYMTc4OYIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxXLPyfPFifPFhTKACP6AhPKAMmAQPsAcVBmRRUEcAfIywAWyx9QBM8WWM8WAc8WAfoCzMsAye1UM/Vflw==', 'base64'))[0]

    /**
     * Builds the data cell for an NFT fixed price sale.
     * @param data - The data for the NFT sale.
     * @returns A cell containing the data for the NFT sale.
     */
    static buildDataCell(data: NftFixPriceSaleV3Data) {
        const feesCell = beginCell()
    
        feesCell.storeAddress(data.marketplaceFeeAddress)
        feesCell.storeCoins(data.marketplaceFee)
        feesCell.storeAddress(data.royaltyAddress)
        feesCell.storeCoins(data.royaltyAmount)
    
        const dataCell = beginCell()
    
        dataCell.storeUint(data.isComplete ? 1 : 0, 1)
        dataCell.storeUint(data.createdAt, 32)
        dataCell.storeAddress(data.marketplaceAddress)
        dataCell.storeAddress(data.nftAddress)
        dataCell.storeAddress(data.nftOwnerAddress)
        dataCell.storeCoins(data.fullPrice)
        dataCell.storeRef(feesCell)
        dataCell.storeUint(data.canDeployByExternal ? 1 : 0, 1) // can_deploy_by_external
    
        return dataCell.endCell()
    }

    /**
     * Creates an NftFixedPriceV3 instance from an address.
     * @param address - The address to create from.
     * @returns A new NftFixedPriceV3 instance.
     */
    static createFromAddress(
        address: Address
    ) {
        return new NftFixedPriceV3(
            address
        )
    }

    /**
     * Creates an NftFixedPriceV3 instance from a configuration object.
     * @param config - The configuration data for the NFT sale.
     * @param workchain - The workchain ID (default is 0).
     * @returns A new NftFixedPriceV3 instance.
     */
    static async createFromConfig(
        config: NftFixPriceSaleV3Data,
        workchain = 0
    ) {

        const data = this.buildDataCell(config)
        const address = contractAddress(
            workchain,
            {
                code: this.code,
                data: data
            }
        )

        return new NftFixedPriceV3(
            address,
            {
                code: this.code,
                data: data
            }
        )
    }

    /**
     * Sends a deploy command to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the deploy command.
     * @param value - The value to send with the command.
     */
    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            body: beginCell().endCell(),
        })
    }

    /**
     * Sends coins to the contract.
     * @param provider - The contract provider.
     * @param via - The sender of the coins.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendCoins(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(params.queryId, 64)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a command to cancel the sale.
     * @param provider - The contract provider.
     * @param via - The sender of the command.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendCancelSale(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell()
                .storeUint(3, 32)
                .storeUint(params.queryId, 64)
                .endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Sends a command to buy the NFT.
     * @param provider - The contract provider.
     * @param via - The sender of the command.
     * @param params - Parameters for the operation, including the value and queryId.
     */
    async sendBuy(provider: ContractProvider, via: Sender, params: {
        value: bigint
        queryId: bigint
    }) {
        await provider.internal(via, {
            value: params.value,
            body: beginCell().endCell(),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        })
    }

    /**
     * Retrieves the sale data from the contract.
     * @param provider - The contract provider.
     * @returns An object containing the sale data.
     */
    async getSaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_sale_data', [])

        // pops out saleType
        stack.pop()

        return {
            // saleType: stack.readBigNumber(),
            isComplete: stack.readBigNumber(),
            createdAt: stack.readBigNumber(),
            marketplaceAddress: stack.readAddressOpt(),
            nftAddress: stack.readAddressOpt(),
            nftOwnerAddress: stack.readAddressOpt(),
            fullPrice: stack.readBigNumber(),
            marketplaceFeeAddress: stack.readAddressOpt(),
            marketplaceFee: stack.readBigNumber(),
            royaltyAddress: stack.readAddressOpt(),
            royaltyAmount:  stack.readBigNumber()
        }
    }
}

/**
 * Type definition for the data of an NFT fixed price sale.
 */
export type NftFixPriceSaleV3Data = {
    isComplete: boolean
    createdAt: number
    marketplaceAddress: Address
    nftAddress: Address
    nftOwnerAddress: Address | null
    fullPrice: bigint
    marketplaceFeeAddress: Address
    marketplaceFee: bigint
    royaltyAddress: Address
    royaltyAmount: bigint
    canDeployByExternal?: boolean
  }
  


================================================
FILE: src/wrappers/getgems/NftFixedPriceV3/nft-fixprice-sale-v3.fc
URL: https://github.com/ton-community/nft-sdk/blob/main/src/wrappers/getgems/NftFixedPriceV3/nft-fixprice-sale-v3.fc
================================================
;; NFT sale smart contract v3

#include "../stdlib.fc";
#include "../params.fc";
#include "../op-codes.fc";

int min_gas_amount() asm "1000000000 PUSHINT"; ;; 1 TON

_ load_data() inline {
    var ds = get_data().begin_parse();
    return (
        ds~load_uint(1),    ;; is_complete
        ds~load_uint(32),   ;; created_at
        ds~load_msg_addr(), ;; marketplace_address
        ds~load_msg_addr(), ;; nft_address
        ds~load_msg_addr(), ;; nft_owner_address
        ds~load_coins(),    ;; full_price
        ds~load_ref(),      ;; fees_cell
        ds~load_uint(1)     ;; can_deploy_by_external
    );
}

_ load_fees(cell fees_cell) inline {
    var ds = fees_cell.begin_parse();
    return (
        ds~load_msg_addr(), ;; marketplace_fee_address
        ds~load_coins(),    ;; marketplace_fee,
        ds~load_msg_addr(), ;; royalty_address
        ds~load_coins()     ;; royalty_amount
    );
}

() save_data(int is_complete, int created_at, slice marketplace_address, slice nft_address, slice nft_owner_address, int full_price, cell fees_cell) impure inline {
    set_data(
        begin_cell()
            .store_uint(is_complete, 1)
            .store_uint(created_at, 32)
            .store_slice(marketplace_address)
            .store_slice(nft_address)
            .store_slice(nft_owner_address)
            .store_coins(full_price)
            .store_ref(fees_cell)
            .store_uint(0, 1) ;; can_deploy_by_external
            .end_cell()
    );
}

() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_coins(amount)
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .end_cell();

    send_raw_message(msg, 1);
}

() buy(var args) impure {

    (
        int created_at,
        slice marketplace_address,
        slice nft_address,
        slice nft_owner_address,
        int full_price,
        cell fees_cell,

        int my_balance,
        int msg_value,
        slice sender_address,
        int query_id
    ) = args;

    throw_unless(450, msg_value >= full_price + min_gas_amount());

    var (
        marketplace_fee_address,
        marketplace_fee,
        royalty_address,
        royalty_amount
    ) = load_fees(fees_cell);

    ;; Owner message
    send_money(
    nft_owner_address,
    full_price - marketplace_fee - royalty_amount + (my_balance - msg_value)
    );

    ;; Royalty message
    if ((royalty_amount > 0) & (royalty_address.slice_bits() > 2)) {
        send_money(
        royalty_address,