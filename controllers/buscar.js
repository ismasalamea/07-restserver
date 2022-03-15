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
        const usuario = await Usuario.findById( termino );
        res.json({termino});
    }

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
            buscarUsuarios(termino, response);
            break;
        case 'categorias':
            break;
        case 'productos':
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