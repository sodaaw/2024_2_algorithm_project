export function render() {
  const app = document.getElementById("app"); // index.html의 'app' 요소에 렌더링
  app.innerHTML = `
    <div class="navBar">
      <ul class="container">
        <img class="logo" src="./assets/logo.png" />
        <div class="nav">
          <li>가계부 작성방</li>
          <li>My 소비내역 보고서</li>
          <li>My 캐릭터방</li>
          <li>아이템 구매방</li>
          <li>금융 뉴스레터</li>
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
        <div class="text-signup">텅장방지기가 처음이신가요?</div>
        <button class="signupBtn">Sign up</button>
      </div>

      <div class="sns-login">
        <img class="naver-login" src="./assets/Naver.svg" />
        <img class="kakao-login" src="./assets/Kakao.svg" />
        <div style="width: 429px; height: 24px; left: 0px; top: 0px; position: absolute">
          <div style="left: 163px; top: 0px; position: absolute; text-align: center; color: #666666; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">SNS 로그인</div>
          <div style="width: 149px; height: 0px; left: 0px; top: 12px; position: absolute; border: 1px black solid"></div>
          <div style="width: 156px; height: 0px; left: 273px; top: 12px; position: absolute; border: 1px black solid"></div>
        </div>
      </div>
    </div>
  `;
}
