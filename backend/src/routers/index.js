const router = require("express").Router();
const {
    loginUser,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
} = require("../services");

router.route('/api/v1').get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bienvenidos a la ruta principal de Seat Control System'
    });
});

router.route('/api/v1/users/login').post(async (req, res) => {
    const body = req.body
    const { status, response } = await loginUser(body);
    res.status(status).json(response);
});

router.route('/api/v1/grupos').get(async (req, res) => {
    const { status, response } = getGroups();
    res.status(status).json(response);
});

router.route('/api/v1/grupos/:id_grupo').get(async (req, res) => {
    const { id_grupo } = req.params
    const { status, response } = getGroup(id_grupo);
    res.status(status).json(response);
});

router.route('/api/v1/grupos').post(async (req, res) => {
    const body = req.body
    const { status, response } = createGroup(body);
    res.status(status).json(response);
});

router.route('/api/v1/grupos/:id_grupo').put(async (req, res) => {
    const { id_grupo } = req.params
    const { status, response } = updateGroup(id_grupo);
    res.status(status).json(response);
});

module.exports = router
