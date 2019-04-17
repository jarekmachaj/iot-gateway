const os = require("os");
const ifaces = os.networkInterfaces();

const recognizedMachinesQueue = [];
const registeredMachines = [];

module.exports.recognizedMachinesQueue = recognizedMachinesQueue;

module.exports.registeredMachines = registeredMachines;

module.exports.registerMachine = (machine) => {
    if (machine == undefined || machine == null) return;   
    if (recognizedMachinesQueue.find(queueMachine => queueMachine.ip == machine.ip) != undefined) return;
    if (registeredMachines.find(x => x.id == machine.id)) {
        var found = registeredMachines.find(x => x.id == machine.id);
        found.timeStamp = new Date(new Date().toUTCString());
        return;
    }

    recognizedMachinesQueue.push(machine);
}

module.exports.registerDiscoveredMachine = (machine) => {   
    if (machine && machine.id && machine.ip && !registeredMachines.find(x => x.id == machine.id)) {
        registeredMachines.push(machine);
    }
}

module.exports.dequeueMachines = () => {
    let machines = Array.from(recognizedMachinesQueue);
    recognizedMachinesQueue.length = 0;
    return machines;
}

module.exports.getDevices = () => {
    //TODO add refresh method + no function
    var devices = [];
    registeredMachines.forEach(machine => {
        if (machine.devices){
            machine.devices.forEach(device => {
                device.machine = machine.id;
                device.ip = machine.ip;
                if (device.actions){
                    device.actions.forEach(action => {
                        action.machine = machine.id;
                        action.ip = machine.ip;
                        action.api = machine.api;
                        action.port = machine.port;
                        action.protocol = machine.protocol;
                        action.deviceId = device.id;
                        action.host = machine.host;
                    });
                }
                devices.push(device);
            });
        }
    });
    
    return devices;
}
