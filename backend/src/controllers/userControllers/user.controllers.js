import path from "path";
import {
    assignRoleService,
  createUserProfilePictureService,
  deleteUserProfilePictureService,
  getMaxOnboardingStageId,
  getOnboardingStageByUserIdService,
  getUserByIdService,
  getUserProfilePictureByIdService,
  getUserProfilePicturesService,
  getUserRoleByIdService,
  getUserRolesService,
  getUsersService,
  updateStageIdByUserIdService,
  updateUserProfilePictureByIdService,
} from "../../services/userServices/user.services.js";
import { getFileDestination, saveFile } from "../../utils/handleFileUpload.js";

// ? users controllers

/**
 * @function getUsersController
 * @description Controller to handle the request for retrieving all users ordered by most recently added
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUsersController = async (req, res) => {
  try {
    const users = await getUsersService();
    if (!users) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The request you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users data retrieved successfully.",
      data: { users },
    });
  } catch (error) {
    console.error("Error fetching all users data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function getUserByIdController
 * @description Controller to handle the request for retrieving single user details By Id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserByIdController = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Call the service to fetch user data
    const userData = await getUserByIdService(user_id);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The request you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully.",
      data: { user: userData },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// ? onboarding stage controllers
/**
 * Retrieves the onboarding stage of a specific user by user ID.
 * @param {Object} req - The request object containing the user ID in params.
 * @param {Object} res - The response object to send back the data.
 * @param {Function} next - The next middleware for error handling.
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs during the process.
 */
