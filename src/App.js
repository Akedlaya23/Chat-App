import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://chat-eqpy.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (joined) {
      socket.emit("joinRoom", room);
      socket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [joined, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { message, username, room };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (username && room) {
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div style={styles.joinContainer}>
        <form onSubmit={handleJoin} style={styles.formBox}>
          <h2 style={{ marginBottom: 20 }}>Join Chat Room</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Join</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Room: {room} | User: {username}</h2>
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
        <div ref={bottomRef} />
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
      <p style={{ marginTop: 20, fontSize: "0.9rem", color: "#999" }}>
        Created by Abhiram with AI 🤖
      </p>
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
  joinContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  },
  formBox: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
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
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    borderRadius: "6px",
    border: "1px solid #ccc",
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
};

export default App;

