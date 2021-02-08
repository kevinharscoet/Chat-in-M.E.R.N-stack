const mongoose = require('mongoose')

// Overwrite mongoose promises with ES6's
mongoose.Promise = global.Promise

// connect to db
const connectionToDB = () => {

    before(function(done){  // maybe to remove after testing
        mongoose.connect(
            'mongodb+srv://clovis:210596@cluster0.qpp5b.mongodb.net/IRC_server?retryWrites=true&w=majority', 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            })
    
        mongoose.connection.once('open', function(){
            console.log('SUCCESS CONNECTING TO MONGO')  
            done()          // maybe to remove after testing
        }).on('error', function(error){
            console.log('MONGO CONNECTION ERROR: ', error)
        })
    })

    beforeEach(function(done){
        // Drop the collection
        mongoose.connection.collections.rooms.drop(function(){
            done()
        })
    })
}


module.exports = { connectionToDB }
