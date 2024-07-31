/** @format */

import catchAsync from "../shared/catchAsync.js";

const validateRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      files: req.files,
      file: req.file,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;
