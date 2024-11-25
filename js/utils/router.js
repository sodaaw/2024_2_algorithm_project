// routes를 전역으로 정의
const routes = {
  "": () => import("../pages/home.js").then((module) => module.render()),
  "#login": () => import("../pages/login.js").then((module) => module.render()),
  "#main": () => import("../pages/main.js").then((module) => module.render()),
  "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
  "#roadmap": () => import("../pages/roadmap.js").then((module) => module.render()),
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

export function router() {
  const hash = window.location.hash;
  const [path, queryString] = hash.includes("?") ? hash.split("?") : [hash, ""];

  console.log("[Router] Current hash:", hash);
  console.log("[Router] Path:", path);
  console.log("[Router] Query String:", queryString);

  let dynamicSegment;
  if (queryString) {
    const params = new URLSearchParams(queryString);
    dynamicSegment = params.get("major");
    console.log("[Router] Extracted dynamicSegment (major):", dynamicSegment);
  }

  const route = routes[path] || routes[""];
  if (!route) {
    console.error(`[Router] Route not found for path: ${path}`);
    window.location.hash = ""; // 기본 페이지로 리디렉션
    return;
  }

  route()
    .then(() => {
      console.log(`[Router] Successfully loaded route for path: ${path}`);
    })
    .catch((err) => {
      console.error(`[Router] Failed to load module for path: ${path}`, err);
    });
}

export function navigateTo(path) {
  console.log(`[NavigateTo] Attempting to navigate to: ${path}`);
  window.location.hash = path; // 해시 변경
}

window.addEventListener("load", () => {
  console.log("[Router] Initializing...");
  if (!window.location.hash) {
    console.log("[Router] No hash found, navigating to #main");
    navigateTo("#main"); // 기본 경로 설정
  } else {
    router();
  }
});

window.addEventListener("hashchange", router);
