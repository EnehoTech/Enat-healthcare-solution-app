import { publicAxios } from "../../../lib/apiSetup";


// A function to get all blog posts
export const getAllBlogs = async () => {
  try {
    const response = await publicAxios.get(`/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving blogs:", error);
    throw error;
  }
};

// A function to get a blog post by ID
export const getBlogById = async (blogId) => {
  try {
    const response = await publicAxios.get(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while retrieving blog with ID ${blogId}:`, error);
    throw error;
  }
};

// A function to create blog post
export const createBlog = async (formData) => {
  try {
    const response = await publicAxios.post(`/blogs`, formData);
    return response.data;
  } catch (error) {
    console.error("Error while creating blog post:", error);
    throw error; // Optional: rethrow the error for further handling
  }
};

// A function to update a blog post
export const updateBlog = async (blogId, formData) => {
  try {
    const response = await publicAxios.patch(`/blogs/${blogId}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error while updating blog with ID ${blogId}:`, error);
    throw error;
  }
};

// A function to delete a blog post
export const deleteBlog = async (blogId) => {
  try {
    const response = await publicAxios.delete(`/blogs/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};
