/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
function findKthPositive(arr, k) {
  const missing = [];
  let counter = 1;
  while (missing.length < k) {
    if (!arr.includes(counter)) {
      missing.push(counter);
    }
    counter++;
  }
  return missing[k - 1];
}
