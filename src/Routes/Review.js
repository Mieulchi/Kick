import { useLocation, useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import { useEffect, useState } from 'react';
import styles from '../Css/Review.module.css';
import MyGoogleMap from '../components/MyGoogleMap';

function Review() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [location, setLocation] = useState();

	useEffect(() => {
		console.log(location);
	}, [location]);

	useEffect(() => {
		console.log(state);
		setLocation(state.location);
	}, []);

	return (
		<div className={styles.review}>
			<h2>리뷰 화면임</h2>
			<div className={styles.review_container}>
				<div className={styles.mapdiv}>
					<MyGoogleMap location={location}></MyGoogleMap>
				</div>
				<div className={styles.reviewdiv} style={{ border: '1px solid blue' }}>
					리뷰 목록임
				</div>
			</div>

			<button
				style={{ marginTop: '100px' }}
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
