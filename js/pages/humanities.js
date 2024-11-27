import { renderHeader, setupHeaderEvents } from "./header.js";
import { humanitiesData } from "./data/humanities_major.js";

// 데이터 렌더링 함수
function renderTree(treeContainer) {
  humanitiesData.forEach((collegeData) => {
    // 대학 이름 추가
    const collegeElement = document.createElement("div");
    collegeElement.className = "college-item";

    const collegeName = document.createElement("div");
    collegeName.className = "college-name";
    collegeName.textContent = collegeData.college;

    // 학과 리스트 추가
    const majorList = document.createElement("div");
    majorList.className = "majors-list";

    collegeData.majors.forEach((major) => {
      const majorElement = document.createElement("div");
      majorElement.className = "major-item";
      majorElement.textContent = major;

      // 학과 클릭 시 majorsearch.js로 전공 이름 전달
      majorElement.addEventListener("click", () => {
        window.location.hash = `#majorsearch?major=${encodeURIComponent(major)}`;
      });

      majorList.appendChild(majorElement);
    });

    collegeElement.appendChild(collegeName);
    collegeElement.appendChild(majorList);
    treeContainer.appendChild(collegeElement);
  });
}

// 메인 렌더링 함수
export function render() {
  const app = document.getElementById("app");

  if (!app) {
    console.error("앱 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // 배경 이미지 설정 제거
  // setBackground("../../images/main/P1290908.jpg"); <-- 주석 처리 또는 삭제

  // `app` 컨테이너에 HTML 구조 추가
  app.innerHTML = `
    ${renderHeader()} <!-- 헤더 렌더링 -->
    <div id="tree-container" class="tree-container"></div>
  `;

  const treeContainer = document.getElementById("tree-container");

  // 데이터 렌더링
  renderTree(treeContainer);

  // 헤더 버튼 이벤트 설정
  setupHeaderEvents();
}

// 해시 변경 시 render 함수 재호출
window.addEventListener("hashchange", render);
