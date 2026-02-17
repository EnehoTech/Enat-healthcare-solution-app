import { Router } from "express";
import {
  createImageGalleryController,
  deleteImageGalleryController,
  getImageGalleryByIdController,
  getImageGalleryController,
  getImagesByUserIdController,
  updateImageGalleryController,
} from "../../controllers/imageGalleryControllers/imageGallery.controllers.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/uploadMiddleware.js";

import {
  createImageGalleryValidator,
  getImagesByUserIdValidator,
  imageGalleryIdValidator,
} from "../../validation/imageGallery.validation.js";
import { adminAndAbove } from "../../utils/authzRoles.js";
// Call the router method from express to create the router
const router = Router();

/**
 * @route GET /gallery - Get all images (Optional ?type= filter)
 *
 */
router.get("/gallery", authn, getImageGalleryController);

/** @route GET /gallery/:id - Get specific image by ID */
router.get(
  "/gallery/:image_gallery_id",
  authn,
  imageGalleryIdValidator,
  getImageGalleryByIdController,
);

/** @route GET /gallery/users/:user_id - Get recent 20 images for a user (Admin+) */
router.get(
  "/gallery/users/:user_id",
  authn,
  authz(adminAndAbove),
  getImagesByUserIdValidator,
  getImagesByUserIdController,
);

/** @route POST /gallery - Upload new image to master library (Admin+) */
router.post(
  "/gallery",
  authn,
  authz(adminAndAbove),
  upload.single("image_url"),
  createImageGalleryValidator,
  createImageGalleryController,
);

/** @route PATCH /gallery/:id - Update image metadata or file (Admin+) */
router.patch(
  "/gallery/:image_gallery_id",
  authn,
  authz(adminAndAbove),
  upload.single("image_url"),
  imageGalleryIdValidator,
  updateImageGalleryController,
);

/** @route DELETE /gallery/:id - Soft delete an image (Admin+) */
router.delete(
  "/gallery/:image_gallery_id",
  authn,
  authz(adminAndAbove),
  imageGalleryIdValidator,
  deleteImageGalleryController,
);

export default router;
