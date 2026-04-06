import { emailLayout } from "./layout.template"

type PasswordResetProps = {
  userName: string
  resetUrl: string
}

export const passwordResetTemplate = ({
  userName,
  resetUrl,
}: PasswordResetProps): string => {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
      Reset Your Password
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Hi <strong>${userName}</strong>, we received a request to reset the password for your Focus ASTU account. Click the button below to choose a new password.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="${resetUrl}"
             target="_blank"
             style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1e40af,#2563eb);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:13px;color:#64748b;line-height:1.5;">
      If the button above doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-size:13px;word-break:break-all;">
      <a href="${resetUrl}" style="color:#2563eb;text-decoration:underline;">${resetUrl}</a>
    </p>

    <div style="padding:16px;background-color:#fef3c7;border-radius:8px;border:1px solid #fde68a;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
        <strong style="color:#78350f;">Link expires soon</strong><br />
        This password reset link is valid for a limited time. If it expires, you can request a new one from the login page.
      </p>
    </div>

    <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
  `

  return emailLayout({ content })
}
