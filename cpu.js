// var os = require ('os');
// var usage = require('usage');
// var ostb = require( 'os-toolbox' );
// var monitor = require('os-monitor');
// var si = require('systeminformation');
// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

// server.listen(1331);
// io.on('connection',function(socket){
//     app.use(function(req,res,next){
//         setInterval(function(){
//         ostb.cpuLoad().then(function(cpuusage){
//             // console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent)
//             socket.emit('data_cpu', { cpu :cpuusage });
//             app.locals.cpuusage = cpuusage;
//         });
//         // console.log(req.app.locals.cpuusage);
//         ostb.memoryUsage().then(function(memusage){
//         //    console.log("memori :"+memusage+"%"); //ex: 93 (percent) 
//             app.locals.memori = memusage;    
//         });

//         ostb.services().then(function (result) {
//         //    console.log(result); 
//         app.locals.service = result;
//         });

//         si.mem(function(data) {
//             // console.log(data);
//             app.locals.simemori = data;
            
//         });
//         si.cpu(function(data) {
//             // console.log(data);
//             app.locals.cpu = data;
//         });
//         var hasil = {
//                         cpuusage : req.app.locals.cpuusage+"%",
//                         memusage : req.app.locals.memori+"%",
//                         service  : req.app.locals.service,
//                         memori   : req.app.locals.simemori,
//                         cpuinfo  : req.app.locals.cpu,
//                         avgload  : os.loadavg(),
//                     }
//         console.log(hasil);
//         // res.send ({avgload:os.loadavg()});

//         },3000);
//     });
//     socket.on('disconnect',function(){
//     console.log('You SUck!!');
//   });
// });

// console.log("lakukan koneksi ke 1331");
var os = require ('os');
var usage = require('usage');
var ostb = require( 'os-toolbox' );
var monitor = require('os-monitor');
var si = require('systeminformation');
var os      = require ('os');
var server  = require('http').createServer(handler);
var io      = require('socket.io')(server);
var fs      = require('fs');
var express = require('express');
var app     = express();
var router  = express.Router(); 
/* Setting port di 8888 */
server.listen(1331);

// /* Ini adalah fungsi untuk penanganan membaca file html */
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/* Jika socket dalam keadaan terhubung */
io.on('connection', function (socket) {
        var cpuusage;
        var memori;
        var service;
        var simemori;
        var cpu;
        setInterval(function(req,res,app){
        ostb.cpuLoad().then(function(cpupercent){
            // console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent)
            cpuusage = cpupercent;           
        });
        ostb.memoryUsage().then(function(memusage){
            // console.log("memori :"+memusage+"%"); //ex: 93 (percent) 
            memori = memusage;    
        });

        ostb.services().then(function (result) {
            // console.log(result); 
            service = result;
        });

        si.fullLoad(function(data) {
            // console.log(data);
            simemori = data;
            
        });
        si.cpu(function(data) {
            // console.log(data);
            cpu = data;
        });
        var hasil = {
                        cpuusage : cpuusage+"%",
                        memusage : memori+"%",
                        service  : service,
                        memori   : simemori,
                        cpuinfo  : cpu,
                        avgload  : os.loadavg(),
                    }
        console.log(hasil);
        socket.emit('data_server',hasil);
        // res.send ({avgload:os.loadavg()});

        },3000);
    socket.on('disconnect',function(){
    console.log('You SUck!!');
  });
    console.log("nah looo nyambung !!!");
});


// app.use('/api',router);
console.log('Magic happens on port 1331' );
