// Map.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap"; // KakaoMap 컴포넌트 import
import logo from "../Logo/Logo.png";
import styles from "../Css/Map.module.css";

function Map() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(""); // 선택된 위치
  const [tmp, setTmp] = useState(""); // 입력 중인 위치

  const handleSearchLocation = () => {
    setLocation(tmp); // location에 tmp 값 반영
  };

  return (
    <div className={styles.body}>
      <nav className={styles.upBar}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={logo}
        />
      </nav>

      <div className={styles.contents}>
        <div className={styles.mapBox}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={tmp}
              onChange={(e) => setTmp(e.target.value)}
              placeholder="예: 서울시 강남구 논현동 또는 한성대학교"
              className={styles.searchLocation}
            />
            <button onClick={handleSearchLocation} className={styles.searchBT}>
              위치 검색
            </button>
          </div>
          <div id="map" className={styles.map}>
            <KakaoMap location={location}></KakaoMap>
          </div>
        </div>
        <div className={styles.resultBox}>
          <div className={styles.menuLook}>
            메뉴를 검색할
            <br />
            위치를 설정해주세요.
          </div>
          <div className={styles.locationLook}>현재 위치: {location}</div>

          <button
            className={styles.goToReview}
            onClick={() => {
              navigate("/review", { state: { location: location } });
            }}
          >
            검색하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Map;
