import styles from './App.module.css';
import { Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Map from './Routes/Map';
import Roullete from './Routes/Roulette';
import Review from './Routes/Review';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/roulette" element={<Roullete></Roullete>}></Route>
      <Route path="/map" element={<Map></Map>}></Route>
      <Route path="/review" element={<Review></Review>}></Route>
    </Routes>
  );
}

export default App;
