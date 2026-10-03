"use server";

import { Resend } from "resend";
import { feedbackSchema, FeedbackInput } from "@/lib/validations/feedback";
import { createClient } from "@/lib/supabase/server";

export interface FeedbackActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackActionResult> {
  const validation = feedbackSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid feedback data",
    };
  }

  const { category, rating, comments, userEmail: providedEmail } = validation.data;

  // Retrieve authenticated user context if available
  let authenticatedEmail: string | null = null;
  let authenticatedName: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      authenticatedEmail = user.email || null;
      authenticatedName =
        (user.user_metadata?.full_name as string) ||
        (user.user_metadata?.name as string) ||
        null;
    }
  } catch (err) {
    // Non-critical if auth check fails
    console.warn("[Feedback] Could not resolve authenticated user:", err);
  }

  // Prevent spoofing: authenticated session identity takes precedence.
  // Unauthenticated users can optionally provide an email.
  const userEmail = authenticatedEmail || (providedEmail ? providedEmail.trim() : "");
  const userName =
    authenticatedName ||
    (userEmail.includes("@") ? userEmail.split("@")[0] : "Household User");
  const isAuthenticated = Boolean(authenticatedEmail);

  // Check Resend API configuration
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[Feedback] RESEND_API_KEY is missing. If running on Vercel, ensure RESEND_API_KEY is configured in Vercel Production Environment Variables."
    );
    return {
      success: false,
      error: "Email delivery service is temporarily unavailable. Please try again later.",
    };
  }

  const resend = new Resend(apiKey);
  const recipient = (process.env.FEEDBACK_RECEIVER_EMAIL || "").trim() || "sagardatkhile.official@gmail.com";

  // Use verified sender address belonging to the verified domain carboncoach.work.gd
  const verifiedSender = "Carbon Coach Feedback <feedback@carboncoach.work.gd>";
  const rawSender = (process.env.FEEDBACK_SENDER_EMAIL || "").trim();
  const sender = rawSender.toLowerCase().includes("@carboncoach.work.gd")
    ? rawSender
    : verifiedSender;

  const currentTime = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
    Bug: { bg: "#FEF3F2", text: "#B42318" },
    Feature: { bg: "#EFF8FF", text: "#175CD3" },
    Accuracy: { bg: "#FDF2FA", text: "#C11574" },
    General: { bg: "#F3F8F3", text: "#075E45" },
  };

  const badge = categoryBadgeColors[category] || categoryBadgeColors.General;

  // Plaintext body matching requested specification
  const textContent = `New Carbon Coach AI Feedback

Sender Name: ${userName}
Sender Email: ${userEmail || "Not provided / Anonymous"}
Auth Status: ${isAuthenticated ? "Authenticated User" : "Guest / Anonymous"}

Category: ${category}
Rating: ${stars} (${rating}/5)

Feedback:
${comments}

Timestamp: ${currentTime}
Source: Carbon Coach AI Dashboard`;

  // HTML version with strict escaping and clean responsive styling
  const safeComments = escapeHtml(comments);
  const safeUserName = escapeHtml(userName);
  const safeEmail = escapeHtml(userEmail);
  const safeCategory = escapeHtml(category);

  const emailDisplayHtml = userEmail
    ? `<a href="mailto:${safeEmail}" style="color: #075E45; text-decoration: none; font-weight: 600;">${safeEmail}</a>`
    : `<span style="color: #667085; font-style: italic;">Not provided / Anonymous</span>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>New Carbon Coach AI Feedback</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFBF8; margin: 0; padding: 32px 16px; color: #111827;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border: 1px solid #E3E7E3; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 24px 32px; background-color: #075E45; color: #ffffff;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; font-weight: 600; display: block; margin-bottom: 4px;">Carbon Coach AI Dashboard</span>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">New Carbon Coach AI Feedback</h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              <!-- User Info Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 14px;">
                <tr>
                  <td style="padding-bottom: 8px; width: 110px; color: #667085; font-weight: 600;">User:</td>
                  <td style="padding-bottom: 8px; color: #111827; font-weight: 600;">${safeUserName}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; color: #667085; font-weight: 600;">Email:</td>
                  <td style="padding-bottom: 8px;">${emailDisplayHtml}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 8px; color: #667085; font-weight: 600;">Account:</td>
                  <td style="padding-bottom: 8px; color: #344054;">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; background-color: ${isAuthenticated ? "#EAF5EE" : "#F2F4F7"}; color: ${isAuthenticated ? "#075E45" : "#475467"};">
                      ${isAuthenticated ? "Verified Account" : "Guest"}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Feedback Section -->
              <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #667085; margin: 0 0 8px 0;">Feedback:</p>
              <div style="background-color: #F8FAF9; border: 1px solid #E3E7E3; border-left: 4px solid #075E45; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #111827; margin: 0 0 24px 0; white-space: pre-wrap; word-break: break-word;">${safeComments}</div>

              <!-- Metadata Badges -->
              <table style="margin-bottom: 24px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 12px;"><span style="font-size: 12px; font-weight: 600; color: #667085;">Category:</span></td>
                  <td><span style="font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 9999px; background-color: ${badge.bg}; color: ${badge.text};">${safeCategory}</span></td>
                </tr>
                <tr>
                  <td style="padding-right: 12px; padding-top: 8px;"><span style="font-size: 12px; font-weight: 600; color: #667085;">Rating:</span></td>
                  <td style="padding-top: 8px;"><span style="font-size: 14px; color: #F59E0B; letter-spacing: 1px;">${stars}</span> <span style="font-size: 12px; color: #667085;">(${rating}/5)</span></td>
                </tr>
              </table>

              <!-- Divider & Metadata -->
              <hr style="border: none; border-top: 1px solid #E3E7E3; margin: 0 0 16px 0;" />

              <table width="100%" style="font-size: 11px; color: #9CA3AF;">
                <tr>
                  <td><strong>Timestamp:</strong> ${currentTime}</td>
                  <td align="right"><strong>Source:</strong> Carbon Coach AI Dashboard</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 14px 32px; background-color: #F3F8F3; border-top: 1px solid #E3E7E3; text-align: center; font-size: 12px; color: #667085;">
              ${
                userEmail
                  ? `Reply directly to this email to respond to <a href="mailto:${safeEmail}" style="color: #075E45; font-weight: 600;">${safeEmail}</a>.`
                  : `This feedback was submitted anonymously.`
              }
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const { error: sendError } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: userEmail && userEmail.includes("@") ? userEmail : undefined,
      subject: "New Carbon Coach AI Feedback",
      text: textContent,
      html: htmlContent,
    });

    if (sendError) {
      console.error("[Feedback] Resend error:", sendError);
      return {
        success: false,
        error: sendError.message || "Failed to deliver feedback email via Resend.",
      };
    }

    return {
      success: true,
      message: "Feedback submitted successfully! Delivered to the development team.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error while sending feedback email";
    console.error("[Feedback] Exception during email send:", err);
    return {
      success: false,
      error: message,
    };
  }
}
