import { getAnswerFromDB } from "./display.js";
const gamePopup = document.querySelector("#game_popup");
const start_button = document.getElementById("start_button");
const loginlink = document.getElementById("loginlink");
const logout_button = document.getElementById("logout_button");
const user_name_display = document.getElementById("user_name_display");
let LoggedIn = false;

const loginCheck = async (event) => {
  //로그인하기 눌렀을때 로그인 되어있는지 체크
  event.preventDefault();
  const accessToken = window.localStorage.getItem("token");

  if (accessToken) {
    //로그인시 토큰을 로컬스토리지에 저장하기때문에 토큰이 있으면 로그인된 것으로 판단
    alert("이미 로그인 되어 있습니다");
    window.location.pathname = "/index.html"; //로그인 되어있으면 홈화면으로 이동
  } else {
    window.location.pathname = "/login.html"; //로그인 안되어있으면 로그인화면으로 이동
  }
};

const isLogin = async () => {
  //게임 플레이 버튼 눌렀을때 로그인 되어있는지 체크
  const accessToken = window.localStorage.getItem("token");

  const res = await fetch("/answers", {
    //accessToken 인증 정보를 담아서 서버에 요청
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.status === 401) {
    //Unauthorized 오류 발생시
    alert("로그인이 필요합니다");
    window.location.pathname = "/login.html";
    return;
  } else if (res.status === 200) {
    //로그인 성공시
    LoggedIn = true;
    loginlink.style.display = "none";
    logout_button.innerText = "로그아웃";
    gameStart(accessToken);
  }
};

export const parseJwt = (token) => {
  //accesstoken에서 payload 부분 가져오는 함수
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};
const setName = (accessToken) => {
  //로그인한 사람의 아이디 보여주기
  const token = window.localStorage.getItem("token");
  const name = parseJwt(token).sub.id;
  const nameSetDiv = document.getElementById("nameSetDiv");
  nameSetDiv.innerText = `이름 : ${name}`;

  getAnswerFromDB(accessToken); //DB에서 정답 받아오면서 게임시작
};

export const gameStart = async (accessToken) => {
  gamePopup.style.display = "none"; //홈화면에 띄워진 팝업 안보이게 처리
  setName(accessToken);
};

window.addEventListener("DOMContentLoaded", async () => {
  if (LoggedIn) {
    loginlink.style.display = "none";
  }
});
gamePopup.style.display = "block";
loginlink.addEventListener("click", loginCheck);
start_button.addEventListener("click", isLogin);
