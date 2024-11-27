import { renderHeader, setupHeaderEvents } from "./header.js";

// CSS 동적 로드 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// CSS 제거 함수
function removeCSS(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
  links.forEach((link) => link.remove());
}

// 적합 여부 렌더링
function renderResultPage() {
  const result = sessionStorage.getItem("majorResult");

  if (result === "1") {
    console.log("return is 1: 적합");
    return `<span class="text-wrapper-2">적합</span>`;
  } else if (result === "0") {
    console.log("return is 0: 부적합");
    return `<span class="text-wrapper-3">부적합</span>`;
  } else {
    return `ERROR`;
  }
}

// 전공 데이터 가져오기
function renderMajorData() {
  const majorName = sessionStorage.getItem("majorName") || "Unknown Major";
  const majorScore = sessionStorage.getItem("majorScore") || "0";
  return [majorName, majorScore];
}

export function render() {
  const [majorName, majorScore] = renderMajorData();

  // CSS 제거 및 로드
  removeCSS("css/pages/majorsearch.css");
  loadCSS("css/pages/majorresult.css");

  const app = document.getElementById("app");
  if (!app) {
    console.error("앱 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // HTML 렌더링
  app.innerHTML = `
    ${renderHeader()} <!-- 공통 헤더 삽입 -->
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

  // 헤더 버튼 이벤트 설정
  setupHeaderEvents();
}
