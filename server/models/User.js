const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String }, // Plain text for this demo
    name: { type: String, required: true },
    avatar: { type: String },
    status: { type: String, default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
