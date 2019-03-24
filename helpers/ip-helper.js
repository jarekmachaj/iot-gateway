var os = require('os');
var ifaces = os.networkInterfaces();
var debug = require('debug')('app');

var ipArr = [];

function getIp() {
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

module.exports = {
    getIps : function () {
        if (ipArr && ipArr.length > 0) {
            console.log(ipArr);
            return ipArr;
        }    
        ipArr = getIp();
        debug(ipArr);
        return ipArr;
    }
}