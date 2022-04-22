const express = require('express');
const productosSucursalController = require('../controllers/productosSucursales.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/productosSucursal/:idSucursal?', md_autentificacion.Auth, productosSucursalController.ObtenerProductosSucursales),
app.post('/agregarProductoSucursal', md_autentificacion.Auth, productosSucursalController.agregarProductoSucursales)
app.delete('/eliminarProductoSucursal/:idProductoSucursal', md_autentificacion.Auth, productosSucursalController.EliminarProductoSucursales)

module.exports = app;