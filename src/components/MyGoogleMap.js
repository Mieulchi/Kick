import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function MyGoogleMap() {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 37.5665, // 서울의 위도
    lng: 126.978, // 서울의 경도
  };
  console.log("API Key:", process.env.REACT_APP_GOOGLE_MAP_KEY); // API 키 확인용 로그

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Marker 예제 */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
