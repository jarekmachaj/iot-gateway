var os = require('os');
const { exec } = require('child_process');

module.exports.read = () =>  { 
    return os.networkInterfaces(); 
}

module.exports.sleep = () => {
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
    return {result : 'success'};
}