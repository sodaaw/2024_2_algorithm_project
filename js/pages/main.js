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
    <div class="main-container">
      <h1>알아보고 싶은 학과는 어디에 있나요?</h1>
      <div class="buttons">
        <button id="humanities-btn" class="btn">인문사회과학캠퍼스</button>
        <button id="sciences-btn" class="btn">자연과학캠퍼스</button>
      </div>
    </div>
  `;

  // 버튼 클릭 이벤트 추가
  document.getElementById("humanities-btn").addEventListener("click", () => {
    window.location.hash = "#humanities";
  });

  document.getElementById("sciences-btn").addEventListener("click", () => {
    window.location.hash = "#sciences";
  });
}
