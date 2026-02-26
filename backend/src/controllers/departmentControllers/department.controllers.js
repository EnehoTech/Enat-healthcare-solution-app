import {
  checkDepartmentNameExists,
  createDepartmentService,
  deleteDepartmentService,
  getDepartmentByIdService,
  getDepartmentsService,
  updateDepartmentService,
} from "../../services/departmentServices/department.services.js";

/**
 * @description Handle GET all active departments.
 */
export const getDepartmentsController = async (req, res) => {
  try {
    const departments = await getDepartmentsService();
    return res.status(200).json({
      success: true,
      message: "Departments data retrieved successfully.",
      data: { departments },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};
/**
 * @description Handle GET department by ID.
 */
export const getDepartmentByIdController = async (req, res) => {
  try {
    const { Department_id } = req.params;
    const department = await getDepartmentByIdService(Department_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The department you looking for was not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Department data retrieved successfully.",
      data: { department },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

export const createDepartmentController = async (req, res) => {
  try {
    const departmentData = req.body;

    // Check uniqueness
    const checkExistingDepartment = await checkDepartmentNameExists(
      departmentData.department_name,
    );
    if (checkExistingDepartment) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: "Department name already exists.",
      });
    }

    const newDept = await createDepartmentService(departmentData);
    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: { department: newDept },
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

/**
 * @description Handle department partial updates.
 */
export const updateDepartmentController = async (req, res) => {
  try {
    const { Department_id } = req.params;
    const departmentData = req.body;

    const checkDeptExists = await getDepartmentByIdService(Department_id);
    if (!checkDeptExists) {
      return res.status(404).json({
        success: false,
        error: "404 Not Found",
        message: "The department you looking for was not found.",
      });
    }

    if (departmentData.department_name) {
      const checkDeptDuplicate = await checkDepartmentNameExists(
        departmentData.department_name,
      );
      if (
        checkDeptDuplicate &&
        checkDeptDuplicate.id !== parseInt(Department_id)
      ) {
        return res.status(409).json({
          success: false,
          error: "Conflict",
          message: "Department name already exists.",
        });
      }
    }

    const updated = await updateDepartmentService(
      Department_id,
      departmentData,
    );
    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: { department: updated },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Something went wrong! Please try again later",
    });
  }
};

/**
 * @description Handle soft deletion of a department.
 */
export const deleteDepartmentController = async (req, res) => {
  try {
    const { Department_id } = req.params;
    await deleteDepartmentService(Department_id);
    return res
      .status(200)
      .json({
        success: true,
        message: "Department deleted successfully.",
      });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Internal Server Error",
        message: "Something went wrong! Please try again later.",
      });
  }
};
