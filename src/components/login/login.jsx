import axios from "axios";
import React, { useState } from "react";
import styles from "./login.module.css";

const Login = ({
  onCloseButtonHandler,
  signupPopupHandler,
  findPopupHandler,
}) => {
  const [inputValue, setInputValue] = useState({
    id: "",
    password: "",
  });

  const [idSave, setIdSave] = useState(false);

  const { id, password } = inputValue;

  const onInputValueChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const onIdSaveChangeHandler = (e) => {
    setIdSave(e.target.checked);
  };

  const onLoginHandler = (e) => {
    e.preventDefault();
    if (id === "" || password === "") {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    axios
      .patch(`${process.env.REACT_APP_BASEURL}/auth/login`, {
        email: id,
        password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        onCloseButtonHandler();
        console.log(localStorage);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response.data.message);
        //아이디가 이메일 형식 아닐경우 + 비밀번호 8자리 아래로 입력한 경우 처리
      });
  };

  return (
    <div className={styles.login_popup}>
      <div onClick={onCloseButtonHandler}>
        <i className={`${styles.close_icon} fas fa-times`}></i>
      </div>
      <img
        src="/travelWithDog/images/logo.svg"
        alt="logo"
        className={styles.logo}
      />
      <h3 className={styles.title}>로그인</h3>
      <form className={styles.form}>
        <div className={styles.input_container}>
          <p className={styles.text}>이메일</p>
          <input
            name="id"
            onChange={onInputValueChangeHandler}
            value={id}
            type="email"
            className={styles.input}
            placeholder="이메일"
            spellCheck="false"
          />
        </div>
        <div className={styles.input_container}>
          <p className={styles.text}>비밀번호</p>
          <input
            name="password"
            onChange={onInputValueChangeHandler}
            value={password}
            type="password"
            className={styles.input}
            placeholder="비밀번호"
            spellCheck="false"
          />
        </div>

        <div className={styles.save_id_container}>
          <input
            value={idSave}
            onChange={onIdSaveChangeHandler}
            type="checkbox"
            className={styles.save_id}
          />
          <p className={styles.save_id_text}>아이디 저장</p>
        </div>
        <button
          type="submit"
          className={styles.submit_button}
          onClick={onLoginHandler}
        >
          로그인
        </button>
      </form>
      <div className={styles.sub_button_container}>
        <div className={styles.sub_button}>아이디찾기</div>
        <div
          className={styles.sub_button}
          onClick={() => {
            onCloseButtonHandler();
            findPopupHandler();
          }}
        >
          비밀번호찾기
        </div>
        <div
          className={styles.sub_button}
          onClick={() => {
            onCloseButtonHandler();
            signupPopupHandler();
          }}
        >
          회원가입
        </div>
      </div>

      <div className={styles.divide_container}>
        <div className={styles.divide_line}></div>
        <p className={styles.divide_text}>또는 아래 계정으로 로그인</p>
        <div className={styles.divide_line}></div>
      </div>
      <div className={styles.social_container}>
        <div className={styles.social_button}>
          <img
            src="/travelWithDog/images/kakao_round.png"
            alt="kakao_login"
            className={styles.social_image}
          />
          <p className={styles.social_text}>Kakao</p>
        </div>
        <div className={styles.social_button}>
          <img
            src="/travelWithDog/images/facebook_round.png"
            alt="facebook_login"
            className={styles.social_image}
          />
          <p className={styles.social_text}>Facebook</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
