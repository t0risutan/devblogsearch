// Some of our posts do not have an image, and the Milo
// code does not always handle that properly.
//
// To avoid having to override several Milo blocks,
// wait for the DOM to be quiet for some time and
// then analyze the page and insert default images
// where needed
//
// A bit hacky, to clean up we should really fix
// this in Milo.

import { createOptimizedPicture } from '../utils.js';

// Set this according to the contents of the default images folder
const nDefaultImages = 13;
const defaultImagePrefix = '/images/default-images/default-image-';
const altPrefix = 'Image';

const longTimerIntervalMsec = 1000;
const shortTimerIntervalMsec = 200;
var timerIntervalMsec = longTimerIntervalMsec;
var currentRevision = 0;
var lastRevisionAnalyzed = -1;

function defaultImagesCallback(mutationList, observer) {
  currentRevision++;
  timerIntervalMsec = shortTimerIntervalMsec;
}

function getDefaultImageNumber(articlePath) {
  // deterministic mapping of the article path
  // to our set of default images, so that a given
  // article always gets the same one
  const n = articlePath.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % nDefaultImages;
  console.log('getDefaultImageNumber', n, articlePath);
  return n;
}

function fixDefaultImages() {
  // Fix list of posts
  document.body.querySelectorAll('img').forEach(img => {
    if(img.src.indexOf('default-meta-image.png') >= 0 ) {
      const oldPic = img.parentElement;
      if(oldPic) {
        const n = getDefaultImageNumber(img.closest('a[class=article-card]')?.href);
        const newPic = createOptimizedPicture(`${defaultImagePrefix}${n}.png`,`${altPrefix} ${n}`);
        oldPic.replaceWith(newPic);
      }
    }
  });

  // Fix article cards
  document.body.querySelectorAll('div[class=article-card-image]').forEach(div => {
    if(div.childElementCount == 0) {
      const n = getDefaultImageNumber(div.closest('a[class=article-card]')?.href);
      div.append(createOptimizedPicture(`${defaultImagePrefix}${n}.png`,`${altPrefix} ${n}`));
    }
  });

  // Fix missing article image
  document.body.querySelectorAll('figure[class=figure-feature]').forEach(fig => {
    if(fig.textContent === 'null') {
      fig.textContent = '';
    }
  })
}

function defaultImagesTimer() {
  if(lastRevisionAnalyzed < currentRevision) {
    lastRevisionAnalyzed = currentRevision;
    fixDefaultImages();
  }
  setTimeout(defaultImagesTimer, timerIntervalMsec);
  timerIntervalMsec = longTimerIntervalMsec;
}

export function setupDefaultImages() {
  const config = { attributes: true, childList: true, subtree: false };
  const observer = new MutationObserver(defaultImagesCallback);
  observer.observe(document.body, config);
  setTimeout(defaultImagesTimer, timerIntervalMsec);    
}