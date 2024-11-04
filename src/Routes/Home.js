import { useNavigate } from 'react-router-dom';

function Home() {
	const navigate = useNavigate();

	return (
		<div style={{ width: '10%', margin: '0 auto' }}>
			<h2 style={{ margin: '0 auto' }}>홈화면임</h2>
			<button
				onClick={() => {
					navigate('/roullete');
				}}
			>
				룰렛으로
			</button>
		</div>
	);
}

export default Home;
