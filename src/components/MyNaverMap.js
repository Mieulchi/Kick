import { useEffect } from 'react';

export default function MyNaverMap(props) {
	async function naverSearch() {
		await window.naver.maps.Service.geocode(
			{
				query: '불정로 6',
			},
			function (status, response) {
				if (status !== window.naver.maps.Service.Status.OK) {
					return alert('Something wrong!');
				}

				let result = response.v2, // 검색 결과의 컨테이너
					items = result.addresses; // 검색 결과의 배열

				// do Something
				console.log(result);
			}
		);
	}

	useEffect(() => {
		const mapDiv = document.getElementById('map');
		const map = new window.naver.maps.Map(mapDiv);
		console.log(props.location);

		naverSearch();
	}, []);

	return (
		<div>
			<div id="map" style={{ width: '400px', height: '400px' }} />
		</div>
	);
}
