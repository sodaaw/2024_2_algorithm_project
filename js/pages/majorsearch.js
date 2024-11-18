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
  
      app.innerHTML = `
        <div class="question-box">
          <p class="question-text">${questionData.question}</p>
          <div class="options">
            <button class="option-button" data-option="예" data-index="${index}">예</button>
            <button class="option-button" data-option="아니오" data-index="${index}">아니오</button>
          </div>
        </div>
      `;
  
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
  
    // 결과를 보여주는 함수
    function renderResults() {
      const results = major.questions.map(q => `
        <div class="result">
          <p>${q.question}</p>
          <p>답변: ${q.answer}</p>
        </div>
      `).join('');
  
      app.innerHTML = `
        <div class="results-box">
          <h2>결과</h2>
          ${results}
        </div>
      `;
    }
  
    // 첫 번째 질문을 렌더링
    renderQuestion(questionIndex);
  }
  
  // 페이지 로드 후 전공 데이터를 불러와서 전공을 선택하고 질문을 렌더링하는 함수 실행
  window.onload = async () => {
    const majors = await loadMajors(); // JSON 파일에서 전공 데이터 불러오기
  
    // 전공을 선택하는 UI 생성
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="major-selection">
        <h2>전공을 선택하세요:</h2>
        <div class="major-list">
          ${majors.map((major, index) => `
            <button class="major-button" data-index="${index}">${major.major}</button>
          `).join('')}
        </div>
      </div>
    `;
  
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
        <link rel="stylesheet" href="globals.css" />
        <link rel="stylesheet" href="styleguide.css" />
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div class="div-wrapper">
          <div class="div">
            <div class="overlap">
              <div class="rectangle"></div>
              <div class="sub-headline-sec">아니오</div>
              <div class="rectangle"></div>
              <div class="sub-headline-sec">아니오</div>
            </div>
            <div class="overlap-group">
              <div class="rectangle"></div>
              <div class="h-sub-headline-sec">예</div>
              <div class="rectangle"></div>
              <div class="h-sub-headline-sec">예</div>
            </div>
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
              <div class="navbar-style">
                <div class="navbar-brand-sec"><div class="text-wrapper-2">Brandname</div></div>
                <div class="navbar-toggler"></div>
                <div class="collapse-navbar">
                  <div class="navbar-nav">
                    <div class="li-sec">
                      <div class="a"><div class="link">Home</div></div>
                    </div>
                    <div class="a-wrapper">
                      <div class="a"><div class="link">Product</div></div>
                    </div>
                    <div class="li-sec-2">
                      <div class="a"><div class="link">Pricing</div></div>
                    </div>
                    <div class="li-sec-3">
                      <div class="a"><div class="link">Contact</div></div>
                    </div>
                  </div>
                  <div class="navbar-nav-2">
                    <div class="nav-item-sec">
                      <button class="btn-text-wrapper"><button class="btn-text">Login</button></button>
                    </div>
                    <div class="button-btn-primary-wrapper">
                      <div class="button-btn-primary">
                        <div class="btn-text-2">JOIN US</div>
                        <img class="icn-arrow-right-icn" src="img/image.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="navbar-style">
                <div class="navbar-brand-sec"><div class="text-wrapper-2">Brandname</div></div>
                <div class="navbar-toggler"></div>
                <div class="collapse-navbar">
                  <div class="navbar-nav">
                    <div class="li-sec">
                      <div class="a"><div class="link">Home</div></div>
                    </div>
                    <div class="a-wrapper">
                      <div class="a"><div class="link">Product</div></div>
                    </div>
                    <div class="li-sec-2">
                      <div class="a"><div class="link">Pricing</div></div>
                    </div>
                    <div class="li-sec-3">
                      <div class="a"><div class="link">Contact</div></div>
                    </div>
                  </div>
                  <div class="navbar-nav-2">
                    <div class="nav-item-sec">
                      <button class="btn-text-wrapper"><button class="btn-text">Login</button></button>
                    </div>
                    <div class="button-btn-primary-wrapper">
                      <div class="button-btn-primary">
                        <div class="btn-text-2">JOIN US</div>
                        <img class="icn-arrow-right-icn" src="img/icn-arrow-right-icn-xs.svg" />
                      </div>
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
  