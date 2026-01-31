const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: String }, // For UUID compatibility if needed, or use _id
    chatId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    text: String,
    image: String,
    status: { type: String, default: 'sent' },
    timestamp: { type: Number, default: Date.now }
});

// Helper to return cleaner object
messageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Message', messageSchema);
