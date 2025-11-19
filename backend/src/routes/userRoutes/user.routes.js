import { Router } from "express";
import {
  assignRoleController,
  createUserProfilePictureController,
  deleteUserProfilePictureController,
  getOnboardingStageByUserIdController,
  getUserByIdController,
  getUserProfilePictureByIdController,
  getUserProfilePicturesController,
  getUserRoleByIdController,
  getUserRolesController,
  getUsersController,
  updateStageIdByUserIdController,
  updateUserProfilePictureByIdController,
} from "../../controllers/userControllers/user.controllers.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
import {
  getUserByIdValidator,
  userProfilePictureByIdValidator,
  userRoleIdValidator,
} from "../../validation/user.validation.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";
// Call the router method from express to create the router
const router = Router();

// ? users Routes
// get all users data
router.get("/users/", authn, getUsersController);
// get a single user data By Id
router.get(
  "/users/:user_id",
  authn,
  getUserByIdValidator,
  getUserByIdController
);

//? onboarding Routes
// Get a user's onboarding stage by user ID
router.get(
  "/users/onboarding/stage",
  authn,
  getOnboardingStageByUserIdController
);

// update a user profile stage Id by user ID
router.patch(
  "/users/onboarding/stage-id",
  authn,
  updateStageIdByUserIdController
);

// ? assign  role for user routes
// Route to get all roles assigned to a user
router.get(
  "/users/assign/user-roles",
  authn,
  authz(adminAndAbove),
  getUserRolesController
);

// Route to get a specific role assigned to a user.
router.get(
  "/users/assign/user-roles/:user_role_id",
  authn,
  authz(adminAndAbove),
  userRoleIdValidator,
  getUserRoleByIdController
);

// Route to assign a new role to a user.
router.patch(
  "/users/assign/user-roles/:user_role_id",
  authn,
  authz(adminAndAbove),
  userRoleIdValidator,
  assignRoleController
);

//? user profile picture routes
// Get all user profile pictures
router.get("/users/pp/avatar", authn, getUserProfilePicturesController);
// Get a user's profile picture by ID
router.get(
  "/users/pp/avatar/:avatar_id",
  authn,
  userProfilePictureByIdValidator,
  getUserProfilePictureByIdController
);
// Upload a new profile picture for a user
router.post(
  "/users/pp/avatar",
  authn,
  upload.single("profile_picture"),
  createUserProfilePictureController
);
// Update a user's profile picture
router.patch(
  "/users/pp/avatar/:avatar_id",
  authn,
  upload.single("profile_picture"),
  userProfilePictureByIdValidator,
  updateUserProfilePictureByIdController
);

// Delete a user's profile picture
router.delete(
  "/users/pp/avatar/:avatar_id",
  authn,
  userProfilePictureByIdValidator,
  deleteUserProfilePictureController
);

export default router;
