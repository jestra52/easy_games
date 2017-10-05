'use strict';

const normalize = require('normalize-path');

module.exports = {
    ip: '127.0.0.1',
    port: '3000',
    rootPath: normalize(__dirname + '/'),
    app: {
        name: 'easy_games',
    },
    db: 'mongodb://127.0.0.1/easygames'
};
