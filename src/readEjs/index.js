/** @format */

import express from "express";
import { User } from "../modules/User/user.model.js";

const route = express.Router();

route.get("/", (req, res) => {
  res.render("index");
});
route.get("/login", (req, res) => {
  res.render("login");
});
route.get("/create-message", (req, res) => {
  res.render("createmessage");
});
route.get("/dashboard", async (req, res) => {
  const user = await req.cookies.user;
  console.log(user);
  res.render("dashboard", { user: user });
});

export const ejsRouter = route;
