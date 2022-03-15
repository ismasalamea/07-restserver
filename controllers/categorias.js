const { response, query } = require('express');
const { Categoria } = require('../models');


/// obtener categorias - paginado -total - populate (investigar/ indica quien lo grabo)

const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        categorias
    });
}

/// obtener categoria - populate (obtener objeto)

const obtenerCategoria = async (req, res = response) => {
    
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json (categoria)
}

/// Actualizar categoria ()

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ... data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new:true })

    res.json({
        ok: true,
        msg: 'Categoria Actualizada',
        categoria
    });
}

//Borrar Categoria () estado:false
const borrarCategoria = async (req, res = response) => {

    const {id} = req.params;
    const categoriaborrada = await Categoria.findByIdAndUpdate(id, {estado:false}, {new: true});

    res.json({
        ok: true,
        msg: 'Categoria Eliminada',
        categoriaborrada
    });
}




const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

   if (categoriaDB) {
            return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }


// Generar la data a guardar
const data = {
    nombre,
    usuario: req.usuario._id
}

const categoria = new Categoria( data );

//Guardar DB
await categoria.save();

res.status(201).json(categoria);


}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}