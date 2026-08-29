import nodemailer from 'nodemailer'

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  if (!emailUser || !emailPass) {
    throw new Error('Missing SMTP credentials: set EMAIL_USER and EMAIL_PASS in backend/.env')
  }

  console.log('SMTP credentials loaded:', {
    emailUser: Boolean(emailUser),
    emailPass: Boolean(emailPass)
  })

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  })
}

export const sendOtpEmail = async ({ email, otp }) => {
  const transporter = getTransporter()
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking OTP Verification',
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #b76e03;">Your Booking Verification Code</h2>
        <p>Enter the following OTP in the app to complete registration. The code expires in 10 minutes.</p>
        <p style="font-size: 1.5rem; font-weight: 700; letter-spacing: 0.12rem;">${otp}</p>
        <p>If you did not request this, please ignore this message.</p>
      </div>
    `
  }

  try {
    return await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    throw new Error('Unable to send OTP email. Check EMAIL_USER / EMAIL_PASS and Gmail app password settings.')
  }
}
