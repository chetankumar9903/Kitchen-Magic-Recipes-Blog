const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required'
    },
    email: {
        type: String, // Specify the data type as String
        required: 'This field is required'
    },
    phone: {
        type: Number,
        required: 'This field is required'
    },
    message: {
        type: String, // Specify the data type as String
        required: 'This field is required'
    }
});

module.exports = mongoose.model('Contact', formSchema);
