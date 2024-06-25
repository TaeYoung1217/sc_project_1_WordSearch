const wrapper = document.getElementById("wrapper");
let ANSWER = [];

const getAnswer = async () => {
  //모든 정답 목록 보여주기
  wrapper.innerHTML = ""; //화면을 밀고 새로 작성하기 위해
  const res = await fetch("/Allanswers")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((obj) => {
        const answer = obj.answer;
        const div = document.createElement("div");

        const delButton = document.createElement("button");
        delButton.innerText = "삭제";
        delButton.addEventListener("click", handleDelButton);
        delButton.dataset.id = obj.id;

        const editButton = document.createElement("button");
        editButton.addEventListener("click", handleEditButton);
        editButton.innerText = "수정";
        editButton.dataset.id = obj.id;

        div.innerText = answer;
        div.appendChild(delButton);
        div.appendChild(editButton);

        wrapper.appendChild(div);
        ANSWER.push(obj.answer);
      });
    });
};

const handleDelButton = async (event) => {
  //단어 삭제 버튼 누르면
  const id = event.target.dataset.id; //누른 단어의 아이디를 가져와서
  await fetch(`/answers/${id}`, {
    //서버에 id를 key로 하여 delete 요청
    method: "DELETE",
  });
  getAnswer(); //삭제 후 다시 불러오기
};

const handleEditButton = async (event) => {
  //수정버튼 누르면
  const id = event.target.dataset.id; //단어 id 가져와서
  const editInput = prompt("수정할 단어를 입력하세요"); //수정할 내용을 입력받고

  await fetch(`/answers/${id}`, {
    //id를 key로 하여 put 요청
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      content: editInput.toUpperCase(),
    }),
  });

  getAnswer();
};

getAnswer();
