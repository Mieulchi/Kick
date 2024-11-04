import { useNavigate } from 'react-router-dom';

function Review() {
	const navigate = useNavigate();
	return (
		<div style={{ width: '10%', margin: '0 auto' }}>
			<h2 style={{ margin: '0 auto' }}>리뷰 화면임</h2>
			<button
				onClick={() => {
					navigate('/');
				}}
			>
				홈화면으로
			</button>
		</div>
	);
}

export default Review;
