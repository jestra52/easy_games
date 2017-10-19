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

module.exports = authRouter;
