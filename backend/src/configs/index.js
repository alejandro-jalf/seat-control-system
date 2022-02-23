// require("mandatoryenv").load();

const configs = (() => {

    const port = process.env.PORT || 5000;
    const node_env = process.env.USERSPA_ENV || 'develop';
    const token = process.env.USERSPA_TOKEN;
    const cadenaConexion = process.env.USERSPA_CONECTION;

    return {
        port,
        node_env,
        token,
        cadenaConexion,
    }
})();

module.exports = configs;
