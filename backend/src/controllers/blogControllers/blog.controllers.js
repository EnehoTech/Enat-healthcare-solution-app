import {
  createBlogService,
  deleteBlogByIdService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogByIdService,
} from "../../services/blogServices/blog.services.js";

/**
 * Controller to get all blogs.
 */
export const getAllBlogsController = async (req, res) => {
  try {
    const blogs = await getAllBlogsService();
    return res.status(200).json({
      success: true,
      message: "Blogs retrieved successfully.",
      data: { blogs: blogs },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to get a blog by ID.
 */
export const getBlogByIdController = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const blog = await getBlogByIdService(blog_id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blog retrieved successfully.",
      data: { blogs: blog },
    });
  } catch (error) {
    console.error("Error while fetching blog by Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function createBlogController
 * @description Handles creating a new blog with image upload.
 * @param {Object} req - Express request object, containing user ID and requested data.
 * @param {Object} res - Express response object.
 * @returns {void}
 * @throws {Error} If an error occurs during blog creation or image upload.
 */
export const createBlogController = async (req, res) => {
  try {
    // request body
    const { user_id, blog_img, blog_title, blog_description } = req.body;

    // Call service to create new blog
    const newBlog = await createBlogService({
      user_id,
      blog_img,
      blog_title,
      blog_description,
    });
    if (!newBlog) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "Inserted blog not found.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: { blogs: newBlog },
    });
  } catch (error) {
    console.error("Error while creating blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function updateBlogController
 * @description Handles updating a blog with optional image upload.
 * @param {Object} req - Express request object, containing blog ID and updated data.
 * @param {Object} res - Express response object.
 * @returns {void}
 * @throws {Error} If an error occurs during blog update or image upload.
 */
export const updateBlogByIdController = async (req, res) => {
  try {
    // Authenticated user ID is available in req.user
    const { blog_id } = req.params;
    const { user_id, blog_img, blog_title, blog_description } = req.body;

    // Call service to update blog
    const updatedBlog = await updateBlogByIdService(blog_id, {
      blog_img,
      blog_title,
      blog_description,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: { blogs: updatedBlog },
    });
  } catch (error) {
    console.error("Error while updating blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to delete a blog by ID.
 */
export const deleteBlogByIdController = async (req, res) => {
  try {
    const { blog_id } = req.params;
    const deleted = await deleteBlogByIdService(blog_id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Error while deleting blog:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
