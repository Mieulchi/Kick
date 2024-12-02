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
  const [fileName, setFileName] = useState("첨부파일");

  const { state } = useLocation();

  async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name); // 파일명을 업데이트
      setImage(file); // 선택된 파일을 이미지로 설정
    }
  };
  useEffect(() => {
    if (state) {
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
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { state, toPost: true } });
    }
  }, []);

  const handlePost = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    axios
      .post("http://localhost:4000/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
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
              <div className={styles.filebox}>
                <input
                  className={styles.uploadname}
                  value={fileName}
                  placeholder="첨부파일"
                  readOnly // 읽기 전용으로 설정
                />
                <label htmlFor="file">파일찾기</label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange} // 파일 변경 이벤트 추가
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    navigate("/community");
                  }}
                >
                  취소
                </button>
                <button onClick={handlePost} className={styles.submitButton}>
                  업로드
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Post;
