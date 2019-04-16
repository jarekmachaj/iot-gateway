const debugudp = require('debug')('udp');
const dgram = require("dgram");

class UdpBroadcast {
    constructor(){
        this.broadcastedMessage = {};
        this.onMessageReceived = () => {};
        this.startUDPListenBroadcast = () => {
            const PORT = 20000;
            const MULTICAST_ADDR = "233.255.255.255";
            const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });        
            const sendMessage = () => {  
                var buff = Buffer.from(JSON.stringify(this.broadcastedMessage));
                socket.send(buff, 0, buff.length, PORT, MULTICAST_ADDR, () => { 
                debugudp(`Broadcasting ${this.broadcastedMessage}`)
                });  
            }    
            socket.bind(PORT);
            socket.on("listening", () => {           
                socket.addMembership(MULTICAST_ADDR);
                //TODO: from config, broadcasting every 10sec
                setInterval(sendMessage, 2000);
                let address = socket.address();
                debugudp(`UDP socket listening on ${address.address}:${address.port} pid: ${process.pid}`, "INFO");
            });        
            socket.on("message", (message, rinfo) => {
                let remoteConfig = JSON.parse(message);
                this.onMessageReceived(remoteConfig, rinfo.address);
                debugudp(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
            });
        }   
    }   
}


module.exports = new UdpBroadcast();