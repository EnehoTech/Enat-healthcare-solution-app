import { protectedAxios } from "../../../lib/apiSetup";

/**
 * @function imageGalleryByUserIdService
 * @description Fetches the image gallery for a specific user, filtered by image type.
 * @param {number|string} userId - The unique ID of the user (e.g., 1).
 * @param {string} type - The category of images to retrieve (e.g., 'blog').
 * @returns {Promise<Object>} A promise that resolves to the gallery data.
 * @throws {Error} Throws an error if the request fails.
 */
export const imageGalleryByUserIdService = async (userId, type) => {
  try {
    // We use the 'params' object in Axios to handle query strings (?type=blog) cleanly
    const response = await protectedAxios.get(`/gallery/users/${userId}`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching gallery for user ${userId} with type ${type}:`,
      error
    );
    throw error;
  }
};


/**
 * @function getAllGalleryImagesService
 * @description Retrieves a list of all non-deleted gallery images. 
 * Supports optional filtering by image type.
 * @param {string} [type] - Optional filter: 'BLOG' or 'BLOG_DETAIL'.
 * @returns {Promise<Object>} The API response containing the array of images.
 * @throws {Error} Throws an error if the request fails.
 */
export const getAllGalleryImagesService = async (type = "") => {
  try {
    // We pass the type as a query parameter (?type=...)
    const response = await protectedAxios.get("/gallery", {
      params: type ? { type } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error while retrieving gallery images:", error);
    throw error;
  }
};


/**
 * @function getImageByIdService
 * @description Retrieves full metadata for a single gallery image.
 * @param {number|string} imageId - The unique ID of the image gallery record.
 * @returns {Promise<Object>} The image metadata.
 */
export const getImageByIdService = async (imageId) => {
  try {
    const response = await protectedAxios.get(`/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching image ID [${imageId}]:`, error);
    throw error;
  }
};

/**
 * @function createGalleryImageService
 * @description Sends image data to the gallery endpoint.
 * @param {FormData} formData - The prepared FormData containing image, name, and type.
 * @returns {Promise<Object>} The created image record.
 */
export const createGalleryImageService = async (formData) => {
  try {
    const response = await protectedAxios.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    throw error;
  }
};

/**
 * @function updateGalleryImageService
 * @description Updates gallery metadata or replaces the physical file.
 * @param {number|string} imageId - ID of the record to update.
 * @param {FormData} formData - The prepared FormData with updated fields.
 * @returns {Promise<Object>} The updated image record.
 */
export const updateGalleryImageService = async (imageId, formData) => {
  try {
    const response = await protectedAxios.patch(`/gallery/${imageId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating gallery image [${imageId}]:`, error);
    throw error;
  }
};

/**
 * @function deleteGalleryImageService
 * @description Soft-deletes an image from the gallery.
 * @param {number|string} imageId - The unique ID of the image.
 * @returns {Promise<Object>} Success message.
 */
export const deleteGalleryImageService = async (imageId) => {
  try {
    const response = await protectedAxios.delete(`/gallery/${imageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting gallery image [${imageId}]:`, error);
    throw error;
  }
};