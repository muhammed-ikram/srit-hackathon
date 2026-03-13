const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const stressReportModel = require('../models/stressReport');
const notificationModel = require('../models/notification');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { generateContent } = require('../utils/aiService');

// POST /api/student/update-academics - Saves academic data and triggers AI Risk Assessment
router.post('/update-academics', isLoggedIn, async (req, res) => {
    try {
        const { attendance, backlogs } = req.body;
        const studentId = req.user.id;
        
        const student = await userModel.findById(studentId);
        
        if (!student || student.role !== 'student') {
            return res.status(403).json({ message: "Access denied. Only students can update academics." });
        }

        // 1. Update Student Profile
        const updatedDetails = {
            ...student.details,
            attendance: attendance,
            backlogs: backlogs
        };
        student.details = updatedDetails;
        await student.save();

        // 2. Fetch Latest Stress Score
        const latestReport = await stressReportModel
            .findOne({ student: studentId })
            .sort({ createdAt: -1 });
            
        const stressScore = latestReport ? latestReport.score.toFixed(1) : "N/A";
        const stressTier = latestReport ? latestReport.tier : "Unknown";

        // 3. Trigger Gemini AI Risk Assessment
        if (student.assignedCounselor && typeof attendance === 'number' && typeof backlogs === 'number') {
            
            const prompt = `
            You are an advanced AI decision-support system for a university. 
            Analyze the following student data (Attendance, Backlogs, and Stress Score) and assess their risk of dropping out, failing, or experiencing severe distress.

            Student Name: ${student.username}
            Attendance: ${attendance}% (Below 75% is concerning)
            Active Backlogs (Failed Subjects): ${backlogs}
            Latest Stress Score: ${stressScore}/5.0 (${stressTier}) - (Notes: 4.0+ is High/Severe stress)

            Provide a strict JSON response with exactly three keys:
            1. "riskLevel": Must be exactly one of: "Low", "Medium", "High", or "Severe".
            2. "reason": A concise, factual explanation of WHY this risk level was assigned based purely on the data provided (e.g., "Attendance dropped to 60% and 3 backlogs detected while experiencing high stress").
            3. "action": A concise, actionable intervention for the faculty member to take (e.g., "Schedule immediate academic counseling and assign peer mentor").
            
            Return ONLY the valid JSON object exactly as specified, without any markdown formatting blocks like \`\`\`json.
            `;

            const aiResult = await generateContent(prompt, "gemini-flash-latest");

            if (aiResult.success) {
                try {
                    // Try to parse the JSON response. 
                    // Gemini might sometimes wrap in markdown despite instructions, so we strip it.
                    let cleanJsonStr = aiResult.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    const riskData = JSON.parse(cleanJsonStr);

                    // 4. Auto-Notify Faculty if Risk is High or Severe
                    if (riskData.riskLevel === "High" || riskData.riskLevel === "Severe") {
                        const rollNumber = student.details.rollNumber || 'N/A';
                        
                        await notificationModel.create({
                            recipient: student.assignedCounselor,
                            sender: studentId,
                            type: 'alert',
                            title: `🚨 AI Risk Alert [${riskData.riskLevel}]: ${student.username}`,
                            message: `AI Assessment triggered for ${student.username} (Roll: ${rollNumber}).\n\nReason: ${riskData.reason}\n\nSuggested Action: ${riskData.action}`,
                            details: {
                                studentId: student._id,
                                riskLevel: riskData.riskLevel,
                                reason: riskData.reason,
                                action: riskData.action,
                                attendance,
                                backlogs,
                                stressScore,
                                rollNumber
                            }
                        });
                        console.log(`[AI Assessment] Alert sent for ${student.username} (Level: ${riskData.riskLevel})`);
                    }
                    
                    return res.json({ 
                        success: true, 
                        message: "Academics updated and risk assessed successfully.",
                        aiAssessment: riskData
                    });

                } catch (parseError) {
                    console.error("[AI Assessment] Failed to parse JSON:", aiResult.text, parseError);
                    // Still return success for the academic update, even if AI parsing failed
                     return res.json({ success: true, message: "Academics updated, but AI assessment format was invalid." });
                }
            } else {
                 console.error("[AI Assessment] Gemini call failed:", aiResult.error);
            }
        }

        res.json({ success: true, message: "Academics updated successfully." });

    } catch (err) {
        console.error("Error updating academics:", err);
        res.status(500).json({ message: "Error updating academic details" });
    }
});

module.exports = router;
