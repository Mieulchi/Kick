// Map.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap'; // KakaoMap 컴포넌트 import
import logo from '../Logo/Logo.png';
import styles from '../Css/Map.module.css';

function Map() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [tmp, setTmp] = useState();
  const handleSearchLocation = () => {
    setLocation(tmp);
  };

  return (
    <div className={styles.body}>
      <nav className={styles.upBar}>
        <img
          onClick={() => {
            navigate('/');
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
          <div>설정 위치:</div>
          <div>선정 메뉴:</div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => {
              navigate('/review', { state: { location: location } });
            }}
          >
            리뷰 화면으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default Map;
