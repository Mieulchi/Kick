import { useLocation, useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import { useEffect, useState } from 'react';
import styles from '../Css/Review.module.css';
import MyGoogleMap from '../components/MyGoogleMap';
import MyNaverMap from '../components/MyNaverMap';

function Review() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [location, setLocation] = useState();
	const [places, setPlaces] = useState();
	const [map, setMap] = useState('google');

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
			<div>
				<button
					className="btn btn-primary"
					onClick={() => {
						setMap('google');
					}}
				>
					Google
				</button>
				<button
					className="btn btn-primary ms-2"
					onClick={() => {
						setMap('naver');
					}}
				>
					Naver
				</button>
				<button
					className="btn btn-primary ms-2"
					onClick={() => {
						setMap('kakao');
					}}
				>
					Kakao
				</button>
			</div>
			<div className={styles.review_container}>
				<div className={styles.mapdiv}>
					{map == 'google' ? (
						<MyGoogleMap
							location={location}
							places={places}
							setPlaces={setPlaces}
						></MyGoogleMap>
					) : map == 'naver' ? (
						<MyNaverMap location={location}></MyNaverMap>
					) : (
						<KakaoMap></KakaoMap>
					)}
				</div>
				<div className={styles.reviewdiv} style={{ border: '1px solid blue' }}>
					리뷰 목록임
					{places ? (
						places.map((place) => {
							console.log(place);
							return (
								<div>
									{place.Eg.displayName} : {place.Eg.rating}
								</div>
							);
						})
					) : (
						<></>
					)}
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
