import { navigateTo } from "../utils/router.js"; // navigateTo 함수 임포트

export function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="screen">
      <div class="content">
        <div class="left-container">
          <h1 class="headline-sec">성균관대 전공<br>추천 프로그램</h1>
          <p class="sub-headline-sec">클릭 몇 번으로<br>자신에게 맞는 전공을 탐색해보세요!</p>
          <div class="cta">
            <button id="login-btn" class="button-md-sec">로그인</button>
            <button id="signup-btn" class="button-md-sec">회원가입</button>
            <button id="juststart" class="button-md-sec">비회원 이용</button>
          </div>
        </div>
        <div class="right-container">
          <img class="image" src="images/home/skku.png" alt="성균관대 이미지">
        </div>
      </div>
    </div>
  `;

  // 버튼 클릭 이벤트 추가
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const justStartButton = document.getElementById("juststart");

  loginButton.addEventListener("click", () => navigateTo("#login")); // 로그인 페이지로 이동
  signupButton.addEventListener("click", () => navigateTo("#login")); // 회원가입 페이지로 이동
  justStartButton.addEventListener("click", () => navigateTo("#roadmap"));
}