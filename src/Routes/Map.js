import { useNavigate } from 'react-router-dom';

function Map() {
	const navigate = useNavigate();
	return (
		<div style={{ width: '10%', margin: '0 auto' }}>
			<h2 style={{ margin: '0 auto' }}>지도화면임</h2>
			<button
				onClick={() => {
					navigate('/review');
				}}
			>
				리뷰화면으로
			</button>
		</div>
	);
}

export default Map;
