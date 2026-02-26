import { publicAxios, protectedAxios } from "../../lib/axiosConfig";

/**
 * @function getAllServicesService
 * @description Fetches all active services (Public).
 */
export const getAllServicesService = async () => {
  try {
    const response = await publicAxios.get("/services");
    return response.data;
  } catch (error) {
    console.error("Error in getAllServicesService:", error);
    throw error;
  }
};

/**
 * @function getServiceByIdService
 * @description Fetches a single service detail by ID (Public).
 */
export const getServiceByIdService = async (serviceId) => {
  try {
    const response = await publicAxios.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getServiceByIdService for ID ${serviceId}:`, error);
    throw error;
  }
};

/**
 * @function createServiceService
 * @description Creates a new medical service (Admin/Private).
 */
export const createServiceService = async (serviceData) => {
  try {
    const response = await protectedAxios.post("/services", serviceData);
    return response.data;
  } catch (error) {
    console.error("Error in createServiceService:", error);
    throw error;
  }
};

/**
 * @function updateServiceByIdService
 * @description Updates an existing service via PATCH (Admin/Private).
 */
export const updateServiceByIdService = async (serviceId, updateData) => {
  try {
    const response = await protectedAxios.patch(
      `/services/${serviceId}`,
      updateData,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error in updateServiceByIdService for ID ${serviceId}:`,
      error,
    );
    throw error;
  }
};

/**
 * @function deleteServiceByIdService
 * @description Soft deletes a service (Admin/Private).
 */
export const deleteServiceByIdService = async (serviceId) => {
  try {
    const response = await protectedAxios.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error in deleteServiceByIdService for ID ${serviceId}:`,
      error,
    );
    throw error;
  }
};
