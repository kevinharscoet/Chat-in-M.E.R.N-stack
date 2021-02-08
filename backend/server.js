const express = require("express");
const cors = require('cors');
const { connectionToDB } = require('./connectionMongo')
const Room = require('./models/room')

// Router
let createRoom = require('./routes/createRoom')
let deleteRoom = require('./routes/deleteRoom')
let getRoomMessages = require('./routes/getRoomMessages')
let getRooms = require('./routes/getRooms')

// Connect to DB
connectionToDB()


//App setup
const app = express();
const server = app.listen(4000, function () {
    console.log("listening to request on port 4000")
});

// socket setup and CORS for sockets
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

// socket methods
io.on('connection', function (socket) {
    console.log('connected with the id : ', socket.id);

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id);

        let rooms = []
        Room.find().then((response) => {
            rooms = response

            for (let i = 0 ; i < rooms.length ; ++i) {
                Room.findOneAndUpdate({name: rooms[i].name}, {$pull: {users: {socketID: socket.id}}}).then(function(result){
                    console.log('END OF USER UPDATE WHEN BROWSER CLOSED')
                })
            }
        })
    })

    socket.on('changeName', function ({ user, newName, name, message, disconnect, currentRoom, color}){    // on en a parlé
        if(currentRoom != "GENERAL"){
            
            Room.findOneAndUpdate({name : currentRoom , "users.name":`${user}`} , {$rename: {"users.name": newName}}).then(function(result){
                console.log('CHANGENAME: ')
                console.log(result)
            })
        }
        //socket.broadcast.emit('changeName', { name, message, color, currentRoom })
        socket.to(currentRoom).emit('changeName', { name, message, color, currentRoom })
    })
    

    socket.on('message', function ({ name, message, color, currentRoom }) {
        io.to(currentRoom).emit('message', { name, message, color, currentRoom })
        if (currentRoom !== 'GENERAL')
            Room.findOneAndUpdate({name: currentRoom}, {$push: {messages: { name, message, color }}}).then(() => {
                console.log("MESSAGE")
            })
    });

    socket.on('users', ({room}) => {
        Room.findOne({name: room}).then(function(result){

            let userNameArray = []

            for(let i = 0; i < result.users.length; ++i) {
                userNameArray.push(result.users[i].name)
            }
            io.to(socket.id).emit('users', userNameArray);
        })
    })
    

    socket.on('private', function ({color, destName, name, message, room}) {
        //requete pour avoir le socket.id du destName = result
        Room.findOne({name : room}).then(function(result){

            let socketID

            for(let i = 0; i < result.users.length; ++i) {
                if (result.users[i].name === destName)
                    socketID = result.users[i].socketID
            }
            io.to(socketID).emit('private', {color, name, message});
        })
    })

    socket.on("typing", function (data) {
        socket.to(data.currentRoom).emit('typing', data.name)
    })

    // suscribe socket to new room
    socket.on('join', ({room, oldRoom, userName}) => {
        if (oldRoom) {
            socket.leave(oldRoom)

            Room.findOneAndUpdate({name: oldRoom}, {$pull: {users: {name: userName}}}).then(function(result){
                console.log('JOIN: Update users list oldRoom')
            })
        } 

        console.log(`user ${socket.id} joining ${room} room`)
        socket.join(room)

        Room.findOneAndUpdate({name: room}, {$push: {users: {name: userName, socketID: socket.id}}}).then(function(result){
            console.log('JOIN =: Update users list actual room')
        })
    })

    socket.on('quit', ({room, userName}) => {
        socket.join("GENERAL")
        socket.leave(room) 
        console.log(`user ${socket.id} leaving ${room} room`)

        Room.findOneAndUpdate({name: room}, {$pull: {users: {name: userName}}}).then(() => {
            console.log("QUIT ROOM")
        })
    })
});

//CORS for routes
app.use(cors())

app.use(express.json())

// Connect to Routes
app.use('/create', createRoom)
app.use('/delete', deleteRoom)
app.use('/getmessages', getRoomMessages)
app.use('/rooms', getRooms)