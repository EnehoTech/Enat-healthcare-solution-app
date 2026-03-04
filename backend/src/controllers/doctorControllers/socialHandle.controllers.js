import {
  createSocialHandleService,
  deleteSocialHandleService,
  getAllSocialPlatformsService,
  getSocialHandleByIdService,
  getSocialHandlesByDoctorIdService,
  updateSocialHandleService,
} from "../../services/doctorServices/socialHandle.services.js";

/**
 * @controller getAllSocialPlatformsController
 * @description Retrieves all social media platforms that are not soft-deleted.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllSocialPlatformsController = async (req, res) => {
  try {
    const platforms = await getAllSocialPlatformsService();

    return res.status(200).json({
      success: true,
      message: "Social platforms retrieved successfully.",
      data: { social_platforms: platforms },
    });
  } catch (error) {
    console.error("Error while retrieving social platforms:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller getSocialHandleByIdController
 * @description Retrieves a single social handle's details (joined with platform info) by its ID.
 */
export const getSocialHandleByIdController = async (req, res) => {
  try {
    const { handle_id } = req.params;

    const handle = await getSocialHandleByIdService(handle_id);

    if (!handle) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "doctor Social handle you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "doctor Social handle retrieved successfully.",
      data: { social_handle: handle },
    });
  } catch (error) {
    console.error("error while retrieving doctor social handle By Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @description Fetches all handles for a specific doctor
 */
export const getSocialHandlesByDoctorIdController = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const handles = await getSocialHandlesByDoctorIdService(doctor_id);
    if (!handles) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "doctor Social handles you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "doctor Social handles retrieved successfully.",
      data: { social_handles: handles },
    });
  } catch (error) {
    console.error("error while retrieving doctor social handles:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @description Controller to create a doctor social handle
 */
export const createSocialHandleController = async (req, res) => {
  try {
    const shPayload = req.body;
    const newHandle = await createSocialHandleService(shPayload);
    return res.status(201).json({
      success: true,
      message: "Social handle created successfully.",
      data: newHandle,
    });
  } catch (error) {
    console.error("error while creating social handle:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @description Updates a specific handle
 */
export const updateSocialHandleController = async (req, res) => {
  try {
    const { handle_id } = req.params;
    const updateSHPayload = req.body;
    const updatedSocialHandle = await updateSocialHandleService(
      handle_id,
      updateSHPayload,
    );
    if (!updatedSocialHandle)
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "doctor Social handles you are looking for was not found.",
      });
    return res.status(200).json({
      success: true,
      message: "Doctor Social handle updated successfully.",
      data: { social_handle: updatedSocialHandle },
    });
  } catch (error) {
    console.error("error while updating doctor social handle:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller deleteSocialHandleController
 * @description Soft-deletes a doctor's social handle using the transaction pattern.
 */
export const deleteSocialHandleController = async (req, res) => {
  try {
    const { handle_id } = req.params;

    const result = await deleteSocialHandleService(handle_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Doctor Social handle you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Social handle deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("error while deleting doctor social handle:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
