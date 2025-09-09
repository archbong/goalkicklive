// lib/validators/highlight-validator.ts
import { z, ZodError } from "zod";

// Validation schema for highlight query parameters
export const highlightQuerySchema = z.object({
  competition: z.string().optional(),
  competitions: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : undefined)),
  team: z.string().optional(),
  teams: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : undefined)),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DateFrom must be in YYYY-MM-DD format")
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DateTo must be in YYYY-MM-DD format")
    .optional(),
  search: z.string().optional(),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .positive("Page must be positive")
    .default(1),
  pageSize: z.coerce
    .number()
    .int("Page size must be an integer")
    .min(1, "Page size must be at least 1")
    .max(100, "Page size cannot exceed 100")
    .default(20),
  provider: z.enum(["all", "supersport", "scorebat"]).default("all"),
});

// Validation schema for highlight ID parameter
export const highlightIdSchema = z.object({
  id: z
    .string()
    .min(1, "Highlight ID is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid highlight ID format"),
});

// Validation schema for filter options
export const filterOptionsSchema = z.object({
  competition: z.string().optional(),
  competitions: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : undefined)),
  team: z.string().optional(),
  teams: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : undefined)),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DateFrom must be in YYYY-MM-DD format")
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DateTo must be in YYYY-MM-DD format")
    .optional(),
  search: z.string().optional(),
  provider: z.enum(["all", "supersport", "scorebat"]).default("all"),
});

// Type inference from schemas
export type HighlightQuery = z.infer<typeof highlightQuerySchema>;
export type HighlightIdParams = z.infer<typeof highlightIdSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;

// Validation functions
export function validateHighlightQuery(
  searchParams: URLSearchParams,
): HighlightQuery {
  const params = Object.fromEntries(searchParams);
  return highlightQuerySchema.parse(params);
}

export function validateHighlightId(params: unknown): HighlightIdParams {
  return highlightIdSchema.parse(params);
}

export function validateFilterOptions(
  searchParams: URLSearchParams,
): FilterOptions {
  const params = Object.fromEntries(searchParams);
  return filterOptionsSchema.parse(params);
}

// Helper function to validate date format
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Helper function to validate provider
export function isValidProvider(provider: string): boolean {
  return ["all", "supersport", "scorebat"].includes(provider);
}

// Error formatting function
export function formatValidationError(error: ZodError): {
  message: string;
  details: Array<{ field: string; message: string }>;
} {
  const details = error.errors.map(
    (err: { path: string[]; message: string }) => ({
      field: err.path.join("."),
      message: err.message,
    }),
  );

  return {
    message: "Validation failed",
    details,
  };
}

// Safe validation function that doesn't throw
export function safeValidateHighlightQuery(searchParams: URLSearchParams): {
  success: boolean;
  data?: HighlightQuery;
  error?: {
    message: string;
    details: Array<{ field: string; message: string }>;
  };
} {
  try {
    const data = validateHighlightQuery(searchParams);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: formatValidationError(error),
      };
    }
    return {
      success: false,
      error: {
        message: "Unknown validation error",
        details: [],
      },
    };
  }
}
