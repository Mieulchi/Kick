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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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

  const [isTyping, setIsTyping] = useState(false); // 로딩 상태 관리

const handleSend = async () => {
  if (input.trim() === "") return;

  const userMessage = {
    sender: "user",
    text: input,
    avatar: userAvatar,
  };
  setMessages((prev) => [...prev, userMessage]);
  setInput(""); // 입력 필드 초기화
  setIsTyping(true); // 로딩 상태 활성화

  try {
    // ChatGPT API 호출
    const botResponse = await fetchChatResponse(input);

    const botMessage = {
      sender: "bot",
      text: botResponse,
      avatar: botAvatar,
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    const errorMessage = {
      sender: "bot",
      text: "죄송합니다. 답변을 가져오는 중 오류가 발생했습니다.",
      avatar: botAvatar,
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false); // 로딩 상태 비활성화
  }
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
      <div>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} avatar={msg.avatar} />
        ))}
        {isTyping && (
          <div style={{ fontStyle: "italic", color: "gray", marginTop: "10px" }}>
            Typing...
          </div>
        )}
        </div>
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
            padding: "5px 10px 2px 10px",
            backgroundColor: "white",
            color: "#165527",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <i
            className="bi bi-send"
            style={{ fontSize: "24px", fontWeight: "bold" }}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default AiConsult;
