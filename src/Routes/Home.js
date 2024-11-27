import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate here
import styles from "../Css/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsSearch } from "react-icons/bs";

import chicken from "../Images/chicken.jpg";
import meet from "../Images/meet.jpg";
import noodle from "../Images/noodle.jpg";
import pizza from "../Images/pizza.jpg";
import soup from "../Images/soup.jpg";
import darkLogo from "../Logo/darkLogo.png";
import AiConsult from "./AiConsult";
import Ai from "../Logo/aiLOGO.png";
import aiBubble from "../Images/aiBubble.png";

function Home() {
  const navigate = useNavigate(); // Initialize navigate using useNavigate
  const images = [chicken, noodle, pizza, soup, meet]; // 이미지 배열
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAiViewOpen, setIsAiViewOpen] = useState(false); // 상태 관리
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  const toggleAiView = () => {
    if (isAiViewOpen) {
      // AI View를 닫는 경우
      setIsAiViewOpen(false);
      setTimeout(() => {
        setIsBubbleVisible(true); // 2초 뒤에 Bubble 표시
      }, 2000);
    } else {
      // AI View를 여는 경우
      setIsBubbleVisible(false); // Bubble 즉시 숨김
      setIsAiViewOpen(true);
    }
  };

  // 'About Us' 섹션을 위한 ref
  const aboutUsRef = useRef(null);
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  // 모든 이미지를 미리 로드하여 캐시
  useEffect(() => {
    // 5초마다 이미지 변경
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [images.length]);

  // 'About Us' 클릭 시 해당 섹션으로 스크롤
  const scrollToAboutUs = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const refreshPage = () => {
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div className={styles.content}>
      <nav className={styles.upBar} id={styles.hd}>
        <img src={darkLogo} onClick={refreshPage} />
        {/* 'About Us' 클릭 시 scrollToAboutUs 호출 */}
        <h3 onClick={scrollToAboutUs}>about us</h3>
      </nav>

      <section className={styles.sliderContainer}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              currentImageIndex === index ? styles.active : ""
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)), url(${image})`,
            }}
          ></div>
        ))}
      </section>
      <section className={styles.body}>
        <div className={styles.search}>
          <h1 className={styles.cp}>
            다양한 음식을
            <br />
            비교하여 선정하세요.
          </h1>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="메뉴 이름을 입력해주세요"
              className={styles.searchInput}
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  selectedItem &&
                  selectedItem.trim() !== ""
                ) {
                  navigate("/Map", {
                    state: { selectedItem: { name: selectedItem } },
                  });
                }
              }}
            />
            <button
              onClick={() => {
                navigate("/Map", {
                  state: { selectedItem: { name: selectedItem } },
                });
              }}
              disabled={!selectedItem || selectedItem.trim() === ""} // 입력값이 없으면 버튼 비활성화
            >
              <BsSearch className={styles.searchIcon} />
            </button>
          </div>
          <button
            className={styles.goRoullete}
            onClick={() => {
              navigate("/Roulette"); // Use navigate here to go to '/Roulette'
            }}
          >
            룰렛 돌리기
          </button>
        </div>

        {isBubbleVisible && (
          <img
            src={aiBubble}
            style={{
              position: "absolute",
              top: "30%",
              left: "82%",
              width: "200px", // 원하는 크기로 설정
            }}
          />
        )}
        <div
          className={styles.aiView}
          style={{
            right: isAiViewOpen ? "30px" : "-400px", // 상태에 따라 위치 변경
            transition: "right 0.3s ease", // 부드러운 애니메이션
          }}
        >
          <img
            className={styles.aiConsultBtn}
            src={Ai}
            onClick={toggleAiView}
            style={{
              left: isAiViewOpen ? "-80px" : "-100px", // 상태에 따라 위치 변경
              transition: "0.3s ease", // 부드러운 애니메이션
            }}
          />
          <AiConsult />
        </div>
      </section>

      <section ref={aboutUsRef} className={styles.aboutUs}>
        <div className={styles.secondBody}>
          <h1>About Us</h1>
          <p className={styles.explainLOGO}>
            NOMAD는 "<b>N</b>earby <b>O</b>ptions <b>M</b>ap <b>A</b>nd <b>D</b>
            iscoveries"의 약자로,
          </p>
          <p>
            여러분이 어디에 있든 가장 맛있는 선택을 쉽고 재미있게 찾을 수 있도록
            도와드립니다.
          </p>
          <div className={styles.infoBoxes}>
            <div className={styles.infoBox}>
              <h2>룰렛으로 시작하는 미식 모험</h2>
              <p>
                설레는 기다림 끝에 여러분의 입맛에 맞는 메뉴를 추천받아보세요!
              </p>
            </div>
            <div className={styles.infoBox}>
              <h2>AI로 완성되는 맞춤형 추천</h2>
              <p>
                취향, 기분, 심지어 날씨까지 반영된 맞춤형 추천으로 새로운 경험을
                선사합니다.
              </p>
            </div>
            <div className={styles.infoBox}>
              <h2>지도 위에서 펼쳐지는 맛의 여정</h2>
              <p>
                선택한 메뉴와 가장 가까운 맛집을 찾아 탐험의 즐거움을 더하세요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
