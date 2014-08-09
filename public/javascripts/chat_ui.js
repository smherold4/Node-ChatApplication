$(function () {
  var newSocket = io()
  var chatMember = window.chatMember = new Chat(newSocket) 
  chatMember.socket.on('welcomeUI', hearWelcome)
  chatMember.socket.on('messageForUI', displayMessage);
  chatMember.socket.on('nickResponse', displayNick);
  chatMember.socket.on('soLong', displayGoodbye);
  chatMember.socket.on('roomChanged', displayMove)
  chatMember.socket.on('showRoom', dispRoom)
  
  
  
  $('#message_form').on('submit', function(event) {
    event.preventDefault();
    var input = getInput();
    if (input[0] === ".") {
      console.log("name change")
      input = input.slice(1)
      chatMember.changeNick(input);
    } else if (input === "where" || input === "Where") {
      chatMember.triggerRoomDisplay();
      
    } else if (input[0] === "$") {
      input = input.slice(1)
      chatMember.changeRoom(input)
    
    } else {
      chatMember.sendMessage(input);
    }
  });
  
})


function displayMessage(data) { //you can see in the chat server that the 'messageForUI sends a hash, which is passed to this callback function (just imagine we used this function as a nameless callback above.)
  $li = $('<li>');
  var formattedMessage =  data.person + ": " + data.text;
  $li.text(formattedMessage);
  $('#messages').append($li);
}

function getInput() {
  var msg = $('#message_input').val();
  $('#message_input').val('');
  return msg;
}

function displayNick(data) {
  $li = $('<li>');
  $li.text('Note: ' + data.message);
  $('#messages').append($li);
}

function hearWelcome(data) {
  $li = $('<li>');
  $li.text('Welcome, ' + data.nickname + ' to ' + data.room);
  $('#messages').append($li);
}

function displayGoodbye(data) {
  $li = $('<li>');
  $li.text(data.text);
  $('#messages').append($li);
}

function displayMove(data) {
  $li = $('<li>');
  $li.text(data.message);
  $('#messages').append($li);
  
  
}

function dispRoom(data) {

  $li = $('<li>');
  $li.text("You are in " + data.room);
  $('#messages').append($li);
 
}

Object.prototype.getVals = function () {
  var vals = [];
  for (key in this) {
    if this.hasOwnProperty(key) {
      vals.push(this[key]);
    }  
  }
  return vals;
  
}
