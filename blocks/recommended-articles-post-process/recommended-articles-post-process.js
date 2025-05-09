// Post-process the result of the recommended-articles
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs } from '../../scripts/devblog/devblog.js';
import { recreatePicture, createOptimizedPicture, getDefaultImageNumber, SITE } from '../../scripts/devblog/devblog.js';
setLibs(SITE.prodLibsPath);
const miloBlock = await import(`${getLibs()}/blocks/recommended-articles/recommended-articles.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

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

export default async function init(blockEl) {
  await miloBlock.default(blockEl);
  const eager = false;

  blockEl.querySelectorAll('a.article-card').forEach(article => {
    // Fix missing default images
    const div = article.querySelector('div[class=article-card-image]');
    if(div && div.childElementCount == 0) {
      const n = getDefaultImageNumber(article?.href);
      const alt = article?.querySelector('h3').textContent;
      div.append(createOptimizedPicture(`${SITE.defaultImages.prefix}${n}.png`,alt,eager,SITE.articleCard.breakpoints));
    }

    // And replace pictures with smaller ones
    article.querySelectorAll('picture').forEach(pic => {
      pic.replaceWith(recreatePicture(pic, SITE.articleCard.breakpoints));
    })
  })
  blockEl.classList.add("recommended-articles");
  await loadCSS(`${getLibs()}/blocks/recommended-articles/recommended-articles.css`);
}