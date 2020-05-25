import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

/* 
Renders: text box, send button, ChatWindow
 */
const ChatControls = ({ userName, ws }) => {
    const [dateTime, setDateTime] = React.useState(new Date(Date.now()).toLocaleString());
    const [msg, setMsg] = React.useState('');
    const inputTextRef = React.createRef();

    const handleSend = (e) => {
        e.preventDefault(); // prevent default form submission
        setDateTime(new Date(Date.now()).toLocaleString());
        var messageToSend = {
            message: msg,
            username: userName,
            date: dateTime
        }
        axios.post('/api/post-message', messageToSend).then((results) => {
            let message_id = results.data.messageID;
            var messageToSendToWs = {
                message: msg,
                username: userName,
                date: dateTime,
                id: message_id,
                users_liked: []
            }
            ws.send(JSON.stringify(messageToSendToWs));
        });
        inputTextRef.current.value = '';
    }

    if (!userName) {
        return <Redirect to={"/"} />
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSend} className="input-group mb-3 fixed-bottom">
                <input
                    ref={inputTextRef}
                    onChange={(e) => setMsg(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Enter message..."
                    autoFocus={true}
                />
                <div className="input-group-append">
                    <button
                        type="submit"
                        onClick={handleSend}
                        className="btn btn-outline-secondary"
                        id="button-addon2"
                    >
                        Send
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
}

export default ChatControls;