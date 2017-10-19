'use strict';

const request = require('request');

module.exports = {
    steamProfile: (steamKey, steamID, callback) => {
        var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamID;
        
        request.get(url, (err, response, body) => {
            if (err) return callback(err);

            var result = JSON.parse(body);
    
            return callback(result.response.players[0]);
        });
    }
};
