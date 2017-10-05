var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 2020);
app.use(express.static('public'))
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
app.use('/laporan', express.static(path.join(__dirname + '/public/laporan.json')));
app.use('/status', express.static(path.join(__dirname + '/public/status.html')));

// menampilkan data berdasarkan req tanggal
app.get('/logs/:tanggal/:hour', function(req, res) {
    var tanggal = req.params.tanggal;
    var hour    = req.params.hour;
    var public  = __dirname + '/test/log/log '+tanggal+'';
    res.sendFile(path.join(public + '/log-server('+tanggal+' '+hour+').json'));
});


// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});