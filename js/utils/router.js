import { ensureCSSLoadedWithCallback, applyStylesImmediately } from "../utils/CSSManager.js"; // CSSManager.js에서 함수 임포트

// 페이지별 CSS 매핑
const cssMap = {
  "": "css/pages/home.css",
  "#login": "css/pages/login.css",
  "#main": "css/pages/main.css",
  "#mypage": "css/pages/mypage.css",
  "#roadmap": "css/pages/roadmap.css",
  "#recommendations": "css/pages/recommendations.css",
  "#majorresult": "css/pages/majorresult.css",
  "#humanities": "css/pages/humanities.css",
  "#sciences": "css/pages/sciences.css",
  "#majorsearch": "css/pages/majorsearch.css",
};

// routes 객체 정의
const routes = {
  "": () => import("../pages/home.js").then((module) => module.render()), // 기본 페이지
  "#login": () => import("../pages/login.js").then((module) => module.render()),
  "#main": () => import("../pages/main.js").then((module) => module.render()),
  "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
  "#roadmap": (field) => {
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
    dynamicSegment = decodeURIComponent(path.replace("#roadmap/", "")); // 동적 세그먼트 추출
    path = "#roadmap"; // 기본 경로로 매핑
    console.log("[Router] Dynamic segment extracted:", dynamicSegment);
  }

  const route = routes[path];
  if (!route) {
    console.error(`[Router] Route not found for path: ${path}`);
    navigateTo(""); // 기본 페이지로 리디렉션
    return;
  }

  // CSS 로드 및 제거 로직
  const currentCSS = cssMap[path];
  if (currentCSS) {
    ensureCSSLoadedWithCallback(currentCSS, () => {
      route(dynamicSegment) // 동적 데이터 전달
        .then(() => {
          applyStylesImmediately(); // 강제 Reflow 및 Repaint
          console.log(`[Router] Successfully loaded route for path: ${path}`);
        })
        .catch((err) => {
          console.error(`[Router] Failed to load module for path: ${path}`, err);
        });
    });
  } else {
    // CSS가 정의되지 않았을 경우, 단순히 모듈 로드
    route(dynamicSegment)
      .then(() => {
        console.log(`[Router] Successfully loaded route for path: ${path}`);
      })
      .catch((err) => {
        console.error(`[Router] Failed to load module for path: ${path}`, err);
      });
  }
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


