import { Router } from "express";
import {
  getRolesController,
  getRoleByIdController,
  createRoleController,
  updateRoleController,
  deleteRoleController,
} from "../../controllers/roleControllers/role.controllers.js";
import {
  createRoleValidator,
  roleIdValidator,
  updateRoleValidator,
  // userRoleIdValidator,
} from "../../validation/role.validation.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";

// import { superAdminOnly } from "../../utils/authorizationRoles.js";

// Call the router method from express to create the router
const router = Router();

// Route to get all roles
router.get("/roles", authn, getRolesController);

// Route to get a specific role by ID
router.get(
  "/roles/:app_role_id",
  authn,
  roleIdValidator,
  getRoleByIdController
);

// Route to create a new role
router.post(
  "/roles",
  authn,
  authz(adminAndAbove),
  createRoleValidator,
  createRoleController
);

// Route to update an existing role by ID
router.patch(
  "/roles/:app_role_id",
  authn,
  authz(adminAndAbove),
  updateRoleValidator,
  updateRoleController
);

// Route to delete a role by ID
router.delete(
  "/roles/:app_role_id",
  authn,
  authz(adminAndAbove),
  roleIdValidator,
  deleteRoleController
);

export default router;
