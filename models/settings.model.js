const mongosse = require('mongoose');

const SettingsModel = mongosse.model('Settings', {
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: Object,
  },
});

module.exports = SettingsModel;
