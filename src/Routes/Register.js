import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../Css/Register.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import darkLogo from '../Logo/darkLogo.png';

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleRegister();
		}
	};

	const handleRegister = () => {
		axios
			.post('http://localhost:4000/register', {
				username: username,
				password: password,
				email: email,
			})
			.then(() => {
				alert('회원가입 성공!');
				navigate('/login');
			})
			.catch((error) => {
				console.error('에러 발생:', error.response || error.message);
				if (error.response) {
					console.log('상태 코드:', error.response.status);
					console.log('응답 데이터:', error.response.data);
				}
				alert('회원가입 실패. 다시 시도해주세요.');
			});
	};

	return (
		<div className={styles.body}>
			<div className={styles.join}>
				<img
					onClick={() => {
						navigate('/');
					}}
					src={darkLogo}
				/>
				<input
					type="text"
					placeholder="아이디"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<br />
				<input
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<br />
				<input
					type="email"
					placeholder="이메일@naver.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<br />
				<button onClick={handleRegister}>회원가입</button>
			</div>
		</div>
	);
}

export default Register;
