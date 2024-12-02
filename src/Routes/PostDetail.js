import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/PostDetail.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import darkLogo from "../Logo/darkLogo.png";

function PostDetail() {
  const { id } = useParams(); // URL 파라미터에서 게시글 ID 가져오기
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState(0);
  const [errorMsg, setErrorMsg] = useState();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const baseURL = `http://localhost:4000`;

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorMsg("");
    }, 3000);
  }, [errorMsg]);

  async function getPost() {
    let token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${baseURL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPost(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });

      axios
        .get(`${baseURL}/posts/${id}/like-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setLikeStatus(response.data.likeStatus);
        });
    } else {
      axios
        .get(`${baseURL}/posts/${id}`)
        .then((response) => {
          setPost(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });

      axios.get(`${baseURL}/posts/${id}/like-status`).then((response) => {
        setLikeStatus(response.data.likeStatus);
      });
    }
  }

  useEffect(() => {
    getPost();
  }, [likeStatus]);

  const handleLike = () => {
    setPost({ ...post, isAnimating: true });
    axios
      .post(
        `${baseURL}/posts/${id}/like`,
        {}, // 요청 바디에 데이터가 없는 경우 빈 객체
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLikeStatus(response.data.message);
        setPost((prevPost) => ({
          ...prevPost,
        }));
      })
      .catch((error) => {
        console.error("좋아요 처리 실패:", error);
        setErrorMsg(error.response.data.message);
        setPost((prevPost) => ({ ...prevPost, isAnimating: false }));
      });
    setTimeout(() => {
      setPost((prevPost) => ({ ...prevPost, isAnimating: false }));
    }, 300);
  };

  const deletePost = () => {
    axios
      .delete(`${baseURL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        navigate("/community");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

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
            <h2 className={styles.logo}>NOMADGRAM</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className={styles.title}>{post.title}</h2>
              {post.isAuthor ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className={styles.listBtn}
                    onClick={() => {
                      navigate("/community");
                    }}
                    style={{
                      marginRight: "35px",
                    }}
                  >
                    목록
                  </button>
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={toggleMenu}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "36px",
                      }}
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    {showMenu && (
                      <div
                        style={{
                          position: "absolute",
                          right: 1,
                          top: "80%",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          zIndex: 1000,
                          display: "flex",
                          flexDirection: "column",
                          width: "70px",
                        }}
                      >
                        <button
                          style={{
                            writingMode: "horizontal-tb",
                            padding: "8px 12px",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                          }}
                          onClick={() => {
                            navigate(`/update/${id}`);
                          }}
                        >
                          <div>수</div>
                          <div>정</div>
                        </button>
                        <button
                          style={{
                            writingMode: "horizontal-tb",
                            padding: "10px 12px",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={deletePost}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className={styles.listBtn}
                  onClick={() => {
                    navigate("/community");
                  }}
                >
                  목록
                </button>
              )}
            </div>
            <p className={styles.metaInfo}>
              아이디: {post.username} | 작성일:{" "}
              {new Date(post.created_at).toLocaleString()}
            </p>
            <hr />
            <div className={styles.content}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                  paddingRight: "10px",
                }}
              >
                <p>{post.content}</p>
                <div className={styles.actions}>
                  <button onClick={handleLike} className={styles.likeButton}>
                    <span
                      className={`${styles.heart} ${
                        post.isAnimating ? styles.animate : ""
                      }`}
                    >
                      ❤️
                    </span>{" "}
                    {post.likes}
                  </button>
                </div>
              </div>
              {post.image_url && (
                <img
                  src={`http://localhost:4000${post.image_url}`}
                  alt={post.title}
                  className={styles.image}
                />
              )}
            </div>

            {errorMsg ? <div>{errorMsg}</div> : ""}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
