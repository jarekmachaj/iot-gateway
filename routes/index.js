var express = require('express');
var router = express.Router();
var loggedMachines =  require('memory-cache');
var endOfLine = require('os').EOL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/machines', function(req, res, next){  
  var machines = [];
  loggedMachines.keys().forEach(key => {
    var machine = loggedMachines.get(key);
    machines.push( {'machineName': machine.machineName, 'ip' : machine.ip, 'timeStamp' : machine.timeStamp });
  });
  res.render('machines', { title: 'Machines', machines : machines } );
});



module.exports = router;
