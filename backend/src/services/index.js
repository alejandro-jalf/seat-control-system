const { cadenaConexion } = require('../configs');
const {
    createResponse,
    createContentAssert,
    createContentError,
} = require("../utils");
const {
    modelGetUserByNombre,
    modelGetGroups,
    modelGetGroupById,
    modelUpdateGrupo,
    modelGetChairsByIdGrupo,
    modelGetChairs,
    modelUpdateAviableSeat,
} = require("../models");
const {
    validateBodyLogin,
    validateBodyUpdateGroup,
    validateDisponibleAsiento,
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
        return createResponse(200, createContentAssert('Bienvenido', result));
    }

    const getGroups = async () => {
        const result = await modelGetGroups(cadenaConexion);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('No hay grupos registrados'));
        return createResponse(200, result);
    }

    const getGroup = async (id_grupo) => {
        if (!id_grupo) return createResponse(400, createContentError('Grupo invalido'));

        const result = await modelGetGroupById(cadenaConexion, id_grupo);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('No se encontro el grupo'));
        return createResponse(200, result);
    }

    const updateGroup = async (id_grupo, bodyGroup) => {
        if (!id_grupo) return createResponse(400, createContentError('Grupo invalido'));

        let validate = validateBodyUpdateGroup(bodyGroup);
        if (!validate.success) return createResponse(400, validate);

        const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('No se encontro el grupo'));
        return createResponse(200, result);
    }

    const getSeats = async () => {
        const result = await modelGetChairs(cadenaConexion);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('No hay asientos registrados'));
        return createResponse(200, result);
    }

    const getSeatsByIdGrupo = async (id_grupo) => {
        if (!id_grupo) return createResponse(400, createContentError('Grupo invalido'));

        const result = await modelGetChairsByIdGrupo(cadenaConexion, id_grupo);
        if (!result.success) return createResponse(400, result);

        if (result.data.length === 0)
            return createResponse(400, createContentError('No hay asientos registrados'));
        return createResponse(200, result);
    }

    const updateAviableSeat = async (id_asiento, disponible_asiento) => {
        if (!id_asiento) return createResponse(400, createContentError('Grupo invalido'));
        let validate = validateDisponibleAsiento(disponible_asiento);
        if (!validate.success) return createResponse(400, validate);

        const result = await modelUpdateAviableSeat(cadenaConexion, id_asiento, disponible_asiento);
        if (!result.success) return createResponse(400, result);

        return createResponse(200, result);
    }

    return {
        loginUser,
        getGroups,
        getGroup,
        updateGroup,
        getSeats,
        getSeatsByIdGrupo,
        updateAviableSeat,
    }
})();

module.exports = services;
