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
    modelDeleteSeatByRow,
    modelDeleteSeatByCol,
    modelCreateSeats,
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

        let arrayConsult = [modelGetChairsByIdGrupo, modelGetGroupById];
        let arrayResult = arrayConsult.map(async (callback) => await callback(cadenaConexion, id_grupo));

        const results = await Promise.all(arrayResult);
        console.log(results, results[0].data, results[1].data);
        const errorFinded = results.find((result) => !result.success);
        if (errorFinded) return createResponse(400, errorFinded);
        if (results[1].data.length === 0)
            return createResponse(400, createContentError('No se encontro el grupo'));

        const rows_diff = bodyGroup.rows_grupo - results[1].data[0].rows_grupo;
        const cols_diff = bodyGroup.cols_grupo - results[1].data[0].cols_grupo;
        console.log('rows_diff', rows_diff, 'cols_diff', cols_diff);

        if (rows_diff === 0 && cols_diff === 0)
            return createResponse(400, createContentError('El numero de filas y columnas son iguales a los guardados'));
            const seats = results[0].data
            let row_max = 1, row_min = 1, col_max = 10, col_min = 10;

        seats.forEach((seat, index) => {
            if (index === 0) {
                row_max = seat.row_asiento;
                row_min = seat.row_asiento;
                col_max = seat.col_asiento;
                col_min = seat.col_asiento;
            } else {
                if (seat.row_asiento > row_max) row_max = seat.row_asiento;
                if (seat.row_asiento < row_min) row_min = seat.row_asiento;
                if (seat.col_asiento > col_max) col_max = seat.col_asiento;
                if (seat.col_asiento < col_min) col_min = seat.col_asiento;
            }
        });
        console.log(row_max, row_min, col_max, col_min);

        let rows_delete = '';
        let cols_delete = '';
        let valueInsert = '';
        let vueltas = 0;
        if (rows_diff < 0) {
            console.log('entra a 108');
            for (let index = row_max; index > (row_max + rows_diff); index--) {
                if (index === row_max) rows_delete += index + ''
                else rows_delete += ', ' + index
            }
            if (cols_diff < 0) {
                for (let index = col_max; index > (col_max + cols_diff); index--) {
                    if (index === col_max) cols_delete += index + ''
                    else cols_delete += ', ' + index
                }
                arrayConsult = [
                    { callback: modelDeleteSeatByRow, let: rows_delete },
                    { callback: modelDeleteSeatByCol, let: cols_delete }
                ];
                arrayResult = arrayConsult.map(async (call) => await call.callback(cadenaConexion, id_grupo, call.let));
    
                const resultsDelete = await Promise.all(arrayResult);
                console.log(resultsDelete);
                if (!resultsDelete[0].success && !resultsDelete[1].success)
                    return createResponse(
                        400,
                        createContentError('No se pudieron borrar las filas y columnas, intentelo nuevamente')
                    );
                else if (!resultsDelete[0].success) {
                    bodyGroup.rows_grupo = results[1].data[0].rows_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se quitaron Columnas pero no se pudieron eliminar las filas'
                    return createResponse(200, result);
                } else if (!resultsDelete[1].success) {
                    bodyGroup.cols_grupo = results[1].data[0].cols_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se quitaron Filas pero no se pudieron eliminar las Columnas'
                    return createResponse(200, result);
                } else {
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    return createResponse(200, result);
                }
            } else if (cols_diff === 0) {
                let result = await modelDeleteSeatByRow(cadenaConexion, id_grupo, rows_delete);
                if (!result.success) return createResponse(400, result);
    
                result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                if (!result.success) return createResponse(400, result);
                return createResponse(200, result);
            } else {
                for (let col_create = (col_max + 1); col_create <= (col_max + cols_diff); col_create++) {
                    for (let rows_create = row_min; rows_create <= row_max; rows_create++) {
                        if (vueltas === 0)
                            valueInsert += '(1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')'
                        else valueInsert += ', (1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')'
                        vueltas++;
                    }
                }
                arrayConsult = [
                    { callback: modelDeleteSeatByRow, let: rows_delete },
                    { callback: modelCreateSeats, let: valueInsert }
                ];
                arrayResult = arrayConsult.map(async (call, index) => {
                    if (index !== 0) return await call.callback(cadenaConexion, call.let)
                    return await call.callback(cadenaConexion, id_grupo, call.let)
                });
    
                const resultsActions = await Promise.all(arrayResult);
                console.log(resultsActions);
                if (!resultsActions[0].success && !resultsActions[1].success)
                    return createResponse(
                        400,
                        createContentError('No se pudieron borrar las filas ni agregar las columnas, intentelo nuevamente')
                    );
                else if (!resultsActions[0].success) {
                    bodyGroup.rows_grupo = results[1].data[0].rows_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se agregaron Columnas pero no se pudieron eliminar las filas'
                    return createResponse(200, result);
                } else if (!resultsActions[1].success) {
                    bodyGroup.cols_grupo = results[1].data[0].cols_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se quitaron Filas pero no se pudieron agregar las Columnas'
                    return createResponse(200, result);
                } else {
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    return createResponse(200, result);
                }
            }
        } else if (rows_diff > 0) {
            console.log('entra a 203');
            vueltas = 0;
            for (let row_create = (row_max + 1); row_create <= (row_max + rows_diff); row_create++) {
                for (let col_create = col_min; col_create <= col_max; col_create++) {
                    if (vueltas === 0)
                        valueInsert += '(1, ' + row_create + ', ' + col_create + ', ' + id_grupo + ')'
                    else valueInsert += ', (1, ' + row_create + ', ' + col_create + ', ' + id_grupo + ')'
                    vueltas++;
                }
            }
            if (cols_diff < 0) {
                for (let index = col_max; index > (col_max + cols_diff); index--) {
                    if (index === col_max) cols_delete += index + ''
                    else cols_delete += ', ' + index
                }
                arrayConsult = [
                    { callback: modelCreateSeats, let: valueInsert },
                    { callback: modelDeleteSeatByCol, let: cols_delete }
                ];
                arrayResult = arrayConsult.map(async (call, index) => {
                    if (index === 0) return await call.callback(cadenaConexion, call.let);
                    return await call.callback(cadenaConexion, id_grupo, call.let);
                });
    
                const resultsDelete = await Promise.all(arrayResult);
                console.log(resultsDelete);
                if (!resultsDelete[0].success && !resultsDelete[1].success)
                    return createResponse(
                        400,
                        createContentError('No se pudieron agregar las filas ni eliminar las columnas, intentelo nuevamente')
                    );
                else if (!resultsDelete[0].success) {
                    bodyGroup.rows_grupo = results[1].data[0].rows_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se quitaron Columnas pero no se pudieron agregar las filas'
                    return createResponse(200, result);
                } else if (!resultsDelete[1].success) {
                    bodyGroup.cols_grupo = results[1].data[0].cols_grupo;
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    
                    result.message = 'Se agregaron Filas pero no se pudieron eliminar las Columnas'
                    return createResponse(200, result);
                } else {
                    const result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                    if (!result.success) return createResponse(400, result);
                    return createResponse(200, result);
                }
            } else if (cols_diff === 0) {
                let result = await modelCreateSeats(cadenaConexion, valueInsert);
                if (!result.success) return createResponse(400, result);
    
                result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                if (!result.success) return createResponse(400, result);
                return createResponse(200, result);
            } else {
                vueltas = 0;
                for (let col_create = col_min; col_create <= (col_max + cols_diff); col_create++) {
                    for (let rows_create = row_min; rows_create <= (row_max + rows_diff); rows_create++) {
                        console.log(col_create, rows_create, `Vueltas: ${vueltas}`);
                        if (col_create <= col_max) {
                            console.log('Entra col_create <= col_max');
                            if (rows_create > row_max) {
                                console.log('Entra rows_create > row_max');
                                if (vueltas === 0)
                                    valueInsert = '(1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')';
                                else valueInsert += ', (1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')';
                                vueltas++;
                            }
                        } else {
                            console.log('Entra else');
                            if (vueltas === 0)
                                valueInsert = '(1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')';
                            else valueInsert += ', (1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')';
                            vueltas++;
                        }
                    }
                }
                let result = await modelCreateSeats(cadenaConexion, valueInsert);
                if (!result.success) return createResponse(
                        400,
                        createContentError('No se pudieron agregar las filas ni las columnas, intentelo nuevamente')
                    );
                console.log(result);
                result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                if (!result.success) return createResponse(400, result);
                return createResponse(200, result);
            }
        } else {
            console.log('entra a 289');
            if (cols_diff < 0) {
                for (let index = col_max; index > (col_max + cols_diff); index--) {
                    if (index === col_max) cols_delete += index + ''
                    else cols_delete += ', ' + index
                }

                let result = await modelDeleteSeatByCol(cadenaConexion, id_grupo, cols_delete);
                if (!result.success) return createResponse(400, result);

                result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                if (!result.success) return createResponse(400, result);
                return createResponse(200, result);
            } else {
                for (let col_create = (col_max + 1); col_create <= (col_max + cols_diff); col_create++) {
                    for (let rows_create = row_min; rows_create <= row_max; rows_create++) {
                        if (vueltas === 0)
                            valueInsert += '(1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')'
                        else valueInsert += ', (1, ' + rows_create + ', ' + col_create + ', ' + id_grupo + ')'
                        vueltas++;
                    }
                }

                let result = await modelCreateSeats(cadenaConexion, valueInsert);
                if (!result.success) return createResponse(400, result);

                result = await modelUpdateGrupo(cadenaConexion, id_grupo, bodyGroup);
                if (!result.success) return createResponse(400, result);
                return createResponse(200, result);
            }
        }
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
