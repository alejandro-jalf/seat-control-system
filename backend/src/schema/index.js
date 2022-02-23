const joi = require('joi');

const schemas = (() => {
    const schemaLogin = joi.object({
        nombre_user: joi.string().min(1).max(35).required(),
        password_user: joi.string().min(1).max(150).required()
    });

    return {
        schemaLogin,
    }
})();

module.exports = schemas;