export const getOnboardingStageByUserIdController = async (req, res, next) => {
  try {
    // Authenticated user ID is available in req.user
    const { user_id } = req.user;

    // Call the service to fetch onboarding stage by user ID
    const onboardingStage = await getOnboardingStageByUserIdService(user_id);

    // If no onboarding stage is found, send a 404 response
    if (!onboardingStage) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The request stage Id you are looking for was not found.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "User onboarding stage retrieved successfully.",
      data: { onboarding_stage: onboardingStage },
    });
  } catch (error) {
    console.error("Error retrieving onboarding stage:", error);
    // Internal Server Error response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to update the stage_id for a user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */

export const updateStageIdByUserIdController = async (req, res, next) => {
  try {
    // Authenticated user ID is available in req.user
    const { user_id } = req.user;

    // 1. Get current onboarding_stage_id for the user
    const userProfileOnboardingStage = await getOnboardingStageByUserIdService(
      user_id
    );
    if (!userProfileOnboardingStage) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "User profile you are looking for was not found.",
      });
    }

    // 2. Get max onboarding_stage id
    const maxStageId = await getMaxOnboardingStageId();
    const currentStageId = userProfileOnboardingStage?.id;

    // 3. Prevent increment if already at max
    if (currentStageId >= maxStageId) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "User is already at the maximum onboarding stage.",
      });
    }

    // 4. Proceed with update
    // Call the service to fetch onboarding stage by user ID
    const updateStageId = await updateStageIdByUserIdService(user_id);

    // If no onboarding stage is found, send a 404 response
    if (!updateStageId) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The request Stage Id you are looking for was not found.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Onboarding stage Id updated successfully.",
      data: { user_profile_onboarding_stage_Id: updateStageId },
    });
  } catch (error) {
    console.error("Error updating stage Id:", error);
    // Internal Server Error response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// ? assign role controllers
/**
 * Controller to get all roles assigned to a specific user.
 * Sends the response with the list of roles in JSON format.
 * @async
 * @function getAllRoles
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getUserRolesController = async (req, res) => {
  try {
    const userRole = await getUserRolesService();
    if (!userRole) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The user roles you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Roles assigned to a user retrieved successfully.",
      data: { user_roles: userRole },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to get a specific role assigned to a user by user_role_id.
 * Sends the response with the role details in JSON format.
 * @async
 * @function  getUserRoleByIdController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getUserRoleByIdController = async (req, res) => {
  try {
    const { user_role_id } = req.params;
    const userRole = await getUserRoleByIdService(user_role_id);

    // If the userRole is not found, return a 404 response
    if (!userRole) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The user role you are looking for was not found.",
      });
    }

    // If the userRole is found, return a 200 response
    return res.status(200).json({
      success: true,
      message: "User role retrieved successfully.",
      data: { user_role: userRole },
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to assign a new role to a user by user_role_id.
 * Sends the response indicating success or failure.
 * @async
 * @function assignRole
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const assignRoleController = async (req, res) => {
  try {
    const { user_role_id } = req.params;
    const { app_role_id } = req.body;
    //  authenticated user ID is available in req.user
    const updatedBy = req.user.user_id;
    const assignNewRole = await assignRoleService(
      user_role_id,
      app_role_id,
      updatedBy
    );
    if (!assignNewRole) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The user role you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Role assigned to user successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

//? user profile picture controllers

/**
 * @function getUserProfilePicturesController
 * @description Retrieves all user profile pictures and sends the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends profile pictures or an error response.
 */
export const getUserProfilePicturesController = async (req, res) => {
  try {
    const profilePictures = await getUserProfilePicturesService();
    if (!profilePictures) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The profile picture you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User profile picture retrieved successfully.",
      data: { profile_pictures: profilePictures },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function getUserProfilePictureByIdController
 * @description Retrieves a single user profile picture by its ID and sends the response.
 * @param {Object} req - Express request object containing avatar_id as a path parameter.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the profile picture or an error response.
 */
export const getUserProfilePictureByIdController = async (req, res) => {
  try {
    const { avatar_id } = req.params;
    const profilePicture = await getUserProfilePictureByIdService(avatar_id);
    if (!profilePicture) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The profile picture you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User profile picture retrieved successfully.",
      data: { profile_picture: profilePicture },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function createUserProfilePictureController
 * @description Handles uploading or updating a profile picture for a user.
 * @param {Object} req - Express request object, containing user ID and uploaded file.
 * @param {Object} res - Express response object.
 * @returns {void}
 * @throws {Error} If an error occurs during profile picture upload or update.
 * @example
 * app.post('/users/avatar', createUserProfilePictureController);
 */
export const createUserProfilePictureController = async (req, res) => {
  try {
    // Authenticated user ID is available in req.user
    const { user_id } = req.user;

    // 1. Get current onboarding_stage_id for the user
    const userProfileOnboardingStage = await getOnboardingStageByUserIdService(
      user_id
    );
    if (!userProfileOnboardingStage) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "User profile you are looking for was not found.",
      });
    }

    // 2. Get max onboarding_stage id
    const maxStageId = await getMaxOnboardingStageId();
    const currentStageId = userProfileOnboardingStage?.id;

    // 3. Prevent increment if already at max
    if (currentStageId >= maxStageId) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "User is already at the maximum onboarding stage.",
      });
    }

    const file = req.file;
    let filePath = null;

    // If the user uploaded a file, handle file saving
    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "profile_picture"
      );
      filePath = await saveFile(file, destination, `u-avatar-${user_id}`, "pp");
    }
    // Create or update the user profile picture entry in the database

    const profilePicture = await createUserProfilePictureService({
      userId: user_id,
      profilePicture: filePath, // Can be null if the user skips uploading an avatar
    });

    // Prepare the response data
    const responseData = {
      id: profilePicture.id,
      user_id: profilePicture.user_id,
      profile_picture: profilePicture?.profile_picture,
    };

    return res.status(201).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: { profilePicture: responseData },
    });
  } catch (error) {
    console.log("error while uploading profile picture", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function updateUserProfilePictureByIdController
 * @description Updates the user's profile picture based on the provided avatar ID. Saves the uploaded file and updates the profile picture path if applicable.
 * @param {Object} req - Express request object containing user ID, avatar ID, and the file (optional).
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends the updated profile picture or an error response.
 */
export const updateUserProfilePictureByIdController = async (req, res) => {
  try {
    // avatar Id from request parameter
    const { avatar_id } = req.params;
    // Authenticated user ID is available in req.user
    const { user_id } = req.user;

    const file = req.file;
    let filePath = null;
    // If the user uploaded a file, handle file saving
    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "profile_picture"
      );
      filePath = await saveFile(file, destination, `u-avatar-${user_id}`, "pp");
    }
    const updatedProfilePicture = await updateUserProfilePictureByIdService({
      avatarId: avatar_id,
      userId: user_id,
      profilePicture: filePath, // Can be null if the user skips uploading an avatar
    });
    if (!updatedProfilePicture) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message:
          "The user or profile picture you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: { profile_picture: updatedProfilePicture },
    });
  } catch (error) {
    console.log("Error while updating profile", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @function deleteUserProfilePictureController
 * @description Deletes the user's profile picture based on the provided avatar ID. If the profile picture exists, it will be removed.
 * @param {Object} req - Express request object containing user ID and avatar ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a success message if the profile picture is deleted, or an error response if not found or if an internal error occurs.
 */
export const deleteUserProfilePictureController = async (req, res) => {
  try {
    // avatar Id from request parameter
    const { avatar_id } = req.params;
    // Authenticated user ID is available in req.user
    const { user_id } = req.user;
    const deletedProfilePicture = await deleteUserProfilePictureService(
      avatar_id,
      user_id
    );
    if (!deletedProfilePicture) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The profile picture you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile picture remove successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
