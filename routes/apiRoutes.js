'use strict';

const apiRouter = require('express').Router();
const passport  = require('passport');

/*********************************************************************************
 * API CONTROLLERS
 */
const userController = require('../controllers/userController');
const services       = require('../services');

// Index route
apiRouter.get('/', (req, res) => {
    res.send('API ROUTER IS WORKING!');
});

// Middlewares to verify user
apiRouter.all('/user/read', (req, res, next) => {
    if (!req.user) {
        return res.status(400).send('Unauthorized');
    }

    next();
});

apiRouter.all('/user/update', (req, res, next) => {
    if (!req.user) {
        return res.status(400).send('Unauthorized');
    }

    next();
});

apiRouter.all('/user/delete', (req, res, next) => {
    if (!req.user) {
        return res.status(400).send('Unauthorized');
    }

    next();
});
//

/*********************************************************************************
 * USER ROUTES
 */
apiRouter.post('/user/create', userController.create);
apiRouter.get('/user/read', userController.read);
apiRouter.put('/user/update', userController.update);
apiRouter.delete('/user/delete', userController.delete);

module.exports = apiRouter;
