const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson.toString()); 

module.exports.executeAction = (action, callback) => {
        //local only for now
        if (action.customAction){
            var customAction = require('./customActions/' + action.customAction);
            var result = customAction[action.id](callback, action.params);
            return result;
        }
        return {"error" : "action not supported" };
}

module.exports.config = config;