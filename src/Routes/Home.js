import { useNavigate } from 'react-router-dom';
import styles from '../Css/Home.module.css';
import pic1 from '../Images/Pizza.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsSearch } from 'react-icons/bs';

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.l}>
      <div className={styles.upBar}>
        <h2>JMC</h2>
      </div>

      <div className={styles.body}>
        <img src={pic1} className={styles.bgImg} />
        <h1 className={styles.cp}>
          다양한 음식을
          <br />
          비교하여 선정하세요.
        </h1>
        <div className={styles.searchBar}>
          메뉴, 식당 이름을 입력해주세요
          <button
            onClick={() => {
              navigate('/Map');
            }}
          >
            <BsSearch className={styles.searchIcon} />
          </button>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <button
          className={styles.goRoullete}
          onClick={() => {
            navigate('/roulette');
          }}
        >
          메뉴 선택이 어려우신가요?
        </button>
      </div>
    </div>
  );
}

export default Home;
