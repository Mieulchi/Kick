import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "../Css/Roulette.module.css";
import { foods } from "../Data/foods";
import "bootstrap/dist/css/bootstrap.min.css";
import darkLogo from "../Logo/darkLogo.png";

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
    const updatedItems = customItems.filter(
      (_, itemIndex) => itemIndex !== index
    );
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
    <div className={styles.body}>
      <nav className={styles.upBar} id={styles.hd}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={darkLogo}
        />
      </nav>
      <div className={`container ${styles.container}`}>
        <section className={styles.rouletteView}>
          <div className={styles.roulette_outer}>
            <div className={styles.roulette_pin}></div>
            <div className={styles.roulette_outerbtn}>
              <button
                className={styles.roulette_btn}
                onClick={handleSpin}
                disabled={isSpinning}
              >
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
                    transform: `rotate(${
                      (360 /
                        (isCustomMode ? customItems.length : items.length)) *
                      index
                    }deg)`,
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
                      (360 /
                        (isCustomMode ? customItems.length : items.length)) *
                        index +
                      360 /
                        (isCustomMode ? customItems.length : items.length) /
                        2
                    }deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
        <div className={styles.customSwitch}>
          <p>Custom</p>
          <label className={styles.toggleSwitch}>
            <input
              type="checkbox"
              className={styles.toggleCheckbox}
              checked={isCustomMode}
              onChange={toggleCustomMode}
              disabled={isSpinning}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        <section className={styles.selectView}>
          {!isCustomMode && (
            <div className={styles.category_btn}>
              {["모두", "한식", "양식", "중식", "일식"].map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category
                      ? styles.active
                      : styles.inactive
                  }`}
                  onClick={() => handleCategoryClick(category)}
                  disabled={isSpinning}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {isCustomMode && (
            <div className={styles.customSideBar}>
              <div className={styles.customItems_Input}>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSpinning}
                  placeholder="메뉴를 입력하세요"
                />
                <button onClick={addCustomItem} disabled={isSpinning}>
                  추가
                </button>
              </div>
              <div className={styles.customItems_list}>
                <h4>
                  <strong>Menu</strong>
                </h4>
                {customItems.map((item, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      disabled={isSpinning}
                    />
                    <button
                      onClick={() => handleItemDelete(index)}
                      disabled={isSpinning}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </div>
            </div>
          )}

          <div
            className={
              isCustomMode ? styles.CustomSelectMenu : styles.selectMenu
            }
          >
            <div className={styles.menu}>
              <h3>점심 메뉴는?</h3>
              <div>
                {selectedItem && (
                  <div className={styles.selectedItem}>{selectedItem.name}</div>
                )}
              </div>
            </div>
          </div>
          {selectedItem && (
            <button
              className={
                isCustomMode ? styles.goToReview_custom : styles.goToReview
              }
              onClick={() => navigate("/map")}
              disabled={isSpinning}
            >
              음식점 찾기
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

export default Roulette;
