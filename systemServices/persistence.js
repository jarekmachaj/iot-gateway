const os = require("os");
const ifaces = os.networkInterfaces();

const recognizedMachinesQueue = [];
const registeredMachines = {};

module.exports.recognizedMachinesQueue = recognizedMachinesQueue;

module.exports.registeredMachines = registeredMachines;

module.exports.registerMachine = (machine) => {
    if (machine == undefined || machine == null) return;   
    if (recognizedMachinesQueue.find(queueMachine => queueMachine.ip == machine.ip) != undefined) return;
    if (registeredMachines.hasOwnProperty(machine.id)) return;

    recognizedMachinesQueue.push(machine);
}

module.exports.registerDiscoveredMachine = (machine) => {   
    if (machine && machine.id && machine.ip && !registeredMachines.hasOwnProperty(machine.id)) {
        registeredMachines[machine.id] = machine;
    }
}

module.exports.dequeueMachines = () => {
    let machines = Array.from(recognizedMachinesQueue);
    recognizedMachinesQueue.length = 0;
    return machines;
}
