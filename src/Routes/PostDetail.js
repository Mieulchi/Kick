import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/PostDetail.module.css';

function PostDetail() {
	const { id } = useParams(); // URL 파라미터에서 게시글 ID 가져오기
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(-1);
	const [deletable, setDeletable] = useState(false);

	useEffect(() => {
		axios
			.get(`http://localhost:4000/posts/${id}`)
			.then((response) => {
				console.log(response.data);
				setPost(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('게시글 가져오기 실패:', error);
				setLoading(false);
			});
	}, [, selected]);

	const handleVote = (value) => {
		axios
			.post(
				`http://localhost:4000/posts/${id}/vote`,
				{ value },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 필요시 추가
					},
				}
			)
			.then((response) => {
				console.log(response.data.message);
				response.data.message == 1 ? setSelected(1) : setSelected(0);
				console.log(
					value === 1 ? '좋아요 반영되었습니다!' : '싫어요 반영되었습니다!'
				);
				setPost({
					...post,
				});
			})
			.catch((error) => {
				alert('처리에 실패했습니다.');
			});
	};

	// 좋아요
	const handleLike = () => {
		handleVote(1); // value = 1 전달
	};

	// 싫어요
	const handleDislike = () => {
		handleVote(0); // value = 0 전달
	};

	if (loading) return <p>로딩 중...</p>;
	if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>{post.title}</h2>
			<p className={styles.metaInfo}>
				글쓴이: {post.username} | 작성일:{' '}
				{new Date(post.created_at).toLocaleString()}
			</p>
			<p className={styles.content}>{post.content}</p>
			{post.image_url && (
				<img
					src={`http://localhost:4000${post.image_url}`}
					alt={post.title}
					className={styles.image}
				/>
			)}
			<div className={styles.actions}>
				<button
					onClick={handleLike}
					className={`${styles.likeButton} ${
						selected == 1 ? styles.selected : ''
					}`}
				>
					좋아요 👍 {post.likes}
				</button>
				<button
					onClick={handleDislike}
					className={`${styles.dislikeButton} ${
						selected == 0 ? styles.selected : ''
					}`}
				>
					싫어요 👎 {post.dislikes}
				</button>
			</div>
		</div>
	);
}

export default PostDetail;
