'use strict';

const passport         = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const GoogleStrategy   = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const authController   = require('../controllers/authController');
const User             = require('../models/User');
const config           = require('./config');

module.exports = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, (err, userData) => {
            if (err) {
                return done(null, {
                    message: 'Error getting user' + err
                });
            }

            if (!userData) {
                return done(null, {
                    message: 'The user does not exist'
                });
            }

            
            return done(null, userData);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, authController.localStrategy ));
    
    // Google SSO strategy
    passport.use(new GoogleStrategy({
        clientID: '1044496185163-66gct90tkp40ssur7m3mj2dam5qelifa.apps.googleusercontent.com',
        clientSecret: '7qdKpdPGdbzGAk70AcJwLW2V',
        callbackURL: 'http://' + config.ip + ':' + config.port + '/auth/google/callback',
        passReqToCallback: true
    }, authController.googleStrategy ));

    // Facebook SSO strategy
    passport.use(new FacebookStrategy({
        clientID: '1761269864166207',
        clientSecret: '3835632caa9cce466e1c7b75293c077a',
        callbackURL: 'http://' + config.ip + ':' + config.port + '/auth/facebook/callback',
        profileFields: [
            'id', 'name', 'email', 'gender', 'link'
        ]
    }, authController.facebookStrategy ));

};
