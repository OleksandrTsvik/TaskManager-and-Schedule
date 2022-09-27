const { ENCRYPTION_FIELDS } = require('../config/config');
const Settings = require('../models/settings');

const crypt = require('./encryption');

async function getValueByKey(key) {
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
    getValueByKey
};