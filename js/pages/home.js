import "../../css/pages/home.css";

export function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Home Page</h1>
    <p>Welcome to the Home Page!</p>
  `;
}
