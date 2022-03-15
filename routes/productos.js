const { Router } = require('express');
const { check } = require ('express-validator');
const { crearProducto, actualizarProducto, borrarProducto, obtenerProducto, obtenerProductos } = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db_validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')

const router = Router();

// {{url}} /api/productos

//Obtener todas las categorias - publico 

router.get('/', obtenerProductos);

//Obtener una categoria id - publico

router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId)
], obtenerProducto);

//Actualizar privado - cualquiera con token valido

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),    
    check('precio', 'El precio debe ser un numero').isNumeric(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar una categoria - Admin

router.delete('/:id', [validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId), 
    validarCampos
],
    borrarProducto);

//Crear categoria privado - cualquiera con token valido

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

module.exports = router;
