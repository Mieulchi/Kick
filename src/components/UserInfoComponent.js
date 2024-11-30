import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserInfoComponent() {
	const [user, setUser] = useState();
	const navigate = useNavigate();

	const baseURL = `http://localhost:4000`;

	useEffect(() => {
		axios
			.get(`${baseURL}/check-login`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization 헤더에 토큰 추가
				},
			})
			.then((response) => {
				setUser(response.data.user);

				// 로그인된 상태일 때의 로직 처리 (필요한 경우 추가)
			})
			.catch((e) => {
				if (e.response && e.response.status === 401) {
					console.log('오류:', e);
				}
			});
	});
	return (
		<div style={{ border: '1px solid red' }}>
			<button
				onClick={() => {
					navigate('/');
				}}
			>
				{' '}
				임시 홈버튼
			</button>
			<br />
			UserInfoComponent 입니다 UpBar에 써도 되고요
			<br></br>
			{user ? (
				<div style={{ display: 'flex' }}>
					{' '}
					<div>{user.username}</div>{' '}
					<button
						onClick={() => {
							localStorage.removeItem('token');

							location.reload(true);
						}}
					>
						logout
					</button>{' '}
				</div>
			) : (
				<div>
					<button
						onClick={() => {
							navigate('/login');
						}}
					>
						login
					</button>
				</div>
			)}
		</div>
	);
}
