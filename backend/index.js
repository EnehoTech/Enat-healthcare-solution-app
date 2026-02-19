// Import the dotenv module and call the config() method
import dotenv from "dotenv";
// import express
import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
// Import the routes
import routes from "./src/routes/index.js";
dotenv.config();
const app = express();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Application configuration
app.set("PORT", process.env.PORT || 2411);
app.set("static-path", join(__dirname, "assets"));

// Enable CORS middleware
app.use(cors());
// parse json request body to object
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded files)
app.use("/api/assets", express.static(app.get("static-path")));

// Add the routes to the main middleware chain
app.use("/api", routes);

// // Define a route handler for GET requests to the root path '/'
// app.get("/", (req, res) => {
//   res.send("Hello my server!");
// });

//  Start Server and listen on the specified port
app.listen(app.get("PORT"), (err) => {
  if (err) {
    console.error("Failed to start the server:", err);
    process.exit(1);
  }
  console.log(`🚀 Server is listening at http://localhost:${app.get("PORT")}`);
});
