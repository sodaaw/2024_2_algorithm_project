import { navigateTo } from "../utils/router.js";

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
}