import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Create transporter with explicit SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be your App Password
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
  });

  try {
    // Verify connection configuration
    await transporter.verify();
    
    // Send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 