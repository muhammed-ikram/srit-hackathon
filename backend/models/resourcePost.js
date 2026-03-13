const mongoose = require('mongoose');

const resourcePostSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    type: {
        type: String,
        enum: ['lab', 'library', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slotsAvailable: {
        type: Number,
        default: null
    },
    category: {
        type: String,
        default: "Update"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('resourcePost', resourcePostSchema);
