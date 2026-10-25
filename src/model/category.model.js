
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
