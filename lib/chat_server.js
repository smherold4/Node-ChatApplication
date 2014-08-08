function createChat(server) {
  // this function starts with some initial objects and data for the server,
//   like , but then it primarily sets up event listeners on the sockets
//
  var guests = {};
  var guestnumber = 1;
  var nicknames = {};
  var currentRooms = {};
  var io = require('socket.io').listen(server); // check this
  
  io.sockets.on('connection', function (socket) {
    
    var nick = nicknames[socket.id] = "guest_" + guestnumber++;
    
    joinRoom(socket,'lobby');
    socket.emit('welcomeUI', {
      room: 'lobby',
      nickname: nick
    })
    socket.on('userInput', function(data) {
      var myNick = nicknames[socket.id];
      io.sockets.emit('messageForUI', {
        text: data.message,
        person: myNick
      });
      // messageForUI is an event that triggers members' sockets, which are attributes of the'chatMembers found in chat_ui.js
    })
    socket.on('nicknameChangeRequest', function(data) {
      //working here, data simply has a nickname
      var oldname = nicknames[socket.id];
      nicknames[socket.id] = data.nickname;
      socket.emit('nickResponse', {
        message: "Your name changed from " + oldname + " to " + data.nickname + " by using (.)"
      })
    })
  })
  
  
  
  function joinRoom(socket, room) {
    socket.join(room);
    currentRooms[socket.id] = room;
  }



}





module.exports.createChat = createChat;