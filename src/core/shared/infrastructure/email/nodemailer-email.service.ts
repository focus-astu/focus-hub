import nodemailer, { type Transporter } from "nodemailer"
import type { EmailService } from "@/core/shared/application/ports/email-service.port"

let _transporter: Transporter | null = null

const getTransporter = (): Transporter => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return _transporter
}

export const createNodemailerEmailService = (): EmailService => ({
  send: async ({ to, subject, html }) => {
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@focusastu.com"

    await getTransporter().sendMail({
      from,
      to,
      subject,
      html,
    })
  },
})
