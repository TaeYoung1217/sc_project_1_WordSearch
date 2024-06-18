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

const WIDTH = 10;
const HEIGHT = 10;

export const ANSWER = ["APPLE", "BANANA", "KIWI", "ORANGE", "BEER", "SOJU"];

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

let interval;

const display_board = () => {
  set_answer_list();
  //보드 세팅
  const board_wrapper = document.createElement("div");
  board_wrapper.id = "board_wrapper";
  const main = document.querySelector("main");
  for (let i = 0; i < HEIGHT; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    for (let j = 0; j < WIDTH; j++) {
      const board = document.createElement("div");
      board.id = `board[${i}][${j}]`;
      board.setAttribute("data-row", i);
      board.setAttribute("data-col", j);
      board.className = `board`;
      board.style.width = "50px";
      board.style.height = "50px";
      board.style.border = "1px solid black";
      board.style.display = "flex";
      board.style.justifyContent = "center";
      board.style.alignItems = "center";
      board.style.cursor = "pointer";
      board.style.userSelect = "none"; //드래그 할때 텍스트 블록처리 막기
      row.appendChild(board);
    }
    board_wrapper.appendChild(row);
    main.appendChild(board_wrapper);
  }

  set_timer();
  //get_answer() 구현 예정. 서버로부터 정답 받아오기
  fill_answer();
};

const fill_answer = () => {
  for (let i = 0; i < ANSWER.length; i++) {
    const cur_dir = DIRECTION[Math.floor(Math.random() * DIRECTION.length)]; //진행방향 설정
    let board_X = Math.floor(Math.random() * WIDTH); //시작지점 x 좌표
    let board_Y = Math.floor(Math.random() * HEIGHT); //시작지점 y 좌표
    while (true) {
      board_X = Math.floor(Math.random() * WIDTH);
      board_Y = Math.floor(Math.random() * HEIGHT);
      if (check_available(ANSWER[i], cur_dir, board_X, board_Y)) break;
    }

    for (let j = 0; j < ANSWER[i].length; j++) {
      const cur_board = document.getElementById(
        `board[${board_X}][${board_Y}]`
      );
      cur_board.innerText = ANSWER[i][j];
      cur_board.style.backgroundColor = "gray";
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
      if (cur_board == null) return false;
      if (cur_board.innerText != "") return false;
      board_X += cur_dir[0];
      board_Y += cur_dir[1];
    }
    return true;
  }
};

const set_answer_list = () => {
  const list = document.createElement("div");
  list.innerText = "ANSWER LIST";
  list.style.fontSize = "30px";
  const main = document.querySelector("main");
  for (let i = 0; i < ANSWER.length; i++) {
    const div = document.createElement("div");
    div.innerText = ANSWER[i];
    div.style.fontSize = "20px";
    list.appendChild(div);
  }
  list.style.marginRight = "50px";
  main.appendChild(list);
};

const set_timer = () => {
  const startTime = new Date();
  const timerDiv = document.getElementById("timer");
  function setTime() {
    const curTime = new Date();
    const timer = new Date(curTime - startTime);
    const min = timer.getMinutes().toString().padStart(2, "0");
    const sec = timer.getSeconds().toString().padStart(2, "0");

    timerDiv.innerText = "time " + `${min}:${sec}`;
  }
  interval = setInterval(setTime, 1000);
};

const gameOver = () => {
  clearInterval(interval);
};

display_board();

// for (const div of document.querySelectorAll(".board")) {
//   mouseMove(div, function (event) {
//     // 드래그했을 때 해당 부분이 버튼이 아닐 경우에는 return
//     if (!(event.target instanceof HTMLDivElement)) return;
//     // 드래그한 커서가 버튼 위에 갈 경우 빨간색으로 표시
//     event.target.style.backgroundColor = "red";
//   });
// }

// function mouseMove(target, whileMove) {
//   let endMove = function () {
//     // 마우스를 뗄 때 이벤트 리스너 제거
//     window.removeEventListener("mousemove", whileMove);
//     window.removeEventListener("mouseup", endMove);
//   };

//   // 마우스를 클릭한 채 움직이면 이벤트리스너 생성
//   target.addEventListener("mousedown", function (event) {
//     event.stopPropagation();
//     window.addEventListener("mousemove", whileMove);
//     window.addEventListener("mouseup", endMove);
//   });
// }
