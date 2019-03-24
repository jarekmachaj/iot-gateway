function logger(){}

logger.prototype.settings = {
    logging: false
}

logger.prototype.log = function(msg, logType){
    if (this.settings.logging == false) return;

    switch (logType) {
        case "INFO" : console.log("INFO:", msg); break;
        case "WARN" : console.log("\x1b[1;33mWARNING:", "\x1b[37m" + msg + "\x1b[m"); break;
        case "ERROR" : console.log("\x1b[1;31mERROR:", "\x1b[37m" + msg + "\x1b[m"); break;
        default : console.log(msg); break;
    }
}

var instance  = new logger();

module.exports = instance;
