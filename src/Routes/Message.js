import React from "react";

const Message = ({ sender = "user", text = "", avatar = "" }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: sender === "user" ? "row-reverse" : "row",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            margin: sender === "user" ? "0 0 0 10px" : "0 10px 0 0",
          }}
        >
          <img
            src={avatar || "default-avatar.png"} // 기본값 설정
            alt={sender === "user" ? "User Avatar" : "Bot Avatar"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
  
        <div
          style={{
            maxWidth: "70%",
            padding: "10px",
            borderRadius: "15px",
            backgroundColor: sender === "user" ? "#DCF8C6" : "#EDEDED",
            color: "#333",
            textAlign: "left",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ margin: 0 }}>{text || "No message available"}</p> {/* 기본값 설정 */}
        </div>
      </div>
    );
  };
  

export default Message;
