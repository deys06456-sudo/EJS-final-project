
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            trim: true
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },

        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
