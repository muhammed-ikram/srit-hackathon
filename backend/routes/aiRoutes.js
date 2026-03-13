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

// Specialized endpoint for faculty to analyze student data
router.post('/generate-student-report', isLoggedIn, async (req, res) => {
    const { studentName, attendance, performanceData, additionalInfo } = req.body;
    console.log(`[ROUTER] Student Report requested for: ${studentName}`);

    if (!studentName || !attendance || !performanceData) {
        return res.status(400).json({ message: "Student information, attendance, and performance data are required." });
    }

    const prompt = `
    Analyze the following student data and provide a detailed report for the faculty.
    The report should include:
    1. A summary of current performance.
    2. A risk factor (Low, Medium, High) for the student dropping out or failing.
    3. Actionable recommendations for the faculty (e.g., counseling, extra classes).
    
    Student Name: ${studentName}
    Attendance: ${attendance}%
    Performance Data (Grades/Scores): ${performanceData}
    Additional Context: ${additionalInfo || "None"}
    
    Format the output as a professional report with a clear "Risk Level" section.
    `;

    const result = await generateContent(prompt, "gemini-flash-latest");

    if (result.success) {
        // Extract a simple risk level for easy frontend parsing if possible, or just send the text
        res.json({ success: true, report: result.text });
    } else {
        res.status(500).json({ message: "AI report generation failed", error: result.error });
    }
});

module.exports = router;
