import { ensureCSSLoadedWithCallback, ensureCSSLoaded } from "../utils/CSSManager.js";

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

  // 로딩 CSS 로드
  ensureCSSLoaded("css/pages/loading.css");

  // 로딩 스피너 추가
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="loading-spinner" class="loading-spinner">
      <p>Loading...</p>
    </div>
  `;

  // CSS 로드 및 페이지 전환
  const currentCSS = cssMap[path];
  if (currentCSS) {
    ensureCSSLoadedWithCallback(currentCSS, () => {
      route(dynamicSegment) // 동적 데이터 전달
        .then(() => {
          console.log(`[Router] Successfully loaded route for path: ${path}`);
        })
        .catch((err) => {
          console.error(`[Router] Failed to load module for path: ${path}`, err);
        })
        .finally(() => {
          document.getElementById("loading-spinner")?.remove(); // 로딩 스피너 제거
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
      })
      .finally(() => {
        document.getElementById("loading-spinner")?.remove(); // 로딩 스피너 제거
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