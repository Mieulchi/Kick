import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/Community.module.css';

function Community() {
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get('http://localhost:4000/posts')
			.then((response) => {
				setPosts(response.data);
			})

			.catch((err) => console.error(err));
	}, []);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>게시글 목록</h2>
			<div className={styles.postList}>
				{posts.map((post) => (
					<div key={post.id} className={styles.postCard}>
						<h3 onClick={() => navigate(`/posts/${post.id}`)}>{post.title}</h3>
						<div className={styles.postDetails}>
							<span>글쓴이: {post.username}</span>
							<span>좋아요: {post.likes}</span>
						</div>
					</div>
				))}
			</div>
			<button className={styles.actionButton} onClick={() => navigate('/post')}>
				글쓰기
			</button>
		</div>
	);
}

export default Community;
