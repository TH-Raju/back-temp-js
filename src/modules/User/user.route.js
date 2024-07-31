/** @format */

import express from "express";
import { userController } from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";
import { USER_ROLE } from "../../helpers/userRole.js";
import fileUpload from "../../middlewares/fileUpload.js";
import { userValidation } from "./user.validation.js";
import validateRequestZod from "../../middlewares/validateRequestZod.js";

const upload = fileUpload("./src/uploads/profile/");
const userRouter = express.Router();

userRouter
  .get("/", userController.getAllUsers)
  .get("/:id", userController.getSingleUser)
  .get("/user/statistics", userController.usersStatistics)
  .get("/user/logout/true", userController.logout)
  .put(
    "/:id",
    upload.fields([{ name: "photo", maxCount: 1 }]),
    validateRequestZod(userValidation.updateUser),
    userController.updateUser
  )
  .post("/forget-password", userController.forgetPassword)
  .delete(
    "/:id",
    auth.verifyRole(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    userController.deleteUser
  )
  .patch("/reset-password", userController.resetPassword)
  .patch("/otp/forget-password", userController.verifyForgetOtp)
  .post(
    "/signup",
    validateRequestZod(userValidation.createUser),
    userController.addUser
  )
  .post("/verify-otp", userController.verifyUser)
  .post("/login", userController.login);

export default userRouter;
