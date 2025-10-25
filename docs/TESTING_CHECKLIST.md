# Testing Checklist - Backend Implementation

## 🚀 Services Running

✅ **Flask Lyrics Service**
- Running on: http://localhost:5001
- Health check: http://localhost:5001/health
- Status: RUNNING

✅ **Next.js Application**
- Running on: http://localhost:3000
- Manager page: http://localhost:3000/manager
- Status: RUNNING

---

## ⚠️ Important Notes

### Missing Avatar Image
You need to add an avatar image before the video generation will work completely.

**Option 1: Add a local image**
```bash
# Place any JPG/PNG image with a person's face at:
/Users/seanchiu/Desktop/dumb_dump_songs/public/avatar.jpg
```

**Option 2: Use a URL**
Add to `.env.local`:
```bash
DEFAULT_AVATAR_URL=https://your-image-url.com/avatar.jpg
```

### API Keys Status
✅ OpenAI API Key: Configured in `.env.local`
✅ Replicate API Token: Configured in `.env.local`

---

## 🧪 Test Steps

### 1. Test Flask Service (Lyrics Generation)

**Open in browser:**
```
http://localhost:5001/health
```

**Expected response:**
```json
{"status": "ok"}
```

**Test lyrics generation:**
```bash
curl -X POST http://localhost:5001/generate-video \
  -H "Content-Type: application/json" \
  -d '{"employeeName": "John Doe", "employeeInfo": "Sales rep, 3 years at company"}'
```

**Expected:** JSON with lyrics

---

### 2. Test Manager Page

**Open in browser:**
```
http://localhost:3000/manager
```

**Fill in form:**
- Employee Name: `John Doe`
- Employee Info: `Sales rep, 3 years at company, missed quota`

**Click:** "Generate Termination Song"

**Expected:**
- You should see a success message
- You should get a meeting link like: `http://localhost:3000/meeting/abc123xyz`
- Copy this link

---

### 3. Test Meeting Page (Polling & Loading States)

**Open the meeting link in a NEW TAB**

**You should see:**
1. Loading screen with spinner
2. Title: "Generating Your Termination Song"
3. Status message updating through stages:
   - "Initializing your personalized termination song..."
   - "Writing your unique termination lyrics..."
   - "Creating musical arrangement..."
   - "Converting to AI voice..."
   - "Generating AI avatar video..."

4. Progress indicators (4 dots):
   - Blue pulsing dot = currently processing
   - Green dot = completed
   - Gray dot = not started yet

**Time estimate:** 2-4 minutes total

---

### 4. Monitor Server Logs

**Watch the Next.js console for detailed logs:**

You should see logs like:
```
[abc123] Starting background video generation
[abc123] Lyrics generated: [verse] John...
[Music Generation] Starting with lyrics: ...
[Music Generation] Complete. URL: https://...
[Voice Conversion] Starting with music URL: ...
[Voice Conversion] Complete. URL: https://...
[Avatar Generation] Starting with audio URL: ...
[Avatar Generation] Complete. URL: https://...
[abc123] Pipeline complete! Video URL: https://...
```

---

### 5. Test Video Playback (When Ready)

**After 2-4 minutes:**
- Loading screen should disappear
- Video should load automatically
- Video should autoplay
- You'll be prompted for webcam access
- Your webcam preview should appear in bottom-right corner
- Recording indicator should show "Recording" in top bar

**When video ends:**
- Recording should stop automatically
- Recording should download as `reaction-[id].webm`

---

## 🐛 Troubleshooting

### "Failed to call video service"
- Check Flask service is running: `http://localhost:5001/health`
- Check `.env.local` has `VIDEO_SERVICE_URL=http://localhost:5001`

### "Meeting keeps showing loading screen"
- Check Next.js console for errors
- Check Flask console for lyrics generation errors
- Verify API keys in `.env.local` are valid

### "Music generation failed"
- Check Replicate API token is valid
- Verify you have credits in your Replicate account
- Check server logs for detailed error message

### "Avatar generation failed"
- **Most likely cause:** Missing avatar image
- Add an image to `/public/avatar.jpg`
- OR set `DEFAULT_AVATAR_URL` in `.env.local`

### Video doesn't autoplay
- Click the play button manually
- Check browser console for errors
- Verify the video URL in the network tab

---

## 📊 Expected Processing Times

Based on implementation plan:

- **Lyrics Generation:** 5-10 seconds
- **Music Generation:** 30-60 seconds
- **Voice Conversion:** 15-30 seconds
- **Avatar Video:** 60-120 seconds
- **Total:** ~2-4 minutes

---

## 💰 Cost Per Test

Each full test generation costs approximately:
- OpenAI (lyrics): ~$0.01
- Replicate Music: $0.03
- Replicate Voice: ~$0.02-0.05
- Replicate Video: ~$0.05-0.10
- **Total: ~$0.11-0.19 per test**

---

## ✅ Success Criteria

- [ ] Flask service responds to health check
- [ ] Manager form submission returns meeting link
- [ ] Meeting page shows loading screen with progress
- [ ] Status updates poll every 3 seconds
- [ ] Lyrics generation completes (check logs)
- [ ] Music generation completes (check logs)
- [ ] Voice conversion completes (check logs)
- [ ] Avatar video generation completes (check logs)
- [ ] Final video loads and autoplays
- [ ] Webcam recording works
- [ ] Recording downloads on video end

---

## 🎯 Next Steps After Testing

1. **If successful:**
   - Customize prompts in `/prompts/` folder
   - Add multiple avatar options
   - Deploy to production

2. **If issues:**
   - Check server console logs
   - Verify API keys and credits
   - Ensure avatar image is present
   - Review error messages
   - Check `/docs/SETUP.md` for troubleshooting

---

## 📝 Test Log Template

Use this to track your test:

```
Test Date: ___________
Meeting ID: ___________

Stage 1 - Lyrics:
  Status: [ ] Success / [ ] Failed
  Time: _____ seconds
  Notes: _____________________

Stage 2 - Music:
  Status: [ ] Success / [ ] Failed
  Time: _____ seconds
  Output URL: _____________________

Stage 3 - Voice:
  Status: [ ] Success / [ ] Failed
  Time: _____ seconds
  Output URL: _____________________

Stage 4 - Video:
  Status: [ ] Success / [ ] Failed
  Time: _____ seconds
  Output URL: _____________________

Total Time: _____ minutes

Video Playback:
  [ ] Loaded successfully
  [ ] Autoplayed
  [ ] Audio synced

Webcam Recording:
  [ ] Started on play
  [ ] Stopped on end
  [ ] Downloaded successfully

Overall: [ ] PASS / [ ] FAIL
```

---

## 🔗 Quick Links

- **Manager Page:** http://localhost:3000/manager
- **Flask Health:** http://localhost:5001/health
- **Documentation:** `/docs/BACKEND_README.md`
- **Setup Guide:** `/docs/SETUP.md`
- **Implementation Plan:** `/docs/IMPLEMENTATION_PLAN.md`

---

**Ready to test!** Open http://localhost:3000/manager and create your first termination song! 🎵
