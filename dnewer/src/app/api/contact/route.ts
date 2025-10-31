// app/api/contact/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ---- ENV (Resend) ----
    const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim();
    const FROM = (process.env.CONTACT_FROM || "").trim(); // e.g. "Dnewer <hello@yourdomain.com>" (must be verified in Resend)
    const TO = (process.env.CONTACT_TO || "Dnewer@hotmail.com").trim();

    const missing: string[] = [];
    if (!RESEND_API_KEY) missing.push("RESEND_API_KEY");
    if (!FROM) missing.push("CONTACT_FROM");
    if (missing.length) {
      return NextResponse.json(
        {
          error: `Missing env: ${missing.join(
            ", "
          )}. Make sure your sender (CONTACT_FROM) is a verified domain/address in Resend.`,
        },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Contact — Dnewer</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f7fb; font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7fb; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(15,23,42,0.06);">
            <!-- Brand bar -->
            <tr>
              <td style="background:#F97316; height:4px; line-height:4px; font-size:0;">&nbsp;</td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:20px 24px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="font-weight:700; font-size:18px; letter-spacing:0.2px; color:#0f172a;">
                      Dnewer
                    </td>
                    <td align="right" valign="middle">
                      <span style="display:inline-block; background:rgba(249,115,22,0.12); color:#F97316; border:1px solid rgba(249,115,22,0.25); padding:6px 10px; border-radius:999px; font-size:12px; font-weight:600;">
                        New Contact
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding:0 24px 12px;">
                <div style="font-size:20px; font-weight:700; color:#0f172a; line-height:1.35;">
                  You’ve got a new message
                </div>
                <div style="margin-top:6px; font-size:14px; color:#475569;">
                  Sent via your website contact form.
                </div>
              </td>
            </tr>

            <!-- Details card -->
            <tr>
              <td style="padding:8px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
                  <tr>
                    <td style="padding:16px 18px; background:#ffffff;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width:120px; font-size:12px; color:#64748b; padding:6px 0;">Name</td>
                          <td style="font-size:14px; color:#0f172a; padding:6px 0; font-weight:600;">${escapeHtml(name)}</td>
                        </tr>
                        <tr>
                          <td style="width:120px; font-size:12px; color:#64748b; padding:6px 0;">Email</td>
                          <td style="font-size:14px; color:#0f172a; padding:6px 0;">
                            <a href="mailto:${encodeURIComponent(email)}" style="color:#F97316; text-decoration:none; font-weight:600;">${escapeHtml(email)}</a>
                          </td>
                        </tr>
                        ${phone
                          ? `<tr>
                               <td style="width:120px; font-size:12px; color:#64748b; padding:6px 0;">Phone</td>
                               <td style="font-size:14px; color:#0f172a; padding:6px 0; font-weight:600;">${escapeHtml(phone)}</td>
                             </tr>`
                          : ""
                        }
                        <tr>
                          <td colspan="2" style="padding-top:14px; font-size:12px; color:#64748b;">Message</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top:8px;">
                            <div style="white-space:pre-wrap; background:#0b1220; color:#e2e8f0; border-radius:10px; padding:14px 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:13px; line-height:1.5; border:1px solid #0f172a;">
                              ${escapeHtml(message)}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Quick action -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:16px;">
                        <tr>
                          <td>
                            <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
                              "Re: Dnewer — Contact from " + (name || "visitor")
                            )}"
                               style="display:inline-block; background:#F97316; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px; padding:10px 14px; border-radius:10px;">
                              Reply to ${escapeHtml(name)}
                            </a>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:10px 24px 22px;">
                <div style="text-align:center; font-size:12px; color:#94a3b8;">
                  © ${new Date().getFullYear()} Dnewer • This notification was sent automatically.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

    const { data, error } = await resend.emails.send({
      from: FROM,     // e.g. "Dnewer <hello@yourdomain.com>"
      to: [TO],
      subject: `Dnewer — Contact Request from ${name}`,
      html,
      replyTo: email, // lets you reply straight to the sender
    });

    if (error) {
      // Common Resend errors include invalid sender (unverified domain) or blocked content
      return NextResponse.json(
        { error: error.message || "Email failed via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err: any) {
    console.error("Contact API error (Resend):", err);
    return NextResponse.json(
      { error: err?.message || "Email failed." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
