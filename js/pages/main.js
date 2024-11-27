import { renderHeader, setupHeaderEvents } from "./header.js";

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
    ${renderHeader()} <!-- 공통 헤더 삽입 -->
    <div class="main-container">
      <h1>알아보고 싶은 학과는 어디에 있나요?</h1>
      <div class="buttons">
        <button id="humanities-btn" class="btn humanities-btn">인문사회과학캠퍼스</button>
        <button id="sciences-btn" class="btn sciences-btn">자연과학캠퍼스</button>
      </div>
    </div>
    <div class="footer-background"></div>
  `;

  // 버튼 이벤트 리스너 설정
  const setupButton = (id, hash) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", () => {
        console.log(`Navigating to ${hash}`);
        window.location.hash = hash;
      });
    }
  };

  // Humanities 및 Sciences 버튼 이벤트
  setupButton("humanities-btn", "#humanities");
  setupButton("sciences-btn", "#sciences");

  // 헤더 버튼 이벤트 설정
  setupHeaderEvents();
}

// DOMContentLoaded 이후 render 함수 실행
document.addEventListener("DOMContentLoaded", () => {
  render();
});
