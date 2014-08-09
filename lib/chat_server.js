function createChat(server) {
  // this function starts with some initial objects and data for the server,
//   like , but then it primarily sets up event listeners on the sockets
//
  var guests = {};
  var guestnumber = 1;
  var nicknames = {};
  var currentRooms = {};
  var roomMembers = {};
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
      io.sockets.in(currentRooms[socket.id]).emit('messageForUI', {
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
        message: "Your name changed from " + oldname + " to " + data.nickname
      })
    })
    
    socket.on('displayRoom', function () {

      var myRoom = currentRooms[socket.id];
      socket.emit('showRoom', {
        room: myRoom
        
      })
    })
    
    socket.on('roomChangeRequest', function(data) {
      socket.leave(currentRooms[socket.id])
      var currentName = nicknames[socket.id];
      var room = data.room
      joinRoom(socket, room);
      
      socket.emit('roomChanged', {
        message: "You have moved to " + room,
        room: room,
        person: currentName
                        
      })

    })
    
    
    socket.on('disconnect', function() {
      var nick = nicknames[socket.id];
      io.sockets.in(currentRooms[socket.id]).emit('soLong', {
        text: 'Note: ' + nick + ' has left the room.'
      });
      delete nicknames[socket.id];
      delete currentRooms[socket.id];
    })
    
    
    
    
    
    
    
    
    
    
  })
  
  
  
  function joinRoom(socket, room) {
    socket.join(room);
    currentRooms[socket.id] = room;
  }



}





module.exports.createChat = createChat;