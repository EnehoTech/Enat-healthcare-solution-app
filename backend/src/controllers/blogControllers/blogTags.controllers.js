import { getAllTagsService } from "../../services/blogServices/blogTags.services.js";

/**
 * @controller getAllTagsController
 * @description Handles the request to fetch all active tags (non-deleted).
 */
export const getAllTagsController = async (req, res) => {
  try {
    // Optional query parameter for searching by tag name
    const { q } = req.query;

    // Call service with normalized search query
    const tags = await getAllTagsService(q?.toString()?.trim());

    return res.status(200).json({
      success: true,
      message: "Tags retrieved successfully.",
      data: { tags },
    });
  } catch (error) {
    // 1. Log the full error internally for developers
    console.error("Error while retrieving tags:", error);

    // 2. Return a structured error response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
