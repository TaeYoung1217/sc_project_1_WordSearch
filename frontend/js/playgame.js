import { ANSWER } from "./display.js";
import { WIDTH, HEIGHT, DIRECTION } from "./display.js";
import { gameOver } from "./gameover.js";

let isMouseDown = false;

let start_board = null;
let end_board = null;

const handleMouseDown = (event) => {
  isMouseDown = true;
  start_board = event.target; //마우스 down이벤트가 발생한 보드
  highlightBoard(start_board); //시작지점부터 마우스로 드래그하는 부분 색칠하기
};

const handleMouseOver = (event) => {
  if (isMouseDown) {
    const cur_board = event.target; //드래그하면서 움직이는 동안 보드 저장
    highlightBoard(cur_board); //색칠
    end_board = cur_board; //끝나는 지점 저장
  }
};

const handleMouseUp = (event) => {
  isMouseDown = false;

  if (start_board && end_board) {
    //최대한 다른 요소까지 색칠되지 않게 하기 위해 board를 div안에 감싸고
    //board에만 이벤트 리스너를 부착, 마우스로 보드를 드래그하면 보드를 감싸고 있는 부모 요소를 찾아
    if (start_board == document.querySelector(".board").parentElement)
      start_board = start_board.children;
    else if (end_board == document.querySelector(".board".parentElement))
      end_board = end_board.children;
    //단어확인 및 처리 로직 구현
    getSelectedWord(start_board, end_board);
    isGameOver(); //정답을 모두 맞추면 game over
  }
};

const wrongAnswer = (axis, length) => {
  for (let i = 0; i < length; i++) {
    const wrongBoard = document.getElementById(
      `board[${axis[i][1]}][${axis[i][0]}]`
    );

    wrongBoard.animate(
      [
        { transform: "translateY(0px)", background: "yellow" }, //시작위치
        {
          transform: "translateY(-10px)",
          background: "yellow",
        }, //도착위치
      ],
      { duration: 250, iterations: 2 } //지속시간, 반복횟수
    );
  }
};

const highlightAnswer = (axis, length) => {
  //정답 색칠하는 부분
  for (let i = 0; i < length; i++) {
    const answerBoard = document.getElementById(
      `board[${axis[i][1]}][${axis[i][0]}]`
    );
    if (answerBoard.style.backgroundColor != "green") {
      answerBoard.style.backgroundColor = "green";
      answerBoard.parentElement.style.backgroundColor = "green";
    }
  }
};

const highlightBoard = (board) => {
  //드래그하는 부분 노랗게 색칠
  if (board.style.backgroundColor == "green") return;
  else {
    board.style.backgroundColor = "yellow";
    board.parentElement.style.backgroundColor = "yellow";
  }
};

const clearSelction = () => {
  //전체 보드의 backgroundcolor 를 화이트로
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const board = document.getElementById(`board[${i}][${j}]`);
      if (board.style.backgroundColor == "green") continue;
      //정답이 색칠되어 있으면 넘어가기
      else {
        board.style.backgroundColor = "white";
        board.parentElement.style.backgroundColor = "white";
      }
    }
  }
};

const isGameOver = () => {
  //게임 끝났는지 판단
  const answerList = document.getElementById("answer_list"); //표시된 정답 list를 가져와서
  let check = true;
  for (let i = 0; i < answerList.childElementCount; i++) {
    const answer = document.getElementById(`answer_list${i}`);
    if (answer.style.textDecoration != "line-through") {
      //가운데 줄 그어 있는지 확인, 아니라면 return
      return;
    }
  }
  gameOver(); //모든 정답에 정답표시 되어있으면 gameover 처리
};

const isAnswer = (word) => {
  //드래그한 부분의 단어를 읽어들어와서 정답인지 판단
  for (let i = 0; i < ANSWER.length; i++) {
    //DB에서 가져온 단어 리스트에 드래그한 단어가 있는지 확인
    const answer_list = document.getElementById(`answer_list${i}`);
    if (answer_list.innerText === word) {
      //있으면 정답표시
      answer_list.style.textDecoration = "line-through"; //가운데 줄 긋고
      answer_list.style.color = "green"; //초록색으로 표시
      return true;
    }
  }
  return false;
};

const getWord = (j, i, word) => {
  //마우스로 지가나는 보드의 텍스트 가져오기
  const cur_board = document.getElementById(`board[${j}][${i}]`);
  word = cur_board.innerText;

  return word;
};

const getSelectedWord = (start, end) => {
  //마우스로 선택한 단어 가져오기
  const start_row = start.dataset.row; //시작점의 row
  const start_col = start.dataset.col; //시작점의 col
  const end_row = end.dataset.row; //도착점 row
  const end_col = end.dataset.col; //도착점 col
  const dx = end_col - start_col; //가로 변화량
  const dy = end_row - start_row; //세로 변화량
  let axis = []; //지나간 좌표 저장하기 위한 배열
  let i = start_col; //x 시작점
  let j = start_row; //y 시작점 (j,i)에서 시작 헷갈리지 않기!
  let word = "";

  if (dx == 0 && dy > 0) {
    //아래
    while (true) {
      axis.push([i, j]); //마우스로 드래그한 부분 좌표 저장
      word += getWord(j, i, word);
      j++;
      if (j > end_row) break; //진행 방향으로 가다가 도착지점까지 가면 반복문 탈출
    }

    if (isAnswer(word)) highlightAnswer(axis, word.length); //정답이라면 색칠
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word; //저장한 단어 반환
  } else if (dx == 0 && dy < 0) {
    //위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      j--;
      if (j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx > 0 && dy == 0) {
    //오른쪽
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i++;
      if (i > end_col) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx < 0 && dy == 0) {
    //왼쪽
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i--;
      if (i < end_col) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx > 0 && dy < 0) {
    //오른쪽위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i++;
      j--;
      if (i > end_col || j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx > 0 && dy > 0) {
    //오른쪽 아래
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i++;
      j++;
      if (i > end_col || j > end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx < 0 && dy < 0) {
    //왼쪽 위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i--;
      j--;
      if (i < end_col || j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  } else if (dx < 0 && dy > 0) {
    //왼쪽 아래
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      i--;
      j++;
      if (i < end_col || j > end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);
    else {
      wrongAnswer(axis, word.length);
      clearSelction();
    }

    return word;
  }
};

export function addListener(board) {
  //이벤트 리스너 부착
  board.addEventListener("mousedown", handleMouseDown);
  board.addEventListener("mouseover", handleMouseOver);
  board.addEventListener("mouseup", handleMouseUp);
}
