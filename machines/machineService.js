const os = require("os");
const ifaces = os.networkInterfaces();
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const bcast = require("./utils/udpBroadcast");
const persistenceService = require('../systemServices/persistence');
const request = require('request');

const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson.toString()); 

const getIps = () => {
    let ips = [];
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family == 'IPv4' && iface.internal == false) {
                //console.log();
                ips.push(iface.address);
            }          
        });
    });        
    return ips; 
}

const ips = getIps();
//ip visible for other machines
let ip = ips && ips.length > 0 ? ips[0] : "";
config.ip = config.forceIp ? config.forceIp : ip;
ip = config.ip;
//as machine sees itself
const internalIp = ip;
//unique id for every machine in the network
const id = config.id;   
const hostName = os.hostname();
config.hostName = hostName;
//"client" or "server"
const mode = config.mode;
module.exports.config = config;

const registerMachine  = (machine, machineIp) => {
    if (machineIp && machine.id){
        machineIp = (machineIp == "127.0.0.1") ? ip : machineIp;
        if (machineIp == ip) machine.host = "self";        
        machine.ip = machineIp;
    }   
    persistenceService.registerMachine(machine);
}

module.exports.startUDPListenBroadcast = () => {

    bcast.broadcastedMessage =  {
        id : id, ip : ip, internalIp : internalIp, hostname : hostName, 
        mode : mode, timeStamp : new Date(new Date().toUTCString())
    }
    bcast.onMessageReceived = (machine, machineIp) => {
        registerMachine(machine, machineIp);        
    }

    bcast.startUDPListenBroadcast();
};

module.exports.registerMachine = registerMachine;

module.exports.startMachinesDiscovery = () => {
    setInterval(() => {
        console.log("--- REGISTERING (interval) ----")
        let machinesInQueue = persistenceService.dequeueMachines();
        machinesInQueue.forEach(machineToDiscover => {
            console.log(`Checking ${JSON.stringify(machineToDiscover)}`);
            request(`${machineToDiscover.protocol}://${machineToDiscover.ip}${machineToDiscover.api}/machines/discovery`, function (error, response, body) {
               if (error) { 
                    console.log(error);
                   return
                };
               console.log(`Success`);
               console.log(response);
               persistenceService.registerDiscoveredMachine(response);
            });            
        });        
    }, 6000);
}

module.exports.stopUDPListenBroadcast = () => { return "Not yet :)" };
