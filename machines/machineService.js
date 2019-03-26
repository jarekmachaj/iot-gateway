const os = require("os");
const ifaces = os.networkInterfaces();
const debug = require('debug')('app');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const dgram = require("dgram");

class MachineService {
    
    constructor(){
        let configJson = fs.readFileSync(configPath);
        this.config = JSON.parse(configJson.toString()); 
        let ips = this._getIp();
        this.ip = ips[0];
        this.internalIp = ips[0];
        this.id = this.config.id;   
        this.hostName = os.hostname();
        this.recognizedMachines = {};
        this.mode = "server";  
    }

    get configToBroadcast(){
        return {
            id : this.id, ip : this.ip, internalIp : this.internalIp, hostname : this.hostName, 
            mode : this.mode, timeStamp : new Date(new Date().toUTCString())
        }
    }

    _getIp (){
        var ips = [];
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

    registerMachine(machine, machineIp){
        if (machineIp) machine.ip = machineIp;
        this.recognizedMachines[machine.id] = machine;
    }

    startUDPListenBroadcast(){
        var self = this;
        const PORT = 20000;
        const MULTICAST_ADDR = "233.255.255.255";
        const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
        socket.bind(PORT);
        socket.on("listening", () => {
            socket.addMembership(MULTICAST_ADDR);
            //TODO: from config, broadcasting every 10sec
            setInterval(sendMessage, 10000);
            const address = socket.address();
            debug(`UDP socket listening on ${address.address}:${address.port} pid: ${process.pid}`, "INFO");
        });
        function sendMessage() {  
            var broadcastMessage = Buffer.from(`${ JSON.stringify(self.configToBroadcast)}`)
            socket.send(broadcastMessage, 0, broadcastMessage.length, PORT, MULTICAST_ADDR, () => { 
                debug(`Broadcasting ${broadcastMessage}`)
             });  
        }
        socket.on("message", (message, rinfo) => {
            var remoteConfig = JSON.parse(message);
            remoteConfig.ip = rinfo.address;
            self.registerMachine(remoteConfig);
            debug(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
        });
    }
}

module.exports = new MachineService();