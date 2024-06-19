import { interval } from "./display.js";

export const gameOver = async () => {
  clearInterval(interval);

  const gameOverPopup = document.getElementById("game-over-popup");
  const gameOverButton = document.getElementById("game_over_button");
  gameOverPopup.style.display = "block";
  const name = document.getElementById("input_name");
  const time = document.getElementById("timer");
  console.log(JSON.stringify({ name: name.value, time: time.innerText }));

  const res = await fetch("/gameOver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.value, time: time.innerText }),
  });

  gameOverButton.addEventListener("click", () => {
    gameOverPopup.style.display = "none";
    location.reload(true);
  });
};
