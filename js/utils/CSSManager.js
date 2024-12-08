// 제발이번엔성공하게해줘

// 이미 로드된 CSS 파일을 추적하기 위한 Set
const loadedCSSFiles = new Set();

// CSS 파일 로드 함수 (이미 로드된 경우 로드하지 않음)
export function loadCSS(href) {
  if (loadedCSSFiles.has(href)) {
    console.log(`CSS already loaded: ${href}`);
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  link.onload = () => {
    loadedCSSFiles.add(href);
    console.log(`CSS loaded: ${href}`);
  };

  document.head.appendChild(link);
}

// CSS 파일을 제거하는 함수
export function removeCSS(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"]`);
  links.forEach((link) => {
    if (link.href.includes(href)) {
      link.remove();
      loadedCSSFiles.delete(href);
      console.log(`CSS removed: ${href}`);
    }
  });
}

// 특정 CSS를 재확인하여 로드 보장
export function ensureCSSLoaded(href) {
  if (!loadedCSSFiles.has(href)) {
    loadCSS(href);
  }
}

export function removeUnusedCSS(validCSSFiles) {
  const currentCSSFiles = Array.from(loadedCSSFiles);
  currentCSSFiles.forEach((href) => {
    if (!validCSSFiles.includes(href)) {
      removeCSS(href);
    }
  });
}

// 페이지 전환 시 필요 없는 CSS를 제거하고 필요한 CSS만 유지
export function updatePageCSS(currentCSS, allCSS) {
  // 1. 현재 페이지 CSS 로드
  ensureCSSLoaded(currentCSS);

  // 2. 불필요한 CSS 제거
  const otherCSS = allCSS.filter((css) => css !== currentCSS);
  removeUnusedCSS(otherCSS);

  console.log(`Updated CSS: Loaded ${currentCSS}, Removed others.`);
}

export function ensureCSSLoadedWithReflow(href) {
  if (!loadedCSSFiles.has(href)) {
    loadCSS(href);
  }
  // 강제 Reflow를 트리거
  document.body.offsetHeight; // Reflow 트리거용
  console.log(`Reflow triggered for ${href}`);
}

export function applyStylesImmediately() {
  // 강제로 Reflow와 Repaint를 트리거
  document.body.style.display = "none";
  document.body.offsetHeight; // Reflow 트리거
  document.body.style.display = ""; // 다시 표시
  console.log("Forced reflow and repaint triggered.");
}

export function ensureCSSLoadedWithCallback(href, callback) {
  if (loadedCSSFiles.has(href)) {
    console.log(`CSS already loaded: ${href}`);
    callback();
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  link.onload = () => {
    loadedCSSFiles.add(href);
    console.log(`CSS loaded: ${href}`);
    callback();
  };

  link.onerror = () => {
    console.error(`Failed to load CSS: ${href}`);
    callback(); // 오류가 발생해도 계속 진행
  };

  document.head.appendChild(link);
}