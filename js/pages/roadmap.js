import departments from './data/link_data.js'; // 학과 데이터 불러오기
import roadmapImages from './data/roadmap_img.js'; // 로드맵 이미지 불러오기
import relatedMajors from './data/recommendation.js'; // 비슷한 전공 데이터 불러오기
import { KAKAO_API_KEY } from '../apikey.js';

// Kakao SDK 초기화
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
  Kakao.init(KAKAO_API_KEY);
  console.log('Kakao SDK Initialized:', Kakao.isInitialized());
}

// CSS 관리 함수
const CSSManager = {
  load: (href) => {
    if (!document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  },
  remove: (href) => {
    const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
    links.forEach((link) => link.remove());
  }
};

export function render(selectedMajorEng) {
  // CSS 업데이트
  CSSManager.remove("css/pages/mypage.css");
  CSSManager.load("css/pages/roadmap.css");

  const app = document.getElementById("app");

  // 영어 이름으로 한글 이름 찾기
  const selectedMajor = Object.keys(departments).find(
    (key) => departments[key]?.eng_name === selectedMajorEng
  );

  // 영어 이름으로 학과 URL 및 로드맵 이미지 찾기
  const deptUrl = selectedMajor ? departments[selectedMajor]?.url : null;
  const roadmapImg = selectedMajor ? roadmapImages[selectedMajor] : null;

  // 학과를 찾지 못한 경우 처리
  if (!selectedMajor) {
    app.innerHTML = `<p>존재하지 않는 학과입니다. 올바른 URL을 입력해주세요.</p>`;
    return;
  }

  // 로드맵 이미지가 없는 경우 처리
  if (!roadmapImg) {
    app.innerHTML = `<p>해당 전공의 로드맵 이미지를 찾을 수 없습니다. 관리자에게 문의하세요.</p>`;
    return;
  }

  // 로드맵 이미지 리스트 처리 (단일 이미지도 리스트로 변환)
  const roadmapImagesArray = Array.isArray(roadmapImg) ? roadmapImg : [roadmapImg];
  let currentImageIndex = 0;

  // 로드맵 페이지 내용 렌더링
  app.innerHTML = `
    <header class="roadmap-header">
      <div class="header-left">
        <img id="logo-button" src="./images/logo.png" alt="앱 로고" class="app-logo"/>
      </div>
      <div class="header-right">
        <button id="home-btn" class="home-btn">Home</button>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    </header>
    <div class="roadmap-page">
      <h1>${selectedMajor} 더 알아보기</h1>
      <div class="roadmap-buttons">
        <button id="similar-dept-btn" class="roadmap-btn">비슷한 전공 보기</button>
        <button id="roadmap-img-btn" class="roadmap-btn">로드맵 이미지 보기</button>
        <button id="dept-link-btn" class="roadmap-btn">학과 홈페이지로 이동</button>
      </div>
      <div class="back-button-container">
        <button id="back-btn" class="roadmap-btn back-btn">돌아가기</button>
      </div>
    </div>
    <div id="overlay" class="overlay hidden">
      <div class="popup">
        <button id="close-popup" class="close-popup-btn">×</button>
        <button id="prev-img" class="arrow-btn left hidden">
          <img src="./images/roadmap/arrow_button.png" alt="Previous" class="arrow-img" />
        </button>
        <img id="popup-image" src="${roadmapImagesArray[0]}" alt="${selectedMajor} 로드맵" class="popup-image" />
        <button id="next-img" class="arrow-btn right hidden">
          <img src="./images/roadmap/arrow_button.png" alt="Next" class="arrow-img" />
        </button>
      </div>
    </div>
  `;

  // 비슷한 전공 보기 버튼 이벤트
  document.getElementById("similar-dept-btn").addEventListener("click", () => {
    const similarMajors = relatedMajors[selectedMajor] || [];

    if (similarMajors.length === 0) {
      alert(`${selectedMajor}와 관련된 비슷한 전공이 없습니다.`);
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

    const roadmapPage = document.querySelector(".roadmap-page");
    roadmapPage.insertAdjacentHTML("beforeend", cardContainer);

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

  // 로드맵 이미지 보기 버튼 이벤트
  document.getElementById("roadmap-img-btn").addEventListener("click", () => {
    const overlay = document.getElementById("overlay");
    const popupImage = document.getElementById("popup-image");
    const prevBtn = document.getElementById("prev-img");
    const nextBtn = document.getElementById("next-img");

    overlay.classList.remove("hidden");

    if (roadmapImagesArray.length > 1) {
      nextBtn.classList.remove("hidden");
    }

    prevBtn.addEventListener("click", () => {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        popupImage.src = roadmapImagesArray[currentImageIndex];
        if (currentImageIndex === 0) {
          prevBtn.classList.add("hidden");
        }
        nextBtn.classList.remove("hidden");
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentImageIndex < roadmapImagesArray.length - 1) {
        currentImageIndex++;
        popupImage.src = roadmapImagesArray[currentImageIndex];
        if (currentImageIndex === roadmapImagesArray.length - 1) {
          nextBtn.classList.add("hidden");
        }
        prevBtn.classList.remove("hidden");
      }
    });
  });

  document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("overlay").classList.add("hidden");
    currentImageIndex = 0;
  });

  document.getElementById("dept-link-btn").addEventListener("click", () => {
    if (deptUrl) {
      window.open(deptUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("해당 전공의 학과 홈페이지 URL을 찾을 수 없습니다.");
    }
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.hash = "#mypage";
  });

  document.getElementById("logo-button").addEventListener("click", () => {
    window.location.hash = "#main";
  });

  document.getElementById("home-btn").addEventListener("click", () => {
    window.location.hash = "#main";
  });

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.clear();
          window.location.hash = "";
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  }
}