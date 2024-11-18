import { render as renderLogin } from "../pages/login.js";

// 라우터 함수 정의
export function router() {
  const routes = {
    "": () => import("../pages/home.js").then((module) => module.render()),
    "#login": () => import("../pages/login.js").then((module) => module.render()),
    "#main": () => import("../pages/main.js").then((module) => module.render()),
    "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
    "#roadmap": () => import("../pages/roadmap.js").then((module) => module.render()),
    "#recommendations": () => import("../pages/recommendations.js").then((module) => module.render()),
    "#majorsearch": () => import("../pages/majorsearch.js").then((module) => module.render())
  };

  const path = window.location.hash || ""; // 기본 경로를 빈 문자열로 설정
  const route = routes[path];
  
  if (route) {
    route();
  } else {
    console.error(`Route not found: ${path}`);
  }
}

// URL을 변경하면서 페이지 이동을 수행하는 함수
export function navigateTo(path) {
  window.location.hash = path; // 해시 라우팅으로 변경
}

// 페이지 로드 시 및 해시 변경 시 router 호출
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
