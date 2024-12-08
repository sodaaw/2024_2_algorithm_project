import { navigateTo } from "../utils/router.js";
import { ensureCSSLoaded } from "../utils/CSSManager.js"; // CSSManager.js에서 함수 임포트
import relatedMajors from "./data/recommendation.js"; // 유사 전공 데이터 임포트

const MIN_SCORE_THRESHOLD = 70; // 적합성 점수 임계값
const MAX_NO_COUNT = 6; // "아니요" 버튼 클릭 허용 횟수

let majorWeightYSum = 0; // "예"를 눌렀을 때 weight 합산
let majorWeightTotalSum = 0; // 전체 weight 합산
let noCount = 0; // "아니요" 클릭 횟수

function showModal(message, callback) {
  const app = document.getElementById("app");

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <h2>유사 전공 추천</h2>
    <p>${message}</p>
    <button id="confirm-modal-btn">확인</button>
  `;

  modalOverlay.appendChild(modal);
  app.appendChild(modalOverlay);

  document.getElementById("confirm-modal-btn").addEventListener("click", () => {
    app.removeChild(modalOverlay);
    if (callback) callback();
  });
}

function showModalWithSimilarMajors(similarMajors, index = 0, navigateCallback, cancelCallback) {
  const app = document.getElementById("app");
  const currentMajor = similarMajors[index];
  const isLastMajor = index === similarMajors.length - 1;

  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

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
      showModalWithSimilarMajors(similarMajors, index + 1, navigateCallback, cancelCallback);
    });
  }
}

// 백트래킹 함수 수정
function backtrackMajorCompatibility(
  major,
  questionIndex,
  majorWeightYSum,
  majorWeightTotalSum,
  noCount
) {
  const currentScore = (100 * majorWeightYSum) / majorWeightTotalSum;
  const similarMajors = relatedMajors[major.major] || [];

  if (noCount >= MAX_NO_COUNT) {
    if (questionIndex < 10) {
      if (similarMajors.length > 0) {
        showModalWithSimilarMajors(
          similarMajors,
          0,
          (selectedMajor) => navigateTo(`#majorsearch?major=${encodeURIComponent(selectedMajor)}`),
          () => navigateTo("#mypage")
        );
      } else {
        showModal(
          `현재 전공(${major.major})의 적합도가 낮습니다. 다른 전공을 고려해보세요.`,
          () => navigateTo("#mypage")
        );
      }
      return false;
    } else {
      if (similarMajors.length > 0) {
        showModalWithSimilarMajors(
          similarMajors,
          0,
          (selectedMajor) => navigateTo(`#majorsearch?major=${encodeURIComponent(selectedMajor)}`),
          () => navigateTo("#majorresult")
        );
      } else {
        showModal(
          `현재 전공(${major.major})의 적합도가 낮습니다. 다른 전공을 고려해보세요.`,
          () => navigateTo("#majorresult")
        );
      }
      return false;
    }
  }

  if (questionIndex === 10) {
    const finalScore = (100 * majorWeightYSum) / majorWeightTotalSum;
    sessionStorage.setItem("majorScore", finalScore);
    sessionStorage.setItem("majorResult", finalScore >= MIN_SCORE_THRESHOLD ? "1" : "0");

    // 디버깅
    console.log("[Debug] Major Score:", finalScore);
    console.log("[Debug] Major Result:", finalScore >= MIN_SCORE_THRESHOLD ? "1" : "0");
    navigateTo("#majorresult");
    return true;
  }

  return true;
}

// JSON 파일에서 전공과 질문 데이터를 불러오기
async function loadMajors() {
  try {
    const response = await fetch("/questions.json");
    const data = await response.json();
    return data.majors;
  } catch (error) {
    console.error("전공 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}

// 질문 렌더링 함수
function renderQuestions(major, questionIndex, majorWeightYSum = 0, majorWeightTotalSum = 0, noCount = 0) {
  const app = document.getElementById("app");
  const questionData = major.questions[questionIndex];

  app.innerHTML = `
    <header class="mypage-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
        <button id="mypage-btn" class="mypage-btn">Mypage</button>
      </div>
    </header>
    <div class="div-wrapper">
      <div class="div">
        <button class="option-button overlap" data-option="N">
          <div class="rectangle"></div>
          <div class="sub-headline-sec">아니오</div>
        </button>
        <button class="option-button overlap-group" data-option="Y">
          <div class="rectangle"></div>
          <div class="h-sub-headline-sec">예</div>
        </button>
        <div class="overlap-2">
          <p class="text-wrapper">${questionData.question}</p>
        </div>
        <div class="overlap-3">
          <div class="text-wrapper">${questionIndex + 1}/10</div>
        </div>
        <div class="overlap-4">
          <div class="sub-headline-sec-2">${major.major}</div>
        </div>
      </div>
    </div>
  `;

  setupNavigationButtons();

  const optionButtons = document.querySelectorAll(".option-button");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedOption = event.currentTarget.dataset.option;
      let newMajorWeightYSum = majorWeightYSum;
      let newMajorWeightTotalSum = majorWeightTotalSum;
      let newNoCount = noCount;

      if (selectedOption === "Y") {
        newMajorWeightYSum += questionData.weight;
      } else if (selectedOption === "N") {
        newNoCount += 1;
      }
      newMajorWeightTotalSum += questionData.weight;

      if (
        backtrackMajorCompatibility(
          major,
          questionIndex + 1,
          newMajorWeightYSum,
          newMajorWeightTotalSum,
          newNoCount
        )
      ) {
        if (questionIndex + 1 < 10) {
          renderQuestions(
            major,
            questionIndex + 1,
            newMajorWeightYSum,
            newMajorWeightTotalSum,
            newNoCount
          );
        }
      }
    });
  });
}

// 버튼 이벤트 설정 함수
function setupNavigationButtons() {
  const setupButton = (id, targetHash, cssPath) => {
    const button = document.getElementById(id);
    if (button) {
      console.log(`[Debug] Setting up button: ${id} -> ${targetHash}`);
      button.addEventListener("click", () => {
        if (cssPath) ensureCSSLoaded(cssPath); // CSS 보장
        navigateTo(targetHash);
      });
    } else {
      console.warn(`[Warning] Button with ID "${id}" not found.`);
    }
  };

  setupButton("home-btn", "#main", "css/pages/main.css");
  setupButton("logo-button", "#main", "css/pages/main.css");
  setupButton("mypage-btn", "#mypage", "css/pages/mypage.css");

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
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

// 메인 렌더링 함수
export async function render(decodedMajor) {
  const majors = await loadMajors();
  const selectedMajor = majors.find((major) => major.major === decodedMajor);

  if (!selectedMajor) {
    console.error(`Major "${decodedMajor}" not found in data.`);
    return;
  }

  ensureCSSLoaded("css/pages/majorsearch.css"); // CSS 보장

  sessionStorage.setItem("majorName", selectedMajor.major);
  renderQuestions(selectedMajor, 0);
}