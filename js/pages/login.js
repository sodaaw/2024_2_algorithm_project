export function render() {
  const app = document.getElementById("app"); // index.html의 'app' 요소에 렌더링
  app.innerHTML = `
    <div class="navBar">
      <ul class="container">
        <img class="logo" src="./assets/logo.png" />
        <div class="nav">
          <li>home</li>
          <li>mypage</li>
        </div>
        <div class="btn-group">
          <button class="nav-btn login">로그인</button>
          <button class="nav-btn signup">회원가입</button>
        </div>
      </ul>
    </div>

    <div class="loginBox">
      <div class="text-login">로그인
        <div style="width: 106px; height: 0px; border: 2px black solid; margin: auto; margin-bottom: 71px;"></div>
      </div>
      
      <form>
        <input type="text" class="loginForm" placeholder="ID">
      </form>
      <form>
        <input type="password" class="loginForm" placeholder="Password">
      </form>
      <form class="remember-chk">
        <svg class="chk" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" style="vertical-align:middle;">
          <circle cx="15" cy="15" r="13" fill="white" stroke="#D6D5D5" stroke-width="4"/>
        </svg>
        <span class="remember-text">Remember me</span>
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
        <img class="naver-login" src="./assets/Naver.svg" />
        <img class="kakao-login" src="./assets/Kakao.svg" />
      </div>
    </div>
  `;
}
