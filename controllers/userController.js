'use strict';

const User     = require('../models/User');
const services = require('../services');
const steamKey = require('../config/config').steamAPIKey;

module.exports = {

    /*********************************************************************************
     * Web service: Create a new user
     * URI: /api/user/create
     * Method: POST
     */
    create: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        User.findOne({username: req.body.username}, (errF, userFound) => {
            if (errF)
                throw errF;
            if (userFound) {
                return res.status(409).send({
                    message: 'Username ' + userFound.username + ' is already created'
                });
            }
            else {
                // Creating schema
                var userToCreate  = new User();
        
                // Setting actual time
                var date   = new Date();
                var offset = date.getTimezoneOffset();
                date.setMinutes(date.getMinutes() - offset);
        
                // Setting schema attributes
                var protomatch = /^(https?|ftp):\/\//; 
                var steamProfile = req.body.steamProfile;
                var cleanUrl = steamProfile.replace(protomatch, '');
                var steamID = cleanUrl.split('/')[2];

                services.steamProfile(steamKey, steamID, (steamProfileData) => {
                    userToCreate.username     = req.body.username;
                    userToCreate.email        = req.body.email;
                    userToCreate.password     = req.body.password;
                    userToCreate.firstName    = req.body.firstName;
                    userToCreate.lastName     = req.body.lastName;
                    userToCreate.birth        = new Date(req.body.birth).toISOString();
                    userToCreate.gender       = req.body.gender;
                    userToCreate.steamProfile = steamProfileData;
                    userToCreate.createdAt    = date.toISOString();
                    userToCreate.updatedAt    = date.toISOString();
                    // Saving new schema in MongoDB
                    userToCreate.save((err, userStored) => {
                        if (err) return res.status(500).send({
                            message: 'Error creating user: ' + err
                        });

                        req.login(userStored, (errL) => {
                            if (errL) return res.status(500).send({
                                message: 'Error login new user: ' + errL
                            });

                            return res.status(200).send({ userStored: userStored });
                        });
                    });
                });
            }
        });    
    },

    /*********************************************************************************
     * Web service: Get the data of the current user (actual session)
     * URI: /api/user
     * Method: GET
     */
    read: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        // User from passport session
        var userID = req.user._id; 
        // Getting user info
        User.findById(userID, (err, userData) => {
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

            return res.status(200).send(userData);
        });
    },

    /*********************************************************************************
     * Web service: Update the data of the current user (actual session)
     * URI: /api/user/update
     * Method: PUT
     */
    update: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        // User from passport session
        var userID = req.user._id; 

        // Setting actual time
        var date   = new Date();
        var offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);

        // Data to update
        var dataToUpdate = req.body;
        var steamID      = "";

        if (dataToUpdate.birth) {
            dataToUpdate.birth = new Date(req.body.birth).toISOString();
        }

        if (dataToUpdate.steamProfile) {
            var protomatch   = /^(https?|ftp):\/\//; 
            var steamProfile = req.body.steamProfile;
            var cleanUrl     = steamProfile.replace(protomatch, '');
            steamID          = cleanUrl.split('/')[2];
        }
        
        services.steamProfile(steamKey, steamID, (steamProfileData) => {
            dataToUpdate.steamProfile = steamProfileData;
            dataToUpdate.updatedAt    = date.toISOString();
            
            User.findByIdAndUpdate(userID, dataToUpdate, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error updating user: ' + err
                    });
                }
    
                if (!userUpdated) {
                    return res.status(400).send({
                        message: 'The user does not exist'
                    });
                }
    
                return res.status(200).send({ userUpdated: {id: userUpdated._id, params_updated: dataToUpdate} });
            });
        });
    },

    /*********************************************************************************
     * Web service: Delete the current user (actual session)
     * URI: /api/user/delete
     * Method: DELETE
     */
    delete: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        
        // User from passport session
        var userID = req.user._id; 
        // Getting user info to delete
        User.findById(userID, (err, userToDelete) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error removing user: ' + err
                });
            } 

            if (!userToDelete) {
                return res.status(400).send({
                    message: 'The user does not exist'
                });
            }

            // Removing user
            userToDelete.remove((errD) => {
                if (errD) {
                    return res.status(500).send({
                        message: 'Error removing user: ' + errD
                    });
                } 

                req.session.destroy((errS) => {
                    if (errS) {
                        return res.status(500).send({
                            message: 'Error destroying user session: ' + errS
                        });
                    }

                    return res.status(200).send({
                        message: 'The user has been deleted',
                        userToDelete: userToDelete
                    });
                });
            });
        });
    }

};
