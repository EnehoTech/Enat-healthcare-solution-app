import path from "path";
import {
  createImageGalleryService,
  deleteImageGalleryService,
  getImageGalleryByIdService,
  getImageGalleryService,
  getImagesByUserIdService,
  updateImageGalleryService,
} from "../../services/imageGalleryServices/imageGallery.services.js";
import { getFileDestination, saveFile } from "../../utils/handleFileUpload.js";

/**
 * @controller getImageGalleryController
 * @description Handles the request to fetch images, potentially filtered by type.
 */
export const getImageGalleryController = async (req, res) => {
  try {
    const { type } = req.query;

    // Call service with normalized type
    const images = await getImageGalleryService(type?.toUpperCase());

    return res.status(200).json({
      success: true,
      message: "Gallery images retrieved successfully.",
      data: { images },
    });
  } catch (error) {
    // 1. Log the full error internally for developers
    console.error("Error while retrieving gallery images:", error);

    // 2. Return a structured error response
    // We use error.message if it exists, otherwise a fallback string
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller getImageGalleryByIdController
 * @description Handles the retrieval of a specific image gallery record.
 */
export const getImageGalleryByIdController = async (req, res) => {
  try {
    const { image_gallery_id } = req.params;

    // 1. Call the service to fetch the image and owner details
    const image = await getImageGalleryByIdService(image_gallery_id);

    // 2. Handle Case: Image does not exist or is soft-deleted
    if (!image) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The image you are looking for was not found.",
      });
    }

    // 3. Successful Response
    return res.status(200).json({
      success: true,
      message: "Image details retrieved successfully.",
      data: { image },
    });
  } catch (error) {
    // 4. Log the error for internal debugging
    console.error("Error while retrieving image details:", error);
    // 5. Standardized Error Response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller getImagesByUserIdController
 * @description Fetches the recent 20 images for a specific user to be used in blog creation.
 */
export const getImagesByUserIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { type } = req.query;

    const images = await getImagesByUserIdService(user_id, type);

    return res.status(200).json({
      success: true,
      message: "User gallery images retrieved successfully.",
      data: {
        images,
      },
    });
  } catch (error) {
    console.error("Error while retrieving gallery images by userId :", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller createImageGalleryController
 * @description Handles the creation of a new image in the gallery.
 */

export const createImageGalleryController = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { image_name, image_type } = req.body;
    const file = req.file;
    let filePath = null;

    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "image_gallery",
      );
      filePath = await saveFile(
        file,
        destination,
        `img-gallery-${user_id}`,
        image_type.toLowerCase(),
      );
    }

    const newImage = await createImageGalleryService({
      userId: user_id,
      imageName: image_name,
      imageUrl: filePath,
      imageType: image_type.toUpperCase(),
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded and added to gallery successfully.",
      data: { image: newImage },
    });
  } catch (error) {
    console.error("Error while creating image gallery:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: error.message || "Image name or URL already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};


/**
 * @controller updateImageGalleryController
 * @description Handles patching gallery records and replacing physical files.
 */
export const updateImageGalleryController = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { image_gallery_id } = req.params;
    const { image_name, image_type } = req.body;
    const file = req.file;
    let filePath = null;

    // 1. Process new file if uploaded
    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "image_gallery"
      );
      filePath = await saveFile(
        file,
        destination,
        `img-gallery-${user_id}`,
        image_type.toLowerCase()
      );
    }

    // 2. Call service
    const updated = await updateImageGalleryService(image_gallery_id, {
      imageName: image_name,
      imageUrl: filePath,
      imageType: image_type?.toUpperCase(),
    });

    // 3. Handle Not Found
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message:
          "The image gallery record you are trying to update was not found.",
      });
    }

    // 4. Success Response
    return res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: { image: updated },
    });
  } catch (error) {
    console.error("Controller Error (updateImageGallery):", error);

    // 5. Handle Conflict (Duplicate Name/URL)
    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: error.message || "Image name or URL already exists.",
      });
    }

    // 6. Generic Error
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller deleteImageGalleryController
 * @description Handles the request to soft-delete a specific gallery image.
 */
export const deleteImageGalleryController = async (req, res) => {
  try {
    const { image_gallery_id } = req.params;

    // 1. Call the service to handle deletion logic
    const isDeleted = await deleteImageGalleryService(image_gallery_id);

    // 2. Handle Case: Record not found
    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The image you are trying to delete was not found.",
      });
    }

    // 3. Successful Response
    return res.status(200).json({
      success: true,
      message: "Image deleted from gallery successfully.",
    });
  } catch (error) {
    // 4. Internal logging
    console.error("Error while deleting image from gallery:", error);

    // 5. Standardized Error Response
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
