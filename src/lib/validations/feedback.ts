import { z } from "zod";

export const feedbackSchema = z.object({
  category: z.enum(["General", "Bug", "Feature", "Accuracy"]),
  rating: z.number().int().min(1).max(5),
  comments: z
    .string()
    .trim()
    .min(5, "Please provide at least 5 characters in your feedback.")
    .max(2000, "Feedback must be under 2000 characters."),
  userEmail: z.string().trim().email().optional().or(z.literal("")),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
