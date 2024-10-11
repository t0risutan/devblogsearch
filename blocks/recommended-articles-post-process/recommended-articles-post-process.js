// Post-process the result of the recommended-articles
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs } from '../../scripts/utils.js';
import { recreatePicture } from '../../scripts/devblog/devblog.js';
setLibs();
const miloBlock = await import(`${getLibs()}/blocks/recommended-articles/recommended-articles.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

// New breakpoints and sizes
const breakpoints = [{ media: '(min-width: 600px)', width: '420' }, { width: '200' }];

export default async function init(blockEl) {
  await miloBlock.default(blockEl);
  blockEl.querySelectorAll('a.article-card').forEach(article => {
    // TODO also handle missing pictures
    article.querySelectorAll('picture').forEach(pic => {
      pic.replaceWith(recreatePicture(pic, breakpoints));
    })
  })
  blockEl.classList.add("recommended-articles");
  loadStyle(`${getLibs()}/blocks/recommended-articles/recommended-articles.css`);
}