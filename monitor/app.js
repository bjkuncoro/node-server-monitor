
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
/* Setting port di 1111 */
var port    = 1111;
server.listen(port);

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
  var cpuusage;
  var memusage;
  var prime_monitor = setInterval(function(){
    tcpp.ping({ address: '203.24.50.67',port :81 }, function(err, data) {
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
                // console.log(os.platform());
                console.log("memori :"+memusage+"%");
                socket.emit('data_mem', { mem :memusage,loadavg:os.loadavg() });
                
        });
        si.networkStats('lo',function(data){
          console.log(data.rx_sec/1000+'kb');
          console.log(data.tx_sec/1000+'kb');
          socket.emit('data_bandwidth', { rx :data.rx_sec/1000,tx:data.tx_sec/1000 });          
        });
        si.osInfo(function(data){
          // console.log(data);
          // console.log(os.uptime()/3600);          
          // console.log(os.cpus());  
          console.log('Nahhhhh yang iniiiiii   '+os.uptime());        
          socket.emit('os_info',{os_arch:os.cpus(),uptime:os.uptime()/3600,os_info:data,os_totalmem:os.totalmem(),host:os.networkInterfaces()})    
        });
        var dt      = dateTime.create();
        var waktu   = dt.format('d-m-Y H:M:S');
        var tanggal = dt.format('Y-m-d');
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
  /* Terima data dari client */
  socket.on('data_client', function (data) {
      console.log(data.pesan);
  });
  socket.on('disconnect',function(){
    console.log('You SUck!!');
    clearInterval(prime_monitor);
  });
});

// app.use('/api',router);
console.log('Magic happens on port '+port );
