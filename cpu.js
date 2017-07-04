var os = require ('os');
var usage = require('usage');
var ostb = require( 'os-toolbox' );
var monitor = require('os-monitor');
var si = require('systeminformation');

var pid = process.pid // you can use any valid PID instead
var options = {keepHistory : true}
usage.lookup(pid,options, function(err, result) {
// console.log(os.cpus());
});

// console.log(ostb.uptime());
ostb.cpuLoad().then(function(cpuusage){
   console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent) 
});

ostb.memoryUsage().then(function(memusage){
   console.log("memori :"+memusage+"%"); //ex: 93 (percent) 
}, function(error){
    //errors here 
});
// var sort = { 
//        type: 'cpu', 
//        order: 'desc'
//     };
// ostb.currentProcesses(sort).then(function(processes){
//     console.log(processes);
// }, function(error){
//     //errors here 
// });

ostb.services().then(function (result) {
//    console.log(result);
}, function(error){
    //errors here 
});

si.currentLoad(function(data) {
    console.log('CPU-Information:');
    console.log(data);
});
si.mem(function(data) {
    console.log('cpu speed');
    console.log(data);
});
si.osInfo(function(data) {
    console.log('memory usage');
    console.log(data);
});