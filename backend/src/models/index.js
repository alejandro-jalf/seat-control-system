const { QueryTypes } = require("sequelize");
const conexion = require("../services/conexion");
const { createContentAssert, createContentError } = require("../utils");

const models = (() => {

    const modelGetUserByNombre = async (cadenaConexion = '', name_user) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `SELECT * FROM users WHERE name_user = '${name_user}'`,
                QueryTypes.SELECT
            );
            conexion.closeConexion();
            return createContentAssert('Datos encontrados en la base de datos', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar obtener el usuario',
                error
            );
        }
    }

    const modelGetGroups = async (cadenaConexion = '') => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                'SELECT * FROM grupos',
                QueryTypes.SELECT
            );
            conexion.closeConexion();
            return createContentAssert('Datos encontrados en la base de datos', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar obtener los grupos',
                error
            );
        }
    }

    const modelGetGroupById = async (cadenaConexion = '', id_grupo) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `SELECT * FROM grupos WHERE id_grupo = '${id_grupo}'`,
                QueryTypes.SELECT
            );
            conexion.closeConexion();
            return createContentAssert('Datos encontrados en la base de datos', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar obtener el grupo por id',
                error
            );
        }
    }

    const modelUpdateGrupo = async (cadenaConexion = '', id_grupo, bodyGroup) => {
        try {
            const { rows_grupo, cols_grupo } = bodyGroup;
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `
                UPDATE grupos
                SET rows_grupo = ${rows_grupo}, cols_grupo = ${cols_grupo}
                WHERE id_grupo = '${id_grupo}'
                `,
                QueryTypes.UPDATE
            );
            conexion.closeConexion();
            return createContentAssert('Datos actualizados', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar actualizar el grupo',
                error
            );
        }
    }

    const modelGetChairs = async (cadenaConexion = '') => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                'SELECT * FROM asientos',
                QueryTypes.SELECT
            );
            conexion.closeConexion();
            return createContentAssert('Datos encontrados', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar obtener todos los asientos',
                error
            );
        }
    }

    const modelGetChairsByIdGrupo = async (cadenaConexion = '', id_grupo) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `SELECT * FROM asientos WHERE grupo_asiento = ${id_grupo}`,
                QueryTypes.SELECT
            );
            conexion.closeConexion();
            return createContentAssert('Asientos encontrados', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar obtener los asientos por id grupo',
                error
            );
        }
    }

    const modelCreateSeats = async (cadenaConexion = '', querySeats) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `INSERT INTO
                    asientos(disponible_asiento, row_asiento, col_asiento, grupo_asiento)
                VALUES ${querySeats}`,
                QueryTypes.INSERT
            );
            conexion.closeConexion();
            return createContentAssert('Asientos creados', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar crear los asientos',
                error
            );
        }
    }

    const modelUpdateAviableSeat = async (cadenaConexion = '', id_asiento, disponible_asiento) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `UPDATE asientos
                SET disponible_asiento = ${disponible_asiento}
                WHERE id_asiento = ${id_asiento}`,
                QueryTypes.UPDATE
            );
            conexion.closeConexion();
            return createContentAssert('Estatus del asiento actualizado', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar actualizar la disponibilidad del asiento',
                error
            );
        }
    }

    const modelDeleteSeat = async (cadenaConexion = '', id_asiento) => {
        try {
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `DELETE FROM asientos WHERE id_asiento = ${id_asiento}`,
                QueryTypes.DELETE
            );
            conexion.closeConexion();
            return createContentAssert('Asiento eliminado', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar eliminar el asiento por id asiento',
                error
            );
        }
    }

    const modelDeleteSeatByRow = async (cadenaConexion = '', id_grupo, bodySeat) => {
        try {
            const { row_asiento } = bodySeat;
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `DELETE FROM asientos WHERE grupo_asiento = ${id_grupo} AND row_asiento = ${row_asiento}`,
                QueryTypes.DELETE
            );
            conexion.closeConexion();
            return createContentAssert('Fila eliminada', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar eliminar la fila de asientos',
                error
            );
        }
    }

    const modelDeleteSeatByCol = async (cadenaConexion = '', id_grupo, bodySeat) => {
        try {
            const { col_asiento } = bodySeat;
            const accessToDataBase = conexion.getConexion(cadenaConexion);
            const result = await accessToDataBase.query(
                `DELETE FROM asientos WHERE grupo_asiento = ${id_grupo} AND col_asiento = ${col_asiento}`,
                QueryTypes.DELETE
            );
            conexion.closeConexion();
            return createContentAssert('Columna eliminada', result[0]);
        } catch (error) {
            return createContentError(
                'Fallo la conexion con base de datos al intentar eliminar la columna de asientos',
                error
            );
        }
    }

    return {
        modelGetUserByNombre,
        modelGetGroups,
        modelGetGroupById,
        modelUpdateGrupo,
        modelGetChairs,
        modelGetChairsByIdGrupo,
        modelCreateSeats,
        modelDeleteSeat,
        modelDeleteSeatByRow,
        modelDeleteSeatByCol,
        modelUpdateAviableSeat,
    }
})();

module.exports = models;
