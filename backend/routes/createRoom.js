const Room = require ('../models/room')
let express = require('express')
let router = express.Router()

router.post('/', (req, res) => {
    
    let roomName = req.body.roomName
    let room = new Room({ 
        name: roomName,
        users: [],
        messages: [] 
    }) 

    Room.findOne({name: roomName})
        .then( result => {
            if ( result === null ) {

                room.save()
                    .then( () => {
                    res.send(`Room ${roomName} created !`)
                    })
                    .catch( (err) => {
                        console.log(`============= ERROR SAVING ROOM TO DB =============\n\n${err}\n\n==========================`)
                    })
            }
            else {
                res.send("NAME ALREADY TAKEN")
            }
        })
})

module.exports = router