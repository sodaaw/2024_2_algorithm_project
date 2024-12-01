import { navigateTo } from "../utils/router.js";
import { loadCSS, removeAllCSS } from "../utils/CSSManager.js"; // CSSManager.js 가져오기

let majorWeightYSum = 0; // 사용자가 "예"를 눌렀을 때 weight를 더하는 변수
let majorWeightTotalSum = 0; // 사용자가 "예" 또는 "아니오"를 눌렀을 때 weight를 더하는 변수 (전공의 전체 스코어가 반환됨)

// JSON 파일에서 전공과 질문 데이터를 불러오기 위한 함수
async function loadMajors() {
  try {
    const response = await fetch("/questions.json"); // 경로 확인
    const data = await response.json();
    return data.majors;
  } catch (error) {
    console.error("전공 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}

// 결과 계산 함수
function calcResult(majorWeightYSum, majorWeightTotalSum) {
  const score = (100 * majorWeightYSum) / majorWeightTotalSum;
  sessionStorage.setItem("majorScore", score);
  return score >= 70 ? 1 : 0;
}

// 전공 선택 후 질문 렌더링 함수
function renderQuestions(major, questionIndex) {
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

  // 버튼 클릭 이벤트 리스너 추가
  const optionButtons = document.querySelectorAll(".option-button");
  optionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const selectedOption = event.currentTarget.dataset.option;
      if (selectedOption === "Y") {
        majorWeightYSum += questionData.weight;
      }
      majorWeightTotalSum += questionData.weight;

      if (questionIndex + 1 < 10) {
        renderQuestions(major, questionIndex + 1);
      } else {
        const result = calcResult(majorWeightYSum, majorWeightTotalSum);
        sessionStorage.setItem("majorResult", result.toString());
        navigateTo("#majorresult");
      }
    });
  });

  // 버튼 이벤트 설정
  setupNavigationButtons();
}

// 버튼 이벤트 설정 함수
function setupNavigationButtons() {
  const setupButton = (id, targetHash, nextCSS) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        removeAllCSS(); // 기존 CSS 제거
        loadCSS(nextCSS); // 다음 페이지 CSS 로드
        navigateTo(targetHash);
      });
    }
  };

  // Home 버튼
  setupButton("home-btn", "#main", "css/pages/main.css");

  // 로고 버튼
  setupButton("logo-button", "#main", "css/pages/main.css");

  // Mypage 버튼
  setupButton("mypage-btn", "#mypage", "css/pages/mypage.css");

  // 로그아웃 버튼
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear(); // 모든 로컬 스토리지 데이터 제거
          removeAllCSS(); // CSS 제거
          navigateTo(""); // 로그인 페이지로 이동
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

  // CSS 업데이트
  removeAllCSS();
  loadCSS("css/pages/majorsearch.css");

  sessionStorage.setItem("majorName", selectedMajor.major);
  renderQuestions(selectedMajor, 0);
}