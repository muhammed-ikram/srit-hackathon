const express = require('express');
const router = express.Router();
const { generateContent } = require('../utils/aiService');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Basic endpoint for hackathon AI features
router.post('/generate', isLoggedIn, async (req, res) => {
    const { prompt, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await generateContent(prompt, model);

    if (result.success) {
        res.json({ text: result.text });
    } else {
        res.status(500).json({ message: result.message || "AI service failed", error: result.error });
    }
});

module.exports = router;
