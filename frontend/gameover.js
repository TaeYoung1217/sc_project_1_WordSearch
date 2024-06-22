import { interval } from "./display.js";

export const gameOver = async () => {
  clearInterval(interval);

  const gameOverPopup = document.getElementById("game_over_popup");
  const gameOverPopupContent = document.getElementById("game_over_text");

  const text = document.createElement("div");
  const gameOverButton = document.getElementById("game_over_button");
  gameOverPopup.style.display = "block";
  const name = document.getElementById("input_name");
  const time = document.getElementById("timer");

  text.innerText = `이름 : ${name.value
    .split(":")
    .pop()
    .trim()} , 기록 : ${time.innerText.split(" ").pop()}`;
  text.style.fontSize = "20px";
  gameOverPopupContent.appendChild(text);

  const res = await fetch("/gameOver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      time: time.innerText.split(" ").pop(),
    }),
  });

  gameOverButton.addEventListener("click", () => {
    gameOverPopup.style.display = "none";
    location.reload(true);
  });
};
