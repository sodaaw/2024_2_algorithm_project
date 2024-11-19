import { router } from "./utils/router.js";

// 초기화 시 라우터 실행
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

router();