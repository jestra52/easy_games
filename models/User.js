'use strict';

const mongoose  = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    birth: Date,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('users', UserSchema);
