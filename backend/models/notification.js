const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        enum: ['intervention', 'general', 'alert'],
        default: 'general'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: Object, // To store scheduling info like date, time, location
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notification', notificationSchema);
