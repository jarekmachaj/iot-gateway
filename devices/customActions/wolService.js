var wol = require('wake_on_lan');

module.exports.wake = (resultCallback, params) =>  { 
  try {
    wol.wake(params.macAddress, {address : params.ipAddress});
  } catch (ex){
    resultCallback({result : 'fail', exception : ex.toString()});  
    return;
  }
  resultCallback({result : 'success'});
}