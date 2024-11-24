import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyKakaoMap(props) {
	let [map, setMap] = useState();
	let [infowindow, setInfowindow] = useState();
	let [ps, setPs] = useState();
	const [location, setLocation] = useState();
	const [center, setCenter] = useState();

	async function initMap() {
		let mapContainer = document.getElementById('map'), // 지도를 표시할 div
			mapOption = {
				center: new window.kakao.maps.LatLng(center.lat, center.lng), // 지도의 중심좌표
				level: 5, // 지도의 확대 레벨
			};

		setMap(new window.kakao.maps.Map(mapContainer, mapOption));
		setInfowindow(new window.kakao.maps.InfoWindow({ zIndex: 1 }));
	}

	async function search() {
		await ps.keywordSearch(`${location} ${props.keyword}`, placesSearchCB, {
			size: 10,
		});

		// 키워드 검색 완료 시 호출되는 콜백함수 입니다
		function placesSearchCB(data, status) {
			const places = data.map((each) => {
				return { displayName: each.place_name };
			});
			props.setPlaces(places);

			if (status === window.kakao.maps.services.Status.OK) {
				// 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
				// LatLngBounds 객체에 좌표를 추가합니다
				let bounds = new window.kakao.maps.LatLngBounds();

				for (let i = 0; i < data.length; i++) {
					displayMarker(data[i]);
					bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
				}

				// 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
				map.setBounds(bounds);
			}
		}
	}

	function displayMarker(place) {
		// 마커를 생성하고 지도에 표시합니다
		let marker = new window.kakao.maps.Marker({
			map: map,
			position: new window.kakao.maps.LatLng(place.y, place.x),
		});

		// 마커에 클릭이벤트를 등록합니다
		window.kakao.maps.event.addListener(marker, 'click', function () {
			// 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
			infowindow.setContent(
				'<div style="padding:5px;font-size:12px;">' +
					place.place_name +
					'</div>'
			);
			infowindow.open(map, marker);
		});
	}

	async function fetchLocation() {
		const request = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${location}&size=1`;
		const response = await axios.get(request, {
			headers: {
				Authorization: `KakaoAK 6b6dc02c75c3596998863ca3c8931707`, // 인증 헤더 추가
			},
		});
		setCenter({
			lat: response.data.documents[0].y,
			lng: response.data.documents[0].x,
		});
	}

	useEffect(() => {
		if (map) {
			search();
		}
	}, [map]);

	useEffect(() => {
		if (center) {
			initMap();
		}
	}, [center]);

	useEffect(() => {
		if (location) {
			fetchLocation();
		}
	}, [location]);

	useEffect(() => {
		setLocation(props.location);
		setPs(new window.kakao.maps.services.Places());
	}, []);

	return (
		<>
			<div id="map" style={{ width: '100%', height: '100%' }}></div>
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
		</>
	);
}
