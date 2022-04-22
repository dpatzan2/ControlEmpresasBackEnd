const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

//OBTENER SUCURSALES
app.get('/sucursales/:idSucursal?', md_autentificacion.Auth,sucursalesController.ObtenerSucursales),

//AGREGAR SUCURSALES
app.post('/agregarSucursales', md_autentificacion.Auth,sucursalesController.AgregarSucursales),

//EDITAR SUCURSALES
app.put('/editarSucursales/:idSucursal', md_autentificacion.Auth,sucursalesController.EditarSucursales),

//ELIMINAR SUCURSALES
app.delete('/eliminarSucursales/:idSucursal', md_autentificacion.Auth,sucursalesController.EliminarSucursales),


app.get('/sucursalId/:id',md_autentificacion.Auth, sucursalesController.ObtenerSucursalesId),

module.exports = app;