import { navigateTo } from "../utils/router.js";

// CSS 파일을 동적으로 로드하는 함수
function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
// CSS 파일 로드
loadCSS("css/pages/majorsearch.css");
var majorWeightYSum = 0; // 사용자가 "예"를 눌렀을 때 weight를 더하는 변수
var majorWeightTotalSum = 0; // 사용자가 "예" 또는 "아니오"를 눌렀을 때 weight를 더하는 변수 (전공의 전체 스코어가 반환됨)

export async function render(decodedMajor) {
  const majors = await loadMajors(); // JSON 파일에서 전공 데이터 불러오기
  const selectedMajor = majors.find((major) => major.major === decodedMajor);

  if (!selectedMajor) {
    console.error(`Major "${decodedMajor}" not found in data.`);
    return;
  }

  sessionStorage.setItem("majorName", selectedMajor.major);
  renderQuestions(selectedMajor, 0); // 첫 번째 질문부터 시작
}


// JSON 파일에서 전공과 질문 데이터를 불러오기 위한 함수
async function loadMajors() {
  try {
    const response = await fetch("/questions.json"); // 경로 확인
    const data = await response.json();
    return data.majors;
  } catch (error) {
    console.error("전공 데이터를 불러오는 데 실패했습니다:", error);
    return [];
  }
}


function calcResult(majorWeightYSum, majorWeightTotalSum) { // 해당 전공이 적합한지 아닌지 계산하는 함수 (전체 가중치의 70% 이상일 시 적합)
  sessionStorage.setItem("majorScore", 100 * majorWeightYSum / majorWeightTotalSum);
  if (100 * majorWeightYSum / majorWeightTotalSum >= 70) return 1;
  else return 0;
}

// 전공 선택 후 질문을 렌더링하는 함수
function renderQuestions(major, questionIndex) {
  const app = document.getElementById("app");
  const questionData = major.questions[questionIndex];

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
            <button class="option-button overlap" data-option="N">
              <div class="rectangle"></div>
              <div class="sub-headline-sec">아니오</div>
            </button>
            <button class="option-button overlap-group" data-option="Y">
              <div class="rectangle"></div>
              <div class="h-sub-headline-sec">예</div>
            </button>
            <div class="overlap-2">
              <p class="text-wrapper">${questionData.question}</p>
            </div>
            <div class="overlap-3">
              <div class="text-wrapper">${questionIndex + 1}/10</div>
            </div>
            <div class="overlap-4">
              <div class="sub-headline-sec-2">${major.major}</div>
            </div>
        </div>
`;

  // 버튼 클릭 이벤트 리스너 추가
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const selectedOption = event.currentTarget.dataset.option;
      console.log(selectedOption);
      if (selectedOption == "Y") { // 예를 눌렀을 경우
        majorWeightYSum += questionData.weight;
        majorWeightTotalSum += questionData.weight;
      } else { // 아니오를 눌렀을 경우
        majorWeightTotalSum += questionData.weight;
      }
      console.log("Total: " + majorWeightTotalSum);
      console.log("Yes: " + majorWeightYSum);

      // 다음 질문으로 이동
      if (questionIndex + 1 < 10) {
        renderQuestions(major, questionIndex + 1);
      } else {
        if (calcResult(majorWeightYSum, majorWeightTotalSum) == 1) {
          console.log("Yeessss"); // majorresult 페이지에서 적합 띄우기
          sessionStorage.setItem("majorResult", "1");
          navigateTo("#majorresult");
        } else {
          console.log("Nooooo"); // majorresult 페이지에서 부적합 띄우기
        }
        navigateTo("#majorresult")
        sessionStorage.setItem("majorResult", "1");
        console.log("navigate to majorresult.js"); // 10개를 다 끝내면 결과 페이지로 이동하는 함수 실행
      }
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

  // 로그아웃 버튼 클릭 이벤트
  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      // 카카오 로그아웃 호출
      if (Kakao.Auth) {
        Kakao.Auth.logout(() => {
          alert("로그아웃 되었습니다.");
          localStorage.removeItem("nickname"); // 닉네임 삭제
          localStorage.removeItem("profile_image"); // 프로필 이미지 삭제
          localStorage.removeItem("interest_majors"); // 관심 전공 삭제
          window.location.hash = ""; // 로그인 페이지로 이동
        });
      } else {
        alert("Kakao 로그아웃 기능을 사용할 수 없습니다.");
      }
    });
  } else {
    console.error("로그아웃 버튼을 찾을 수 없습니다.");
  }
}