// Post-process the result of the recommended-articles
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs, createOptimizedPicture } from '../../scripts/utils.js';
setLibs();
const miloBlock = await import(`${getLibs()}/blocks/recommended-articles/recommended-articles.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

export default async function init(blockEl) {
  await miloBlock.default(blockEl);
  blockEl.querySelectorAll('a.article-card').forEach(article => {
    // TODO fix the picture elements in the article, including default images
    /*
    article.querySelectorAll('picture').forEach(pic => {
      pic.replaceWith(createOptimizedPicture('/en/publish/media_1c67edcbf3d332be11bd6fc295d88625f21666abc.jpeg'));
    })
    */
  })
  blockEl.classList.add("recommended-articles");
  loadStyle(`${getLibs()}/blocks/recommended-articles/recommended-articles.css`);
}