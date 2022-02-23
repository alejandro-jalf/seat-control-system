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


    return {
        modelGetUserByNombre,
    }
})();

module.exports = models;
