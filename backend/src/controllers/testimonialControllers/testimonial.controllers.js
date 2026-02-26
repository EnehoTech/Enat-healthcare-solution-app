import path from "path";
import {
  createTestimonialService,
  deleteTestimonialService,
  getTestimonialByIdService,
  getTestimonialsService,
  updateTestimonialService,
} from "../../services/testimonialServices/testimonial.services.js";
import { getFileDestination, saveFile } from "../../utils/handleFileUpload.js";
import { generateRandomUniqueHexColor } from "../../utils/generateUniqueHexColor.js";

/**
 * Controller to get all testimonials.
 * @function getTestimonialsController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with all testimonials.
 */
export const getTestimonialsController = async (req, res) => {
  try {
    const testimonials = await getTestimonialsService();
    return res.status(200).json({
      success: true,
      message: "Testimonials retrieved successfully.",
      data: { testimonials: testimonials },
    });
  } catch (error) {
    console.error("Error while retrieving testimonials:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to get a specific testimonial by ID.
 * @function getTestimonialByIdController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with the testimonial.
 */
export const getTestimonialByIdController = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    const testimonial = await getTestimonialByIdService(testimonial_id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The testimonial you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial retrieved successfully.",
      data: { testimonials: testimonial },
    });
  } catch (error) {
    console.error("Error while retrieving testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to create a new testimonial.
 * @function createTestimonialController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with the created testimonial.
 */
export const createTestimonialController = async (req, res) => {
  try {
    const { testimonial_text, full_name, job_title } = req.body;
    const file = req.file;

    let filePath = null;

    // Handle avatar upload if provided
    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "testifier_avatar",
      );
      filePath = await saveFile(file, destination, `testifier`, "avatar");
    }
    const bg_color = generateRandomUniqueHexColor();

    const newTestimonial = await createTestimonialService({
      testimonial_text,
      full_name,
      job_title,
      testifier_avatar: filePath,
      bg_color,
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: { testimonials: newTestimonial },
    });
  } catch (error) {
    console.error("Error while creating testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to update a specific testimonial.
 * @function updateTestimonialController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with the updated testimonial.
 */
export const updateTestimonialController = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    const { testimonial_text, full_name, job_title } = req.body;
    const file = req.file;

    let filePath = null;

    // Handle avatar upload if provided
    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "testifier_avatar",
      );
      filePath = await saveFile(file, destination, `testifier`, "avatar");
    }

    const updatedTestimonial = await updateTestimonialService(testimonial_id, {
      testimonial_text,
      full_name,
      job_title,
      testifier_avatar: filePath,
    });

    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The testimonial you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: { testimonials: updatedTestimonial },
    });
  } catch (error) {
    console.error("Error while updating testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to delete a specific testimonial.
 * @function deleteTestimonialController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response with deletion success message.
 */
export const deleteTestimonialController = async (req, res) => {
  try {
    const { testimonial_id } = req.params;
    const deleted = await deleteTestimonialService(testimonial_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The testimonial you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Error while deleting testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
