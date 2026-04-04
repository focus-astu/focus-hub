export type SendEmailOptions = {
  to: string
  subject: string
  html: string
}

export type EmailService = {
  send: (options: SendEmailOptions) => Promise<void>
}
