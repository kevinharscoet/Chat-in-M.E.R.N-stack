const axios = require('axios')

const getRooms = async (URL) => {
    const rooms = await axios.get(`${URL}/rooms`)
     
         let roomNames =  []
         for(let i=0; i<rooms.data.length; i++){
             roomNames.push(rooms.data[i].name)
            }
            return roomNames;
        
    }
module.exports = { getRooms }