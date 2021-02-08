import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import io from 'socket.io-client'
import { createARoom } from './requests/createRoom'
import { deleteARoom } from './requests/deleteRoom'

import { displayHelp } from './requests/displayHelp'
import { changeNick } from './requests/changeNick'
import { getRooms } from './requests/getRooms'
import { getMessages } from './requests/getRoomMessages'


let socket
const url = "http://localhost:4000"

function App() {


  const initiateSocket = (room) => {
    socket = io.connect(url)
    
    if (socket && room) socket.emit('join', {room, oldRoom: false})
  }

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState('#000000')
  const [chat, setChat] = useState([])
  const [users, setUsers] = useState({})
  const [typing, setTyping] = useState([])
  const [rooms, setRooms] = useState()
  const [currentRoom, setCurrentRoom] = useState('GENERAL')

  const generalRoom = ('GENERAL');
  const output = document.getElementById('output')
  const chatWindow = document.getElementById('chat-window')

  let arrayName = [];
  let timer;
  let timerInArray;
  let typer = "";
  let roomName


  const onColorChange = (e) => {
    setColor(e.target.value)
  }

  const onNameChange = (e) => {
    setName(e.target.value);
  }

  const onMessageChange = (e) => {
    if (name !== '') {
      socket.emit('typing', {name, currentRoom})
    }
    setMessage(e.target.value)
  }


  const onMessageSubmit = e => {
    e.preventDefault()
    
    let roomName = ""
    if (message[0] === "/") {
      switch (message.split(' ')[0]) {
        case '/help': 
          displayHelp()
          setMessage('')
        break;

        case '/nick': 

        let newName = changeNick({
            socket : socket,
            name : name,
            message : message,
            id : socket.id,
            currentRoom : currentRoom
          })
          setName(newName)
          setMessage('')
          break;

        case '/list': 
          getRooms(url).then( (result) => {
            setRooms(result)
            setChat(prevChat => [...prevChat, { name: 'System', message: 'Available Channels', color: 'green', type: 'list' }])
            setMessage('')
            })
          .catch( (err) => {
              console.log(`============= ERROR /list =========================`)
              console.log(err)
            })

          break;

        case '/create': 
          roomName = message.slice(8)
          createARoom(url, roomName).then((res) => {
            setChat(prevChat => [...prevChat, { name: 'System', message: res, color: 'red', type: 'join' }])
            setMessage('')
          })
          break;

        case '/delete': 
          roomName = message.slice(8)
          deleteARoom(url, roomName).then((res) => {
            setChat(prevChat => [...prevChat, { name: 'System', message: res, color: 'red', type: 'join' }])
            setMessage('')
          })
          break;

        case '/join':
          let newRoom = message.slice(6)

          if(name != ''){ // Check if name exist
            if(rooms === undefined)
            setChat(prevChat => [...prevChat, { name: 'System', message: 'Please, type /list to update the list of rooms!', color: 'red', type: 'join' }])
      
            else if (rooms.includes(newRoom)) {
              socket.emit('join', {room: newRoom, oldRoom: currentRoom, userName: name})
              setCurrentRoom(newRoom)
              getMessages(url, newRoom).then((result) => {
                setChat( prevChat => [...prevChat, ...result, { name: 'System', message: `Connection to ${newRoom} successful`, color: 'green', type: 'join' }])
              })

            }
            else 
              setChat(prevChat => [...prevChat, { name: 'System', message: 'No such room', color: 'red', type: 'join' }])
              
            setMessage('')
          }
          else {
            output.innerHTML += '<p><strong style="color : red;">System : </strong>You must to choose a nickname using /nick command before typing a message.</p>';
            setMessage('')
          }
          break;

        case '/quit': roomName = message.slice(6)

          if(currentRoom != roomName) 
            setChat(prevChat => [...prevChat, { name: 'System', message: `You can't leave a room where you aren't`, color: 'red', type: 'join' }])
          
          else {
            socket.emit('quit',{ room : currentRoom, userName: name })
            setChat(prevChat => [...prevChat, { name: 'System', message: `You leaved "${roomName}" room`, color: 'green', type: 'join' }])
            setCurrentRoom('GENERAL')
          }
          setMessage('')
          break;

        case '/users': 
          socket.emit('users', {room: currentRoom}); 
          setMessage('')
          break;

        case '/msg':
          if (name !== '') {
            let destinataire = message.split(' ')[1];
            let msg = message.split(' ')[2] + ' '
            for(let i=3; i < message.split(' ').length; i++){
              msg += message.split(' ')[i] + ' '
            }
  
            socket.emit('private', {
            color : "pink",
            destName : destinataire,
            name : name,
            message : " (private message): " + msg,
            room : currentRoom
            });
          }
          else {
            output.innerHTML += '<p><strong style="color : red;">System : </strong>You must to choose a nickname using /nick command before sending a private message.</p>';
          }
          setMessage('')
          break;

        default: 
          output.innerHTML += '<p><strong style="color : ' + color.value + ';">System</strong>: Invalid command, type /help to see the commands availables.</p>';
      }
    } 
    else {

      if(name != ''){
        socket.emit('message', { name, message, color, currentRoom })
        setMessage('')
      }
      else {
        output.innerHTML += '<p><strong style="color : red;">System : </strong>You must to choose a nickname using /nick command before typing a message.</p>';
        setMessage('')
      }
    }
  }

  // add message to chat at rerender
  const displayChat = () => {
    return chat.map(({ name, message, color, type }, index) => {
      switch (type) {
        case 'list':
          return (
            <div key={index} style={{ color: color }}>
              <p><strong style={{ color: color }}>{name}: </strong><span>{message}</span></p>
              <ul>
                { rooms.map((name, i) => (<li key={i} style={{ color: color }}>{name}</li>)) }
              </ul> 
            </div>
          )

          case 'users':
          return (
            <div key={index} style={{ color: color }}>
              <p><strong style={{ color: color }}>{name}: </strong><span>{message}</span></p>
              <ul>
                { users.map((name, i) => (<li key={i} style={{ color: color }}>{name}</li>)) }
              </ul> 
            </div>
          )
        
        case 'join':
          return (
            <p key={index} style={{ color: color }}>
              <strong>{name}: </strong><span>{message}</span>
            </p>
          )

        default:
          return (
            <p key={index}>
              <strong style={{ color: color }}>{name}: </strong><span>{message}</span>
            </p>
          )
      }
    }) 
  }

  const displayTyping = () => {
    return typing.map(({ typer, color }, index) => (
      <p key={index}>
        <strong><em style={{ color: color }}>{typer}</em></strong>
      </p>
    ))
  }
  
  useEffect(() => {
    initiateSocket('GENERAL')
    getMessages(url, 'GENERAL').then((result) => {
      setChat(result)
    })

    socket.on('message', ({ name, message, color}) => {

      setChat(prevChat => [...prevChat, { name, message, color }])
    })
    socket.on("typing", function (data) {
        function userExists(data) {
            return arrayName.some(function (el) {
                return el === data;
            });
        }
        function pushInArray(data) {
            if (userExists(data) != true) arrayName.push(data);
            else {
                for (let i = 0; i < arrayName.length; i++) {
                    if (arrayName[i] === data) arrayName.splice(i, 1);
                }
                arrayName.push(data);
            }
        };
        function setTime() {
            for (let i = 0; i < arrayName.length; i++) {
                
                timerInArray = setTimeout(function () {
                    arrayName.shift();
                }, 2000);
            }
        }
        pushInArray(data);
        setTime();
        if(arrayName.length===1)typer=arrayName[0]+" is typing a message...";
        else if(arrayName.length===2)typer=arrayName[0] + " and " + arrayName[1] +" are typing a message...";
        else if(arrayName.length>2)typer="Many peoples are typing a message...";
        setTyping(prevTyper => [prevTyper, { typer, color:"grey" }])
    
        clearTimeout(timer);
        timer = setTimeout(function () {
            setTyping([]);
        }, 3000);
    })
    socket.on('changeName', ({ name, message, color, id }) => {
      setChat(prevChat => [...prevChat, { name, message, color }])
      if(message != " is disconnected!"){
        setUsers(name , id)
      }
    })
    socket.on('private', ({ name, message, color }) => {
      setChat(prevChat => [...prevChat, { name, message, color }])
    })
    socket.on('users', userNameArray => {
      setUsers(userNameArray)
      setChat(prevChat => [...prevChat, { name: 'System', message: 'user(s) in this Channel', color: 'green', type: 'users' }])
    })
  }, [])



  return (
    <div className="App">
      <div id="mario-chat">

        <div id="chat-window">
          <div id="output">{displayChat()}</div>
          <div id="feedback">{displayTyping()}</div>
        </div>

        <form onSubmit={onMessageSubmit}>
          <input
            onChange={e => onColorChange(e)}
            id="color"
            type="color"
            placeholder="blue"
            value={color} />

          <TextField
            onInput={e => onNameChange(e)}
            value={name}
            name="name"
            label="Name"
            variant="filled"
            fullWidth
            margin="dense" />

          <TextField
            onInput={e => onMessageChange(e)}
            value={message}
            name="message"
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal" />

          <button>Send Message</button>
        </form>

      </div>
    </div>
  );
}

export default App;
