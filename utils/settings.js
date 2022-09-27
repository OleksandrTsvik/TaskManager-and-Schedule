const { ENCRYPTION_FIELDS } = require('../config/config');
const { Settings } = require('../models/index');

const crypt = require('./encryption');

async function getSettingsValueByKey(key) {
    let data = await Settings.findOne({key: key});

    if (!data) {
        return null;
    }

    if (ENCRYPTION_FIELDS.includes(key)) {
        return crypt.decryption(data.value);
    }

    return data.value;
}

module.exports = {
    getSettingsValueByKey,
};