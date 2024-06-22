const form = document.getElementById("signup_form");

const checkPassword = () => {
  const formData = new FormData(form);
  const pw = formData.get("password");
  const pwcheck = formData.get("passwordcheck");

  if (pw === pwcheck) return true;
  else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const sha256password = sha256(formData.get("password"));
  formData.set("password", sha256password);

  const sendData = {
    id: formData.get("id"),
    password: formData.get("password"),
  };

  console.log(JSON.stringify(sendData));
  const div = document.getElementById("check_error");

  if (checkPassword()) {
    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });
    const data = await res.json();

    if (data === "200") {
      alert("가입 성공");
      window.location.pathname = "/login.html";
    }
  } else if (data == "duplicate id") {
    div.innerText = "중복된 아이디";
    div.style.color = "red";
  } else {
    div.innerText = "비밀번호가 같지 않습니다";
    div.style.color = "red";
  }
};
form.addEventListener("submit", handleSubmit);
