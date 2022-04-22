//ALEJANDRO GARCÍA
const ProductosSucursales = require('../models/productosSucursales.model')
const ProductosEmpresa = require('../models/productosEmpresa.model')
const Sucursales = require('../models/sucursales.model')

function ObtenerProductosSucursales(req, res) {

    var idSuc = req.params.idSucursal;

    if (req.user.rol == 'Empresa') {
        ProductosSucursales.find({ idEmpresa: req.user.sub, idSucursal: idSuc }, (err, productoEncontrado) => {
            if (err || !productoEncontrado) return res.status(404).send({ message: 'La sucursal no posee productos' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    } else {
        return res.status(200).send({ message: 'Solamente la empresa puede ver sus productos de sucursal' });
    }

}


function agregarProductoSucursales(req, res) {
    var parametros = req.body;
    if (req.user.rol != 'Empresa') return res.status(500).send({ message: 'Únicamente las empresas pueden acceder a esta gestión' })
    if (parametros.vendido) return res.status(500).send({ message: "EL campo vendido no se puede agregar" });
    if (parametros.StockSucursal <= 0) return res.status(500).send({ message: "EL stock debe ser mayor a 0. Verifique los datos" })
    if (parametros.NombreProductoSucursal && parametros.StockSucursal && parametros.NombreSucursal
        && parametros.NombreProductoSucursal != "" && parametros.StockSucursal != "" && parametros.NombreSucursal != "") {
        Sucursales.findOne({ nombreSucursal: parametros.NombreSucursal, idEmpresa: req.user.sub }, (err, sucursalEncontrada) => {
            if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
            if (!sucursalEncontrada) return res.status(400).send({ message: 'Esta Sucursal no existe en la empresa. Verifique el nombre' })
            //VERIFICA SI EL PRODUCTO EXISTE EN LA SUCURSAL INDICADA
            ProductosSucursales.findOne({ NombreProductoSucursal: parametros.NombreProductoSucursal, idSucursal: sucursalEncontrada._id }, (err, productoEncontradoSucursal) => {
                if (err) return res.status(404).send({ message: 'Error.Verifique los datos' })
                if (productoEncontradoSucursal == null) {//EL PRODUCTO NO EXISTE EN SUCURSALES Y SE AGREGA NORMAL
                    //VERIFICAR STOCK 
                    ProductosEmpresa.findOne({ NombreProducto: parametros.NombreProductoSucursal, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'Este producto no existe en la empresa. Verifique los datos' })
                        if (parametros.StockSucursal <= 0) return res.status(500).send({ message: 'La cantidad no puede ser menor o igual a cero' });
                        if (productoEmpresaStock.Stock == 0) return res.status(500).send({ message: 'Producto agotado. No es posible agregar el producto a sucursales.' })
                        if (parametros.StockSucursal > productoEmpresaStock.Stock) {//VERIFICAR STOCK
                            return res.status(500).send({ message: 'La cantidad del producto es es mayor al stock. El Stock actual del producto es: ' + productoEmpresaStock.Stock });
                        }
                        var ProductosSucursalModelo = new ProductosSucursales();
                        ProductosSucursalModelo.NombreProductoSucursal = parametros.NombreProductoSucursal;
                        ProductosSucursalModelo.StockSucursal = parametros.StockSucursal;
                        ProductosSucursalModelo.idSucursal = sucursalEncontrada._id;
                        ProductosSucursalModelo.idEmpresa = req.user.sub;
                        //REALIZA EL DESCUENTO EN EL STOCK DE EMPRESA
                        var restarStock = (parametros.StockSucursal * -1)
                        ProductosEmpresa.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'No se encontraron productos para editar en Empresa' });
                            //GUARDA EL NUEVO PRODUCTO DE LA SUCURSAL
                            ProductosSucursalModelo.save((err, ProductoGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!ProductoGuardado) return res.status(404).send({ message: 'No se encontraron productos para almacenar' });
                                return res.status(200).send({ ProductosSucursal: ProductoGuardado });
                            });
                        })

                    })
                } else {//EDITA EL PRODUCTO
                    //RESTAR STOCK DE EMPRESA
                    var restarStock = (parametros.StockSucursal * -1)
                    //VERIFICAR STOCK 
                    ProductosEmpresa.findOne({ NombreProducto: parametros.NombreProductoSucursal, idEmpresa: req.user.sub }, (err, productoEmpresaStock) => {
                        if (err) return res.status(400).send({ message: 'Error. Esta Sucursal no existe. Verifique el nombre' });
                        if (!productoEmpresaStock) return res.status(400).send({ message: 'Este producto no existe en la empresa. Verifique los datos' })
                        if (parametros.StockSucursal <= 0) return res.status(500).send({ message: 'La cantidad no puede ser menor o igual a cero' });
                        if (productoEmpresaStock.Stock == 0) return res.status(500).send({ message: 'Producto agotado. No es posible agregar el producto a sucursales.' })
                        if (parametros.StockSucursal > productoEmpresaStock.Stock) {//VERIFICAR STOCK
                            return res.status(500).send({ message: 'La cantidad del producto es es mayor al stock. El Stock actual del producto es: ' + productoEmpresaStock.Stock });
                        }
                        ProductosEmpresa.findOneAndUpdate({ _id: productoEmpresaStock._id, idEmpresa: req.user.sub }, { $inc: { Stock: restarStock } }, { new: true }, (err, productoEmpresaEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                            if (!productoEmpresaEditado) return res.status(404).send({ message: 'Error. No se encontraron productos para editar en Empresa' });

                            //EDITAR STOCK DE RODUCTO SUCURSAL
                            ProductosSucursales.findOneAndUpdate({ _id: productoEncontradoSucursal._id }, { $inc: { StockSucursal: parametros.StockSucursal } }, { new: true }, (err, productoSucursalEditado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion de editar producto empresa' });
                                if (!productoSucursalEditado) return res.status(404).send({ message: 'No se encontraron productos para editar en sucursal' });
                                return res.status(200).send({ ProductosSucursal: productoSucursalEditado });

                            });
                        })
                    });

                }
            })
        })
    } else {
        return res.status(500).send({ message: 'Ingrese todos los datos necesarios' });
    }
}


function EliminarProductoSucursales(req, res) {

    var idProd = req.params.idProductoSucursal;

    if (req.user.rol == 'Empresa') {
        ProductosSucursales.findOneAndDelete({ _id: idProd, idEmpresa: req.user.sub }, (err, productoSucursalEliminado) => {
            if (err || !productoSucursalEliminado) return res.status(404).send({ message: 'No se puede eliminar un producto que no pertenezca a su usuario' });

            return res.status(200).send({ productos: productoSucursalEliminado });
        })
    } else {
        return res.status(200).send({ message: 'Solamente la empresa puede eliminar sus productos de sucursal' });
    }
}

module.exports = {
    ObtenerProductosSucursales,
    EliminarProductoSucursales,
    agregarProductoSucursales

}