const os = require("os");
const ifaces = os.networkInterfaces();
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const bcast = require("./utils/udpBroadcast");
const persistenceService = require('../systemServices/persistence');

const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson.toString()); 

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
config.ip = ip;
//as machine sees itself
const internalIp = ip;
//unique id for every machine in the network
const id = config.id;   
const hostName = os.hostname();
config.hostName = hostName;
//"client" or "server"
const mode = config.mode;
module.exports.config = config;

module.exports.startUDPListenBroadcast = () => {

    bcast.broadcastedMessage =  {
        id : id, ip : ip, internalIp : internalIp, hostname : hostName, 
        mode : mode, timeStamp : new Date(new Date().toUTCString())
    }
    bcast.onMessageReceived = (machine, machineIp) => {
        persistenceService.registerMachine(machine, machineIp);        
    }

    bcast.startUDPListenBroadcast();
}

module.exports.startMachinesDiscoveryJob = () => {
    setInterval(() => {
        
    }, 2000);
}

module.exports.stopUDPListenBroadcast = () => { return "Not yet :)" };
