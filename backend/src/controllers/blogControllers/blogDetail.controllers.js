
import { createBlogDetailService, deleteBlogDetailByHashService, getAllBlogDetailsService, getBlogDetailByHashService, updateBlogDetailByHashService } from "../../services/blogServices/blogDetail.services.js";
import { generateUniqueHash } from "../../utils/generateUniqueHash.js";


/**
 * @function getAllBlogDetailsController
 * @description Controller: Get all blog_details with associations.
 * Maps to: 200 | 400 | 401 | 403 | 500 (per your docs; auth/forbidden handled by upstream middlewares if any)
 */
export const getAllBlogDetailsController = async (req, res) => {
  try {
    const blogDetails = await getAllBlogDetailsService();
    return res.status(200).json({
      success: "true",
      message: "Blog details retrieved successfully.",
      data: { blog_details: blogDetails },
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function getBlogDetailByHashController
 * @description Controller: Get a single blog_detail by hash.
 * Maps to: 200 | 400 | 404 | 500
 */
export const getBlogDetailByHashController = async (req, res) => {
  try {
    const { blog_detail_hash } = req.params;
    const blogDetail = await getBlogDetailByHashService(blog_detail_hash);

    if (!blogDetail) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog detail you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: "true",
      message: "Blog detail retrieved successfully.",
      data: { blog_detail: blogDetail },
    });
  } catch (error) {
    console.error("Error fetching blog detail by hash:", error);
    const status = error.httpStatus || 500;
    return res.status(status).json({
      success: false,
      error: status === 400 ? "Bad Request" : "Internal Server Error",
      message:
        error.userMessage ||
        (status === 400
          ? "Provided parameter is invalid."
          : "Something went wrong! Please try again later."),
    });
  }
};


/**
 * @function createBlogDetailController
 * @description Controller for creating a blog detail record with related tags, images, and related posts.
 * Matches the 201/4xx/5xx responses defined in your API docs.
 */
export const createBlogDetailController = async (req, res) => {
  try {
    // request body data
    const blogDetailData = req.body;
    // Generate a unique hash for the blog detail
    const hash = generateUniqueHash();

    // Add the generated hash to blogDetailData
    blogDetailData.hash = hash;

    const newBlogDetail = await createBlogDetailService(blogDetailData);
    // Check if the blog detail was created successfully
    if (!newBlogDetail) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "Blog not found for provided blogId.",
      });
    }
    // Successful creation response
    return res.status(201).json({
      success: "true",
      message: "Blog detail created successfully.",
      data: { blog_detail: newBlogDetail },
    });
  } catch (error) {
    // Custom error handling based on error message
    if (
      error.message === "A blog detail with these details already exists." ||
      error.message === "Failed to insert blog_detail." ||
      error.message === "One or more tag_id values do not exist." ||
      error.message === "One or more related blog_id values do not exist."
    ) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: error.message,
      });
    }
    // Fallback for unexpected errors
    console.error("Error while creating blog detail:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function updateBlogDetailByHashController
 * @description Controller: Patch (partial update) blog_detail by hash.
 * Replaces tags/images/related_blog_posts when those arrays are provided.
 * Maps to: 200 | 400 | 404 | 409 | 500
 */
export const updateBlogDetailByHashController = async (req, res) => {
  try {
    const { blog_detail_hash } = req.params;
    const updateBlogDetailData = req.body; // partial payload

    const updatedBlogDetail = await updateBlogDetailByHashService(
      blog_detail_hash,
      updateBlogDetailData
    );

    if (!updatedBlogDetail) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog detail you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: "true",
      message: "Blog detail updated successfully.",
      data: { blog_detail: updatedBlogDetail },
    });
  } catch (error) {
    console.error("Error updating blog detail:", error);
    const status = error.httpStatus || 500;
    const errorName =
      status === 400
        ? "Bad Request"
        : status === 409
        ? "Conflict"
        : "Internal Server Error";
    return res.status(status).json({
      success: false,
      error: errorName,
      message:
        error.userMessage ||
        (status === 400
          ? "Provided parameter is invalid."
          : status === 409
          ? "The update caused a conflict in the blog detail data."
          : "Something went wrong! Please try again later."),
    });
  }
};

/**
 * @function deleteBlogDetailByHashController
 * @description Controller: Delete blog_detail by hash (FKs cascade children).
 * Maps to: 200 | 400 | 404 | 500
 */
export const deleteBlogDetailByHashController = async (req, res) => {
  try {
    const { blog_detail_hash } = req.params;
    const deleted = await deleteBlogDetailByHashService(blog_detail_hash);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The blog detail you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: "true",
      message: "Blog detail deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting blog detail:", error);
    const status = error.httpStatus || 500;
    return res.status(status).json({
      success: false,
      error: status === 400 ? "Bad Request" : "Internal Server Error",
      message:
        error.userMessage ||
        (status === 400
          ? "Provided parameter is invalid."
          : "Something went wrong! Please try again later."),
    });
  }
};
