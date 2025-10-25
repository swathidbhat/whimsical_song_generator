import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; margin: -30px -30px 20px -30px; }
    .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Important Meeting Request</h1>
    </div>
    <div class="urgent">
      <strong>⚠️ Time-Sensitive</strong> - Your immediate attention is required
    </div>
    <p>Hi ${name},</p>
    <p>You've been invited to an <strong>important one-on-one discussion</strong> regarding your role and future at the company.</p>
    <h3>📅 Performance Review Meeting</h3>
    <p><strong>With:</strong> HR Department & Management<br>
    <strong>Duration:</strong> ~15-20 minutes<br>
    <strong>Type:</strong> Video Conference</p>
    <center>
      <a href="${meetingLink}" class="button">🎥 Join Meeting Now</a>
    </center>
    <p style="font-size: 12px; color: #666; margin-top: 30px;">
      If button doesn't work, copy this link: ${meetingLink}
    </p>
  </div>
</body>
</html>`

    const data = await resend.emails.send({
      from: 'HR Department <onboarding@resend.dev>',
      to: [employeeEmail],
      subject: '⚠️ Urgent: Performance Review Meeting - Join Now',
      html: emailHtml,
    })

    console.log('✉️ Email sent successfully:', data)

    return NextResponse.json({
      success: true,
      messageId: data.id,
      message: `Meeting invite sent to ${employeeEmail}`,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
