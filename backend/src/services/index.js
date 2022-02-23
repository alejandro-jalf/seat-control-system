const { cadenaConexion } = require('../configs');
const {
    createResponse,
    createContentAssert,
    createContentError,
} = require("../utils");
const {
    modelGetUserByNombre,
} = require("../models");
const {
    validateBodyLogin,
} = require('../validations');

const services = (() => {
    
    const loginUser = async (bodyLogin) => {
        const validate = validateBodyLogin(bodyLogin);
        if (!validate.success) {
            return createResponse(400, validate)
        }

        const result = await modelGetUserByNombre(cadenaConexion, bodyLogin.nombre_user);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('El usuario no existe'));
        if (result.data[0].password_user !== bodyLogin.password_user)
            return createResponse(400, createContentError('Contraseña incorrecta'));
        return createResponse(201, createContentAssert('Bienvenido'));
    }

    return {
        loginUser,
    }
})();

module.exports = services;
