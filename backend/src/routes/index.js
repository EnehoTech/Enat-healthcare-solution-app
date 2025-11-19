// Import the express module
import { Router } from "express";
// Import the install router
import installRouter from "./install.route.js";
// import auth routes route
import authRoutes from "./authRoutes/auth.routes.js";
// Import the user routes route
import userRouter from "./userRoutes/user.routes.js";
// Import the role routes route
import roleRouter from "./roleRoutes/role.routes.js";
// Import the blog routes route
import blogRoutes from "./blogRoutes/blog.routes.js";
// Import the blog detail routes route
import blogDetailRoutes from "./blogRoutes/blogDetail.routes.js";

// Import the router module
const router = Router();
// Add the install router to the middleware chain
router.use(installRouter);

// Add the auth routes to the main router
router.use(authRoutes);

// Add the user route to the main router
router.use(userRouter);

// Add the role route to the main router
router.use(roleRouter);

// Add the blog routes to the main router
router.use(blogRoutes);

// Add the blog detail routes to the main router
router.use(blogDetailRoutes);

// Export the router
export default router;
