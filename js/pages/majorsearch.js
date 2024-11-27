import { renderHeader, setupHeaderEvents } from "./header.js";
import { navigateTo } from "../utils/router.js";

// CSS 파일 동적 로드 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// CSS 파일 로드
loadCSS("css/pages/majorsearch.css");

let majorWeightYSum = 0; // 사용자가 "예"를 눌렀을 때 weight를 더하는 변수
let majorWeightTotalSum = 0; // 사용자가 "예" 또는 "아니오"를 눌렀을 때 weight를 더하는 변수

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

// 적합 여부 계산 함수
function calcResult(majorWeightYSum, majorWeightTotalSum) {
  sessionStorage.setItem("majorScore", 100 * majorWeightYSum / majorWeightTotalSum);
  return 100 * majorWeightYSum / majorWeightTotalSum >= 70 ? 1 : 0;
}

// 질문 렌더링 함수
function renderQuestions(major, questionIndex) {
  const app = document.getElementById("app");
  const questionData = major.questions[questionIndex];

  app.innerHTML = `
    ${renderHeader()} <!-- 공통 헤더 삽입 -->
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

  // 질문 선택 이벤트
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const selectedOption = event.currentTarget.dataset.option;

      if (selectedOption === "Y") {
        majorWeightYSum += questionData.weight;
        majorWeightTotalSum += questionData.weight;
      } else {
        majorWeightTotalSum += questionData.weight;
      }

      console.log("Total:", majorWeightTotalSum, "Yes:", majorWeightYSum);

      // 다음 질문 또는 결과로 이동
      if (questionIndex + 1 < 10) {
        renderQuestions(major, questionIndex + 1);
      } else {
        sessionStorage.setItem("majorResult", calcResult(majorWeightYSum, majorWeightTotalSum).toString());
        navigateTo("#majorresult");
      }
    });
  });

  // 헤더 이벤트 설정
  setupHeaderEvents();
}

export async function render(decodedMajor) {
  const majors = await loadMajors(); // JSON 파일에서 전공 데이터 불러오기
  const selectedMajor = majors.find((major) => major.major === decodedMajor);

  if (!selectedMajor) {
    console.error(`Major "${decodedMajor}" not found in data.`);
    return;
  }

  sessionStorage.setItem("majorName", selectedMajor.major);
  renderQuestions(selectedMajor, 0); // 첫 번째 질문부터 시작
}
