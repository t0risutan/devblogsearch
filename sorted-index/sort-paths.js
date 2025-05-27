/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Compare paths by extracting numeric values from them
// See test code for details

function getNumbers(path) {
  return path.match(/\d+/g)?.map(Number) || [];
}

function compareNumberArrays(arr1, arr2) {
  const maxLength = Math.max(arr1.length, arr2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const num1 = arr1[i] || 0;
    const num2 = arr2[i] || 0;
    
    if (num1 !== num2) {
      return num1 - num2;
    }
  }
  
  return 0;
}

export function compareNumbersInPaths(a, b, mostRecentFirst=true) {
  const numbersA = getNumbers(a);
  const numbersB = getNumbers(b);
  if(mostRecentFirst) {
    return compareNumberArrays(numbersB, numbersA);
  } else {
    return compareNumberArrays(numbersA, numbersB);
  }
}
