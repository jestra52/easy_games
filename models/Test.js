'use strict';

const mongoose  = require('mongoose');

var TestSchema = new mongoose.Schema({
    test: String
});

module.exports = mongoose.model('tests', TestSchema);
