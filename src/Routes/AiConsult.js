import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { fetchChatResponse } from "../api";
import styles from "../Css/Home.module.css";

import userAvatar from "../Images/user-avatar.png";
import botAvatar from "../Images/bot-avatar.png";

const AiConsult = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false); // 로딩 상태 관리

  // 스크롤 하단 이동
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // 채팅창 열릴 때 AI 초기 메시지 추가
  useEffect(() => {
    if (messages.length === 0) {
      const botMessage = {
        sender: "bot",
        text: "안녕하세요! 😊 오늘 어떤 맛있는 메뉴를 찾고 계신가요? 여러분의 입맛을 행복하게 해드리기 위해 준비했어요! 따뜻한 마음으로 추천 드릴게요. 🍽️✨",
        avatar: botAvatar,
      };
      setMessages([botMessage]); // 초기 메시지 설정
    }
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  // 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 처리
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
      avatar: userAvatar,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true); // 로딩 상태 활성화

    try {
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
        ref={chatContainerRef}
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
            <Message
              key={index}
              sender={msg.sender}
              text={msg.text}
              avatar={msg.avatar}
            />
          ))}
          {isTyping && (
            <div
              style={{ fontStyle: "italic", color: "gray", marginTop: "10px" }}
            >
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
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
