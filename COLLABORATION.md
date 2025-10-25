# 🤝 Team Collaboration Guide

## Quick Start for Team

### 📋 Division of Work

**Person 1 (You - Web App):**
- ✅ Manager dashboard
- ✅ Meeting interface
- ✅ Webcam recording
- ✅ API endpoints
- ✅ Integration ready!

**Person 2 (Teammate - Video Generation):**
- 🔄 Lyrics generation (OpenAI) - READY TO INTEGRATE
- 🔄 Voice synthesis (ElevenLabs)
- 🔄 Video generation (Replicate/ByteDance)

**Person 3 (Optional):**
- Already covered by web app

**Person 4 (Optional - Gmail/Slack):**
- Can integrate separately when ready

---

## 🚀 Integration Setup (10 minutes)

### For Person 2 (Video Generation Teammate):

#### Step 1: Get the Integration Files

```bash
# From the main project folder
cd teammate_integration
```

You'll find:
- `lyrics_api.py` - Flask API wrapper for your lyrics generator
- `requirements.txt` - Dependencies
- `README.md` - Full integration guide

#### Step 2: Set Up

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "OPENAI_API_KEY=your_key_here" > .env

# Run the server
python lyrics_api.py
```

Server will start at: `http://localhost:5000`

#### Step 3: Test It

```bash
curl -X POST http://localhost:5000/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "employeeName": "John Doe",
    "employeeInfo": "Sales rep, 3 years at company"
  }'
```

Should return lyrics!

---

### For Person 1 (You - Web App):

#### Your app is ready!

The Next.js app will automatically try to call `http://localhost:5000/generate-video` when someone clicks "Generate".

If the Flask API isn't running, it falls back to the mock video.

---

## 🔄 Development Workflow

### Parallel Development

**Both can work simultaneously:**

1. **Teammate runs Flask API** (Terminal 1):
   ```bash
   cd teammate_integration
   python lyrics_api.py
   ```

2. **You run Next.js** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Test together**:
   - Go to http://localhost:3000/manager
   - Enter employee info
   - Click generate
   - Your app calls Flask API
   - Flask generates lyrics
   - Video URL returns to your app
   - Meeting link works!

### Communication Points

**When integrating:**
- [ ] Teammate confirms Flask API is running
- [ ] You confirm Next.js can reach the API
- [ ] Test together with sample data
- [ ] Check browser console for errors
- [ ] Check Flask terminal for logs

---

## 🎯 Integration Checkpoints

### Phase 1: Lyrics Only (5 min)
- [ ] Flask API running
- [ ] Next.js calls API successfully
- [ ] Lyrics generated and logged
- [ ] Returns mock video URL

### Phase 2: Add Voice (20 min)
- [ ] Teammate adds ElevenLabs integration
- [ ] Returns audio URL
- [ ] Still returns mock video

### Phase 3: Add Video (30 min)
- [ ] Teammate adds Replicate integration
- [ ] Returns real video URL
- [ ] End-to-end flow works!

---

## 📡 API Contract (AGREED)

### Request from Next.js → Flask:

```json
POST http://localhost:5000/generate-video
Content-Type: application/json

{
  "employeeName": "John Doe",
  "employeeInfo": "Sales rep, 3 years at company, missed quota"
}
```

### Response from Flask → Next.js:

```json
{
  "videoUrl": "https://replicate.delivery/video123.mp4",
  "status": "ready",
  "lyrics": "... generated song lyrics ..."
}
```

**This contract is already implemented in both codebases!**

---

## 🐛 Troubleshooting Together

### "Connection refused" when generating?

**Person 2:** Is Flask running?
```bash
# Check if Flask is running
curl http://localhost:5000/health
```

**Person 1:** Check browser console (F12) for errors

### "CORS error" in browser?

**Person 2:** Make sure `flask-cors` is installed
```bash
pip install flask-cors
```

Already included in `requirements.txt`!

### Different computers/networks?

**Option 1 - Same network:**
```bash
# Person 2: Find your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Person 1: Update .env
VIDEO_SERVICE_URL=http://192.168.x.x:5000
```

**Option 2 - Use ngrok (easiest):**
```bash
# Person 2: Expose Flask API
ngrok http 5000

# Person 1: Update .env
VIDEO_SERVICE_URL=https://abc123.ngrok.io
```

---

## 📝 Testing Protocol

### Individual Testing

**Person 1 (Web App):**
```bash
npm run dev
# Test manager form
# Test meeting interface with mock video
```

**Person 2 (Flask API):**
```bash
python lyrics_api.py
# Test with curl
# Check lyrics generation
```

### Integration Testing (Together)

1. **Person 2 starts Flask:**
   ```bash
   python lyrics_api.py
   # Should see: "Running on http://127.0.0.1:5000"
   ```

2. **Person 1 starts Next.js:**
   ```bash
   npm run dev
   # Should see: "Ready on http://localhost:3000"
   ```

3. **Person 1 tests in browser:**
   - Go to http://localhost:3000/manager
   - Fill form
   - Click generate
   - Check browser console for API call

4. **Person 2 watches Flask logs:**
   - Should see POST request
   - Should see lyrics printed
   - Should see response sent

5. **Both check if it works:**
   - Meeting link generated?
   - Lyrics appear in Flask logs?
   - Any errors?

---

## 🎬 Demo Day Checklist

One hour before demo:

- [ ] **Person 2:** Flask API running and tested
- [ ] **Person 2:** ElevenLabs + Replicate integrated
- [ ] **Person 2:** Real video URLs returning
- [ ] **Person 1:** Next.js deployed or running
- [ ] **Person 1:** Background image looks good
- [ ] **Both:** Test full flow end-to-end
- [ ] **Both:** Have backup plan (mock video works)

---

## 💬 Quick Communication

### Status Updates

**Person 2 should share:**
- "Flask API running on port 5000 ✅"
- "Lyrics working ✅"
- "Adding ElevenLabs now 🔄"
- "Video generation working ✅"

**Person 1 should share:**
- "Next.js running on port 3000 ✅"
- "Can reach your API ✅"
- "Getting lyrics successfully ✅"
- "Video playing in meeting ✅"

---

## 🚀 You're Set Up for Success!

**Current status:**
- ✅ Web app 100% ready
- ✅ Flask API template ready
- ✅ Integration points defined
- ✅ Testing protocol clear

**Next 30 minutes:**
1. Person 2 runs Flask API
2. Test integration together
3. Confirm lyrics generation works

**Next 60 minutes:**
1. Person 2 adds ElevenLabs
2. Person 2 adds Replicate
3. Test with real videos

**Final 30 minutes:**
1. Deploy
2. Final testing
3. Demo prep

You've got this! 🎵🔥
