import { Router } from "express";
import {
  createTestimonialController,
  deleteTestimonialController,
  getTestimonialByIdController,
  getTestimonialsController,
  updateTestimonialController,
} from "../../controllers/testimonialControllers/testimonial.controllers.js";
import {
  createTestimonialValidator,
  testimonialIdValidator,
  updateTestimonialByIdValidator,
} from "../../validation/testimonial.validation.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";


//  Call the router method from express to create the router
const router = Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials
 * @access  Public
 */
router.get("/testimonials", getTestimonialsController);

/**
 * @route   GET /api/testimonials/:testimonial_id
 * @desc    Get a single testimonial by its ID
 * @access  Public
 */
router.get(
  "/testimonials/:testimonial_id",
  testimonialIdValidator,
  getTestimonialByIdController
);

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial with an optional avatar image
 * @access  Private (Admin and Above)
 */
router.post(
  "/testimonials",
  authn,
  authz(adminAndAbove),
  upload.single("testifier_avatar"),
  createTestimonialValidator,
  createTestimonialController
);

/**
 * @route   PATCH /api/testimonials/:testimonial_id
 * @desc    Update an existing testimonial's data and/or avatar image
 * @access  Private (Admin and Above)
 */
router.patch(
  "/testimonials/:testimonial_id",
  authn,
  authz(adminAndAbove),
  upload.single("testifier_avatar"),
  updateTestimonialByIdValidator,
  updateTestimonialController
);

/**
 * @route   DELETE /api/testimonials/:testimonial_id
 * @desc    Soft-delete a testimonial by ID
 * @access  Private (Admin and Above)
 */
router.delete(
  "/testimonials/:testimonial_id",
  authn,
  authz(adminAndAbove),
  testimonialIdValidator,
  deleteTestimonialController
);

export default router;
