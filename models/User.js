'use strict';

const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    birth: Date,
    gender: String,
    steamProfile: Object,
    googleProfile: {
        googleid: String,
        token: String,
        email: String,
        name: String,
        gender: String,
        profileurl: String,
        language: String
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('user', UserSchema);
