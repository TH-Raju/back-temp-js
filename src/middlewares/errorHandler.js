/** @format */

// import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import config from "../config/index.js";
import handleZodError from "../errors/ZodError.js";
import handleValidationError from "../errors/validationError.js";
import handleCastError from "../errors/CastError.js";
import handleDuplicateError from "../errors/DuplicateError.js";
import handleMulterError from "../errors/MulterError.js";
import { MulterError } from "multer";
import AppError from "../errors/AppError.js";

const globalErrorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err.statusCode);
  //setting default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof MulterError) {
    const simplifiedError = handleMulterError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;

// const errorHandler = (err, req, res, next) => {
//   console.error("err", err);

//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";

//   res.status(statusCode).json({ error: message });
// };

// export default errorHandler;
