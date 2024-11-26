export function render() {
  // `app` 컨테이너를 가져옵니다.
  const app = document.getElementById("app");

  // `app` 컨테이너가 없을 경우 에러를 출력하고 함수 종료
  if (!app) {
    console.error("앱 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // `app` 컨테이너에 HTML 콘텐츠를 추가
  app.innerHTML = `
    <header class="mypage-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    </header>
    <div class="main-container">
      <h1>알아보고 싶은 학과는 어디에 있나요?</h1>
      <div class="buttons">
        <button id="humanities-btn" class="btn">인문사회과학캠퍼스</button>
        <button id="sciences-btn" class="btn">자연과학캠퍼스</button>
      </div>
    </div>
    <div class="footer-background"></div>
  `;

  // Home 버튼 클릭 이벤트
  const homeButton = document.getElementById("home-btn");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
    });
  }

  // 로고 클릭 이벤트
  const logoButton = document.getElementById("logo-button");
  if (logoButton) {
    logoButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
    });
  }

  // Humanities 버튼 클릭 이벤트
  const humanitiesButton = document.getElementById("humanities-btn");
  if (humanitiesButton) {
    humanitiesButton.addEventListener("click", () => {
      window.location.hash = "#humanities";
    });
  }

  // Sciences 버튼 클릭 이벤트
  const sciencesButton = document.getElementById("sciences-btn");
  if (sciencesButton) {
    sciencesButton.addEventListener("click", () => {
      window.location.hash = "#sciences";
    });
  }

  // 로그아웃 버튼 클릭 이벤트
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname"); // 닉네임 삭제
          localStorage.removeItem("profile_image"); // 프로필 이미지 삭제
          localStorage.removeItem("interest_majors"); // 관심 전공 삭제
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}
