import { WIDTH } from "./display.js";
const form = document.getElementById("maker_form");
let Answer = [];

function isEnglish(text) {
  // 영어 소문자(a-z)와 대문자(A-Z)로만 구성되어 있는지 검사
  return /^[a-zA-Z]+$/.test(text);
}

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  for (let i = 0; i < WIDTH; i++) {
    const div = document.getElementById(`error[${i}]`);
    const inputdiv = document.getElementById(`div[${i}]`);
    const inputText = formData.get(`input[${i}]`);
    if (isEnglish(inputText)) {
      if (!Answer.includes(inputText)) {
        if (inputText.length < 3) {
          div.innerText = "3글자 이상 입력하세요";
        } else Answer.push(inputText);
      }
      div.innerText = "";
    } else {
      div.style.color = "red";
      div.innerText = "영어만 입력하세요";

      inputdiv.appendChild(div);
    }
  }

  for (let i = 0; i < Answer.length; i++) {
    const res = await fetch("/addWords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer: Answer[i].toUpperCase() }),
    });
    console.log(JSON.stringify(Answer[i]));
    const data = await res.json();
  }
};

const makeInput = () => {
  for (let i = 0; i < WIDTH; i++) {
    const div = document.createElement("div");
    div.id = `div[${i}]`;
    const label = document.createElement("label");
    label.textContent = `${i + 1}번째 단어`;
    const error = document.createElement("div");
    error.id = `error[${i}]`;

    const input = document.createElement("input");
    input.id = `input[${i}]`;
    input.name = `input[${i}]`;
    input.setAttribute("type", "text");
    input.setAttribute("minlength", "3");
    input.setAttribute("maxlength", "10");
    input.setAttribute("required", "");

    label.setAttribute("for", `input[${i}]`);

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(error);

    form.appendChild(div);
  }
  const button = document.createElement("button");
  button.type = "submit";
  button.innerText = "제출";
  form.appendChild(button);
};
makeInput();
form.addEventListener("submit", handleSubmit);
