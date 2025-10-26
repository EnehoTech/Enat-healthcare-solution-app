// Import format from date-fns library
import { format } from "date-fns";

export const formatDate = (date) => {
  try {
    return format(new Date(date), "MM/dd/yyyy");
  } catch (error) {
    console.error("Invalid date", error);
    return "Invalid date";
  }
};
export const formatDateWithTime = (date) => {
  try {
    return format(new Date(date), "dd - MM - yyyy | HH:mm:ss a");
  } catch (error) {
    console.error("Invalid date", error);
    return "Invalid date";
  }
};
export const formatDateWithMonthName = (date) => {
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch (error) {
    console.error("Invalid date", error);
    return "Invalid date";
  }
};

/**
 * Formats a JS Date object to 'YYYY-MM-DD' in local time.
 * @param {Date} dateObj - The JavaScript Date object to format.
 * @returns {string | null} - Formatted date string or null if invalid.
 */
export const formatDateToISODate = (dateObj) => {
  if (!dateObj || !(dateObj instanceof Date)) return null;
  return format(dateObj, "yyyy-MM-dd");
};
