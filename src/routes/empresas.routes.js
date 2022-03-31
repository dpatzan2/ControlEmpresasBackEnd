const express = require('express');
const empleadoController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/empresas', empleadoController.ObtenerUsuarios),
app.post('/login', empleadoController.Login);
app.post('/agregarEmpresa', empleadoController.RegistrarEmpresas);
app.post('/agregarEmpresaAdmin', empleadoController.AgregarEmpresasDesdeAdmin);
app.put('/editarEmpresa/:idUsuario', empleadoController.EditarUsuarios);
app.delete('/eliminarEmpresa/:idUsuario', empleadoController.EliminarUsuarios);

module.exports = app;