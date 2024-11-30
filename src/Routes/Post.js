import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Post.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import darkLogo from "../Logo/darkLogo.png";

function Post() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const { state } = useLocation();

  async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  useEffect(() => {
    console.log(image);
  }, [image]);

  useEffect(() => {
    if (state) {
      console.log(state);
      if (state.displayName) {
        setContent(`${state.displayName} : ${state.keyword} 맛집!`);
      }
      if (state.url) {
        urlToFile(state.url, "tmp").then((response) => {
          setImage(response);
        });
      }
    }
  }, [state]);

  useEffect(() => {
    console.log(state);
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { state, toPost: true } });
    }
  }, []);

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
        console.log(err);
      });
  };

  return (
    <div className={styles.body}>
      <nav className={styles.upBar} id={styles.hd}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={darkLogo}
        />
      </nav>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div className={styles.board}>
          <div className={styles.container}>
            <h2 className={styles.title}>NOMADGRAM</h2>
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
                업로드
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Post;
