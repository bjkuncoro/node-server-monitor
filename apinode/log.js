var http = require('http');
var accesslog = require('access-log');
 
http.createServer(function(req, res) {
  var format = 'url=":url" host=":host" method=":method" statusCode=":statusCode" delta=":delta" ip=":ip"';
 
	accesslog(req, res, format, function(s) {
  		console.log(s);
	});
  res.end();
}).listen(2222, '127.0.0.1');
