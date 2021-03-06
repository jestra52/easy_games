'use strict';

const normalize = require('normalize-path');

module.exports = {

  ip: '127.0.0.1',
  port: '3001',
  rootPath: normalize(process.cwd()),
  baseURL: '/',
  app: {
    name: 'easy_games',
  },
  db: 'mongodb://127.0.0.1/easygames',
  steamAPIKey: 'D190763820D0D332C6BE435753280A36'

};
