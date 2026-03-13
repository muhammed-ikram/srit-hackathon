const express = require('express');
const router = express.Router();
const complaintModel = require('../models/complaint');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Submit a complaint
router.post('/submit', isLoggedIn, async (req, res) => {
    const { title, description, category } = req.body;
    try {
        const complaint = await complaintModel.create({
            sender: req.user.id,
            title,
            description,
            category
        });
        res.status(201).json({ success: true, complaint });
    } catch (err) {
        res.status(500).json({ message: "Error submitting complaint" });
    }
});

// Get user's own complaints
router.get('/my-complaints', isLoggedIn, async (req, res) => {
    try {
        const complaints = await complaintModel.find({ sender: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ message: "Error fetching your complaints" });
    }
});

// GET all complaints (for Hostel Management)
router.get('/hostel/all', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user.role !== 'hostel_management') {
            return res.status(403).json({ message: "Access denied. Hostel Management only." });
        }
        
        const complaints = await complaintModel.find().populate('sender', 'username email role').sort({ createdAt: -1 });
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ message: "Error fetching all complaints" });
    }
});

// Update complaint status (Hostel Management only)
router.patch('/update-status/:id', isLoggedIn, async (req, res) => {
    const { status, note } = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        if (user.role !== 'hostel_management') {
            return res.status(403).json({ message: "Access denied." });
        }

        const complaint = await complaintModel.findByIdAndUpdate(
            req.params.id,
            { status, hostelManagementNote: note },
            { new: true }
        );
        res.json({ success: true, complaint });
    } catch (err) {
        res.status(500).json({ message: "Error updating complaint status" });
    }
});

module.exports = router;
