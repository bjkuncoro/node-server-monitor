var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sippmantap',
  database : 'cetak_kartu'
});
var app = express();

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});

app.get("/prodi",function(req,res){
connection.query('SELECT * from fakultas', function(err, data) {
// connection.end();
  if (!err)
    // console.log('The solution is: ', rows);
    return res.json({status:'200',message:'success',result:data});
  else
    console.log('Error while performing Query.');
  });
});

app.get("/prodi/:id",function(req,res){
connection.query('SELECT * from prodi where id = ?',[req.params.id], function(err, data) {
// connection.end();
  if (!err)
    // console.log('The solution is: ', rows);
    return res.json({status:'200',message:'success',result:data});
  else
    console.log('Error while performing Query.');
  });
});

app.listen(3080);
