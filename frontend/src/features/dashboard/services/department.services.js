import { protectedAxios, publicAxios } from "../../../lib/apiSetup";

/**
 * @function getAllDepartments
 * @description Retrieves a list of all active departments.
 * @returns {Promise<Object>} API response data.
 */
export const getAllDepartmentsService = async () => {
  try {
    const response = await publicAxios.get(`/departments`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving departments:", error);
    throw error;
  }
};

/**
 * @function getDepartmentById
 * @description Retrieves details of a specific department by ID.
 * @param {number|string} departmentId - The unique ID of the department.
 * @returns {Promise<Object>} API response data.
 */
export const getDepartmentByIdService = async (departmentId) => {
  try {
    const response = await publicAxios.get(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error while retrieving department with ID ${departmentId}:`,
      error,
    );
    throw error;
  }
};

/**
 * @function createDepartment
 * @description Creates a new department (Admin privileges required).
 * @param {Object} departmentData - The department object { department_name, department_description }.
 * @returns {Promise<Object>} API response data.
 */
export const createDepartmentService = async (departmentData) => {
  try {
    const response = await protectedAxios.post(`/departments`, departmentData);
    return response.data;
  } catch (error) {
    console.error("Error while creating department:", error);
    throw error;
  }
};

/**
 * @function updateDepartment
 * @description Updates an existing department's details.
 * @param {number|string} departmentId - The ID of the department to update.
 * @param {Object} departmentData - The partial data to update.
 * @returns {Promise<Object>} API response data.
 */
export const updateDepartmentService = async (departmentId, departmentData) => {
  try {
    const response = await protectedAxios.patch(
      `/departments/${departmentId}`,
      departmentData,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error while updating department with ID ${departmentId}:`,
      error,
    );
    throw error;
  }
};

/**
 * @function deleteDepartment
 * @description Soft deletes a department.
 * @param {number|string} departmentId - The ID of the department to delete.
 * @returns {Promise<Object>} API response data.
 */
export const deleteDepartmentService = async (departmentId) => {
  try {
    const response = await protectedAxios.delete(
      `/departments/${departmentId}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error while deleting department with ID ${departmentId}:`,
      error,
    );
    throw error;
  }
};
