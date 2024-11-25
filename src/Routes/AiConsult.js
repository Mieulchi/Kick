import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { fetchChatResponse } from "../api";
import styles from "../Css/Home.module.css";

// 이미지 파일 import
import userAvatar from "../Images/user-avatar.png";
import botAvatar from "../Images/bot-avatar.png";

const AiConsult = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null); // 채팅 컨테이너를 참조하는 useRef

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
      avatar: userAvatar,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // 입력 필드 초기화

    // ChatGPT API 호출
    const botResponse = await fetchChatResponse(input);

    const botMessage = {
      sender: "bot",
      text: botResponse,
      avatar: botAvatar,
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className={styles.chatBot}>
      <div
        ref={chatContainerRef} // 채팅 컨테이너에 ref 연결
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
          onKeyDown={handleKeyDown}
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
