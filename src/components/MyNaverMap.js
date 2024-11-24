import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyNaverMap(props) {
	const [coords, setCoords] = useState([]);
	const [location, setLocation] = useState();
	const [center, setCenter] = useState();

	async function getCenter() {
		const headers = {
			'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
			'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET,
		};

		const baseUrl = 'v1/search/local.json';

		let center = await axios.get(baseUrl, {
			params: {
				query: `${location}`, // 검색어
				display: 1, // 결과 수
			},
			headers: headers,
		});
		center = center.data.items[0];
		const formattedX = `${String(center.mapx).slice(0, 3)}.${String(
			center.mapx
		).slice(3)}`;
		const formattedY = `${String(center.mapy).slice(0, 2)}.${String(
			center.mapy
		).slice(2)}`;
		setCenter({ lat: formattedY, lng: formattedX });
	}

	async function searchLocation() {
		try {
			const headers = {
				'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
				'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_CLIENT_SECRET,
			};

			const baseUrl = 'v1/search/local.json';

			const response = await axios.get(baseUrl, {
				params: {
					query: `${location} ${props.keyword}`, // 검색어
					display: 10, // 결과 수
				},
				headers: headers,
			});

			const places = response.data.items.map((item) => {
				return { displayName: item.title, rating: '' };
			});
			props.setPlaces(places);

			const convertedLocations = response.data.items.map((item) => {
				const formattedX = `${String(item.mapx).slice(0, 3)}.${String(
					item.mapx
				).slice(3)}`;
				const formattedY = `${String(item.mapy).slice(0, 2)}.${String(
					item.mapy
				).slice(2)}`;
				return { lat: formattedY, lng: formattedX };
			});

			setCoords(convertedLocations);
		} catch (error) {
			console.error(
				'Error during API request:',
				error.response || error.message
			);
		}
	}

	function initMap() {
		console.log(center);
		let map = new window.naver.maps.Map('map', {
			center: new window.naver.maps.LatLng(
				parseFloat(center.lat),
				parseFloat(center.lng)
			), //지도의 초기 중심 좌표
			zoom: 14, //지도의 초기 줌 레벨
			minZoom: 7, //지도의 최소 줌 레벨
			zoomControl: true, //줌 컨트롤의 표시 여부
			zoomControlOptions: {
				position: window.naver.maps.Position.TOP_RIGHT,
			},
		});
		coords.map((each) => {
			new window.naver.maps.Marker({
				position: new window.naver.maps.LatLng(each),
				map: map,
			});
		});
	}

	useEffect(() => {
		if (center) {
			initMap();
		}
	}, [center]);

	useEffect(() => {
		setLocation(props.location);
	}, []);

	useEffect(() => {
		if (location) {
			getCenter();
			searchLocation();
		}
	}, [location]);

	return (
		<div style={{ margin: '0 auto' }}>
			<div id="map" style={{ width: '100%', height: '500px' }} />
			<div>
				<input
					type="text"
					placeholder="Search Places..."
					defaultValue={props.location}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							setLocation(event.target.value);
						}
					}}
				/>
			</div>
		</div>
	);
}
