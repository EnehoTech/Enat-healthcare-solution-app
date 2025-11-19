// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { generateRandomUniqueHexColor } from "../../utils/generateUniqueHexColor.js";

/**
 * Generate a unique 3-character hash.
 * @returns {string} A unique 3-character alphanumeric hash.
 */
const generateShortUniqueHash = () => {
  return uuidv4().replace(/-/g, "").substring(0, 3);
};


/**
 * Check if a user with the given email exists in the database.
 * @param {string} email - The email to check for existence.
 * @returns {Object} - The user data if found, otherwise  an empty object.
 * @throws {Error} - If any error occurs during the database query.
 */

export const checkIfUserExists = async (email) => {
  try {
    const query = "SELECT * FROM user WHERE email = ? ";
    const rows = await connection.query(query, [email]);
    return rows.length > 0 ? rows : 0;
  } catch (err) {
    console.error("Error checking if user exists:", err);
    throw err;
  }
};

/**
 * Checks whether a phone number already exists in the user_profile table.
 *
 * This function optionally normalizes the phone number (e.g., removes spaces)
 * and queries the database to determine if any user profile is already using it.
 *
 * @async
 * @function checkIfPhoneExists
 * @param {string} phone_number - The phone number to check for uniqueness.
 * @returns {Promise<boolean>} - Returns `true` if the phone number exists, otherwise `false`.
 * @throws {Error} - Throws an error if the database query fails.
 */
export const checkIfPhoneExists = async (phoneNumber) => {
  try {
    const query = `
    SELECT up.id 
    FROM user_profile up 
    WHERE up.phone_number = ? 
    LIMIT 1
  `;
    const rows = await connection.query(query, [phoneNumber]);

    return rows.length > 0;
  } catch (error) {
    throw err;
  }
};

/**
 * Function to get user data by email.
 * @param {string} email - The email to search for.
 * @returns {Object} - The user data if found, otherwise an empty object.
 * @throws {Error} - If any error occurs during the database query.
 */

export const getUserByEmail = async (email) => {
  try {
    const query = `
     SELECT * FROM user 
     INNER JOIN user_profile ON user.id = user_profile.user_id 
     INNER JOIN user_password ON user.id = user_password.user_id 
     INNER JOIN user_role ON user.id = user_role.user_id 
     WHERE user.email = ?
   `;
    const rows = await connection.query(query, [email]);
    return rows;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};


/**
 * Function to create a new user account within a transaction.
 * @param {Object} user - The user data for creating an account.
 * @returns {Object} - The created account details.
 * @throws {Error} - If any error occurs during the transaction.
 */
export const createAccountService = async (user) => {
  let createdAccount = {};
  try {
    await connection.useTransaction(async (txConnection) => {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(user.password, salt);

      const query1 = "INSERT INTO user (email) VALUES (?)";
      const values1 = [user.email];
      const [rows] = await txConnection.execute(query1, values1);

      if (rows.affectedRows !== 1) {
        throw new Error("Failed to insert user.");
      }

      const user_id = rows.insertId;

      const queryOnboardingStage =
        "SELECT id FROM onboarding_stage WHERE id = 1 AND deleted_at IS NULL";
      const [onboardingStageResult] = await txConnection.execute(
        queryOnboardingStage
      );

      if (
        onboardingStageResult.length === 0 ||
        !onboardingStageResult[0].id
      ) {
        throw new Error(
          "Initial onboarding stage ID not found or has been deleted."
        );
      }

      const initialStageId = onboardingStageResult[0].id;

      const query2 = `
        INSERT INTO user_profile (user_id, onboarding_stage_id, first_name, last_name, user_name, user_color, phone_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const hash = generateShortUniqueHash();
      const userName = `_${user.first_name?.charAt(0)}${user.last_name?.charAt(
        0
      )}-${hash}`;
      const userColor = generateRandomUniqueHexColor();
      const values2 = [
        user_id,
        initialStageId,
        user.first_name,
        user.last_name,
        userName,
        userColor,
        user.phone_number,
      ];
      await txConnection.execute(query2, values2);

      const query3 =
        "INSERT INTO user_password (user_id, password_hashed) VALUES (?, ?)";
      const values3 = [user_id, passwordHashed];
      await txConnection.execute(query3, values3);

      const queryRole = `SELECT id FROM app_role WHERE app_role_name = ?`;
      const [roleResult] = await txConnection.execute(queryRole, ["guest"]);

      if (roleResult.length === 0) {
        throw new Error("Default role ID not found.");
      }

      const defaultRoleId = roleResult[0].id;
      const query4 = "INSERT INTO user_role (user_id, app_role_id) VALUES (?, ?)";
      const values4 = [user_id, defaultRoleId];
      await txConnection.execute(query4, values4);

      const [userRows] = await txConnection.execute(
        `SELECT 
            u.id, u.email, 
            up.onboarding_stage_id, up.first_name, up.last_name, up.user_name, up.user_color, up.phone_number,
            ur.app_role_id
         FROM user u
         INNER JOIN user_profile up ON u.id = up.user_id
         INNER JOIN user_role ur ON u.id = ur.user_id
         WHERE u.id = ?`,
        [user_id]
      );

      createdAccount = userRows[0] || {};

      // createdAccount = {id: user_id, email: user.email, password: user.password};
    });
  } catch (error) {
    console.error("Error while creating account:", error);
    // MySQL duplicate key error
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message?.includes("user_profile.phone_number")) {
        const err = new Error("Phone number already exists.");
        err.statusCode = 409;
        throw err;
      }
      if (error.message?.includes("user.email")) {
        const err = new Error("Email already exists.");
        err.statusCode = 409;
        throw err;
      }
    }
    throw error;
  }
  return createdAccount;
};


/**
 * Function to sign in a user.
 * @param {Object} userAuthData - The user data for sign-in, including email and password.
 * @returns {Object} - The result of the sign-in operation.
 * @throws {Error} - If any error occurs during the sign-in process.
 */

export const signInService = async (userAuthData) => {
  try {
    // Object to be returned
    let returnData = {};
    const user = await getUserByEmail(userAuthData.email);
    if (user.length === 0) {
      returnData = {
        status: 404,
        message: "Incorrect or no account exists.",
      };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(
      userAuthData.password,
      user?.at(0).password_hashed
    );
    if (!passwordMatch) {
      returnData = {
        status: 401,
        message: "Either the email or password you entered is incorrect.",
      };
      return returnData;
    }
    returnData = {
      data: user?.at(0),
    };
    return returnData;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

