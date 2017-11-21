'use strict';

const viewRouter = require('express').Router();
const axios      = require('axios');

viewRouter.get('/', (req, res) => {
    var userAuthenticated = null;

    if (req.user) userAuthenticated = req.user;

    axios.get('http://127.0.0.1:3001/api/externalgames').then(response => {
        //console.log(response.data);
        res.render('index', {
            data: response.data,
            title: 'Easy Games',
            userAuthenticated: userAuthenticated
        });
    });
});

viewRouter.get('/signup', (req, res) => {
    res.render('signup', { title: 'Registrate' });
});
 
viewRouter.get('/signin', (req, res) => {
    res.render('login', {title: 'Inicia sesión'});
});


module.exports = viewRouter;
