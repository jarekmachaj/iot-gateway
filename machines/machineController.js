const persitenceService = require('../systemServices/persistence');
const machineService = require('./machineService');

module.exports.machines_list = (req, res) => {
    res.json(persitenceService.registeredMachines);
}

module.exports.machine_create_post = (req, res) => {
    req.connection.address();
    let ip = req.connection.address().address.split(':').pop();
    machineService.registerMachine(req.body, ip);
    res.json({"message" : `machine ${ip} added`});
}

module.exports.machine_discovery_get = (req, res) => {
    res.json(machineService.config);
}