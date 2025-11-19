import fs from "fs/promises";
import path from "path";

/**
 * @function saveFile
 * @description Saves an uploaded file to the specified destination with a sanitized filename.
 * @param {Object} file - The uploaded file object.
 * @param {string} destination - The destination directory path.
 * @param {string} prefix - The prefix to use for the file name.
 * @param {string} type - The type of file (e.g., 'icon').
 * @param {number|string} id - The unique identifier for the file.
 * @returns {Promise<string>} The file path of the saved file.
 * @throws {Error} If there is an error during file saving.
 * @example
 * const filePath = await saveFile(file, '/path/to/destination', 'course-name', 'icon', 123);
 */
export const saveFile = async (file, destination, prefix, type) => {
  const sanitizedPrefix = sanitizeFilename(prefix);
  const uniqueSuffix = Date.now()
  const fileExtension = path.extname(file.originalname);
  const filename = `${sanitizedPrefix}-${type}-${uniqueSuffix}${fileExtension}`;
  const filepath = path.join(destination, filename);

  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, file.buffer);
  // Normalize the file path to always use forward slashes
  const normalizedFilepath = filepath.replace(/\\/g, "/");

  return `/${normalizedFilepath}`;
};

/**
 * @function sanitizeFilename
 * @description Sanitizes a string to be used as a file name by removing invalid characters.
 * @param {string} filename - The file name to sanitize.
 * @returns {string} The sanitized file name.
 * @example
 * const sanitized = sanitizeFilename('My File Name 2024.pdf');
 * // sanitized === 'my-file-name-2024.pdf'
 */
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
};

/**
 * @function getFileDestination
 * @description Determines the destination directory based on the file type.
 * @param {string} fileType - The MIME type of the file.
 * @returns {string} The destination directory path.
 * @example
 * const destination = getFileDestination('image/jpeg');
 * // destination === 'assets/images'
 */
export const getFileDestination = (fileType) => {
  const baseDir = "assets";
  if (fileType.startsWith("image/")) {
    return path.join(baseDir, "images");
  } else if (fileType === "application/pdf") {
    return path.join(baseDir, "documents", "pdfs");
  } else if (fileType.includes("word")) {
    return path.join(baseDir, "documents", "word");
  } else if (fileType.includes("sheet") || fileType.includes("excel")) {
    return path.join(baseDir, "documents", "spreadsheets");
  } else {
    return path.join(baseDir, "other");
  }
};
