// routes 객체 정의
const routes = {
  "": () => import("../pages/home.js").then((module) => module.render()), // 기본 페이지
  "#login": () => import("../pages/login.js").then((module) => module.render()),
  "#main": () => import("../pages/main.js").then((module) => module.render()),
  "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
  "#roadmap": (field) => {
    // 동적 필드 처리
    return import("../pages/roadmap.js").then((module) => {
      if (module.render) {
        module.render(field); // render에 동적 데이터 전달
      } else {
        console.error("[Router] render method not found in roadmap module");
      }
    });
  },
  "#recommendations": () =>
    import("../pages/recommendations.js").then((module) => module.render()),
  "#majorresult": () =>
    import("../pages/majorresult.js").then((module) => module.render()),
  "#humanities": () =>
    import("../pages/humanities.js").then((module) => module.render()),
  "#sciences": () =>
    import("../pages/sciences.js").then((module) => module.render()),
  "#majorsearch": () =>
    import("../pages/majorsearch.js").then((module) => {
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      let major = params.get("major");
      major = decodeURIComponent(major || ""); // URL 디코딩
      console.log("[Router] Decoded Major:", major);

      if (module.render) {
        module.render(major);
      } else {
        console.error("[Router] render method not found in majorsearch module");
      }
    }),
};

// 라우터 함수 정의
export function router() {
  const hash = window.location.hash;
  let [path, queryString] = hash.includes("?") ? hash.split("?") : [hash, ""];

  console.log("[Router] Current hash:", hash);
  console.log("[Router] Path:", path);
  console.log("[Router] Query String:", queryString);

  // 동적 경로 처리
  let dynamicSegment = null;
  if (path.startsWith("#roadmap/")) {
    dynamicSegment = path.replace("#roadmap/", ""); // 동적 세그먼트 추출
    path = "#roadmap"; // 기본 경로로 매핑
    console.log("[Router] Dynamic segment extracted:", dynamicSegment);
  }

  const route = routes[path];
  if (!route) {
    console.error(`[Router] Route not found for path: ${path}`);
    navigateTo(""); // 기본 페이지로 리디렉션
    return;
  }

  route(dynamicSegment) // 동적 데이터를 route에 전달
    .then(() => {
      console.log(`[Router] Successfully loaded route for path: ${path}`);
    })
    .catch((err) => {
      console.error(`[Router] Failed to load module for path: ${path}`, err);
    });
}

// 페이지 이동 함수
export function navigateTo(path) {
  console.log(`[NavigateTo] Attempting to navigate to: ${path}`);
  window.location.hash = path; // 해시 변경
}

// 초기화 로직
window.addEventListener("load", () => {
  console.log("[Router] Initializing...");
  if (!window.location.hash) {
    console.log("[Router] No hash found, navigating to ''");
    navigateTo(""); // 기본 페이지 설정 (home.js)
  } else {
    router();
  }
});

window.addEventListener("hashchange", router);
