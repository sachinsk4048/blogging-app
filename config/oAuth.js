// config\oAuth.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
require('dotenv').config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_URL
},
    async (accessToken, refreshToken, profile, done) => {

        const email = profile.emails[0].value;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email,
                provider: "google",
                isVerified: true
            });
        }
        done(null,user);
    }
));


module.exports = passport;