const deviceService = require('./deviceService');
const persistenceService = require('../systemServices/persistence');

module.exports.devices_list = (req, res) => {
    res.json(deviceService.config.devices);
}

module.exports.device_details_get = (req, res) => {
    let deviceId = req.params.deviceId;
    let device = deviceService.config.devices.find(device => device.id == deviceId);
    res.json(device);
}

module.exports.device_actions_get = (req, res) => {
    var deviceId = req.params.deviceId;
    var device = deviceService.config.devices.find(device => device.id == deviceId);
    res.json(device.actions);
}

module.exports.device_action_details_get = (req, res) => {
    res.send('not implemented');
}

module.exports.device_action_execute_post = (req, res) => {
    var deviceId = req.params.deviceId;
    var device = deviceService.config.devices.find(device => device.id == deviceId);
    if (device == undefined) {
        res.send('Device not found');
        return;
    }
    if(req.params.actionId == undefined || req.params.actionId == ''){
        res.send('Action not defined');
        return;
    }
    console.log(`executing ${req.params.actionId}`);
    var actionId = req.params.actionId;
    var action = device.actions.find(action => action.id == actionId);
    if (action == undefined) {
        res.send(`Action ${actionId} not found`);
        return;
    }
    console.log(`executing ${action.id}`);
    action.params = req.body.actionParams;
    deviceService.executeAction(action, result => res.json(result));
}