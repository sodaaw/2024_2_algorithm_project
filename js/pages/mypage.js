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
  const versionedHref = `${href}?ver=${Date.now()}`;
  const existingLink = document.querySelector(`link[rel="stylesheet"][href="${versionedHref}"]`);
  if (!existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = versionedHref;
    document.head.appendChild(link);
  }
}

function removeCSS(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"]`);
  links.forEach((link) => {
    if (link.href.includes(href)) {
      link.remove();
    }
  });
}

function ensureCSSLoaded(href) {
  removeCSS(href);
  loadCSS(href);
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
    : `
      <div class="no-majors-container">
        <p class="no-majors">등록한 관심 전공이 없습니다.</p>
        <button id="explore-majors-btn" class="explore-majors-btn">전공 탐색하러 가기</button>
      </div>`;
}

// 관심 전공 삭제 템플릿 생성
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
      <p>전공을 클릭하면 전공 로드맵, 학과 홈페이지, 유사 학과 조회가 가능합니다.</p>
      <div class="majors-container">
        ${majorContent}
      </div>
    </div>
  `;
}

// 관심 전공 카드 클릭 이벤트 설정
// 관심 전공 카드 클릭 이벤트 설정
function setupMajorCardEvents(deleteMode) {
  const majorCards = document.querySelectorAll(".major-card");
  majorCards.forEach((card) => {
    const checkbox = card.querySelector(".delete-checkbox");

    if (deleteMode) {
      // 카드 전체를 클릭했을 때도 체크박스를 토글
      card.addEventListener("click", (e) => {
        e.stopPropagation(); // 이벤트 전파 차단
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });

      // 체크박스 클릭 시 이벤트 처리 (중복 이벤트 방지)
      if (checkbox) {
        checkbox.addEventListener("click", (e) => {
          e.stopPropagation(); // 부모 요소로 이벤트 전파 방지
        });
      }
    } else {
      // 삭제 모드가 아닐 때는 카드 클릭 시 로드맵 페이지로 이동
      card.addEventListener("click", () => {
        const engName = card.getAttribute("data-eng-name");
        if (engName) {
          navigateTo(`#roadmap/${engName}`);
        } else {
          console.error("영어 이름 데이터가 없습니다.");
        }
      });
    }
  });
}

// 관심 전공 렌더링 함수
function renderMajors(app, nickname, profileImage, interestMajors, deleteMode, render) {
  const majorContent = deleteMode
    ? createDeleteModeTemplate(interestMajors)
    : createMajorCards(interestMajors);

  app.innerHTML = renderTemplate(nickname, profileImage, majorContent);

  // "전공 탐색하러 가기" 버튼 클릭 이벤트
  const exploreMajorsButton = document.getElementById("explore-majors-btn");
  if (exploreMajorsButton) {
    exploreMajorsButton.addEventListener("click", () => navigateTo("#main"));
  }

  // 관심 전공 삭제 버튼 조건부 생성
  if (interestMajors.length > 0 && !deleteMode) {
    const deleteButton = document.getElementById("delete-majors-btn");
    if (!deleteButton) {
      const newDeleteButton = document.createElement("button");
      newDeleteButton.id = "delete-majors-btn";
      newDeleteButton.textContent = "관심 전공 삭제하기";
      newDeleteButton.className = "delete-majors-btn";

      const majorsContainer = app.querySelector(".majors-container");
      majorsContainer.insertAdjacentElement("afterend", newDeleteButton);

      newDeleteButton.addEventListener("click", () => {
        deleteMode = true;
        renderMajors(app, nickname, profileImage, interestMajors, deleteMode, render);
      });
    }
  } else {
    const deleteButton = document.getElementById("delete-majors-btn");
    if (deleteButton) {
      deleteButton.remove();
    }
  }

  // 삭제 모드 UI
  if (deleteMode) {
    const footer = document.createElement("div");
    footer.className = "delete-footer";
    footer.innerHTML = `
      <button id="cancel-delete" class="cancel-delete-btn">취소</button>
      <button id="confirm-delete" class="confirm-delete-btn">선택 삭제</button>
    `;
    app.appendChild(footer);

    document.getElementById("cancel-delete").addEventListener("click", () => {
      deleteMode = false;
      renderMajors(app, nickname, profileImage, interestMajors, deleteMode, render);
    });

    document.getElementById("confirm-delete").addEventListener("click", () => {
      const selectedIndexes = Array.from(
        document.querySelectorAll(".delete-checkbox:checked")
      ).map((checkbox) => parseInt(checkbox.dataset.index, 10));

      const updatedMajors = interestMajors.filter((_, index) => !selectedIndexes.includes(index));
      localStorage.setItem("interest_majors", JSON.stringify(updatedMajors));

      alert("선택한 관심 전공이 삭제되었습니다.");
      deleteMode = false;
      renderMajors(app, nickname, profileImage, updatedMajors, deleteMode, render);
    });
  }

  setupMajorCardEvents(deleteMode);
}

// 메인 렌더링 함수
export function render() {
  ensureCSSLoaded("css/pages/mypage.css");

  const app = document.getElementById("app");
  const nickname = localStorage.getItem("nickname") || "사용자";
  const profileImage = localStorage.getItem("profile_image") || "images/default_profile.png";
  const interestMajors = JSON.parse(localStorage.getItem("interest_majors")) || [];
  const deleteMode = false;

  renderMajors(app, nickname, profileImage, interestMajors, deleteMode, render);

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear();
          navigateTo("");
        });
      }
    });
  }
}