/**
 * @function truncateDescription
 * @description Truncates a string to a specified limit and appends an ellipsis.
 * @param {string} description - The text to be truncated.
 * @param {number} [limit=120] - The character limit before truncation.
 * @returns {string} - The processed string.
 */
export const truncateDescription = (description, limit = 120) => {
  if (!description) return "";

  return description.length > limit
    ? `${description.substring(0, limit).trim()}...`
    : description;
};
