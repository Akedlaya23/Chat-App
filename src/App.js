import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css"; // Optional if you have styles here

const socket = io("https://chat-eqpy.onrender.com"); // ✅ Your backend URL

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null); // ✅ For auto scroll

  useEffect(() => {
    const enteredUsername = prompt("Enter your name");
    const enteredRoom = prompt("Enter Room ID to join");

    setUsername(enteredUsername);
    setRoom(enteredRoom);

    socket.emit("joinRoom", enteredRoom);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { message, username, room };
      socket.emit("sendMessage", newMessage);
      setMessage(""); // ✅ Don't manually add to messages
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chat Room: {room} | User: {username}</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.username === username ? "flex-end" : "flex-start",
              backgroundColor: msg.username === username ? "#dcf8c6" : "#f1f0f0",
            }}
          >
            <small style={styles.user}>{msg.username}</small>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={bottomRef} /> {/* 👈 Keeps chat scrolled to bottom */}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  chatBox: {
    border: "1px solid #ccc",
    padding: "20px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  message: {
    margin: "5px",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  user: {
    fontSize: "0.7rem",
    color: "#555",
    marginBottom: "2px",
    display: "block",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    width: "70%",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default App;

