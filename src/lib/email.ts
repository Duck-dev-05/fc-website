import nodemailer from 'nodemailer';

// For development/testing: use Ethereal
export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Create a test account if not provided
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: 'FC ESCUELA <no-reply@fcescuela.com>',
    to,
    subject,
    html,
  });

  // Preview URL for development
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  return info;
} 