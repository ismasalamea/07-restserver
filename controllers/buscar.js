const { response } = require('express');
const { ObjectId} = require('mongoose').Types;
const { Usuario, Producto, Categoria } = require('../models');


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE
    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino )
        return res.json({
            results: (usuario)? [ usuario ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({ 
        $or:  [{ nombre: regex }, { correo: regex }],
        $and: [{ estado:true }] 
    });
    return res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE
    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino )
        return res.json({
            results: (categoria)? [ categoria ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({nombre: regex, estado:true});
    return res.json({
        results: categorias
    });
}

const buscarProductos = async(termino = '', res = response ) => {
    const esMongoID = ObjectId.isValid( termino ); // TRUE
    if ( esMongoID ) {
        const producto = await Producto.findById( termino )
        return res.json({
            results: (producto)? [ producto ] : []
        });
    }
    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ 
        $or:  [{ nombre: regex },{descripcion: regex}],
        $and: [{ estado:true }] 
    });
    return res.json({
        results: productos
    });
}

const buscar = async (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json ({
            msg: 'las colecciones permitidas son'
         })
   }

   switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'roles':           
        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido'
            })
    }
}

module.exports = { 
    buscar
}