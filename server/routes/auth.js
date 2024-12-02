const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URI || "http://localhost:5000/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value,
        }
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }

        } catch (error) {
            console.log(error);

        }
    }
));

// google auth routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));
// Receive the user data from google and redirect to the home page
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-faulure',
        successRedirect: '/dashboard'
    }));

router.get("/login-failure", (req, res) => {
    res.send("Something Went Wrong Try again later");
});


// presist the user data after successful login
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Destroy the user data after logout
router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send("Error Logging out");
        }else{
            res.redirect('/');
        }
    });
});


// get the user data from the session
passport.deserializeUser(async (id, done) =>{
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
module.exports = router;