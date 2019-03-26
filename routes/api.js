const express = require('express');
const router = express.Router();

const machines = require('../machines/machineRoutes');
const devices = require('./../devices/deviceRoutes');

router.get('/', (req, res, next) => { res.send('api')});
router.use('/machines', machines);
router.use('/devices', devices);

module.exports = router;
