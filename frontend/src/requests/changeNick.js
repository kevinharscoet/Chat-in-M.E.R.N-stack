

const changeNick = ({socket, name, message, id, currentRoom}) => {
    const output = document.getElementById('output')

    let newName = message.slice(6) + '#' + id.slice(0,4)

    if(name !== ''){
        socket.emit('changeName', {
          color : "grey",
          name : 'System ',
          user : name,
          message :  name +' is disconnected!',
          disconnect : true,
          currentRoom : currentRoom,
          id : id
        })
        socket.emit('changeName', {
          color : "grey",
          name : 'System ',
          newName :newName,
          message : newName +' is connected!',
          pseudo : newName,
          currentRoom : currentRoom,
          id : id
        })
        output.innerHTML += '<p><em style="color:grey;">Your nickname is now ' + message.slice(6) + '!';
      }
      else {
        socket.emit('changeName', {
          color : "grey",
          name : 'System ',
          newName : newName,
          message : newName +' is connected!',
          currentRoom : currentRoom,
          id : id
        })
        output.innerHTML += '<p><em style="color:grey;">Your nickname is now ' + message.slice(6) + '!';
      }

      return newName
     }

module.exports = { changeNick }