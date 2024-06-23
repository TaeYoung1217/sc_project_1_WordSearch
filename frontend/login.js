const form = document.getElementById("login_form");

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const sha256password = sha256(formData.get("password")); //패스워드 암호화
  formData.set("password", sha256password);

  const sendData = {
    id: formData.get("id"), //form에 입력된 id 가져오기
    password: formData.get("password"), //암호화된 패스워드 가져오기
  };

  const res = await fetch("/login", {
    //사용자 조회를 위해 POST 요청, 보안때문에 get을 안하고 post.
    method: "POST", //post 요청이 body에 정보를 담아서 보내기때문에 get보다 보안성이 높다
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
  const data = await res.json();

  switch (
    data //서버에서 return 받으면
  ) {
    case "invalid password":
      alert("비밀번호가 틀립니다");
      break;
    case "not user":
      alert("존재하지 않는 아이디");
      break;
    default:
      const accessToken = data; //로그인 성공하면 accesstoken을 받아
      window.localStorage.setItem("token", accessToken); //localstorage에 저장
      alert("로그인 성공");
      window.location.pathname = "/"; //홈화면으로 이동
      break;
  }
};

form.addEventListener("submit", handleSubmit);
