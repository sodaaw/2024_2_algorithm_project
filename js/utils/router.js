export function router() {
  const routes = {
    "": () => import("../pages/home.js").then((module) => module.render()),
    "#login": () => import("../pages/login.js").then((module) => module.render()),
    "#main": () => import("../pages/main.js").then((module) => module.render()),
    "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
    "#roadmap": () => import("../pages/roadmap.js").then((module) => module.render()),
    "#recommendations": () => import("../pages/recommendations.js").then((module) => module.render()),
    "#majorsearch": () => import("../pages/majorsearch.js").then((module) => module.render()),
    "#majorresult": () => import("../pages/majorresult.js").then((module) => module.render())
  };

  const hash = window.location.hash; // 현재 해시값
  const path = hash.split("/")[0]; // 기본 경로 설정
  const dynamicSegment = hash.split("/")[1]; // 동적 경로 값 추출

  console.log("Current hash:", hash); // 디버깅용
  console.log("Path:", path); // 디버깅용
  console.log("Dynamic segment:", dynamicSegment); // 디버깅용

  if (path === "#roadmap" && dynamicSegment) {
    // 동적 경로 처리
    import("../pages/roadmap.js").then((module) => module.render(dynamicSegment));
  } else {
    const route = routes[path] || routes[""];
    if (route) {
      route();
    } else {
      console.error(`Route not found: ${path}`);
    }
  }
}

// URL을 변경하면서 페이지 이동을 수행하는 함수
export function navigateTo(path) {
  window.location.hash = path; // 해시 라우팅으로 변경
}

// 페이지 로드 시 및 해시 변경 시 router 호출
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

