// CSSManager.js
let currentPage = ''; // 현재 페이지 상태 추적

export function loadCSS(cssPath, pageName) {
    if (!pageName) {
      console.warn("loadCSS 호출 시 pageName이 누락되었습니다.");
      return;
    }
  
    // 이미 같은 페이지의 CSS라면 다시 로드하지 않음
    if (currentPage === pageName) return;
  
    // 기존 페이지 CSS 제거
    const existingPageCSS = document.querySelector(`link[data-page="${currentPage}"]`);
    if (existingPageCSS) {
      existingPageCSS.remove();
    }
  
    // 새로운 CSS 로드
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssPath;
    link.dataset.page = pageName; // 페이지 식별자 추가
    document.head.appendChild(link);
  
    // 현재 페이지 업데이트
    currentPage = pageName;
  }  

export function removeAllCSS() {
  const stylesheets = document.querySelectorAll('link[data-page]');
  stylesheets.forEach(sheet => sheet.remove());
  currentPage = ''; // 페이지 상태 초기화
}