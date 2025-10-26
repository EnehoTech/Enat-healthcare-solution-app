// Import the install service
import { installService } from "../services/install.service.js";

// A function to handle the install request
export const installController = async (req, res) => {
  // Call the install service to install the application
  const installMessage = await installService();
  // If the application is installed successfully, return success response.
  // Otherwise, return failure response
  if (installMessage.status === 200) {
    //if  successful, send a response back to the client
    const response = {
      message: installMessage,
    };
    res.status(200).json(response);
  } else {
    //if  failed, send a response back to the client
    const response = {
      message: installMessage,
    };
    res.status(500).json(response);
  }
};
