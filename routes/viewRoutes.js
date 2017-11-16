'use strict';

const viewRouter = require('express').Router();

viewRouter.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign up' });
});

module.exports = viewRouter;
