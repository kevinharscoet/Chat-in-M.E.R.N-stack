const mongoose = require('mongoose')

// Overwrite mongoose promises with ES6's
mongoose.Promise = global.Promise

// connect to db
const connectionToDB = () => {

    mongoose.connect(
        'mongodb+srv://clovis:210596@cluster0.qpp5b.mongodb.net/IRC_server?retryWrites=true&w=majority', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: true,
        })

    mongoose.connection.once('open', function(){
        console.log('====================\n\nSUCCESS CONNECTING TO MONGO\n\n====================')  
    }).on('error', function(error){
        console.log(`====================\n\nMONGO CONNECTION ERROR:\n\n ${error}\n\n====================`)
    })

}


module.exports = { connectionToDB }