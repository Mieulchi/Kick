import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Community.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UserInfoComponent from "../components/UserInfoComponent";

function Community() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const baseURL = "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        setPosts(response.data);
      })

      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.body}>
      <UserInfoComponent></UserInfoComponent>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div className={styles.board}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.title}>NOMADGRAM</h2>
              <div className={styles.buttondiv}>
                <button
                  className={styles.uploadBtn}
                  onClick={() => navigate("/post")}
                >
                  게시글 작성
                </button>
              </div>
              <div className={styles.postList}>
                {posts.map((post) => (
                  <div key={post.id} className={styles.postCard}>
                    <h3 onClick={() => navigate(`/posts/${post.id}`)}>
                      {post.title}
                    </h3>
                    <div className={styles.postDetails}>
                      <span>아이디: {post.username}</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;
