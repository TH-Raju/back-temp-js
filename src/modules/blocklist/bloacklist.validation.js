/** @format */

import { z } from "zod";

const addBlockZodSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "userId is required" }),
    profileId: z.string({ required_error: "profileId is required" }),
  }),
});

export const blockListValidation = {
  addBlockZodSchema,
};
