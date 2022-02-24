const { createContentAssert, createContentError } = require('../utils');
const {
    schemaLogin,
    schemaUpdateGroup,
} = require('../schema');

const validations = (() => {

    const validateBodyLogin = (bodyLogin) => {
        let resultValidate = schemaLogin.validate(bodyLogin);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera incorrecta", resultValidate.error);
        }

        return createContentAssert("Validacion correcta");
    }

    const validateBodyUpdateGroup = (bodyGroup) => {
        let resultValidate = schemaUpdateGroup.validate(bodyGroup);
        if (resultValidate.error) {
            return createContentError("Algun dato fue enviado de manera incorrecta", resultValidate.error);
        }

        if (parseInt(bodyGroup.rows_grupo) <= 0)
            return createContentError('Las filas no pueden ser menores que 1');

        if (parseInt(bodyGroup.cols_grupo) <= 0)
            return createContentError('Las columnas no pueden ser menores que 1');

        return createContentAssert("Validacion correcta");
    }

    const validateDisponibleAsiento = (disponible_asiento) => {
        if (!disponible_asiento) return createContentError('No envio el nuevo status');

        disponible_asiento = parseInt(disponible_asiento);
        if (disponible_asiento < 0 || disponible_asiento > 2)
            return createContentError('Estatus de disponilbe invalido');
        return createContentAssert("Validacion correcta");
    }

    return {
        validateBodyLogin,
        validateBodyUpdateGroup,
        validateDisponibleAsiento,
    }
})();

module.exports = validations;
