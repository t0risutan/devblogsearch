import { getLibs } from '../../scripts/devblog/devblog.js';
import filterData from './blog-search-filter-data.js';

// These will be loaded dynamically in the functions that need them
let createOptimizedPicture;
let decorateIcons;
let fetchPlaceholders;
let currentRenderId = 0;
let searchDebounceTimer;

async function loadMiloUtils() {
  if (!createOptimizedPicture) {
    const miloLibs = getLibs();
    const utils = await import(`${miloLibs}/utils/utils.js`);
    createOptimizedPicture = utils.createOptimizedPicture;
    decorateIcons = utils.decorateIcons;

    // Try to get fetchPlaceholders, fallback to empty function
    fetchPlaceholders = utils.fetchPlaceholders || (() => Promise.resolve({}));
  }
}

const searchParams = new URLSearchParams(window.location.search);

function findNextHeading(el) {
  let preceedingEl = el.parentElement.previousElement || el.parentElement.parentElement;
  let h = 'H2';
  while (preceedingEl) {
    const lastHeading = [...preceedingEl.querySelectorAll('h1, h2, h3, h4, h5, h6')].pop();
    if (lastHeading) {
      const level = parseInt(lastHeading.nodeName[1], 10);
      h = level < 6 ? `H${level + 1}` : 'H6';
      preceedingEl = false;
    } else {
      preceedingEl = preceedingEl.previousElement || preceedingEl.parentElement;
    }
  }
  return h;
}

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    if (!element || !element.textContent) return;

    const matches = [];
    const { textContent } = element;
    terms.forEach((term) => {
      let start = 0;
      let offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      while (offset >= 0) {
        matches.push({ offset, term: textContent.substring(offset, offset + term.length) });
        start = offset + term.length;
        offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      }
    });

    if (!matches.length) {
      return;
    }

    matches.sort((a, b) => a.offset - b.offset);
    let currentIndex = 0;
    const fragment = matches.reduce((acc, { offset, term }) => {
      if (offset < currentIndex) return acc;
      const textBefore = textContent.substring(currentIndex, offset);
      if (textBefore) {
        acc.appendChild(document.createTextNode(textBefore));
      }
      const markedTerm = document.createElement('mark');
      markedTerm.textContent = term;
      acc.appendChild(markedTerm);
      currentIndex = offset + term.length;
      return acc;
    }, document.createDocumentFragment());
    const textAfter = textContent.substring(currentIndex);
    if (textAfter) {
      fragment.appendChild(document.createTextNode(textAfter));
    }
    element.innerHTML = '';
    element.appendChild(fragment);
  });
}

async function fetchData(source) {
  const response = await fetch(source);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading API response', response);
    return null;
  }

  const json = await response.json();
  if (!json) {
    // eslint-disable-next-line no-console
    console.error('empty API response', source);
    return null;
  }

  return json.data;
}

async function renderResult(result, searchTerms, titleTag) {
  await loadMiloUtils();
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = result.path;
  if (result.image) {
    const wrapper = document.createElement('div');
    wrapper.className = 'search-result-image';

    // Fallback if createOptimizedPicture isn't available
    if (typeof createOptimizedPicture === 'function') {
      const pic = createOptimizedPicture(result.image, '', false, [{ width: '375' }]);
      wrapper.append(pic);
    } else {
      // Simple img fallback
      const img = document.createElement('img');
      img.src = result.image;
      img.alt = result.title || '';
      img.loading = 'lazy';
      wrapper.append(img);
    }
    a.append(wrapper);
  }
  // This is for the tag of the search result
  if (result.tags) {
    try {
      const tagsArray = JSON.parse(result.tags);
      if (tagsArray.length && tagsArray.length > 0) {
        const tagElement = document.createElement('span');
        tagElement.className = 'search-result-tags';
        tagElement.textContent = tagsArray[0].toUpperCase().replace(/-/g, ' ');
        a.append(tagElement);
      }
    } catch (e) {
      if (result.tags) {
        const tagElement = document.createElement('span');
        tagElement.className = 'search-result-tag';
        tagElement.textContent = result.tags.toUpperCase().replace(/-/g, ' ');
        a.append(tagElement);
      }
    }
  }
  if (result.title) {
    const title = document.createElement(titleTag);
    title.className = 'search-result-title';
    const link = document.createElement('a');
    link.href = result.path;
    link.textContent = result.title;
    highlightTextElements(searchTerms, [link]);
    title.append(link);
    a.append(title);
  }
  if (result.description) {
    const description = document.createElement('p');
    description.textContent = result.description;
    highlightTextElements(searchTerms, [description]);
    a.append(description);
  }
  li.append(a);
  return li;
}

