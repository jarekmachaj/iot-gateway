const os = require("os");
const ifaces = os.networkInterfaces();

const recognizedMachines = {};
module.exports.recognizedMachines = recognizedMachines;

const discoveredMachines = {};
module.exports.discoveredMachines = discoveredMachines;

const getIps = () => {
    let ips = [];
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family == 'IPv4' && iface.internal == false) {
                console.log();
                ips.push(iface.address);
            }          
        });
    });        
    return ips; 
}

const ips = getIps();
//ip visible for other machines
const ip = ips && ips.length > 0 ? ips[0] : "";

module.exports.registerMachine = (machine, machineIp) => {
    if (machineIp){
        machineIp = machineIp == "127.0.0.1" ? ip : machineIp;
        if (machineIp == ip) machine.host = "self";
        machine.ip = machineIp;
    }         
    recognizedMachines[machine.id] = machine;
}

module.exports.discoverMachine = (registeredMachineName) => {
    
}