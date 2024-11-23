import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export default function MyGoogleMarkers(props) {
	useEffect(() => {}, [props.coords]);
	return (
		<>
			{props.coords
				? props.coords.map((coord) => (
						<AdvancedMarker key={coord.key} position={coord.location}>
							<Pin borderColor={'#000'} />
						</AdvancedMarker>
				  ))
				: ' '}
		</>
	);
}
