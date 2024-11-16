// Map.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap'; // KakaoMap 컴포넌트 import
import styles from '../Css/Map.module.css';

function Map() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [tmp, setTmp] = useState();
  const handleSearchLocation = () => {
    if (location.trim() === '') {
      alert('위치를 입력해주세요.');
      return;
    }
  };

  return (
    <div>
      <div className={styles.upBar}>
        <h2 style={{ textAlign: 'center' }}>지도 화면</h2>
      </div>

      <div className={styles.contents}>
        <section className={styles.mapBox}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={tmp}
              onChange={(e) => setTmp(e.target.value)}
              placeholder="예: 서울시 강남구 논현동 또는 한성대학교"
              className={styles.searchLocation}
            />
            <button
              onClick={() => setLocation(tmp)}
              className={styles.searchBT}
            >
              위치 검색
            </button>
          </div>
          {/* KakaoMap 컴포넌트에 location을 전달 */}
          <div className={styles.map}>
            <KakaoMap location={location} />
          </div>
        </section>
        <section className={styles.resultBox}>
          설정 위치: {location}
          <button onClick={() => navigate('/review', { state: { location } })}>
            리뷰 화면으로
          </button>
        </section>
      </div>
    </div>
  );
}

export default Map;
