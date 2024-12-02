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
} else {
  console.error("Kakao SDK가 로드되지 않았습니다.");
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
function setupNavigation(buttonId, targetHash, currentCSS, nextCSS, shouldReload = false) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      // CSS 변경이 필요한 경우에만 실행
      if (currentCSS !== nextCSS) {
        removeCSS(currentCSS);
        loadCSS(nextCSS);
      }

      navigateTo(targetHash);

      // 새로고침 여부 확인
      if (shouldReload) {
        setTimeout(() => {
          window.location.reload(); // 강제로 새로고침
        }, 100); // 약간의 딜레이를 추가해 navigateTo가 완료된 후 새로고침
      }
    });
  }
}

// 관심 전공 삭제 HTML 템플릿 생성
function createDeleteModeTemplate(interestMajors) {
  return interestMajors.length > 0
    ? interestMajors
        .map((major, index) => {
          const engName = departments[major]?.eng_name || "";
          return `
            <div class="major-card delete-mode" data-eng-name="${engName}" data-index="${index}">
              <div class="card-text">
                <input type="checkbox" class="delete-checkbox" data-index="${index}">
                <p>${major}</p>
              </div>
            </div>`;
        })
        .join("")
    : `<p class="no-majors">삭제할 관심 전공이 없습니다.</p>`;
}

// 관심 전공 카드 클릭 이벤트 설정 함수
function setupMajorCardEvents() {
  const majorCards = document.querySelectorAll(".major-card");
  majorCards.forEach((card) => {
    card.addEventListener("click", () => {
      const engName = card.getAttribute("data-eng-name"); // 영어 이름 속성 가져오기
      if (engName) {
        console.log(`${engName} 로드맵 페이지로 이동합니다.`);
        navigateTo(`#roadmap/${engName}`); // 로드맵 페이지로 이동
      } else {
        console.error("영어 이름 데이터가 없습니다.");
      }
    });
  });
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
  let interestMajors = [
    "컴퓨터교육과",
    "소프트웨어학과",
    "건설환경공학부",
    "철학과",
    "영어영문학과",
    "한문학과",
  ];

  // 관심 전공 삭제 모드 활성화 상태
  let deleteMode = false;

  // HTML 렌더링 함수
  const renderMajors = () => {
    const majorContent = deleteMode
      ? createDeleteModeTemplate(interestMajors)
      : createMajorCards(interestMajors);

    app.innerHTML = renderTemplate(nickname, profileImage, majorContent);

    const deleteButton = document.getElementById("delete-majors-btn");

    if (!deleteMode) {
      if (!deleteButton) {
        const newDeleteButton = document.createElement("button");
        newDeleteButton.id = "delete-majors-btn";
        newDeleteButton.textContent = "관심 전공 삭제하기 ";
        newDeleteButton.className = "delete-majors-btn";

        const majorsContainer = app.querySelector(".majors-container");
        majorsContainer.insertAdjacentElement("afterend", newDeleteButton);

        newDeleteButton.addEventListener("click", () => {
          deleteMode = true;
          renderMajors();
        });
      } else {
        deleteButton.style.display = "block"; // 버튼 표시
      }
    } else {
      if (deleteButton) {
        deleteButton.style.display = "none";
      }

      const footer = document.createElement("div");
      footer.className = "delete-footer";
      footer.innerHTML = `
        <button id="cancel-delete" class="cancel-delete-btn">취소</button>
        <button id="confirm-delete" class="confirm-delete-btn">선택 삭제</button>
      `;
      app.appendChild(footer);

      document.getElementById("cancel-delete").addEventListener("click", () => {
        deleteMode = false;
        renderMajors();
      });

      document.getElementById("confirm-delete").addEventListener("click", () => {
        const selectedIndexes = Array.from(
          document.querySelectorAll(".delete-checkbox:checked")
        ).map((checkbox) => parseInt(checkbox.dataset.index, 10));

        interestMajors = interestMajors.filter(
          (_, index) => !selectedIndexes.includes(index)
        );

        alert("선택한 관심 전공이 삭제되었습니다.");
        deleteMode = false;
        renderMajors();
      });
    }

    // 관심 전공 카드 클릭 이벤트 설정
    setupMajorCardEvents();
  };

  // 초기 렌더링
  renderMajors();

  // 홈 버튼 및 로고 클릭 이벤트 설정
  setupNavigation("home-btn", "#main", "css/pages/mypage.css", "css/pages/main.css", false);
  setupNavigation("logo-button", "#main", "css/pages/mypage.css", "css/pages/main.css", false);

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
