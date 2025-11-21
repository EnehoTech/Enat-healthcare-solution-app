import { protectedAxios, publicAxios } from "../../../lib/apiSetup";

/**
 * Sends a POST request to create a new user account.
 * @param {Object} data - The data for creating the user account.
 * @returns {Object} - The response data from the API.
 * @throws {Error} - If the request fails.
 */
export const signUpService = async (data) => {
  try {
    const response = await publicAxios.post(`/auth/sign-up`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user account:", error);
    throw error;
  }
};

/**
 * Sends a POST request to sign in a user.
 * @param {Object} data - The data for user sign-in, including email and password.
 * @returns {Object} - The response data from the API containing user details and access token.
 * @throws {Error} - If the sign-in request fails or returns an error.
 */

// A function to send POST request for user sign-in
export const signInService = async (data) => {
  try {
    const response = await publicAxios.post(`/auth/sign-in`, data);
    return response.data;
  } catch (error) {
    console.error("Error while sign in:", error);
    // Handle error as needed or rethrow for further handling
    throw error;
  }
};

/**
 * Removes the user access token from the browser's local storage.
 * @returns {void} - Clears the stored access token and logs the user out.
 */
export const signOutService = () => {
  try {
    // Remove the access token from local storage
    localStorage.removeItem("_u_at_i");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};




// A function to upload profile picture
export const uploadProfilePictureService = async (formData) => {
  try {
    const response = await protectedAxios.post(`/users/pp/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while uploading profile picture:", error);
    throw error; // Optional: rethrow the error for further handling
  }
};

// A function to update stage Id on user_profile table
export const updateUserOnboardingStageService = async () => {
  try {
    const response = await protectedAxios.patch(
      `/users/onboarding/stage-id`
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating user onboarding stage:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};
