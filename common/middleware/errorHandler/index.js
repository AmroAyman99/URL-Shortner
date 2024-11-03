import { StatusCodes } from 'http-status-codes';

/**
 * To handle any thrown error.
 * @param  {object} error - Error object.
 * @param  {object} res - HTTP response argument to the middleware function.
 * @return {object} - HTTP response
 */
const ErrorHandler = () => (error, req, res, next) => {
  const { status, message } = error;
  
  if (status === StatusCodes.UNAUTHORIZED) {
    // Handle unauthorized access
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access',
      data: null,
    });
  }
  return res.status(status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message || 'Unexpected Error',
    data: null,
  });
};

export default ErrorHandler;