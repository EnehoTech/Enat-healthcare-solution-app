import { v4 as uuidv4 } from "uuid";

/**
 * @function generateUniqueHash
 * @description Generates a unique 16-character hash using UUID.
 * @returns {string} A 16-character unique hash.
 */
export const generateUniqueHash = () => {
  const uuid = uuidv4().replace(/-/g, ""); // Remove hyphens from the UUID
  return uuid.slice(0, 16); // Return the first 16 characters
};
