const wrapper = document.getElementById("wrapper");
let ANSWER = [];

const handleDelButton = async (event) => {
  const id = event.target.dataset.id;
  await fetch(`/answers/${id}`, {
    method: "DELETE",
    body: id,
  });
  getAsnwer();
};

const handleEditButton = async (event) => {
  const id = event.target.dataset.id;
  const editInput = prompt("수정할 단어를 입력하세요");

  await fetch(`/answers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      content: editInput.toUpperCase(),
    }),
  });

  getAsnwer();
};

const getAsnwer = async () => {
  wrapper.innerHTML = "";
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

getAsnwer();
