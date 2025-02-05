import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

export default function ChatRoom({id}) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    axios.get(`/api/users?auth_user_id=${id}`).then((response) => setUsers(response.data));

    socket.on("receiveMessage", (message) => {
        console.log("received",message,selectedUser?.id);
      if (message.sender_id == selectedUser?.id || message.receiver_id == selectedUser?.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser]);

  const selectUser = (user) => {
    setSelectedUser(user);
    axios.get(`/api/chats/${user.id}?auth_user_id=${id}`).then((response) => setMessages(response.data));
  };

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    const newMessage = { sender_id: id, receiver_id: selectedUser.id, message: messageInput };
    setMessages([...messages, newMessage]);

    axios.post("/api/chats/send", newMessage);
    socket.emit("sendMessage", newMessage);
    setMessageInput("");
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Sidebar - Users List */}
        <div className="col-md-4 bg-light p-3 border-end">
          <h4 className="text-primary">Users</h4>
          <ul className="list-group">
            {users.map((user) => (
              <li
                key={user.id}
                className={`list-group-item list-group-item-action ${selectedUser?.id === user.id ? "active" : ""}`}
                onClick={() => selectUser(user)}
                style={{ cursor: "pointer" }}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Chat Panel */}
        <div className="col-md-8 d-flex flex-column p-3">
          {selectedUser ? (
            <>
              <h4 className="text-primary mb-3">{selectedUser.name}</h4>
              <div className="chat-box flex-grow-1 overflow-auto p-3 border rounded bg-light" style={{ height: "70vh" }}>
                {messages.map((msg, index) => (
                  <div key={index} className={`d-flex ${msg.sender_id === 1 ? "justify-content-end" : "justify-content-start"}`}>
                    <div className={`alert ${msg.sender_id === 1 ? "alert-primary" : "alert-secondary"} p-2`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
              </div>
            </>
          ) : (
            <p className="text-muted text-center">Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}
