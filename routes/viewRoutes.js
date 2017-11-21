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

viewRouter.get('/searchGame', (req, res) => {
    var userAuthenticated = null;
    var buscar            = "";
    
    if (req.user) userAuthenticated = req.user;
    if (req.query.buscar) buscar = req.query.buscar.toUpperCase();

    axios.get('http://127.0.0.1:3001/api/externalgames').then(response => {
        var data = {juegos:[]};
        var regex = new RegExp(buscar + ".*");
        for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].name.toUpperCase().match(regex)) {
                //console.log('JUEGO ENCONTRADO', response.data[i].name);
                data.juegos.push(
                    {dataGame: response.data[i]}
                );
            }
        }
        //res.send(data);
        res.render('searchGames', { 
            data: data.juegos,
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
