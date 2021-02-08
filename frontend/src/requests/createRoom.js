const axios = require('axios')

const createARoom = async (URL, roomName) => {
    const resp = await axios.post(`${URL}/create`, { 
        roomName
     })

     return resp.data
}

module.exports = { createARoom }