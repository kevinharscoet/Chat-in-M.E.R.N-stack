const Room = require ('../models/room')
let express = require('express')
let router = express.Router()

router.delete('/', (req, res) => {
    
    let roomName = req.body.roomName

    Room.findOne({name: roomName})
                .then( result => {
                    if ( result === null ) {
                        res.send("NO SUCH ROOM IN DB")
                    }
                    else {

                        Room.findOneAndRemove({name: roomName}).then( () => {
                            res.send(`Room ${roomName} deleted !`)
                            })
                            .catch( (err) => {
                                console.log(`============= ERROR DELETING ROOM FROM DB =============\n\n${err}\n\n==========================`)
                            })
                    }
                })
})

module.exports = router