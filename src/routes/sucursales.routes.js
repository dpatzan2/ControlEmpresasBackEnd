const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/empresas/:idEmpresa', md_autentificacion.Auth,sucursalesController),

module.exports = app;