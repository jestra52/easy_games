'use strict';

const api  = require('express').Router();

/*********************************************************************************
 * API CONTROLLERS
 */
const testController = require('./controllers/test');

/*********************************************************************************
 * API ROUTES
 */
api.get('/', testController.index);
api.post('/test/create', testController.create);


module.exports = api;
