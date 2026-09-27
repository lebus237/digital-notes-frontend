/**
 * Checks if an array is empty or undefined/null.
 * @param arr - The array to check
 * @returns true if the array is undefined, null, or has length 0
 */
export const isEmptyArray = <T>(arr?: T[] | null): arr is undefined | null | [] =>
   arr == null || arr.length === 0
