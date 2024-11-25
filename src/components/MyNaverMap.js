import axios from "axios";
import { useEffect, useState } from "react";

export default function MyNaverMap(props) {
  const [coords, setCoords] = useState([]);
  const [location, setLocation] = useState();
  const [center, setCenter] = useState();

  async function getCenter() {
    const headers = {
      "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
    };

    const baseUrl = "v1/search/local.json";

    let center = await axios.get(baseUrl, {
      params: {
        query: `${location}`, // 검색어
        display: 1, // 결과 수
      },
      headers: headers,
    });
    center = center.data.items[0];
    const formattedX = `${String(center.mapx).slice(0, 3)}.${String(
      center.mapx
    ).slice(3)}`;
    const formattedY = `${String(center.mapy).slice(0, 2)}.${String(
      center.mapy
    ).slice(2)}`;
    setCenter({ lat: formattedY, lng: formattedX });
  }

  async function searchLocation() {
    try {
      const headers = {
        "X-Naver-Client-Id": process.env.REACT_APP_NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_CLIENT_SECRET,
      };

      const baseUrl = "v1/search/local.json";

      const response = await axios.get(baseUrl, {
        params: {
          query: `${location} ${props.keyword}`, // 검색어
          display: 10, // 결과 수
        },
        headers: headers,
      });

      const places = response.data.items.map((item) => {
        return { displayName: item.title, rating: "" };
      });
      props.setPlaces(places);

      const convertedLocations = response.data.items.map((item) => {
        const formattedX = `${String(item.mapx).slice(0, 3)}.${String(
          item.mapx
        ).slice(3)}`;
        const formattedY = `${String(item.mapy).slice(0, 2)}.${String(
          item.mapy
        ).slice(2)}`;
        return {
          lat: formattedY,
          lng: formattedX,
          title: item.title,
          address: item.address,
        };
      });

      setCoords(convertedLocations);
    } catch (error) {
      console.error(
        "Error during API request:",
        error.response || error.message
      );
    }
  }

  function initMap() {
    let map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(
        parseFloat(center.lat),
        parseFloat(center.lng)
      ), //지도의 초기 중심 좌표
      zoom: 14, //지도의 초기 줌 레벨
      minZoom: 7, //지도의 최소 줌 레벨
      zoomControl: true, //줌 컨트롤의 표시 여부
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });

    // 마커 추가: 검색된 위치 좌표에 마커를 표시
    coords.forEach((each) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(each.lat, each.lng),
        map: map,
        title: each.title, // 마커의 타이틀을 설정
      });

      // 정보창을 표시할 내용 설정
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:10px; width: 200px; font-size: 14px;">
                    <strong>${each.title}</strong><br />
                    ${each.address}
                  </div>`,
        maxWidth: 200, // 정보창의 최대 너비
      });

      // 마커 클릭 시 해당 마커 위에 정보창을 표시
      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker); // 마커 위치에 정보창 열기
      });
    });
  }

  useEffect(() => {
    if (center) {
      initMap();
    }
  }, [center, coords]); // coords 배열이 변경되면 지도 다시 초기화

  useEffect(() => {
    setLocation(props.location);
  }, []);

  useEffect(() => {
    if (location) {
      getCenter();
      searchLocation();
    }
  }, [location]);

  return (
    <div style={{ margin: "0 auto" }}>
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "30px 0 0 30px",
        }}
      />
      <div>
        <input
          type="text"
          placeholder="Search Places..."
          defaultValue={props.location}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setLocation(event.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}
