export function render() {
    const app = document.getElementById("app");
  
    // localStorage에서 닉네임과 프로필 이미지 가져오기
    const nickname = localStorage.getItem("nickname");
    const profileImage = localStorage.getItem("profile_image");
  
    app.innerHTML = `
      <div class="mypage-container">
        <h1>마이 페이지</h1>
        <div class="profile-info">
          <img src="${profileImage}" alt="프로필 이미지" class="profile-image"/>
          <p>환영합니다, <strong>${nickname}</strong>님!</p>
        </div>
        <button id="logout-btn">로그아웃</button>
      </div>
    `;
  
    // 로그아웃 버튼 클릭 시
    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", () => {
      Kakao.Auth.logout(() => {
        alert("로그아웃 되었습니다.");
        localStorage.removeItem("nickname"); // 닉네임 정보 삭제
        localStorage.removeItem("profile_image"); // 프로필 이미지 삭제
        window.location.hash = "#login"; // 로그인 페이지로 이동
      });
    });
  }
  