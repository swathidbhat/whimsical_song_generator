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

    // Imaginative email that looks like a normal urgent meeting invite
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-center; color: white; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .meeting-badge { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .meeting-badge h3 { margin: 0 0 10px 0; color: #333; font-size: 18px; }
    .meeting-badge p { margin: 5px 0; color: #666; font-size: 14px; }
    .join-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
    .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 12px; color: #999; }
    .urgent-banner { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
    .urgent-banner strong { color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🎯 Important Meeting Request</h1></div>
    <div class="content">
      <div class="urgent-banner"><strong>⚠️ Time-Sensitive</strong> - Your immediate attention is required</div>
      <p>Hi ``,</p>
      <p>You've been invited to an <strong>important one-on-one discussion</strong> regarding your role and future at the company.</p>
      <div class="meeting-badge">
        <h3>📅 Performance Review Meeting</h3>
        <p><strong>With:</strong> HR Department & Management</p>
        <p><strong>Duration:</strong> ~15-20 minutes</p>
        <p><strong>Type:</strong> Video Conference (Click link to join)</p>
        <p><strong>Note:</strong> Please ensure your camera and microphone are working</p>
      </div>
      <p>This meeting has been scheduled to discuss some <strong>key points</strong> about your contributions and the team's direction moving forward.</p>
      <p><strong>Important:</strong> Please join promptly. The session will begin as soon as you enter.</p>
      <center><a href="``" class="join-button">🎥 Join Meeting Now</a></center>
      <p style="margin-top: 30px; font-size: 13px; color: #666;"><em>💡 Pro tip: Make sure you're in a quiet space with good lighting. This is an important conversation for your career growth.</em></p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link:<br><a href="``" style="color: #667eea;">``</a></p>
    </div>
    <div class="footer">
      <p>This is an automated meeting invitation from the HR Department</p>
      <p>© `` Company. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 10px; color: #ccc;">Please do not reply to this email. For technical issues, contact IT support.</p>
    </div>
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
      message: `Meeting invite sent to ```,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
