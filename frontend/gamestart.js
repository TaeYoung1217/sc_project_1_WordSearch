import { getAnswerFromDB } from "./display.js";
const gamePopup = document.getElementById("game_popup");
const startGameButton = document.getElementById("start_game_button");

export const gameStart = () => {
  // const loginlink = document.getElementById("loginlink");
  // loginlink.style.display = "none";

  // const signuplink = document.getElementById("signuplink");
  // signuplink.style.display = "none";

  startGameButton.addEventListener("click", () => {
    gamePopup.style.display = "none";
    setName();
    getAnswerFromDB(); //DB에서 정답 받아오면서 게임시작
  });
  // 팝업 표시
  document.addEventListener("DOMContentLoaded", () => {
    gamePopup.style.display = "block";
  });
  const setName = () => {
    const header = document.querySelector("header");
    const name = document.getElementById("input_name");
    const nameSetDiv = document.createElement("div");
    nameSetDiv.id = "nameSetDiv";
    nameSetDiv.innerText = `이름 : ${name.value}`;

    header.appendChild(nameSetDiv);
  };
};
gameStart();
