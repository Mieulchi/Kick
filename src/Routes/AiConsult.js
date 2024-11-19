import React, { useState } from "react";
import Message from "./Message";
import { useNavigate } from 'react-router-dom';
import { fetchChatResponse } from "../api";

// 이미지 파일 import
import userAvatar from "../Images/user-avatar.png";
import botAvatar from "../Images/bot-avatar.png";

const AiConsult = () => {
    
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    console.log("Sending user message to API:", input);
    const userMessage = {
      sender: "user",
      text: input,
      avatar: userAvatar, // 사용자 이미지
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput(""); // 입력 필드 초기화
    
    // ChatGPT API 호출
    const botResponse = await fetchChatResponse(input);
    console.log("Received bot response:", botResponse);
    
    const botMessage = {
      sender: "bot",
      text: botResponse,
      avatar: botAvatar, // 상담원 이미지
    };
    
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#007BFF" }}>
        JMC 상담원
      </h1>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.map((msg, index) => (
          <Message
            key={index}
            sender={msg.sender}
            text={msg.text}
            avatar={msg.avatar}
          />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiConsult;
