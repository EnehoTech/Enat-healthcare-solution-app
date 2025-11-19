import fs from "fs/promises";
import path from "path";
// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

// ? helper services
/**
 * Retrieves the highest (maximum) onboarding stage ID from the database.
 * Only considers records that are not soft-deleted (deleted_at IS NULL).
 *
 * @async
 * @function getMaxOnboardingStageId
 * @returns {Promise<number|null>} The maximum onboarding_stage.id value,
 *                                 or null if no records exist.
 */
export const getMaxOnboardingStageId = async () => {
  const row = await connection.query(
    "SELECT MAX(id) AS maxId FROM onboarding_stage WHERE deleted_at IS NULL"
  );
  return row[0]?.maxId;
};

/**
 * @function checkProfilePictureExists
 * @description Checks if a user already has a profile picture.
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Object|null>} The profile picture record if exists, otherwise null.
 * @throws {Error} If any error occurs during the database query.
 * @example
 * const profilePicture = await checkProfilePictureExists(user_id);
 */
const checkUserProfilePictureExists = async (userId) => {
  try {
    const rows = await connection.query(
      "SELECT * FROM user_profile_picture WHERE user_id = ?",
      [userId]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error checking profile picture exist:", error);
    throw new Error("Database query failed");
  }
};

/**
 * @function checkUserProfilePictureExists
 * @description Checks if a user profile picture exists by its ID.
 * @param {number} id - The ID of the user profile picture to check.
 * @returns {Promise<Object|null>} The user profile picture record if found, or null if not found.
 */
const checkProfilePictureByIdExists = async (avatarId) => {
  const rows = await connection.query(
    "SELECT * FROM user_profile_picture WHERE id = ?",
    [parseInt(avatarId)]
  );
  return rows.length > 0 ? rows[0] : null;
};


// ?  users services

/**
 * @function getUsersService
 * @description Service function to fetch all users ordered by most recently added
 * @returns {Promise<Object[]>} Array of user records (empty array if none found)
 */
export const getUsersService = async () => {
  const query = `
    SELECT
      u.id,
      u.email,
      ar.id AS role_id,
      ar.app_role_name AS role_name,
      up.first_name,
      up.last_name,
      up.phone_number,
      up.user_name,
      up.user_color,
      pp.profile_picture
    FROM user u
    LEFT JOIN user_role ur ON u.id = ur.user_id
    LEFT JOIN app_role ar ON ur.app_role_id = ar.id
    LEFT JOIN user_profile up ON u.id = up.user_id
    LEFT JOIN user_profile_picture pp ON u.id = pp.user_id
    ORDER BY u.id DESC
  `;

  try {
    const rows = await connection.query(query);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error("Error while retrieving all users data:", error);
    throw error;
  }
};

/**
 * @function getSingleUserService
 * @description Service function to fetch single user data by ID from the database
 * @param {number} userId - ID of the user to fetch
 * @returns {Object|null} User data if found, null otherwise
 */
export const getUserByIdService = async (userId) => {
  const query = `
    SELECT
      u.id,
      u.email,
      ar.id AS role_id,
      ar.app_role_name AS role_name,
      up.first_name,
      up.last_name,
      up.phone_number,
      up.user_name,
      up.user_color,
      pp.profile_picture
    FROM user u
    LEFT JOIN user_role ur ON u.id = ur.user_id
    LEFT JOIN app_role ar ON ur.app_role_id = ar.id
    LEFT JOIN user_profile up ON u.id = up.user_id
    LEFT JOIN user_profile_picture pp ON u.id = pp.user_id
    WHERE u.id = ?
  `;

  try {
    const rows = await connection.query(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error while retrieving single user data:", error);
    throw error;
  }
};

// ? onboarding services
/**
 * Fetches the onboarding stage of a user by their user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object|null>} - The user's onboarding stage or null if not found.
 * @throws {Error} - If an error occurs during the database query.
 */
export const getOnboardingStageByUserIdService = async (userId) => {
  try {
    // SQL query to retrieve onboarding stage by user ID
    const query = `SELECT 
        obs.id,
        obs.stage_name,
        obs.description
      FROM user_profile up
      INNER JOIN onboarding_stage obs
        ON up.onboarding_stage_id = obs.id
      WHERE up.user_id = ? AND obs.deleted_at IS NULL
    `;

    // Execute the query with the provided user ID
    const rows = await connection.query(query, [userId]);

    // Return the first row if found, otherwise null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error while retrieving onboarding stage:", error);
    throw error;
  }
};

/**
 * Update stage_id for a user in the user_profile table.
 * @param {number} u_id - User ID.
 * @returns {Promise<object>} - Updated user profile details or error.
 */
export const updateStageIdByUserIdService = async (userId) => {
  try {
    const updatedStageId = await connection.query(
      "UPDATE user_profile SET onboarding_stage_id = onboarding_stage_id + 1 WHERE user_id = ?",
      [userId]
    );

    if (updatedStageId.affectedRows === 0) {
      return null;
    }
    // Fetch updated user profile
    const rows = await connection.query(
      "SELECT id, user_id, onboarding_stage_id FROM user_profile WHERE user_id = ?",
      [userId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error while updating stage_id:", error);
    throw error;
  }
};

// ? assign role services
/**
 * Service to get all user roles with aggregated related data.
 * @returns {Promise<Array>} List of user roles with detailed information.
 * @throws {Error} If there is an error during the database query.
 */
export const getUserRolesService = async () => {
  try {
    const query = `
      SELECT 
        ur.id, 
        ur.user_id, 
        ur.updated_by,
        up.first_name, 
        up.last_name, 
        up.user_name, 
        up.user_color,
        u.email,
        pp.profile_picture, 
        ar.id,
        ar.app_role_name,
        updaterProfile.first_name AS updated_by_first_name, -- Fetch updated_by user's first name
        updaterProfile.last_name AS updated_by_last_name -- Fetch updated_by user's last name
      FROM 
        user_role AS ur
      JOIN 
        app_role AS ar ON ur.app_role_id = ar.id
      JOIN 
        user AS u ON ur.user_id = u.id
      JOIN 
        user_profile AS up ON ur.user_id = up.user_id
      LEFT JOIN 
        user_profile_picture AS pp ON ur.user_id = pp.user_id
      LEFT JOIN 
        user_profile AS updaterProfile ON ur.updated_by = updaterProfile.user_id -- Self-join to get updated_by user's profile 
      ORDER BY 
        ur.id DESC; -- Order by most recent roles
    `;

    const rows = await connection.query(query);
    if (rows.length === 0) {
      return null;
    }

    const userRoles = rows?.map((row) => ({
      user_role_id: row.user_role_id,
      user_id: row.user_id,
      user: {
        user_id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        profile_picture: row.profile_picture,
        user_name: row.user_name,
        user_color: row.user_color,
      },
      app_role: {
        id: row.id,
        app_role_name: row.app_role_name,
      },
      updated_by: row.updated_by
        ? {
            user_id: row.updated_by,
            first_name: row.updated_by_first_name,
            last_name: row.updated_by_last_name,
          }
        : null,
    }));

    return userRoles;
  } catch (error) {
    console.error("Error while retrieving user roles:", error);
    throw error;
  }
};

/**
 * Retrieve a specific role assigned to a user by the user_role_id.
 * @param {number} userRoleId - The ID of the user role.
 * @returns {Promise<Object>} - A promise that resolves to the role object.
 * @throws {Error} - Throws an error if the database query fails.
 */
export const getUserRoleByIdService = async (userRoleId) => {
  const query = `
    SELECT *
    FROM user_role 
    WHERE id = ? 
  `;
  const rows = await connection.query(query, [userRoleId]);
  if (rows.length === 0) {
    return null;
  }
  return rows?.at(0);
};

/**
 * Assigns a new role to a user.
 * @param {number} userRoleId - The ID of the user role.
 * @param {number} appRoleId - The ID of the new role to assign.
 * @param {number} updatedBy - The ID of the user who updated the role.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating success.
 * @throws {Error} - Throws an error if the database query fails.
 */
export const assignRoleService = async (userRoleId, appRoleId, updatedBy) => {
  const query = `
    UPDATE user_role SET app_role_id = ?, updated_by = ?
    WHERE id = ?
  `;
  const result = await connection.query(query, [
    appRoleId,
    updatedBy,
    userRoleId,
  ]);
  // Check if any rows were affected (i.e., if the user_role_id exists)
  if (result.affectedRows === 0) {
    return null; // Indicate that no rows were updated
  }
  return result;
};


// ? user profile picture services
/**
 * @function getUserProfilePicturesService
 * @description Retrieves all user profile pictures from the database.
 * @returns {Promise<Array|null>} An array of user profile pictures if found, or null if none exist.
 * @example
 * const pictures = await getUserProfilePicturesService();
 */

export const getUserProfilePicturesService = async () => {
  const rows = await connection.query("SELECT * FROM user_profile_picture");
  return rows.length > 0 ? rows : null;
};

/**
 * @function getUserProfilePictureByIdService
 * @description Retrieves a specific user profile picture by its ID from the database.
 * @param {number} avatar_id - The ID of the user profile picture to retrieve.
 * @returns {Promise<Object|null>} The user profile picture record if found, or null if not found.
 * @example
 * const picture = await getUserProfilePictureByIdService(1);
 */

export const getUserProfilePictureByIdService = async (avatarId) => {
  const rows = await connection.query(
    "SELECT * FROM user_profile_picture WHERE id = ?",
    [avatarId]
  );
  return rows.length > 0 ? rows[0] : null;
};
/**
 * @function createUserProfilePictureService
 * @description Service function to store or update a user's profile picture in the database.
 * Also updates the `onboarding_stage_id` in the `user_profile` table.
 * @param {Object} params - User Profile Picture parameters.
 * @param {number} params.user_id - The ID of the user.
 * @param {string|null} params.profile_picture - Path to the uploaded avatar file, can be null.
 * @returns {Promise<Object>} The newly created or updated user profile picture.
 * @throws {Error} If any error occurs during profile picture creation or update.
 */
export const createUserProfilePictureService = async ({
  userId,
  profilePicture,
}) => {
  try {
    return await connection.useTransaction(async (txConnection) => {
      // Check if the user already has a profile picture
      const checkProfilePictureExists = await checkUserProfilePictureExists(
        userId
      );
      // If a profile picture exists, delete the old file before updating
      if (
        checkProfilePictureExists &&
        checkProfilePictureExists?.profile_picture
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          checkProfilePictureExists?.profile_picture
        );
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error(`Error deleting old profile picture: ${error}`);
        }
      }

      // Insert or update the profile picture
      if (checkProfilePictureExists) {
        await txConnection.execute(
          `
          UPDATE user_profile_picture
          SET profile_picture = ?
          WHERE user_id = ?
        `,
          [profilePicture, userId]
        );
      } else {
        await txConnection.execute(
          `
          INSERT INTO user_profile_picture (user_id, profile_picture)
          VALUES (?, ?)
        `,
          [userId, profilePicture]
        );
        // Update the `stage_id` in the user_profile table
        const [updateStageResult] = await txConnection.execute(
          `
        UPDATE user_profile
        SET onboarding_stage_id = onboarding_stage_id + 1
        WHERE user_id = ?
      `,
          [userId]
        );
        if (updateStageResult.affectedRows === 0) {
          throw new Error(
            "Failed to update the onboarding stage for the user."
          );
        }
      }

      // Fetch and return the updated or newly created user profile picture record
      const [rows] = await txConnection.execute(
        "SELECT * FROM user_profile_picture WHERE user_id = ?",
        [userId]
      );
      return rows.length > 0 ? rows[0] : null;
    });
  } catch (error) {
    console.error("Error uploading or updating profile picture:", error);
    throw error;
  }
};

/**
 * @function updateUserProfilePictureByIdService
 * @description Updates the user's profile picture or inserts a new one. It does not update the user color.
 * @param {number} avatar_id - The ID of the avatar to be updated.
 * @param {number} user_id - The ID of the user.
 * @param {string|null} avatar - The new avatar path (optional).
 * @returns {Promise<Object>} The updated or newly created profile picture record.
 */
export const updateUserProfilePictureByIdService = async ({
  avatarId,
  userId,
  profilePicture,
}) => {
  try {
    // Fetch existing profile picture data
    const checkAvatarExists = await checkProfilePictureByIdExists(avatarId);
    if (!checkAvatarExists) {
      return null;
    }

    // If avatar exists and a new avatar path is provided, delete the old file and update with the new one
    if (
      checkAvatarExists &&
      profilePicture &&
      checkAvatarExists?.profile_picture !== null
    ) {
      const oldFilePath = path.join(
        process.cwd(),
        checkAvatarExists?.profile_picture
      );
      try {
        await fs.unlink(oldFilePath); // Delete the old avatar
      } catch (error) {
        console.error(`Error deleting old avatar: ${error}`);
      }

      // Update the profile picture with the new avatar, but leave the user color unchanged
      const query = `
        UPDATE user_profile_picture
        SET profile_picture = ?
        WHERE user_id = ? 
      `;
      const params = [profilePicture || null, userId];
      await connection.query(query, params);
    }
    // If avatar exists and no new avatar is provided, keep the old one and do not update anything
    else if (checkAvatarExists && !profilePicture) {
      return checkAvatarExists; // Return existing data if no avatar update is needed
    }
    // If avatar exist and checkAvatarExists.avatar==null or avatar value is not null, insert a new profile picture
    else if (
      checkAvatarExists &&
      checkAvatarExists?.profile_picture === null &&
      profilePicture
    ) {
      const query = `
        UPDATE user_profile_picture
        SET profile_picture = ?
        WHERE user_id = ? 
      `;
      const params = [profilePicture || null, userId];
      await connection.query(query, params);
    }

    // Fetch the updated or newly created user profile picture record
    const rows = await connection.query(
      "SELECT * FROM user_profile_picture WHERE user_id = ?",
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error uploading or updating profile picture:", error);
    throw error;
  }
};

/**
 * @function deleteUserProfilePictureService
 * @description Deletes the user's profile picture by setting the avatar field to null, without deleting the record.
 * @param {number} avatarId - The ID of the avatar to delete.
 * @param {number} userId - The ID of the user whose avatar is being deleted.
 * @returns {Promise<boolean|null>} Returns true if the avatar was successfully set to null, or null if no avatar exists.
 */
export const deleteUserProfilePictureService = async (avatarId, userId) => {
  // Fetch existing profile picture data
  const checkAvatarExists = await checkProfilePictureByIdExists(avatarId);
  if (!checkAvatarExists) {
    return null; // Return null if no avatar exists for this user
  }

  // If avatar exists and avatar path is not null, delete the old file
  if (checkAvatarExists?.profile_picture) {
    const oldFilePath = path.join(
      process.cwd(),
      checkAvatarExists.profile_picture
    );
    try {
      await fs.unlink(oldFilePath); // Delete the old avatar file from the server
    } catch (error) {
      console.error(`Error deleting old avatar: ${error}`);
    }
  }

  // Set the avatar field to null without deleting the record
  const query = `
    UPDATE user_profile_picture
    SET profile_picture = ?
    WHERE user_id = ?
  `;
  const params = [null, userId]; // Set avatar to null in the database
  await connection.query(query, params);

  return true;
};

