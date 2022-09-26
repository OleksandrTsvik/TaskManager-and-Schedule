const crypto = require('crypto');

const { encryptionKey, encryptionIV, encryptionAlgorithm } = require('../config/config');

function encryption(dataEncrypted) {
    const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, encryptionIV);

    let encrypted = cipher.update(dataEncrypted, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

function decryption(dataDecrypt) {
    const decipher = crypto.createDecipheriv(encryptionAlgorithm, encryptionKey, encryptionIV);

    let decrypted = decipher.update(dataDecrypt, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encryption, decryption
};