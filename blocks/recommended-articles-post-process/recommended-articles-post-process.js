// Post-process the result of the recommended-articles
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs, recreatePicture, createOptimizedPicture, getDefaultImageNumber, SITE } from '../../scripts/devblog/devblog.js';
import { wrapWithPlayOverlay } from '../../scripts/utils.js';

setLibs(SITE.prodLibsPath);
const miloBlock = await import(`${getLibs()}/blocks/recommended-articles/recommended-articles.js`);

let heroVideoIndex = null;
async function getHeroVideoIndex() {
  if (heroVideoIndex) return heroVideoIndex;
  try {
    const res = await fetch('/sorted-index/sorted-query-index.json');
    if (!res.ok) return (heroVideoIndex = {});
    const json = await res.json();
    heroVideoIndex = Object.fromEntries((json.data || []).map((e) => [e.path, e.isHeroVideo === true]));
  } catch {
    heroVideoIndex = {};
  }
  return heroVideoIndex;
}

async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}

async function fetchOGImage(articlePath) {
  try {
    const pathname = articlePath.startsWith('http') ? new URL(articlePath).pathname : articlePath;
    const res = await fetch(pathname);
    if (!res.ok) return null;
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;
  } catch (e) {
    console.warn('fetchOGImage failed:', e);
    return null;
  }
}

function buildMediaElement(ogImage, alt = '', eager = false, hasHeroVideo = false) {
  if (!ogImage) return null;

  const ytMatch = ogImage.match(/\/vi\/([^/?]+)/);
  if (ytMatch?.[1]) {
    const videoId = ytMatch[1];
    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    img.alt = alt;
    img.loading = eager ? 'eager' : 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:initial;';
    img.onerror = () => { if (!img.src.includes('hqdefault')) img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`; };
    return hasHeroVideo ? wrapWithPlayOverlay(img) : img;
  }

  const picture = createOptimizedPicture(ogImage, alt, eager, SITE.articleCard.breakpoints);
  return hasHeroVideo ? wrapWithPlayOverlay(picture) : picture;
}

export default async function init(blockEl) {
  await miloBlock.default(blockEl);

  const videoIndex = await getHeroVideoIndex();

  for (const article of blockEl.querySelectorAll('a.article-card')) {
    const imageContainer = article.querySelector('div.article-card-image');
    if (!imageContainer || !article.href) continue;

    const alt = article.querySelector('h3')?.textContent || '';
    const articlePath = new URL(article.href).pathname.split('.')[0];
    const hasHeroVideo = videoIndex[articlePath] === true;
    const ogImage = await fetchOGImage(article.href);
    const mediaEl = buildMediaElement(ogImage, alt, false, hasHeroVideo);

    imageContainer.replaceChildren(...(mediaEl ? [mediaEl] : []));

    if (imageContainer.childElementCount === 0) {
      const n = getDefaultImageNumber(article.href);
      imageContainer.append(createOptimizedPicture(`${SITE.defaultImages.prefix}${n}.png`, alt, false, SITE.articleCard.breakpoints));
    }

    imageContainer.querySelectorAll('picture').forEach((pic) => {
      pic.replaceWith(recreatePicture(pic, SITE.articleCard.breakpoints));
    });
  }

  blockEl.classList.add('recommended-articles');
  await loadCSS(`${getLibs()}/blocks/recommended-articles/recommended-articles.css`);
}