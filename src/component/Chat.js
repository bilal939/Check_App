import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './chat.css';

function Chat() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    console.log(backendUrl);
    const [loggedInUsername, setLoggedInUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const socket = io("chatbackend-production-4a65.up.railway.app", {
        transports: ['websocket'], // optional, but can help with CORS issues
        withCredentials: true,
      });

    useEffect(() => {
        const storedUsername = localStorage.getItem('loggedInUsername');
        if (storedUsername) {
            setLoggedInUsername(storedUsername);
        } else {
            const name = prompt('Please enter your name:');
            setLoggedInUsername(name);
            localStorage.setItem('loggedInUsername', name);
        }
    }, []);

    useEffect(() => {
        const socket = io("chatbackend-production-4a65.up.railway.app", {
            transports: ['websocket'], // optional, but can help with CORS issues
            withCredentials: true,
          });
        console.log("Socket connected:", socket.connected);
        socket.on('connect',()=> {
            console.log("Socket Connected!!")
        })
        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () =>{
        console.log("Disconnected!!");
         socket.disconnect();
        }
    }, []);

    const handleMessageSend = () => {
        if (messageInput.trim() !== '') {
            socket.emit('message', { sender: loggedInUsername, content: messageInput });
            setMessageInput('');
        }
    };

    useEffect(() => {
        return () => {
            localStorage.removeItem('loggedInUsername');
        };
    }, []);

    return (
        <div className="chat-container">
            
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === loggedInUsername ? "message right" : "message left"}
                    >
                        <div className={msg.sender === loggedInUsername ? 'right-sender' : 'left-sender'}>
                        {msg.sender === loggedInUsername ? 'You' : msg.sender}
                        </div>
                        <div className={msg.sender === loggedInUsername ? 'right-sendermsg': 'left-sendermsg'}>{msg.content}</div>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleMessageSend} style={{backgroundColor:"green"}}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
