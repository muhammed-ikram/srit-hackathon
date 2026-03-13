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

// Specialized endpoint for stress-relief chatbot
router.post('/chatbot', isLoggedIn, async (req, res) => {
    const { prompt, history } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Message is required" });
    }

    const systemPrompt = `
    You are a compassionate, supportive, and empathetic Stress-Relief Chatbot for students. 
    Your primary goal is to provide emotional support, stress-relief techniques, and a safe space for students to express their feelings.
    
    CRITICAL INSTRUCTIONS:
    1. EXCLUSIVE FOCUS: You must ONLY discuss topics related to stress, mental health, well-being, academic pressure, and emotional support.
    2. REDIRECTION: If a student asks about unrelated topics (e.g., coding, history, science, sports, general knowledge), politely and gently redirect the conversation back to their well-being. Acknowledge the input as either positive or negative in tone, and then ask how they are feeling or if they'd like to discuss something that's on their mind.
    3. TONE: Be warm, non-judgmental, and encouraging. Use "I understand," "It's okay to feel this way," and "I'm here for you."
    4. TECHNIQUES: Suggest breathing exercises, grounding techniques (5-4-3-2-1), journaling, or taking short breaks when appropriate.
    5. SAFETY: If a student expresses thoughts of self-harm or severe crisis, strongly urge them to contact a professional counselor, a trusted teacher, or a crisis hotline immediately.
    
    Student Input: "${prompt}"
    
    Previous Conversation History:
    ${JSON.stringify(history || [])}
    
    Response:
    `;

    const result = await generateContent(systemPrompt, "gemini-flash-latest");

    if (result.success) {
        res.json({ success: true, text: result.text });
    } else {
        res.status(500).json({ success: false, message: "Chatbot service failed", error: result.error });
    }
});

module.exports = router;
