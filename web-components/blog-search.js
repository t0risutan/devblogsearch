import { getLibs } from '../../scripts/devblog/devblog.js';

// These will be loaded dynamically in the functions that need them
let createOptimizedPicture, decorateIcons, fetchPlaceholders;

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
  
  export async function fetchData(source) {
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
  const searchResults = component.querySelector('.search-results');
    searchResults.innerHTML = '';
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
  clearSearchResults(component);
  const searchResults = component.querySelector('.search-results');
    const headingTag = searchResults.dataset.h;

    if (filteredData.length) {
      searchResults.classList.remove('no-results');
      for (const result of filteredData) {
        const li = await renderResult(result, searchTerms, headingTag);
        searchResults.append(li);
      }
    } else {
      const noResultsMessage = document.createElement('li');
      searchResults.classList.add('no-results');
      noResultsMessage.textContent = config.placeholders.searchNoResults || 'No results found.';
      searchResults.append(noResultsMessage);
    }
  }
  
  function compareFound(hit1, hit2) {
    return hit1.minIdx - hit2.minIdx;
  }
  
  function filterData(searchTerms, data) {
    const foundInHeader = [];
    const foundInMeta = [];
  
    data.forEach((result) => {
      let minIdx = -1;
  
      searchTerms.forEach((term) => {
        const idx = (result.header || result.title).toLowerCase().indexOf(term);
        if (idx < 0) return;
        if (minIdx < idx) minIdx = idx;
      });
  
      if (minIdx >= 0) {
        foundInHeader.push({ minIdx, result });
        return;
      }
  
      const metaContents = `${result.title} ${result.description} ${result.path.split('/').pop()}`.toLowerCase();
      searchTerms.forEach((term) => {
        const idx = metaContents.indexOf(term);
        if (idx < 0) return;
        if (minIdx < idx) minIdx = idx;
      });
  
      if (minIdx >= 0) {
        foundInMeta.push({ minIdx, result });
      }
    });
  
    return [
      ...foundInHeader.sort(compareFound),
      ...foundInMeta.sort(compareFound),
    ].map((item) => item.result);
  }
  
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
  
  
  const searchTerms = searchValue.toLowerCase().split(/\s+/).filter((term) => !!term);
  

  try {
    const data = await fetchData(config.source);
    
    
    const filteredData = filterData(searchTerms, data);
    
    
    await renderResults(component, config, filteredData, searchTerms);
  } catch (error) {
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

  // Debug logging
  
  
    input.addEventListener('input', (e) => {
    
    handleSearch(e, component, config);
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
      // Add click handler for icon to expand search
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
      component.classList.toggle('expanded');
      if (component.classList.contains('expanded')) {
          setTimeout(() => input.focus(), 300);
        }
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
      if (!component.contains(e.target)) {
        component.classList.remove('expanded');
        clearSearch(component);
        }
      });

      // Close search on escape key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
        component.classList.remove('expanded');
        clearSearch(component);
        }
      });
    }

    return box;
  }
  
class BlogSearch extends HTMLElement {
  async connectedCallback() {
    
    
    await loadMiloUtils();
    
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/web-components/search/blog-search.css';
    document.head.appendChild(link);
    
    
    const placeholders = await fetchPlaceholders();
    const source = this.getAttribute('data-source') || '/en/query-index.json';
    
    
    // Detect if this search should be nav-style
    const isNavSearch = document.querySelector('header') || this.classList.contains('nav-search');
    if (isNavSearch) {
      this.classList.add('nav-search');
      
      // For nav search, place input directly in topnav and keep icon in component
      const topNav = document.querySelector('.feds-topnav');
      if (topNav) {
        topNav.classList.add('has-blog-nav-search');
        const input = searchInput(this, { source, placeholders });
        const icon = searchIcon();
        
        // Add input directly to topnav
        topNav.appendChild(input);
        
        // Keep only icon and results in the component
        this.innerHTML = '';
        this.append(icon, searchResultsContainer(this));
        
        // Set up nav-specific behavior
        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          this.classList.toggle('expanded');
          if (this.classList.contains('expanded')) {
            setTimeout(() => input.focus(), 300);
          }
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
          if (!this.contains(e.target) && !input.contains(e.target)) {
            this.classList.remove('expanded');
            clearSearch(this);
          }
        });

        // Close search on escape key
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.classList.remove('expanded');
            clearSearch(this);
          }
        });
      } else {
        // Fallback to normal behavior
        this.innerHTML = '';
        this.append(
          searchBox(this, { source, placeholders }),
          searchResultsContainer(this),
        );
      }
    } else {
      this.innerHTML = '';
      this.append(
        searchBox(this, { source, placeholders }),
        searchResultsContainer(this),
      );
    }

    if (searchParams.get('q')) {
      const input = this.querySelector('input');
      input.value = searchParams.get('q');
      input.dispatchEvent(new Event('input'));
          
    }

    if (typeof decorateIcons === 'function') {
      decorateIcons(this);
    }
    
  }
}

customElements.define('blog-search', BlogSearch);