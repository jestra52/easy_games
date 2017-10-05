'use strict';

const Test = require('../models/Test');

module.exports = {
    /*********************************************************************************
     * URI: /api
     * Method: GET
     */
    index: (req, res) => {
        res.send('API is working');
    },

    /*********************************************************************************
     * URI: /api/test/create
     * Method: POST
     */
    create: (req, res) => {
        // Creating schema
        var testToCreate  = new Test();
        // Setting schema attributes
        testToCreate.test = req.body.test;

        // Saving new schema in MongoDB
        testToCreate.save((err, testStored) => {
            if (err) res.status(500).send({
                message: 'Error creating test: ' + err
            });

            res.status(200).send({ testStored: testStored });
        });
    }
};
