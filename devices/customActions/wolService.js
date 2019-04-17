var wol = require('wake_on_lan');

module.exports.wake = (params) =>  { 
  wol.wake(params.macAddress, {address : params.ipAddress});
  return {result : 'success'} ;
}