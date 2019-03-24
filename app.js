var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('app');

var flogger = require('fast-logger');
flogger.settings.logging = true;

var loggedMachines =  require('memory-cache');
const config = require(path.join(__dirname, 'helpers', 'configCache.js'));
//-- udp modules
const dgram = require("dgram");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//udp broadcast
var client = dgram.createSocket("udp4");
const PORT = 20000;
const MULTICAST_ADDR = "233.255.255.255";
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
console.log("HOST :" + config.hostname);
const broadcastMessage = Buffer.from(`${ JSON.stringify(config)}`);
socket.bind(PORT);
socket.on("listening", function() {
    socket.addMembership(MULTICAST_ADDR);
    //from config, broadcasting every 10sec
    setInterval(sendMessage, 10000);
    const address = socket.address();
    flogger.log(`UDP socket listening on ${address.address}:${address.port} pid: ${process.pid}`, "INFO");
});
function sendMessage() {  
  socket.send(broadcastMessage, 0, broadcastMessage.length, PORT, MULTICAST_ADDR, function() {
    flogger.log(`Sending message "${broadcastMessage}"`, "INFO");
  });  
}
socket.on("message", function(message, rinfo) {
  console.info(`Message from: ${rinfo.address}:${rinfo.port} - ${message}`);
});


module.exports = app;
