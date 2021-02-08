const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema and Model

const RoomSchema = new Schema({
    name: String,
    users: Array,
    messages: Array
}) 

const Room = mongoose.model('rooms', RoomSchema)

module.exports = Room