const assert = require('assert')
const Room = require('../models/room')
const { connectionToDB } = require('./testConnectionMongo')



// Describe Tests
describe('Finding a room', function(){

    beforeEach(function(done){

        connectionToDB()

        let room = new Room({
            name: 'ClovisRoom',
            users: [],
            messages: []
        })
        room.save().then(function(){
            done()
        })
    })

    // Find Tests
    it('Find a room in the database', function(done){
        Room.findOne({name: 'ClovisRoom'}).then(function(result) {  // Returns null if doesn't exist
            assert(result.name === 'ClovisRoom')
            done()
        })
    })
})