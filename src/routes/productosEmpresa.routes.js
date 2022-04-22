const express = require('express');
const productosEmpresaController = require('../controllers/productosEmpresa.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/prodcutosEmpresa/:idEmpresa?', md_autentificacion.Auth, productosEmpresaController.ObtenerProductosEmpresa),
app.get('/prodcutosEmpresaId/:idProducto?', md_autentificacion.Auth, productosEmpresaController.obtenerProductoPorId),
app.post('/agregarProductoEmpresa', md_autentificacion.Auth, productosEmpresaController.agregarProductoEmpresa)
app.delete('/eliminarProductoEmpresa/:idProducto', md_autentificacion.Auth, productosEmpresaController.EliminarProductoEmpresa)
app.put('/editarProductoEmpresa/:idProducto?', md_autentificacion.Auth, productosEmpresaController.EditarProductoEmpresa)

module.exports = app;