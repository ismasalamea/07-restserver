const {response, request } = require('express/lib/request')
const jwt = require('jsonwebtoken')
const Usuario = require ('../models/usuario')

const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token');
   // console.log(token);
    if(!token) {
        return res.status(401).json ({
            msg:'No hay token en la petición'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al UID 
        const usuario = await Usuario.findById(uid);

        if(!usuario){
        return res.status(401).json ({
            msg:'Token No valido - usuario no existe en DB'
        })
        }
        //Verificar si el UID tiene esatdo true
        if(!usuario.estado) {
            return res.status(401).json ({
                msg:'Token No valido - usuario estado false'
            })
        }

        req.usuario = usuario;

        next();


    }catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })

    }

}


module.exports = {
    validarJWT
}