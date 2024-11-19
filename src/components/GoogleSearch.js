import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useEffect, useState } from 'react';

export default function GoogleSearch(props) {
  const [address, setAddress] = useState(props.location || ''); // 문자열 주소 초기화
  const [latLng, setLatLng] = useState({ latitude: 0, longitude: 0 });

  // props.location(문자열) 변경 시 처리
  useEffect(() => {
    if (props.location) {
      setAddress(props.location); // 검색창 초기화
      geocodeByAddress(props.location) // 문자열 주소를 좌표로 변환
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          setLatLng({ latitude: latLng.lat, longitude: latLng.lng });
          props.setLocation({ lat: latLng.lat, lng: latLng.lng }); // 부모 상태 업데이트
        })
        .catch((error) => console.error('Error during geocoding:', error));
    }
  }, [props.location]);

  // 검색 입력 변경 처리
  const handleChange = (location) => {
    setAddress(location); // 검색창 값 업데이트
  };

  // 검색 선택 처리
  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress); // 검색창 값 설정
    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setLatLng({ latitude: latLng.lat, longitude: latLng.lng });
        props.setLocation({ lat: latLng.lat, lng: latLng.lng }); // 부모 상태 업데이트
      })
      .catch((error) => console.error('Error during geocoding:', error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
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
