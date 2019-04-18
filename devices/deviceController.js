const deviceService = require('./deviceService');
const persistenceService = require('../systemServices/persistence');

module.exports.devices_list = (req, res) => {
    res.json(persistenceService.getDevices());
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

module.exports.device_action_execute_post = async (req, res) => {
    if (req.params.deviceId == undefined || req.params.deviceId == '') {
        res.send('Device not found');
        return;
    }
    let deviceId = req.params.deviceId;
   
    if(req.params.actionId == undefined || req.params.actionId == ''){
        res.send('Action not defined');
        return;
    }   
    let actionId = req.params.actionId;
    
    deviceService.executeAction(deviceId, actionId, req.body, result => res.json(result));
}