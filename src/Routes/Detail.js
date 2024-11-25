import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Detail() {
	const [location, setLocation] = useState();
	const [keyword, setKeyword] = useState();
	const [detail, setDetail] = useState([]);

	const { state } = useLocation();
	async function textSearch() {
		const { Place } = await window.google.maps.importLibrary('places');

		const txtRequest = {
			textQuery: `${location} ${keyword} `,
			fields: ['displayName', 'location', 'rating', 'photos', 'reviews'],
			includedType: 'restaurant',
			isOpenNow: true,
			language: 'kr',
			maxResultCount: 7,
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

	return (
		<div
			style={{
				width: '80%',
				height: '100vh',
				margin: '0 auto',
				overflowY: 'auto', // 전체 컨테이너 스크롤 가능 (필요 시)
			}}
		>
			{detail.length > 0
				? detail.map((detail, i) => {
						return (
							<div
								key={i}
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									gap: '20px', // 요소 간 간격
									marginBottom: '20px', // 각 식당 구분 간 간격
								}}
							>
								{/* 이미지 섹션 */}
								<img
									src={detail.url}
									alt="Restaurant"
									style={{
										width: '200px',
										height: '200px',
										borderRadius: '5px',
										objectFit: 'cover',
										flexShrink: 0, // 이미지 크기 고정
									}}
								/>

								{/* 텍스트 섹션 (식당 이름, 평점) */}
								<div style={{ flex: 1, minWidth: '150px' }}>
									<p style={{ fontWeight: 'bold', margin: 0 }}>
										{detail.displayName} : {detail.rating}
									</p>
								</div>

								{/* 리뷰 섹션 */}
								<div
									style={{
										flex: 2, // 리뷰 영역이 더 넓게 설정
										maxHeight: '200px', // 높이 제한
										overflowY: 'auto', // 스크롤 가능
										padding: '10px',
										border: '1px solid #ddd',
										borderRadius: '5px',
										backgroundColor: '#f9f9f9',
									}}
								>
									{detail.review.map((review, idx) => (
										<div
											key={idx}
											style={{
												marginBottom: '10px', // 리뷰 간 간격
											}}
										>
											<p style={{ margin: 0, fontSize: '14px' }}>
												<strong>Rating:</strong> {review.rating}
											</p>
											<p style={{ margin: 0, fontSize: '14px' }}>
												{review.content}
											</p>
										</div>
									))}
								</div>
							</div>
						);
				  })
				: ' '}
		</div>
	);
}
