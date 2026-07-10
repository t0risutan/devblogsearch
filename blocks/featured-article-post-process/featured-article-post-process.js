import { setLibs, getLibs, SITE } from '../../scripts/devblog/devblog.js';

setLibs(SITE.prodLibsPath);

const miloBlock = await import(`${getLibs()}/blocks/featured-article/featured-article.js`);
const { loadStyle } = await import(`${getLibs()}/utils/utils.js`);

const extractYouTubeId = (url = '') =>
  url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

const isGif = (url = '') => /\.gif(\?.*)?$/i.test(url);

// Fetch og:image from the article's full page (not .plain.html).

const fetchOGImage = async (href) => {
  try {
    const pathname = href.startsWith('http') ? new URL(href).pathname : href;
    const res = await fetch(pathname);
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    return doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;
  } catch (e) {
    console.warn('fetchOGImage failed:', e);
    return null;
  }
};

const createMediaElement = (url = '', ogImage = '') => {
  const ytId = extractYouTubeId(url);

  if (ytId) {
    // Priority: image metadata thumbnail; fallback to YouTube's own thumbnail.
    const img = new Image();
    img.src = ogImage || `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
    img.alt = '';
    return img;
  }

  if (isGif(url)) {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
    };
    canvas.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    return canvas;
  }

  if (/\.(mp4|webm)$/i.test(url)) {
    // Priority: image metadata thumbnail; fallback to inline video element.
    if (ogImage) {
      const img = new Image();
      img.src = ogImage;
      img.alt = '';
      return img;
    }
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.preload = 'metadata';
    video.style.width = '100%';
    video.style.objectFit = 'cover';
    return video;
  }

  return null;
};

const extractTextWithoutLinks = (el) => {
  if (!el) return '';
  const clone = el.cloneNode(true);
  clone.querySelectorAll('a').forEach((a) => a.remove());
  return clone.textContent.trim();
};

const fetchArticleData = async (href) => {
  try {
    const pathname = href.startsWith('http') ? new URL(href).pathname : href;
    const res = await fetch(`${pathname}.plain.html`);
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

    // Detect video hero: <p> immediately after <h1> containing only a video/YT link
    const h1 = doc.querySelector('h1');
    const nextEl = h1?.nextElementSibling;
    let mediaHref = '';

    if (nextEl?.tagName === 'P') {
      const links = nextEl.querySelectorAll('a[href]');
      const text = nextEl.textContent.trim();
      if (links.length === 1 && text === links[0].textContent.trim()) {
        const linkHref = links[0].getAttribute('href');
        if (extractYouTubeId(linkHref) || /\.(mp4|webm)$/i.test(linkHref)) {
          mediaHref = linkHref;
        }
      }
    }

    // Also check if the raw text after h1 is a bare URL (no anchor tag)
    if (!mediaHref && nextEl?.tagName === 'P') {
      const text = nextEl.textContent.trim();
      if (extractYouTubeId(text) || /\.(mp4|webm)$/i.test(text)) {
        mediaHref = text;
      }
    }

    const title = h1?.textContent || '';
    const category = doc.querySelector('meta[name="article:tag"]')?.content || '';
    const date = doc.querySelector('meta[name="publication-date"]')?.content || '';

    // Description: first <p> that isn't a bare URL or video link
    const paragraphs = [...doc.querySelectorAll('p')];
    const descPara = paragraphs.find((p) => {
      const text = p.textContent.trim();
      return text && !extractYouTubeId(text) && !/^https?:\/\//i.test(text);
    });
    const description = extractTextWithoutLinks(descPara);

    // Fetch og:image — guaranteed for YouTube/MP4 heroes, used as card thumbnail.
    const ogImage = await fetchOGImage(href);

    return { mediaHref, ogImage, title, category, date, description };
  } catch (e) {
    console.warn('fetchArticleData failed:', e);
    return null;
  }
};

const buildCardManually = (blockEl, href, data) => {
  const { mediaHref, ogImage, title, category, date, description } = data;

  const card = document.createElement('a');
  card.href = href;
  card.classList.add('featured-article-card');

  const mediaEl = createMediaElement(mediaHref, ogImage);
  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'featured-article-card-image';
  if (mediaEl) imgWrapper.append(mediaEl);

  const categoryEl = document.createElement('div');
  categoryEl.className = 'featured-article-card-category';
  categoryEl.textContent = category;

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;

  const descEl = document.createElement('p');
  descEl.className = 'featured-article-card-description';
  descEl.textContent = description;

  const dateEl = document.createElement('p');
  dateEl.className = 'featured-article-card-date';
  dateEl.textContent = date;

  const body = document.createElement('div');
  body.className = 'featured-article-card-body';
  body.append(categoryEl, titleEl, descEl, dateEl);

  card.append(imgWrapper, body);

  blockEl.innerHTML = '';
  blockEl.append(card);
};

export default async function init(blockEl) {
  blockEl.classList.add('featured-article');
  loadStyle(`${getLibs()}/blocks/featured-article/featured-article.css`);

  const anchor = blockEl.querySelector('a[href]');
  const href = anchor?.getAttribute('href');

  if (!href) return;

  const data = await fetchArticleData(href);
  const isVideoHero = !!(data?.mediaHref);

  if (isVideoHero) {
    // Skip Milo — no <picture> in doc, it will crash
    buildCardManually(blockEl, href, data);
  } else {
    try {
      await miloBlock.default(blockEl);
    } catch (e) {
      console.warn('Milo featured-article failed:', e);
    }
  }
}