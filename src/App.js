import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Map from "./Routes/Map";
import Roullete from "./Routes/Roullete";
import Review from "./Routes/Review";

function App() {
  return (
    <div className="app">
      <Routes className="route">
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/roullete" element={<Roullete></Roullete>}></Route>
        <Route path="/map" element={<Map></Map>}></Route>
        <Route path="/review" element={<Review></Review>}></Route>
      </Routes>
    </div>
  );
}

export default App;
