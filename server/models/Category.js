const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name:{
        type: String,
        required:'This feld is required'
    },
    
    img:{
        type: String,
        required:'This feld is required'
    },
    
});

module.exports = mongoose.model('Category', categorySchema);