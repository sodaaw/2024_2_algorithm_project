// CSS 파일을 동적으로 제거하는 함수
function removeCSS(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
  links.forEach((link) => link.remove());
}

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// Kakao SDK 초기화 코드
import { KAKAO_API_KEY } from "../apikey.js";
if (typeof Kakao !== "undefined" && !Kakao.isInitialized()) {
  Kakao.init(KAKAO_API_KEY);
  console.log("Kakao SDK Initialized:", Kakao.isInitialized());
}

// 전공 url 영어로 하기 위한 데이터 파일 로드
import departments from "./data/link_data.js"; // 데이터 파일 불러오기

export function render() {
  // 이전 CSS 제거
  removeCSS("css/pages/roadmap.css");

  // 새로운 CSS 로드
  loadCSS("css/pages/mypage.css");

  const app = document.getElementById("app");

  // localStorage에서 닉네임과 프로필 이미지, 관심 전공 목록 가져오기
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

  const majorContent =
    interestMajors.length > 0
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

  app.innerHTML = `
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

  // 전공 카드 클릭 이벤트 추가
  const majorCards = document.querySelectorAll(".major-card");
  majorCards.forEach((card) => {
    card.addEventListener("click", () => {
      const engName = card.getAttribute("data-eng-name");
      if (engName) {
        window.location.hash = `#roadmap/${engName}`;
      } else {
        alert("해당 전공의 URL 정보를 찾을 수 없습니다.");
      }
    });
  });

  // 홈 버튼 및 로고 클릭 이벤트
  document.getElementById("home-btn").addEventListener("click", () => {
    window.location.hash = "#main";
  });

  document.getElementById("logo-button").addEventListener("click", () => {
    window.location.hash = "#main";
  });

  // 로그아웃 버튼 클릭 이벤트
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear();
          window.location.hash = "";
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}
