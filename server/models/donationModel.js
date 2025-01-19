const mongoose = require('mongoose')

const Schema = mongoose.Schema

const donationSchema = new Schema({
    userId: {
      type: String,
      required: true,
    },
    foodDetails: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    allergyInfo: {
      type: String,
      default: "",
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    recipient: {
      userId: {
        type: String,
        default: null
      },
      name: {
        type: String,
        default: null
      },
      phoneNumber: {
        type: String,
        default: null
      },
      acceptedAt: {
        type: Date,
        default: null
      }
    },
  });

  module.exports = mongoose.model('Donation', donationSchema)