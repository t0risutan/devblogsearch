// Post-process the result of the article-feed
// block to fix its picture elements, for default images
// and to get optimal image sizes.
//
// A bit of hack, but the alternative is to completely
// override the original block, which is not better.
import { setLibs, getLibs } from '../../scripts/utils.js';
import { recreatePicture } from '../../scripts/devblog/devblog.js';
setLibs();
const miloBlock = await import(`${getLibs()}/blocks/article-feed/article-feed.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

// Set all images to this size, which is the maximum we need given our CSS
const breakpoints = [{ width: '450' }];

function blockChanged(records, _observer) {
  for(const record of records) {
    for(const added of record.addedNodes) {
      // recreate picture elements with new breakpoints
      // TODO also handle missing pictures
      added.querySelectorAll('picture').forEach(pic => {
        pic.replaceWith(recreatePicture(pic, breakpoints));
      })
    }
  }
}

export default async function init(blockEl) {
  const observerOptions = {
    childList: true,
    subtree: true,
  };
  const observer = new MutationObserver(blockChanged);
  observer.observe(blockEl, observerOptions);

  await miloBlock.default(blockEl);
  blockEl.classList.add("article-feed");
  loadStyle(`${getLibs()}/blocks/article-feed/article-feed.css`);
}