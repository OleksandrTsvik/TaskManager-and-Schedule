const mongosse = require('mongoose');

const Task = mongosse.model('Task', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    backgroundColor: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 11,
        default: '#ffffff'
    },
    color: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 11,
        default: '#000000'
    },
    dateCreation: {
        type: Date,
        default: new Date()
    }
});

module.exports = Task;
