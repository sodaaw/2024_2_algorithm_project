import { navigateTo } from "../utils/router.js";
import { KAKAO_API_KEY } from "../apikey.js";
import { ensureCSSLoaded } from "../utils/CSSManager.js"; // CSSManager에서 함수 임포트
import relatedMajors from "./data/recommendation.js"; // 비슷한 전공 데이터 불러오기

// MIN_SCORE_THRESHOLD 정의
const MIN_SCORE_THRESHOLD = 70; // 적합성 점수 임계값

// Kakao SDK 초기화
if (typeof Kakao !== "undefined" && !Kakao.isInitialized()) {
  Kakao.init(KAKAO_API_KEY); // 카카오 API 키로 초기화
  console.log("Kakao SDK Initialized:", Kakao.isInitialized());
}

function showModal(similarMajors, index = 0, navigateCallback, cancelCallback) {
  const app = document.getElementById("app");
  const currentMajor = similarMajors[index];
  const isLastMajor = index === similarMajors.length - 1;

  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  // Create modal content
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <h2>유사 전공 추천</h2>
    <p>현재 전공의 적합도가 낮아 유사 전공 ${currentMajor}을(를) 추천합니다.<br>탐색하시겠습니까?</p>
    <div class="modal-buttons">
      <button id="confirm-modal-btn" class="btn-confirm">예</button>
      <button id="cancel-modal-btn" class="btn-cancel">아니오</button>
      ${
        !isLastMajor
          ? `<button id="next-modal-btn" class="btn-next">다른 전공</button>`
          : ""
      }
    </div>
  `;

  modalOverlay.appendChild(modal);
  app.appendChild(modalOverlay);

  // Add event listeners to buttons
  document.getElementById("confirm-modal-btn").addEventListener("click", () => {
    app.removeChild(modalOverlay);
    if (navigateCallback) navigateCallback(currentMajor);
  });

  document.getElementById("cancel-modal-btn").addEventListener("click", () => {
    app.removeChild(modalOverlay);
    if (cancelCallback) cancelCallback();
  });

  if (!isLastMajor) {
    document.getElementById("next-modal-btn").addEventListener("click", () => {
      app.removeChild(modalOverlay);
      showModal(similarMajors, index + 1, navigateCallback, cancelCallback);
    });
  }
}

// 결과 페이지 렌더링 함수 수정
function renderResultPage(result) {
  const majorScore = ~~sessionStorage.getItem("majorScore");

  if (majorScore < MIN_SCORE_THRESHOLD) {
    // 점수가 낮을 경우 유사 전공 자동 추천
    return {
      resultText: `
        <span class="text-wrapper-3">부적합</span>
      `,
      recommendMajors: true,
    };
  }

  return {
    resultText:
      result === "1"
        ? `<span class="text-wrapper-2">적합</span>`
        : `<span class="text-wrapper-3">부적합</span>`,
    recommendMajors: false,
  };
}

// sessionStorage에서 전공 데이터 가져오는 함수
function renderMajorData() {
  const majorName = sessionStorage.getItem("majorName");
  const majorScore = ~~sessionStorage.getItem("majorScore");

  return [majorName, majorScore];
}

// 메인 렌더링 함수
export function render() {
  const [majorName, majorScore] = renderMajorData();
  const result = sessionStorage.getItem("majorResult");

  // 결과 페이지 렌더링 로직 수정
  const { resultText, recommendMajors } = renderResultPage(result);

  // CSS 업데이트
  ensureCSSLoaded("css/pages/majorresult.css"); // CSSManager.js로 관리

  const app = document.getElementById("app");
  app.innerHTML = `
    <header class="mypage-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
        <button id="mypage-btn" class="mypage-btn">Mypage</button>
      </div>
    </header>
    <div class="majorResult-page">
      <div class="div-wrapper">
        <div class="div">
          ${
            recommendMajors
              ? `
            <div class="recommendation-alert">
              <p>현재 전공의 적합도가 낮습니다. 유사 전공을 추천합니다.</p>
            </div>
          `
              : ""
          }
          
          <button id="interestedMajorAdd-btn">
            <div class="button-md-sec">
              <div class="btn-text">관심 전공 추가하기</div>
            </div>
          </button>
          <button id="similarMajorSearch-btn">
            <div class="btn-text-wrapper">
              <div class="text-wrapper">유사 전공 탐색하기</div>
            </div>
          </button>
          
          <p class="p">
            <span class="span">탐색 결과는<br /></span>
            ${resultText}
            <span class="span">입니다.</span>
          </p>
          
          <p class="n">
            <span class="text-wrapper-4">당신은 </span>
            <span class="text-wrapper-5">${majorName}</span>
            <span class="text-wrapper-4">에 대해</span>
            <span class="text-wrapper-6">${majorScore}</span>
            <span class="text-wrapper-4">점입니다!</span>
          </p>
        </div>
      </div>
    </div>
  `;

  // 관심 전공 추가하기 버튼
  const interestedMajorAddBtn = document.getElementById("interestedMajorAdd-btn");
  interestedMajorAddBtn.addEventListener("click", () => {
    if (!majorName) {
      alert("추가할 전공이 없습니다.");
      return;
    }

    // 로컬 스토리지에서 관심 전공 리스트 가져오기
    let interestMajors = JSON.parse(localStorage.getItem("interest_majors")) || [];

    if (interestMajors.includes(majorName)) {
      alert(`${majorName}은(는) 이미 관심 전공에 추가되어 있습니다.`);
      navigateTo("#mypage");
      return;
    }

    interestMajors.push(majorName);
    localStorage.setItem("interest_majors", JSON.stringify(interestMajors));
    alert(`${majorName}이(가) 관심 전공에 추가되었습니다!`);
    navigateTo("#mypage");
  });

  // 유사 전공 탐색하기 버튼
  const similarMajorSearchBtn = document.getElementById("similarMajorSearch-btn");
  similarMajorSearchBtn.addEventListener("click", () => {
    const similarMajors = relatedMajors[majorName] || [];
    if (similarMajors.length === 0) {
      alert(`${majorName}와 관련된 비슷한 전공이 없습니다.`);
      return;
    }

    const cards = similarMajors
      .map(
        (major) => `
          <div class="major-card animate-card">
            <p>${major}</p>
          </div>
        `
      )
      .join("");

    const cardContainer = `
      <div class="card-container">
        <h2>비슷한 전공 추천</h2>
        ${cards}
        <button id="close-similar-majors" class="close-btn">닫기</button>
      </div>
    `;

    const majorResultPage = document.querySelector(".majorResult-page");
    majorResultPage.insertAdjacentHTML("beforeend", cardContainer);

    document.getElementById("close-similar-majors").addEventListener("click", () => {
      document.querySelector(".card-container").remove();
    });

    document.querySelectorAll(".major-card").forEach((element) => {
      element.addEventListener("click", () => {
        const major = element.textContent.trim();
        if (major) {
          window.location.hash = `#majorsearch?major=${encodeURIComponent(major)}`;
        } else {
          alert("선택된 전공의 정보를 찾을 수 없습니다.");
        }
      });
    });
  });

  // 자동 유사 전공 추천 로직
  if (recommendMajors) {
    const similarMajors = relatedMajors[majorName] || [];
    if (similarMajors.length > 0) {
      showModal(
        similarMajors,
        0,
        (selectedMajor) => {
          // Navigate to the selected major
          window.location.hash = `#majorsearch?major=${encodeURIComponent(
            selectedMajor
          )}`;
        },
        () => {
          // Navigate to MyPage if canceled
          navigateTo("#majorresult");
        }
      );
    }
  }
}