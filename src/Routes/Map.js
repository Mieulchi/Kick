// Map.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KakaoMap from "../components/KakaoMap";
import logo from "../Logo/Logo.png";
import styles from "../Css/Map.module.css";

function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [tmp, setTmp] = useState("");

  useEffect(() => {
    if (location.state && location.state.selectedItem) {
      const item = location.state.selectedItem;
      setSelectedItem(item.name || item);
    }
  }, [location.state]);

  const handleSearchLocation = () => {
    setLocationSearch(tmp);
  };
  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
      handleSearchLocation()
    }
  }

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
              onKeyDown={handleKeyDown}
              placeholder="예: 서울시 강남구 논현동 또는 한성대학교"
              className={styles.searchLocation}
            />
            <button onClick={handleSearchLocation} className={styles.searchBT}>
              위치 검색
            </button>
          </div>
          <div id="map" className={styles.map}>
            <KakaoMap location={locationSearch} />
          </div>
        </div>

        <div className={styles.resultBox}>
          <div className={styles.menuLook}>
            메뉴를 검색할
            <br />
            위치를 설정해주세요.
          </div>
          <div className={styles.locationLook}>현재 위치: {locationSearch}</div>

          {selectedItem ? (
            <div className={styles.selectedItem}>선정 메뉴: {selectedItem}</div>
          ) : (
            <div className={styles.selectedItem}>선정된 메뉴가 없습니다.</div>
          )}

          <button
            className={styles.goToReview}
            onClick={() => {
              navigate("/review", {
                state: { location: locationSearch, selectedItem: selectedItem },
              });
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
