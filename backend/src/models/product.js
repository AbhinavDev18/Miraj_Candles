import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'out of stock'],
        default: 'available'
    },
    rating: {
        type: Number,
        default: 0
    },
    comments: [
        {
            id: {
                type: String,
                required: true
            },
            comment: {
                type: [String],
                default: []
            }
        }
    ],
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    }
});

export const Product = mongoose.model('Product', productSchema);
