const mongosse = require('mongoose');

const HeadingModel = mongosse.model('Heading', {
  text: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = HeadingModel;
