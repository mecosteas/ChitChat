import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'; // to keep scrollbar scrolled to bottom
import Message from './message';
import axios from 'axios';

/* 
Renders: scroll box, all messages
 */
const ChatWindow = ({ ws, userName }) => {
    const [messages, setMessages] = React.useState([]); // messages stored as JSON

    // When message is received from server, push it into messages list
    ws.onmessage = (e) => {
        let msgFromServer = JSON.parse(e.data);
        console.log("Message from server:", e.data);
        let newMessages = [...messages];
        newMessages.push(msgFromServer);
        setMessages(newMessages);
    }

    const fetchAllMessages = () => {
        console.log("!Fetching messages...")
        axios.get('/api/get-all-messages')
            .then((res) => {
                setMessages(res.data.messages);
                console.log('!Fetching messages complete!')
            })
            .catch(error => console.log(error));
    }

    // Fetch all messages from DB on page load
    React.useEffect(() => {
        fetchAllMessages();
    }, []);

    const refreshPage = () => {
        let emptyArray = [];
        setMessages(emptyArray);
        fetchAllMessages();
    }

    return (
        <React.Fragment>
            <ScrollToBottom className="chat-window">
                {messages.map((message, i) => {
                    return (
                        <Message userName={userName} message={message} key={i} />
                    )
                })}
            </ScrollToBottom>
            <button onClick={refreshPage} type="button" className="btn btn-info">
                Refresh
            </button>
        </React.Fragment>
    );
}

export default ChatWindow;