const { response } = require ('express')
const Usuario = require('../models/usuario')
const bcryptjs = require ('bcryptjs')

const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
            return res.status(400).json ({
                msg: 'Usuario / password no son correctos -correo'
            });
        }

        //verificar si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json ({
                msg: 'Usuario / password no son correctos estado:false'
            })
        }

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json ({
                msg: 'Usuario / password no son correctos'
            })  
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg:'Login ok',
            usuario,
            token
        })
        }catch (error) {
            console.log(error);
            return res.status(400).json({
                msg: 'Hable con el administrador'
            })
        }        
}

const GoogleSignIn = async(req,res = response) => {

    const { id_token } = req.body;

    try {

        //const googleUser = await googleVerify(id_token);

        const { correo, nombre, img } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo });

        if(!usuario) {
            //Creacion de usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en DB

        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador. Usuario Bloqueado'
            })   
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

       // console.log(googleUser)
        res.json({
            usuario,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(400).json({
            msg: 'El Token no se pudo verificar'
        })

    }
    
}


module.exports = {
    login,
    GoogleSignIn
}