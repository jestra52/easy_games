'use strict';

/*********************************************************************************
 * REQUIRES AND VARIABLES
 */
const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const logger     = require('morgan');
const app        = express();
const api        = require ('./routes');
const config     = require('./config');

/*********************************************************************************
 * APP CONFIGURATION
 */
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api', api);

/*********************************************************************************
 * DATABASE CONFIGURATION
 */
mongoose.connect(config.db, { useMongoClient: true }, (err, res) => {
    if (err) {
        console.error('Error connecting to database');
        throw err;
    }

    var databaseResponse = {
        dbHost: res.host,
        dbPort: res.port,
        dbUserConnected: res.user,
    };
    
    console.log("Connected to database", config.db);
    console.log('Database response', databaseResponse);
});

/*********************************************************************************
 * APP SERVER CONFIGURATION
 */
app.listen(config.port, () => {
    console.info('App running on http://' + config.ip + ':' + config.port + '');
}); 
