import { gameStart } from "./gamestart.js";
import { addListener } from "./playgame.js";

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const WIDTH = 10;
export const HEIGHT = 10;

export let ANSWER = ["ABCDE"];

const DIRECTION = [
  [0, 1], //아래
  [0, -1], //위
  [1, 0], //오른쪽
  [-1, 0], //왼쪽
  [1, -1], //오른쪽 위
  [1, 1], //오른쪽아래
  [-1, -1], // 왼쪽 위
  [-1, 1], //왼쪽아래
];

//정답 무작위로 섞기
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export let interval; //타이머를 저장하기 위한 변수

//DB에 저장된 정답단어들 가져오기
export const getAnswerFromDB = async () => {
  // const res = await fetch("/answers")
  //   .then((res) => res.json())
  //   .then((data) => {
  //     data.forEach((obj) => {
  //       ANSWER.push(obj.answer);
  //     });
  //   });

  shuffle(ANSWER);
  display_board();
};

const display_board = async () => {
  //보드 세팅

  //--------------------------------------------------------
  set_answer_list();
  const board_wrapper = document.getElementById("board_wrapper");
  for (let i = 0; i < HEIGHT; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    for (let j = 0; j < WIDTH; j++) {
      const parentBoard = document.createElement("div");
      parentBoard.className = "parentBoard";

      const board = document.createElement("div");
      board.id = `board[${i}][${j}]`;
      board.setAttribute("data-row", i);
      board.setAttribute("data-col", j);
      board.className = `board`;
      addListener(board);

      parentBoard.appendChild(board);
      row.appendChild(parentBoard);
    }
    board_wrapper.appendChild(row);
  }

  set_timer();
  fill_answer();
  set_records();
};

const set_records = async () => {
  const res = await fetch("/records");
  const data = await res.json();
  let i = 1;
  data.forEach((obj) => {
    const records = document.getElementById("records");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const time = document.createElement("div");
    name.style.fontSize = "20px";
    name.style.width = "130px";
    name.style.right = 0;
    time.style.fontSize = "20px";
    time.style.width = "1500px";
    time.style.left = 0;

    info.innerText = `${i}위 :::`;
    info.style.fontSize = "20px";
    info.style.display = "flex";
    info.style.flexDirection = "row";
    info.style.justifyContent = "space-between";

    name.innerText = `이름 : ${obj.name} `;
    time.innerText = `| 기록 : ${obj.time}`;

    info.appendChild(name);
    info.appendChild(time);

    records.appendChild(info);
    i++;
  });
};

//정답단어 먼저 백지상태에서 채우기
const fill_answer = () => {
  for (let i = 0; i < ANSWER.length; i++) {
    const cur_dir = DIRECTION[Math.floor(Math.random() * DIRECTION.length)]; //진행방향 설정
    let board_X = Math.floor(Math.random() * WIDTH); //시작지점 x 좌표
    let board_Y = Math.floor(Math.random() * HEIGHT); //시작지점 y 좌표

    while (true) {
      //배치 가능한 시작점 찾기
      board_X = Math.floor(Math.random() * WIDTH);
      board_Y = Math.floor(Math.random() * HEIGHT);
      if (check_available(ANSWER[i], cur_dir, board_X, board_Y)) break;
    }

    for (let j = 0; j < ANSWER[i].length; j++) {
      const cur_board = document.getElementById(
        `board[${board_X}][${board_Y}]`
      );
      cur_board.innerText = ANSWER[i][j];
      cur_board.parentElement.style.backgroundColor = "gray";
      board_X += cur_dir[0];
      board_Y += cur_dir[1];
    }
  }
  fill_text();
};

const fill_text = () => {
  for (let i = 0; i < HEIGHT; i++) {
    //빈칸 채우기, 랜덤으로 알파벳 채우기
    for (let j = 0; j < WIDTH; j++) {
      const board_text = document.getElementById(`board[${i}][${j}]`);
      if (board_text.innerText == "") {
        board_text.innerText =
          ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
};

//보드에 배치 가능한지 확인
const check_available = (answer, cur_dir, board_X, board_Y) => {
  const max_x = board_X + cur_dir[0] * answer.length;
  const max_y = board_Y + cur_dir[1] * answer.length;

  if (max_x < 0 || max_x > WIDTH) return false;
  else if (max_y < 0 || max_y > HEIGHT) return false;
  else {
    for (let i = 0; i < answer.length; i++) {
      const cur_board = document.getElementById(
        `board[${board_X}][${board_Y}]`
      );
      board_X += cur_dir[0];
      board_Y += cur_dir[1];
      if (cur_board == null) return false;
      if (cur_board.innerText != "") {
        if (cur_board.innerText == answer[i]) continue;
        //다른 정답과 겹치는지 판단
        else return false;
      }
    }
    return true;
  }
};

//정답 단어 list 작성
const set_answer_list = () => {
  const list = document.getElementById("answer_list");

  for (let i = 0; i < ANSWER.length; i++) {
    const answer = document.createElement("div");
    answer.id = `answer_list${i}`;
    answer.className = "answer_list";
    answer.innerText = ANSWER[i];
    answer.style.fontSize = "20px";
    answer.style.marginBottom = "5px";
    list.appendChild(answer);
  }
};

//타이머 설정
const set_timer = () => {
  const startTime = new Date();
  const timerDiv = document.getElementById("timer");
  function setTime() {
    const curTime = new Date();
    const timer = new Date(curTime - startTime);
    const min = timer.getMinutes().toString().padStart(2, "0");
    const sec = timer.getSeconds().toString().padStart(2, "0");

    timerDiv.innerText = `${min}:${sec}`;
  }
  interval = setInterval(setTime, 1000);
};
