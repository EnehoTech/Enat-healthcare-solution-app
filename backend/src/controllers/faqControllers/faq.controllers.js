import {
  createFaqService,
  deleteFaqService,
  getFaqByIdService,
  getFaqsService,
  updateFaqService,
} from "../../services/faqServices/faq.services.js";

/**
 * @function getFaqsController
 * @description Handles the retrieval of all FAQs.
 */
export const getFaqsController = async (req, res) => {
  try {
    const faqs = await getFaqsService();
    return res.status(200).json({
      success: true,
      message: "FAQs retrieved successfully.",
      data: { faqs: faqs },
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function getFaqByIdController
 * @description Handles the retrieval of a specific FAQ by ID.
 */
export const getFaqByIdController = async (req, res) => {
  try {
    const { faq_id } = req.params;
    const faq = await getFaqByIdService(faq_id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The FAQ you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "FAQ retrieved successfully.",
      data: { faqs: faq },
    });
  } catch (error) {
    console.error("Error fetching FAQ by ID:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function createFaqController
 * @description Handles the creation of a new FAQ.
 */
export const createFaqController = async (req, res) => {
  try {
    const newFaq = await createFaqService(req.body);
    return res.status(201).json({
      success: true,
      message: "FAQ created successfully.",
      data: { faqs: newFaq },
    });
  } catch (error) {
    console.error("Error while creating FAQ:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function updateFaqController
 * @description Handles the update of a specific FAQ.
 */
export const updateFaqController = async (req, res) => {
  try {
    const { faq_id } = req.params;
    const updatedFaq = await updateFaqService(faq_id, req.body);
    if (!updatedFaq) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The FAQ you are trying to update was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully.",
      data: { faqs: updatedFaq },
    });
  } catch (error) {
    console.error("Error while updating FAQ:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function deleteFaqController
 * @description Handles the deletion of a specific FAQ.
 */
export const deleteFaqController = async (req, res) => {
  try {
    const { faq_id } = req.params;
    const deleted = await deleteFaqService(faq_id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The FAQ you are trying to delete was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
