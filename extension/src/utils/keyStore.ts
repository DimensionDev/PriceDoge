import * as bip39 from "bip39";
import { HDKey } from "wallet.ts";

const keyStore = {
    generate,
    recover,
};

export default keyStore;

/// Private key at m/44'/coinType'/account'/change/addressIndex
const path = "m/44'/60'/0'/0/0";

function generate(password: string) {
    const seedWord = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeed(seedWord, password);
    const masterKey = HDKey.parseMasterSeed(seed);
    const extendedPrivateKey = masterKey.derive(path).extendedPrivateKey;
    return {
        extendedPrivateKey,
        password,
        seedWord,
    };
}

function recover(seedWord: string, password: string) {
    const verify = bip39.validateMnemonic(seedWord);
    if (!verify) {
        throw new Error("seed word error");
    }
    const seed = bip39.mnemonicToSeed(seedWord, password);
    const masterKey = HDKey.parseMasterSeed(seed);
    const extendedPrivateKey = masterKey.derive(path).extendedPrivateKey;
    return {
        extendedPrivateKey,
        password,
        seedWord,
    };
}
