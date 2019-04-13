var os = require('os');
const { exec } = require('child_process');

module.exports.read = (resultCallback) =>  { 
    resultCallback(os.networkInterfaces()); 
}

module.exports.sleep = (resultCallback) => {
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
    resultCallback({result : 'success'});
}