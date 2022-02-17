const { Router } = require('express');
const { check } = require ('express-validator');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db_validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

///GET
    router.get('/', usuariosGet);

///PUT
    router.put('/:id', 
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos,
    usuariosPut);

///POST    
    router.post('/',[
        check('correo', 'el valor ingresado no es un correo').isEmail(),
        check('correo').custom(emailExiste),
        check('password', 'el password debe ser de 6 letras').isLength({min: 6}),
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
//        check('rol', 'el rol no esta permitido').isIn('ADMIN_ROLE','USER_ROLE'), 
        check('rol').custom(esRoleValido),
        validarCampos       
     ] ,usuariosPost);


///DELETE
    router.delete('/:id',[ 
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
    ], usuariosDelete);

///PATCH
    router.patch('/', usuariosPatch);

module.exports = router