import { Router } from "express";
import { createDepartmentController, deleteDepartmentController, getDepartmentByIdController, getDepartmentsController, updateDepartmentController } from "../../controllers/departmentControllers/department.controllers.js";
import { authn, authz  } from "../../middlewares/auth.middleware.js"
import { adminAndAbove } from "../../utils/authzRoles.js";
import { createDepartmentValidator, departmentIdValidator, updateDepartmentValidator } from "../../validation/department.validation.js";





//  Call the router method from express to create the router
const router = Router();

/**
 * @route GET /api/departments
 * @description Get all active departments.
 */
router.get("/departments",  getDepartmentsController);

/**
 * @route GET /api/departments/:Department_id
 * @description Get department by ID.
 */
router.get(
  "/departments/:Department_id",
  departmentIdValidator,
  getDepartmentByIdController,
);

/**
 * @route POST /api/departments
 * @description Create new department.
 */
router.post(
  "/departments",
  authn,
  authz(adminAndAbove),
  createDepartmentValidator,
  createDepartmentController,
);

/**
 * @route PATCH /api/departments/:Department_id
 * @description Update department.
 */
router.patch(
  "/departments/:Department_id",
  authn,
  authz(adminAndAbove),
  updateDepartmentValidator,
  updateDepartmentController,
);

/**
 * @route DELETE /api/departments/:Department_id
 * @description Soft delete department.
 */
router.delete(
  "/departments/:Department_id",
  authn,
  authz(adminAndAbove),
  departmentIdValidator,
  deleteDepartmentController,
);

export default router;
