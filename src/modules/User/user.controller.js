/** @format */

import config from "../../config/index.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { createToken } from "../../utils/createToken.js";
import OTP from "../OTP/otp.model.js";
import { otp } from "../OTP/otp.service.js";
import { User } from "./user.model.js";
import { userService } from "./user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";
dotenv.config();

const addUser = catchAsync(async (req, res) => {
  let otpPurpose = "email-verification";
  const userData = { ...req.body };

  if (!userData.fullName) {
    return sendResponse(res, 400, false, "Name is required");
  }
  if (!userData.email) {
    return sendResponse(res, 400, false, "Email is required");
  }

  if (!userData.password) {
    return sendResponse(res, 400, false, "Password is required");
  }

  if (userData.password.length < 6) {
    return sendResponse(
      res,
      400,
      false,
      "Password must be at least 6 characters long"
    );
  }
  const userExist = await User.findOne({ email: userData.email });
  // console.log(userExist);
  if (userExist) {
    return sendResponse(res, 406, false, "Email already exist");
  }
  const existingOTP = await otp.checkOTPByEmail(userData.email);
  // console.log("From user controller", userData.email);
  let message = "otp-sent";
  let otpData;

  if (existingOTP) {
    message = "otp-exist";
  } else {
    otpData = await otp.sendOTP(
      userData.fullName,
      userData.email,
      "email",
      otpPurpose
    );
    if (otpData) {
      message = "otp-send";
    }
  }

  const signupToken = jwt.sign({ ...req.body }, config.jwt_access_token, {
    expiresIn: "1h",
  });
  const resData = {
    otpPurpose,
    signupToken,
  };
  sendResponse(res, 200, true, "Check email for OTP", resData);
});

const verifyUser = catchAsync(async (req, res) => {
  const otpPurpose = "email-verification";
  const otpData = req.body;
  // console.log(otpData);
  const verify = await otp.verifiedUser(otpData.otp);

  // const userToken = req.headers.usertoken;
  const verifyToken = jwt.verify(otpData.userToken, config.jwt_access_token);
  if (!verifyToken) {
    return sendResponse(res, 401, false, "Invalid token", {});
  }
  // console.log(req.headers.usertoken);
  if (!otpData.userToken) {
    return sendResponse(res, 401, false, "Missing user token", {});
  }
  if (verify.length > 0) {
    const userData = jwt.decode(otpData.userToken);
    const userInfo = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };

    const userExist = await User.findOne({ email: userData.email });
    if (userExist) {
      return sendResponse(res, 406, false, "User already exist");
    }

    const user = await userService.addUser(userInfo);

    // console.log(userInfo);
    if (user) {
      const userJwtData = {
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        id: user._id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      };

      const accessToken = createToken(
        userJwtData,
        config.jwt_access_token,
        "7d"
      );
      const refreshToken = createToken(
        userJwtData,
        config.refresh_secret,
        "365d"
      );

      const tempUser = { user, accessToken, refreshToken };

      delete tempUser.password;

      return sendResponse(
        res,
        200,
        true,
        "Account Created Successfully",
        tempUser
      );
    } else {
      return sendResponse(res, 203, false, "Something went wrong", {});
    }
  } else {
    return sendResponse(res, 401, false, "Invalid OTP", {});
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      const userJwtData = {
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        id: user._id,
      };

      const accessToken = createToken(
        userJwtData,
        config.jwt_access_token,
        "7d"
      );
      const refreshToken = createToken(
        userJwtData,
        config.refresh_secret,
        "365d"
      );

      const isProduction =
        config.node_env === "production" || config.node_env === "development";

      res.cookie("tokenExp", "1", {
        sameSite: "strict",
        secure: isProduction,
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction,
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction,
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction,
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });

      //optional
      res.cookie("user", user, {
        httpOnly: true,
        sameSite: "strict",
        secure: isProduction,
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      });

      const userData = {
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        _id: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      sendResponse(res, 200, true, "Successfully Logged in", userData);
    } else {
      sendResponse(res, 406, false, "Incorrect Password", {});
    }
  } else {
    sendResponse(
      res,
      401,
      false,
      "Employee with this Account does not exist",
      {}
    );
  }
});

const logout = catchAsync(async (req, res) => {
  // Clear the cookies containing tokens
  res.clearCookie("token");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("tokenExp");
  res.clearCookie("user");

  sendResponse(res, 200, true, "Logged out successfully", {});
});

const getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

  const users = await userService.getAllUsers(parseInt(page), parseInt(limit));

  if (users) {
    sendResponse(res, 200, true, "All Users list", users);
  } else {
    sendResponse(res, 404, false, "Something went wrong", {});
  }
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getSingleUser(id);

  if (user) {
    sendResponse(res, 200, true, "User Found", user);
  } else {
    sendResponse(res, 404, false, "No user found", {});
  }
});

