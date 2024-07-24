const { mongoose } = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: String
    },
    description: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    categoryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentCategory'
    }]
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;