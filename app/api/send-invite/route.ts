import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { employeeName, employeeEmail, meetingLink } = await request.json()

    if (!employeeEmail || !meetingLink) {
      return NextResponse.json(
        { error: 'Employee email and meeting link are required' },
        { status: 400 }
      )
    }

    const name = employeeName || 'there'
    
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; margin: -30px -30px 20px -30px; border-radius: 8px 8px 0 0; }
    .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .badge { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">🎯 Important Meeting Request</h1>
    </div>
    <div class="urgent">
      <strong>⚠️ Time-Sensitive</strong> - Your immediate attention is required
    </div>
    <p>Hi ${name},</p>
    <p>You've been invited to an <strong>important one-on-one discussion</strong> regarding your role and future at the company.</p>
    <div class="badge">
      <h3 style="margin-top:0;">📅 Performance Review Meeting</h3>
      <p style="margin:5px 0;"><strong>With:</strong> HR Department & Management</p>
      <p style="margin:5px 0;"><strong>Duration:</strong> ~15-20 minutes</p>
      <p style="margin:5px 0;"><strong>Type:</strong> Video Conference (Click link to join)</p>
      <p style="margin:5px 0;"><strong>Note:</strong> Please ensure your camera and microphone are working</p>
    </div>
    <p>This meeting has been scheduled to discuss some <strong>key points</strong> about your contributions and the team's direction moving forward.</p>
    <p><strong>Important:</strong> Please join promptly. The session will begin as soon as you enter.</p>
    <center>
      <a href="${meetingLink}" class="button" style="color: white;">🎥 Join Meeting Now</a>
    </center>
    <p style="margin-top: 30px; font-size: 13px; color: #666; font-style: italic;">
      💡 Pro tip: Make sure you're in a quiet space with good lighting. This is an important conversation for your career growth.
    </p>
    <p style="font-size: 12px; color: #999; margin-top: 20px;">
      If the button doesn't work, copy and paste this link:<br>
      <span style="color: #667eea;">${meetingLink}</span>
    </p>
    <div class="footer">
      <p>This is an automated meeting invitation from the HR Department</p>
      <p>© ${new Date().getFullYear()} Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`

    // Send email through Gmail
    const info = await transporter.sendMail({
      from: `"HR Department" <${process.env.GMAIL_USER}>`,
      to: employeeEmail,
      subject: '⚠️ Urgent: Performance Review Meeting - Join Now',
      html: emailHtml,
      text: `Hi ${name},\n\nYou've been invited to an important one-on-one discussion regarding your role and future at the company.\n\nPERFORMANCE REVIEW MEETING\nWith: HR Department & Management\nDuration: ~15-20 minutes\nType: Video Conference\n\nJoin here: ${meetingLink}\n\nPlease ensure your camera and microphone are working before joining.`,
    })

    console.log('✉️ Email sent successfully via Gmail:', info.messageId)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: `Meeting invite sent to ${employeeEmail} from your Gmail`,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
