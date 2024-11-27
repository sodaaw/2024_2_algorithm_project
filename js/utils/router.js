export function router() {
  const routes = {
    "": () => import("../pages/home.js").then((module) => module.render()),
    "#login": () => import("../pages/login.js").then((module) => module.render()),
    "#main": () => import("../pages/main.js").then((module) => module.render()),
    "#mypage": () => import("../pages/mypage.js").then((module) => module.render()),
    "#roadmap": () => import("../pages/roadmap.js").then((module) => module.render()),
    "#recommendations": () =>
      import("../pages/recommendations.js").then((module) => module.render()),
    "#majorsearch": (major) =>
      import("../pages/majorsearch.js").then((module) => {
        if (module.render) {
          module.render(major); // 동적 데이터 전달
        } else {
          console.error("[Router] render method not found in majorsearch module");
        }
      }),
    "#majorresult": () =>
      import("../pages/majorresult.js").then((module) => module.render()),
  };

  const hash = window.location.hash; // 현재 해시값
  let [path, dynamicSegment] = hash.includes("/") ? hash.split("/") : [hash, null]; // 기본 경로와 동적 경로 분리

  console.log("Current hash:", hash); // 디버깅용
  console.log("Path:", path); // 디버깅용
  console.log("Dynamic segment:", dynamicSegment); // 디버깅용

  if (path === "#roadmap" && dynamicSegment) {
    // #roadmap 동적 경로 처리
    import("../pages/roadmap.js").then((module) => module.render(dynamicSegment));
  } else if (path === "#majorsearch" && dynamicSegment) {
    // #majorsearch 동적 경로 처리
    import("../pages/majorsearch.js").then((module) => {
      const decodedMajor = decodeURIComponent(dynamicSegment); // URL 디코딩
      if (module.render) {
        module.render(decodedMajor); // 동적으로 전달받은 major 데이터를 렌더링
      } else {
        console.error("[Router] render method not found in majorsearch module");
      }
    });
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
  console.log(`[NavigateTo] Navigating to: ${path}`);
  window.location.hash = path; // 해시 라우팅으로 변경
}

// 페이지 로드 시 및 해시 변경 시 router 호출
window.addEventListener("load", router);
window.addEventListener("hashchange", router);