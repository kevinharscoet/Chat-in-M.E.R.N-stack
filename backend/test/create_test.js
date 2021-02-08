const assert = require('assert')
const Room = require('../models/room')
const { connectionToDB } = require('./testConnectionMongo')

connectionToDB()

// Describe Tests
describe('Creating a room', function(){

    // Create Tests
    it('Create a room in the database', function(done){

        let room = new Room({
            name: 'ClovisRoom',
            users: [],
            messages: []
        })

        room.save().then(function(){
            assert(!room.isNew)
            done()
        })
    })
})