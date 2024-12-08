import { ensureCSSLoadedWithCallback } from "../utils/CSSManager.js"; // CSSManager.js에서 함수 임포트
import { navigateTo } from "../utils/router.js";
import { KAKAO_API_KEY } from "../apikey.js";

export function render() {
  // CSS를 로드한 후에 DOM을 업데이트
  ensureCSSLoadedWithCallback("./css/pages/main.css", () => {
    // `app` 컨테이너를 가져옵니다.
    const app = document.getElementById("app");

    if (!app) {
      console.error("앱 컨테이너를 찾을 수 없습니다.");
      return;
    }

    // `app` 컨테이너에 HTML 콘텐츠를 추가
    app.innerHTML = `
      <header class="mypage-header">
        <div class="header-left">
          <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
        </div>
        <div class="header-right">
          <button id="home-btn" class="home-btn">Home</button>
          <button id="logout-btn" class="logout-btn">Logout</button>
          <button id="mypage-btn" class="logout-btn">Mypage</button>
        </div>
      </header>
      <div class="main-container">
        <h1>알아보고 싶은 학과는 어디에 있나요?</h1>
        <div class="buttons">
          <button id="humanities-btn" class="btn humanities-btn">인문사회과학캠퍼스</button>
          <button id="sciences-btn" class="btn sciences-btn">자연과학캠퍼스</button>
        </div>
      </div>
      <div class="footer-background"></div>
    `;

    // 버튼에 이벤트 리스너 추가
    const setupButton = (id, hash, cssPath) => {
      const button = document.getElementById(id);
      if (button) {
        button.addEventListener("click", () => {
          ensureCSSLoadedWithCallback(cssPath, () => navigateTo(hash)); // CSS 로드 후 페이지 이동
        });
      }
    };

    // 버튼 이벤트 설정
    setupButton("home-btn", "#main", "./css/pages/main.css");
    setupButton("mypage-btn", "#mypage", "./css/pages/mypage.css?ver=1");
    setupButton("logo-button", "#main", "./css/pages/main.css");
    setupButton("humanities-btn", "#humanities", "./css/pages/humanities.css");
    setupButton("sciences-btn", "#sciences", "./css/pages/sciences.css");

    // 로그아웃 버튼 이벤트 설정
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        if (typeof Kakao !== "undefined" && Kakao.Auth) {
          Kakao.Auth.logout(() => {
            alert("로그아웃 되었습니다.");
            localStorage.removeItem("nickname");
            localStorage.removeItem("profile_image");
            localStorage.removeItem("interest_majors");

            // CSS 초기화
            const existingCSS = document.querySelectorAll('link[rel="stylesheet"]');
            existingCSS.forEach((link) => link.remove());

            navigateTo(""); // 로그인 페이지로 이동
          });
        } else {
          alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
        }
      });
    }
  });
}

// DOMContentLoaded에서 render만 호출
document.addEventListener("DOMContentLoaded", render);
