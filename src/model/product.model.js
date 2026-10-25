const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Product name is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required']
    },

    price: {
        type: Number,
        required: [true, 'Price is required']
    },

    discountPrice: {
        type: Number,
        default: null
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },

    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand is required']
    },

    sizes: {
        type: [String],
        default: []
    },

    colors: {
        type: [String],
        default: []
    },

    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        default: 0
    },

    images: [{
        url: {
            type: String,
            required: true
        },

        public_id: {
            type: String
        },

        alt: {
            type: String
        }
    }],

    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;

