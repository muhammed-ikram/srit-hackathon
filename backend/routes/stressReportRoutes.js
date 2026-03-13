const express = require('express');
const router = express.Router();
const stressReportModel = require('../models/stressReport');
const notificationModel = require('../models/notification');
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Helper: map avg score to tier label
function getTierLabel(avg) {
    if (avg <= 1.8) return 'Minimal Stress';
    if (avg <= 2.6) return 'Low Stress';
    if (avg <= 3.4) return 'Moderate Stress';
    if (avg <= 4.2) return 'High Stress';
    return 'Severe Stress';
}

// POST /api/stress-reports — Student submits a report
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { score, answers } = req.body;
        const student = await userModel.findById(req.user.id).select('-password');

        if (!student || student.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit stress reports.' });
        }

        const tier = getTierLabel(score);
        const report = await stressReportModel.create({
            student: student._id,
            score,
            tier,
            answers
        });

        // ── Auto-notify assigned faculty/counselor if score is HIGH or SEVERE (>= 4) ──
        if (score >= 4 && student.assignedCounselor) {
            const rollNumber = student.details?.rollNumber || 'N/A';
            const mobile = student.details?.mobile || 'N/A';
            await notificationModel.create({
                recipient: student.assignedCounselor,
                sender: student._id,
                type: 'alert',
                title: `⚠️ High Stress Alert: ${student.username}`,
                message: `Student ${student.username} (Roll No: ${rollNumber}) has reported a stress score of ${score.toFixed(1)}/5.0 (${tier}). Please consider reaching out. Mobile: ${mobile}`,
                details: {
                    studentId: student._id,
                    score,
                    tier,
                    rollNumber,
                    mobile,
                    reportDate: new Date().toLocaleDateString()
                }
            });
        }

        res.json({ success: true, report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving stress report' });
    }
});

// GET /api/stress-reports/my — Student fetches their own reports
router.get('/my', isLoggedIn, async (req, res) => {
    try {
        const reports = await stressReportModel
            .find({ student: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, reports });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

// GET /api/stress-reports/student/:studentId — Faculty fetches a specific student's reports
router.get('/student/:studentId', isLoggedIn, async (req, res) => {
    try {
        const faculty = await userModel.findById(req.user.id);
        if (!faculty || !['faculty', 'counselor', 'hod'].includes(faculty.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const reports = await stressReportModel
            .find({ student: req.params.studentId })
            .sort({ createdAt: -1 });
        res.json({ success: true, reports });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student reports' });
    }
});

// GET /api/stress-reports/faculty/summary — Faculty gets all counselees with latest score
router.get('/faculty/summary', isLoggedIn, async (req, res) => {
    try {
        const faculty = await userModel
            .findById(req.user.id)
            .populate('counselees', '-password');

        if (!faculty || !['faculty', 'counselor', 'hod'].includes(faculty.role)) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const summary = await Promise.all(
            faculty.counselees.map(async (student) => {
                const latest = await stressReportModel
                    .findOne({ student: student._id })
                    .sort({ createdAt: -1 });
                return {
                    student,
                    latestReport: latest || null
                };
            })
        );

        res.json({ success: true, summary });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching faculty summary' });
    }
});

module.exports = router;
