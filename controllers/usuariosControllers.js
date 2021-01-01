const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuariosModels');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });
}

const crearUsuario = async(req, res = response) => {

    //console.log(req.body);

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }


        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar Usuario
        await usuario.save();

        // Generar Token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    // Todo: validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encuentra un usuario con ese id ' + uid
            });
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    mgs: 'Ya existe un usuario con ese correo'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const elimiarUsuario = await Usuario.findByIdAndDelete(uid);

        if (elimiarUsuario) {
            return res.status(500).json({
                ok: true,
                msg: 'Usuario con el id: ' + uid + ' ha sido eliminado con exito'
            });
        }

        if (!elimiarUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario con el id: ' + uid + ' no existe'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        });
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}