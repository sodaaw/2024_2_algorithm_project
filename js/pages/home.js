import { navigateTo } from "../utils/router.js"; // navigateTo 함수 임포트

// CSS 관리 객체
const CSSManager = {
  load: (href) => {
    if (!document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  },
  remove: (href) => {
    const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
    links.forEach((link) => link.remove());
  }
};

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

function setupNavigation(buttonId, targetHash) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      console.log(`Navigating to ${targetHash} page...`);
      resetStyles();

      if (targetHash === "#login") {
        CSSManager.remove("css/pages/home.css");
        CSSManager.load("css/pages/login.css?ver=1");
      } else if (targetHash === "#main") {
        CSSManager.remove("css/pages/mypage.css");
        CSSManager.load("css/pages/home.css?ver=1");
      }

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
  CSSManager.remove("css/pages/previous.css"); // 이전 CSS 제거 (예: 이전 페이지 CSS)
  CSSManager.load("css/pages/home.css?ver=1"); // 현재 페이지 CSS 로드

  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = renderTemplate();
    applyTextAnimation("animated-text", ["성균관대 전공", "추천 프로그램"]);

    // Setup navigation
    setupNavigation("login-btn", "#login");
    setupNavigation("signup-btn", "#login");
    //setupNavigation("juststart", "#main");
  }
}