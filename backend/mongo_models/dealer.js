const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adhar_card: { type: String, required: true },
    pan_card: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'Inactive' }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
