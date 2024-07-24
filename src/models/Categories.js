const mongoose = require('mongoose')

const parentCategorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    children: [this],
    parent: {
        type: String,
    },
    mainParent: {
        type: String,
    },
});


const ParentCategory = mongoose.model('ParentCategory', parentCategorySchema);

module.exports = ParentCategory;


