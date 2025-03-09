// const mongoose = require('mongoose')

// const Schema = mongoose.Schema

// const donationSchema = new Schema({
//     userId: {
//       type: String,
//       required: true,
//     },
//     email:{
//       type: String,
//     },
//     foodDetails: {
//       type: String,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     expiryDate: {
//       type: Date,
//       required: true,
//     },
//     allergyInfo: {
//       type: String,
//       default: "",
//     },
//     location: {
//       latitude: {
//         type: Number,
//         required: true,
//       },
//       longitude: {
//         type: Number,
//         required: true,
//       },
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     isAccepted: {
//       type: Boolean,
//       default: false,
//     },
//     recipient: {
//       userId: {
//         type: String,
//         default: null
//       },
//       name: {
//         type: String,
//         default: null
//       },
//       phoneNumber: {
//         type: String,
//         default: null
//       },
//       location: {
//         latitude: {
//           type: Number,
       
//         },
//         longitude: {
//           type: Number,
         
//         },
//       },
//       acceptedAt: {
//         type: Date,
//         default: null
//       }
//     },
//   });

//   module.exports = mongoose.model('Donation', donationSchema)

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipientSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  acceptedAt: {
    type: Date,
    default: Date.now
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const donationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  foodDetails: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  remainingQuantity: {
    type: Number,
    default: function() {
      return this.quantity; // Initially, remaining quantity equals total quantity
    }
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
    address: {
      type: String,
      default: ""
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  // For backward compatibility, keep the original recipient field
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
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    acceptedAt: {
      type: Date,
      default: null
    },
    requestedQuantity: {
      type: Number,
      default: null
    }
  },
  // New field to track multiple recipients
  recipients: [recipientSchema]
});

module.exports = mongoose.model('Donation', donationSchema)