// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * Check if a role name already exists (excluding soft-deleted ones).
 * @param {string} appRoleName
 * @returns {Promise<Object|null>} Existing role row or null
 */
export const checkRoleNameExists = async (appRoleName) => {
  const query = `
    SELECT id, app_role_name, created_at, updated_at, deleted_at
    FROM app_role
    WHERE app_role_name = ?
      AND deleted_at IS NULL
    LIMIT 1
  `;

  const rows = await connection.query(query, [appRoleName]);
  return rows.length > 0 ? rows[0] : null;
};
/**
 * Retrieves all roles from the database.
 * @returns {Promise<Array>} An array of roles.
 */
export const getRolesService = async () => {
  const query = "SELECT * FROM app_role WHERE deleted_at IS NULL";
  const rows = await connection.query(query);
  if (rows.length === 0) {
    return null;
  }
  return { roles: rows, total: rows.length };
};


/**
 * Retrieves a specific role by ID from the database.
 * @param {number} roleId - The ID of the role to retrieve.
 * @returns {Promise<Object>} The role object.
 */
export const getRoleByIdService = async (roleId) => {
  const query =
    "SELECT * FROM app_role WHERE id = ? AND deleted_at IS NULL";
  const rows = await connection.query(query, [roleId]);
  if (rows.length === 0) {
    return null;
  }
  return rows?.at(0);
};


/**
 * Creates a new role in the database.
 * @param {Object} roleData - The data of the role to create.
 * @returns {Promise<Object>} The created role object.
 */
export const createRoleService = async (roleData) => {
  // Step 1: Get the current maximum app_role_id
  const maxAppRoleIdQuery =
    "SELECT MAX(id) as maxAppRoleId FROM app_role";
  const maxAppRoleIdResult = await connection.query(maxAppRoleIdQuery);
  const maxAppRoleId = maxAppRoleIdResult[0].maxAppRoleId || 0;
  // Step 2: Calculate the new app_role_id
  const newAppRoleId = maxAppRoleId + 1;
 
  // Step 3: Insert the new role with the calculated app_role_id
  const insertQuery =
    "INSERT INTO app_role (id, app_role_name) VALUES (?, ?)";
  await connection.query(insertQuery, [newAppRoleId, roleData.app_role_name]);
  // Step 4: Retrieve the newly inserted role to get all fields including timestamps
  const selectNewRole = `
    SELECT id, app_role_name, created_at, updated_at, deleted_at 
    FROM app_role 
    WHERE id = ?
  `;
  const rows = await connection.query(selectNewRole, [newAppRoleId]);
  return rows?.at(0);
};

/**
 * Updates an existing role by ID in the database.
 * @param {number} roleId - The ID of the role to update.
 * @param {Object} roleData - The new data of the role.
 * @returns {Promise<void>}
 */
export const updateRoleService = async (roleId, roleData) => {
  // Step 1: Update the role in the database
  const updateQuery =
    "UPDATE app_role SET app_role_name = ?, updated_at = NOW() WHERE id = ?";
  await connection.query(updateQuery, [roleData.app_role_name, roleId]);

  // Step 2: Select and return the newly updated role
  const selectUpdatedRole =
    "SELECT id, app_role_name, created_at, updated_at, deleted_at FROM app_role WHERE id = ?";
  const rows = await connection.query(selectUpdatedRole, [roleId]);
  // Step 3: Return the updated role data
  return rows?.at(0);
};

/**
 * Soft deletes a role by ID from the database.
 * @param {number} roleId - The ID of the role to delete.
 * @returns {Promise<void>}
 */
export const deleteRoleService = async (roleId) => {
  //  Update the `deleted_at` field to the current timestamp
  const query = "UPDATE app_role SET deleted_at = NOW() WHERE id = ?";
  await connection.query(query, [roleId]);
};
