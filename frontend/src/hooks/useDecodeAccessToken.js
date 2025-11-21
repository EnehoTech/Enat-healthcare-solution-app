/**
 * Function to decode the payload from a JWT access token.
 * This function extracts the payload part of the token, decodes it from base64,
 * and returns the decoded JSON object. If any error occurs during the decoding process,
 * it catches the error and returns null.
 *
 * @param {string} token - The JWT access token to be decoded.
 * @returns {Object|null} - The decoded payload as a JSON object, or null if decoding fails.
 */
export const decodeAccessToken = (token) => {
  try {
    // Extract the payload part of the JWT token (the second part of the token string)
    const base64Url = token.split('.')[1];
  
    // Replace URL-safe characters with standard base64 characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the base64-encoded string and convert it to a JSON object
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    // Parse the decoded string as JSON and return the resulting object
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Log any errors that occur during decoding and return null
    console.error('Error decoding access token:', error);
    return null;
  }
};

