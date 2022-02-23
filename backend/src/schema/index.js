const joi = require('joi');

const schemas = (() => {
    const schemaCreateUser = joi.object({
        nombre_user: joi.string().min(1).max(35).required(),
        apellido_p_user: joi.string().min(1).max(35).required(),
        apellido_m_user: joi.string().min(1).max(35).required(),
        direccion_user: joi.string().min(1).max(150).required(),
        sucursal_user: joi.string().min(1).max(25).required(),
        correo_user: joi.string().min(1).max(70).email().required(),
        password_user: joi.string().min(1).max(150).required(),
        tipo_user: joi.string().min(1).max(10).allow('invited', 'manager', 'executive').required(),
        access_to_user: joi.string().min(1).required()
    });

    return {}
})();

module.exports = schemas;
