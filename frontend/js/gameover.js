import { interval } from "./display.js";

const parseJwt = (token) => {
  //로그인시 저장된 accessToken에서 이름을 가져오는 함수
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

export const gameOver = async () => {
  clearInterval(interval); //타이머 저장한 interval 삭제

  const gameOverPopup = document.getElementById("game_over_popup"); //game over 팝업 보여주기
  const gameOverPopupContent = document.getElementById("game_over_text");

  const text = document.createElement("div");
  const gameOverButton = document.getElementById("game_over_button");
  gameOverPopup.style.display = "block";
  const token = window.localStorage.getItem("token");

  const name = parseJwt(token).sub.id;
  const time = document.getElementById("timer");

  text.innerText = `이름 : ${name //이름과 기록 표시
    .split(":")
    .pop()
    .trim()} , 기록 : ${time.innerText.split(" ").pop()}`;
  text.style.fontSize = "20px";
  gameOverPopupContent.appendChild(text);

  await fetch("/gameOver", {
    //gameOver 엔드포인트로 기록을 저장하기 위해 post 요청
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      time: time.innerText.split(" ").pop(),
    }),
  });

  gameOverButton.addEventListener("click", () => {
    gameOverPopup.style.display = "none";
    location.reload(true);
  });
};
