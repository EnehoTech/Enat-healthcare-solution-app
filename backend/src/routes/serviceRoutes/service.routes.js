import { Router } from "express";
import {
  createServiceController,
  deleteServiceByIdController,
  getAllServicesController,
  getServiceByIdController,
  updateServiceByIdController,
} from "../../controllers/serviceControllers/service.controllers.js";
import {
  createServiceValidator,
  serviceIdValidator,
  updateServiceByIdValidator, // <--- FIX: Correctly import the validator
} from "../../validation/service.validation.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";

// Call the router method from express to create the router
const router = Router();
/**
 * GET /api/services
 * Route to get all services (GET)
 */
router.get("/services", getAllServicesController);

/**
 * GET /api/services/:service_id
 * Returns a single service by its service_id
 */
router.get(
  "/services/:service_id",
  serviceIdValidator,
  getServiceByIdController,
);

/** POST /api/services
 * Route to create a new service
 */

router.post(
  "/services",
  authn,
  authz(adminAndAbove),
  createServiceValidator,
  createServiceController,
);

/**
 * PATCH /api/services/:service_id
 * Updates specific fields of an existing service.
 */
router.patch(
  "/services/:service_id",
  authn,
  authz(adminAndAbove),
  updateServiceByIdValidator,
  updateServiceByIdController,
);

/**
 * DELETE /api/services/:service_id
 * Soft deletes a service by setting the 'deleted_at' timestamp.
 */
router.delete(
  "/services/:service_id",
  authn,
  authz(adminAndAbove),
  serviceIdValidator,
  deleteServiceByIdController,
);

export default router;
