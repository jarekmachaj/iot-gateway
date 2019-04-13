var wol = require('wake_on_lan');

module.exports.wake = (params, resultCallback) =>  { 
  wol.wake(params.macAddress);
  resultCallback("success");
}