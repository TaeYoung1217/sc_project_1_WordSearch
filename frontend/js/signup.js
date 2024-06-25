const form = document.getElementById("signup_form");

const checkPassword = () => {
  //비밀번호가 같은지 판단
  const formData = new FormData(form);
  const pw = formData.get("password");
  const pwcheck = formData.get("passwordcheck");

  if (pw === pwcheck) return true;
  else return false;
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form); //회원가입 폼에 입력된 값 가져오기

  const sha256password = sha256(formData.get("password")); //암호화
  formData.set("password", sha256password); //암호화된 패스워드로 다시 쓰기

  const sendData = {
    //서버에 보낼 json 형태
    id: formData.get("id"),
    password: formData.get("password"),
  };

  const div = document.getElementById("check_error");

  if (checkPassword()) {
    //패스워드가 동일한지 확인
    const res = await fetch("/signup", {
      //signup 엔드포인트로 서버에 post 요청
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });
    const data = await res.json();

    if (data === "200") {
      //잘 등록되었으면
      alert("가입 성공");
      window.location.pathname = "/index.html"; //홈화면으로 이동
    } else if (data == "duplicate id") {
      //아이디 중복되면
      div.innerText = "중복된 아이디";
      div.style.color = "red";
    }
  } else {
    //비밀번호가 같지 않으면
    div.innerText = "비밀번호가 같지 않습니다";
    div.style.color = "red";
  }
};
form.addEventListener("submit", handleSubmit);
