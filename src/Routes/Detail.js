import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from '../Css/Detail.module.css';
import darkLogo from '../Logo/darkLogo.png';

export default function Detail() {
	const [location, setLocation] = useState();
	const [keyword, setKeyword] = useState();
	const [detail, setDetail] = useState([]);
	const navigate = useNavigate();

	const { state } = useLocation();
	async function textSearch() {
		const { Place } = await window.google.maps.importLibrary('places');

		const txtRequest = {
			textQuery: `${location} ${keyword} `,
			fields: ['displayName', 'location', 'rating', 'photos', 'reviews'],
			includedType: 'restaurant',
			language: 'ko',
			maxResultCount: 7,
			minRating: 1,
			region: 'kr',
			useStrictTypeFiltering: false,
		};

		const { places } = await Place.searchByText(txtRequest);
		const obj = places.map((place) => {
			return place.id;
		});
		await obj.map(async (each) => {
			const place = new Place({
				id: each,
			});
			await place.fetchFields({
				fields: [
					'displayName',
					'photos',
					'editorialSummary',
					'reviews',
					'rating',
				],
			});
			let rating = place.rating;
			let displayName = place.displayName;
			let url;
			let review;
			if (place.photos[0]) {
				url = place.photos[0].getURI();
			}
			if (place.reviews) {
				review = place.reviews.map((each) => {
					return { content: each.Kg, rating: each.Ig };
				});
			}
			setDetail((prev) => [...prev, { url, displayName, rating, review }]);
		});
	}

	useEffect(() => {
		if (location && keyword) {
			textSearch();
		}
	}, [location, keyword]);

	useEffect(() => {
		setLocation(state.location);
		setKeyword(state.keyword);
	}, [state]);

	// Helper function to render stars
	const renderStars = (rating) => {
		const fullStars = Math.floor(rating);
		const emptyStars = 5 - fullStars;

		return (
			<>
				{[...Array(fullStars)].map((_, index) => (
					<i
						key={`full-${index}`}
						className="bi bi-star-fill"
						style={{ color: '#FFD700', marginRight: '5px' }}
					></i>
				))}
				{[...Array(emptyStars)].map((_, index) => (
					<i
						key={`empty-${index}`}
						className="bi bi-star"
						style={{ color: '#FFD700', marginRight: '5px' }}
					></i>
				))}
			</>
		);
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
			<div className={styles.containerBox}>
				<div className={styles.container}>
					{detail.length > 0
						? detail.map((detail, i) => {
								console.log(detail);
								return (
									<div key={i} className={styles.detail}>
										<img
											src={detail.url}
											alt="Restaurant"
											className={styles.detailImage}
										/>

										<div className={styles.detailText}>
											<p>{detail.displayName}</p>
											<div>{renderStars(detail.rating)}</div>
											<button
												onClick={() => {
													navigate('/community', {
														state: { url: detail.url },
													});
												}}
											>
												공유하기
											</button>
										</div>

										<div className={styles.reviewSection}>
											{detail.review.map((review, idx) => (
												<div key={idx} className={styles.review}>
													<p>
														<strong>별점 :</strong> {review.rating}/5
													</p>
													<p>{review.content}</p>
												</div>
											))}
										</div>
									</div>
								);
						  })
						: ' '}
				</div>
			</div>
		</div>
	);
}
