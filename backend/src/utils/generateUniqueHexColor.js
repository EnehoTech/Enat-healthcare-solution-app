/**
 * @function generateRandomUniqueHexColor
 * @description Generates a random unique hex color code in the format "#RRGGBB".
 * @returns {string} A randomly generated hex color code.
 * @example
 * const color = generateRandomUniqueHexColor();
 * // Example output: "#1a2b3c"
 */

export const generateRandomUniqueHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};
