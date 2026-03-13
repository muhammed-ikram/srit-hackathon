const express = require('express');
const router = express.Router();
const notificationModel = require('../models/notification');
const isLoggedIn = require('../middlewares/isLoggedIn');

// GET notifications for the current user
router.get('/my-notifications', isLoggedIn, async (req, res) => {
    try {
        const notifications = await notificationModel.find({ recipient: req.user.id })
            .populate('sender', 'username email role')
            .sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// PATCH mark notification as read
router.patch('/read/:id', isLoggedIn, async (req, res) => {
    try {
        const notification = await notificationModel.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        res.json({ success: true, notification });
    } catch (err) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

module.exports = router;
