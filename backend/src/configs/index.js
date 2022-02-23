require("mandatoryenv").load();

const configs = (() => {

    const port = process.env.PORT || 5000;
    const node_env = process.env.USERSPA_ENV || 'develop';
    const cadenaConexion = process.env.USERSPA_CONECTION;

    return {
        port,
        node_env,
        cadenaConexion,
    }
})();

module.exports = configs;
