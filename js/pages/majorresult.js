import { navigateTo } from "../utils/router.js";

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// CSS 파일을 제거하는 함수
function removeCSS(href) {
    const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
    links.forEach((link) => link.remove());
  }

export function render() {
    // 이전 CSS 제거
    removeCSS("css/pages/majorsearch.css");
  
    // 새로운 CSS 로드
    loadCSS("css/pages/majorresult.css");
    const app = document.getElementById("app");
    app.innerHTML = `
            <header class="mypage-header">
              <div class="header-left">
                <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/> <!-- 앱 로고 추가 -->
              </div>
              <div class="header-right">
                <button id="home-btn" class="home-btn">Home</button>
                <button id="logout-btn" class="logout-btn">Logout</button>
              </div>
            </header>
            `;
}