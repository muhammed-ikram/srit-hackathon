const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/srit-hackathon`);

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['student', 'faculty', 'counselor', 'hod', 'librarian', 'lab_technician', 'hostel_management', 'admin'],
        default: 'student'
    },
    details: {
        type: Object,
        default: {}
    },
    isRegistrationComplete: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: String,
        default: "local"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    profilepic: {
        type: String,
        default: "default.jpg"
    },
    // Counseling/Faculty-Student Relationship
    counselees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    assignedCounselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;