import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../Css/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsSearch } from "react-icons/bs";
import chicken from "../Images/chicken.jpg";
import noodle from "../Images/noodle.jpg";
import pizza from "../Images/pizza.jpg";
import soup from "../Images/soup.jpg";

function Home() {
  const navigate = useNavigate();
  const images = [chicken, noodle, pizza, soup]; // 이미지 배열
  const [currentImage, setCurrentImage] = useState(null);

  // 모든 이미지를 미리 로드하여 캐시
  useEffect(() => {
    // 이미지 미리 로드
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });

    // 랜덤 이미지 선택
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCurrentImage(randomImage);
  }, []); // 빈 배열을 두 번째 인자로 넣어 한 번만 실행되게 설정

  return (
    <div className={styles.l}>
      <nav className={styles.upBar} id={styles.hd}>
        <h2>JMC</h2>
      </nav>

      <section
        className={styles.body}
        id={styles.bg}
        style={{ backgroundImage: `url(${currentImage})` }} // 랜덤 이미지 적용
      >
        <h1 className={styles.cp}>
          다양한 음식을
          <br />
          비교하여 선정하세요.
        </h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="메뉴, 식당 이름을 입력해주세요"
            className={styles.searchInput}
          />
          <button
            onClick={() => {
              navigate("/Map");
            }}
          >
            <BsSearch className={styles.searchIcon} />
          </button>
        </div>
      </section>

      <button
        className={styles.goRoullete}
        onClick={() => {
          navigate("/roullete");
        }}
      >
        룰렛 돌리기
      </button>
    </div>
  );
}

export default Home;
