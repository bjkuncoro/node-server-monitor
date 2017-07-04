var os = require ('os');
var usage = require('usage');
var ostb = require( 'os-toolbox' );
var monitor = require('os-monitor');
var si = require('systeminformation');

setInterval(function(){
ostb.cpuLoad().then(function(cpuusage){
   console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent) 
});

ostb.memoryUsage().then(function(memusage){
   console.log("memori :"+memusage+"%"); //ex: 93 (percent) 
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
// si.osInfo(function(data) {
//     console.log('memory usage');
//     console.log(data);
// });
},1000);
