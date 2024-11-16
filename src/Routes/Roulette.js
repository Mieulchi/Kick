import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../Css/Roulette.module.css";
import { foods } from "../Data/foods";
import "bootstrap/dist/css/bootstrap.min.css";

function Roulette() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    filterByCategory("모두");
  }, []);

  const filterByCategory = (category) => {
    let filtered = foods;
    if (category !== "모두") {
      filtered = foods.filter((food) => food.category === category);
    }
    const shuffledFoods = shuffleArray(filtered);
    setFilteredItems(filtered);
    setItems(shuffledFoods.slice(0, 20));
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomDegree = Math.floor(Math.random() * 360 + 2160);
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    setTimeout(() => {
      const totalItems = items.length;
      const degreesPerItem = 360 / totalItems;
      const finalRotation = newRotation % 360;
      const selectedIndex =
        Math.floor((finalRotation + degreesPerItem / 2) / degreesPerItem) %
        totalItems;
      setSelectedItem(items[(totalItems - selectedIndex) % totalItems]);

      setIsSpinning(false);
    }, 8000);
  };

  return (
    <div className={`container ${styles.container}`}>
      <section className={styles.rouletteView}>
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
            {items.map((item, index) => (
              <div
                className={styles.item}
                key={index}
                style={{
                  transform: `rotate(${(360 / items.length) * index}deg)`,
                }}
              >
                <span className={styles.itemName}>{item.name}</span>
              </div>
            ))}
            {[...Array(items.length)].map((_, index) => (
              <div
                className={styles.line}
                key={index}
                style={{
                  transform: `rotate(${
                    (360 / items.length) * index + 360 / items.length / 2
                  }deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.selectView}>
        <div className={styles.category_button}>
          <button
            className="btn btn-primary"
            onClick={() => filterByCategory("모두")}
          >
            모두
          </button>
          <button
            className="btn btn-primary"
            onClick={() => filterByCategory("한식")}
          >
            한식
          </button>
          <button
            className="btn btn-primary"
            onClick={() => filterByCategory("양식")}
          >
            양식
          </button>
          <button
            className="btn btn-primary"
            onClick={() => filterByCategory("중식")}
          >
            중식
          </button>
          <button
            className="btn btn-primary"
            onClick={() => filterByCategory("일식")}
          >
            일식
          </button>
        </div>
        <div className={styles.menuView}>
          오늘 점심은
          {selectedItem && (
            <div className={styles.selectedItem}>{selectedItem.name} !!!</div>
          )}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/map")}
        >
          음식점 찾기
        </button>
      </section>
    </div>
  );
}

export default Roulette;
