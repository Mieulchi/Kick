import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Community.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UserInfoComponent from "../components/UserInfoComponent";

function Community() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [userId, setUserId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태

  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = "http://localhost:4000";

  // 게시글 가져오기
  const fetchPosts = (page = 1, sort = "latest", query = "", userId) => {
    console.log(userId);
    axios
      .get(`${baseURL}/posts`, {
        params: {
          page,
          limit: 5,
          sort,
          query,
          userId,
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.total / 5));
      })
      .catch((err) => console.error(err));
  };

  // 검색 상태 복원
  useEffect(() => {
    const initialQuery = location.state?.searchQuery || "";
    const initialSort = location.state?.sortOption || "latest";
    const initialPage = location.state?.currentPage || 1;

    setSearchQuery(initialQuery);
    setSortOption(initialSort);
    setCurrentPage(initialPage);

    fetchPosts(initialPage, initialSort, initialQuery, userId);
  }, [location.state]);

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPosts(1, sortOption, searchQuery, userId);
    navigate(".", {
      state: { searchQuery, sortOption, currentPage: 1 },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1);
    if (!userId && newSortOption === "myPosts") {
      navigate("/login");
    } else {
      fetchPosts(1, newSortOption, searchQuery, userId);
      navigate(".", {
        state: { searchQuery, sortOption: newSortOption, currentPage: 1 },
      });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // 드롭다운 상태 토글
  };

  const changePage = (page) => {
    setCurrentPage(page);
    fetchPosts(page, sortOption, searchQuery, userId);
    navigate(".", {
      state: { searchQuery, sortOption, currentPage: page },
    });
  };

  return (
    <div className={styles.body}>
      <UserInfoComponent setUserId={setUserId} />
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div className={styles.board}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.title}>NOMADGRAM</h2>
              <div className={styles.buttondiv}>
                <div style={{ display: "flex" }} className={styles.searchPost}>
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
                  {/* 드롭다운 */}
                  <div
                    className={`${styles.dropdownContainer} ${
                      isDropdownOpen ? styles.open : ""
                    }`}
                    onClick={toggleDropdown}
                  >
                    정렬 옵션
                    <div
                      className={`${styles.dropdownMenu} ${
                        isDropdownOpen ? styles.visible : styles.hidden
                      }`}
                    >
                      <div
                        onClick={() => handleSortChange("latest")}
                        className={styles.dropdownItem}
                      >
                        최신순
                      </div>
                      <div
                        onClick={() => handleSortChange("likes")}
                        className={styles.dropdownItem}
                      >
                        좋아요 순
                      </div>
                      <div
                        onClick={() => handleSortChange("myPosts")}
                        className={styles.dropdownItem}
                      >
                        내 글 보기
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.newPost}>
                  <button
                    className={styles.uploadBtn}
                    onClick={() => navigate("/post")}
                  >
                    게시글 작성
                  </button>
                </div>
              </div>
              <div className={styles.postList}>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={styles.postCard}
                    onClick={() =>
                      navigate(`/posts/${post.id}`, {
                        state: { searchQuery, sortOption, currentPage },
                      })
                    }
                  >
                    <h3>{post.title}</h3>
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
