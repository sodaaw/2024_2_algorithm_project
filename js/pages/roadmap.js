// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  
  // CSS 파일 로드
  loadCSS("css/pages/roadmap.css");
  
  export function render(selectedMajor) {
    const app = document.getElementById("app");
  
    // 로드맵 페이지 내용 렌더링
    app.innerHTML = `
        <header class="roadmap-header">
            <div class="header-left">
                <id="logo-button" img src="images/logo.png" alt="앱 로고" class="app-logo"/> <!-- 앱 로고 추가 -->
            </div>
            <div class="header-right">
                <button id="home-btn" class="home-btn">Home</button>
                <button id="logout-btn" class="logout-btn">Logout</button>
            </div>
        </header>
        <div class="roadmap-page">
            <h1>${selectedMajor} 로드맵 페이지</h1>
            <div class="roadmap-buttons">
            <button id="similar-dept-btn" class="roadmap-btn">비슷한 전공 보기</button>
            <button id="roadmap-img-btn" class="roadmap-btn">로드맵 이미지 보기</button>
            <button id="dept-link-btn" class="roadmap-btn">학과 홈페이지 이동</button>
            </div>
            <div class="back-button-container">
                <button id="back-btn" class="roadmap-btn back-btn">돌아가기</button>
            </div>
        </div>
    `;
  
    // 비슷한 전공 보기 버튼 이벤트
    document.getElementById("similar-dept-btn").addEventListener("click", () => {
      alert(`${selectedMajor}의 비슷한 전공을 표시합니다.`);
    });
  
    // 로드맵 이미지 보기 버튼 이벤트
    document.getElementById("roadmap-img-btn").addEventListener("click", () => {
      alert(`${selectedMajor}의 로드맵 이미지를 표시합니다.`);
    });
  
    // 학과 홈페이지 이동 버튼 이벤트
    document.getElementById("dept-link-btn").addEventListener("click", () => {
      alert(`${selectedMajor} 학과 홈페이지로 이동합니다.`);
    });
  }
  
  