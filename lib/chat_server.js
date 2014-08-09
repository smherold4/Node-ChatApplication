function createChat(server) {
  // this function starts with some initial objects and data for the server,
//   like , but then it primarily sets up event listeners on the sockets
//
  var guests = {};
  var guestnumber = 1;
  var nicknames = {};
  var currentRooms = {};
  var roomList = ['lobby'];
  var roomMembers = {};
  roomMembers['lobby'] = {};
  var io = require('socket.io').listen(server); // check this
  
  io.sockets.on('connection', function (socket) {
    
    var socketId = socket.id
    var nick = nicknames[socketId] = "guest_" + guestnumber++;
    socket.join('lobby')
    currentRooms[socketId] = 'lobby';
    roomMembers['lobby'][socketId] = nick;
    socket.emit('welcomeUI', {
      room: 'lobby',
      nickname: nick
    })
    
    io.sockets.in('lobby').emit('showTheLists', {
      rooms: roomList,
      users: roomMembers['lobby']      
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
      var sockId = socket.id
      var oldroom = currentRooms[sockId];
      var newroom = data.room;
      
      if (oldroom !== newroom) {
      
      var myNick = nicknames[sockId];
      socket.leave(oldroom)
      delete roomMembers[oldroom][sockId];
      io.sockets.in(oldroom).emit('soLong', {
        text: myNick + ' has left ' + oldroom
      });
      
      currentRooms[sockId] = newroom;
      
      var isNewRoom = true;
      roomList.forEach( function(rm) {
        if (rm === newroom) {
          isNewRoom = false;
        }
      })
      
      if (isNewRoom) {
        roomMembers[newroom] = {};
        roomMembers[newroom][sockId] = myNick;
        roomList.push(newroom);
        io.sockets.emit('updateAllLists', {
          rooms: roomList
        })
      } else {
        roomMembers[newroom][sockId] = myNick
        
      } 
      
      socket.join(newroom);
      socket.emit('roomChanged', {
        room: newroom,
        newness: isNewRoom
      });
      
      io.sockets.in(oldroom).emit('updateUserList', {
        roomMemberData: roomMembers,
        room: oldroom
      })
      
      io.sockets.in(newroom).emit('updateUserList', {
        roomMemberData: roomMembers,
        room: newroom
      })
      
      
      } else {
       socket.emit('stayedIn', {
         room: oldroom
       }) 
        
      }

    })
   
    socket.on('disconnect', function() {
      var sockId = socket.id
      var roomLeft = currentRooms[sockId];
      var nick = nicknames[sockId];
      io.sockets.in(roomLeft).emit('soLong', {
        text: 'Note: ' + nick + ' has left the room.'
      });
      delete roomMembers[roomLeft][sockId]
      if (Object.keys(roomMembers[roomLeft]).length === 0 && (roomLeft !== 'lobby')) {
        delete roomMembers[roomLeft]; 
      }
      delete nicknames[sockId];
      delete roomLeft;
    })
    

    
  })
  

}


module.exports.createChat = createChat;