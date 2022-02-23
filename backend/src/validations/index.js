const { createContentAssert, createContentError } = require('../utils');
const {
    schemaLogin,
} = require('../schema');

const validations = (() => {

    const validateBodyLogin = (bodyLogin) => {
        let resultValidate = schemaLogin.validate(bodyLogin);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera incorrecta", resultValidate.error);
        }

        return createContentAssert("Validacion correcta");
    }

    return {
        validateBodyLogin,
    }
})();

module.exports = validations;
