import styles from './App.module.css';
import { Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Map from './Routes/Map';
import Roullete from './Routes/Roulette';
import Review from './Routes/Review';
import AiConsult from './Routes/AiConsult';
import { APIProvider } from '@vis.gl/react-google-maps';
import Detail from './Routes/Detail';
import Direction from './Routes/Direction';

function App() {
  return (
    <APIProvider apiKey={`${process.env.REACT_APP_GOOGLE_MAP_KEY}`}>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/roulette" element={<Roullete></Roullete>}></Route>
        <Route path="/map" element={<Map></Map>}></Route>
        <Route path="/review" element={<Review></Review>}></Route>
        <Route path="/AiConsult" element={<AiConsult></AiConsult>}></Route>
        <Route path="/detail" element={<Detail></Detail>}></Route>
        <Route path="/direction" element={<Direction></Direction>}></Route>
        
      </Routes>
    </APIProvider>
  );
}

export default App;
