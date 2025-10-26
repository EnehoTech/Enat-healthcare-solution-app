function handleError(error, config = {}) {
  // Default configuration for known error codes and their respective messages
  const defaultConfig = {
    knownErrorCodes: [400, 401, 403, 404, 409, 500],
    messages: {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "404 Not Found",
      409: "Conflict",
      500: "Internal Server Error",
      defaultMessage: "An error occurred.",
      noResponse: "No response received from the server.",
      unexpectedError: "An unexpected error occurred.",
    },
  };

  const mergedConfig = { ...defaultConfig, ...config };

  if (error?.response) {
    
    // The request was made and the server responded with a status code
    const status = error.response.status;
    if (mergedConfig.knownErrorCodes.includes(status)) {
      return (
        error?.response?.data?.message ||
        mergedConfig.messages[status] ||
        mergedConfig.messages.defaultMessage
      );
    }
  } else if (error?.request) {
    // The request was made but no response was received
    return mergedConfig.messages.noResponse;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error?.message || mergedConfig.messages.unexpectedError;
  }
}

export default handleError;
