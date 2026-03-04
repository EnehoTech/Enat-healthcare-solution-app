import { Router } from "express";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
import {
  createDoctorValidator,
  doctorIdValidator,
  updateDoctorValidator,
} from "../../validation/doctor.validation.js";
import {
  createDoctorController,
  deleteDoctorController,
  getAllDoctorsSelectorController,
  getDoctorByIdController,
  getDoctorsController,
  updateDoctorController,
} from "../../controllers/doctorControllers/doctor.controllers.js";

//  Call the router method from express to create the router
const router = Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all active doctors with full profiles and social handles.
 * @access  Public
 */
router.get("/doctors", getDoctorsController);



/**
 * @route   GET /api/selectors/doctors
 * @desc    Get raw doctor table data (IDs, Specialty, etc.) for selection components
 * @access  Public
 */
router.get("/selectors/doctors", getAllDoctorsSelectorController);

/**
 * @route   GET /api/doctors/:doctor_id
 * @desc    Get specific doctor details by ID.
 * @access  Public
 */
router.get("/doctors/:doctor_id", doctorIdValidator, getDoctorByIdController);

/**
 * @route   POST /api/doctors
 * @desc    Create a new doctor profile.
 * @access  Private (Admin Only)
 */
router.post(
  "/doctors",
  authn,
  authz(adminAndAbove),
  upload.single("doctor_picture"),
  createDoctorValidator,
  createDoctorController,
);

/**
 * @route   PATCH /api/doctors/:doctor_id
 * @desc    Update doctor profile and metadata.
 * @access  Private (Admin Only)
 */
router.patch(
  "/doctors/:doctor_id",
  authn,
  authz(adminAndAbove),
  upload.single("doctor_picture"),
  updateDoctorValidator,
  updateDoctorController,
);

/**
 * @route   DELETE /api/doctors/:doctor_id
 * @desc    Soft delete a doctor profile.
 * @access  Private (Admin Only)
 */
router.delete(
  "/doctors/:doctor_id",
  authn,
  authz(adminAndAbove),
  doctorIdValidator,
  deleteDoctorController,
);

export default router;