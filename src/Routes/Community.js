import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../Css/Community.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UserInfoComponent from "../components/UserInfoComponent";

function Community() {
  const [posts, setPosts] = useState([]); // 게시글 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState(""); // 검색어
  const [sortOption, setSortOption] = useState("latest"); // 정렬 기준
  const [userId, setUserId] = useState(null); // 현재 사용자 ID
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
          userId, // "내 글 보기"일 경우 userId 전달
        },
      })
      .then((response) => {
        console.log(response.data.posts);
        setPosts(response.data.posts); // 서버에서 받은 데이터
        setTotalPages(Math.ceil(response.data.total / 5)); // 페이지 계산
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
    setCurrentPage(1); // 검색 시 페이지 초기화
    fetchPosts(1, sortOption, searchQuery, userId);

    // 검색 상태를 라우트에 저장
    navigate(".", {
      state: { searchQuery, sortOption, currentPage: 1 },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // 엔터 키로 검색 실행
    }
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption); // 정렬 옵션 변경
    setCurrentPage(1); // 정렬 변경 시 페이지 초기화
    if(!userId && newSortOption==="myPosts") {
      navigate("/login");
    }
    else {
      fetchPosts(1, newSortOption, searchQuery, userId);

      // 정렬 상태를 라우트에 저장
      navigate(".", {
        state: { searchQuery, sortOption: newSortOption, currentPage: 1 },
      });
    }
  };

  const changePage = (page) => {
    setCurrentPage(page);
    fetchPosts(page, sortOption, searchQuery, userId);

    // 현재 페이지를 라우트 상태에 저장
    navigate(".", {
      state: { searchQuery, sortOption, currentPage: page },
    });
  };

  return (
    <div className={styles.body}>
      <UserInfoComponent setUserId={setUserId} /> {/* userId 설정 */}
      <section style={{ display: "flex", justifyContent: "center" }}>
        <div className={styles.board}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2 className={styles.title}>NOMADGRAM</h2>
              <div className={styles.buttondiv}>
                {/* 검색 영역 */}
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
              {/* 정렬 드롭다운 */}
              <div>
                <select onChange={handleSortChange} value={sortOption}>
                  <option value="latest">최신순</option>
                  <option value="likes">좋아요 순</option>
                  <option value="myPosts">내 글 보기</option>
                </select>
              </div>
              {/* 게시글 목록 */}
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
                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => changePage(index + 1)}
                      className={currentPage === index + 1 ? styles.activePage : ""}
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
