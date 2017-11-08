'use strict';

/*********************************************************************************
 * REQUIRES AND VARIABLES
 */
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const session      = require('express-session');
const app          = express();

// Config requires
const config = require('./config/config');

// Routes requires
const apiRoutes  = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');

/*********************************************************************************
 * APP CONFIGURATION
 */
mongoose.Promise = global.Promise;
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'library',
    resave: true,
    saveUninitialized: true,
    proxy: true
}));
app.use(express.static(config.rootPath + '/public'));
app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');
require('./config/passport')(app);

// Routes conf
app.use(config.baseURL + 'api', apiRoutes);
app.use(config.baseURL + 'auth', authRoutes);
app.use(config.baseURL, viewRoutes);

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
var appServer = app.listen(config.port, () => {
    console.log('App server running on http://' + config.ip + ':' + config.port + '');
});

process.on('SIGINT', () => {
    setTimeout(() => {
        appServer.close(() => {
            console.log('App server is stopping...');
            mongoose.connection.close();
            process.exit(0);
        });
    }, 500);
});
