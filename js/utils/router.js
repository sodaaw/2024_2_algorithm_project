import { render as renderLogin } from "../pages/login.js";

export function router() {
  const routes = {
    "/": () => import("../pages/home.js").then((module) => module.render()),
    "/login": () => import("../pages/login.js").then((module) => module.render()),
    "/main": () => import("../pages/main.js").then((module) => module.render()),
    "/mypage": () => import("../pages/mypage.js").then((module) => module.render()),
    "/roadmap": () => import("../pages/roadmap.js").then((module) => module.render()),
    "/recommendations": () => import("../pages/recommendations.js").then((module) => module.render()),
  };

  const path = window.location.pathname;
  const route = routes[path];
  
  if (route) {
    route();
  } else {
    console.error(`Route not found: ${path}`);
  }
}

// URL을 변경하면서 페이지 이동을 수행하는 함수
export function navigateTo(path) {
  window.history.pushState({}, "", path); // URL을 변경
  router(); // 해당 경로에 맞는 페이지 렌더링
}

// 페이지 로드 시 및 뒤로 가기, 앞으로 가기 시 router 호출
window.addEventListener("load", router);
window.addEventListener("popstate", router);