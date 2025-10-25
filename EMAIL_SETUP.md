# 📧 Email Feature Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account (100 emails/day free)
3. Verify your email
4. Go to API Keys section
5. Create new API key
6. Copy the key (starts with e_)

### Step 2: Add to Environment Variables

Create .env.local file in project root:

`nv
RESEND_API_KEY=re_your_actual_key_here
`

### Step 3: Test It!

1. Start dev server: 
pm run dev
2. Go to http://localhost:3000/manager
3. Generate a meeting
4. Enter your email address
5. Click "Send Meeting Invite"
6. Check your inbox!

---

## 📧 What the Email Looks Like

The email is designed to look like an **urgent, official HR meeting invite**:

### Subject
`
⚠️ Urgent: Performance Review Meeting - Join Now
`

### Email Content
- Professional gradient header
- Urgent time-sensitive banner (yellow)
- "Performance Review Meeting" badge
- Official-looking details
- Big "Join Meeting Now" button
- Career growth messaging
- Company footer

### Tone
- Sounds professional and urgent
- Uses corporate jargon
- Looks like real HR communication
- Employee won't suspect it's a joke!

---

## 🎨 Email Features

✅ **Responsive HTML** - Looks good on desktop & mobile  
✅ **Professional Design** - Gradient header, badges, buttons  
✅ **Urgent Messaging** - Time-sensitive warnings  
✅ **Career-focused** - Talks about "performance" and "growth"  
✅ **Plain text fallback** - Works in all email clients  
✅ **Auto sender** - Comes from "HR Department"  

---

## 🔧 Customization

Want to change the email content? Edit:

**File**: pp/api/send-invite/route.ts

You can customize:
- Subject line
- Email HTML/styling
- Sender name
- Button text
- Warning messages

---

## 🐛 Troubleshooting

### "Failed to send email"
- Check your RESEND_API_KEY in .env.local
- Make sure you've verified your email with Resend
- Check Resend dashboard for errors

### Email not arriving?
- Check spam folder
- Verify email address is correct
- Free Resend accounts can only send to verified emails (add in Resend dashboard)

### Want to use your own domain?
1. Add domain in Resend dashboard
2. Add DNS records they provide
3. Change rom: field in oute.ts to your domain

---

## 📊 Free Tier Limits

**Resend Free Tier**:
- 100 emails per day
- 1 domain
- Full API access
- Perfect for hackathons!

---

## 🎯 Alternative: SendGrid

If you prefer SendGrid instead:

1. Install: 
pm install @sendgrid/mail
2. Get API key from SendGrid
3. Update oute.ts to use SendGrid client
4. Add SENDGRID_API_KEY to .env.local

---

## ✅ Ready to Test

1. Add RESEND_API_KEY to .env.local
2. Restart dev server
3. Generate meeting
4. Send test email to yourself
5. Check your inbox
6. Click the meeting link
7. Watch your reaction being recorded! 🎥

---

**Email feature is ready to fool your employees! 😈**
