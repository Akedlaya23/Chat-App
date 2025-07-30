import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatApp.css";

const socket = io("http://localhost:5000"); // update if using different port

function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat App</div>
      <div id="chat">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          id="msgInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
