import { Router } from "express";
import { createAccountController, signInController } from "../../controllers/authControllers/auth.controllers.js";
import { createAccountValidator, signInValidator } from "../../validation/auth.validation.js";

// Call the router method from express to create the router
const router = Router();
// Create a route to handle the create account request on post
router.post("/auth/sign-up", createAccountValidator, createAccountController);

// Create a route to handle the sign in request on post
router.post("/auth/sign-in", signInValidator, signInController);

// Export the router
export default router;