const express = require('express')
const router = express.Router();
const debug = require('debug')('app');
const machineController = require('./machineController');

router.get('/',  machineController.machines_list);
router.get('/discovery', machineController.machine_discovery_get);
router.post('/register', machineController.machine_create_post);

module.exports = router