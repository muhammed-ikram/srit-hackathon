const mongoose = require('mongoose');

const stressReportSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    tier: {
        type: String,
        enum: ['Minimal Stress', 'Low Stress', 'Moderate Stress', 'High Stress', 'Severe Stress'],
        required: true
    },
    answers: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('stressReport', stressReportSchema);
