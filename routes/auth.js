const { Router } = require('express');
const { check } = require ('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { login, GoogleSignIn } = require('../controllers/auth')

const router = Router();

///GET
    router.post('/login', [
        check('correo','El correo es obligatorio').isEmail(),
        check('password','La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], login);

    router.post('/google', [
        check('id_token','ID token es necesario').not().isEmpty(),
        validarCampos
    ], GoogleSignIn);




module.exports = router