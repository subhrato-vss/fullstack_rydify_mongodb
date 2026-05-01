const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    dealer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dealer', 
        required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], 
        default: 'Confirmed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
