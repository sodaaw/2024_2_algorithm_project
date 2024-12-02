import { navigateTo } from "../utils/router.js";
import { KAKAO_API_KEY } from '../apikey.js';
import relatedMajors from './data/recommendation.js'; // 비슷한 전공 데이터 불러오기

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
    return `
        <span class="text-wrapper-2">적합</span>
    `;
  } else if (result === "0") {
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
  const majorScore = ~~(sessionStorage.getItem("majorScore"));

  return [majorName, majorScore];
}

export function render() {

  const [majorName, majorScore] = renderMajorData();

  // 이전 CSS 제거
  removeCSS("css/pages/majorsearch.css");

  // 새로운 CSS 로드
  loadCSS("css/pages/majorresult.css?ver=1");
  const app = document.getElementById("app");
  app.innerHTML = `
            <header class="mypage-header">
              <div class="header-left">
                <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/> <!-- 앱 로고 추가 -->
              </div>
              <div class="header-right">
                <button id="home-btn" class="home-btn">Home</button>
                <button id="logout-btn" class="logout-btn">Logout</button>
                <button id="mypage-btn" class="mypage-btn">Mypage</button>
              </div>
            </header>
            <div class = "majorResult-page">
            <div class="div-wrapper">
      <div class="div">
        <button id="interestedMajorAdd-btn"><div class="button-md-sec"><div class="btn-text">관심 전공 추가하기</div></div></button>
        <button id="similarMajorSearch-btn"><div class="btn-text-wrapper"><div class="text-wrapper">유사 전공 탐색하기</div></div></button>
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
    </div>
            `;
  // 관심 전공 추가하기 버튼 클릭 이벤트
  const interestedMajorAddBtn = document.getElementById("interestedMajorAdd-btn");
  interestedMajorAddBtn.addEventListener("click", () => {
    const majorName = sessionStorage.getItem("majorName"); // 현재 전공 이름 가져오기

    if (!majorName) {
      alert("추가할 전공이 없습니다."); // 전공 데이터가 없을 경우
      return;
    }

    // 로컬 스토리지에서 관심 전공 리스트 가져오기
    let interestMajors = JSON.parse(localStorage.getItem("interest_majors")) || [];

    if (interestMajors.includes(majorName)) {
      alert(`${majorName}은(는) 이미 관심 전공에 추가되어 있습니다.`); // 이미 추가된 경우
      navigateTo("#mypage"); // MyPage로 이동
      return;
    }

    // 새로운 전공 추가
    interestMajors.push(majorName);
    localStorage.setItem("interest_majors", JSON.stringify(interestMajors)); // 업데이트된 리스트를 저장

    alert(`${majorName}이(가) 관심 전공에 추가되었습니다!`);
    navigateTo("#mypage"); // 관심 전공 추가 후 MyPage로 이동
  });

  // 나머지 이벤트는 원래 코드와 동일
  const similarMajorSearchBtn = document.getElementById("similarMajorSearch-btn");
  similarMajorSearchBtn.addEventListener("click", () => {
    const similarMajors = relatedMajors[majorName] || [];

    if (similarMajors.length === 0) {
      alert(`${majorName}와 관련된 비슷한 전공이 없습니다.`);
      return;
    }

    const cards = similarMajors
      .map(
        (major) => `
          <div class="major-card animate-card">
            <p>${major}</p>
          </div>
        `
      )
      .join("");

    const cardContainer = `
      <div class="card-container">
        <h2>비슷한 전공 추천</h2>
        ${cards}
        <button id="close-similar-majors" class="close-btn">닫기</button>
      </div>
    `;

    const majorResultPage = document.querySelector(".majorResult-page");
    majorResultPage.insertAdjacentHTML("beforeend", cardContainer);

    document.getElementById("close-similar-majors").addEventListener("click", () => {
      document.querySelector(".card-container").remove();
    });

    document.querySelectorAll(".major-card").forEach((element) => {
      element.addEventListener("click", () => {
        const major = element.textContent.trim();
        if (major) {
          window.location.hash = `#majorsearch?major=${encodeURIComponent(major)}`;
        } else {
          alert("선택된 전공의 정보를 찾을 수 없습니다.");
        }
      });
    });
  });

  // 홈, 로고, 로그아웃 버튼 로직 유지
}
