import { capitalize } from "./capitalize";
import { deburr } from "./deburr";
import { splitWords } from "./split-words";

/**
 * Converts `string` to camelCase.
 *
 * @example
 * camelCase('Foo Bar')
 * // => 'fooBar'
 * camelCase('--foo-bar--')
 * // => 'fooBar'
 * camelCase('__FOO_BAR__')
 * // => 'fooBar'
 * @param str The string to convert.
 * @returns Returns the camel cased string.
 */

export function camelCase(str: string): string {
  if (str === "") return "";

  const deburredStr = deburr(str);
  const words = splitWords(deburredStr);

  if (words.length === 0) return "";
  let camelCase = words[0].toLowerCase();

  // Start the loop from the second word
  for (let index = 1; index < words.length; index++) {
    const word = words[index];
    camelCase += capitalize(word);
  }

  return camelCase;
}
