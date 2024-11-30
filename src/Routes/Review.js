import { useLocation, useNavigate } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import { useEffect, useState } from 'react';
import styles from '../Css/Review.module.css';
import MyGoogleMap from '../components/MyGoogleMap';
import MyNaverMap from '../components/MyNaverMap';
import MyKakaoMap from '../components/MyKakaoMap';
import 'bootstrap/dist/css/bootstrap.min.css';
import darkLogo from '../Logo/darkLogo.png';

function Review() {
	const navigate = useNavigate();
	const { state } = useLocation();
	//문자열, 검색 지역
	const [location, setLocation] = useState();
	const [keyword, setKeyword] = useState();
	//식당 이름들
	const [places, setPlaces] = useState();
	const [map, setMap] = useState('google');
	const locationInfo = state.locationInfo;

	useEffect(() => {
		setLocation(state.location);
		setKeyword(state.selectedItem);
	}, []);

  // HTML 태그를 제거하는 함수
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, "");
  }

  // 별점 렌더링 함수
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <i
            key={`full-${index}`}
            className="bi bi-star-fill"
            style={{ color: "#FFD700", marginRight: "5px" }}
          ></i>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <i
            key={`empty-${index}`}
            className="bi bi-star"
            style={{ color: "#FFD700", marginRight: "5px" }}
          ></i>
        ))}
      </>
    );
  };

  return (
    <section className={styles.body}>
      <nav className={styles.upBar} id={styles.hd}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={darkLogo}
        />
      </nav>
      <div className={styles.review}>
        <div className={styles.selectMap}>
          <button
            style={{ color: "#2828CD", backgroundColor: "white" }}
            onClick={() => {
              setMap("google");
            }}
          >
            <span style={{ color: "#2828CD" }}>G</span>
            <span style={{ color: "#FF0000" }}>o</span>
            <span style={{ color: "#FFD700" }}>o</span>
            <span style={{ color: "#2828CD" }}>g</span>
            <span style={{ color: "green" }}>l</span>
            <span style={{ color: "#FF0000" }}>e</span>
          </button>

          <button
            style={{ fontWeight: "bold" }}
            onClick={() => {
              setMap("naver");
            }}
          >
            NAVER
          </button>
          <button
            style={{ color: "black", backgroundColor: "#FFDC3C" }}
            onClick={() => {
              setMap("kakao");
            }}
          >
            Kakao
          </button>
          {map === "google" ? (
            <button
              style={{
                background: "#E8F5FF",
                color: "#2828CD",
                fontWeight: "bold",
              }}
              onClick={() => {
                navigate("/detail", {
                  state: { location: location, keyword: keyword },
                });
              }}
            >
              사용자 리뷰
            </button>
          ) : (
            ""
          )}
        </div>
        <div className={styles.review_container}>
          <div className={styles.mapdiv}>
            {map === "google" ? (
              <MyGoogleMap
                location={location}
                keyword={keyword}
                places={places}
                setPlaces={setPlaces}
                setLocation={setLocation}
              ></MyGoogleMap>
            ) : map === "naver" ? (
              <MyNaverMap
                location={location}
                keyword={keyword}
                setPlaces={setPlaces}
                setLocation={setLocation}
              ></MyNaverMap>
            ) : (
              <MyKakaoMap
                location={location}
                keyword={keyword}
                setPlaces={setPlaces}
                setLocation={setLocation}
              ></MyKakaoMap>
            )}
          </div>
          <div className={styles.reviewdiv}>
            {places ? (
              places.map((place) => {
                if (place.displayName !== "Undefined") {
                  const displayNameWithoutTags = stripHtmlTags(
                    place.displayName
                  );
                  return (
                    <div
                      key={displayNameWithoutTags}
                      style={{ marginBottom: "10px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column", // 세로 배치
                          alignItems: "flex-start", // 왼쪽 정렬
                          maxWidth: "300px", // 최대 너비 지정
                          wordWrap: "break-word", // 긴 텍스트 자동 줄바꿈
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            textAlign: "left", // 왼쪽 정렬
                          }}
                        >
                          {displayNameWithoutTags}
                        </div>
                        {place.rating ? (
                          <div style={{ marginTop: "0" }}>
                            {renderStars(place.rating)}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className={styles.divBT}>
                        <button
                          onClick={() => {
                            if (map === "google") {
                              // Google Maps
                              window.location.href = `https://www.google.com/maps/search/${displayNameWithoutTags}`;
                            } else if (map === "kakao") {
                              // Kakao Map
                              window.location.href = `https://place.map.kakao.com/${place.id}`;
                            } else if (map === "naver") {
                              // Naver Map
                              window.location.href = `https://map.naver.com/v5/search/${displayNameWithoutTags}`;
                            }
                          }}
                        >
                          상세페이지
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Review;
