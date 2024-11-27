import { renderHeader, setupHeaderEvents } from "./header.js";
import { humanitiesData } from "./data/humanities_major.js";

// 배경 이미지 설정 함수
function setBackground(imagePath) {
  const app = document.getElementById("app");
  if (app) {
    app.style.backgroundImage = `url('../../images/main/P1290908.jpg')`;
    app.style.backgroundSize = "cover";
    app.style.backgroundPosition = "center";
    app.style.backgroundRepeat = "no-repeat";
  }
}

// 배경 이미지 제거 함수
function removeBackground() {
  const app = document.getElementById("app");
  if (app) {
    app.style.backgroundImage = ""; // 배경 이미지 제거
  }
}

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

  // 특정 화면에 배경 이미지 적용
  setBackground("../../images/main/P1290908.jpg");

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
