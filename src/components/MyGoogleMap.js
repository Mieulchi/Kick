import { Map } from '@vis.gl/react-google-maps';
import MyMarkers from './MyMarkers';
import { useState, useRef, useEffect } from 'react';
import GoogleSearch from './GoogleSearch';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export default function MyGoogleMap(props) {
  async function nearbySearch() {
    console.log(location);
    //@ts-ignore
    const { Place, SearchNearbyRankPreference } =
      await window.google.maps.importLibrary('places');

    // Restrict within the map viewport.
    let lat = location.lat;
    let lng = location.lng;

    const request = {
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
    //@ts-ignore
    const { places } = await Place.searchNearby(request);
    console.log(places);

    if (places.length) {
      console.log(places);
      props.setPlaces(places);

      places.forEach(async (place) => {
        const tmpplace = new Place({
          id: place.id,
          requestedLanguage: 'kr', // optional
        });
        await tmpplace.fetchFields({
          fields: ['displayName', 'formattedAddress', 'rating'],
        });
        console.log(`${tmpplace.Eg.displayName} : ${tmpplace.Eg.rating}`);
      });

      const { LatLngBounds } = await window.google.maps.importLibrary('core');
      const bounds = new LatLngBounds();
    } else {
      console.log('No results');
    }
  }

  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const mapRef = useRef(null);

  // props.location(문자열)을 좌표로 변환하여 초기화
  useEffect(() => {
    if (props.location) {
      geocodeByAddress(props.location)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          setLocation({ lat: latLng.lat, lng: latLng.lng });
        })
        .catch((error) => console.error('Error during geocoding:', error));
    }
  }, [props.location]);

  // 드래그 후 지도 중심 업데이트
  const handleIdle = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setLocation({
        lat: center.lat(),
        lng: center.lng(),
      });
    }
  };

  return (
    <>
      <Map
        defaultZoom={15}
        defaultCenter={location}
        center={location}
        mapId={`${process.env.MY_MAP_ID}`}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onIdle={handleIdle} // 드래그 후 이벤트
      >
        <MyMarkers />
      </Map>
      <GoogleSearch location={props.location} setLocation={setLocation} />
      <button
        className="btn btn-primary"
        onClick={() => {
          nearbySearch();
        }}
      >
        식당검색
      </button>
    </>
  );
}
