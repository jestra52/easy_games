'use strict';

const Game     = require('../models/Game');
const services = require('../services');

module.exports = {

    /*********************************************************************************
     * Web service: Create a new game
     * URI: /api/game
     * Method: POST
     */
    saveGame: (req, res) => {
        let game = new Game();
        game.name = req.body.name;
        game.picture = req.body.picture;
        game.price = req.body.price;
        game.link = req.body.link;
      
        game.save(function(err, gameStored) {
            if (err) res.status(500).send({
                message: "Error saving game: " + err
            });

            res.status(200).send({
                game: gameStored
            });
        });
    },

    /*********************************************************************************
     * Web service: Get game by its ID
     * URI: /api/game/:gameID
     * Method: GET
     */
    getGame: (req, res) => {
        let gameID = req.params.gameID;
        
        Game.findById(gameID, function(err, game) {
            if (err) return res.status(500).send({
                message: 'Error getting game: ' + err
            });

            if (!game) return res.status(404).send({
                message: 'The game does not exist'
            });

            res.status(200).send({
                game: game
            });
        });
    },

    /*********************************************************************************
     * Web service: Update game by its ID
     * URI: /api/game/update/:gameID
     * Method: PUT
     */
    updateGame: (req, res) => {
        let gameID = req.params.gameID;
        let update = req.body;
      
        Game.findByIdAndUpdate(gameID, update, (err, gameUpdated) => {
            if (err) res.status(500).send({
                message: "Error updating game:" + err
            });

            if (!gameUpdated) return res.status(404).send({
                message: 'The game does not exist'
            });
        
            res.status(200).send({
                gameUpdated: gameUpdated
          });
        });
    },

    /*********************************************************************************
     * Web service: Delete game by its ID
     * URI: /api/game/delete/:gameID
     * Method: DELETE
     */
    deleteGame: (req, res) => {
        let gameID = req.params.gameID
        
        Game.findById(gameID, (err, game) => {
            if (err) res.status(500).send({
                message: "Error removing game: " + err
            });

            if (!game) return res.status(404).send({
                message: 'The game does not exist'
            });

            game.remove((errG) => {
                if (errG) res.status(500).send({
                    message: "Error removing game: " + errG
                });

                res.status(200).send({
                    message: 'The game has been deleted'
                });
            });
        });
    },

    /*********************************************************************************
     * Web service: Get external games from our robot
     * URI: /api/externalgames
     * Method: GET
     */
    externalgames: (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");

        services.dexiiogames((data) => {
            if (data == undefined) {
                res.status(200).send({
                    message: 'There is no data to show'
                });
            }
            else {
                var cleanData = [];
                
                for (var i = 0; i < data.length; i++) {
                    var result = {
                        name: data[i][0],
                        image: data[i][1],
                        link: 'https://www.g2a.com' + data[i][2],
                        price: data[i][3]
                    };
    
                    cleanData.push(result);
                }
    
                res.send(cleanData);
            }
        });
    }

};
