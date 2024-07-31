import { z } from "zod";

const validateRequestZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Validation errors",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

export default validateRequestZod;
