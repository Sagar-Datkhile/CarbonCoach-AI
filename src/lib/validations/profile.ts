import { z } from "zod";

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const householdUpdateSchema = z.object({
  householdName: z.string().min(2, "Household name must be at least 2 characters"),
  homeType: z.enum(["Owned", "Rented", "Shared", "Other"]),
  occupantsCount: z.coerce.number().int().min(1, "Must have at least 1 occupant").max(20, "Maximum 20 occupants"),
  region: z.string().min(2, "Region is required"),
  budgetTier: z.enum(["Zero-Cost", "Low", "Moderate", "High"]),
  heatingType: z.string().optional(),
  coolingType: z.string().optional(),
  preferredCurrency: z.string().min(3).max(4).default("USD"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type HouseholdUpdateInput = z.infer<typeof householdUpdateSchema>;
