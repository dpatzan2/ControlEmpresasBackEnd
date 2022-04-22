
var express = require('express');
const cors = require('cors');
var app = express();

//IMPORTACIONES RUTAS
const rutaEmpresa = require('./src/routes/empresas.routes');
const rutaProductosEmpresa = require('./src/routes/productosEmpresa.routes')
const rutaSucursales = require('./src/routes/sucursales.routes')
const rutaProductosSucursal = require('./src/routes/productosSucursales.routes')


//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CABECERAS
app.use(cors());

//CARGA DE RUTAS se realizaba como localhost:3000/obtenerProductos
app.use('/api', rutaEmpresa, rutaProductosEmpresa,rutaSucursales,rutaProductosSucursal);


module.exports = app; 
