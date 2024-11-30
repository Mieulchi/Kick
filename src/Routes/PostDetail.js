import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/PostDetail.module.css';

function PostDetail() {
	const { id } = useParams(); // URL 파라미터에서 게시글 ID 가져오기
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [likeStatus, setLikeStatus] = useState(0);
	const navigate = useNavigate();

	const baseURL = `http://localhost:4000`;
	useEffect(() => {
		axios
			.get(`${baseURL}/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 필요시 추가
				},
			})
			.then((response) => {
				setPost(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('게시글 가져오기 실패:', error);
				setLoading(false);
			});

		axios
			.get(`${baseURL}/posts/${id}/like-status`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 필요시 추가
				},
			})
			.then((response) => {
				setLikeStatus(response.data.likeStatus);
			});
	}, [, likeStatus]);

	const handleVote = () => {
		axios
			.post(
				`${baseURL}/posts/${id}/like`,
				{}, // 요청 바디에 데이터가 없는 경우 빈 객체
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			)
			.then((response) => {
				setLikeStatus(response.data.message);
				setPost({
					...post,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deletePost = () => {
		axios
			.delete(`${baseURL}/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then(() => {
				navigate('/community');
			})
			.catch((e) => {
				console.log(e);
			});
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
					src={`${baseURL}${post.image_url}`}
					alt={post.title}
					className={styles.image}
				/>
			)}
			<div className={styles.actions}>
				<button
					onClick={handleVote}
					className={`${styles.likeButton} ${
						likeStatus == 1 ? styles.selected : ''
					}`}
				>
					좋아요 👍 {post.likes}
				</button>
				{post.isAuthor ? (
					<button className={styles.dislikeButton} onClick={deletePost}>
						삭재
					</button>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export default PostDetail;
