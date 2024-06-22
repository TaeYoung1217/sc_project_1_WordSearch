const form = document.getElementById("login_form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const sha256password = sha256(formData.get("password"));
  formData.set("password", sha256password);

  const sendData = {
    id: formData.get("id"),
    password: formData.get("password"),
  };

  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
  const data = await res.json();

  switch (data) {
    case "invalid password":
      alert("비밀번호가 틀립니다");
      break;
    case "not user":
      alert("존재하지 않는 아이디");
      break;
    default:
      alert("로그인 성공");
      window.location.pathname = "/";
      break;
  }
};

form.addEventListener("submit", handleSubmit);
