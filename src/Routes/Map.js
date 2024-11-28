// Map.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import KakaoMap from "../components/KakaoMap";
import logo from "../Logo/darkLogo.png";
import styles from "../Css/Map.module.css";

function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [locationSearch, setLocationSearch] = useState(null);
  const [tmp, setTmp] = useState("");
  const [locationInfo, setLocation] = useState(null);
  useEffect(() => {
    if (location.state && location.state.selectedItem) {
      const item = location.state.selectedItem;
      setSelectedItem(item.name || item);
    }
  }, [location.state]);

  const handleSearchLocation = () => {
    setLocationSearch(tmp);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchLocation();
    }
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
        <section className={styles.resultUpbar}>
          <div className={styles.upBarcontent}>
            <div className={styles.cp}>메뉴를 검색할 위치를 선정해주세요.</div>
            <div className={styles.searchBar}>
              <input
                type="text"
                value={tmp}
                onChange={(e) => setTmp(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="예: 서울시 강남구 논현동 또는 한성대학교"
                className={styles.searchLocation}
              />
              <button className={styles.locationBT}>현위치</button>
              <button
                onClick={handleSearchLocation}
                className={styles.searchBT}
              >
                위치 검색
              </button>
            </div>
          </div>
        </section>
        <section className={styles.mapBox}>
          <div id="map" className={styles.map}>
            <KakaoMap locationSearch={setLocation} location={locationSearch} />
          </div>
        </section>

        <section className={styles.resultBottom}>
          <div className={styles.bottomContent}>
            <div className={styles.searchInfo}>
              {selectedItem ? (
                <div className={styles.selectedItem}>
                  선정 메뉴 :
                  <div className={styles.itemBorder}>{selectedItem}</div>
                </div>
              ) : (
                <div className={styles.selectedItem}>
                  선정된 메뉴가 없습니다.
                </div>
              )}
              {locationSearch ? (
                <div className={styles.locationLook}>
                  현재 위치 :
                  <div className={styles.itemBorder}>{locationSearch}</div>
                </div>
              ) : (
                <div className={styles.locationLook}>현재 위치 : 미설정</div>
              )}
            </div>
            <div>
              <button
                className={styles.goToReview}
                onClick={() => {
                  navigate("/review", {
                    state: {
                      location: locationSearch,
                      selectedItem: selectedItem,
                    },
                  });
                }}
              >
                <BsSearch className={styles.searchIcon} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Map;
