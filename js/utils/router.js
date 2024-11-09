export function router() {
  const routes = {
    "": () => import("../pages/home.js").then((module) => module.render()),
    "#login": () =>
      import("../pages/login.js").then((module) => module.render()),
    "#main": () => import("../pages/main.js").then((module) => module.render()),
    "#mypage": () =>
      import("../pages/mypage.js").then((module) => module.render()),
    "#roadmap": () =>
      import("../pages/roadmap.js").then((module) => module.render()),
    "#recommendations": () =>
      import("../pages/recommendations.js").then((module) => module.render()),
  };

  const path = location.hash;
  const route = routes[path];
  if (route) route();
  else console.error(`Route not found: ${path}`);
}
