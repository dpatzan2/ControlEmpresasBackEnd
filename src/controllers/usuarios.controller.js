const Usuarios = require('../models/usuarios.model')
const brycpt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function registarAdminDefecto(req, res) {
    var usuarioModelo = new Usuarios();
    usuarioModelo.nombre = 'SuperAdmin';
    usuarioModelo.usuario = 'SuperAdmin';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    Usuarios.find({ nombre: 'SuperAdmin' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            brycpt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardadoSegundo) => {
                    console.log('usuario creado')
                })
            })
        } else {
            console.log('El usuario ya existe')
        }
    })
}

function ObtenerUsuarios(req, res) {
    Usuarios.find({ rol: 'Empresa' }, (err, usuariosObtenidos) => {
        if (err) return res.send({ message: "error:" + err })

        for (let i = 0; i < usuariosObtenidos.length; i++) {
            //console.log(usuariosObtenidos[i].nombre)
        }

        return res.send({ Empresas: usuariosObtenidos })
    });
}

function ObtenerUsuariosId(req, res) {
    var idUsuario = req.params.id
    Usuarios.findById(idUsuario, (err, empleadorEncontrado) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" });
        if (!empleadorEncontrado) return res.status(404).send({ message: "Error, no se encuentran usuarios" });
        return res.status(200).send({ empleadoEncontrado: empleadorEncontrado })
    })
}


function ObtenerUserLogueado(req, res) {

    Usuarios.findOne({_id: req.user.sub}, (err, UserLogin) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" });
        if (!UserLogin) return res.status(404).send({ message: "Error, no se encuentran usuarios" });
        return res.status(200).send({ usuario: UserLogin })
    })
}


//METODO PARA PODER INICIAR SESION
function Login(req, res) {
    var parameters = req.body
    Usuarios.findOne({ usuario: parameters.usuario }, (err, usuarioLogeado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        if (usuarioLogeado) {
            brycpt.compare(parameters.password, usuarioLogeado.password,
                (err, passwordComparacion) => {
                    if (passwordComparacion) {
                        if (parameters.obtenerToken === 'true') {
                            return res.status(200).send({ token: jwt.crearToken(usuarioLogeado) })
                        } else {
                            usuarioLogeado.password = undefined;
                            return res.status(200).send({ usuario: usuarioLogeado })
                        }
                    } else {
                        return res.status(404).send({ message: "Contraseña incorrecta" });
                    }
                })
        } else {
            return res.status(404).send({ message: "Usuario incorrecto, verifique los datos." });
        }
    })
}

function RegistrarEmpresas(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuarios();

    if (parametros.nombre && parametros.usuario && parametros.password && parametros.tipoEmpresa) {
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.tipoEmpresa = parametros.tipoEmpresa
        usuarioModelo.usuario = parametros.usuario;
        usuarioModelo.rol = 'Empresa';

        Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEcontrado) => {

            if (usuarioEcontrado==null) {

                Usuarios.findOne({ nombre: parametros.nombre }, (err, nombreEncontradoUser) => {
                    if (nombreEncontradoUser == null) {
                        brycpt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                            usuarioModelo.password = passwordEncriptada;

                            usuarioModelo.save((err, usuarioGuardado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!usuarioGuardado) return res.status(404).send({ message: 'No se encontraron usuarios' });

                                return res.status(200).send({ Empresa: usuarioGuardado });
                            });
                        });
                    } else {
                        return res.status(500).send({ message: 'Este nombre ya esta siendo utilizado. ' });
                    }
                })

            } else {
                return res.status(400).send({ message: 'Este usuario ya esta siendo utilizado, pruebe usando otro' });
            }

        })
    } else {
        return res.status(500).send({ message: 'Llene todos los campos requeridos' });
    }

}

