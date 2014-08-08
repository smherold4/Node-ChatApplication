var app = require('http').createServer(handler);
var fs = require('fs');
var nodeStatic = require('node-static');
var chatServer = require('./chat_server');

var fileServer = new nodeStatic.Server('./public');

chatServer.createChat(app);
app.listen(8000);

function handler(request, response) {
  request.addListener('end', function() {
    fileServer.serve(request, response);
  }).resume();
}