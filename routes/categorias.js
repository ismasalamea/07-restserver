const { Router } = require('express');
const { check } = require ('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db_validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const router = Router();

// {{url}} /api/categorias

//Obtener todas las categorias - publico LLISTO

router.get('/', obtenerCategorias);

//Obtener una categoria id - publico

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId)
], obtenerCategoria);

//Crear categoria privado - cualquiera con token valido

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


//Actualizar privado - cualquiera con token valido

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin

router.delete('/:id', [validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    validarCampos
],
    borrarCategoria);


module.exports = router;
