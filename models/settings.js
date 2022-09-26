const mongosse = require('mongoose');

const Settings = mongosse.model('Settings', {
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: Object,
    }
});

module.exports = Settings;