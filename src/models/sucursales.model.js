
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var sucursalesSchema = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    telefono: String,
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'usuarios'}
})

module.exports=mongoose.model('sucursales',sucursalesSchema)
