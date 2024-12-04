import { navigateTo } from "../utils/router.js";
import { loadCSS, removeAllCSS } from "../utils/CSSManager.js";

const MIN_SCORE_THRESHOLD = 70; // 적합성 점수 임계값
const MAX_NO_COUNT = 6; // "아니요" 버튼 클릭 허용 횟수

let majorWeightYSum = 0; // "예"를 눌렀을 때 weight 합산
let majorWeightTotalSum = 0; // 전체 weight 합산
let noCount = 0; // "아니요" 클릭 횟수

// 백트래킹 함수 수정
function backtrackMajorCompatibility(major, questionIndex, majorWeightYSum, majorWeightTotalSum) {
  const currentScore = (100 * majorWeightYSum) / majorWeightTotalSum;

  // "아니요" 클릭 횟수가 MAX_NO_COUNT 이상이면 적합하지 않음 처리
  if (noCount >= MAX_NO_COUNT) {
    alert(`현재 전공(${major.major})의 적합도가 낮습니다. 다른 전공을 고려해보세요.`);
    navigateTo("#majorchoice"); // 다른 전공 선택 화면으로 이동
    return false;
  }

  // 모든 질문에 답변을 완료하면 최종 결과로 이동
  if (questionIndex === 10) {
    const finalScore = (100 * majorWeightYSum) / majorWeightTotalSum;
    sessionStorage.setItem("majorScore", finalScore);
    sessionStorage.setItem("majorResult", finalScore >= MIN_SCORE_THRESHOLD ? "1" : "0");
    navigateTo("#majorresult");
    return true;
  }

  return true; // 탐색 계속 진행
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

// 질문 렌더링 함수 수정
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

  // 버튼 클릭 이벤트 리스너
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

      // 백트래킹 로직 실행
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

  // 버튼 이벤트 설정
  setupNavigationButtons();
}

// 버튼 이벤트 설정 함수
function setupNavigationButtons() {
  const setupButton = (id, targetHash, nextCSS, pageName) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        removeAllCSS();
        loadCSS(nextCSS, pageName);
        navigateTo(targetHash);
      });
    }
  };

  setupButton("home-btn", "#main", "css/pages/main.css", "main");
  setupButton("logo-button", "#main", "css/pages/main.css", "main");
  setupButton("mypage-btn", "#mypage", "css/pages/mypage.css", "mypage");

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear();
          removeAllCSS();
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

  removeAllCSS();
  loadCSS("css/pages/majorsearch.css", "majorsearch");

  sessionStorage.setItem("majorName", selectedMajor.major);
  renderQuestions(selectedMajor, 0);
}