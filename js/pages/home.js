import "../../css/pages/home.css";

export function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Home Page</h1>
    <p>Welcome to the Home Page!</p>
  `;
}


```
navigateTo 함수를 사용하여 URL을 변경하고 router를 호출할 수 있습니다. 
예를 들어, 로그인 버튼을 클릭했을 때 /login 경로로 이동하려면 다음과 같이 사용할 수 있습니다.
document.querySelector(".nav-btn.login").addEventListener("click", () => {
  navigateTo("/login");
});
```