function clearSearchResults(component) {
  // looks for the results in theshadow dom first else it will fallback to the light dom
  const searchResults = component.shadowRoot?.querySelector('.search-results') || component.querySelector('.search-results');
  if (searchResults) {
    searchResults.innerHTML = '';
  }
}

function clearSearch(component) {
  clearSearchResults(component);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }
}

async function renderResults(component, config, filteredData, searchTerms) {
  currentRenderId += 1;
  const renderId = currentRenderId;

  clearSearchResults(component);
  // looks for the results in theshadow dom first else it will fallback to the light dom
  const searchResults = component.shadowRoot?.querySelector('.search-results') || component.querySelector('.search-results');
  if (!searchResults) return;

  const headingTag = searchResults.dataset.h;

  if (filteredData.length) {
    searchResults.classList.remove('no-results');

    // Render all results in parallel
    const results = await Promise.all(
      filteredData.map((result) => renderResult(result, searchTerms, headingTag)),
    );

    // Check if this render is still current (not cancelled by a newer search)
    if (renderId !== currentRenderId) return;

    // Append all results at once
    results.forEach((li) => searchResults.append(li));
  } else {
    if (renderId !== currentRenderId) return;

    const noResultsMessage = document.createElement('li');
    searchResults.classList.add('no-results');
    noResultsMessage.textContent = config.placeholders.searchNoResults || 'No results found.';
    searchResults.append(noResultsMessage);
  }
}

// filterData: see ./blog-search-filter-data.js (unit-tested in Node)

const topicMatch = window.location.pathname.match(/\/topics\/([^/?]+)/);
const currentTopic = topicMatch ? topicMatch[1] : null;

async function handleSearch(e, component, config) {
  const searchValue = e.target.value;

  searchParams.set('q', searchValue);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  if (searchValue.length < 3) {
    clearSearch(component);
    return;
  }

  const searchTerms = searchValue.toLowerCase().split(/\s+/).filter((term) => term.length >= 3);

  try {
    const data = await fetchData(config.source);
    let scopedData = data;

    if (currentTopic) {
      scopedData = data.filter((item) => {
        if (!item.tags) return false;
        try {
          const tags = JSON.parse(item.tags);
          return tags.includes(currentTopic);
        } catch {
          return item.tags.includes(currentTopic);
        }
      });
    }

    const filteredData = filterData(searchTerms, scopedData);
    const facetFilteredData = component.applyFilters(filteredData, component.activeFilters);
    await renderResults(component, config, facetFilteredData, searchTerms);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in handleSearch:', error);
  }
}

function searchResultsContainer(component) {
  const results = document.createElement('ul');
  results.className = 'search-results';
  results.dataset.h = findNextHeading(component);
  return results;
}

function searchInput(component, config) {
  const input = document.createElement('input');
  input.setAttribute('type', 'search');
  input.className = 'search-input';

  const searchPlaceholder = config.placeholders.searchPlaceholder || 'Search...';
  input.placeholder = searchPlaceholder;
  input.setAttribute('aria-label', searchPlaceholder);

  input.addEventListener('input', (e) => {
    const currentTarget = e.target; // Capture the input element reference
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      // Create a fake event object with the target
      handleSearch({ target: currentTarget }, component, config);
    }, 300);
  });

  input.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      clearSearch(component);
    }
  });

  // Additional event listeners for debugging
  input.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      // Allow space character in the input and prevent nav/global handlers from intercepting it
      e.stopPropagation();
    }
  }, true);

  return input;
}

