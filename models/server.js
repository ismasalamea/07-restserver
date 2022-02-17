const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        //conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicacion        
        this.routes();

    }

    async conectarDB() {
        await dbConnection();
    }

    //Middlewares
    middlewares() {

            //
            this.app.use(cors());

            //Lectura y Parseo del BODY
            this.app.use(express.json());

            //Directorio Publico
            this.app.use(express.static('public'));
        }

    routes(){
        
        this.app.use(this.usuariosPath, require ('../routes/usuarios'));
            
    }

    listen(){
            this.app.listen(this.PORT, () =>{
            console.log('Servidor corriendo en puerto', process.env.PORT);
        })
    }

}

module.exports = Server;