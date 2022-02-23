const router = require("express").Router();
const {} = require("../services");

router.route('/api/v1').get(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bienvenidos a la ruta principal de Seat Control System'
    });
});

module.exports = router;
