const express = require('express');
const router = express.Router();
const resourcePostModel = require('../models/resourcePost');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Create a resource post (Restricted to Lab Tech, Librarian, Admin, HOD)
router.post('/create', isLoggedIn, async (req, res) => {
    const { type, title, content, slotsAvailable, category } = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        const allowedRoles = ['lab_technician', 'librarian', 'admin', 'hod', 'faculty', 'hostel_management'];
        
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "You don't have permission to post updates." });
        }

        const post = await resourcePostModel.create({
            sender: req.user.id,
            type,
            title,
            content,
            slotsAvailable,
            category
        });
        
        res.status(201).json({ success: true, post });
    } catch (err) {
        res.status(500).json({ message: "Error creating post" });
    }
});

// Get all resource posts
router.get('/all', isLoggedIn, async (req, res) => {
    try {
        const posts = await resourcePostModel.find()
            .populate('sender', 'username role')
            .sort({ createdAt: -1 });
        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts" });
    }
});

// Delete a post (Own posts or Admin)
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await resourcePostModel.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.sender.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        await resourcePostModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting post" });
    }
});

module.exports = router;
