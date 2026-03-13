const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const userModel = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { sendWelcomeEmail, sendLoginEmail } = require('../utils/emailService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const oldUser = await userModel.findOne({ email });
  if (oldUser) {
    return res.json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new userModel({
    username,
    email,
    password: hashedPassword,
    isRegistrationComplete: false
  });
  const token = jwt.sign(
    { email, id: user._id },
    "secretkey"
  );
  await user.save();

  // Send welcome email
  sendWelcomeEmail(email, username);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(201).json({ success: true, isRegistrationComplete: false });
});

router.post('/complete-profile', isLoggedIn, async (req, res) => {
  const { role, details } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  user.details = details;
  user.isRegistrationComplete = true;
  await user.save();

  res.json({ success: true, role: user.role });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalied Credentials" });
  }

  if (user.authProvider === "google") {
    return res.status(400).json({
      message: "Please login using Google"
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalied Credentials" });
  }

  const token = jwt.sign(
    { email, id: user._id },
    "secretkey"
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  // Send login email
  sendLoginEmail(user.email, user.username);

  res.status(201).json({ 
    success: true, 
    isRegistrationComplete: user.isRegistrationComplete,
    role: user.role 
  });
});

//google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/"
  }),
  (req, res) => {
    res.cookie("token", req.user.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    if (!req.user.isRegistrationComplete) {
      res.redirect("http://localhost:5173/register");
    } else {
      // Redirect based on role
      const role = req.user.role;
      const dashboardMap = {
        'student': '/dashboard/student',
        'faculty': '/dashboard/faculty',
        'counselor': '/dashboard/counselor',
        'hod': '/dashboard/hod',
        'librarian': '/dashboard/librarian',
        'lab_technician': '/dashboard/lab-technician',
        'hostel_management': '/dashboard/hostel',
        'admin': '/dashboard/admin'
      };
      res.redirect(`http://localhost:5173${dashboardMap[role] || '/home'}`);
    }
  }
);


router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(null);

  try {
    const data = jwt.verify(token, "secretkey");
    const user = await userModel.findById(data.id);
    res.json(user);
  } catch (err) {
    res.json(null);
  }
});

module.exports = router;