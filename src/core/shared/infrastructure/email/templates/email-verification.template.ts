import { emailLayout } from "./layout.template"

type EmailVerificationProps = {
  userName: string
  verificationUrl: string
}

export const emailVerificationTemplate = ({
  userName,
  verificationUrl,
}: EmailVerificationProps): string => {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
      Verify Your Email
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Hi <strong>${userName}</strong>, welcome to Focus ASTU! Please verify your email address to continue setting up your account.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="${verificationUrl}"
             target="_blank"
             style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1e40af,#2563eb);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:13px;color:#64748b;line-height:1.5;">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-size:13px;word-break:break-all;">
      <a href="${verificationUrl}" style="color:#2563eb;text-decoration:underline;">${verificationUrl}</a>
    </p>

    <div style="padding:16px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
        <strong style="color:#475569;">What happens next?</strong><br />
        After verification, an admin will review your account. You'll receive another email once you're approved to sign in.
      </p>
    </div>

    <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">
      If you didn't create an account on Focus ASTU, you can safely ignore this email.
    </p>
  `

  return emailLayout({ content })
}
