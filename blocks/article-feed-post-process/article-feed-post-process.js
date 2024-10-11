// Post-process the result of the article-feed
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs, createOptimizedPicture } from '../../scripts/utils.js';
setLibs();
const miloBlock = await import(`${getLibs()}/blocks/article-feed/article-feed.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

export default async function init(blockEl) {
  // TODO listen for picture element insertions on blockEl
  // to fix them on the fly
  await miloBlock.default(blockEl);
  blockEl.classList.add("article-feed");
  loadStyle(`${getLibs()}/blocks/article-feed/article-feed.css`);
}