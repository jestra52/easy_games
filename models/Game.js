'use strict';

const mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    userOwner: String,
    name: String,
    picture: String,
    price: {
        type: Number,
        default: 0
    },
    link: String
});

module.exports = mongoose.model('game', GameSchema);
