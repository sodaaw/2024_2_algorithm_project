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