function searchIcon() {
  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-search');
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21 l-4.3 -4.3"></path></svg>';
  return icon;
}

function searchBox(component, config) {
  const box = document.createElement('div');
  box.classList.add('search-box');
  const icon = searchIcon();
  const input = searchInput(component, config);

  box.append(icon, input);

  // Check if this is a nav search variant
  if (component.classList.contains('nav-search')) {
    // Close search on escape key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearSearch(component);
        input.value = '';
        input.blur();
      }
    });
  }

  return box;
}

/**
 * @typedef {Object} ActiveFilters
 * @property {string[]} cat
 * @property {string[]} prod
 * @property {string[]} author
 * @property {string[]} date
 * @property {string[]} type
 */

class BlogSearch extends HTMLElement {
  constructor() {
    super();
    this.activeFilters = {
      cat: [],
      prod: [],
      author: [],
      date: [],
      type: [],
    };
  }

  // Note: async connectedCallback is valid; the browser awaits the returned promise.
  async connectedCallback() {
    // shadow dom gets created first
    this.attachShadow({ mode: 'open' });

    if (searchParams.get('q')) {
      searchParams.delete('q');
      if (window.history.replaceState) {
        const url = new URL(window.location.href);
        url.search = searchParams.toString();
        window.history.replaceState({}, '', url.toString());
      }
    }

    await loadMiloUtils();

    // the css gets loaded into the shadow dom
    const cssResponse = await fetch('/web-components/search/blog-search.css');
    const cssText = await cssResponse.text();
    const styleSheet = new CSSStyleSheet();
    await styleSheet.replace(cssText);
    this.shadowRoot.adoptedStyleSheets = [styleSheet];

    const placeholders = await fetchPlaceholders();
    const source = this.getAttribute('data-source') || '/en/query-index.json';
    this.config = { source, placeholders };

    // Detect if this search should be nav-style
    const isNavSearch = document.querySelector('header') || this.classList.contains('nav-search');
    if (isNavSearch) {
      this.classList.add('nav-search');

      // For nav search, everything goes in Shadow DOM but uses positioning to span full width
      const topNav = document.querySelector('.feds-topnav');
      if (topNav) {
        topNav.classList.add('has-blog-nav-search');

        // creates nav-search-container which is important for the positioning
        const searchContainer = document.createElement('div');
        searchContainer.className = 'nav-search-container';

        const icon = searchIcon();
        const input = searchInput(this, { source, placeholders });
        const results = searchResultsContainer(this);

        // adds all elements to the shadow dom
        searchContainer.append(icon, input, results);
        this.shadowRoot.appendChild(searchContainer);

        // Close search on escape key
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            clearSearch(this);
            input.value = '';
            input.blur();
          }
        });
      } else {
        // Fallback to normal behavior in Shadow DOM
        this.shadowRoot.append(
          searchBox(this, { source, placeholders }),
          searchResultsContainer(this),
        );
      }
    } else {
      // Regular search - all in Shadow DOM
      this.shadowRoot.append(
        searchBox(this, { source, placeholders }),
        searchResultsContainer(this),
      );
    }

    if (typeof decorateIcons === 'function') {
      decorateIcons(this.shadowRoot);
    }

    // Integration of filter functionality within the shadow DOM
    // load data
    this.allData = await fetchData(source);
    if (!this.allData) return;

    // load active filters from URL
    this.activeFilters = this.loadFiltersFromURL();

    // render filter bar
    const facets = this.generateFacets(this.allData);
    this.renderFilterBar(facets);
    this.renderChips(this.activeFilters);
    this.updateFilterCounts(this.allData);

    this.shadowRoot.querySelector('.filter-bar').addEventListener('change', (e) => {
      if (e.target.type !== 'checkbox') return;
      const { group } = e.target.closest('.filter-dropdown').dataset;
      const { value } = e.target;
      if (e.target.checked) {
        this.activeFilters[group].push(value);
      } else {
        this.activeFilters[group] = this.activeFilters[group].filter((v) => v !== value);
      }
      this.renderChips(this.activeFilters);
      this.updateURLState(this.activeFilters);
      const searchInput = this.shadowRoot.querySelector('input[type="search"]');
      if (searchInput && searchInput.value.length >= 3) {
        handleSearch({ target: searchInput }, this, this.config);
      }
    });

    // X-Button on filter chips
    this.addEventListener('remove-filter', (e) => {
      const { group, value } = e.detail;
      this.activeFilters[group] = this.activeFilters[group].filter((v) => v !== value);
      this.renderChips(this.activeFilters);
      this.updateURLState(this.activeFilters);
      const searchInput = this.shadowRoot.querySelector('input[type="search"]');
      if (searchInput && searchInput.value.length >= 3) {
        handleSearch({ target: searchInput }, this, this.config);
      }
    });

    // Clear all filters button
    this.addEventListener('clear-all-filters', () => {
      Object.keys(this.activeFilters).forEach((key) => {
        this.activeFilters[key] = [];
      });
      this.renderChips(this.activeFilters);
      this.updateURLState(this.activeFilters);
      const searchInput = this.shadowRoot.querySelector('input[type="search"]');
      if (searchInput && searchInput.value.length >= 3) {
        handleSearch({ target: searchInput }, this, this.config);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  generateFacets(data) {
    const catSet = new Set();
    const prodSet = new Set();
    const authorSet = new Set();
    const dateSet = new Set();
    const typeSet = new Set();

    data.forEach((article) => {
      if (article.tags) {
        try {
          const tags = JSON.parse(article.tags);
          if (Array.isArray(tags)) {
            tags.forEach((tag) => {
              if (tag) catSet.add(tag);
            });
          }
        } catch {
          // eslint-disable-next-line no-console
        }
      }
      if (article.adobeCloud) prodSet.add(article.adobeCloud);
      if (article.adobeApp) prodSet.add(article.adobeApp);
      if (article.author) authorSet.add(article.author);
      if (article.sortDate) dateSet.add(article.sortDate);
      if (article.articleType) typeSet.add(article.articleType);
    });

    const sorted = (set) => [...set].sort();

    return {
      cat: sorted(catSet),
      prod: sorted(prodSet),
      author: sorted(authorSet),
      date: sorted(dateSet),
      type: sorted(typeSet),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  applyFilters(data, activeFilters) {
    return data.filter((article) => (
      Object.entries(activeFilters).every(([group, activeValues]) => {
        if (activeValues.length === 0) return true;

        if (group === 'date') {
          if (!article.sortDate) return false;
          const articleDate = new Date(article.sortDate);
          const now = new Date();
          const cutoff = new Date(now);
          const preset = activeValues[0];
          if (preset === 'last-week') cutoff.setDate(now.getDate() - 7);
          else if (preset === 'last-month') cutoff.setMonth(now.getMonth() - 1);
          else if (preset === 'last-year') cutoff.setFullYear(now.getFullYear() - 1);
          return articleDate >= cutoff;
        }

        let values = [];
        switch (group) {
          case 'cat':
            if (article.tags) {
              try {
                const parsed = JSON.parse(article.tags);
                if (Array.isArray(parsed)) values = parsed.filter(Boolean);
              } catch { /* invalid JSON, no match */ }
            }
            break;
          case 'prod':
            values = [article.adobeCloud, article.adobeApp].filter(Boolean);
            break;
          case 'author':
            if (article.author) values = [article.author];
            break;
          case 'type':
            if (article.articleType) values = [article.articleType];
            break;
          default:
            break;
        }

        return activeValues.some((v) => values.includes(v));
      })
    ));
  }

  // eslint-disable-next-line class-methods-use-this
  loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      cat: params.getAll('cat').filter(Boolean),
      prod: params.getAll('prod').filter(Boolean),
      author: params.getAll('author').filter(Boolean),
      date: params.getAll('date').filter(Boolean),
      type: params.getAll('type').filter(Boolean),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  updateURLState(activeFilters) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');

    const newParams = new URLSearchParams();

    if (q) newParams.set('q', q);

    Object.entries(activeFilters).forEach(([group, values]) => {
      if (values.length > 0) {
        values.forEach((value) => {
          newParams.append(group, value);
        });
      }
    });

    const url = new URL(window.location.href);
    url.search = newParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  renderFilterBar(facets) {
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';

    Object.entries(facets).forEach(([group, values]) => {
      if (group === 'date') {
        const dateSelect = document.createElement('select');
        [
          { value: 'last-week', label: 'Last week' },
          { value: 'last-month', label: 'Last month' },
          { value: 'last-year', label: 'Last year' },
        ].forEach(({ value, label }) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = label;
          dateSelect.append(option);
        });
        filterBar.append(dateSelect);
        return;
      }

      if (values.length === 0) return;
      const toggle = document.createElement('button');

      toggle.className = 'filter-dropdown-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      const labels = { cat: 'Category', prod: 'Product', author: 'Author', type: 'Type' };
      toggle.textContent = labels[group];

      const menu = document.createElement('ul');

      values.forEach((value) => {
        const item = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        item.append(checkbox);

        const label = document.createElement('label');
        label.textContent = value;
        item.append(label);

        menu.append(item);
      });

      toggle.addEventListener('click', () => {
        const currentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!currentlyOpen));
        menu.classList.toggle('show', !currentlyOpen);
      });

      const dropdown = document.createElement('div');
      dropdown.className = 'filter-dropdown';
      // used to identify the group of the filter
      dropdown.dataset.group = group;
      dropdown.append(toggle, menu);
      filterBar.append(dropdown);
    });
    this.shadowRoot.append(filterBar);
    return filterBar;
  }

  renderChips(activeFilters) {
    if (!Object.values(activeFilters).some((values) => values.length > 0)) return;

    this.shadowRoot.querySelector('.filter-chips')?.remove();
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'filter-chips';

    Object.entries(activeFilters).forEach(([group, values]) => {
      values.forEach((value) => {
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.textContent = value;

        const removeButton = document.createElement('button');
        removeButton.className = 'filter-chip-remove';
        removeButton.textContent = 'x';
        removeButton.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('remove-filter', { detail: { group, value }, bubbles: true }));
        });

        chip.append(removeButton);
        chipsContainer.append(chip);
      });
    });

    const clearButton = document.createElement('button');
    clearButton.className = 'filter-clear-all';
    clearButton.textContent = 'Clear all';
    clearButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('clear-all-filters', { bubbles: true }));
    });
    chipsContainer.append(clearButton);
    this.shadowRoot.querySelector('.filter-bar')?.append(chipsContainer);
  }

  // eslint-disable-next-line class-methods-use-this
  getArticleValues(article, group) {
    switch (group) {
      case 'cat':
        if (article.tags) {
          try {
            return JSON.parse(article.tags).filter(Boolean);
          } catch { /* invalid JSON, no match */ }
        }
        return [];
      case 'prod':
        return [article.adobeCloud, article.adobeApp].filter(Boolean);
      case 'author':
        return article.author ? [article.author] : [];
      case 'type':
        return article.articleType ? [article.articleType] : [];
      default:
        return [];
    }
  }

  updateFilterCounts(data) {
    const filterBar = this.shadowRoot.querySelector('.filter-bar');
    if (!filterBar) return;
    const filterDropdowns = filterBar.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach((dropdown) => {
      const { group } = dropdown.dataset;

      dropdown.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        const { value } = checkbox;
        const count = data.filter((article) => (
          this.getArticleValues(article, group).includes(value)
        )).length;

        const label = checkbox.nextElementSibling;
        label.textContent = '';

        const textNode = document.createTextNode(`${value} `);
        const countSpan = document.createElement('span');
        countSpan.className = 'filter-count';
        countSpan.textContent = `(${count})`;

        label.append(textNode, countSpan);
      });
    });
  }
}
customElements.define('blog-search', BlogSearch);
export default BlogSearch;
