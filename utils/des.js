import CryptoJS from 'crypto-js';

/**
 * DES 加密函数，使用 CBC 模式和 PKCS7 填充。
 * @param {string} keyHex - 十六进制格式的密钥。
 * @param {string} ivHex - 十六进制格式的 IV (初始化向量)。
 * @param {string} plaintext - 需要加密的明文。
 * @returns {string|null} 加密后的 Base64 字符串，如果加密失败则返回 null。
 */
export function desCbcPkcs5Encrypt(keyHex, ivHex, plaintext) {
    try {
        const key = CryptoJS.enc.Hex.parse(keyHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const encrypted = CryptoJS.DES.encrypt(plaintext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.toString();
    } catch (e) {
        logger.error('DES CBC PKCS5 加密过程中发生错误:', e);
        return null;
    }
}