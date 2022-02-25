const router = require("express").Router();
const {
    loginUser,
    getGroups,
    getGroup,
    updateGroup,
    getSeats,
    getSeatsByIdGrupo,
    updateAviableSeat,
    addColRight,
    addColLeft,
} = require("../services");

router.route('/api/v1').get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bienvenidos a la ruta principal de Seat Control System'
    });
});

router.route('/api/v1/users/login').post(async (req, res) => {
    const body = req.body;
    const { status, response } = await loginUser(body);
    res.status(status).json(response);
});

router.route('/api/v1/grupos').get(async (req, res) => {
    const { status, response } = await getGroups();
    res.status(status).json(response);
});

router.route('/api/v1/grupos/:id_grupo').get(async (req, res) => {
    const { id_grupo } = req.params;
    const { status, response } = await getGroup(id_grupo);
    res.status(status).json(response);
});

// router.route('/api/v1/grupos').post(async (req, res) => {
//     const body = req.body
//     const { status, response } = await createGroup(body);
//     res.status(status).json(response);
// });

router.route('/api/v1/grupos/:id_grupo').put(async (req, res) => {
    const { id_grupo } = req.params;
    const body = req.body;
    const { status, response } = await updateGroup(id_grupo, body);
    res.status(status).json(response);
});

router.route('/api/v1/seats').get(async (req, res) => {
    const { status, response } = await getSeats();
    res.status(status).json(response);
});

router.route('/api/v1/seats/grupos/:id_grupo').get(async (req, res) => {
    const { id_grupo } = req.params;
    const { status, response } = await getSeatsByIdGrupo(id_grupo);
    res.status(status).json(response);
});

router.route('/api/v1/seats/grupos/:id_grupo/right').post(async (req, res) => {
    const { id_grupo } = req.params;
    const { status, response } = await addColRight(id_grupo);
    res.status(status).json(response);
});

router.route('/api/v1/seats/grupos/:id_grupo/left').post(async (req, res) => {
    const { id_grupo } = req.params;
    const { status, response } = await addColLeft(id_grupo);
    res.status(status).json(response);
});

router.route('/api/v1/seats/:id_asiento').put(async (req, res) => {
    const { id_asiento } = req.params;
    const { disponible_asiento } = req.query;
    const { status, response } = await updateAviableSeat(id_asiento, disponible_asiento);
    res.status(status).json(response);
});

module.exports = router
