const express = require('express')
const router = express.Router();
const deviceController = require('./deviceController');

router.get('/', deviceController.devices_list);
router.get('/:deviceId', deviceController.device_details_get);
router.get('/:deviceId/actions', deviceController.device_actions_get);
router.get('/:deviceId/actions/:actionId', deviceController.device_action_details_get);
router.post('/:deviceId/actions/:actionId', deviceController.device_action_execute_post);

module.exports = router;