// Tags block for the devblog, where we do not use the taxonomy so far
import { SITE } from '../../scripts/devblog/devblog.js';

export default async function init(blockEl) {
  blockEl.classList.add('tags');
  const tags = blockEl.firstElementChild?.firstElementChild?.textContent;

  if (!tags) return;

  blockEl.innerHTML = '';
  const tagsArray = tags.split(', ').map((tag) => tag.trim());
  const container = document.createElement('p');

  tagsArray.forEach((topic) => {
    const a = document.createElement('a');
    a.href = `${SITE.topicsRoot}/${topic}`;
    a.textContent = topic;
    container.appendChild(a);
  });

  blockEl.append(container);
}
