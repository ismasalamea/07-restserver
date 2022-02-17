const bcryptjs = require('bcryptjs');
const { response, query } = require ('express');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    
    const body = req.body;

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol } );

    // encriptar la contraseña con paquete BCRYPTJS
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);
    // Guardar en DB
    await usuario.save();
    res.json({
        msg: 'post API - controlador',
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { password, google, correo, ...resto} = req.body;

    //TODO validar contra base de db_validators
    if(password) {
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt);        
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        ok: true,
        msg: 'put API - controlador',
        usuario
    });
}

const usuariosPatch = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'Patch API - controlador'
    });
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    // Fisicamente lo borramos
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete

}