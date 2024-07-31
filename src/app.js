/** @format */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rootRouter from "./routes/index.js";
import path from "path";
import globalErrorHandler from "./middlewares/errorHandler.js";
import { ejsRouter } from "./readEjs/index.js";
import AppError from "./errors/AppError.js";
import sendResponse from "./shared/sendResponse.js";
import httpStatus from "http-status";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join("views", "../views"));

// Serve static files from the public directory
app.use(express.static(path.join("public", "../public")));

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

// Use root router for API routes
app.use("/api/v1", rootRouter);

//static
app.use("/ejs", ejsRouter);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Server is working! YaY!😀",
    status: 200,
    success: true,
  });
});

app.get("/test", (req, res) => {
  console.log(req.cookies.user);
  res.json({
    message: "Server is working! YaY!😀",
    status: 200,
    success: true,
  });
});

// Catch-all route
app.all("*", (req, res) => {
  sendResponse(res, httpStatus.NOT_FOUND, false, "route is not working");
});

// Use global error handler middleware
app.use(globalErrorHandler);
export default app;
