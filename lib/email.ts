import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Pages by Nana <updates@pagesbynana.com>';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Send Double Opt-In confirmation email
 */
export async function sendConfirmationEmail({
  to,
  token,
  bookTitle,
}: {
  to: string;
  token: string;
  bookTitle?: string;
}) {
  const baseUrl = getBaseUrl();
  const confirmUrl = `${baseUrl}/subscribe/confirm?token=${token}`;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`;

  const subject = bookTitle
    ? `Confirm your subscription to ${bookTitle} | Pages by Nana`
    : `Confirm your subscription | Pages by Nana`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #FBF8F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Literata', Georgia, serif; color: #2A2420; line-height: 1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(42, 36, 32, 0.04);">
    <tr>
      <td style="padding: 36px 36px 24px; border-bottom: 2px solid #8C2F39;">
        <span style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #2A2420; letter-spacing: -0.02em;">
          Pages by Nana
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 36px;">
        <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-top: 0; margin-bottom: 16px; color: #2A2420;">
          Confirm your reading subscription
        </h1>
        <p style="font-size: 16px; color: #5C524A; margin-bottom: 24px;">
          ${
            bookTitle
              ? `You requested to receive updates whenever a new chapter of <strong>${bookTitle}</strong> is published.`
              : `Thank you for subscribing to new fiction chapter notifications from Nana Kwame Dickson.`
          }
        </p>
        <p style="font-size: 15px; color: #5C524A; margin-bottom: 32px;">
          Please confirm your email address by clicking the button below. We respect your reading quietude: no promotional spam, no third-party trackers, ever.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}" style="display: inline-block; background-color: #8C2F39; color: #FFFFFF; font-size: 15px; font-weight: 500; text-decoration: none; padding: 13px 28px; border-radius: 5px; box-shadow: 0 2px 4px rgba(140, 47, 57, 0.2);">
            Confirm Subscription
          </a>
        </div>
        <p style="font-size: 13px; color: #8F8378; margin-top: 32px; border-top: 1px solid #E8DFD5; padding-top: 20px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmUrl}" style="color: #8C2F39; word-break: break-all;">${confirmUrl}</a>
        </p>
        <p style="font-size: 12px; color: #8F8378; margin-top: 16px;">
          If you did not sign up for this list, you can ignore this email or <a href="${unsubscribeUrl}" style="color: #8F8378; text-decoration: underline;">cancel immediately</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (!resend) {
    console.log(`\n========================================`);
    console.log(`[SIMULATED EMAIL DISPATCH - Resend API key not set]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Confirm Link: ${confirmUrl}`);
    console.log(`========================================\n`);
    return { success: true, simulated: true, confirmUrl };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send confirmation email via Resend:', err);
    return { success: false, error: err };
  }
}

/**
 * Send New Chapter Release notification
 */
export async function sendNewChapterEmail({
  to,
  token,
  bookTitle,
  chapterNumber,
  chapterTitle,
  excerpt,
  chapterSlug,
  bookSlug,
  readingTimeMinutes,
}: {
  to: string;
  token: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  excerpt?: string;
  chapterSlug: string;
  bookSlug: string;
  readingTimeMinutes: number;
}) {
  const baseUrl = getBaseUrl();
  const readUrl = `${baseUrl}/books/${bookSlug}/${chapterSlug}`;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`;
  const subject = `New Chapter: "${chapterTitle}" · ${bookTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #FBF8F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Literata', Georgia, serif; color: #2A2420; line-height: 1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8DFD5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(42, 36, 32, 0.04);">
    <tr>
      <td style="padding: 32px 36px 20px; border-bottom: 2px solid #8C2F39;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #2A2420;">
          Pages by Nana
        </span>
        <span style="font-size: 13px; color: #8F8378; margin-left: 12px;">
          · New Chapter
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 36px;">
        <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #8C2F39; font-weight: 600; margin-bottom: 8px;">
          ${bookTitle} · Chapter ${chapterNumber}
        </div>
        <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: normal; margin-top: 0; margin-bottom: 12px; color: #2A2420; line-height: 1.3;">
          ${chapterTitle}
        </h1>
        <div style="font-size: 13px; color: #8F8378; margin-bottom: 24px;">
          Approx. ${readingTimeMinutes} min read · Available free online
        </div>

        ${
          excerpt
            ? `<div style="font-style: italic; color: #5C524A; border-left: 3px solid #8C2F39; padding-left: 16px; margin: 20px 0 28px; line-height: 1.6;">
                "${excerpt}"
              </div>`
            : ''
        }

        <div style="text-align: center; margin: 32px 0;">
          <a href="${readUrl}" style="display: inline-block; background-color: #8C2F39; color: #FFFFFF; font-size: 15px; font-weight: 500; text-decoration: none; padding: 13px 28px; border-radius: 5px; box-shadow: 0 2px 4px rgba(140, 47, 57, 0.2);">
            Read Chapter Now
          </a>
        </div>

        <p style="font-size: 13px; color: #8F8378; margin-top: 36px; border-top: 1px solid #E8DFD5; padding-top: 20px; text-align: center;">
          You received this because you follow <em>${bookTitle}</em> on Pages by Nana.<br>
          <a href="${unsubscribeUrl}" style="color: #8F8378; text-decoration: underline;">Unsubscribe from chapter alerts</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (!resend) {
    console.log(`\n========================================`);
    console.log(`[SIMULATED NEW CHAPTER BROADCAST]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Read Link: ${readUrl}`);
    console.log(`========================================\n`);
    return { success: true, simulated: true, readUrl };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send chapter notification email:', err);
    return { success: false, error: err };
  }
}
