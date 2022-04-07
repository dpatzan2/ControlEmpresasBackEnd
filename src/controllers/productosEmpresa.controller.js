const Productos =  require('../models/productosEmpresa.model')


function ObtenerProductosEmpresa(req, res) {

    var idEmpre = req.params.idEmpresa;
    if(req.user.rol == 'Empresa'){
        Productos.find({idEmpresa: req.user.sub}, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send( { mensaje: 'Esta empresa no tiene productos registrados aun' });
    
            return res.status(200).send({ producto: productoEncontrado });
        });
    }else if(req.user.rol == 'ROL_ADMINISTRADOR'){
        Productos.findOne({idEmpresa: idEmpre}, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send( { mensaje: 'Esta empresa no tiene productos registrados aun' });
    
            return res.status(200).send({ producto: productoEncontrado });
        });
    }
    
}


function agregarProductoEmpresa(req, res){
    var parametros = req.body;
    var ProductosEmpresaModelo = new Productos();
    if(parametros.NombreProducto && parametros.descripcion && parametros.NombreProveedor && parametros.Stock){
        ProductosEmpresaModelo.NombreProducto = parametros.NombreProducto;
        ProductosEmpresaModelo.descripcion = parametros.descripcion;
        ProductosEmpresaModelo.NombreProveedor = parametros.NombreProveedor;
        ProductosEmpresaModelo.Stock = parametros.Stock;
        if(parametros.vendido){
            ProductosEmpresaModelo.vendido = parametros.vendido;
        }else{
            ProductosEmpresaModelo.vendido = 0
        }
        ProductosEmpresaModelo.idEmpresa = req.user.sub;
        Productos.find({NombreProducto: parametros.NombreProducto, idEmpresa: req.user.sub}, (err, productoEncontrado)=>{
            if(productoEncontrado == 0  ) {
                ProductosEmpresaModelo.save((err, ProductoGuardado)=>{
                    if(err) return res.status(500).send({message: 'Error en la peticion'});
                    if(!ProductoGuardado) return res.status(404).send({message: 'No se encontraron productos para esta empresa'});
                   console.log(productoEncontrado)
                    return res.status(200).send({Productos: ProductoGuardado});
                });
            }else{
                return res.status(500).send({Message: 'Este producto existe'})
            }
        });
        
    } else{
        console.log('no se guarda')
        return res.status(500).send({message: 'Error en la peticion'});
    }
}

function EditarProductoEmpresa(req, res){
    var idProd = req.params.idProducto;
    var parametros = req.body;
    if(req.user.rol == 'Empresa'){
        Productos.findOneAndUpdate({_id: idProd, idEmpresa: req.user.sub}, parametros, (err, usuarioEliminado)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEliminado) return res.status(404).send({message: 'No se puede editar un producto que no te perteneza'});
    
            return res.status(200).send({usuarios: usuarioEliminado});
        })
    }else if(req.user.rol == 'ROL_ADMINISTRADOR'){
        Productos.findByIdAndUpdate({_id: idProd}, parametros,(err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send( { mensaje: 'Esta empresa no tiene productos registrados aun' });
    
            return res.status(200).send({ producto: productoEncontrado });
        });
    }

}

function EliminarProductoEmpresa(req, res){
    var idProd = req.params.idProducto;
    if(req.user.rol == 'Empresa'){
        Productos.findOneAndDelete({_id: idProd, idEmpresa: req.user.sub}, (err, usuarioEliminado)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!usuarioEliminado) return res.status(404).send({message: 'No se puede eliminar un producto que no te perteneza'});
    
            return res.status(200).send({usuarios: usuarioEliminado});
        })
    }else if(req.user.rol == 'ROL_ADMINISTRADOR'){
        Productos.findByIdAndDelete({_id: idProd}, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoEncontrado) return res.status(404).send( { mensaje: 'Esta empresa no tiene productos registrados aun' });
    
            return res.status(200).send({ producto: productoEncontrado });
        });
    }
}

module.exports = {
    ObtenerProductosEmpresa,
    agregarProductoEmpresa,
    EliminarProductoEmpresa,
    EditarProductoEmpresa
}