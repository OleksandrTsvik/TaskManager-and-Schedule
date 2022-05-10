const mongosse = require('mongoose');

const Heading = mongosse.model('Heading', {
    text: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = Heading;