(function(root) {
  
  var Chat = root.Chat = function(socket) {
    this.socket = socket;

    
    
    
  }
  
  Chat.prototype.sendMessage = function(textData) {
   
    this.socket.emit('userInput', { //has below is emitted to server which then decides what to do with it in the userInput event listener
      message: textData
      });
  }
  

  
  
  
  Chat.prototype.changeNick = function(nickname) { //an action the user can take
    this.socket.emit('nicknameChangeRequest', { nickname: nickname });
  };//sends event to the server called nicknameChangeRequest with the data hash shown
  
  Chat.prototype.changeRoom = function (userInput) {
    this.socket.emit('roomChangeRequest', {
      room : userInput,
    }) 
  }
  
  Chat.prototype.triggerRoomDisplay = function () {

    this.socket.emit('displayRoom', {})
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
})(this);