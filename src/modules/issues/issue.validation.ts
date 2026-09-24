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

export const updateIssueStatusSchema = z.object({
  status: z.enum([
    "OPEN",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ]),
});