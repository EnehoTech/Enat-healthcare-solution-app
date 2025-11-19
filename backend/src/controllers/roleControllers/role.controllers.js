import {
  checkRoleNameExists,
  createRoleService,
  deleteRoleService,
  getRoleByIdService,
  getRolesService,
  updateRoleService,
} from "../../services/roleServices/role.services.js";

/**
 * Controller to get all roles.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const getRolesController = async (req, res) => {
  try {
    const roles = await getRolesService();
    if (!roles) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The roles you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "App roles retrieved successfully.",
      data: roles,
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
 * Controller to get a specific role by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const getRoleByIdController = async (req, res) => {
  try {
    const { app_role_id } = req.params;
    const role = await getRoleByIdService(app_role_id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The role you are looking for was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "App role retrieved successfully.",
      data: { role },
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
 * Controller to create a new role.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const createRoleController = async (req, res) => {
  try {
    const roleData = req.body;
    // Check if role name already exists (NOT in catch block)
    const existingRole = await checkRoleNameExists(roleData?.app_role_name);
    if (existingRole) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Role name already exists.",
      });
    }
    const newRole = await createRoleService(roleData);
    return res.status(201).json({
      success: true,
      message: "App role created successfully.",
      data: { role: newRole },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Role already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to update an existing role by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const updateRoleController = async (req, res) => {
  try {
    const { app_role_id } = req.params;
    const roleData = req.body;

    const role = await getRoleByIdService(app_role_id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The role you are looking for was not found.",
      });
    }
    // Check if role name already exists (NOT in catch block)
    const existingRole = await checkRoleNameExists(roleData?.app_role_name);
    if (existingRole) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Role name already exists.",
      });
    }
    // update the roles
    const updatedRole = await updateRoleService(app_role_id, roleData);

    return res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      data: { role: updatedRole },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Role already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to delete a role by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteRoleController = async (req, res) => {
  try {
    const { app_role_id } = req.params;

    const role = await getRoleByIdService(app_role_id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The role you are looking for was not found.",
      });
    }

    await deleteRoleService(app_role_id);

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
