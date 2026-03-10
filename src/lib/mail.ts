import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactEmail(params: {
  name: string
  email: string
  message: string
}): Promise<void> {
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: params.email,
    subject: `[Portfolio] Message de ${params.name}`,
    text: `De : ${params.name} <${params.email}>\n\n${params.message}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #e79cfe;">Nouveau message depuis le portfolio</h2>
        <p><strong>De :</strong> ${params.name} &lt;${params.email}&gt;</p>
        <hr style="border-color: #341c4a;" />
        <p style="white-space: pre-wrap;">${params.message}</p>
      </div>
    `,
  })
}
