import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Css/Map.module.css";

function Map() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(""); // 사용자 입력 위치
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null); // 현재 마커를 저장하는 상태

  useEffect(() => {
    const loadKakaoMapScript = () => {
      if (!document.getElementById("kakao-map-script")) {
        const script = document.createElement("script");
        script.id = "kakao-map-script";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(initializeMap); // 지도 로드 후 initializeMap 실행
          }
        };
        document.head.appendChild(script);
      } else if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap); // 스크립트가 이미 로드되었을 때 initializeMap 실행
      }
    };

    const initializeMap = () => {
      const { kakao } = window;
      const container = document.getElementById("map"); // 지도를 표시할 div의 id 설정
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 초기 중심 좌표 (서울시청)
        level: 3, // 지도 확대 레벨
      };
      const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성
      setMap(kakaoMap); // 지도 객체 저장
    };

    loadKakaoMapScript();
  }, []);

  // 위치 검색 함수
  const handleSearchLocation = () => {
    if (map && location) {
      const { kakao } = window;
      const geocoder = new kakao.maps.services.Geocoder();

      // 입력된 주소를 좌표로 변환
      geocoder.addressSearch(location, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          updateMarker(coords);
        } else {
          handleKeyWordSearch();
        }
      });
    }
  };

  const handleKeyWordSearch = () => {
    const { kakao } = window;
    const ps = new kakao.maps.services.Places();

    // 장소명으로 검색
    ps.keywordSearch(location, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
        updateMarker(coords);
      } else {
        alert("해당 위치를 찾을 수 없습니다."); // 두 검색 모두 실패 시
      }
    });
  };

  const updateMarker = (coords) => {
    // 이전 마커 제거
    if (marker) {
      marker.setMap(null);
    }

    // 새 마커 생성 및 지도에 추가
    const newMarker = new window.kakao.maps.Marker({
      map: map,
      position: coords,
    });
    setMarker(newMarker); // 새 마커 저장

    // 지도 중심을 검색된 위치로 이동
    map.setCenter(coords);
  };

  return (
    <div>
      <div className={styles.upBar}>
        <h2 style={{ textAlign: "center" }}>지도 화면</h2>
      </div>

      <div className={styles.contents}>
        <section className={styles.mapBox}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울시 강남구 논현동 또는 한성대학교"
              className={styles.searchLocation}
            />
            <button onClick={handleSearchLocation} className={styles.searchBT}>
              위치 검색
            </button>
          </div>
          <div id="map" className={styles.map} />
        </section>
        <section className={styles.resultBox}>
          설정 위치: 선정 메뉴:
          <button onClick={() => navigate("/review")}>리뷰 화면으로</button>
        </section>
      </div>
    </div>
  );
}

export default Map;
