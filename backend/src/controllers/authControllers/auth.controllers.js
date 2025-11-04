import jwt from "jsonwebtoken";
import { checkIfUserExists, createAccountService, signInService } from "../../services/authServices/auth.services.js";


// Retrieve the JWT secret key from environment variables
const jwtSecretKey = process.env.JWT_SECRET_KEY;


/**
 * Controller to handle user account creation
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} - The response object
 */
export const createAccountController = async (req, res) => {
  try {
    const userData = req.body;
    const userExists = await checkIfUserExists(userData.email);
    if (userExists) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Account already exists.",
      });
    }

    const newUserAccount = await createAccountService(userData);
    if (Object.keys(newUserAccount).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Provided parameters are invalid.",
      });
    }

    // Generate JWT token for the new user
    const payload = {
      user_id: newUserAccount.id,
      onboarding_stage_id: newUserAccount.onboarding_stage_id,
      email: newUserAccount.email,
      role_id: newUserAccount.app_role_id,
      first_name: newUserAccount.first_name,
      last_name: newUserAccount.last_name,
      user_name: newUserAccount.user_name,
    };
    const sendBackToken = jwt.sign(payload, jwtSecretKey, { expiresIn: "24h" });

    return res.status(201).json({
      success: true,
      message: "Account created and signed in successfully.",
      _u_at_i: sendBackToken,
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
 * Controller to handle user sign-in
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} - The response object
 */
export const signInController = async(req, res, next) => {
  try {
    const userAuthData = req.body;

    const user = await signInService(userAuthData);
    // If the user is not found
    if (user.status === 404) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: user.message,
      });
    }
    if (user.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: user.message,
      });
    }
    // If successful, send a response to the client
    const payload = {
      user_id: user.data.id,
      onboarding_stage_id: user.data.onboarding_stage_id,
      email: user.data.email,
      role_id: user.data.app_role_id,
      first_name: user.data.first_name,
      last_name: user.data.last_name,
      user_name: user.data.user_name,
    };
    // generate token
    const sendBackToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "User signed in successfully.",
      _u_at_i: sendBackToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};