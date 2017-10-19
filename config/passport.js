'use strict';

const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User           = require('../models/User');

module.exports = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, userData) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error getting user' + err
                });
            }

            if (!userData) {
                return res.status(400).send({
                    message: 'The user does not exist'
                });
            }

            
            return done(null, userData);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        var userObj = {
            username: username,
            password: password
        };

        User.findOne(userObj, (err, userData) => {
            if (err) { 
                return done(err); 
            }

            if (!userData) {
                return done(null, false, { message: 'Incorrect username' });
            }
            
            if (userData.password != password) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, userData);
        });
    }));    

};
