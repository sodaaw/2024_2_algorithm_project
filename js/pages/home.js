import { navigateTo } from "../utils/router.js"; // navigateTo 함수 임포트
import { ensureCSSLoaded } from "../utils/CSSManager.js"; // CSSManager.js에서 함수 임포트

function resetStyles() {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = ""; // DOM 초기화
  }
}

function applyTextAnimation(containerId, textArray) {
  const textContainer = document.getElementById(containerId);

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

function setupNavigation(buttonId, targetHash, cssPath) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      console.log(`Navigating to ${targetHash} page...`);
      resetStyles();

      // CSS 로드 보장
      ensureCSSLoaded(cssPath);

      // Delay rendering to allow CSS to apply
      setTimeout(() => {
        navigateTo(targetHash);
      }, 50);
    });
  }
}

function renderTemplate() {
  return `
    <div class="screen">
      <div class="content">
        <div class="left-container">
          <div id="animated-text" class="headline-sec"></div>
          <p class="sub-headline-sec">클릭 몇 번으로<br>자신에게 맞는 전공을 탐색해보세요!</p>
          <div class="cta">
            <button id="login-btn" class="button-md-sec">로그인</button>
            <button id="signup-btn" class="button-md-sec">회원가입</button>
          </div>
        </div>
        <div class="right-container">
          <img class="image" src="images/home/skku.png" alt="성균관대 이미지">
        </div>
      </div>
    </div>
  `;
}

export function render() {
  // CSS 업데이트
  ensureCSSLoaded("css/pages/home.css"); // 현재 페이지 CSS 로드 보장

  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = renderTemplate();
    applyTextAnimation("animated-text", ["성균관대 전공", "추천 프로그램"]);

    // Setup navigation
    setupNavigation("login-btn", "#login", "css/pages/login.css");
    setupNavigation("signup-btn", "#login", "css/pages/login.css");
    //setupNavigation("juststart", "#main", "css/pages/main.css");
  }
}