import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Community.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UserInfoComponent from "../components/UserInfoComponent";

function Community() {
  const [posts, setPosts] = useState([]); // 게시글 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const baseURL = "http://localhost:4000";

  const fetchPosts = (page = 1) => {
    axios
      .get(`${baseURL}/posts`, { params: { page, limit: 5 } })
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.total / 5)); // 전체 페이지 계산
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchPosts();
    } else {
      axios
        .get(`${baseURL}/posts/search`, {
          params: { query: searchQuery },
        })
        .then((response) => {
          setPosts(response.data);
          setTotalPages(1); // 검색 결과에서는 페이지네이션 필요 없음
        })
        .catch((err) => console.error(err));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.body}>
      <UserInfoComponent></UserInfoComponent>
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div className={styles.board}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.title}>NOMADGRAM</h2>
              <div className={styles.buttondiv}>
                <div className={styles.searchPost}>
                  <input
                    type="text"
                    placeholder="제목 또는 내용 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.searchInput}
                  />
                  <button onClick={handleSearch} className={styles.searchBtn}>
                    찾기
                  </button>
                </div>
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
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => changePage(index + 1)}
                      className={
                        currentPage === index + 1 ? styles.activePage : ""
                      }
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;
