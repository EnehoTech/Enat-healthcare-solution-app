import { Router } from "express";
import { getAllTagsController } from "../../controllers/blogControllers/blogTags.controllers.js";

import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";

// Call the router method from express to create the router
const router = Router();

router.get("/blog-tags", authn, authz(adminAndAbove), getAllTagsController);

// default export router 
export default router;
