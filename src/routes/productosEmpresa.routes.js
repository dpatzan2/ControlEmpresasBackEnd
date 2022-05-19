const express = require('express');
const productosEmpresaController = require('../controllers/productosEmpresa.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/prodcutosEmpresa/:idEmpresa?', md_autentificacion.Auth, productosEmpresaController.ObtenerProductosEmpresa),
app.get('/prodcutosEmpresaId/:idProducto?', md_autentificacion.Auth, productosEmpresaController.obtenerProductoPorId),
app.post('/agregarProductoEmpresa', md_autentificacion.Auth, productosEmpresaController.agregarProductoEmpresa)
app.delete('/eliminarProductoEmpresa/:idProducto', md_autentificacion.Auth, productosEmpresaController.EliminarProductoEmpresa)
app.put('/editarProductoEmpresa/:idProducto?', md_autentificacion.Auth, productosEmpresaController.EditarProductoEmpresa)

// buscar por nombre
app.get('/obtenerPNombre/:nombreProducto', md_autentificacion.Auth, productosEmpresaController.buscarPorNombre)
// buscar productos por proveedor
app.get('/obtenerProveedor/:nombreProveedor', md_autentificacion.Auth, productosEmpresaController.obtenerProveedor)

//buscar por stock
app.get('/obtenerStockEmpresa/:idEmpresa', md_autentificacion.Auth, productosEmpresaController.buscarPorStockMayorAMenor)
app.get('/obtenerStockEmpresaM/:idEmpresa', md_autentificacion.Auth, productosEmpresaController.buscarPorStockMenorAMayor)

module.exports = app;