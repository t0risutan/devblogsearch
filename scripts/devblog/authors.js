/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { SITE } from './devblog.js';

// Need to replace % and . in URL-encoded paths with this for URL testing of
// the Milo article-header block to work
const replacements = {
  percent: '_',
  dot: '#'
}

function getPageName(authorName) {
  return encodeURIComponent(authorName)
    .replaceAll('%',replacements.percent)
    .replaceAll('.',replacements.dot)
  ;
}

function getAuthorName(pageName) {
  return decodeURIComponent(pageName
    .replaceAll(replacements.percent,'%')
    .replaceAll(replacements.dot,'.')
  );
}

function getImageFilename(authorName) {
  return authorName?.trim().toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/gi,'-').replace(/-$/gi,'');
}

export function getAuthorInfoFromPathAndHash(pagePath) {
  const pageName = pagePath.match(/en\/authors\/(.*)/)[1];
  const authorName = getAuthorName(pageName);
  const info = {
    authorName,
    authorImageFilename: getImageFilename(authorName)
  };
  return info;
}

export function getAuthorPagePath(codeRoot, authorName) {
  return authorName ? `${codeRoot}${SITE.authorsRoot}/${getPageName(authorName)}` : null;
}

