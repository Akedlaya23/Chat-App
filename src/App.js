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
      socket.emit("sendMessage", { message, username, room });
      setMessage("");
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (username && room) setJoined(true);
  };

  if (!joined) {
    return (
      <div style={styles.joinContainer}>
        <form onSubmit={handleJoin} style={styles.joinBox}>
          <h2 style={{ marginBottom: 20 }}>💬 Join Chat Room</h2>
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
          <p style={styles.footer}>Created by Abhiram with AI 🤖</p>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <header style={styles.header}>
        <h2>Room: {room} | User: {username}</h2>
      </header>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.username === username ? "flex-end" : "flex-start",
              backgroundColor: msg.username === username ? "#d1ffe3" : "#f0f0f0",
            }}
          >
            <div style={styles.messageUser}>{msg.username}</div>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.textInput}
        />
        <button type="submit" style={styles.sendButton}>Send</button>
      </form>

      <footer style={styles.footer}>Created by Abhiram with AI 🤖</footer>
    </div>
  );
}

const styles = {
  chatContainer: {
    maxWidth: 700,
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  joinContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
  },
  joinBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "90%",
    maxWidth: "350px",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    width: "100%",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatBox: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "inset 0 1px 5px rgba(0,0,0,0.05)",
  },
  message: {
    padding: "10px 14px",
    margin: "6px 0",
    borderRadius: "8px",
    maxWidth: "70%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  messageUser: {
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "4px",
  },
  inputArea: {
    display: "flex",
    marginTop: "10px",
    gap: "10px",
  },
  textInput: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  footer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#888",
  },
};

export default App;
