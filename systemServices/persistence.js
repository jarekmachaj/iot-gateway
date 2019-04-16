const os = require("os");
const ifaces = os.networkInterfaces();

const recognizedMachinesQueue = [];
const registeredMachines = {};
const getIps = () => {
    let ips = [];
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family == 'IPv4' && iface.internal == false) {
                ips.push(iface.address);
            }          
        });
    });        
    return ips; 
}
const ips = getIps();
//ip visible for other machines
const ip = ips && ips.length > 0 ? ips[0] : "";

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
        console.log("To collection");
        registeredMachines[machine.id] = machine;
    }
}

module.exports.dequeueMachines = () => {
    let machines = Array.from(recognizedMachinesQueue);
    recognizedMachinesQueue.length = 0;
    return machines;
}