//AGREGAR EMPRESAS DESDE LA VISTA DEL ADMINISTRADOR AUN SIN VALIDACIONES DE ROL
function AgregarEmpresasDesdeAdmin(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuarios();
    if (parametros.nombre && parametros.usuario && parametros.password && parametros.tipoEmpresa) {
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.tipoEmpresa = parametros.tipoEmpresa
        usuarioModelo.usuario = parametros.usuario;
        usuarioModelo.rol = 'Empresa';
        Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado== null) {
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModelo.password = passwordEncriptada;

                    usuarioModelo.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(404).send({ message: 'No se encontraron usuarios' });

                        return res.status(200).send({ Empresa: usuarioGuardado });
                    });
                });
            } else {
                return res.status(400).send({ message: 'Este usuario ya esta siendo utilizado, pruebe usando otro.' });
            }

        })
    } else {
        return res.status(500).send({ message: 'Llene todos los campos requeridos' });
    }
}

//METODO PARA PODER MODIFICAR  EMPRESAS) SIN VALIDACIONES AUN

// function EditarUsuarios(req, res) {
//     var idUsu = req.params.idUsuario;
//     var parametros = req.body;

//     Usuarios.findOne({nombre:parametros.nombre},(err,usuarioEncontrado)=>{

//         if(usuarioEncontrado==null){

//             Usuarios.findOne({usuario:parametros.usuario},(err,usuarioEncontradoUser)=>{
//                 if(usuarioEncontradoUser==null){
//                     Usuarios.findByIdAndUpdate(idUsu, parametros, {new: true}, (err, usuarioActualizado) => {
//                         if(err) return res.status(500).send({message: 'Error en la peticion'});
//                         if(!usuarioActualizado) return res.status(404).send({message: 'No se encontraron usuarios'});

//                         return res.status(200).send({empresa: usuarioActualizado});
//                     });
//                 }else{
//                     return res.status(500).send({message: 'Este usuario ya esta siendo utilizado.'});

//                 }
//             });
//         }else{
//             return res.status(500).send({message: 'Este nombre ya esta siendo utilizado. '});
//         }
//     })


// }

function EditarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;
    var parametros = req.body;
    Usuarios.findOne({ _id: idUsu }, (err, empresaExistente) => {
        if (err || empresaExistente === null) return res.status(500).send({ message: "La empresa no existe, verifique el ID" })
        if (parametros.nombre || parametros.usuario) {
            Usuarios.findOne({ nombre: parametros.nombre }, (err, usuarioEncontrado) => {
                Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEncontradoUser) => {
                    if (usuarioEncontrado != null && empresaExistente.nombre != parametros.nombre) {
                        return res.status(500).send({ message: 'El nombre ingresado ya existe. Verifique los datos' })
                    } else {
                        if (usuarioEncontradoUser != null && empresaExistente.usuario != parametros.usuario) {
                            return res.status(500).send({ message: 'El usuario ingresado ya existe. Verifique los datos.' })
                        } else {
                            Usuarios.findByIdAndUpdate(idUsu, parametros, { new: true }, (err, usuarioActualizado) => {
                                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                                if (!usuarioActualizado) return res.status(404).send({ message: 'No se encontraron usuarios' });
                                return res.status(200).send({ empresa: usuarioActualizado });
                            });
                        }
                    }
                })
            })

        }

    })
}


//METODO PARA ELIMINAR  EMPRESAS SIN VALIDACIONES AUN
function EliminarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;

    Usuarios.findByIdAndDelete(idUsu, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!usuarioEliminado) return res.status(404).send({ message: 'No se encontraron usuarios' });

        return res.status(200).send({ usuarios: usuarioEliminado });
    })


}


module.exports = {
    Login,
    registarAdminDefecto,
    RegistrarEmpresas,
    EditarUsuarios,
    EliminarUsuarios,
    ObtenerUsuarios,
    AgregarEmpresasDesdeAdmin,
    ObtenerUsuariosId,
    ObtenerUserLogueado
}