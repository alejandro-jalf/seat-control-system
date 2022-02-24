const joi = require('joi');

const schemas = (() => {
    const schemaLogin = joi.object({
        nombre_user: joi.string().min(1).max(35).required(),
        password_user: joi.string().min(1).max(150).required()
    });

    const schemaUpdateGroup = joi.object({
        rows_grupo: joi.number().required(),
        cols_grupo: joi.number().required()
    });

    return {
        schemaLogin,
        schemaUpdateGroup,
    }
})();

module.exports = schemas;
