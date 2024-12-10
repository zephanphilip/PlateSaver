const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    expires: { type: Date, required: true },
    status: { type: String, enum: ["fresh", "warning", "expired"], default: "fresh" },
})

module.exports = mongoose.model('Item', itemSchema)