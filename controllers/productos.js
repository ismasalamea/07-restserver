const { response, query } = require('express');
const { Producto } = require('../models');


/// obtener categorias - paginado -total - populate (investigar/ indica quien lo grabo)

const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total,productos] = await Promise.all(
    [
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        productos
    });
}

/// obtener categoria - populate (obtener objeto)

const obtenerProducto = async (req, res = response) => {
    
    const { id } = req.params;
    const producto = await Producto.findById(id)                                
                                .populate('usuario','nombre')
                                .populate('categoria', 'nombre')
    res.json (producto)
}

/// Actualizar categoria ()

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ... data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.descripcion = data.descripcion.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new:true })

    res.json({
        ok: true,
        msg: 'Producto Actualizado',
        producto
    });
}

//Borrar Producto () estado:false
const borrarProducto = async (req, res = response) => {

    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new: true});

    res.json({
        ok: true,
        msg: 'Producto Eliminado',
        producto
    });
}

//Crear Producto

const crearProducto = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const descripcion = req.body.descripcion.toUpperCase();
    const precio = req.body.precio
    const categoria = req.body.categoria

    const productoDB = await Producto.findOne({nombre})

   if (productoDB) {
            return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    const data = {
        nombre,
        descripcion,
        precio,
        categoria,
        usuario: req.usuario._id
    }

    const producto = new Producto( data );
    await producto.save();
    res.status(201).json({
        ok: true,
        msg: 'Producto Creado',
        producto});
}

module.exports = {
    crearProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProducto,
    obtenerProductos
}