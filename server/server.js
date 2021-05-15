var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mysql = require('mysql')
var bodyParser = require('body-parser');
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));
const connection = mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "123456",
      database: "pictures"
})

connection.connect(function(error){
      if(error) console.log(error);
      else console.log("connected");
});

app.get('/user', function(req, res){
      res.header('Access-Control-Allow-Origin', '*');
      connection.query('select * from pictures', function(error, rows, fields){
            if(error) console.log(error);
    
            else{
                console.log(rows);
                res.send(rows);
    
            }
    
      });
    });

io.on('connection', (socket)=> {
      console.log('User Online');

      socket.on('canvas-data', (data)=> {
            socket.broadcast.emit('canvas-data', data);
            
      })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})