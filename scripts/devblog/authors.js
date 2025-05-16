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

function getAuthorPageName(name) {
  //return name?.trim().replace(/[^0-9a-z]/gi, '-').replace(/-+/gi,'-').replace(/-$/,'').toLowerCase();
  return name?.trim().replace(/[^0-9a-z]/gi, '-').toLowerCase();
}

export function getAuthorInfoFromPath(pagePath) {
  const id = pagePath.match(/en\/authors\/(.*)/)[1];
  const info = {
    authorName: id.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase()),
    authorImageFilename: id
  };
  return info;
}

export function getAuthorPagePath(codeRoot, authorName) {
  return authorName ? `${codeRoot}${SITE.authorsRoot}/${getAuthorPageName(authorName)}` : null;
}

