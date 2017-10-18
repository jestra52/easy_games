'use strict';

const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    birth: Date,
    steamProfile: Object,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('user', UserSchema);
