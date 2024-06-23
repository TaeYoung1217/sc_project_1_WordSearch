import { addListener } from "./playgame.js";

const ALPHABET = Array.from({ length: 26 }, (v, i) =>
  String.fromCharCode(i + 65)
); //보드 배치를 위한 알파벳 배열 생성

export const WIDTH = 10; //너비 설정
export const HEIGHT = 10; //높이 설정

export let ANSWER = []; //정답을 저장할 배열 선언

export const DIRECTION = [
  //진행 방향 설정
  [0, 1], //아래
  [0, -1], //위
  [1, 0], //오른쪽
  [-1, 0], //왼쪽
  [1, -1], //오른쪽 위
  [1, 1], //오른쪽아래
  [-1, -1], // 왼쪽 위
  [-1, 1], //왼쪽아래
];

export let interval; //타이머를 저장하기 위한 변수

//DB에 저장된 정답단어들 가져오기
export const getAnswerFromDB = async (accessToken) => {
  const res = await fetch("/answers", {
    //서버에 get 요청, accessToken을 담아서
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  data.forEach(async (obj) => {
    //DB에서 받아온 answer들을 ANSWER 변수에 저장
    ANSWER.push(obj.answer);
  });

  display_board();
};

const display_board = async () => {
  //보드 세팅

  //--------------------------------------------------------
  set_answer_list(); //보드 옆에 정답 목록 표시
  const board_wrapper = document.getElementById("board_wrapper");
  for (let i = 0; i < HEIGHT; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    for (let j = 0; j < WIDTH; j++) {
      const parentBoard = document.createElement("div");
      parentBoard.className = "parentBoard";

      const board = document.createElement("div");
      board.id = `board[${i}][${j}]`; //보드를 맵처럼 사용하기 위해 id 설정
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
  //DB에 있는 기록 가져와서 rankboard에 세팅
  const res = await fetch("/records"); //recodrs 엔드포인트로 서버에 get 요청
  const data = await res.json();
  let i = 1;
  data.forEach((obj) => {
    const records = document.getElementById("records");
    const info = document.createElement("div");
    info.style.fontSize = "20px";
    info.style.display = "flex";
    info.style.flexDirection = "row";
    info.style.justifyContent = "space-between";
    if (i == 1) {
      //1,2,3위 강조표시
      info.style.color = "rgb(255,215,0)";
      info.innerText = `🥇 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else if (i == 2) {
      info.style.color = "rgb(192, 192, 192)";
      info.innerText = `🥈 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else if (i == 3) {
      info.style.color = "rgb(205, 127, 50)";
      info.innerText = `🥉 ${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;
    } else info.innerText = `${i}위 이름 : ${obj.name} 기록 : ${obj.time}`;

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
        //정답먼저 채워진 보드에서 빈칸인지 체크 후 랜덤알파벳 채우기
        board_text.innerText =
          ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }
};

//보드에 배치 가능한지 확인
const check_available = (answer, cur_dir, board_X, board_Y) => {
  const max_x = board_X + cur_dir[0] * answer.length; //진행 방향으로 최대 가로
  const max_y = board_Y + cur_dir[1] * answer.length; //진행 방향으로 최대 세로

  if (max_x < 0 || max_x > WIDTH)
    return false; //최소, 최대 너비 넘어가면 false return
  else if (max_y < 0 || max_y > HEIGHT)
    return false; //최소, 최대 높이 넘어가면 false return
  else {
    for (let i = 0; i < answer.length; i++) {
      //시작점에서부터 진행방향쪽으로 보드를 하나씩 가져와 유효한지 확인
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
  const list = document.getElementById("answer_list"); //DB에서 가져온 ANSWER 변수를 메인화면에 세팅

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

    timerDiv.innerText = `time ${min}:${sec}`;
  }
  interval = setInterval(setTime, 1000); //game over 처리를 하기 위해 interval 변수에 저장
};
