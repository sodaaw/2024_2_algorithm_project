import { navigateTo } from "../utils/router.js"; // navigateTo 함수
import { renderHeader, setupHeaderEvents } from "./header.js"; // 공통 헤더

export function render() {
  const app = document.getElementById("app");

  app.innerHTML = `
    ${renderHeader()} <!-- 공통 헤더 삽입 -->
    <div class="screen">
      <div class="content">
        <div class="left-container">
          <div id="animated-text" class="headline-sec"></div>
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

  // 공통 헤더 버튼 이벤트 설정
  setupHeaderEvents();

  // 애니메이션 텍스트 설정
  applyTextAnimation();

  function applyTextAnimation() {
    const textArray = ["성균관대 전공", "추천 프로그램"];
    const textContainer = document.getElementById("animated-text");

    if (textContainer) {
      let htmlContent = "";
      textArray.forEach((line, lineIndex) => {
        line.split("").forEach((letter, letterIndex) => {
          const delay = (lineIndex * 10 + letterIndex) * 50;
          htmlContent += `<span class="text-animated" style="animation-delay: ${delay}ms;">${letter === " " ? "&nbsp;" : letter}</span>`;
        });
        if (lineIndex < textArray.length - 1) {
          htmlContent += "<br>"; // 줄바꿈
        }
      });
      textContainer.innerHTML = htmlContent;
    }
  }

  // CTA 버튼 이벤트 추가
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const justStartButton = document.getElementById("juststart");

  loginButton.addEventListener("click", () => {
    console.log("Navigating to login page...");
    navigateTo("#login");
  });

  signupButton.addEventListener("click", () => {
    console.log("Navigating to signup page...");
    navigateTo("#signup");
  });

  justStartButton.addEventListener("click", () => {
    console.log("Navigating to main page...");
    navigateTo("#main");
  });
}
