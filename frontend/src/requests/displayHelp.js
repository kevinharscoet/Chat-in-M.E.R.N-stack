
const displayHelp = () => {
    const output = document.getElementById('output')
    
    output.innerHTML += '<p><strong>-/nick <em>nickname</em></strong> : define your nickname.<br><strong>-/list</strong> : list the available channels.<br><strong>-/create <em>channelName</em></strong> : create a channel with the specified name.<br><strong>-/delete <em>channelName</em></strong> : delete the channel with the specified name.<br><strong>-/join <em>channelName</em></strong> : join the specified channel.<br><strong>-/quit <em>channelName</em></strong> : quit the specified channel.<br><strong>-/users</strong> : list the users currently in the channel.<br><strong>-/msg <em>nickname message</em></strong> : send a private message to this user.<br></p>';
    }

module.exports = { displayHelp }