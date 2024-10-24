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

const longTimerIntervalMsec = 1000;
const shortTimerIntervalMsec = 200;
var timerIntervalMsec = longTimerIntervalMsec;
var currentRevision = 0;
var lastRevisionAnalyzed = -1;

function defaultImagesCallback(_mutationList, _observer) {
  currentRevision++;
  timerIntervalMsec = shortTimerIntervalMsec;
}

function fixMissingArticleImage() {
  document.body.querySelectorAll('figure[class=figure-feature]').forEach(fig => {
    if(fig.textContent === 'null') {
      fig.textContent = '';
    }
  })
}

function defaultImagesTimer() {
  if(lastRevisionAnalyzed < currentRevision) {
    lastRevisionAnalyzed = currentRevision;
    fixMissingArticleImage();
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