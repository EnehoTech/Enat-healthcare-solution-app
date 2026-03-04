import path from "path";
import fs from "fs/promises";
// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";


/**
 * @function checkDoctorByIdExists
 * @description Helper to get raw doctor data without joins.
 */
const checkDoctorByIdExists = async (id) => {
  const rows = await connection.query(
    "SELECT id, user_id, department_id, doctor_picture,  doctor_specialty, doctor_description FROM doctor WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * @function getDoctorsService
 * @description Fetches all doctors formatted as an array of nested objects including full profile details.
 * @returns {Promise<Array>} Array of nested doctor objects.
 */
export const getDoctorsService = async () => {
  try {
    const query = `
      SELECT 
        d.id, d.doctor_picture, d.doctor_specialty, d.doctor_description, d.created_at, d.updated_at,
        u.id AS user_id, u.email, up.first_name, up.last_name, up.user_name, up.user_color,
        upp.profile_picture,
        dept.id AS dept_id, dept.department_name, dept.department_description,
        /* Subquery: Get all handles for THIS doctor and turn them into a single string */
        (
          SELECT GROUP_CONCAT(
            JSON_OBJECT(
              'id', dsh.id, 
              'platform_name', smp.platform_name, 
              'icon_class_name', smp.icon_class_name, 
              'handle_link', dsh.handle_link
            )
          )
          FROM doctor_social_handle dsh
          INNER JOIN social_media_platform smp ON dsh.smp_id = smp.id
          WHERE dsh.doctor_id = d.id AND dsh.deleted_at IS NULL
        ) AS social_handles
      FROM doctor d
      INNER JOIN user u ON d.user_id = u.id
      INNER JOIN user_profile up ON d.user_id = up.user_id
      LEFT JOIN user_profile_picture upp ON d.user_id = upp.user_id
      INNER JOIN department dept ON d.department_id = dept.id
      WHERE d.deleted_at IS NULL
      ORDER BY d.created_at DESC
    `;

    const rows = await connection.query(query);

    return rows.map((row) => ({
      id: row.id,
      doctor_picture: row.doctor_picture,
      doctor_specialty: row.doctor_specialty,
      doctor_description: row.doctor_description,
      user: {
        id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        user_name: row.user_name,
        user_color: row.user_color,
        profile_picture: row.profile_picture,
      },
      department: {
        id: row.dept_id,
        department_name: row.department_name,
        department_description: row.department_description,
      },
      social_handles: row.social_handles
        ? JSON.parse(`[${row.social_handles}]`)
        : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error("[Service Error] getDoctorsService:", error.message);
    throw error;
  }
};


/**
 * @function getAllDoctorsSelectorService
 * @description Fetches raw doctor table data only.
 */
export const getAllDoctorsSelectorService = async () => {
  try {
    const query = `
      SELECT 
        d.id, 
        up.first_name, 
        up.last_name,
        dept.department_name
      FROM doctor d
      INNER JOIN user_profile up ON d.user_id = up.user_id
      INNER JOIN department dept ON d.department_id = dept.id
      WHERE d.deleted_at IS NULL 
      ORDER BY d.created_at DESC
    `;
    const rows = await connection.query(query);
    return rows;
  } catch (error) {
    console.error("Error in getAllDoctorsSelectorService:", error);
    throw error;
  }
};

/**
 * @function getDoctorByIdService
 * @description Fetches a single doctor with nested user (including profile details), department, and social handles.
 * @param {number|string} id - The doctor ID.
 * @returns {Promise<Object|null>} Nested doctor object.
 */
export const getDoctorByIdService = async (id) => {
  try {
    const query = `
      SELECT 
        d.id, d.doctor_picture, d.doctor_specialty, d.doctor_description, d.created_at, d.updated_at,
        u.id AS user_id, u.email, up.first_name, up.last_name, up.user_name, up.user_color,
        upp.profile_picture,
        dept.id AS dept_id, dept.department_name, dept.department_description,
        /* Subquery: Get all handles for THIS doctor and turn them into a single string */
        GROUP_CONCAT(
          IF(dsh.id IS NOT NULL, 
            JSON_OBJECT(
              'id', dsh.id, 
              'platform_name', smp.platform_name, 
              'icon_class_name', smp.icon_class_name, 
              'handle_link', dsh.handle_link
            ), 
            NULL)
        ) AS social_handles
      FROM doctor d
      INNER JOIN user u ON d.user_id = u.id
      INNER JOIN user_profile up ON d.user_id = up.user_id
      LEFT JOIN user_profile_picture upp ON d.user_id = upp.user_id
      INNER JOIN department dept ON d.department_id = dept.id
      LEFT JOIN doctor_social_handle dsh ON d.id = dsh.doctor_id AND dsh.deleted_at IS NULL
      LEFT JOIN social_media_platform smp ON dsh.smp_id = smp.id
      WHERE d.id = ? AND d.deleted_at IS NULL
      GROUP BY d.id
    `;

    const rows = await connection.query(query, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      id: row.id,
      doctor_picture: row.doctor_picture,
      doctor_specialty: row.doctor_specialty,
      doctor_description: row.doctor_description,
      user: {
        id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        user_name: row.user_name,
        user_color: row.user_color,
        profile_picture: row.profile_picture,
      },
      department: {
        id: row.dept_id,
        department_name: row.department_name,
        department_description: row.department_description,
      },
      social_handles: row.social_handles
        ? JSON.parse(`[${row.social_handles}]`)
        : [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error(`database error in getDoctorByIdService (ID: ${id})`, error);
    throw error;
  }
};
/**
 * @function createDoctorService
 * @description Registers a new doctor and returns the record from the doctor table only.
 */
export const createDoctorService = async (data) => {
  try {
    const {
      user_id,
      department_id,
      doctor_picture,
      doctor_specialty,
      doctor_description,
    } = data;

    // 1. Perform the insertion
    const result = await connection.query(
      "INSERT INTO doctor (user_id, department_id, doctor_picture, doctor_specialty, doctor_description) VALUES (?, ?, ?, ?, ?)",
      [
        user_id,
        department_id,
        doctor_picture,
        doctor_specialty,
        doctor_description,
      ],
    );

    const newId = result.insertId;

    // 2. Fetch and return only the doctor table record (no joins)
    const rows = await connection.query("SELECT * FROM doctor WHERE id = ?", [
      newId,
    ]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("database error in createDoctorService:", error);
    throw error;
  }
};


/**
 * @function updateDoctorService
 * @description Updates doctor record, cleans up old files, and returns the updated doctor row.
 */
export const updateDoctorService = async (id, updateData) => {
  try {
    // 1. Check if doctor exists and get current data for file cleanup
    const checkDoctorExists = await checkDoctorByIdExists(id);
    if (!checkDoctorExists) return null;

    const existing = checkDoctorExists;

    const {
      user_id,
      department_id,
      doctor_picture,
      doctor_specialty,
      doctor_description,
    } = updateData;

    // 2. Handle file cleanup if a new picture is uploaded
    if (doctor_picture && existing?.doctor_picture) {
      const oldFilePath = path.join(process.cwd(), existing.doctor_picture);
      try {
        // Use fs/promises for unlink
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.warn(
          `Cleanup Warning: Could not delete old file ${oldFilePath}:`,
          error,
        );
      }
    }

    // 3. Perform the update
    const query = `
      UPDATE doctor SET 
        user_id = ?, 
        department_id = ?, 
        doctor_picture = ?, 
        doctor_specialty = ?, 
        doctor_description = ?, 
        updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      user_id || existing.user_id,
      department_id || existing.department_id,
      doctor_picture || existing.doctor_picture,
      doctor_specialty || existing.doctor_specialty,
      doctor_description || existing.doctor_description,
      id,
    ];

    await connection.query(query, params);

    // 4. Return only the doctor table data (no aggregated joins)
    const updatedRows = await connection.query(
      "SELECT * FROM doctor WHERE id = ?",
      [id],
    );

    return updatedRows[0];
  } catch (error) {
    console.error("Database error in updateDoctorService:", error);
    throw error;
  }
};

/**
 * @function deleteDoctorService
 * @description Soft-delete a doctor and all associated social handles.
 * Sets deleted_at = NOW() and updated_at = NOW() on:
 * - doctor
 * - doctor_social_handle
 * Returns { deleted: true, id, deleted_at } or null if not found.
 * @param {number|string} id - The doctor.id to soft-delete.
 * @returns {Promise<{deleted: true, id: number, deleted_at: string} | null>}
 */
export const deleteDoctorService = async (id) => {
  try {
    return await connection.useTransaction(async (txConnection) => {
      // 1) Locate target that isn't already soft-deleted
      const checkDoctorExists = await checkDoctorByIdExists(id);
      if (!checkDoctorExists) return null;
      const existing = checkDoctorExists;

      const doctorId = existing?.id;

      // 2) Soft-delete child rows (social handles) first
      await txConnection.execute(
        `UPDATE doctor_social_handle
         SET deleted_at = NOW(), updated_at = NOW()
         WHERE doctor_id = ? AND deleted_at IS NULL`,
        [doctorId],
      );

      // 3) Soft-delete parent row (doctor)
      const [upd] = await txConnection.execute(
        `UPDATE doctor 
         SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = ? AND deleted_at IS NULL`,
        [doctorId],
      );

      if (upd.affectedRows !== 1) {
        throw new Error("Failed to delete doctor.");
      }

      // 4) Read back the deleted_at timestamp for response
      const [[row]] = await txConnection.execute(
        `SELECT id, deleted_at FROM doctor WHERE id = ? LIMIT 1`,
        [doctorId],
      );

      return {
        deleted: true,
        id: row.id,
        deleted_at: row.deleted_at,
      };
    });
  } catch (error) {
    console.error("Error deleting doctor service:", error);
    throw error; // Let controller handle the 500 error mapping
  }
};

