import React, { useState } from 'react';
import axios from 'axios';
import { useLocation} from 'react-router-dom';
const Direction = () => {
  const { state } = useLocation();
  const end = {lat: 37.4979, lng: 127.0276 }; // 강남
  const [route, setRoute] = useState(null); // 경로 데이터 저장
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 저장
  
  
  const fetchTransitRoute = async () => {
    setErrorMessage(null); // 에러 메시지 초기화
    try {
      const response = await axios.post(
        'https://apis.openapi.sk.com/transit/routes',
        {
          // POST 요청의 Body
          startX: state.location.La, // 출발지 경도
          startY: state.location.Ma, // 출발지 위도
          endX: end.lng, // 도착지 경도
          endY: end.lat, // 도착지 위도
          count:10,
          format: 'json', // 응답 형식
        },
        {
          headers: {
            'Content-Type': 'application/json',
            appKey: 'KjmMBUGAvZ16fxeeS3jFN2HOHfpus9kL9DQhuJRr', // 발급받은 AppKey
          },
        }
      );
      setRoute(response.data); // API 응답 저장
      console.log(response);
    } catch (error) {
      // 상세한 오류 메시지 출력
      if (error.response) {
        setErrorMessage(
          `Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`
        );
      } else if (error.request) {
        setErrorMessage('No response received from the server.');
      } else {
        setErrorMessage(`Request error: ${error.message}`);
      }
      console.error('API 요청 실패:', error);
    }
  };

  return (
    <div>
      <h1>TMAP 대중교통 경로 탐색</h1>
      <button onClick={fetchTransitRoute}>경로 탐색</button>
      {errorMessage && (
        <div style={{ color: 'red' }}>
          <p>에러가 발생했습니다:</p>
          <p>{errorMessage}</p>
        </div>
      )}
      {route?.metaData?.plan?.itineraries ? (
      <div>
        <h2>경로 상세 정보</h2>
        {
          route.metaData.plan.itineraries.map((itinerary, index) => (
            <div key = {index}>
              <h3>상세 경로 {index+1}</h3>
              <ul>
                {
                  itinerary.legs.map((leg,legIndex)=>(
                    <li key = {legIndex}>
                      {
                        leg.mode === 'WALK' && (
                          <span>
                            {leg.end.name}까지 도보로 이동, {Math.round(leg.sectionTime/60)}분 소요<br/>
                          </span>
                        )
                      }
                      {
                        leg.mode === 'BUS' && (
                          <span>
                            {leg.start.name}에서 승차<br/>
                            {leg.route}<br/>
                            {leg.end.name}에서 하차 <br/>
                            {Math.round(leg.sectionTime/60)}분 소요
                          </span>
                        )
                      }
                      {
                        leg.mode === 'SUBWAY' && (
                          <span>
                            {leg.start.name}에서 승차<br/>
                            {leg.route}<br/>
                            {leg.end.name}에서 하차 <br/>
                            {Math.round(leg.sectionTime/60)}분 소요
                          </span>
                        )
                      }

                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        }
      </div>
      ) : (
        <p>경로 데이터 불러오는중...</p>
      )}

      
      
    </div>
  );
};

export default Direction;
