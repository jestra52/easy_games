'use strict';

const request = require('request');
const axios   = require('axios');

module.exports = {

    steamProfile: (steamKey, steamID, callback) => {
        var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamID;
        
        request.get(url, (err, response, body) => {
            if (err) return callback(err);

            var result = JSON.parse(body);
    
            return callback(result.response.players[0]);
        });
    },
    dexiiogames: (callback) => {
        var url = 'https://api.dexi.io/runs/33e98066-4182-485c-89d2-194fcb12fe0e/latest/result';

        axios.get(url, { headers: {
            "X-DexiIO-Access" : 'ea8786b7f235a401857b204940a7fcdd',
            "X-DexiIO-Account" : '85b16cac-e1f7-4a19-ac89-484640bdc306',
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        } }).then((res) => {
            return callback(res.data.row);
        });
    }

};
