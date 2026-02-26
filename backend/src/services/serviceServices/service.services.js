// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

// Service to fetch all services.
export const getAllServicesService = async () => {
  try {
    const rows = await connection.query(
      "SELECT * FROM service WHERE deleted_at IS NULL ORDER BY created_at DESC;",
    );
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error while fetching all active services:", error);
    throw error;
  }
};

/**
 * Service to fetch a single service by ID.
 * (Filters out records where deleted_at is not NULL.)
 */
export const getServiceByIdService = async (service_id) => {
  try {
    const rows = await connection.query(
      "SELECT * FROM service WHERE id = ? AND deleted_at IS NULL ORDER BY created_at DESC;",
      [service_id],
    );

    // Return the first row (the service object) or null if not found
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Error while fetching service with ID ${service_id}:`, error);
    throw error;
  }
};

/**
 * Service to create a new service.
 */
export const createServiceService = async ({
  icon_class_name,
  service_title,
  service_subtitle,
  service_description,
}) => {
  try {
    const result = await connection.query(
      `
      INSERT INTO service ( icon_class_name, service_title, service_subtitle, service_description)
      VALUES (?, ?, ?, ?);
    `,
      [icon_class_name, service_title, service_subtitle, service_description]
    );

    return {
      service_id: result.insertId,
      icon_class_name,
      service_title,
      service_subtitle,
      service_description,
    };
  } catch (error) {
    console.error("Error while creating service:", error);
    throw error;
  }
};
/**
 * Service to update an existing service by ID.
 * Supports partial updates (PATCH).
 */
export const updateServiceByIdService = async (service_id, updateData) => {
  try {
    // 1. Build the SET clause dynamically for partial updates
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (fields.length === 0) {
      // This case should be caught by the validator, but acts as a safeguard.
      return null;
    }

    // Add updated_at timestamp to the list of fields to update
    fields.push('updated_at');
    values.push(new Date());

    // Construct the SET clause: "column1 = ?, column2 = ?, ..."
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    // 2. Prepare the full query and values array
    // The final values array must be [value1, value2, ..., service_id]
    const query = `
        UPDATE service
        SET ${setClause}
        WHERE id = ? AND deleted_at IS NULL;
    `;
    const finalValues = [...values, service_id];

    const result = await connection.query(query, finalValues);

    if (result.affectedRows === 0) {
      return null; // Service not found or no change made
    }

    // Fetch the updated service record to return the complete data
    const updatedService = await getServiceByIdService(service_id); 
    return updatedService;
  } catch (error) {
    console.error(`Error while updating service with ID ${service_id}:`, error);
    throw error;
  }
};

/**
 * Service to perform soft delete on a service by ID.
 * Sets the 'deleted_at' column to the current timestamp.
 */
export const deleteServiceByIdService = async (service_id) => {
  try {
    const result = await connection.query(
      "UPDATE service SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL;",
      [service_id]
    );

    // Return the number of rows affected (should be 1 if successful, 0 if not found)
    return result.affectedRows; 
  } catch (error) {
    console.error(`Error while soft-deleting service with ID ${service_id}:`, error);
    throw error;
  }
};