
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var productosEmpresaSchema = Schema({
    NombreProducto: String,
    descripcion: String,
    NombreProveedor: String,
    Stock: Number,
    vendido: Number,
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'usuarios'}
})

module.exports=mongoose.model('productos',productosEmpresaSchema)
