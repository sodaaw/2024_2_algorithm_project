// 데이터를 humanities_major.js에서 가져옴
import { humanitiesData } from "./data/humanities_major.js";

// 배경 이미지 설정 함수
function setBackground(imagePath) {
  const app = document.getElementById("app");
  if (app) {
    app.style.backgroundImage = `url('../../images/main/P1290908.jpg')`;
    app.style.backgroundSize = "cover";
    app.style.backgroundPosition = "center";
    app.style.backgroundRepeat = "no-repeat";
  }
}

// 배경 이미지 제거 함수
function removeBackground() {
  const app = document.getElementById("app");
  if (app) {
    app.style.backgroundImage = ""; // 배경 이미지 제거
  }
}

// 헤더 렌더링 함수
function renderHeader() {
  return `
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
  `;
}

// 데이터 렌더링 함수
function renderTree(treeContainer) {
  // 데이터 렌더링
  humanitiesData.forEach((collegeData) => {
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
}

// 메인 렌더링 함수
export function render() {
  const app = document.getElementById("app");

  if (!app) {
    console.error("앱 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // 특정 화면에 배경 이미지 적용
  if (window.location.hash === "#specificPage") {
    setBackground("../../images/main/P1290908.jpg"); // 특정 화면에서 배경 설정
  } else {
    removeBackground(); // 다른 화면에서는 배경 제거
  }

  // `app` 컨테이너에 HTML 구조 추가
  app.innerHTML = `
    ${renderHeader()} <!-- 헤더 렌더링 -->
    <div id="tree-container" class="tree-container"></div>
  `;

  const treeContainer = document.getElementById("tree-container");

  // 데이터 렌더링
  renderTree(treeContainer);

  // CSS 관리를 위한 현재 페이지 상태 추적 변수 추가
  let currentPage = 'humanities';

  // 개선된 CSS 로드 함수
  const loadCSS = (cssPath, pageName) => {
    // 이미 같은 페이지의 CSS라면 다시 로드하지 않음
    if (currentPage === pageName) return;

    // 기존 페이지 CSS 제거
    const existingPageCSS = document.querySelector(`link[data-page="${currentPage}"]`);
    if (existingPageCSS) {
      existingPageCSS.remove();
    }

    // 새로운 CSS 로드
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    link.dataset.page = pageName; // 페이지 식별자 추가
    document.head.appendChild(link);

    // 현재 페이지 업데이트
    currentPage = pageName;
  };

  // 버튼에 이벤트 리스너 추가 (개선)
  const setupButton = (id, hash, cssPath, pageName) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        loadCSS(cssPath, pageName); // CSS 로드 방식 변경
        window.location.hash = hash;
      });
    }
  };

  // 버튼 이벤트 설정 (페이지 이름 추가)
  setupButton("home-btn", "#main", "./css/pages/main.css", "main");
  setupButton("mypage-btn", "#mypage", "./css/pages/mypage.css", "mypage");
  setupButton("logo-button", "#main", "./css/pages/main.css", "main");

  // 로그아웃 버튼 이벤트 (기존 코드 유지)
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
          const existingCSS = document.querySelector('link[data-page]');
          if (existingCSS) existingCSS.remove();
          
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}

// 해시 변경 시 render 함수 재호출
window.addEventListener("hashchange", render);
