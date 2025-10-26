import { publicAxios } from "../lib/apiSetup";

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
