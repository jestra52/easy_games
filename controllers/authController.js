'use strict';

const User = require('../models/User');

module.exports = {

    /*********************************************************************************
     * URI: /auth/login
     * Method: POST
     */
    login: (req, res) => {
        res.status(200).send({
            authenticationStatus: 'successful',
            authenticatedAs: req.user.username,
            userID: req.user._id
        });
    },

    /*********************************************************************************
     * URI: /auth/logout
     * Method: GET
     */
    logout: (req, res) => {
        req.session.destroy(() => {
            res.status(200).send({
                logoutStatus: 'successful'
            });
        });
    },
    
    /*********************************************************************************
     * URI: /auth/failure
     * Method: GET
     */
    failure: (req, res) => {
        res.status(400).send({
            authenticationStatus: 'failed',
        });
    }
    
};
