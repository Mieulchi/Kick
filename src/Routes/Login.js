import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState();
	const navigate = useNavigate();

	const handleLogin = () => {
		axios
			.post('http://localhost:4000/login', { username, password })
			.then((response) => {
				localStorage.setItem('token', response.data.token); // JWT 토큰 저장
				navigate('/community');
			})
			.catch((error) => {
				setErrorMsg(error.response.data.message);
			});
	};

	return (
		<div>
			<h2>로그인</h2>
			<input
				type="text"
				placeholder="아이디"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<br></br>
			<input
				type="password"
				placeholder="비밀번호"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<br />
			<button onClick={handleLogin}>로그인</button>
			<button
				onClick={() => {
					navigate('/register');
				}}
			>
				회원가입
			</button>
			<div style={{ color: 'red' }}>{errorMsg}</div>
		</div>
	);
}

export default Login;
