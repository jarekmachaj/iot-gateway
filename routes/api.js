const express = require('express')
const router = express.Router();
const debug = require('debug')('app');
const machineService = require('./../machines/machineService');

  router.get('/', function(req, res, next) {
    res.send('API');
  });

  router.get('/discovery', function(req, res, next) {
    res.json(machineService.config);
  });

  router.post('/register', function(req, res, next){
    debug(req.ip.split(`:`).pop());
    var ip = req.connection.remoteAddress;
    debug(`Registering ${ip}`)
    debug(req.body);
    machineService.registerMachine(req.body, ip);
    res.json({"message" : `machine ${ip} added`});
  });

  router.get('/devices', function(req, res, next) {
    res.json(machineService.config.devices);
  });

  router.get('/devices/:deviceId', function(req, res, next) {
    var deviceId = req.params.deviceId;
    var device = machineService.config.devices.find(device => device.id == deviceId);
    res.json(device);
  });

  router.get('/devices/:deviceId/actions', function(req, res, next) {
    var deviceId = req.params.deviceId;
    var device = machineService.config.devices.find(device => device.id == deviceId);
    res.json(device.actions);
  });

  router.get('/devices/:deviceId/action/:actionId', function(req, res, next) {
    res.send("not implemented");
  });

  module.exports = router