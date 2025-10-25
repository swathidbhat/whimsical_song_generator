# 📧 Gmail Email Setup Guide

## ✅ Send Emails from YOUR Gmail Account!

This will send emails directly from your Gmail, so they **won't go to spam** and look 100% legitimate.

---

## Quick Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication on Gmail

**You need 2FA enabled to create an App Password**

1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get Started" and follow the steps
4. **Important**: Complete this before moving to Step 2!

---

### Step 2: Create Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App Passwords
   
2. You might need to sign in again

3. Under "Select app", choose **"Mail"**

4. Under "Select device", choose **"Other (Custom name)"**
   - Type: "Dumb Dump Songs" or "Hackathon App"

5. Click **"Generate"**

6. **COPY THE 16-CHARACTER PASSWORD** (looks like: bcd efgh ijkl mnop)
   - **Save this!** You won't see it again

---

### Step 3: Add to Your Project

Create .env.local file in your project root:

`nv
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
`

**Example**:
`nv
GMAIL_USER=john.manager@company.com
GMAIL_APP_PASSWORD=xyzw abcd efgh ijkl
`

**Important Notes**:
- ✅ Use your **real Gmail address** for GMAIL_USER
- ✅ Use the **16-character App Password** (not your regular password!)
- ✅ You can include or remove spaces in the app password (both work)
- ❌ DO NOT use your regular Gmail password (won't work!)

---

### Step 4: Restart Your Server

`ash
# Stop the server (Ctrl+C)
npm run dev
`

---

### Step 5: Test It!

1. Go to http://localhost:3000/manager
2. Generate a meeting
3. Enter an email address (yours for testing)
4. Click "Send Meeting Invite"
5. Check your inbox - **it should arrive in main inbox, not spam!**

---

## 📧 What the Recipient Sees

### From Field
`
HR Department <your.email@gmail.com>
`

### Subject
`
⚠️ Urgent: Performance Review Meeting - Join Now
`

### Email Content
- Professional gradient purple header
- Urgent yellow warning banner
- Performance review meeting details
- Big "Join Meeting Now" button
- Career growth messaging
- Company footer

**Looks 100% legitimate because it IS from a real Gmail account!**

---

## 🎯 Why This Works Better

### With Gmail:
- ✅ **Comes from real email** - No spam flags
- ✅ **Shows your name** - More trustworthy
- ✅ **Deliverability** - Gmail to Gmail is reliable
- ✅ **No verification needed** - Just works
- ✅ **Free** - No API costs

### Old Method (Resend):
- ❌ Often goes to spam
- ❌ Generic sender domain
- ❌ Requires domain verification
- ❌ Limited free emails

---

## 🐛 Troubleshooting

### "Invalid login" or "Username and Password not accepted"

**Problem**: Using regular Gmail password instead of App Password

**Solution**: 
1. Make sure 2FA is enabled
2. Create new App Password (see Step 2)
3. Use the 16-character App Password in .env.local
4. Restart server

---

### "Missing credentials"

**Problem**: .env.local file not created or wrong location

**Solution**:
1. Create .env.local in **project root** (same folder as package.json)
2. Add both GMAIL_USER and GMAIL_APP_PASSWORD
3. Restart server

---

### Email still not sending

**Check these**:
1. ✅ 2FA is enabled on your Gmail
2. ✅ App Password was created correctly
3. ✅ .env.local file exists in project root
4. ✅ Email address in GMAIL_USER is correct
5. ✅ Server was restarted after adding env vars
6. ✅ Check terminal for error messages

---

### "Less secure app access"

**Note**: You DON'T need to enable "less secure app access"! 

Use **App Passwords** instead (requires 2FA). This is the modern, secure way.

---

## 🔒 Security Notes

### Is This Safe?

✅ **YES** - App Passwords are designed for this!

- App Passwords are **specific to one app**
- They **don't have full account access**
- You can **revoke them anytime**
- They're **recommended by Google** for third-party apps

### Best Practices

1. **Don't share** your App Password
2. **Don't commit** .env.local to git (already in .gitignore)
3. **Revoke unused** App Passwords from your Google Account
4. **Use different** App Passwords for different projects

---

## 📊 Sending Limits

**Gmail Free Account**:
- 500 emails per day
- More than enough for hackathon demos!

**Google Workspace**:
- 2,000 emails per day
- If you have a company Gmail

---

## 🎭 Making It More Convincing

Want to make it even more professional?

### Option 1: Use Your Company Email
If you have a Google Workspace email:
`nv
GMAIL_USER=hr@yourcompany.com
GMAIL_APP_PASSWORD=your_app_password
`

### Option 2: Create a Fake HR Email
Create a new Gmail account:
`
hr.department@gmail.com
human.resources.dept@gmail.com
company.hr.team@gmail.com
`

Then use that account's credentials!

---

## ✅ Quick Reference

**What you need**:
1. Gmail account with 2FA enabled
2. Gmail App Password (16 characters)
3. Both added to .env.local

**Environment Variables**:
`nv
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
`

**Get App Password**: https://myaccount.google.com/apppasswords

**Enable 2FA**: https://myaccount.google.com/security

---

## 🚀 Ready to Go!

Once setup:
1. ✅ Emails come from your Gmail
2. ✅ Won't go to spam
3. ✅ Looks completely legitimate
4. ✅ Perfect for fooling employees! 😈

---

**Your Gmail is now weaponized for delivering termination songs!** 🎵📧
