// cartModel.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = new Schema({
    userId: { 
        type: String, 
        required: [true, 'User ID is required'],
        trim: true 
    },
    name: { 
        type: String, 
        default: '',
        trim: true 
    },
    category: { 
        type: String, 
        default: 'Others',
        trim: true 
    },
    quantity: { 
        type: Number, 
        default: 1,
        min: [1, 'Quantity must be at least 1']
    },
    price: { 
        type: Number, 
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    priority: { 
        type: String, 
        default: 'low',
        enum: {
            values: ['low', 'urgent'],
            message: '{VALUE} is not a valid priority'
        }
    },
    status: { 
        type: String, 
        default: 'fresh',
        trim: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartSchema)