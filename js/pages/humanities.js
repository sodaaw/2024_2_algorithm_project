// 데이터를 humanities_major.js에서 가져옴
import { humanitiesData } from "./data/humanities_major.js";

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
      </div>
    </header>
  `;
}

// 공통 버튼 이벤트 설정 함수
function setupNavigationButtons() {
  // Home 버튼 클릭 이벤트
  const homeButton = document.getElementById("home-btn");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
    });
  }

  // 로고 클릭 이벤트
  const logoButton = document.getElementById("logo-button");
  if (logoButton) {
    logoButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
    });
  }

  // 로그아웃 버튼 클릭 이벤트
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname");
          localStorage.removeItem("profile_image");
          localStorage.removeItem("interest_majors");
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
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

  // `app` 컨테이너가 없을 경우 에러 출력 및 함수 종료
  if (!app) {
    console.error("앱 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // `app` 컨테이너에 HTML 구조 추가
  app.innerHTML = `
    ${renderHeader()} <!-- 헤더 렌더링 -->
    <div id="tree-container" class="tree-container"></div>
  `;

  const treeContainer = document.getElementById("tree-container");

  // 데이터 렌더링
  renderTree(treeContainer);

  // 공통 버튼 이벤트 설정
  setupNavigationButtons();
}
