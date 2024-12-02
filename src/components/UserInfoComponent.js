import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "../Css/Community.module.css";
import darkLogo from "../Logo/darkLogo.png";

export default function UserInfoComponent({setUserId = f =>f}) {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const baseURL = `http://localhost:4000`;

  useEffect(() => {
    axios
      .get(`${baseURL}/check-login`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization 헤더에 토큰 추가
        },
      })
      .then((response) => {
        setUser(response.data.user);
        setUserId(response.data.user.username);
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
        }
      });
  }, []);

  return (
    <div>
      <nav className={styles.upBar} id={styles.hd}>
        <img
          onClick={() => {
            navigate("/");
          }}
          src={darkLogo}
        />

        <div className={styles.user}>
          {user ? (
            <>
              <h3>Welcome, {user.username}</h3>
              <h3
                onClick={() => {
                  localStorage.removeItem("token");
                  location.reload();
                }}
              >
                로그아웃
              </h3>
            </>
          ) : (
            <h3
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인/회원가입
            </h3>
          )}
        </div>
      </nav>
    </div>
  );
}
