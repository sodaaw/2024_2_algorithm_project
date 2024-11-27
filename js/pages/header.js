// header.js

export function renderHeader() {
  return `
    <header class="mypage-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="mypage-btn" class="header-btn mypage-btn">My Page</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    </header>
  `;
}

export function setupHeaderEvents() {
  // Home 버튼 이벤트
  document.getElementById("home-btn")?.addEventListener("click", () => {
    console.log("Navigating to main page...");
    window.location.hash = "#main";
  });

  // My Page 버튼 이벤트
  document.getElementById("mypage-btn")?.addEventListener("click", () => {
    console.log("Navigating to My Page...");
    window.location.hash = "#mypage";
  });

  // Logout 버튼 이벤트
  document.getElementById("logout-btn")?.addEventListener("click", () => {
    console.log("Logging out...");
    alert("로그아웃 되었습니다.");
    localStorage.clear(); // 로컬스토리지 데이터 삭제
    window.location.hash = "#login"; // 로그인 페이지로 이동
  });

  // 로고 클릭 이벤트
  document.getElementById("logo-button")?.addEventListener("click", () => {
    console.log("Navigating to main page via logo...");
    window.location.hash = "#main";
  });
}
