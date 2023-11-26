const crypto = require('crypto');

const {
  ENCRYPTION_KEY,
  ENCRYPTION_IV,
  ENCRYPTION_ALGORITHM,
} = require('../config/app.conf');

function encryption(dataEncrypted) {
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    ENCRYPTION_KEY,
    ENCRYPTION_IV,
  );

  let encrypted = cipher.update(dataEncrypted, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

function decryption(dataDecrypt) {
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    ENCRYPTION_KEY,
    ENCRYPTION_IV,
  );

  let decrypted = decipher.update(dataDecrypt, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encryption,
  decryption,
};
