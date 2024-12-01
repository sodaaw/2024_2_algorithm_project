// 데이터를 humanities_major.js에서 가져옴
import { sciencesData } from "./data/sciences_major.js";

export function render() {
  const app = document.getElementById("app");

  // 기존 CSS 제거 함수
  const removeExistingStyles = () => {
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
    styleSheets.forEach((sheet) => {
      sheet.parentNode.removeChild(sheet); // 해당 CSS 노드 제거
    });
  };

  // 새로운 CSS 로드 함수 (캐시 무효화 포함)
  const loadCSS = (cssPath) => {
    const timestamp = new Date().getTime(); // 현재 시간 타임스탬프
    const cssUrlWithVersion = `${cssPath}?ver=${timestamp}`; // 쿼리 파라미터 추가
    const existingLink = document.querySelector(`link[rel="stylesheet"][href^="${cssPath}"]`);
    if (existingLink) {
      existingLink.parentNode.removeChild(existingLink); // 기존 CSS 제거
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrlWithVersion; // 새로운 URL 사용
    document.head.appendChild(link);
  };

  // 버튼에 이벤트 리스너 추가
  const setupButton = (id, hash, cssPath) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        removeExistingStyles(); // 기존 CSS 제거
        if (cssPath) {
          loadCSS(cssPath); // 해당 페이지 CSS 로드
        }
        window.location.hash = hash;
      });
    }
  };

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

  setupButton("home-btn", "#main", "./css/pages/home.css?ver=1");
  setupButton("mypage-btn", "#mypage", "./css/pages/mypage.css?ver=1");
  setupButton("logo-button", "#main", "./css/pages/main.css?ver=1");

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear(); // 모든 로컬 스토리지 데이터 제거
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }

}
