const { response } = require ('express');

const usuariosGet = (req, res = response) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        ok: true,
        msg: 'get API - controlador',
        q, 
        nombre, 
        apikey
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad} = req.body;

    res.json({
        ok: true,
        msg: 'post API - controlador',
        nombre,
        edad,
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        ok: true,
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'Patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'Delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete

}