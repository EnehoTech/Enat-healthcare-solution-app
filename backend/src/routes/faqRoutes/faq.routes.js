import { Router } from "express";
import {
  createFaqController,
  deleteFaqController,
  getFaqByIdController,
  getFaqsController,
  updateFaqController,
} from "../../controllers/faqControllers/faq.controllers.js";
import {
  createFaqValidator,
  faqIdValidator,
  updateFaqValidator,
} from "../../validation/faq.validation.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";

//  Call the router method from express to create the router
const router = Router();

/**
 * @route   GET /api/faqs
 * @desc    Get all frequently asked questions.
 * @access  Public
 */
router.get("/faqs", getFaqsController);

/**
 * @route   GET /api/faqs/:faq_id
 * @desc    Get a specific FAQ by ID.
 * @access  Public
 */
router.get("/faqs/:faq_id", faqIdValidator, getFaqByIdController);

/**
 * @route   POST /api/faqs
 * @desc    Create a new FAQ.
 * @access  Private (Super Admin, Main Admin, PR Only)
 */
router.post(
  "/faqs",
  authn,
  authz(adminAndAbove),
  createFaqValidator,
  createFaqController,
);

/**
 * @route   PATCH /api/faqs/:faq_id
 * @desc    Update an existing FAQ by ID.
 * @access  Private (Super Admin, Main Admin, PR Only)
 */
router.patch(
  "/faqs/:faq_id",
  authn,
  authz(adminAndAbove),
  updateFaqValidator,
  updateFaqController,
);

/**
 * @route   DELETE /api/faqs/:faq_id
 * @desc    Delete an FAQ by ID (Soft delete).
 * @access  Private (Super Admin, Main Admin, PR Only)
 */
router.delete(
  "/faqs/:faq_id",
  authn,
  authz(adminAndAbove),
  faqIdValidator,
  deleteFaqController,
);

export default router;
