// 데이터를 sciences_major.js에서 가져옴
import { sciencesData } from "./data/sciences_major.js";
import { ensureCSSLoaded } from "../utils/CSSManager.js"; // CSSManager에서 함수 임포트

export function render() {
  const app = document.getElementById("app");

  // app에 기본 HTML 구조 추가
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
    <div id="tree-container" class="tree-container"></div>
  `;

  const treeContainer = document.getElementById("tree-container");

  // 데이터 렌더링
  sciencesData.forEach((collegeData) => {
    // 대학 이름 추가
    const collegeElement = document.createElement("div");
    collegeElement.className = "college-item";

    const collegeName = document.createElement("div");
    collegeName.className = "college-name";
    collegeName.textContent = collegeData.college;

    // 학과 리스트 추가
    const majorList = document.createElement("div");
    majorList.className = "majors-list";

    collegeData.majors.forEach((major) => {
      const majorElement = document.createElement("div");
      majorElement.className = "major-item";
      majorElement.textContent = major;

      // 학과 클릭 시 majorsearch.js로 전공 이름 전달
      majorElement.addEventListener("click", () => {
        window.location.hash = `#majorsearch?major=${encodeURIComponent(major)}`;
      });

      majorList.appendChild(majorElement);
    });

    collegeElement.appendChild(collegeName);
    collegeElement.appendChild(majorList);
    treeContainer.appendChild(collegeElement);
  });

  // CSS 관리: 현재 페이지의 CSS를 로드
  ensureCSSLoaded("./css/pages/sciences.css");

  // 버튼에 이벤트 리스너 추가 (개선)
  const setupButton = (id, hash, cssPath) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        ensureCSSLoaded(cssPath); // CSSManager로 CSS 로드 보장
        window.location.hash = hash;
      });
    }
  };

  // 버튼 이벤트 설정
  setupButton("home-btn", "#main", "./css/pages/main.css");
  setupButton("mypage-btn", "#mypage", "./css/pages/mypage.css");
  setupButton("logo-button", "#main", "./css/pages/main.css");

  // 로그아웃 버튼 이벤트
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname");
          localStorage.removeItem("profile_image");
          localStorage.removeItem("interest_majors");

          // CSS 초기화 (로그아웃 시 모든 로드된 CSS 제거)
          const existingCSS = document.querySelectorAll('link[rel="stylesheet"]');
          existingCSS.forEach((link) => link.remove());

          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}