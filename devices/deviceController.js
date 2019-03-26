const deviceService = require('./deviceService');

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
    var device = machineService.config.devices.find(device => device.id == deviceId);
    res.json(device.actions);
}

module.exports.device_action_details_get = (req, res) => {
    res.send('not implemented');
}