const express = require('express');
const productosSucursalController = require('../controllers/productosSucursales.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/productosSucursal/:idSucursal?', md_autentificacion.Auth, productosSucursalController.ObtenerProductosSucursales),
app.post('/agregarProductoSucursal', md_autentificacion.Auth, productosSucursalController.agregarProductoSucursales)
app.delete('/eliminarProductoSucursal/:idProductoSucursal', md_autentificacion.Auth, productosSucursalController.EliminarProductoSucursales)

app.put('/venderProductosSucursal/:idSucursal', md_autentificacion.Auth, productosSucursalController.VenderProductosSucursales),

//buscar por stock
app.get('/obtenerStock/:idSucursal', md_autentificacion.Auth, productosSucursalController.buscarPorStockMayorAMenor)
app.get('/obtenerStockM/:idSucursal', md_autentificacion.Auth, productosSucursalController.buscarPorStockMenorAMayor)


// buscar por nombre
app.get('/buscarSucursalPNombre/:nombreProducto', md_autentificacion.Auth, productosSucursalController.buscarPorNombre)


module.exports = app;