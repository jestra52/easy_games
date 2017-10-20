'use strict';

const authRouter = require('express').Router();
const passport   = require('passport');

/*********************************************************************************
 * AUTH CONTROLLERS
 */
const authController = require('../controllers/authController');

// Index route
authRouter.get('/', (req, res) => {
    res.send('AUTH ROUTER IS WORKING!');
});

// Middlewares to verify user
authRouter.all('/logout', (req, res, next) => {
    if (!req.user) {
        return res.status(400).send('Unauthorized');
    }

    next();
});
//

/*********************************************************************************
 * AUTH ROUTES
 */
// Local auth
authRouter.post('/login', passport.authenticate('local', { 
    failureRedirect: '/auth/failure' 
}), authController.login);
authRouter.get('/failure', authController.failure);
authRouter.get('/logout', authController.logout);

// Google auth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate( 'google', {
    failureRedirect: '/auth/failure'
}), (req, res) =>  {
    res.send( {
        status: 'GOOGLE AUTH SUCCESSFUL!',
        profile: req.session.passport.user
    });
});

// Facebook auth
authRouter.get('/facebook', passport.authenticate('facebook'));
authRouter.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/auth/failure' 
}), (req, res) => {
    req.login(req.session.passport.user, () => {
        res.send( {
            status: 'FACEBOOK AUTH SUCCESSFUL!',
            profile: req.session.passport.user
        });
    });
});

module.exports = authRouter;
