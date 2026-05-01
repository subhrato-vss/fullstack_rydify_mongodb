const mongoose = require('mongoose');

const carRequestSchema = new mongoose.Schema({
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    dealer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dealer', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('CarRequest', carRequestSchema);
