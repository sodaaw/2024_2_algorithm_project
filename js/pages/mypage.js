import { navigateTo } from "../utils/router.js"; // navigateTo 함수 임포트
import { KAKAO_API_KEY } from "../apikey.js";
import departments from "./data/link_data.js"; // 데이터 파일 불러오기

// Kakao SDK 초기화
if (typeof Kakao !== "undefined") {
  if (!Kakao.isInitialized()) {
    Kakao.init(KAKAO_API_KEY);
    console.log("Kakao SDK Initialized:", Kakao.isInitialized());
  } else {
    console.log("Kakao SDK already initialized.");
  }
}

// CSS 파일 로드 및 제거 함수
function loadCSS(href) {
  const existingLink = document.querySelector(`link[rel="stylesheet"][href="${href}"]`);
  if (!existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}

function removeCSS(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
  links.forEach((link) => link.remove());
}

// 관심 전공 HTML 템플릿 생성
function createMajorCards(interestMajors) {
  return interestMajors.length > 0
    ? interestMajors
        .map((major) => {
          const engName = departments[major]?.eng_name || "";
          return `
            <div class="major-card" data-eng-name="${engName}">
              <div class="card-text">
                <p>${major}</p>
                <img src="./images/roadmap/arrow_button.png" alt="화살표 이미지" class="arrow-img">
              </div>
            </div>`;
        })
        .join("")
    : `<p class="no-majors">등록한 관심 전공이 없습니다.</p>`;
}

// HTML 템플릿 생성
function renderTemplate(nickname, profileImage, majorContent) {
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
    <div class="mypage-container">
      <div class="profile-section">
        <img src="${profileImage}" alt="프로필 이미지" class="profile-page-image"/>
        <h1>${nickname} 님의 관심 전공 모아보기</h1>
      </div>
      <p>전공을 클릭하면 로드맵 조회, 비슷한 학과 조회가 가능합니다.</p>
      <div class="majors-container">
        ${majorContent}
      </div>
    </div>
  `;
}

// 버튼 이벤트 설정 함수
function setupNavigation(buttonId, targetHash, currentCSS, nextCSS) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      removeCSS(currentCSS);
      loadCSS(nextCSS);
      navigateTo(targetHash);

      // 새로고침이 필요한 경우 실행
      if (shouldReload) {
        setTimeout(() => {
          window.location.reload(); // 강제로 새로고침
        }, 100); // 약간의 딜레이를 추가해 navigateTo가 완료된 후 새로고침
      }
    });
  }
}

// 메인 렌더링 함수
export function render() {
  // 이전 CSS 제거 및 새 CSS 로드
  removeCSS("css/pages/roadmap.css");
  loadCSS("css/pages/mypage.css?ver=1");

  const app = document.getElementById("app");

  // 사용자 데이터 가져오기
  const nickname = localStorage.getItem("nickname") || "사용자";
  const profileImage = localStorage.getItem("profile_image") || "images/default_profile.png";

  // 테스트용 관심 전공 데이터
  const interestMajors = [
    "컴퓨터교육과",
    "소프트웨어학과",
    "건설환경공학부",
    "철학과",
    "영어영문학과",
    "한문학과",
  ];

  // HTML 렌더링
  const majorContent = createMajorCards(interestMajors);
  app.innerHTML = renderTemplate(nickname, profileImage, majorContent);

  // 전공 카드 클릭 이벤트 추가
  const majorCards = document.querySelectorAll(".major-card");
  majorCards.forEach((card) => {
    card.addEventListener("click", () => {
      const engName = card.getAttribute("data-eng-name");
      if (engName) {
        navigateTo(`#roadmap/${engName}`);
      } else {
        alert("해당 전공의 URL 정보를 찾을 수 없습니다.");
      }
    });
  });

  // 홈 버튼 및 로고 클릭 이벤트 설정
  setupNavigation("home-btn", "#main", "css/pages/mypage.css", "css/pages/main.css", true);
  setupNavigation("logo-button", "#main", "css/pages/mypage.css", "css/pages/main.css", true);

  // 로그아웃 버튼 이벤트 추가
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear();
          navigateTo("");
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}