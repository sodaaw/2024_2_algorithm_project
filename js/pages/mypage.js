// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// CSS 파일 로드
loadCSS("css/pages/mypage.css");
// 전공 url 영어로 하기 위한 json 파일 로드

export function render() {
  const app = document.getElementById("app");

  // localStorage에서 닉네임과 프로필 이미지, 관심 전공 목록 가져오기
  const nickname = localStorage.getItem("nickname") || "사용자";
  const profileImage = localStorage.getItem("profile_image") || "images/default_profile.png"; // 기본 이미지 경로
  //const interestMajors = JSON.parse(localStorage.getItem("interest_majors")) || []; // 관심 전공 배열

  // 테스트용 임시 관심 전공 데이터
  const interestMajors = [
    "디자인학과",
    "소프트웨어학과",
    "경영학과",
    "경제학과",
    "스포츠과학과",
    "심리학과",
  ];

  // 관심 전공이 없는 경우 메시지 설정
  const majorContent =
      interestMajors.length > 0
          ? interestMajors
                .map(
                    (major) => `
                    <div class="major-card">
                        <div class="card-text">
                          <p>${major}</p>
                          <span>➡️</span>
                        </div>
                    </div>`
                )
                .join("")
          : `<p class="no-majors">등록한 관심 전공이 없습니다.</p>`;

          app.innerHTML = `
            <header class="mypage-header">
              <div class="header-left">
                <id="logo-button" img src="images/logo.png" alt="앱 로고" class="app-logo"/> <!-- 앱 로고 추가 -->
              </div>
              <div class="header-right">
                <button id="home-btn" class="home-btn">Home</button>
                <button id="logout-btn" class="logout-btn">Logout</button>
              </div>
            </header>
            <div class="mypage-container">
              <div class="profile-section">
                <img src="${profileImage}" alt="프로필 이미지" class="profile-page-image"/> <!-- 프로필 사진 -->
                <h1>${nickname} 님의 관심 전공 모아보기</h1>
              </div>
              <p>전공을 클릭하면 로드맵 조회, 비슷한 학과 조회가 가능합니다.</p>
              <div class="majors-container">
                ${majorContent}
              </div>
            </div>
        `;
  // 카드 클릭 이벤트 추가
  const majorCards = document.querySelectorAll(".major-card");
  majorCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      const selectedMajor = interestMajors[index];
      window.location.hash = `#roadmap/${selectedMajor}`; // 전공 이름을 경로로 전달
    });
  });

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

  // 로그아웃 버튼 클릭 시
  const logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("click", () => {
      Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname"); // 닉네임 정보 삭제
          localStorage.removeItem("profile_image"); // 프로필 이미지 삭제
          localStorage.removeItem("interest_majors"); // 관심 전공 삭제
          window.location.hash = ""; // 시작페이지로 이동
      });
  });
}