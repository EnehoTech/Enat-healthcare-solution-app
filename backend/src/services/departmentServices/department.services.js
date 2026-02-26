// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * @description Check if department name exists.
 * @param {string} name - Department name.
 * @returns {Promise<object|null>}
 */
export const checkDepartmentNameExists = async (name) => {
  try {
    const query =
      "SELECT id FROM department WHERE department_name = ? AND deleted_at IS NULL LIMIT 1";
    const rows = await connection.query(query, [name]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error checking department name:", error);
    throw error;
  }
};

/**
 * @description Fetch all active departments.
 * @returns {Promise<object|null>}
 */
export const getDepartmentsService = async () => {
  try {
    const query =
      "SELECT id, department_name, department_description, created_at, updated_at FROM department WHERE deleted_at IS NULL";
    const rows = await connection.query(query);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

/**
 * @description Fetch department by ID (includes soft-deleted).
 * @param {number} id - Department ID.
 * @returns {Promise<object|null>}
 */
export const getDepartmentByIdService = async (id) => {
  try {
    const query =
      "SELECT id, department_name, department_description, created_at, updated_at FROM department WHERE id = ?";
    const rows = await connection.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching department by ID:", error);
    throw error;
  }
};

/**
 * @description Create department utilizing database auto-increment and object destructuring.
 * @param {object} data - { department_name, department_description }
 * @returns {Promise<object>} - The newly created department object.
 */
export const createDepartmentService = async (data) => {
  try {
    // Destructure data for cleaner assignment and readability
    const { department_name, department_description } = data;

    const insertQuery = `
      INSERT INTO department (department_name, department_description) 
      VALUES (?, ?)
    `;

    const rows = await connection.query(insertQuery, [
      department_name,
      department_description,
    ]);

    // Use the insertId returned by the database to fetch the new record
    const newId = rows.insertId;
    return await getDepartmentByIdService(newId);
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

/**
 * @description Partial update for department.
 * @param {number} id - Target ID.
 * @param {object} updates - New data from request body.
 * @returns {Promise<object>}
 */
export const updateDepartmentService = async (id, updateData) => {
  try {
    // 1. Fetch current data to provide fallbacks
    const currentData = await getDepartmentByIdService(id);
    if (!currentData) return null;

    // 2. Destructure updates for clarity
    const { department_name, department_description } = updateData;

    // 3. Update using requested value OR current value if not provided
    const query = `
      UPDATE department 
      SET 
        department_name = ?, 
        department_description = ?,
        updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;

    const params = [
      department_name || currentData.department_name,
      department_description || currentData.department_description,
      id,
    ];

    await connection.query(query, params);

    // 4. Return the refreshed record
    return await getDepartmentByIdService(id);
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

/**
 * @description Soft delete department.
 * @param {number} id - Target ID.
 */
export const deleteDepartmentService = async (id) => {
  try {
    const query = "UPDATE department SET deleted_at = NOW() WHERE id = ?";
    await connection.query(query, [id]);
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};
