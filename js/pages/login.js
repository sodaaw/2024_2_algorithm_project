import { KAKAO_API_KEY } from '../apikey.js';
import { navigateTo } from "../utils/router.js";

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
      navigateTo("#mypage");
    },
    fail: function(error) {
      console.error('사용자 정보 요청 실패:', error);
    },
  });
}

export function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="loginBox">
      <div class="text-login">로그인</div>
      
      <form class="form">
        <input type="text" class="loginForm" placeholder="ID">
      </form>
      <form class="form">
        <input type="password" class="loginForm" placeholder="Password">
      </form>
      <form class="remember-chk">
        <svg class="chk" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="13" fill="white" stroke="#D6D5D5" stroke-width="4"/>
        </svg>
        <span class="remember-text">로그인 정보 기억하기</span>
      </form>
      <button class="loginBtn">로그인</button>
      <div class="findInfo">
        <div class="findId">아이디 찾기</div>
        <div class="findPw">비밀번호 찾기</div>
      </div>
   
      <div class="signupBox">
        <div class="text-signup">처음 오셨나요?</div>
        <button class="signupBtn">Sign up</button>
      </div>

      <div class="sns-login">
        <img class="kakao-login" src="images/login/kakao_login.png" alt="카카오 로그인 버튼" />
      </div>
    </div>
  `;

  // 카카오 로그인 버튼 클릭 이벤트
  const kakaoLoginButton = document.querySelector(".kakao-login");
  if (kakaoLoginButton) {
    kakaoLoginButton.addEventListener("click", loginWithKakao);
  }
}
