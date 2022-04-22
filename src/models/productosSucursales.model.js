
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var productosSucursalSchema = Schema({
    NombreProductoSucursal: String,
    StockSucursal: Number,
    Vendido: Number,
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'usuarios'},
    idSucursal: { type: Schema.Types.ObjectId, ref: 'sucursales'}

})

module.exports=mongoose.model('productosSucursal',productosSucursalSchema)
