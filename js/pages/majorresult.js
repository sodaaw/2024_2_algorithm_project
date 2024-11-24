import { navigateTo } from "../utils/router.js";
import { KAKAO_API_KEY } from '../apikey.js';

// Kakao SDK 초기화
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
Kakao.init(KAKAO_API_KEY); // 카카오 API 키로 초기화
console.log('Kakao SDK Initialized:', Kakao.isInitialized());
}

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

// CSS 파일을 제거하는 함수
function removeCSS(href) {
    const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
    links.forEach((link) => link.remove());
}

// 해당 전공이 적합한지 아닌지 출력하는 함수
function renderResultPage() {
    // sessionStorage에서 데이터 가져오기 (majorsearch 페이지에서 넘기며 저장)
    const result = sessionStorage.getItem("majorResult");

    if (result === "1") {
        console.log("return is 1 yes")
        return `
        <span class="text-wrapper-2">적합</span>
    `;
    } else if (result === "0") {
        console.log("return is 0 no")
        return `
        <span class="text-wrapper-3">부적합</span>
    `;
    } else {
        return `
      ERROR
    `;
    }
}

function renderMajorData() {
    const majorName = sessionStorage.getItem("majorName");
    const majorScore = sessionStorage.getItem("majorScore");

    return [majorName, majorScore];
}

export function render() {

    const [majorName, majorScore] = renderMajorData();

    // 이전 CSS 제거
    removeCSS("css/pages/majorsearch.css");

    // 새로운 CSS 로드
    loadCSS("css/pages/majorresult.css");
    const app = document.getElementById("app");
    app.innerHTML = `
            <header class="mypage-header">
              <div class="header-left">
                <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/> <!-- 앱 로고 추가 -->
              </div>
              <div class="header-right">
                <button id="home-btn" class="home-btn">Home</button>
                <button id="logout-btn" class="logout-btn">Logout</button>
              </div>
            </header>
            <div class="div-wrapper">
      <div class="div">
        <div class="button-md-sec"><div class="btn-text">관심 전공 추가하기</div></div>
        <div class="btn-text-wrapper"><div class="text-wrapper">유사 전공 탐색하기</div></div>
        <p class="p">
          <span class="span">탐색 결과는<br /></span>
          ${renderResultPage()}
          <span class="span">입니다.</span>
        </p>
        <p class="n">
          <span class="text-wrapper-4">당신은 </span>
          <span class="text-wrapper-5">${majorName}</span>
          <span class="text-wrapper-4">에 대해</span>
          <span class="text-wrapper-6">${majorScore}</span>
          <span class="text-wrapper-4">점입니다!</span>
        </p>
      </div>
    </div>

            `;
 // Home 버튼 클릭 시 메인 페이지로 이동
  const homeButton = document.getElementById("home-btn");
  homeButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
  });

  // 로고 누르면 메인페이지로 가게끔
  const logoButton = document.getElementById("logo-button");
  logoButton.addEventListener("click", () => {
      window.location.hash = "#main"; // 메인 페이지로 이동
  });
// 로그아웃 버튼 클릭 이벤트
const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {
logoutButton.addEventListener("click", () => {
// 카카오 로그아웃 호출
if (Kakao.Auth) {
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
} else {
console.error("로그아웃 버튼을 찾을 수 없습니다.");
}
      
}