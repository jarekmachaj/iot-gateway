var path = require('path');
var configPath = path.join(__dirname, '..', 'config', 'config.json');
var fs = require("fs");
const ipHelper = require('./ip-helper');

var config = {};

function loadConfig(config){
    let configJson = fs.readFileSync(configPath);
    configJson = JSON.parse(configJson.toString()); 
    config.hostname = configJson.hostname; 
    config.machineName = configJson.machineName;    
    config.ip = ipHelper.getIps().length > 0 ? ipHelper.getIps()[0] : "(null)";
    config.apiUrl = `http://${config.ip}/api`;  
}

loadConfig(config);


module.exports = config;