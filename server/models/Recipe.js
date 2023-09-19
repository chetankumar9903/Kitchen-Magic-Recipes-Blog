const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({

    name:{
        type: String,
        required:'This feld is required'
    },
    description:{
        type: String,
        required:'This feld is required'
    },
    email:{
        type: String,
        required:'This feld is required'
    },
    ingredients:{
        type: Array,
        required:'This feld is required'
    },
    category:{
        type: String,
        enum:['Thai','American','Chinese','Mexican','Indian'],
        required:'This feld is required'
    }, 
    image:{
        type: String,
        required:'This feld is required'
    },
    
});

recipeSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);