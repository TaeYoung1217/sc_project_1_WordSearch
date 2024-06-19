import { ANSWER } from "./display.js";
import { WIDTH } from "./display.js";
import { HEIGHT } from "./display.js";
import { gameOver } from "./gameover.js";

let isMouseDown = false;

let start_board = null;
let end_board = null;

const handleMouseDown = (event) => {
  isMouseDown = true;
  start_board = event.target;
  highlightBoard(start_board);
};

const handleMouseOver = (event) => {
  if (isMouseDown) {
    const cur_board = event.target;
    highlightBoard(cur_board);
    end_board = cur_board;
  }
};

const handleMouseUp = (event) => {
  isMouseDown = false;

  if (start_board && end_board) {
    if (start_board == document.querySelector(".board").parentElement)
      start_board = start_board.children;
    else if (end_board == document.querySelector(".board".parentElement))
      end_board = end_board.children;
    //단어확인 및 처리 로직 구현
    getSelectedWord(start_board, end_board);
    isGameOver();
  }

  clearSelction();
};

const highlightAnswer = (axis, length) => {
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
  if (board.style.backgroundColor == "green") return;
  else {
    board.style.backgroundColor = "yellow";
    board.parentElement.style.backgroundColor = "yellow";
  }
};

const clearSelction = () => {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const board = document.getElementById(`board[${i}][${j}]`);
      if (board.style.backgroundColor == "green") continue;
      else {
        board.style.backgroundColor = "white";
        board.parentElement.style.backgroundColor = "white";
      }
    }
  }
};

const isGameOver = () => {
  const answerList = document.getElementById("answer_list");
  let check = true;
  for (let i = 0; i < answerList.childElementCount; i++) {
    const answer = document.getElementById(`answer_list${i}`);
    if (answer.style.textDecoration != "line-through") {
      check = false;
      break;
    }
  }
  if (check) gameOver();
};

const isAnswer = (word) => {
  for (let i = 0; i < ANSWER.length; i++) {
    const answer_list = document.getElementById(`answer_list${i}`);
    if (answer_list.innerText === word) {
      answer_list.style.textDecoration = "line-through";
      answer_list.style.color = "green";
      return true;
    }
  }
  return false;
};

const getWord = (j, i, word) => {
  const cur_board = document.getElementById(`board[${j}][${i}]`);
  word = cur_board.innerText;

  return word;
};

const getSelectedWord = (start, end) => {
  const start_row = start.dataset.row;
  const start_col = start.dataset.col;
  const end_row = end.dataset.row;
  const end_col = end.dataset.col;
  const dx = end_col - start_col;
  const dy = end_row - start_row;
  let axis = [];
  let i = start_col; //x 시작점
  let j = start_row; //y 시작점 (j,i)에서 시작 헷갈리지 않기!
  let word = "";

  if (dx == 0 && dy > 0) {
    //아래
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      j++;
      if (j > end_row) break;
    }

    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx == 0 && dy < 0) {
    //위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      j--;
      if (j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx > 0 && dy == 0) {
    //오른쪽
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i++;
      if (i > end_col) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx < 0 && dy == 0) {
    //왼쪽
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i--;
      if (i < end_col) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx > 0 && dy < 0) {
    //오른쪽위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i++;
      j--;
      if (i > end_col || j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx > 0 && dy > 0) {
    //오른쪽 아래
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i++;
      j++;
      if (i > end_col || j > end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx < 0 && dy < 0) {
    //왼쪽 위
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i--;
      j--;
      if (i < end_col || j < end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  } else if (dx < 0 && dy > 0) {
    //왼쪽 아래
    while (true) {
      axis.push([i, j]);
      word += getWord(j, i, word);
      console.log(word);
      i--;
      j++;
      if (i < end_col || j > end_row) break;
    }
    if (isAnswer(word)) highlightAnswer(axis, word.length);

    return word;
  }
};

export function addListener(board) {
  board.addEventListener("mousedown", handleMouseDown);
  board.addEventListener("mouseover", handleMouseOver);
  board.addEventListener("mouseup", handleMouseUp);
}
