// Import necessary Node.js modules
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// Import the db connection file
import connection from "../config/db.config.js";

// Convert the URL to a directory path to ensure compatibility with ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct the full path to the SQL file containing the database queries
const queryFile = join(__dirname, "sql/enat-db-sql-queries.sql");

// Asynchronous function to install the database
export const installService = async () => {
  // Object to hold the final message and status code of the installation process
  let finalMessage = {};

  // Logging start of the database installation
  console.log("Installing DB directly from the API");

  try {
    // Read the SQL file asynchronously to prevent blocking the event loop
    const fileContent = await fs.readFile(queryFile, "utf-8");
    // Split the file content by new lines to process each SQL query individually
    const lines = fileContent.split("\n");
    let tempLine = "";

    // Process each line from the SQL file
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith("--") || line.trim() === "") continue;

      // Accumulate lines until a full query is constructed (ending with ';')
      tempLine += line;
      if (line.trim().endsWith(";")) {
        // Execute the SQL query using the database connection
        await connection.query(tempLine.trim());
        console.log("Table created successfully.");
        // Reset temporary line holder after executing the query
        tempLine = "";
      }
    }

    // Set success message and status after all queries are executed
    finalMessage.message = "All tables are created.";
    finalMessage.status = 200;
  } catch (err) {
    // Log errors and set failure message and status if an exception occurs
    console.error("Error during DB setup:", err);
    finalMessage.message = "Not all tables are created.";
    finalMessage.status = 500;
  }

  // Return the result message and status code
  return finalMessage;
};
