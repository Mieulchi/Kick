import { Map, useMap } from '@vis.gl/react-google-maps';
import MyGoogleMarkers from './MyGoogleMarkers';
import { useState, useRef, useEffect } from 'react';
import GoogleSearch from './GoogleSearch';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export default function MyGoogleMap(props) {
	//검색 지역, Review.js에서 location
	const [place, setPlace] = useState();
	const [location, setLocation] = useState({ lat: 0, lng: 0 });
	const [coords, setCoords] = useState('');
	const mapRef = useMap();

	async function textSearch() {
		const { Place } = await window.google.maps.importLibrary('places');

		const txtRequest = {
			textQuery: `${place} ${props.keyword} `,
			fields: ['displayName', 'location', 'businessStatus', 'rating', 'photos'],
			includedType: 'restaurant',
			isOpenNow: true,
			language: 'kr',
			maxResultCount: 7,
			region: 'kr',
			useStrictTypeFiltering: false,
		};

		const { places } = await Place.searchByText(txtRequest);

		if (places.length) {
			const filteredPlaces = places.map((place) => {
				return { displayName: place.Eg.displayName, rating: place.Eg.rating };
			});
			const filteredCoords = places.map((place) => {
				return {
					location: { lat: place.Eg.location.lat, lng: place.Eg.location.lng },
				};
			});
			props.setPlaces(filteredPlaces);
			setCoords(filteredCoords);
		}
	}

	async function nearbySearch() {
		const { Place, SearchNearbyRankPreference } =
			await window.google.maps.importLibrary('places');

		// Restrict within the map viewport.
		let lat = location.lat;
		let lng = location.lng;

		const nearbyRequest = {
			// required parameters
			fields: ['displayName', 'location', 'businessStatus', 'rating'],
			locationRestriction: {
				center: { lat: lat, lng: lng },
				radius: 500,
			},
			// optional parameters
			includedPrimaryTypes: ['restaurant'],
			maxResultCount: 10,
			rankPreference: SearchNearbyRankPreference.POPULARITY,
			language: 'kr',
			region: 'kr',
		};

		const { places } = await Place.searchNearby(nearbyRequest);
		if (places.length) {
			const filteredPlaces = places.map((place) => {
				return { displayName: place.Eg.displayName, rating: place.Eg.rating };
			});
			const filteredCoords = places.map((place) => {
				return {
					location: { lat: place.Eg.location.lat, lng: place.Eg.location.lng },
				};
			});
			props.setPlaces(filteredPlaces);
			setCoords(filteredCoords);
		}
	}

	// props.location(문자열)을 좌표로 변환하여 초기화
	useEffect(() => {
		setPlace(props.location);
		if (props.location) {
			geocodeByAddress(props.location)
				.then((results) => getLatLng(results[0]))
				.then((latLng) => {
					setLocation({ lat: latLng.lat, lng: latLng.lng });
				})
				.catch((error) => console.error('Error during geocoding:', error));
		}
	}, [props.location]);

	useEffect(() => {
		textSearch();
	}, []);

	useEffect(() => {
		if (mapRef && location.lat && location.lng) {
			mapRef.setCenter(location); // 지도 중심 설정
		}
		if (location.lat !== 0 && location.lng !== 0) {
			textSearch(); // location이 설정되면 검색 실행
		}
	}, [location]);

	return (
		<>
			<div
				style={{
					width: '100%',
					height: '500px',
					borderRadius: '30px 0 0 30px',
					overflow: 'hidden',
				}}
			>
				<Map
					defaultZoom={13} // 초기 줌 레벨
					defaultCenter={location}
					mapId={`${process.env.MY_MAP_ID}`}
				>
					<MyGoogleMarkers coords={coords} />
				</Map>
			</div>

			<GoogleSearch
				location={props.location}
				setLocation={setLocation}
				propsSetLocation={props.setLocation}
				setPlace={setPlace}
			/>
		</>
	);
}
