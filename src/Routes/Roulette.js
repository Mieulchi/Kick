import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../Css/Roulette.module.css";
import { foods } from "../Data/foods";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

function Roulette() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [items, setItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("모두");
  
  useEffect(() => {
    filterByCategory("모두");
  }, []);

  const filterByCategory = (category) => {
    let filtered = foods;
    if (category !== "모두") {
      filtered = foods.filter((food) => food.category === category);
    }
    const shuffledFoods = shuffleArray(filtered);
    setItems(shuffledFoods.slice(0, 20));
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const getRandomItems = (array, num) => {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, num);
  };
  
  const toggleCustomMode = () => {
    setIsCustomMode(!isCustomMode);
    setIsSpinning(false);
    setSelectedItem(null);
  
    if (!isCustomMode) {
      const initialItems = getRandomItems(foods, 5);
      setCustomItems(initialItems);
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const currentItems = isCustomMode ? customItems : items;
    const randomDegree = Math.floor(Math.random() * 360 + 2160);
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    setTimeout(() => {
      const totalItems = currentItems.length;
      const degreesPerItem = 360 / totalItems;
      const finalRotation = newRotation % 360;
      const selectedIndex =
        Math.floor((finalRotation + degreesPerItem / 2) / degreesPerItem) %
        totalItems;
      setSelectedItem(currentItems[(totalItems - selectedIndex) % totalItems]);

      setIsSpinning(false);
    }, 7000);
  };

  const handleItemChange = (index, newName) => {
    const updatedItems = [...customItems];
    updatedItems[index] = { name: newName };
    setCustomItems(updatedItems);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addCustomItem();
    }
  }; 
  
  const handleItemDelete = (index) => {
    const updatedItems = customItems.filter((_, itemIndex) => itemIndex !== index);
    setCustomItems(updatedItems);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterByCategory(category);
  };

  const addCustomItem = () => {
    if (newItem.trim() === "") return;
    setCustomItems([...customItems, { name: newItem }]);
    setNewItem("");
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
            {(isCustomMode ? customItems : items).map((item, index) => (
              <div
                className={styles.item}
                key={index}
                style={{
                  transform: `rotate(${(360 / (isCustomMode ? customItems.length : items.length)) * index}deg)`,
                }}
              >
                <span className={styles.itemName}>{item.name}</span>
              </div>
            ))}
            {[...(isCustomMode ? customItems : items)].map((_, index) => (
              <div
                className={styles.line}
                key={index}
                style={{
                  transform: `rotate(${
                    (360 / (isCustomMode ? customItems.length : items.length)) * index +
                    360 / (isCustomMode ? customItems.length : items.length) / 2
                  }deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.selectView}>
        {!isCustomMode && (
          <div className={styles.category_btn}>
            <button
              className={`btn btn-primary ${selectedCategory === "모두" ? "active" : "btn-light"}`}
              onClick={() => handleCategoryClick("모두")}>
              모두
            </button>
            <button 
              className={`btn btn-primary ${selectedCategory === "한식" ? "active" : "btn-light"}`} 
              onClick={() => handleCategoryClick("한식")}>
              한식
            </button>
            <button 
              className={`btn btn-primary ${selectedCategory === "양식" ? "active" : "btn-light"}`} 
              onClick={() => handleCategoryClick("양식")}>
              양식
            </button>
            <button 
              className={`btn btn-primary ${selectedCategory === "중식" ? "active" : "btn-light"}`} 
              onClick={() => handleCategoryClick("중식")}>
              중식
            </button>
            <button 
              className={`btn btn-primary ${selectedCategory === "일식" ? "active" : "btn-light"}`} 
              onClick={() => handleCategoryClick("일식")}>
              일식
            </button>
          </div>
        )}

        {isCustomMode && (
          <div className={styles.mode_change}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메뉴를 입력하세요"
            />
            <button onClick={addCustomItem}>
              추가
            </button>
          </div>
        )}

        {isCustomMode && customItems.length > 0 && (
          <div className={styles.customItems_list}>
            <h4>커스텀 메뉴</h4>
              {customItems.map((item, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => handleItemDelete(index)}
                  >
                    삭제
                  </button>
                </li>
              ))}
          </div>
        )}

        <button className={styles.mode_btn} onClick={toggleCustomMode}>
          <p>{isCustomMode ? "Custom" : "Normal"}</p>
          {isCustomMode ? (
            <FaToggleOn style={{ fontSize: "30px"}} />
          ) : (
            <FaToggleOff style={{ fontSize: "30px"}} />
          )}
        </button>

        <div className={styles.menuView}>
          오늘 점심은
          {selectedItem && (
            <div className={styles.selectedItem}>{selectedItem.name} !!!</div>
          )}
        </div>

        <button className="btn btn-primary mt-3" onClick={() => navigate("/map")}>
          음식점 찾기
        </button>
      </section>
    </div>
  );
}

export default Roulette;