const Room = require ('../models/room')
let express = require('express')
let router = express.Router()

router.get('/:roomName', (req, res) => {
    
    let roomName = req.params.roomName

    Room.findOne({name: roomName})
                .then( result => {
                    if ( result === null ) {
                        res.send("NO SUCH ROOM IN DB")
                    }
                    else {
                        res.send(result.messages)
                    }
                })
                .catch((error) => {
                    res.send({ name: 'System', message: `AN ERROR OCCURED : \n ${error}`, color: 'red', type: 'join'})
                }) 
})

module.exports = router