import { navigateTo } from "../utils/router.js";

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  
  // CSS 파일 로드
  loadCSS("css/pages/majorsearch.css");

// JSON 파일에서 전공과 질문 데이터를 불러오기 위한 함수
async function loadMajors() {
    try {
      const response = await fetch('../../questions.json'); 
      const data = await response.json();
      return data.majors; // JSON 파일에서 'majors' 데이터를 반환
    } catch (error) {
      console.error('전공 데이터를 불러오는 데 실패했습니다:', error);
      return [];
    }
  }
  
  // 전공 선택 후 질문을 렌더링하는 함수
  function renderQuestions(major) {
    const app = document.getElementById("app");
    let questionIndex = 0;
  
    // 질문을 렌더링하는 함수
    function renderQuestion(index) {
      const questionData = major.questions[index];
  
      // 버튼 클릭 이벤트 리스너 추가
      const optionButtons = document.querySelectorAll('.option-button');
      optionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const selectedOption = event.target.dataset.option;
          const questionIndex = event.target.dataset.index;
  
          // 선택한 옵션 저장
          major.questions[questionIndex].answer = selectedOption;
  
          // 다음 질문으로 이동
          if (questionIndex + 1 < major.questions.length) {
            renderQuestion(questionIndex + 1);
          } else {
            renderResults();
          }
        });
      });
    }
  
    // 첫 번째 질문을 렌더링
    renderQuestion(questionIndex);
  }
  
  // 페이지 로드 후 전공 데이터를 불러와서 전공을 선택하고 질문을 렌더링하는 함수 실행
  window.onload = async () => {
    const majors = await loadMajors(); // JSON 파일에서 전공 데이터 불러오기
  
    // 전공 선택 버튼 클릭 이벤트 리스너 추가
    const majorButtons = document.querySelectorAll('.major-button');
    majorButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const selectedMajorIndex = event.target.dataset.index;
        const selectedMajor = majors[selectedMajorIndex];
  
        // 선택한 전공에 맞는 질문 렌더링
        renderQuestions(selectedMajor);
      });
    });
  };

  export function render() {
    const app = document.getElementById("app");
    app.innerHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
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
              <p class="text-wrapper">한국과 중국의 유학 전통에 대해 관심이 있나요?</p>
              <p class="text-wrapper">한국과 중국의 유학 전통에 대해 관심이 있나요?</p>
            </div>
            <div class="overlap-3">
              <div class="text-wrapper">1/10</div>
              <div class="text-wrapper">1/10</div>
            </div>
            <div class="overlap-4">
              <div class="sub-headline-sec-2">문과대학 - 유학·동양학과</div>
              <div class="sub-headline-sec-2">문과대학 - 유학·동양학과</div>
            </div>
            <div class="overlap-5">
            <div class="navbar">
            <div class="navbar-brand-sec"><div class="text-wrapper-2">Brandname</div></div>
            <div class="navbar-toggler"></div>
            <div class="collapse-navbar">
              <div class="navbar-nav">
                <div class="li-sec">
                  <div class="a"><div class="link">Home</div></div>
                </div>
                <div class="a-wrapper">
                  <div class="link-wrapper"><div class="link-2">Mypage</div></div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </body>
    </html>
`;    

}
  