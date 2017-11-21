'use strict';

const apiRouter = require('express').Router();
const passport  = require('passport');

/*********************************************************************************
 * API CONTROLLERS
 */
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const services       = require('../services');

// Index route
apiRouter.get('/', (req, res) => {
    res.render('index', { title: 'API IS WORKING!'});
});

// Middlewares to verify user
apiRouter.all('/user/read', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 401,
            authorized: false,
            message: 'Unauthorized'
        });
    }

    next();
});

apiRouter.all('/user/update', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 401,
            authorized: false,
            message: 'Unauthorized'
        });
    }

    next();
});

apiRouter.all('/user/delete', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 401,
            authorized: false,
            message: 'Unauthorized'
        });
    }

    next();
});

// Middlewares to verify user
apiRouter.all('/user/addFavGame', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 401,
            authorized: false,
            message: 'Unauthorized'
        });
    }

    next();
});

// Middlewares to verify user
apiRouter.all('/user/deleteFavGame', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 401,
            authorized: false,
            message: 'Unauthorized'
        });
    }

    next();
});
//

/*********************************************************************************
 * USER ROUTES
 */
apiRouter.post('/user/create', userController.create);
apiRouter.get('/user/read', userController.read);
apiRouter.post('/user/update', userController.update);
apiRouter.delete('/user/delete', userController.delete);
apiRouter.post('/user/addFavGame', userController.createNewFavGame);
apiRouter.post('/user/deleteFavGame', userController.deleteFavGame);

/*********************************************************************************
 * GAME ROUTES
 */
apiRouter.post('/game/create', gameController.saveGame);
apiRouter.get('/game/:gameID', gameController.getGame);
apiRouter.put('/game/update/:gameID', gameController.updateGame);
apiRouter.delete('/game/delete/:gameID', gameController.deleteGame);
apiRouter.get('/externalgames', gameController.externalgames);

module.exports = apiRouter;
