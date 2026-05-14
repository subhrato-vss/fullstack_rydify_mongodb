const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    name: { type: String },
    type: { type: String, enum: ['car', 'bike'], default: 'car' },
    fuelType: { 
        type: String, 
        enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], 
        required: true 
    },
    transmissionType: { 
        type: String, 
        enum: ['Manual', 'Automatic', 'CVT'], 
        required: true 
    },
    mileage: { type: Number, required: true },
    kmDriven: { type: Number, required: true },
    engineCapacity: { type: Number, required: true },
    chassisNumber: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    ownerType: { 
        type: String, 
        enum: ['First Owner', 'Second Owner', 'Third Owner', 'Fourth or More'], 
        required: true 
    },
    accidentalHistory: { type: String, default: 'No' },
    address: { type: String, required: true },
    contact: { type: String },
    email: { type: String, required: true },
    photo: { type: String },
    dealer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dealer', 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    status: { type: String, default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
