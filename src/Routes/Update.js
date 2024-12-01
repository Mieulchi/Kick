import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Css/Post.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import darkLogo from '../Logo/darkLogo.png';

export default function Update() {
	const { id } = useParams();

	const [post, setPost] = useState();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState(null);
	const navigate = useNavigate();
	const baseURL = `http://localhost:4000`;

	useEffect(() => {
		const token = localStorage.getItem('token');
		axios
			.get(`${baseURL}/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`, // 토큰 필요시 추가
				},
			})
			.then((response) => {
				setPost(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		if (post) {
			console.log(post);
			setContent(post.content);
			setTitle(post.title);
			setImage(post.image_url);
		}
	}, [post]);

	const handlePatch = () => {
		const formData = new FormData();
		console.log(title);
		console.log(content);
		formData.append('title', title);
		formData.append('content', content);
		if (image) formData.append('image', image);

		console.log(formData);
		axios
			.patch(`${baseURL}/posts/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			.then(() => {
				navigate(`/posts/${id}`);
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
						navigate('/');
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
							<input
								type="file"
								onChange={(e) => setImage(e.target.files[0])}
								className={styles.fileInput}
							/>
							<button onClick={handlePatch} className={styles.submitButton}>
								업데이트
							</button>
							<button
                				className={styles.cancelBtn}
                				onClick={() => {
                  				navigate(`/posts/${id}`);
                				}}
              				>
                  				취소
              				</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
