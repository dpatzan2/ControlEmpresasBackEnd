const Productos = require('../models/productosEmpresa.model')


function ObtenerProductosEmpresa(req, res) {

    var idEmpre = req.params.idEmpresa;
    if (req.user.rol == 'Empresa') {
        Productos.find({ idEmpresa: req.user.sub }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    } else if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Productos.find({ idEmpresa: idEmpre }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    }

}

function obtenerProductoPorId(req, res) {
    var idProd = req.params.idProducto;
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        return res.status(500).send({ message: 'No tiene permisos sobre esta empresa' });
    } else {
        Productos.findById({ _id: idProd }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send({ message: 'Esta empresa no tiene productos registrados ' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    }
}


function agregarProductoEmpresa(req, res) {
    var parametros = req.body;
    //console.log(parametros);
    var ProductosEmpresaModelo = new Productos();
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        return res.status(500).send({ message: 'Un administrador no puede realizar esta acción' });
    } else {
        if (parametros.NombreProducto && parametros.descripcion && parametros.NombreProveedor) {
            ProductosEmpresaModelo.NombreProducto = parametros.NombreProducto;
            ProductosEmpresaModelo.descripcion = parametros.descripcion;
            ProductosEmpresaModelo.NombreProveedor = parametros.NombreProveedor;
            if (parametros.Stock == 0) {
                ProductosEmpresaModelo.Stock = 0;
            } else {
                ProductosEmpresaModelo.Stock = parametros.Stock;
            }

            ProductosEmpresaModelo.idEmpresa = req.user.sub;

            Productos.find({ NombreProducto: parametros.NombreProducto, idEmpresa: req.user.sub }, (err, productoEncontrado) => {
                if (productoEncontrado == 0) {
                    ProductosEmpresaModelo.save((err, ProductoGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!ProductoGuardado) return res.status(404).send({ message: 'No se encontraron productos para esta empresa' });
                        //console.log(productoEncontrado)
                        return res.status(200).send({ Productos: ProductoGuardado });
                    });
                } else {
                    return res.status(500).send({ message: 'Este producto existe' })
                }
            });

        } else {
            //console.log('no se guarda')
            return res.status(500).send({ message: 'Error en la peticion' });
        }
    }

}

function EditarProductoEmpresa(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        //console.log(parametros.NombreProducto)
         
        Productos.findOne({ _id: idProd, idEmpresa: req.user.sub }, (err, productoExistente) => {

            //console.log(productoExistente.NombreProducto)

            Productos.findOne({ NombreProducto: parametros.NombreProducto, idEmpresa: req.user.sub }, (err, productoEncontrado) => {

                
                if( productoExistente.NombreProducto == parametros.NombreProducto){
                    //console.log( 'Edita el producto porque es lo mismo')
                    Productos.findOneAndUpdate({ _id: idProd, idEmpresa: req.user.sub }, parametros, (err, usuarioEditado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!usuarioEditado) return res.status(404).send({ message: 'No se puede editar un producto que no le perteneza' });
                
                        
                        return res.status(200).send({ usuarios: usuarioEditado });
                    })

                }else{
                    if(productoEncontrado == null){//EDITA EL PRODUCTO QU ENO ESTA EN LA DB 
                        //console.log( 'Edita porque el producto no esta en la DB')
                        Productos.findOneAndUpdate({ _id: idProd, idEmpresa: req.user.sub }, parametros, (err, usuarioEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' });
                            if (!usuarioEditado) return res.status(404).send({ message: 'No se puede editar un producto que no le perteneza' });
                    
                            
                            return res.status(200).send({ usuarios: usuarioEditado });
                        })
                    }else{

                        return res.status(500).send({ message: "El nombre del producto ya existe" });

                    }

                }
            });
        });          




    } else if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Productos.findByIdAndUpdate({ _id: idProd }, parametros, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send({ message: 'Esta empresa no tiene productos registrados ' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    }

}

function EliminarProductoEmpresa(req, res) {
    var idProd = req.params.idProducto;
    if (req.user.rol == 'Empresa') {
        Productos.findOneAndDelete({ _id: idProd, idEmpresa: req.user.sub }, (err, usuarioEliminado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!usuarioEliminado) return res.status(404).send({ message: 'No se puede eliminar un producto que no le perteneza' });

            return res.status(200).send({ usuarios: usuarioEliminado });
        })
    } else if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Productos.findByIdAndDelete({ _id: idProd }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send({ message: 'Esta empresa no tiene productos registrados ' });

            return res.status(200).send({ producto: productoEncontrado });
        });
    }
}

function buscarPorNombre(req, res) {
    var nombreProducto = req.params.nombreProducto;
    if (req.user.rol == 'Empresa') {
        Productos.find({ NombreProducto: { $regex: nombreProducto, $options: ['i', 'x'] } }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!productoEncontrado) return res.status(404).send({ message: "Error, no se encuentran productos con ese nombre" });
            return res.status(200).send({ productos: productoEncontrado });
        })
    } else {
        return res.status(500).send({ message: "No puede acceder como administrador" });
    }
}

function obtenerProveedor(req, res) {
    var nombreProveedor = req.params.nombreProveedor;
    if (req.user.rol == 'Empresa') {
        Productos.find({ NombreProveedor: { $regex: nombreProveedor, $options: ['i', 'x'] } }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!productoEncontrado) return res.status(404).send({ message: "Error, no se encuentran productos con ese nombre" });
            return res.status(200).send({ productos: productoEncontrado });
        })
    } else {
        return res.status(500).send({ message: "No puede acceder como administrador" });
    }

}

function buscarPorStockMenorAMayor(req,res){
    var idEmpresa = req.params.idEmpresa;
    //console.log(idEmpresa);
    //console.log(req.user.sub)
    Productos.find({idEmpresa: req.user.sub, idEmpresa: idEmpresa},(err,productoVendido) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" });
        if (!productoVendido) return res.status(500).send({ message: 'Error al encontrar producto vendido' });
        if (productoVendido.length==0) return res.status(500).send({ message: 'No existen productos en la empresa', informacion: 'Debe agregar productos' });

        //console.log(productoVendido)
        return res.status(200).send({menorMayor: productoVendido})
    }).sort({
        Stock : 1
    })
}
function buscarPorStockMayorAMenor(req,res){
    var idEmpresa = req.params.idEmpresa;
    Productos.find({idEmpresa: req.user.sub, idEmpresa: idEmpresa},(err,productoVendido) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" });
        if (!productoVendido) return res.status(500).send({ message: 'Error al encontrar producto vendido' });
        if (productoVendido.length==0) return res.status(500).send({ message: 'No existen productos en la empresa', informacion: 'Debe agregar productos' });

        return res.status(200).send({mayorMenor: productoVendido})
    }).sort({
        Stock : -1
    })
}

module.exports = {
    ObtenerProductosEmpresa,
    agregarProductoEmpresa,
    EliminarProductoEmpresa,
    EditarProductoEmpresa,
    obtenerProductoPorId,
    buscarPorNombre,
    obtenerProveedor,
    buscarPorStockMenorAMayor,
    buscarPorStockMayorAMenor
}