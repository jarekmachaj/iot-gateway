var wol = require('wake_on_lan');

module.exports.wake = (resultCallback, params) =>  { 
  wol.wake(params.macAddress);
  resultCallback({result : 'success'});
}