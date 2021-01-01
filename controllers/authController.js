const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuariosModels');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        // Verificar Email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no es valido'
            });
        }

        // Verificar password
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login
}