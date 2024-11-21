import departments from './data/link_data.js'; // 학과 데이터 불러오기
import roadmapImages from './data/roadmap_img.js'; // 로드맵 이미지 불러오기

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// CSS 파일 로드
loadCSS("css/pages/roadmap.css");

export function render(selectedMajorEng) {
  const app = document.getElementById("app");

  // 영어 이름으로 한글 이름 찾기
  const selectedMajor = Object.keys(departments).find(
    (key) => departments[key]?.eng_name === selectedMajorEng
  );

  // 영어 이름으로 학과 URL 및 로드맵 이미지 찾기
  const deptUrl = selectedMajor ? departments[selectedMajor]?.url : null;
  const roadmapImg = selectedMajor ? roadmapImages[selectedMajor] : null;
  console.log("Roadmap Image Path:", roadmapImg);


  // 학과를 찾지 못한 경우 처리
  if (!selectedMajor) {
    app.innerHTML = `<p>존재하지 않는 학과입니다. 올바른 URL을 입력해주세요.</p>`;
    return;
  }

  // 로드맵 페이지 내용 렌더링
  app.innerHTML = `
    <header class="roadmap-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    </header>
    <div class="roadmap-page">
      <h1>${selectedMajor} 더 알아보기</h1>
      <div class="roadmap-buttons">
        <button id="similar-dept-btn" class="roadmap-btn">비슷한 전공 보기</button>
        <button id="roadmap-img-btn" class="roadmap-btn">로드맵 이미지 보기</button>
        <button id="dept-link-btn" class="roadmap-btn">학과 홈페이지로 이동</button>
      </div>
      <div class="back-button-container">
        <button id="back-btn" class="roadmap-btn back-btn">돌아가기</button>
      </div>
    </div>
    <div id="overlay" class="overlay hidden">
      <div class="popup">
        <button id="close-popup" class="close-popup">×</button>
        <img src="${roadmapImg}" alt="${selectedMajor} 로드맵" class="popup-image"/>
      </div>
    </div>
  `;

  // 비슷한 전공 보기 버튼 이벤트
  document.getElementById("similar-dept-btn").addEventListener("click", () => {
    alert(`${selectedMajor}의 비슷한 전공을 표시합니다.`);
  });

  // 로드맵 이미지 보기 버튼 이벤트
  document.getElementById("roadmap-img-btn").addEventListener("click", () => {
    if (roadmapImg) {
      document.getElementById("overlay").classList.remove("hidden"); // 팝업 표시
    } else {
      alert("해당 전공의 로드맵 이미지를 찾을 수 없습니다.");
    }
  });

  // 팝업 닫기 버튼 이벤트
  document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("overlay").classList.add("hidden"); // 팝업 숨기기
  });

  // 학과 홈페이지 이동 버튼 이벤트
  document.getElementById("dept-link-btn").addEventListener("click", () => {
    if (deptUrl) {
      window.open(deptUrl, "_blank", "noopener,noreferrer"); // 새 탭에서 학과 홈페이지 열기
    } else {
      alert("해당 전공의 학과 홈페이지 URL을 찾을 수 없습니다.");
    }
  });

  // 돌아가기 버튼 이벤트
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "#mypage"; // 마이페이지로 이동
  });

  // 로고 클릭 시 메인 페이지로 이동
  document.getElementById("logo-button").addEventListener("click", () => {
    window.location.hash = "#main";
  });
}
