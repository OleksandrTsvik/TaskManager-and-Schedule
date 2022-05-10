const mongosse = require('mongoose');

const { MONGO_URL } = require('../config/config');

async function connectDB() {
    try {
        await mongosse.connect(MONGO_URL);
    } catch (err) {
        throw err;
    }
}

module.exports = connectDB;
