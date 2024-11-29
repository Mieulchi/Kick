import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../Css/PostDetail.module.css";

function PostDetail() {
  const { id } = useParams(); // URL 파라미터에서 게시글 ID 가져오기
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 서버에서 게시글 가져오기
    axios
      .get(`http://localhost:4000/posts/${id}`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("게시글 가져오기 실패:", error);
        setLoading(false);
      });
  }, [id]);

  const handleLike = () => {
    axios
      .post(`http://localhost:4000/posts/${id}/like`)
      .then((response) => {
        alert("좋아요 반영되었습니다!");
        setPost({ ...post, likes: post.likes + 1 }); // 좋아요 수 업데이트
      })
      .catch((error) => {
        console.error("좋아요 처리 실패:", error);
      });
  };

  const handleDislike = () => {
    axios
      .post(`http://localhost:4000/posts/${id}/dislike`)
      .then((response) => {
        alert("싫어요 반영되었습니다!");
        setPost({ ...post, dislikes: post.dislikes + 1 }); // 싫어요 수 업데이트
      })
      .catch((error) => {
        console.error("싫어요 처리 실패:", error);
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.metaInfo}>
        글쓴이: {post.username} | 작성일: {new Date(post.created_at).toLocaleString()}
      </p>
      <p className={styles.content}>{post.content}</p>
      {post.image_url && <img src={`http://localhost:4000${post.image_url}`}  alt={post.title} className={styles.image} />}
      <div className={styles.actions}>
        <button onClick={handleLike} className={styles.likeButton}>
          좋아요 👍 {post.likes}
        </button>
        <button onClick={handleDislike} className={styles.dislikeButton}>
          싫어요 👎 {post.dislikes}
        </button>
      </div>
    </div>
  );
}

export default PostDetail;
