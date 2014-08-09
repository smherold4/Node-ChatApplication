$(function () {
  var newSocket = io()
  var chatMember = window.chatMember = new Chat(newSocket) 
  chatMember.socket.on('welcomeUI', hearWelcome)
  chatMember.socket.on('messageForUI', displayMessage);
  chatMember.socket.on('nickResponse', displayNick);
  chatMember.socket.on('soLong', displayGoodbye);
  chatMember.socket.on('roomChanged', displayMove)
  chatMember.socket.on('showRoom', dispRoom)
  chatMember.socket.on('showTheLists', displayLists)
  chatMember.socket.on('updateRoomList',displayLists)
  chatMember.socket.on('stayedIn', dispStayed)
  chatMember.socket.on('updateUserList', displayUsers)
  
  
  $('#message_form').on('submit', function(event) {
    event.preventDefault();
    var input = getInput();
    if (input[0] === "#") {
      console.log("name change")
      input = input.slice(1)
      chatMember.changeNick(input);
    } else if (input === "clear" || input === "Clear") {
      $("#messages").html('')
    } else if (input === "where" || input === "Where") {
      chatMember.triggerRoomDisplay();
      
    } else if (input[0] === "@") {
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
  $('#messages').html('')
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
  console.log(data.room);
  console.log(data.newness)
  $('#messages').html('')
  $li = $('<li>');
  
  if (data.newness) {
    $li.text("You created a new room called " + data.room)
  } else {
    $li.text("You moved into an existing room called " + data.room)
  }
  $('#messages').append($li);
  
  
}

function dispRoom(data) {

  $li = $('<li>');
  $li.text("You are in " + data.room);
  $('#messages').append($li);
 
}


function dispStayed(data) {

  $li = $('<li>');
  $li.text("You remain in " + data.room);
  $('#messages').append($li);
 
}


function displayLists(data) {
  var roomsArr = data.rooms;
  $('#room_list').text('')
  roomsArr.forEach (function (rm) {
    $li = $('<li>');
    $li.text(rm);
    $('#room_list').append($li);
    
  })
  
  if (data.users) {
    var membersHash = data.users;
     $('#user_list').text('');
    for (var userId in membersHash) {
      $li = $('<li>');
      $li.text(membersHash[userId]);
      $('#user_list').append($li);
    }
  }
  
  if (data.vacated) {
    $li = $('<li>');
    $li.text("Note: The room called " + data.vacated + " has been vacated and removed.") 
    $('#messages').append($li);
  }

}

function displayUsers(data) {
  var memberHash = data.roomMemberData[data.room];
  $('#user_list').text('');
  for(var id in memberHash) {
    $li = $('<li>');
    $li.text(memberHash[id]);
    $('#user_list').append($li);
  }
    
}


