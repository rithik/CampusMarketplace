var express = require("express")
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

var path = require('path');

app.get("/", function(req, res){
    var testHtmlPath = path.resolve(__dirname,'..','templates','messages.html');
    res.sendFile(testHtmlPath);
})

app.listen(process.env.PORT,process.env.IP, function(){
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.emit('some event', { for: 'everyone' });



io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
