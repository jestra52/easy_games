'use strict';

const User = require('../models/User');

module.exports = {

    /*********************************************************************************
     * Web service: Log in with a given username and password
     * URI: /auth/login
     * Method: POST
     */
    login: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        res.status(200).send({
            authenticated: true,
            authenticationStatus: 'successful',
            authenticatedAs: req.user.username,
            userID: req.user._id
        });
    },

    /*********************************************************************************
     * Web service: Log out of the current session
     * URI: /auth/logout
     * Method: GET
     */
    logout: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        req.session.destroy(() => {
            res.status(200).send({
                session_closed: true,
                logoutStatus: 'successful'
            });
        });
    },
    
    /*********************************************************************************
     * URI: /auth/failure
     * Method: GET
     */
    failure: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        
        res.status(400).send({
            error: true,
            authenticationStatus: 'failed',
        });
    },

    /*********************************************************************************
     * Web service: Verify users
     * Method: GET
     */
    localStrategy: (username, password, done) => {
        var userObj = {
            username: username,
            password: password
        };

        User.findOne(userObj, (err, userData) => {
            if (err) 
                return done(err); 

            if (!userData) 
                return done(null, false, { auth_error: true, message: 'Incorrect username' });
            
            if (userData.password != password) 
                return done(null, false, { auth_error: true, message: 'Incorrect password' });

            return done(null, userData);
        });
    },
    
    /*********************************************************************************
     * Web service: Create or read a new user with a Google account
     * URI: /auth/google
     * Method: GET
     */
    googleStrategy: (req, accessToken, refreshToken, profile, done) => {
        User.findOne({'googleProfile.googleid': profile.id}, (err, user) => {
            if (err)
                throw err;
            if (user) {
                return done(null, user);
            }
            else {
                // Setting actual time
                var date   = new Date();
                var offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);

                // Preparing Google data to save in DB
                var newUser = new User();
                newUser.googleProfile.googleid   = profile.id;
                newUser.googleProfile.token      = accessToken;
                newUser.googleProfile.email      = profile.email;
                newUser.googleProfile.name       = profile.displayName;
                newUser.googleProfile.gender     = profile.gender;
                newUser.googleProfile.profileurl = profile._json.url;
                newUser.googleProfile.language   = profile.language;
                newUser.createdAt                = date.toISOString();
                newUser.updatedAt                = date.toISOString();

                newUser.save((err, newUser) => {
                    if (err)
                        throw err;

                    req.login(newUser, (errL) => {
                        if (errL) return res.status(500).send({
                            message: 'Error login new user: ' + errL
                        });
    
                        return done(null, newUser);
                    });
                });
            }
        });
    },

    /*********************************************************************************
     * Web service: Create or read a new user with a Facebook account
     * URI: /auth/facebook
     * Method: GET
     */
    facebookStrategy: (accessToken, refreshToken, profile, done) => {
        User.findOne({ 'facebookProfile.fbid': profile.id }, (err, user) => {
            if (err)
                throw err;
            if (user)
                return done(null, user);
            else {
                // Setting actual time
                var date   = new Date();
                var offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);

                // Preparing Facebook data to save in DB
                var newUser = new User();
                newUser.facebookProfile.fbid       = profile.id;
                newUser.facebookProfile.token      = accessToken;
                newUser.facebookProfile.name       = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebookProfile.gender     = profile.gender;
                newUser.facebookProfile.profileurl = profile.profileUrl;
                newUser.createdAt                  = date.toISOString();
                newUser.updatedAt                  = date.toISOString();

                newUser.save((err, newUser) => {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            }
        });
    }
    
};
