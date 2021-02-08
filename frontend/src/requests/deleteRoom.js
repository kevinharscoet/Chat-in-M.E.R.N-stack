const axios = require('axios')

const deleteARoom = async (URL, roomName) => {
    const resp = await axios.delete(`${URL}/delete`, { 
        data: { roomName }
     })

    return resp.data
}

module.exports = { deleteARoom }