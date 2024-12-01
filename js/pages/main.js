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
        <button id="mypage-btn" class="logout-btn">Mypage</button>
      </div>
    </header>
    <div class="main-container">
      <h1>알아보고 싶은 학과는 어디에 있나요?</h1>
      <div class="buttons">
        <button id="humanities-btn" class="btn humanities-btn">인문사회과학캠퍼스</button>
        <button id="sciences-btn" class="btn sciences-btn">자연과학캠퍼스</button>
      </div>
    </div>
    <div class="footer-background"></div>
  `;

  // 기존 CSS 제거 함수
  const removeExistingStyles = () => {
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"], style');
    styleSheets.forEach((sheet) => {
      sheet.parentNode.removeChild(sheet); // 해당 CSS 노드 제거
    });
  };

  // 새로운 CSS 로드 함수 (캐시 무효화 포함)
  const loadCSS = (cssPath) => {
    const timestamp = new Date().getTime(); // 현재 시간 타임스탬프
    const cssUrlWithVersion = `${cssPath}?ver=${timestamp}`; // 쿼리 파라미터 추가
    const existingLink = document.querySelector(`link[rel="stylesheet"][href^="${cssPath}"]`);
    if (existingLink) {
      existingLink.parentNode.removeChild(existingLink); // 기존 CSS 제거
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrlWithVersion; // 새로운 URL 사용
    document.head.appendChild(link);
  };

  // 버튼에 이벤트 리스너 추가
  const setupButton = (id, hash, cssPath) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        removeExistingStyles(); // 기존 CSS 제거
        if (cssPath) {
          loadCSS(cssPath); // 해당 페이지 CSS 로드
        }
        window.location.hash = hash;
      });
    }
  };

  // 로고 및 홈 버튼 이벤트
  setupButton("home-btn", "#home", "./css/pages/home.css?ver=1");
  setupButton("mypage-btn", "#mypage", "./css/pages/mypage.css?ver=1");
  setupButton("logo-button", "#main", "./css/pages/main.css?ver=1");

  // Humanities 및 Sciences 버튼 이벤트
  setupButton("humanities-btn", "#humanities", "./css/pages/humanities.css?ver=1");
  setupButton("sciences-btn", "#sciences", "./css/pages/sciences.css?ver=1");

  // 로그아웃 버튼 이벤트
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (typeof Kakao !== "undefined" && Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname"); // 닉네임 삭제
          localStorage.removeItem("profile_image"); // 프로필 이미지 삭제
          localStorage.removeItem("interest_majors"); // 관심 전공 삭제
          removeExistingStyles(); // CSS 제거
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}

// DOMContentLoaded 이후 render 함수 실행
document.addEventListener("DOMContentLoaded", () => {
  render();
});

