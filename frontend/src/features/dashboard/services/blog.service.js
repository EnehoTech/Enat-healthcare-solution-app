import { protectedAxios, publicAxios } from "../../../lib/apiSetup";

// A function to get all blog posts
export const getAllBlogsService = async () => {
  try {
    const response = await publicAxios.get(`/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving blogs:", error);
    throw error;
  }
};

// A function to get a blog post by ID
export const getBlogByIdService = async (blogId) => {
  try {
    const response = await publicAxios.get(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while retrieving blog with ID ${blogId}:`, error);
    throw error;
  }
};

// A function to create blog post
export const createBlogService = async (formData) => {
  try {
    const response = await protectedAxios.post(`/blogs`, formData);
    return response.data;
  } catch (error) {
    console.error("Error while creating blog post:", error);
    throw error; // Optional: rethrow the error for further handling
  }
};

// A function to update a blog post
export const updateBlogService = async (blogId, formData) => {
  try {
    const response = await protectedAxios.patch(`/blogs/${blogId}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error while updating blog with ID ${blogId}:`, error);
    throw error;
  }
};

// A function to delete a blog post
export const deleteBlogService = async (blogId) => {
  try {
    const response = await protectedAxios.delete(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};

/**
 * @function getBlogByUserIdService
 * @description Retrieves up to 20 recent blog titles for a specific user.
 * Optional title search supported.
 * @param {number|string} userId - The user ID.
 * @param {string} [q] - Optional search keyword for blog_title.
 * @returns {Promise<Object>} API response containing blog titles.
 * @throws {Error} Throws if the request fails.
 */
export const getBlogByUserIdService = async (userId, q = "") => {
  try {
    const response = await protectedAxios.get(`/blogs/users/${userId}`, {
      params: q ? { q } : {},
    });

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching blog titles for user [${userId}] with query [${q}]:`,
      error,
    );
    throw error;
  }
};
