/*
TO DO: REAFACTOR!!!!!!! CLEAN UP!!
*/
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', 'config.json');
const fs = require("fs");
const configJson = fs.readFileSync(configPath);
const config = JSON.parse(configJson.toString()); 

module.exports.config = config;