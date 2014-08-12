var app = require('http').createServer(handler);
var fs = require('fs');
var nodeStatic = require('node-static');
var chatServer = require('./chat_server');

var fileServer = new nodeStatic.Server('./public');

var port = process.env.PORT || 8000;
chatServer.createChat(app);
app.listen(port);

function handler(request, response) {
  request.addListener('end', function() {
    fileServer.serve(request, response);
  }).resume();
}