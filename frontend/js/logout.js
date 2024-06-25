const logout_button = document.getElementById("logout_button");

const handleLogout = () => {
  //로그아웃 버튼 누르면
  window.localStorage.setItem("token", ""); //local storage에 저장된 token값 빈칸으로 설정
  alert("로그아웃 되었습니다");
  window.location.pathname = "./html/index.html";
};

logout_button.addEventListener("click", handleLogout);
