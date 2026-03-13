require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
require("./config/passport");
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();
// app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/resources", resourceRoutes);



app.listen(3000, () => {
  console.log("Backend running on port 3000");
});