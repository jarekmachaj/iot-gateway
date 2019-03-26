const express = require('express');
const router = express.Router();
const machineService = require('./../machines/machineService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/machines', function(req, res, next){  
  res.json(machineService.recognizedMachines);  
});

module.exports = router;
