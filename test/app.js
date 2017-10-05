var Monitor   = require('../lib/monitor');
var os        = require ('os');
var tcpp      = require('tcp-ping');
var dateTime  = require('node-datetime');
var si        = require('systeminformation');
var fsPath    = require('fs-path');
var server    = require('http').createServer(handler);
var io        = require('socket.io')(server);
var fs        = require('fs');
var express   = require('express');
var ostb      = require( 'os-toolbox' );
var app       = express();
var router    = express.Router(); 
/* Setting port di 8888 */
server.listen(1111);

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

//log
var obj = {
  logs: []
};

//log


/* Jika socket dalam keadaan terhubung */
io.on('connection', function (socket) {
  /* Kirim data ke client tapi bukan pesan broadcast */
  // socket.emit('data_server', { pesan : 'Halo dari server' });
    // var ping2 = new Monitor({website: 'http://203.24.50.67/prodi', interval: 0.05});
  var cpuusage;
  var memusage;
  setInterval(function(){
    tcpp.ping({ address: '203.24.50.67' }, function(err, data) {
      console.log(data);     
      if(data.max == undefined){
        console.log("host mampos");
        socket.emit('data_status', { pesan : 404 }); 
        ostb.cpuLoad().then(function(data){
          console.log("cpu :"+data+"%");
          cpuusage = data;
          socket.emit('data_cpu', { cpu :cpuusage });
        });
        ostb.memoryUsage().then(function(data){
          memusage = data;
          console.log("memori :"+memusage+"%");
          socket.emit('data_mem', { mem :memusage,loadavg:os.loadavg() });
        }); 
        logger.error({cpu :cpuusage,mem :memusage,loadavg:os.loadavg()});                
      }else{
        console.log("host nyala");
        socket.emit('data_status', { pesan : 1 });        
        ostb.cpuLoad().then(function(data){
                cpuusage = data;
                console.log("cpu :"+cpuusage+"%");
                socket.emit('data_cpu', { cpu :cpuusage });        
        });
        ostb.memoryUsage().then(function(data){
                memusage = data;
                console.log("memori :"+memusage+"%");
                socket.emit('data_mem', { mem :memusage,loadavg:os.loadavg() });
                
        });
        si.networkStats('lo',function(data){
          console.log(data.rx_sec/1000+'kb');
          console.log(data.tx_sec/1000+'kb');
          socket.emit('data_bandwidth', { rx :data.rx_sec/1000,tx:data.tx_sec/1000 });          
        });
        // logger.info({cpu :cpuusage,mem :memusage,loadavg:os.loadavg()}); 
        var dt      = dateTime.create();
        var waktu   = dt.format('d-m-Y H:M:S');
        var tanggal = dt.format('d-m-Y');
        var hour    = dt.format('H');
        console.log(waktu);
        obj.logs.push({time:waktu,cpu :cpuusage,mem :memusage,loadavg:os.loadavg()});
        var log = JSON.stringify(obj);
        var dir = __dirname+'/log/log '+tanggal+'';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        };
        var cekdir = dir+'/log-server('+tanggal+' '+hour+').json';
        if (!fs.existsSync(cekdir)){
          obj.logs.length = 0;
        };
        fs.writeFile(cekdir, log, 'utf8',function(err){
          if (err){throw err}else{
          console.log('log tersimpan');}
        });                    
      }
      });
      },1000);
    // ping2.on('up', function (res) {
    //     ostb.cpuLoad().then(function(cpuusage){
    //       console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent) 
    //       socket.emit('data_cpu', { cpu :cpuusage });
    //     });
    //     ostb.memoryUsage().then(function(memusage){
    //       console.log("memori :"+memusage+"%"); //ex: 93 (percent)
    //       socket.emit('data_mem', { mem :memusage,loadavg:os.loadavg() });
    //     });
    // console.log(res.website + " is mantap jiwa \n");  
    // socket.emit('data_status', { pesan : 1 });
    // });
    // ping2.on('down', function (res) {
    // ostb.cpuLoad().then(function(cpuusage){
    //       console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent) 
    //       socket.emit('data_cpu', { cpu :cpuusage });
    //     });
    // console.log(res);  
    // socket.emit('data_status', { pesan : 500 });
    // });
    // ping2.on('error', function (res) {
    //   ostb.cpuLoad().then(function(cpuusage){
    //       console.log("cpu :"+cpuusage+"%"); //ex: 34 (percent) 
    //       socket.emit('data_cpu', { cpu :cpuusage });
    //     });
    // console.log(res.website + " is Ancor lalu \n" + res.statusMessage);  
    // socket.emit('data_status', { pesan : 404 });
    // });
  /* Terima data dari client */
  socket.on('data_client', function (data) {
      console.log(data.pesan);
  });
  socket.on('disconnect',function(){
    console.log('You SUck!!');
    // ping2.stop();
  });
});

// app.use('/api',router);
console.log('Magic happens on port 1111' );
