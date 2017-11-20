'use strict';

const viewRouter = require('express').Router();
const axios      = require('axios');

viewRouter.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign up' });
});

viewRouter.get('/games', (req, res) => {
    axios.get('http://127.0.0.1:3001/api/externalgames').then(response => {
        //console.log(response.data);
        res.render('games', {data: response.data});
    });
});

viewRouter.get('/signin', (req, res) => {
    res.render('login', {title: 'Inicia sesión'});
});


module.exports = viewRouter;
