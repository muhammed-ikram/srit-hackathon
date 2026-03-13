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
    password: hashedPassword
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
    maxAge: 24 * 60 * 60 * 1000
  });
  res.status(201).json({ success: true });
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
    maxAge: 1000 * 60 * 60 * 24
  });

  // Send login email
  sendLoginEmail(user.email, user.username);

  res.status(201).json({ success: true });
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
      maxAge: 1000 * 60 * 60 * 24
    });

    res.redirect("http://localhost:5173/home");
  }
);


router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

router.get('/me', isLoggedIn, async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json(user);
});

module.exports = router;