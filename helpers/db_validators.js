
const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require ('../models');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ) {
        throw new Error(`El rol ${ rol} no esta registrado en la base de datos`);
    }
}

const emailExiste = async( correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail) {
        throw new Error(`El correo ${ correo } esta registrado en la base de datos`);
    }
}

const existeUsuarioPorId = async( id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id ${ id } no esta registrado en la base de datos`);
    }
}

const existeCategoriaPorId = async( id = '') => {
    const existeUsuario = await Categoria.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id ${ id } no esta registrado en la base de datos`);
    }
}

const existeProductoPorId = async( id = '') => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto) {
        throw new Error(`El id ${ id } no esta registrado en la base de datos`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluidas = colecciones.includes (coleccion);
    if(!incluidas) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`)
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}