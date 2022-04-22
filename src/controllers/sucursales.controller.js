// ALEJANDRO JAVIER GARCIA GARCIA
const Sucursales = require('../models/sucursales.model')

function ObtenerSucursales(req, res) {
    idEmp = req.params.idSucursal;
    console.log(req.user.rol)
    if(req.user.rol == 'ROL_ADMINISTRADOR'){
        console.log(req.user.rol)
        Sucursales.find({idEmpresa: idEmp},(err , sucursalesObtenidos) => {
            if(err) return res.send({mensaje: "error:" + err})
    
            console.log(sucursalesObtenidos )
            console.log(req.user.rol)
            return res.send({Sucursales: sucursalesObtenidos})
        });
    }else{
        Sucursales.find({idEmpresa: req.user.sub},(err , sucursalesObtenidos) => {
            if(err) return res.send({mensaje: "error:" + err})
    
            console.log(sucursalesObtenidos )
            return res.send({Sucursales: sucursalesObtenidos})
        });
    }
} 

function ObtenerSucursalesId(req, res) {
    var idSucursal = req.params.id
        Sucursales.findById(idSucursal, (err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!sucursalEncontrada) return res.status(404).send({ mensaje: "Error, no se encuentran empleado" });
            return res.status(200).send({ Sucursal: sucursalEncontrada })
        })
}

function AgregarSucursales(req, res){
    if(req.user.rol != 'Empresa') return res.status(500).send({mensaje: "Solo el ro Empresa puede agregar una nueva sucursal"})
    var parametros = req.body;
    var SucursalesModel = new Sucursales();
    if(parametros.nombreSucursal && parametros.direccionSucursal && parametros.telefono){

        SucursalesModel.nombreSucursal = parametros.nombreSucursal;
        SucursalesModel.direccionSucursal = parametros.direccionSucursal;
        SucursalesModel.telefono = parametros.telefono;
        SucursalesModel.idEmpresa = req.user.sub;


        Sucursales.findOne({nombreSucursal: parametros.nombreSucursal, idEmpresa: req.user.sub}, (err, sucursalEncontrada)=>{

            Sucursales.findOne({direccionSucursal: parametros.direccionSucursal, idEmpresa: req.user.sub}, (err, direccionEncontrada)=>{

                if(sucursalEncontrada != null || direccionEncontrada != null) {
                    return res.status(500).send({Message: 'Esta sucursal ya existe, ingrese otros datos para agregar'})

                }else{
                    SucursalesModel.save((err, SucursalGuardada)=>{
                        if(err) return res.status(500).send({message: 'Error en la peticion'});
                        if(!SucursalGuardada) return res.status(404).send({message: 'No se han podido guardar los datos'});
                        
                        return res.status(200).send({Sucursales: SucursalGuardada});
                    });                }
            });

        });
        
    }else{
        return res.status(200).send({mensaje:'Debe llenar los campos solicitados'});
    }
}

function EditarSucursales(req, res){

    if(req.user.rol != 'Empresa') return res.status(500).send({mensaje: "Solo el ro Empresa puede editar una sucursal"})
    var idSuc = req.params.idSucursal
    var parametros = req.body;

    Sucursales.findOne({_id:idSuc},(err, sucursalExistente) =>{
        if(err || sucursalExistente === null) return res.status(500).send({mensaje: "La sucursal no existe, verifique el ID"})

        if(parametros.idEmpresa) return res.status(500).send({mensaje: "No se puede editar los ID"})

        if(parametros.nombreSucursal || parametros.direccionSucursal || parametros.telefono){
    
            Sucursales.findOneAndUpdate({_id:sucursalExistente._id,idEmpresa: req.user.sub},parametros, {new: true}, (err, sucursalEditada)=>{
                if(err) return res.status(404).send({mensaje: "Error al editar la sucursal"})
                if(!sucursalEditada) return res.status(500).send({mensaje: "No puede editar una sucursal que no le pertenezca"})
                return res.status(200).send({Sucursales: sucursalEditada});
            });
            
        }
    })
}

function EliminarSucursales(req, res){
    var idSuc = req.params.idSucursal;

    Sucursales.find({_id:idSuc},(err, sucursalExistente) =>{
        if(err|| sucursalExistente === null) return res.status(500).send({mensaje: "La sucursal no existe, verifique el ID"})

        if(req.user.rol != 'Empresa') return res.status(500).send({mensaje: "Solo el ro Empresa puede editar una sucursal"})

            Sucursales.findOneAndDelete({_id: idSuc, idEmpresa: req.user.sub}, (err, sucursalEliminada)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion'});
                if(!sucursalEliminada) return res.status(404).send({message: 'No se puede eliminar una sucursale que no le perteneza'});
        
                return res.status(200).send({sucursales: sucursalEliminada});
            })
    })
}


module.exports = {
     ObtenerSucursales,
     AgregarSucursales,
     EditarSucursales,
     EliminarSucursales,
     ObtenerSucursalesId
}