import { useNavigate } from "react-router-dom";
import "./Home.css";
import pic1 from "../Images/Pizza.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsSearch } from "react-icons/bs";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="L">
      <div className="upBar">
        <h2>JMC</h2>
      </div>
      <div className="body">
        <img src={pic1} class="bgImg" />
        <h1 className="CP">
          다양한 음식을
          <br />
          비교하여 선정하세요.
        </h1>
        <div className="SearchBar">
          메뉴, 식당 이름을 입력해주세요
          <button
            onClick={() => {
              navigate("/Map");
            }}
          >
            <BsSearch className="SearchIcon" />
          </button>
        </div>
      </div>
      <div className="bottomBar">
        <button
          className="GoRullete"
          onClick={() => {
            navigate("/roullete");
          }}
        >
          메뉴 선택이 어려우신가요?
        </button>
      </div>
    </div>
  );
}

export default Home;
