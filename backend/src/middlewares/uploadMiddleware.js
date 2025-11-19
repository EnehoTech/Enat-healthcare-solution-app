import multer from 'multer';
/**
 * @function fileFilter
 * @description Filters uploaded files by type.
 * @param {Object} req - Express request object.
 * @param {Object} file - Uploaded file object.
 * @param {Function} cb - Callback function to signal acceptance or rejection of the file.
 * @throws {BadRequestError} If the file type is not supported.
 * @example
 * multer({
 *   fileFilter: fileFilter
 * });
 */
const fileFilter = (req, file, cb) => {
  // Define allowed file types and their corresponding MIME types
  const allowedTypes = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    txt: "text/plain",
    zip: "application/zip",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    avif: "image/avif", // Added AVIF
    webp: "image/webp", // Added WebP
  };

  // Get the file extension
  const ext = file.originalname.split('.').pop().toLowerCase();

  // Check if the file extension is allowed and the MIME type matches
  if (allowedTypes[ext] && allowedTypes[ext] === file.mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Only these file types are supported for upload: ${Object.keys(allowedTypes).join(', ')}`, false));
    
  }
};

/**
 * @constant upload
 * @description Multer middleware for handling file uploads, storing files in memory.
 * @property {Object} storage - Multer memory storage.
 * @property {Object} limits - File size limits (2MB).
 * @property {Function} fileFilter - Filters files using the `fileFilter` function.
 * @example
 * app.use(upload.single('icon'));
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});
