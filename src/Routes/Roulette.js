import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "../Css/Roulette.module.css";

function Roulette() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const items = ["초밥", "치킨", "제육", "피자"];

  const handleSpin = () => {
    const randomDegree = Math.floor(Math.random() * 360 + 1440);
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    // 회전이 끝난 후 선택된 아이템 계산
    setTimeout(() => {
      const totalItems = items.length;
      const degreesPerItem = 360 / totalItems;

      // 현재 회전 각도를 360으로 나눈 나머지를 구하여 실제 각도 계산
      const finalRotation = newRotation % 360;

      // 핀의 위치를 고려하여 어떤 아이템이 선택되었는지 계산
      // 핀의 위치를 중앙에 두기 위해 + degreesPerItem / 4를 추가합니다.
      const selectedIndex =
        Math.floor((finalRotation + degreesPerItem / 2) / degreesPerItem) %
        totalItems;
      setSelectedItem(items[(totalItems - selectedIndex) % totalItems]); // 반전된 인덱스
    }, 5000); // 애니메이션 시간과 맞추기 (여기서는 5초로 설정)
  };

  return (
    <div style={{ width: "80%", height: "100vh", margin: "40px" }}>
      <div className={styles.roulette_outer}>
        <div className={styles.roulette_pin}></div>
        <div className={styles.roulette_outerbtn}>
          <button className={styles.roulette_btn} onClick={handleSpin}>
            Spin!
          </button>
        </div>
        <div
          className={styles.roulette}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className={styles.item_wrapper}>
            {items.map((item, index) => (
              <div className={styles.item} key={index}>
                {item}
              </div>
            ))}
          </div>
          <div className={styles.line_wrapper}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        </div>
      </div>

      {selectedItem && ( // 선택된 아이템이 있을 때 결과 표시
        <div className={styles.selectedItem}>오늘 점심은 {selectedItem} !!</div>
      )}

      <button
        onClick={() => {
          navigate("/map");
        }}
      >
        지도화면으로
      </button>
    </div>
  );
}

export default Roulette;
