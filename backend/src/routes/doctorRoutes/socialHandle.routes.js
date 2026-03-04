import { Router } from "express";
import {
  createSocialHandleController,
  deleteSocialHandleController,
  getAllSocialPlatformsController,
  getSocialHandleByIdController,
  getSocialHandlesByDoctorIdController,
  updateSocialHandleController,
} from "../../controllers/doctorControllers/socialHandle.controllers.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";
import {
  createSocialHandleValidator,
  handleIdValidator,
  updateSocialHandleValidator,
} from "../../validation/socialHandle.validation.js";
import { doctorIdValidator } from "../../validation/doctor.validation.js";

//  Call the router method from express to create the router
const router = Router();

/**
 * @route   GET /api/social-platforms
 * @desc    Get all active social media platforms for lookup
 * @access  Public
 */
router.get("/social-platforms", authn, getAllSocialPlatformsController);

/**
 * @route   GET /api/doctor-social/:handle_id
 * @desc    Get a single social handle's details by ID
 * @access  Public
 */
router.get(
  "/doctor-social/:handle_id",
  authn,
  handleIdValidator,
  getSocialHandleByIdController,
);

/**
 * @route   GET /api/doctor-social/doctor/:doctor_id
 * @desc    Retrieve all social handles for a specific doctor
 * @access  Public
 */
router.get(
  "/doctor-social/doctor/:doctor_id",
  authn,
  doctorIdValidator,
  getSocialHandlesByDoctorIdController,
);

/**
 * @route   POST /api/doctor-social
 * @desc    Add a new social media handle to a doctor profile
 * @access  Private (Admin Only)
 */
router.post(
  "/doctor-social",
  authn,
  authz(adminAndAbove),
  createSocialHandleValidator,
  createSocialHandleController,
);

/**
 * @route   PATCH /api/doctor-social/:handle_id
 * @desc    Update an existing social handle's information
 * @access  Private (Admin Only)
 */
router.patch(
  "/doctor-social/:handle_id",
  authn,
  authz(adminAndAbove),
  updateSocialHandleValidator,
  updateSocialHandleController,
);

/**
 * @route   DELETE /api/doctor-social/:handle_id
 * @desc    Soft-delete a social handle record
 * @access  Private (Admin Only)
 */
router.delete(
  "/doctor-social/:handle_id",
  authn,
  authz(adminAndAbove),
  handleIdValidator,
  deleteSocialHandleController,
);

export default router;
