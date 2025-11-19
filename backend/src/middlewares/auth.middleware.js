// Create the JWT Authentication Middleware
import jwt from "jsonwebtoken";

// Import the secret key from the environment variables
const jwtSecretKey = process.env.JWT_SECRET_KEY;

/**
 * Create the JWT Authentication Middleware
 * Middleware to authenticate and verify JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authn = (req, res, next) => {
  // Extract token from request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "You are not authorized, Please sign in.",
    });
  }

  try {
    // Verify token
    const decodedAccessToken = jwt.verify(token, jwtSecretKey);
    // Attach user information to the request object
    // console.log("decode token", decodedAccessToken);
    req.user = decodedAccessToken;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Token is invalid or has expired, Please sign in.",
    });
  }
};

/**
 * Create Role-Based Authorization Middleware
 * Middleware to authorize users based on roles.
 * @param {Array} allowedRoles - Array of allowed roles.
 * @returns {Function} Middleware function.
 */
export const authz = (allowedRoles) => {
  return (req, res, next) => {
    // Extract role from user object
    const { role_id } = req.user;

    if (!allowedRoles.includes(role_id)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You do not have permission.",
      });
    }
    // Proceed to the next middleware or route handler
    next();
  };
};
