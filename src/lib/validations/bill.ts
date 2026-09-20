import { z } from "zod";

export const billExtractionSchema = z.object({
  provider_name: z.string().min(1, "Provider name is required").default("Electricity Provider"),
  consumer_number: z.string().nullable().optional(),
  bill_number: z.string().nullable().optional(),
  billing_period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
  billing_period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD"),
  billing_days: z.coerce.number().int().min(1).default(30),
  energy_consumed_kwh: z.coerce.number().min(0, "Energy consumed must be non-negative"),
  bill_amount: z.coerce.number().min(0, "Bill amount must be non-negative"),
  tariff_rate: z.coerce.number().min(0).nullable().optional(),
  currency: z.string().min(1).default("USD"),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be YYYY-MM-DD").nullable().optional(),
});

export const confirmedBillSchema = z.object({
  provider_name: z.string().min(2, "Provider name is required"),
  consumer_number: z.string().optional().nullable(),
  bill_number: z.string().optional().nullable(),
  billing_period_start: z.string().min(1, "Billing period start date is required"),
  billing_period_end: z.string().min(1, "Billing period end date is required"),
  energy_consumed_kwh: z.coerce.number().min(0.1, "Energy consumed must be greater than 0"),
  bill_amount: z.coerce.number().min(0, "Bill amount must be positive"),
  tariff_rate: z.coerce.number().optional().nullable(),
  currency: z.string().min(2).default("USD"),
  due_date: z.string().optional().nullable(),
  file_path: z.string().optional().nullable(),
});

export type BillExtractionData = z.infer<typeof billExtractionSchema>;
export type ConfirmedBillData = z.infer<typeof confirmedBillSchema>;
