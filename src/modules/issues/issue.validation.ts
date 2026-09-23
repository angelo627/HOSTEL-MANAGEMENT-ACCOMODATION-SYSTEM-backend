import { z } from "zod";

export const createIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Issue title is required."),

  description: z
    .string()
    .trim()
    .min(1, "Issue description is required."),
});