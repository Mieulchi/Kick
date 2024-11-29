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
import Login from './Routes/Login'; 
import Register from './Routes/Register';
import Community from './Routes/Community';
import Post from './Routes/Post';
import PostDetail from './Routes/PostDetail';

function App() {
  return (
    <APIProvider apiKey={`${process.env.REACT_APP_GOOGLE_MAP_KEY}`}>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/post" element={<Post></Post>}></Route>
        <Route path="/posts/:id" element={<PostDetail></PostDetail>}></Route>
        <Route path="/community" element={<Community></Community>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
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
