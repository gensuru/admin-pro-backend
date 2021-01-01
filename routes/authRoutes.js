/*
  Path: /api/login
 */

const { Router } = require('express');
const { login } = require('../controllers/authController');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [

    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos

], login);



module.exports = router;