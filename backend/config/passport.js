const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const { sendWelcomeEmail, sendLoginEmail } = require("../utils/emailService");

const JWT_SECRET = "secretkey";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            username: profile.displayName,
            email,
            authProvider: "google",
            password: null,
            isRegistrationComplete: false
          });
          // Send welcome email for new Google user
          sendWelcomeEmail(email, profile.displayName);
        } else {
          // Send login email for returning Google user
          sendLoginEmail(email, user.username);
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          JWT_SECRET
        );

        done(null, { 
          token, 
          isRegistrationComplete: user.isRegistrationComplete,
          role: user.role 
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
