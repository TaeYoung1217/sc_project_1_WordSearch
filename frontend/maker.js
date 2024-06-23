import { WIDTH } from "./display.js";
const form = document.getElementById("maker_form");

function isEnglish(text) {
  // 영어 소문자(a-z)와 대문자(A-Z)로만 구성되어 있는지 검사
  return /^[a-zA-Z]+$/.test(text);
}

const handleSubmit = async (event) => {
  //추가버튼 누르면
  event.preventDefault();
  const formData = new FormData(form);
  for (let i = 0; i < WIDTH; i++) {
    //최대가 너비만큼의 단어 길이이기 때문에
    const div = document.getElementById(`error[${i}]`);
    const inputdiv = document.getElementById(`div[${i}]`);
    const inputText = formData.get(`input[${i}]`);
    if (isEnglish(inputText)) {
      //영어단어인지 판단

      const res = await fetch("/addWords", {
        //서버에 post 요청, 서버에서는 중복 확인하여 DB에 저장
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputText }),
      });
      const data = await res.json();
      if (data === "200") {
        alert("추가 성공");
        window.location.pathname = "/";
      }

      div.innerText = "";
    } else {
      //오류 표시
      div.style.color = "red";
      div.innerText = "영어만 입력하세요";

      inputdiv.appendChild(div);
    }
  }
};

const makeInput = () => {
  //입력창 만드는 반복문
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
