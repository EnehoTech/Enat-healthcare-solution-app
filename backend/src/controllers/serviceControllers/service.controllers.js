// Import service functions from the corresponding service file
import {
  createServiceService,
  deleteServiceByIdService,
  getAllServicesService,
  getServiceByIdService,
  updateServiceByIdService, // <-- Need to import this for getServiceByIdController
} from "../../services/serviceServices/service.services.js";
/**
* Controller to get all services.
*/
export const getAllServicesController = async (req, res) => {
  try {
    const services = await getAllServicesService();

    return res.status(200).json({
      success: true,
      message: "Services retrieved successfully.",
      data: { services: services }, // Use 'services' here as it's a list
    });
  } catch (error) {
    console.error("Error while fetching services:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to get a service by ID.
 */
export const getServiceByIdController = async (req, res) => {
  try {
    const { service_id } = req.params;
    // Assuming getServiceByIdService is correctly imported
    const service = await getServiceByIdService(service_id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The service you are looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Service retrieved successfully.",
      data: { service: service },
    });
  } catch (error) {
    console.error("Error while fetching service by Id:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};



/**
 * Controller to create a new service.
 */
export const createServiceController = async (req, res) => {
  try {
    const {
      icon_class_name,
      service_title,
      service_subtitle,
      service_description,
    } = req.body;

    const newService = await createServiceService({
      icon_class_name,
      service_title,
      service_subtitle,
      service_description,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: { service: newService },
    });
  } catch (error) {
    console.error("Error while creating service:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * Controller to update an existing service by ID (PATCH).
 */
export const updateServiceByIdController = async (req, res) => {
  try {
    const { service_id } = req.params;
    const updateData = req.body;

    const updatedService = await updateServiceByIdService(
      service_id,
      updateData
    );

    // Check if the service was not found or not updated
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The service you are trying to update was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: { service: updatedService },
    });
  } catch (error) {
    console.error(`Error while updating service with ID ${req.params.service_id}:`, error);

    // 1062 is the common MySQL error number for ER_DUP_ENTRY (Unique constraint violation)
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "The provided data conflicts with an existing service (e.g., duplicate title).",
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
 * Controller to soft delete a service by ID.
 */
export const deleteServiceByIdController = async (req, res) => {
  try {
    const { service_id } = req.params;

    const affectedRows = await deleteServiceByIdService(service_id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The service you are trying to delete was not found or is already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error(`Error while deleting service with ID ${req.params.service_id}:`, error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};