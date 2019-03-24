var path = require('path');
var configPath = path.join(__dirname, '..', 'config', 'config.json');
var fs = require("fs");
const ipHelper = require('./ip-helper');
var os = require("os");

var config = {};

function loadConfig(config){
    let configJson = fs.readFileSync(configPath);
    configJson = JSON.parse(configJson.toString()); 
    config.hostname = os.hostname(); 
    config.machineName = configJson.machineName;    
    config.internalIp = ipHelper.getIps().length > 0 ? ipHelper.getIps()[0] : "(null)";
    config.apiUrl = `http://${config.internalIp}/api`;  
}

loadConfig(config);


module.exports = config;