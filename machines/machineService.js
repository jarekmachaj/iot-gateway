/*
TO DO: REAFACTOR!!!!!!! CLEAN UP!!
*/
const os = require("os");
const ifaces = os.networkInterfaces();
const debug = require('debug')('app');
const debugudp = require('debug')('udp');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const dgram = require("dgram");

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
//as machine sees itself
const internalIp = this.ip;
//unique id for every machine in the network
const id = config.id;   
const hostName = os.hostname();
//instance cache
const recognizedMachines = {};
//"client" or "server"
const mode = config.mode;
module.exports.confg = config;

module.exports.recognizedMachines = recognizedMachines;

module.exports.configToBroadcast = {
        id : id, ip : ip, internalIp : internalIp, hostname : hostName, 
        mode : mode, timeStamp : new Date(new Date().toUTCString())
    }

module.exports.registerMachine = (machine, machineIp) => {
        if (machineIp){
            machineIp = machineIp == "127.0.0.1" ? this.ip : machineIp;
            if (machineIp == this.ip) machine.host = "self";
            machine.ip = machineIp;
        }         
        recognizedMachines[machine.id] = machine;
    }

module.exports.startUDPListenBroadcast = () => {
        const PORT = 20000;
        const MULTICAST_ADDR = "233.255.255.255";
        const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });        
        const sendMessage = () => {  
            let broadcastMessage = Buffer.from(`${ JSON.stringify(module.exports.configToBroadcast)}`)
            socket.send(broadcastMessage, 0, broadcastMessage.length, PORT, MULTICAST_ADDR, () => { 
                debugudp(`Broadcasting ${broadcastMessage}`)
             });  
        }

        socket.bind(PORT);
        socket.on("listening", () => {           
            socket.addMembership(MULTICAST_ADDR);
            //TODO: from config, broadcasting every 10sec
            setInterval(sendMessage, 10000);
            let address = socket.address();
            debugudp(`UDP socket listening on ${address.address}:${address.port} pid: ${process.pid}`, "INFO");
        });        
        socket.on("message", (message, rinfo) => {
            let remoteConfig = JSON.parse(message);
            module.exports.registerMachine(remoteConfig, rinfo.address);
            debugudp(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
        });
    }