const alphabet = [
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

const display_board = () => {
  const main = document.querySelector("main");
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    for (let j = 0; j < 10; j++) {
      const column = document.createElement("div");
      column.id = `column${i}${j}`;
      column.style.width = "50px";
      column.style.height = "50px";
      column.style.border = "1px solid black";
      column.style.display = "flex";
      column.style.justifyContent = "center";
      column.style.alignItems = "center";
      column.style.cursor = "pointer";
      row.appendChild(column);
    }
    main.appendChild(row);
  }

  fill_text();
};

const fill_text = () => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const board_text = document.getElementById(`column${i}${j}`);
      board_text.innerText =
        alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
};

display_board();
