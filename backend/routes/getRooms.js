const Room = require ('../models/room')
let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {

    Room.find()
                .then( result => {
                    if ( result === null ) {
                        res.send("NO SUCH ROOM IN DB")
                    }
                    else {

                        Room.find().then( (response) => {
                            res.send(response)
                            })
                            .catch( (err) => {
                                console.log(`============= ERROR FINDING LIST OF ROOMS =============\n\n${err}\n\n==========================`)
                            })
                    }
                })
})

module.exports = router