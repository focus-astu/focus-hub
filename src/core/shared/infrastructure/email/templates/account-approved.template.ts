import { emailLayout } from "./layout.template"

type AccountApprovedProps = {
  userName: string
  loginUrl: string
}

export const accountApprovedTemplate = ({
  userName,
  loginUrl,
}: AccountApprovedProps): string => {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
      Account Approved
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
      Great news, <strong>${userName}</strong>! Your Focus ASTU account has been approved by an administrator. You can now sign in and access the platform.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="${loginUrl}"
             target="_blank"
             style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1e40af,#2563eb);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
            Sign In Now
          </a>
        </td>
      </tr>
    </table>

    <div style="padding:16px;background-color:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
      <p style="margin:0;font-size:13px;color:#166534;line-height:1.5;">
        <strong>You're all set!</strong> Explore tasks, connect with your fellowship community, and make the most of your time at ASTU.
      </p>
    </div>

    <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">
      If you have any questions, reach out to your fellowship leaders or the platform admin.
    </p>
  `

  return emailLayout({ content })
}
