const axios = require('axios')

const getMessages = async (URL, roomName) => {

    if (roomName === 'GENERAL') {
        return [{ name: 'System', message: `Please choose a nickname using /nick command`, color: 'red'}]
    }
    else {
        let resp = await axios.get(`${URL}/getmessages/${roomName}`)

        return resp.data

        //  .then(response => {
        //      console.log(response.data)
        //      return response.data
        //  })
        //  .catch(error => {
        //      console.log(error)
        //  })
    }
}

module.exports = { getMessages }