'use strict';

const User = require('../models/User');

module.exports = {
    localStrategy: (username, password, done) => {
        var userObj = {
            username: username,
            password: password
        };

        User.findOne(userObj, (err, userData) => {
            if (err) 
                return done(err); 

            if (!userData) 
                return done(null, false, { message: 'Incorrect username' });
            
            if (userData.password != password) 
                return done(null, false, { message: 'Incorrect password' });

            return done(null, userData);
        });
    },

    // Google SSO query function
    googleStrategyFunction: (req, accessToken, refreshToken, profile, done) => {
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

                var newUser = new User();
                newUser.googleProfile.googleid   = profile.id;
                newUser.googleProfile.token      = accessToken;
                newUser.googleProfile.email      = profile.email;
                newUser.googleProfile.name       = profile.displayName;
                newUser.googleProfile.gender     = profile.gender;
                newUser.googleProfile.profileurl = profile._json.url;
                newUser.googleProfile.language   = profile.language;
                newUser.createdAt    = date.toISOString();
                newUser.updatedAt    = date.toISOString();

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
    } 
};
