import { navigateTo } from "../utils/router.js"; // navigateTo 함수 임포트

export function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
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

  applyTextAnimation();

  function applyTextAnimation() {
    const textArray = [
      "성균관대 전공",
      "추천 프로그램"
    ];
    const textContainer = document.getElementById("animated-text");
  
    if (textContainer) {
      textArray.forEach((line, lineIndex) => {
        line.split("").forEach((letter, letterIndex) => {
          const span = document.createElement("span");
          span.textContent = letter === " " ? "\xa0" : letter; // 공백 처리
          span.style.animationDelay = `${(lineIndex * 10 + letterIndex) * 50}ms`;
          span.classList.add("text-animated");
          textContainer.appendChild(span);
        });
  
        // 줄바꿈 추가
        if (lineIndex < textArray.length - 1) {
          const br = document.createElement("br");
          textContainer.appendChild(br);
        }
      });
    }
  }
  

  // 버튼 클릭 이벤트 추가
  const loginButton = document.getElementById("login-btn");
  const signupButton = document.getElementById("signup-btn");
  const justStartButton = document.getElementById("juststart");

  loginButton.addEventListener("click", () => navigateTo("#login")); // 로그인 페이지로 이동
  signupButton.addEventListener("click", () => navigateTo("#login")); // 회원가입 페이지로 이동
  justStartButton.addEventListener("click", () => navigateTo("#roadmap"));
}