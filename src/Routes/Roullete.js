import { useNavigate } from 'react-router-dom';

function Roullete() {
	const navigate = useNavigate();
	return (
		<div style={{ width: '80%', height: '100vh', margin: '0 auto' }}>
			<h1 style={{ margin: '0 auto', marginTop: '20%', fontSize: '50px' }}>
				룰렛화면임
			</h1>
			<button
				onClick={() => {
					navigate('/map');
				}}
			>
				지도화면으로
			</button>
		</div>
	);
}
export default Roullete;
