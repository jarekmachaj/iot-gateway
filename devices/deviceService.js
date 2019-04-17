const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson.toString()); 
const persistenceService = require('../systemServices/persistence');
const request = require('request');

module.exports.executeAction = async (deviceId, actionId, reqBody, callback) => {       
    let devices = persistenceService.getDevices();
    let actionDevices = devices.filter(device => device.id == deviceId).map(devicesWithActions => devicesWithActions.actions);    
    let merged = [].concat.apply([], actionDevices)
    let actionsToExecute = merged.filter(actionDevice => actionDevice.id == actionId);
    var results = [];
    var resultsPromises = [];
    actionsToExecute.forEach(actionToExecute => {
        if (actionToExecute.host == "self") {
            if (actionToExecute.customAction) {
                var customAction = require('./customActions/' + actionToExecute.customAction);
                var result = customAction[actionToExecute.id](reqBody);
                result.ip = actionToExecute.ip;
                results.push(result);
            }
        } else {
            var url = `${actionToExecute.protocol}://${actionToExecute.ip}:${actionToExecute.port}${actionToExecute.api}/devices/${actionToExecute.deviceId}/actions/${actionToExecute.id}`;
            console.log(`fetching ${url}`);
            resultsPromises.push(new Promise((resolve, reject) => {
                request( {url : url, method : 'POST', json: true}, (error, response, body)  => {
                    if (error) { 
                         console.log('error: ' + error);
                         reject(error);
                     };
                     body.ip = actionToExecute.ip;
                     resolve(body);         
                 }); 
            }));
            
        }
        
    });
    console.log('start promisow');
    await Promise.all(resultsPromises).then(function(values) {
        results = results.concat(values);
    });
    console.log('end promisow');
    console.log(results);
    callback(results);
}

module.exports.config = config;