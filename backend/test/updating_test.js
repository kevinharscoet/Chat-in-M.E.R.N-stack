const assert = require('assert')
const Room = require('../models/room')
const { connectionToDB } = require('./testConnectionMongo')



// Describe Tests
describe('Deleting a room', function(){

    let room;

    beforeEach(function(done){

        connectionToDB()

        room = new Room({
            name: 'ClovisRoom',
            users: [],
            messages: []
        })
        room.save().then(function(){
            done()
        })
    })

    // Update test
    it('Updates a room in the database', function(done){
        
        Room.findOneAndUpdate({name:'ClovisRoom'}, {name: 'KevinRoom'}).then(function(){
            Room.findOne({_id: room._id}).then(function(result){
                assert(result.name === 'KevinRoom')
                done()
            })
        })
    })
})