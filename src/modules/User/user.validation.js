import { z } from "zod";

// Schema for creating a user
const createUserZodSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
  }),
  phone: z.string().optional(),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Minimum password length is 6 characters"),
  role: z.enum(["user", "admin", "super_admin"]).optional().default("user"),
  photo: z.string().optional().default("/uploads/profile/default-user.jpg"),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  isOnline: z.string().optional().default("0"),
  isDelete: z.string().optional().default("no"),
  isBlock: z.string().optional().default("no"),
});

// Schema for updating a user
const updateUserZodSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Minimum password length is 6 characters")
    .optional(),
  role: z.enum(["user", "admin", "super_admin"]).optional(),
  photo: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  isOnline: z.string().optional(),
  isDelete: z.string().optional(),
  isBlock: z.string().optional(),
});

export const userValidation = {
  createUser: createUserZodSchema,
  updateUser: updateUserZodSchema,
};
