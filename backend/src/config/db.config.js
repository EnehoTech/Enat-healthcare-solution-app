// Import the mysql module
import mysql from "mysql2/promise";
// Import the dotenv module and call the config() method
import dotenv from "dotenv";
dotenv.config();

// Check for required environment variables
if (
  !process.env.DB_PASS ||
  !process.env.DB_USER ||
  !process.env.DB_HOST ||
  !process.env.DB_NAME
) {
  throw new Error("Database environment variables are not set correctly.");
}

// Define the connection parameters for the database
const dbConfig = {
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// Create the connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log("Database connection created successfully.");
} catch (error) {
  console.error("Error creating database connection:", error);
  throw error;
}

// Define a reusable query function that handles SQL queries
const query = async (sql, params) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

/**
 * Executes a transaction-safe set of database operations.
 * @param {Function} transactionLogic - A callback function that receives a transactional connection (`txConnection`)
 * and performs the intended database operations within the transaction.
 * @returns {Promise<any>} - The result of the transaction logic if successful.
 * @throws {Error} - If any error occurs during the transaction, the transaction is rolled back and the error is rethrow.
 */
// Define a reusable transaction function
const useTransaction = async (transactionLogic) => {
  const txConnection = await pool.getConnection();
  try {
    // Start transaction
    await txConnection.beginTransaction();

    // Execute the provided transaction logic
    const result = await transactionLogic(txConnection);

    // Commit the transaction
    await txConnection.commit();

    // Return the result of the transaction
    return result;
  } catch (error) {
    // Roll back the transaction in case of an error
    await txConnection.rollback();
    console.error("Transaction rolled back due to an error:", error);
    throw error;
  } finally {
    // Release the connection back to the pool
    txConnection.release();
  }
};

// Export query and useTransaction for use in services
export default { query, useTransaction };
