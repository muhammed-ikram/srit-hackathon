const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const notificationModel = require('../models/notification');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Middleware to ensure the user is a Faculty or Counselor
const isFaculty = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user && (user.role === 'faculty' || user.role === 'counselor')) {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Faculty only." });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// GET all students in the system (for discovery)
router.get('/students', isLoggedIn, isFaculty, async (req, res) => {
    try {
        const students = await userModel.find({ role: 'student' }).select('-password');
        res.json({ success: true, students });
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

// GET students assigned to this faculty
router.get('/my-students', isLoggedIn, isFaculty, async (req, res) => {
    try {
        const faculty = await userModel.findById(req.user.id).populate('counselees', '-password');
        res.json({ success: true, students: faculty.counselees });
    } catch (err) {
        res.status(500).json({ message: "Error fetching assigned students" });
    }
});

// POST add a student to faculty's counseling list
router.post('/add-student', isLoggedIn, isFaculty, async (req, res) => {
    const { studentId } = req.body;
    try {
        const faculty = await userModel.findById(req.user.id);
        const student = await userModel.findById(studentId);

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: "Student not found" });
        }

        if (faculty.counselees.includes(studentId)) {
            return res.status(400).json({ message: "Student already in your list" });
        }

        faculty.counselees.push(studentId);
        await faculty.save();

        student.assignedCounselor = faculty._id;
        await student.save();

        res.json({ success: true, message: "Student added to counseling list" });
    } catch (err) {
        res.status(500).json({ message: "Error adding student" });
    }
});

// POST schedule an intervention (create notification)
router.post('/schedule-intervention', isLoggedIn, isFaculty, async (req, res) => {
    const { studentId, title, message, details } = req.body;
    try {
        const notification = await notificationModel.create({
            recipient: studentId,
            sender: req.user.id,
            type: 'intervention',
            title,
            message,
            details
        });

        res.json({ success: true, message: "Intervention scheduled and student notified", notification });
    } catch (err) {
        res.status(500).json({ message: "Error scheduling intervention" });
    }
});

module.exports = router;
