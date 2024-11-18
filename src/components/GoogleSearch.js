import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';
import { useEffect, useState } from 'react';

export default function GoogleSearch(props) {
	const [address, setAddress] = useState();
	const [location, setLocation] = useState();

	const [latLng, setLatLng] = useState({
		latitude: 0,
		longitude: 0,
	});

	useEffect(() => {
		console.log(latLng.latitude, latLng.longitude);
		props.setLocation({ lat: latLng.latitude, lng: latLng.longitude });
	}, [latLng]);

	const HandleLocationChange = (location) => {
		setLocation(location);
	};

	const handleSelect = (location) => {
		setAddress(location);
		geocodeByAddress(location)
			.then((results) => getLatLng(results[0]))
			.then((latLng) =>
				setLatLng({ latitude: latLng.lat, longitude: latLng.lng })
			)
			.catch((error) => console.error('Error', error));

		//onClose(); // 검색이 완료되었다면 modal을 닫는 fn ... 중략
	};

	return (
		<PlacesAutocomplete
			value={location}
			onChange={HandleLocationChange}
			onSelect={handleSelect}
			//Debounce가 필요하다면
			//debounce={밀리초 단위} 추가
		>
			{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
				<div>
					<input
						{...getInputProps({
							placeholder: 'Search Places ...',
							className: 'location-search-input',
						})}
					/>
					<div className="autocomplete-dropdown-container">
						{loading && <div>Loading...</div>}
						{suggestions.map((suggestion) => {
							const className = suggestion.active
								? 'suggestion-item--active'
								: 'suggestion-item';
							// inline style for demonstration purpose
							const style = suggestion.active
								? { backgroundColor: '#fafafa', cursor: 'pointer' }
								: { backgroundColor: '#ffffff', cursor: 'pointer' };
							return (
								<div
									{...getSuggestionItemProps(suggestion, {
										className,
										style,
									})}
								>
									<span>{suggestion.description}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</PlacesAutocomplete>
	);
}
