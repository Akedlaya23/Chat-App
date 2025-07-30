import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css"; // Optional external styling if needed

const socket = io("https://chat-eqpy.onrender.com"); // ✅ Use your deployed backend

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { message, username, room };
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat Room: {room} | User: {username}</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.username === username ? "flex-end" : "flex-start",
              backgroundColor: msg.username === username ? "#dcf8c6" : "#f0f0f0",
            }}
          >
            <div style={styles.user}>{msg.username}</div>
            <div>{msg.message}</div>
          </div>
        ))}
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

      <footer style={styles.footer}>
        Created by Abhiram with AI
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  header: {
    marginBottom: "20px",
    color: "#333",
  },
  chatBox: {
    border: "1px solid #ddd",
    padding: "15px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "15px",
  },
  message: {
    margin: "5px",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    textAlign: "left",
  },
  user: {
    fontSize: "0.75rem",
    color: "#777",
    marginBottom: "4px",
  },
  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    width: "70%",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  footer: {
    marginTop: "20px",
    fontSize: "0.8rem",
    color: "#999",
  },
};

export default App;

