// Shared types for contact-form enquiries. Kept separate from enquiries-server.ts
// so client components can import them without pulling in "server-only".

export type EnquiryStatus = "new" | "read" | "archived";

export interface Enquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  role: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

export const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "read", "archived"];

export function isEnquiryStatus(v: unknown): v is EnquiryStatus {
  return typeof v === "string" && (ENQUIRY_STATUSES as string[]).includes(v);
}

/** Field limits, enforced on the server and mirrored as maxLength in the form. */
export const ENQUIRY_LIMITS = {
  name: 120,
  company: 160,
  email: 200,
  role: 120,
  message: 4000,
} as const;

export interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  role: string;
  message: string;
}

/**
 * Validates a submission. Returns a field-keyed error map; empty means valid.
 * Deliberately permissive on everything except name/email/message — a prospect
 * shouldn't be blocked from making contact by a fussy form.
 */
export function validateEnquiry(input: EnquiryInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.name.trim()) {
    errors.name = "Please tell us your name.";
  } else if (input.name.length > ENQUIRY_LIMITS.name) {
    errors.name = "That name is too long.";
  }

  const email = input.email.trim();
  if (!email) {
    errors.email = "We need an email address to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > ENQUIRY_LIMITS.email) {
    errors.email = "That doesn't look like a valid email address.";
  }

  if (!input.message.trim()) {
    errors.message = "Please add a few lines about your company.";
  } else if (input.message.length > ENQUIRY_LIMITS.message) {
    errors.message = "That message is too long — please shorten it a little.";
  }

  if (input.company.length > ENQUIRY_LIMITS.company) errors.company = "That company name is too long.";
  if (input.role.length > ENQUIRY_LIMITS.role) errors.role = "That role is too long.";

  return errors;
}
