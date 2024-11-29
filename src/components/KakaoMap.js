import React, { useEffect, useState } from 'react';

function KakaoMap({locationSearch = (f) =>f,location , currentLocation}) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const loadKakaoMapScript = () => {
      if (!document.getElementById('kakao-map-script')) {
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initializeMap);
          }
        };
        document.head.appendChild(script);
      } else if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      }
    };

    const initializeMap = () => {
      const { kakao } = window;
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const kakaoMap = new kakao.maps.Map(container, options);
      setMap(kakaoMap);
    };

    loadKakaoMapScript();
  }, []);

  useEffect(() => {
    if (map) {
      if (typeof currentLocation === "string" && currentLocation.includes(",")) {
        // currentLocation이 문자열이고 좌표 형식일 때
        searchCurrentLocation();
      } else if (location) {
        // location 값이 있을 때
        searchLocation();
      }
    }
  }, [location, map, currentLocation]);
  

  const searchLocation = () => {
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(location, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        updateMarker(coords);
        
      } else {
        handleKeyWordSearch();
      }
    });
  };
  const searchCurrentLocation = () => {
    const [latitude, longitude] = currentLocation.split(",").map(Number);
    const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
    const newMarkers = new window.kakao.maps.Marker({
      map: map,
      position: moveLatLon,
    });
    setMarker(newMarkers);
    map.setCenter(moveLatLon);

  }

  const handleKeyWordSearch = () => {
    const { kakao } = window;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(location, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
        updateMarker(coords);
      
      } else {
        alert('해당 위치를 찾을 수 없습니다.');
      }
    });
  };

  const updateMarker = (coords) => {
    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      map: map,
      position: coords,
    });
    setMarker(newMarker);
    locationSearch(coords);
    map.setCenter(coords);
  };

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
}

export default KakaoMap;
