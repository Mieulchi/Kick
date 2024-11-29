import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Post.module.css"

function Post() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handlePost = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    console.log(formData.title);
    axios
      .post("http://localhost:4000/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("게시글이 작성되었습니다.");
        setTitle("");
        setContent("");
        setImage(null);
        navigate("/community");
      })
      .catch((err) => {
        console.error("에러:", err);
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>게시글 작성</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textareaField}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className={styles.fileInput}
        />
        <button onClick={handlePost} className={styles.submitButton}>
          작성
        </button>
      </div>
    </div>
  );
}

export default Post;
