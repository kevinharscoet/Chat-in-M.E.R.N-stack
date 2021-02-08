const assert = require('assert')
const Room = require('../models/room')
const { connectionToDB } = require('./testConnectionMongo')



// Describe Tests
describe('Updating a room', function(){

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

    // Delete test
    it('Deletes a room from the database', function(done){
        Room.findOneAndRemove({name: 'ClovisRoom'}).then(function(){
            Room.findOne({name: 'ClovisRoom'}).then(function(result){
                assert(result === null)
                done()
            })
        })
    })
})