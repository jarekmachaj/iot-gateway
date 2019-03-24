var express = require('express');
var router = express.Router();
var loggedMachines =  require('memory-cache');
var endOfLine = require('os').EOL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/machines', function(req, res, next){  
  res.json(loggedMachines.exportJson());
});

module.exports = router;
