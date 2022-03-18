const dbValidators = require('./db_validators');
const generarJWT = require('./generar-jwt');
const googleverify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleverify,
    ...subirArchivo
}