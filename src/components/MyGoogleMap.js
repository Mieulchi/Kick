import { Map } from '@vis.gl/react-google-maps';
import MyMarkers from './MyMarkers';
import { useEffect, useState, useRef } from 'react';
import GoogleSearch from './GoogleSearch';

export default function MyGoogleMap(props) {
	const [location, setLocation] = useState({
		lat: -33.860664,
		lng: 151.208138,
	});

	return (
		<>
			<Map
				defaultZoom={13}
				defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
				zoom={16}
				center={{ lat: location.lat, lng: location.lng }}
				mapId={`${process.env.MY_MAP_ID}`}
			>
				<MyMarkers></MyMarkers>
			</Map>
			<GoogleSearch
				location={props.location}
				setLocation={setLocation}
			></GoogleSearch>
		</>
	);
}
