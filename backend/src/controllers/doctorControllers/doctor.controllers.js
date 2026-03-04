import path from "path";
import { getFileDestination, saveFile } from "../../utils/handleFileUpload.js";
import { createDoctorService, deleteDoctorService, getAllDoctorsSelectorService, getDoctorByIdService, getDoctorsService, updateDoctorService } from "../../services/doctorServices/doctor.services.js";

/**
 * @controller getDoctorsController
 * @description Fetches all doctors with joined data.
 */
export const getDoctorsController = async (req, res) => {
  try {
    const doctors = await getDoctorsService();
    return res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully.",
      data: { doctors },
    });
  } catch (error) {
    console.error("error while retrieving doctors:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller getAllDoctorsSelectorController
 * @desc Retrieves all doctor records (raw table data) for selection purposes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Response>} JSON response with doctor data.
 */
export const getAllDoctorsSelectorController = async (req, res) => {
  try {
    const doctorsSelectors = await getAllDoctorsSelectorService();
    
    return res.status(200).json({
      success: true,
      message: "Doctors selector retrieved successfully.",
      data: { doctors: doctorsSelectors },
    });
  } catch (error) {
    console.error("error while retrieving doctors:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller getDoctorByIdController
 * @description Fetches a single doctor by ID.
 */
export const getDoctorByIdController = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const doctor = await getDoctorByIdService(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "Doctor your are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor retrieved successfully.",
      data: { doctor },
    });
  } catch (error) {
    console.error("error while retrieving doctor By Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller createDoctorController
 * @description Handles doctor profile creation and file upload.
 */
export const createDoctorController = async (req, res) => {
  try {
    const { user_id, department_id, doctor_specialty, doctor_description } =
      req.body;
    const file = req.file;
    let filePath = null;

    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "doctor_picture",
      );
      filePath = await saveFile(file, destination, `dr`, "pic");
    }

    const newDoctor = await createDoctorService({
      user_id,
      department_id,
      doctor_picture: filePath,
      doctor_specialty,
      doctor_description,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      data: { doctor: newDoctor },
    });
  } catch (error) {
    console.error("Error while creating doctors:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "This user is already registered as a doctor.",
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
 * @controller updateDoctorController
 * @description Handles partial updates for doctor info.
 */
export const updateDoctorController = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const file = req.file;
    let filePath = null;

    if (file) {
      const destination = path.join(
        getFileDestination(file.mimetype),
        "doctor_picture",
      );
      filePath = await saveFile(file, destination, `dr`, "pic");
    }

    const updated = await updateDoctorService(doctor_id, {
      ...req.body,
      doctor_picture: filePath,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "Doctor you are trying to update was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      data: { doctor: updated },
    });
  } catch (error) {
    console.error("error while updating doctor By Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @controller deleteDoctorController
 * @description Soft deletes a doctor.
 */
export const deleteDoctorController = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const deleted = await deleteDoctorService(doctor_id);
    if (!deleted)
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "Doctor you are trying to delete was not found.",
      });
    return res
      .status(200)
      .json({
        success: true,
        message: "Doctor deleted successfully.",
        data: { doctor: deleted },
      });
  } catch (error) {
    console.error("error while deleting doctor By Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};