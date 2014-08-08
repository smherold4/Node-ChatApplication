$(function () {
  var newSocket = io()
  var chatMember = window.chatMember = new Chat(newSocket) 
  chatMember.socket.on('welcomeUI', hearWelcome)
  chatMember.socket.on('messageForUI', displayMessage);
  chatMember.socket.on('nickResponse', displayNick);
  
  
  
  $('#message_form').on('submit', function(event) {
    event.preventDefault();
    var input = getInput();
    if (input[0] === ".") {
      console.log("name change")
      input = input.slice(1)
      chatMember.changeNick(input);
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
  $li.text('SERVER: ' + data.message);
  $('#messages').append($li);
}

function hearWelcome(data) {
  $li = $('<li>');
  $li.text('Welcome, ' + data.nickname + ' to ' + data.room);
  $('#messages').append($li);
}
