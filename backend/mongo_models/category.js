const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['car', 'bike'], default: 'car' },
    photo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
