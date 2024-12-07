import { KAKAO_API_KEY } from '../apikey.js';
import { navigateTo } from "../utils/router.js";
import { ensureCSSLoaded } from "../utils/CSSManager.js"; // CSSManager에서 함수 임포트

function initializeKakao() {
  Kakao.init(KAKAO_API_KEY);
  console.log(Kakao.isInitialized()); // 초기화 확인
}

initializeKakao();

export function loginWithKakao() {
  Kakao.Auth.login({
    scope: 'profile_nickname, profile_image', // 프로필 닉네임과 이미지 권한 요청
    success: function(authObj) {
      console.log('카카오 로그인 성공:', authObj);
      Kakao.Auth.setAccessToken(authObj.access_token); // 액세스 토큰 저장
      getUserInfo(); // 사용자 정보 요청
    },
    fail: function(err) {
      console.error('카카오 로그인 실패:', err);
    },
  });
}

function getUserInfo() {
  Kakao.API.request({
    url: '/v2/user/me',
    success: function(res) {
      console.log('사용자 정보:', res);
      
      // 프로필 닉네임과 이미지 정보 저장
      const profileNickname = res.kakao_account.profile.nickname;
      const profileImage = res.kakao_account.profile.profile_image_url;
      
      // 정보를 localStorage에 저장
      localStorage.setItem('nickname', profileNickname);
      localStorage.setItem('profile_image', profileImage);
      
      // 로그인 성공 후 mypage로 이동
      ensureCSSLoaded("css/pages/mypage.css"); // Mypage CSS 보장
      navigateTo("#mypage");
    },
    fail: function(error) {
      console.error('사용자 정보 요청 실패:', error);
    },
  });
}

export function render() {
  const app = document.getElementById("app");
  ensureCSSLoaded("css/pages/login.css"); // Login 페이지 CSS 로드 보장

  app.innerHTML = `
    <div class="loginBox">
      <div class="text-login">로그인/회원가입</div>
      <p class="welcome-text">환영합니다! 👋</p>
      <p class="instruction-text">
        아이디와 비밀번호 입력하기 귀찮으시죠?<br>
        1초 회원가입으로 입력없이 간편하게 로그인 하세요.
      </p>
      <button class="kakao-login">
        <img src="images/login/kakao_icon.png" alt="카카오 아이콘" class="kakao-icon">
        카카오 1초 로그인/회원가입
      </button>
      <button id="guest-login" class="guest-login">비회원으로 시작하기</button>
    </div>
  `;

  // 카카오 로그인 버튼 클릭 이벤트
  const kakaoLoginButton = document.querySelector(".kakao-login");
  if (kakaoLoginButton) {
    kakaoLoginButton.addEventListener("click", loginWithKakao);
  }

  // 비회원 로그인 버튼 클릭 이벤트
  const guestLoginButton = document.getElementById("guest-login");
  if (guestLoginButton) {
    guestLoginButton.addEventListener("click", () => {
      console.log("비회원 로그인 버튼 클릭됨"); // 디버깅용 로그
      ensureCSSLoaded("css/pages/main.css"); // Main 페이지 CSS 보장
      navigateTo("#main");
    });
  } else {
    console.error("비회원 로그인 버튼을 찾을 수 없습니다."); // 버튼이 제대로 렌더링되었는지 확인
  }
}

// DOMContentLoaded 이벤트에서 render 함수 실행
document.addEventListener("DOMContentLoaded", () => {
  render();
});