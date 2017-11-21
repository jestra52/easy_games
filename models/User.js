'use strict';

const mongoose   = require('mongoose');
const GameSchema = require('./Game');
const Game       = new GameSchema().schema;

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    birth: Date,
    gender: String,
    steamProfile: Object,
    wishList: [ Game ],
    googleProfile: {
        googleid: String,
        token: String,
        email: String,
        name: String,
        gender: String,
        profileurl: String,
        language: String
    },
    facebookProfile: {
        fbid: String,
        token: String,
        name: String,
        gender: String,
        profileurl: String
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('user', UserSchema);
