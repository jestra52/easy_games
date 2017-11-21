'use strict';

const User     = require('../models/User');
const Game     = require('../models/Game');
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
                    error: true,
                    title: 'Registrate',
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
                var steamID = "";
                var wishList = req.body.wishList;
                if (userToCreate.steamProfile) {
                    var protomatch   = /^(https?|ftp):\/\//; 
                    var steamProfile = req.body.steamProfile;
                    var cleanUrl     = steamProfile.replace(protomatch, '');
                    steamID          = cleanUrl.split('/')[2];
                }

                services.steamProfile(steamKey, steamID, (steamProfileData) => {
                    if (wishList) {
                        for (var i = 0; i < wishList.length; i++) {
                            userToCreate.wishList.push(wishList[i]);
                        }
                    }
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
                            success: false,
                            message: 'Error creating user: ' + err
                        });

                        req.login(userStored, (errL) => {
                            if (errL) return res.status(500).send({
                                success: false,
                                message: 'Error login new user: ' + errL
                            });

                            /*return res.status(200).send({
                                success: true, 
                                userStored: userStored
                            });*/

                            return res.status(200).redirect('/');
                        });
                    });
                });
            }
        });    
    },

    createNewFavGame: (req, res) => {

        // Setting actual time
        var date   = new Date();
        var offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);

        User.findById(req.user._id, (err, userData) => {
            var game = new Game();

            game.userOwner = userData._id;
            game.name      = req.body.name;
            game.picture   = req.body.picture;
            game.price     = parseFloat(req.body.price.replace(/[^0-9\.,]/g, ""));
            game.link      = req.body.link;

            Game.findOne({name: game.name}, (errFG, gameData) => {
                if (errFG) return res.status(500).send({
                    message: 'Error saving fav game in user: ' + errFG
                });

                if (gameData && game.userOwner == userData._id) return res.status(409).render({
                    message: 'The user already has this game'
                });

                userData.wishList.push(game);
                
                userData.save((errUS, userStored) => {
                    if (errUS) return res.status(500).send({
                        message: 'Error saving fav game in user: ' + errUS
                    });
    
                    game.save((errG, gameStored) => {
                        if (errG) return res.status(500).send({
                            message: 'Error saving fav game in user: ' + errG
                        });
    
                        return res.status(200).redirect('/');
                    });
                });
            });
        });
    },

    /*********************************************************************************
     * Web service: Get the data of the current user (actual session)
     * URI: /api/user
     * Method: GET
     */
    read: (req, res) => {
        //res.header("Access-Control-Allow-Origin", "*");

        var userAuthenticated = null;
        
        if (req.user) userAuthenticated = req.user;

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

            console.log(Object.keys(userData.googleProfile).length);

            console.log(userData);

            var date = new Date(userData.birth);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var dt = date.getDate();

            return res.status(200).render('userinfo', {
                title: 'Información',
                userAuthenticated: userAuthenticated,
                userData: userData,
                birth: year + '-' + month + '-' + dt
            });
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

        if (dataToUpdate.wishList) {
            User.findById(userID, (err, userData) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error updating user: ' + err
                    });
                }
    
                if (!userData) {
                    return res.status(400).send({
                        success: false,
                        message: 'The user does not exist'
                    });
                }

                for (var i = 0; i < dataToUpdate.wishList.length; i++) {
                    userData.wishList.push(dataToUpdate.wishList[i]);
                }

                dataToUpdate.wishList = userData.wishList;
            });
        }

        services.steamProfile(steamKey, steamID, (steamProfileData) => {
            dataToUpdate.steamProfile = steamProfileData;
            dataToUpdate.updatedAt    = date.toISOString();
                     
            User.findByIdAndUpdate(userID, dataToUpdate, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error updating user: ' + err
                    });
                }
    
                if (!userUpdated) {
                    return res.status(400).send({
                        success: false,
                        message: 'The user does not exist'
                    });
                }
    
                return res.status(200).send({ 
                    success: true,
                    userUpdated: {id: userUpdated._id, params_updated: dataToUpdate} });
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
                    success: false,
                    message: 'Error removing user: ' + err
                });
            } 

            if (!userToDelete) {
                return res.status(400).send({
                    success: false,
                    message: 'The user does not exist'
                });
            }

            // Removing user
            userToDelete.remove((errD) => {
                if (errD) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error removing user: ' + errD
                    });
                } 

                req.session.destroy((errS) => {
                    if (errS) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error destroying user session: ' + errS
                        });
                    }

                    return res.status(200).send({
                        success: true,
                        message: 'The user has been deleted',
                        userToDelete: userToDelete
                    });
                });
            });
        });
    },

    /*********************************************************************************
     * Web service: Delete fav game of the current user (actual session)
     * URI: /api/user/deleteFavGame
     * Method: POST
     */
    deleteFavGame: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        var userAuthenticated = null;
        
        if (req.user) userAuthenticated = req.user;
        
        // User from passport session
        var userID = req.user._id; 
        // Getting user info to delete
        User.update({_id: userID}, { $pull: { 'wishList': { "_id": req.body.gameid } } }, (err, userData) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error removing game: ' + err
                });
            } 

            if (!userData) {
                return res.status(400).send({
                    success: false,
                    message: 'The game does not exist'
                });
            }

            Game.findByIdAndRemove(req.body.gameid, (errG, gameDeleted) => {
                if (errG) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error removing game: ' + errG
                    });
                } 
    
                if (!gameDeleted) {
                    return res.status(400).send({
                        success: false,
                        message: 'The game does not exist'
                    });
                }

                return res.status(200).render('gamedeleted', {
                    userAuthenticated: userAuthenticated,
                    gameDeleted: gameDeleted,
                    userData: userData
                });
            });
        });
    }

};
