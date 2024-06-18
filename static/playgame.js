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

const board_wrapper = document.querySelector("#board_wrapper");
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
    //단어확인 및 처리 로직 구현
    console.log("Selected word:", getSelectedWord(start_board, end_board));
  }
  clearSelction();
};

const highlightBoard = (board) => {
  board.style.backgroundColor = "yellow";
};

const clearSelction = () => {
  if (start_board && end_board) {
    start_board.style.backgroundColor = "";
    end_board.style.backgroundColor = "";
    start_board = null;
    end_board = null;
  }
};

const getSelectedWord = (start, end) => {
  const start_row = start.dataset.row;
  const start_col = start.dataset.col;
  const end_row = end.dataset.row;
  const end_col = end.dataset.col;
  const dx = end_col - start_col;
  const dy = end_row - start_row;
  let i = start_col; //x 시작점
  let j = start_row; //y 시작점 (j,i)에서 시작 헷갈리지 않기!
  let word = "";
  console.log(start_row, start_col, end_row, end_col);
  console.log(dx, dy);

  if (dx == 0 && dy >= 1) {
    //아래
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      j++;
      if (j > end_row) break;
    }
    return word;
  } else if (dx == 0 && dy <= -1) {
    //위
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      j--;
      if (j < end_row) break;
    }
    return word;
  } else if (dx >= 1 && dy == 0) {
    //오른쪽
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i++;
      if (i > end_col) break;
    }
    return word;
  } else if (dx <= -1 && dy == 0) {
    //왼쪽
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i--;
      if (i < end_col) break;
    }
    return word;
  } else if (dx >= 1 && dy <= -1) {
    //오른쪽위
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i++;
      j--;
      if (i > end_col || j < end_row) break;
    }
    return word;
  } else if (dx >= 1 && dy >= 1) {
    //오른쪽 아래
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i++;
      j++;
      if (i > end_col || j > end_row) break;
    }
    return word;
  } else if (dx <= -1 && dy <= -1) {
    //왼쪽 위
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i--;
      j--;
      if (i < end_col || j < end_row) break;
    }
    return word;
  } else {
    while (true) {
      const cur_board = document.getElementById(`board[${j}][${i}]`);
      word += cur_board.innerText;
      i--;
      j++;
      if (i < end_col || j > end_row) break;
    }
    return word;
  }
};

board_wrapper.addEventListener("mousedown", handleMouseDown);
board_wrapper.addEventListener("mouseover", handleMouseOver);
board_wrapper.addEventListener("mouseup", handleMouseUp);