const updateUser = catchAsync(async (req, res) => {
  const userData = { ...req.body };
  // console.log(userData);
  // Check if the request contains a file (e.g., photo)

  if (req.files) {
    if (req.files.photo) {
      const photoFileName = req.files.photo[0].filename;
      userData.photo = `/uploads/profile/${photoFileName}`;
    }
    if (req.files.certificate) {
      const certificateFileName = req.files.certificate[0].filename;
      userData.certificate = `/uploads/profile/${certificateFileName}`;
    }
    if (req.files.cv) {
      const cvFileName = req.files.cv[0].filename;
      userData.cv = `/uploads/profile/${cvFileName}`;
    }
    if (req.files.textSample) {
      const textSampleFileName = req.files.textSample[0].filename;
      userData.textSample = `/uploads/profile/${textSampleFileName}`;
    }
  }
  // Check if current_password exists in userData
  if (userData.current_password) {
    // If current_password exists, update profile with password verification
    const user = await User.findOne({ email: userData.email });
    if (user) {
      const auth = await bcrypt.compare(
        userData.current_password,
        user.password
      );
      if (auth) {
        // console.log("user Data", userData);
        const salt = await bcrypt.genSalt();
        userData.new_password = await bcrypt.hash(userData.new_password, salt);
        const updateData = { ...userData, password: userData.new_password };
        // console.log("updateData", updateData);

        const updatedUser = await userService.updateUser(
          req.params.id,
          updateData
        );
        if (updatedUser) {
          sendResponse(
            res,
            200,
            true,
            "Profile updated successfully",
            updatedUser
          );
        } else {
          sendResponse(res, 404, false, "Something went wrong", {});
        }
      } else {
        sendResponse(res, 406, false, "Incorrect Password", {});
      }
    } else {
      sendResponse(res, 401, false, "User with this email does not exist", {});
    }
  } else {
    // If current_password doesn't exist, update profile without password verification
    const updatedUser = await userService.updateUser(req.params.id, userData);
    if (updatedUser) {
      sendResponse(res, 200, true, "Profile updates successfully", updatedUser);
    } else {
      sendResponse(res, 404, false, "Something went wrong", {});
    }
  }
});

const forgetPassword = catchAsync(async (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  let otpPurpose = "forget-password";
  const { email } = req.body;
  const user = await User.findOne({ email }).select("-password");

  const tokenData = { email: user.email, _id: user._id };

  const verifyToken = jwt.sign({ tokenData }, config.jwt_access_token, {
    expiresIn: "1h",
  });

  const existingOTP = await otp.checkOTPByEmail(email);
  if (user === null || !user) {
    return sendResponse(
      res,
      401,
      false,
      "User with this email does not exist",
      {}
    );
  }

  let otpData;

  const resData = {
    otpPurpose,
    verifyToken,
  };

  if (existingOTP) {
    return sendResponse(res, 200, true, "otp-exist", resData);
  } else {
    otpData = await otp.sendOTP(user.fullName, email, "email", otpPurpose);
    if (otpData) {
      return sendResponse(res, 200, true, "otp-send", resData);
    }
  }
  if (user) {
    return sendResponse(res, 200, true, "otp send", resData);
  }
});

const verifyForgetOtp = catchAsync(async (req, res) => {
  const verifyData = { ...req.body };
  // console.log(verifyData);
  const otp = verifyData.otp.toString();
  const verifyToken = verifyData.verifyToken;
  const verify = await OTP.findOne({ otp });

  if (!verifyToken) {
    return sendResponse(res, 401, false, "Missing Verify Token", {});
  }

  if (!verify) {
    return sendResponse(res, 401, false, "Invalid OTP", {});
  }

  if (verify && verifyToken) {
    await OTP.deleteOne(verify._id);
    return sendResponse(res, 200, true, "Success", verifyToken);
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const resetData = { ...req.body };
  let password = resetData.password;
  const verifyToken = resetData.verifyToken;
  let verifiedUser = jwt.decode(verifyToken)._doc;

  if (verifiedUser === undefined) {
    verifiedUser = jwt.decode(verifyToken);
  }

  const userId = verifiedUser.tokenData._id || verifiedUser.id;
  const existUser = await User.findOne({ _id: userId });

  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);

  if (verifiedUser.id) {
    const matchPass = await bcrypt.compare(
      resetData.currentPassword,
      existUser.password
    );
    if (!matchPass) {
      return sendResponse(res, 401, false, "Incorrect Password", {});
    }
    // console.log(matchPass);
  }

  const user = await userService.updateUser(userId, {
    password,
  });
  if (user) {
    sendResponse(res, 200, true, "Password update successfully", user);
  } else {
    sendResponse(res, 404, false, "Something went wrong", {});
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.deleteUser(id);

  if (user) {
    sendResponse(res, 200, true, "User deleted successfully", user);
  } else {
    sendResponse(res, 404, false, "Something went wrong", {});
  }
});
const usersStatistics = catchAsync(async (req, res) => {
  const result = await userService.getUsersStatistics(req.query);
  sendResponse(res, 200, true, "Users Statistics find successfully", result);
});

export default verifyUser;
export const userController = {
  addUser,
  login,
  logout,
  getAllUsers,
  getSingleUser,
  updateUser,
  forgetPassword,
  verifyForgetOtp,
  resetPassword,
  deleteUser,
  verifyUser,
  usersStatistics,
};
